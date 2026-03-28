# Existing AI Accessibility Landscape & Whitespace Analysis

> Research compiled March 2026. Goal: map what exists, what Google/Vertex can do, what's won hackathons, and — most importantly — where the gaps are.

---

## 1. Current AI Accessibility Products

### 1.1 Vision / Blind & Low-Vision

| Product | What It Does | Pricing | Users | Major Limitations |
|---------|-------------|---------|-------|-------------------|
| **Be My Eyes + GPT-4** ("Be My AI") | AI-powered visual assistant via smartphone camera. Users take a photo or start a video call; GPT-4V describes scenes, reads text, identifies objects. Also connects to volunteer sighted helpers. | **Free** (funded by partnerships, notably with Microsoft/OpenAI). | 700K+ blind/low-vision users globally. | Requires internet + smartphone. No real-time continuous video (photo-based). Can hallucinate details. No offline mode. Latency on complex scenes. |
| **Microsoft Seeing AI** | iOS app: reads short text, documents, products (barcodes), people (face recognition), scenes, currency, color, light detection. Uses on-device + cloud AI. | **Free** (iOS only, no Android). | Millions of downloads since 2017. Primarily English-speaking blind users. | iOS-only (no Android!). Cloud-dependent for advanced features. Scene descriptions can be vague. Limited language support. No continuous real-time video narration. |
| **Google Lookout** | Android app: reads text, scans documents, describes scenes, identifies food labels, scans barcodes. Uses Gemini models for image descriptions. | **Free** (Android only). | Android users globally, but English-primary. Recently expanded to ~20 languages. | Android-only. Scene descriptions inconsistent. Requires internet for best results. Real-time mode is battery-intensive. Not as polished as Be My Eyes for conversational Q&A. |
| **Envision AI** | Smart glasses (Envision Glasses on Google Glass Enterprise) + phone app. Reads text, describes scenes, identifies people, video calling to sighted helpers. | **Glasses: ~$2,500-3,500**. App: free tier + $15/mo or $99/year for premium. | Small but dedicated user base. Tech-forward blind users + institutions. | Extremely expensive hardware. Glasses look dorky. Limited battery life (~3-4 hours). Requires internet. Small user community. |
| **Aira** | Live video call with trained human agents who describe surroundings in real-time. Also has AI features. Used in airports, campuses, retail. | **Free at 500+ "Aira Access" locations** (airports, Starbucks, etc.). Personal plans: $99-329/month. | ~200K users in US/Canada/Australia. | Very expensive for personal use. Dependent on human agents (limited availability). English-only. US-centric. Not scalable to developing countries. |
| **OrCam MyEye** | Clip-on camera device for glasses. Reads text, recognizes faces, identifies products, tells time, identifies colors/money. Runs on-device (no internet needed). | **$2,990-4,500** depending on model. | 100K+ users in 50+ countries. Older adults, low-vision users. | Extremely expensive. Clunky hardware. On-device AI is limited compared to cloud (can't do open-ended scene Q&A). No conversational AI — just preset functions. |

**Key Takeaway for Vision:** Be My Eyes is free and good but photo-based. OrCam works offline but costs $3-4K. Envision glasses are expensive. **No product offers affordable, real-time, conversational, multilingual visual assistance that works offline.** Google Lookout is closest to free + useful but Android-only and English-primary.

---

### 1.2 Hearing / Deaf & Hard-of-Hearing

| Product | What It Does | Pricing | Users | Major Limitations |
|---------|-------------|---------|-------|-------------------|
| **Otter.ai** | AI meeting transcription. Real-time captions for meetings/lectures. Speaker identification, summaries, action items. | Free: 300 min/mo. Pro: $10/mo. Business: $20/mo. | Millions of users. Primarily business/education. | English-primary (French, Spanish added recently). Not designed specifically for deaf users. Accuracy drops with accents/noise. Requires internet. |
| **Google Live Caption** | On-device real-time captions for any audio playing on Android/Chrome. Works across apps, calls, videos. | **Free** (built into Android 10+ and Chrome). | Hundreds of millions of Android users. | English initially, now ~12 languages but NOT Serbian. On-device = less accurate than cloud. Doesn't work for in-person conversations (only device audio). No speaker identification. |
| **Google Live Transcribe** | Real-time speech-to-text for in-person conversations. Shows captions on phone screen. Supports 80+ languages including Serbian! | **Free** (Android). | Deaf/HoH community globally. | Android-only. Requires internet for most languages. No conversation history saved by default. Small text on phone screen = hard to read in groups. No sound identification. |
| **Whisper (OpenAI)** | Open-source speech recognition model. 99 languages, robust to noise/accents. Can run locally. | **Free** (open source). API: $0.006/min. | Developers building transcription tools. Not a consumer product. | Not a consumer app — requires technical setup. Large model = slow on phones. No real-time streaming out of box. No sign language. |
| **SignAll** | AI sign language recognition. Camera-based system that translates ASL to text/speech in real-time. | **Enterprise pricing** (kiosk-based, $10K+ per installation). | Installed at select locations (universities, government offices). | ASL only. Requires specialized hardware (multiple cameras). Extremely expensive. Not portable. Not available as consumer app. |
| **Hand Talk** | Mobile app: translates text/audio to sign language via 3D animated avatar (Hugo/Maya). Supports Brazilian Sign Language (Libras) and ASL. | **Free app**. Enterprise plugin: custom pricing. | 30M+ downloads in Brazil. Growing in US. | Only Libras and ASL. Avatar animations are limited/robotic. Text-to-sign only (not sign-to-text!). No other sign languages supported. |

**Key Takeaway for Hearing:** Live captions are well-served by Google (free, built-in). Otter.ai dominates meetings. **The massive gap is sign language — especially non-ASL sign languages. SignAll is ASL-only and costs $10K+. Hand Talk is Libras/ASL only. Serbian Sign Language has ZERO AI tools.** Also: no good tool bridges deaf + hearing people in real-time bidirectionally.

---

### 1.3 Speech / Communication Disabilities

| Product | What It Does | Pricing | Users | Major Limitations |
|---------|-------------|---------|-------|-------------------|
| **Voiceitt** | AI that learns atypical speech patterns and translates to standard speech. Works with Alexa integration. For people with cerebral palsy, stroke, ALS, Parkinson's. | **$15/month** subscription. Hardware bundle: ~$300. | Thousands of users. Early-stage product. | Requires significant training time per user (hours of speech samples). English-only. Limited vocabulary in some cases. Small company, uncertain longevity. |
| **Google Project Euphonia** | Research project: training personalized ASR models for atypical speech. Collected 1M+ utterances from 1000+ speakers. Expanding to Spanish, Japanese, French, Hindi. | **Not a product yet** — research project. Some features integrated into Google Assistant. | Research participants with ALS, cerebral palsy, Down syndrome. | Not publicly available as standalone product. English-primary (expanding). No Serbian. Still research-phase after 6+ years. |
| **Apple Personal Voice** | iOS 17+: users record 15 minutes of speech to create synthetic clone of their own voice. For people losing ability to speak (ALS). Type to speak in your own voice. | **Free** (built into iOS/macOS). | Apple device users facing speech loss. | Apple ecosystem only. Requires 15 min of clear speech (impossible if speech already severely impacted). English, several European languages — but NOT Serbian. Type-to-speak is slow. |
| **Cboard** | Open-source AAC (Augmentative & Alternative Communication) web app. Picture-based communication board. Users tap symbols to build sentences, text-to-speech output. | **Free** (open source). | Users with autism, cerebral palsy, aphasia. Global reach, 40+ languages. | Basic symbol-based communication. No AI/predictive features. Interface feels dated. No voice input. Limited personalization. Requires literacy/cognition to use symbol boards. |

**Key Takeaway for Speech:** Voiceitt is the only real consumer product, and it's English-only, $15/mo, and requires hours of training. Apple Personal Voice is elegant but Apple-only. Euphonia is still research. **Nobody is doing affordable, multilingual AI-powered speech tools for atypical speakers. Serbian is completely unsupported.**

---

### 1.4 Cognitive / Neurodevelopmental

| Product | What It Does | Pricing | Users | Major Limitations |
|---------|-------------|---------|-------|-------------------|
| **CogniFit** | Brain training games and cognitive assessments. Claims to improve memory, attention, coordination. | Free basic. Premium: $20/mo or $120/year. | General wellness users + some clinical use. | Weak evidence for real cognitive improvement. Not specifically for disabled users. Gamified wellness, not assistive technology. |
| **Lumosity** | Brain training games. Similar to CogniFit. | Free basic. Premium: $12/mo or $60/year. | 100M+ users globally. | Entertainment/wellness product, not assistive tech. No evidence it helps cognitive disabilities. Not designed for intellectually disabled users. |
| **Brain.fm** | AI-generated music designed to improve focus, relaxation, sleep. Uses auditory stimulation. | $7/mo or $50/year. | Productivity users, some ADHD users. | Wellness product, not disability tool. No clinical validation. Passive listening, not active assistance. |
| **Goblin Tools** | AI-powered task breakdown, tone estimation, simplifier, time estimator. Designed for neurodivergent users (ADHD, autism). | **Free** (donations accepted). | Growing ADHD/autism community. | Limited to text-based task management. No scheduling/reminder integration. No mobile app (web only). |
| **VITE VERE** (Gemini hackathon winner) | Personalized daily life support for cognitively disabled users. Uses Gemini API for adaptive task guidance, routines, communication support. | **Prototype/hackathon project.** | Won "Most Impactful" + "People's Choice" at Google Gemini Competition 2024. | Not a real product. Hackathon demo. No ongoing development confirmed. |

**Key Takeaway for Cognitive:** This space is dramatically underserved by AI. Most "brain training" apps are wellness products for neurotypical people. **There's almost nothing that uses modern AI to help intellectually disabled or cognitively impaired people navigate daily life.** VITE VERE proved judges love this space. Goblin Tools is a rare exception but very basic.

---

### 1.5 Digital Inclusion / General

| Product | What It Does | Pricing | Users | Major Limitations |
|---------|-------------|---------|-------|-------------------|
| **Voice Assistants** (Alexa, Google Home, Siri) | Voice-controlled smart home, information access, communication. Hands-free operation. | Device cost ($30-300). Services free. | Billions. Many disabled users rely on these for independence. | Struggle with atypical speech. Not designed for accessibility-first. Privacy concerns. Require internet. Don't understand context of disability needs. |
| **Screen Readers** (NVDA, VoiceOver, TalkBack) | Read screen content aloud. Enable blind users to use computers/phones. | **Free** (built into OS or open source). | Millions of blind/low-vision users. | Require learning curve. Web accessibility depends on site coding. Can't interpret images (without alt text). Don't work on non-accessible apps. |
| **Switch Access / AssistiveTouch** | Alternative input methods for motor-impaired users. Single switch, head movement, eye tracking. | **Free** (built into iOS/Android). | Motor-impaired users. | Extremely slow input. Limited eye-tracking accuracy on consumer devices. Requires compatible hardware for switches. |

---

## 2. Google / Vertex AI Specific Capabilities

### 2.1 Gemini Multimodal Capabilities (TODAY)

**Gemini 2.5 Flash** (latest as of early 2026):
- **Image Understanding:** Describe scenes, read text in images, identify objects, answer questions about photos. Supports multiple languages in responses.
- **Video Understanding:** Process video input, describe actions, identify events. Can handle up to hours of video content.
- **Audio Transcription:** Multilingual speech-to-text. 100+ languages supported in Gemini models.
- **Real-Time Streaming (Gemini Live API):**
  - **Low-latency bidirectional streaming** via WebSocket
  - Audio input (16-bit PCM, 16kHz) + Image/Video input (JPEG, 1 FPS) + Text
  - Audio output (24kHz) + Text output
  - **24 supported languages** for conversation
  - Voice Activity Detection (interrupt capability — "barge-in")
  - Affective dialog (adapts tone to user's emotional state)
  - Tool use (function calling, Google Search integration)
  - Audio transcriptions of both input and output
  - Sub-second latency (~600ms first token)
  - **Native audio model** (`gemini-live-2.5-flash-native-audio`) — generally available
  - Partner integrations: Daily, LiveKit, Twilio, Voximplant

**This is HUGE for accessibility.** The Live API essentially enables:
- Real-time scene description for blind users via camera
- Live conversation translation/captioning
- Voice-controlled AI assistant that can see, hear, and speak
- All in one API call, multilingual, sub-second latency

### 2.2 Vertex AI Agent Builder

What you can build:
- **Conversational agents** with natural language understanding
- **Multi-turn dialog** with context retention
- **Grounded responses** using Google Search or custom data stores
- **Function calling** to integrate with external APIs/services
- **RAG (Retrieval Augmented Generation)** with custom knowledge bases
- **Multi-agent orchestration** with Agent Development Kit (ADK)
- Agent-to-Agent (A2A) protocol for agent collaboration

**Accessibility-relevant capabilities:**
- Build a custom accessibility agent that understands specific disability contexts
- Ground responses in medical/accessibility knowledge bases
- Integrate with device APIs (camera, microphone, sensors)
- Chain multiple AI capabilities (vision → language → speech) in one agent

### 2.3 Google's Own Accessibility Products

| Product | Status | What It Does |
|---------|--------|-------------|
| **Project Relate** | Limited availability (Android). Invite-only in US, Australia, Canada, New Zealand. | Personal speech recognition for atypical speech. Three modes: Listen (real-time transcription), Repeat (re-speaks in clear voice), Assistant (connects to Google Assistant). |
| **Lookout** | Generally available (Android). | Scene description, text reading, food label scanning. Uses Gemini for descriptions. |
| **Live Transcribe** | Generally available (Android). | Real-time speech-to-text. 80+ languages including **Serbian**. |
| **Sound Notifications** | Generally available (Android). | Alerts deaf/HoH users to household sounds (doorbells, alarms, baby crying, dog barking). Uses on-device ML. |
| **Project Euphonia** | Research phase. Expanding to Spanish, Japanese, French, Hindi. | Personalized ASR for disordered speech. 1M+ utterances from 1000+ speakers collected. |
| **Live Caption** | Built into Android 10+, Chrome. | Captions any audio on device. ~12 languages. |
| **Action Blocks** | Generally available (Android). | Custom home screen buttons that trigger Google Assistant actions. For cognitive/motor disabilities. |
| **Camera Switches** | Generally available (Android). | Use facial gestures detected by front camera to control phone. For motor-impaired users. |

**Key insight:** Google has MORE accessibility products than any other tech company, and they're mostly free. But they're scattered across different apps, Android-only, and don't work together as a unified system.

### 2.4 What Gemini Can Do for a Hackathon

The **Gemini Live API** is the killer feature. In a hackathon, you could build:
1. **Real-time visual assistant** — camera feed → Gemini → spoken description, sub-second
2. **Bidirectional conversation translator** — deaf person types, hearing person speaks, AI bridges in real-time
3. **Atypical speech interpreter** — Gemini's audio understanding + affective dialog to better understand unclear speech
4. **Cognitive assistant** — multimodal agent that guides through daily tasks using vision + voice
5. **Caregiver dashboard** — agent that monitors, reports, and assists

---

## 3. Hackathon Winners — What Works

### 3.1 Google Gemini API Developer Competition 2024

The BIGGEST signal — these won at Google's own competition:

| Award | Project | What It Does | Why It Won |
|-------|---------|-------------|------------|
| **Most Impactful + People's Choice** | **VITE VERE** | Personalized support for cognitively disabled people. Daily autonomy support. | Emotional impact. Underserved population. Practical daily use. |
| **Best Android App** | **Gaze Link** | ALS patients communicate with their eyes using Gemini. | Technical innovation (eye tracking + AI). Heart-wrenching use case. |
| **Best Web App** | **ViddyScribe** | Adds audio descriptions to videos instantly for blind users. | Solved real problem (video accessibility). Technically clever. |
| Honorable Mention | **Ally** | Personal assistant for blind users. | Practical, well-executed. |
| Honorable Mention | **Menu Buddy** | Helps speech-impaired people order at restaurants. | Specific, relatable use case. Emotional resonance. |

### 3.2 Patterns That Win Hackathons

From Devpost and Google competitions, clear patterns emerge:

1. **Emotional resonance beats technical complexity.** Projects serving real humans with real disabilities always outperform clever-but-abstract technical demos.

2. **Specific > General.** "Helps ALS patients communicate with their eyes" beats "general accessibility platform." Pick ONE disability, ONE scenario, nail it.

3. **Demo-ability is crucial.** If judges can see a blind person using your app and having a "wow" moment in a 3-minute demo, you win. If you need 10 minutes to explain your architecture, you lose.

4. **Underserved populations win.** Cognitive disabilities, atypical speech, ALS — these are populations that existing tech ignores. Judges notice.

5. **Use the sponsor's tech prominently.** If it's a Google hackathon, Gemini should be central, not an afterthought.

6. **Working prototype > polished deck.** A janky app that actually works beats a beautiful presentation of a concept.

7. **Multimodal is the new hot thing.** Vision + voice + text combined = impressive. The Live API makes this achievable in a hackathon timeframe.

### 3.3 Devpost Accessibility Winners (Recent)

- **ACCESS AI** — Offline AI learning hub for communities without internet. Raspberry Pi + local LLM. Won for bridging digital divide.
- Various sign language recognition projects — consistently popular but rarely work well enough to win top prizes.
- Navigation apps for blind users — common but crowded category.
- Mental health / cognitive support tools — growing category, less competition.

---

## 4. The Gaps — Where NO Good AI Solution Exists

### 4.1 🔴 Cross-Disability Solutions

**Gap:** Almost every accessibility product serves ONE disability type. A deaf-blind person, or someone with cerebral palsy affecting both speech and motor function, falls through the cracks.

**Reality:** 
- 40% of disabled people have multiple disabilities
- No product adapts its interface dynamically based on what combination of abilities a user has
- Example: A person who is both deaf and has motor impairments can't use sign language AND can't easily type — what do they do?

**Opportunity:** A Gemini-powered agent that assesses user capabilities at setup and dynamically adapts its I/O modalities (voice, visual, switch, eye-gaze, etc.)

### 4.2 🔴 Offline / Low-Connectivity

**Gap:** Nearly ALL the best AI accessibility tools require internet. OrCam is the only major offline tool and costs $3,000+.

**Reality:**
- 700-800K disabled people in Serbia, many in rural areas with poor connectivity
- Developing world: billions without reliable internet
- Emergency situations (power outage, disaster) = no accessibility tools
- Privacy concerns with cloud processing of sensitive disability data

**Opportunity:** Edge AI on Raspberry Pi or phone with Gemini Nano (on-device model). A 2025 research paper demonstrated a fully offline assistive system on Raspberry Pi 5 using YOLOv8 + Tesseract + VOSK achieving 75-90% accuracy. Can we do better with Gemini Nano?

### 4.3 🔴 Non-English Languages (Especially Serbian/Balkan)

**Gap:** Massive language coverage gap in accessibility tools:

| Product | Serbian Support? | Balkan Language Support? |
|---------|-----------------|------------------------|
| Be My Eyes | ❌ (English primarily) | Limited |
| Seeing AI | ❌ | ❌ |
| Lookout | ❌ (expanding but limited) | ❌ |
| Voiceitt | ❌ English only | ❌ |
| Apple Personal Voice | ❌ | ❌ |
| Project Euphonia | ❌ (English, expanding to Spanish/Japanese/French/Hindi) | ❌ |
| Project Relate | ❌ (English) | ❌ |
| Google Live Transcribe | ✅ **Serbian supported!** | ✅ (Croatian, Bosnian too) |
| SignAll | ❌ ASL only | ❌ |
| Hand Talk | ❌ Libras/ASL only | ❌ |
| Cboard (AAC) | ✅ 40+ languages | ✅ (some Balkan) |

**Reality:**
- Serbian Sign Language has ZERO AI recognition tools
- Atypical Serbian speech recognition: ZERO tools
- Scene description in Serbian: possible via Gemini (multilingual) but no dedicated product
- ITU 2021 study on Serbia flagged massive gaps in digital accessibility infrastructure
- Serbia has ~700-800K people with disabilities (8-10% of population)

**Opportunity:** First AI accessibility tool specifically supporting Serbian/Balkan languages. Gemini's multilingual capabilities make this feasible.

### 4.4 🔴 Affordable Alternatives to Expensive Assistive Tech

**Gap:** The cost barrier is enormous:

| Existing Solution | Cost | What's Needed |
|------------------|------|---------------|
| OrCam MyEye | $3,000-4,500 | Affordable wearable visual assistant |
| Envision Glasses | $2,500-3,500 | Affordable smart glasses for blind |
| SignAll kiosk | $10,000+ | Mobile sign language translation |
| Hearing aids | $1,000-6,000/pair | AI-enhanced hearing on phone |
| AAC devices (Tobii, etc.) | $5,000-15,000 | Affordable eye-tracking communication |
| Aira personal plans | $99-329/month | Affordable remote visual assistance |

**Opportunity:** Smartphone-based alternatives using Gemini API. A $200 Android phone + free AI API can replicate 80% of what a $4,500 OrCam does.

### 4.5 🔴 Caregiver Tools

**Gap:** Almost all accessibility tools are FOR the disabled person. Almost nothing exists FOR the caregivers/helpers.

**Reality:**
- 350+ million caregivers worldwide (OECD 2023)
- 60-70% are female, 45-65 years old
- Caregiver burnout is a massive problem
- Caregivers need: monitoring dashboards, behavioral pattern detection, communication aids, respite coordination, medical tracking, simplified reporting for doctors
- Most intelligent assistive tech (IATDs) for caregiver support is still in prototype stage
- RISE project (2025) showed RAG-AI + social robot for dementia caregivers achieved 87% correctness — but it's a research project, not a product

**Opportunity:** AI-powered caregiver companion that:
- Monitors person with disability (with consent) and flags anomalies
- Simplifies medical/behavioral reporting
- Provides respite through automated engagement (conversation, activities)
- Connects caregivers with resources and community
- Reduces burnout through proactive support

### 4.6 🔴 Real-Time Sign Language Translation (Any Language)

**Gap:** Despite being a popular hackathon topic, NO product does this well:
- SignAll: ASL only, requires specialized hardware, $10K+
- Hand Talk: Text-TO-sign only (not sign recognition), Libras/ASL only
- Google: No sign language product
- Apple: No sign language product
- No Serbian sign language tools exist AT ALL

### 4.7 🔴 Unified Accessibility Platform

**Gap:** Google has Lookout, Live Transcribe, Sound Notifications, Live Caption, Action Blocks, Camera Switches — all as **separate apps.** No unified platform that works as a single accessibility hub tailored to a user's specific combination of needs.

---

## 5. What Would WOW Hackathon Judges?

### The Formula: Technical Impressiveness × Emotional Impact × Buildability

### 🏆 Tier 1: HIGH WOW — Build These

**1. "Sagovornik" (Interlocutor) — Real-Time Multimodal Communication Bridge**
- Uses Gemini Live API for real-time bidirectional communication
- Deaf person signs/types → AI translates to spoken Serbian
- Hearing person speaks → AI shows captions in real-time
- Atypical speech? AI interprets and clarifies
- Serbian-first, but works in any language
- **Why it wins:** First Serbian-language accessibility bridge. Uses Live API impressively. Emotional demo (two people communicating who couldn't before). Technically sophisticated (multimodal streaming). Serves underserved market (Balkans).
- **Buildability:** 24-48 hours with Live API. Camera + mic + screen. WebSocket streaming.

**2. AI Caregiver Companion — "Čuvar" (Guardian)**
- Gemini-powered agent for caregivers of cognitively impaired people
- Tracks routines, flags anomalies, generates daily reports
- Voice-first interface (caregiver can ask "how was mom today?")
- Provides activity suggestions, medication reminders
- Emergency escalation
- **Why it wins:** Untouched market (caregiver tools). Emotional resonance (everyone knows a caregiver). Practical and needed. Uses Gemini multimodal (vision monitoring + voice interaction). VITE VERE proved judges love cognitive disability space.
- **Buildability:** Agent Builder + function calling + simple monitoring UI.

**3. Affordable Visual Assistant — Phone as OrCam**
- Gemini Live API + phone camera = real-time scene description
- Serbian-language descriptions
- Reads text, identifies objects, navigates
- $0 vs $4,500 OrCam
- **Why it wins:** David vs Goliath narrative. "We replaced a $4,500 device with a free app." Clear demo. Real impact.
- **Buildability:** Straightforward Live API integration. Camera → Gemini → TTS.

### 🥈 Tier 2: GOOD BUT HARDER

**4. Serbian Sign Language Recognition Prototype**
- First-ever AI system for Serbian sign language
- Even if accuracy is limited, the "first ever" narrative is powerful
- Camera → hand/pose detection → Gemini interpretation → text/speech
- **Risk:** Sign language ML is notoriously hard. May not work well enough for a convincing demo in 48 hours.

**5. Cross-Disability Adaptive Interface**
- App that assesses user's abilities at setup
- Dynamically adjusts I/O: voice, visual, switch, eye-gaze
- Uses Gemini to power all modalities
- **Risk:** Scope creep. Trying to serve everyone = serving no one.

### ❌ Tier 3: AVOID — Already Solved or Too Hard

- **Generic meeting transcription** — Otter.ai, Google Meet captions already dominate
- **Basic screen reader improvements** — OS-level, not a hackathon scope
- **Brain training games** — Lumosity exists, no real impact
- **Generic sign language recognition** — everyone tries this at hackathons, rarely works
- **Basic text-to-speech/speech-to-text** — Whisper exists, Live Transcribe exists

---

## Summary: The Opportunity Map

| Gap | Severity | Competition | Hackathon Fit | Google Tech Fit |
|-----|----------|-------------|---------------|----------------|
| Caregiver tools | 🔴 Critical | Almost none | ⭐⭐⭐⭐⭐ | Agent Builder, Live API |
| Serbian/Balkan language accessibility | 🔴 Critical | Zero | ⭐⭐⭐⭐⭐ | Gemini multilingual |
| Cross-disability unified platform | 🔴 Critical | None | ⭐⭐⭐ | Live API multimodal |
| Affordable visual assistant (phone-based) | 🟡 High | Some (Be My Eyes) | ⭐⭐⭐⭐ | Live API + vision |
| Cognitive disability daily support | 🔴 Critical | Almost none | ⭐⭐⭐⭐⭐ | Agent Builder, Live API |
| Offline/edge accessibility | 🔴 Critical | Minimal | ⭐⭐ | Gemini Nano (limited) |
| Sign language (non-ASL) | 🔴 Critical | Zero for Serbian | ⭐⭐ | Hard in 48hrs |
| Atypical speech for non-English | 🔴 Critical | Zero | ⭐⭐⭐ | Gemini audio understanding |
| Real-time communication bridge | 🟡 High | Partial solutions | ⭐⭐⭐⭐⭐ | Live API bidirectional |

### The Sweet Spot

**Caregiver tools + Serbian language + Gemini Live API = the most defensible, impactful, and buildable hackathon project.**

No one is building for caregivers. No one is building for Serbian. The Gemini Live API makes real-time multimodal interaction achievable in 48 hours. The emotional narrative (helping the helpers) is powerful. And it directly uses Google's latest tech in a way judges will appreciate.

Second best: **Affordable phone-based visual assistant in Serbian** — replacing $4,500 hardware with a free app using Gemini's Live API camera streaming capabilities. The "David vs Goliath" narrative is compelling, the demo is visual and immediate, and it's technically straightforward.
