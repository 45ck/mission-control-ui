# HCI Summary — Mission Control Prototype

**Date**: 2026-03-23
**Analyses completed**: 9 independent evaluations by specialist agents
**Total findings**: 200+ across conceptual model, state model, information architecture, vocabulary audit, user journeys, heuristic evaluation, cognitive walkthrough, consistency audit, and failure path audit
**Overall score**: 17/40 — structural issues need attention before user testing

---

## Context

Mission Control is a mission-centered agentic IDE — an orchestration and oversight tool for managing AI coding agents. It occupies the "orchestration/review" quadrant of the $3-13B agentic coding tools market. Its core differentiator is the **zoom pattern**: a coherent resolution hierarchy from portfolio overview (Workflow Board) through mission briefing (Mission Detail) to monitoring (Execute Peek) to direct supervision (Live View). No competitor offers this full lifecycle with structured planning, confidence-based escalation, risk-prioritized review, and real-time agent supervision.

The prototype implements the visual design, navigation structure, data model, and page layouts for this system. It uses static mock data (no backend), React Router v7, Framer Motion animations, and a distinctive tactical/military aesthetic built on the `aw` design token system.

Nine HCI evaluation methods were applied independently and their findings cross-referenced.

---

## Top 5 Confusion Risks

### 1. The prototype performs interactivity it doesn't have

The most dangerous UX failure is that buttons look clickable, respond to hover, and use action labels ("APPROVE", "PAUSE", "LAUNCH AGENT") — but produce no observable result or produce misleading feedback (empty-form creation shows a success toast). This will cause **false positives in user testing**: testers will think they completed tasks when they didn't. Three of seven core journeys dead-end at non-functional buttons.

**Source**: Journey Map (J2, J5, J7), Heuristic Eval (H-01, severity 4), Cognitive Walkthrough (J2-S3, J5-S4)

### 2. Stage navigation is invisible

The four-stage lifecycle (Plan → Execute → Review → Escalation) is the conceptual backbone, but **no persistent tab bar or horizontal nav exists** between stage sub-pages. Users must scroll past 8+ sections on MissionDetail to find text links at the page bottom. This means the core lifecycle — the product's reason to exist — is the hardest thing to navigate.

**Source**: Cognitive Walkthrough (J3-S3), Information Architecture (R2, R3), Heuristic Eval (H-12)

### 3. "Escalation" means two things

Escalation is simultaneously a lifecycle stage (mutually exclusive with plan/execute/review) and an entity noun (a decision point with options). A mission "in escalation" cannot also be "in review", but real-world escalations should overlay any stage. This creates confusion about whether clicking "Escalation" navigates to a stage or shows an alert.

**Source**: Conceptual Model (Ambiguity #3), Vocabulary Audit (Inconsistency #3), State Model (cross-entity coupling)

### 4. Failure paths don't exist

103 failure scenarios were audited; 79% are completely unhandled. No `ErrorBoundary`, no form validation, no loading indicators, no network error handling, no confirmation dialogs, no undo mechanism. The `EmptyState` component was built but never imported. When the prototype moves beyond happy paths — which real users immediately will — the experience collapses to blank screens, silent failures, or white-page crashes.

**Source**: Failure Path Audit (all categories), Consistency Audit (empty state patterns), Heuristic Eval (H-08, H-14)

### 5. Notifications route to the wrong place

`NotificationCenter.handleClick` navigates every notification to `/missions/${n.missionId}` (the overview page) regardless of notification type. Escalation alerts, agent failures, and approval requests all land on the same generic overview, forcing 2+ additional clicks to reach the relevant context. Combined with the buried stage navigation, this turns every notification into a scavenger hunt.

**Source**: Journey Map (J4, J7), Information Architecture (R6), Cognitive Walkthrough (J4-S2)

---

## Top 5 Design Invariants to Enforce

### 1. Every action button must produce observable feedback

No button should change visual state (hover, active) without producing a result the user can perceive — a navigation, a state change, an inline confirmation, or at minimum a clear "not yet implemented" indicator. The Pause/Play illusion is actively harmful.

### 2. Stage sub-pages must have persistent horizontal navigation

A tab bar showing Plan / Execute / Review / Escalation (with current stage highlighted) must appear on every mission sub-page. The current stage should be visually distinguished. This is non-negotiable — the lifecycle IS the product.

### 3. One entity, one name, everywhere

Each concept gets exactly one canonical name used in navigation, headings, badges, breadcrumbs, and code. Specifically: resolve "Workspace"/"Live View" ghost, "Escalation" stage/entity split, "Session" triple-overload, and evidence status tense drift.

### 4. Empty states use the EmptyState component

The existing `EmptyState` primitive must be adopted everywhere. Every list, rail, panel, and grid that can be empty must show: (a) what is empty, (b) why it might be empty, and (c) what to do about it. Delete the 7 ad-hoc patterns.

### 5. Failure paths are designed, not afterthoughts

At minimum: `ErrorBoundary` wrapping all route outlets, form validation preventing empty submissions, disabled states using the HTML `disabled` attribute (not just CSS), and confirmation dialogs before irreversible actions (approve, reject, launch agent, escalation decisions).

---

## Top 5 Implementation Priorities

### P0 — Unblock user testing (do these before any testing session)

1. **Add stage tab bar component** — Horizontal nav with Plan/Execute/Review/Escalation tabs, current stage highlighted, rendered on all mission sub-pages. Estimated: 1 component + 5 page integrations.

2. **Add `ErrorBoundary`** — Wrap `<Outlet>` in AppShell and wrap Live View's root. Catch-all with "Something went wrong" message and "Back to Missions" link. Estimated: 1 component + 2 integrations.

3. **Wire critical button handlers** — Even with mock implementations: ApprovalBar (approve/reject/re-plan should navigate or show confirmation), MissionCreate (redirect to new mission after creation), AgentChatPanel Pause/Play (toggle visual state at minimum).

### P1 — Fix the interaction model

4. **Route notifications to stage-appropriate pages** — Map notification types to target routes: `stage-change` → overview, `escalation` → `/escalation`, `agent-failure` → `/execute`, `approval` → `/review`, `evidence` → `/review`.

5. **Add form validation** — Required fields marked, empty submission prevented, inline error messages. Both MissionCreate and WorkflowCreate. Also add `disabled` HTML attribute to ApprovalBar when `canApprove` is false.

### P2 — Complete the data model

6. **Add `completed` state to Mission Stage** — Without a terminal state, no mission can finish, no workflow can complete, and History is meaningless. Add `'completed'` to the Stage union, a `CompletedBadge` variant, and transition logic from review → completed.

7. **Persist escalation decisions** — Move ConsequencePanel state from `useState` to the data model. Decisions should survive page refresh and cascade to update parent mission state.

8. **Fix the `step.status === 'success'` bug** — Change to `'completed'` in `MissionExecute.tsx:234`. The checkmark indicator currently never renders.

---

## Open Assumptions and Unknowns

1. **Is "escalation" a stage or an event?** The conceptual model, vocabulary audit, and state model all flag this as the deepest structural ambiguity. The recommendation is to decouple escalation from the stage lifecycle and make it an overlay — but this is an architectural decision that changes the data model, routing, and Kanban board design.

2. **Should the default landing be Missions or Workflows?** LeftNav lists Workflows first but `/` redirects to `/missions`. The Information Architecture and Cognitive Walkthrough disagree on which is correct — it depends on whether the typical user manages one workflow or many.

3. **What persistence model will replace static mock data?** Many failure path findings (no loading states, no error handling, no auto-save) are partially explained by the prototype's static nature. But the failure path DESIGN should be visible even in a prototype — loading skeletons, error boundaries, and validation rules communicate intent to testers and implementors.

4. **How should Live View handle notifications?** Live View exits AppShell entirely, severing access to NotificationCenter. The calm-by-default philosophy says "don't interrupt during supervision" but the zoom pattern says "escalations must surface everywhere." These are in tension. Options: notification badge on Live View header, ambient status indicator, or batched alerts on Live View exit.

5. **Is the military/tactical metaphor helping or hurting?** "Mission", "escalation", "stage", tactical aesthetic — these create strong brand identity but may alienate users expecting IDE vocabulary. No user research has been conducted. The Cognitive Walkthrough's first-encounter analysis suggests a brief onboarding tooltip or "What is Mission Control?" explanation would resolve this without abandoning the metaphor.

---

## Cross-Reference: Findings That Multiple Analyses Agree On

| Finding                              | Analyses That Found It                                           | Confidence                     |
| ------------------------------------ | ---------------------------------------------------------------- | ------------------------------ |
| Stage navigation buried / no tab bar | Cognitive Walkthrough, Info Architecture, Heuristic Eval         | Very High                      |
| Notifications route to wrong page    | Journey Map, Info Architecture, Cognitive Walkthrough            | Very High                      |
| Action buttons non-functional        | Journey Map, Heuristic Eval, Cognitive Walkthrough, Failure Path | Very High                      |
| `step.status === 'success'` bug      | Vocabulary Audit, State Model                                    | High (confirmed independently) |
| Escalation dual identity             | Conceptual Model, Vocabulary Audit, State Model                  | High                           |
| EmptyState component unused          | Consistency Audit, Failure Path Audit                            | High                           |
| No ErrorBoundary                     | Failure Path Audit, Heuristic Eval                               | High                           |
| Mission lacks terminal state         | State Model, Conceptual Model                                    | High                           |
| History/Costs are dead-end pages     | Info Architecture, Cognitive Walkthrough                         | High                           |
| Form validation absent               | Failure Path Audit, Heuristic Eval, Cognitive Walkthrough        | High                           |
| Search icon not wired                | Journey Map, Heuristic Eval, Cognitive Walkthrough               | High                           |
| Escalation decisions ephemeral       | State Model, Journey Map                                         | High                           |
| Priority field invisible             | Conceptual Model, State Model                                    | Medium                         |
| LOW/MEDIUM risk near-identical       | State Model, Consistency Audit                                   | Medium                         |

---

## Deliverables Index

| File                                   | Method                                          | Size |
| -------------------------------------- | ----------------------------------------------- | ---- |
| `docs/hci/conceptual-model.md`         | Actors, objects, actions, states, rules         | 34KB |
| `docs/hci/state-model.md`              | State machines, transitions, UI coverage        | 54KB |
| `docs/hci/information-architecture.md` | Sitemap, navigation, grouping, labels           | 34KB |
| `docs/hci/glossary.md`                 | Vocabulary audit, canonical terms, status vocab | 34KB |
| `docs/hci/user-journeys.md`            | 7 journey maps with Mermaid flowcharts          | 41KB |
| `docs/hci/heuristic-evaluation.md`     | 24 findings across 10 Nielsen heuristics        | 34KB |
| `docs/hci/cognitive-walkthrough.md`    | 5 journey walkthroughs, Q1-Q4 per step          | 50KB |
| `docs/hci/consistency-audit.md`        | 28 invariants, screen inventory                 | 35KB |
| `docs/hci/failure-path-audit.md`       | 103 failure paths across 8 categories           | 35KB |
| `docs/hci/hci-scorecard.md`            | 8-dimension scoring, priority fixes             | 6KB  |
| `docs/hci/hci-summary.md`              | This document                                   | —    |
