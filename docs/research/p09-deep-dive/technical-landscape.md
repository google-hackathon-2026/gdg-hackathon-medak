# Emergency Relay Technologies & Technical Feasibility — Deep Dive

> Research compiled 2026-03-28 for EUhackathon accessibility project.  
> Goal: inform a 48-hour hackathon build of an AI-powered emergency relay for deaf/hard-of-hearing users.

---

## Table of Contents

1. [Existing Relay Services Worldwide](#1-existing-relay-services-worldwide)
2. [Text-to-112 in Europe](#2-text-to-112-in-europe)
3. [AI in Emergency Services (State of the Art)](#3-ai-in-emergency-services-state-of-the-art)
4. [Technical Architecture for AI Emergency Relay](#4-technical-architecture-for-ai-emergency-relay)
5. [Reliability & Safety](#5-reliability--safety)
6. [Recommended Technical Stack for 48h Build](#6-recommended-technical-stack-for-48h-build)

---

## 1. Existing Relay Services Worldwide

### 1.1 US Telecommunications Relay Service (TRS)

The US has the most mature relay ecosystem, mandated by Title IV of the ADA (1990) and administered by the FCC.

**How 711 Works:**
- Dialing **711** from any phone connects the caller to a relay service operator (Communication Assistant, CA).
- The CA serves as an intermediary: they read aloud what the deaf user types and type back what the hearing person says.
- Carriers are required to provide 711 access; the service is free to end users, funded by the Interstate TRS Fund (~$1.3B/year).

**Types of relay services:**

| Service | How It Works | Latency | Best For |
|---------|-------------|---------|----------|
| **TTY/TDD Relay** | Text typed on a TTY device, CA reads aloud to hearing party | High (typing speed) | Legacy users with TTY devices |
| **IP Relay** | Text via internet (web/app), CA voices the text | Medium (typing speed) | Users with internet, no special device |
| **Video Relay Service (VRS)** | ASL user signs via video to interpreter who voices to hearing party | Low-Medium (~2-5s) | Native ASL users, most natural communication |
| **Captioned Telephone (CapTel)** | User speaks directly, captions appear on screen for incoming speech | Low (~2-3s) | Hard-of-hearing who can speak but not hear well |
| **IP Captioned Telephone (IP CTS)** | Like CapTel but internet-based; uses ASR + human re-voicing | Low (~2-4s) | Most popular service currently, ~2M+ users |

**Emergency access via TRS:**
- All TRS forms can reach 911, but there are significant issues (see Limitations below).
- **Text-to-911** is being rolled out separately from TRS. As of 2025, ~2,300 PSAPs (~85% of US population) support text-to-911, but coverage is still not universal.
- Text-to-911 uses SMS or RTT (Real-Time Text) — messages are delivered in real-time as typed, character by character.

**Key links:**
- FCC TRS overview: https://www.fcc.gov/consumers/guides/telecommunications-relay-service-trs
- Text-to-911 availability: https://www.fcc.gov/files/text-911-702020xlsx

### 1.2 UK Emergency Access for Deaf Users

The UK has multiple parallel systems:

**Emergency SMS (registered service):**
- Users must **pre-register** by texting "register" to 999.
- Once registered, they can text 999 in emergencies.
- SMS goes to a relay center, which contacts the appropriate emergency service.
- **Major limitation:** Requires pre-registration (many deaf people don't know about it or forget to register).
- Average response time is slower than voice calls.

**Relay UK (formerly NGTS — Next Generation Text Service):**
- App-based text relay service operated by BT.
- Users can add "18001" prefix before any number (e.g., 18001 999) to reach it via text relay.
- A relay assistant reads aloud what the user types and types back the emergency operator's speech.
- Works with 999, 101 (police non-emergency), and all other numbers.
- Uses a text-and-voice hybrid — the deaf user types, the relay assistant speaks.

**999 BSL (British Sign Language) Video Relay:**
- Launched in June 2022 by the UK government.
- Users connect via the 999 BSL app (iOS/Android) or website (999bsl.co.uk).
- A BSL interpreter joins the video call and relays to the 999 operator.
- Available 24/7.
- **Limitation:** Requires internet/data connection and a smartphone.

**Key links:**
- 999 BSL: https://999bsl.co.uk
- Relay UK: https://www.relayuk.bt.com
- Emergency SMS: https://www.emergencysms.net

### 1.3 Australia's National Relay Service (NRS)

Australia operates one of the better-integrated systems:

**How it works:**
- The NRS is run by Accesshub (contracted by the Australian Government).
- Multiple access methods:
  - **106** — dedicated emergency number for TTY users (direct to 000 dispatcher)
  - **TTY relay** — 133 677 for standard calls
  - **Speak & Listen** — for people with speech impairments (133 677)
  - **SMS relay** — 0423 677 767
  - **Video Relay (Auslan)** — for native sign language users
  - **Internet Relay** — via web interface at relayservice.gov.au
  - **NRS App** — mobile app for all relay types

**Emergency access:**
- Dialing **106** on a TTY connects directly to emergency services (000).
- For non-TTY users, the NRS can relay to 000, but it's not as direct.
- The SMS relay number can also reach 000 but with significant delay.

**Key links:**
- NRS: https://www.infrastructure.gov.au/media-communications-arts/phone/services-people-disability/accesshub
- Emergency 106: https://www.triplezero.gov.au

### 1.4 Japan's Net119 System

Japan has one of the most innovative approaches:

**Net119:**
- A web-based emergency reporting system specifically for deaf, hard-of-hearing, and speech-impaired people.
- Users **pre-register** with their local fire department (which handles both fire and ambulance in Japan).
- In an emergency, users access a web form (no app install required — uses GPS-enabled browser).
- The system detects the user's location via GPS and routes the request to the nearest dispatch center.
- Communication happens via **structured chat** — the dispatcher and user exchange text messages in real-time.
- Available since ~2018, rolled out across most Japanese municipalities.

**How it works technically:**
1. User opens Net119 URL (bookmarked on phone)
2. Selects emergency type (fire, ambulance, etc.)
3. GPS location is transmitted automatically
4. Text chat session opens with nearest dispatcher
5. Pre-registered medical information is also transmitted

**Strengths:** No special device needed, works on any smartphone with a browser, structured data reduces ambiguity.
**Weaknesses:** Requires pre-registration, internet connection required, not available for non-registered visitors/tourists.

**Also in Japan:**
- **FAX 119** — legacy system, users can fax emergency requests
- **Email 119** — email-based emergency reporting (very slow)

### 1.5 Countries with Most Advanced Deaf Emergency Access

**Tier 1 — Best coverage:**
1. **United States** — Multiple relay types (VRS, IP Relay, CapTel), text-to-911 growing, well-funded
2. **Sweden** — Pioneered text-based 112, relay services integrated with SOS Alarm
3. **Finland** — 112 Suomi app with excellent accessibility features
4. **Australia** — 106 direct emergency, comprehensive NRS
5. **Japan** — Net119 innovative web-based system

**Tier 2 — Good but fragmented:**
6. **UK** — 999 BSL, Relay UK, Emergency SMS (but requires registration)
7. **Netherlands** — 112NL app with RTT (Real-Time Text) support
8. **France** — 114 dedicated deaf emergency number (SMS/fax/app/video)
9. **Lithuania** — SMS to 112 with high usage (39,464 SMS in 2023 — highest in EU)
10. **Germany** — DGS (German Sign Language) video relay, relay service with 9,671 app accesses

**France deserves special mention:**
- **114** is a dedicated number for deaf and hard-of-hearing emergency access
- Supports: SMS, fax, real-time text (RTT), video relay, web interface, and app
- 305,452 emergency communications in 2023 — by far the highest volume in Europe
- Operates 24/7 with specialized operators

### 1.6 Documented Failures and Limitations

**Systemic issues across all relay services:**

1. **Latency is the #1 killer:**
   - Text relay adds 30-90 seconds per exchange vs. voice calls.
   - VRS adds 5-15 seconds for interpretation.
   - In cardiac arrest, every minute without CPR reduces survival by 7-10%.
   - A study found that relay calls to 911 take **2-3x longer** than equivalent voice calls.

2. **Pre-registration requirements:**
   - UK Emergency SMS, Japan Net119, and several EU services require pre-registration.
   - Many deaf users don't know the service exists or forget to register.
   - Visitors and tourists are excluded entirely.

3. **Technology dependencies:**
   - VRS requires high-bandwidth internet (video streaming).
   - IP Relay and apps require internet — fails during network outages (exactly when emergencies are most likely).
   - SMS-based systems depend on cellular network which can be congested during disasters.

4. **Lack of location data:**
   - SMS to emergency numbers often doesn't transmit GPS location.
   - IP Relay and web-based services may transmit IP-based location (very imprecise).
   - Only app-based solutions consistently provide accurate location via AML (Advanced Mobile Location).

5. **Interpreter availability:**
   - VRS services face interpreter shortages, especially at night.
   - Wait times for video relay can exceed 5 minutes — unacceptable for emergencies.
   - BSL/ASL interpreters for medical emergencies are rare specializations.

6. **False call rates:**
   - EU reports false call rates up to 72% (Portugal) for 112.
   - SIM-less phone emergency calls contribute significantly.
   - Text-based systems have lower false positive rates but higher false negative rates.

7. **Fragmentation:**
   - No universal system — every country/state has different numbers, apps, registration requirements.
   - Roaming users in Europe cannot use most accessibility services.
   - EU Commission 2024 report explicitly states: "End-users with disabilities do not yet benefit from fully equivalent means of access to emergency services, especially when roaming."

8. **Documented incidents:**
   - Multiple lawsuits in the US over text-to-911 failures (messages going to void in unsupported areas with no error message to user).
   - UK Emergency SMS system had instances of 20+ minute delays during peak times.
   - VRS services have gone down during regional internet outages, leaving deaf users with no emergency access.

---

## 2. Text-to-112 in Europe

### 2.1 Which EU Countries Have Text-to-112 Operational

Based on the European Commission's December 2024 report (COM(2024)575), **17 Member States** have mandated SMS-based emergency communications for all users, with **13 sending SMS directly to 112**.

**Countries with SMS to 112 operational:**

| Country | SMS to 112 | SMS Volume (2023) | App Available | Notes |
|---------|-----------|-------------------|---------------|-------|
| **Austria (AT)** | SMS to long number | 580 | Yes (294 uses) | |
| **Belgium (BE)** | SMS to short number | N/A | 112.be app | |
| **Bulgaria (BG)** | RTT via app | N/A | 112 Bulgaria app | |
| **Cyprus (CY)** | SMS to 112 | N/A | RTT via app | |
| **Czech Republic (CZ)** | SMS to 112 | 739 | zachranka app | Also has relay service |
| **Denmark (DK)** | SMS to long number | 95 | — | |
| **Estonia (EE)** | SMS to 112 | 838 | — | |
| **Finland (FI)** | SMS to 112 | 5,950 | 112 Suomi | Pre-registration required |
| **France (FR)** | SMS to 114 | 305,452 | Yes + web + RTT | Dedicated deaf number |
| **Germany (DE)** | Via app | 9,671 (app) / 772 (relay) | nora app | |
| **Greece (EL)** | SMS to 112 | 1,478 | — | |
| **Croatia (HR)** | SMS to 112 | 15 | — | |
| **Hungary (HU)** | SMS to 112 | 18,890 | 112-SOS app | |
| **Ireland (IE)** | SMS to 112 | 1,279 | — | |
| **Italy (IT)** | Via app | N/A | Where ARE U / Flag Mii | + relay service |
| **Lithuania (LT)** | SMS to 112 | 39,464 | 112 app (186 uses) | Highest SMS volume |
| **Luxembourg (LU)** | SMS to 112 | N/A | GouvAlert / Echo 112 | |
| **Latvia (LV)** | SMS to 112 | N/A | App available | |
| **Malta (MT)** | SMS to long number | 4 | 112.mt app (228) | Also RTT |
| **Netherlands (NL)** | SMS to 112 | N/A | 112NL app (RTT) | Also web + relay |
| **Poland (PL)** | Via app | 1,836 | Alarm 112 app | |
| **Portugal (PT)** | SMS to long number | N/A | Emergency app (7) | |
| **Romania (RO)** | SMS to 113 | N/A | — | Different number! |
| **Sweden (SE)** | SMS to 112 | 142 | — | Also general relay (1,083) |
| **Slovenia (SI)** | SMS to 112 | N/A | Web access | |
| **Slovakia (SK)** | SMS to 112 | N/A | — | |
| **Norway (NO)** | SMS to 112 | N/A | App + web + relay | |

**Key takeaway:** SMS to 112 is available in 23+ EU member states, but **usage varies wildly** — from 4 (Malta) to 305,452 (France's 114). This suggests that most systems are poorly promoted or difficult to use.

### 2.2 DEC112 (Deep Emergency Communication) Project

**What it is:**
DEC112 is an Austrian-led project to enable **text-based emergency communication over SIP/IP** for the deaf and hard-of-hearing, conforming to NG112 (Next Generation 112) standards.

**How it works:**
1. User opens the DEC112 app or web client
2. Initiates an emergency session — a SIP INVITE is sent to the local PSAP
3. Real-Time Text (RTT, per RFC 4103) is used for communication — characters appear as typed (not SMS-style "send and wait")
4. Location is transmitted via PIDF-LO (Presence Information Data Format — Location Object)
5. The PSAP operator sees the text in real-time on their CAD (Computer-Aided Dispatch) system
6. Media can be attached (photos, video)

**Technical stack:**
- SIP/SDP signaling over TLS
- SRTP (Secure Real-Time Transport Protocol) for media
- T.140 protocol for Real-Time Text (standardized by ITU-T)
- HELD (HTTP-Enabled Location Delivery) for location
- PIDF-LO for location format
- Conforms to ETSI TS 103 479 (Accessible emergency communications)

**Current status:**
- Successfully piloted in Austria (Vorarlberg, Lower Austria)
- Open-source components available: https://github.com/nicokoenig/DEC112
- Being adopted as reference implementation for EU NG112 accessibility
- Austria PSAP migration to packet-switched: Q2 2025

**Why it matters for our hackathon:**
DEC112 shows the "gold standard" architecture for text-based emergency communication. Our AI relay would sit as a translation layer between the user's text input and a standard voice call to 112 — essentially doing what DEC112 does but without requiring PSAP upgrades.

**Key links:**
- DEC112 project: https://www.2112.at/dec112/
- ETSI TS 103 479: https://www.etsi.org/deliver/etsi_ts/103400_103499/103479/

### 2.3 PEMEA (Pan-European Mobile Emergency Application)

**What it is:**
PEMEA is a standard (ETSI TS 103 478) that defines how mobile emergency applications can interoperate across European borders.

**The problem it solves:**
- Currently, if you have Finland's 112 Suomi app and you're in Spain, the app can't reach Spanish emergency services.
- Each country's emergency app is an island.

**How it works:**
1. User's emergency app connects to a **National Access Point (NAP)** in the app's home country
2. The NAP routes the emergency to the appropriate NAP in the **visited country** (based on location)
3. The visited country's NAP delivers the alert to the local PSAP
4. Communication channel is established between user and local PSAP

**Architecture:**
```
User App → Home NAP → Visited Country NAP → Local PSAP
                ↑                    ↑
          SIP/HTTPS routing    PSAP delivery
```

**Status:** Standard published, but real-world deployment is still limited. Only a few countries have NAPs operational. The European Accessibility Act deadline of June 2025 is pushing faster adoption.

### 2.4 Finnish 112 Suomi App

**One of the best emergency apps in Europe:**

**Features:**
- Free, available on iOS and Android
- Press emergency button → automatic voice call to 112 with GPS location transmitted
- **Accessibility features:**
  - SMS to 112 for pre-registered users (Finnish mobile connections)
  - Chat-based communication option
  - Location shared automatically even for SMS
- Multilingual (Finnish, Swedish, English)
- Zero-tariff (no data charges for emergency use)
- Works even with limited network — falls back to SMS

**Technical details:**
- Uses AML (Advanced Mobile Location) — transmits GPS/WiFi location to PSAP
- Location accuracy: 5-50m (vs. Cell-ID which can be 50m-40,000m)
- AML deployed on both Android and iOS in Finland

**Limitation:** SMS to 112 requires pre-registration with a Finnish mobile number. Not available for roaming users (under development as of 2024).

### 2.5 eCall System — Accessibility Angle

**What eCall is:**
- Mandatory in all new EU vehicles since March 2018.
- Automatically calls 112 when airbags deploy in a crash.
- Transmits: location, time, vehicle ID, number of passengers, fuel type.
- Uses in-band modem over voice channel (no data connection needed).

**Accessibility angle:**
- eCall is **automatically triggered** — no user action needed. This is inherently accessible.
- In-vehicle eCall units have a manual trigger button — large, clearly marked, usable by people with disabilities.
- The voice channel opens automatically — if the occupant can't speak, the PSAP still receives the MSD (Minimum Set of Data) with location and crash severity.
- **NG eCall** (next generation) planned to use IP-based communication — could support text alongside voice.

**Relevance to our project:**
- eCall's "silent emergency" model (automatic data transmission even without voice) is a good paradigm for our relay.
- Our app could transmit structured data (location, emergency type, user profile) alongside the AI relay call.

**658,392 eCalls** were received by EU PSAPs in 2023.

---

## 3. AI in Emergency Services (State of the Art)

### 3.1 PSAPs Using AI for Call Handling

**Corti (Copenhagen, Denmark — now global):**
- AI that listens to live 112/911 calls and detects out-of-hospital cardiac arrest in real-time.
- Uses speech analysis + ML models trained on 100,000+ historical emergency calls.
- **Results:** 95% cardiac arrest detection rate vs. 73% for human dispatchers alone.
- **Speed:** 2.5x faster than human dispatchers at detecting cardiac arrest.
- Piloted with EENA across France (SAMU-SDIS74) and Italy (AREU Lombardy).
- Runs on edge device (Nvidia Jetson TX2) — no cloud dependency, no latency.
- Now deployed in production in Denmark, expanding globally.
- **Key insight:** AI as a support tool alongside human dispatchers, not a replacement.
- Link: https://www.corti.ai

**RapidSOS:**
- Not AI for call handling per se, but an AI-powered data platform for PSAPs.
- Provides automatic location data, health profile (from connected devices), crash detection data.
- Integrates with Apple, Google, Uber, many smart home devices.
- When you call 911 from an iPhone, RapidSOS automatically sends your GPS location to the PSAP.
- **AI features:** Predictive analytics, automated incident correlation, data enrichment.
- Used by 5,200+ PSAPs in the US (majority of 911 centers).
- Link: https://rapidsos.com

**Carbyne (NOVA platform):**
- Cloud-native emergency communications platform.
- **AI features:**
  - Real-time language translation (supports 60+ languages)
  - Automated caller location via multiple data sources
  - Video streaming from caller to PSAP (caller sends video of emergency scene)
  - AI-powered severity assessment
  - Noise cancellation and speech enhancement
  - Automated call summarization for dispatch
  - Sentiment analysis and caller distress detection
- Deployed in 70+ countries, processing millions of emergency calls.
- **Key differentiator:** Cloud-native, can handle text/video/voice in a unified platform.
- Link: https://carbyne.com

**Prepared 911:**
- Live video and AI for 911 centers.
- Dispatchers can request video from caller's phone (no app install — uses browser).
- **AI features:**
  - Real-time video analysis (detect weapons, fire, injuries)
  - Automated transcription and translation
  - AI-generated incident summaries
  - Smart routing based on incident type
- **Key stat:** Claims 30% reduction in call handling time.
- Link: https://www.intrepidnetworks.com/prepared-911/

### 3.2 AI Features in Emergency Services

**Currently deployed features:**

| Feature | Companies | Status | Accuracy |
|---------|-----------|--------|----------|
| **Cardiac arrest detection** | Corti | Production (DK, expanding) | 95% vs 73% human |
| **Automated translation** | Carbyne, LanguageLine | Production | ~90-95% for common languages |
| **Call transcription** | Multiple vendors | Production | ~85-95% depending on conditions |
| **Location enrichment** | RapidSOS | Production (5200+ PSAPs) | 5-50m accuracy |
| **Sentiment/distress detection** | Carbyne | Production | Not publicly reported |
| **Video analysis** | Prepared 911 | Pilot/Early production | Not publicly reported |
| **Automated dispatch** | Various | Pilot only | Too risky for production |
| **Speech-to-text relay** | **Not deployed for emergency** | Concept only | See below |

### 3.3 AI Speech-to-Text Relay for Emergency Calls

**Current state: No one has deployed an AI-powered speech-to-text relay specifically for emergency calls.**

This is exactly the gap our hackathon project targets.

**What exists:**
- **Google Live Relay** (Android feature): Uses on-device ML to convert speech to text and text to speech during phone calls. Works for regular calls but is NOT integrated with emergency services. This is the closest analog to what we want to build.
- **Apple Live Captions** (iOS 16+): Real-time captions for phone calls, FaceTime, etc. Not a relay — just captions. Doesn't generate speech from text.
- **Ava** (app): AI-powered captioning for conversations. Not for phone calls to emergency services.
- **RogerVoice**: App that captions phone calls for deaf users. Available in France, can technically call 112. Uses ASR for captioning. **Closest existing product to our concept** but is one-directional (speech-to-text only, no text-to-speech for outgoing).

**Why it doesn't exist for emergencies yet:**
1. **Liability:** If ASR misinterprets "fire" as "five," someone could die.
2. **Certification:** Emergency services require certified, tested systems.
3. **Reliability:** AI services have outages; emergency services need 99.99% uptime.
4. **Latency:** Every second counts; AI processing adds delay.

### 3.4 Latency Requirements for Real-Time Emergency Relay

**ITU-T recommendations for telecommunications:**
- One-way delay should be < 150ms for "toll quality" (ITU-T G.114)
- Round-trip delay > 300ms becomes noticeable and disruptive

**For emergency relay specifically:**
- **Target: < 2 seconds end-to-end** for speech-to-text-to-speech relay
  - STT processing: 200-500ms (streaming ASR)
  - LLM processing (if used for context/formatting): 500-1000ms
  - TTS generation: 200-500ms
  - Network transport: 100-200ms
  - **Total realistic: 1-2.5 seconds**
- **Acceptable: < 5 seconds** — still better than text relay (30-90s per exchange)
- **Unacceptable: > 5 seconds** — conversation breaks down, critical info delayed

**Comparison with existing relay latency:**
- Human text relay: 30-90 seconds per exchange
- Human VRS (video): 3-8 seconds per exchange
- AI relay (our target): 1-3 seconds per exchange
- Direct voice call: ~0 seconds

**Even a 3-second delay would be a massive improvement over existing relay services.**

### 3.5 Voice/VoIP APIs Comparison

| Platform | Best For | Pricing | Key Features | Latency | Hackathon Fit |
|----------|---------|---------|--------------|---------|---------------|
| **Twilio Voice** | Production-grade telephony | $0.0085/min outbound, $0.0055/min inbound | Media Streams (WebSocket), programmable voice, global numbers | Low (~100ms) | ⭐⭐⭐⭐⭐ Best documented, most hackathon-proven |
| **Vonage Voice API** | Enterprise telephony + AI | $0.0127/min outbound | WebSocket connector, ASR, TTS, WebRTC support | Low (~100ms) | ⭐⭐⭐⭐ Good alternative |
| **Vapi.ai** | AI voice agents | $0.05/min (includes AI) | Built-in STT+LLM+TTS pipeline, easy setup | Medium (~500ms-1s) | ⭐⭐⭐⭐ Fastest to prototype, less control |
| **OpenAI Realtime API** | Speech-to-speech AI | $0.06/min audio in, $0.24/min audio out | Native speech understanding, ultra-low latency, WebSocket | Very low (<300ms) | ⭐⭐⭐⭐ Best quality, integrated with Twilio |
| **Telnyx** | Cost-effective telephony | $0.005/min | WebSocket media streams, similar to Twilio | Low (~100ms) | ⭐⭐⭐ Less documentation |
| **Plivo** | Simpler voice API | $0.0050/min outbound | Basic voice API, less AI integration | Low (~100ms) | ⭐⭐ Limited for AI use case |

**Recommended for hackathon: Twilio Voice + OpenAI Realtime API (or Twilio Voice + Deepgram STT + ElevenLabs TTS)**

---

## 4. Technical Architecture for AI Emergency Relay

### 4.1 Minimum Viable Architecture for 48-Hour Hackathon

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER'S DEVICE (Browser/PWA)                  │
│                                                                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Emergency │  │   Chat    │  │   GPS    │  │   Medical    │  │
│  │  Button   │  │ Interface │  │ Location │  │   Profile    │  │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │              │              │               │           │
└───────┼──────────────┼──────────────┼───────────────┼───────────┘
        │              │              │               │
        ▼              ▼              ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RELAY SERVER (Node.js/Python)                 │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  WebSocket   │  │   Session    │  │    Location/Profile   │ │
│  │  Handler     │  │   Manager    │  │    Manager            │ │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘ │
│         │                 │                       │             │
│  ┌──────▼─────────────────▼───────────────────────▼───────────┐ │
│  │              AI RELAY ENGINE                               │ │
│  │                                                             │ │
│  │  User Text → [Context/Format] → TTS → Voice to PSAP       │ │
│  │  PSAP Voice → STT → [Context/Format] → Text to User       │ │
│  │                                                             │ │
│  └──────┬────────────────────────────────────────┬────────────┘ │
│         │                                        │              │
│  ┌──────▼───────┐                    ┌───────────▼────────────┐ │
│  │  STT Engine  │                    │    TTS Engine          │ │
│  │  (Deepgram/  │                    │  (ElevenLabs/          │ │
│  │   Whisper)   │                    │   Google TTS)          │ │
│  └──────────────┘                    └────────────────────────┘ │
│                                                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TWILIO VOICE (VoIP Bridge)                   │
│                                                                 │
│  Outgoing call to emergency number (simulated for demo)         │
│  Bidirectional Media Stream via WebSocket                       │
│  Audio: mulaw 8kHz (telephony standard)                         │
│                                                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PSAP / 112 DISPATCH CENTER                   │
│                    (Simulated for demo)                          │
│                                                                 │
│  Receives standard voice call                                   │
│  Dispatcher hears AI-generated voice relaying user's text       │
│  Dispatcher speaks normally — their speech is transcribed       │
│  back to the user                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 VoIP Integration — Programmatic Call Bridging with AI

**Yes, you can absolutely programmatically place a voice call and bridge it with AI. This is well-documented and several approaches exist:**

**Option A: Twilio + OpenAI Realtime API (Recommended for hackathon)**

```javascript
// Twilio webhook: incoming call triggers WebSocket media stream
app.post("/incoming-call", (req, res) => {
  const twiml = `
    <Response>
      <Say>Connecting you to the AI relay...</Say>
      <Connect>
        <Stream url="wss://${req.headers.host}/media-stream" />
      </Connect>
    </Response>`;
  res.type("text/xml").send(twiml);
});

// WebSocket handler: bridges Twilio audio with OpenAI Realtime
app.ws("/media-stream", (ws) => {
  const transport = new TwilioRealtimeTransportLayer({ 
    twilioWebSocket: ws 
  });
  const session = new RealtimeSession(agent, { transport });
  session.connect({ apiKey: OPENAI_API_KEY });
});
```

**This is production-ready code** — Twilio published an official tutorial for exactly this pattern in August 2025. The OpenAI Agents SDK even includes a `TwilioRealtimeTransportLayer` class.

**Option B: Twilio + Deepgram STT + Custom Logic + ElevenLabs TTS**

```
Twilio Call Audio (mulaw 8kHz)
    → WebSocket to your server
    → Deepgram Streaming STT (mulaw → text, ~200ms)
    → Your relay logic (format text, add context)
    → ElevenLabs streaming TTS (text → audio, ~300ms)
    → WebSocket back to Twilio
    → Audio played on call
```

This gives more control over each component but requires more plumbing.

**Option C: Vapi.ai (Simplest but less control)**

```javascript
// Vapi handles the entire voice pipeline
const call = await vapi.calls.create({
  phoneNumber: "+1234567890",
  assistant: {
    model: { provider: "openai", model: "gpt-4o" },
    voice: { provider: "11labs", voiceId: "..." },
    firstMessage: "Emergency relay service. Connecting you now.",
    instructions: "You are an emergency relay. Read exactly what the text user types..."
  }
});
```

### 4.3 Real-Time STT Accuracy Comparison

| Engine | Model | WER (Word Error Rate) | Latency (Streaming) | Price | Emergency Suitability |
|--------|-------|----------------------|---------------------|-------|----------------------|
| **Deepgram** | Nova-2 | ~8.4% (general), ~5% (medical) | **200-400ms** | $0.0043/min (pay-as-you-go) | ⭐⭐⭐⭐⭐ Best for real-time, supports mulaw |
| **OpenAI Whisper** | Whisper large-v3 | ~5-8% (general) | **1-3s (batch), ~500ms (streaming via API)** | $0.006/min | ⭐⭐⭐ Good accuracy, higher latency |
| **Google Cloud STT** | Chirp 2 / V2 | ~6-10% (general) | **300-500ms** | $0.006/min (standard) | ⭐⭐⭐⭐ Medical model available |
| **AssemblyAI** | Universal-2 | ~5-8% (general) | **250-500ms** | $0.015/min (streaming) | ⭐⭐⭐⭐ Good quality, higher price |
| **Azure Speech** | Custom Neural | ~5-10% (general) | **200-400ms** | $0.016/hr audio | ⭐⭐⭐ Good with custom models |

**Critical factors for emergency context:**
- **Noisy environments:** Deepgram Nova-2 has excellent noise handling. Google also good.
- **Accented speech:** Whisper handles diverse accents best. Deepgram close second.
- **Medical terminology:** Google's medical dictation model is purpose-built. Deepgram's Nova-2 medical tier also strong.
- **Mulaw 8kHz (telephone audio):** Deepgram natively supports this. Others may need transcoding.
- **Streaming vs batch:** For real-time relay, streaming is mandatory. Deepgram and AssemblyAI have the best streaming APIs.

**Recommendation for hackathon: Deepgram Nova-2** — lowest latency for streaming, direct mulaw support (no transcoding from Twilio), good accuracy, cheapest pricing for prototyping.

### 4.4 TTS Quality for Emergency Calls

| Engine | Naturalness | Latency (TTFB) | Price | Streaming | Emergency Suitability |
|--------|------------|-----------------|-------|-----------|----------------------|
| **ElevenLabs** | ⭐⭐⭐⭐⭐ Most natural | **~300-500ms** TTFB, ~100ms streaming chunks | $0.30/1K chars (free tier: 10K chars/month) | Yes (WebSocket) | ⭐⭐⭐⭐⭐ Most convincing voice |
| **OpenAI TTS** | ⭐⭐⭐⭐ Very natural | **~300-500ms** | $15.00/1M chars | Yes | ⭐⭐⭐⭐ Good, integrated with Realtime API |
| **Google Cloud TTS** | ⭐⭐⭐⭐ Neural voices good | **~200-400ms** | $4.00/1M chars (Neural2) | Yes | ⭐⭐⭐⭐ Reliable, many languages |
| **Amazon Polly** | ⭐⭐⭐ Good but less natural | **~100-200ms** (fastest TTFB) | $4.00/1M chars (Neural) | Yes | ⭐⭐⭐ Fastest TTFB, less natural |
| **Azure Neural TTS** | ⭐⭐⭐⭐ Very natural | **~200-400ms** | $15.00/1M chars | Yes | ⭐⭐⭐⭐ Good with custom voices |

**Critical factors for emergency relay:**
1. **Clarity over naturalness:** The PSAP dispatcher needs to understand every word. Amazon Polly's slightly robotic but very clear speech might actually be better than ultra-natural but sometimes mumbled ElevenLabs.
2. **SSML support:** Ability to control pronunciation, speed, emphasis. All support SSML.
3. **Telephone audio quality:** At 8kHz mulaw, ultra-high-quality TTS is wasted. Google Cloud TTS or Amazon Polly are perfectly fine.
4. **Reliability:** Google and Amazon have better uptime guarantees than ElevenLabs.

**Recommendation for hackathon: ElevenLabs** for demo impressiveness (most natural), but **Google Cloud TTS** for a production path (reliable, cheap, clear).

### 4.5 Simulating a 112 Dispatch Center for Demo

**Option 1: Two-Phone Demo (Simplest)**
```
Phone A (deaf user) → types text in app → 
  AI relay server → TTS → 
  Twilio places call → 
Phone B (acting as PSAP) → dispatcher picks up, hears AI voice → 
  dispatcher speaks → STT → 
  text appears on Phone A's screen
```
Just have a team member answer "Phone B" and act as a 112 dispatcher.

**Option 2: Web-Based PSAP Simulator**
- Build a simple web dashboard that mimics a PSAP console
- Shows incoming call with location on map
- Displays caller profile (medical info, accessibility needs)
- Has a "speak" button for dispatcher to respond
- Uses WebRTC for audio between the dashboard and relay server

**Option 3: Pre-Recorded Dispatcher Responses**
- Record typical 112 dispatcher phrases:
  - "What is your emergency?"
  - "What is your location?"
  - "Is anyone injured?"
  - "Emergency services are on the way"
- Play these in sequence during demo, triggered by the relay

**Option 4: AI-Powered PSAP Simulator**
- Use a second AI agent to play the role of 112 dispatcher
- Follows a realistic emergency dispatch protocol
- Responds dynamically to the user's emergency description
- **This creates the most impressive demo** but adds complexity

**Recommendation for hackathon: Option 1 (Two-Phone) for reliability, with Option 2 (Web Dashboard) if time permits for visual wow-factor.**

### 4.6 WebRTC for Browser-Based Emergency Calling

**Why WebRTC is relevant:**
- No app install required — works in any modern browser
- Built-in echo cancellation, noise suppression, codec support
- P2P or server-mediated audio/video
- Works on mobile browsers (Safari, Chrome, Firefox)

**How to use WebRTC in our architecture:**

```
User's Browser (WebRTC)
    → getUserMedia() for optional microphone access
    → RTCPeerConnection to relay server
    → Server receives audio stream
    → Forwards to STT → processes → TTS
    → Sends TTS audio back via WebRTC
    → Also bridges to PSTN via Twilio for the 112 call
```

**Key advantage:** For deaf users who CAN speak but can't hear, they could speak directly via WebRTC (their voice goes to 112) and receive text transcription of the dispatcher's response. This is simpler than full text-to-speech relay.

**Libraries:**
- **simple-peer** (npm) — simplest WebRTC wrapper
- **PeerJS** — higher-level WebRTC abstraction
- **mediasoup** — SFU (Selective Forwarding Unit) for multi-party
- **LiveKit** — production WebRTC infrastructure with AI integrations

**For hackathon: Use Twilio Client SDK (WebRTC-based) rather than raw WebRTC.** Twilio Client lets you make/receive calls from a browser and connects natively to Twilio's PSTN infrastructure. Less code, more reliable.

```javascript
// Twilio Client in browser
const device = new Twilio.Device(token);
const call = await device.connect({ 
  params: { To: "+112simulatednumber" } 
});
// Audio flows through Twilio's infrastructure
// Server-side Media Stream handles AI relay
```

---

## 5. Reliability & Safety

### 5.1 Emergency Services Uptime/Reliability Standards

**NENA (National Emergency Number Association) — US standards:**
- PSAPs are expected to meet **99.999% availability** ("five nines") — ~5 minutes downtime/year.
- NG911 ESInet (Emergency Services IP Network) specification requires:
  - No single point of failure
  - Geographically redundant hosting
  - Automatic failover in < 30 seconds
  - Call routing failover in < 1 second

**ETSI (European Standards):**
- ETSI TS 103 479: Emergency communications must be "equivalent" to voice calls in reliability.
- EU Delegated Regulation 2023/444: PSAPs must handle emergency communications "without undue delay."
- No specific uptime percentage mandated at EU level, but member states set their own (typically 99.9%-99.99%).

**For our hackathon project (demo/prototype):**
- We do NOT need to meet these standards — this is a proof of concept.
- But we should **design with these in mind** and document how the architecture would scale.
- Key design principles:
  - **Graceful degradation** — if AI fails, fall back to text relay or direct SMS
  - **No single dependency** — if ElevenLabs is down, switch to Google TTS
  - **Client-side resilience** — app works offline for basic SOS functions

### 5.2 Handling AI Failure During an Emergency Call

**Critical design pattern: Cascade Fallback**

```
Level 0: AI Real-Time Relay (STT + TTS, full conversation)
    ↓ (AI service fails)
Level 1: Simplified AI Relay (pre-built phrases only, no free-text STT)
    ↓ (TTS/STT service fails)
Level 2: Automated Text-to-112 (send pre-formatted SMS with location + emergency type)
    ↓ (SMS fails)
Level 3: Direct Emergency SMS (raw SMS to 112 with location)
    ↓ (no cellular)
Level 4: Offline SOS Beacon (flash screen, play alarm sound, store emergency for retry)
```

**Specific failure scenarios and mitigations:**

| Failure | Impact | Mitigation |
|---------|--------|------------|
| STT engine down | Can't transcribe dispatcher speech | Switch to backup STT provider (Deepgram → Google → local Whisper) |
| TTS engine down | Can't voice user's text to dispatcher | Switch to backup TTS (ElevenLabs → Google → Amazon Polly) |
| LLM timeout | Context formatting delayed | Bypass LLM, send raw text directly |
| Twilio outage | Can't place PSTN call | Fall back to direct SMS to 112 |
| WebSocket disconnects | Bidirectional audio lost | Auto-reconnect (exponential backoff, max 3 attempts in 10s) |
| Internet completely down | No relay possible | Cache emergency data locally, retry when connection restores, show offline emergency procedures |

**Implementation:**

```javascript
async function relayUserText(text) {
  try {
    // Try primary TTS (ElevenLabs)
    return await elevenLabsTTS(text);
  } catch (e) {
    console.warn("ElevenLabs failed, trying Google TTS");
    try {
      return await googleTTS(text);
    } catch (e2) {
      console.warn("Google TTS failed, trying Amazon Polly");
      try {
        return await amazonPolly(text);
      } catch (e3) {
        console.error("All TTS failed, sending raw text via SMS");
        await sendEmergencySMS(text);
        notifyUser("Voice relay failed. Your message was sent as SMS.");
      }
    }
  }
}
```

### 5.3 False Positive Prevention

**Risk: Can the AI accidentally trigger emergency response?**

**Accidental activation mitigations:**
1. **Deliberate activation flow:**
   - No one-tap emergency call. Require: select emergency type → confirm → relay activates.
   - "Slide to confirm" gesture (like iPhone's emergency SOS).
   - Show clear warning: "You are about to contact emergency services."
   
2. **AI behavioral guardrails:**
   - The AI relay is a translator, not a decision-maker. It does NOT call 112 on its own.
   - The AI only activates when the user explicitly initiates an emergency session.
   - TTS output is prefixed: "This is an AI relay service calling on behalf of a deaf user..."

3. **Content safeguards:**
   - AI should NOT interpret or summarize — it should relay exactly what the user types.
   - If user types "there's a fire," the AI says "The caller reports there is a fire" — not "There might be an emergency."
   - Dispatcher can ask clarifying questions, which are relayed back as text.

4. **Anti-abuse measures:**
   - Rate limiting: Max 1 emergency session per user per 5 minutes.
   - Session logging: All interactions logged for accountability.
   - User identification: Registered users with verified phone numbers.

### 5.4 Handling Multiple Simultaneous Emergency Calls

**Architecture for concurrency:**

```
Load Balancer
    ├── Relay Server Instance 1 (handles calls 1-N)
    ├── Relay Server Instance 2 (handles calls N+1-2N)
    └── Relay Server Instance 3 (handles calls 2N+1-3N)
```

**For hackathon demo:**
- Single server can handle ~50 concurrent WebSocket connections easily.
- Each call uses ~2 WebSocket connections (one to Twilio, one for AI service).
- Twilio handles the telephony scaling — their infrastructure supports millions of concurrent calls.
- STT/TTS services are stateless API calls — scale horizontally.

**For production:**
- Use Kubernetes with horizontal pod autoscaling.
- Each pod handles N concurrent sessions.
- Shared session state in Redis.
- Twilio's infrastructure handles PSTN-side scaling.

**Resource per call:**
- ~2MB RAM for WebSocket connections and audio buffers
- ~5-10 Kbps bandwidth per direction (8kHz mulaw audio)
- ~$0.05-0.10 per minute total API costs (Twilio + STT + TTS)

### 5.5 Battery/Connectivity Concerns

**What if the app loses connection mid-emergency?**

**Connectivity strategies:**
1. **Progressive Web App (PWA) with Service Worker:**
   - Cache critical app shell offline.
   - If connection drops, show offline emergency procedures.
   - Queue messages for retry when connection restores.

2. **Network resilience:**
   - WebSocket auto-reconnect with exponential backoff.
   - If WebSocket fails, fall back to HTTP long-polling.
   - If data connection fails, fall back to SMS.

3. **SMS fallback (most reliable):**
   - SMS works on 2G — available even with weak signal.
   - If the relay server detects connection instability, automatically switch to SMS mode.
   - Send structured SMS: "EMERGENCY: [type]. Location: [lat,lon]. User: [name]. Medical: [conditions]."

4. **Battery optimization:**
   - GPS is the biggest battery drain. Use coarse location (cell tower) first, fine location (GPS) only once emergency is confirmed.
   - Audio streaming is moderate battery use (~3-5% per 10 minutes).
   - Keep-alive pings should be minimal (every 30s, not every 1s).

5. **Offline emergency features:**
   - Show emergency number for the user's country
   - Display user's medical information card
   - Enable torch/flashlight as SOS signal
   - Play loud alarm sound

---

## 6. Recommended Technical Stack for 48h Build

### Primary Architecture: Twilio + OpenAI Realtime API

This is the simplest, most powerful option. The OpenAI Realtime API handles speech-to-speech natively, and Twilio has an official integration.

```
┌─────────────────────────────────────────────────────┐
│            Frontend (React/Next.js PWA)              │
│                                                     │
│  • Emergency type selector (fire/medical/police)    │
│  • Chat interface (user types messages)             │
│  • Real-time transcription display                  │
│  • GPS location display on map                      │
│  • Medical profile display                          │
│  • Connection status indicator                      │
│  • Fallback: SMS emergency button                   │
│                                                     │
└──────────────────────┬──────────────────────────────┘
                       │ WebSocket + REST
                       ▼
┌─────────────────────────────────────────────────────┐
│         Backend (Node.js + Fastify/Express)          │
│                                                     │
│  • /incoming-call  — Twilio webhook (TwiML)         │
│  • /media-stream   — WebSocket for Twilio audio     │
│  • /api/session    — Create/manage relay sessions   │
│  • /api/message    — User sends text message        │
│  • /ws/chat        — WebSocket for user chat        │
│                                                     │
│  Relay Engine:                                      │
│  • User text → inject into AI agent context         │
│  • AI agent speaks text to dispatcher via Twilio    │
│  • Dispatcher speech → transcribed by AI            │
│  • Transcription sent to user via WebSocket         │
│                                                     │
└──────────┬───────────────────────┬──────────────────┘
           │                       │
           ▼                       ▼
┌──────────────────┐    ┌──────────────────────────┐
│   Twilio Voice   │    │  OpenAI Realtime API     │
│                  │    │                          │
│ • Place PSTN call│    │ • Speech-to-speech AI    │
│ • Media Streams  │    │ • Tool calling           │
│ • Call recording │    │ • Guardrails             │
│                  │    │ • Context management     │
└──────────────────┘    └──────────────────────────┘
```

### Specific Technology Choices

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | Next.js 14+ (React) | SSR for fast load, PWA support, easy deployment on Vercel |
| **Backend** | Node.js + Fastify | WebSocket native, Twilio SDK available, fast |
| **Telephony** | Twilio Voice | Best documented, Media Streams for WebSocket audio, global numbers, ~$1/number/month |
| **AI Voice** | OpenAI Realtime API | Speech-to-speech native, lowest latency, official Twilio integration via `@openai/agents-extensions` |
| **STT (backup)** | Deepgram Nova-2 | If not using OpenAI Realtime: fastest streaming, mulaw native, $0.0043/min |
| **TTS (backup)** | ElevenLabs | If not using OpenAI Realtime: most natural voice, streaming WebSocket API |
| **Maps** | Mapbox or Leaflet/OSM | Location display, free tier sufficient |
| **Database** | SQLite (dev) / Supabase (prod) | Session storage, user profiles, call logs |
| **Hosting** | Railway.app or Fly.io | WebSocket support, easy deploy, free tier |
| **Domain/SSL** | ngrok (dev) or Cloudflare Tunnel | Required for Twilio webhooks in development |

### Cost Estimate for Hackathon

| Service | Free Tier | Cost for Demo |
|---------|-----------|---------------|
| Twilio | $15 trial credit | ~$1 for phone number + ~$0.50 for test calls |
| OpenAI Realtime API | Pay-as-you-go | ~$2-5 for demo calls (audio in/out) |
| Deepgram (backup) | $200 free credit | $0 |
| ElevenLabs (backup) | 10K chars/month free | $0 |
| Vercel (frontend) | Free tier | $0 |
| Railway (backend) | $5 free credit | $0 |
| **Total** | | **~$5-10 for entire hackathon** |

### Implementation Timeline (48 hours)

**Hours 0-4: Setup & Infrastructure**
- [ ] Set up repo (monorepo: `/frontend`, `/backend`)
- [ ] Create Twilio account, buy phone number
- [ ] Set up OpenAI API key with Realtime API access
- [ ] Basic Fastify server with health check
- [ ] ngrok tunnel for Twilio webhooks
- [ ] Test: call Twilio number → hear "Hello World" TwiML

**Hours 4-12: Core Relay Engine**
- [ ] Implement Twilio Media Streams WebSocket handler
- [ ] Connect to OpenAI Realtime API via `@openai/agents-extensions`
- [ ] Configure AI agent prompt: "You are an emergency relay service..."
- [ ] Test: call Twilio number → speak → AI responds
- [ ] Add tool for "user sends text message" → AI speaks it on the call
- [ ] Test: type text in backend → AI speaks it on active call

**Hours 12-20: User Interface**
- [ ] Next.js app with emergency type selection screen
- [ ] Chat interface (user types messages)
- [ ] WebSocket connection to backend for real-time transcription
- [ ] Display incoming dispatcher speech as text
- [ ] GPS location capture and display
- [ ] Medical profile form (pre-fill emergency info)

**Hours 20-28: Integration & Polish**
- [ ] Full flow: user types → AI speaks to "dispatcher" → dispatcher speaks → user sees text
- [ ] Add emergency context to AI prompt (location, medical info, emergency type)
- [ ] Add connection status indicator
- [ ] Add "call active" / "call ended" states
- [ ] SMS fallback button

**Hours 28-36: Demo Preparation**
- [ ] Build PSAP simulator (simple web dashboard or second phone)
- [ ] Create demo script (realistic emergency scenario)
- [ ] Add visual polish (emergency color scheme, accessibility)
- [ ] Record backup demo video (in case live demo fails)
- [ ] Load testing (2-3 concurrent calls)

**Hours 36-48: Testing, Slides, Buffer**
- [ ] End-to-end testing with real phones
- [ ] Edge case testing (disconnect, reconnect, long messages)
- [ ] Pitch deck / presentation
- [ ] Buffer for unexpected issues

### Key Code: Minimal Relay Server

```javascript
// server.js — Minimal AI Emergency Relay (Twilio + OpenAI Realtime)
import Fastify from "fastify";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import { RealtimeAgent, RealtimeSession, tool } from "@openai/agents/realtime";
import { TwilioRealtimeTransportLayer } from "@openai/agents-extensions";

const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

// Store active sessions (user text → AI voice)
const sessions = new Map();

// Define the relay agent
const relayAgent = new RealtimeAgent({
  name: "Emergency Relay",
  instructions: `You are an AI emergency relay service helping a deaf/hard-of-hearing 
    person communicate with a 112 emergency dispatcher.
    
    RULES:
    - When you receive a user_message tool call, speak EXACTLY what the user typed.
    - Prefix the first message with: "This is an AI relay service calling on behalf of 
      a deaf caller who communicates via text."
    - Transcribe everything the dispatcher says back to the user via the 
      transcribe_to_user tool.
    - Do NOT interpret, summarize, or add your own content.
    - Speak clearly and at a moderate pace.
    - If the dispatcher asks a question, relay it exactly as text to the user.`,
  tools: [
    tool({
      name: "transcribe_to_user",
      description: "Send dispatcher's speech as text to the deaf user",
      parameters: { type: "object", properties: { text: { type: "string" } } },
      execute: async ({ text }, { sessionId }) => {
        const session = sessions.get(sessionId);
        if (session?.userWs) {
          session.userWs.send(JSON.stringify({ type: "transcript", text }));
        }
        return "Sent to user";
      },
    }),
  ],
});

// Twilio incoming call webhook
fastify.all("/incoming-call", async (request, reply) => {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Connect>
        <Stream url="wss://${request.headers.host}/media-stream" />
      </Connect>
    </Response>`;
  reply.type("text/xml").send(twiml);
});

// Twilio Media Stream WebSocket (audio bridge)
fastify.register(async (app) => {
  app.get("/media-stream", { websocket: true }, async (connection) => {
    const transport = new TwilioRealtimeTransportLayer({
      twilioWebSocket: connection,
    });
    const session = new RealtimeSession(relayAgent, { transport });
    await session.connect({ apiKey: process.env.OPENAI_API_KEY });
    // Store session for text injection
    const sessionId = Date.now().toString();
    sessions.set(sessionId, { realtimeSession: session, userWs: null });
  });
});

// User WebSocket (text chat from deaf user)
fastify.register(async (app) => {
  app.get("/user-chat", { websocket: true }, async (connection) => {
    connection.on("message", async (msg) => {
      const data = JSON.parse(msg);
      if (data.type === "emergency_message") {
        // Inject user's text into the active relay session
        // The AI agent will speak this text to the dispatcher
        // Implementation depends on session management
      }
    });
  });
});

fastify.listen({ port: process.env.PORT || 5050 });
```

### Quick Reference: API Endpoints Needed

```
POST /incoming-call          — Twilio webhook, returns TwiML
GET  /media-stream (ws)      — Twilio Media Stream (bidirectional audio)
GET  /user-chat (ws)         — User's text chat WebSocket
POST /api/session/create     — Create new emergency session
POST /api/session/:id/message — User sends text message
GET  /api/session/:id/status — Get session status
POST /api/profile            — Save/update user medical profile
```

### Essential npm Packages

```json
{
  "dependencies": {
    "fastify": "^4.x",
    "@fastify/formbody": "^7.x",
    "@fastify/websocket": "^10.x",
    "@openai/agents": "^0.x",
    "@openai/agents-extensions": "^0.x",
    "twilio": "^5.x",
    "dotenv": "^16.x",
    "zod": "^3.x"
  }
}
```

### Alternative Stack: Twilio + Deepgram + ElevenLabs (More Control)

If the team wants more control over each component (or OpenAI Realtime API has issues):

```json
{
  "dependencies": {
    "fastify": "^4.x",
    "@fastify/websocket": "^10.x",
    "twilio": "^5.x",
    "@deepgram/sdk": "^3.x",
    "elevenlabs": "^0.x",
    "dotenv": "^16.x"
  }
}
```

**Flow with this stack:**
```
Twilio call audio (mulaw 8kHz) 
  → WebSocket → Deepgram streaming STT → text
  → Send text to user's browser via WebSocket
  → User types response → text
  → ElevenLabs streaming TTS → audio chunks
  → Send audio chunks back to Twilio via WebSocket
  → Dispatcher hears user's message as speech
```

---

## Appendix A: Key Links and Resources

### Standards & Specifications
- ETSI TS 103 479 — Accessible emergency communications: https://www.etsi.org/deliver/etsi_ts/103400_103499/103479/
- ETSI TS 103 478 — PEMEA: https://www.etsi.org/deliver/etsi_ts/103400_103499/103478/
- NENA i3 Standard: https://www.nena.org/page/i3_Stage3
- RFC 4103 — RTP for Real-Time Text: https://www.rfc-editor.org/rfc/rfc4103

### EU Reports
- EC 2024 Report on 112: https://digital-strategy.ec.europa.eu/en/library/report-implementation-112-eu-emergency-number
- EENA 112 Country Report Cards: https://eena.org/wp-content/uploads/2024_09_25_112_report_card_new_design.pdf
- European Accessibility Act (deadline June 2025): https://ec.europa.eu/social/main.jsp?catId=1202

### AI & Emergency Services
- Corti AI: https://www.corti.ai
- Corti-EENA pilot report: https://eena.org/wp-content/uploads/2020/01/2020_01_13_Corti_Report.pdf
- RapidSOS: https://rapidsos.com
- Carbyne: https://carbyne.com

### APIs & SDKs
- Twilio Media Streams: https://www.twilio.com/docs/voice/media-streams
- Twilio + OpenAI Realtime tutorial: https://www.twilio.com/en-us/blog/developers/tutorials/product/speech-assistant-realtime-agents-sdk-node
- OpenAI Realtime API: https://platform.openai.com/docs/api-reference/realtime
- OpenAI Agents SDK: https://github.com/openai/openai-agents-js
- Deepgram streaming STT: https://developers.deepgram.com/docs/streaming
- ElevenLabs WebSocket TTS: https://elevenlabs.io/docs/api-reference/websockets

### Emergency Access Apps
- AccesSOS: https://accessos.io (multi-platform emergency access for disabilities)
- 999 BSL (UK): https://999bsl.co.uk
- 112 Suomi (Finland): https://112.fi/en/112-suomi-application
- Where ARE U (Italy): https://www.areu.lombardia.it/web/home/app-where-are-u
- RogerVoice (France): https://rogervoice.com — captioned phone calls for deaf users

### DEC112 / NG112
- DEC112 project: https://www.2112.at/dec112/
- NG112 reference: https://ng112.2112.at/

---

## Appendix B: Competitive Landscape Summary

| Solution | Type | How It Works | Our Advantage |
|----------|------|-------------|---------------|
| **Text-to-911/112 (SMS)** | Native | User sends SMS, dispatcher reads | We provide real-time conversation (not async SMS) |
| **VRS (Video Relay)** | Human relay | Sign language interpreter bridges | We don't need an interpreter (AI), 24/7, no wait time |
| **IP Relay** | Human relay | Human types what they hear | We're instant (AI), no human bottleneck |
| **Emergency apps (112 Suomi, etc.)** | App-based | SMS/chat to PSAP | We bridge to existing voice infrastructure (no PSAP upgrade needed) |
| **DEC112** | SIP/RTT | Real-time text to upgraded PSAP | We work with ANY PSAP (sends voice, not text) — no PSAP upgrade |
| **Google Live Relay** | On-device AI | STT+TTS for calls | Not integrated with emergency services, not specialized |
| **RogerVoice** | Caption app | Captions calls for deaf users | We do bidirectional relay (text→speech AND speech→text) |

**Our key differentiator: We work with existing PSAP voice infrastructure. The PSAP receives a normal voice call. No upgrades, no new protocols, no integration required on their end. The AI is our middleware.**

---

*End of research report. Last updated: 2026-03-28.*
