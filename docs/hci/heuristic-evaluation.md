# Heuristic Evaluation: Mission Control Prototype

**Evaluator**: HCI Expert (Nielsen's 10 Usability Heuristics)
**Date**: 2026-03-24
**Artifact version**: v0.1.0 (static prototype, no backend)
**Method**: Code-level inspection of all pages, components, routes, data models, and interaction flows
**User pain points under evaluation**: A (Inline Agent Visibility), B (Mode Switching), C (Rich Plan Content), D (Demo/Deliverable Artifacts)

---

## Evaluation Matrix

| #   | Heuristic                                               | Severity             | Pain Points |
| --- | ------------------------------------------------------- | -------------------- | ----------- |
| H1  | Visibility of system status                             | **4 -- Catastrophe** | A           |
| H2  | Match between system and real world                     | **1 -- Cosmetic**    | --          |
| H3  | User control and freedom                                | **3 -- Major**       | B           |
| H4  | Consistency and standards                               | **2 -- Minor**       | A, B        |
| H5  | Error prevention                                        | **1 -- Cosmetic**    | --          |
| H6  | Recognition rather than recall                          | **2 -- Minor**       | C           |
| H7  | Flexibility and efficiency of use                       | **2 -- Minor**       | A, B        |
| H8  | Aesthetic and minimalist design                         | **1 -- Cosmetic**    | --          |
| H9  | Help users recognize, diagnose, and recover from errors | **3 -- Major**       | --          |
| H10 | Help and documentation                                  | **1 -- Cosmetic**    | --          |

**Severity scale**: 0 = not a problem, 1 = cosmetic, 2 = minor usability problem, 3 = major usability problem, 4 = usability catastrophe (must fix before release)

---

## H1: Visibility of System Status

> _The design should always keep users informed about what is going on, through appropriate feedback within reasonable time._

### Severity: 4 -- Usability Catastrophe

### Pain Point Mapping: A (Inline Agent Visibility)

### What works

1. **Stage badges** communicate mission lifecycle position clearly. `StageBadge` renders the current stage with color coding on every mission card and detail page.
   - File: `apps/web/src/components/mission/StageBadge.tsx`

2. **LeftNav bottom status** shows active mission count and review count at a glance, providing a persistent summary.
   - File: `apps/web/src/components/shell/LeftNav.tsx:110-119`

3. **Evidence summary** on `MissionDetail` shows pass/fail/warning counts, giving a quick verification pulse.
   - File: `apps/web/src/pages/MissionDetail.tsx:209-220`

4. **Agent session counts** are shown on the Execute page, with "X agents running" indicators.
   - File: `apps/web/src/pages/MissionExecute.tsx:306-310`

5. **LiveView header bar** shows active agent count and branch name.
   - File: `apps/web/src/pages/LiveView.tsx:86-90`

6. **Toast notifications** provide immediate feedback for approval, rejection, and re-plan actions.
   - File: `apps/web/src/pages/MissionPlan.tsx:174` (plan approval toast)
   - File: `apps/web/src/pages/MissionReview.tsx:71` (review action toast)

### What fails

1. **CRITICAL: No inline agent work visibility.** The primary job of a supervisor -- "see what the agent is doing right now" -- requires leaving the AppShell entirely and entering a fullscreen LiveView (`/missions/:id/live`). There is no inline panel, split view, or picture-in-picture mode that shows live agent work within the normal navigation context.
   - File: `apps/web/src/App.tsx:48-49` -- LiveView routes are defined OUTSIDE the AppShell element tree
   - File: `apps/web/src/pages/LiveView.tsx:170-204` -- entire page is `h-screen flex-col`, fully standalone

2. **MissionHome cards show no agent progress.** The `MissionCard` component displays stage, risk, and title, but no indicator of how far along an executing mission is. No progress bar, no percentage, no "last agent action 30s ago" timestamp.
   - File: `apps/web/src/pages/MissionHome.tsx:184-190` -- card renders with no progress data

3. **Execute page shows partial agent status but no live workspace.** The Execute page (`MissionExecute`) has agent swimlanes (log entries) and a code preview, but these are NOT the same as the LiveView's `WorkspaceLayout` which includes file tree, browser preview, terminal emulator, and chat panel. A user seeing the Execute page might believe they have full visibility, but they are seeing a reduced, static-looking view.
   - File: `apps/web/src/pages/MissionExecute.tsx:207-294` -- "EXECUTE PREVIEW" grid with agent log + code viewer
   - Contrast with: `apps/web/src/components/workspace/WorkspaceLayout.tsx:47-77` -- full 3-column, 2-row grid with FileTree, CodeViewer, BrowserPreview, TerminalEmulator, AgentChatPanel

4. **No real-time indicators.** Since all data is static, there are no WebSocket connections, polling, or optimistic updates. But even the UI structure does not include placeholders for real-time status (no spinning indicators, no "last updated" timestamps on agent activity, no heartbeat indicators).

### Cross-references

- **conceptual-model.md**: "Monitor agent work" identified as a primary action hidden behind fullscreen mode switch
- **state-model.md**: No "viewing" substate exists for mission lifecycle
- **information-architecture.md**: LiveView is architecturally disconnected from AppShell -- an orphan page
- **user-journeys.md**: "Check what agent is doing" journey requires 4+ clicks and forces fullscreen context switch

---

## H2: Match Between System and Real World

> _The design should speak the users' language. Use words, phrases, and concepts familiar to the user._

### Severity: 1 -- Cosmetic

### What works

1. **"Mission" metaphor** is effective and well-executed. The military/space-operations framing (missions, escalations, evidence, supervision) creates a coherent domain language that maps well to the high-stakes nature of delegating code changes to AI agents.
   - File: `apps/web/src/data/missions.ts:8-35` -- Mission type is well-structured with familiar software concepts (goal, scope, acceptance criteria, risks)

2. **Stage lifecycle** (plan, execute, review, escalation) maps naturally to software development workflows that tech leads already understand.
   - File: `apps/web/src/components/mission/StageTabBar.tsx:4-10` -- stages array with clear labels

3. **Evidence** terminology correctly evokes quality assurance and verification concepts familiar to engineering leads.
   - File: `apps/web/src/data/evidence.ts`

4. **Risk tier** (low/medium/high) and **verification state** (pending/passing/failing/blocked) use standard engineering language.
   - File: `apps/web/src/data/missions.ts:2-4`

### What could improve

1. **"Escalation" conflation.** Escalation serves as both a stage (`stage: 'escalation'`) and an overlay flag (`escalationActive: boolean`). The `@deprecated` comment on the Stage type (line 1 of `missions.ts`) acknowledges this is changing, but the UI still treats it as a stage in `StageTabBar`.
   - File: `apps/web/src/data/missions.ts:1` -- `/** @deprecated 'escalation' as a stage is being replaced by the escalationActive overlay flag */`

2. **"Live View" vs "Supervision Mode" vs "Workspace"** terminology drift. The banner says "LIVE SUPERVISION MODE" (line 176 of `LiveView.tsx`), the links say "ENTER LIVE VIEW", and the underlying component is `WorkspaceLayout`. Three different names for one concept.
   - File: `apps/web/src/pages/LiveView.tsx:176` -- "LIVE SUPERVISION MODE"
   - File: `apps/web/src/pages/MissionDetail.tsx:294` -- "ENTER LIVE VIEW"
   - File: `apps/web/src/components/workspace/WorkspaceLayout.tsx` -- "WorkspaceLayout" component name

### Cross-references

- **glossary.md**: Documented "Live View" vs "workspace" vs "supervision mode" terminology drift
- **glossary.md**: "Plan" conflates stage and content type

---

## H3: User Control and Freedom

> _Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process._

### Severity: 3 -- Major Usability Problem

### Pain Point Mapping: B (Mode Switching)

### What works

1. **LiveView exit mechanisms** are present and discoverable:
   - Esc key handler: `apps/web/src/pages/LiveView.tsx:106-109`
   - "Press Esc to exit" label: `apps/web/src/pages/LiveView.tsx:177`
   - X button in header bar: `apps/web/src/pages/LiveView.tsx:178-184`
   - "Back" link to execute page: `apps/web/src/pages/LiveView.tsx:43-50`

2. **Breadcrumb navigation** on TopBar provides context and back-navigation on all AppShell pages.
   - File: `apps/web/src/components/shell/TopBar.tsx:80-107`

3. **"Back to mission" links** appear consistently on sub-pages (Plan, Execute, Review, Escalation).
   - File: `apps/web/src/pages/MissionPlan.tsx:85-96`
   - File: `apps/web/src/pages/MissionExecute.tsx:100-111`
   - File: `apps/web/src/pages/MissionReview.tsx:107-118`
   - File: `apps/web/src/pages/MissionEscalation.tsx:116-127`

4. **Escalation undo** is the one action with an undo mechanism. The `ConsequencePanel` supports an undo callback via toast.
   - File: `apps/web/src/pages/MissionEscalation.tsx:194-198`

### What fails

1. **MAJOR: No quick toggle between supervisory and agent/dev modes.** Entering LiveView is a full page navigation that leaves the AppShell entirely. Re-entering requires navigating back through MissionDetail or Execute. There is no toggle, no split-view, no "peek" mode.
   - File: `apps/web/src/App.tsx:48-49` -- LiveView routes outside AppShell
   - File: `apps/web/src/pages/MissionExecute.tsx:182-193` -- "ENTER LIVE VIEW" is a navigation Link, not a toggle

2. **No undo for plan approval.** Clicking "Approve Plan & Begin Execution" triggers a toast but performs an irreversible (conceptual) state change. No confirmation dialog, no undo.
   - File: `apps/web/src/pages/MissionPlan.tsx:166-177` -- onClick directly calls `show()` toast

3. **No undo for review approve/reject.** Same pattern: toast-only feedback, no confirmation step.
   - File: `apps/web/src/pages/MissionReview.tsx:61-72` -- `handleAction` directly fires toast

4. **LiveView re-entry cost.** After exiting LiveView via Esc, re-entering requires: navigate to mission detail or execute page, scroll to find "ENTER LIVE VIEW" link, click it. This is a 3-step process for what should be a quick toggle.
   - File: `apps/web/src/pages/LiveView.tsx:101-103` -- exit always goes to execute page

5. **No keyboard shortcut for LiveView.** While Cmd+K (command palette) and Cmd+Shift+M (mission switcher) exist, there is no keyboard shortcut to enter or re-enter LiveView for the current mission.
   - File: `apps/web/src/components/shell/AppShell.tsx:38-53` -- only Cmd+K and Cmd+Shift+M registered

### Cross-references

- **user-journeys.md**: Journey 3 "Monitor Active Agents" documents the heavy context-switch cost
- **information-architecture.md**: LiveView is an orphan page outside AppShell hierarchy
- **consistency-audit.md**: Mode switching is a full page transition, not a panel toggle

---

## H4: Consistency and Standards

> _Users should not have to wonder whether different words, situations, or actions mean the same thing._

### Severity: 2 -- Minor Usability Problem

### Pain Point Mapping: A, B

### What works

1. **Design system consistency.** The `aw` token system is applied consistently across all pages. Colors, typography classes (`aw-micro`, `aw-section`, `aw-body`), and spacing follow a coherent pattern.
   - File: `apps/web/src/theme/tokens.ts:1-44`

2. **`StageTabBar`** provides consistent stage navigation across all mission sub-pages (detail, plan, execute, review, escalation).
   - File: `apps/web/src/components/mission/StageTabBar.tsx:14-50`

3. **TopBar** structure is consistent across all AppShell pages: breadcrumbs, mission switcher, search, notifications, avatar.
   - File: `apps/web/src/components/shell/TopBar.tsx:14-134`

4. **"Not found" states** are handled on every mission page with consistent messaging.
   - File: `apps/web/src/pages/MissionDetail.tsx:36-49`
   - File: `apps/web/src/pages/MissionPlan.tsx:31-55`
   - File: `apps/web/src/pages/MissionExecute.tsx:36-60`

### What fails

1. **Action button placement is inconsistent across review surfaces.**
   - `MissionPlan.tsx:165-188`: Approve/Request Changes buttons are at the bottom of the main content area, left-aligned
   - `MissionReview.tsx` via `ApprovalBar.tsx:19-91`: Approve/Reject/Re-plan buttons are in a sticky bar at the top of the page, right-aligned
   - `MissionEscalation.tsx` via `ConsequencePanel.tsx`: Decision buttons are in the right rail

2. **Evidence rail widths differ across pages.**
   - `MissionPlan.tsx:193`: `w-[280px]` right rail
   - `MissionExecute.tsx:342`: `w-[260px]` right rail
   - `MissionEscalation.tsx:189`: `w-[300px]` right rail

3. **Two different agent views create a conceptual split.** The Execute page shows a partial agent view (swimlanes + condensed log + code preview at 320px height), while LiveView shows a full `WorkspaceLayout` (file tree + code viewer + browser preview + terminal emulator + agent chat in a grid). These are different components rendering different data views of the same underlying concept.
   - File: `apps/web/src/pages/MissionExecute.tsx:207-294` -- partial view
   - File: `apps/web/src/components/workspace/WorkspaceLayout.tsx:47-77` -- full view

4. **`MissionDetail` has redundant navigation.** Both `StageTabBar` (line 106) and inline navigation links (lines 260-296) provide routes to the same sub-pages, creating a "which one do I use?" moment.
   - File: `apps/web/src/pages/MissionDetail.tsx:106` -- StageTabBar
   - File: `apps/web/src/pages/MissionDetail.tsx:260-296` -- inline NAVIGATION section with duplicate links

5. **`aw-focus-ring` class is applied to interactive elements but there are no ARIA landmark roles** on the main regions. LeftNav uses `<nav>` (good), but the main content area is just a `<main>` without `role` or `aria-label`.
   - File: `apps/web/src/components/shell/AppShell.tsx:71-73` -- plain `<main>` tag

### Cross-references

- **consistency-audit.md**: Full audit of action button placement across all review surfaces
- **consistency-audit.md**: Evidence rail width inconsistencies documented
- **glossary.md**: Terminology drift between "Live View", "workspace", "supervision mode"

---

## H5: Error Prevention

> _Good error messages are important, but the best designs carefully prevent problems from occurring in the first place._

### Severity: 1 -- Cosmetic

### What works

1. **Conditional approve button.** On the review page, the Approve button is disabled when `canApprove` is false (blockers remain or verification is not passing). Visual opacity drops to 0.5 and cursor changes to `not-allowed`.
   - File: `apps/web/src/components/review/ApprovalBar.tsx:72-87` -- `disabled={!canApprove}`, `opacity: canApprove ? 1 : 0.5`

2. **Static data eliminates network errors.** Since all data is imported directly, there are no API calls that could fail, timeout, or return unexpected responses. This is a prototype advantage.
   - File: `apps/web/src/data/missions.ts` -- all data is static

3. **ErrorBoundary** wraps the main content area and resets on route changes.
   - File: `apps/web/src/components/shell/AppShell.tsx:85-87` -- `<ErrorBoundary resetKey={location.pathname}>`

### What could improve

1. **No confirmation dialogs for destructive actions.** Plan approval, review approval, and review rejection all fire immediately on click. For high-risk missions (like MSN-001 with `riskTier: 'high'`), a confirmation dialog would be prudent.
   - File: `apps/web/src/pages/MissionPlan.tsx:174` -- direct toast on click
   - File: `apps/web/src/pages/MissionReview.tsx:71` -- direct toast on click

2. **MissionCreate form** has no field validation indicators shown before submission (though this is less critical in a static prototype).

3. **No "are you sure?" when exiting LiveView** during active agent work. The Esc key immediately navigates away.
   - File: `apps/web/src/pages/LiveView.tsx:106-109` -- immediate navigation on Escape

### Cross-references

- **failure-path-audit.md**: No confirmation dialogs documented as a gap
- **state-model.md**: No guard states before irreversible transitions

---

## H6: Recognition Rather Than Recall

> _Minimize the user's memory load by making elements, actions, and options visible._

### Severity: 2 -- Minor Usability Problem

### Pain Point Mapping: C (Rich Plan Content)

### What works

1. **StageTabBar** provides excellent recognition. The five stage tabs (OVERVIEW, PLAN, EXECUTE, REVIEW, ESCALATION) are always visible with the active stage highlighted, so users never need to remember where they are in the lifecycle.
   - File: `apps/web/src/components/mission/StageTabBar.tsx:27-49`

2. **Breadcrumbs** in TopBar show the full navigation path, reducing recall burden for "where am I?".
   - File: `apps/web/src/components/shell/TopBar.tsx:80-107`

3. **MissionSwitcher dropdown** shows recent missions, reducing the need to navigate back to MissionHome to find a previously visited mission.
   - File: `apps/web/src/components/shell/MissionSwitcherDropdown.tsx`

4. **Filter state persistence** via URL search params means filters survive page refreshes.
   - File: `apps/web/src/pages/MissionHome.tsx:29-59` -- `useSearchParams` for filter state

5. **Command palette** (Cmd+K) allows action discovery without memorizing navigation paths.
   - File: `apps/web/src/components/shell/CommandPalette.tsx:14-22` -- nav pages and actions listed

### What fails

1. **Plan content renders as plain text with no visual hierarchy.** Goals, scope boundaries, acceptance criteria, and risks are displayed using the same `aw-body` text style with only `aw-micro` uppercase labels as section dividers. For longer plans, this becomes a wall of undifferentiated text that users must read sequentially rather than scan.
   - File: `apps/web/src/pages/MissionPlan.tsx:101-161` -- all content rendered via `{mission.goal}`, `{mission.scopeBoundary}` as raw text interpolation
   - Contrast with: `apps/web/src/components/mission/MarkdownViewer.tsx:11-21` -- a capable markdown renderer that supports headings, code blocks, lists, bold, italic, and tables, but is ONLY used inside `ArtifactPanel`
   - File: `apps/web/src/components/mission/ArtifactPanel.tsx:104-109` -- MarkdownViewer only used for artifact type 'markdown'

2. **No visual differentiation between mission stages on MissionHome cards.** Stage is shown as a small badge, but card layout and content are identical regardless of whether the mission is in plan (needs review), execute (needs monitoring), or review (needs approval). Different stages imply different primary actions, but the card does not surface this.

3. **LiveView has no indication of which acceptance criteria are being worked on.** When monitoring an agent in LiveView, the user must recall the acceptance criteria from the plan page. There is no panel showing criteria status.
   - File: `apps/web/src/pages/LiveView.tsx:170-204` -- no acceptance criteria display

### Cross-references

- **conceptual-model.md**: Plan document should be an artifact type, enabling MarkdownViewer rendering
- **user-journeys.md**: "Review and approve plan" journey notes difficulty scanning plain text plans
- **glossary.md**: "Plan" conflates stage and content -- if plan were an artifact, it would get rich rendering

---

## H7: Flexibility and Efficiency of Use

> _Accelerators -- unseen by the novice user -- may speed up the interaction for the expert user._

### Severity: 2 -- Minor Usability Problem

### Pain Point Mapping: A, B

### What works

1. **Keyboard shortcuts** for power users:
   - Cmd+K / Ctrl+K: Command palette (`apps/web/src/components/shell/AppShell.tsx:41-44`)
   - Cmd+Shift+M / Ctrl+Shift+M: Mission switcher (`apps/web/src/components/shell/AppShell.tsx:46-49`)
   - Esc: Exit LiveView (`apps/web/src/pages/LiveView.tsx:106-109`)
   - 'n': New mission from MissionHome (`apps/web/src/pages/MissionHome.tsx:78-88`)

2. **Command palette** provides quick navigation to any page or mission without using the mouse.
   - File: `apps/web/src/components/shell/CommandPalette.tsx:14-22`

3. **Mission switcher dropdown** allows rapid switching between missions without returning to the inbox.
   - File: `apps/web/src/components/shell/TopBar.tsx:29-41`

4. **Filter and sort controls** on MissionHome allow efficient triage of the mission inbox.
   - File: `apps/web/src/pages/MissionHome.tsx:119-178`

### What fails

1. **No keyboard shortcut for LiveView.** The most common expert action -- "quickly check what the agent is doing" -- has no keyboard accelerator. There is no Cmd+L or similar shortcut.
   - File: `apps/web/src/components/shell/AppShell.tsx:38-53` -- only two shortcuts registered

2. **No inline/split preview mode.** Expert users who want to monitor agent work while reviewing evidence or plan content must either use two browser windows or constantly switch between AppShell pages and fullscreen LiveView. No resizable panel or split-screen option exists.

3. **No bulk actions on MissionHome.** A supervisor managing 5+ missions cannot bulk-approve plans, bulk-acknowledge escalations, or bulk-filter across workflows. Each action requires navigating to the individual mission.

4. **Command palette does not include LiveView as a target.** The `navPages` array includes Missions, Workflows, History, Settings, and Costs, but not LiveView for any specific mission.
   - File: `apps/web/src/components/shell/CommandPalette.tsx:14-20` -- no LiveView entries

5. **No customizable workspace layout.** The WorkspaceLayout in LiveView has a fixed grid (`200px 1fr 380px` columns, `1fr 280px` rows). Users cannot resize panels, hide the file tree, or maximize the terminal.
   - File: `apps/web/src/components/workspace/WorkspaceLayout.tsx:50-53` -- fixed grid template

### Cross-references

- **information-architecture.md**: LiveView not accessible from LeftNav or command palette
- **user-journeys.md**: "Check what agent is doing" takes 4+ clicks

---

## H8: Aesthetic and Minimalist Design

> _Interfaces should not contain information that is irrelevant or rarely needed._

### Severity: 1 -- Cosmetic

### What works

1. **`aw` design system** creates a clean, cohesive visual language. The muted color palette (shell grays, paper whites, subtle accent red) avoids visual noise.
   - File: `apps/web/src/theme/tokens.ts:1-21` -- restrained palette with clear hierarchy

2. **Ambient visual effects** (AmbientDots, scanlines) add texture without overwhelming content.
   - File: `apps/web/src/components/shell/AppShell.tsx:68` -- `<AmbientDots />`
   - File: `apps/web/src/components/shell/AppShell.tsx:83` -- `aw-scanlines` class

3. **PanelPins and CornerBrackets** provide visual framing for panels without heavy borders. This maintains the "operating surface" aesthetic while clearly delineating content regions.
   - File: `apps/web/src/components/primitives/PanelPins.tsx`
   - File: `apps/web/src/components/primitives/CornerBracket.tsx`

4. **Bottom timestamp bar** provides system context minimally.
   - File: `apps/web/src/components/shell/AppShell.tsx:92-107` -- "MISSION.CTRL // OPERATING SURFACE v0.1.0" + clock

### What could improve

1. **MissionDetail has redundant navigation.** Both StageTabBar and an inline NAVIGATION section provide links to the same sub-pages. This is information clutter.
   - File: `apps/web/src/pages/MissionDetail.tsx:106` -- StageTabBar at top
   - File: `apps/web/src/pages/MissionDetail.tsx:260-296` -- NAVIGATION section with same links plus LiveView link

2. **MissionDetail repeats information from MissionPlan.** The detail page shows Goal, Scope Boundary, Acceptance Criteria, and Risk Assessment -- which are all repeated on the Plan page. For missions in plan stage, this is pure duplication.
   - File: `apps/web/src/pages/MissionDetail.tsx:129-186` -- Goal, Scope, Criteria, Risks
   - File: `apps/web/src/pages/MissionPlan.tsx:100-161` -- same content repeated

3. **Execute page left panel repeats mission context** that is already available in the TopBar breadcrumbs and StageTabBar.
   - File: `apps/web/src/pages/MissionExecute.tsx:96-155` -- 260px left panel showing ID, title, goal, scope, criteria

### Cross-references

- **consistency-audit.md**: Redundant navigation patterns documented

---

## H9: Help Users Recognize, Diagnose, and Recover from Errors

> _Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution._

### Severity: 3 -- Major Usability Problem

### What works

1. **ErrorBoundary** catches rendering errors and displays a clear message with a "Back to Missions" link.
   - File: `apps/web/src/components/primitives/ErrorBoundary.tsx:43-76`
   - In dev mode, the full error stack trace is shown: `ErrorBoundary.tsx:52-65`

2. **Mission-not-found states** are handled on all mission pages with consistent "Mission not found" text and a link back to the missions list.
   - File: `apps/web/src/pages/MissionDetail.tsx:36-49`
   - File: `apps/web/src/pages/MissionPlan.tsx:31-55`
   - File: `apps/web/src/pages/MissionExecute.tsx:36-60`
   - File: `apps/web/src/pages/MissionReview.tsx:31-55`
   - File: `apps/web/src/pages/MissionEscalation.tsx:27-51`
   - File: `apps/web/src/pages/LiveView.tsx:147-167`

3. **Empty filter results** show "No missions match filters" with guidance text.
   - File: `apps/web/src/pages/MissionHome.tsx:192-198`

4. **Escalation undo** provides a recovery mechanism for one specific action type.
   - File: `apps/web/src/pages/MissionEscalation.tsx:194-198` -- undo callback via toast

### What fails

1. **MAJOR: No error recovery in LiveView.** If something goes wrong in the fullscreen LiveView (component error, data issue), there is no recovery path beyond the ErrorBoundary -- but LiveView is OUTSIDE the AppShell's ErrorBoundary. The LiveView does not have its own ErrorBoundary.
   - File: `apps/web/src/App.tsx:48-49` -- LiveView routes are outside the AppShell element tree
   - File: `apps/web/src/components/shell/AppShell.tsx:85-87` -- ErrorBoundary only wraps `<Outlet />` inside AppShell

2. **No retry affordances anywhere.** When an action fails (plan approval, review decision), the only feedback is a toast notification. There is no "retry" button, no suggestion of what went wrong, no recovery path.

3. **No offline handling.** No service worker, no offline detection, no "you are offline" banner. In a production scenario, losing connectivity while monitoring a live agent would be critical.

4. **Toast notifications auto-dismiss.** The default toast duration is 3000ms (with 5000ms for escalation toasts). If a user looks away, they miss the confirmation of their action entirely. No persistent notification log exists.
   - File: `apps/web/src/hooks/useToast.ts` -- auto-dismiss behavior

5. **Empty states provide no recovery guidance.** When MissionExecute shows "No agent activity yet", it does not explain how to start an agent or link to documentation.
   - File: `apps/web/src/pages/MissionExecute.tsx:265-268` -- bare "No agent activity yet" text

### Cross-references

- **failure-path-audit.md**: Comprehensive catalog of missing error states and recovery paths
- **failure-path-audit.md**: LiveView error recovery identified as a critical gap
- **information-architecture.md**: LiveView orphan status means it falls outside AppShell's error boundary

---

## H10: Help and Documentation

> _It may be necessary to provide documentation to help users understand how to complete their tasks._

### Severity: 1 -- Cosmetic

### What works

1. **HelpModal** provides a structured guide with 5 sections covering Missions, Stages, Workflows, Evidence & Verification, and Escalations.
   - File: `apps/web/src/components/primitives/HelpModal.tsx:7-28` -- content sections
   - File: `apps/web/src/components/primitives/HelpModal.tsx:30-115` -- modal implementation

2. **Help button** is positioned at bottom-left corner, persistently visible across all AppShell pages.
   - File: `apps/web/src/components/primitives/HelpModal.tsx:36-42` -- fixed position bottom-6 left-6

3. **Command palette** doubles as a discoverability tool, showing available navigation targets and actions.
   - File: `apps/web/src/components/shell/CommandPalette.tsx:14-22`

4. **Accessibility attributes** on HelpModal: `role="dialog"`, `aria-modal="true"`, `aria-label="Mission Control Guide"`.
   - File: `apps/web/src/components/primitives/HelpModal.tsx:57-59`

### What could improve

1. **HelpModal does not mention keyboard shortcuts.** Users who might benefit from Cmd+K and Cmd+Shift+M are not informed of their existence.
   - File: `apps/web/src/components/primitives/HelpModal.tsx:7-28` -- no keyboard shortcut section

2. **HelpModal does not explain LiveView.** The help content covers missions, stages, workflows, evidence, and escalations, but not the LiveView/supervision mode concept.
   - File: `apps/web/src/components/primitives/HelpModal.tsx:7-28` -- no LiveView section

3. **No contextual help.** Help is always the same modal regardless of which page the user is on. On the Execute page, help about agent sessions would be more relevant than the general overview.

4. **No onboarding flow.** First-time users see the full MissionHome immediately with no walkthrough, tooltip tour, or progressive disclosure of features.

### Cross-references

- **glossary.md**: Terminology drift not addressed in help documentation
- **user-journeys.md**: First-time orientation journey identifies lack of onboarding

---

## Severity Summary

```
H1  Visibility of system status        ████████████████████  4 (Catastrophe)
H3  User control and freedom           ███████████████       3 (Major)
H9  Help users recover from errors     ███████████████       3 (Major)
H4  Consistency and standards          ██████████            2 (Minor)
H6  Recognition rather than recall     ██████████            2 (Minor)
H7  Flexibility and efficiency         ██████████            2 (Minor)
H2  Match system and real world        █████                 1 (Cosmetic)
H5  Error prevention                   █████                 1 (Cosmetic)
H8  Aesthetic and minimalist design    █████                 1 (Cosmetic)
H10 Help and documentation             █████                 1 (Cosmetic)
```

### Total severity score: 20 out of 40 maximum

### Breakdown by severity level

| Severity           | Count | Heuristics      |
| ------------------ | ----- | --------------- |
| 4 -- Catastrophe   | 1     | H1              |
| 3 -- Major         | 2     | H3, H9          |
| 2 -- Minor         | 3     | H4, H6, H7      |
| 1 -- Cosmetic      | 4     | H2, H5, H8, H10 |
| 0 -- Not a problem | 0     | --              |

---

## Pain Point Distribution

| Pain Point                      | Heuristics Affected   | Highest Severity                          |
| ------------------------------- | --------------------- | ----------------------------------------- |
| A -- Inline Agent Visibility    | H1, H4, H7            | **4** (H1)                                |
| B -- Mode Switching             | H3, H4, H7            | **3** (H3)                                |
| C -- Rich Plan Content          | H6                    | **2** (H6)                                |
| D -- Demo/Deliverable Artifacts | (indirect via H1, H9) | **3** (H9 -- completed stage unexercised) |

---

## Top 5 Recommendations (by severity)

1. **Add inline agent visibility (H1/Severity 4).** Introduce a resizable panel or split view within AppShell pages that shows live agent work (browser, terminal, code) without requiring fullscreen mode switch. This is the single most impactful change.

2. **Add LiveView error recovery (H9/Severity 3).** Wrap LiveView in its own ErrorBoundary. Add a "Return to Mission" button in the error state. Consider a reconnection mechanism for when real-time data is added.

3. **Add mode switching toggle (H3/Severity 3).** Add a keyboard shortcut (e.g., Cmd+Shift+L) and a persistent toggle button that opens/closes an inline agent preview panel. Eliminate the forced fullscreen context switch.

4. **Standardize action button placement (H4/Severity 2).** Define a single pattern for approval/decision buttons. Recommendation: sticky bar at top (as in ApprovalBar) for all review surfaces, right-aligned.

5. **Render plan content as markdown (H6/Severity 2).** Use the existing `MarkdownViewer` component on `MissionPlan` to render plan content with headings, code blocks, and lists. The component already exists and is proven in `ArtifactPanel`.

---

## Appendix: File Reference Index

| File                                                    | Lines Referenced                           | Heuristic(s)       |
| ------------------------------------------------------- | ------------------------------------------ | ------------------ |
| `apps/web/src/App.tsx`                                  | 48-49                                      | H1, H3, H9         |
| `apps/web/src/pages/LiveView.tsx`                       | 106-109, 170-204, 176-184                  | H1, H2, H3, H7, H9 |
| `apps/web/src/pages/MissionPlan.tsx`                    | 101-161, 165-188                           | H5, H6, H8         |
| `apps/web/src/pages/MissionExecute.tsx`                 | 96-155, 182-193, 207-294, 265-268, 306-310 | H1, H3, H7, H8, H9 |
| `apps/web/src/pages/MissionDetail.tsx`                  | 36-49, 106, 129-186, 209-220, 260-296      | H1, H4, H8         |
| `apps/web/src/pages/MissionReview.tsx`                  | 61-72                                      | H3, H5             |
| `apps/web/src/pages/MissionEscalation.tsx`              | 194-198                                    | H3                 |
| `apps/web/src/pages/MissionHome.tsx`                    | 78-88, 119-178, 184-190, 192-198           | H1, H7, H9         |
| `apps/web/src/components/shell/AppShell.tsx`            | 38-53, 68, 71-73, 83, 85-87, 92-107        | H3, H4, H7, H8, H9 |
| `apps/web/src/components/shell/LeftNav.tsx`             | 6-12, 110-119                              | H1                 |
| `apps/web/src/components/shell/TopBar.tsx`              | 29-41, 80-107                              | H3, H6             |
| `apps/web/src/components/shell/CommandPalette.tsx`      | 14-22                                      | H7, H10            |
| `apps/web/src/components/mission/StageTabBar.tsx`       | 4-10, 14-50                                | H2, H4, H6         |
| `apps/web/src/components/mission/ArtifactPanel.tsx`     | 104-109                                    | H6                 |
| `apps/web/src/components/mission/MarkdownViewer.tsx`    | 11-21                                      | H6                 |
| `apps/web/src/components/mission/ActivityPreview.tsx`   | 47, 153-159                                | H1                 |
| `apps/web/src/components/review/ApprovalBar.tsx`        | 19-91, 72-87                               | H4, H5             |
| `apps/web/src/components/workspace/WorkspaceLayout.tsx` | 47-77, 50-53                               | H1, H4, H7         |
| `apps/web/src/components/primitives/ErrorBoundary.tsx`  | 43-76, 52-65                               | H5, H9             |
| `apps/web/src/components/primitives/HelpModal.tsx`      | 7-28, 30-115, 36-42, 57-59                 | H10                |
| `apps/web/src/data/missions.ts`                         | 1, 2-4, 8-35, 37-192                       | H1, H2             |
| `apps/web/src/data/artifacts.ts`                        | 1-154                                      | H6                 |
| `apps/web/src/theme/tokens.ts`                          | 1-44                                       | H4, H8             |
