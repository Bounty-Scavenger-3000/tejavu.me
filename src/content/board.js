// The board: top-level notes, each one opening into the notes that branch off it.
//
// A note with `notes` expands into them; a note without them (newsletter) opens its detail card
// directly. Detail text lives in desk.js (noteDetails), keyed by the same `key`.
// To add something: put a note in a category, or add a category here. Nothing else to wire.
// `color` is yellow, orange, blue, pink, green or white.

export const board = {
  back: '< ALL NOTES',
  categories: [
    { key: 'broseph-foundation', color: 'blue',
      title: 'BROSEPH FOUNDATION',
      sub: 'The civic drive, the shelter potluck, and what ties them together.',
      notes: [
      { key: "civic", color: "white",
        title: "CIVIC DRIVE",
        sub: "Sep 2025 · Organised a Christ University × Broseph Foundation collab. 20+ participants, 10+ bags of garbage, 60+ issues logged on BBMP Sahaya." },
      { key: "potluck", color: "green",
        title: "HOMELESS SHELTER POTLUCK",
        sub: "The first one almost didn't happen. Form and menu rebuilt at midnight, two nights out." },
      { key: "broseph", color: "blue",
        title: "SAME SKILL, DIFFERENT ROOM",
        sub: "Reading a room is reading a room — 20,000 volunteers or 300 strangers waiting on a punchline. Same instinct, different stakes." },
      ] },
    { key: 'christ-university', color: 'yellow',
      title: 'CHRIST UNIVERSITY',
      sub: 'Competitions and campus events. Three finals, zero wins.',
      notes: [
      { key: "humshakals", color: "yellow",
        title: "HUMSHAKALS — PRACHAARA 2.0",
        sub: "Feb 2026 · Assigned Pushpa + vehicle cleaning. Built a product line (Thaggede Le: brush, truck polish, \"enemy's blood\" interior cleaner) and ran twelve minutes of standup over the limit in front of 300+." },
      { key: "dean", color: "orange",
        title: "THE CALLBACK",
        sub: "Mid-bit, someone shouted a guess from the crowd. Fired back a line without knowing it was the associate dean. The room realised before he did." },
      { key: "verdict", color: "blue",
        title: "THE VERDICT",
        sub: "Asked the crowd if they'd want the product. Every hand went up. Judges' note: \"zero commercial value.\" Didn't place." },
      { key: "prachaara", color: "pink",
        title: "PRACHAARA",
        sub: "Dec 2024 · Jackie Chan, beauty product, AI-generated deck admitted live on stage. Closed with a dance and confetti. Department still brought it up days later." },
      { key: "crescere", color: "green",
        title: "CRESCERE",
        sub: "Dressed as Squid Game guards to pull people into the event — then competed, drew a failing company, and reached the finals with the recovery plan." },
      { key: "record", color: "yellow",
        title: "0-FOR-3",
        sub: "Three finals. Zero wins. Genuinely doesn't mind — people remember energy over slides." },
      ] },
    { key: 'newsletter', color: "pink",
      title: "NEWSLETTER",
      sub: "The unfiltered version of all of this lives on Beehiiv. Sign up →" },
  ],
};
