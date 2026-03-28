# GDPR & Data Privacy for AI Emergency Call Relay

> **Research Report** — Hackathon Accessibility Project  
> **Last updated:** 2026-03-28  
> **Scope:** GDPR, ePrivacy, EU AI Act, Serbian LPDP, and practical privacy architecture for an AI-powered emergency call relay system for people with speech/hearing disabilities.

---

## Table of Contents

1. [GDPR & Emergency Calls](#1-gdpr--emergency-calls)
2. [AI-Specific Privacy Issues](#2-ai-specific-privacy-issues)
3. [Medical Data in Emergencies](#3-medical-data-in-emergencies)
4. [International Data Transfer](#4-international-data-transfer)
5. [Privacy Architecture Recommendations](#5-privacy-architecture-recommendations)

---

## 1. GDPR & Emergency Calls

### 1.1 Vital Interests Exemption — Article 6(1)(d)

**The core legal basis for processing personal data during an emergency call is Article 6(1)(d) GDPR:**

> *"Processing is necessary in order to protect the vital interests of the data subject or of another natural person."*

**How it applies to our system:**

- **Recital 46** clarifies: *"The processing of personal data should also be regarded as lawful where it is necessary to protect an interest which is essential for the life of the data subject or that of another natural person."* [GDPR Recital 46]
- This explicitly covers **life-threatening emergencies** — exactly the scenario our relay system handles.
- Recital 46 further states: *"Some types of processing may serve both important grounds of public interest and the vital interests of the data subject, as for instance when processing is necessary for humanitarian purposes, including for monitoring epidemics and their spread or in situations of natural disasters."*
- **Important limitation:** Vital interests is a **subsidiary** legal basis — it should only be relied upon when *"the processing cannot be manifestly based on another legal basis"* [Recital 46]. During an active emergency, no other basis is practical.

**Practical implications for our system:**

| Scenario | Legal Basis | Notes |
|----------|-------------|-------|
| Active emergency call relay | Art. 6(1)(d) — vital interests | No prior consent needed |
| App registration & setup | Art. 6(1)(a) — consent or Art. 6(1)(b) — contract | Standard consent flows |
| Post-emergency record retention | Art. 6(1)(f) — legitimate interests or Art. 6(1)(c) — legal obligation | Depends on national law |

**Key takeaway:** During an active emergency, we can process personal data (name, address, medical info) **without prior consent** under the vital interests basis. This is well-established in GDPR case law and guidance.

### 1.2 Processing Without Consent During Emergency

**Yes — an AI emergency relay system can process personal data without explicit consent during an emergency call.** The legal framework supports this through multiple provisions:

1. **Article 6(1)(d) — Vital interests** of the data subject or another person. [GDPR Art. 6(1)(d)]
2. **Article 6(1)(e) — Public interest** — emergency services operate as a task carried out in the public interest. [GDPR Art. 6(1)(e)]
3. **Article 6(1)(f) — Legitimate interests** — the legitimate interest of preserving life outweighs privacy concerns in emergency contexts.

**The ICO (UK) confirms:**
> *"It is likely to be particularly relevant when you need to use a person's personal data for emergency medical care, but they are unconscious or otherwise incapable of giving consent."* [ICO Guidance on Vital Interests, 2024]

**For our relay app specifically:** A person with a speech disability calling 112 cannot easily provide granular consent in the moment. The vital interests basis is designed precisely for this — when obtaining consent is impractical and lives are at stake.

### 1.3 Article 9 — Special Categories (Health Data)

Health data (medical conditions, allergies, medications) is a **special category** under GDPR Article 9(1), which generally **prohibits** its processing. However, several exceptions apply to our system:

#### Article 9(2)(c) — Vital Interests (Incapable of Consent)

> *"Processing is necessary to protect the vital interests of the data subject or of another natural person where the data subject is physically or legally incapable of giving consent."*

**This is the primary basis for sharing health data during an emergency relay.** Key considerations:

- The data subject must be **physically or legally incapable** of giving consent. A person in an emergency who cannot speak clearly meets this threshold.
- If the person **can** give consent and **refuses**, you **cannot** fall back on vital interests — unless they are not legally competent to make that decision. [ICO Guidance on Art. 9(2)(c)]
- **ICO example directly on point:** *"A member of staff has experienced an accident at work, sustained serious injuries and is unconscious. Their employer has called for an ambulance. However, they also know that their employee is allergic to certain medications. The employer cannot obtain their employee's consent to provide details of their allergies to the ambulance crew, and so rely on the vital interests condition."* [ICO, 2023]

#### Article 9(2)(g) — Substantial Public Interest

> *"Processing is necessary for reasons of substantial public interest, on the basis of Union or Member State law..."*

Emergency services processing clearly qualifies, but requires a **national legal basis**. Most EU Member States have enacted specific laws authorizing emergency service data processing.

#### Article 9(2)(h) — Health or Social Care

> *"Processing is necessary for the purposes of... medical diagnosis, the provision of health or social care or treatment..."*

Applicable when the relay communicates with medical dispatch. Requires processing under the responsibility of a professional subject to professional secrecy obligations. [GDPR Art. 9(3)]

**Practical approach for our system:**
- **During emergency:** Rely on Art. 9(2)(c) (vital interests + incapable of consent) as primary basis
- **Pre-stored medical profiles:** Obtain **explicit consent** (Art. 9(2)(a)) at app setup
- **Belt-and-suspenders:** Also document Art. 9(2)(g) (substantial public interest) applicability

### 1.4 Recording Emergency Relay Calls

**Is recording legal?** Yes, but with conditions:

#### Legal Basis for Recording

1. **Art. 6(1)(d) — Vital interests:** Recording the relay call creates an accurate record that can save lives (e.g., if key information is missed during real-time relay).
2. **Art. 6(1)(c) — Legal obligation:** Many EU Member States require emergency calls to be recorded by law. For example:
   - **Germany:** Notruf recordings are regulated under state emergency services laws
   - **UK:** Emergency call recordings are mandated under communications regulations
   - **France:** Recordings of emergency calls are governed by the Code de la santé publique for SAMU
3. **Art. 6(1)(f) — Legitimate interests:** Quality assurance and legal protection for the service provider

#### Retention Rules

GDPR **does not specify** a fixed retention period. Instead, **Article 5(1)(e) — Storage Limitation** requires:

> *"Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed."*

**Practical guidance on retention:**

| Data Type | Recommended Retention | Rationale |
|-----------|----------------------|-----------|
| Real-time relay transcript | Delete within 24–72 hours | Only needed for immediate emergency resolution |
| Emergency call recording | 30–90 days | Aligns with typical emergency service retention; enables quality review |
| Anonymized/aggregated data | Indefinite | For service improvement; no personal data |
| Incident log (metadata only) | 1–3 years | Legal defense, regulatory compliance |
| Medical data shared during call | Delete after call + brief review period | Not needed long-term by relay service |

**Key principle:** The relay service is an **intermediary**, not an emergency service itself. It should retain data for the **shortest period necessary** and defer to emergency services for official record-keeping.

### 1.5 ePrivacy Directive & Emergency Call Data

The **ePrivacy Directive (2002/58/EC)** governs confidentiality of electronic communications and interacts with GDPR in important ways:

#### Article 15(1) — Restrictions for Public Security

Member States may adopt measures restricting the scope of privacy rights when necessary for:
- National security
- Defence
- **Public security**
- Prevention, investigation, detection, and prosecution of criminal offences

Emergency call processing falls squarely under **public security**.

#### Article 10 — Calling Line Identification (CLI)

The ePrivacy Directive allows override of number-withholding for emergency calls:
> Member States shall ensure that there are transparent procedures governing the way in which a provider of a public communications network and/or a publicly available electronic communications service may override the elimination of the presentation of CLI... *"on a per-line basis for organizations dealing with emergency calls... including law enforcement agencies, ambulance services and fire brigades, for the purpose of answering such calls."*

**This means:** Even if a user has withheld their number, the emergency service can receive it. Our relay system may facilitate this.

#### European Electronic Communications Code (EECC) — Directive 2018/1972, Article 109

This modernized framework specifically addresses emergency communications:

> *"Member States shall ensure that undertakings... make caller location information available... to the most appropriate PSAP... for all calls to the single European emergency number '112'."* [EECC Art. 109(6)]

**Key provisions:**
- Caller location must be provided to PSAPs (Public Safety Answering Points) **free of charge**
- Applies to both network-based and handset-derived location
- Must work regardless of whether the caller has consented to location sharing in normal use
- **Article 109(2):** Requires Member States to ensure access to emergency services for end-users with disabilities *"equivalent to that enjoyed by other end-users"* — directly relevant to our accessibility relay

### 1.6 Caller Location Data — Mandatory vs. GDPR

**Is there a tension between mandatory 112 location sharing and GDPR?**

**Short answer: No meaningful tension.** The legal framework resolves this clearly:

1. **EECC Article 109** creates a **legal obligation** (GDPR Art. 6(1)(c)) to provide caller location to PSAPs during emergency calls.
2. **GDPR Recital 46** explicitly mentions that vital interests processing can serve *"both important grounds of public interest and the vital interests of the data subject."*
3. **ePrivacy Directive Article 15** permits restrictions on data privacy for public security purposes.
4. **National emergency services laws** in each Member State provide additional legal bases.

**For our relay app:**
- Location data collected during an emergency call is **lawful** under multiple overlapping legal bases
- The app should request location permission at setup (Android/iOS) — but during an emergency, the legal obligation supersedes standard consent mechanics
- **Data minimization still applies:** Location data should only be shared with the PSAP/dispatcher, not retained by the relay service beyond the call duration

---

## 2. AI-Specific Privacy Issues

### 2.1 EU AI Act Classification — High-Risk

**Our AI emergency relay system is almost certainly classified as HIGH-RISK under the EU AI Act (Regulation 2024/1689).**

#### Annex III, Section 5(d) — Explicitly Covers Emergency Call AI

> *"AI systems intended to evaluate and classify emergency calls by natural persons or to be used to dispatch, or to establish priority in the dispatching of, emergency first response services, including by police, firefighters and medical aid, as well as of emergency healthcare patient triage systems."*  
> — [EU AI Act, Annex III, Point 5(d); Regulation 2024/1689, OJ L 12.7.2024]

**Recital 58 confirms the rationale:**
> *"AI systems used to evaluate and classify emergency calls by natural persons or to dispatch or establish priority in the dispatching of emergency first response services... should also be classified as high-risk since they make decisions in very critical situations for the life and health of persons and their property."*

#### What Does High-Risk Require?

Under Articles 9–15 of the AI Act, high-risk systems must comply with:

| Requirement | Article | What It Means for Us |
|-------------|---------|---------------------|
| **Risk Management System** | Art. 9 | Continuous risk identification, assessment, mitigation throughout lifecycle |
| **Data Governance** | Art. 10 | Training data must be relevant, representative, error-free, complete |
| **Technical Documentation** | Art. 11 | Detailed docs on system design, intended purpose, training data, testing |
| **Record-Keeping / Logging** | Art. 12 | Automatic logging of system events, tamper-resistant, retained appropriately |
| **Transparency** | Art. 13 | Users informed of system purpose, limitations, performance characteristics |
| **Human Oversight** | Art. 14 | System designed for effective human oversight; humans can intervene/override |
| **Accuracy, Robustness, Cybersecurity** | Art. 15 | Maintain appropriate levels throughout lifecycle |

#### Compliance Timeline

- **August 2, 2026:** All high-risk AI systems must comply with Articles 9–49
- **For hackathon:** Document awareness of these requirements and build architecture that enables future compliance

#### Nuance: Is Our System "Evaluating/Classifying" or "Relaying"?

Our system is primarily a **communication relay** (converting text/sign to speech and vice versa), not a triage or dispatch priority system. However:

- If the AI **summarizes** or **structures** the emergency information before passing it to dispatch → likely falls under Annex III 5(d)
- If the AI simply **translates** without any classification → could argue it's a communication tool, not high-risk
- **Conservative approach:** Treat it as high-risk. The cost of non-compliance far exceeds the cost of compliance, and the hackathon pitch is stronger with this classification addressed.

### 2.2 LLM Processing & Data Residency

**Sending emergency call transcripts to external LLM APIs (OpenAI, Anthropic, Google) raises significant GDPR concerns:**

#### The Problem

When you send a transcript like *"My name is Ana Petrović, I'm at Bulevar Mihajla Pupina 6, Belgrade, I'm having a heart attack, I'm allergic to aspirin"* to an API:

1. **Personal data leaves your infrastructure** — name, address, health data
2. **Data may be processed outside the EU/EEA** — US servers for OpenAI/Anthropic
3. **The LLM provider becomes a data processor** — requiring a Data Processing Agreement (DPA)
4. **Data may be used for model training** — unless explicitly opted out
5. **Latency** — API calls add latency to life-critical communications

#### GDPR Data Residency Requirements

GDPR does not strictly require **EU-only** processing, but:

- **Chapter V (Articles 44–49)** governs international transfers
- Transfer to the US requires: EU-US Data Privacy Framework certification, Standard Contractual Clauses (SCCs), or Binding Corporate Rules (BCRs)
- For **special category data** (health info), additional safeguards are expected
- **EDPB guidance** recommends supplementary measures (encryption, pseudonymization) for US transfers post-Schrems II

#### Provider-Specific Considerations

| Provider | EU Data Processing Option | DPA Available | Training Data Opt-Out | HIPAA BAA |
|----------|--------------------------|---------------|----------------------|-----------|
| **OpenAI** | Azure OpenAI (EU regions) | Yes | Yes (API by default) | Yes (Azure) |
| **Anthropic** | AWS eu-west (via API) | Yes | Yes (API by default) | No |
| **Google** | Vertex AI (EU regions) | Yes | Yes | Yes |

#### Recommendation

**For a production emergency relay system:**
- Use **EU-hosted** LLM endpoints (Azure OpenAI in West Europe, or Google Vertex AI in europe-west)
- Execute a **Data Processing Agreement** with the provider
- Enable **zero data retention** on the API side
- Consider **on-premise/edge** models for the most sensitive processing (see 2.3)

### 2.3 On-Premise vs. Cloud Architecture

| Architecture | Privacy Level | Latency | Cost | Capability |
|-------------|--------------|---------|------|------------|
| **Fully on-device** | ★★★★★ | Lowest | Lowest | Limited by device capability |
| **Edge server (EU)** | ★★★★☆ | Low | Medium | Good; can run mid-size models |
| **EU cloud (managed)** | ★★★☆☆ | Medium | Medium-High | Full capability |
| **US cloud** | ★★☆☆☆ | Higher | Medium | Full capability, transfer issues |

**Recommended hybrid architecture:**

1. **On-device:** Speech-to-text (Whisper), basic NLP, medical profile storage
2. **EU edge/cloud:** LLM processing for complex relay scenarios, via EU-hosted API
3. **Never send to US:** Emergency call content should never leave EU jurisdiction during active call

### 2.4 Data Minimization — What to Collect vs. What NOT to

GDPR Article 5(1)(c) — **Data Minimization:**
> *"Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."*

#### COLLECT (necessary for relay):

- ✅ Caller's location (lat/long for dispatch)
- ✅ Nature of emergency (fire, medical, police)
- ✅ Caller's name (for dispatcher identification)
- ✅ Relevant medical info (allergies, conditions — if pre-consented)
- ✅ Communication preferences (text, sign language, AAC device type)
- ✅ Emergency contact details
- ✅ Call transcript (for relay accuracy, deleted after call)

#### DO NOT COLLECT (not necessary):

- ❌ Full medical history (only emergency-relevant conditions)
- ❌ Insurance information
- ❌ Social security / national ID numbers
- ❌ Biometric templates (voice prints, facial recognition)
- ❌ Device IMEI / hardware identifiers (beyond session)
- ❌ Browsing history / app usage analytics during emergency
- ❌ Contacts list / social graph
- ❌ Financial information

### 2.5 Right to Erasure — Emergency Call Records

**Can a user request deletion of emergency call records under GDPR Article 17?**

**Partially — but with important exceptions.**

#### Article 17(3) — Exceptions to Right to Erasure

The right to erasure does **not** apply where processing is necessary for:

- **(b)** Compliance with a **legal obligation** — if national law requires emergency call retention
- **(d)** **Public interest in public health** — emergency service quality assurance
- **(e)** **Archiving in the public interest, scientific or historical research, or statistical purposes** — where erasure would seriously impair objectives

#### Practical Approach:

| Data Component | Erasure Request? | Response |
|----------------|-----------------|----------|
| User's medical profile (pre-stored) | ✅ Must delete | User has full control over pre-stored data |
| Emergency call transcript (relay) | ⚠️ Depends | If still within retention period and no legal obligation, delete. If required by law, refuse with explanation. |
| Metadata / logs | ⚠️ Depends | Can anonymize rather than delete; retain for legal compliance |
| Data held by emergency services | ❌ Not our responsibility | Emergency services are separate controllers |

**Key principle:** The relay service should have a **clear data retention policy** and **automated deletion** so erasure requests are mostly moot — data is already gone.

### 2.6 Biometric Data & Voice Recognition

**If the app uses voice recognition to identify the caller, this triggers Article 9 (special categories).**

#### GDPR Definition — Article 4(14):

> *"'Biometric data' means personal data resulting from specific technical processing relating to the physical, physiological or behavioural characteristics of a natural person, which allow or confirm the unique identification of that natural person, such as facial images or dactyloscopic data."*

#### Key Analysis:

- **Voice recognition for identification** (voiceprint matching) = biometric data = special category under Art. 9
- **Speech-to-text** (transcription without identification) = **NOT** biometric data — it's just processing audio content
- **Speaker diarization** (distinguishing speakers in a conversation without identifying them) = gray area, likely not biometric if no identification

#### Recommendation for Our System:

- **Do NOT implement voice-based biometric identification** — it adds massive compliance burden with minimal benefit
- **DO use speech-to-text** — this is standard data processing, not biometric
- If caller identification is needed, use **app-level authentication** (login, PIN, device binding) instead of voice biometrics
- If voice analysis is used for **emotion/distress detection** (to prioritize calls), this triggers **AI Act Annex III, Point 1(c)** (emotion recognition) → additional high-risk classification

---

## 3. Medical Data in Emergencies

### 3.1 Pre-Stored Medical Profile — Consent Model

If the app stores a user's medical profile (allergies, conditions, medications, blood type), the required consent model is:

#### At App Setup — Explicit Consent (Article 9(2)(a))

**Requirements for valid explicit consent for health data:**

1. **Freely given** — user can use the app without providing medical info
2. **Specific** — separate consent for each purpose (storage, sharing during emergency, sharing with specific parties)
3. **Informed** — clear explanation of:
   - What data is collected
   - How it will be stored (on-device vs. cloud)
   - When it will be shared (only during emergency calls)
   - Who will receive it (dispatcher, paramedics)
   - How long it's retained
   - Right to withdraw consent at any time
4. **Unambiguous** — clear affirmative action (toggle, checkbox, not pre-ticked)
5. **Documented** — record of consent with timestamp

#### Recommended Consent Flow:

```
┌─────────────────────────────────────────────────────┐
│                MEDICAL PROFILE SETUP                 │
│                                                      │
│  Your medical information can help emergency          │
│  responders provide better care during an emergency.  │
│                                                      │
│  This data is stored ONLY on your device.            │
│  It is shared ONLY when you make an emergency call.  │
│                                                      │
│  You can update or delete this at any time.          │
│                                                      │
│  ☐ I consent to storing my medical information       │
│    on this device for emergency use                  │
│                                                      │
│  ☐ I consent to automatically sharing my medical     │
│    information with emergency dispatch when I make   │
│    an emergency call through this app                │
│                                                      │
│  [Skip]                    [Save & Continue]          │
└─────────────────────────────────────────────────────┘
```

**Important:** These must be **separate, granular consents** — not a single "accept all" button.

### 3.2 Auto-Sharing Medical Data with Dispatch — Vital Interests

**Can pre-stored medical data be auto-shared with dispatch during an emergency?**

**Yes — this is a textbook case for Article 6(1)(d) + Article 9(2)(c):**

1. **The user consented at setup** to share during emergencies (Art. 9(2)(a) — explicit consent)
2. **During the emergency**, the data subject may be incapable of giving real-time consent (Art. 9(2)(c) — vital interests)
3. **The processing serves vital interests** — allergies, medications, and conditions are directly relevant to emergency medical care

**Dual legal basis approach:**
- **Primary:** Explicit consent obtained at setup (Art. 9(2)(a))
- **Fallback:** Vital interests where data subject is incapable of consent (Art. 9(2)(c))
- **Additional:** Substantial public interest (Art. 9(2)(g)) if supported by national law

**This is exactly how Apple Medical ID works** — opt-in at setup, auto-share during emergency.

### 3.3 Existing Medical ID App Approaches

#### Apple Medical ID / Enhanced Emergency Data (EED)

Apple's approach is the gold standard for consent-based emergency medical data sharing:

- **Opt-in model:** "Share During Emergency Call" is **disabled by default** and must be explicitly enabled by the user [Apple Support, 2024]
- **User controls what to share:** Users fill in only the fields they choose (conditions, allergies, medications, blood type, emergency contacts)
- **Show When Locked:** Separate toggle to allow access from lock screen
- **End-to-end encryption:** Medical ID data is encrypted such that **Apple cannot read it** [Apple Privacy Policy]
- **Geofiltering:** Data only shared with PSAPs in the user's location area — prevents leakage to unauthorized parties
- **PSAP opt-in required:** Local PSAPs must opt-in to receive Medical ID data
- **No downstream integration:** Apple prohibits automatic integration of Medical ID data with other systems — individual fields may only be manually copied when relevant to a response
- **Data retention:** Apple servers discard data after delivery; local retention governed by PSAP's policies [Apple EED Documentation, Oct 2020]

#### Google Emergency Information (Android)

- **On-device storage:** Emergency information stored only on the device, not in Google cloud [Google, per AARP reporting]
- **Lock screen access:** First responders can view emergency contacts and medical info from lock screen
- **User-managed:** User inputs blood type, allergies, medications, organ donor status
- **No automatic sharing with dispatch:** Unlike Apple EED, Google does not auto-transmit to PSAPs (as of current implementation)

#### Key Lessons for Our System:

1. **Opt-in, not opt-out** — disabled by default
2. **Granular control** — user chooses what to share
3. **On-device storage** — minimize cloud exposure
4. **Encryption at rest and in transit** — even the service provider shouldn't read it
5. **Geofiltering** — only share with relevant PSAPs
6. **No persistent server-side storage** — ephemeral transmission only

---

## 4. International Data Transfer

### 4.1 EU-US Data Transfer Mechanisms

If the AI backend runs on US servers, the following transfer mechanisms are available:

#### EU-US Data Privacy Framework (DPF) — Adequacy Decision

- **Adopted:** July 10, 2023 (European Commission Implementing Decision C(2023) 4745)
- **What it does:** Provides an adequacy finding for US companies that self-certify under the DPF
- **Requirements:** The US company must be DPF-certified (listed on dataprivacyframework.gov)
- **Covers:** OpenAI is not DPF certified as of 2026. Google and Microsoft (Azure) **are** DPF-certified.
- **Risk:** The DPF may face legal challenges (as Schrems I struck down Safe Harbor, and Schrems II struck down Privacy Shield)

#### Standard Contractual Clauses (SCCs)

- **Most common mechanism** for EU-US data transfers
- **New SCCs** adopted June 4, 2021 (Commission Implementing Decision 2021/914)
- **Requires:** Data Transfer Impact Assessment (DTIA) and supplementary measures where needed
- **Available from:** All major cloud providers (AWS, GCP, Azure) include SCCs in their DPAs

#### Supplementary Measures (Post-Schrems II)

The EDPB recommends supplementary measures when transferring to countries without adequate protection:
- **Technical:** Encryption in transit and at rest with EU-held keys
- **Contractual:** Enhanced DPA terms, notification obligations
- **Organizational:** Access controls, data minimization, pseudonymization

### 4.2 EU-Only Data Processing Requirement

**There is no blanket GDPR requirement for EU-only processing.** However:

- **Practical recommendation:** For emergency services data, **EU-only processing is strongly advised** because:
  1. Health data (Art. 9) requires highest protection standards
  2. Emergency call data involves life-critical real-time processing
  3. Transfer impact assessments add compliance complexity
  4. Latency requirements favor proximity
  5. Regulatory expectations for emergency services lean toward data sovereignty

- **Member State laws may impose stricter requirements:** Some countries require emergency services data to remain in-country
- **EU cloud regions** exist for all major providers: AWS (eu-west-1, eu-central-1), GCP (europe-west1), Azure (West Europe, North Europe)

### 4.3 Serbia — LPDP (Zakon o zaštiti podataka o ličnosti)

Serbia adopted a new **Personal Data Protection Law (LPDP)** on November 9, 2018 (Official Gazette RS 87/2018), effective August 21, 2019. It is **substantially harmonized with GDPR**, with some notable differences:

#### Key Similarities with GDPR:
- Same 6 legal bases for processing (consent, contract, legal obligation, vital interests, public interest, legitimate interests) [LPDP, mirroring GDPR Art. 6]
- Special categories of data (including health data) with equivalent protections [mirroring GDPR Art. 9]
- Data subject rights (access, rectification, erasure, portability) [mirroring GDPR Arts. 15-22]
- Privacy by design and data protection impact assessments [mirroring GDPR Arts. 25, 35]
- 72-hour breach notification requirement [mirroring GDPR Art. 33]
- DPO appointment requirements [mirroring GDPR Art. 37]

#### Key Differences from GDPR:

| Aspect | GDPR | Serbia LPDP |
|--------|------|-------------|
| **Maximum fines** | €20M or 4% global turnover | **~€17,000** (drastically lower) |
| **Enforcement** | DPA can directly impose fines | DPA issues warnings; fines imposed by Court of Offences |
| **No recitals** | 173 recitals providing interpretation guidance | **No recitals** — harder to interpret; GDPR recitals used informally |
| **SCCs for transfers** | Controller-to-controller and controller-to-processor | **Only controller-to-processor** SCCs available from Serbian DPA |
| **Other laws alignment** | N/A | Many Serbian laws still **not harmonized** with LPDP (should have been by end of 2020) |
| **Extraterritorial scope** | Yes | Yes — applies to foreign processors targeting Serbian residents |
| **Law enforcement mixing** | Separate (LED 2016/680) | LPDP includes LED-equivalent provisions **in the same law** (criticized) |

#### Data Transfer from Serbia:

Legitimate transfer mechanisms include:
1. Transfer to **Council of Europe Convention 108** signatories (covers most of Europe)
2. Transfer to countries on **Serbian government's adequacy list** (includes EU countries, Canada, Japan)
3. **Standard Contractual Clauses** (adopted by Serbian DPA, January 30, 2020 — but only controller-to-processor)
4. **Binding Corporate Rules** approved by Serbian DPA
5. **Explicit consent** of the data subject
6. **DPA-specific approval** (within 60 days)

#### Implications for Our System in Serbia:

- **Vital interests** basis exists in LPDP (same as GDPR Art. 6(1)(d))
- **Health data protections** mirror GDPR Art. 9
- **Lower fines** mean less enforcement risk, but **same substantive obligations**
- **EU adequacy decision for Serbia does not exist** — Serbia is not in the EU/EEA
- **Transfer to EU** is straightforward (EU is on Serbia's adequacy list); **transfer from EU to Serbia** requires SCCs or other mechanisms from the EU side
- For hackathon: Build to **GDPR standard** (covers both EU and Serbian requirements since LPDP is GDPR-aligned)

---

## 5. Privacy Architecture Recommendations

### 5.1 Privacy-by-Design Architecture

Based on the legal analysis above, here is the recommended privacy architecture for the hackathon build:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S DEVICE                               │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │  Medical Profile │  │  Speech-to-Text  │  │  Location Service │  │
│  │  (encrypted,     │  │  (on-device      │  │  (OS-level,       │  │
│  │   local storage) │  │   Whisper model) │  │   shared only     │  │
│  │                  │  │                  │  │   during 112)     │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬──────────┘  │
│           │                     │                      │             │
│  ┌────────▼─────────────────────▼──────────────────────▼──────────┐  │
│  │              EMERGENCY RELAY MODULE (on-device)                │  │
│  │  - Combines user input + medical profile + location           │  │
│  │  - Generates structured emergency message                     │  │
│  │  - Encrypts for transmission                                  │  │
│  └────────────────────────────────┬──────────────────────────────┘  │
│                                   │                                  │
└───────────────────────────────────┼──────────────────────────────────┘
                                    │ TLS 1.3
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    EU-HOSTED RELAY SERVER                              │
│                    (europe-west1 / eu-central-1)                      │
│                                                                       │
│  ┌─────────────────┐  ┌────────────────────┐  ┌───────────────────┐  │
│  │  LLM Processing │  │  Session Manager   │  │  PSAP Connector   │  │
│  │  (EU-hosted API │  │  (ephemeral state, │  │  (forwards to     │  │
│  │   or local      │  │   auto-delete      │  │   112 dispatch)   │  │
│  │   model)        │  │   after call)      │  │                   │  │
│  └─────────────────┘  └────────────────────┘  └───────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  AUDIT LOG (metadata only, no PII, 90-day retention)         │    │
│  └───────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    112 / PSAP (Emergency Services)                     │
│                    (Separate data controller)                          │
└───────────────────────────────────────────────────────────────────────┘
```

### 5.2 Consent Flows — Setup vs. Emergency

#### At App Setup (One-Time):

```
STEP 1: Account Creation
  → Consent: Terms of service, privacy policy (Art. 6(1)(b) — contract)
  → Inform: What the app does, how data is processed

STEP 2: Accessibility Preferences  
  → Collect: Communication mode (text, sign language, AAC)
  → Legal basis: Art. 6(1)(b) — necessary for service

STEP 3: Medical Profile (OPTIONAL)
  → Explicit consent: Art. 9(2)(a) — separate toggles for:
    ☐ Store medical info on my device
    ☐ Share medical info with dispatch during emergency calls
  → Inform: Data stays on device; shared only during emergencies
  → Can skip entirely; can withdraw consent anytime

STEP 4: Location Permission
  → OS-level permission prompt
  → Inform: Used only during emergency calls for dispatch
  → Legal basis during emergency: Art. 6(1)(c) + EECC Art. 109

STEP 5: Emergency Contact (OPTIONAL)
  → Consent to store and notify during emergency
```

#### During Emergency Call (Zero Consent Required):

```
USER TRIGGERS EMERGENCY CALL
  │
  ├── Location: Auto-shared → Legal basis: Art. 6(1)(c)+(d), EECC Art. 109
  ├── Name/identity: Auto-shared → Legal basis: Art. 6(1)(d) vital interests
  ├── Medical profile: Auto-shared IF pre-consented → Art. 9(2)(a)+(c)
  ├── Communication: Relayed via AI → Art. 6(1)(d) vital interests
  │
  └── NO consent dialogs during emergency — every second counts
```

### 5.3 Data Storage — On-Device vs. Cloud

| Data Type | Storage Location | Encryption | Retention |
|-----------|-----------------|------------|-----------|
| Medical profile | **On-device only** | AES-256, device keychain | Until user deletes |
| Accessibility preferences | **On-device** (sync to cloud optional) | Encrypted | Persistent |
| Emergency contacts | **On-device only** | AES-256, device keychain | Until user deletes |
| Active call transcript | **RAM only** (device + server) | TLS in-transit, ephemeral | Deleted when call ends |
| LLM processing context | **EU server RAM** | Not persisted to disk | Deleted after API response |
| Call metadata (anonymized) | **EU cloud** | Encrypted at rest | 90 days |
| Audit logs | **EU cloud** | Encrypted, append-only | 1 year |
| AI model weights | **On-device** + **EU cloud** | Encrypted at rest | Persistent |

### 5.4 Resolving "AI Needs Context" vs. "Minimize Data"

The core tension: AI relay needs to understand the emergency context to communicate effectively, but GDPR requires minimum data collection. Here's how to resolve it:

#### Principle: Process Much, Store Little

1. **Process in memory, don't persist:** The AI can process the full conversation context in RAM during the call, but nothing is written to disk
2. **Structured extraction:** Convert free-text emergency info into structured fields (type, location, severity) — discard the raw text
3. **Ephemeral sessions:** Each emergency call is a self-contained session. When the call ends, all state is destroyed.
4. **Tiered context:**
   - **Tier 1 (always available):** Communication preferences, accessibility needs — stored on device
   - **Tier 2 (opt-in):** Medical profile — stored on device, shared only during emergencies
   - **Tier 3 (never stored):** Real-time conversation content — ephemeral, processed in RAM only
5. **No training on user data:** Emergency call data must **never** be used to fine-tune or improve the AI model. Use synthetic data or fully anonymized/aggregated data only.

### 5.5 Hackathon-Specific Decisions

For the hackathon build specifically, make these concrete decisions:

#### ✅ DO:
1. **Use EU-hosted API endpoints** for any cloud LLM calls (Azure OpenAI West Europe or GCP europe-west1)
2. **Store medical profiles on-device only** (SQLite + SQLCipher or platform keychain)
3. **Implement explicit, granular consent** at setup with separate toggles
4. **Auto-delete call transcripts** immediately after the call ends
5. **Include a privacy policy** accessible in-app (even for hackathon — shows maturity)
6. **Log only anonymized metadata** (call duration, emergency type, no PII)
7. **Use speech-to-text, NOT voice biometrics** for caller interaction
8. **Display a "Privacy by Design" slide** in the pitch — judges love this

#### ❌ DON'T:
1. **Don't send raw emergency data to US-based API endpoints**
2. **Don't store call recordings** on your servers (let emergency services handle this)
3. **Don't implement voice/face biometric identification**
4. **Don't retain personal data beyond the emergency call session**
5. **Don't use emergency call data for AI model training**
6. **Don't collect device identifiers, advertising IDs, or analytics data during emergency calls**

### 5.6 DPIA (Data Protection Impact Assessment) — Required

A DPIA is **mandatory** under GDPR Article 35(3) because our system involves:
- **(a)** Systematic and extensive evaluation of personal aspects (AI processing)
- **(b)** Processing of special categories of data (health data) on a large scale
- **(c)** Systematic monitoring of publicly accessible areas (if location tracking)

**For the hackathon pitch:** Include a slide noting that a DPIA would be conducted before production launch, covering:
1. Description of processing operations
2. Assessment of necessity and proportionality
3. Risks to rights and freedoms
4. Measures to address risks

### 5.7 Key Legal References Summary

| Reference | Citation | Relevance |
|-----------|----------|-----------|
| GDPR Art. 5(1)(c) | Regulation 2016/679, Art. 5(1)(c) | Data minimization principle |
| GDPR Art. 6(1)(d) | Regulation 2016/679, Art. 6(1)(d) | Vital interests — lawful basis for emergency processing |
| GDPR Art. 9(2)(a) | Regulation 2016/679, Art. 9(2)(a) | Explicit consent for health data at setup |
| GDPR Art. 9(2)(c) | Regulation 2016/679, Art. 9(2)(c) | Vital interests for health data when incapable of consent |
| GDPR Art. 9(2)(g) | Regulation 2016/679, Art. 9(2)(g) | Substantial public interest |
| GDPR Art. 17(3) | Regulation 2016/679, Art. 17(3) | Exceptions to right to erasure |
| GDPR Art. 25 | Regulation 2016/679, Art. 25 | Data protection by design and by default |
| GDPR Art. 35 | Regulation 2016/679, Art. 35 | Data Protection Impact Assessment |
| GDPR Art. 44-49 | Regulation 2016/679, Ch. V | International data transfers |
| GDPR Recital 46 | Regulation 2016/679, Recital 46 | Vital interests clarification |
| ePrivacy Directive Art. 15 | Directive 2002/58/EC, Art. 15(1) | Public security exception |
| EECC Art. 109 | Directive 2018/1972, Art. 109 | Emergency communications & caller location |
| EU AI Act Annex III, 5(d) | Regulation 2024/1689, Annex III | High-risk classification for emergency call AI |
| EU AI Act Arts. 9-15 | Regulation 2024/1689, Arts. 9-15 | High-risk system compliance requirements |
| EU AI Act Recital 58 | Regulation 2024/1689, Recital 58 | Rationale for emergency AI high-risk classification |
| EU-US DPF | Commission Decision C(2023) 4745 | US data transfer adequacy |
| New SCCs | Decision 2021/914 | Standard Contractual Clauses |
| Serbia LPDP | Official Gazette RS 87/2018 | Serbian data protection law |

---

## Appendix: One-Page Hackathon Pitch Summary (Privacy)

> **"We built privacy-first, not privacy-later."**
>
> Our AI emergency relay system processes sensitive data — names, locations, health conditions — during life-or-death situations. Here's how we handle it:
>
> 🔐 **Legal Basis:** GDPR Article 6(1)(d) vital interests + Article 9(2)(c) for health data. During emergencies, we don't need to ask — the law says saving lives comes first.
>
> 🏥 **Medical Data:** Opt-in medical profiles stored **only on the user's device**, auto-shared with dispatch during emergencies via explicit pre-consent (like Apple Medical ID).
>
> 🇪🇺 **Data Residency:** All AI processing on **EU-hosted** infrastructure. Zero emergency data sent to US servers. Zero data retention after calls end.
>
> 🤖 **EU AI Act Ready:** Our system is classified high-risk under Annex III, 5(d). We've designed for compliance: human oversight, transparency, documented risk management.
>
> 🔒 **Privacy by Design:** On-device processing first. Ephemeral sessions. Auto-delete. No training on user data. Ever.
>
> 🇷🇸 **Serbia-compatible:** Built to GDPR standard, which exceeds Serbian LPDP requirements. Ready for EU expansion from day one.
