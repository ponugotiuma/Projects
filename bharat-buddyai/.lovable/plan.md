
## Plan: Make Bharat Buddy AI fully functional

This is a large multi-phase build. I'll enable Lovable Cloud (database + auth + storage + server functions) and wire Gemini for AI features. Estimated 4 phases.

### Phase 1 — Foundations (visual + nav fixes)
1. **New logo** — replace `Sparkles` with a custom India+AI mark: Ashoka-chakra-inspired ring around a neural-network spark, in saffron/indigo gradient. SVG component, no external image.
2. **Remove "ComingSoonNote"** from all 5 feature pages; replace with a footer copyright line: `© 2026 Bharat Buddy AI · Made with care for India`.
3. **"Back to home" button** in the dashboard sidebar/header → `/`.
4. **Wire landing-page Sign in / Get started** → `/auth` (new route).

### Phase 2 — Auth (Lovable Cloud)
5. Enable **Lovable Cloud**.
6. `profiles` table + auto-create trigger + RLS.
7. `/auth` page: Email/password + Google sign-in.
8. Move dashboard under `_authenticated/` so unauthenticated users are redirected.
9. Show real signed-in user name/email in sidebar + settings; add Sign-out.

### Phase 3 — Database + per-user data
10. Tables: `documents`, `scam_checks`, `career_analyses`, `form_lookups`, `reminders`, `usage_events` — all with `user_id`, RLS scoped to `auth.uid()`.
11. Storage bucket `user-uploads` for PDFs/images, RLS by `auth.uid()` folder.
12. Analytics page reads real per-user counts (zero for new users); usage_events logged on each AI action.
13. **Remove all sample reminders**; reminders list is empty for new users and populates only from real document uploads / manual adds.

### Phase 4 — AI features (Gemini via Lovable AI Gateway)
14. `summarizeDocument` server fn: upload → store → call Gemini (vision for images, text for PDFs via PDF.js text extract) → save summary + extracted dates → auto-create reminders for found deadlines.
15. `analyzeScam` server fn: text in → Gemini → risk score + indicators + advice → saved.
16. `analyzeResume` server fn: PDF/DOCX text → Gemini → skill gaps + roadmap + free learning links → saved.
17. `explainForm` server fn: form name → Gemini → field-by-field explanation + document checklist (replaces the search bar with a clean picker/input + Explain button).
18. All "Choose file / Upload / Analyse / Explain" buttons wired to these server fns with loading states + toasts.
19. Settings page: real save (language, voice in/out, dark mode persisted in `profiles`); dark mode toggle actually toggles theme; profile name/email editable.

### Technical notes
- AI: Lovable AI Gateway with `google/gemini-2.5-flash` (default free model) — no Gemini API key needed from user.
- File parsing: PDF text via `pdfjs-dist`; images sent directly to Gemini vision; DOCX via `mammoth`.
- Forms Assistant: instead of a search bar over a static list, user types or picks a form name (PAN, Aadhaar update, passport, ration card, scholarship, etc.) and Gemini explains it in their preferred language.
- Voice in/out: Web Speech API (free, browser-native) — toggleable in settings.

### What I will NOT do unprompted
- No payments, no SMS, no Twilio reminders (browser/in-app reminders only).
- No multi-tenant admin panel.
- Hindi/regional language = Gemini translates the output; UI chrome stays English for now (translating all UI strings is a separate large task — say the word if you want it).

### Confirm before I start
- OK to enable **Lovable Cloud** and use **Lovable AI Gateway** (free Gemini access, no key needed from you)?
- OK with **Email + Google** sign-in as the auth methods?
- OK that I'll build all 4 phases in this single run (it will be a long turn)?

Reply "go" and I'll execute end-to-end.
