// Desk scene text: boot screen and board notes.
// The rest of the desk copy still sits in desk/index.html (see Content - Desk).
//
// Boot lines: S00-M01 to S00-M11 (blank entries are spacer lines).
// Note keys map to board notes: humshakals S12-N1, dean S12-N2, verdict S12-N3,
// prachaara S12-N4, crescere S12-N5, civic S12-N6, broseph S12-N7,
// record S12-N8, newsletter S12-N9. Fields: meta = d-meta, title = d-title, body = d-body.

export const boot = {
  // c: '' green, 'd' dim green, 'am' amber, 'er' red
  messages: [
  {t:'TEJAS-PC BIOS v2.0                    Award Modular BIOS v4.51PG',c:''},
  {t:'Copyright (c) 2026 Tejas Industries. All Rights Reserved.',c:'d'},
  {t:'',c:''},
  {t:'Intel(R) Pentium(R) III  693 MHz',c:''},
  {t:'Memory Test:  655360K OK',c:'d'},
  {t:'',c:''},
  {t:'Detecting Primary Master ... SKILLS.DAT        [LOADED]',c:''},
  {t:'Detecting Primary Slave  ... PROJECTS.LOG      [4 ENTRIES]',c:''},
  {t:'Detecting Secondary      ... COMPETITIONS.ISO  [3 FINALS, 0 WINS]',c:'am'},
  {t:'',c:''},
  {t:'Loading ACCA_PAPERS.EXE ... 9 done, 4 to go (SBL SBR APM AAA).',c:''},
  {t:'Loading RTI_TRACKER.EXE ... 20,000 volunteers indexed.',c:''},
  {t:'',c:''},
  {t:'ALERT: Subject funnier in meetings than strictly professional.',c:'er'},
  {t:'',c:''},
  {t:'Starting TEJAS-OS 98...',c:''},
],
  // S00-P1 to S00-P6, cycled while the lines type out
  phrases: ['POST check...', 'Memory test...', 'Loading drivers...', 'Detecting hardware...', 'Reading boot sector...', 'Starting OS...'],
  done: 'Boot complete.',   // S00-P7
  donePct: '100%',          // S00-P8
}

export const noteDetails = {
  humshakals: {
    meta:  'Christ University · Feb 2026',
    title: 'Humshakals — Prachaara 2.0',
    body:  "Solo pitch round, Prachaara 2.0's flagship comedy-pitch event. Organisers assign a random character and product category — mine was Pushpa, marketing vehicle cleaning products. Instead of a straight pitch, I ran a standup set that only nodded at the brief: a full product line called Thaggede Le — a cleaning brush, truck polish, an interior cleaner branded as \u2018enemy\u2019s blood,\u2019 and an air freshener called Sheshachalam Mist. Ran twelve minutes over the time limit in front of 300+ students and faculty.",
  },
  dean: {
    meta:  'Same set, mid-bit',
    title: 'The Callback',
    body:  "Midway through a bit about the red liquid, someone in the crowd shouted a guess. I fired back a line without knowing it was the associate dean \u2014 the room lost it once people realised who I\u2019d just clapped back at.",
  },
  verdict: {
    meta:  'Humshakals \u00b7 judges\u2019 feedback',
    title: 'The Verdict',
    body:  "Asked the crowd if they wanted the product. Every hand went up. It didn\u2019t place \u2014 judges said the product had zero commercial value. I don\u2019t do it to win; people remember energy over slides.",
  },
  prachaara: {
    meta:  'Christ University · Dec 2024',
    title: 'Prachaara: Marketing Ka Punchnama',
    body:  "The department's flagship marketing event. First round: judges and other participants, got through on humor and people skills alone. Finals: 200+ people, the whole department. Assigned character: Jackie Chan from Rush Hour, marketing a beauty product. Built a makeup kit sourced from Thailand, China, and Vietnam, then barely stayed in character. The deck was AI-generated images and AI-generated financial projections, thrown together in about ten minutes \u2014 admitted that on stage, then closed with a dance and confetti. Didn\u2019t win. Judges said I\u2019d have taken it if I hadn\u2019t admitted the financials were AI-generated.",
  },
  crescere: {
    meta:  'Finance & Leadership Cell, Christ University',
    title: 'CRESCERE',
    body:  "Not a member of the Finance & Leadership Cell, but they brought me in to market CRESCERE anyway. Three of us dressed as Squid Game guards, ran the show's paper-flipping game in the middle of campus, and pulled people over to the registration stall. Also competed: my team drew a failing company in Round 1, built a recovery plan, defended it through judge Q&A. Won the round, reached the finals.",
  },
  civic: {
    meta:  'Christ University \u00d7 Broseph Foundation · Sep 2025',
    title: 'University-NGO Civic Drive',
    body:  "Organised this collaboration from the Foundation's side, with a friend who headed the university's SDG club organising it from theirs. Co-led one of two field teams on the day. Across both teams: 20+ participants, 10+ bags of garbage collected, 60+ civic issues logged on the BBMP Sahaya app.",
  },
  broseph: {
    meta:  'Throughline',
    title: 'Same Skill, Different Room',
    body:  "Reading a room and adjusting on the fly is the same skill whether it's 20,000 volunteers or 300 strangers laughing at a joke about truck polish. Different registers, same instinct.",
  },
  record: {
    meta:  'Track record',
    title: '0-for-3',
    body:  "Reached the finals in three separate business-pitch and case competitions. Won zero. Genuinely doesn't mind \u2014 people remember energy over slides, and being memorable beats a trophy that gets forgotten in a year.",
  },
  newsletter: {
    meta:  'Beehiiv',
    title: 'Newsletter',
    body:  "The unfiltered version of all of this \u2014 the stuff that doesn't fit neatly into a portfolio panel \u2014 lives on the newsletter. Sign up on Beehiiv.",
  },
}
