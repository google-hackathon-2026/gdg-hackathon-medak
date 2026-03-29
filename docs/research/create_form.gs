/**
 * Medak Hackathon — Emergency Accessibility Survey
 * 
 * HOW TO USE:
 * 1. Go to https://script.google.com
 * 2. Click "New project"
 * 3. Delete the default code
 * 4. Paste this entire file
 * 5. Click ▶ Run
 * 6. Authorize when prompted (Google will ask for Forms permission)
 * 7. Check the Execution Log for the form URL
 * 
 * The form will appear in your Google Drive.
 */

function createMedakSurvey() {
  var form = FormApp.create('Da li možete da pozovete pomoć? — Anketa o pristupačnosti hitnih službi');
  
  form.setDescription(
    'Gradimo AI sistem koji pomaže gluvim osobama i osobama sa govorno-jezičkim poteškoćama da pozovu 112 u Srbiji. Vaše iskustvo je važno.\n\n' +
    'Anketa traje ~3 minuta. Anonimna je. Rezultati će biti korišćeni za razvoj prototipa na GDG hakatonu.\n\n' +
    '---\n\n' +
    'We\'re building an AI system that helps deaf and speech-impaired people call 112 in Serbia. Your experience matters.\n\n' +
    '~3 minutes. Anonymous. Results will be used to develop a prototype at a GDG hackathon.'
  );
  
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);
  form.setConfirmationMessage(
    'Hvala vam! 🙏 Vaši odgovori će nam pomoći da napravimo pristupačniji sistem za hitne situacije.\n\n' +
    'Thank you! Your answers will help us build a more accessible emergency system.'
  );

  // ===== SECTION 1: O vama / About You =====
  // (first page is implicit)

  // Q1 — About You
  var q1 = form.addMultipleChoiceItem();
  q1.setTitle('Šta vas najbolje opisuje? / Which best describes you?')
    .setChoices([
      q1.createChoice('Gluva/nagluva osoba (Deaf/Hard of Hearing person)'),
      q1.createChoice('Osoba sa govorno-jezičkim poteškoćama (Person with speech impairment)'),
      q1.createChoice('Član porodice ili prijatelj gluve/nagluve osobe (Family member or friend)'),
      q1.createChoice('Stručnjak/profesionalac — tumač, socijalni radnik, defektolog (Professional)'),
      q1.createChoice('Drugo / Other'),
    ])
    .setRequired(true);

  // Q2 — Country
  var q2 = form.addMultipleChoiceItem();
  q2.setTitle('Gde živite? / Where do you live?')
    .setChoices([
      q2.createChoice('Srbija / Serbia'),
      q2.createChoice('Bosna i Hercegovina / Bosnia and Herzegovina'),
      q2.createChoice('Hrvatska / Croatia'),
      q2.createChoice('Crna Gora / Montenegro'),
      q2.createChoice('Drugo / Other'),
    ])
    .setRequired(true);

  // Q3 — Age
  var q3 = form.addMultipleChoiceItem();
  q3.setTitle('Koliko imate godina? / How old are you?')
    .setChoices([
      q3.createChoice('Ispod 18 / Under 18'),
      q3.createChoice('18–25'),
      q3.createChoice('26–35'),
      q3.createChoice('36–50'),
      q3.createChoice('51–65'),
      q3.createChoice('Preko 65 / Over 65'),
    ])
    .setRequired(true);

  // ===== SECTION 2: Vaše iskustvo / Your Experience =====
  form.addPageBreakItem().setTitle('Vaše iskustvo / Your Experience');

  // Q4 — Emergency experience
  var q4 = form.addMultipleChoiceItem();
  q4.setTitle('Da li ste ikada imali potrebu da pozovete 112 ili drugu hitnu službu u Srbiji?\nHave you ever needed to call 112 or another emergency service in Serbia?')
    .setRequired(true);
  
  // Q5 page (conditional — shown if Q4 = Da)
  var pageIfYes = form.addPageBreakItem().setTitle('Detalji / Details');
  
  var q5 = form.addMultipleChoiceItem();
  q5.setTitle('Šta se desilo kada ste pokušali da dobijete hitnu pomoć?\nWhat happened when you tried to get emergency help?')
    .setChoices([
      q5.createChoice('Pozvao/la sam sam/a i uspeo/la da komuniciram (I called and managed to communicate)'),
      q5.createChoice('Neko drugi je pozvao umesto mene (Someone else called for me)'),
      q5.createChoice('Nisam mogao/la uopšte da pozovem (I couldn\'t call at all)'),
      q5.createChoice('Poslao/la sam SMS (I sent an SMS)'),
      q5.createChoice('Koristio/la sam aplikaciju ili drugi način (I used an app or other method)'),
      q5.createChoice('Drugo / Other'),
    ])
    .setRequired(true);

  // Page for Q6+ (everyone continues here)
  var pageContinue = form.addPageBreakItem().setTitle('Pristupačnost / Accessibility');

  // Set Q4 branching: Da -> pageIfYes, Ne -> pageContinue
  q4.setChoices([
    q4.createChoice('Da / Yes', pageIfYes),
    q4.createChoice('Ne / No', pageContinue),
  ]);

  // Q6 — Rating
  var q6 = form.addScaleItem();
  q6.setTitle('Kako biste ocenili svoju mogućnost da pristupite broju 112 danas?\nHow would you rate your ability to access 112 today?')
    .setBounds(1, 5)
    .setLabels('Potpuno nepristupačno / Completely inaccessible', 'Potpuno pristupačno / Fully accessible')
    .setRequired(true);

  // Q7 — Barriers
  var q7 = form.addMultipleChoiceItem();
  q7.setTitle('Da li ste ikada bili u situaciji da NISTE mogli da dobijete hitnu pomoć zbog komunikacionih barijera?\nHave you ever been unable to get emergency help because of communication barriers?')
    .setChoices([
      q7.createChoice('Da / Yes'),
      q7.createChoice('Ne / No'),
      q7.createChoice('Ne želim da odgovorim / Prefer not to say'),
    ])
    .setRequired(true);

  // ===== SECTION 3: AI rešenje / The AI Solution =====
  form.addPageBreakItem().setTitle('AI rešenje / The AI Solution');

  // Q8 — PMF question
  var q8 = form.addMultipleChoiceItem();
  q8.setTitle('Kada bi AI aplikacija na vašem telefonu mogla da razgovara sa 112 u vaše ime u realnom vremenu — da li biste je koristili?\nIf an AI app on your phone could speak to 112 on your behalf in real-time, would you use it?')
    .setChoices([
      q8.createChoice('Svakako da / Definitely yes'),
      q8.createChoice('Verovatno da / Probably yes'),
      q8.createChoice('Nisam siguran/na / Not sure'),
      q8.createChoice('Verovatno ne / Probably no'),
      q8.createChoice('Svakako ne / Definitely no'),
    ])
    .setRequired(true);

  // Q9 — Concerns
  var q9 = form.addCheckboxItem();
  q9.setTitle('Koje biste brige imali u vezi sa takvim sistemom? (Možete izabrati više odgovora)\nWhat concerns would you have? (Select all that apply)')
    .setChoices([
      q9.createChoice('Privatnost i zaštita podataka / Privacy and data protection'),
      q9.createChoice('Tačnost prenosa poruke / Accuracy of message relay'),
      q9.createChoice('Poverenje — da li će me hitna služba shvatiti ozbiljno? / Trust — will they take me seriously?'),
      q9.createChoice('Jezička podrška (srpski, znakovni jezik) / Language support'),
      q9.createChoice('Cena korišćenja / Cost'),
      q9.createChoice('Pristupačnost interfejsa / Interface accessibility'),
      q9.createChoice('Nemam nikakve brige / No concerns'),
    ])
    .setRequired(true);

  // ===== SECTION 4: Sledeći koraci / Next Steps =====
  form.addPageBreakItem().setTitle('Sledeći koraci / Next Steps');

  // Q10 — Current method
  var q10 = form.addCheckboxItem();
  q10.setTitle('Kako trenutno kontaktirate hitne službe? (Možete izabrati više odgovora)\nHow do you currently contact emergency services? (Select all that apply)')
    .setChoices([
      q10.createChoice('Glasovni poziv (sam/a ili uz pomoć) / Voice call'),
      q10.createChoice('SMS poruka / SMS message'),
      q10.createChoice('Zamolim nekoga u blizini / Ask someone nearby'),
      q10.createChoice('Koristim aplikaciju (npr. SOS za gluve) / Use an app'),
      q10.createChoice('Ne znam kako da ih kontaktiram / I don\'t know how'),
      q10.createChoice('Nikada nisam imao/la potrebu / Never needed to'),
    ])
    .setRequired(true);

  // Q11 — Willingness to test
  var q11 = form.addMultipleChoiceItem();
  q11.setTitle('Da li biste bili spremni da testirate prototip ovakvog sistema?\nWould you be willing to test a prototype?')
    .setRequired(true);

  // Q12 page (conditional)
  var pageContact = form.addPageBreakItem().setTitle('Kontakt / Contact');

  var q12 = form.addTextItem();
  q12.setTitle('Ostavite vaš email ili broj telefona za kontakt.\nLeave your email or phone number. We will only use it to invite you to test.')
    .setRequired(false);

  // Page for final question
  var pageFinal = form.addPageBreakItem().setTitle('Završetak / Final');

  // Set Q11 branching
  q11.setChoices([
    q11.createChoice('Da, i mogu ostaviti kontakt / Yes, with contact info', pageContact),
    q11.createChoice('Da, ali anonimno / Yes, but anonymously', pageFinal),
    q11.createChoice('Ne / No', pageFinal),
  ]);

  // Q13 — Open text
  var q13 = form.addParagraphTextItem();
  q13.setTitle('Da li želite da podelite nešto što nismo pitali? Bilo kakvo iskustvo, predlog ili komentar je dobrodošao.\nIs there anything else you\'d like to share?')
    .setRequired(false);

  // Log the URL
  Logger.log('✅ Form created successfully!');
  Logger.log('📋 Edit URL: ' + form.getEditUrl());
  Logger.log('🔗 Share URL: ' + form.getPublishedUrl());
  Logger.log('📊 Responses URL: ' + form.getSummaryUrl());
}
