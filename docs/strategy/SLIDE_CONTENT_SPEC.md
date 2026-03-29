# Medak — Slide Deck Content Specification

> **Purpose:** Copy-paste-ready spec for building the Google Slides / PowerPoint deck.
> **Event:** GDG Belgrade "Build with AI" Hackathon 2026
> **Total slides:** 12 + 1 demo dashboard view
> **Time:** 10 minutes (600 seconds)
>
> **Anyone can build the deck from this document alone — no other files needed.**

---

## Global Design System

### Colors

| Name             | Hex       | Usage                                           |
|------------------|-----------|--------------------------------------------------|
| Deep Navy        | `#1A237E` | Slide titles, primary text, borders               |
| Emergency Red    | `#D32F2F` | SOS elements, problem stats, ❌ icons              |
| Life Green       | `#2E7D32` | ✅ icons, positive metrics, success states         |
| Clean White      | `#FFFFFF` | Default slide background                          |
| Near Black       | `#121212` | Slides 1 & 12 only (cinematic/emotional)          |
| Warm Gray        | `#616161` | Captions, sources, secondary info                 |
| Google Blue      | `#4285F4` | Google technology badges                          |

### Typography

| Element         | Font                                     | Size     | Weight  |
|-----------------|------------------------------------------|----------|---------|
| Slide Title     | Google Sans (fallback: Inter / Poppins)  | 36-44pt  | Bold    |
| Body Text       | Google Sans (fallback: Inter)            | 20-24pt  | Regular |
| Stats/Numbers   | Google Sans Display (fallback: Inter)    | 64-80pt  | Bold    |
| Code/Technical  | JetBrains Mono (fallback: Fira Code)     | 16-18pt  | Regular |
| Captions        | Inter                                     | 14-16pt  | Light   |

### Template Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                 [Medak Logo]│  ← 40px height, top-right
│                                                             │
│                                                             │
│              [SLIDE CONTENT AREA]                           │
│              60px padding all sides                         │
│                                                             │
│                                                             │
│  [GDG Badge]                              [Slide Number/12] │
└─────────────────────────────────────────────────────────────┘
```

- **Medak Logo:** Top-right corner on slides 2–11. **NOT** on slides 1 & 12.
- **GDG Badge:** Bottom-left, small text: "Built at GDG Belgrade Hackathon 2026"
- **Page numbers:** Bottom-right, format `6/12`
- **Margins:** 60px padding on all sides. Content never touches edges.

### Rules

- **Max 6 bullet points per slide.** Fewer is better.
- **One idea per slide.** No split focus.
- **Numbers are BIG:** 64-80pt, largest element on slide.
- **No animations.** No flying text, no build-ins. Simple fade transition between slides or none.
- **Dark background = emotion only** (slides 1 & 12). Everything else is white.
- **Photos:** Warm, human illustrations or stock. Not corporate.

---

## Slide-by-Slide Specification

---

### SLIDE 1 — "Meet Ana"

| Property | Value |
|----------|-------|
| **Duration** | 30 seconds |
| **Presenter** | Lead |
| **Background** | Near Black `#121212` |
| **Layout** | Centered, single column |
| **Transition IN** | None (first slide) |
| **Transition OUT** | Fade (2 seconds) to Slide 2 |

#### Content

**Main text** (centered, upper third of slide):
```
"Zamislite da ste gluvi.
 Vaš stan je u plamenu.
 Ne možete da pozovete 112."
```
- Font: Google Sans, 36pt, **Bold**, White `#FFFFFF`
- Line spacing: 1.5×
- Each sentence on its own line

**Visual element** (centered, lower half):
- Illustration or warm photo of a young woman alone in an apartment
- Style: Slightly muted/cinematic. NOT stock-photo-smiley. Think "alone, vulnerable, real."
- Size: ~400px tall, centered horizontally

**What is NOT on this slide:**
- ❌ No Medak logo
- ❌ No title bar
- ❌ No GDG badge
- ❌ No page number
- ❌ Nothing else. Just the sentence and the image. The room goes quiet.

#### Notes for slide builder
- This is the most important first impression. Absolute minimalism.
- The white text on dark background must have high contrast — test on a projector.
- If you can't find a good illustration, a single silhouette against a window works.
- Do NOT use a stock photo of someone smiling or posing. The mood is somber.

---

### SLIDE 2 — "The Problem"

| Property | Value |
|----------|-------|
| **Duration** | 80 seconds |
| **Presenter** | Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, three big numbers center, icons bottom |
| **Transition IN** | Fade from dark (Slide 1) |

#### Content

**Title** (top-left, navy):
```
112 je glasovni sistem.
Milioni ljudi nemaju glas.
```
- Font: Google Sans, 36pt, Bold, Navy `#1A237E`
- Two lines. Period at end of each.

**Three numbers** (centered row, equally spaced across middle of slide):

| Number | Label below it | Color |
|--------|---------------|-------|
| **466M** | people with disabling hearing loss worldwide (WHO) | Emergency Red `#D32F2F` |
| **84,000** | deaf and hard of hearing in Serbia | Emergency Red `#D32F2F` |
| **0** | countries offering full equivalent 112 access (EUD 2024) | Emergency Red `#D32F2F` |

- Number font: Google Sans Display, **80pt**, Bold, Red `#D32F2F`
- Label font: Inter, 16pt, Regular, Warm Gray `#616161`
- Labels are directly below each number, max 1 line

**Icons row** (bottom third, centered, small):

Four icons with labels in a horizontal row:
```
🧏 Deaf / Hard of hearing    🗣️ Speech impaired    🌍 Foreign tourists    🧠 Sudden speech loss
```
- Icon size: ~48px
- Label font: Inter, 14pt, Light, Warm Gray `#616161`
- These are secondary — don't let them compete with the big numbers

#### Notes for slide builder
- The three numbers ARE the slide. Make them massive and dominant.
- Keep a clean visual hierarchy: Title → Numbers → Icons (primary → secondary → tertiary)
- If it feels crowded, shrink the icons or remove their labels (just icons).
- "0" is the most dramatic number — consider making it slightly larger (96pt) or isolated.

---

### SLIDE 3 — "Why Existing Solutions Fail"

| Property | Value |
|----------|-------|
| **Duration** | 50 seconds |
| **Presenter** | Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, comparison table center, bold punchline bottom |

#### Content

**Title** (top-left, navy):
```
Zašto sadašnja rešenja ne rade
```
- Font: Google Sans, 40pt, Bold, Navy `#1A237E`

**Comparison table** (center of slide, 4 rows):

| Rešenje | Problem |
|---------|---------|
| SMS na 112 | ❌ Ne postoji u Srbiji. Ni u većini EU. |
| Ljudski prevodilac (relay) | ❌ $20-40 po pozivu. Nije 24/7. Deficit prevodilaca. |
| Video relay (znakovni jezik) | ❌ Ne radi za govorne invaliditete. Ne razume scenu. |
| Aplikacije (DEC112, eCall) | ❌ Samo tekst. Nema glasa za operatera. Nema dijaloga. |

- Table style: Clean, no heavy borders. Light gray horizontal dividers only.
- "Rešenje" column: Google Sans, 20pt, Bold, Navy `#1A237E`
- "Problem" column: Inter, 20pt, Regular, Dark text
- ❌ icons: Red `#D32F2F`
- Table width: ~80% of slide width, centered

**Punchline** (bottom of slide, centered, bold):
```
Svako prethodno rešenje pokušava da promeni hitnu službu.
Mi ne menjamo ništa.
```
- Font: Google Sans, 24pt, Bold, Navy `#1A237E`
- Second line ("Mi ne menjamo ništa.") can be slightly larger (28pt) or in Red `#D32F2F` for emphasis.

#### Notes for slide builder
- The punchline at the bottom is what the audience should remember. Make it visually distinct from the table.
- Consider a thin horizontal rule between the table and the punchline.
- Keep the table tight — no extra padding. It's a quick scan, not a study.

---

### SLIDE 4 — "Our Solution: Medak"

| Property | Value |
|----------|-------|
| **Duration** | 60 seconds |
| **Presenter** | Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, flow diagram center, tech badges + cost bottom |

#### Content

**Title** (top-left, navy):
```
Medak — Dva AI agenta. Jedan vidi. Drugi govori.
```
- Font: Google Sans, 36pt, Bold, Navy `#1A237E`

**Flow diagram** (center of slide, horizontal LEFT → RIGHT):

Three columns connected by arrows:

```
 ┌──────────────┐         ┌──────────────────┐         ┌──────────────────┐
 │  📱 Korisnik │  ────→  │   🤖 AI Agenti   │  ────→  │  📞 112 Operater │
 │              │         │                  │         │                  │
 │ Pritisne SOS │         │ User Agent       │         │ Prima glasovni   │
 │ Kamera + GPS │         │  (vidi scenu)    │         │   poziv          │
 │ Tipka odgov. │  ←────  │ Dispatch Agent   │  ←────  │ Pita pitanja     │
 │              │         │  (govori za 112) │         │ Šalje hitnu      │
 └──────────────┘         └──────────────────┘         └──────────────────┘
```

- Style: Rounded rectangles with subtle shadow. Navy `#1A237E` borders.
- Arrow style: Solid, with arrowheads, Navy or Gray
- Icons (📱 🤖 📞): Large, above each box
- Text inside boxes: Inter, 18pt, Regular
- The center box (AI Agenti) should be visually larger/emphasized — maybe a light navy background `#E8EAF6`

**Technology badges** (below the diagram, centered row):

Two badges/pills:
```
[Gemini 2.0 Flash Live ×2]    [Cloud Run]
```
- Badge style: Rounded pill shape, Google Blue `#4285F4` background, white text
- Font: Inter, 16pt, Bold, White

**Cost line** (bottom of slide):
```
Cena po pozivu: $0.13  ·  Ljudski relay: $20-40
```
- Font: Inter, 20pt, Regular
- "$0.13" in Green `#2E7D32`, Bold
- "$20-40" in Red `#D32F2F`, Bold

#### Notes for slide builder
- The flow diagram is the hero of this slide. Make it clean and readable from the back of the room.
- Don't overcomplicate the diagram. Three boxes, two-directional arrows, done.
- The arrows going LEFT (←) represent the Q&A relay (operater asks question → appears on phone).
- Tech badges should feel like official product labels, not clipart.

---

### SLIDE 5 — "Live Demo"

| Property | Value |
|----------|-------|
| **Duration** | 90 seconds (15s intro + 42s demo + 33s narration) |
| **Presenter** | Lead (intro + narration), Tech Lead (operates demo) |
| **Background** | Near Black `#121212` |
| **Layout** | Minimal — attention goes to phone + projector dashboard |

#### Content

**Title** (top-center, white):
```
Uživo
```
- Font: Google Sans, 44pt, Bold, White `#FFFFFF`

**Subtitle** (below title, small):
```
SOS → Analiza → Poziv 112 → Rešeno
```
- Font: Inter, 18pt, Light, Warm Gray `#616161`

**That's it on the slide.** The real action happens on:
1. **Phone** (on stand or held by Tech Lead) — the Medak app
2. **Projector/laptop** — switches to live dashboard (see Dashboard spec below)

**When to switch:** After the presenter says "Gledajte." — switch projector from slides to dashboard.

#### Dashboard View (on projector during demo)

Background: Near Black `#121212`

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

- **Left panel (70% width):** Scrolling log. Monospace font (JetBrains Mono, 16pt). Light gray `#E0E0E0` text on dark background. Terminal feel.
- **Right panel (30% width):** Status indicators.
  - "Phase" label: changes color → Navy for TRIAGE, Amber `#FF8F00` for LIVE_CALL, Green `#2E7D32` for RESOLVED
  - Confidence bar: gradient Red→Yellow→Green as it fills
  - Checkboxes: ⬜ unchecked → ✅ checked as data comes in
  - "🔴 LIVE" indicator: pulses red when 112 call is active
- Panel divider: 1px line, Warm Gray `#616161`

#### Notes for slide builder
- The slide itself is almost empty — by design. The demo IS the content.
- Build the Slide 5 in the deck as a placeholder. The real visual is the dashboard.
- Make sure the dashboard is pre-loaded and alt-tab ready.
- After demo ends (green screen "✓ Pomoć je na putu"), switch back to slide deck at Slide 6.

---

### SLIDE 6 — "Architecture"

| Property | Value |
|----------|-------|
| **Duration** | 60 seconds |
| **Presenter** | Tech Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, architecture diagram center, badges + note bottom |

#### Content

**Title** (top-left, navy):
```
Arhitektura
```
- Font: Google Sans, 40pt, Bold, Navy `#1A237E`

**Architecture diagram** (center of slide, takes up ~65% of vertical space):

```
                 📱 React Native App
                        │
                    WebSocket
                        │
                        ▼
              ┌─────────────────────┐
              │  FastAPI Backend     │ ← Cloud Run
              │  (Cloud Run)        │
              └────────┬────────────┘
                       │
                ┌──────┴──────┐
                │    Redis    │  ← EmergencySnapshot (state)
                └──────┬──────┘
                       │
              ┌────────┴────────┐
              │                 │
     ┌────────┴──────┐  ┌──────┴────────┐
     │  User Agent   │  │ Dispatch Agent│
     │  Gemini 2.0   │  │ Gemini 2.0    │
     │  Flash Live   │  │ Flash Live    │
     │  "Sees scene" │  │ "Speaks 112"  │
     └────────┬──────┘  └──────┬────────┘
              │                │
              │  Orchestrator  │
              │  (FSM + Score) │
              └────────┬───────┘
                       │
                  Twilio VoIP
                       │
                       ▼
                 📞 112 Operator
```

- Style: Clean boxes with rounded corners. Navy `#1A237E` borders.
- Google components highlighted: Give "Gemini 2.0 Flash Live" and "Cloud Run" labels a Google Blue `#4285F4` background pill/badge.
- Connecting lines: Gray `#616161`, 2px, with arrows showing data flow direction.
- Each box: White fill, navy border, Inter 16pt text inside.

**Scoring formula** (below diagram, left-aligned):
```
Confidence = Location (0.35) + Type (0.25) + Conscious (0.15) + Breathing (0.15) + Victims (0.10)
Threshold: 0.85
```
- Font: JetBrains Mono, 16pt, Navy `#1A237E`
- "0.85" in Bold, Red `#D32F2F`

**Bottom note** (centered):
```
Operater prima normalan glasovni poziv. Zero promena na PSAP strani.
```
- Font: Inter, 18pt, Italic, Warm Gray `#616161`

#### Notes for slide builder
- This is the most information-dense slide. Resist the urge to add more.
- The diagram should be readable from 5 meters away. If it's not, simplify.
- Use color sparingly — only Google Blue badges break the navy/gray monotone.
- DO NOT add extra boxes for "GPS", "Camera", etc. Keep it to the main components.
- The scoring formula is important — the Tech Lead will reference it verbally.

---

### SLIDE 7 — "Implementation Challenge"

| Property | Value |
|----------|-------|
| **Duration** | 50 seconds |
| **Presenter** | Tech Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, two panels side by side (before/after) |

#### Content

**Title** (top-left, navy):
```
Problem koji smo rešili: Confidence Racing
```
- Font: Google Sans, 36pt, Bold, Navy `#1A237E`

**Two side-by-side panels** (equal width, centered):

**LEFT PANEL — "BEFORE" (red theme):**
- Header: `PRE ❌` — Red `#D32F2F`, Bold, 24pt
- Border/accent: Red `#D32F2F` (thin left border or top border)
- Background: Very light red `#FFEBEE`
- Content (monospace):

```
T+0s:  "Medical emergency"
       → confidence 0.45

T+2s:  "Location confirmed"
       → confidence 0.85 ✓

T+2s:  → Dispatch triggered!

T+3s:  Operator: "Da li je pri svesti?"
       Agent: "...Ne znam još."
```

- Font: JetBrains Mono, 16pt
- "0.85 ✓" and "Dispatch triggered!" in Red Bold
- Last line ("Ne znam još.") in Red, Italic

**RIGHT PANEL — "AFTER" (green theme):**
- Header: `POSLE ✅` — Green `#2E7D32`, Bold, 24pt
- Border/accent: Green `#2E7D32`
- Background: Very light green `#E8F5E9`
- Content (monospace):

```
T+0s:  "Medical emergency"
       → confidence 0.45

T+2s:  "Location confirmed"
       → confidence 0.80

T+5s:  "Conscious: yes, Breathing: irregular"
       → confidence 1.00 ✓

T+5s:  → Dispatch triggered!

T+6s:  Operator: "Da li je pri svesti?"
       Agent: "Da, pri svesti, ali konfuzan."
```

- Font: JetBrains Mono, 16pt
- "1.00 ✓" and "Dispatch triggered!" in Green Bold
- Last line in Green, showing the correct answer

**Bottom punchline** (centered, below both panels):
```
Scoring je previše kritičan za LLM. Koristimo čistu aritmetiku.
```
- Font: Google Sans, 22pt, Bold, Navy `#1A237E`

#### Notes for slide builder
- The before/after contrast is everything. Make the RED panel feel wrong and the GREEN panel feel right.
- Use equal spacing. The two panels should be perfectly aligned.
- The monospace font (code-style) is intentional — this is a technical slide for a technical audience.
- Gap between panels: ~40px.
- The punchline at the bottom wraps up the story — make it visually separated (thin rule above it or extra whitespace).

---

### SLIDE 8 — "User Research"

| Property | Value |
|----------|-------|
| **Duration** | 50 seconds |
| **Presenter** | Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, two columns center, insight-to-decision mapping bottom |

#### Content

**Title** (top-left, navy):
```
Istraživanje korisnika
```
- Font: Google Sans, 40pt, Bold, Navy `#1A237E`

**Two columns** (upper half of content area):

**LEFT COLUMN — "Objavljeno istraživanje"**
- Column header: Google Sans, 22pt, Bold, Navy
- Three items, each with source:

```
• EENA 2025: "Deaf citizens report 112 as
  completely inaccessible"

• AccesSOS global survey: 78% of deaf respondents
  have no way to contact emergency services

• EUD 2024: Zero EU countries offer full
  equivalent 112 access
```

- Font: Inter, 18pt, Regular
- Source names (EENA, AccesSOS, EUD) in Bold
- Numbers (78%, Zero) in Red `#D32F2F`, Bold

**RIGHT COLUMN — "Naše istraživanje"**
- Column header: Google Sans, 22pt, Bold, Navy
- Content:

```
Google Form anketa · N=18

56%  ne može samostalno do 112
83%  bi koristilo AI relay
#1 briga: tačnost, ne privatnost
```

- "56%" and "83%" as large numbers: Google Sans Display, 36pt, Bold, Red `#D32F2F`
- Label text: Inter, 18pt, Regular
- "N=18" in Warm Gray `#616161`, Light

**Insight → Decision mapping** (bottom third):

Header: `Istraživanje → Arhitektura` (Inter, 18pt, Bold, Navy)

Two rows with arrow connector:

```
"Postojeće app traže kucanje u krizi"  →  Kamera umesto tipkanja
"Nepoverenje u AI za kritične odluke"   →  Deterministički scoring
```

- Left side (finding): Inter, 16pt, Italic, Warm Gray
- Arrow: `→` in Navy
- Right side (decision): Inter, 16pt, Bold, Navy

#### Notes for slide builder
- This slide has the most text of any slide. Fight the urge to add more.
- The key numbers (78%, 56%, 83%) should be the eye-catchers.
- The insight→decision mapping at the bottom connects research to architecture — this matters for grading.
- If it feels crowded, reduce the font size of the published research items to 16pt.
- Vertical divider between the two columns: thin gray line or just whitespace.

---

### SLIDE 9 — "Business Model"

| Property | Value |
|----------|-------|
| **Duration** | 50 seconds |
| **Presenter** | Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, two-column Users vs Buyers, cost comparison center, TAM/SAM/SOM bottom |

#### Content

**Title** (top-left, navy):
```
Korisnici ≠ Kupci
```
- Font: Google Sans, 40pt, Bold, Navy `#1A237E`
- The "≠" symbol should be prominent — this is the key insight.

**Two-column layout** (upper portion):

**LEFT — "Korisnici (koriste)"**
- Column header: Google Sans, 22pt, Bold, Red `#D32F2F`
- Icon: 👤 or person silhouette
- Bullets:

```
• 52M gluvih/nagluvih u EU
• Niska kupovna moć
• Ne biraju rešenje
```
- Font: Inter, 18pt, Regular

**RIGHT — "Kupci (plaćaju)"**
- Column header: Google Sans, 22pt, Bold, Green `#2E7D32`
- Icon: 🏛️ or government building
- Bullets:

```
• Vlade (B2G model)
• EECC čl. 109, rok jun 2027
• Budžet: €200-500K/god po državi
```
- Font: Inter, 18pt, Regular
- "jun 2027" in Bold, Red — it's a deadline.

**Center divider:** Arrow graphic showing `Medak` bridges Users → Buyers. Simple arrow with "Medak" label on it.

**Cost comparison box** (center of slide):

| | Medak (AI) | Ljudski relay |
|---|---|---|
| Cena po pozivu | **$0.13** | **$20-40** |
| Dostupnost | 24/7, instant | Ograničeno |
| Skalabilnost | Neograničena | Ograničena |
| Jezici | Bilo koji | Po jeziku |

- Table style: Clean, alternating row background (white / very light gray `#F5F5F5`)
- "Medak" column numbers: Green `#2E7D32`, Bold
- "Ljudski relay" column numbers: Red `#D32F2F`, Bold
- Table border: Light gray, thin

**TAM/SAM/SOM** (bottom of slide, compact):

Three nested rectangles (largest to smallest, left to right or concentric):
```
TAM: €50-100M/year    SAM: €10-20M/year    SOM (Y1-2): €5-8M ARR
```
- TAM rectangle: Light navy background `#E8EAF6`, largest
- SAM rectangle: Medium navy `#C5CAE9`, medium
- SOM rectangle: Navy `#1A237E` with white text, smallest
- Labels: Inter, 16pt, Bold

#### Notes for slide builder
- This is the densest slide alongside Slide 8. Prioritize visual hierarchy.
- The "≠" in the title is the hook — the whole slide explains why.
- The cost comparison box should POP. Consider giving it a subtle border or shadow.
- TAM/SAM/SOM can be small — judges know what these are, they just need to see the numbers.
- If it feels crowded, shrink TAM/SAM/SOM to a single line of text instead of rectangles.

---

### SLIDE 10 — "Scalability & Expansion"

| Property | Value |
|----------|-------|
| **Duration** | 30 seconds |
| **Presenter** | Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, Europe map left, expansion bullets right |

#### Content

**Title** (top-left, navy):
```
Skalabilnost
```
- Font: Google Sans, 40pt, Bold, Navy `#1A237E`

**Europe map** (left side, ~55% width):
- Simple, clean map of Europe (outline style or flat design)
- Three color tiers highlighted:

| Tier | Countries | Color | Label |
|------|-----------|-------|-------|
| 🟢 Year 1 | Serbia | Green `#2E7D32` (filled) | "Godina 1: Srbija (pilot)" |
| 🟡 Year 2-3 | Croatia, Slovenia, Estonia (3-5 countries) | Amber `#FF8F00` (filled) | "Godina 2-3: 3-5 EU" |
| 🔵 Year 3-5 | Rest of EU (15+ countries) | Light Navy `#C5CAE9` (filled) | "Godina 3-5: 15+ EU" |

- Non-target countries: Light gray `#EEEEEE`
- Legend: Small, bottom-left of map area

**Three expansion dimensions** (right side, ~40% width):

```
🌐 Jezici
   Gemini: 40+ jezika, zero retraining

🗺️ Geografija
   27 EU država, rok 2027
   Postojeća 112 infrastruktura

💰 Troškovi
   Cloud Run auto-scaling
   Pilot: $55/mo
   Nacionalno: $580/mo
```

- Dimension headers: Google Sans, 20pt, Bold, Navy
- Body text: Inter, 18pt, Regular
- "$55/mo" and "$580/mo" in Green `#2E7D32`, Bold

**Bottom line** (full width, centered):
```
180M turista godišnje u EU — Medak nije samo pristupačnost, već univerzalni komunikacioni most.
```
- Font: Inter, 18pt, Italic, Warm Gray `#616161`

#### Notes for slide builder
- The Europe map is the visual anchor. Don't use a photo — use a clean vector/flat map.
- Serbia should be clearly highlighted (maybe with a pin/marker icon).
- Keep the right-side bullets tight — the presenter only has 30 seconds.
- The tourist angle (bottom line) is a bonus insight, not the main point.
- If you can't get a good map quickly, use three horizontally stacked bars showing the timeline instead.

---

### SLIDE 11 — "Team"

| Property | Value |
|----------|-------|
| **Duration** | 20 seconds |
| **Presenter** | Lead |
| **Background** | Clean White `#FFFFFF` |
| **Layout** | Title top, five team member cards in a row |

#### Content

**Title** (top-left, navy):
```
Tim
```
- Font: Google Sans, 40pt, Bold, Navy `#1A237E`

**Five team member cards** (centered row, equally spaced):

Each card:
```
┌──────────────┐
│              │
│   [Photo]    │   ← Circular headshot, ~120px diameter
│              │
│   [Name]     │   ← Google Sans, 20pt, Bold, Navy
│   [Role]     │   ← Inter, 16pt, Regular, Warm Gray
│   [Skill]    │   ← Inter, 14pt, Light, Warm Gray
│              │
└──────────────┘
```

**Team members** (fill in actual names — template below):

| Position | Name | Role | Skill line |
|----------|------|------|------------|
| 1 | [Name 1] | Lead / Pitch | Product & Strategy |
| 2 | [Name 2] | Backend | AI Agents & Orchestration |
| 3 | [Name 3] | Frontend | React Native & UX |
| 4 | [Name 4] | DevOps | Cloud Run, Redis, Twilio |
| 5 | [Name 5] | Research | User Research & Business |

**Bottom tagline** (centered):
```
Svi smo inženjeri. Svi kodiramo.
```
- Font: Google Sans, 22pt, Bold, Navy `#1A237E`

#### Notes for slide builder
- Use real photos if available. Otherwise, illustrated avatars in a consistent style.
- Photos should be circular with a thin navy border.
- All five cards should be identical in size and spacing.
- This is the fastest slide (20s) — keep it dead simple.
- The tagline at the bottom is important — it shows this is a technical team, not a business-pitch team.
- No LinkedIn icons, no email addresses, no QR codes. Just names and roles.

---

### SLIDE 12 — "Close — Back to Ana"

| Property | Value |
|----------|-------|
| **Duration** | 30 seconds |
| **Presenter** | Lead |
| **Background** | Near Black `#121212` |
| **Layout** | Centered, single column — mirrors Slide 1 |
| **Transition IN** | Fade to dark (2 seconds) from Slide 11 |

#### Content

**Main text** (centered, upper third):
```
Kada Anin stan sutra noć počne da gori —
da li će moći da pozove pomoć?
```
- Font: Google Sans, 32pt, Regular, White `#FFFFFF`
- Two lines. Reflective, questioning tone.

**Answer** (appears below, after a visual beat — or on click):
```
Sa Medakom — može.
```
- Font: Google Sans, 40pt, **Bold**, White `#FFFFFF`
- Slightly larger than the question above. This is the answer.

**Visual element** (same image from Slide 1):
- Same illustration/photo of Ana — but this time, she's not alone. Consider a subtle change: phone in hand, or a green glow, or simply the same image with a warmer tone.
- If you can't modify the image, reuse it exactly. The repetition IS the point.

**Tagline + Logo** (bottom center):

```
Medak
Dva AI agenta. Jedan poziv. Jedan spašen život.
```

- "Medak" — Google Sans, 28pt, Bold, White
- Tagline — Inter, 18pt, Regular, Warm Gray `#9E9E9E`
- Medak logo above or beside the text (if available)

**What is NOT on this slide:**
- ❌ No GDG badge
- ❌ No page number
- ❌ No "Thank you" or "Questions?" text — the presenter says "Hvala" verbally.

#### Notes for slide builder
- This slide mirrors Slide 1. Same dark background, same image. Full circle.
- The emotional impact comes from the callback — the audience recognizes Ana.
- "Sa Medakom — može." is the most important line in the entire deck. Make it land.
- Consider a slight animation: the question appears first, then "Sa Medakom — može." fades in after 2-3 seconds. This is the ONE exception to the "no animations" rule.
- Do NOT add "Questions?" or "Q&A" — the presenter handles the transition verbally.
- Let the slide breathe. White space (dark space?) is your friend.

---

## Appendix: Slide Summary Checklist

Use this to verify the completed deck:

| # | Title | Background | Key Visual | Status |
|---|-------|------------|------------|--------|
| 1 | (no title — quote only) | Dark `#121212` | Ana illustration + white text | ☐ |
| 2 | "112 je glasovni sistem..." | White | Three BIG red numbers | ☐ |
| 3 | "Zašto sadašnja rešenja ne rade" | White | Comparison table + punchline | ☐ |
| 4 | "Medak — Dva AI agenta..." | White | Flow diagram (3 boxes + arrows) | ☐ |
| 5 | "Uživo" | Dark `#121212` | Minimal (dashboard takes over) | ☐ |
| 6 | "Arhitektura" | White | Architecture diagram + scoring formula | ☐ |
| 7 | "Confidence Racing" | White | Before/After panels (red vs green) | ☐ |
| 8 | "Istraživanje korisnika" | White | Two research columns + insight mapping | ☐ |
| 9 | "Korisnici ≠ Kupci" | White | Users vs Buyers + cost table + TAM | ☐ |
| 10 | "Skalabilnost" | White | Europe map + 3 expansion dimensions | ☐ |
| 11 | "Tim" | White | 5 headshots in a row | ☐ |
| 12 | (Ana reprise) | Dark `#121212` | Same Ana image + tagline | ☐ |
| — | Dashboard (demo) | Dark `#121212` | Live log + status panel | ☐ |

**Total: 12 slides + 1 dashboard view.**

---

*Last updated: 2026-03-29*
*Project: Medak — GDG Hackathon Belgrade*
