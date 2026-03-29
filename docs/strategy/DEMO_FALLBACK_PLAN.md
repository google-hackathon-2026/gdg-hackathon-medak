# Demo Fallback Plan — Medak

> **Goal:** The demo works every single time, no matter what breaks.
> Three tiers of fallback. Zero moments of silence on stage.

---

## Pre-Flight Checklist (T-15 minutes)

Run through this **every time**, even if you tested an hour ago:

- [ ] **Backend running?** → `curl http://localhost:8080/health` (expect `{"status":"ok"}`)
- [ ] **Redis connected?** → Check dashboard or `redis-cli ping` → `PONG`
- [ ] **Phone on WiFi?** → Same network as laptop (or laptop hotspot)
- [ ] **Demo mode enabled?** → `DEMO_MODE=true` in `.env`, restart backend
- [ ] **Phone battery > 50%?**
- [ ] **Phone screen brightness MAX?** → Judges need to see the screen
- [ ] **Laptop volume UP?** → Dispatcher voice must be audible in the room
- [ ] **Dashboard open on laptop?** → `demo_dashboard.html` in fullscreen, projector mirrored
- [ ] **Test run?** → Do one full SOS → RESOLVED cycle right now. Reset after.
- [ ] **Demo reset?** → `POST /api/demo/reset` or restart backend to clear stale sessions
- [ ] **Record backup video NOW** → See Tier 2 below. Do this BEFORE the presentation.

---

## Tier 1: Demo Mode Works (Expected Path)

**Probability: ~90%** — This is the happy path. Everything is scripted and deterministic.

1. Presenter tells Ana's story (30 seconds)
2. Press SOS on phone — `DEMO_MODE=true` runs scripted agents
3. 38-second flow: INTAKE → TRIAGE → LIVE_CALL → RESOLVED
4. Judges see phone + dashboard updating in real-time
5. Green screen: "✅ Pomoć je na putu — ETA: 8 minuta"

**Presenter says nothing during the demo.** Let the system speak. Silence is the point.

---

## Tier 2: Backend Crashes / WebSocket Disconnects

**Probability: ~8%** — Network issue, backend crashes mid-demo, phone loses WiFi.

### Trigger: Any of these happen on stage:
- Phone shows "Povezivanje..." for more than 5 seconds
- Dashboard freezes or shows error
- Transcript bubbles stop appearing
- You get a gut feeling it's broken

### Action: Switch to pre-recorded video

**Transition script (smooth, confident):**

> "Imamo tehničkih poteškoća s mrežom — evo snimka koji smo napravili malopre u backstage-u."

**NOT:** "Nešto ne radi..." / "Sačekajte malo..." / awkward silence.

Open the video file (already queued in a browser tab or media player). Hit play.

### How to prepare the backup video:

**Record BEFORE the presentation** (during setup/soundcheck):

1. **What to record:** Phone screen + dashboard side by side (1 minute)
2. **How to record:**
   - **Option A (best):** OBS Studio — capture phone screen (via scrcpy or phone mirroring) + dashboard browser window in split layout
   - **Option B:** Phone screen recorder (built-in on Android/iOS) for the phone side, plus laptop screen recorder (OBS/QuickTime) for the dashboard side. Stitch later or show sequentially.
   - **Option C (simplest):** Point a second phone's camera at the setup (phone + laptop side by side) and record a 1-minute video
3. **Save to:** Desktop, already open in a browser tab or VLC. One click to play.
4. **Resolution:** 1080p minimum. Check that text is readable on projector.

### Role assignment during failure:

| Person | Action |
|--------|--------|
| **Presenter** | Delivers transition line, continues narrating over video |
| **Tech person** | Opens video tab, hits play. Does NOT try to debug on stage. |

**Rule: Never debug on stage.** If it's broken, it's broken. Switch to video within 5 seconds.

---

## Tier 3: Everything Fails (No Video Either)

**Probability: ~2%** — Video file is corrupted, laptop crashes, projector dies.

### Action: Screenshot walkthrough

Prepare **5 screenshots** on a USB stick AND in Google Slides (accessible from any device):

| # | Screenshot | What it shows |
|---|-----------|---------------|
| 1 | **SOS Screen** | Red SOS button, finger about to press |
| 2 | **Triage Phase** | Transcript bubbles appearing, confidence bar at 45% |
| 3 | **Triage Complete** | Confidence at 100%, about to transition |
| 4 | **Live Call Phase** | Yellow header "Poziv u toku — 112", dispatcher transcript visible |
| 5 | **Resolved Screen** | Green "✅ Pomoć je na putu — ETA: 8 minuta" |

### Walkthrough script (30 seconds, calm and confident):

> "Dozvolite da vam pokažem šta se dešava korak po korak.
>
> **[Screenshot 1]** Ana pritisne SOS dugme. Kamera i GPS se aktiviraju.
>
> **[Screenshot 2]** Gemini agent analizira scenu — prepoznaje medicinsku hitnost, potvrđuje lokaciju. Vidite kako raste confidence score.
>
> **[Screenshot 3]** Kada sistem sakupi dovoljno informacija — confidence dostiže 100% — automatski poziva 112.
>
> **[Screenshot 4]** Drugi agent govori sa dispečerom, prenosi podatke, i vraća pitanja nazad na Anin ekran.
>
> **[Screenshot 5]** Za 38 sekundi — pomoć je na putu. Bez ijedne izgovorene reči."

### Key delivery tips:
- **Point at each screenshot** as you narrate
- Maintain the same energy as if the demo worked
- Don't apologize. Don't mention failure. Just present.

---

## Transition Language Guide

The difference between a failed demo and a professional presentation is **how you frame it.**

### ✅ DO say:
- "Kao što vidite..." (As you can see...)
- "Dozvolite da vam pokažem..." (Let me show you...)
- "Evo snimka iz backstage-a..." (Here's the recording from backstage...)
- "Pogledajte kako sistem..." (Watch how the system...)

### ❌ DON'T say:
- "Nešto ne radi..." (Something isn't working...)
- "Sačekajte..." (Wait...)
- "Ovo obično radi..." (This usually works...)
- "Imamo bug..." (We have a bug...)
- *Silence while frantically clicking*

---

## Decision Flowchart

```
SOS pressed on phone
  │
  ├─ Transcript appears within 3s? ──YES──→ Tier 1: Let it run
  │
  NO (stuck/frozen)
  │
  ├─ Say transition line
  ├─ Open backup video tab
  │
  ├─ Video plays? ──YES──→ Tier 2: Narrate over video
  │
  NO (file missing/broken)
  │
  └─ Open screenshots ──→ Tier 3: Walk through screenshots
```

**Total dead air allowed: 5 seconds max.** If something doesn't respond in 5 seconds, move to next tier.

---

## Preparation Checklist (Night Before)

- [ ] Record backup video (Tier 2) — at least 2 copies (laptop + USB)
- [ ] Take 5 screenshots (Tier 3) — save to Google Slides + USB + phone gallery
- [ ] Print this document — have it physically at the presentation desk
- [ ] Rehearse Tier 2 transition at least once with the team
- [ ] Rehearse Tier 3 walkthrough at least once
- [ ] Assign roles: who presents, who handles tech, who has the backup files
- [ ] Test the projector/display connection
- [ ] Charge all devices to 100%
- [ ] Set phones to Do Not Disturb (no notification interruptions during demo)
