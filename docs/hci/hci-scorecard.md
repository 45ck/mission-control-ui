# HCI Scorecard — Mission Control Prototype

**Date**: 2026-03-23
**Scope**: Full system — all pages, components, data models, and interactions
**Method**: 9 independent HCI analyses by specialist agents, synthesized below

---

## Dimension Scores (1-5 scale)

| #   | Dimension                         | Score | Rationale                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | --------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Clarity of purpose**            | 3     | The mission lifecycle metaphor is strong and differentiated, but first-time users receive zero onboarding. No explanation of what "Mission", "Workflow", or "Stage" mean. The military aesthetic signals purpose but may alienate. The zoom pattern (portfolio → brief → monitoring → supervising) is well-structured but not self-evident from the UI alone.                                                                                                                        |
| 2   | **Navigation clarity**            | 3     | LeftNav + breadcrumbs + CommandPalette provide good bones. But: stage navigation is buried at the bottom of MissionDetail (no tab bar), notifications always route to overview instead of relevant stage, History/Costs are dead-end pages with no outbound links, search icon is not wired, and Live View severs all shell navigation including notifications. 22 routes are well-organized in the URL structure but the UI doesn't always surface them.                            |
| 3   | **Terminology consistency**       | 2     | "Escalation" has dual identity (stage + entity noun). "Session" is overloaded with 3 meanings on one page. "Workspace" ghost persists in code, components, and routes alongside its replacement "Live View". Evidence statuses use 3 different tense conventions. Section label casing varies (sentence case in FocusPanel, ALL CAPS everywhere else). 14 terms identified for merge/ban.                                                                                            |
| 4   | **State visibility**              | 2     | StageBadge and RiskBadge exist but: Mission has no terminal state (no "completed"/"done"). Escalation decisions are ephemeral useState — refresh resets them. `priority` field is populated but never rendered. `verificationState` is denormalized and static. `step.status === 'success'` checks a value that doesn't exist. LOW and MEDIUM risk badges are near-identical. Terminal/browser sessions lack color-coded status indicators. Notification urgency is not color-coded. |
| 5   | **Error prevention and recovery** | 1     | The weakest dimension. Both create forms accept empty submissions with success toasts. Zero form validation anywhere. No `ErrorBoundary` in the component tree. ApprovalBar "disabled" state is CSS-only (still clickable). No confirmation dialogs for destructive actions. No undo on escalation decisions. Agent launch is irreversible with no confirmation. 79% of 103 audited failure paths are completely unhandled.                                                          |
| 6   | **Recognition over recall**       | 3     | CommandPalette (Ctrl+K) provides fuzzy search across missions and pages. Filter buttons on MissionHome use URL params (bookmarkable). Stage/risk badges provide at-a-glance recognition. But: the Ctrl+K shortcut is discoverable only by muscle memory (search icon doesn't work), stage links require scrolling to page bottom, and there's no "what needs my attention now?" dashboard.                                                                                           |
| 7   | **Cross-screen consistency**      | 2     | 7 ad-hoc empty state patterns exist while the EmptyState component is dead code (never imported). Primary action buttons use 3 different background colors. Acceptance criteria rendered 4 different ways across pages. Not-found states are structurally inconsistent (some preserve shell, some don't). Success feedback uses 5 different patterns. Plan approval is a buried button while Review uses sticky top bar.                                                             |
| 8   | **Failure path coverage**         | 1     | 103 failure paths audited: 6% handled well, 16% partial, 79% missing. Network failures: zero handling. Partial completion: zero auto-save, zero navigation guards. Concurrency: zero handling. No loading indicators for any async operation. No timeout handling. No retry mechanisms. No offline fallback. The prototype's happy path is polished; its failure surface is essentially absent.                                                                                      |

---

## Total Score: 17 / 40

### Rating Scale

- 33-40: Production-ready UX
- 25-32: Solid prototype, minor gaps
- 17-24: **Structural issues need attention before user testing** ← Current
- 9-16: Fundamental rethinking needed
- 1-8: Concept stage only

---

## Top 3 Strengths

1. **The zoom pattern is genuinely novel and well-structured.** Workflow Board → Mission Detail → Execute Peek → Live View provides a coherent resolution hierarchy that no competitor offers. The URL structure mirrors it cleanly. This is the product's core differentiator and it works.

2. **The visual design system is cohesive and distinctive.** The `aw` token palette, tactical aesthetic (corner brackets, panel pins, dot grid, scanlines), and typography hierarchy (Orbitron/Rajdhani/IBM Plex) create a strong brand identity. Design tokens are consistently applied through CSS custom properties.

3. **Evidence-based trust over confidence scores.** The EvidenceRail, EvidenceCard, and VerificationBadge system aligns with CHI 2024 research showing outcome feedback builds better-calibrated trust than interpretability features. DiffByIntent grouping changes by acceptance criteria is a strong UX concept.

---

## Top 3 Weaknesses

1. **Action buttons are decorative, not functional.** The most critical UX failure: Pause/Play does nothing (sev-4), ApprovalBar buttons have no handlers, mission creation is a dead end, agent launch doesn't persist, escalation decisions reset on refresh. The prototype looks interactive but 3 of 7 core journeys terminate at non-functional buttons.

2. **Failure paths are systematically absent.** No ErrorBoundary, no form validation, no loading states, no network error handling, no confirmation dialogs, no undo. The EmptyState component exists but is never used. This means any user testing will produce false positives — the happy path looks good but the moment anything goes wrong, the experience collapses.

3. **Stage sub-navigation doesn't exist as a UI element.** The four mission stages (plan/execute/review/escalation) are the core lifecycle, but switching between them requires scrolling to the bottom of a long page to find text links. There is no tab bar, no horizontal nav, no persistent stage indicator. This is the single highest-impact missing component.

---

## Priority Fixes (ordered by impact)

| Priority | Fix                                                               | Impact                                    | Effort  | Source                                   |
| -------- | ----------------------------------------------------------------- | ----------------------------------------- | ------- | ---------------------------------------- |
| P0       | Add horizontal stage tab bar to all mission sub-pages             | Unlocks core lifecycle navigation         | Low     | Cognitive Walkthrough, Info Architecture |
| P0       | Add `ErrorBoundary` wrapping `<Outlet>` in AppShell and Live View | Prevents white-screen crashes             | Low     | Failure Path Audit                       |
| P0       | Wire ApprovalBar button handlers (even if mock)                   | Unblocks review journey                   | Low     | Journey Map, Heuristic Eval              |
| P1       | Add basic form validation to MissionCreate and WorkflowCreate     | Prevents empty submissions                | Low     | Failure Path Audit, Heuristic Eval       |
| P1       | Route notifications to stage-specific pages                       | Saves 2+ clicks per notification task     | Low     | Journey Map, Info Architecture           |
| P1       | Wire TopBar search icon to CommandPalette                         | Fixes broken affordance on every page     | Trivial | Heuristic Eval, Cognitive Walkthrough    |
| P1       | Fix `step.status === 'success'` → `'completed'`                   | Bug fix — checkmarks never render         | Trivial | Vocabulary Audit, State Model            |
| P1       | Use the existing EmptyState component (or delete it)              | Eliminates 7 ad-hoc patterns              | Medium  | Consistency Audit                        |
| P2       | Add `completed` terminal state to Mission Stage type              | Enables workflow completion               | Medium  | State Model, Conceptual Model            |
| P2       | Persist escalation decisions (not just useState)                  | Decisions survive refresh                 | Medium  | State Model, Journey Map                 |
| P2       | Decouple escalation from stage (make it an overlay)               | Fixes conceptual model confusion          | High    | Conceptual Model, Vocabulary Audit       |
| P2       | Make History/Costs pages link to missions                         | Eliminates dead-end pages                 | Low     | Info Architecture                        |
| P3       | Add notification badge to Live View mode                          | Prevents missed alerts during supervision | Medium  | Journey Map, Cognitive Walkthrough       |
| P3       | Differentiate LOW/MEDIUM risk badge colors                        | Currently near-identical                  | Trivial | State Model                              |
| P3       | Add onboarding/help for first-time users                          | Explains mission/workflow/stage concepts  | High    | Heuristic Eval, Cognitive Walkthrough    |
