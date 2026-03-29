# Implementation Problem & Resolution

## The Confidence Racing Problem

### The Setup

We have two Gemini 2.0 Flash Live agents running concurrently — one talking to the caller, one briefing the 112 dispatcher. Both read and write the same Redis-backed `EmergencySnapshot`. The orchestrator watches a confidence score and triggers the dispatch call when it crosses 0.85.

Simple, right?

### The Bug

The first time we ran it end-to-end, the User Agent detected "medical emergency" from the caller's voice and immediately called `set_emergency_type("medical")`. Two seconds in, the confidence score hit 0.85. The orchestrator transitioned to `LIVE_CALL`. The Dispatch Agent connected to 112 and said:

> *"Medical emergency at Ulica Svetog Save 15. Dispatching now."*

That's it. No breathing status. No consciousness level. No victim count. The 112 operator got exactly the kind of vague, useless report that wastes critical seconds — the very problem we built this system to solve.

### The "Aha" Moment

We stared at the logs and realized what happened: the LLM was *too eager*. Gemini detected "medical" and "address" in the first two utterances, called both tools, and the confidence math checked out — emergency type (0.30) + location (0.35) + GPS (0.20) = 0.85. Threshold met. Dispatch triggered.

The system was working exactly as designed. The design was wrong.

We were letting *any combination* of fields push the score past 0.85. But from an emergency dispatcher's perspective, "medical emergency at an address" without clinical details is barely better than a pocket dial. The operator *needs* to know: Is the person breathing? Are they conscious? How many victims?

That's when it clicked: **confidence scoring is too critical to delegate to an LLM.** You can't let the model decide when it "feels" confident enough. You need deterministic, weighted gates that force specific clinical data to be collected before dispatch.

### The Fix

We redesigned `compute_confidence()` in `snapshot.py` as a purely deterministic weighted score:

| Field | Weight | Why |
|---|---|---|
| Location confirmed | 0.35 | Dispatcher's #1 need — where to send help |
| Emergency type | 0.25 | Determines which unit responds |
| Consciousness level | 0.15 | Critical triage data |
| Breathing status | 0.15 | Critical triage data |
| Victim count | 0.10 | Scales the response |

The math now makes it **impossible** to reach 0.85 without clinical data:

- Location + type alone = 0.60 → not enough
- Location + type + GPS bonus = 0.80 → still not enough
- Location + type + consciousness + breathing = 0.90 → ✅ dispatch

No LLM judgment call. No prompt engineering. Just arithmetic. The User Agent's system prompt guides it to ask the right questions in the right order, but the *gate* — the decision of when we have enough to call 112 — is pure code.

### The Result

After the fix, the Dispatch Agent's brief sounds like this:

> *"Medical emergency at Ulica Svetog Save 15. One victim, conscious but not breathing. Suspected cardiac arrest."*

That's a brief a dispatcher can act on in seconds. The right ambulance, the right equipment, the right urgency — all because we forced the system to gather complete data before making the call.

---

## Other Challenges

### Audio Format Mismatch

Twilio delivers μ-law encoded audio at 8kHz. Gemini Live expects linear PCM 16-bit at 16kHz. Our first integration produced garbled, robotic audio that Gemini couldn't transcribe. We built `audio_bridge.py` to handle the conversion pipeline — μ-law → PCM, 8kHz → 16kHz for inbound; PCM 24kHz → μ-law 8kHz for outbound. A plumbing problem, but one that would have killed the demo entirely.

### Concurrent Snapshot Writes

Both agents modify the same `EmergencySnapshot` in Redis. If the User Agent sets `conscious=True` at the exact moment the Dispatch Agent sets `call_status=CONNECTED`, one write is lost. We implemented version-tracked updates with retry logic — not a perfect distributed lock, but sufficient for our use case where the two agents operate in largely sequential phases. We acknowledge this limitation in the code; a production system would need proper optimistic concurrency control.

---

## Key Takeaway

The biggest lesson: **in life-critical systems, never let an LLM make gate decisions.** LLMs are brilliant at conversation — extracting information from a panicked caller, generating natural speech for a dispatcher. But the decision of *when we have enough information to act* must be deterministic, auditable, and predictable. Our weighted confidence score has no randomness, no temperature, no prompt sensitivity. It's just math. And in an emergency, math is exactly what you want.
