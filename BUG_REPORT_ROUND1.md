# Bug Report — Round 1

**Project:** Medak Emergency Relay Backend
**Date:** 2026-03-29
**Auditor:** Eva (automated backend bug hunt)
**Test suite:** 230/230 passing, 6 warnings (all `RuntimeWarning: coroutine 'run_user_agent' was never awaited`)

---

## P0 — Will crash or lose data in production

### BUG-001: SnapshotStore.update() is NOT atomic — race condition will lose data

- **File:** `backend/snapshot.py:106-114`
- **Issue:** `update()` does `load()` → mutate in-memory → `save()` as three separate Redis operations with no locking. Both the User Agent and Dispatch Agent call `store.update()` concurrently on the same session. Classic TOCTOU race condition.
- **Impact:** **Lost writes.** If User Agent calls `update()` to set `conscious=True` at the same moment Dispatch Agent calls `update()` to set `call_status=CONNECTED`, one write overwrites the other. In an emergency system, losing clinical data (breathing, consciousness) could be life-threatening.
- **Reproduction:** Two concurrent `store.update("same-session", ...)` calls where both load version N, both mutate different fields, both save — second save overwrites first's changes.
- **Fix:** Use Redis optimistic locking (`WATCH`/`MULTI`/`EXEC`) with retry:
  ```python
  async def update(self, session_id, updater):
      key = self._key(session_id)
      while True:
          async with self._redis.pipeline(transaction=True) as pipe:
              await pipe.watch(key)
              data = await pipe.get(key)
              if data is None:
                  raise KeyError(...)
              snapshot = EmergencySnapshot.model_validate_json(data)
              updater(snapshot)
              snapshot.confidence_score = compute_confidence(snapshot)
              snapshot.snapshot_version += 1
              pipe.multi()
              pipe.set(key, snapshot.model_dump_json(), ex=SNAPSHOT_TTL)
              try:
                  await pipe.execute()
                  return snapshot
              except aioredis.WatchError:
                  continue  # retry
  ```

### BUG-002: Orchestrator never cancels agent tasks — resource leak & ghost agents

- **File:** `backend/orchestrator.py:56-64` (the `run()` finally block)
- **Issue:** The `finally` block cleans up `bridge_registry` and `user_media_registry` but **never cancels** `_user_agent_task` or `_dispatch_agent_task`. These tasks hold open Gemini Live WebSocket sessions.
- **Impact:** After a session resolves/fails, both agents continue running indefinitely — consuming Gemini API quota, holding WebSocket connections, and potentially modifying the snapshot of a finished session. Over time, this accumulates ghost tasks that never terminate.
- **Fix:** Cancel both tasks in the finally block:
  ```python
  finally:
      for task in (self._user_agent_task, self._dispatch_agent_task):
          if task and not task.done():
              task.cancel()
              try:
                  await task
              except asyncio.CancelledError:
                  pass
      if self.bridge_registry is not None:
          self.bridge_registry.remove(self.session_id)
      if self.user_media_registry is not None:
          self.user_media_registry.remove(self.session_id)
  ```

### BUG-003: Fire-and-forget orchestrator task — silent failures, no reference

- **File:** `backend/main.py:146`
- **Issue:** `asyncio.create_task(orch.run())` creates a task but stores no reference. If the orchestrator crashes, the task exception is silently swallowed (Python logs "Task exception was never retrieved" but the user gets no notification). There's no way to track or cancel running orchestrators.
- **Impact:** Session silently becomes a zombie. User sees "TRIAGE" status forever with no progress and no error message. In an emergency, the person waits for help that will never come.
- **Fix:** Store task references in a session registry; add a `done_callback` that transitions to FAILED and broadcasts the error:
  ```python
  task = asyncio.create_task(orch.run())
  task.add_done_callback(lambda t: _handle_orch_failure(t, session_id))
  app.state.orchestrator_tasks[session_id] = task
  ```

### BUG-004: Twilio API call blocks the event loop

- **File:** `backend/dispatch_agent.py:123-131`
- **Issue:** `TwilioClient(...)` and `twilio_client.calls.create(...)` are **synchronous, blocking** HTTP calls executed inside an `async def` function. This blocks the entire asyncio event loop.
- **Impact:** While Twilio makes its HTTP request (~500ms–2s), ALL other sessions freeze — no WebSocket messages, no status updates, no audio processing for any connected user. In a multi-session scenario, this is catastrophic.
- **Fix:** Wrap in `asyncio.to_thread()`:
  ```python
  call = await asyncio.to_thread(
      twilio_client.calls.create,
      to=settings.emergency_number,
      from_=settings.twilio_from_number,
      url=...,
      status_callback=...,
  )
  ```

---

## P1 — Significant issues

### BUG-005: `confidence_threshold or settings.value` treats 0 as falsy

- **File:** `backend/orchestrator.py:45-47`
- **Issue:** Uses Python `or` operator for parameter defaulting:
  ```python
  self.triage_timeout = triage_timeout or settings.triage_timeout_seconds
  self.confidence_threshold = confidence_threshold or settings.confidence_threshold
  self.max_reconnects = max_reconnects or settings.reconnect_max_attempts
  ```
  If you explicitly pass `triage_timeout=0` or `confidence_threshold=0.0`, the `or` operator treats these as falsy and falls through to the settings value.
- **Impact:** Cannot set any of these parameters to 0 explicitly. Tests that pass `triage_timeout=0` would silently use the settings default instead.
- **Fix:** Use `if x is not None` pattern:
  ```python
  self.triage_timeout = triage_timeout if triage_timeout is not None else settings.triage_timeout_seconds
  ```

### BUG-006: Demo agent tasks not wrapped in error handler — silent crash on exception

- **File:** `backend/orchestrator.py:230-231, 261-262`
- **Issue:** Demo agents are created with bare `asyncio.create_task()`:
  ```python
  self._user_agent_task = asyncio.create_task(run_demo_user_agent(...))
  self._dispatch_agent_task = asyncio.create_task(run_demo_dispatch_agent(...))
  ```
  Real agents use `self._launch_agent()` which wraps in try/except with logging. Demo agents skip this wrapper.
- **Impact:** If a demo agent raises any exception (e.g., KeyError from expired session, Redis timeout), it crashes silently with no logging and no error broadcast.
- **Fix:** Use `_launch_agent()` for demo agents too:
  ```python
  self._user_agent_task = self._launch_agent("Demo User Agent", run_demo_user_agent(...))
  ```

### BUG-007: WebSocket handler doesn't catch JSON parse errors

- **File:** `backend/main.py:170` (`msg = json.loads(raw)`)
- **Issue:** If a WebSocket client sends malformed JSON, `json.loads()` raises `json.JSONDecodeError`. This exception propagates up, causes the `while True` loop to exit, and the WebSocket disconnects.
- **Impact:** A single malformed message kills the WebSocket connection. The user's app loses connection mid-emergency.
- **Fix:** Wrap in try/except inside the loop:
  ```python
  try:
      msg = json.loads(raw)
  except json.JSONDecodeError:
      await ws.send_text(json.dumps({"type": "error", "message": "Invalid JSON"}))
      continue
  ```

### BUG-008: No Twilio webhook signature verification

- **File:** `backend/main.py:196-210` (twilio_status endpoint), `backend/main.py:214-226` (twilio_twiml endpoint)
- **Issue:** Twilio sends an `X-Twilio-Signature` header with every webhook request. This backend never verifies it.
- **Impact:** Anyone can POST fake status updates to `/api/session/{id}/twilio/status` with `CallStatus=completed` or `CallStatus=failed`, manipulating session state. An attacker could force sessions into DROPPED state, preventing emergency dispatch.
- **Fix:** Use `twilio.request_validator.RequestValidator` to verify signatures.

### BUG-009: `user_id` from SOS request is accepted but never stored

- **File:** `backend/main.py:22` (SOSRequest has `user_id: str`), `backend/main.py:125-140` (trigger_sos handler)
- **Issue:** The `user_id` field is present in the request model but is never saved to the `EmergencySnapshot`. There's no `user_id` field on the snapshot model at all.
- **Impact:** No way to associate sessions with users. Cannot prevent duplicate SOS calls from the same user. Cannot implement any user-based access control.
- **Fix:** Add `user_id` to `EmergencySnapshot` and store it in `trigger_sos`.

### BUG-010: No rate limiting on SOS endpoint — resource exhaustion

- **File:** `backend/main.py:123` (`/api/sos` endpoint)
- **Issue:** Every SOS call creates a new session, spawns an orchestrator (with agent tasks), and potentially initiates a Twilio call. There's zero rate limiting.
- **Impact:** A malicious actor (or even a panicking user tapping SOS repeatedly) can spawn unlimited sessions, exhaust Redis memory, burn through Gemini API quota, and make dozens of Twilio calls simultaneously. This is both a DoS vector and a cost exposure.
- **Fix:** Rate limit per `device_id` and/or `user_id`. At minimum, check if there's already an active session for this device.

### BUG-011: Rapid double-SOS creates two parallel sessions for same emergency

- **File:** `backend/main.py:123-148`
- **Issue:** If the user (or a buggy frontend) calls `/api/sos` twice rapidly for the same location/device, two completely independent sessions are created with separate orchestrators, agents, and potentially two Twilio calls to emergency services.
- **Impact:** Two 112 calls for the same emergency. Emergency services get confused, resources wasted, potential for conflicting information.
- **Fix:** Before creating a new session, check if an active (non-RESOLVED, non-FAILED) session already exists for this `device_id`. Return the existing `session_id` instead.

### BUG-012: TwiML stream URL may be incorrect when backend_base_url uses HTTP

- **File:** `backend/main.py:219-220`
- **Issue:**
  ```python
  base = settings.backend_base_url.removeprefix("https://").removeprefix("http://")
  stream_url = f"wss://{base}/api/session/{session_id}/twilio/stream"
  ```
  Always generates `wss://` regardless of whether the backend actually supports TLS. If `backend_base_url` is `http://localhost:8080` (the default), this produces `wss://localhost:8080/...` which won't work without TLS termination.
- **Impact:** Twilio WebSocket connection fails in development/testing without a reverse proxy.
- **Fix:** Use `ws://` for `http://` URLs and `wss://` for `https://` URLs.

### BUG-013: `demo_reset` endpoint accessible with no auth — can wipe all sessions

- **File:** `backend/main.py:246-257`
- **Issue:** The `/api/demo/reset` endpoint deletes ALL session data from Redis with no authentication check. It also accesses the private `store._redis` member directly.
- **Impact:** Anyone who discovers this endpoint can nuke all active emergency sessions. Extremely dangerous if accidentally left enabled in production.
- **Fix:** Gate behind `demo_mode` setting check; add auth; or remove entirely for production builds.

---

## P2 — Improvements

### BUG-014: In-memory registries never cleaned up on session expiry

- **File:** `backend/main.py:73-76` (SessionRegistry), `backend/audio_bridge.py:65-78` (AudioBridgeRegistry), `backend/user_agent.py:161-174` (UserMediaRegistry)
- **Issue:** Sessions expire from Redis after 1 hour (TTL), but the in-memory dictionaries in these registries keep entries forever. The orchestrator's `finally` block cleans up bridge and media registries, but `SessionRegistry._connections` is only cleaned when WebSockets disconnect.
- **Impact:** Slow memory leak. Each session leaves behind empty lists in `_connections`, and if WebSockets disconnect uncleanly, entries persist.
- **Fix:** Add periodic cleanup of stale entries, or use weak references.

### BUG-015: Orchestrator triage loop polls Redis every 1 second

- **File:** `backend/orchestrator.py:90-100`
- **Issue:** The triage loop runs `store.load()` every second to check confidence. The live call loop polls every 2 seconds. With many concurrent sessions, this creates significant Redis load.
- **Impact:** N sessions × 1 Redis load/sec = N Redis queries/sec during triage. With 100 concurrent emergencies, that's 100 qps just for polling.
- **Fix:** Use Redis pub/sub to notify the orchestrator when confidence changes, or use asyncio Events triggered by `store.update()`.

### BUG-016: CORS allows all origins

- **File:** `backend/main.py:82-86`
- **Issue:** `allow_origins=["*"]` permits any website to make API calls to this backend, including reading response data.
- **Impact:** Any malicious website could trigger SOS calls, read session data, or manipulate sessions via cross-origin requests.
- **Fix:** Restrict to the frontend's actual origin.

### BUG-017: No input validation on string length for free text and addresses

- **File:** `backend/user_agent.py:50-53` (append_free_text), `backend/user_agent.py:32-37` (confirm_location)
- **Issue:** No length limits on `utterance` in `append_free_text()` or `address` in `confirm_location()`. The Gemini model could produce arbitrarily long strings that get stored in Redis.
- **Impact:** Memory exhaustion in Redis if model generates very long text. Also increases payload size for every subsequent `store.load()`.
- **Fix:** Truncate strings to a reasonable max length (e.g., 500 chars for free text, 200 for address).

### BUG-018: Emergency number validator doesn't check other countries' emergency numbers

- **File:** `backend/config.py:28-34`
- **Issue:** Only rejects 112 (EU) and 194 (Serbian ambulance). Doesn't check 911 (US/Canada), 999 (UK), 000 (Australia), 110 (Germany police), etc.
- **Impact:** If deployed outside Serbia, could accidentally call real emergency services.
- **Fix:** Expand the blocklist or use a different approach (require explicit confirmation flag).

### BUG-019: `demo_dispatch.py` sessions dict grows unbounded

- **File:** `backend/demo_dispatch.py:29`
- **Issue:** `sessions: dict[str, dict] = {}` is module-level state that only grows. The `/dispatch/reset` endpoint clears it, but in normal operation it accumulates forever.
- **Impact:** Memory leak in long-running demo dispatch process.
- **Fix:** Add TTL-based cleanup or max session count.

### BUG-020: Test warnings — unawaited coroutines from fire-and-forget tasks

- **File:** Multiple test files (see warnings in test output)
- **Issue:** 6 `RuntimeWarning: coroutine 'run_user_agent' was never awaited` warnings during tests. These come from `asyncio.create_task(orch.run())` in the SOS handler — when tests create sessions via the API, orchestrator tasks are spawned but never awaited or cleaned up.
- **Impact:** Test pollution; potential for flaky tests; hides real warnings.
- **Fix:** In test fixtures, either mock the orchestrator or properly shut down tasks after tests.

### BUG-021: `response.server_content` and `response.tool_call` both checked independently

- **File:** `backend/dispatch_agent.py:173-215`, `backend/user_agent.py:227-252`
- **Issue:** Both `server_content` and `tool_call` are checked on the same response object. The Gemini Live API typically sends either audio/text OR tool calls, not both. But the code handles them independently without `elif`, which could process the same response twice if both are present.
- **Impact:** Unlikely but could cause duplicate processing. Low severity.
- **Fix:** Use `elif` or add a comment documenting the expected behavior.

### BUG-022: `get_pending_dispatch_question` uses fragile string matching

- **File:** `backend/user_agent.py:59-65`
- **Issue:**
  ```python
  answered = {a.split("|")[0] for a in snap.ua_answers}
  for q in snap.dispatch_questions:
      if q not in answered:
          return q
  ```
  Uses `"|"` as delimiter in `ua_answers` entries (format: `"question|answer"`). If a question text itself contains `"|"`, the split breaks.
- **Impact:** Questions containing pipe characters would never be matched as answered, causing infinite re-asking.
- **Fix:** Use a structured format (list of dicts with `question` and `answer` keys) instead of pipe-delimited strings.

---

## P3 — Nice to have

### BUG-023: No structured logging or request correlation IDs

- **File:** `backend/main.py:9`
- **Issue:** Uses basic `logging.basicConfig` with a simple format. No JSON logging, no `session_id` in log context, no request IDs.
- **Impact:** Hard to trace issues across components in production. Cannot filter logs by session.
- **Fix:** Use structured logging (e.g., `structlog`) with session_id as a bound context variable.

### BUG-024: No graceful shutdown handling

- **File:** Entire application
- **Issue:** No shutdown hooks to gracefully close WebSocket connections, cancel orchestrator tasks, or end Gemini sessions when the server stops.
- **Impact:** Abrupt disconnections for all connected clients on deploy/restart.
- **Fix:** Add `@app.on_event("shutdown")` handler or use lifespan context manager.

### BUG-025: `demo_dashboard.html` read from disk on every request

- **File:** `backend/main.py:246-248`
- **Issue:** `html_path.read_text(encoding="utf-8")` does a disk read on every request to `/demo`.
- **Impact:** Negligible for a demo endpoint, but unnecessary I/O.
- **Fix:** Cache the content at startup.

### BUG-026: `lru_cache` on `get_settings()` — no cache invalidation mechanism

- **File:** `backend/config.py:35-37`
- **Issue:** `@lru_cache` means settings are read once and cached forever. No way to refresh settings without restarting the process.
- **Impact:** Expected pattern for most deployments, but means `.env` changes require a restart. Could cause test isolation issues if tests modify environment variables.
- **Fix:** Add a `get_settings.cache_clear()` call in test fixtures if needed.

### BUG-027: No health check for Redis connectivity

- **File:** `backend/main.py:115-116`
- **Issue:** The `/api/health` endpoint returns `{"status": "ok"}` without actually pinging Redis.
- **Impact:** Health check reports OK even when Redis is down. Load balancers continue routing traffic to a broken instance.
- **Fix:** Add `await redis_client.ping()` in the health check (with a timeout).

### BUG-028: Session status endpoint return type mismatch on 404

- **File:** `backend/main.py:149-155`
- **Issue:** The function signature says `-> SessionStatusResponse` but the 404 case returns `JSONResponse`. While FastAPI handles this at runtime, it's a type annotation lie that could confuse static analysis and API doc generation.
- **Impact:** OpenAPI schema shows wrong return type for error case.
- **Fix:** Use `-> SessionStatusResponse | JSONResponse` or use `HTTPException(404)`.

---

## Test Gaps

### Missing test scenarios:

1. **Concurrent `store.update()` race condition** — no test verifies what happens when two updates run simultaneously
2. **Redis connection failure** — no test for Redis being down/timing out during any operation
3. **Gemini API timeout/failure** — `run_user_agent` and `run_dispatch_agent` are never tested (only their Tools classes are)
4. **WebSocket disconnect mid-operation** — what if WS disconnects while `store.update()` is in progress?
5. **Session expiry during active use** — what if Redis TTL expires while orchestrator is running?
6. **Double SOS from same device** — no test verifies behavior
7. **Orchestrator crash recovery** — no test for what happens when orchestrator's `run()` raises
8. **Demo agent monitoring loop exit conditions** — no test for demo user agent's monitoring loop (only the script part)
9. **`end_session` WebSocket message** — no test for the `end_session` message type in the WebSocket handler
10. **Twilio stream with `outbound` track media** — only `inbound` track is tested; what happens if Twilio sends outbound?
11. **Audio conversion with corrupted/malformed data** — only silence and empty bytes tested
12. **Bridge with `stream_sid=None`** — outbound audio is only sent when `bridge.stream_sid` is set; no test for timing where audio arrives before `start` event

---

## Summary

| Priority | Count | Key theme |
|----------|-------|-----------|
| P0 | 4 | Race conditions, resource leaks, event loop blocking |
| P1 | 9 | Missing validation, security, error handling |
| P2 | 9 | Memory leaks, polling overhead, input validation |
| P3 | 6 | Logging, graceful shutdown, type safety |

**Top 3 to fix immediately:**
1. **BUG-001** (race condition in SnapshotStore) — will cause data loss under any real concurrent load
2. **BUG-002** (ghost agent tasks) — will exhaust Gemini API quota and memory
3. **BUG-004** (blocking Twilio call) — will freeze the entire server for all users
