# Consistency Audit -- Mission Control Prototype

> Document 6 of 10 | Date: 2026-03-24
> Cross-references: [information-architecture.md](./information-architecture.md), [glossary.md](./glossary.md)

---

## Overview

This document is a cross-screen consistency audit of the Mission Control prototype. It evaluates whether UI patterns are applied uniformly across all pages and identifies accidental inconsistencies that erode user trust and learnability.

---

## 1. Invariant Table

The following table tracks each UI pattern across all mission-related screens. Marks:

- **Y** = pattern present and consistent
- **~** = pattern present but deviates from standard
- **N** = pattern absent
- **N/A** = not applicable to this screen

### 1.1 Action Button Placement

| Pattern               | MissionHome       | MissionDetail | MissionPlan                   | MissionExecute             | MissionReview                       | MissionEscalation             | LiveView |
| --------------------- | ----------------- | ------------- | ----------------------------- | -------------------------- | ----------------------------------- | ----------------------------- | -------- |
| Primary CTA present   | Y (+ NEW MISSION) | N             | Y (Approve Plan)              | Y (ENTER LIVE VIEW)        | Y (Approve)                         | Y (CONFIRM)                   | N        |
| CTA position          | Top of sidebar    | N/A           | Center bottom (after content) | Top center (toolbar row)   | Sticky top bar                      | Right rail (ConsequencePanel) | N/A      |
| CTA background color  | `aw.accent`       | N/A           | `aw.plateDark`                | `aw.accent` (border style) | `semantic.success` or `aw.lineDark` | `aw.accent`                   | N/A      |
| Secondary CTA present | N                 | Y (nav links) | Y (Request Changes)           | Y (toggle, config gear)    | Y (Reject, Re-plan)                 | Y (CANCEL)                    | N        |
| Two-step confirmation | N                 | N             | N                             | N                          | N                                   | Y (select then confirm)       | N        |

**Inconsistency found**: Three different placement patterns for primary approval/decision actions:

1. **MissionPlan**: "Approve Plan & Begin Execution" at `MissionPlan.tsx:165-188` -- center bottom, below all content, inline with "Request Changes". User must scroll past goal, scope, criteria, and risks to reach it.
2. **MissionReview**: `ApprovalBar` at `MissionReview.tsx:97-102` -- sticky top bar (`sticky top-0 z-20`, `ApprovalBar.tsx:21`), always visible. Approve/Reject/Re-plan buttons on the right side.
3. **MissionEscalation**: `ConsequencePanel` at `MissionEscalation.tsx:188-201` -- right rail, 300px wide. Decision options are vertically stacked cards with inline confirmation.

**Inconsistency found**: Three different primary CTA colors:

1. `aw.accent` (#d56f5f) -- used for: + NEW MISSION, ENTER LIVE VIEW link, CONFIRM (escalation)
2. `aw.plateDark` (#4f5559) -- used for: "Approve Plan & Begin Execution" (`MissionPlan.tsx:169`)
3. `semantic.success` -- used for: Approve button in ApprovalBar when `canApprove` is true (`ApprovalBar.tsx:75`)

### 1.2 Navigation Patterns

| Pattern                 | MissionHome | MissionDetail    | MissionPlan    | MissionExecute   | MissionReview    | MissionEscalation | LiveView                  |
| ----------------------- | ----------- | ---------------- | -------------- | ---------------- | ---------------- | ----------------- | ------------------------- |
| TopBar with breadcrumbs | Y           | Y                | Y              | Y                | Y                | Y                 | N (custom header)         |
| StageTabBar             | N           | Y (line 106)     | Y (line 80)    | Y (line 92)      | Y (line 95)      | Y (line 109)      | N                         |
| Back link (ArrowLeft)   | N           | N                | Y (line 85-96) | Y (line 100-111) | Y (line 107-118) | Y (line 116-127)  | Y (in header, line 43-50) |
| Inline navigation links | N           | Y (line 260-296) | N              | N                | N                | N                 | N                         |
| Escape key to exit      | N           | N                | N              | N                | N                | N                 | Y (line 106-108)          |
| Close button (X)        | N           | N                | N              | N                | N                | N                 | Y (line 178-184)          |

**Inconsistency found**: MissionDetail (line 260-296) has BOTH StageTabBar (line 106) AND a NAVIGATION section with link buttons that navigate to the same destinations. The StageTabBar provides: OVERVIEW | PLAN | EXECUTE | REVIEW | ESCALATION. The NAVIGATION section provides: PLAN | EXECUTE | REVIEW | ESCALATION + ENTER LIVE VIEW. This is redundant -- the only additional affordance in the NAVIGATION section is the LiveView link, which is not in the StageTabBar.

**Inconsistency found**: Back navigation has three different patterns:

1. **Mission sub-pages** (Plan, Execute, Review, Escalation): `<ArrowLeft>` icon + "Back to mission" text link (`MissionPlan.tsx:85-96`, `MissionExecute.tsx:100-111`, `MissionReview.tsx:107-118`, `MissionEscalation.tsx:116-127`)
2. **LiveView**: Three exit mechanisms coexist -- ArrowLeft "Back" link in header (`LiveView.tsx:43-50`), Esc key handler (`LiveView.tsx:106-108`), X close button (`LiveView.tsx:178-184`)
3. **MissionHome and MissionDetail**: No back link at all. Relies on LeftNav and breadcrumbs.

### 1.3 Information Density and Layout Patterns

| Pattern           | MissionHome                              | MissionDetail     | MissionPlan                           | MissionExecute                                             | MissionReview                         | MissionEscalation                     | LiveView                            |
| ----------------- | ---------------------------------------- | ----------------- | ------------------------------------- | ---------------------------------------------------------- | ------------------------------------- | ------------------------------------- | ----------------------------------- |
| Column layout     | 2-col (360px sidebar + focus)            | 1-col (max-w-3xl) | 2-col (content + 280px rail)          | 3-col (260px + center + 260px)                             | 2-col (content + 280px rail)          | 2-col (content + 300px rail)          | Grid (200px + auto + 380px, 2 rows) |
| Content padding   | Sidebar: `p-4`, Focus: `p-6`             | `p-6 pb-16`       | `p-8 pb-16`                           | Left: `p-5 pb-16`, Center: `p-6 pb-16`, Right: `p-4 pb-16` | `p-8 pb-16`                           | `p-8 pb-16`                           | None (grid fills)                   |
| Max content width | N/A (fixed sidebar)                      | `max-w-3xl`       | N/A (fluid)                           | N/A (fluid)                                                | N/A (fluid)                           | N/A (fluid)                           | N/A (grid)                          |
| Scroll behavior   | Sidebar + focus independently scrollable | Full page scroll  | Left + right independently scrollable | All 3 columns independently scrollable                     | Left + right independently scrollable | Left + right independently scrollable | Grid cells independently scrollable |

### 1.4 Panel Structure (Left/Center/Right Columns)

| Screen            | Left Column                                      | Center Column                                               | Right Column                                          |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------- |
| MissionHome       | Mission list (360px, `MissionHome.tsx:102`)      | FocusPanel (flex-1)                                         | N/A                                                   |
| MissionDetail     | N/A                                              | Content (max-w-3xl, `MissionDetail.tsx:109`)                | N/A                                                   |
| MissionPlan       | N/A                                              | Plan content (flex-1, `MissionPlan.tsx:84`)                 | Evidence rail (280px, `MissionPlan.tsx:193`)          |
| MissionExecute    | Mission context (260px, `MissionExecute.tsx:97`) | Live work surface (flex-1, `MissionExecute.tsx:158`)        | Evidence rail (260px, `MissionExecute.tsx:342`)       |
| MissionReview     | N/A                                              | DiffByIntent + rollback (flex-1, `MissionReview.tsx:106`)   | Evidence rail (280px, `MissionReview.tsx:140`)        |
| MissionEscalation | N/A                                              | Issue detail + replay (flex-1, `MissionEscalation.tsx:115`) | ConsequencePanel (300px, `MissionEscalation.tsx:189`) |
| LiveView          | FileTree (200px, `WorkspaceLayout.tsx:55`)       | Code/Browser (grid, `WorkspaceLayout.tsx:58-69`)            | AgentChat (380px, `WorkspaceLayout.tsx:51`)           |

### 1.5 Evidence Display

| Screen            | Evidence Component                     | Width                            | Has Filters                | Empty State                                                    |
| ----------------- | -------------------------------------- | -------------------------------- | -------------------------- | -------------------------------------------------------------- |
| MissionPlan       | `EvidenceRail`                         | 280px (`MissionPlan.tsx:193`)    | Inherits from EvidenceRail | "No evidence gathered yet." (`MissionPlan.tsx:203-206`)        |
| MissionExecute    | `EvidenceRail`                         | 260px (`MissionExecute.tsx:342`) | Inherits from EvidenceRail | No explicit empty state (renders rail even if empty)           |
| MissionReview     | `EvidenceRail`                         | 280px (`MissionReview.tsx:140`)  | Inherits from EvidenceRail | No explicit empty state                                        |
| MissionDetail     | Inline summary (pass/fail/warn counts) | N/A                              | No                         | Shows "0 PASS / 0 FAIL / 0 WARN" (`MissionDetail.tsx:210-218`) |
| MissionEscalation | Not present                            | N/A                              | N/A                        | N/A                                                            |

**Inconsistency found**: Evidence rail widths differ -- 280px on Plan and Review, 260px on Execute. The EvidenceRail component itself is identical across uses; only the container width varies.

### 1.6 Mission Header Display

| Screen            | Header Component                                         | Shows ID          | Shows Title       | Shows Badges                  | Shows Owner |
| ----------------- | -------------------------------------------------------- | ----------------- | ----------------- | ----------------------------- | ----------- |
| MissionDetail     | Inline (`MissionDetail.tsx:111-127`)                     | Y                 | Y (h1)            | Y (Stage, Risk, Verification) | Y           |
| MissionPlan       | `MissionHeader` (`MissionPlan.tsx:98`)                   | Y                 | Y                 | Y                             | Y           |
| MissionExecute    | `MissionHeader` (`MissionExecute.tsx:203`)               | Y                 | Y                 | Y                             | Y           |
| MissionReview     | Not present                                              | N                 | N                 | N                             | N           |
| MissionEscalation | `EscalationHeader` instead (`MissionEscalation.tsx:111`) | N                 | N                 | N                             | N           |
| LiveView          | Custom header bar (`LiveView.tsx:20-93`)                 | Y (in breadcrumb) | Y (in breadcrumb) | N                             | N           |

**Inconsistency found**: MissionReview has no MissionHeader or mission identity section. The page goes directly from StageTabBar (line 95) to ApprovalBar (line 97-102) to DiffByIntent content. The user cannot see which mission they are reviewing without reading the breadcrumbs in the TopBar. Every other mission sub-page either has a MissionHeader component or inline header section.

### 1.7 LiveView Access Points

| Screen            | Access Mechanism                              | Component                     | Style                                                                   |
| ----------------- | --------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| MissionDetail     | "ENTER LIVE VIEW" link in NAVIGATION section  | `MissionDetail.tsx:284-295`   | Button with Eye icon, `borderColor: aw.accent, color: aw.accent`        |
| MissionExecute    | "ENTER LIVE VIEW" link in toolbar row         | `MissionExecute.tsx:182-193`  | Border button with Eye icon, `borderColor: aw.accent, color: aw.accent` |
| ActivityPreview   | "ENTER LIVE VIEW" link (only when `isActive`) | `ActivityPreview.tsx:162-171` | Same style as MissionDetail                                             |
| MissionHome       | **Not present**                               | N/A                           | N/A                                                                     |
| MissionPlan       | **Not present**                               | N/A                           | N/A                                                                     |
| MissionReview     | **Not present**                               | N/A                           | N/A                                                                     |
| MissionEscalation | **Not present**                               | N/A                           | N/A                                                                     |
| LeftNav           | **Not present**                               | N/A                           | N/A                                                                     |

**Note**: LiveView access is consistent where it appears (same Eye icon, same accent color border styling). But it is only accessible from screens associated with the execute/active context. No shortcut from MissionHome or LeftNav.

### 1.8 Artifact Display

| Screen                              | Component                                           | Condition                                                                                                                                                                                                                       | Rendering                                                                      |
| ----------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| MissionDetail (via ActivityPreview) | `ArtifactPanel`                                     | `isCompleted = mission.stage === 'completed' \|\| mission.stage === 'review'` (`ActivityPreview.tsx:47`) AND `mission.stage !== 'plan'` (`MissionDetail.tsx:189`) AND `missionArtifacts.length > 0` (`ActivityPreview.tsx:156`) | Gallery of thumbnail buttons + ArtifactViewer (markdown, video, image, html)   |
| ArtifactPanel empty                 | Returns `null` (`ArtifactPanel.tsx:23`)             | `artifacts.length === 0`                                                                                                                                                                                                        | Nothing rendered -- no empty state message                                     |
| MarkdownViewer                      | Inside ArtifactPanel only (`ArtifactPanel.tsx:107`) | Artifact type is `'markdown'`                                                                                                                                                                                                   | Rendered markdown content                                                      |
| MissionPlan                         | **MarkdownViewer NOT used**                         | N/A                                                                                                                                                                                                                             | Plan content rendered as plain text (`MissionPlan.tsx:107-108`, 118-119, etc.) |

**Inconsistency found**: MarkdownViewer exists in the codebase but is used ONLY inside ArtifactPanel. The MissionPlan page renders plan content (goal, scope, criteria, risks) as plain text interpolation, not as rendered markdown. If plans contain structured content (code blocks, links, tables), this will not render correctly.

---

## 2. Inconsistencies Found (with file:line references)

### 2.1 MissionExecute vs. LiveView Component Split (HIGH)

**Files**: `MissionExecute.tsx:206-330`, `LiveView.tsx:194-201`, `WorkspaceLayout.tsx:47-77`

MissionExecute shows agent activity using a set of components:

- `AgentSwimlane` (`MissionExecute.tsx:214`)
- `AgentChatPanel` (in chat mode, `MissionExecute.tsx:333`)
- `BrowserSessionPane` (`MissionExecute.tsx:322`)
- `TerminalSessionPane` (`MissionExecute.tsx:325`)
- `CodeViewer` (read-only preview, `MissionExecute.tsx:275-284`)

LiveView shows agent activity using `WorkspaceLayout` which contains:

- `FileTree` (`WorkspaceLayout.tsx:56`)
- `CodeViewer` (full, `WorkspaceLayout.tsx:59-65`)
- `BrowserPreview` (`WorkspaceLayout.tsx:68`) -- different from `BrowserSessionPane`
- `TerminalEmulator` (`WorkspaceLayout.tsx:71`) -- different from `TerminalSessionPane`
- `AgentChatPanel` (`WorkspaceLayout.tsx:74`)

The MissionExecute and LiveView pages show overlapping but non-identical information using different component trees. The browser and terminal representations are particularly confusing: `BrowserSessionPane` (from `components/execute/SessionPane`) is a summary card, while `BrowserPreview` (from `components/workspace/BrowserPreview`) is an interactive viewport. The user sees two different visual representations of the same underlying data.

### 2.2 Action Button Placement: Three Different Patterns (HIGH)

**Files**: `MissionPlan.tsx:165-188`, `ApprovalBar.tsx:19-91`, `ConsequencePanel.tsx:19-156`

| Page              | Action                         | Placement                     | Position                       | File:Line                       |
| ----------------- | ------------------------------ | ----------------------------- | ------------------------------ | ------------------------------- |
| MissionPlan       | Approve Plan & Begin Execution | Inline at end of content      | Center bottom, below risks     | `MissionPlan.tsx:166-177`       |
| MissionPlan       | Request Changes                | Inline next to Approve        | Center bottom, next to Approve | `MissionPlan.tsx:178-186`       |
| MissionReview     | Approve / Reject / Re-plan     | Sticky top bar (ApprovalBar)  | Top of page, always visible    | `ApprovalBar.tsx:20-21`         |
| MissionEscalation | Decision options + CONFIRM     | Right rail (ConsequencePanel) | Right column, 300px            | `MissionEscalation.tsx:192-200` |

A user who learns to look at the top for approval actions on MissionReview will not find them there on MissionPlan (they are at the bottom) or MissionEscalation (they are in the right rail). Three different mental models for "where do I act."

### 2.3 Evidence Rail Width Inconsistency (MEDIUM)

**Files**: `MissionPlan.tsx:193`, `MissionExecute.tsx:342`, `MissionReview.tsx:140`, `MissionEscalation.tsx:189`

| Page              | Rail Component   | Width       | File:Line                   |
| ----------------- | ---------------- | ----------- | --------------------------- |
| MissionPlan       | EvidenceRail     | `w-[280px]` | `MissionPlan.tsx:193`       |
| MissionExecute    | EvidenceRail     | `w-[260px]` | `MissionExecute.tsx:342`    |
| MissionReview     | EvidenceRail     | `w-[280px]` | `MissionReview.tsx:140`     |
| MissionEscalation | ConsequencePanel | `w-[300px]` | `MissionEscalation.tsx:189` |

The 260px vs 280px difference between MissionExecute and MissionPlan/Review is not justified by content differences -- both display the same `EvidenceRail` component. The 300px escalation panel is wider because ConsequencePanel has more content (option cards with descriptions), which is defensible. But the 20px gap between Execute and Plan/Review evidence rails is accidental.

### 2.4 Back Navigation Inconsistency (MEDIUM)

**Files**: `MissionPlan.tsx:85-96`, `MissionExecute.tsx:100-111`, `MissionReview.tsx:107-118`, `MissionEscalation.tsx:116-127`, `LiveView.tsx:43-50, 106-108, 178-184`

| Page              | Back mechanism                    | Target                             | Style                            | File:Line                       |
| ----------------- | --------------------------------- | ---------------------------------- | -------------------------------- | ------------------------------- |
| MissionPlan       | `<ArrowLeft>` + "Back to mission" | `/missions/:id` or workflow-scoped | `aw-micro`, `color: aw.textSoft` | `MissionPlan.tsx:85-96`         |
| MissionExecute    | `<ArrowLeft>` + "Back to mission" | Same                               | Same                             | `MissionExecute.tsx:100-111`    |
| MissionReview     | `<ArrowLeft>` + "Back to mission" | Same                               | Same                             | `MissionReview.tsx:107-118`     |
| MissionEscalation | `<ArrowLeft>` + "Back to mission" | Same                               | Same                             | `MissionEscalation.tsx:116-127` |
| LiveView          | `<ArrowLeft>` + "Back" (short)    | `/missions/:id/execute`            | Same style but shorter text      | `LiveView.tsx:43-50`            |
| LiveView          | Esc key                           | `/missions/:id/execute`            | Keyboard shortcut                | `LiveView.tsx:106-108`          |
| LiveView          | X button                          | `/missions/:id/execute`            | Icon button in accent banner     | `LiveView.tsx:178-184`          |
| MissionHome       | **None**                          | N/A                                | N/A                              | --                              |
| MissionDetail     | **None**                          | N/A                                | Relies on breadcrumbs            | --                              |

LiveView has three redundant exit mechanisms. Mission sub-pages have one consistent back link. MissionHome and MissionDetail have no back affordance at all.

### 2.5 MissionDetail Redundant Navigation (MEDIUM)

**File**: `MissionDetail.tsx:106, 260-296`

MissionDetail has BOTH:

1. **StageTabBar** at line 106:

   ```tsx
   <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="overview" />
   ```

   Renders: OVERVIEW | PLAN | EXECUTE | REVIEW | ESCALATION

2. **Navigation links section** at lines 260-296:
   ```tsx
   {(['plan', 'execute', 'review', 'escalation'] as const).map((stage) => { ... })}
   ```
   Plus an "ENTER LIVE VIEW" button.

The first four links in the NAVIGATION section duplicate exactly what the StageTabBar provides. The only unique element is the ENTER LIVE VIEW button (lines 284-295), which could be placed elsewhere (e.g., in the TopBar actions area or as a standalone component).

### 2.6 MissionExecute Unique View Mode Toggle (LOW)

**File**: `MissionExecute.tsx:161-179`

MissionExecute has an OVERVIEW / CHAT toggle:

```tsx
const [viewMode, setViewMode] = useState<'overview' | 'chat'>('overview');
```

This is the only page in the application with a view mode toggle. No other page has an equivalent. The pattern is not replicated on:

- MissionDetail (no toggle between summary and chat)
- MissionReview (no toggle between diff and chat)
- MissionEscalation (no toggle between detail and chat)
- LiveView (has all panels simultaneously, no toggle needed)

This creates a unique interaction pattern that the user must learn for one page only.

### 2.7 Acceptance Criteria Rendering (HIGH)

**Files**: `MissionDetail.tsx:154-167`, `MissionPlan.tsx:129-139`, `MissionExecute.tsx:148-153`, `FocusPanel.tsx:65-70`

The same `mission.acceptanceCriteria` array is rendered four different ways:

| Location       | Bullet/Icon            | Icon Size  | Color                      | Typography   | File:Line                    |
| -------------- | ---------------------- | ---------- | -------------------------- | ------------ | ---------------------------- |
| MissionDetail  | `CheckCircle` (lucide) | 14px       | `semantic.success` (green) | `aw-body`    | `MissionDetail.tsx:157-164`  |
| MissionPlan    | Colored dot (`<span>`) | 5px circle | `aw.lineInk`               | `aw-body`    | `MissionPlan.tsx:132-137`    |
| MissionExecute | `&bull;` character     | N/A        | text color                 | `aw-body-sm` | `MissionExecute.tsx:149-151` |
| FocusPanel     | `&bull;` character     | N/A        | text color                 | `aw-body`    | `FocusPanel.tsx:67-69`       |

The MissionDetail version with green checkmarks implies criteria are verified/passing, but it is simply displaying the static list. This is a semantic error.

---

## 3. Pattern Comparison Table (Screen x Pattern Matrix)

| Pattern                  | MissionHome |      MissionDetail      |   MissionPlan    |  MissionExecute  |  MissionReview   | MissionEscalation | LiveView |
| ------------------------ | :---------: | :---------------------: | :--------------: | :--------------: | :--------------: | :---------------: | :------: |
| TopBar w/ breadcrumbs    |      Y      |            Y            |        Y         |        Y         |        Y         |         Y         |    N     |
| TopBar w/ missionId      |      N      |            Y            |        Y         |        Y         |        Y         |         Y         |    N     |
| StageTabBar              |      N      |            Y            |        Y         |        Y         |        Y         |         Y         |    N     |
| Back link (ArrowLeft)    |      N      |            N            |        Y         |        Y         |        Y         |         Y         |    Y     |
| MissionHeader component  |      N      |       ~ (inline)        |        Y         |        Y         |        N         |         N         |    N     |
| EvidenceRail             |      N      |            N            |    Y (280px)     |    Y (260px)     |    Y (280px)     |         N         |    N     |
| Inline nav links         |      N      |            Y            |        N         |        N         |        N         |         N         |    N     |
| LiveView entry link      |      N      |            Y            |        N         |        Y         |        N         |         N         |   N/A    |
| Approval/decision CTA    |      N      |            N            |    Y (bottom)    |        N         |  Y (sticky top)  |  Y (right rail)   |    N     |
| ArtifactPanel            |      N      | Y (via ActivityPreview) |        N         |        N         |        N         |         N         |    N     |
| MarkdownViewer           |      N      |  Y (via ArtifactPanel)  |        N         |        N         |        N         |         N         |    N     |
| AgentSwimlane            |      N      |            N            |        N         |        Y         |        N         |         N         |    N     |
| AgentChatPanel           |      N      |            N            |        N         |    Y (toggle)    |        N         |         N         |    Y     |
| BrowserSessionPane       |      N      | Y (via ActivityPreview) |        N         |        Y         |        N         |         N         |    N     |
| TerminalSessionPane      |      N      | Y (via ActivityPreview) |        N         |        Y         |        N         |         N         |    N     |
| CodeViewer               |      N      | Y (via ActivityPreview) |        N         |        Y         |        N         |         N         |    Y     |
| WorkspaceLayout          |      N      |            N            |        N         |        N         |        N         |         N         |    Y     |
| FileTree                 |      N      |            N            |        N         |        N         |        N         |         N         |    Y     |
| BrowserPreview           |      N      |            N            |        N         |        N         |        N         |         N         |    Y     |
| TerminalEmulator         |      N      |            N            |        N         |        N         |        N         |         N         |    Y     |
| ReplayTimeline           |      N      |            N            |        N         |        N         |        N         |         Y         |    N     |
| ConsequencePanel         |      N      |            N            |        N         |        N         |        N         |         Y         |    N     |
| DiffByIntent             |      N      |            N            |        N         |        N         |        Y         |         N         |    N     |
| Overview/Chat toggle     |      N      |            N            |        N         |        Y         |        N         |         N         |    N     |
| PanelPins decoration     |      N      |            Y            |        Y         |        N         |        Y         |         Y         |    N     |
| CornerBracket decoration |      N      |            N            |        Y         |        N         |        Y         |         Y         |    N     |
| PageTransition wrapper   |     N/A     |            Y            |        Y         |        Y         |        Y         |         Y         |    N     |
| ErrorBoundary            |     N/A     |    Y (via AppShell)     | Y (via AppShell) | Y (via AppShell) | Y (via AppShell) | Y (via AppShell)  |    N     |
| Toast feedback           |      N      |            N            |        Y         |        N         |        Y         |         Y         |    N     |

### Key Observations from Matrix

1. **LiveView shares almost no patterns with in-shell pages** -- it has no TopBar, no StageTabBar, no back link (uses custom header), no PanelPins, no PageTransition, no ErrorBoundary. It is effectively a separate application.

2. **MissionReview is the only page without a MissionHeader** -- every other mission sub-page either uses `MissionHeader` or has an inline header section. MissionReview goes directly from StageTabBar to ApprovalBar.

3. **MissionExecute is the most component-dense page** -- it is the only page with AgentSwimlane, an overview/chat toggle, a config panel trigger, AND an ENTER LIVE VIEW link. It serves as a "bridge" between the in-shell experience and the fullscreen LiveView.

4. **MissionEscalation and MissionReview are structurally symmetric** -- both use a 2-column layout with content on the left and a decision panel on the right. But the right-rail widths differ (300px vs 280px) and the decision patterns differ (ConsequencePanel cards vs ApprovalBar buttons).

---

## 4. Deliberate Variation vs. Accidental Inconsistency

### Deliberate (Acceptable)

| #   | Variation                                              | Rationale                                                                                                                                                                                               |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | LiveView drops AppShell                                | Fullscreen supervision is a distinct interaction mode with explicit entry/exit affordances (accent banner, Esc, back link). Documented.                                                                 |
| 2   | MissionHome has no StageTabBar                         | MissionHome shows all missions; it is not scoped to a single mission. StageTabBar requires `missionId`.                                                                                                 |
| 3   | MissionEscalation right rail (300px) wider than others | ConsequencePanel contains decision option cards with descriptions and risk assessments. More content requires more width.                                                                               |
| 4   | MissionExecute overview/chat toggle                    | Execute is the active monitoring page. The toggle provides two monitoring modes (visual overview vs. conversational interaction) at the same navigation level. Unique to this page by design.           |
| 5   | MissionDetail has inline navigation links              | The overview page serves as a navigation hub. Having both StageTabBar and inline links provides redundancy for discoverability. However, this is borderline -- see accidental inconsistency note below. |

### Accidental (Must Fix)

| #   | Inconsistency                                                          | Severity | Files                                                                                                                  | Fix                                                                            |
| --- | ---------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | Evidence rail widths: 260px (Execute) vs 280px (Plan, Review)          | MEDIUM   | `MissionExecute.tsx:342`, `MissionPlan.tsx:193`, `MissionReview.tsx:140`                                               | Standardize to `w-[280px]` for all EvidenceRail containers                     |
| 2   | Primary CTA uses 3 different colors                                    | HIGH     | `MissionPlan.tsx:169` (`aw.plateDark`), `ApprovalBar.tsx:75` (`semantic.success`), `MissionHome.tsx:108` (`aw.accent`) | Standardize: `aw.accent` for primary, `semantic.success` for approval-specific |
| 3   | Acceptance criteria rendered 4 ways                                    | HIGH     | `MissionDetail.tsx:154-167`, `MissionPlan.tsx:129-139`, `MissionExecute.tsx:148-153`, `FocusPanel.tsx:65-70`           | Create shared `CriterionItem` component                                        |
| 4   | MissionReview has no MissionHeader                                     | MEDIUM   | `MissionReview.tsx` (entire file)                                                                                      | Add `MissionHeader` component after StageTabBar                                |
| 5   | Back link text varies ("Back to mission" vs "Back")                    | LOW      | `LiveView.tsx:49` vs `MissionPlan.tsx:95`                                                                              | Standardize to "Back to mission" everywhere                                    |
| 6   | MissionDetail NAVIGATION section duplicates StageTabBar                | LOW      | `MissionDetail.tsx:260-296`                                                                                            | Remove inline nav links; add LiveView link to StageTabBar or TopBar            |
| 7   | Approval CTA placement: bottom/top/right                               | HIGH     | `MissionPlan.tsx:165`, `ApprovalBar.tsx:21`, `ConsequencePanel.tsx`                                                    | Adopt consistent pattern: sticky bar for all approval/decision actions         |
| 8   | Not-found states structurally inconsistent                             | HIGH     | `MissionDetail.tsx:36-48` (with TopBar), `MissionPlan.tsx:31-54` (without TopBar on not-found path)                    | All not-found states must render inside PageTransition with TopBar             |
| 9   | MissionPlan renders plan as plain text, not markdown                   | MEDIUM   | `MissionPlan.tsx:107-108`                                                                                              | Use MarkdownViewer for plan content                                            |
| 10  | Content padding varies: `p-6` vs `p-8` for similar single-column pages | LOW      | `MissionDetail.tsx:108` (`p-6`), `MissionPlan.tsx:84` (`p-8`), `MissionReview.tsx:106` (`p-8`)                         | Standardize: `p-8 pb-16` for all full-width content areas                      |

---

## 5. Component Consistency Deep Dive

### 5.1 Toast/Feedback Consistency

| Page              | Action           | Feedback Mechanism                              | Toast Message                                  | Component  | File:Line                   |
| ----------------- | ---------------- | ----------------------------------------------- | ---------------------------------------------- | ---------- | --------------------------- |
| MissionPlan       | Approve Plan     | Toast (success)                                 | "Plan approved. Execution will begin shortly." | `useToast` | `MissionPlan.tsx:174`       |
| MissionPlan       | Request Changes  | Toast (info)                                    | "Change request submitted."                    | `useToast` | `MissionPlan.tsx:183`       |
| MissionReview     | Approve          | Toast (success)                                 | "Review approved. Changes will be deployed."   | `useToast` | `MissionReview.tsx:66`      |
| MissionReview     | Reject           | Toast (error)                                   | "Review rejected. Author will be notified."    | `useToast` | `MissionReview.tsx:67`      |
| MissionReview     | Re-plan          | Toast (info)                                    | "Sent back for re-planning."                   | `useToast` | `MissionReview.tsx:68`      |
| MissionEscalation | Decision confirm | Toast (success)                                 | "Decision recorded: [option.label]"            | `useToast` | `MissionEscalation.tsx:195` |
| MissionDetail     | --               | No actions, no toast                            | N/A                                            | N/A        | N/A                         |
| MissionExecute    | --               | No toast (config panel has button state change) | N/A                                            | N/A        | N/A                         |
| LiveView          | --               | No actions, no toast                            | N/A                                            | N/A        | N/A                         |

**Assessment**: Pages with approval/decision actions (Plan, Review, Escalation) consistently use the `useToast` hook with `ToastContainer`. Pages without actions have no toast. This is consistent. The toast pattern itself (auto-dismiss, type-colored, optional undo callback) is uniformly implemented.

### 5.2 Stage Badge Consistency

| Screen                                |      Uses StageBadge      | Uses RiskBadge | Uses VerificationBadge | File                      |
| ------------------------------------- | :-----------------------: | :------------: | :--------------------: | ------------------------- |
| MissionCard (in MissionHome)          |             Y             |       Y        |           Y            | MissionCard.tsx           |
| FocusPanel                            |             Y             |       Y        |           Y            | FocusPanel.tsx:43-45      |
| MissionDetail                         |             Y             |       Y        |           Y            | MissionDetail.tsx:120-122 |
| MissionHeader (used by Plan, Execute) |             Y             |       Y        |           Y            | MissionHeader.tsx         |
| MissionReview                         |       N (no header)       |       N        |           N            | MissionReview.tsx         |
| MissionEscalation                     | N (uses EscalationHeader) |       N        |           N            | MissionEscalation.tsx     |
| LiveView                              |             N             |       N        |           N            | LiveView.tsx              |

**Assessment**: Badge display is consistent wherever MissionHeader or inline header appears. MissionReview and MissionEscalation do not show badges because they lack a mission header section -- this is an inconsistency, not a deliberate choice.

### 5.3 Keyboard Shortcut Consistency

| Shortcut                   | Action                    | Scope                          | Component                           | File:Line                           |
| -------------------------- | ------------------------- | ------------------------------ | ----------------------------------- | ----------------------------------- |
| Cmd+K / Ctrl+K             | Open CommandPalette       | AppShell only                  | `AppShell.tsx:41-44`                | `AppShell.tsx:41-44`                |
| Cmd+Shift+M / Ctrl+Shift+M | Open MissionSwitcher      | AppShell only                  | `AppShell.tsx:46-48`                | `AppShell.tsx:46-48`                |
| Esc                        | Close CommandPalette      | CommandPalette open            | `CommandPalette.tsx:111`            | `CommandPalette.tsx:111`            |
| Esc                        | Exit LiveView             | LiveView                       | `LiveView.tsx:107`                  | `LiveView.tsx:107`                  |
| Esc                        | Close MissionSwitcher     | MissionSwitcher open           | `MissionSwitcherDropdown.tsx:77-79` | `MissionSwitcherDropdown.tsx:77-79` |
| 'n'                        | Go to new mission         | MissionHome (no input focused) | `MissionHome.tsx:82-84`             | `MissionHome.tsx:82-84`             |
| Arrow keys                 | Navigate CommandPalette   | CommandPalette                 | `CommandPalette.tsx:102-107`        | `CommandPalette.tsx:102-107`        |
| Arrow keys                 | Navigate MissionSwitcher  | MissionSwitcher                | `MissionSwitcherDropdown.tsx:67-72` | `MissionSwitcherDropdown.tsx:67-72` |
| Enter                      | Select in CommandPalette  | CommandPalette                 | `CommandPalette.tsx:108-110`        | `CommandPalette.tsx:108-110`        |
| Enter                      | Select in MissionSwitcher | MissionSwitcher                | `MissionSwitcherDropdown.tsx:73-76` | `MissionSwitcherDropdown.tsx:73-76` |

**Assessment**: Keyboard shortcuts are consistent within overlays (arrow keys + Enter + Esc). The 'n' shortcut on MissionHome is unique and undiscoverable (no tooltip or hint). Cmd+K is not available in LiveView.

---

## 6. Design Token Usage Consistency

### 6.1 Border Colors

| Context               | Token Used     | Pages Using It                                                                                                         |
| --------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Content panels        | `aw.lineDark`  | MissionDetail, MissionPlan, MissionExecute, MissionReview, MissionEscalation                                           |
| Rail/sidebar borders  | `aw.line`      | MissionHome (sidebar), MissionPlan (rail), MissionExecute (both rails), MissionReview (rail), MissionEscalation (rail) |
| Faint separators      | `aw.lineFaint` | Filter sections, content dividers within panels                                                                        |
| Active/accent borders | `aw.accent`    | LiveView entry links, active filter chips, StageTabBar active tab                                                      |

**Assessment**: Border color usage is consistent with the token hierarchy: `lineFaint` < `line` < `lineDark` < `lineInk`.

### 6.2 Background Colors

| Context                 | Token                                             | Usage                                         |
| ----------------------- | ------------------------------------------------- | --------------------------------------------- |
| Page background         | `aw.paperTop` (via `aw-paper` class)              | AppShell main area, LiveView                  |
| Sidebar/rail background | `aw.haze`                                         | LeftNav, LiveView header                      |
| Active tab/filter       | `aw.plate`                                        | StageTabBar active, MissionHome filter active |
| Hover state             | `aw.haze` (via `hover:bg-[var(--color-aw-haze)]`) | Buttons, links, cards                         |

**Assessment**: Background token usage is consistent.

---

## Summary: Top Consistency Breaks Ranked by Impact

| Rank | Issue                                                                                 | Severity | User Impact                                                 | Fix Effort                      |
| ---- | ------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------- | ------------------------------- |
| 1    | Primary CTA uses 3 different colors (`aw.accent`, `aw.plateDark`, `semantic.success`) | HIGH     | User cannot build reliable mental model of "primary action" | LOW (change 2 color values)     |
| 2    | Approval/decision CTA placement varies (bottom, sticky top, right rail)               | HIGH     | User must re-learn where to act on each page                | MEDIUM (design decision needed) |
| 3    | Acceptance criteria rendered 4 ways (CheckCircle, dot, bull x2)                       | HIGH     | Green checks on MissionDetail imply verification status     | LOW (extract shared component)  |
| 4    | MissionReview lacks MissionHeader/badges                                              | MEDIUM   | User cannot identify mission without reading breadcrumbs    | LOW (add MissionHeader)         |
| 5    | Evidence rail widths inconsistent (260/280/300)                                       | MEDIUM   | Subtle layout shift when navigating between pages           | LOW (standardize width)         |
| 6    | Not-found states render differently across pages                                      | HIGH     | Some not-found pages lose all navigation shell              | MEDIUM (refactor error paths)   |
| 7    | MissionDetail has redundant NAVIGATION section                                        | LOW      | Clutters overview page with duplicate links                 | LOW (remove section)            |
| 8    | MissionExecute vs LiveView component split                                            | HIGH     | Two different views of same data confuse understanding      | HIGH (architectural rework)     |
| 9    | Plan content is plain text, not markdown                                              | MEDIUM   | Structured plans render poorly                              | LOW (use MarkdownViewer)        |
| 10   | Content padding varies between pages                                                  | LOW      | Subtle visual inconsistency                                 | LOW (standardize padding)       |
