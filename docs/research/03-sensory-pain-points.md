# 03 — Sensory Disability Pain Points & AI Opportunities

> Deep research into daily struggles of people with visual, hearing, and speech impairments.
> Goal: identify the highest-impact, most buildable problem for a Google hackathon team using Vertex AI / Gemini.

---

## 1. Visual Impairment

### 1.1 The Landscape

- **285 million** people worldwide with visual impairment (WHO); **39 million** fully blind
- **~8%** of men are color blind (~300 million globally)
- Screen reader usage: JAWS (41%), NVDA (38%), VoiceOver (<10%) on desktop; VoiceOver (71%) dominates mobile (WebAIM Survey #10, 2024)
- **86%** of screen reader users say **more accessible websites** (not better AT) would have the biggest impact

### 1.2 What Works Today

| Tool | What It Does | Quality |
|------|-------------|---------|
| **JAWS / NVDA** | Screen readers for Windows | Mature, powerful, reliable for well-structured sites |
| **VoiceOver** | iOS/macOS screen reader | Excellent mobile experience, dominant on iPhone |
| **Be My Eyes + GPT-4** | AI-powered visual assistance | Highly detailed scene descriptions, conversational Q&A about images |
| **Seeing AI** (Microsoft) | Camera-based recognition | Good at text, people, currency, color, scenes |
| **Envision AI / Envision Glasses** | Wearable + app for text/scene reading | Strong OCR, emerging smart glasses integration |
| **Google Lookout** | Android scene/text description | Decent but less polished than Be My Eyes |

### 1.3 What's Still Broken — Daily Pain Points

#### Web & App Inaccessibility (THE #1 Problem)
Per WebAIM Million 2025: **94.8% of top 1M websites have WCAG failures**. Average: **51 accessibility errors per page**.
- **79.1%** of pages have low-contrast text
- **55.5%** have missing alt text on images
- **48.2%** have missing form input labels
- **45.4%** have empty links
- **18.6%** of screen reader users say the web has gotten **less accessible** since 2021

**Top frustrations from WebAIM Survey #10 (ranked):**
1. **CAPTCHA** — by far the most hated item, twice as problematic for disabled users
2. Interactive menus/tabs/dialogs that don't behave as expected
3. Links or buttons that don't make sense
4. Screens that change unexpectedly
5. Lack of keyboard accessibility
6. Missing or improper alt text
7. Complex forms
8. Missing/improper headings

> "Just because you haven't gotten a complaint doesn't mean there are no issues. 67% of screen reader users **never or rarely** contact website owners about barriers." — WebAIM

#### Navigation & Wayfinding
- Indoor navigation remains largely unsolved — GPS doesn't work inside buildings
- Outdoor: sidewalk obstacles (construction, scooters, bikes) are invisible to GPS-based nav
- Smart cane projects (WeWalk) show promise but are expensive ($600+) and still clunky
- **Biped** (wearable device) and **Guidance** (emerging solutions) try to address real-time obstacle detection but are early-stage

#### Document Reading
- PDFs remain a nightmare — most scanned documents are images, not text
- Academic papers, government forms, legal documents: often inaccessible
- OCR works for clean printed text but fails on handwritten text, forms with checkboxes, multi-column layouts

#### Shopping
- Product packaging is unreadable — ingredients, expiry dates, cooking instructions
- Online shopping: image-heavy product pages often lack alt text
- In-store: no way to independently browse shelves, compare products, read price tags

#### Cooking
- Recipe websites are accessibility disasters (pop-ups, auto-playing videos, complex layouts)
- No standardized way to get step-by-step cooking guidance hands-free
- Reading food labels, measuring ingredients, checking if food is cooked — all visual tasks

#### Social Media
- Instagram, TikTok, Snapchat: primarily visual platforms with minimal accessibility
- User-generated content almost never has alt text
- Memes, infographics, screenshots of text: completely invisible to screen readers

### 1.4 AI Image Description — State of the Art

**Be My Eyes + GPT-4 (now "Be My AI")**
- ✅ Highly detailed scene descriptions
- ✅ Can answer follow-up questions about images
- ✅ Free for blind users
- ✅ Integration with Meta Ray-Ban glasses (real-time)
- ❌ Can't read handwritten text reliably
- ❌ Sometimes hallucinates details (describes things that aren't there)
- ❌ Struggles with spatial relationships ("is the cup to the left or right of the plate?")
- ❌ Slow for real-time navigation (latency 3-10 seconds)
- ❌ Can't describe video in real time (only snapshots)

**Seeing AI (Microsoft)**
- ✅ Fast text recognition
- ✅ Currency identification
- ✅ Person recognition (with training)
- ❌ iOS only
- ❌ Scene descriptions less detailed than GPT-4 based solutions
- ❌ Limited contextual understanding

**Key Gaps in AI Image Description:**
1. **Real-time video understanding** — describing a continuously changing scene (walking down a street, watching a sports game)
2. **Spatial reasoning** — "where exactly is X relative to Y"
3. **Handwritten text** — notes, whiteboard content, prescriptions
4. **Context persistence** — remembering what was described 30 seconds ago
5. **Fine-grained visual details** — exact colors, patterns, expressions in photos

---

## 2. Hearing Impairment

### 2.1 The Landscape

- **466 million** people worldwide with disabling hearing loss (WHO)
- **70 million+** use sign language as primary language
- Deaf vs. Hard of Hearing vs. Late-Deafened — very different needs
- Sign language is NOT universal — there are 300+ distinct sign languages globally

### 2.2 What Works Today

| Tool | What It Does | Quality |
|------|-------------|---------|
| **Google Live Caption** | On-device captions for any audio | Good for clear speech, built into Android/Chrome |
| **Otter.ai** | Meeting transcription + summaries | 80-90% accuracy typical; drops to 60-70% with noise/accents |
| **Live Transcribe** (Google) | Real-time speech-to-text | Decent for 1-on-1, struggles with group conversations |
| **Hearing aids** | Amplification + noise processing | $1,000-$8,000/pair; OTC hearing aids emerging ($200-$800) |
| **Cochlear implants** | Surgical hearing restoration | $30,000-$50,000+ per ear (surgery + device) |

### 2.3 What's Still Broken — Daily Pain Points

#### Captioning Accuracy in Real-World Conditions
Otter.ai real-world testing (2026):
- Clear speaker, quality mic: 98-99% accuracy
- Standard meeting: 80-90%
- Multiple speakers with noise: 70-80%
- Heavy accents, jargon, crosstalk: **below 70%**
- Speaker identification: **grade D** — misidentifies 30% of the time in 10-person meetings
- Only supports 3-4 languages (English, Spanish, French, Japanese)

Google Live Caption:
- On-device, privacy-preserving
- Breaks down with overlapping speech, background music, heavy accents
- No speaker identification
- English-only initially, slowly expanding

#### The #1 Unsolved Problem: Multi-Speaker, Real-Time Captioning with Speaker ID

In group conversations (dinner table, meetings, classrooms), deaf/HoH people face:
- **Who said what?** — Captioning tools can't reliably identify speakers in real-time
- **Overlapping speech** — When people talk over each other, captions become garbled
- **Cocktail party problem** — Separating a single voice from background noise
- **Turn-taking lag** — By the time captions appear, the conversation has moved on
- **No directional awareness** — Can't tell which person in the room is speaking

This is THE biggest gap. Deaf people describe group conversations as their single most isolating experience.

#### Phone Calls
- Captioned telephone services exist (CaptionCall, InnoCaption) but are US-only, require special hardware
- Video relay services (VRS) for sign language users work but require an interpreter (scheduling, availability)
- AI-powered phone captioning is emerging but laggy and error-prone

#### Sign Language Recognition & Generation
Per 2024 academic review (arxiv:2403.02563):
- Most sign language AI research is led by hearing researchers with no Deaf community input
- Datasets are misaligned — many trained on interpreter signing (not native Deaf signing)
- Best models achieve ~75% accuracy on isolated word recognition (WLASL100)
- **Continuous sentence-level recognition**: far from solved
- **Sign language generation** (avatars): widely rejected by Deaf community as "prematurely released, unintelligible"
- Regional/dialectal variation, facial expressions, body posture — mostly ignored by models
- Deaf community position (EUD 2025): "AI must not replace professional interpreters with imperfect systems"

#### Emergency Alerts
- Fire alarms, tornado sirens, car horns — all auditory
- Smart home alerts (flashing lights, bed shakers) exist but are expensive add-ons
- Public emergency systems (PA announcements, fire alarms in hotels) rarely have visual/vibrotactile equivalents

#### Music & Entertainment
- Deaf people can enjoy music through vibration, visual representation, and lyrics
- Live events: interpreters are rare, and captioning is often terrible or nonexistent
- Movies: cinema captioning devices (CaptiView) are unreliable, poorly maintained
- Gaming: audio cues in games are rarely accompanied by visual alternatives

---

## 3. Speech Impairment

### 3.1 The Landscape

- **~7.5 million** people in the US alone have trouble using their voice
- Conditions: ALS/MND, cerebral palsy, stroke (aphasia), dysarthria, stuttering, laryngectomy, autism (non-verbal)
- Speech impairment is often progressive — people with ALS gradually lose the ability to speak

### 3.2 AAC Device Costs (A Major Barrier)

| Device/App | Cost | Notes |
|-----------|------|-------|
| **Proloquo2Go** | $250 (app only) | + cost of iPad ($329-$799). iOS only. |
| **TouchChat HD** | $300 (app only) | Additional voice packs $12+ each |
| **TD Snap** | $50 (app) | Limited features vs. dedicated device |
| **Tobii Dynavox devices** | $3,000-$8,000 | Dedicated hardware with eye tracking |
| **Low-tech boards** | $30-$200 | Picture boards, no speech output |
| **GoTalk 9+** | $175 | Simple recorded messages |

**The cost picture is brutal:**
- A complete AAC setup (device + software + customization + training) can cost **$5,000-$15,000**
- Insurance coverage is inconsistent — many plans don't cover AAC or limit to one device per lifetime
- iPad + Proloquo2Go = $600-$1,050 minimum, which is **fraction** of dedicated devices but still significant
- Families in developing countries: completely priced out
- Wait times for device funding through schools/government: months to years

### 3.3 What's Still Broken

#### Voice Recognition Doesn't Understand Atypical Speech
- **Google Project Relate** (2022-): personal speech recognition for people with non-standard speech
  - Requires recording 500+ phrases to personalize
  - Still in limited availability
  - Works for some conditions better than others
- **Speech Accessibility Project** (Google, Amazon, Apple, Meta, Microsoft + University of Illinois): collecting speech samples from people with diverse speech patterns
  - Goal: train better ASR models that understand dysarthric, accented, post-stroke speech
  - Still largely research-phase
- Standard voice assistants (Siri, Alexa, Google) **fail catastrophically** for people with dysarthria, stuttering, or atypical speech patterns
- Result: the people who need voice control the most (those with limited motor function) are locked out

#### AI Voice Synthesis & Voice Banking
- **Voice banking**: recording your voice while you still can, to synthesize speech later
  - Services: ModelTalker, Acapela My-Own-Voice, SpeechVive, VocaliD
  - Requires recording 800-3,600 phrases (hours of work)
  - Quality varies enormously
  - Many people learn about it too late — after significant speech deterioration
  - **Cost**: $100-$1,500+ for voice banking; some free options exist (ModelTalker)
- **AI voice cloning** (ElevenLabs, Resemble.ai, etc.): could potentially create a voice from just a few minutes of recording
  - Not specifically designed for medical/AAC use
  - Integration with AAC devices is non-existent or experimental
  - Ethical concerns about voice cloning without consent
  - Latency: not suitable for real-time conversation

#### AAC Device Limitations
- Most AAC apps are designed for children — adult options are limited and feel infantilizing
- Communication rate: ~8-15 words per minute via AAC vs. ~150 wpm natural speech
  - This makes conversation painfully slow
  - People lose patience, finish sentences for AAC users, or walk away
- Pre-programmed phrases are rigid — can't express humor, sarcasm, nuance easily
- AAC devices don't integrate with smart home, phone calls, or social media well
- AI-powered word/phrase prediction could massively speed up communication but is underdeveloped

---

## 4. Deaf-Blind Intersection — The Most Underserved Group

### 4.1 Population
- Estimated **50,000+** deaf-blind individuals in the US (Helen Keller National Center)
- Globally: numbers are uncertain, likely millions (especially in developing countries)
- Many are not fully deaf AND fully blind — it's a spectrum

### 4.2 What Exists (Almost Nothing)

| Technology | Cost | Notes |
|-----------|------|-------|
| **Refreshable braille displays** | $700-$15,000 | 20-cell: $700-$1,700; 40-cell: $2,700-$3,800; 80-cell: $9,000-$9,500 |
| **Screen readers + braille display** | See above | JAWS/NVDA output to braille — works but expensive |
| **Orbit Reader 20** | ~$700 | Most affordable option — "low-cost revolution" |
| **Monarch (APH)** | TBD (waitlist) | 10-line, 32-cell tactile display — revolutionary but not yet available |
| **ProTactile communication** | Free | Emerging tactile language system within deaf-blind community |
| **Braille notetakers** | $4,700-$5,900 | BrailleSense, BrailleNote Touch |

### 4.3 The Gaps

- **No AI assistant designed for deaf-blind users** — Siri, Alexa, Google Assistant all require hearing or vision
- Real-time communication relies on **tactile interpreters** (human touch-based interpreting) — extremely scarce
- Braille displays only show text — no equivalent for images, videos, spatial information
- Refreshable braille is incredibly expensive: a basic usable display costs more than a laptop
- The **Transforming Braille Project** aims for 90% cost reduction (from $3,500+ to ~$320) — Orbit Reader is the first fruit
- No mainstream apps are designed with deaf-blind users as primary audience
- Navigation: combines the worst of both worlds — no vision AND no audio cues
- Emergency alerts: virtually no way to receive warnings (no sirens, no flashing lights)

---

## 5. Real-Time Assistance Gaps — Where Current Tech Fails

### 5.1 Scenarios

| Scenario | Who's Affected | Why Tech Fails |
|----------|---------------|---------------|
| **Noisy environments** (restaurants, streets, events) | Deaf/HoH | Captioning accuracy drops to <70%; hearing aids amplify noise too |
| **Multiple speakers** (dinner table, classroom) | Deaf/HoH | No reliable multi-speaker diarization + captioning in real-time |
| **Handwritten text** (notes, prescriptions, whiteboards) | Blind/low vision | OCR fails; AI image description unreliable for handwriting |
| **Live events** (conferences, concerts, sports) | Deaf/HoH, Blind | Captions are delayed or absent; no real-time audio description |
| **Outdoor navigation** (construction, obstacles, street signs) | Blind | GPS is imprecise; real-time obstacle detection is immature |
| **Unlabeled products** (grocery store, pharmacy) | Blind | No standardized machine-readable product identification |
| **Video calls** (group Zoom/Teams) | Deaf/HoH | Auto-captions are poor; speaker ID fails; sign language not captioned |
| **Medical appointments** | All sensory disabilities | Medical jargon breaks captioning; forms are inaccessible; interpreters often unavailable |
| **Driving/transportation** | Deaf, Blind | Honking, emergency vehicle sirens, GPS audio — all assume hearing/vision |

### 5.2 Common Thread

The common failure mode is **real-time, multimodal understanding in uncontrolled environments**. Current AI works well in controlled conditions (quiet room, single speaker, clear text) but breaks down in the messy real world where people actually live.

---

## 6. Cost Barriers

### 6.1 The Price of Disability

| Technology | Cost Range | Who Pays? |
|-----------|-----------|-----------|
| **JAWS screen reader** | $1,000 (annual license) | Often employer/school; free 40-min mode |
| **NVDA** | Free (open source) | Donation-supported |
| **Hearing aids** | $1,000-$8,000/pair | Insurance coverage varies; OTC emerging ($200-$800) |
| **Cochlear implants** | $30,000-$50,000/ear | Usually insurance + years of therapy |
| **Refreshable braille display** | $700-$15,000 | Often school/government funded; personal purchase rare |
| **AAC device (dedicated)** | $3,000-$15,000 | Insurance, Medicaid, school districts — long wait times |
| **AAC app (iPad-based)** | $250-$600 total | Often self-pay |
| **Smart cane (WeWalk)** | $600+ | Self-pay typically |
| **Envision Glasses** | $3,500+ | Self-pay |
| **AI assistants (Be My Eyes)** | Free | Subsidized by partners (Microsoft, etc.) |

### 6.2 Who Can't Afford It

- **Developing countries**: The global average cost of hearing aids equals 1-3 months' salary in low-income countries; braille displays are essentially unattainable
- **Uninsured/underinsured in US**: Hearing aids were historically not covered by most insurance; the 2022 OTC hearing aid ruling helps for mild-moderate loss
- **Children**: Families need funding through early intervention programs, school districts, Medicaid — process takes months, devices are often locked to one per lifetime
- **Aging population**: Age-related hearing loss + vision loss is common; seniors on fixed incomes can't afford premium devices
- **Intersectional disadvantage**: People who are disabled AND from low-income backgrounds, minorities, or in rural areas have the worst access

### 6.3 The Irony

The people who need assistive technology the most are disproportionately unemployed or underemployed (unemployment rate for people with disabilities: **~7.2%** vs **~3.5%** for those without, US 2024), and therefore least able to afford it.

---

## 7. Multimodal AI Opportunity — Vertex AI / Gemini

### 7.1 Why Multimodal Matters for Accessibility

Single-mode AI hits a wall:
- **Text-only AI** can't help a blind person navigate a room
- **Speech-only AI** excludes deaf users
- **Vision-only AI** can't communicate with deaf-blind users

Multimodal AI (vision + language + audio + video) can **bridge between modalities** — translating visual information into text/audio, translating audio into text/visual, and doing it in real-time.

### 7.2 Specific Gemini / Vertex AI Capabilities

| Capability | Accessibility Application |
|-----------|--------------------------|
| **Video understanding** | Real-time scene narration for blind users; live event captioning |
| **Image description** | Product label reading, document understanding, social media accessibility |
| **Speech-to-text (Chirp)** | High-accuracy captioning with speaker diarization |
| **Text-to-speech** | Natural-sounding AAC voice output |
| **Multi-language** | Captioning/translation across 100+ languages (unlike Otter.ai's 3-4) |
| **Long-context window** | Maintaining conversation context over extended interactions |
| **Grounding** | Connecting descriptions to real-world knowledge (what IS that building?) |
| **Live API (streaming)** | Real-time processing for navigation, conversation, live events |
| **On-device (Gemini Nano)** | Privacy-preserving, works offline — critical for always-on assistive use |

### 7.3 Specific Gap-Bridging Opportunities

1. **Real-time video + audio scene description** — Gemini's video understanding + natural language generation could provide continuous narration for blind users (not just snapshots like current solutions)

2. **Multi-speaker captioning with context** — Gemini's audio understanding + speaker diarization + long context could solve the group conversation problem for deaf users

3. **Atypical speech understanding** — Fine-tuned speech models on Vertex AI could handle dysarthric/accented speech better than current ASR

4. **Document accessibility on-the-fly** — Gemini's vision model could make any document (PDF, handwritten, complex layout) instantly readable

5. **Cross-modal translation hub** — Vision → text → braille output for deaf-blind users; Sign language video → text for deaf users; Text → personalized synthetic speech for AAC users

6. **Intelligent AAC prediction** — Using conversation context, environment, and user patterns to predict what someone wants to say next (going from 8 wpm to potentially 30+ wpm)

7. **Multimodal navigation** — Camera feed + GPS + audio + LLM reasoning for real-time obstacle detection and wayfinding

---

## 8. Real User Complaints — From the Communities

### 8.1 r/blind Community (Reddit — 90,000+ members)

**Most common frustrations:**
- "Why do app developers keep **breaking accessibility** with updates?" — VoiceOver/TalkBack compatibility regresses regularly
- "I can't use [food delivery app / banking app / transportation app] because they updated and now the buttons have no labels"
- "CAPTCHAs are the bane of my existence" — years of complaints, still the #1 barrier
- "AI image descriptions are great but they **hallucinate** — I was told a sign said one thing and it said something completely different"
- "Be My Eyes AI is amazing for some things but **useless for real-time navigation** — I need to stop, take a photo, wait, process"
- "Every time I try to fill out a form online I want to scream" — forms are consistently the worst
- "People keep making 'apps for the blind' without ever talking to a blind person"
- Isolation: "the biggest struggle we face is isolation... we don't have the kind of community like a lot of other disabled communities"

### 8.2 r/deaf Community (Reddit — 80,000+ members)

**Most common frustrations:**
- "Group conversations are impossible" — dinner tables, work meetings, family gatherings
- "Auto-captions are great until someone has an accent or speaks fast"
- "I'm tired of AI sign language gloves/gadgets that deaf people don't want and never asked for" — reference to "disability dongles"
- "Hearing people think sign language is universal — it's not, there are 300+ sign languages"
- "Movie theater captioning devices are always broken or out of batteries"
- "Phone calls are still a nightmare — relay services are clunky, voice calls assume you can hear"
- "Emergency alerts are all audio — fire alarms, tornado sirens, I could literally die because alert systems weren't designed for me"
- "Stop making AI sign language avatars — they look like zombies and none of us can understand them"

### 8.3 AAC / Speech Disability Communities

**Most common frustrations:**
- "My AAC device cost $8,000 and it's slower than typing on my phone"
- "People don't wait for me to finish — they fill in my words or walk away"
- "Insurance said they'd only cover one device in my lifetime — what if it breaks?"
- "Siri/Alexa can't understand me at all and I'm the one who needs hands-free control the most"
- "I had to record 3,000 phrases to bank my voice and by the time I finished, my speech had deteriorated too much"
- "AAC apps are designed for children — I'm a 45-year-old adult, I don't want cartoon symbols"
- "AI can clone anyone's voice from 10 seconds of audio but I can't get a natural-sounding voice for my AAC device"

---

## 9. Hackathon Recommendation: Highest-Impact, Most Buildable Problem

### 9.1 Evaluation Criteria

| Criteria | Weight |
|---------|--------|
| Severity of pain point | 30% |
| Number of people affected | 20% |
| Technical feasibility with Vertex AI / Gemini | 25% |
| Buildable in hackathon timeframe | 15% |
| Novelty / differentiation from existing solutions | 10% |

### 9.2 Top Candidates

#### 🥇 Option A: **Real-Time Multimodal Scene Assistant for Blind Users**
- **Problem**: Current AI image description tools work on snapshots but can't handle continuous, real-time video understanding. Blind users need to stop, take a photo, wait, read — instead of getting fluid, continuous guidance.
- **Solution**: Gemini Live API streaming video from phone camera → continuous audio narration. "You're approaching a crosswalk, the light is red, there's a cyclist approaching from the left. The light has changed to green. There's a curb cut 2 feet ahead."
- **Why Gemini**: Native video understanding + streaming API + long context window = continuous awareness
- **Buildable?**: Yes — Gemini Live API + camera feed + TTS. Core demo in 24-48 hours.
- **Impact**: 285 million people with visual impairment worldwide
- **Differentiation**: No existing solution does real-time continuous video narration with contextual memory

#### 🥈 Option B: **Intelligent Context-Aware AAC Communication Accelerator**
- **Problem**: AAC users communicate at 8-15 wpm vs. 150 wpm natural speech. Conversations are painfully slow.
- **Solution**: Gemini-powered predictive system that uses conversation context, environmental cues (camera/location), user history, and social context to predict full sentences/phrases. "You're at a restaurant with 3 friends. Based on the conversation about movies, here are likely things you might want to say..."
- **Why Gemini**: Multimodal context (conversation + vision + location) + long context + natural language generation
- **Buildable?**: Moderate — needs good UX, but core prediction engine is achievable
- **Impact**: 7.5 million with speech impairments in US alone; plus anyone temporarily unable to speak
- **Differentiation**: Current AAC prediction is word-level; this would be sentence/intent-level using multimodal context

#### 🥉 Option C: **Multi-Speaker Real-Time Captioner with Visual Speaker Identification**
- **Problem**: Group conversations are the #1 frustration for deaf/HoH people. Current captioning can't handle multiple speakers, can't tell who's talking, and breaks down with accents/noise.
- **Solution**: Camera + microphone input → Gemini identifies speakers visually AND by voice → produces attributed, accurate captions → displayed as AR overlay or on-device text. "Maria: 'Let's go to that Italian place.' John: 'Which one, the one on 5th street?'"
- **Why Gemini**: Multimodal (audio + video) + speaker understanding + real-time streaming
- **Buildable?**: Moderate — speaker diarization + visual ID is hard, but a prototype is feasible
- **Impact**: 466 million people with hearing loss worldwide
- **Differentiation**: No existing consumer tool combines visual speaker ID with audio speaker diarization

### 9.3 🏆 RECOMMENDED: Option A — Real-Time Multimodal Scene Assistant

**Why this wins:**
1. **Largest pain gap**: The jump from "snapshot descriptions" to "continuous real-time awareness" is enormous and unsolved
2. **Perfect for Gemini**: This is EXACTLY what multimodal video understanding + streaming API is designed for
3. **Most buildable**: Camera feed → Gemini Live API → TTS audio output. Clean architecture, minimal moving parts
4. **Demo-able**: Visually compelling demo for judges — walk around, get continuous narration
5. **Extendable**: Add navigation, product reading, social cue description, document reading as features
6. **Clear Google tie-in**: Leverages Vertex AI, Gemini API, potentially Android integration, Google Maps
7. **Meaningful**: This could genuinely change daily life for millions of people

**MVP Feature Set:**
- Live camera streaming to Gemini with continuous scene narration
- Contextual memory ("remember, we passed a pharmacy on the left 30 seconds ago")
- Priority-based alerting (obstacles, traffic, signs get priority over background details)
- Natural conversation interface ("what color is the building on my right?")
- Text/sign reading when detected in camera view
- Runs on standard Android phone — no special hardware

**Key Technical Risks:**
- Latency: needs <2s response time for navigation safety
- Cost: Gemini API streaming costs could be high for continuous use
- Battery: continuous camera + API calls will drain battery fast
- Accuracy: hallucinations in a navigation context could be dangerous

---

## Key Takeaways

1. **Web inaccessibility** is still the #1 barrier for blind users — 94.8% of top websites fail WCAG
2. **Group conversations** are the #1 unsolved problem for deaf/HoH people
3. **AAC communication speed** (8-15 wpm) makes conversation nearly impossible for speech-impaired users
4. **Deaf-blind people** have almost no AI tools designed for them
5. **Cost** is a massive barrier — the most needed AT is the most expensive
6. **Multimodal AI** (specifically Gemini) is uniquely positioned to bridge sensory modalities
7. **Real-time, continuous assistance** (not snapshot-based) is the frontier
8. **Community input is critical** — the #1 complaint across all communities is "they build for us without talking to us"
