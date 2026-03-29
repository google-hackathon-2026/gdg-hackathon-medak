# Architecture & Integration Bug Report — Round 1

**Date:** 2025-03-29  
**Reviewer:** Architecture Review (automated)  
**Scope:** End-to-end data flow from frontend SOS to RESOLVED/FAILED

---

## 🔴 P0 — Demo Will Visibly Break

### 1. Emergency Type Mismatch: Frontend → Backend

**Impact:** Emergency type is silently dropped. Snapshot `emergency_type` is always `None`.

The frontend sends `emergency_type: "AMBULANCE" | "POLICE" | "FIRE"` in the SOS request.

**Problem A — Backend SOSRequest drops the field entirely:**
```python
# backend/main.py
class SOSRequest(BaseModel):
    lat: float
    lng: float
    address: str | None = None
    user_id: str
    device_id: str
    # ← emergency_type is MISSING
```
The CLAUDE.md contract says `POST /api/sos` accepts `emergency_type`, and `sosFlow.ts` sends it, but `SOSRequest` doesn't declare it. The field is silently ignored by Pydantic.

**Problem B — Enum value mismatch:**
Even if added, the frontend sends `"AMBULANCE"` but the backend enum uses `"MEDICAL"`:
```python
# backend/snapshot.py
class EmergencyType(StrEnum):
    MEDICAL = "MEDICAL"   # ← Frontend sends "AMBULANCE"
    FIRE = "FIRE"
    POLICE = "POLICE"
    GAS = "GAS"
    OTHER = "OTHER"
```

**Effect:** The snapshot's `emergency_type` stays `None` for every session. The Dispatch Agent's brief will say `"Type: unknown"`. The confidence score loses 0.25 points (the emergency_type component), making it harder to hit the 0.85 threshold. The User Agent's Gemini session will redundantly try to determine emergency type even though the user already chose it on the home screen.

**Fix:** Add `emergency_type: str` to `SOSRequest`. Map `"AMBULANCE"→"MEDICAL"` either in the endpoint or add `AMBULANCE` to the enum. Set `snapshot.emergency_type` in `trigger_sos()`.

---

### 2. Transcript Speaker "dispatch" Not Handled by Frontend

**Impact:** Dispatcher lines silently dropped or rendered incorrectly during demo.

`demo_dispatch_agent.py` sends transcripts with `speaker: "dispatch"`:
```python
(2.5, "transcript", "dispatch", "Emergency services, what happened?"),
```

The frontend `WSMessageFromServer` type only accepts:
```typescript
{ type: "transcript"; speaker: "assistant" | "user"; text: string }
```

The `onTranscript` callback receives `speaker="dispatch"` — this isn't caught by TypeScript at runtime, so the entry will be added to the transcript list, but the `TranscriptBubble` component will style it as non-user (left-aligned, assistant color). It works incidentally, but semantically wrong — there's no visual distinction between the relay AI and the dispatcher's voice.

**Fix:** Either change `speaker: "dispatch"` to `speaker: "assistant"` in the demo script (all lines from the dispatcher), or add `"dispatch"` to the frontend's `WSMessageFromServer` union and render it distinctly (e.g., different color bubble for the operator's voice).

---

### 3. STATUS_UPDATE Messages from Demo Dispatch Missing `confidence`

**Impact:** Frontend sets confidence to `undefined` during LIVE_CALL, which may crash the ProgressBar or display `NaN%`.

`demo_dispatch_agent.py` broadcasts:
```python
{"type": "STATUS_UPDATE", "phase": "LIVE_CALL", "call_status": "DIALING"}
```

The frontend handler:
```typescript
onStatusUpdate: (newPhase, newConfidence) => {
    setPhase(newPhase);
    setConfidence(newConfidence);  // ← undefined → NaN in UI
}
```

`confidence` is not present in the demo dispatch's STATUS_UPDATE. React will render `NaN%` in the TriageView confidence bar. During LIVE_CALL this bar isn't shown (different component), but state is still set — if user goes back to TriageView for any reason, it's corrupted.

**Fix:** Include `confidence` in demo dispatch STATUS_UPDATE messages, or have the frontend default to the last known confidence when undefined.

---

### 4. Audio Format Mismatch: Frontend Sends WAV Files, Backend Expects Raw PCM

**Impact:** User Agent's Gemini session receives WAV-wrapped audio. Gemini may not decode it, or interprets WAV headers as audio noise.

The frontend's `audio.ts` records to `.wav` files and then base64-encodes the entire file:
```typescript
// Records as .wav
extension: ".wav",
// Reads the full file as base64 — this includes the 44-byte WAV header
const base64 = await file.base64();
onChunk(base64);
```

The backend forwards this raw to Gemini with `mime_type="audio/pcm;rate=16000"`:
```python
await session.send(
    input=genai_types.LiveClientRealtimeInput(
        media_chunks=[genai_types.Blob(
            data=audio_bytes,
            mime_type="audio/pcm;rate=16000",
        )]
    )
)
```

WAV files contain a 44-byte RIFF header before the PCM data. The backend declares `audio/pcm` but the data is actually `audio/wav`. Every 250ms chunk starts with a new WAV header that Gemini will interpret as noise.

**Fix:** Either:
- Strip WAV headers in the backend before forwarding (skip first 44 bytes per chunk), or
- Use a raw PCM recording format on the frontend (expo-av on Android doesn't natively support headerless PCM — may need a custom native module or switch to `expo-audio` Recording stream), or
- Change mime_type to `audio/wav` when forwarding to Gemini (Gemini Live may or may not accept this for streaming).

---

### 5. Frontend SOS Request Missing `address` Field

**Impact:** Address is always `null` in the snapshot. Minor — GPS coordinates exist, but the dispatch brief is less useful.

`sosFlow.ts` sends:
```typescript
const response = await triggerSOS({
    emergency_type: emergencyType,
    lat,
    lng,
    user_id: userId,
    device_id: deviceId,
    // ← no address field
});
```

The `SOSRequest` type in `types.ts` has `address?: string` (optional), but `sosFlow.ts` never calls `reverseGeocode()` to fill it. The `location.ts` file has a `reverseGeocode` function available.

**Fix:** Call `reverseGeocode(lat, lng)` in parallel (non-blocking) and include result in the SOS request if available. Comment in `sosFlow.ts` says "Address reverse-geocoding runs in parallel and never blocks the call" — but it's not implemented.

---

## 🟠 P1 — Race Conditions & Reliability

### 6. Snapshot Store Has No Atomicity — Read-Modify-Write Race Condition

**Impact:** Concurrent `store.update()` calls can lose writes.

`SnapshotStore.update()` does:
```python
async def update(self, session_id, updater):
    snapshot = await self.load(session_id)    # read
    updater(snapshot)                          # modify
    snapshot.confidence_score = compute_confidence(snapshot)
    snapshot.snapshot_version += 1
    await self.save(snapshot)                  # write
```

This is a classic read-modify-write race. During LIVE_CALL, both agents plus Twilio status callbacks plus WebSocket user_response handlers all call `store.update()` concurrently. One agent's update can overwrite another's.

Example timeline:
1. User Agent reads snapshot (version 5, `conscious=None`)
2. Dispatch Agent reads snapshot (version 5, `conscious=None`)
3. User Agent sets `conscious=True`, saves version 6
4. Dispatch Agent sets `call_status=CONNECTED`, saves version 6 — **overwrites `conscious=True`**

**Fix:** Use Redis `WATCH`/`MULTI`/`EXEC` optimistic locking, or Lua scripts for atomic updates. For hackathon: at minimum, add a global `asyncio.Lock` per session to serialize updates within a single process.

---

### 7. User Agent Crash Is Silently Swallowed

**Impact:** If User Agent crashes during TRIAGE, orchestrator doesn't know. Triage loop runs until timeout with zero progress.

```python
# orchestrator.py
def _launch_agent(self, name, coro):
    async def _run():
        try:
            await coro
        except Exception:
            logger.exception(...)  # Logged, but nothing else happens
    return asyncio.create_task(_run())
```

The orchestrator's `_run_triage_loop()` polls the snapshot for confidence changes. If the User Agent crashes, confidence stays at 0.20 forever. After 10s timeout, triage ends and the system moves to LIVE_CALL with barely any information.

**Fix:** Have `_launch_agent` set a flag or update snapshot phase to FAILED on crash. Or check `self._user_agent_task.done()` in the triage loop.

---

### 8. Dispatch Agent Crash Leaves Session in LIVE_CALL Limbo

**Impact:** If `run_dispatch_agent()` crashes after setting `call_status=DROPPED`, the orchestrator's live call loop will try to reconnect. But if it crashes before setting any status, `call_status` stays at `IDLE` and the loop polls forever.

The `_run_live_call_loop()` only reacts to `CONFIRMED`, `COMPLETED`, or `DROPPED`. If `call_status` stays `IDLE` (because the dispatch agent crashed before doing anything), there's no exit condition.

**Fix:** Check `self._dispatch_agent_task.done()` in the live call loop. If done and call_status is still IDLE, treat as DROPPED.

---

### 9. `asyncio.create_task` in Request Handler — Task Reference Lost

**Impact:** If the orchestrator task raises an unhandled exception, it becomes a "fire and forget" error. No reference is kept to detect this.

```python
# main.py trigger_sos()
asyncio.create_task(orch.run())
# ← task reference is not stored anywhere
```

If `orch.run()` raises before even starting, the error silently disappears. Python 3.12+ logs "Task exception was never retrieved" but doesn't crash.

**Fix:** Store task reference in a session registry. For hackathon: at minimum, add `task.add_done_callback()` to log failures.

---

## 🟡 P2 — Correctness Issues

### 10. `lru_cache` on `get_settings()` Prevents Runtime Env Var Changes

**Impact:** Low for hackathon, but if you restart with different env vars and the process doesn't restart (e.g., hot reload), old settings persist.

```python
@lru_cache
def get_settings() -> Settings:
    return Settings()
```

This is a singleton. `demo_mode=True` must be set before the first call. Fine for Docker, problematic for local development with hot reload.

---

### 11. `demo_dispatch` Service in docker-compose References Non-Existent Module Path

**Impact:** The demo-dispatch container runs `uvicorn demo_dispatch:app` which works because the `WORKDIR` is `/app` and the file is `demo_dispatch.py`. However, this service has no `env_file`, no `depends_on: redis`, and no `REDIS_URL`. It's a standalone mock so it doesn't need Redis, but if someone tries to use it as a real dispatcher relay, it fails.

More importantly: the `demo_dispatch.py` service is a separate HTTP server that the demo dispatch agent never calls. Looking at `demo_dispatch_agent.py`, it scripts everything locally — it never makes HTTP calls to port 8001. The `demo-dispatch` docker service is dead code.

---

### 12. Docker Compose Missing `DEMO_MODE` and `DEMO_SCENARIO` Environment Variables

`.env.example` does not include `DEMO_MODE` or `DEMO_SCENARIO`. Without `DEMO_MODE=true`, the backend will try to connect to real Gemini Live and Twilio, which will fail without valid credentials. The demo will crash on session start.

**Fix:** Add to `.env.example`:
```
DEMO_MODE=true
DEMO_SCENARIO=stroke_neighbor
```

---

### 13. `confidence_threshold` Uses `or` Instead of Proper Default Check

```python
self.confidence_threshold = confidence_threshold or settings.confidence_threshold
```

If someone passes `confidence_threshold=0.0`, `or` treats it as falsy and falls through to settings. Should use `if confidence_threshold is not None`.

Same issue for `triage_timeout` (passing `0` would use default) and `max_reconnects` (passing `0` means infinite retries).

---

### 14. Frontend `CallStatus` Type Missing `COMPLETED`

```typescript
// frontend/lib/types.ts
export type CallStatus = "IDLE" | "DIALING" | "CONNECTED" | "CONFIRMED" | "DROPPED";
// Backend has COMPLETED too
```

Backend snapshot has `COMPLETED = "COMPLETED"` in `CallStatus` enum, and the orchestrator checks for it to trigger RESOLVED. If `SessionStatusResponse` returns `call_status: "COMPLETED"`, the frontend type doesn't account for it. Won't crash (TypeScript types are erased at runtime) but indicates a contract gap.

---

### 15. Session Cleanup — Orchestrator Task and WebSocket Leaks

**Redis TTL:** 3600s is fine for the hackathon.

**Orchestrator tasks:** `asyncio.create_task(orch.run())` creates a task that lives as long as the session. If the session resolves, the task ends. But if the WebSocket disconnects and nobody sets FAILED/RESOLVED, the orchestrator loops forever (especially in LIVE_CALL with IDLE status — see Bug #8).

**WebSocket connections:** Cleaned up on disconnect via `finally` block. OK.

**AudioBridge & UserMediaRelay:** Cleaned up in orchestrator's `finally` block. OK.

**Issue:** No mechanism to kill zombie orchestrator tasks. On Cloud Run with max-instances=1, zombie tasks accumulate.

---

## 🔵 P3 — Deployment & Polish

### 16. Cloud Run WebSocket Timeout

**Impact:** Cloud Run has a default request timeout of 300 seconds (5 minutes). WebSocket connections to `/api/session/{id}/ws` and Twilio media stream connections will be killed after 5 minutes. A complex emergency that takes longer than 5 minutes will drop mid-session.

**Fix:** Set Cloud Run request timeout to 3600s (max) in deployment config.

---

### 17. Cloud Run Single Instance + No Min-Instances = Cold Start

**CLAUDE.md** says `min-instances=0`. Cold start for a Python container with ML dependencies could be 10-15 seconds. During an emergency demo, the first SOS will have a noticeable lag.

**Fix:** Set `min-instances=1` for the demo.

---

### 18. `backend_base_url` Default Is `http://localhost:8080`

Twilio callbacks use this URL:
```python
url=f"{settings.backend_base_url}/api/session/{session_id}/twilio/twiml",
```

If `BACKEND_BASE_URL` isn't set to the public Cloud Run URL, Twilio can't reach the callback endpoints. The call will fail with Twilio error 11200.

---

### 19. CORS Is Wide Open (Allow All Origins)

```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```

Fine for hackathon, but judges may notice. Not a blocker.

---

### 20. Frontend Hardcoded IP in `config.ts`

```typescript
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://10.225.114.241:8080";
```

This is a local network IP. Won't work in production. Must be set via `EXPO_PUBLIC_API_URL` env var when building for demo.

---

## Summary Table

| # | Severity | Issue | Demo Impact |
|---|----------|-------|-------------|
| 1 | 🔴 P0 | Emergency type dropped — never reaches snapshot | Brief says "unknown", confidence -0.25 |
| 2 | 🔴 P0 | Speaker "dispatch" not in frontend type | Dispatcher lines render wrong |
| 3 | 🔴 P0 | Demo STATUS_UPDATE missing confidence | Possible NaN% in UI |
| 4 | 🔴 P0 | WAV headers sent as raw PCM to Gemini | User Agent hears noise every 250ms |
| 5 | 🔴 P0 | Address never sent in SOS request | Brief says "GPS: lat, lng" only |
| 6 | 🟠 P1 | Snapshot read-modify-write race | Concurrent agents lose each other's writes |
| 7 | 🟠 P1 | User Agent crash silently swallowed | Triage runs 10s with no progress |
| 8 | 🟠 P1 | Dispatch Agent crash → IDLE forever | Session never resolves or fails |
| 9 | 🟠 P1 | Orchestrator task reference lost | Silent failures on crash |
| 10 | 🟡 P2 | `lru_cache` prevents settings reload | Dev inconvenience |
| 11 | 🟡 P2 | `demo-dispatch` service is dead code | Confusion |
| 12 | 🟡 P2 | `DEMO_MODE` missing from `.env.example` | Demo crashes without it |
| 13 | 🟡 P2 | `or` vs `is not None` for thresholds | Edge case wrong defaults |
| 14 | 🟡 P2 | Frontend missing `COMPLETED` CallStatus | Type gap |
| 15 | 🟡 P2 | No zombie task cleanup | Resource leak on Cloud Run |
| 16 | 🔵 P3 | Cloud Run 300s WebSocket timeout | Long calls dropped |
| 17 | 🔵 P3 | Cold start with min-instances=0 | 10-15s first-call lag |
| 18 | 🔵 P3 | `backend_base_url` default is localhost | Twilio callbacks fail |
| 19 | 🔵 P3 | CORS allow all | Judges may note |
| 20 | 🔵 P3 | Hardcoded local IP in frontend config | Must set env var for demo |

---

## Recommended Fix Order (for demo day)

1. **Bug #1** — Add `emergency_type` to SOSRequest, map AMBULANCE→MEDICAL, set on snapshot
2. **Bug #4** — Strip WAV headers or change audio format
3. **Bug #12** — Add DEMO_MODE/DEMO_SCENARIO to .env.example
4. **Bug #2** — Change demo dispatch speaker to "assistant" (1-line fix)
5. **Bug #3** — Add `confidence` to demo dispatch STATUS_UPDATE messages
6. **Bug #5** — Wire up `reverseGeocode()` in sosFlow.ts
7. **Bug #8** — Add dispatch task exit check in live call loop
8. **Bug #7** — Add user agent task exit check in triage loop
9. **Bug #6** — Add per-session asyncio.Lock to SnapshotStore.update()
