# Competitive Analysis: GDG Belgrade "Build with AI" Hackathon 2026

**Theme:** "AI for All — Bridging the Accessibility Gap"  
**Sponsor:** Google (GDG Belgrade)  
**Our Project:** Medak — Emergency Relay for Deaf/Speech-Impaired (originally explored as "Cocoon" for autism meltdown prediction)
**Date:** March 2026

> **[POST-HACKATHON UPDATE]** This competitive analysis was written when the team was planning to build P11 "Cocoon" (autism meltdown prediction). The team ultimately pivoted to **P09 "Medak"** — an AI emergency relay system for deaf/speech-impaired people. Sections 1-3 (cliche landscape, honorable mentions, tech stacks) remain fully applicable regardless of project choice. Sections 4-8 are Cocoon-specific strategy that was not used; they are preserved below for research value. For Medak's actual architecture, see `medak/docs/design-document.md`.

---

## 1. The Cliché Landscape: TOP 5 Projects Every Team Will Build

Based on research across Devpost galleries, past GDG/Google hackathons, accessibility hackathons (Raptors DEI 2025, Microsoft AI for Accessibility 2024, MEGA Hackathon 2024, Emory Hacks 2025), and the Gemini API Developer Competition 2024 winners — these are the projects judges will see **over and over again**:

### 🥇 #1: Sign Language Translator (Real-Time ASL/Gesture Recognition)
**Probability: 90% — at least 2-3 teams will attempt this**

- **What it is:** Camera-based app that recognizes hand gestures → translates to text/speech. Usually uses MediaPipe + Gemini or TensorFlow.
- **Why it's clichéd:** This is the **#1 most overdone accessibility hackathon project in history.** Appeared at: Bolt Hackathon 2025 (SignBridge Lite), Vision Pro Hackathon 2025, Voice AI Hackathon 2025, Emory Hacks 2025 (multiple teams), MEGA Hackathon 2024. At one hackathon, 3 teams built the **exact same project with the exact same name** because they all asked ChatGPT for ideas.
- **Why it fails in judging:** Accuracy is always terrible in demos. Only recognizes A-E letters or 5-10 gestures. Real sign language is contextual, spatial, and grammatically complex — a weekend demo can't capture this. Judges have seen this fail live 50 times.
- **Tech:** MediaPipe Hand Tracking, TensorFlow/TFLite, Gemini Vision API, webcam input.

### 🥈 #2: Image Description / Screen Reader for the Blind
**Probability: 80% — at least 1-2 teams**

- **What it is:** App that describes images/scenes for visually impaired users. Uses Gemini's multimodal vision to generate alt-text or narrate surroundings.
- **Why it's clichéd:** Google's own Be My Eyes / Lookout already does this. ViddyScribe won "Best Web App" at Google's own Gemini API competition in 2024 for adding audio descriptions to videos. Ally (personal assistant for blind users) was an honorable mention. Every accessibility hackathon has 1-3 of these.
- **Why it fails:** Hard to demo compellingly (judge watches someone point a phone at a cup and hears "this is a cup"). Feels like a thin wrapper around `gemini.generateContent({image})`. Judges think: "So you called the API. Cool."
- **Tech:** Gemini Vision API, TTS (text-to-speech), camera input. Possibly Chrome extension.

### 🥉 #3: Real-Time Captioning / Speech-to-Text for the Deaf
**Probability: 70% — 1-2 teams**

- **What it is:** App that transcribes speech in real-time, sometimes with AI-enhanced summarization, speaker identification, or translation.
- **Why it's clichéd:** Google Live Transcribe, Otter.ai, and built-in OS features already exist. EduVoice (MEGA Hackathon 2024) did exactly this. At the Raptors hackathon, this appeared as a sub-feature in multiple winning projects.
- **Why it fails:** Hard to differentiate from existing free tools. Usually crashes in noisy demo environments. Judges think: "My phone already does this."
- **Tech:** Google Speech-to-Text API or Whisper, Gemini for summarization, WebSocket streaming.

### 🏅 #4: AI Chatbot for Mental Health / Therapy
**Probability: 60% — 1 team**

- **What it is:** Conversational AI that provides emotional support, CBT exercises, or mental health check-ins. Sometimes specifically for neurodivergent users.
- **Why it's clichéd:** Every single AI hackathon (accessibility-themed or not) has multiple therapy chatbots. At the ODSC-Google Cloud Hackathon 2025, StoryGrow (monitoring emotional well-being) came 2nd. MindGarden was a finalist. These are everywhere.
- **Why it fails:** Ethical landmine — judges worry about AI giving mental health advice. No clinical validation. Often just a Gemini API wrapper with a system prompt that says "you are a therapist." Judges think: "This is dangerous and also boring."
- **Tech:** Gemini API, basic chat UI, maybe sentiment analysis.

### 🏅 #5: Accessibility Checker / WCAG Compliance Scanner
**Probability: 50% — 1 team**

- **What it is:** Tool that scans websites for accessibility issues (color contrast, missing alt-text, keyboard navigation) and suggests AI-powered fixes.
- **Why it's clichéd:** ComplyScan won "Technical Architecture" at Raptors DEI Hackathon 2025. Chrome extensions for accessibility are a well-trodden path. WAVE, axe, Lighthouse already exist.
- **Why it fails:** Feels like a dev tool, not a user-facing accessibility solution. Hard to make the demo emotionally compelling. Judges think: "This is useful but not inspiring."
- **Tech:** Chrome Extension API, Lighthouse/axe-core, Gemini for fix suggestions.

---

## 2. Honorable Mentions: Other Likely Projects

| Project | Likelihood | Why Overdone |
|---------|-----------|--------------|
| Voice-controlled web browser for blind | 40% | VoxSurf won 1st at Raptors 2025 |
| AI-powered text simplification for cognitive disabilities | 40% | VITE VERE won Google's "Most Impactful" 2024 |
| Dyslexia-friendly reading tool | 30% | Common at education hackathons |
| Eye-tracking communication for ALS | 30% | GazeLink won "Best Android" at Google 2024 |
| Color blindness filter / Chrome extension | 30% | Visibly (Emory 2025), extremely simple to build |
| Restaurant ordering for speech-impaired | 20% | Menu Buddy was honorable mention at Google 2024 |

---

## 3. Technology Stack Every Team Will Use

Based on it being a Google-sponsored GDG event:

| Technology | Usage % | Notes |
|-----------|---------|-------|
| **Gemini API** (text + vision) | 95% | Required for brownie points at GDG event |
| **Python + Flask/FastAPI** | 60% | Default beginner stack |
| **React / Next.js frontend** | 50% | Standard web app |
| **Firebase** | 40% | Easy auth/DB for hackathons |
| **MediaPipe** | 30% | For gesture/hand tracking projects |
| **Google Cloud Speech-to-Text** | 25% | For captioning projects |
| **TensorFlow / TFLite** | 20% | For ML-heavy projects |
| **Flutter** | 15% | For mobile app projects |

**Key insight:** Most teams will build a **web app that calls the Gemini API** and wraps it in a nice UI. The Gemini API call IS their entire project. They'll spend 20 hours on UI and 2 hours on the actual AI integration.

---

> **[NOTE]** Sections 4-8 below describe the Cocoon/P11 positioning strategy. The team built Medak/P09 instead. This content is preserved as pre-hackathon research.

## 4. What Makes "Cocoon" Stand Out vs. The Crowd

### 4.1 — Invisible Disability vs. Visible Disability

**Every other team** will focus on the "classic three" visible disabilities:
- 👁️ Vision (blind/low vision)
- 👂 Hearing (deaf/hard of hearing)  
- 🖐️ Motor (mobility/dexterity)

**Cocoon focuses on:** Autism — an **invisible, neurological** disability that affects **1 in 31 children** (CDC 2025 data, up from 1 in 36 in 2020). This is a population that's:
- **Massively underserved** by tech
- **Growing rapidly** in prevalence (20% increase from 2018-2022)
- **Invisible** — you can't see autism, which means tech solutions require deeper thinking
- **Emotionally resonant** — every judge knows or knows of an autistic child

**Differentiation angle:** "While most accessibility projects help people interact with technology, Cocoon helps people interact with *the world*. The accessibility gap isn't just screens and keyboards — it's sensory environments, social situations, and the unpredictable chaos of everyday life."

### 4.2 — Prediction vs. Reaction

**Every other project** at this hackathon will be **reactive** — it responds to a need in the moment:
- See sign language → translate it
- Hear speech → caption it
- See image → describe it

**Cocoon is predictive.** It detects patterns *before* a meltdown happens. This is:
- **Technically more sophisticated** (time-series analysis, physiological signal processing, behavioral pattern recognition)
- **More impactful** (preventing a crisis > responding to one)
- **More novel** (judges have never seen this at a hackathon)

**Differentiation angle:** "Most accessibility tools are translators. Cocoon is a forecaster. We don't wait for the crisis — we predict it and help prevent it."

### 4.3 — Family/Caregiver Impact

Most accessibility projects help **one person** (the person with the disability). Cocoon helps an **entire family ecosystem**:
- The autistic individual (reduced meltdowns, better regulation)
- Parents/caregivers (early warning, reduced stress, data for doctors)
- Teachers/therapists (objective behavioral data, pattern insights)
- Siblings (calmer household)

**Differentiation angle:** "Accessibility isn't just about the individual — it's about everyone around them. Cocoon gives families a shared language for understanding what's happening inside."

### 4.4 — Research-Backed, Not Feature-Stuffed

Most hackathon projects throw features at the wall. Cocoon can cite:
- **CDC prevalence data:** 1 in 31 children (2025), up 480% since 2000
- **Physiological research:** Autism meltdowns correlate with measurable HRV (heart rate variability) changes, skin conductance spikes, and sleep disruption patterns
- **Cost data:** Annual autism costs in the US: $268.3 billion, projected $11.5-15 trillion by 2029
- **Global impact:** 0.77% of children worldwide have ASD (21M+ children screened in meta-analysis, Feb 2025)
- **Caregiver burnout:** 1 in 4 families with an autistic child struggle with food or housing insecurity (Autism Speaks 2025)

### 4.5 — Google Ecosystem Deep Integration

Since it's a Google/GDG event, Cocoon can leverage the **full** Google stack (not just Gemini API for text generation):
- **Gemini multimodal**: Analyze behavioral descriptions, voice tone, environmental context
- **Vertex AI**: Time-series forecasting models for meltdown prediction
- **Firebase**: Real-time data sync between family members/caregivers
- **Google Fit / Health Connect API**: Physiological data input (heart rate, sleep)
- **Wear OS**: Wearable integration for continuous monitoring
- **Google Cloud IoT**: Sensor data pipeline
- **Flutter**: Cross-platform app for parents + caregivers

This shows **breadth of Google ecosystem usage** — judges at GDG events love this.

---

## 5. Judge Fatigue: What They'll See 10 Times vs. Never

### 😴 Seen 10 times (Judge Fatigue Zone):
1. "We used Gemini to describe images for blind users"
2. "Our app translates sign language in real-time" (then demo fails)
3. "We built a chatbot that provides emotional support"
4. "Our Chrome extension checks websites for accessibility"
5. "We transcribe speech in real-time for deaf users"
6. "We used AI to simplify text for people with cognitive disabilities"
7. Team opens with "1 billion people worldwide live with disabilities"
8. Demo that's just a chat interface where you type and Gemini responds
9. Project that works perfectly in the video but crashes live
10. "We're bridging the gap between [X] and [Y]" (literally the hackathon theme rephrased)

### 🤯 Never seen (Cocoon's territory):
1. **Meltdown prediction** as an accessibility problem (entirely novel framing)
2. **Invisible disability** (autism) as the focus of an accessibility hackathon project
3. **Predictive AI** instead of reactive AI for accessibility
4. **Physiological data analysis** (HRV, sleep patterns, sensory triggers) for accessibility
5. **Family ecosystem** approach (not just individual user)
6. **Time-series forecasting** applied to human behavioral patterns
7. **Prevention-first** accessibility (preventing harm vs. adapting to limitations)
8. **Wearable integration** for accessibility (not just phone/web)
9. **Longitudinal data** approach (patterns over days/weeks, not just real-time)
10. **Multi-stakeholder** design (child + parent + teacher + therapist)

---

## 6. Presentation Differentiators: Killer Phrases & Points

### Opening (avoid clichés):
❌ "1 billion people live with disabilities worldwide"  
❌ "We want to bridge the accessibility gap"  
❌ "Accessibility is a fundamental right"  

✅ **"Every 20 minutes, somewhere in the world, a child with autism is having a meltdown that could have been predicted — and prevented. 1 in 31 children are autistic. That's not a niche. That's your neighbor's kid."**

### Core Pitch Points:

1. **"Accessibility isn't just about screens."** Most projects at this hackathon help people use technology. Cocoon helps people navigate *reality*. The accessibility gap isn't just digital — it's sensory, social, and environmental.

2. **"We don't translate. We predict."** Every team here built something reactive — translate this, caption that, describe this. Cocoon looks at patterns over time and warns caregivers *before* the crisis. That's a fundamentally different level of AI.

3. **"1 in 31 children. Zero prediction tools."** The CDC just updated autism prevalence to 1 in 31 — a 480% increase since 2000. Yet there are zero mainstream tools for predicting and preventing meltdowns. This is the most underserved accessibility population in tech.

4. **"We serve the whole family, not just the individual."** Accessibility tools typically have one user. Cocoon has four: the child, the parent, the teacher, and the therapist. Each gets a different view of the same data.

5. **"We used the full Google ecosystem, not just Gemini."** [List: Gemini for analysis, Vertex AI for time-series prediction, Firebase for real-time sync, Health Connect for physiological data, Flutter for cross-platform, Wear OS for wearable monitoring]. This isn't an API wrapper — it's a platform.

### Closing:
✅ **"The best accessibility tool is one you never need to use — because the crisis never happened."**

### If judges ask "How is this different from a mood tracker?":
**"Mood trackers are self-reported and retrospective. Cocoon is passive and predictive. It doesn't ask the child how they feel — it reads physiological signals, environmental context, and behavioral patterns to forecast what's coming. A nonverbal 5-year-old can't fill out a mood survey, but their heart rate variability doesn't lie."**

---

## 7. What Winning Projects at Google Hackathons Have in Common

From analyzing the Gemini API Developer Competition 2024, GKE Hackathon 2025, and ODSC-Google Cloud 2025:

| Trait | Present in Winners? | Cocoon? |
|-------|-------------------|---------|
| Solves a **real, specific** problem (not generic) | ✅ Always | ✅ Meltdown prediction for autism |
| **Deep** Google API integration (not just one API call) | ✅ Always | ✅ Full ecosystem |
| **Emotional storytelling** in demo | ✅ Most winners | ✅ Family impact stories |
| **Working demo** (not slides + mockups) | ✅ Required | ⚠️ Must prioritize |
| **Novel approach** (not existing app clone) | ✅ Always | ✅ No competitors |
| **Polished UI/UX** | ✅ Judges love visual appeal | ⚠️ Must allocate time |
| **Clear demo path** (problem → solution → result) | ✅ Critical | ✅ Plan this |
| **Business viability** (could this be a real product?) | ✅ Often mentioned | ✅ $268B market |

### Key Judging Insight (from Devpost judges):
> "A project that really stands out is one that was clearly considering the judging criteria... we look for submissions where they're very clearly trying to balance across all the criteria" — Richard Moot, Square

> "If I see that unusual and fresh approach to a certain problem, if I see the drive, if I see an excellent pitch, if they sell it, if I see the fire in their eyes — that's what I'm looking for in a winner" — Maria Yarotska, NEAR Foundation

> "Rehashed ideas that aren't interesting, something that's already been done... or is extremely simple" = negative score — Warren Marusiak, Atlassian

---

## 8. Risk Assessment

### Threats:
- **Scope creep:** Prediction is technically complex — risk of building too much and demoing nothing
- **No live data:** Can't actually monitor a child's meltdown in a demo. Need convincing synthetic data or simulation
- **Sensitive topic:** Autism is deeply personal. Must be respectful, not exploitative. Use language from the autism community (many prefer "autistic person" over "person with autism")
- **Wearable dependency:** If the pitch implies you need a smartwatch, it raises the cost barrier

### Mitigations:
- **Narrow the demo:** Show ONE prediction scenario end-to-end (simulated data → pattern detection → alert → suggested intervention). Don't try to demo everything.
- **Pre-record the "wow" moment:** Have a pre-recorded walkthrough as backup in case live demo fails
- **Frame the wearable as optional:** Phone-based passive sensing (microphone for environment, accelerometer for movement) works too
- **Use respectful framing:** "We built this with input from parents of autistic children" (even if it's informal interviews/research)
- **Have the stats ready:** 1 in 31, $268B cost, 0 prediction tools. Numbers kill doubt.

---

## TL;DR: Competitive Position

| Dimension | Other Teams | Cocoon |
|-----------|------------|--------|
| **Disability type** | Visible (blind, deaf, motor) | Invisible (autism/neurodivergent) |
| **AI approach** | Reactive (translate, caption, describe) | Predictive (forecast, prevent) |
| **Novelty** | Done 1000 times at hackathons | Never seen at a hackathon |
| **User scope** | Individual | Family ecosystem |
| **Google integration** | 1 API call (Gemini) | Full ecosystem (6+ products) |
| **Demo risk** | Low (familiar format) | Medium (needs simulation) |
| **Emotional impact** | Medium ("helping blind people see") | High ("preventing a child's crisis") |
| **Judge differentiation** | Zero — lost in the crowd | Maximum — only one of its kind |

**Bottom line:** In a room full of sign language translators and image describers, Cocoon will be the only project judges have *never seen before*. That alone puts it in the top 3 for memorability. Combine that with strong stats, emotional storytelling, deep Google ecosystem usage, and a working demo — and it's a serious contender for the win.
