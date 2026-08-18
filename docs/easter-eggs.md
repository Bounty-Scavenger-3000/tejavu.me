# Easter Egg Registry
**Project:** Tejas Portfolio — The Desk  
**File:** `easter-eggs.md`  
**Upload when:** adding, modifying, or debugging hidden interactions. Also re-run the verification column after every major redesign.

---

## Registry

| ID | Name | Parent section | Trigger | What happens | Discoverability hint | Accessible (keyboard/screen reader)? | Status |
|---|---|---|---|---|---|---|---|
| SEC-00-EGG01 | Boot ALERT | SEC-00 | Watch the boot sequence to completion (or let it scroll past) | Red line appears: "ALERT: Subject funnier in meetings than strictly professional." | None — reward for reading | Yes (passive) | Live |
| SEC-10-EGG01 | ACCA redaction reveal | SEC-10 | Click or tap the black striped bar inside the About/Dossier panel | Reveals the 4 remaining ACCA papers: SBL, SBR, APM, AAA | `(tap the black bar to declassify)` — visible hint text immediately to the right of the bar | Yes — `role="button"` + `tabindex="0"` + `onkeydown Enter` handler | Live |

---

## Notes

### SEC-10-EGG01 history
This egg went through two implementations:
- **v1 (broken):** Text was hidden with `background:#1a1a1a; color:#1a1a1a` — black text on black background. Toggle on click switched `background:transparent`. The problem: there was no visible indicator that anything was there, making it a true hidden interaction with zero discoverability. Additionally, the label said "(click to reveal)" in parentheses inside the hidden text itself, so you'd only see the instruction after accidentally discovering you could click it. This was flagged as "no point writing it" in feedback.
- **v4.1 (fixed):** Replaced with a CSS diagonal-stripe `repeating-linear-gradient` bar (`.d-redact-bar`) that's visually obvious — looks like redaction tape. The hidden text (`.d-redact-text`) starts with `display:none` and shows on toggle. Visible hint text `(tap the black bar to declassify)` sits next to it so the interaction is discoverable without requiring luck.

### General principles for future easter eggs
- If an egg is completely hidden with no hint, document clearly that it's intentional — otherwise it'll look like a bug when reviewed later.
- Touch-only interactions (hover-triggered triggers) won't work on mobile; note whether there's a mobile fallback or whether the egg is desktop-only.
- Every egg needs an entry here with a `data-registry` comment in the code. The format is: `// [SEC-XX-EGGYY] description of what this does`.

---

## Planned / Ideas (not yet built)

| Proposed ID | Concept | Notes |
|---|---|---|
| SEC-03-EGG01 | Clicking the power button on the tower reboots the monitor | Would reset `booted = false`, play the boot sequence again, nice callback to the physical computer metaphor | Not built |
| SEC-01-EGG01 | Konami code on the keyboard | Could do something amusing — confetti, a joke line in the terminal, or briefly unlock a "cheat mode" OS window | Not built |
| SEC-11-EGG01 | Entering a specific name in the cheque form triggers a special response | Could acknowledge certain keywords in the memo field | Not built |
