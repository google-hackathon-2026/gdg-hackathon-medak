# Bug Report — Round 3

**Project:** Medak Emergency Relay  
**Date:** 2026-03-29  
**Branch:** `fix/round2-p1-fixes`  
**Tests:** 230/230 passing, 6 warnings (`RuntimeWarning: coroutine 'run_user_agent' was never awaited`)

---

## Round 2 Fix Verification

| R2 Bug | Status | Verification |
|--------|--------|-------------|
| R2-BUG-001 (SnapshotStore race) | ⚠️ Still unfixed (accepted) | Retry loop is dead code, but comment now documents it. Acceptable for hackathon — demo agents run sequentially. |
| R2-BUG-002 (`_orch_done` no user notification) | ✅ Fixed | `_orch_done` now uses `loop.create_task(reg.broadcast(...))` to send FAILED to user. |
| R2-BUG-004 (`or` vs `is None` defaulting) | ✅ Fixed | `orchestrator.py:45-47` now uses `if x is not None else`. Correct. |
| R2-BUG-005 (demo agents not wrapped) | ⚠️ NOT fixed | Demo agents still use bare `asyncio.create_task()` (see R3-BUG-001). |
| R2-BUG-006 (WS JSON parse crash) | ✅ Fixed | `main.py:218-220` now catches `json.JSONDecodeError` and sends error response. |
| R2-BUG-007 (double-SOS duplicate) | ✅ Fixed | `recent_sos` dict deduplicates same device_id within 30s. |

---

## P1 — Will cause visible issues during demo

### R3-BUG-001: Demo agents STILL not wrapped in error handler

- **Files:** `orchestrator.py:239-243` (user agent), `orchestrator.py:270-273` (dispatch agent)
- **Issue:** When `demo_mode=True`, both agents use bare `asyncio.create_task()` instead of `self._launch_agent()`. If a demo agent throws (e.g., Redis timeout, KeyError from expired session), it crashes silently — no log, no error message.
- **Impact:** The demo session freezes with no feedback. This is the **exact code path judges will see**.
- **Why it matters now:** The demo agents themselves have try/except internally (both `run_demo_user_agent` and `run_demo_dispatch_agent` catch `Exception` and broadcast an error transcript). So the risk is mitigated by the agent-level error handling. But if the agent throws *before* entering its try/except (e.g., during `UserAgentTools()` or `DispatchAgentTools()` construction), it's still silent.
- **Quick fix (1 min):** Replace both `asyncio.create_task()` calls with `self._launch_agent()`:
  ```python
  # orchestrator.py line 239:
  self._user_agent_task = self._launch_agent(
      "Demo User Agent",
      run_demo_user_agent(self.session_id, self.store, self.broadcast, scenario=settings.demo_scenario),
  )
  # orchestrator.py line 270:
  self._dispatch_agent_task = self._launch_agent(
      "Demo Dispatch Agent",
      run_demo_dispatch_agent(self.session_id, self.store, self.broadcast),
  )
  ```

### R3-BUG-002: WebSocket `onTranscript` callback type mismatch — `"dispatch"` speaker silently dropped

- **File:** `frontend/lib/websocket.ts:5`
- **Issue:** The `WSCallbacks` interface defines:
  ```typescript
  onTranscript: (speaker: "assistant" | "user", text: string) => void;
  ```
  But the backend sends `speaker: "dispatch"` for 112 operator messages (demo_dispatch_agent.py lines 131-136). The `WSMessageFromServer` type in `types.ts` correctly includes `"dispatch"`, but the callback **type is narrower**. At runtime this works (JS doesn't enforce types), but it means:
  1. TypeScript build will fail with strict type checking enabled
  2. The `session.tsx:68` `addTranscript` function accepts `"dispatch"` but the websocket connector's type says it doesn't
- **Impact:** Currently works at runtime, but will break if you enable strict TS. Also a maintenance trap.
- **Quick fix (30 sec):** Change `websocket.ts:5` to:
  ```typescript
  onTranscript: (speaker: "assistant" | "user" | "dispatch", text: string) => void;
  ```

### R3-BUG-003: Frontend `CallStatus` type missing `COMPLETED`

- **File:** `frontend/lib/types.ts:10-15`
- **Issue:** Backend `snapshot.py` has `CallStatus.COMPLETED = "COMPLETED"`, and the orchestrator checks for it (orchestrator.py:165). Frontend defines:
  ```typescript
  export type CallStatus = "IDLE" | "DIALING" | "CONNECTED" | "CONFIRMED" | "DROPPED";
  ```
  Missing: `"COMPLETED"`. If a Twilio call ends with `completed` status, orchestrator broadcasts `RESOLVED`, which is fine. But the session status endpoint returns `call_status: "COMPLETED"` which doesn't match the frontend type.
- **Impact:** Low for demo (the RESOLVED message works regardless), but a contract mismatch.
- **Quick fix (10 sec):** Add `| "COMPLETED"` to the `CallStatus` type.

### R3-BUG-004: `recent_sos` dict leaks memory — never cleaned up

- **File:** `backend/main.py:120`
- **Issue:** The double-SOS dedup dict `recent_sos: dict[str, tuple[str, float]] = {}` grows unbounded. Entries are added but never removed. After many SOS calls, this dict accumulates old device IDs forever.
- **Impact:** Minor memory leak. For a hackathon demo (a few sessions), irrelevant. For a long-running demo, stale entries also prevent legitimate re-SOS after 30s window because they're only checked against time, not cleaned.
- **Observation:** The 30s TTL check means stale entries are functionally harmless (they just waste memory). But the dict never shrinks.
- **Quick fix (optional, 2 min):** Add cleanup on each SOS call:
  ```python
  # Clean stale entries
  cutoff = now - 60
  recent_sos = {k: v for k, v in recent_sos.items() if v[1] > cutoff}
  ```

---

## P2 — Known issues, acceptable for hackathon

### R3-BUG-005: Docker Compose `demo-dispatch` service has no Redis or env_file

- **File:** `docker-compose.yml:16-20`
- **Issue:** The `demo-dispatch` service builds from `./backend` but doesn't have:
  - `env_file: .env` — will fail to load settings (no `GOOGLE_API_KEY` etc.)
  - `depends_on: redis` — might start before Redis
  - `REDIS_URL` environment variable
  
  However, `demo_dispatch.py` is a standalone FastAPI app that doesn't use Redis or Gemini. It only uses its own in-memory `sessions` dict. So **this is fine as-is**.
- **Impact:** None — the service works correctly without these.

### R3-BUG-006: `docker compose up` won't work without GCP ADC file

- **File:** `docker-compose.yml:12-13`
- **Issue:** The backend service mounts:
  ```yaml
  volumes:
    - ${HOME}/.config/gcloud/application_default_credentials.json:/gcp/adc.json:ro
  ```
  If this file doesn't exist on the host, Docker will create a directory at the mount point, and the backend will crash with a credential error.
- **Impact:** Blocks `docker compose up` for anyone without GCP ADC set up. For demo mode (`DEMO_MODE=true`), the backend never calls Gemini, so this mount is unnecessary.
- **Mitigation:** Users need to run `gcloud auth application-default login` first, or add a conditional check.

### R3-BUG-007: `_orch_done` callback uses deprecated `asyncio.get_event_loop()`

- **File:** `backend/main.py:174`
- **Issue:** `asyncio.get_event_loop()` is deprecated in Python 3.12+ for getting the running loop from a callback. In Python 3.13 (which is what the project uses), this emits a DeprecationWarning in some contexts. Should use `asyncio.get_running_loop()` but that only works inside a coroutine. Since `_orch_done` is a sync callback, the correct approach would be to capture the loop beforehand:
  ```python
  loop = asyncio.get_running_loop()
  def _orch_done(t, sid=session_id, reg=registry, lp=loop):
      ...
      lp.create_task(reg.broadcast(...))
  ```
- **Impact:** May emit DeprecationWarning in logs. Functionally works.

### R3-BUG-008: Backend `WSMessageFromServer` includes `error` type but frontend doesn't handle it

- **File:** `backend/main.py:220`, `frontend/lib/types.ts:52-58`
- **Issue:** Backend sends `{"type": "error", "message": "Invalid JSON"}` on parse failures. Frontend's `WSMessageFromServer` type doesn't include an `error` variant. The `dispatch()` method in `websocket.ts` silently ignores it (no `case "error"` in the switch).
- **Impact:** User gets no feedback when their message fails to parse. Functionally harmless during demo.

---

## Remaining R1 P1 Bugs — Still Unfixed (Accepted for Hackathon)

| Bug | Status | Risk |
|-----|--------|------|
| `user_id` accepted but never stored | ❌ Unfixed | Low — cosmetic API inconsistency |
| No Twilio webhook signature verification | ❌ Unfixed | Low for demo (local/ngrok) |
| Demo reset endpoint unauthenticated | ❌ Unfixed | Low — obscure endpoint |
| In-memory registry leak (sessions never cleaned) | ❌ Unfixed | Low — short demo runs |
| Orchestrator task reference not stored | ❌ Unfixed | Low — demo reset doesn't cancel running tasks |

---

## Demo Mode End-to-End Trace ✅

Traced `DEMO_MODE=true` through the full stack:

1. **Config:** `config.py:21` — `demo_mode: bool = False`, set via `DEMO_MODE=true` env var
2. **Orchestrator:** `orchestrator.py:237` — checks `settings.demo_mode` before starting user agent
3. **Demo User Agent:** `demo_user_agent.py` — runs scripted tool calls on real `UserAgentTools`, mutates real snapshot, broadcasts real WebSocket messages
4. **Orchestrator:** `orchestrator.py:268` — checks `settings.demo_mode` before starting dispatch agent  
5. **Demo Dispatch Agent:** `demo_dispatch_agent.py` — simulates call, broadcasts `"dispatch"` speaker transcripts, handles Q&A relay through snapshot, confirms dispatch with ETA
6. **Resolution:** Dispatch agent calls `confirm_dispatch(8)` → sets `CallStatus.CONFIRMED` → orchestrator detects it in `_check_call_status()` → broadcasts `RESOLVED` with ETA

**Verdict:** Demo mode end-to-end **WILL WORK**. The scripted flow is well-designed — both agents use real tool classes, real snapshot mutations, and real WebSocket broadcasts. The timing is reasonable (script completes in ~30s total). Cross-agent Q&A relay works through `dispatch_questions`/`ua_answers` fields.

**One risk:** The triage timeout is 10 seconds by default (`TRIAGE_TIMEOUT_SECONDS=10`). The demo user agent script runs until 8.5 seconds. If the confidence hasn't reached the 0.85 threshold by then, the orchestrator will timeout-transition to LIVE_CALL at T+10s. Let's check: GPS (0.20) + emergency type (0.25) + confirmed address (0.35→total replaces GPS so 0.35) + conscious+breathing (0.30) + victim_count (0.10) = **1.00**. The confirm_location at T+5.5s sets confirmed+address, which alone gives 0.35+0.25=0.60. By T+7.0s (clinical fields), confidence is 0.35+0.25+0.15+0.15+0.10=1.00. So confidence hits 1.00 > 0.85 well before the 10s timeout. ✅

---

## Frontend↔Backend Contract Audit

| Message Type | Backend | Frontend | Match? |
|-------------|---------|----------|--------|
| `transcript` (assistant/user) | ✅ | ✅ | ✅ |
| `transcript` (dispatch) | ✅ `demo_dispatch_agent.py` | ⚠️ `session.tsx` handles it, `websocket.ts` type is wrong | ⚠️ R3-BUG-002 |
| `STATUS_UPDATE` | ✅ | ✅ | ✅ |
| `user_question` | ✅ | ✅ | ✅ |
| `RESOLVED` | ✅ | ✅ | ✅ |
| `FAILED` | ✅ | ✅ | ✅ |
| `pong` | ✅ | ✅ | ✅ |
| `error` | ✅ backend sends | ❌ frontend ignores | P2 gap |
| `ping` (client→server) | ✅ | ✅ | ✅ |
| `audio` (client→server) | ✅ | ✅ | ✅ |
| `video_frame` (client→server) | ✅ | ✅ | ✅ |
| `user_response` (client→server) | ✅ | ✅ | ✅ |
| `end_session` (client→server) | ✅ | ✅ | ✅ |

---

## Quick Wins (< 5 min each)

### QW-1: Fix demo agent error wrapping (1 min) — R3-BUG-001
Replace `asyncio.create_task()` with `self._launch_agent()` for both demo agents.

### QW-2: Fix `onTranscript` type (30 sec) — R3-BUG-002
Add `"dispatch"` to `websocket.ts` callback type.

### QW-3: Add `"COMPLETED"` to frontend `CallStatus` (10 sec) — R3-BUG-003
Add `| "COMPLETED"` to `types.ts`.

### QW-4: Add `DEMO_MODE=true` to `.env.example` (10 sec)
The env example doesn't have `DEMO_MODE`. Add it so demo setup is obvious.

### QW-5: Capture loop reference before `_orch_done` callback (30 sec) — R3-BUG-007
Avoid deprecation warning by capturing `asyncio.get_running_loop()` outside the callback.

---

## Summary

| Priority | Count | Theme |
|----------|-------|-------|
| P1 | 4 | Demo agent error wrapping, type mismatches, memory leak |
| P2 | 4 | Docker config, deprecation, contract gaps |
| Accepted (unfixed from R1) | 5 | user_id, Twilio auth, demo reset auth, registry leak, task tracking |

**Critical path for demo:** Everything works. The demo mode flow is solid. The 4 quick wins above would make it cleaner but aren't blockers. The biggest risk is R3-BUG-001 (demo agent crash = silent freeze), but the agents have their own try/except so the practical risk is low.
