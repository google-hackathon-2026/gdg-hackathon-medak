# Medak — Extended Q&A Preparation

> **Purpose:** Hard questions the original Q&A (PITCH_SCRIPT_10MIN.md §4) doesn't cover.
> **Context:** These are the questions a skeptical, technically-savvy judge would ask to probe weaknesses. Every answer is grounded in what the PoC actually does — no hand-waving.
> **Format:** Each question has Serbian (SR) and English (EN) prepared answers.

---

## Quick Reference: What the PoC Actually Does

Before answering anything, remember the system as built:

- **Flow:** SOS button (1.5s hold) → Gemini User Agent observes scene → fills `EmergencySnapshot` in Redis → Dispatch Agent calls 112 via Twilio → operator gets a normal voice call → Q&A relay back to user's screen
- **Demo mode:** Scripted scenario for presentation reliability. Production mode connects real Gemini Live to camera feed. Same architecture, same tools, same Redis state — only input source differs.
- **Cost per call:** $0.13 (Gemini API + Twilio)
- **Languages:** Serbian (demo) + English (production mode)
- **PSAP cooperation:** None. Operator receives a standard voice call. No integration required.
- **Real user testing:** None yet. Evidence base is published research (EENA 2025, AccesSOS, EUD 2024, WHO) + qualitative survey (N=18)

---

## Q13: "Your demo was scripted. Was the AI actually processing camera input?"

### SR

> "Da, demo koristi skriptirani scenario — i kažemo to otvoreno u prezentaciji. To je standardna praksa za live demo na takmičenju: ne možete rizikovati da vam prezentacija propadne zbog lošeg osvetljenja ili ugla kamere.
>
> Ali arhitektura je identična. Isti WebSocket, isti fazni prelazi, isti Redis snapshot, isti Gemini agenti, isti Twilio poziv. Jedina razlika: u demo modu, User Agent čita skriptirane podatke umesto da procesira kameru uživo. Zameni input source i sve ostalo radi isto.
>
> Ako želite, možemo pokrenuti produkcijski mod odmah — sa pravom kamerom. To je rizičnije za prezentaciju, ali pokazuje da sistem zaista radi."

### EN

> "Yes, the demo uses a scripted scenario — and we say so openly in the presentation. That's standard practice for a live competition demo: you can't risk your presentation failing because of bad lighting or camera angle.
>
> But the architecture is identical. Same WebSocket, same phase transitions, same Redis snapshot, same Gemini agents, same Twilio call. The only difference: in demo mode, the User Agent reads scripted data instead of processing a live camera feed. Swap the input source and everything else works the same.
>
> If you'd like, we can run production mode right now — with the real camera. It's riskier for presentation, but it proves the system actually works."

### 🎯 Delivery Notes
- Say "we say so openly" — preempts the accusation of hiding it
- The offer to run production mode live is a power move. Only make this offer if the demo went well and you're confident in the environment (lighting, scene setup)

---

## Q14: "N=18 is not statistically significant. How can you draw conclusions?"

### SR

> "Ispravno — i ne tvrdimo statističku značajnost. Naša primarna dokazna baza su objavljene studije: EENA 2025 izveštaj koji pokriva celu EU, AccesSOS globalna anketa sa hiljadama ispitanika, EUD analiza iz 2024, i WHO podaci. Te studije potvrđuju da je problem realan i masivan.
>
> Naše istraživanje sa 18 ispitanika je kvalitativna potvrda — razgovori sa zajednicom gluvih, osobama sa govornim poteškoćama i njihovim porodicama. Cilj nije bio statistička validacija — cilj je bio razumevanje potreba korisnika i validacija arhitekturnih odluka. Na primer, nalaz da je primarna briga tačnost a ne privatnost je direktno oblikovao naš deterministički scoring.
>
> Za kliničku validaciju pre deploymenta — da, biće potrebna veća studija. Ali za hackathon prototip, kombinacija objavljenog istraživanja i kvalitativnih uvida je solidan temelj."

### EN

> "Correct — and we don't claim statistical significance. Our primary evidence base is published research: EENA 2025 report covering the entire EU, AccesSOS global survey with thousands of respondents, EUD 2024 analysis, and WHO data. Those studies confirm the problem is real and massive.
>
> Our survey with 18 respondents is qualitative confirmation — conversations with the deaf community, people with speech impairments, and their families. The goal wasn't statistical validation — it was understanding user needs and validating architectural decisions. For example, the finding that the primary concern is accuracy rather than privacy directly shaped our deterministic scoring approach.
>
> For clinical validation before deployment — yes, a larger study would be needed. But for a hackathon prototype, combining published research with qualitative insights is a solid foundation."

### 🎯 Delivery Notes
- Never say "it's just a hackathon" — frame it as "appropriate methodology for this stage"
- Cite specific studies by name to show you've done the homework

---

## Q15: "What happens when the AI sends emergency services to a wrong address?"

### SR

> "Lokacija je hardverski podatak, ne AI procena. GPS koordinate dolaze direktno sa telefona — isti mehanizam koji koristi Google Maps ili Uber. AI ne pogađa adresu.
>
> U confidence scoring sistemu, lokacija nosi najveći težinski koeficijent — 0.35 od ukupnog 1.0. Bez potvrđene lokacije, matematički je nemoguće preći threshold od 0.85 koji je potreban za aktiviranje poziva. Sistem bukvalno neće pozvati 112 bez lokacije.
>
> Ako korisnik unese tekstualnu adresu koja se razlikuje od GPS koordinata, GPS pobeđuje — jer je hardver pouzdaniji od teksta u panici. Dispatch Agent prenosi operateru oba podatka: 'GPS koordinate pokazuju Bulevar Kralja Aleksandra 73, korisnik navodi Bulevar Kralja Aleksandra 37' — i operater odlučuje.
>
> Ali ključna stvar: ovo nije problem specifičan za Medak. Svaki poziv na 112 sa mobilnog telefona koristi istu GPS lokaciju. Mi samo dodajemo još jedan sloj verifikacije."

### EN

> "Location is a hardware data point, not an AI guess. GPS coordinates come directly from the phone — the same mechanism Google Maps or Uber uses. The AI doesn't guess the address.
>
> In the confidence scoring system, location carries the highest weight — 0.35 out of 1.0. Without confirmed location, it's mathematically impossible to cross the 0.85 threshold needed to trigger the call. The system literally won't call 112 without location.
>
> If the user enters a text address that differs from GPS coordinates, GPS wins — because hardware is more reliable than text typed in a panic. The Dispatch Agent communicates both to the operator: 'GPS coordinates show Bulevar Kralja Aleksandra 73, user states Bulevar Kralja Aleksandra 37' — and the operator decides.
>
> But the key point: this isn't a Medak-specific problem. Every mobile 112 call uses the same GPS location. We just add an extra verification layer."

### 🎯 Delivery Notes
- Redirect to the fact that this is a universal problem, not a Medak weakness
- Mentioning the specific weight (0.35) shows you've thought about it quantitatively

---

## Q16: "Has any 112 center in Serbia actually agreed to receive AI calls?"

### SR

> "Ne još — i to je namerno deo dizajna. Medak ne zahteva saradnju sa 112 centrom. Operater prima normalan glasovni poziv — ne zna i ne mora da zna da je na drugoj strani AI agent. To je kao da vas prijatelj zove u vaše ime.
>
> Za pilot, planiramo partnerstvo sa MUP-om — Ministarstvom unutrašnjih poslova — verovatno kroz Fond za inovacionu delatnost ili EU grant. Fond je već finansirao sličan accessibility projekat — SignAvatar, aplikaciju za znakovni jezik na Srbijavozu. Ciklus je šest meseci.
>
> Za širi EU deployment, strategija je partnerstvo sa postojećim provajderima hitnih službi koji već imaju vladine ugovore. Mi obezbeđujemo tehnološki sloj, oni obezbeđuju distribuciju i regulatorne odnose.
>
> Ali za prototip — i to je lepota ovog pristupa — ne moramo da čekamo ničiju dozvolu da testiramo. Sistem funkcioniše sa bilo kojim telefonskim brojem."

### EN

> "Not yet — and that's intentionally part of the design. Medak doesn't require 112 center cooperation. The operator receives a normal voice call — they don't know and don't need to know that an AI agent is on the other end. It's like having a friend call on your behalf.
>
> For a pilot, we plan to partner with MUP — the Serbian Ministry of Interior — likely through the Innovation Fund or an EU grant. The Fund has already financed SignAvatar, an AI sign language app on Serbian Railways — direct precedent for accessibility and AI. The cycle is six months.
>
> For broader EU deployment, the strategy is partnering with existing emergency service providers who already have government contracts. We provide the technology layer, they provide distribution and regulatory relationships.
>
> But for the prototype — and this is the beauty of this approach — we don't need anyone's permission to test. The system works with any phone number."

### 🎯 Delivery Notes
- "Ne zahteva saradnju" is the key insight — reframe from weakness to design strength
- Mentioning SignAvatar shows you know the funding landscape — and it's a stronger precedent than a generic reference

---

## Q17: "What about false positives — TV showing a disaster movie, child playing?"

### SR

> "Tri nivoa zaštite. Prvo: SOS dugme zahteva 1.5 sekunde namernog držanja — isto kao iPhone Emergency SOS. Nemoguće je aktivirati slučajno.
>
> Drugo: za vizualne false positive kao TV koji prikazuje katastrofu — produkcijska verzija bi korelirala više izvora: video, audio, akcelerometar. Scena katastrofe na TV-u bez odgovarajuće audio panike, alarma za dim, ili fizičkog pokreta korisnika — to se flaguje kao nizak confidence.
>
> Treće, i najvažnije: ekonomija false positive-a. Lažan poziv košta $0.13 i operaterovo vreme. Propušten pravi poziv košta ljudski život. U svakom medicinskom sistemu — od mamografije do EKG-a — kalibrirate prema tome gde je veća šteta. Ovde je odgovor jasan: bolje tri lažna poziva nego jedan propušten pravi.
>
> A usput — postojeći 112 sistemi već primaju milione lažnih poziva godišnje. Od ljudi. Medak bi imao dramatično nižu stopu jer zahteva namerno aktiviranje i prikupljanje podataka pre poziva."

### EN

> "Three levels of protection. First: the SOS button requires a 1.5-second deliberate hold — same as iPhone Emergency SOS. Accidental activation is virtually impossible.
>
> Second: for visual false positives like a TV showing a disaster movie — the production version would correlate multiple sources: video, audio, accelerometer. A disaster scene on TV with no matching audio panic, no smoke alarm, no physical user movement — that gets flagged as low confidence.
>
> Third, and most important: the economics of false positives. A false call costs $0.13 and an operator's time. A missed real call costs a human life. In every medical system — from mammography to EKG — you calibrate toward where the greater harm lies. Here the answer is clear: three false calls are better than one missed real one.
>
> By the way — existing 112 systems already receive millions of false calls per year. From humans. Medak would have a dramatically lower rate because it requires deliberate activation and data collection before calling."

### 🎯 Delivery Notes
- The "economics of false positives" argument is devastating — use it
- The comparison to existing false call rates neutralizes the concern entirely

---

## Q18: "You claim 38 seconds. What about extended Q&A? Real time?"

### SR

> "38 sekundi je od SOS dugmeta do prve potvrde dispečera sa strukturiranim izveštajem. To je mera za 'koliko brzo operater dobija kritične informacije.'
>
> Realni poziv sa dodatnim pitanjima bi trajao 2 do 5 minuta ukupno. Ali kritično poboljšanje u odnosu na sadašnje alternative: sistem počinje da radi ODMAH.
>
> Ljudski relay servis za znakovni jezik ima prosečno vreme čekanja od 3 do 4 minuta pre nego što uopšte počne razmena informacija. Dakle: sa Medakom, operater već ima strukturiran izveštaj u 38 sekundi. Sa human relay-em, tek posle 3 minuta neko podigne slušalicu — i onda kreće prikupljanje informacija.
>
> Čak i ako Medak poziv traje 5 minuta ukupno — i dalje je brži od alternative jer nema čekanja na početku."

### EN

> "38 seconds is from the SOS button to the first dispatcher confirmation with the structured brief. It's a measure of 'how fast the operator gets critical information.'
>
> A real call with follow-up questions would take 2 to 5 minutes total. But the critical improvement over current alternatives: the system starts working IMMEDIATELY.
>
> A human sign language relay service has a 3 to 4 minute average pickup time before any information exchange even begins. So: with Medak, the operator already has a structured report in 38 seconds. With human relay, it takes 3 minutes just for someone to pick up — and then information gathering starts.
>
> Even if a Medak call takes 5 minutes total — it's still faster than the alternative because there's no waiting at the start."

### 🎯 Delivery Notes
- Reframe from absolute time to relative improvement
- The "3-4 minute pickup time" stat is the killer comparison
- **Bonus medical framing:** A peer-reviewed study published January 2026 (Johansen et al., PMC) shows cardiac arrest survival decreases **5-12% per minute** without treatment. A 5-minute earlier call improves survival from 47.7% to **68.6%**. For a deaf person who currently can't call at all — Medak doesn't just improve timing, it **restores** the survival probability they never had access to.

---

## Q19: "Respondent R18 says 'open source it.' Your model is proprietary B2G. How do you reconcile?"

### SR

> "Odlično pitanje — i ne vidimo to kao kontradikciju. Core relay protokol bi mogao da bude open-source kao referentna implementacija. Transparentnost je važna za poverenje, posebno u sistemu koji se bavi hitnim situacijama.
>
> Prihod dolazi od managed servisa: SLA garancije, sertifikacija usklađenosti sa regulativom, 24/7 monitoring, podrška za više jezika, upravljanje vladnim ugovorima. To je isti model kao Red Hat, GitLab ili Elastic — open-source jezgro, komercijalni enterprise sloj.
>
> Vlada neće sama hostovati AI agente za hitne pozive. Žele SLA od 99.99%, ISO sertifikaciju, podršku kada nešto ne radi u 3 ujutru. To je naš proizvod — pouzdanost i usklađenost, ne samo kod."

### EN

> "Excellent question — and we don't see it as a contradiction. The core relay protocol could be open-sourced as a reference implementation. Transparency matters for trust, especially in a system dealing with emergencies.
>
> Revenue comes from the managed service: SLA guarantees, regulatory compliance certification, 24/7 monitoring, multi-language support, government contract management. It's the same model as Red Hat, GitLab, or Elastic — open-source core, commercial enterprise layer.
>
> A government won't self-host AI agents for emergency calls. They want 99.99% SLA, ISO certification, support when something breaks at 3 AM. That's our product — reliability and compliance, not just code."

### 🎯 Delivery Notes
- "Pouzdanost i usklađenost, ne samo kod" — memorize this line

---

## Q20: "You're comparing $0.13 API cost to $20-40 full human relay cost. Isn't that apples to oranges?"

### SR

> "Fer primedba. $0.13 je čist API trošak — Gemini plus Twilio. Produkcijski Medak bi imao monitoring, usklađenost sa regulativom, podršku, infrastrukturu.
>
> Realniji all-in trošak: $1 do $3 po pozivu. I dalje 10 do 20 puta jeftiniji od ljudskog relay-a.
>
> Ali pravi argument nije samo cena — skalabilnost. Ljudski relay u 3 ujutru zahteva da platite noćnu smenu prevodilaca, bez obzira da li neko pozove ili ne. Sa Medakom: nema poziva, nema troška. Sto poziva odjednom? Cloud Run skalira automatski. Ljudski relay — morate da zaposlite 100 prevodilaca.
>
> I jezici: svaki novi jezik kod ljudskog relay-a znači novo zapošljavanje. Gemini nativno podržava 40+ jezika bez ikakvih dodatnih troškova."

### EN

> "Fair point. $0.13 is the pure API cost — Gemini plus Twilio. A production Medak would have monitoring, regulatory compliance, support, infrastructure.
>
> Realistic all-in cost: $1 to $3 per call. Still 10 to 20 times cheaper than human relay.
>
> But the real argument isn't just cost — it's scalability. Human relay at 3 AM requires paying overnight interpreter shifts, regardless of whether anyone calls or not. With Medak: no calls, no cost. A hundred calls at once? Cloud Run auto-scales. Human relay — you'd need to hire 100 interpreters.
>
> And languages: every new language with human relay means new hires. Gemini natively supports 40+ languages with zero additional cost."

### 🎯 Delivery Notes
- Acknowledge the valid criticism immediately — "Fer primedba" — then pivot
- The scalability argument is stronger than the cost argument

---

## Q21: "EECC deadline is June 2027. You're 5 people at a hackathon. Government procurement takes 18-24 months."

### SR

> "Za Srbiju — ne treba nam vladina nabavka. Ali postoji direktan regulatorni podsticaj koji mnogi ne znaju: Evropska komisija je u svom izveštaju o Srbiji za 2025. godinu eksplicitno preporučila da Srbija 'uskladi zakonodavstvo o elektronskim komunikacijama... sa EU regulatornim okvirom, uključujući EU Kodeks elektronskih komunikacija.' To je EECC. EECC uključuje člen 109 — pristupačnost 112 za gluva lica. Dakle, Medak nije samo dobra ideja za Srbiju — to je demonstracija EU usaglašenosti u okviru pristupnih pregovora, Klaster 3.
>
> Za finansiranje: Fond za inovacionu delatnost je već finansirao SignAvatar, aplikaciju za znakovni jezik na Srbijavozu — dakle, imaju jasan presedan za pristupačnost i AI. To je realistično unutar godinu dana.
>
> Za EU: ne pokušavamo da sami prođemo kroz proces javne nabavke u 27 država. Partnerstvo sa postojećim provajderima hitnih službi koji već imaju vladine ugovore. Mi obezbeđujemo tehnološki sloj — oni obezbeđuju distribuciju.
>
> Zamislite to kao Intel Inside model. Mi ne prodajemo kompjutere — mi pravimo čip koji ide unutra. Naš partner koji već ima ugovor sa nemačkim PSAP centrima integriše Medak u svoje rešenje. Njihov sales ciklus, naša tehnologija.
>
> A pet ljudi na hackathonu danas — to je proof of concept. Za komercijalizaciju, to je 3 inženjera za 6 meseci i 75 hiljada evra. Nije nerešiv problem."

### EN

> "For Serbia — there's actually a direct regulatory incentive most people miss: the EU Commission's 2025 Serbia Report explicitly recommends that Serbia 'align its legislation on electronic communications... with the EU regulatory framework, including the EU Electronic Communications Code.' That's the EECC. The EECC includes Article 109 — accessible 112 for deaf citizens. So Medak isn't just a good idea for Serbia — it's a demonstration of EU compliance progress in Chapter 3 accession negotiations.
>
> For funding: the Innovation Fund already funded SignAvatar, a sign language accessibility app on Serbian Railways — clear precedent for accessibility and AI. Realistic within a year.
>
> For EU: we're not trying to navigate government procurement in 27 countries ourselves. We'd partner with existing emergency service providers who already have government contracts. We provide the technology layer — they provide distribution.
>
> Think of it as an Intel Inside model. We don't sell computers — we make the chip that goes inside. Our partner who already has a contract with German PSAP centers integrates Medak into their solution. Their sales cycle, our technology.
>
> And five people at a hackathon today — that's a proof of concept. For commercialization, it's 3 engineers for 6 months and €75,000. Not an unsolvable problem."

### 🎯 Delivery Notes
- "Intel Inside model" is a powerful analogy — judges understand it immediately
- Showing you know the Innovation Fund cycle (6 months) demonstrates seriousness
- **KILLER DETAIL:** The Innovation Fund already funded **SignAvatar** — a sign language accessibility app on Srbijavoz (Serbian Railways). They have explicit "inkluzija i pristupačnost" as a GovTech category. Medak is a PERFECT fit.
- If pushed: "The Fund's GovTech program supports up to €120K for new solutions. Their Catalytic program goes up to €200K for AI companies. Smart Start gives ~€46K for MVP teams of 2-5."

---

## Q22: "What if the user's phone has no internet? Emergency calls work without it."

### SR

> "Tačno — i to je realno ograničenje. Medak zahteva internet konekciju za komunikaciju sa Gemini API-jem i Twilio-om. Bez interneta, sistem ne može da funkcioniše.
>
> Ali stavimo to u kontekst: bez Medaka, gluva osoba bez interneta isto ne može da pozove 112. Može da bira broj, ali ne može da komunicira sa operaterom. Medak ne pogoršava tu situaciju — on poboljšava svaku situaciju gde internet postoji.
>
> U praksi: 97% smartphone korisnika u Srbiji ima mobilni internet. WiFi pokriva dodatni procenat. Broj situacija gde neko ima telefon ali nema apsolutno nikakvu internet konekciju je veoma mali.
>
> Za te edge case-ove, fallback je jednostavan: aplikacija prikazuje poruku 'Nema interneta — pozovite 112 direktno ili pošaljite SMS ako je dostupan' i nudi pre-napisanu tekstualnu poruku sa korisnikovom lokacijom koju može da pošalje nekome iz kontakata."

### EN

> "Correct — and that's a real limitation. Medak requires an internet connection to communicate with the Gemini API and Twilio. Without internet, the system can't function.
>
> But let's put it in context: without Medak, a deaf person without internet also can't call 112. They can dial the number, but they can't communicate with the operator. Medak doesn't worsen that situation — it improves every situation where internet exists.
>
> In practice: 97% of smartphone users in Serbia have mobile internet. WiFi covers an additional percentage. The number of situations where someone has a phone but absolutely zero internet connectivity is very small.
>
> For those edge cases, the fallback is simple: the app displays 'No internet — call 112 directly or send SMS if available' and offers a pre-written text message with the user's location that can be sent to an emergency contact."

### 🎯 Delivery Notes
- Acknowledge honestly, then reframe: Medak doesn't make a no-internet situation worse
- The 97% stat grounds the answer in reality

---

## Q23: "How do you handle the Gemini API going down? What's your SLA?"

### SR

> "Orchestrator ima 10-sekundni triage timeout. Ako User Agent ne prikupi dovoljno podataka u tom roku — bilo zbog pada API-ja ili sporog odgovora — sistem poziva 112 sa onim što ima. Delimičan izveštaj sa lokacijom je bolji od nikakvog poziva.
>
> Google-ov SLA za Gemini production API je 99.95% uptime — to je oko 22 minuta downtime-a godišnje. Za kontekst, to je bolji uptime od većine ljudskih relay servisa koji zavise od dostupnosti prevodilaca.
>
> Za production, planiramo multi-model fallback: Gemini primarno, sa alternativnim modelom kao backup. Ako primarni ne odgovori u 3 sekunde, prebacujemo na backup. Ako ni backup ne radi — sistem šalje minimalan poziv sa GPS lokacijom i pre-snimljenom porukom: 'Hitna situacija. Osoba sa oštećenjem sluha. GPS lokacija: [koordinate].'
>
> Cilj je jasan: uvek uputiti poziv. Kvalitet izveštaja može varirati, ali poziv uvek mora da se desi."

### EN

> "The orchestrator has a 10-second triage timeout. If the User Agent doesn't collect enough data in that time — whether due to API downtime or slow response — the system calls 112 with whatever it has. A partial report with location is better than no call.
>
> Google's SLA for the Gemini production API is 99.95% uptime — that's about 22 minutes of downtime per year. For context, that's better uptime than most human relay services which depend on interpreter availability.
>
> For production, we plan a multi-model fallback: Gemini as primary, with an alternative model as backup. If the primary doesn't respond within 3 seconds, we switch to backup. If backup also fails — the system sends a minimal call with GPS location and a pre-recorded message: 'Emergency situation. Person with hearing impairment. GPS location: [coordinates].'
>
> The goal is clear: always make the call. Report quality may vary, but the call must always happen."

### 🎯 Delivery Notes
- "Delimičan izveštaj je bolji od nikakvog poziva" — this is the design philosophy
- Comparing API uptime to human relay availability is a smart reframe

---

## Q24: "Why not just use RTT (Real-Time Text) which is already standardized?"

### SR

> "RTT — Real-Time Text — jeste standard, i podržavamo ga kao koncept. Problem je trostruk.
>
> Prvo: RTT zahteva da PSAP centar ima opremu i obuku za prijem teksta. U Srbiji — nijedan centar to nema. U EU, do 2025. godine, samo Irska ima nativni RTT — prva zemlja u celoj EU. Malta i Holandija imaju RTT preko aplikacije. Većina ostalih cilja jun 2027., ali kašnjenja su česta — Finska je već odložila sa 2025. na 2027.
>
> Evo što mnogi ne znaju: da bi zemlja implementirala nativni RTT, mora prvo da migrira celu 112 infrastrukturu na full-IP mrežu — NG112 arhitektura. To je projekat od više stotina miliona evra koji traje godinama. Većina EU zemalja nije ni osigurala finansiranje za to. Rok 2027. je strukturno nemoguć za najveći deo EU.
>
> RTT rešava problem samo tamo gde infrastruktura već postoji.
>
> Drugo: RTT je tekst. U panici, ljudi ne mogu efikasno da kucaju. Naše istraživanje i objavljene studije potvrđuju: kucanje u kriznoj situaciji je sporo, netačno, i stresno. Kamera koja vidi scenu je fundamentalno bolja od teksta koji opisuje scenu.
>
> Treće: RTT ne omogućava dijalog. Operater postavlja pitanje glasom — ko prevodi to u tekst? Sa RTT-jem, operater mora da kuca nazad. Sa Medakom, operater govori normalno, AI prevodi u tekst, korisnik čita i tipka odgovor, AI ga izgovara. Prirodan tok razgovora.
>
> RTT i Medak nisu konkurencija — komplementarni su. Ali RTT sam po sebi ne rešava problem jer pretpostavlja infrastrukturu koja ne postoji."

### EN

> "RTT — Real-Time Text — is a standard, and we support it as a concept. The problem is threefold.
>
> First: RTT requires the PSAP center to have equipment and training for receiving text. In Serbia — no center has that. In the EU, as of 2025, only Ireland has native RTT — the first country in the entire EU. Malta and Netherlands have app-based RTT. Most others target June 2027 but delays are common — Finland already delayed from 2025 to 2027.
>
> Here's what most people don't realize: **countries can't deploy native RTT without first implementing full NG112 infrastructure** — that means migrating PSAPs from legacy TDM circuit-switched telephony to full-IP networks. That's a multi-year, multi-hundred-million euro infrastructure project. Most EU countries haven't even committed funding for it. The 2027 deadline is structurally impossible for the majority.
>
> RTT only solves the problem where infrastructure is already in place.
>
> Second: RTT is text. In a panic, people can't type effectively. Our research and published studies confirm: typing in a crisis is slow, inaccurate, and stressful. A camera that sees the scene is fundamentally better than text describing the scene.
>
> Third: RTT doesn't enable dialogue. The operator asks a question by voice — who translates that to text? With RTT, the operator has to type back. With Medak, the operator speaks normally, AI translates to text, the user reads and types a response, AI speaks it. Natural conversation flow.
>
> RTT and Medak aren't competitors — they're complementary. But RTT alone doesn't solve the problem because it assumes infrastructure that doesn't exist.
>
> And here's what dispatchers themselves say: the director of a US 911 center that just added text-to-911 last week said — quote — 'We get so much more information from somebody calling in and hearing what's going on in the background, hearing their voice. We ask people to call if you can, text if you can't.' Dispatchers prefer voice because it carries richer information. Medak gives them voice."

### 🎯 Delivery Notes
- Don't dismiss RTT — acknowledge it, then show why it's insufficient
- "Pretpostavlja infrastrukturu koja ne postoji" is the knockout punch
- The 911 director quote is powerful — even where text exists, dispatchers prefer voice

---

## Q25: "What about GDPR — you're processing health data via a US company's API?"

### SR

> "Svesni smo toga i tretiramo to ozbiljno. Evo činjenica:
>
> Gemini API procesira video i tekst u realnom vremenu — ne čuvamo video zapise, ne čuvamo audio. Streaming se procesira i odbacuje. EmergencySnapshot u Redisu sadrži strukturirane podatke — tip hitnosti, lokacija, klinički status — i briše se nakon 24 sata.
>
> Google Cloud ima Data Processing Addendum koji je usklađen sa GDPR-om i nudi EU data residency — serveri u Evropi. Za production, koristili bismo Vertex AI sa EU endpointom, ne globalni Gemini API.
>
> Ali hajde da budemo iskreni: GDPR aneks za 'vitalne interese subjekta podataka' — član 6(1)(d) i član 9(2)(c) — eksplicitno dozvoljavaju obradu zdravstvenih podataka bez pristanka kada je to neophodno za zaštitu nečijeg života. Hitna medicinska situacija je bukvalno primer koji GDPR navodi.
>
> Za punu usklađenost pre commercial launch-a: DPIA (Data Protection Impact Assessment), ugovor o obradi podataka sa Google-om, i EU hosting. Procena troška: deo onih 100 hiljada evra za usklađivanje koje smo već pomenuli."

### EN

> "We're aware of this and take it seriously. Here are the facts:
>
> The Gemini API processes video and text in real time — we don't store video recordings, we don't store audio. The stream is processed and discarded. The EmergencySnapshot in Redis contains structured data — emergency type, location, clinical status — and is deleted after 24 hours.
>
> Google Cloud has a Data Processing Addendum that's GDPR-compliant and offers EU data residency — servers in Europe. For production, we'd use Vertex AI with an EU endpoint, not the global Gemini API.
>
> But let's be honest: the GDPR provision for 'vital interests of the data subject' — Article 6(1)(d) and Article 9(2)(c) — explicitly allows processing health data without consent when necessary to protect someone's life. A medical emergency is literally the example the GDPR cites.
>
> For full compliance before commercial launch: DPIA (Data Protection Impact Assessment), data processing agreement with Google, and EU hosting. Estimated cost: part of the €100,000 compliance budget we already mentioned."

### 🎯 Delivery Notes
- Lead with technical measures (no storage, streaming only), then cite the GDPR exception
- Article 6(1)(d) and 9(2)(c) — memorize these numbers, they show expertise

---

## Q26: "Show me the code for confidence scoring."

### SR

> "Rado. Confidence scoring je namerno jednostavan — čista aritmetika, bez LLM-a.
>
> ```python
> WEIGHTS = {
>     'location':  0.35,
>     'emergency_type': 0.25,
>     'conscious': 0.15,
>     'breathing': 0.15,
>     'victim_count': 0.10,
> }
> THRESHOLD = 0.85
>
> def calculate_confidence(snapshot: EmergencySnapshot) -> float:
>     score = 0.0
>     if snapshot.location:       score += WEIGHTS['location']
>     if snapshot.emergency_type: score += WEIGHTS['emergency_type']
>     if snapshot.conscious is not None: score += WEIGHTS['conscious']
>     if snapshot.breathing is not None: score += WEIGHTS['breathing']
>     if snapshot.victim_count is not None: score += WEIGHTS['victim_count']
>     return score
> ```
>
> To je to. Nema ML modela, nema temperature, nema halucinacija. Ako je polje popunjeno, saberi težinu. Ako je ukupan zbir ≥ 0.85, pozovi 112.
>
> Zašto ovako? Jer je scoring previše kritičan za LLM. Ne želimo da model 'proceni' da ima dovoljno informacija — želimo matematičku garanciju. Bez lokacije (0.35) i bez kliničkih podataka (0.30 zajedno), nemoguće je preći 0.85. To sprečava preuranjene pozive sa nedovoljnim informacijama."

### EN

> "Gladly. The confidence scoring is intentionally simple — pure arithmetic, no LLM.
>
> ```python
> WEIGHTS = {
>     'location':  0.35,
>     'emergency_type': 0.25,
>     'conscious': 0.15,
>     'breathing': 0.15,
>     'victim_count': 0.10,
> }
> THRESHOLD = 0.85
>
> def calculate_confidence(snapshot: EmergencySnapshot) -> float:
>     score = 0.0
>     if snapshot.location:       score += WEIGHTS['location']
>     if snapshot.emergency_type: score += WEIGHTS['emergency_type']
>     if snapshot.conscious is not None: score += WEIGHTS['conscious']
>     if snapshot.breathing is not None: score += WEIGHTS['breathing']
>     if snapshot.victim_count is not None: score += WEIGHTS['victim_count']
>     return score
> ```
>
> That's it. No ML model, no temperature, no hallucination. If the field is populated, add the weight. If the total is ≥ 0.85, call 112.
>
> Why this approach? Because scoring is too critical for an LLM. We don't want the model to 'estimate' that it has enough information — we want a mathematical guarantee. Without location (0.35) and without clinical data (0.30 combined), it's impossible to reach 0.85. That prevents premature calls with insufficient information."

### 🎯 Delivery Notes
- Having the code memorized and ready to recite shows deep ownership
- "Nema temperature, nema halucinacija — samo sabiranje" — keep repeating this philosophy
- If they want to see it live, open the actual codebase on the laptop

---

## Q27: "Zašto ovo niko ranije nije napravio?"

**SR:**
> "Zato što to nije bio tehnološki problem — bio je strukturalni pat. Sedam barijera je istovremeno blokiralo rešenje. Prvo: fragmentacija — niko ne 'poseduje' 112 u Evropi, svaka od 27 država ima svoj PSAP stack. Drugo: tržišni neuspeh — gluvi su 1% populacije, premala grupa za profitabilan B2C. Treće: infrastrukturni lock-in — većina PSAP centara i dalje radi na telefonskim linijama iz 1990-ih. Četvrto: strah od odgovornosti — ko je kriv kada AI pogrešno prenese poruku u hitnom slučaju?
>
> A onda je stigao Gemini 2.0 Flash Live. Multimodalni real-time agent koji razume video, govori prirodno, i koristi alate — sve istovremeno, sa latencijom ispod 2 sekunde. To je enabling technology koja nije postojala pre godinu dana. Mi nismo pametni — samo smo stigli u pravo vreme sa pravom tehnologijom."

**EN:**
> "Because it wasn't a technology problem — it was a structural deadlock. Seven barriers blocked the solution simultaneously. First: fragmentation — nobody 'owns' 112 in Europe, each of 27 countries has its own PSAP stack. Second: market failure — deaf people are 1% of any country, too small for profitable B2C. Third: infrastructure lock-in — most PSAPs still run on 1990s phone lines. Fourth: liability fear — who's responsible when AI misrelays a message in an emergency?
>
> Then Gemini 2.0 Flash Live arrived. A multimodal real-time agent that understands video, speaks naturally, and uses tools — all simultaneously, under 2-second latency. That's the enabling technology that didn't exist a year ago. We're not smarter than everyone — we just arrived at the right time with the right technology."

**🎯 Delivery Notes:**
- Count the barriers on your fingers — it's theatrical
- The key line: "We're not smarter — we just arrived at the right time" — humility scores points
- If they push: reference AccesSOS founder's quote about Intrado giving up because it wasn't profitable

---

## Quick Response Matrix

For rapid-fire Q&A, here's the one-sentence version of each answer:

| # | Question (short) | One-line answer |
|---|------------------|-----------------|
| 13 | Scripted demo? | Demo mode for reliability, production mode with real camera — same architecture, offer to show it live. |
| 14 | N=18? | Qualitative confirmation of EENA/AccesSOS/EUD/WHO published research, not standalone statistical claim. |
| 15 | Wrong address? | GPS is hardware, not AI — 0.35 weight means system won't call without confirmed location. |
| 16 | 112 center agreement? | Not needed — operator receives a normal voice call, no PSAP changes required. |
| 17 | False positives? | 1.5s hold, multi-signal correlation, and $0.13 false positive vs. priceless false negative. |
| 18 | 38 seconds real? | 38s to first structured brief; 2-5 min total; human relay has 3-4 min pickup BEFORE info exchange. |
| 19 | Open source vs B2G? | Open-source core protocol, revenue from managed service (SLA, compliance, 24/7). Red Hat model. |
| 20 | Apples to oranges cost? | All-in $1-3/call, still 10-20x cheaper, plus unlimited scalability at 3 AM. |
| 21 | 5 people vs procurement? | Serbia: Innovation Fund (6mo). EU: Intel Inside model — partner with existing contractors. |
| 22 | No internet? | Real limitation, but without Medak they also can't communicate via 112. 97% have mobile internet. |
| 23 | API downtime? | 10s timeout → call with partial data. Google SLA 99.95%. Multi-model fallback planned. |
| 24 | Why not RTT? | RTT requires NG112 migration first (multi-year, hundreds of millions). Only Ireland has it. Medak works NOW with zero PSAP changes. |
| 25 | GDPR? | No storage (streaming), GDPR Art 6(1)(d) vital interests, EU Vertex AI endpoint for production. |
| 26 | Show the code? | Pure arithmetic: 5 weights, threshold 0.85. No LLM in scoring. *[recite the function]* |
| 27 | Why hasn't anyone built this? | 7 structural barriers (fragmentation, market failure, lock-in, liability). Gemini 2.0 Flash Live is the enabling tech that didn't exist last year. |
| 28 | Responsible AI? | AI agents gather info; deterministic FSM makes the call decision. Every decision logged, traceable, auditable. Zero LLM in scoring. |
| 29 | Why not Google ADK? | ADK = tool-calling/completions. Gemini 2.0 Flash Live = bidirectional WebSocket streaming. ADK doesn't support Live API streaming mode. Direct API = max control for safety-critical system. |

---

## Q28: "Kako obezbeđujete odgovoran pristup AI? / How do you ensure responsible AI use?"

**SR:**
> "Ovo je centralni dizajn princip, ne naknadan dodatak. AI agenti rade ono u čemu su dobri — prepoznavanje scena, prirodni jezik, glasovni relay. Ali nijedan AI agent ne donosi kritičnu odluku. Odluku da li da se pozove 112 donosi deterministička state mašina — FSM sa eksplicitnim pragom od 0.85. Pet težina, čista aritmetika, nula LLM-a u procesu odlučivanja.
>
> Svaka tranzicija između faza — INTAKE, TRIAGE, LIVE_CALL, RESOLVED — je logovana i trasirana. Ako regulator pita 'zašto je ovaj poziv upućen?' — mi možemo pokazati tačan trenutak, tačan confidence score i tačne podatke koji su doprineli odluci. Nema crne kutije.
>
> Dodatno: ne čuvamo lične podatke nakon poziva — streaming model, ne skladište. GDPR član 6(1)(d), vitalni interesi. I koristimo EU Vertex AI endpoint za produkciju."

**EN:**
> "This is a core design principle, not an afterthought. The AI agents do what AI is good at — scene recognition, natural language, voice relay. But no AI agent makes the critical decision. The decision to call 112 is made by a deterministic FSM with an explicit threshold of 0.85. Five weights, pure arithmetic, zero LLM in the decision path.
>
> Every phase transition — INTAKE, TRIAGE, LIVE_CALL, RESOLVED — is logged and traceable. If a regulator asks 'why was this call placed?' we can show the exact moment, exact confidence score, and exact data points that contributed. No black box.
>
> Additionally: we don't store personal data after the call — streaming model, not storage. GDPR Article 6(1)(d), vital interests. EU Vertex AI endpoint for production."

**🎯 Delivery Notes:**
- This question is a GIFT at a "Build with AI" hackathon — it lets you showcase responsible design
- Key phrase: "AI does what AI is good at. Deterministic systems do what humans need to trust."
- Draw the contrast: "Most AI projects let the LLM decide everything. We explicitly don't."
- If you get this question, you can name-drop the EU AI Act classification: "Under the EU AI Act, emergency dispatch is high-risk. Our architecture was designed for that classification from day one."

---

## Q29: "Why didn't you use Google ADK (Agent Development Kit)?"

**SR:**
> "ADK je odličan framework za tool-calling agente i workflow automatizaciju. Ali Medak zahteva nešto fundamentalno drugačije — bidirekcionalnu real-time audio/video streaming konekciju sa nultom latencijom. ADK radi na standardnim completion pozivima; Gemini 2.0 Flash Live zahteva persistentnu WebSocket streaming sesiju.
>
> Za real-time glasovni relay hitnih poziva, direktna Gemini Live API integracija je jedino rešenje koje radi u praksi. ADK ne podržava Gemini Live API streaming model koji nam je potreban.
>
> Naša orkestracija nije ad-hoc — to je deterministička state mašina sa jasnom separacijom: AI agenti za percepciju i jezik, FSM za tranzicije i kritične odluke. Arhitekturno, to je ispravniji pristup za ovaj use case od ADK-based rešenja."

**EN:**
> "ADK is an excellent framework for tool-calling agents and workflow automation. But Medak requires something fundamentally different — bidirectional real-time audio/video streaming with zero latency. ADK operates on standard completion calls; Gemini 2.0 Flash Live requires a persistent WebSocket streaming session.
>
> For real-time voice relay of emergency calls, direct Gemini Live API integration is the only practical solution. ADK doesn't support the Gemini Live API streaming model we need.
>
> Our orchestration isn't ad-hoc — it's a deterministic state machine with clear separation of concerns: AI agents for perception and language, FSM for transitions and critical decisions. Architecturally, this is the more appropriate approach for this use case than ADK-based solutions."

**🎯 Delivery Notes:**
- Don't be defensive — ADK is a great tool, just wrong tool for this problem
- The real-time streaming constraint is the key technical reason: "ADK doesn't do WebSocket streaming for live audio/video"
- Flip it: "We deliberately chose the lowest-level API access to maximize control over a safety-critical system. For emergency calls, you don't want framework magic between you and the API."

---

## General Q&A Principles

1. **Acknowledge valid criticisms immediately.** "Fer primedba" / "Tačno" / "Ispravno" — then pivot to the answer. Never be defensive.

2. **"We haven't done X yet because Y, and here's how we'd do it."** This is the template for every gap question. Honest about status, clear about path forward.

3. **Redirect to the alternative.** When challenged on a limitation, ask: "What's the alternative for this person today?" Answer: nothing. Medak with limitations is infinitely better than nothing.

4. **Cite specifics.** Article 6(1)(d). Weight 0.35. $0.13. 38 seconds. SignAvatar (Innovation Fund precedent). Numbers build credibility.

5. **Have one devastating closer per topic.** For false positives: "False positive cost is $0.13. False negative cost is a human life." For cost comparison: "Human relay at 3 AM requires paying overnight staff regardless of call volume." Memorize these.

---

*Last updated: 2026-03-29*
*Companion to: PITCH_SCRIPT_10MIN.md §4 (Q1-Q12)*
*Project: Medak — GDG Hackathon Belgrade*
