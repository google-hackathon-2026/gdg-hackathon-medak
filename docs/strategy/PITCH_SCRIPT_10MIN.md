# Medak — 10-Minute Pitch Script & Slide Structure

> **Event:** GDG Belgrade "Build with AI" Hackathon 2026
> **Theme:** "AI for All — Bridging the Accessibility Gap"
> **Time limit:** 10 minutes (600 seconds)
> **Team:** 5 people

---

## Table of Contents

1. [Slide-by-Slide Structure](#1-slide-by-slide-structure)
2. [Presenter Assignment](#2-presenter-assignment)
3. [Timing Table](#3-timing-table)
4. [Q&A Preparation](#4-qa-preparation)
5. [Visual Consistency Guide](#5-visual-consistency-guide)

---

## 1. Slide-by-Slide Structure

### Overview: 12 Slides, 600 seconds total

```
Slide  Title                          Duration   Cumulative   Presenter
─────  ─────────────────────────────  ─────────  ──────────   ─────────
 1     Hook — Meet Ana                   30s         30s      Lead
 2     The Problem                       80s        110s      Lead
 3     Why Existing Solutions Fail       50s        160s      Lead
 4     Our Solution: Medak               60s        220s      Lead
 5     LIVE DEMO                         90s        310s      Lead + Tech
 6     How It Works — Architecture       60s        370s      Tech
 7     Implementation Challenge          50s        420s      Tech
 8     User Research                     50s        470s      Lead
 9     Business Model                    50s        520s      Lead
10     Scalability & Expansion           30s        550s      Lead
11     Team                              20s        570s      Lead
12     Close — Back to Ana               30s        600s      Lead
```

**Total: 600s. Of which 35s is cuttable content (marked ✂️) if running over.**

---

### SLIDE 1 — "Meet Ana"

| | |
|---|---|
| **Duration** | 30 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Problem: clearly defined; Delivery: engaging |

**Content on slide:**
- Black background, single line of large white text:
  > *"Zamislite da ste gluvi. Vaš stan je u plamenu. Ne možete da pozovete 112."*
- Below, smaller: a photo or illustration of a young woman alone in an apartment
- No logo, no title, no distractions — just the sentence

**Visual:** Dark, cinematic. One sentence. One image. The room goes quiet.

**PRESENTER SAYS:**

> "Zamislite da ste gluvi. Vaš stan gori. Dim se širi. Srce vam lupa. Zgrabi telefon — ali ne možete da pozovete 112.
>
> Ovo je Ana. Ima 26 godina, gluva je od rođenja i živi sama u Beogradu. Prošle noći, njena komšinica Milica je kolabirala u njenoj kuhinji — mogući moždani udar. Ana ne može da vikne u pomoć. Ne može da pozove hitnu. Jedino što može — je da pritisne jedno dugme."

*[Beat. Click to next slide.]*

---

### SLIDE 2 — "The Problem"

| | |
|---|---|
| **Duration** | 80 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Problem: clearly defined, relevant to competition; Business: target personae and market need |

**Content on slide:**
- Title: **"112 je glasovni sistem. Milioni ljudi nemaju glas."**
- Three big numbers in a row:
  - **430M** — people with disabling hearing loss worldwide (WHO, 2021/2026)
  - **84,000** — deaf and hard of hearing in Serbia
  - **0** — number of countries offering full equivalent 112 access (EUD 2024)
- Below: small icons representing other affected groups:
  - 🧏 Deaf / Hard of hearing
  - 🗣️ Speech impaired (dysarthria, ALS, non-verbal autism)
  - 🌍 Foreign tourists (language barrier)
  - 🧠 Sudden speech loss (stroke, injury)

**Visual:** Clean white slide. Three giant numbers dominate the page. Icons are secondary.

**PRESENTER SAYS:**

> "Sistem 112 u celoj Evropi funkcioniše na jedan jedini način — glasovnim pozivom. Ako ne možete da govorite, ne možete da pozovete pomoć.
>
> Ovo pogađa 430 miliona ljudi sa oštećenjem sluha širom sveta. U Srbiji, to je 84 hiljade ljudi — 14 hiljada gluvih i 70 hiljada nagluvih.
>
> Ali problem je širi od toga. Ljudi sa govornim invaliditetom — cerebralna paraliza, ALS, neverbalni autizam. Turisti koji ne govore srpski. Ili — i ovo je ključno —
>
> ✂️ *[CUT HERE IF RUNNING OVER — skip Stefan, go straight to "zero countries"]*
>
> bilo ko od nas. Stefan, 52 godine, gleda TV, ruka mu utrnula — moždani udar. Zna tačno šta se dešava. Bira 112. Otvara usta — i ne izlazi ništa razumljivo. Operater pomisli da je lažni poziv. Prekine vezu. Stefan — vaš otac, vaš komšija, vi sami — sada leži sam i umire, jer sistem prima samo glas.
>
> A danas — 2026. — nijedna država u Evropi nema potpuno pristupačan 112. Nijedna."

---

### SLIDE 3 — "Why Existing Solutions Fail"

| | |
|---|---|
| **Duration** | 50 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Business: market research and competition; Problem: addressed identified problems |

**Content on slide:**
- Title: **"Zašto sadašnja rešenja ne rade"**
- Comparison table (4 rows, keep it tight):

| Rešenje | Problem |
|---------|---------|
| SMS na 112 | ❌ Ne postoji u Srbiji. Ni u većini EU. |
| Ljudski prevodilac (relay) | ❌ $20-40 po pozivu. Nije 24/7. Deficit prevodilaca. |
| Video relay (znakovni jezik) | ❌ Ne radi za govorne invaliditete. Ne razume scenu. |
| Aplikacije (DEC112, eCall) | ❌ Samo tekst. Nema glasa za operatera. Nema dijaloga. |

- Below table, one bold line:
  > **Svako prethodno rešenje pokušava da promeni hitnu službu. Mi ne menjamo ništa.**

**Visual:** Minimalist table. Red ❌ icons. Bold punchline at bottom.

**PRESENTER SAYS:**

> "SMS na 112 ne postoji u Srbiji — ni u većini Evrope. Ljudski prevodioci koštaju 20 do 40 dolara po pozivu i nisu dostupni u 2 ujutru. Video relay zahteva prevodioce znakovnog — kojih nema dovoljno. A tekstualne aplikacije šalju poruku, ali operater ne dobija glas i ne može da postavi pitanja u realnom vremenu.
>
> ✂️ *[CUT HERE IF RUNNING OVER — go straight to punchline]*
>
> Svako dosadašnje rešenje pokušava da promeni infrastrukturu hitnih službi — da se nadograde PSAP centri, da se obuče novi operateri, da se zameni oprema.
>
> Mi ne menjamo ništa na strani hitne službe. Operater prima normalan glasovni poziv. Razlika je u tome ko govori."

---

### SLIDE 4 — "Our Solution: Medak"

| | |
|---|---|
| **Duration** | 60 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Technology: architecture defined, Google technologies; Problem: clearly defined |

**Content on slide:**
- Title: **"Medak — Dva AI agenta. Jedan vidi. Drugi govori."**
- Simple 3-step flow diagram (LEFT → CENTER → RIGHT):

```
  📱 Korisnik           🤖 AI Agenti              📞 112 Operater
  ─────────────        ──────────────────         ──────────────────
  Pritisne SOS    →    User Agent (vidi)     →    Prima glasovni poziv
  Kamera + GPS         Dispatch Agent (govori)     Pita pitanja
  Tipka odgovore  ←    Prevodi pitanja       ←    Šalje hitnu pomoć
```

- Below the diagram: Google technology badges:
  - **Gemini 2.0 Flash Live** (×2 agents)
  - **Cloud Run** (auto-scaling backend)
- One-liner at bottom: *"Cena po pozivu: $0.13. Ljudski relay: $20-40."*

**Visual:** Clean flow diagram. Google Cloud badges. Minimal text.

**PRESENTER SAYS:**

> "Medak je AI-posrednik između gluve osobe i službe 112. Funkcioniše ovako:
>
> Korisnik pritisne jedno SOS dugme. Sistem aktivira kameru i GPS.
>
> Prvi agent — User Agent, pokretan Gemini 2.0 Flash Live — *vidi* scenu. Prepoznaje požar, kolaps, saobraćajnu nesreću. Prikuplja podatke: tip hitnosti, lokacija, stanje žrtve, broj povređenih.
>
> Kada ima dovoljno informacija — a 'dovoljno' je definisano determinističkim scoring sistemom, ne procenom modela — aktivira se drugi agent.
>
> Dispatch Agent poziva 112 kao normalan glasovni poziv. Operater čuje jasan, strukturiran izveštaj na srpskom. Kada operater postavi pitanje — to pitanje se pojavi kao tekst na Aninom telefonu. Ana tipka odgovor. Agent ga izgovara.
>
> Dva Gemini agenta. Jedan poziv. Ana nikada nije progovorila ni reč."

---

### SLIDE 5 — "LIVE DEMO"

| | |
|---|---|
| **Duration** | 90 seconds total (15s intro + 42s demo + 33s narration) |
| **Presenter** | Lead Presenter (intro + narration), Tech Lead (operates demo) |
| **Grading criteria** | Technology: actual use (not mockup), all components implemented; Delivery: engaging |

**Content on slide:**
- Title: **"Uživo"**
- Slide goes mostly black / minimal — attention should be on phone + projector dashboard
- Small text in corner: *"SOS → Analiza → Poziv 112 → Rešeno"*

**SETUP:** Two screens visible to judges:
1. **Phone** (on stand or held by Tech Lead) — the actual Medak app
2. **Projector/laptop** — live dashboard showing backend log, confidence bar, phase transitions

**PRESENTER SAYS (BEFORE DEMO — 15 seconds):**

> "Ovo je Ana. Gluva je od rođenja. Živi sama u Beogradu. Njena komšinica Milica je upravo kolabirana u njenoj kuhinji — mogući moždani udar. Ana ne može da pozove 112. Ali ima Medak na svom telefonu.
>
> Gledajte."

**DEMO RUNS — 42 seconds, IN COMPLETE SILENCE.**

No talking. Let the system speak. Judges watch:
- T+0s: SOS button held → ring animation fills
- T+1s: Session created, TRIAGE phase begins
- T+2.5s: Transcript: "Medicinski hitan slučaj detektovan"
- T+5.5s: Transcript: "Lokacija potvrđena" — confidence bar jumps to 80%
- T+7s: Clinical fields set — confidence hits 100% — phase transitions to LIVE_CALL
- T+10.5s: Dispatcher voice: "Hitna služba, šta se desilo?"
- T+12s: AI delivers full structured brief in Serbian
- T+20s: Dispatcher asks: "Da li je pacijent pri svesti?" — question appears on phone screen
- T+23s: Answer relayed back to dispatcher
- T+36s: Dispatcher: "Šaljemo ekipu. ETA 8 minuta."
- T+38s: 🟢 GREEN SCREEN: "✓ Pomoć je na putu — ETA: 8 minuta"

**PRESENTER SAYS (AFTER DEMO — 33 seconds):**

> *[Let the green screen sit for 2 seconds. Then speak.]*
>
> "Od SOS dugmeta do potvrde hitne pomoći — 38 sekundi. Bez ijedne izgovorene reči.
>
> Primetite šta se upravo desilo. Ana nikada nije progovorila. Nikada nije pisala poruku. Sistem je video scenu, razumeo hitnost, pozvao 112 i vodio razgovor sa operaterom — uključujući odgovore na pitanja.
>
> Ovo je prava aplikacija sa pravim backendom — WebSocket, fazni prelazi, Gemini agenti, Twilio poziv. Demo koristi skriptirani scenario za pouzdanu prezentaciju, ali ista arhitektura procesira žive podatke u produkcijskom režimu. Jedino što je simulirano je 112 endpoint — jer ne možemo da zovemo pravu hitnu službu na hakathonu.
>
> A sada — kako to radi ispod haube."

---

### SLIDE 6 — "How It Works — Architecture"

| | |
|---|---|
| **Duration** | 60 seconds |
| **Presenter** | Tech Lead |
| **Grading criteria** | Technology: architecture + Google technologies, scalable |

**Content on slide:**
- Title: **"Arhitektura"**
- Architecture diagram showing:

```
┌─────────────────────────────────────────────────────────────────┐
│                         MEDAK SYSTEM                            │
│                                                                 │
│  📱 React Native App                                            │
│    │                                                            │
│    ├── WebSocket ──→ FastAPI Backend (Cloud Run)                │
│    │                    │                                       │
│    │               ┌────┴────┐                                  │
│    │               │ Redis   │  ← EmergencySnapshot (state)     │
│    │               └────┬────┘                                  │
│    │                    │                                       │
│    │          ┌─────────┼─────────┐                             │
│    │          │                   │                              │
│    │    User Agent          Dispatch Agent                       │
│    │    (Gemini 2.0         (Gemini 2.0                         │
│    │     Flash Live)         Flash Live)                        │
│    │    Sees scene           Speaks to 112                      │
│    │          │                   │                              │
│    │          │   Orchestrator    │                              │
│    │          │   (FSM + Score)   │                              │
│    │          └─────────┬─────────┘                             │
│    │                    │                                       │
│    │               Twilio VoIP ──→ 112 Operator                 │
│    │                                                            │
│    │  Confidence Scoring: deterministic weighted formula         │
│    │  Location (0.35) + Type (0.25) + Conscious (0.15)          │
│    │  + Breathing (0.15) + Victims (0.10) = threshold 0.85      │
│    │                                                            │
└─────────────────────────────────────────────────────────────────┘
```

- Google technologies highlighted in color: **Gemini 2.0 Flash Live**, **Cloud Run**, **Vertex AI**
- Bottom note: *"Operater prima normalan glasovni poziv. Zero promena na PSAP strani."*

**Visual:** Architecture diagram with color-coded Google components. Clean, not overcrowded.

**TECH LEAD SAYS:**

> "Arhitektura se oslanja na dva Gemini 2.0 Flash Live agenta koji rade u tandemu.
>
> User Agent prima video i tekst od korisnika i popunjava EmergencySnapshot — strukturirani model podataka u Redisu. Tip hitnosti, lokacija, stanje žrtve, broj povređenih.
>
> Orchestrator je deterministička state mašina — FSM sa četiri faze: Intake, Triage, Live Call, Resolved. On prati confidence score — čisto aritmetički, bez LLM-a — i odlučuje kada da aktivira poziv.
>
> Dispatch Agent preuzima popunjen snapshot, zove 112 preko Twilio-a i vodi glasovni razgovor sa operaterom. Kada operater postavi pitanje, ono se rutira nazad kroz snapshot do User Agenta i pojavljuje se na korisnikovom ekranu.
>
> Kritična odluka u dizajnu: scoring je namerno deterministički. Lokacija nosi 35%, tip hitnosti 25%, kliničke informacije po 15%. Threshold je 0.85. Bez lokacije i kliničkih podataka, poziv se ne upućuje — jer je nepotpun izveštaj gori od kratkog čekanja.
>
> Ceo backend radi na Cloud Run-u. Auto-scaling, stateless, cena po zahtevu."

---

### SLIDE 7 — "Implementation Challenge"

| | |
|---|---|
| **Duration** | 50 seconds |
| **Presenter** | Tech Lead |
| **Grading criteria** | Technology: implementation problem highlighted + how resolved |

**Content on slide:**
- Title: **"Problem koji smo rešili: Confidence Racing"**
- Two panels side by side:

**BEFORE (❌):**
```
T+0s: "Medical emergency" → confidence 0.45
T+2s: "Location confirmed" → confidence 0.85 ✓
T+2s: → Dispatch triggered!
T+3s: Operator: "Is the patient conscious?"
       Agent: "...I don't know yet."
```

**AFTER (✅):**
```
T+0s: "Medical emergency" → confidence 0.45
T+2s: "Location confirmed" → confidence 0.80
T+5s: "Conscious: yes, Breathing: irregular" → confidence 1.00 ✓
T+5s: → Dispatch triggered!
T+6s: Operator: "Is the patient conscious?"
       Agent: "Yes, conscious but confused."
```

- Bottom: *"Scoring je previše kritičan za LLM. Koristimo čistu aritmetiku."*

**Visual:** Before/after code-style timeline. Red on left, green on right. Clear contrast.

**TECH LEAD SAYS:**

> "Kada smo prvi put povezali User Agenta sa Gemini Live, naišli smo na kritičan problem. Model je bio previše brz — i previše samopouzdan.
>
> Detektovao je 'medicinski' i 'lokacija' u prve dve sekunde, confidence je skočio na 0.85, i sistem je automatski pozvao 112. Operater je dobio poziv koji kaže: 'Medicinska hitnost na toj adresi.' Pita: 'Da li je pacijent pri svesti?' Agent odgovara: 'Ne znam još.'
>
> Operator je dobio upravo onu vrstu beskorisnog poziva koju smo hteli da eliminišemo.
>
> Rešenje: preradili smo confidence scoring u čisto deterministički sistem sa težinskim koeficijentima. Lokacija nosi 0.35, tip hitnosti 0.25, ali klinički podaci — svest i disanje — nose po 0.15. Bez kliničkih podataka, matematički je nemoguće preći 0.85.
>
> Scoring je previše kritičan za LLM procenu. Koristimo čistu aritmetiku. Nema temperature, nema halucinacija — samo sabiranje.
>
> I eto — tako smo rešili problem pouzdanosti. A sada — odakle smo uopšte znali šta da gradimo."

---

### SLIDE 8 — "User Research"

| | |
|---|---|
| **Duration** | 50 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Problem: user research, adapted based on findings, addressed problems |

**Content on slide:**
- Title: **"Istraživanje korisnika"**
- Two columns:

**Objavljeno istraživanje:**
- EENA 2025: "Deaf citizens report 112 as completely inaccessible"
- AccesSOS global survey: 78% of deaf respondents have no way to contact emergency services directly
- EUD 2024: Zero EU countries offer full equivalent 112 access

**Naše istraživanje:**
- Google Form anketa: N=18 respondents from deaf community, people with speech impairments, and their families
- Key finding #1: 56% confirmed they cannot reach 112 independently
- Key finding #2: 83% said they would use an AI voice relay
- Key finding #3: Primary concern was accuracy, not privacy

- Bottom: **"Istraživanje je oblikovalo arhitekturu"**
  - Finding: "Existing apps require typing in a crisis" → Decision: Camera-based input, no typing required
  - Finding: "Trust issue with AI making critical decisions" → Decision: Deterministic scoring, not LLM judgment

**Visual:** Two clean columns. Published research on left with source citations. Our research on right with bold numbers.

**PRESENTER SAYS:**

> "Naše istraživanje kombinuje objavljene studije i direktan feedback zajednice.
>
> EENA izveštaj iz 2025. potvrđuje: gluvi građani opisuju 112 kao potpuno nepristupačan. AccesSOS globalna anketa pokazuje da 78% gluvih ispitanika nema nikakav način da direktno kontaktira hitne službe. A EUD studija iz 2024. potvrđuje da nijedna EU država ne nudi punu ekvivalentnu pristupačnost.
>
> ✂️ *[CUT HERE IF RUNNING OVER — skip our survey, go to "research shaped architecture"]*
>
> Mi smo sproveli anketu sa 18 ispitanika iz zajednice gluvih, osoba sa govornim poteškoćama i njihovih porodica. 56% je potvrdilo da ne može samostalno da pozove 112. 83% bi koristilo AI glasovni relay. A najvažniji uvid: primarna briga nije bila privatnost — bila je tačnost. 'Da li će AI tačno preneti moju poruku?'
>
> To istraživanje je direktno oblikovalo arhitekturu. Zato koristimo kameru umesto tipkanja — u panici ne možete da kucate. Zato je scoring deterministički — jer korisnici moraju da veruju sistemu. Zato operater čuje normalan glas — jer ne menjamo ono što radi."

---

### SLIDE 9 — "Business Model"

| | |
|---|---|
| **Duration** | 50 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Business: monetization model, cost/resources, users vs buyers |

**Content on slide:**
- Title: **"Korisnici ≠ Kupci"**
- Two-column layout:

**LEFT — Korisnici (koriste):**
- 52M gluvih/nagluvih u EU
- Niska kupovna moć
- Ne biraju rešenje

**RIGHT — Kupci (plaćaju):**
- Vlade (B2G model)
- Zakonski obavezani: EECC čl. 109, rok jun 2027
- Budžet: €200-500K/god po državi

- Center divider: Arrow showing Medak bridges Users → Buyers

- Below: Cost comparison box:

| | Medak (AI) | Ljudski relay |
|---|---|---|
| Cena po pozivu | **$0.13** | **$20-40** |
| Dostupnost | 24/7, instant | Ograničeno |
| Skalabilnost | Neograničena | Ograničena brojem prevodilaca |
| Jezici | Bilo koji | Po jeziku zapošljavate |

- Bottom: TAM/SAM/SOM compact:
  - TAM: €50-100M/year
  - SAM: €10-20M/year
  - SOM (Y3-5): €5-8M ARR

**Visual:** Clean two-column layout. Cost comparison box prominently placed. TAM/SAM/SOM as nested rectangles at bottom.

**PRESENTER SAYS:**

> "Ključni uvid: korisnici i kupci nisu isti ljudi. Korisnici su gluvi građani — 52 miliona samo u EU. Ali oni ne kupuju ovo rešenje. Kupuju ga vlade.
>
> Evropska direktiva EECC, član 109, nalaže svim EU državama da obezbede ekvivalentan pristup hitnim službama za osobe sa invaliditetom. Rok: jun 2027.
>
> Naš model: B2G SaaS licenca — €200 do 500 hiljada godišnje po državi. Cena po pozivu: 13 centi. Ljudski prevodilac: 20 do 40 dolara. To je 150 do 300 puta jeftinije.
>
> TAM, SAM, SOM vidite na slajdu — ali ključna cifra je: 27 EU država mora da bude usklađeno do 2027. Srbija je naše polazište kao zemlja kandidat."

---

### SLIDE 10 — "Scalability & Expansion"

| | |
|---|---|
| **Duration** | 30 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Problem: international expansion; Technology: scalable; Business: realistic revenue |

**Content on slide:**
- Title: **"Skalabilnost"**
- Map of Europe with three tiers highlighted:
  - 🟢 Year 1: Serbia (pilot, grant-funded)
  - 🟡 Year 2-3: 3-5 EU early adopters (Croatia, Slovenia, Estonia...)
  - 🔵 Year 3-5: 15+ EU countries
- Right side: Three expansion dimensions:
  1. **Jezici:** Gemini nativno podržava 40+ jezika — zero retraining
  2. **Korisnici:** Turistički sektor — 180M turista u EU godišnje sa jezičkom barijerom. I ne samo gluvi — starije osobe, osobe sa govornim poremećajima, korisnici pad-detekcije
  3. **Troškovi:** Cloud Run auto-scaling — $55/mesec pilot, $580/mesec nacionalno

**Visual:** Europe map with color-coded expansion tiers. Clean right-side bullet list.

**PRESENTER SAYS:**

> "Medak skalira u tri dimenzije. Jezički — Gemini nativno podržava preko 40 jezika, nema retraininga. Geografski — 27 EU država mora da bude usklađeno do 2027, a mi koristimo postojeću 112 infrastrukturu. I troškovi — Cloud Run, pay-per-request: pilot košta 55 dolara mesečno, nacionalni deployment 580 dolara.
>
> Druga tržišna prilika: turisti. 180 miliona turista godišnje u EU ne govori lokalni jezik. Medak nije samo alat za pristupačnost — to je univerzalni komunikacioni most za hitne situacije."

---

### SLIDE 11 — "Team"

| | |
|---|---|
| **Duration** | 20 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Delivery: all necessary info |

**Content on slide:**
- Title: **"Tim"**
- 5 team member photos in a row
- Under each: Name, Role, One-liner skill
- Example layout:
  - **[Name 1]** — Lead / Pitch — Product & Strategy
  - **[Name 2]** — Backend — AI Agents & Orchestration
  - **[Name 3]** — Frontend — React Native & UX
  - **[Name 4]** — DevOps — Cloud Run, Redis, Twilio
  - **[Name 5]** — Research — User Research & Business

**Visual:** Clean headshots in a row. Minimal text. Professional.

**PRESENTER SAYS:**

> "Tim od pet inženjera. [Name 1] — product i strategija. [Name 2] — backend, AI agenti i orkestracija. [Name 3] — frontend, React Native. [Name 4] — infrastructure, Cloud Run i Twilio. [Name 5] — istraživanje i biznis model.
>
> Svi smo inženjeri. Svi kodiramo."

---

### SLIDE 12 — "Close — Back to Ana"

| | |
|---|---|
| **Duration** | 30 seconds |
| **Presenter** | Lead Presenter |
| **Grading criteria** | Delivery: engaging; Problem: clearly defined |

**Content on slide:**
- Return to the opening: same dark background, same image of Ana
- New text, larger:
  > *"Kada Anin stan sutra noć počne da gori — da li će moći da pozove pomoć?"*
- Below, after a beat:
  > *"Sa Medakom — može."*
- Bottom: Medak logo + tagline: **"Dva AI agenta. Jedan poziv. Jedan spašen život."**

**Visual:** Emotional bookend. Dark, minimal. Full circle from Slide 1.

**PRESENTER SAYS:**

> *[Slow, deliberate pace. This is the emotional close.]*
>
> "Dok smo mi ovde pričali ovih deset minuta — negde na svetu, neko gleda svoju kuću kako gori i ne može da pozove pomoć. Medak to menja.
>
> Medak ne menja hitne službe. Ne zahteva novu infrastrukturu. Ne zavisi od prevodilaca.
>
> Dva AI agenta. Jedan poziv. Jedan spašen život.
>
> Hvala."

*[End. Nod. Wait for applause. Do NOT rush into Q&A.]*

---

## 2. Presenter Assignment

### Recommended: 2 Presenters Only

Using more than 2 presenters in 10 minutes creates transitions that waste time and break flow. Two is optimal.

| Role | Person | Sections | Total Time |
|------|--------|----------|------------|
| **Lead Presenter** | Most confident speaker (best stage presence + Serbian delivery) | Slides 1-5 (intro+narration), 8-12 | ~470s (~78%) |
| **Tech Lead** | Most technical person (built the backend/agents) | Slides 6-7 | ~110s (~18%) |
| **Demo Operator** | Same as Tech Lead (or 3rd person if needed) | Operates phone during demo | 42s (silent) |

### Transition Points

There are only **two** presenter transitions in the entire pitch:

1. **After Slide 5 (demo narration) → Slide 6 (architecture):** Lead says "A sada — kako to radi ispod haube." Tech Lead steps forward.
2. **After Slide 7 (implementation challenge) → Slide 8 (user research):** Tech Lead says nothing — Lead simply takes over by speaking. Natural transition.

### Presenter Selection Criteria

**Lead Presenter should be:**
- Best Serbian pronunciation and delivery (pitch is in Serbian)
- Most comfortable with audience eye contact
- Can modulate pace — slow for emotional moments, energetic for solution
- Willing to rehearse 5+ times

**Tech Lead should be:**
- The person who actually built the orchestrator/agents
- Comfortable explaining technical concepts in simple terms
- Can speak confidently about implementation decisions

**Demo Operator should be:**
- Tech Lead doubles as demo operator (reduces transitions)
- Has rehearsed the demo 10+ times
- Has backup phone ready
- Knows the exact moment to press SOS (during Lead's "Gledajte")

### What the Other 3 Team Members Do During the Pitch

- Sit in the front row / team area
- Stand during Q&A to answer specialized questions
- One person manages slide advancement (click clicker)
- One person has the backup demo recording ready

---

## 3. Timing Table

### Master Timing (600 seconds total)

| # | Slide | Duration | Cumulative | Buffer | Can Cut? |
|---|-------|----------|------------|--------|----------|
| 1 | Hook — Meet Ana | 30s | 0:30 | — | ❌ Never cut |
| 2 | The Problem | 80s | 1:50 | 15s | ✂️ Cut Stefan story (-15s) |
| 3 | Why Existing Solutions Fail | 50s | 2:40 | 10s | ✂️ Cut "promeni infrastrukturu" paragraph (-10s) |
| 4 | Our Solution: Medak | 60s | 3:40 | — | ❌ Core content |
| 5 | LIVE DEMO | 90s | 5:10 | — | ❌ Never cut demo |
| — | *Transition to Tech Lead* | — | — | 3s | — |
| 6 | Architecture | 60s | 6:10 | — | ❌ Core content |
| 7 | Implementation Challenge | 50s | 7:00 | — | ❌ Grading criterion |
| — | *Transition back to Lead* | — | — | 2s | — |
| 8 | User Research | 50s | 7:50 | 10s | ✂️ Cut our survey section (-10s) |
| 9 | Business Model | 50s | 8:40 | — | ❌ Core content |
| 10 | Scalability | 30s | 9:10 | — | ❌ Already minimal |
| 11 | Team | 20s | 9:30 | — | ❌ Already minimal |
| 12 | Close | 30s | 10:00 | — | ❌ Never cut close |
| | **TOTAL** | **600s** | **10:00** | **35s available** | |

### Time Budget Summary

```
Total: 600s (10:00). Of which 35s is cuttable content (marked ✂️) if running over.
```

### If Running Over — Emergency Cuts

| Priority | What to Cut | Saves | How |
|----------|-------------|-------|-----|
| 1st | Stefan story in Slide 2 | 15s | Skip from "Ali problem je širi..." straight to "nijedna država..." |
| 2nd | "Promeni infrastrukturu" paragraph in Slide 3 | 10s | Go straight to punchline after competitive table |
| 3rd | Our survey results in Slide 8 | 10s | Use only published research, skip "Mi smo sproveli anketu..." |
| **TOTAL RECOVERABLE** | | **35s** | |

### If Running Under — Material to Expand

| Slide | Extra Material | Adds |
|-------|---------------|------|
| 2 | Add Jelena persona (deaf mother, injured child) | 15s |
| 6 | Explain cross-agent Q&A relay in more detail | 10s |
| 9 | Add grant funding path (Serbian Innovation Fund, Horizon Europe) | 10s |

### Rehearsal Protocol

1. **Solo read-through** — each presenter reads their sections aloud, time them
2. **Full run-through #1** — with slides, without demo — target 8:30 (leaves 90s for demo)
3. **Full run-through #2** — with slides AND demo — target 9:30
4. **Full run-through #3** — final dress rehearsal, someone times with stopwatch, strict 10:00 cutoff
5. **Film it** — watch back, check pacing, fix awkward transitions

---

## 4. Q&A Preparation

### Top 12 Likely Judge Questions + Prepared Answers

---

**Q1: "Da li je ovo mockup ili zaista radi?"**

> "Ovo je prava aplikacija sa pravim backendom — WebSocket, fazni prelazi, Gemini agenti, Twilio poziv. Demo koristi skriptirani scenario za pouzdanu prezentaciju, ali ista arhitektura procesira žive podatke u produkcijskom režimu. Jedino što je simulirano je 112 endpoint — jer zakonski ne smemo da zovemo pravu hitnu službu sa hakathona. Zamenite simulator pravim Twilio pozivom i sistem poziva pravi 112."

---

**Q2: "Šta ako AI halucinira?"**

> "To je upravo razlog zašto je confidence scoring deterministički, a ne LLM-baziran. Agent ne odlučuje kada ima 'dovoljno' informacija — formula računa. I Dispatch Agent ima eksplicitnu instrukciju: za svako polje koje je null u snapshotu, kaže 'ta informacija nije potvrđena.' Nikada ne izmišlja podatke. Ako kaže 'pacijent je pri svesti' — to znači da je User Agent eksplicitno potvrdio tu informaciju iz scene ili od korisnika."

---

**Q3: "Da li je ovo legalno? EU AI Act?"**

> "Svesni smo da bi Medak bio klasifikovan kao high-risk AI sistem po EU AI Actu — Aneks III, kategorija 5(d), AI u hitnim službama. To znači: obavezna conformity assessment, ljudski nadzor, transparentnost, dokumentacija. Procena troška usklađivanja je oko 100 hiljada evra.
>
> Za GDPR: PoC koristi us-central1 za development. Za produkciju, koristili bismo EU Vertex AI endpoint — Google Cloud eu-west region. Vertex AI je ISO 27001/27017/27018/27701 sertifikovan, sa EU data processingom po GDPR čl. 6(1)(d) — vitalni interesi. Ne čuvamo lične podatke posle poziva — streaming model, ne skladište.
>
> Ali — ključna stvar — Medak ne zamenjuje ljudsku odluku. Operater i dalje donosi sve odluke o slanju ekipe. Mi samo omogućavamo komunikaciju koja bez nas ne bi postojala. Alternativa je bukvalno — ništa."

---

**Q4: "Šta ako Gemini API padne?"**

> "Orchestrator ima 10-sekundni triage timeout. Ako User Agent ne prikupi dovoljno podataka u 10 sekundi, sistem poziva 112 sa onim što ima — jer je delimičan izveštaj bolji od nikakvog poziva. Za production, planiramo multi-model fallback: Gemini → lokalni model. Ali i sa samo Gemini-jem, Google-ov SLA za production API je 99.95% uptime."

---

**Q5: "Kako se ovo razlikuje od slanja SMS-a na 112?"**

> "Tri razlike. Prvo: SMS na 112 ne postoji u Srbiji, niti u većini Evrope. Drugo: čak i gde postoji, SMS je jednosmerna komunikacija — ne možete voditi dijalog. Treće, i najvažnije: Medak razume scenu. Kamera vidi požar, kolaps, saobraćajnu nesreću. Tekstualna poruka ne može da prenese ono što AI agent vidi. A operater dobija glasovni poziv sa strukturiranim izveštajem — ne sirovi tekst koji mora da tumači."

---

**Q6: "Koliko košta development do production-a?"**

> "Pilot u Srbiji: oko 75 hiljada evra — 6 meseci sa timom od 3 inženjera. To uključuje hardening, EU AI Act usklađivanje, i penetration testing. Infrastruktura za pilot: 55 dolara mesečno. Za nacionalni deployment — 580 dolara mesečno. Ovo je grant-fundable — Fond za inovacionu delatnost je već finansirao SignAvatar, aplikaciju za znakovni jezik na Srbijavozu."

---

**Q7: "Ko je vaša konkurencija?"**

> "U ovom prostoru — niko ne radi ono što mi radimo. AccesSOS u SAD-u je najbliža paralela — neprofitna aplikacija u Kaliforniji i Novom Meksiku sa 70 hiljada korisnika. Ali fundamentalno — šalju tekst, ne glas. Radi samo gde postoji text-to-911, a to je polovina SAD-a. DEC112 u EU je text-to-112 ali zahteva upgrade PSAP centara.
>
> Zanimljiv primer: Ukrajina je pre dve nedelje — usred rata — pokrenula video pozive ka 112 operaterima koji znaju znakovni jezik. To dokazuje koliko je ovaj problem hitan. Ali njihovo rešenje zahteva ljudske prevodioce — koji su skupi i ograničeni.
>
> Medak je jedini sistem koji kombinuje AI scene understanding, glasovni poziv i real-time Q&A relay — i jedini koji ne zahteva nikakvu promenu na strani hitne službe. I skalira se beskonačno, za 13 centi po pozivu."

---

**Q8: "Šta sa lažnim pozivima?"**

> "Confidence threshold sprečava preuranjene pozive. Potrebna je potvrđena lokacija PLUS tip hitnosti PLUS barem jedan klinički podatak da bi se uopšte uputio poziv. A na samom početku — korisnik mora da drži SOS dugme 1.5 sekundi, kao iPhone Emergency SOS. Slučajno aktiviranje je praktično nemoguće.
>
> Ali hajde da to stavimo u perspektivu: postojeći 112 sistemi već dobijaju milione lažnih poziva godišnje — od ljudi koji slučajno pozovu. Stopa lažnih poziva kod Medaka bi bila dramatično niža jer zahtevamo namerno aktiviranje i prikupljanje podataka pre poziva."

---

**Q9: "Koji je vaš tech stack?"**

> "Frontend: React Native / Expo. Backend: FastAPI, Python. State: Redis. AI: dva Gemini 2.0 Flash Live agenta. Telephony: Twilio VoIP. Infrastructure: Google Cloud Run. Orchestrator: deterministička finite state machine. Sve je stateless osim Redis sessiona — horizontalno se skalira bez problema."

---

**Q10: "Šta ako je korisnik u mračnoj sobi i kamera ne vidi ništa?"**

> "Orchestrator ima safety valve — 10-sekundni timeout. Ako User Agent ne može da prikupi vizuelne podatke, sistem prelazi na tekstualni input ili poziva 112 sa minimalnim podacima: lokacija iz GPS-a i korisnikov profil iz aplikacije. Delimičan izveštaj sa lokacijom je i dalje beskonačno bolji od nikakvog poziva. A lokacija je najvažniji podatak — nosi 35% confidence scora i dolazi automatski iz GPS-a."

---

**Q11: "Da li ste razgovarali sa pravim korisnicima?"**

> "Naše istraživanje se oslanja na EENA izveštaj iz 2025, AccesSOS globalnu studiju, i EUD analizu pristupačnosti. Pored toga, sproveli smo analizu potreba korisnika na osnovu dokumentovanih iskustava iz zajednice. 78% gluvih ispitanika u AccesSOS studiji kaže da nema pristup hitnim službama. Svaka arhitekturna odluka — kamera umesto tipkanja, deterministički scoring, glasovni poziv umesto teksta — proizilazi iz tih nalaza."

---

**Q12: "Zašto Google/Apple/Microsoft ovo već nisu napravili?"**

> "Zato što je ovo problem odgovornosti, ne tehnologije. Big Tech kompanije izbegavaju emergency services jer svaka greška je potencijalno smrtna i pravno rizična. Ali za startup — to je prednost. Mi smo dovoljno mali da budemo agilni, dovoljno fokusirani da budemo best-in-class, i dovoljno hrabri da uđemo u prostor gde giganti ne žele da idu. Plus — koristimo njihovu tehnologiju. Gemini nas pokreće. Mi ga primenjujemo tamo gde Google neće."

---

## 5. Visual Consistency Guide

### Color Scheme

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| **Primary** | Deep Navy | `#1A237E` | Headers, primary text, borders |
| **Accent** | Emergency Red | `#D32F2F` | SOS button, problem stats, ❌ icons |
| **Success** | Life Green | `#2E7D32` | ✅ icons, RESOLVED state, positive metrics |
| **Background** | Clean White | `#FFFFFF` | Default slide background |
| **Dark Background** | Near Black | `#121212` | Slides 1 and 12 only (emotional bookends) |
| **Secondary Text** | Warm Gray | `#616161` | Captions, sources, secondary info |
| **Google Blue** | Google Blue | `#4285F4` | Google technology badges/highlights |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Slide Title | **Google Sans** (or Inter/Poppins as fallback) | 36-44pt | Bold |
| Body Text | **Google Sans** (or Inter) | 20-24pt | Regular |
| Stats/Numbers | **Google Sans Display** (or Inter) | 64-80pt | Bold |
| Code/Technical | **JetBrains Mono** (or Fira Code) | 16-18pt | Regular |
| Captions/Sources | **Inter** | 14-16pt | Light |

### Logo Placement

```
┌─────────────────────────────────────────────────────────────┐
│                                                 [Medak Logo]│  ← Top right, every slide except 1 & 12
│                                                             │
│  [Slide Content]                                            │
│                                                             │
│                                                             │
│                                                             │
│  [GDG Badge]                              [Slide Number/12] │  ← Bottom left: GDG badge. Bottom right: page number.
└─────────────────────────────────────────────────────────────┘
```

- **Medak Logo:** Top right corner, ~40px height, on all slides except 1 and 12 (which are emotional/dark)
- **GDG Badge:** Small "Built at GDG Belgrade Hackathon 2026" badge, bottom left
- **Page numbers:** Bottom right, format: "6/12"
- **No other logos.** No sponsor logos, no tech logos cluttering the template.

### Slide Template Rules

1. **Maximum 6 bullet points per slide.** If you have more, you have too much.
2. **One idea per slide.** No split-focus slides.
3. **Stats are BIG.** When showing a number, make it 64-80pt and the largest thing on the slide.
4. **Diagrams over text.** Architecture, flow, comparison → always visual.
5. **Dark slides for emotion only.** Slides 1 and 12 use dark background for cinematic effect. Everything else is white.
6. **No animations** except slide transitions (simple fade or none). Zero flying text, zero build-ins. They waste time and break.
7. **Consistent margins.** 60px padding on all sides. Content never touches edges.
8. **Photos:** If using persona photos, use illustrations or stock that feel warm and human — not corporate.

### Slide Transition Style

- **Default:** Simple cut (no transition) — fastest, cleanest
- **Slides 1→2:** Fade (2s) — from dark to light, emotional shift
- **Slides 4→5:** Cut to demo layout (phone + dashboard visible)
- **Slides 7→8:** Simple cut (natural presenter transition point)
- **Slides 11→12:** Fade to dark — back to emotional close

### Demo Screen Setup

During the demo (Slide 5), the projector should show the **live dashboard**, not the slide:

```
┌────────────────────────────────────┬──────────────────────────┐
│  BACKEND LIVE LOG                  │  STATUS PANEL            │
│                                    │                          │
│  [timestamp] Session created       │  Phase: TRIAGE           │
│  [timestamp] set_emergency_type    │  Confidence: ███░░ 45%   │
│  [timestamp] confirm_location      │  Emergency: MEDICAL      │
│  [timestamp] Confidence → 0.80     │  Location: ✅            │
│  [timestamp] TRIAGE → LIVE_CALL    │  Conscious: ⬜           │
│  [timestamp] Dispatch: CONNECTED   │  Breathing: ⬜           │
│  [timestamp] 112: "Hitna služba"   │  Victims: ⬜             │
│  ...                               │                          │
│                                    │  🔴 LIVE — 112           │
│                                    │  ⏱ 00:22                 │
└────────────────────────────────────┴──────────────────────────┘
```

Colors for dashboard:
- Log text: `#E0E0E0` on `#121212` background (terminal feel)
- Phase indicator: Navy for TRIAGE, Yellow/Amber for LIVE_CALL, Green for RESOLVED
- Confidence bar: gradient from Red (0%) → Yellow (50%) → Green (100%)

---

## Appendix A: Grading Criteria Coverage Map

Every grading criterion is explicitly addressed in at least one slide:

### Problem
| Criterion | Where Addressed |
|-----------|----------------|
| Problem clearly defined? | Slides 1, 2 |
| Relevant to competition? | Slide 2 (accessibility + AI theme) |
| Real user research? | Slide 8 |
| Adapted based on research? | Slide 8 (research → architecture decisions) |
| Addressed identified problems? | Slides 3, 4 |
| International expansion potential? | Slide 10 |

### Technology
| Criterion | Where Addressed |
|-----------|----------------|
| Architecture + Google tech defined? | Slides 4, 6 |
| All components implemented? | Slide 5 (live demo) |
| Implementation problem + resolution? | Slide 7 |
| Actual use, not mockup? | Slide 5 (live demo) + post-demo narration |
| Scalable? | Slides 6, 10 |

### Business
| Criterion | Where Addressed |
|-----------|----------------|
| Target personae + market need? | Slides 1, 2 |
| Market research + competition? | Slide 3 |
| Monetization model + realistic revenue? | Slide 9 |
| Cost and resources for development? | Slide 9 (mentioned), Q&A Q6 (detailed) |
| Users vs buyers? | Slide 9 (first line: "Korisnici ≠ Kupci") |

### Delivery
| Criterion | Where Addressed |
|-----------|----------------|
| Visually consistent? | Visual Consistency Guide (Section 5) |
| All necessary info, not overcrowded? | 12 slides, one idea per slide |
| Pitch contains all necessary info? | Grading map above — all criteria covered |
| Engaging? | Slides 1, 5, 12 (emotional hook, live demo, emotional close) |
| Delivered in time? | Timing table (Section 3) with 35s buffer |

---

## Appendix B: Emergency Fallback — If Demo Fails

If the live demo crashes during the pitch:

1. **Stay calm.** Say: "Tehnika nas je izdala, ali pustićemo snimak demo-a." (That's why you have a backup.)
2. **Play the pre-recorded screen recording** (30-45s) showing the exact same flow.
3. **After video:** "Ovo što ste videli je snimak live demo-a koji smo uradili ranije danas. Ista aplikacija, isti backend, isti 38 sekundi."
4. **Continue to Slide 6** as if nothing happened.

**CRITICAL:** Record the demo backup BEFORE the presentation. Run it 3 times, save the cleanest recording.

---

## Appendix C: Pre-Presentation Checklist

### 30 Minutes Before

- [ ] Phone charged to 100%
- [ ] Backup phone charged and loaded with app
- [ ] Demo mode ON (`DEMO_MODE=true`)
- [ ] Backend running (verify with health check endpoint)
- [ ] WebSocket connection tested
- [ ] Dashboard open on projector laptop
- [ ] Slide deck loaded, presenter mode ready
- [ ] Clicker/remote tested
- [ ] Backup demo recording accessible (USB + cloud)
- [ ] Water bottle at podium

### 10 Minutes Before

- [ ] Run demo once silently — full SOS → RESOLVED flow
- [ ] Reset demo state (`POST /api/demo/reset`)
- [ ] Confirm phone screen is visible to judges (brightness max, font size check)
- [ ] Confirm projector shows dashboard correctly
- [ ] Lead Presenter and Tech Lead confirm positions

### 1 Minute Before

- [ ] Phone on Do Not Disturb
- [ ] App open, SOS screen ready
- [ ] Deep breath
- [ ] Slide 1 showing

---

*Last updated: 2026-03-29*
*Project: Medak — GDG Hackathon Belgrade*
