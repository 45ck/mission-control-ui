# HCI Summary -- Mission Control Prototype

**Date**: 2026-03-24
**Analyses completed**: 11 independent evaluations -- conceptual model, state model, vocabulary audit (glossary), information architecture, user journeys, consistency audit, failure path audit, heuristic evaluation, cognitive walkthrough, HCI scorecard
**Overall score**: 20/40 -- structural issues need attention before user testing
**Pain points evaluated**: A (Inline Agent Visibility), B (Mode Switching), C (Rich Plan Content), D (Demo/Deliverable Artifacts)

---

## Context

Mission Control is a prototype "operating surface" for reviewing, approving, and coordinating agentic software engineering work. It is built as a React SPA with static mock data (5 missions, 3 workflows, 6 artifacts, no backend). The prototype demonstrates the core supervision lifecycle: plan, execute, review, escalation, with a fullscreen LiveView for real-time agent monitoring.

This summary synthesizes findings from 11 HCI review documents, each examining the prototype from a different analytical lens. All findings reference concrete source file locations in `apps/web/src/`.

---

## Top 5 Risks (Ranked by Impact)

### Risk 1: Agent Work Visibility Gap (CRITICAL)

**Impact**: Catastrophic -- prevents the core use case
**Pain Points**: A (Inline Agent Visibility), B (Mode Switching)

The primary job of a Mission Control operator is to monitor what AI agents are doing. Currently, this requires navigating from MissionHome to MissionDetail to either the Execute page (partial view) or a fullscreen LiveView (complete view but total context loss). There is no inline, split-panel, or picture-in-picture mode.

The Execute page (`MissionExecute.tsx:207-294`) shows agent swimlanes and a 320px "EXECUTE PREVIEW" with an agent log and code viewer. This is a fundamentally different component from LiveView's `WorkspaceLayout` (`WorkspaceLayout.tsx:47-77`), which includes a file tree, full code viewer, browser preview, terminal emulator, and agent chat panel. Users encounter two different representations of agent work with no explanation of why they differ.

LiveView (`App.tsx:48-49`) is defined outside the AppShell router element, making it architecturally orphaned. Entering LiveView discards all navigation context (LeftNav, TopBar, StageTabBar). The cognitive walkthrough (Journey 1) found that checking acceptance criteria while monitoring an agent requires exiting LiveView entirely -- a critical breakdown.

**Evidence**:

- heuristic-evaluation.md: H1 Visibility of System Status, Severity 4 (Catastrophe)
- cognitive-walkthrough.md: Journey 1, Steps 1.4A-1.5 -- 3 breakdowns including 1 Critical
- user-journeys.md: "Check what agent is doing" takes 4+ clicks and forces fullscreen context switch
- information-architecture.md: LiveView is architecturally disconnected from AppShell
- conceptual-model.md: "Monitor agent work" is a primary action hidden behind fullscreen mode switch
- state-model.md: No "viewing" substate exists for the mission lifecycle

### Risk 2: Completed Stage Is Unexercised (HIGH)

**Impact**: Major -- terminal mission state has no dedicated UX, no deliverable artifacts
**Pain Point**: D (Demo/Deliverable Artifacts)

The `Stage` type includes `'completed'` (`data/missions.ts:2`), but zero of the 5 missions have this stage. The `ActivityPreview` component gates `ArtifactPanel` rendering on `isCompleted` (`ActivityPreview.tsx:47`), which evaluates to true for both 'completed' and 'review' stages. However, there is no completed-specific UI: no completion summary, no deliverable sign-off workflow, no stakeholder notification, no "mission accomplished" view.

The 6 artifacts in the data layer (`data/artifacts.ts:15-154`) are tied to review-stage missions. Even if a completed mission existed, artifacts would be buried inside `ActivityPreview` on the MissionDetail page -- not a first-class navigation target. There is no DELIVERABLES tab in `StageTabBar` and no route for `/missions/:id/deliverables`.

**Evidence**:

- cognitive-walkthrough.md: Journey 3 -- 2 High-severity breakdowns (B4, B5)
- failure-path-audit.md: Completed stage never exercised
- state-model.md: Completed stage has zero UI coverage
- heuristic-evaluation.md: H9 -- completed stage gap contributes to error recovery severity

### Risk 3: Plan Content Is Plain Text (MEDIUM-HIGH)

**Impact**: Significant -- undermines the plan review workflow
**Pain Point**: C (Rich Plan Content)

Plan content (goal, scope, criteria, risks) renders as raw text interpolation: `{mission.goal}` in `MissionPlan.tsx:108`. There is no markdown rendering, no headings, no code blocks, no tables, no embedded media. This makes longer plans difficult to scan.

A capable `MarkdownViewer` component already exists (`MarkdownViewer.tsx:11-21`) that supports h1-h3 headings, code blocks, unordered lists, bold, italic, inline code, and table rendering. It is used inside `ArtifactPanel` (`ArtifactPanel.tsx:104-109`) for markdown-type artifacts. The component is proven and ready for reuse -- it simply is not wired to plan content.

**Evidence**:

- heuristic-evaluation.md: H6 Recognition Rather Than Recall, Severity 2
- cognitive-walkthrough.md: Journey 2, Step 2.3 -- Medium-severity breakdown (B6)
- conceptual-model.md: Plan document should be an artifact type
- glossary.md: "Plan" conflates stage and content

### Risk 4: Inconsistent Action Patterns (MEDIUM)

**Impact**: Moderate -- creates confusion about where to find approval/decision controls

Action buttons for approve/reject/escalation decisions are placed inconsistently across the three review surfaces:

| Page              | Component        | Placement                              | File Reference                  |
| ----------------- | ---------------- | -------------------------------------- | ------------------------------- |
| MissionPlan       | Inline buttons   | Bottom of content, left-aligned        | `MissionPlan.tsx:165-188`       |
| MissionReview     | ApprovalBar      | Sticky bar at top, right-aligned       | `ApprovalBar.tsx:19-91`         |
| MissionEscalation | ConsequencePanel | Right rail (300px), stacked vertically | `MissionEscalation.tsx:189-201` |

Evidence rail widths also vary: 280px on Plan, 260px on Execute, 300px on Escalation. These inconsistencies mean users must re-learn where to find the primary action on each page.

**Evidence**:

- heuristic-evaluation.md: H4 Consistency and Standards, Severity 2
- consistency-audit.md: Action button placement documented across all review surfaces
- consistency-audit.md: Evidence rail width inconsistencies

### Risk 5: LiveView Is Architecturally Orphaned (MEDIUM)

**Impact**: Moderate -- creates structural problems that ripple through multiple heuristics

LiveView routes (`App.tsx:48-49`) are defined outside the `AppShell` element tree. This means:

1. No LeftNav navigation is available in LiveView
2. No TopBar breadcrumbs are available (LiveView has its own minimal header)
3. No ErrorBoundary wraps LiveView (the AppShell ErrorBoundary at `AppShell.tsx:85-87` only wraps `<Outlet />`)
4. LeftNav does not include a LiveView link (`LeftNav.tsx:6-12` -- no LiveView entry)
5. Command palette does not include LiveView targets (`CommandPalette.tsx:14-20`)

**Evidence**:

- information-architecture.md: LiveView architecturally disconnected from AppShell
- heuristic-evaluation.md: H9 -- no error recovery in LiveView (Severity 3)
- heuristic-evaluation.md: H7 -- LiveView not in command palette (Severity 2)
- cognitive-walkthrough.md: Journey 1, Step 1.4B -- context loss breakdown

---

## Design Invariants

These rules should hold across all future development of Mission Control:

### Invariant 1: Agent work must be viewable from any mission page without leaving AppShell

The user must never be forced to abandon their navigation context to see what an agent is doing. An inline preview, split panel, or collapsible workspace must be available on mission detail and execute pages within the AppShell layout.

**Rationale**: Risks 1 and 5. Cognitive walkthrough Journey 1 demonstrates that the current fullscreen-only model creates 3 breakdowns including 1 Critical.

### Invariant 2: All mission stages must have dedicated, exercised UI states

Every value of the `Stage` type -- including 'completed' -- must have at least one instance in the data layer and a dedicated or specialized page/view. Untested stages are design debt.

**Rationale**: Risk 2. The completed stage is the terminal state of every mission but has zero coverage.

### Invariant 3: Plan content must render as rich markdown

Plan documents must be rendered using `MarkdownViewer` (or equivalent) with support for headings, code blocks, tables, lists, and embedded media. Raw text interpolation (`{mission.goal}`) is not acceptable for content that users must review and approve.

**Rationale**: Risk 3. The MarkdownViewer component already exists and is proven.

### Invariant 4: Action buttons must follow a consistent placement pattern across all review/approval surfaces

All pages where users approve, reject, or make decisions must use the same visual pattern for primary actions. Recommendation: sticky bar at top (ApprovalBar pattern) for all review surfaces, with actions right-aligned.

**Rationale**: Risk 4. Three different placement patterns across three review surfaces.

### Invariant 5: Artifacts must be accessible from completed missions, not just review

Artifacts should be a first-class navigation target (own tab or route) available on any mission that has artifacts, regardless of current stage. The current gate (`isCompleted = mission.stage === 'completed' || mission.stage === 'review'`) is too restrictive.

**Rationale**: Risk 2. Artifacts are buried inside `ActivityPreview` and only visible in review/completed stages.

### Invariant 6: Navigation context must persist across mode switches

If the system offers a "fullscreen" or "focused" mode, returning to the previous context must be instantaneous and the user's place in the navigation hierarchy must be preserved. Breadcrumbs, scroll position, and selected items should survive mode transitions.

**Rationale**: Risk 5. LiveView exit goes to the execute page, not to wherever the user entered from.

---

## Priority Matrix: Impact vs Effort

```
                          HIGH IMPACT
                              |
                    [1] Inline     [2] Completed
                    agent view     stage UX
                    (A, B)         (D)
                              |
   HIGH EFFORT -----+---------+--------+---- LOW EFFORT
                    |         |        |
                    [5] Rearch.   [3] Markdown
                    LiveView      plans (C)
                    into AppShell |
                              |
                    [7] Accessib. [4] Consistent
                    improvements  action buttons
                              |
                    [8] Offline   [6] LiveView in
                    handling      cmd palette
                              |
                    [10] Perm-    [9] Confirm
                    ission model  dialogs
                              |
                          LOW IMPACT
```

| #   | Improvement                                     | Impact    | Effort    | Priority |
| --- | ----------------------------------------------- | --------- | --------- | -------- |
| 1   | Inline agent preview panel within AppShell      | Very High | High      | **P0**   |
| 2   | Completed stage UX with deliverables            | High      | Medium    | **P1**   |
| 3   | Render plan content as markdown                 | High      | Low       | **P1**   |
| 4   | Standardize action button placement             | Medium    | Low       | **P2**   |
| 5   | Rearchitect LiveView inside AppShell            | Very High | Very High | **P2**   |
| 6   | Add LiveView to command palette and LeftNav     | Medium    | Low       | **P2**   |
| 7   | ARIA landmarks, skip nav, screen reader support | Medium    | Medium    | **P2**   |
| 8   | Offline detection and handling                  | Low       | Medium    | **P3**   |
| 9   | Confirmation dialogs for destructive actions    | Low       | Low       | **P3**   |
| 10  | Permission model and role-based access          | Low       | High      | **P3**   |

---

## Assumptions and Limitations

1. **Static data only.** All 5 missions, 3 workflows, and 6 artifacts are statically imported. There is no API layer, no WebSocket connections, no real-time updates. Findings about "real-time visibility" are based on the UI structure's readiness for real-time data, not actual performance.

2. **Prototype stage.** This is v0.1.0. Missing features (CRUD operations, permission model, offline handling) are expected for a prototype and are noted but not heavily penalized.

3. **No real agents.** No actual AI agents are connected. Agent sessions, steps, browser sessions, and terminal sessions are all mock data. The LiveView `WorkspaceLayout` renders static snapshots, not live feeds.

4. **No backend.** There is no server, no database, no authentication. Actions (approve, reject, escalation decisions) trigger toast notifications but perform no state changes.

5. **Single-user evaluation.** These analyses assume a single tech-lead user. Multi-user collaboration patterns (concurrent reviewers, role-based views, notification routing) are out of scope.

6. **Desktop only.** No responsive design evaluation was performed. The prototype uses fixed widths (200px LeftNav, 360px mission list, 260-300px evidence rails) that would not adapt to mobile or tablet viewports.

7. **Color contrast not formally tested.** The observation that `aw.textSoft` (#93999c) on `aw.paperTop` (#f7f8f8) may fail WCAG AA is based on visual inspection, not automated tooling. A formal contrast audit should be performed.

---

## Recommended Next Steps

### Step 1: Add inline agent preview (P0, 1-2 weeks)

Create a `LivePreview` component that embeds a configurable subset of `WorkspaceLayout` (at minimum: terminal + agent chat + code viewer) inside the Execute page within AppShell. Add a Cmd+Shift+L keyboard shortcut to toggle it. This directly addresses the #1 risk (agent visibility gap) and the #1 heuristic violation (H1, Severity 4).

**Files to modify**:

- `apps/web/src/pages/MissionExecute.tsx` -- replace EXECUTE PREVIEW with embeddable LivePreview
- `apps/web/src/components/workspace/WorkspaceLayout.tsx` -- make configurable/embeddable
- `apps/web/src/components/shell/AppShell.tsx` -- add Cmd+Shift+L shortcut

### Step 2: Exercise the completed stage (P1, 3-5 days)

Add 1-2 completed missions to the static data. Create a completed-stage view in MissionDetail (or a new MissionCompleted page) with deliverable gallery, completion summary, and sign-off controls. Add DELIVERABLES tab to StageTabBar for missions with artifacts.

**Files to modify**:

- `apps/web/src/data/missions.ts` -- add completed mission(s)
- `apps/web/src/pages/MissionDetail.tsx` -- completed-specific rendering
- `apps/web/src/components/mission/StageTabBar.tsx` -- add DELIVERABLES tab
- `apps/web/src/components/mission/ActivityPreview.tsx` -- remove stage gate on ArtifactPanel

### Step 3: Render plans as markdown (P1, 1-2 days)

Change plan content fields (goal, scope, criteria) to markdown strings and render them using the existing `MarkdownViewer` component. This is the highest-impact, lowest-effort improvement available.

**Files to modify**:

- `apps/web/src/pages/MissionPlan.tsx:107-109` -- use `<MarkdownViewer content={mission.goal} />` instead of `{mission.goal}`
- Similar changes for scope and risks sections

### Step 4: Standardize action patterns and close accessibility gaps (P2, 1 week)

Adopt the `ApprovalBar` pattern (sticky top bar, right-aligned actions) for all review surfaces. Normalize evidence rail widths to 280px. Add ARIA landmarks, skip navigation, and aria-live for toasts.

**Files to modify**:

- `apps/web/src/pages/MissionPlan.tsx` -- replace inline buttons with ApprovalBar
- `apps/web/src/pages/MissionEscalation.tsx` -- move decisions to top bar
- `apps/web/src/components/shell/AppShell.tsx` -- add skip nav, aria-label on main
- `apps/web/src/components/primitives/ToastContainer.tsx` -- add aria-live

### Step 5: Integrate LiveView into AppShell (P2, 1-2 weeks)

Move LiveView routes inside the AppShell element tree in `App.tsx`. Render LiveView as a maximized panel that preserves LeftNav (collapsed) and TopBar (minimal). Add LiveView entries to the command palette and an indicator in LeftNav for missions with active agents.

**Files to modify**:

- `apps/web/src/App.tsx:46-49` -- move LiveView routes inside AppShell children
- `apps/web/src/components/shell/LeftNav.tsx` -- add LiveView indicator
- `apps/web/src/components/shell/CommandPalette.tsx` -- add LiveView entries

---

## Cross-Reference Index

| Document                    | Section               | Key Finding                                                                              |
| --------------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| conceptual-model.md         | Purpose of the System | "Monitor agent work" is a primary action hidden behind fullscreen mode switch            |
| conceptual-model.md         | Jobs-to-be-done       | Plan document should be an artifact type                                                 |
| state-model.md              | Mission entity        | No "viewing" substate; completed stage has zero UI coverage                              |
| glossary.md                 | Terminology audit     | "Live View" / "workspace" / "supervision mode" drift; "Plan" conflates stage and content |
| information-architecture.md | Sitemap               | LiveView is architecturally disconnected from AppShell -- orphan page                    |
| information-architecture.md | Navigation patterns   | No LiveView in LeftNav or command palette                                                |
| user-journeys.md            | Journey 3             | "Check what agent is doing" takes 4+ clicks, forces fullscreen context switch            |
| user-journeys.md            | Journey 5             | "Review and approve" journey notes difficulty scanning plain text plans                  |
| consistency-audit.md        | Screen inventory      | Action buttons placed inconsistently across review surfaces                              |
| consistency-audit.md        | Layout patterns       | Evidence rail widths vary: 260px, 280px, 300px                                           |
| consistency-audit.md        | Agent views           | Execute page partial view vs LiveView full view -- confusing split                       |
| failure-path-audit.md       | Empty states          | Completed stage never exercised; missing error guidance                                  |
| failure-path-audit.md       | Error recovery        | LiveView has no ErrorBoundary; no confirmation dialogs                                   |
| heuristic-evaluation.md     | H1                    | Visibility of system status -- Severity 4 (Catastrophe)                                  |
| heuristic-evaluation.md     | H3                    | User control and freedom -- Severity 3 (Major)                                           |
| heuristic-evaluation.md     | H9                    | Error recovery -- Severity 3 (Major)                                                     |
| heuristic-evaluation.md     | H6                    | Recognition over recall -- Severity 2 (plan content)                                     |
| cognitive-walkthrough.md    | Journey 1             | 3 breakdowns (1 Critical, 2 High) in "check agent work"                                  |
| cognitive-walkthrough.md    | Journey 2             | 1 breakdown (Medium) in "approve plan"                                                   |
| cognitive-walkthrough.md    | Journey 3             | 2 breakdowns (both High) in "view deliverables"                                          |
| hci-scorecard.md            | Scores                | 20/40 overall; Efficiency and Completeness are weakest (both 2/5)                        |
| hci-scorecard.md            | Top 3 to improve      | Efficiency, Completeness, Accessibility                                                  |
