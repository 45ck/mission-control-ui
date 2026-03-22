# Vocabulary Audit: Mission Control

**Date**: 2026-03-23
**Scope**: All UI-visible labels, type definitions, status indicators, and action verbs across the Mission Control prototype.
**Method**: Exhaustive extraction from every `.tsx` page, component, and `.ts` data file in `apps/web/src/`.

---

## 1. Canonical Glossary

### Entity Nouns

| Term                    | Type              | Exact meaning                                                                                                                                 | Where used                                                                                                                                           | Notes                                                                                                                                                                |
| ----------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mission**             | noun              | A bounded unit of agentic work with a goal, scope boundary, acceptance criteria, risk tier, and lifecycle stages. Has an owner.               | Everywhere: data/missions.ts, all pages, LeftNav, MissionCard, FocusPanel, CommandPalette, TopBar breadcrumbs                                        | Primary entity. Well-defined. No synonyms.                                                                                                                           |
| **Workflow**            | noun              | An orchestration container grouping multiple related missions. Has an owner and a status.                                                     | data/workflows.ts, Workflows page, WorkflowDetail (Kanban board), WorkflowCreate, LeftNav, breadcrumbs                                               | Clean separation from Mission. Good.                                                                                                                                 |
| **Agent Session**       | noun              | A single AI agent execution context tied to a mission. Has a role (e.g. "Implementation Agent"), model, status, steps, token usage, and cost. | data/agent-sessions.ts, AgentSwimlane, AgentChatPanel, MissionExecute, LiveView, SessionTabs                                                         | "Session" is overloaded -- see problems below.                                                                                                                       |
| **Step**                | noun              | A discrete action performed by an agent within a session. Has action name, status, detail, and timestamp.                                     | data/agent-sessions.ts (AgentStep), StepCard, AgentSwimlane, ReplayTimeline                                                                          | Not "phase" or "stage" -- good. Distinct from Stage.                                                                                                                 |
| **Evidence**            | noun              | A verifiable artifact (test result, policy check, requirement trace, or risk explanation) produced during execution. Has a status.            | data/evidence.ts, EvidenceCard, EvidenceRail, EvidenceDetailModal, MissionDetail, MissionPlan, MissionExecute, MissionReview                         | Well-defined. Four subtypes.                                                                                                                                         |
| **Escalation**          | noun              | A decision point raised when an agent cannot proceed autonomously. Classified by type. Contains options for human decision.                   | data/escalations.ts, EscalationHeader, ConsequencePanel, MissionEscalation, MissionDetail                                                            | Good military metaphor alignment.                                                                                                                                    |
| **Branch**              | noun              | A git branch associated with a mission's code changes.                                                                                        | data/branches.ts, BranchBadge, LiveView, WorkspaceInfoBar                                                                                            | Clear and standard.                                                                                                                                                  |
| **Workspace**           | noun (deprecated) | An IDE-like environment linking a mission to files, terminal, browser, and agent sessions.                                                    | data/workspaces.ts (marked `@deprecated`), Workspace.tsx page, WorkspaceRedirect.tsx, WorkspaceLayout, WorkspaceTabs                                 | **PROBLEM**: Entity deprecated in data layer (`@deprecated` JSDoc) but still has a full page, components, and route. See section 5.                                  |
| **Live View**           | noun/mode         | A fullscreen supervision mode showing real-time agent work: code editor, terminal, browser, and chat. Replaces the Workspace concept.         | LiveView.tsx page, "ENTER LIVE VIEW" buttons, LiveViewHeader, banner "LIVE SUPERVISION MODE"                                                         | **Decision recorded**: Workspace dissolved into this. But both still coexist.                                                                                        |
| **Notification**        | noun              | A system alert about stage changes, escalations, agent failures, approvals, or evidence events.                                               | data/notifications.ts, NotificationCenter                                                                                                            | Clear.                                                                                                                                                               |
| **Mission Event**       | noun              | A timestamped lifecycle event in a mission's history.                                                                                         | data/mission-events.ts, MissionTimeline                                                                                                              | Displayed as TIMELINE in UI. Not called "event" in labels.                                                                                                           |
| **Browser Session**     | noun              | An agent's browser automation context for testing/verification.                                                                               | data/browser-sessions.ts, SessionPane (BrowserSessionPane), WorkspaceLayout                                                                          |                                                                                                                                                                      |
| **Terminal Session**    | noun              | An agent's terminal execution context.                                                                                                        | data/terminal-sessions.ts, SessionPane (TerminalSessionPane), WorkspaceLayout                                                                        |                                                                                                                                                                      |
| **Policy**              | noun              | A configurable governance rule (e.g., "High-risk missions require 2 approvals").                                                              | Settings page (Active Policies section)                                                                                                              | Only appears in Settings. Not referenced from mission lifecycle.                                                                                                     |
| **Risk Tier**           | noun              | Classification of mission risk: low, medium, high.                                                                                            | data/missions.ts (RiskTier type), RiskBadge, MissionCreate, Settings (Risk Tier Thresholds)                                                          |                                                                                                                                                                      |
| **Verification State**  | noun              | Aggregate verification status of a mission: pending, passing, failing, blocked.                                                               | data/missions.ts (VerificationState type), VerificationBadge                                                                                         | Distinct from Evidence status.                                                                                                                                       |
| **Scope Boundary**      | noun              | Explicit definition of what is in and out of scope for a mission.                                                                             | Mission interface (scopeBoundary field), MissionPlan, MissionCreate, FocusPanel, MissionExecute                                                      | Label varies: "SCOPE BOUNDARY" (MissionPlan, MissionCreate, MissionDetail) vs. "SCOPE" (MissionExecute left panel) vs. "Scope boundary" (FocusPanel). See section 5. |
| **Acceptance Criteria** | noun              | Measurable conditions that must be satisfied for a mission to pass review.                                                                    | Mission interface, MissionPlan, MissionCreate, MissionExecute, FocusPanel                                                                            | Consistent labeling across the UI.                                                                                                                                   |
| **Goal**                | noun              | The purpose and intended outcome of a mission.                                                                                                | Mission interface (goal field), MissionPlan ("MISSION GOAL"), MissionCreate ("GOAL"), MissionDetail ("GOAL"), FocusPanel (unlabeled, just displayed) | Label varies: "MISSION GOAL" vs. "GOAL".                                                                                                                             |
| **Owner**               | noun              | The human responsible for a mission or workflow.                                                                                              | Mission/Workflow interfaces, MissionDetail, MissionHeader, MissionCard, WorkflowDetail, Settings                                                     | Consistent.                                                                                                                                                          |
| **Checkpoint**          | noun              | The specific point in an agent session's execution where an escalation was raised.                                                            | Escalation interface (checkpoint field), EscalationHeader                                                                                            | Only visible on escalation pages.                                                                                                                                    |
| **Decision Option**     | noun              | A proposed resolution path for an escalation, with risk assessment.                                                                           | EscalationOption interface, ConsequencePanel                                                                                                         | Panel title: "DECISION OPTIONS".                                                                                                                                     |

### Chat/Agent Message Vocabulary

| Term               | Type | Exact meaning                                                             | Where used                                                        | Notes                         |
| ------------------ | ---- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------- |
| **Plan Proposal**  | noun | A structured plan submitted by an agent for human approval.               | agent-chat.ts (role: 'plan-proposal'), ChatPlanProposal component | Label in UI: "PROPOSED PLAN". |
| **Tool Call**      | noun | An agent invoking a tool (file_read, file_write, terminal, browser, git). | agent-chat.ts (role: 'tool-call'), ChatMessage                    | Label in UI: "TOOL: {name}".  |
| **Tool Result**    | noun | The output returned from a tool invocation.                               | agent-chat.ts (role: 'tool-result'), ChatMessage                  | Label in UI: "RESULT".        |
| **System Message** | noun | An automated status message (e.g., "Plan approved. Agent proceeding.").   | agent-chat.ts (role: 'system'), ChatMessage                       | Italicized, centered in chat. |

---

## 2. Terms to Merge or Ban

| Avoid this term                                                   | Use instead                                                                           | Reason                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------------------------------------------------------------------------------- |
| **Workspace** (as entity)                                         | **Live View** (as mode name)                                                          | The `@deprecated` JSDoc on Workspace type says it is dissolved, but `Workspace.tsx` page and `WorkspaceTabs.tsx` still exist with full routes. The entity name persists in code (`WorkspaceLayout`, `WorkspaceInfoBar`, `WorkspaceTabs`, `aria-label="Add workspace"`). Must complete the dissolution: rename remaining components or remove the standalone Workspace page. |
| **SESSIONS** (section header)                                     | **BROWSER & TERMINAL** or just omit the header                                        | On MissionExecute, "SESSIONS" labels browser and terminal panes. But "Agent Sessions" is a separate concept shown above. Two meanings of "session" on the same screen.                                                                                                                                                                                                      |
| **WARN** (evidence summary)                                       | **WARNING**                                                                           | MissionDetail shows `{count} WARN` but EvidenceRail shows `{count} warn`. The EvidenceStatus type uses `warning`. All three forms exist. Pick one: `WARNING`.                                                                                                                                                                                                               |
| **MED RISK** (RiskBadge)                                          | **MEDIUM RISK**                                                                       | RiskBadge truncates "MEDIUM" to "MED". Filter buttons say "MEDIUM". Select options say "MEDIUM". The badge is the only place that abbreviates. Inconsistent.                                                                                                                                                                                                                |
| **Back to missions** / **Back to workflow** / **Back to mission** | Standardize casing: **Back to Missions** / **Back to Workflow** / **Back to Mission** | Link text uses inconsistent capitalization: sometimes title case ("Return to Missions"), sometimes sentence case ("Back to missions"). Pick one convention.                                                                                                                                                                                                                 |
| **Scope boundary** (FocusPanel, mixed case)                       | **SCOPE BOUNDARY**                                                                    | FocusPanel uses sentence case "Scope boundary" while every other instance uses all-caps "SCOPE BOUNDARY". The label should match.                                                                                                                                                                                                                                           |
| **Acceptance criteria** (FocusPanel, mixed case)                  | **ACCEPTANCE CRITERIA**                                                               | Same issue as above. FocusPanel uses "Acceptance criteria" in sentence case.                                                                                                                                                                                                                                                                                                |
| **IDENTIFIED RISKS** (MissionPlan, MissionCreate)                 | **RISK ASSESSMENT** or **IDENTIFIED RISKS**                                           | MissionDetail uses "RISK ASSESSMENT", MissionPlan and MissionCreate use "IDENTIFIED RISKS". Same data, two labels.                                                                                                                                                                                                                                                          |
| **AGENT LOG** (MissionExecute)                                    | Consider **AGENT ACTIVITY**                                                           | "Log" implies raw output. What is shown is a high-level activity feed of step actions. But this is a minor concern.                                                                                                                                                                                                                                                         |
| **EXECUTE PREVIEW**                                               | Consider **EXECUTION PREVIEW**                                                        | "Execute" is a verb used as an adjective here. "Execution" is the noun form and reads better as a label.                                                                                                                                                                                                                                                                    |
| **success** (step status check)                                   | **completed**                                                                         | In MissionExecute agent log, code checks `step.status === 'success'` but the AgentStep type defines statuses as `completed                                                                                                                                                                                                                                                  | running | pending | failed`. There is no `success` status. This is a bug, not just a vocabulary issue. |
| **MISSION HISTORY & APPROVAL CHAIN**                              | **MISSION HISTORY**                                                                   | The History page displays `MISSION HISTORY & APPROVAL CHAIN` but shows no approval chain data -- just a timeline of missions sorted by update date. The label promises more than it delivers.                                                                                                                                                                               |
| **OPERATING SURFACE**                                             | Remove or explain                                                                     | AppShell bottom bar says `MISSION.CTRL // OPERATING SURFACE v0.1.0`. "Operating surface" is not defined anywhere. It is decorative jargon.                                                                                                                                                                                                                                  |
| **AGENT SUPERVISION**                                             | Remove or explain                                                                     | LeftNav subtitle reads `AGENT SUPERVISION`. This is a tagline, not a navigable concept. It may confuse users into thinking there is a dedicated supervision view.                                                                                                                                                                                                           |

---

## 3. Status Vocabulary

### Mission Stage (lifecycle position)

| Status         | Meaning                                                                                                  | Entered when                                                                | Exited when                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **plan**       | Mission is being scoped: goal, risks, acceptance criteria defined; awaiting approval to begin execution. | Mission created                                                             | Plan approved ("Approve Plan & Begin Execution" clicked)      |
| **execute**    | Agents are actively working. Code changes, tests, evidence being produced.                               | Plan approved                                                               | All acceptance criteria addressed and agent sessions complete |
| **review**     | Work complete; human reviews diffs, evidence, and decides to approve or reject.                          | Execution completes                                                         | Human approves or rejects                                     |
| **escalation** | Agent hit a blocker requiring human decision. Options presented with consequences.                       | Agent raises escalation (ambiguous requirement, conflicting evidence, etc.) | Human selects a decision option and confirms                  |

**Display**: StageBadge renders as all-caps: `PLAN`, `EXECUTE`, `REVIEW`, `ESCALATION`.

**Issue**: "escalation" is both a stage and a noun (an Escalation entity). A mission in the "review" stage can have escalations too (see MSN-001: stage=review but has ESC-001). The stage label implies escalation is a phase you move into, but escalations can exist in any stage. This is the most confusing overload in the vocabulary.

### Agent Session Status

| Status        | Meaning                                           | Entered when                                          | Exited when                            |
| ------------- | ------------------------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| **active**    | Agent is running and producing output.            | Session starts                                        | Session completes, fails, or is paused |
| **paused**    | Agent stopped by system or human; can be resumed. | Human pauses or agent self-pauses (awaiting decision) | Human resumes                          |
| **completed** | Agent finished its task successfully.             | All steps done                                        | Terminal state                         |
| **failed**    | Agent encountered an unrecoverable error.         | Step fails                                            | Terminal state (unless restarted)      |

**Display**: AgentSwimlane renders status as uppercase text next to a colored dot. AgentChatPanel StatusBar renders `session.status.toUpperCase()`.

### Agent Step Status

| Status        | Meaning                      | Entered when            | Exited when             |
| ------------- | ---------------------------- | ----------------------- | ----------------------- |
| **completed** | Step finished successfully.  | Step runs to completion | Terminal                |
| **running**   | Step is currently executing. | Step begins             | Step completes or fails |
| **pending**   | Step has not started yet.    | Step is queued          | Step begins running     |
| **failed**    | Step encountered an error.   | Step throws/errors      | Terminal                |

**Issue**: StepCard maps these to icons (CheckCircle, Loader, Circle, XCircle) and colors. The MissionExecute agent log checks for `step.status === 'success'` which does not exist in the type. Bug.

### Evidence Status

| Status      | Meaning                                                | Entered when                                       | Exited when                      |
| ----------- | ------------------------------------------------------ | -------------------------------------------------- | -------------------------------- |
| **pass**    | Evidence confirms the requirement/policy is satisfied. | Test passes, policy check succeeds, trace verified | Evidence re-evaluated and fails  |
| **fail**    | Evidence shows a violation or failure.                 | Test fails, policy violation detected              | Evidence re-evaluated and passes |
| **warning** | Evidence shows a concern that may or may not block.    | Partial compliance, edge case detected             | Resolved or escalated            |
| **pending** | Evidence has not been evaluated yet.                   | Evidence item created but not yet run              | Evaluation completes             |

**Display**: EvidenceCard renders status as uppercase text. EvidenceDetailModal renders as title case: "Passing", "Failing", "Warning", "Pending".

**Issue**: EvidenceDetailModal uses `statusLabels` with present participle forms ("Passing", "Failing") but the raw status values are simple ("pass", "fail"). This is a **tense mismatch**: the evidence status is `pass` (a result), but the detail modal calls it "Passing" (an ongoing state). These are different concepts: "Passing" implies it could change; "Pass" implies a verdict.

### Verification State (mission-level aggregate)

| Status      | Meaning                                               | Entered when               | Exited when               |
| ----------- | ----------------------------------------------------- | -------------------------- | ------------------------- |
| **pending** | No evidence evaluated yet.                            | Mission created            | First evidence evaluated  |
| **passing** | All evidence passes (or passes with warnings).        | All evidence items pass    | Any evidence fails        |
| **failing** | At least one evidence item fails.                     | Any evidence fails         | Failing evidence resolved |
| **blocked** | Mission cannot proceed; depends on external decision. | Escalation blocks progress | Escalation resolved       |

**Display**: VerificationBadge renders as all-caps: `PENDING`, `PASSING`, `FAILING`, `BLOCKED`.

**Issue**: These are present participle forms, which is correct -- they describe ongoing states. But they don't match the evidence status vocabulary (`pass`/`fail` vs. `passing`/`failing`). The user must mentally map between two different tense conventions.

### Branch Status

| Status     | Meaning                                                      | Entered when                          | Exited when                 |
| ---------- | ------------------------------------------------------------ | ------------------------------------- | --------------------------- |
| **active** | Branch is current and receiving commits.                     | Branch created                        | Branch merged or goes stale |
| **merged** | Branch has been merged into base.                            | PR merged                             | Terminal                    |
| **stale**  | Branch has not received commits and is significantly behind. | Branch falls behind base by threshold | Branch receives new commits |

**Display**: BranchBadge shows a colored dot (green=active, yellow=stale, gray=merged) but does not render the status text.

### Workflow Status

| Status        | Meaning                                | Entered when                       | Exited when           |
| ------------- | -------------------------------------- | ---------------------------------- | --------------------- |
| **active**    | Workflow has missions in progress.     | Workflow created                   | All missions complete |
| **completed** | All missions in the workflow are done. | All missions reach completed stage | N/A                   |
| **paused**    | Workflow is halted.                    | Human pauses                       | Human resumes         |

**Display**: RuleLabel on Workflows and WorkflowDetail pages renders `workflow.status.toUpperCase()`.

### Browser Session Status

| Status        | Meaning                                        | Entered when                        | Exited when                    |
| ------------- | ---------------------------------------------- | ----------------------------------- | ------------------------------ |
| **active**    | Browser is currently being driven by an agent. | Session starts                      | Session completes or goes idle |
| **idle**      | Browser is open but not being actively used.   | Agent finishes current browser task | Agent resumes browser work     |
| **completed** | Browser session is finished.                   | Testing complete                    | Terminal                       |

### Terminal Session Status

| Status        | Meaning                        | Entered when       | Exited when                |
| ------------- | ------------------------------ | ------------------ | -------------------------- |
| **active**    | Terminal command is running.   | Command starts     | Command completes or fails |
| **completed** | Command finished successfully. | Exit code 0        | Terminal                   |
| **failed**    | Command finished with error.   | Non-zero exit code | Terminal                   |

### Notification Type

| Type              | Meaning                                    | Rendered as           |
| ----------------- | ------------------------------------------ | --------------------- |
| **stage-change**  | Mission moved to a new stage.              | ArrowRightCircle icon |
| **escalation**    | Escalation raised on a mission.            | AlertTriangle icon    |
| **agent-failure** | Agent session failed or paused with error. | XCircle icon          |
| **approval**      | Plan or review approved.                   | CheckCircle icon      |
| **evidence**      | New evidence collected.                    | FileText icon         |

### Escalation Type

| Type                       | Display label          | Meaning                                                                                      |
| -------------------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| **ambiguous-requirement**  | AMBIGUOUS REQUIREMENT  | Acceptance criteria or scope is unclear; agent cannot determine correct behavior.            |
| **conflicting-evidence**   | CONFLICTING EVIDENCE   | Different evidence sources contradict each other (e.g., unit tests pass but E2E tests fail). |
| **security-sensitive**     | SECURITY SENSITIVE     | Change involves credentials, auth, or security-critical code requiring human review.         |
| **scope-breach**           | SCOPE BREACH           | Agent's work would exceed the defined scope boundary.                                        |
| **architectural-friction** | ARCHITECTURAL FRICTION | Proposed changes conflict with existing architecture or design patterns.                     |

### Evidence Type

| Type                  | Filter label | Meaning                                                                      |
| --------------------- | ------------ | ---------------------------------------------------------------------------- |
| **test-result**       | Tests        | Automated test output (unit, integration, E2E).                              |
| **policy-check**      | Policy       | Evaluation against a defined policy (security, compliance).                  |
| **requirement-trace** | Traces       | Traceability link between a requirement and its implementation/verification. |
| **risk-explanation**  | Risk         | Analysis of a specific risk and its mitigation status.                       |

**Issue**: The filter label "Traces" for `requirement-trace` is potentially confusing in a system that also deals with OpenTelemetry tracing (MSN-005). "Traces" as an evidence filter could be mistaken for distributed tracing data.

### Mission Event Type

| Type                   | Display            | Meaning                     |
| ---------------------- | ------------------ | --------------------------- |
| **created**            | CREATED            | Mission was created.        |
| **plan-approved**      | PLAN-APPROVED      | Mission plan was approved.  |
| **execution-started**  | EXECUTION-STARTED  | Agent execution began.      |
| **evidence-collected** | EVIDENCE-COLLECTED | New evidence was gathered.  |
| **escalation-raised**  | ESCALATION-RAISED  | An escalation was raised.   |
| **review-approved**    | REVIEW-APPROVED    | Review was approved.        |
| **completed**          | COMPLETED          | Mission reached completion. |

**Issue**: MissionTimeline renders `event.type.toUpperCase()` directly, which produces hyphenated labels like "PLAN-APPROVED". These would read better as "PLAN APPROVED" (space-separated). The escalation type labels in EscalationHeader correctly use `.replace(/-/g, ' ')` before uppercasing. MissionTimeline does not.

---

## 4. Action Vocabulary

### Primary Actions (buttons the user can click)

| Action verb                       | Button label                                     | Where used                                                       | What it does                                              |
| --------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------- |
| **Create** (mission)              | `+ NEW MISSION`, `CREATE MISSION`                | MissionHome, MissionCreate                                       | Creates a new mission in the plan stage.                  |
| **Create** (workflow)             | `+ CREATE WORKFLOW`, `CREATE WORKFLOW`           | Workflows page, WorkflowCreate                                   | Creates a new workflow containing selected missions.      |
| **Approve** (plan)                | `Approve Plan & Begin Execution`                 | MissionPlan                                                      | Advances mission from plan to execute stage.              |
| **Approve** (review)              | `Approve`                                        | ApprovalBar                                                      | Approves the reviewed changes for merge.                  |
| **Approve** (plan proposal)       | `APPROVE` / `APPROVED`                           | ChatPlanProposal in AgentChatPanel                               | Approves an agent's proposed plan within chat.            |
| **Reject** (review)               | `Reject`                                         | ApprovalBar                                                      | Rejects the reviewed changes.                             |
| **Reject** (plan proposal)        | `REJECT` / `REJECTED`                            | ChatPlanProposal in AgentChatPanel                               | Rejects an agent's proposed plan within chat.             |
| **Request Changes**               | `Request Changes`                                | MissionPlan                                                      | Asks for plan modifications before approving.             |
| **Re-plan**                       | `Re-plan`                                        | ApprovalBar                                                      | Returns to plan stage for revision.                       |
| **Pause**                         | Pause icon button                                | AgentControls in AgentChatPanel                                  | Pauses the active agent session.                          |
| **Resume**                        | Play icon button (title: "Resume")               | AgentControls                                                    | Resumes a paused agent session.                           |
| **Stop**                          | Square icon button (title: "Stop")               | AgentControls                                                    | Stops the agent. Requires confirmation ("Confirm?").      |
| **Restart**                       | RotateCcw icon button (title: "Restart")         | AgentControls                                                    | Restarts a stopped or failed agent session.               |
| **Confirm** (escalation decision) | `CONFIRM`                                        | ConsequencePanel                                                 | Confirms the selected escalation decision option.         |
| **Cancel** (escalation decision)  | `CANCEL`                                         | ConsequencePanel                                                 | Cancels the pending escalation decision selection.        |
| **Launch Agent**                  | `LAUNCH AGENT` / `AGENT LAUNCHED`                | AgentConfigPanel                                                 | Launches a new agent session with selected configuration. |
| **Send** (chat message)           | `SEND`                                           | AgentChatPanel InputArea                                         | Sends a message to the active agent session.              |
| **Mark read**                     | `Mark read`                                      | NotificationCenter                                               | Marks a notification as read.                             |
| **Mark as Reviewed**              | `Mark as Reviewed` / `Reviewed` (with checkmark) | EvidenceDetailModal                                              | Marks an evidence item as reviewed.                       |
| **Save**                          | `Save Changes`                                   | Settings                                                         | Saves settings modifications.                             |
| **Open Mission**                  | `Open Mission`                                   | FocusPanel                                                       | Navigates to the mission's current stage page.            |
| **Enter Live View**               | `ENTER LIVE VIEW`                                | MissionDetail, MissionExecute, WorkflowDetail (MissionBoardCard) | Opens the fullscreen Live View for a mission.             |
| **View Board**                    | `VIEW BOARD`                                     | Workflows page                                                   | Navigates to the workflow detail (Kanban) view.           |

### Navigation Actions

| Label                   | Where                                                                                    | What it does                |
| ----------------------- | ---------------------------------------------------------------------------------------- | --------------------------- |
| `Back`                  | LiveView header                                                                          | Returns to execute page.    |
| `Back to missions`      | MissionPlan, MissionReview, MissionEscalation, MissionExecute (when no workflow)         | Returns to mission list.    |
| `Back to workflow`      | MissionPlan, MissionReview, MissionEscalation, MissionExecute (when in workflow context) | Returns to workflow detail. |
| `Back to mission`       | Workspace page (WorkspaceInfoBar)                                                        | Returns to mission detail.  |
| `Return to Missions`    | LiveView (mission not found state)                                                       | Returns to mission list.    |
| `Go to Missions`        | NotFound page                                                                            | Returns to mission list.    |
| `View all workflows`    | WorkflowDetail (not found state)                                                         | Returns to workflows list.  |
| `Workflow` / `Missions` | MissionExecute left panel back link                                                      | Contextual back navigation. |
| `Press Esc to exit`     | LiveView mode banner                                                                     | Exits Live View.            |

### Sort/Filter Actions

| Label                                          | Where                     | What it does                                          |
| ---------------------------------------------- | ------------------------- | ----------------------------------------------------- |
| `FILTER BY STAGE`                              | MissionHome               | Filters mission list by stage.                        |
| `FILTER BY RISK`                               | MissionHome               | Filters mission list by risk tier.                    |
| `NEWEST` / `STATUS` toggle                     | EvidenceRail              | Sorts evidence by newest-first or by status severity. |
| `All` / `Tests` / `Policy` / `Traces` / `Risk` | EvidenceRail filter pills | Filters evidence by type.                             |

---

## 5. Naming Problems and Recommendations

### Problem 1: "Workspace" entity is half-dissolved

**Severity**: High

The data layer marks `Workspace` as `@deprecated` with the comment "Workspace entity is dissolved -- use Mission.branch + LiveViewState instead." But:

- `Workspace.tsx` page still exists with full UI, routes, and `WorkspaceTabs`
- `WorkspaceLayout.tsx` component is used by both the deprecated Workspace page AND LiveView
- The router has `workspace/:id` which redirects to Live View, but the direct `Workspace` page is still importable
- `WorkspaceTabs` has `aria-label="Add workspace"`
- `WorkspaceInfoBar` sub-component renders in Workspace page

**Recommendation**: Complete the dissolution. Remove `Workspace.tsx` page and `WorkspaceTabs.tsx`. Keep `WorkspaceLayout.tsx` but rename it to `LiveViewLayout.tsx`. Keep the redirect route. Remove the Workspace type once no components reference it.

### Problem 2: "Session" is overloaded three ways

**Severity**: High

On MissionExecute, the user sees:

1. **"AGENT SESSIONS (2)"** -- the AI agent execution contexts
2. **"SESSIONS"** -- a section header for browser and terminal panes
3. Individual Browser/Terminal session panes labeled **"BROWSER // ACTIVE"** and **"TERMINAL // COMPLETED"**

Three different kinds of "session" on one screen. The Agent Session is a first-class entity with its own lifecycle. The Browser/Terminal sessions are tool contexts. They need different names.

**Recommendation**: Keep "Agent Session" as the canonical term. Rename the browser/terminal panes section to "TOOL PANES" or "ACTIVE TOOLS". Or remove the "SESSIONS" section header entirely and let the individual pane headers (BROWSER, TERMINAL) stand alone.

### Problem 3: "Escalation" is both a stage and an entity

**Severity**: High

A Mission has a `stage: 'escalation'` lifecycle position AND zero-or-more `Escalation` entities. MSN-001 is in the `review` stage but has ESC-001 (an escalation about a race condition). This means:

- A mission can have escalations without being in the escalation stage
- A mission in the escalation stage always has at least one escalation entity
- The stage label "ESCALATION" in the Kanban board and breadcrumbs looks identical to the entity concept

Users will ask: "Is this mission escalated?" and the answer could be "it has an escalation but it's in review stage" which is confusing.

**Recommendation**: Rename the stage to **"Blocked"** (since `verificationState: 'blocked'` already captures this concept). This frees "escalation" to be purely the noun for the decision-request entity. The stage `blocked` is concrete: the mission cannot proceed. The noun `Escalation` is the reason it is blocked. Clear separation.

### Problem 4: Evidence status tense inconsistency

**Severity**: Medium

- Evidence status type values: `pass`, `fail`, `warning`, `pending` (result tense)
- VerificationState values: `passing`, `failing`, `pending`, `blocked` (progressive tense)
- EvidenceDetailModal statusLabels: `Passing`, `Failing`, `Warning`, `Pending` (progressive tense, contradicting the `pass`/`fail` values they represent)
- EvidenceRail summary: `{n} pass`, `{n} fail`, `{n} warn` (abbreviated result tense)
- MissionDetail summary: `{n} PASS`, `{n} FAIL`, `{n} WARN` (abbreviated result tense)

The evidence status describes a **result** ("this test passed") but the modal labels describe an **ongoing state** ("this is passing"). These are semantically different.

**Recommendation**: Standardize on result tense for evidence: `pass`, `fail`, `warning`, `pending`. Use progressive tense only for the mission-level VerificationState which IS an ongoing aggregate. Change EvidenceDetailModal labels to `Passed`, `Failed`, `Warning`, `Pending`. Change EvidenceRail display to unabbreviated: `{n} passed`, `{n} failed`, `{n} warnings`.

### Problem 5: Section label casing inconsistency

**Severity**: Medium

The system has two casing conventions for section labels and neither is applied consistently:

| Convention A: ALL CAPS (`.aw-micro`) | Convention B: Title/Sentence case | Location                             |
| ------------------------------------ | --------------------------------- | ------------------------------------ |
| `SCOPE BOUNDARY`                     | `Scope boundary`                  | MissionPlan vs. FocusPanel           |
| `ACCEPTANCE CRITERIA`                | `Acceptance criteria`             | MissionCreate vs. FocusPanel         |
| `RISK ASSESSMENT`                    | `IDENTIFIED RISKS`                | MissionDetail vs. MissionPlan/Create |
| `GOAL`                               | `MISSION GOAL`                    | MissionDetail/Create vs. MissionPlan |

**Recommendation**: Use ALL CAPS for all section labels consistently. The design system's `.aw-micro` class already applies `text-transform: uppercase`, so any mixed-case labels in `.aw-micro` elements are already rendered as caps. The issue is that FocusPanel uses sentence case in elements that are NOT `.aw-micro` styled. Either apply `.aw-micro` to all section labels or adopt title case for non-micro labels consistently.

### Problem 6: "MED RISK" abbreviation in RiskBadge

**Severity**: Low

RiskBadge renders medium risk as `MED RISK`. Every other surface in the system uses `MEDIUM`: filter buttons, select dropdowns, the RiskTier type. The badge is 9px text with generous padding -- there is room for the full word.

**Recommendation**: Change to `MEDIUM RISK` for consistency.

### Problem 7: Mission event type display with hyphens

**Severity**: Low

MissionTimeline renders event types as `event.type.toUpperCase()`, producing `PLAN-APPROVED`, `EXECUTION-STARTED`, `ESCALATION-RAISED`. The EscalationHeader correctly strips hyphens with `.replace(/-/g, ' ')`. The timeline should do the same.

**Recommendation**: Apply `.replace(/-/g, ' ')` in MissionTimeline before `.toUpperCase()`.

### Problem 8: `step.status === 'success'` bug

**Severity**: Low (visual only, unlikely to manifest since no step has `success` status)

In MissionExecute's agent log section, code checks `step.status === 'success'` to render a checkmark. The `AgentStep` type defines statuses as `completed | running | pending | failed`. The `success` check will never match.

**Recommendation**: Change to `step.status === 'completed'`.

### Problem 9: "Inbox" breadcrumb on MissionHome

**Severity**: Low

MissionHome's TopBar breadcrumbs show `Missions / Inbox`. No other page references an "inbox" concept. The page is a mission list with filters, not an inbox. The term implies messages/tasks directed at the user, but this page shows all missions regardless of ownership.

**Recommendation**: Remove the "Inbox" breadcrumb. `Missions` alone is sufficient, matching the LeftNav label.

### Problem 10: Decorative jargon in chrome

**Severity**: Low

- AppShell bottom bar: `MISSION.CTRL // OPERATING SURFACE v0.1.0`
- TopBar right side: `MISSION.CTRL // {date}`
- LeftNav subtitle: `AGENT SUPERVISION`

These are atmospheric. "Operating surface" is not a defined concept. "Agent supervision" is a tagline, not a feature. For an internal tool, decorative chrome is fine. For external users, these would need to be either defined or removed.

**Recommendation**: Keep for now but document as decorative. Do not use these terms in documentation or help text.

---

## Synthesis

### Five Most Damaging Terminology Inconsistencies

1. **"Workspace" vs. "Live View"**: The deprecated entity still has a full page, components, and route. Users encounter both concepts. This creates confusion about what the IDE-like environment is actually called and where to find it.

2. **"Session" overload (3 meanings)**: Agent Session, Browser Session, Terminal Session, plus a "SESSIONS" section header. On the MissionExecute page, "session" refers to at least two different concepts visible simultaneously.

3. **"Escalation" as both a lifecycle stage and an entity**: A mission can have escalation entities in any stage, but "escalation" is also a stage name. The Kanban board shows a column called "ESCALATION" while individual escalation entities appear on non-escalation-stage missions.

4. **Evidence status tense mismatch**: `pass`/`fail` (result) in the data model vs. `Passing`/`Failing` (progressive) in the detail modal vs. `WARN` (abbreviation) in summaries. Three conventions for the same concept.

5. **Section label casing**: FocusPanel uses sentence case ("Scope boundary", "Acceptance criteria") while every other component uses ALL CAPS. Same data fields, different label conventions.

### Overloaded or Ambiguous Concepts

- **"Session"**: Agent Session (AI execution context), Browser Session (browser automation context), Terminal Session (command execution context), "SESSIONS" (section header for browser+terminal). Four uses.
- **"Escalation"**: A mission lifecycle stage AND a decision-request entity. Two distinct meanings.
- **"Status"**: Every entity has a status field but with different vocabularies (active/paused/completed/failed for agents vs. pass/fail/warning/pending for evidence vs. active/merged/stale for branches). Not inherently wrong, but there is no system-wide status legend.
- **"Risk"**: RiskTier (low/medium/high classification), risk items on a mission (free-text), EscalationOption risk (free-text consequence), evidence type "risk-explanation", and evidence filter label "Risk". Five uses.

### Priority Terms to Standardize Before Next Implementation Cycle

1. **Dissolve Workspace completely** -- rename `WorkspaceLayout` to `LiveViewLayout`, remove `Workspace.tsx` page, remove `WorkspaceTabs`, update all aria-labels. Estimated: 1-2 hours.

2. **Rename the "escalation" stage to "blocked"** -- update `Stage` type, `StageBadge` config, `stageColumns` in WorkflowDetail, filter labels in MissionHome, navigation links in MissionDetail, route paths, breadcrumbs. Estimated: 2-3 hours. High conceptual payoff.

3. **Standardize evidence display labels** -- fix tense (result tense for evidence, progressive for verification state), fix abbreviation (`WARNING` not `WARN`), fix the `success` bug in MissionExecute. Estimated: 1 hour.

4. **Normalize section label casing** -- audit all section headers, ensure ALL CAPS convention is applied via `.aw-micro` class everywhere. Fix FocusPanel labels. Fix "RISK ASSESSMENT" vs "IDENTIFIED RISKS" split (pick one). Fix "GOAL" vs "MISSION GOAL" split (pick one). Estimated: 1 hour.

5. **Disambiguate "session" on MissionExecute** -- rename the "SESSIONS" section header to something that does not collide with "AGENT SESSIONS". Estimated: 15 minutes.
