# P09: Emergency Services Communication Agent — Innovation Evaluation

## 1. What Exists Today?

### Commercial/Deployed Solutions
- **accesSOS** (US nonprofit): Text-to-911 app with icon-based interface. Available only in California and New Mexico. Converts text to 911 phone calls. No AI — purely a routing bridge. Reach: ~11,300 users. US-only, requires text-to-911 infrastructure at the PSAP.
- **Serbia "SOS for the Deaf"** app (gov-backed, presented 2023): Video relay service where a deaf person video-calls a human sign language interpreter who then voice-calls the emergency number. Serves ~14,000 deaf users in Serbia. Depends entirely on interpreter availability — not real-time autonomous.
- **Corti AI** (Denmark): AI that *assists dispatchers* by listening to emergency calls and detecting cardiac arrest from voice patterns/background sounds. Deployed in Copenhagen, piloted in France and Italy via EENA. 95% cardiac arrest detection vs 73% for human dispatchers. But this is dispatcher-side AI — it doesn't help the *caller* communicate.
- **RapidSOS** (US): Sends location/health data to 911 centers. Panic button, but no intelligent communication bridge. Data pipeline, not a conversation system.
- **Silent Beacon / ResQ Button**: Hardware panic buttons that send location + alerts. No understanding of caller's condition or communication needs.
- **EU 112 SMS**: Some EU countries allow SMS to 112, but coverage is inconsistent. Most EU states only offer voice calls. No structured intake, no sign language support.

### Research/Pilot-Stage
- **ODIN 112** (Romania): EU pilot testing emotion detection, chatbot-based structured input for emergency calls. Still in pilot; limited to Romanian context.
- **NOTITIA** (EU): Structured dialogue templates for call-takers communicating with cognitively impaired callers. Beta stage, no embedded medical reasoning.
- **Gladia / NatalíA**: Real-time speech-to-text transcription for 112 centers. Accuracy drops significantly in high-stress, noisy conditions.
- **DispatchMAS** (2026 paper, arxiv): Multi-agent LLM system simulating dispatcher-caller interactions with taxonomy-grounded approach. AutoGen-based, 94% correct dispatch. But this is a *training simulator*, not a caller-facing tool.
- **LLM-based fragmented speech reconstruction** (2024 paper, arxiv): System that uses LLMs to reconstruct fragmented/panicked speech and fill contextual gaps for dispatchers. Academic proof-of-concept.

### Key Gaps in Existing Solutions
- **No system combines**: sign language recognition + fragmented speech understanding + structured emergency info extraction + dispatch communication + accessible caller feedback — into a single integrated pipeline.
- **Caller-side AI is virtually nonexistent**: All AI systems (Corti, ODIN, DispatchMAS) sit on the dispatcher side. Nobody has built an AI agent that acts *on behalf of the caller*.
- **EU/Serbia**: Text-to-911 doesn't exist. Serbia's relay service requires human interpreters (limited supply). No AI-powered solution exists for this region.

## 2. Hackathon Prior Art

Several hackathon projects have explored adjacent spaces:

- **SignSOS** (KitaHack, 2026): Sign language → text → audio for emergency responders. Uses MediaPipe + TensorFlow. Basic sign recognition to text pipeline, one-way communication focus.
- **CallBridge** (Singapore Community Hackathon, 2025): STT/TTS bridge for deaf callers. Basic speech-to-text and text-to-speech relay. No AI intelligence — just format conversion.
- **GestureLink** (Smart India Hackathon, 2024): Indian Sign Language translation app. General-purpose, not emergency-specific.
- **SignBridge 3D** (hackathon project, 2025): Real-time AI-mediated deaf↔hearing communication with 3D avatar. Healthcare/emergency focus. Frontend architecture demo — AI models designed as "plug-in" points, not implemented.
- **SignLink** (Devpost): Sign language detection for limited emergency vocabulary (10 signs). Very basic proof of concept.
- **Sign Language AI** (Gemini 3 Hackathon, Egypt, 2026): Emergency location sharing + deaf assist chatbot. Egypt-focused, one-tap silent alert.

### Pattern Observed
All hackathon projects fall into one of two buckets:
1. **Sign language recognition → text** (one modality, one direction)
2. **Basic text relay to emergency services** (format conversion, no intelligence)

**Nobody has built a multi-agent system that**: understands diverse impaired inputs (sign, fragmented speech, confusion), reasons about the emergency, structures it for dispatch, and provides bidirectional accessible communication. This is the innovation gap.

## 3. Before AI vs. After AI

### Before AI (current state for most of the world)
- Deaf person in Serbia has a cardiac emergency → must find phone → open SOS for Deaf app → wait for a human interpreter to be available → interpreter calls 112 → interpreter relays back and forth. **Latency: 3-10 minutes if interpreter is available at all.**
- Person with speech disability → calls 112 → dispatcher can't understand → caller repeats/gets frustrated → dispatcher may misinterpret → wrong response. **Accuracy: extremely low.**
- Confused elderly person who fell → calls 112 → can't articulate location/what happened → dispatcher asks structured questions → caller can't answer coherently → dispatcher sends generic response. **Quality: suboptimal.**
- Text-to-911: Not available in Serbia/most of EU. Even where available, requires literacy, composure, and typing ability under extreme stress.

### After AI (proposed solution)
- Deaf person in cardiac emergency → opens app → signs/gestures at camera → AI recognizes signs, extracts emergency type + severity → AI constructs structured emergency message → AI communicates with dispatch (via API/text/voice synthesis) → AI relays dispatch responses back as visual/signed content. **Latency: seconds. No human interpreter needed.**
- Fragmented/impaired speech → AI processes audio, reconstructs meaning from fragments using LLM context understanding → extracts: location, emergency type, severity, number of people → sends structured data to dispatch.
- Confused elderly caller → AI detects confusion patterns → switches to simple yes/no questions → uses phone sensors (GPS, accelerometer for fall detection) → supplements caller's fragmented info with sensor data → constructs coherent emergency report.

### The AI Delta
| Capability | Before AI | After AI |
|---|---|---|
| Sign language → emergency dispatch | Human interpreter (if available) | Real-time AI recognition |
| Fragmented speech understanding | Dispatcher guesses | LLM reconstructs meaning |
| Confused/incoherent caller | Repeated questions, frustration | Adaptive questioning + sensor fusion |
| Structured emergency info extraction | Manual by dispatcher | Automated multi-modal inference |
| Bidirectional accessible feedback | Text-only (if available) | Visual, signed avatar, simplified text |
| Availability | Business hours (relay services) | 24/7 autonomous |
| Language coverage | Limited to interpreter availability | Multilingual models |

## 4. Novel Angle — What Makes This Different?

The truly novel angle is the **multi-agent architecture acting as a caller-side AI proxy**:

1. **Input Understanding Agent**: Handles diverse impaired inputs — sign language via camera, fragmented speech via microphone, simple taps/gestures for minimal interaction. This isn't just translation — it's *inference under uncertainty* (what does a confused person actually need?).

2. **Emergency Reasoning Agent**: Takes fragmented/uncertain input and reasons about the emergency. Combines caller input with phone sensor data (GPS, accelerometer, time of day, health profile if available). Generates a structured emergency report with confidence levels.

3. **Dispatch Communication Agent**: Translates the structured emergency report into whatever format the local dispatch system accepts (voice call with TTS, text message, NG911 API). Handles the back-and-forth with dispatch, asking clarifying questions and routing answers back.

4. **Caller Feedback Agent**: Keeps the caller informed in their accessible format — visual status updates, simplified text, potentially sign language avatar responses, vibration patterns for deafblind users.

**The key insight**: This isn't "sign language translator for 911" (done before). It's an **AI agent that acts as your emergency voice** — understanding your impaired communication, reasoning about what you need, and advocating for you to the emergency system. It's the difference between a translator and an advocate.

### Unique Technical Challenges (Demo-Worthy)
- **Inference under extreme uncertainty**: Caller is panicking, confused, injured. Input is noisy, fragmented, incomplete. The system must make life-critical decisions with partial information.
- **Multi-modal fusion**: Combining camera input (signs/gestures), audio (fragmented speech, background sounds like Corti does), phone sensors (location, movement), and user profile data.
- **Adaptive interaction**: System detects caller's capability level and adjusts — from full sign language conversation down to binary yes/no taps.
- **Structured output for dispatch**: Converting messy real-world input into the precise structured data dispatch needs (location, emergency type, severity, number of patients, special needs).

## 5. Can Non-AI Get 80% There?

### What non-AI can do:
- **Text-to-911 relay** (accesSOS model): ~40% of the problem. Works for literate, calm users who can type. Doesn't work for: sign language users, speech-impaired, confused elderly, anyone too panicked to type coherently.
- **Pre-programmed emergency buttons**: "I need ambulance at [GPS location]" — one-tap SOS. Gets ~30% there. Sends location + generic "help needed" but no context about what's wrong.
- **Video relay services** (Serbia's current model): Human interpreters bridge the gap. Gets ~60% there for deaf users specifically. But: limited availability (only ~7 interpreters for 6,000+ deaf people in Singapore; similar ratios everywhere), not 24/7, doesn't help speech-impaired or confused callers.
- **Pre-filled emergency profiles**: Store medical info, emergency contacts, conditions. Gets ~20% supplementary value.

### What requires AI:
- **Understanding fragmented/impaired speech**: LLM-level language understanding. Rule-based systems fail completely on "I... fell... can't... help... chest..." 
- **Real-time sign language recognition**: Computer vision + ML. No rule-based alternative exists.
- **Reasoning about emergency type from partial information**: "Caller is elderly, fell (accelerometer), can't speak clearly, mentions chest" → cardiac emergency, not just a fall. This requires contextual reasoning.
- **Adaptive questioning**: Dynamically adjusting interaction based on caller's apparent capability. This is inherently an AI problem.
- **Multi-modal fusion**: Combining audio + visual + sensor data to build a coherent emergency picture.

### Verdict: Non-AI gets ~35-40% there
The basic infrastructure (GPS location, pre-programmed messages, text relay) handles the simplest cases. But the *core value proposition* — understanding impaired communication and reasoning about emergencies — is fundamentally an AI capability. You cannot build a rule-based system that understands a panicking deaf person's signs, a stroke victim's fragmented speech, or a confused elderly person's incoherent description.

## 6. Theme Fit: "Giving Access to Something Impossible Before AI"

### Perfect Alignment ✅

This is arguably the **strongest possible theme fit** among accessibility problems:

**What was literally impossible before AI:**
- A deaf person independently calling emergency services without a human interpreter → Now possible via AI sign language recognition
- A person with severe speech disability communicating emergency details to dispatch → Now possible via AI speech reconstruction
- A confused/disoriented person (stroke, fall, dementia) getting appropriate emergency help despite inability to articulate the problem → Now possible via AI inference from partial input + sensor fusion
- 24/7 emergency access regardless of interpreter availability → Now possible via autonomous AI agents

**Why this is "impossible, not just hard":**
- The relay service model (human interpreter) is the pre-AI "best case" and it's fundamentally limited by human availability. At 3 AM when someone has a cardiac emergency, there may be no interpreter available. Period.
- Text-to-911 requires the caller to be literate, calm, and able to type — excluding exactly the people who need help most.
- There is NO non-AI technology that can understand sign language, fragmented speech, or confused communication and translate it into structured emergency information.

**The emotional narrative:**
"Before AI, a deaf person having a heart attack at 3 AM in Belgrade had no way to call for help. They could try to text a family member and hope they're awake. They could try to get to a neighbor's door. They could try to drive themselves to a hospital while having a cardiac event. With this system, they open an app, sign 'chest pain, can't breathe,' and within seconds, an ambulance is dispatched to their GPS location with the right medical context."

This is as close to "giving access to something that could not be made accessible before AI" as it gets.

## Scoring Summary

| Dimension | Score | Notes |
|---|---|---|
| Problem severity | 10/10 | Life-or-death. People literally die from this gap. |
| Existing solutions gap | 8/10 | AccesSOS exists but US-only, no AI. Serbia relay service exists but human-dependent. |
| Hackathon prior art | 7/10 | Sign→text projects exist but none with multi-agent architecture or emergency reasoning. |
| AI necessity (non-AI ceiling) | 9/10 | ~35-40% achievable without AI. Core value proposition requires AI. |
| Novel angle | 8/10 | "AI as caller's emergency voice" is novel. Multi-agent + multi-modal + adaptive interaction is new. |
| Technical feasibility for hackathon | 7/10 | Can demo sign recognition + LLM reasoning + structured output. Full system is complex but MVP is achievable. |
| Theme fit | 10/10 | Perfect alignment. This IS what the theme was made for. |
| Emotional impact / demo potential | 9/10 | Live demo of signing at camera → ambulance dispatched is incredibly powerful. |

---

## INNOVATION SCORE: 8/10

**Rationale**: Near-perfect theme alignment and life-or-death problem severity. Loses points because: (1) the individual components (sign language recognition, speech-to-text, LLM reasoning) are not novel — the innovation is in combining them for emergency context; (2) several hackathon projects have explored the sign-language-to-emergency-services space, though none with this multi-agent architecture; (3) accesSOS and Serbia's relay service show that *some* form of non-voice emergency access exists (even if inadequate). The multi-agent architecture as a "caller-side AI proxy" is the genuinely novel framing, and the emergency reasoning under uncertainty is technically interesting. Strong 8 — would be 9 if there were zero prior art in the emergency-sign-language space.
