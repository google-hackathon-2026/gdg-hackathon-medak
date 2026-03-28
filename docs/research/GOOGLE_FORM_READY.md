# Google Form — Ready to Copy-Paste

> Copy each section below directly into Google Forms. Serbian is the primary language; English translations follow in parentheses where helpful.

---

## FORM TITLE

```
Da li možete da pozovete pomoć? — Anketa o pristupačnosti hitnih službi
(Can You Call for Help? — Emergency Accessibility Survey)
```

## FORM DESCRIPTION

```
Gradimo AI sistem koji pomaže gluvim osobama i osobama sa govorno-jezičkim poteškoćama da pozovu 112 u Srbiji. Vaše iskustvo je važno.

Anketa traje ~3 minuta. Anonimna je. Rezultati će biti korišćeni za razvoj prototipa na GDG hakatonu.

---

We're building an AI system that helps deaf and speech-impaired people call 112 in Serbia. Your experience matters.

~3 minutes. Anonymous. Results will be used to develop a prototype at a GDG hackathon.
```

---

## QUESTIONS

---

### Question 1 — About You / O Vama

**Type:** Multiple choice (single answer)

**Question text:**
```
Šta vas najbolje opisuje? / Which best describes you?
```

**Options:**
```
Gluva/nagluva osoba (Deaf/Hard of Hearing person)
Osoba sa govorno-jezičkim poteškoćama (Person with speech impairment)
Član porodice ili prijatelj gluve/nagluve osobe (Family member or friend)
Stručnjak/profesionalac (tumač, socijalni radnik, defektolog) (Professional — interpreter, social worker, etc.)
Drugo / Other
```

**Required:** Yes

---

### Question 2 — Country / Država

**Type:** Multiple choice (single answer)

**Question text:**
```
Gde živite? / Where do you live?
```

**Options:**
```
Srbija / Serbia
Bosna i Hercegovina / Bosnia and Herzegovina
Hrvatska / Croatia
Crna Gora / Montenegro
Drugo / Other
```

**Required:** Yes

---

### Question 3 — Age Range / Starosna grupa

**Type:** Multiple choice (single answer)

**Question text:**
```
Koliko imate godina? / How old are you?
```

**Options:**
```
Ispod 18 / Under 18
18–25
26–35
36–50
51–65
Preko 65 / Over 65
```

**Required:** Yes

---

### Question 4 — Emergency Experience / Iskustvo sa hitnim službama

**Type:** Multiple choice (single answer)

**Question text:**
```
Da li ste ikada imali potrebu da pozovete 112 ili drugu hitnu službu u Srbiji?
Have you ever needed to call 112 or another emergency service in Serbia?
```

**Options:**
```
Da / Yes
Ne / No
```

**Required:** Yes

---

### Question 5 — What Happened / Šta se desilo

**Type:** Multiple choice (single answer)

> **Conditional:** Show only if Q4 = "Da / Yes"

**Question text:**
```
Šta se desilo kada ste pokušali da dobijete hitnu pomoć?
What happened when you tried to get emergency help?
```

**Options:**
```
Pozvao/la sam sam/a i uspeo/la da komuniciram (I called myself and managed to communicate)
Neko drugi je pozvao umesto mene (Someone else called for me)
Nisam mogao/la uopšte da pozovem (I couldn't call at all)
Poslao/la sam SMS (I sent an SMS)
Koristio/la sam aplikaciju ili drugi način (I used an app or other method)
Drugo / Other
```

**Required:** Yes (if shown)

---

### Question 6 — Current Access Rating / Ocena trenutne pristupačnosti

**Type:** Linear scale

**Question text:**
```
Kako biste ocenili svoju mogućnost da pristupite broju 112 danas?
How would you rate your ability to access 112 today?
```

**Scale:**
```
1 = Potpuno nepristupačno / Completely inaccessible
5 = Potpuno pristupačno / Fully accessible
```

**Required:** Yes

---

### Question 7 — Communication Barriers / Komunikacione barijere

**Type:** Multiple choice (single answer)

**Question text:**
```
Da li ste ikada bili u situaciji da NISTE mogli da dobijete hitnu pomoć zbog komunikacionih barijera?
Have you ever been in a situation where you COULDN'T get emergency help because of communication barriers?
```

**Options:**
```
Da / Yes
Ne / No
Ne želim da odgovorim / Prefer not to say
```

**Required:** Yes

---

### Question 8 — AI App Interest / Zainteresovanost za AI aplikaciju

**Type:** Multiple choice (single answer)

**Question text:**
```
Kada bi AI aplikacija na vašem telefonu mogla da razgovara sa 112 u vaše ime u realnom vremenu — da li biste je koristili?
If an AI app on your phone could speak to 112 on your behalf in real-time, would you use it?
```

**Options:**
```
Svakako da / Definitely yes
Verovatno da / Probably yes
Nisam siguran/na / Not sure
Verovatno ne / Probably no
Svakako ne / Definitely no
```

**Required:** Yes

---

### Question 9 — Concerns / Brige

**Type:** Checkboxes (multiple answers)

**Question text:**
```
Koje biste brige imali u vezi sa takvim sistemom? (Možete izabrati više odgovora)
What concerns would you have about such a system? (Select all that apply)
```

**Options:**
```
Privatnost i zaštita podataka / Privacy and data protection
Tačnost prenosa poruke / Accuracy of message relay
Poverenje — da li će me hitna služba shvatiti ozbiljno? / Trust — will emergency services take me seriously?
Jezička podrška (srpski, znakovni jezik, manjinski jezici) / Language support
Cena korišćenja / Cost
Pristupačnost interfejsa / Interface accessibility
Nemam nikakve brige / No concerns
Drugo / Other
```

**Required:** Yes

---

### Question 10 — Current Method / Trenutni način kontaktiranja

**Type:** Checkboxes (multiple answers)

**Question text:**
```
Kako trenutno kontaktirate hitne službe? (Možete izabrati više odgovora)
How do you currently contact emergency services? (Select all that apply)
```

**Options:**
```
Glasovni poziv (sam/a ili uz pomoć) / Voice call (alone or with help)
SMS poruka / SMS message
Zamolim nekoga u blizini / Ask someone nearby
Koristim aplikaciju (npr. SOS za gluve) / Use an app (e.g., SOS for Deaf)
Ne znam kako da ih kontaktiram / I don't know how to contact them
Nikada nisam imao/la potrebu / Never needed to
Drugo / Other
```

**Required:** Yes

---

### Question 11 — Willingness to Test / Spremnost za testiranje

**Type:** Multiple choice (single answer)

**Question text:**
```
Da li biste bili spremni da testirate prototip ovakvog sistema?
Would you be willing to test a prototype of this system?
```

**Options:**
```
Da, i mogu ostaviti kontakt / Yes, and I can leave my contact info
Da, ali anonimno / Yes, but anonymously
Ne / No
```

**Required:** Yes

---

### Question 12 — Contact Info (conditional)

**Type:** Short answer (text)

> **Conditional:** Show only if Q11 = "Da, i mogu ostaviti kontakt"

**Question text:**
```
Ostavite vaš email ili broj telefona za kontakt. Koristićemo ga isključivo za pozivanje na testiranje.
Leave your email or phone number. We will only use it to invite you to test.
```

**Required:** No

---

### Question 13 — Additional Thoughts / Dodatne misli

**Type:** Paragraph (long text)

**Question text:**
```
Da li želite da podelite nešto što nismo pitali? Bilo kakvo iskustvo, predlog ili komentar je dobrodošao.
Is there anything else you'd like to share? Any experience, suggestion, or comment is welcome.
```

**Required:** No

---

## FORM SETTINGS

- **Collect emails:** OFF (anonymous)
- **Limit to 1 response:** OFF (allow shared devices)
- **Edit after submit:** ON
- **Show progress bar:** ON
- **Confirmation message:**

```
Hvala vam! 🙏 Vaši odgovori će nam pomoći da napravimo pristupačniji sistem za hitne situacije.

Thank you! Your answers will help us build a more accessible emergency system.
```

---

## SECTIONS (recommended Google Forms layout)

| Section | Questions | Title |
|---------|-----------|-------|
| 1 | Q1, Q2, Q3 | O vama / About You |
| 2 | Q4, Q5, Q6, Q7 | Vaše iskustvo / Your Experience |
| 3 | Q8, Q9 | AI rešenje / The AI Solution |
| 4 | Q10, Q11, Q12, Q13 | Sledeći koraci / Next Steps |

---

## DATA ANALYSIS NOTES

Questions designed for quantifiable outputs:
- **Q1** → Demographic segmentation (user type)
- **Q4 + Q5** → Emergency experience funnel
- **Q6** → Numeric accessibility score (mean, median, distribution)
- **Q7** → Binary barrier metric (% who faced barriers)
- **Q8** → Product-market fit signal (Likert scale → NPS-style analysis)
- **Q9** → Feature prioritization (ranked concerns by frequency)
- **Q10** → Current behavior baseline
- **Q11** → Early adopter pool size

**Key pitch metric:** If ≥60% answer Q8 as "Definitely" or "Probably yes", that's strong PMF signal.
