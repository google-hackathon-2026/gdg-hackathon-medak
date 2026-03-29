# QUALITY REVIEW — Medak Pitch & Strategy Documents

> **Reviewer:** Automated quality review agent
> **Date:** 2026-03-29
> **Verdict:** The pitch is 70% there. The emotional core is strong. But there are critical inconsistencies, unfilled placeholders, and honesty problems that could sink you in Q&A. Fix these before stepping on stage.

---

## 🔴 CRITICAL ISSUES (Fix or Fail)

### CRIT-1: The XX Placeholders in Slide 8 Are Still Empty

The pitch script for Slide 8 (User Research) contains:
- `N=XX respondents`
- `XX% confirmed they cannot reach 112 independently`
- `XX% said they would use an AI voice relay`

The data exists in `SYNTHETIC_SURVEY_DATA.md`. The numbers are:
- **N=18** respondents
- **56%** (10/18) couldn't get emergency help due to communication barriers (Q7)
- **83%** (15/18) would definitely or probably use AI relay (Q8)

The presenter script also says: `"Mi smo sproveli anketu sa XX članova zajednice gluvih"` — replace XX with 18. But note: "zajednice gluvih" is inaccurate. Only 11/18 were D/HoH. 3 were speech-impaired, 3 family members, 1 professional. Say **"18 ispitanika iz zajednice gluvih, osoba sa govornim poteškoćama i njihovih porodica"** instead.

**Finding #3 misrepresentation:** The pitch says *"primarna briga nije bila privatnost — bila je pouzdanost"* (reliability). The survey data says the #1 concern was **tačnost prenosa poruke** (accuracy of message relay) at 56%, not reliability. "Pouzdanost" (reliability) and "tačnost" (accuracy) are different concepts. The RESEARCH_TO_ADAPTATION doc correctly identifies accuracy. The pitch script is wrong. Fix: **"primarna briga nije bila privatnost — bila je tačnost. 'Da li će AI tačno preneti moju poruku?'"**

**Fix:** Fill all XX values. Correct "pouzdanost" → "tačnost". Correct "zajednice gluvih" → broader description. Do this TODAY.

---

### CRIT-2: The Survey File Is Titled "SYNTHETIC_SURVEY_DATA.md"

The file is literally named "Synthetic." If any judge sees this filename, discovers it during a code/docs review, or asks "Did you talk to real users?" and the team hesitates — credibility is destroyed instantly.

If the data is genuinely AI-generated, **do NOT present it as real user research to judges.** That is dishonest and disqualifying. Instead, frame it as: "We used published research (EENA, EUD, AccesSOS, WHO) as our primary evidence, supplemented by a synthetic user needs analysis based on documented experiences from deaf community forums and advocacy reports."

If the data IS from real people and "synthetic" is a misnomer — **rename the file immediately** to something like `SURVEY_DATA.md` or `USER_RESEARCH_RAW.md`.

**Fix:** Either rename the file (if real) or rewrite Slide 8 to lean on published research only and be transparent about the nature of the survey data. The published sources (EENA 2025, EUD 2024, AccesSOS) are rock-solid. Use them as the primary evidence.

---

### CRIT-3: Cost Per Call Is Either $0.05 or $0.13 — Pick One

Two different figures are used across documents:

| Document | Cost/Call |
|----------|----------|
| **PITCH_SCRIPT** (Slide 4, Slide 9) | **$0.13** |
| **MONETIZATION_MODEL** (headline) | **$0.13** |
| **MARKET_AND_COMPETITION** | **~$0.13** |
| **COST_AND_RESOURCES** (detailed breakdown) | **~$0.05** |
| **USERS_VS_BUYERS** (detailed breakdown) | **~$0.05** |

The COST doc's detailed breakdown (Gemini $0.02-0.05 + Twilio $0.02-0.06 + infra $0.001 = ~$0.05) directly contradicts the MONETIZATION doc's breakdown (Gemini ~$0.015 + Twilio ~$0.07 + TTS ~$0.02 + infra ~$0.02 = ~$0.13). The difference is 2.6x.

If a judge asks "You say 13 cents per call — walk me through that" and someone says $0.05, the whole cost argument unravels.

**Fix:** Pick ONE number. Run the actual breakdown with current Gemini 2.0 Flash pricing and Twilio EU voice rates. My guess: the $0.05 number is low (excludes TTS and real Twilio rates) and $0.13 is the conservative estimate. Use $0.13 everywhere. But fix the detailed breakdowns in COST_AND_RESOURCES and USERS_VS_BUYERS to match.

---

### CRIT-4: Confidence Weight Mismatch Breaks the Implementation Story

The **Implementation Problem** doc describes the racing bug where:
> "emergency type (0.30) + location (0.35) + GPS (0.20) = 0.85"

But **every other document** lists emergency type weight as **0.25**, not 0.30:
- ARCHITECTURE_FOR_JUDGES: type = 0.25
- RESEARCH_TO_ADAPTATION: type = 0.25
- PITCH Slide 6: type = 0.25
- PITCH Slide 7: before/after diagram uses the same example

With type = 0.25: type (0.25) + address (0.35) + GPS (0.20) = 0.80. That's **below** the 0.85 threshold. The bug as described **mathematically cannot happen** with the weights shown elsewhere.

This means either:
1. The weights were changed from 0.30 → 0.25 as part of the fix (and the IMPLEMENTATION doc describes the OLD weights) — but this isn't stated
2. The numbers are just inconsistent

A technically-minded judge doing mental math during Slide 7 will notice this.

**Fix:** Align the weights everywhere. If the bug happened with old weights (0.30), make that explicit in the implementation doc: "The original weights were: type 0.30, location 0.35..." Then show the fix changed them to 0.25. This actually makes the story BETTER — you didn't just add clinical data requirements, you also rebalanced the weights.

---

### CRIT-5: Demo Mode Is Scripted but Pitch Says "Ovo nije mockup"

The pitch post-demo narration says:
> "Ovo nije mockup. Ovo je prava aplikacija na pravom telefonu, povezana na pravi backend preko WebSocket-a. Fazni prelazi, confidence scoring, cross-agent relay — sve je live."

But demo mode runs with predetermined timestamps (T+0s, T+2.5s, T+5.5s, etc.). The camera isn't actually feeding Gemini in demo mode. The "Medicinski hitan slučaj detektovan" transcript at T+2.5s is scripted, not an AI decision. The confidence jumps are predetermined, not computed from real observation.

This is technically a mockup with real plumbing. If a judge asks "Is the AI actually processing camera input right now?" during the demo — what's the answer?

**Fix:** Two options:
1. **Run real mode for the demo** — risky but genuinely impressive if it works. Have scripted demo as backup.
2. **Be honest about demo mode:** Change the narration to: "Ovo je prava aplikacija sa pravim backendom — WebSocket, fazni prelazi, Gemini agenti, Twilio poziv. Demo režim koristi skriptirani scenario za pouzdanost prezentacije, ali ista arhitektura procesira žive podatke u produkcijskom režimu. Jedino što je simulirano je 112 endpoint."

Option 2 is safer and still scores well on "actual use, not mockup" because the architecture IS real.

---

## 🟡 IMPORTANT ISSUES (Fix If Possible)

### IMP-1: EU Population Numbers Are All Over the Place

| Document | Deaf/HoH in EU |
|----------|----------------|
| TARGET_PERSONAE | **52 million** (EUD 2023) |
| MARKET_AND_COMPETITION | **46 million** (EDF) |
| MONETIZATION_MODEL | **40 million** |
| USERS_VS_BUYERS | **~35 million** (table) → **42M+** (summary/pitch slide) |
| PITCH_SCRIPT (Slide 9) | **42M+** |

Five different numbers across five documents. Same metric. This is embarrassing.

**Global numbers too:**
- PITCH + PERSONAE: 466 million (WHO)
- MARKET: 430 million (WHO 2024)
- USERS_VS_BUYERS: 500 million (70M deaf + 430M HoH)

These are different WHO figures measured differently (disabling hearing loss vs all hearing loss vs deaf specifically). But the pitch uses them interchangeably.

**Serbia deaf population:**
- MARKET: ~50,000 deaf citizens
- Everywhere else: ~14,000 deaf + ~70,000 HoH = ~84,000 total

50K vs 14K for "deaf" is a 3.5x discrepancy.

**Fix:** Pick ONE authoritative source per scope and use it everywhere:
- Global: 466M with disabling hearing loss (WHO, most recent report)
- EU: 52M deaf/HoH (EUD — most official European source)
- Serbia: 14,000 deaf + 70,000 hard of hearing = 84,000 (Statistical Office of RS)
- Search-and-replace across ALL docs.

---

### IMP-2: TAM/SAM/SOM Contradicts Between Docs

| | PITCH / PERSONAE | MONETIZATION |
|---|---|---|
| **TAM** | €2-4B, 650M+ users | €50-100M/year |
| **SAM** | €200-600M, 60M users | €10-20M/year |
| **SOM** | €5-15M ARR, 500K-1M users | €5-8M/year (Y5) |

TAM is off by **40x** between the pitch (€2-4B) and monetization (€50-100M). This is not a rounding error. The pitch's €2-4B TAM and the monetization's €50-100M are measuring completely different things (one is total market value including all emergency relay, the other is realistic B2G SaaS).

A judge who reads both the pitch and the monetization doc will be confused.

**Fix:** Use the conservative (monetization) numbers in the pitch. The €50-100M TAM is more credible for B2G SaaS. A €2-4B TAM for a hackathon project is going to trigger eye-rolls.

---

### IMP-3: Year Discrepancies Across Documents

Some docs say 2025, some say 2026:
- `SYNTHETIC_SURVEY_DATA.md` → "Data generated: March 2025" / "GDG Hackathon 2025"
- `MARKET_AND_COMPETITION.md` → "Document prepared for GDG Hackathon Medak — March 2025"
- `TARGET_PERSONAE.md` → "Last updated: 2025-03-29"
- `PITCH_SCRIPT_10MIN.md` → "GDG Belgrade 'Build with AI' Hackathon 2026" / "Last updated: 2026-03-29"
- `MONETIZATION_MODEL.md` → "Last updated: March 2026"
- `GRADING_CRITERIA.md` → "Build with AI 2026"

Half the docs think it's 2025 and half think it's 2026. The event is "Build with AI 2026."

**Fix:** Update all doc footers to 2026. Trivial but sloppy if left unfixed.

---

### IMP-4: Firebase Listed as Used Technology — But It's Not

PITCH Slide 4 lists:
> "**Firebase** (real-time state)"

But ARCHITECTURE_FOR_JUDGES says:
> "### Firebase (Optional) — Push notification channel for background alerts"

And the actual real-time state is **Redis**, not Firebase. Firebase is described as optional push notifications, not implemented in the PoC.

If a judge asks "You use Firebase for real-time state — show me" → you can't.

**Fix:** Remove Firebase from Slide 4 or change to "Firebase (push notifications — optional)." Better: just list Gemini 2.0 Flash Live + Cloud Run. Those are the Google technologies you actually use. Adding Firebase for points when it's not implemented is risky.

---

### IMP-5: Architecture Says "Multi-language: English only" But Pitch Claims Multilingual

ARCHITECTURE doc, "What We'd Add for Production" table:
> "Multi-language | English only | Serbia needs Serbian; EU needs 24 languages"

But PITCH Slide 10:
> "Jezički — Gemini nativno podržava preko 40 jezika, nema retraininga."

And the TARGET_PERSONAE Yuki scenario implies the system handles Japanese→Serbian translation.

So: the PoC is English-only, but the pitch implies multilingual capability. A judge who digs into the code or asks "Show me it working in Serbian" during Q&A will discover the truth.

**Fix:** The pitch should say Gemini *supports* 40+ languages (capability), and the demo runs in Serbian (true — the scripted demo outputs Serbian). Be prepared for Q&A: "Our PoC demonstrates Serbian. Gemini natively handles 40+ languages, so adding a new language is a config change, not a rebuild."

---

### IMP-6: Slide Count Says "13 Slides" but There Are Only 12

The overview header says:
> "### Overview: 13 Slides, 570 seconds + 30 seconds buffer"

The visual consistency guide shows `[Slide Number/13]` in the footer.

But slides are numbered 1-12. There is no Slide 13.

**Fix:** Change to "12 Slides" everywhere. Update footer to `/12`.

---

### IMP-7: Time Budget Math Is Internally Inconsistent

The Time Budget Summary says:
```
Scripted content:    565s (9:25)
Transitions:           5s (0:05)
Available buffer:     30s (0:30)
────────────────────────────────
Total:               600s (10:00)
```

But the Emergency Cuts table shows **35s** recoverable (15s + 10s + 10s), not 30s.

And the individual slides add to 600s total, meaning 565s + 5s transitions + 30s buffer = 600s, but the "buffer" is actually embedded in slides 2, 3, and 8 as cuttable content. The slides as written already total 600s, so the "buffer" isn't extra time — it's content within the 600s that can be dropped.

This is confusing. A reader might think there's 30s of silence/padding beyond the 600s.

**Fix:** Clarify: "Total: 600s. Of which 35s is cuttable content (marked ✂️) if running over." Remove the misleading "Scripted content: 565s" line.

---

### IMP-8: EU AI Act Compliance Cost Mismatch

| Document | EU AI Act Cost |
|----------|---------------|
| MONETIZATION_MODEL | ~€100K (detailed breakdown) |
| COST_AND_RESOURCES | €45K for entire Phase 2 (engineers + compliance + pentest) |
| PITCH Q&A Q3 | ~100K |

The COST doc bundles everything into €45K for Phase 2 which supposedly includes AI Act cert + GDPR + pentest + multi-language + PSAP specs. The MONETIZATION doc says AI Act alone is ~€100K. These can't both be right.

**Fix:** Align on one number. €100K for AI Act compliance is more realistic (conformity assessment alone is expensive). Update COST_AND_RESOURCES Phase 2 budget accordingly — probably €80-100K, not €45K.

---

## 🟢 OBSERVATIONS & POLISH

### OBS-1: Pitch Script Serbian Is Natural — With One Exception

The Serbian reads well and sounds like a real person presenting. The emotional sections (Slides 1, 2, 12) are particularly strong.

One jarring phrase: *"Grabi telefon"* in Slide 1. "Grabi" is more literary/written Serbian. In spoken Belgrade Serbian, this would more naturally be **"Zgrabi telefon"** or **"Dohvati telefon"**. Minor, but in a pitch where every word is rehearsed, natural language matters.

---

### OBS-2: Transition from Slide 7→8 Is Weak

The script says: "Tech Lead says nothing — Lead simply takes over by speaking. Natural transition."

It's NOT a natural transition. The Tech Lead just finished a technical deep-dive on confidence scoring. Then the Lead Presenter starts talking about user research with no bridge. The audience needs a beat to shift mental context.

**Fix:** Give the Tech Lead a closing line: *"I eto — tako smo rešili problem pouzdanosti. A sada — odakle smo uopšte znali šta da gradimo."* This bridges from implementation → research naturally.

---

### OBS-3: Slide 9 Is Overloaded (50 Seconds for Too Much)

Slide 9 tries to cover in 50 seconds:
- Users ≠ Buyers concept
- 42M EU users
- EECC Article 109 + deadline
- B2G SaaS pricing (€200-500K/year)
- France comparison (€5-10M)
- Per-call cost comparison ($0.13 vs $20-40)
- TAM/SAM/SOM

That's 7 distinct concepts in 50 seconds. The audience can't absorb this. It reads like a technical doc, not a pitch.

**Fix:** Cut TAM/SAM/SOM from the verbal pitch (leave it on the slide for judges to read). Cut the France cost comparison to just the per-call number. Focus the verbal pitch on: (1) Users ≠ Buyers, (2) EECC mandate, (3) €200-500K/year price. That's three ideas — manageable in 50 seconds.

---

### OBS-4: TARGET_PERSONAE Recommends Stefan as Opening Hook, Pitch Uses Ana

The TARGET_PERSONAE doc says:
> "Opening hook: Start with Stefan (Persona 6). Everyone in the room can imagine having a stroke."

But the pitch opens with Ana. This is actually FINE — Ana is the consistent hero of the product story and the demo. Stefan appears in Slide 2 as a secondary story. But the documents should be aligned.

**Fix:** Update TARGET_PERSONAE's pitch usage guide to recommend Ana as the opening (consistent with actual pitch), with Stefan in Slide 2 for the "anyone can need this" argument.

---

### OBS-5: The "150-300x Cheaper" Comparison Varies Wildly

| Document | Cost Advantage Claim |
|----------|---------------------|
| PITCH | 150-300x |
| MONETIZATION | 115-300x |
| MARKET | 100-600x |
| USERS_VS_BUYERS | 10-20x (country level) |

**Fix:** Use the most defensible number. $0.13 vs $20-40 = 154-308x. Round to **"150x jeftinije"** (the conservative end). Use this ONE number everywhere.

---

### OBS-6: The Emotional Close (Slide 12) Is Strong but Could Be Stronger

Current close:
> "466 miliona ljudi na svetu ne može da pozove pomoć kad im je najpotrebija."

This is the same statistic from Slide 2. By Slide 12, the audience has heard it. It's less impactful on repetition.

**Fix:** Replace with something new and immediate:
> "Dok smo mi ovde pričali ovih deset minuta — negde na svetu, neko gleda svoju kuću kako gori i ne može da pozove pomoć. Medak to menja."

This creates urgency and makes the problem feel PRESENT, not statistical.

---

### OBS-7: Q&A Answers Are Strong But Q11 Is Dangerous

Q11 asks: "Da li ste razgovarali sa pravim korisnicima?"

The prepared answer says: "Da. Sproveli smo anketu sa članovima zajednice gluvih. [Navedi specifične rezultate.]"

If the survey data is synthetic (as the filename suggests), this answer is a lie. If judges press further — "Can we see the survey? What questions did you ask? How did you recruit?" — the team needs rock-solid answers.

**Fix:** If data is synthetic, rewrite Q11 answer to lead with published research: "Naše istraživanje se oslanja na EENA izveštaj iz 2025, AccesSOS globalnu studiju, i EUD analizu. Pored toga, izvršili smo analizu potreba korisnika na osnovu dokumentovanih iskustava iz zajednice. 78% gluvih ispitanika u AccesSOS studiji kaže da nema pristup hitnim službama." Don't claim primary research you can't defend.

---

## 📊 REDUNDANCY MAP

Content that's duplicated across 3+ documents (wasted effort):

| Topic | Appears In | Recommendation |
|-------|-----------|----------------|
| Cost per call analysis | PITCH, MONETIZATION, COST, USERS_VS_BUYERS, MARKET (5 docs!) | Canonicalize in MONETIZATION. Others reference it. |
| EECC Article 109 / June 2027 | Every single doc | Fine for pitch + 1 reference doc. Overkill elsewhere. |
| Competitive analysis | MARKET (exhaustive), PITCH Slide 3, MONETIZATION | MARKET is the canonical source. Others should reference, not repeat. |
| Confidence scoring explanation | ARCHITECTURE, IMPLEMENTATION, RESEARCH, PITCH (4 docs) | ARCHITECTURE is canonical. IMPLEMENTATION tells the story. Others reference. |
| Population statistics | PERSONAE, MARKET, PITCH, MONETIZATION, USERS_VS_BUYERS (5 docs) | Canonicalize in PERSONAE. **Use same numbers everywhere.** |
| B2G pricing tiers | MONETIZATION, USERS_VS_BUYERS | Identical content. Merge into MONETIZATION. |
| EU AI Act discussion | MONETIZATION, COST, PITCH Q&A | MONETIZATION is canonical. |
| Grant funding sources | MONETIZATION, COST, USERS_VS_BUYERS | MONETIZATION is canonical. Different lists in each! |

**Bottom line:** USERS_VS_BUYERS and MONETIZATION overlap ~60%. Consider merging or clearly delineating scope.

---

## 🎯 WHAT SKEPTICAL JUDGES WILL ASK THAT YOU CAN'T ANSWER

1. **"Your demo was scripted. Was the AI actually processing camera input?"** → No good answer if running demo mode. (See CRIT-5)

2. **"N=18 is not statistically significant. Your margin of error is ±23%. How can you draw conclusions?"** → You can't claim statistical significance. Lean on published research as primary evidence, survey as qualitative supplement.

3. **"What happens when the AI hallucinates a wrong address and emergency services go to the wrong location?"** → Q&A Q2 addresses hallucination in general but not the specific scenario of a wrong address. The deterministic scoring helps but doesn't guarantee the AI correctly interpreted what it saw. GPS is the safety net, but the pitch claims "confirmed address" which implies AI-interpreted text.

4. **"Has any PSAP (112 center) in Serbia actually agreed to receive AI-generated calls?"** → No. This is a future step. Say so honestly.

5. **"What about the false positive scenario — TV showing a disaster movie, or a child playing with the phone?"** → 1.5s button hold helps but isn't addressed for the TV/visual false positive case. The AI might interpret a movie scene as a real emergency.

6. **"You claim 38 seconds to dispatch. What if the operator asks 5 follow-up questions? What's the real end-to-end time?"** → 38 seconds is demo-scripted best case. Real calls with extended Q&A could take 2-5 minutes. Be honest about this range.

7. **"Open source vs proprietary: your research respondent R18 says 'open source it.' Your business model is proprietary licensing. How do you reconcile?"** → Prepare an answer about open-source core + proprietary managed service. Don't get caught flat-footed.

8. **"You're comparing Medak's per-call API cost ($0.13) to France's per-call human relay cost ($15-40). But France's cost includes 24/7 staffing, training, facilities, QA — things you'll also need for production. Isn't this comparing apples to oranges?"** → Partially fair. Medak's PRODUCTION cost per call will be higher once you add monitoring, compliance, support staff. But still 10-50x cheaper, not 150x.

9. **"The EECC deadline is June 2027. You're at hackathon stage with 5 people. Government procurement takes 18-24 months. How do you make this timeline?"** → Grants for Year 1 (Serbia pilot), not government contract. Be realistic.

---

## ✅ WHAT'S WORKING WELL

1. **The emotional hook (Slides 1, 2, 12)** — Ana's story, Stefan's stroke, the closing callback. These are genuinely powerful. The pitch will make the room go quiet at the start.

2. **The live demo concept** — 42 seconds of silence while the system works is theatrically brilliant. Even in demo mode, watching the phone screen update in real-time is compelling.

3. **Implementation problem story (Slide 7)** — "We let the AI be too confident" is a great engineering narrative. Relatable, honest, well-resolved. Judges love this. (Just fix the weight numbers.)

4. **Zero PSAP changes** — This is the single most powerful differentiator and it's hammered home well. "Operater prima normalan glasovni poziv" is the killer line.

5. **The RESEARCH_TO_ADAPTATION doc** — Best document in the set. Every finding maps to an architectural decision with code references. If judges read one supporting doc, this is the one to show them.

6. **"Korisnici ≠ Kupci" framing** — Clear, memorable, and addresses the grading criteria directly.

7. **Q&A preparation** — 12 questions with strong answers. Q1, Q2, Q5, and Q12 are particularly good. The "Why haven't Google/Apple built this?" answer is excellent.

---

## 📋 PRIORITY FIX LIST

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 1 | Fill XX placeholders in Slide 8 with real numbers | 5 min | 🔴 Critical |
| 2 | Resolve $0.05 vs $0.13 cost-per-call across ALL docs | 30 min | 🔴 Critical |
| 3 | Rename or address SYNTHETIC_SURVEY_DATA.md | 5 min | 🔴 Critical |
| 4 | Fix confidence weights in IMPLEMENTATION doc (0.30→0.25) | 10 min | 🔴 Critical |
| 5 | Rewrite post-demo narration to be honest about demo mode | 15 min | 🔴 Critical |
| 6 | Unify EU population numbers across all docs | 30 min | 🟡 Important |
| 7 | Remove/fix Firebase claim on Slide 4 | 5 min | 🟡 Important |
| 8 | Fix "13 Slides" → "12 Slides" | 2 min | 🟡 Important |
| 9 | Add transition line between Slide 7→8 | 5 min | 🟡 Important |
| 10 | Fix time budget math (30s vs 35s buffer) | 5 min | 🟡 Important |
| 11 | Align TAM/SAM/SOM between pitch and monetization | 15 min | 🟡 Important |
| 12 | Fix year discrepancies (2025 vs 2026) | 10 min | 🟡 Important |
| 13 | Fix "pouzdanost" → "tačnost" in Slide 8 script | 2 min | 🟡 Important |
| 14 | Align EU AI Act cost (€45K vs €100K) | 10 min | 🟡 Important |
| 15 | Slim down Slide 9 verbal content | 10 min | 🟢 Polish |
| 16 | Strengthen Slide 12 close with new line | 5 min | 🟢 Polish |
| 17 | Update TARGET_PERSONAE pitch guide to match actual pitch | 5 min | 🟢 Polish |

**Total estimated effort: ~3 hours of focused editing.**

---

*Be harsh. This is a competition. Second place gets nothing.*

The pitch has a strong emotional core and a compelling technical story. But the devil is in the details — and right now the details have contradictions that a competent judge will notice. Fix the critical issues, rehearse 5 times, and you're in contention.
