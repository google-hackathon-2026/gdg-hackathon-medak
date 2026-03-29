# DEMO_SETUP.md — Live Demo Playbook

> **Read this once. Follow it exactly. Total setup time: 5 minutes.**
> 
> This covers EVERYTHING: physical setup, network, video strategy, audio, presenter choreography, and backup plans.

---

## TL;DR — The Setup

- **2 screens:** Phone (real app) + Laptop (demo dashboard on projector/external monitor)
- **Network:** Backend on laptop, phone connects via laptop hotspot — zero venue WiFi dependency
- **Video:** Live camera preview on phone (back camera pointed at "scene"), demo agent ignores it — judges see it, that's what matters
- **Audio:** Text-only transcript bubbles. No TTS. Clean and fast.
- **Duration:** ~42 seconds SOS → RESOLVED
- **One person** holds the phone. **One person** narrates (before and after demo). **During the demo: silence.**

---

## 1. Physical Setup at Venue

### What You Need

| Item | Purpose | Backup |
|------|---------|--------|
| **Phone** (Android or iOS, Expo Go installed) | Runs the Medak app | Second phone with same setup |
| **Laptop** (presenter's) | Runs backend + shows dashboard | Pre-recorded screen recording |
| **HDMI/USB-C adapter** (for laptop) | Connects laptop to projector/TV | Just turn the laptop screen toward judges |
| **Phone stand / prop on table** | Positions phone visibly | Someone holds it at chest height |

### Screen Layout

**Screen 1 — Phone:** The Medak app. Judges should see this clearly.

**Screen 2 — Laptop/Projector:** `demo_dashboard.html` — the live event log with confidence bar, phase indicator, checklist, and timer.

### How Judges See the Phone

**Option A (best):** Phone on a stand/table, angled so judges can see the screen. Presenter stands next to it and narrates. Judges are close enough at hackathon presentations (usually 2-3 meters) to see a phone screen.

**Option B:** Screen mirroring to a second monitor/projector. Android: Scrcpy via USB cable (requires laptop with ADB). iOS: QuickTime via Lightning/USB-C cable. **Wireless mirroring (AirPlay/Miracast) is unreliable at venues — avoid it.**

**Option C (fallback):** One person holds the phone and slowly pans it toward each judge. Hackathon judges are used to this.

### If Venue Has No Projector/HDMI

Just use the laptop screen directly. Open `demo_dashboard.html` full-screen in Chrome, turn the laptop toward judges. The dashboard has large fonts and high contrast for exactly this reason.

### 5-Minute Setup Checklist

```
□ Laptop open, backend running (terminal in background)
□ Chrome open with demo_dashboard.html (don't connect WS yet)
□ Phone on stand/table, Expo Go app open, Medak loaded
□ Phone connected to laptop's hotspot
□ HDMI cable connected to projector (if available)
□ Quick test: tap SOS on phone, verify dashboard sees it → reset
```

---

## 2. Phone App During Demo

### What Judges See on the Phone (screen-by-screen)

**Phase 1 — Home (before demo starts):**
Three big buttons: Hitna pomoć / Policija / Vatrogasci. Clean, obvious, accessible.

**Phase 2 — Tap "Hitna pomoć":**
Brief loading spinner → transitions to session screen.

**Phase 3 — TRIAGE (T+0 to T+7):**
- **Background:** LIVE CAMERA FEED (back camera). This is already in the code — `session.tsx` renders `<CameraView>` during INTAKE, TRIAGE, and LIVE_CALL phases when camera permission is granted.
- **Foreground overlay:** Status bar ("Analiza u toku"), confidence progress bar climbing from 0% → 100%, transcript bubbles appearing one by one: "Analiziram okolinu...", "Medicinski hitan slučaj detektovan.", "Lokacija potvrđena...", etc.
- **Visual effect:** Camera feed is LIVE but slightly behind the transcript overlay — it looks like the AI is analyzing what the camera sees. This is the money shot.

**Phase 4 — LIVE_CALL (T+7 to T+38):**
- Yellow "Poziv u toku — Hitna pomoć (194)" header banner
- Camera feed still visible in background
- Transcript bubbles showing the 112 conversation (agent ↔ dispatcher)
- **Question overlay pops up** when dispatcher asks something — "Da li je pacijent pri svesti?" with DA/NE buttons. Appears for ~5 seconds, auto-dismissed (demo user agent answers automatically, but judges SEE the relay mechanism on screen)

**Phase 5 — RESOLVED (T+38):**
- Green background fills the screen
- Giant "✓ Pomoć je na putu — ETA: 8 min"
- "Ostanite na lokaciji i sačekajte dolazak ekipe"
- Phone haptic burst (success vibration)
- **This is the applause moment.**

### Camera Feed — Already Works!

Looking at `session.tsx`, the camera preview is ALREADY rendered during INTAKE, TRIAGE, and LIVE_CALL:

```tsx
{(phase === "INTAKE" || phase === "TRIAGE" || phase === "LIVE_CALL") &&
  cameraPermission?.granted && (
    <CameraView ref={cameraRef} style={styles.cameraPreview} facing="back" ... />
  )}
```

The camera will capture frames and send them via WebSocket (`sendVideoFrame`). In demo mode, the backend simply ignores the video frames (demo_user_agent doesn't process them). But the phone screen SHOWS a live camera view with transcript bubbles overlaid on top.

**No code changes needed for this.** The visual effect already works.

---

## 3. The Video Question — CRITICAL Decision

### Recommendation: Option C+D Hybrid — Live Camera on Real Scene

**Point the phone's back camera at a team member lying on the floor.**

Here's why this is the best option:

| Option | Impressive? | Risky? | Effort | Verdict |
|--------|------------|--------|--------|---------|
| A. Camera preview, agent ignores it | Medium — feels passive | Low | Zero | Backup |
| B. Pre-recorded video playback | Low — judges might notice it's a video | Medium | Need to record, integrate | No |
| C. Team member on floor, live camera | **HIGH** — tangible, real, dramatic | Low | Zero code | **YES** |
| D. Camera + transcript overlay | **HIGH** — looks like AI "seeing" | Low | Already works | **YES** |

### How to Execute This

1. **Before the demo** (during setup): One team member lies on the floor near the presentation area. Not dramatic acting — just lying still, maybe on their side. They can get up after RESOLVED.
2. **The phone is on a stand** on a table near the "victim," back camera pointing down/toward them.
3. **When presenter taps SOS:** The phone camera shows the person on the floor. Transcript bubbles overlay: "Analiziram okolinu... Detektujem osobu na podu." — judges see the camera feed PLUS the AI's "analysis." It looks like the system is actually recognizing the scene.
4. **The demo agent's scripted text matches the visual** — it says "Starija žena leži na podu kuhinje, moguć moždani udar" while the camera literally shows someone on the floor.

**Why this works:** The demo agent's output is scripted to match what you stage. The camera preview is real. The transcript is real. The fact that the agent isn't actually processing the video frames is invisible — judges see camera + matching transcript = "the AI understands what it's seeing."

**Risk assessment:**
- What if team member giggles? Tell them to close their eyes and stay still for 40 seconds. It's not hard.
- What if judges ask "is the AI really processing the video?" Be honest: "In the live version, yes — Gemini 2.0 Flash Live processes video frames in real-time. For the demo, we scripted the scenario for reliability, but the same tool calls and data flow would occur."

### If You Don't Want Someone on the Floor

Just point the phone camera at anything — a jacket on the floor, a backpack, whatever. The transcript will still say "Detektujem osobu na podu" and judges will get the point. The visual of the camera being active while the AI narrates is what matters.

---

## 4. Audio During Demo

### Recommendation: Text-Only. No TTS.

**Why no audio:**

1. **Speed:** The demo runs in 38 seconds. TTS would need buffering, speaker volume management, and adds a full-system failure point for zero incremental value.
2. **The target user is deaf.** Audio is literally irrelevant to Ana's experience. The whole point is that Medak works WITHOUT the user hearing anything. Text bubbles on screen ARE the interface.
3. **Venue audio is unpredictable.** Speaker quality, volume, echo, background noise from other teams. Text on screen always works.
4. **Simplicity wins at hackathons.** Every additional component is a potential failure. Text transcripts are already implemented and beautiful.

### What About the 112 Call Audio?

The dispatch conversation appears as text bubbles in the transcript, with different speakers visually distinguished. The dashboard on the projector shows it in the event log with color-coded speakers (blue = agent, orange = 112 dispatcher, green = user).

This is more than sufficient. Judges read faster than they listen.

### If You Really Want Audio (Not Recommended)

If the team insists, the lowest-effort option:
- Use the Web Speech API (`SpeechSynthesisUtterance`) in the demo_dashboard.html to speak the dispatch transcript aloud
- Serbian TTS is available in Chrome on most systems
- Add ~10 lines to the dashboard's `handleMessage` function
- But seriously, don't. Text is better for this demo.

---

## 5. Network Setup

### Recommended Architecture: Laptop Hotspot

```
┌─────────────┐    WiFi Hotspot    ┌────────────────┐
│  Phone      │ ◄──────────────── │  Laptop         │
│  (Expo Go)  │    192.168.x.x    │  (Backend +     │
│             │                    │   Dashboard)    │
└─────────────┘                    └────────────────┘
```

**Why not venue WiFi:**
- Hackathon WiFi is always overloaded (100+ people, all streaming/pushing code)
- Captive portals, network isolation between devices, random disconnects
- You can't control it. A hotspot you can.

### Setup Steps

**On the laptop:**

```bash
# 1. Start a WiFi hotspot (varies by OS)
#    macOS: System Preferences → Sharing → Internet Sharing
#    Linux: nmcli device wifi hotspot ssid MedakDemo password medak2026
#    Windows: Settings → Mobile hotspot

# 2. Start the backend
cd medak/backend
DEMO_MODE=true REDIS_URL=fakeredis:// python -m uvicorn main:app --host 0.0.0.0 --port 8080

# 3. Open dashboard in browser
# Navigate to http://localhost:8080/demo_dashboard.html
# (or serve it separately — it just needs WebSocket access to the backend)
```

**On the phone:**

```
1. Connect to the laptop's hotspot WiFi
2. Set EXPO_PUBLIC_API_URL to http://<laptop-hotspot-ip>:8080
   (usually 192.168.137.1 on Windows, 192.168.2.1 on macOS)
3. Open Expo Go → load the app
4. Verify: tap any emergency button → should see the session screen
```

**Finding the laptop's hotspot IP:**
```bash
# macOS
ifconfig bridge100 | grep inet   # usually 192.168.2.1

# Linux
ip addr show | grep 192.168      # look for the hotspot interface

# Windows
ipconfig | findstr 192.168        # usually 192.168.137.1
```

### What if Hotspot Doesn't Work?

**Fallback 1:** Both devices on the same WiFi (venue WiFi or phone's personal hotspot).
**Fallback 2:** Deploy backend to Cloud Run and point everything at the public URL. Requires internet but removes local networking hassles.
**Fallback 3:** USB tethering from phone to laptop, run everything over the USB network interface.

### Config Checklist

| Setting | Value |
|---------|-------|
| `DEMO_MODE` | `true` |
| `DEMO_SCENARIO` | `stroke_neighbor` |
| `REDIS_URL` | `fakeredis://` (no Redis needed) |
| `EXPO_PUBLIC_API_URL` | `http://<laptop-ip>:8080` |

---

## 6. Backup Plans

### Failure → Recovery Matrix

| Failure | Detection | Recovery | Time to recover |
|---------|-----------|----------|----------------|
| **Phone crashes/freezes** | Screen goes black or app closes | Open Expo Go again, reload app, re-tap SOS | ~15 seconds |
| **Backend crashes** | Dashboard disconnects, phone shows "connecting" | Re-run `uvicorn` command, phone auto-reconnects (3 retries) | ~10 seconds |
| **WebSocket disconnects** | Dashboard shows "Disconnected" red dot | Auto-reconnects up to 3 times. If fails: restart backend + refresh dashboard | ~5-15 seconds |
| **Hotspot drops** | Phone loses WiFi | Reconnect phone to hotspot, restart demo | ~20 seconds |
| **EVERYTHING fails** | Murphy's law | **Play the screen recording** | ~5 seconds |

### The Nuclear Backup: Screen Recording

**Before the presentation, record one perfect demo run:**

1. Start a screen recording on the phone (Android: built-in, iOS: Control Center)
2. Start a screen recording on the laptop (OBS or built-in)
3. Run the full demo: SOS → RESOLVED
4. Save both recordings

If everything fails during the live demo:
- Phone recording: play it from the phone gallery
- Laptop recording: play it in fullscreen on the projector
- Say: "We had a technical issue, but here's a recording from our test run 30 minutes ago — everything you're about to see is the real system."

**Judges understand.** It's a hackathon. They've seen demos fail before. A recording is 10x better than standing there saying "it was working earlier."

### Pre-Demo Sanity Check (5 min before presenting)

```
□ Backend running? (curl http://localhost:8080/docs returns FastAPI docs)
□ Phone connected to hotspot? (phone can load http://<laptop-ip>:8080/docs)
□ Quick SOS test → see session on dashboard? 
□ Reset for clean slate (restart backend or call demo reset endpoint if implemented)
□ Screen recordings saved on both phone and laptop?
□ "Victim" team member in position?
□ Phone on stand, camera pointing at scene?
```

---

## 7. Presenter Choreography

### Roles (5 people)

| Person | Role | Where they stand |
|--------|------|------------------|
| **Person 1: Narrator** | Introduces scenario, narrates before/after demo, handles Q&A | Front-center, facing judges |
| **Person 2: Phone operator** | Taps SOS button, holds/positions phone | Next to the phone/stand |
| **Person 3: "Victim"** | Lies on the floor during demo | On the floor near the phone |
| **Person 4: Tech backup** | Monitors laptop/backend, handles any failures | Behind the laptop, out of judges' line of sight |
| **Person 5: Architecture explainer** | Explains technical details after demo | Front, takes over from narrator for tech deep-dive |

### Timing Script

```
TIME        WHO                 DOES WHAT                       JUDGES LOOK AT
─────────   ──────────────────  ────────────────────────────    ──────────────────
-60s        Person 3            Gets into position on floor     (setup, ignored)
-30s        Person 4            Verifies backend is running     Laptop (briefly)
-10s        Person 2            Opens Medak app on phone        Phone

 0:00       Person 1 (narrator) "Ovo je Ana. Gluva je od       Narrator
                                 rodjenja. Živi sama u 
                                 Beogradu..."

 0:15       Person 1            "Njena komšinica Milica je      Narrator → Phone
                                 upravo kolabirana. Mogući      
                                 moždani udar."

 0:25       Person 1            "Ana ne može da pozove 112.     Phone
                                 Ali ima Medak."
                                [Points to phone] "Gledajte."

 0:28       Person 1            STOPS TALKING. Silence.         Phone
            Person 2            Taps "Hitna pomoć"

 0:30       —                   Demo auto-runs                  Phone + Dashboard
            (T+0 to T+7)       Camera shows "victim"           
                                Transcripts appear              
                                Confidence bar climbs           

 0:37       —                   Phase: LIVE_CALL                Dashboard (call status)
            (T+7 to T+38)      112 conversation appears        Phone (transcript)
                                Question overlay flashes

 1:06       —                   RESOLVED. Green screen.         Phone (green ✓)
            (T+38)              ETA: 8 min                      

 1:08       Person 1            "Od SOS dugmeta do potvrde      Narrator
                                 hitne pomoći — 38 sekundi.
                                 Bez ijedne izgovorene reči."

 1:15       Person 1            "Dva AI agenta. Jedan poziv.    Narrator
                                 Jedan spašen život."

 1:20       Person 3            Gets up from floor              (comic relief, brief laugh)

 1:25       Person 5            "A sada — kako to radi          Dashboard / Slides
                                 ispod haube..."
                                [Architecture explanation]
```

### The Golden Rule: SILENCE During the Demo

**From the moment SOS is tapped until RESOLVED appears: nobody speaks.**

Let the system do the talking. The transcript bubbles, the confidence bar, the phase transitions — they tell the story. Narration during the demo COMPETES with what judges are reading on screen.

The silence IS the demo. Ana can't speak. The system speaks for her. The judges experience what Ana would experience: watching text appear on screen while the AI handles everything.

---

## 8. Making It Feel Real

### Props and Staging

**Use:**
- ✅ Phone on a table/stand (how Ana would actually use it)
- ✅ One person lying on the floor (the "victim" — sells the scenario)
- ✅ Camera pointed at the person (ties the visual to the transcript)
- ✅ Silence during the demo (THE most powerful choice you can make)

**Don't bother:**
- ❌ Sound effects (adds complexity, no value)
- ❌ Dimming lights (you're in a hackathon venue, not a theater)
- ❌ Elaborate costumes or acting (overkill, might look silly)
- ❌ Multiple camera angles (one phone, one camera, keep it simple)

### The "Lying on the Floor" Move

This is your single best prop investment. Zero cost, maximum impact:

1. Person 3 is already on the floor BEFORE the narrator starts talking
2. Narrator says "Njena komšinica Milica je upravo kolabirana" while gesturing toward the person
3. Phone camera is pointing at them
4. When the transcript says "Detektujem osobu na podu" — the judges SEE a person on the floor through the camera
5. When RESOLVED hits, Person 3 can sit up and smile — small laugh from judges, breaks tension

**Coaching for Person 3:** Lie on your side, eyes closed, don't move for 60 seconds. That's it. You're not acting in a movie. You're just being still.

### Making the Dashboard Look Professional

The dashboard already has:
- Dark theme (looks great on projectors)
- Color-coded log entries (blue/orange/green/purple)
- Animated confidence bar
- Phase badges with distinct colors
- Real-time timer

**For maximum impact on projector:**
- Chrome full-screen mode (F11)
- Zoom in to 125-150% if projector resolution is low
- Make sure the session ID is pre-filled (or use URL hash: `demo_dashboard.html#SESSION_ID`)

### The Emotional Arc

```
Setup:     Curiosity  ("what is this app?")
Scenario:  Empathy    ("oh, she's deaf, she can't call for help")
SOS tap:   Tension    ("will this actually work?")
Triage:    Amazement  ("it's analyzing the scene in real-time!")
Live call: Wow        ("it's TALKING to 112 for her!")
Relay:     Magic      ("the dispatcher's question appeared on her phone!")
Resolved:  Relief     ("38 seconds. Help is coming.")
Silence:   Impact     (let it sink in)
```

The silence after RESOLVED before the narrator speaks is important. Give judges 2-3 seconds to absorb what they just saw.

---

## Appendix A: Quick-Start Commands

### Laptop Setup (One Terminal)

```bash
cd medak/backend

# Create .env if not exists
cat > .env << 'EOF'
DEMO_MODE=true
DEMO_SCENARIO=stroke_neighbor
REDIS_URL=fakeredis://
GOOGLE_API_KEY=not-needed-in-demo-mode
EOF

# Activate venv and run
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8080 --log-level info
```

### Phone Setup

```
1. Connect to laptop hotspot WiFi
2. Open Expo Go
3. Set API URL: http://<laptop-ip>:8080
4. Load Medak app
5. Grant camera + microphone permissions when prompted
```

### Dashboard Setup

```
1. Open Chrome on laptop
2. Navigate to http://localhost:8080/demo_dashboard.html
3. (Or open the file directly and update the WebSocket URL)
4. Don't connect yet — wait for the demo
5. When SOS is tapped, paste the session ID and click Connect
   (Or: auto-connect from URL hash — Person 4 handles this)
```

### Auto-Connect the Dashboard

Person 4's job during the demo:
1. Watch the backend terminal for `Session created: <session_id>`
2. Quickly paste the session ID into the dashboard input and click Connect
3. Dashboard goes live, starts showing real-time events

**Better approach (if time to implement):** Add auto-discovery — dashboard polls a `/api/sessions/latest` endpoint and auto-connects. Or have the SOS endpoint return the session ID and Person 2 reads it out.

---

## Appendix B: Common Pitfalls

| Pitfall | How to avoid |
|---------|-------------|
| Phone can't reach backend | Test connectivity BEFORE the presentation. `curl` from phone's browser. |
| Demo runs too fast, judges miss details | The ~42s timing is tuned for this. If too fast, increase delays in `demo_user_agent.py` (add 1-2s to each step) |
| Dashboard doesn't connect | Check WebSocket URL. If backend is on `0.0.0.0:8080`, dashboard WS URL should be `ws://localhost:8080/api/session/...` |
| Camera permission denied | Pre-grant permissions by opening the app once before the demo. Or add camera permission to `app.json` plugins. |
| Phone goes to sleep mid-demo | Disable auto-lock. Android: Developer options → Stay awake. iOS: Settings → Display → Auto-Lock → Never. |
| Expo Go shows dev menu | Shake detection is on by default. Turn it off: Settings in Expo Go, or build a production APK. |
| Backend already has a session from testing | Restart the backend fresh before presenting (kills all in-memory state + fakeredis) |
| Person 4 fumbles the session ID | Pre-agree on a signal. Person 2 can subtly show the phone to Person 4 after SOS. Or implement the auto-discovery endpoint. |

---

## Appendix C: If You Only Have 2 Minutes to Prepare

1. Backend running with `DEMO_MODE=true` ✓
2. Phone connected to same network as laptop ✓
3. Phone app open on home screen ✓
4. Dashboard open in browser ✓
5. Someone lying on the floor ✓

That's it. Everything else is polish.
