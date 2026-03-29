# 📋 Presentation Day Checklist

---

## Day Before: Final Prep

- [ ] All team members read **PRESENTER_POCKET_CARD.md** and **STATS_QUICK_REFERENCE.md**
- [ ] Slides completed and reviewed by everyone (built from SLIDE_CONTENT_SPEC.md)
- [ ] ⚠️ Stats confirmed: **430M** (not 466M), **$0.13/call**, **84K Serbia**, **0 countries**
- [ ] At least 2 full run-throughs timed — target 600s ± 15s
- [ ] Demo tested on same network conditions as venue (use phone hotspot if needed)
- [ ] Recorded backup video confirmed working and accessible offline
- [ ] Everyone knows their role: who pitches slide 1-4, who pitches slide 5-8, who answers tech Q&A
- [ ] Rest. 8 hours sleep minimum. You won't pitch well on 3 hours of sleep.

---

> **Single document for day-of prep.** Print this. Check every box.  
> Time estimates assume you arrive 60+ minutes before your slot.

---

## T-60 min: Equipment Setup

- [ ] Laptop fully charged + charger plugged in
- [ ] Phone fully charged (>80%) + charger available
- [ ] **Expo Go** installed on demo phone (frontend runs via Expo Go, not standalone)
- [ ] Phone demo app tested and working (run full demo flow once)
- [ ] Mobile hotspot ready (backup for venue WiFi)
- [ ] USB-C / HDMI adapter for projector tested
- [ ] Slides open and on correct screen (full screen mode tested)
- [ ] Backend running and responding (`/api/health` endpoint returns 200)
- [ ] Redis instance alive and connected
- [ ] Twilio credentials valid (test call to team member phone)
- [ ] EMERGENCY_NUMBER set to team member's phone (NOT 112/194)
- [ ] Simulated dispatcher endpoint running (second FastAPI process or mock)
- [ ] WebSocket connections tested (backend → phone)

## T-45 min: Venue Check

- [ ] Test projector connection (check aspect ratio, resolution)
- [ ] Check that slides are readable from the back row
- [ ] Check WiFi speed (if <5 Mbps, switch to hotspot)
- [ ] Identify power outlets near presentation area
- [ ] Phone stand or surface for demo phone (visible to judges)
- [ ] Sound check: Twilio voice audible through speakers/laptop?

## T-30 min: Team Briefing

- [ ] Everyone has read PRESENTER_POCKET_CARD.md today
- [ ] Lead Presenter reviewed JUDGE_CHEAT_SHEET.md
- [ ] Stats update confirmed: **430M** (not 466M) — check STATS_QUICK_REFERENCE.md
- [ ] Slide transitions rehearsed: Lead → Tech Lead at Slide 5/6 boundary
- [ ] Demo operator knows exact moment to press SOS
- [ ] Backup: recorded demo video accessible (which device?)
- [ ] Q&A roles assigned:
  - Who answers technical questions?
  - Who answers business/market questions?
  - Who answers research/user questions?
- [ ] Confirm who manages slide clicker

## T-15 min: Final Run

- [ ] One complete timed run-through (target: 600s ± 15s)
- [ ] Time the demo specifically (target: ~42s)
- [ ] Practice the TWO presenter transitions
- [ ] Practice the opening silence (Slide 1 — let the room get quiet)
- [ ] Practice the closing pause (after green screen, 2-second silence before speaking)

## T-5 min: Last Checks

- [ ] Phone on DO NOT DISTURB (no notifications during demo!)
- [ ] Laptop on DO NOT DISTURB
- [ ] Close all other apps/tabs on presentation laptop
- [ ] Water for presenters
- [ ] Clicker working (backup: have someone at laptop for manual advance)
- [ ] Breathe. You're ready.

---

## Demo Flow (42 seconds, memorize this)

```
T+0s:   SOS button held → ring animation fills
T+1s:   Session created, TRIAGE phase begins
T+2.5s: Transcript: "Medicinski hitan slučaj detektovan"
T+5.5s: Transcript: "Lokacija potvrđena" — confidence 80%
T+7s:   Clinical fields set — confidence 100% → LIVE_CALL
T+10.5s: Dispatcher voice: "Hitna služba, šta se desilo?"
T+12s:  AI delivers structured brief in Serbian
T+20s:  Dispatcher: "Da li je pacijent pri svesti?"
T+23s:  Answer relayed back to dispatcher
T+36s:  Dispatcher: "Šaljemo ekipu. ETA 8 minuta."
T+38s:  🟢 GREEN SCREEN: "✓ Pomoć je na putu — ETA: 8 min"
```

**COMPLETE SILENCE during demo.** No talking. Let the system speak.

---

## If Something Goes Wrong

| Problem | Action | Reference |
|---------|--------|-----------|
| Demo crashes | Switch to recorded video immediately. Say: "Ovo je snimak iste demonstracije." | DEMO_FALLBACK_PLAN.md Tier 2 |
| WiFi dies | Switch to mobile hotspot. If no data, go to recorded video. | DEMO_FALLBACK_PLAN.md Tier 3 |
| Projector fails | Present from laptop screen. Team gathers close. | DEMO_FALLBACK_PLAN.md Tier 4 |
| Running over time | Cut ✂️ content in Slides 2, 3, 10 as marked in pitch script | PRESENTER_POCKET_CARD.md |
| Judge asks unknown question | "That's a great observation. We haven't fully addressed that yet — it's on our post-hackathon roadmap." | QA_EXTENDED.md §Safety |
| Slide won't advance | Manual advance from laptop. Never apologize — just fix it. | — |

---

## Key Numbers to Memorize

From **STATS_QUICK_REFERENCE.md** (⚠️ UPDATED March 29):

| Number | What it means |
|--------|---------------|
| **430M** | People with disabling hearing loss worldwide (WHO) |
| **84K** | Deaf + HoH in Serbia (14K deaf + 70K HoH) |
| **0** | Countries with full equivalent 112 access |
| **$0.13** | Cost per Medak call |
| **$20-40** | Cost per human relay call |
| **~150×** | Cost advantage |
| **38s** | SOS → help confirmed (demo time) |
| **0.85** | Confidence threshold |
| **52M** | Deaf/HoH in EU (EUD) |
| **Jun 2027** | EECC compliance deadline |

---

## Post-Presentation

- [ ] Save demo recording (screen record if possible)
- [ ] Note any judge questions you didn't answer well → update Q&A docs
- [ ] Thank judges individually if opportunity arises
- [ ] Celebrate 🎉

---

*Print 2 copies: one for Lead Presenter, one for Tech Lead.*
