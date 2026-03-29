# Bug Report — Round 2

**Project:** Medak Emergency Relay Backend
**Date:** 2026-03-29
**Auditor:** Eva (Round 2 — reviewing Round 1 fixes + finding next-layer issues)
**Branch:** `fix/round1-p0-backend`
**Test suite:** 230/230 passing, 6 warnings (same `RuntimeWarning: coroutine 'run_user_agent' was never awaited`)

---

## Round 1 Fix Audit

Round 1 addressed 4 P0 bugs. Here's what actually shipped:

| R1 Bug | Status | Notes |
|--------|--------|-------|
| BUG-001 (SnapshotStore race) | ⚠️ Partially fixed | See R2-BUG-001 — retry loop is dead code |
| BUG-002 (ghost agent tasks) | ✅ Fixed | `finally` block now cancels both tasks properly |
| BUG-003 (fire-and-forget orchestrator) | ⚠️ Partially fixed | See R2-BUG-002 — callback only logs, doesn't notify user |
| BUG-004 (blocking Twilio call) | ⚠️ Partially fixed | See R2-BUG-003 — `TwilioClient()` constructor still blocks |

---

## P0 — Will crash or embarrass team during demo

### R2-BUG-001: SnapshotStore.update() retry loop is dead code — race condition still exists

- **File:** `backend/snapshot.py:132-155`
- **Issue:** The Round 1 "fix" added a `for attempt in range(10)` loop, but the function **unconditionally returns on the first iteration**. There is no condition that would ever trigger a retry — no `WATCH`, no version comparison, no `continue` statement. The `raise RuntimeError(...)` on line 155 is unreachable dead code.
  ```python
  for attempt in range(10):
      data = await self._redis.get(key)
      ...
      await self._redis.set(key, new_data, ex=SNAPSHOT_TTL)
      return snapshot  # ← ALWAYS returns here on iteration 0
  raise RuntimeError(...)  # ← unreachable
  ```
- **Impact:** The original TOCTOU race condition from R1-BUG-001 is **completely unfixed**. Two concurrent `update()` calls will still overwrite each other. During the demo, if the User Agent sets `conscious=True` while the Dispatch Agent sets `call_status=CONNECTED` at the same time, one write silently disappears.
- **Demo risk:** High — both agents update the same snapshot concurrently during every session.
- **Fix:** Either implement actual Redis WATCH/MULTI/EXEC, or at minimum add a CAS check on `snapshot_version`:
  ```python
  for attempt in range(10):
      data = await self._redis.get(key)
      if data is None:
          raise KeyError(...)
      snapshot = EmergencySnapshot.model_validate_json(data)
      old_version = snapshot.snapshot_version
      updater(snapshot)
      snapshot.confidence_score = compute_confidence(snapshot)
      snapshot.snapshot_version += 1
      new_data = snapshot.model_dump_json()
      # Only write if version hasn't changed
      current = await self._redis.get(key)
      if current is not None:
          current_snap = EmergencySnapshot.model_validate_json(current)
          if current_snap.snapshot_version != old_version:
              continue  # retry — someone else wrote
      await self._redis.set(key, new_data, ex=SNAPSHOT_TTL)
      return snapshot
  raise RuntimeError(...)
  ```

### R2-BUG-002: `_orch_done` callback only logs — user still sees zombie session on crash

- **File:** `backend/main.py:162-167`
- **Issue:** The Round 1 fix added a `done_callback` to the orchestrator task, but it only calls `logger.error()`. It does NOT:
  1. Transition the session to `FAILED` phase
  2. Broadcast a `FAILED` message to the WebSocket
  3. Store the task reference for cleanup
  
  The callback is a sync function, so it can't `await store.update()` or `await registry.broadcast()`.
- **Impact:** If the orchestrator crashes (e.g., Redis timeout, unexpected exception), the user's phone still shows "TRIAGE" or "LIVE_CALL" with a spinner forever. No error message, no retry. In an emergency, the person waits for help that will never come.
- **Demo risk:** High if Gemini API or Redis hiccups during demo.
- **Fix:** Use `asyncio.get_event_loop().create_task()` inside the callback to schedule async cleanup:
  ```python
  def _orch_done(t: asyncio.Task, sid=session_id):
      if t.cancelled():
          logger.warning("Orchestrator cancelled for %s", sid)
      elif exc := t.exception():
          logger.error("Orchestrator failed for %s: %s", sid, exc)
          # Schedule async cleanup
          loop = asyncio.get_event_loop()
          loop.create_task(_handle_orch_failure(sid))
  
  async def _handle_orch_failure(sid):
      try:
          await store.update(sid, lambda s: setattr(s, "phase", SessionPhase.FAILED))
      except Exception:
          pass
      await registry.broadcast(sid, {"type": "FAILED", "message": "Internal error"})
  ```

---

## P1 — Significant issues that affect demo quality

### R2-BUG-003: `TwilioClient()` constructor still blocks the event loop

- **File:** `backend/dispatch_agent.py:172`
- **Issue:** Round 1 wrapped `twilio_client.calls.create()` in `asyncio.to_thread()` (line 175), but the `TwilioClient(...)` constructor on line 172 is also a synchronous call that validates credentials over HTTP. It still runs on the main event loop.
- **Impact:** ~200-500ms event loop block on every dispatch agent startup. All other sessions freeze during this time.
- **Fix:** Move the entire block into `to_thread`:
  ```python
  call = await asyncio.to_thread(_make_twilio_call, settings, session_id)
  ```

### R2-BUG-004: `or` vs `is None` defaulting bug — still unfixed from Round 1

- **File:** `backend/orchestrator.py:45-47`
- **Issue:** This was identified as R1-BUG-005 (P1) and is completely unfixed:
  ```python
  self.triage_timeout = triage_timeout or settings.triage_timeout_seconds
  self.confidence_threshold = confidence_threshold or settings.confidence_threshold
  self.max_reconnects = max_reconnects or settings.reconnect_max_attempts
  ```
  If you pass `triage_timeout=0`, `confidence_threshold=0.0`, or `max_reconnects=0`, Python `or` treats these as falsy and uses the settings default instead.
- **Impact:** Cannot set any of these parameters to 0 explicitly. `confidence_threshold=0.0` (always dispatch immediately) silently becomes `0.85`. Tests that pass these values get wrong behavior.
- **Demo risk:** Low for demo (nobody passes 0), but bad engineering.
- **Fix:**
  ```python
  self.triage_timeout = triage_timeout if triage_timeout is not None else settings.triage_timeout_seconds
  ```

### R2-BUG-005: Demo agents not wrapped in error handler — still unfixed from Round 1

- **File:** `backend/orchestrator.py:239, 270`
- **Issue:** This was identified as R1-BUG-006 (P1) and is completely unfixed. Demo agents use bare `asyncio.create_task()`:
  ```python
  # Line 239 (demo user agent):
  self._user_agent_task = asyncio.create_task(
      run_demo_user_agent(...)
  )
  # Line 270 (demo dispatch agent):
  self._dispatch_agent_task = asyncio.create_task(
      run_demo_dispatch_agent(...)
  )
  ```
  Meanwhile, real agents use `self._launch_agent()` (lines 252, 280) which wraps in try/except with logging.
- **Impact:** If a demo agent throws any exception (e.g., `KeyError` from an expired session, Redis timeout), it crashes silently — no log, no error message, no status update. During the demo, the session just freezes.
- **Demo risk:** **HIGH** — this is the code path that runs during the demo! `demo_mode=True` means these unprotected paths are the ones judges see.
- **Fix:**
  ```python
  self._user_agent_task = self._launch_agent(
      "Demo User Agent",
      run_demo_user_agent(self.session_id, self.store, self.broadcast, scenario=settings.demo_scenario),
  )
  ```

### R2-BUG-006: WebSocket handler doesn't catch JSON parse errors — still unfixed from Round 1

- **File:** `backend/main.py:202`
- **Issue:** R1-BUG-007 (P1) is completely unfixed. `json.loads(raw)` on line 202 will raise `json.JSONDecodeError` if a client sends malformed JSON. This propagates up, exits the `while True` loop, and disconnects the WebSocket.
- **Impact:** A single malformed message kills the user's WebSocket connection mid-emergency. The frontend loses all real-time updates.
- **Demo risk:** Medium — unlikely during scripted demo, but if the frontend has any edge case (e.g., empty string, partial message), the connection drops.
- **Fix:**
  ```python
  try:
      msg = json.loads(raw)
  except json.JSONDecodeError:
      await ws.send_text(json.dumps({"type": "error", "message": "Invalid JSON"}))
      continue
  ```

### R2-BUG-007: No duplicate SOS protection — still unfixed from Round 1

- **File:** `backend/main.py:123-170`
- **Issue:** R1-BUG-010 (rate limiting) and R1-BUG-011 (double-SOS) are completely unfixed. Every `/api/sos` call creates a new session with a new orchestrator, new agents, and potentially a new Twilio call — regardless of whether an active session already exists for this device.
- **Impact:** A panicking user tapping SOS repeatedly (or a buggy frontend retry loop) creates N parallel sessions, N orchestrators, N Gemini sessions, and potentially N calls to 112. Emergency services get confused by multiple calls for the same emergency.
- **Demo risk:** **HIGH** — if the frontend has any retry logic on network error, or if the judge taps SOS twice quickly, you get duplicate sessions and double the Gemini API cost.
- **Fix:** Check for active session before creating new one:
  ```python
  # Before creating new session:
  existing = await _find_active_session_for_device(store, req.device_id)
  if existing:
      return SOSResponse(session_id=existing, status="TRIAGE")
  ```

### R2-BUG-008: `user_id` accepted but never stored — still unfixed from Round 1

- **File:** `backend/main.py:37` (SOSRequest has `user_id: str`), `backend/snapshot.py` (EmergencySnapshot has no `user_id` field)
- **Issue:** R1-BUG-009 (P1) is completely unfixed. The `user_id` field exists in the request model but is silently discarded — never stored in the snapshot.
- **Impact:** Cannot associate sessions with users. Cannot implement any user-based deduplication or access control. The API accepts a required field and throws it away.
- **Demo risk:** Low for demo, but judges reviewing the API contract will see a `user_id` field that does nothing.
- **Fix:** Add `user_id: str | None = None` to `EmergencySnapshot` and store it in `trigger_sos`.

### R2-BUG-009: Orchestrator task reference not stored — no way to cancel or track

- **File:** `backend/main.py:159`
- **Issue:** The task is created and a callback is added, but the task reference is never stored anywhere:
  ```python
  task = asyncio.create_task(orch.run())
  task.add_done_callback(_orch_done)
  # task goes out of scope — only GC prevents it from being collected
  ```
  There is no `app.state.orchestrator_tasks` dict. No way to:
  1. Cancel a running orchestrator
  2. Check if an orchestrator is still alive
  3. Prevent duplicate orchestrators for the same session
  4. Gracefully shut down all orchestrators on server stop
- **Impact:** Zombie orchestrators accumulate. The `/api/demo/reset` endpoint clears Redis but doesn't cancel running orchestrators — they keep polling a now-empty Redis, throwing `KeyError` every second.
- **Demo risk:** Medium — after a demo reset, old orchestrators keep running until they crash.
- **Fix:** Store in a session→task dict:
  ```python
  app.state.orchestrator_tasks = {}
  app.state.orchestrator_tasks[session_id] = task
  ```

---

## P2 — Improvements needed before production

### R2-BUG-010: Twilio webhook signatures never verified — still unfixed from Round 1

- **File:** `backend/main.py:254-268` (twilio_status), `backend/main.py:238-250` (twilio_twiml)
- **Issue:** R1-BUG-008 (P1) is unfixed. Anyone can POST fake Twilio status updates to manipulate session state. An attacker could:
  - POST `CallStatus=completed` to prematurely resolve sessions
  - POST `CallStatus=failed` to force sessions into DROPPED state
- **Demo risk:** Low for demo (local network), but a real security hole.

### R2-BUG-011: TwiML stream URL always uses `wss://` regardless of backend scheme

- **File:** `backend/main.py:243-244`
- **Issue:** R1-BUG-012 (P1) is unfixed:
  ```python
  base = settings.backend_base_url.removeprefix("https://").removeprefix("http://")
  stream_url = f"wss://{base}/api/session/{session_id}/twilio/stream"
  ```
  If `backend_base_url` is `http://localhost:8080` (the default), this generates `wss://localhost:8080/...` which requires TLS. Without a reverse proxy, the WebSocket connection fails.
- **Impact:** Twilio stream doesn't work in development without TLS termination.
- **Fix:** Derive `ws://` or `wss://` from the URL scheme.

### R2-BUG-012: `/api/demo/reset` accessible with no auth and can wipe all sessions

- **File:** `backend/main.py:355-366`
- **Issue:** R1-BUG-013 (P1) is unfixed. The endpoint deletes ALL session data from Redis with no authentication. It also accesses `store._redis` (private member) directly.
- **Demo risk:** Low — but if someone discovers this endpoint during the demo...

### R2-BUG-013: `demo_dispatch.py` module-level `sessions` dict never cleaned up

- **File:** `backend/demo_dispatch.py:29`
- **Issue:** R1-BUG-019 (P2) is unfixed. The module-level `sessions: dict = {}` grows without bound. Only `/dispatch/reset` clears it.
- **Impact:** Memory leak during long demo runs.

### R2-BUG-014: Twilio stream WebSocket also doesn't catch JSON parse errors

- **File:** `backend/main.py:320`
- **Issue:** Same as R2-BUG-006 but for the Twilio Media Streams WebSocket handler:
  ```python
  async for raw in ws.iter_text():
      msg = json.loads(raw)  # ← can throw JSONDecodeError
  ```
  If Twilio sends a malformed message, the entire bridge crashes.
- **Impact:** Audio bridge disconnects. The 112 operator hears silence.

### R2-BUG-015: CORS allows all origins — still unfixed from Round 1

- **File:** `backend/main.py:100-104`
- **Issue:** R1-BUG-016 (P2) unfixed. `allow_origins=["*"]` lets any website trigger SOS calls.
- **Demo risk:** Negligible for hackathon.

---

## Regressions from Round 1 Fixes

### R2-REG-001: New `emergency_type` mapping has silent failure path

- **File:** `backend/main.py:139-146`
- **Issue:** The new `TYPE_MAP` mapping added in Round 1 has a `pass` on `ValueError`:
  ```python
  try:
      snapshot.emergency_type = EmergencyType(mapped)
  except ValueError:
      pass  # unknown type, leave as None
  ```
  If the frontend sends an unsupported emergency type (e.g., `"EARTHQUAKE"`), it silently becomes `None`. The confidence score loses 0.25 points that the user expected to have. No error returned to the client.
- **Impact:** User selects emergency type, but it's silently discarded. Confidence is lower than expected, potentially delaying dispatch.

### R2-REG-002: `compute_confidence()` called before `store.save()` but after partial snapshot setup

- **File:** `backend/main.py:148`
- **Issue:** The Round 1 fix changed `snapshot.confidence_score = 0.20` to `compute_confidence(snapshot)`. This is correct, but now the confidence depends on whether `emergency_type` was successfully mapped (lines 139-146). If the mapping fails silently (see R2-REG-001), confidence is 0.20 instead of the expected 0.45. The client gets `status: "TRIAGE"` with no indication that their emergency type was dropped.
- **Impact:** Inconsistent initial confidence depending on whether `emergency_type` mapping succeeds.

---

## Test Coverage Gaps

### No tests for Round 1 fixes:

1. **No test for atomic/retry behavior of `SnapshotStore.update()`** — the "optimistic retry" was the headline P0 fix, but no test verifies concurrent update behavior or retry logic
2. **No test for `_orch_done` callback** — no test verifies that orchestrator task failures are logged or handled
3. **No test for `asyncio.to_thread` Twilio wrapping** — no test verifies the Twilio call doesn't block the event loop
4. **No test for `emergency_type` mapping** — no test for the new `TYPE_MAP` in `trigger_sos`, including edge cases (unknown types, case sensitivity)
5. **No test for `compute_confidence` integration in SOS endpoint** — tests exist for `compute_confidence()` in isolation but not for the initial confidence computed during SOS creation

### Still missing from Round 1 report:

6. **No test for JSON parse errors in WebSocket handler** — malformed JSON disconnects the client
7. **No test for double SOS from same device** — no test verifying duplicate prevention (because there is none)
8. **No test for `end_session` WebSocket message** — still untested
9. **No test for concurrent `store.update()` race condition** — still no concurrency test
10. **No test for demo agent crash recovery** — demo agents aren't wrapped in error handlers, and there's no test for what happens when they throw

### New test gaps from Round 1 code:

11. **No test for `_orch_done` callback behavior when task is cancelled vs when it throws**
12. **No test that orchestrator task cancel actually stops agent tasks** (the `finally` block fix)
13. **No test for `emergency_type` with `AMBULANCE` → `MEDICAL` mapping**
14. **No test for unknown `emergency_type` values (silent drop)**

---

## Summary

| Priority | Count | Key theme |
|----------|-------|-----------|
| P0 | 2 | Race condition fix is dead code, user notification on crash missing |
| P1 | 7 | Unfixed R1 P1s (demo agents, JSON errors, double-SOS, `or` defaulting) |
| P2 | 6 | Security (Twilio webhooks, CORS, demo reset), memory leaks |
| Regression | 2 | Silent emergency_type drop, inconsistent confidence |

### Round 1 P1 Bugs — Status Check

| R1 Bug | R1 ID | Fixed in R2? |
|--------|-------|-------------|
| `or` vs `is None` defaulting | BUG-005 | ❌ Unfixed |
| Demo agents not wrapped | BUG-006 | ❌ Unfixed |
| No JSON parse error handling in WS | BUG-007 | ❌ Unfixed |
| No Twilio webhook verification | BUG-008 | ❌ Unfixed |
| `user_id` never stored | BUG-009 | ❌ Unfixed |
| No rate limiting on SOS | BUG-010 | ❌ Unfixed |
| Double-SOS duplicate calls | BUG-011 | ❌ Unfixed |
| TwiML stream URL scheme | BUG-012 | ❌ Unfixed |
| Demo reset no auth | BUG-013 | ❌ Unfixed |

**Top 5 to fix for the demo:**

1. **R2-BUG-005** (demo agents not wrapped in error handler) — this is the **demo code path** and it has zero crash protection
2. **R2-BUG-001** (SnapshotStore race still unfixed) — concurrent agent writes will lose data during every demo session
3. **R2-BUG-007** (double-SOS creates duplicate sessions) — if judge double-taps, chaos ensues
4. **R2-BUG-006** (WebSocket JSON parse crash) — one bad message kills the connection
5. **R2-BUG-002** (`_orch_done` doesn't notify user) — if anything crashes, user sees infinite spinner
