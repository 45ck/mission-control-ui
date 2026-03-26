# Glossary of Canonical Terms

> HCI Review Document -- Mission Control Prototype
> Date: 2026-03-24
> Scope: Canonical definitions, source references, and terminology drift analysis

---

## 1. Canonical Terms Table

The following table defines every significant term used in the Mission Control prototype, with source file references and known aliases or drift patterns.

### 1.1 Domain Objects

| Term                  | Definition                                                                                                                                                                                      | Source File(s)                                                                                                                                                                      | Aliases / Drift                                                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mission**           | A unit of supervised agentic work with a defined goal, scope boundary, risk tier, acceptance criteria, and lifecycle stage. The primary organizing entity in Mission Control.                   | `apps/web/src/data/missions.ts:8-35` (interface), `apps/web/src/pages/MissionHome.tsx` (list), `apps/web/src/pages/MissionDetail.tsx` (detail)                                      | None -- term is consistently used. Prefixed `MSN-` in IDs.                                                                                                                                                                                     |
| **Workflow**          | A grouping of related missions under a strategic initiative. Contains an ordered list of mission IDs. Has its own status (`active`, `completed`, `paused`).                                     | `apps/web/src/data/workflows.ts:1-9` (interface), `apps/web/src/pages/Workflows.tsx` (list)                                                                                         | None -- but conceptual confusion exists because Workflows and Missions are parallel nav items yet workflows _contain_ missions. See Section 3.                                                                                                 |
| **Agent Session**     | A single instance of an AI agent working on a mission. Has a role (e.g., "Implementation Agent", "Test Agent", "Research Agent"), a model ID, a sequence of steps, and a status.                | `apps/web/src/data/agent-sessions.ts:15-29` (interface)                                                                                                                             | Sometimes shortened to "session" in UI labels (e.g., `MissionExecute.tsx:210`: "AGENT SESSIONS"). Conflicts with Browser Session and Terminal Session -- see Section 3.                                                                        |
| **Browser Session**   | A headless browser instance that an agent uses to interact with web interfaces during execution.                                                                                                | `apps/web/src/data/browser-sessions.ts` (interface), `apps/web/src/components/execute/SessionPane.tsx` (BrowserSessionPane)                                                         | Called "browser session" consistently.                                                                                                                                                                                                         |
| **Terminal Session**  | A terminal/CLI session that an agent uses for command execution during mission work.                                                                                                            | `apps/web/src/data/terminal-sessions.ts` (interface), `apps/web/src/components/execute/SessionPane.tsx` (TerminalSessionPane)                                                       | Called "terminal session" consistently. Sometimes "terminal" without "session" in status text (`MissionExecute.tsx:302`).                                                                                                                      |
| **Evidence**          | A verification artifact produced during or after mission execution. Has a status (`pass`, `fail`, `warning`, `pending`) and contributes to the mission's VerificationState.                     | `apps/web/src/data/evidence.ts` (interface + data), `apps/web/src/components/evidence/EvidenceRail.tsx` (display), `apps/web/src/components/evidence/VerificationBadge.tsx` (badge) | Called "evidence" in data layer but sometimes "verification" in UI contexts. The EvidenceRail component name and the VerificationBadge component name use different root terms for related concepts.                                           |
| **Escalation**        | An issue that requires human decision-making because an agent has encountered a problem it cannot resolve autonomously. Contains a title, summary, detail, type, and a set of decision options. | `apps/web/src/data/escalations.ts` (interface), `apps/web/src/pages/MissionEscalation.tsx` (page), `apps/web/src/components/escalation/` (components)                               | "Escalation" refers to both the event and the page/stage -- see Section 3 for extensive drift analysis.                                                                                                                                        |
| **Escalation Option** | A possible decision the supervisor can make when resolving an escalation. Each option has a label, description, and risk assessment.                                                            | `apps/web/src/data/escalations.ts` (EscalationOption interface), `apps/web/src/components/escalation/ConsequencePanel.tsx` (display)                                                | Called "option" in code, "DECISION OPTIONS" in UI (`ConsequencePanel.tsx:45`).                                                                                                                                                                 |
| **Artifact**          | A deliverable produced by agent work. Can be of type `image`, `video`, `markdown`, or `html`. Contains inline content or URL references.                                                        | `apps/web/src/data/artifacts.ts:1-13` (interface), `apps/web/src/components/mission/ArtifactPanel.tsx` (gallery/viewer)                                                             | Consistently "artifact" in code. Labeled "ARTIFACTS" in the ArtifactPanel UI (`ArtifactPanel.tsx:31`).                                                                                                                                         |
| **Code File**         | A source file that is part of the mission's codebase, viewable in the CodeViewer component.                                                                                                     | `apps/web/src/data/code-files.ts`                                                                                                                                                   | Sometimes "file" without "code" qualifier.                                                                                                                                                                                                     |
| **Branch**            | A git branch associated with a mission's code changes. Has properties like `name`, `baseBranch`, `aheadBy`, `behindBy`.                                                                         | `apps/web/src/data/branches.ts` (interface)                                                                                                                                         | Referenced as `mission.branch` (string name) on the Mission interface and as a full `Branch` object in the branches data.                                                                                                                      |
| **Workspace**         | **DEPRECATED.** A dissolved entity that previously grouped a mission's branch, open files, and session references into a single object.                                                         | `apps/web/src/data/workspaces.ts:1-12` (interface, deprecated)                                                                                                                      | Legacy term. Still referenced in `LiveView.tsx:117` ("bridge until Workspace entity fully dissolved"), `ActivityPreview.tsx:26` (`workspaces.find`), and via the `WorkspaceRedirect.tsx` legacy URL handler. See Section 3 for detailed drift. |

### 1.2 Lifecycle Terms

| Term                   | Definition                                                                                                    | Source File(s)                                                                                     | Aliases / Drift                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Stage**              | The current phase of a mission's lifecycle. One of: `plan`, `execute`, `review`, `escalation`, `completed`.   | `apps/web/src/data/missions.ts:2` (type), `apps/web/src/components/mission/StageBadge.tsx` (badge) | "Stage" is the canonical type name. "Phase" is not used. BUT "stage" also means the tab in StageTabBar -- see Section 3.     |
| **Verification State** | A computed state derived from a mission's evidence items. One of: `pending`, `passing`, `failing`, `blocked`. | `apps/web/src/data/missions.ts:4` (type), `missions.ts:197-207` (computation)                      | Used as `verificationState` on Mission interface. The `computeVerificationState` function derives it from evidence statuses. |
| **Risk Tier**          | The assessed risk level of a mission. One of: `low`, `medium`, `high`.                                        | `apps/web/src/data/missions.ts:3` (type), `apps/web/src/components/review/RiskBadge.tsx` (badge)   | Consistently "risk tier" in code. Labeled "RISK" in filter UI and badges.                                                    |
| **Priority**           | The urgency of a mission. One of: `low`, `medium`, `high`, `critical`.                                        | `apps/web/src/data/missions.ts:6` (type)                                                           | Defined but not prominently displayed in the current UI. Not to be confused with Risk Tier.                                  |

### 1.3 UI Structure Terms

| Term                  | Definition                                                                                                                                                                               | Source File(s)                                                     | Aliases / Drift                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AppShell**          | The outer layout wrapper that provides the LeftNav, main content area (via Outlet), keyboard shortcuts, and bottom timestamp bar. All pages except LiveView render inside the AppShell.  | `apps/web/src/components/shell/AppShell.tsx:22-113`                | "Shell" in code, never exposed as a label to users.                                                                                                                                          |
| **LeftNav**           | The 200px left sidebar providing primary navigation. Contains links to Workflows, Missions, Costs, History, and Settings. Shows active mission count and "needs review" count at bottom. | `apps/web/src/components/shell/LeftNav.tsx:14-122`                 | "Nav" or "sidebar" informally. The component is named `LeftNav` in code.                                                                                                                     |
| **TopBar**            | The top bar providing breadcrumbs, mission switcher dropdown, search button, notification center, and user avatar. 52px tall.                                                            | `apps/web/src/components/shell/TopBar.tsx:14-134`                  | "Header" informally. Distinct from the LiveView header bar.                                                                                                                                  |
| **StageTabBar**       | Horizontal tab navigation showing OVERVIEW, PLAN, EXECUTE, REVIEW, and ESCALATION tabs. Appears on all mission sub-pages within the AppShell.                                            | `apps/web/src/components/mission/StageTabBar.tsx:1-50`             | "Stage tabs" informally. Tab keys defined at `StageTabBar.tsx:4-10`. Note: `stages` array in StageTabBar has 5 items, but the `Stage` type has 5 values (with `completed` absent from tabs). |
| **Command Palette**   | A Cmd+K overlay for quick navigation to missions, pages, and actions. Searches by mission title, ID, or owner.                                                                           | `apps/web/src/components/shell/CommandPalette.tsx:24-254`          | "Search" on the TopBar button icon. "Command palette" in code only -- never labeled in UI.                                                                                                   |
| **Mission Switcher**  | A dropdown from the TopBar that allows quick switching between missions while preserving the current stage context. Triggered by Cmd+Shift+M or clicking the mission ID badge.           | `apps/web/src/components/shell/MissionSwitcherDropdown.tsx:25-242` | "Switcher" in code. Not labeled in UI -- activated by clicking the mission ID chip in the TopBar.                                                                                            |
| **Focus Panel**       | The right panel on MissionHome that shows details of the currently selected mission card.                                                                                                | `apps/web/src/components/mission/FocusPanel.tsx`                   | Not labeled in UI.                                                                                                                                                                           |
| **Evidence Rail**     | A vertical sidebar showing evidence items with status indicators. Appears on MissionPlan (right, 280px), MissionExecute (right, 260px), and MissionReview (right, 280px).                | `apps/web/src/components/evidence/EvidenceRail.tsx`                | "Rail" in code. Labeled "RISK & EVIDENCE SUMMARY" on MissionPlan (`MissionPlan.tsx:197`).                                                                                                    |
| **Approval Bar**      | A sticky top bar on the MissionReview page showing blocker count, warning count, and approve/reject/re-plan buttons.                                                                     | `apps/web/src/components/review/ApprovalBar.tsx:6-91`              | Not a navigation bar -- it is an action bar. Distinct from TopBar.                                                                                                                           |
| **Consequence Panel** | The right sidebar on MissionEscalation showing decision options for the selected escalation. 300px wide.                                                                                 | `apps/web/src/components/escalation/ConsequencePanel.tsx:19-156`   | Labeled "DECISION OPTIONS" in UI (`ConsequencePanel.tsx:45`).                                                                                                                                |

### 1.4 View Mode Terms

| Term                 | Definition                                                                                                                                                                                                               | Source File(s)                                                            | Aliases / Drift                                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Live View**        | A fullscreen page for real-time supervision of agent work. Renders outside the AppShell, showing code, terminal, browser, and agent session panels. Entered via "ENTER LIVE VIEW" links; exited via Esc or close button. | `apps/web/src/pages/LiveView.tsx:98-205` (page), `App.tsx:48-49` (routes) | **SIGNIFICANT DRIFT** -- see Section 3.1. Called "LIVE SUPERVISION MODE" in the header bar (`LiveView.tsx:176`), "Live View" in link text (`MissionDetail.tsx:294`), "Live" in breadcrumb (`LiveView.tsx:81`). |
| **Workspace Layout** | The internal layout component used by LiveView to render the multi-panel agent workspace (code, terminal, browser, chat).                                                                                                | `apps/web/src/components/workspace/WorkspaceLayout.tsx`                   | "Workspace" persists as a component namespace even though the Workspace entity is deprecated.                                                                                                                  |
| **Supervision Mode** | The label used on the LiveView accent-colored header bar.                                                                                                                                                                | `LiveView.tsx:176` ("LIVE SUPERVISION MODE")                              | Used only once in the entire codebase. Not used in navigation, documentation, or component names.                                                                                                              |

---

## 2. Term Definitions -- Extended

### 2.1 Mission

A Mission is the atomic unit of work in Mission Control. It represents a bounded software engineering task being performed by one or more AI agents under human supervision. Key properties:

- **Goal**: Natural language description of the desired outcome (`mission.goal`)
- **Scope Boundary**: Explicit statement of what is in and out of scope (`mission.scopeBoundary`)
- **Acceptance Criteria**: Verifiable conditions that must be met (`mission.acceptanceCriteria[]`)
- **Risks**: Identified risks that could affect the work (`mission.risks[]`)
- **Stage**: Current lifecycle phase (`mission.stage`)
- **Risk Tier**: Assessed risk level (`mission.riskTier`)
- **Verification State**: Derived from evidence (`mission.verificationState`)
- **Owner**: Human supervisor responsible (`mission.owner`)

Missions can block other missions via `blockedBy` and `blocks` arrays. Missions may belong to a Workflow via `workflowId`.

### 2.2 Plan Content vs Plan Stage

A critical distinction exists between:

- **Plan Stage** (`mission.stage === 'plan'`): The lifecycle phase where the mission's plan is being reviewed and approved. Navigates to `MissionPlan.tsx`.
- **Plan Content**: The actual plan document, which consists of `mission.goal`, `mission.scopeBoundary`, `mission.acceptanceCriteria`, and `mission.risks`. These are plain-text fields on the Mission interface, NOT artifacts.

The conflation of "plan" as both stage and document content creates ambiguity. When a user says "review the plan," do they mean:

1. Navigate to the plan stage/page?
2. Read the plan document content?
3. Both?

The plan content is rendered as plain text in styled divs on MissionPlan (`MissionPlan.tsx:101-161`). It is NOT an Artifact type, does NOT use MarkdownViewer, and has no standalone existence outside the Mission interface.

### 2.3 Live View

Live View is a fullscreen page for real-time observation of agent work. It renders the `WorkspaceLayout` component showing:

- Code editor with open files
- Terminal session output
- Browser session viewport
- Agent session panels

The page exists OUTSIDE the AppShell (`App.tsx:48-49`), meaning it has no LeftNav, no StageTabBar, and only a minimal custom header bar. It can be entered from two locations:

1. "ENTER LIVE VIEW" link on MissionDetail (`MissionDetail.tsx:284-295`)
2. "ENTER LIVE VIEW" link on MissionExecute (`MissionExecute.tsx:182-193`)

Exit is via Escape key (`LiveView.tsx:106-113`) or the close button (`LiveView.tsx:178-184`), both of which navigate back to the execute page.

---

## 3. Terminology Drift Analysis

### 3.1 "Live View" vs "Workspace" vs "Supervision Mode" vs "Browser Session"

This is the most significant terminology drift in the codebase. Four different terms are used for overlapping concepts related to observing agent work:

| Usage                        | Term Used                                       | Location                                                | Context                                                   |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Page component name          | `LiveView`                                      | `apps/web/src/pages/LiveView.tsx:98`                    | React component export                                    |
| Route path                   | `/live`                                         | `App.tsx:48-49`                                         | URL segment                                               |
| Header bar label             | "LIVE SUPERVISION MODE"                         | `LiveView.tsx:176`                                      | Accent-colored top bar text                               |
| Link text on MissionDetail   | "ENTER LIVE VIEW"                               | `MissionDetail.tsx:294`                                 | Button label                                              |
| Link text on MissionExecute  | "ENTER LIVE VIEW"                               | `MissionExecute.tsx:192`                                | Button label                                              |
| Link text on ActivityPreview | "ENTER LIVE VIEW"                               | `ActivityPreview.tsx:169`                               | Button label (execute stage only)                         |
| Breadcrumb segment           | "Live"                                          | `LiveView.tsx:81`                                       | Last breadcrumb item                                      |
| Layout component             | `WorkspaceLayout`                               | `apps/web/src/components/workspace/WorkspaceLayout.tsx` | Layout used inside LiveView                               |
| Deprecated data entity       | `Workspace`                                     | `apps/web/src/data/workspaces.ts:2`                     | Interface (deprecated, line 1 comment)                    |
| Legacy URL                   | `/workspace/:id`                                | `App.tsx:52`                                            | Redirects to LiveView via `WorkspaceRedirect.tsx`         |
| LiveView internal variable   | `effectiveWorkspace`                            | `LiveView.tsx:136`                                      | Compatibility bridge for WorkspaceLayout                  |
| LiveView comment             | "bridge until Workspace entity fully dissolved" | `LiveView.tsx:116`                                      | Inline code comment                                       |
| Data interface               | `LiveViewState`                                 | `workspaces.ts:64-69`                                   | Ephemeral view state (defined but not used in components) |
| Close button title           | "Close Live View"                               | `LiveView.tsx:181`                                      | Button title attribute                                    |
| LeftNav branding             | "AGENT SUPERVISION"                             | `LeftNav.tsx:37`                                        | Subtitle under "Mission Control" logo                     |

**Assessment**: "Live View" is the most commonly used term for the fullscreen observation page. "Workspace" is a legacy term that persists in component directory names (`components/workspace/`), the data layer (`workspaces.ts`), and the LiveView's internal bridge code. "Supervision Mode" appears exactly once (`LiveView.tsx:176`). The LeftNav subtitle "AGENT SUPERVISION" (`LeftNav.tsx:37`) uses yet another formulation.

**Recommendation**: Standardize on "Live View" as the canonical term for the fullscreen observation mode. Remove "workspace" from component directory names and the data layer (complete the dissolution). Replace "LIVE SUPERVISION MODE" with "LIVE VIEW" for consistency. Consider whether "supervision" belongs in the vocabulary at all, or whether "monitoring" or "observation" is more precise.

### 3.2 "Plan" Ambiguity

The word "plan" is overloaded:

| Usage                                         | Meaning                        | Location                             |
| --------------------------------------------- | ------------------------------ | ------------------------------------ |
| `mission.stage === 'plan'`                    | Lifecycle stage                | `missions.ts:2`                      |
| MissionPlan page                              | Page for the plan stage        | `apps/web/src/pages/MissionPlan.tsx` |
| StageTabBar "PLAN" tab                        | Navigation to plan page        | `StageTabBar.tsx:6`                  |
| `mission.goal`, `mission.scopeBoundary`, etc. | Plan document content          | `missions.ts:10-14`                  |
| "Approve Plan & Begin Execution"              | Approve action on plan content | `MissionPlan.tsx:176`                |
| "Re-plan" button in ApprovalBar               | Send back to plan stage        | `ApprovalBar.tsx:57`                 |

**Assessment**: "Plan" simultaneously means "the current lifecycle phase" and "the document that describes the mission's approach." When the ApprovalBar's "Re-plan" button is clicked, does the supervisor expect the mission to return to the plan stage, or for the plan document content to be revised, or both?

### 3.3 "Review" Ambiguity

Similar to "plan," the word "review" is overloaded:

| Usage                        | Meaning                             | Location                               |
| ---------------------------- | ----------------------------------- | -------------------------------------- |
| `mission.stage === 'review'` | Lifecycle stage                     | `missions.ts:2`                        |
| MissionReview page           | Page for the review stage           | `apps/web/src/pages/MissionReview.tsx` |
| StageTabBar "REVIEW" tab     | Navigation to review page           | `StageTabBar.tsx:8`                    |
| "Approve" / "Reject" buttons | Review actions                      | `ApprovalBar.tsx:48-87`                |
| LeftNav "needs review" count | Count of missions needing attention | `LeftNav.tsx:19-21`                    |
| "Review approved" toast      | Approval confirmation               | `MissionReview.tsx:66`                 |

**Assessment**: "Review" is both a stage and an action. The LeftNav "needs review" count (`LeftNav.tsx:19-21`) counts missions in `review` OR `escalation` stages, conflating two types of "needs attention." The "Approve" button performs a "review" action but the approval itself is not called a "review" -- it is an approval.

### 3.4 "Session" Collision

Three different entity types share the word "session":

| Term             | Meaning                             | Source                    |
| ---------------- | ----------------------------------- | ------------------------- |
| Agent Session    | An AI agent instance's work session | `agent-sessions.ts:15-29` |
| Browser Session  | A headless browser instance         | `browser-sessions.ts`     |
| Terminal Session | A CLI terminal instance             | `terminal-sessions.ts`    |

The MissionExecute page labels a section "SESSIONS" (`MissionExecute.tsx:318`) that shows browser and terminal sessions, while "AGENT SESSIONS" (`MissionExecute.tsx:210`) is a separate section above. This creates a visual hierarchy where "sessions" by default means browser/terminal, not agent, which contradicts the data model where all three are equally "sessions."

### 3.5 "Evidence" vs "Verification"

Two related terms are used somewhat interchangeably:

| Term                      | Usage                                    | Location                                   |
| ------------------------- | ---------------------------------------- | ------------------------------------------ |
| Evidence                  | Data items with pass/fail/warning status | `evidence.ts`, `EvidenceRail.tsx`          |
| Verification State        | Computed summary of evidence             | `missions.ts:4` (`VerificationState` type) |
| Verification Badge        | UI component showing verification state  | `VerificationBadge.tsx`                    |
| "RISK & EVIDENCE SUMMARY" | Rail label on MissionPlan                | `MissionPlan.tsx:197`                      |

**Assessment**: "Evidence" is the collection; "Verification State" is the aggregate. The component naming is inconsistent: `EvidenceRail` displays evidence items, but `VerificationBadge` displays the computed state. The MissionPlan rail label "RISK & EVIDENCE SUMMARY" combines two concepts that are separately managed.

### 3.6 Escalation Model Terminology

The escalation concept has structural terminology drift due to the in-progress model change:

| Term                 | Old Model                                       | New Model                                 | Source              |
| -------------------- | ----------------------------------------------- | ----------------------------------------- | ------------------- |
| Escalation Stage     | `stage === 'escalation'` (a lifecycle position) | Deprecated (`missions.ts:1` comment)      | `missions.ts:2`     |
| Escalation Overlay   | N/A                                             | `escalationActive: true` (a boolean flag) | `missions.ts:33`    |
| Escalation Page      | Always navigable via StageTabBar                | Still always navigable (no change)        | `StageTabBar.tsx:9` |
| "Needs review" count | Counts `stage === 'escalation'`                 | Also counts `stage === 'escalation'`      | `LeftNav.tsx:19-21` |

**Assessment**: The LeftNav filter at `LeftNav.tsx:19-21` counts `m.stage === 'review' || m.stage === 'escalation'`, which uses the old model. But MSN-004 uses the new model (`stage: 'review'`, `escalationActive: true`) and would be counted as "needs review" by virtue of its `review` stage, not its escalation overlay. The two models happen to produce the same LeftNav count for the current data but would diverge if a mission in `execute` stage had `escalationActive: true`.

---

## 4. Component-to-Label Mapping

This table maps every React component name to its user-facing label (if any), revealing mismatches between internal naming and what the user sees.

### 4.1 Page Components

| Component Name      | File                                       | User-Facing Label                       | Mismatch                                                   |
| ------------------- | ------------------------------------------ | --------------------------------------- | ---------------------------------------------------------- |
| `MissionHome`       | `apps/web/src/pages/MissionHome.tsx`       | "Missions" (TopBar breadcrumb)          | Component says "Home", user sees "Missions"                |
| `MissionDetail`     | `apps/web/src/pages/MissionDetail.tsx`     | "Overview" (breadcrumb + StageTabBar)   | Component says "Detail", UI says "Overview"                |
| `MissionPlan`       | `apps/web/src/pages/MissionPlan.tsx`       | "Plan" (breadcrumb + StageTabBar)       | Match                                                      |
| `MissionExecute`    | `apps/web/src/pages/MissionExecute.tsx`    | "Execute" (breadcrumb + StageTabBar)    | Match                                                      |
| `MissionReview`     | `apps/web/src/pages/MissionReview.tsx`     | "Review" (breadcrumb + StageTabBar)     | Match                                                      |
| `MissionEscalation` | `apps/web/src/pages/MissionEscalation.tsx` | "Escalation" (breadcrumb + StageTabBar) | Match                                                      |
| `MissionCreate`     | `apps/web/src/pages/MissionCreate.tsx`     | "NEW MISSION" (button text)             | Component says "Create", button says "NEW MISSION"         |
| `LiveView`          | `apps/web/src/pages/LiveView.tsx`          | "LIVE SUPERVISION MODE" (header bar)    | Component says "LiveView", UI says "LIVE SUPERVISION MODE" |
| `CostDashboard`     | `apps/web/src/pages/CostDashboard.tsx`     | "Costs" (LeftNav)                       | Component says "Dashboard", nav says "Costs"               |
| `Workflows`         | `apps/web/src/pages/Workflows.tsx`         | "Workflows" (LeftNav)                   | Match                                                      |
| `WorkflowDetail`    | `apps/web/src/pages/WorkflowDetail.tsx`    | Workflow title (breadcrumb)             | Component says "Detail", user sees workflow title          |
| `WorkflowCreate`    | `apps/web/src/pages/WorkflowCreate.tsx`    | (no breadcrumb visible)                 | --                                                         |
| `History`           | `apps/web/src/pages/History.tsx`           | "History" (LeftNav)                     | Match                                                      |
| `Settings`          | `apps/web/src/pages/Settings.tsx`          | "Settings" (LeftNav)                    | Match                                                      |
| `WorkspaceRedirect` | `apps/web/src/pages/WorkspaceRedirect.tsx` | (no label -- redirect only)             | Legacy component                                           |

### 4.2 Shell Components

| Component Name            | File                                                        | User-Facing Label                                 | Mismatch                                              |
| ------------------------- | ----------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| `AppShell`                | `apps/web/src/components/shell/AppShell.tsx`                | (invisible wrapper)                               | No user label                                         |
| `LeftNav`                 | `apps/web/src/components/shell/LeftNav.tsx`                 | "Mission Control / AGENT SUPERVISION" (logo area) | Component name describes position; user sees branding |
| `TopBar`                  | `apps/web/src/components/shell/TopBar.tsx`                  | (no label -- structural)                          | No user label                                         |
| `CommandPalette`          | `apps/web/src/components/shell/CommandPalette.tsx`          | "Search missions, pages..." (placeholder text)    | Component says "CommandPalette", user sees "Search"   |
| `MissionSwitcherDropdown` | `apps/web/src/components/shell/MissionSwitcherDropdown.tsx` | (no label -- activated by mission ID click)       | No user label                                         |
| `NotificationCenter`      | `apps/web/src/components/shell/NotificationCenter.tsx`      | (bell icon, no text label)                        | No user label                                         |
| `PageTransition`          | `apps/web/src/components/shell/PageTransition.tsx`          | (invisible animation wrapper)                     | No user label                                         |

### 4.3 Mission Components

| Component Name    | File                                                  | User-Facing Label                                      |
| ----------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `StageTabBar`     | `apps/web/src/components/mission/StageTabBar.tsx`     | "OVERVIEW \| PLAN \| EXECUTE \| REVIEW \| ESCALATION"  |
| `MissionCard`     | `apps/web/src/components/mission/MissionCard.tsx`     | Mission title as card heading                          |
| `MissionHeader`   | `apps/web/src/components/mission/MissionHeader.tsx`   | Mission title + badges                                 |
| `MissionTimeline` | `apps/web/src/components/mission/MissionTimeline.tsx` | "TIMELINE" section label                               |
| `StageBadge`      | `apps/web/src/components/mission/StageBadge.tsx`      | Stage name in badge (e.g., "REVIEW")                   |
| `FocusPanel`      | `apps/web/src/components/mission/FocusPanel.tsx`      | (no label -- right panel on MissionHome)               |
| `ActivityPreview` | `apps/web/src/components/mission/ActivityPreview.tsx` | "LIVE ACTIVITY" or "RESULT PREVIEW" depending on stage |
| `ArtifactPanel`   | `apps/web/src/components/mission/ArtifactPanel.tsx`   | "ARTIFACTS"                                            |
| `MarkdownViewer`  | `apps/web/src/components/mission/MarkdownViewer.tsx`  | (no label -- renders markdown content inline)          |

### 4.4 Review and Evidence Components

| Component Name      | File                                                     | User-Facing Label                                |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| `ApprovalBar`       | `apps/web/src/components/review/ApprovalBar.tsx`         | "Ready for approval" or "N blockers remaining"   |
| `DiffByIntent`      | `apps/web/src/components/review/DiffByIntent.tsx`        | (renders diff blocks)                            |
| `RiskBadge`         | `apps/web/src/components/review/RiskBadge.tsx`           | "LOW" / "MEDIUM" / "HIGH"                        |
| `EvidenceRail`      | `apps/web/src/components/evidence/EvidenceRail.tsx`      | (no section label by default; labeled by parent) |
| `VerificationBadge` | `apps/web/src/components/evidence/VerificationBadge.tsx` | "PASSING" / "FAILING" / "BLOCKED" / "PENDING"    |

### 4.5 Escalation Components

| Component Name     | File                                                      | User-Facing Label                  |
| ------------------ | --------------------------------------------------------- | ---------------------------------- |
| `EscalationHeader` | `apps/web/src/components/escalation/EscalationHeader.tsx` | Escalation title + type + severity |
| `ReplayTimeline`   | `apps/web/src/components/escalation/ReplayTimeline.tsx`   | (renders agent step replay)        |
| `ConsequencePanel` | `apps/web/src/components/escalation/ConsequencePanel.tsx` | "DECISION OPTIONS"                 |

### 4.6 Execute Components

| Component Name        | File                                                   | User-Facing Label          |
| --------------------- | ------------------------------------------------------ | -------------------------- |
| `AgentSwimlane`       | `apps/web/src/components/execute/AgentSwimlane.tsx`    | Agent role name as heading |
| `AgentChatPanel`      | `apps/web/src/components/execute/AgentChatPanel.tsx`   | "CHAT" (view mode toggle)  |
| `AgentConfigPanel`    | `apps/web/src/components/execute/AgentConfigPanel.tsx` | (modal -- title varies)    |
| `BrowserSessionPane`  | `apps/web/src/components/execute/SessionPane.tsx`      | "BROWSER SESSION"          |
| `TerminalSessionPane` | `apps/web/src/components/execute/SessionPane.tsx`      | "TERMINAL SESSION"         |

---

## 5. Action Verbs in the UI

This section catalogs the action verbs used in buttons and interactive elements, assessing consistency.

### 5.1 Approval-Related Verbs

| Verb            | Button Text                      | Location                   | Meaning                                    |
| --------------- | -------------------------------- | -------------------------- | ------------------------------------------ |
| Approve         | "Approve Plan & Begin Execution" | `MissionPlan.tsx:176`      | Accept the plan, transition to execute     |
| Approve         | "Approve"                        | `ApprovalBar.tsx:86`       | Accept the review, transition to completed |
| Reject          | "Reject"                         | `ApprovalBar.tsx:69`       | Deny the review                            |
| Re-plan         | "Re-plan"                        | `ApprovalBar.tsx:57`       | Send back to plan stage                    |
| Request Changes | "Request Changes"                | `MissionPlan.tsx:184`      | Ask for plan modifications                 |
| Confirm         | "CONFIRM"                        | `ConsequencePanel.tsx:138` | Confirm an escalation decision             |
| Cancel          | "CANCEL"                         | `ConsequencePanel.tsx:144` | Cancel the current selection               |

**Assessment**: "Approve" is used for two different transitions (plan-to-execute, review-to-completed). "Request Changes" on the plan page and "Re-plan" on the review page describe similar concepts (send work back for revision) but use different verbs. A user may not realize these are analogous actions.

### 5.2 Navigation-Related Verbs

| Verb / Phrase        | Location                                                                                             | Meaning                         |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| "ENTER LIVE VIEW"    | `MissionDetail.tsx:294`, `MissionExecute.tsx:192`, `ActivityPreview.tsx:169`                         | Navigate to fullscreen LiveView |
| "Back to mission"    | `MissionPlan.tsx:95`, `MissionExecute.tsx:110`, `MissionReview.tsx:117`, `MissionEscalation.tsx:126` | Navigate to MissionDetail       |
| "Back to missions"   | `MissionPlan.tsx:50`, `MissionExecute.tsx:55` (not-found state)                                      | Navigate to MissionHome         |
| "Back"               | `LiveView.tsx:49`                                                                                    | Navigate to execute page        |
| "Return to Missions" | `LiveView.tsx:163` (not-found state)                                                                 | Navigate to MissionHome         |
| "Go to Missions"     | `App.tsx:39` (NotFound page)                                                                         | Navigate to MissionHome         |
| "+ NEW MISSION"      | `MissionHome.tsx:110`                                                                                | Navigate to MissionCreate       |
| "Create Mission"     | `CommandPalette.tsx:22`                                                                              | Navigate to MissionCreate       |

**Assessment**: The "back" navigation uses three different phrasings ("Back to mission", "Back to missions", "Back") and two different targets (MissionDetail, MissionHome). "ENTER LIVE VIEW" uses all-caps while "Back to mission" uses sentence case -- inconsistent casing conventions.

### 5.3 Section Labels (All-Caps Conventions)

The UI uses all-caps for section headings. These are the section labels found across pages:

| Label                                  | Page                                       | Component |
| -------------------------------------- | ------------------------------------------ | --------- |
| "GOAL" / "MISSION GOAL"                | MissionDetail / MissionPlan                | Inline    |
| "SCOPE BOUNDARY" / "SCOPE"             | MissionDetail / MissionExecute             | Inline    |
| "ACCEPTANCE CRITERIA"                  | MissionDetail, MissionPlan, MissionExecute | Inline    |
| "RISK ASSESSMENT" / "IDENTIFIED RISKS" | MissionDetail / MissionPlan                | Inline    |
| "AGENT SESSIONS"                       | MissionDetail, MissionExecute              | Inline    |
| "EVIDENCE SUMMARY"                     | MissionDetail                              | Inline    |
| "RISK & EVIDENCE SUMMARY"              | MissionPlan                                | Inline    |
| "ESCALATION ALERTS"                    | MissionDetail                              | Inline    |
| "TIMELINE"                             | MissionDetail                              | Inline    |
| "NAVIGATION"                           | MissionDetail                              | Inline    |
| "AGENT LOG"                            | MissionExecute                             | Inline    |
| "EXECUTE PREVIEW"                      | MissionExecute                             | Inline    |
| "SESSIONS"                             | MissionExecute                             | Inline    |
| "ISSUE DETAIL"                         | MissionEscalation                          | Inline    |
| "ALL ESCALATIONS"                      | MissionEscalation                          | Inline    |
| "DECISION OPTIONS"                     | ConsequencePanel                           | Component |
| "ROLLBACK PREVIEW"                     | MissionReview                              | Inline    |
| "ARTIFACTS"                            | ArtifactPanel                              | Component |
| "LIVE ACTIVITY" / "RESULT PREVIEW"     | ActivityPreview                            | Component |
| "LIVE SUPERVISION MODE"                | LiveView                                   | Inline    |
| "AGENT SUPERVISION"                    | LeftNav                                    | Inline    |

**Assessment**: Two naming inconsistencies stand out:

1. "GOAL" on MissionDetail vs "MISSION GOAL" on MissionPlan -- the same field, different labels.
2. "RISK ASSESSMENT" on MissionDetail vs "IDENTIFIED RISKS" on MissionPlan -- same data, different framing.

---

## 6. Cross-References

- **Object definitions**: See `conceptual-model.md` Section 2 for the full object inventory and relationship diagram.
- **State definitions**: See `state-model.md` for detailed state machine analysis of each term's associated states.
- **Navigation terms**: See `information-architecture.md` for how AppShell, LeftNav, TopBar, and StageTabBar relate structurally.
