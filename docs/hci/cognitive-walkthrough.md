# Cognitive Walkthrough: Mission Control Prototype

**Date:** 2026-03-23
**Evaluator role:** HCI expert performing structured cognitive walkthrough
**User persona:** First-time tech lead or senior developer managing AI coding agents. Familiar with IDEs, Kanban boards, and code review tools. NOT familiar with military metaphors or Mission Control's specific lifecycle model (plan/execute/review/escalation).

---

## Journey 1: First Encounter

**Scenario:** User opens Mission Control for the first time. Goal: understand what this tool does and find their first task.

### Step 1.1 --- Landing on the App

- **User goal:** Understand what this application is and what I can do here.
- **Visible cues:**
  - Left nav with ShieldCheck icon, "Mission Control" title, "AGENT SUPERVISION" subtitle (9px, very small).
  - Nav items: Workflows, Missions (with a numeric badge), a thin separator, Costs, History, Settings.
  - Bottom of left nav: "X active missions", "Y need review" in 9px text.
  - Main area: TopBar with breadcrumbs "Missions / Inbox". A list of MissionCards on the left (360px column). A FocusPanel on the right showing details for the first card (auto-selected).
  - Bottom status bar: "MISSION.CTRL // OPERATING SURFACE v0.1.0" and a clock.
  - Dark warm-gray aesthetic with corner brackets, scanlines, ambient dots.
- **Likely action:** Scan left nav, read labels, look at the card list.
- **Q1 -- Will the user form the right goal?** Partially. "AGENT SUPERVISION" communicates the supervisory role, but at 9px it may be missed. The user sees "Missions" and "Workflows" but has no context for what a "mission" means in this domain. There is no onboarding tooltip, welcome message, or quick-start guide. A developer used to Jira/Linear will map "Missions" to "tasks" -- close enough, but the lifecycle stages (plan/execute/review/escalation) are not explained anywhere on this screen.
- **Q2 -- Will the user notice the correct action?** Yes. MissionCards are prominent, the first is auto-selected, and the FocusPanel is visible. The "X need review" text at the bottom of LeftNav is a useful attention cue, though its 9px size makes it easy to miss.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. Clicking a card reveals preview information. The FocusPanel shows stage badges (PLAN, EXECUTE, REVIEW, ESCALATION), risk badges, and an "Open Mission" link. This gives the user enough to start exploring.
- **Q4 -- After acting, will the feedback make sense?** Yes. Selecting a card highlights it and populates the FocusPanel immediately. Feedback is clear.

**Breakdowns / confusion risks:**

1. **"Mission" as a concept is unexplained.** The user does not know if a mission is a PR, a feature, a sprint, or something else. No contextual help or subtitle on the MissionHome page explains it.
2. **"Inbox" breadcrumb is misleading.** The breadcrumb reads "Missions / Inbox" but this is the only missions view -- there is no inbox vs. archive distinction. "Inbox" implies there is a corresponding "Outbox" or "Sent" view, which does not exist.
3. **Military/tactical aesthetic may confuse or alienate.** Corner brackets, uppercase labels, Orbitron font, scanlines, and terms like "OPERATING SURFACE" and "AGENT SUPERVISION" create a sci-fi/military feel that does not signal "development tool" to most engineers. The user may wonder if they are in the right application.
4. **The "need review" count at 9px at the bottom of the left nav** is the most actionable piece of information on screen -- it tells the user something requires their attention right now -- but it is the least visible element due to its size and position.

**Recommendation:**

- Add a one-line subtitle under the "Missions / Inbox" breadcrumb area: "Active coding tasks managed by AI agents" or similar.
- Remove or rename "Inbox" to avoid implying a counterpart view.
- Increase the "X need review" counter to at least 11px and consider placing it inline with the Missions nav label (similar to the existing badge) using an accent color to draw attention.
- Consider adding an empty-state or first-run banner: "Missions are units of work assigned to AI agents. Create one to get started."

---

### Step 1.2 --- Understanding a Mission Card

- **User goal:** Figure out what one of these listed items is and whether it needs my attention.
- **Visible cues:**
  - MissionCard shows: mission ID (e.g., "MSN-001"), title, goal (2-line clamp), StageBadge, RiskBadge, VerificationBadge, workflow name (if assigned), owner, date.
  - Badges use labels like "EXECUTE", "REVIEW", "HIGH", "PASSING", "FAILING".
- **Likely action:** Read the card, look at badges, click it.
- **Q1 -- Will the user form the right goal?** Yes, if the user maps "mission" to "task." The goal text helps.
- **Q2 -- Will the user notice the correct action?** Yes. Cards have hover effects (scale, shadow) that signal clickability.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. The card looks selectable, and selecting it reveals details in the FocusPanel.
- **Q4 -- After acting, will the feedback make sense?** Yes. The card gets a highlighted border and background, and the FocusPanel updates immediately.

**Breakdowns / confusion risks:**

1. **Badge semantics are unclear without a legend.** "EXECUTE" could mean "ready to execute" or "currently executing." "PASSING" vs "PENDING" verification states have no tooltip or explanation. A first-time user seeing "ESCALATION" and "HIGH" together does not know the urgency level.
2. **The card is a button (semantically), not a link.** Clicking it only selects the card in the list -- it does not navigate to the mission. The user must then find and click "Open Mission" in the FocusPanel. This is a two-click path where a single click might be expected.

**Recommendation:**

- Add tooltips to badges (e.g., "Stage: currently being executed by agents").
- Consider making the card a direct link to MissionDetail, or at minimum, make the card double-clickable to open the mission.

---

### Step 1.3 --- Using the FocusPanel to Open a Mission

- **User goal:** Navigate to the full details of this mission.
- **Visible cues:**
  - FocusPanel shows: mission ID + "// PREVIEW", title, badges, goal text, scope boundary, acceptance criteria, evidence/escalation counts, owner, and an "Open Mission" button with a chevron.
- **Likely action:** Click "Open Mission."
- **Q1 -- Will the user form the right goal?** Yes. The preview is clearly a summary, and the button invites deeper exploration.
- **Q2 -- Will the user notice the correct action?** Likely yes. "Open Mission" is styled as a bordered button at the bottom of the panel. However, it is below the fold if the mission has many acceptance criteria, requiring scrolling.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. "Open Mission" is unambiguous.
- **Q4 -- After acting, will the feedback make sense?** Yes. Navigation occurs to MissionDetail with a page transition.

**Breakdowns / confusion risks:**

1. **"Open Mission" navigates to the stage-specific page (plan/execute/review/escalation), not to MissionDetail.** The `stageRoute()` function routes to `/missions/:id/:stage`. If the mission is in the "execute" stage, the user lands on MissionExecute, which is a complex three-column layout. This may be disorienting for a first visit -- the user expected a detail/overview page, not a live execution dashboard.
2. **There is a MissionDetail page** (`/missions/:missionId` without a stage suffix) that serves as a proper overview, but the FocusPanel never links to it. The user has no obvious path to this overview page from MissionHome.

**Recommendation:**

- Change the FocusPanel's "Open Mission" link to navigate to MissionDetail (overview) first. Let the user drill into stage-specific pages from there.
- Alternatively, add two buttons: "Overview" and "Go to [stage]".

---

## Journey 2: Create and Launch a Mission

**Scenario:** User wants to create a new mission, fill in the details, optionally assign it to a workflow, and start agents working on it.

### Step 2.1 --- Finding the Create Action

- **User goal:** Create a new mission.
- **Visible cues:**
  - MissionHome has a prominent "+ NEW MISSION" button at the top of the card list, styled with the accent background color.
  - CommandPalette (Ctrl+K) includes a "Create Mission" action.
- **Likely action:** Click "+ NEW MISSION."
- **Q1 -- Will the user form the right goal?** Yes. The button label is clear.
- **Q2 -- Will the user notice the correct action?** Yes. It is the first element in the left column, visually prominent with accent background.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes.
- **Q4 -- After acting, will the feedback make sense?** Yes. Navigation to MissionCreate page with breadcrumb "Missions / Create."

**Breakdowns / confusion risks:**

- None significant. This is well designed.

**Recommendation:**

- No changes needed. The Ctrl+K palette also surfaces this action, which is good for keyboard-oriented users.

---

### Step 2.2 --- Filling the Create Form

- **User goal:** Provide enough information to define a mission.
- **Visible cues:**
  - Form fields in bordered panels with CornerBrackets: TITLE, GOAL, SCOPE BOUNDARY, RISK TIER (dropdown), OWNER, ACCEPTANCE CRITERIA (add items), IDENTIFIED RISKS (add items).
  - Right side (40%): "PREVIEW" showing a MissionCard rendering in real time.
  - Bottom: "CREATE MISSION" button with accent background.
- **Likely action:** Fill in fields top-to-bottom, add criteria, then click CREATE MISSION.
- **Q1 -- Will the user form the right goal?** Mostly. The fields are self-explanatory, but "SCOPE BOUNDARY" may be unclear to a user unfamiliar with the concept. There is placeholder text ("Define what is in and out of scope") which helps.
- **Q2 -- Will the user notice the correct action?** Yes. Fields are sequential and clearly labeled.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. The live preview on the right reinforces that inputs are being captured.
- **Q4 -- After acting, will the feedback make sense?** Partially. See breakdowns.

**Breakdowns / confusion risks:**

1. **Which fields are required?** No field has a required indicator (asterisk, red border, or validation message). The user can click "CREATE MISSION" with all fields empty. The form shows a success toast regardless.
2. **No validation at all.** `handleCreate()` shows a toast "Mission created successfully" after 2 seconds regardless of input. There is no actual persistence (prototype limitation), but the lack of any validation means the user gets no signal about incomplete data.
3. **The "+" button for acceptance criteria is cryptic.** It is a small bordered button with just "+" text. The Enter-to-add behavior is undiscoverable -- there is no hint text like "Press Enter to add."
4. **No way to assign to a workflow from this form.** The user must create the mission first, then separately go to WorkflowCreate or an existing workflow to include it. This is a hidden prerequisite for the "assign to workflow" part of the journey.
5. **No way to start agents.** After creating a mission, the toast appears and disappears. The user is left on the same form with no "View Mission" link, no redirect, and no indication of what to do next. The mission is in "plan" stage, but there is no prompt to proceed to execution.

**Recommendation:**

- Add required field indicators and basic client-side validation (at minimum: title is not empty).
- After successful creation, navigate to the new MissionDetail page or show a persistent banner with a "View Mission" link.
- Add a "Workflow" dropdown or assignment field to the create form.
- Add hint text to the criteria/risk input: "Type and press Enter or click +"
- Consider a post-creation flow: "Mission created. Review the plan, then approve to begin execution."

---

### Step 2.3 --- Starting Agents (Hidden Prerequisite)

- **User goal:** Get agents working on this mission.
- **Visible cues:** After creation, the user is still on the create form. They must navigate away manually.
- **Likely action:** Click "Missions" in LeftNav to go back to MissionHome, find the new mission, open it.
- **Q1 -- Will the user form the right goal?** Unclear. The user does not know that missions follow a plan-then-execute lifecycle. There is no visible indication that "starting agents" requires plan approval first.
- **Q2 -- Will the user notice the correct action?** No. There is no "Start" or "Launch" button anywhere on the create form or the immediate post-creation screen.
- **Q3 -- Will the user understand the action leads toward the goal?** No. The entire plan-approval-then-execute flow is undiscoverable from the create form.
- **Q4 -- After acting, will the feedback make sense?** N/A -- the user is stuck.

**Breakdowns / confusion risks:**

1. **Dead end after creation.** The toast disappears after 2 seconds. The user has no clear next step.
2. **Hidden lifecycle prerequisite.** To start agents, the user must: (a) find the mission in MissionHome, (b) open it, (c) navigate to the Plan page, (d) click "Approve Plan & Begin Execution." None of this is communicated.
3. **MissionPlan's "Approve Plan & Begin Execution" button** only appears when `mission.stage === 'plan'`, which is correct, but the button has no click handler -- it is a non-functional prototype button that does nothing.

**Recommendation:**

- After creation, redirect to MissionDetail or MissionPlan with a visible "Approve Plan & Begin Execution" call-to-action.
- Add a lifecycle stepper or progress indicator to MissionDetail showing: Plan -> Execute -> Review -> Complete, with the current stage highlighted.
- Make the "Approve Plan" button functional (or at minimum show a confirmation toast).

---

## Journey 3: Monitor and Intervene (Zoom Pattern)

**Scenario:** User is monitoring active work. They want to check a workflow board, find an active mission, peek at execution, enter Live View, send a message to an agent, then exit.

### Step 3.1 --- Navigating to the Workflow Board

- **User goal:** See the status of all missions in a workflow at a glance.
- **Visible cues:**
  - LeftNav: "Workflows" link with GitBranch icon.
- **Likely action:** Click "Workflows" in LeftNav.
- **Q1 -- Will the user form the right goal?** Yes, if they understand "workflow" as a grouping of missions. The term is standard enough.
- **Q2 -- Will the user notice the correct action?** Yes.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes.
- **Q4 -- After acting, will the feedback make sense?** Yes. Workflows page shows workflow cards with mission lists, active agent counts, and a "VIEW BOARD" link for workflows with executing missions.

**Breakdowns / confusion risks:**

1. **Workflows page is a long vertical list, not a board.** The user sees workflow cards stacked vertically, each containing a mission list. This is not the "board" view promised by the "VIEW BOARD" link. The actual Kanban board is in WorkflowDetail, accessible by clicking the workflow title or "VIEW BOARD."
2. **"VIEW BOARD" link only appears if the workflow has an executing mission.** If all missions are in "plan" stage, the link is absent. The user must click the workflow title instead, which is a text link styled as a heading -- not an obvious navigation affordance.

**Recommendation:**

- Make the workflow title more obviously clickable (underline on hover, or make the entire card a link).
- Always show the board entry point, not just when a mission is executing.

---

### Step 3.2 --- Finding an Active Mission on the Kanban Board

- **User goal:** Find which mission is currently being worked on by agents.
- **Visible cues:**
  - WorkflowDetail: Header card with workflow info, then a 4-column Kanban grid: PLAN | EXECUTE | REVIEW | ESCALATION.
  - MissionBoardCards in the EXECUTE column show the mission title, RiskBadge, active agent count ("2 active"), owner, and an "ENTER LIVE VIEW" button (only in execute column).
- **Likely action:** Scan the EXECUTE column for cards with active agents.
- **Q1 -- Will the user form the right goal?** Yes. The Kanban layout is familiar.
- **Q2 -- Will the user notice the correct action?** Yes. The EXECUTE column with green "active" counts draws attention.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes.
- **Q4 -- After acting, will the feedback make sense?** Yes.

**Breakdowns / confusion risks:**

1. **No column counts for non-mission items.** Each column header shows "(N)" count which is clear. However, empty columns show "No missions" in a dashed border -- this is good feedback.
2. **Mission title in the board card is a link to MissionDetail, not MissionExecute.** Clicking the title takes the user to the overview, not the execution view. The user must use the separate "ENTER LIVE VIEW" button to go directly to the active work. This is actually correct behavior for a zoom pattern (overview first, then drill in), but the two entry points (title vs. Live View) are not distinguished by visual weight -- the title is more prominent, but the Live View button is the action the user probably wants.

**Recommendation:**

- Consider adding a subtle "View details" link alongside the title, and making "ENTER LIVE VIEW" more prominent (larger, possibly full-width) on cards in the EXECUTE column.

---

### Step 3.3 --- Peeking at Execution Before Going Live

- **User goal:** Get a quick read on what the agent is doing without fully committing to the Live View.
- **Visible cues:**
  - Clicking the mission title navigates to MissionDetail, which has a NAVIGATION section with links to PLAN, EXECUTE, REVIEW, ESCALATION, and "ENTER LIVE VIEW."
  - Alternatively, clicking the mission title on the board card navigates to MissionDetail.
  - From MissionDetail, clicking EXECUTE goes to MissionExecute, which has a three-column layout: left sidebar (mission context), center (overview or chat), right rail (evidence).
  - Center area has OVERVIEW/CHAT toggle, agent swimlanes, EXECUTE PREVIEW (split: agent log + code viewer), and an "ENTER LIVE VIEW" button.
- **Likely action:** Click on the mission, then navigate to the Execute page.
- **Q1 -- Will the user form the right goal?** Yes. The execute preview provides a summary of agent activity.
- **Q2 -- Will the user notice the correct action?** Partially. From MissionDetail, the NAVIGATION section with PLAN/EXECUTE/REVIEW/ESCALATION links is at the bottom of a long page. The user must scroll past Header, Goal + Scope, Acceptance Criteria, Risk Assessment, Agent Sessions, Evidence Summary, Escalation Alerts, and Timeline before reaching these navigation links. This is a significant discovery problem.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes, once found. "EXECUTE" as a label maps to "see what's being executed."
- **Q4 -- After acting, will the feedback make sense?** Yes. MissionExecute shows rich agent activity information.

**Breakdowns / confusion risks:**

1. **NAVIGATION links buried at the bottom of MissionDetail.** The primary navigation to sub-pages (plan/execute/review/escalation) is in a panel at the very bottom of MissionDetail. There are no tabs, no sidebar navigation, and no top-of-page links to these sub-views. A user who opens MissionDetail may never scroll far enough to find them.
2. **No tab bar or horizontal nav between mission sub-pages.** Once on MissionExecute, the user can go back to MissionHome or the workflow via breadcrumbs/back links, but there is no horizontal tab strip to switch between Plan/Execute/Review/Escalation for the same mission. Navigation between sub-pages requires going back to MissionDetail and scrolling to the bottom each time.

**Recommendation:**

- Add a horizontal tab bar or sub-navigation strip at the top of all mission sub-pages (Plan, Execute, Review, Escalation) so the user can switch between views without going back to MissionDetail.
- Move or duplicate the stage navigation links to the top of MissionDetail, directly below the header badges.

---

### Step 3.4 --- Entering Live View

- **User goal:** Enter the full workspace to interact directly with agents and code.
- **Visible cues:**
  - MissionExecute: "ENTER LIVE VIEW" button in the top toolbar, styled with accent border and Eye icon.
  - MissionDetail: "ENTER LIVE VIEW" link in the NAVIGATION section (bottom of page).
  - WorkflowDetail board cards: "ENTER LIVE VIEW" button on execute-stage cards.
- **Likely action:** Click "ENTER LIVE VIEW" from MissionExecute toolbar.
- **Q1 -- Will the user form the right goal?** Yes. The button label is clear.
- **Q2 -- Will the user notice the correct action?** Yes on MissionExecute (it is in the top toolbar with accent color). Less certain from MissionDetail (bottom of page) or WorkflowDetail (small button on card).
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. "Live View" implies real-time, hands-on interaction.
- **Q4 -- After acting, will the feedback make sense?** Yes. The screen transitions to a fullscreen layout with a prominent orange/accent "LIVE SUPERVISION MODE" banner at the top and "Press Esc to exit" hint.

**Breakdowns / confusion risks:**

1. **Live View exits the AppShell entirely.** The LeftNav disappears. The user has only the "Back" link and Esc to exit. This is correct for a fullscreen workspace, but the abrupt loss of all navigation (no LeftNav, no TopBar, no notifications) may feel disorienting. The user cannot check notifications or switch to another mission without exiting first.
2. **"Press Esc to exit" is the only exit hint.** The "Back" link in the LiveViewHeader is small (micro text). A user who does not read the banner may not know how to leave.

**Recommendation:**

- Make the "Back" link more prominent (e.g., a proper button with border, not just micro text with an arrow).
- Consider keeping a minimal nav strip or at least the notification bell in Live View.

---

### Step 3.5 --- Sending a Message to an Agent in Live View

- **User goal:** Communicate with the AI agent working on this mission.
- **Visible cues:**
  - WorkspaceLayout is a 5-pane grid: file tree (left), code editor (center-top), browser preview (right-top), terminal (center-bottom), agent chat (right-bottom).
  - Agent chat panel (AgentChatPanel) in the bottom-right: session tabs, agent controls (pause/stop/restart), status bar, message list, and input area with textarea and "SEND" button.
  - Input placeholder: "Message agent..."
- **Likely action:** Click the textarea in the chat panel, type a message, press Enter or click SEND.
- **Q1 -- Will the user form the right goal?** Yes. The chat interface is recognizable.
- **Q2 -- Will the user notice the correct action?** Likely, but the chat panel is in the bottom-right corner of a 5-pane grid. It shares space with the browser preview above it, and the panes are not resizable. If the user's screen is smaller, the chat panel may be cramped.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. "Message agent..." placeholder is clear.
- **Q4 -- After acting, will the feedback make sense?** Yes. The message appears immediately (right-aligned as a user message). After 1.5 seconds, a typing indicator appears, then a streaming response from the agent.

**Breakdowns / confusion risks:**

1. **The 5-pane layout has no resize handles.** The grid template is fixed: `200px 1fr 380px` columns, `1fr 280px` rows. On smaller screens, the chat panel may be too small to read comfortably.
2. **Session tabs may confuse.** If there are multiple agent sessions, the user sees tabs by role (e.g., "coder", "reviewer"). It is unclear which agent they are talking to and whether messages go to all agents or just the selected one.
3. **Agent lifecycle controls (Pause/Stop/Restart) are above the chat.** These are icon-only buttons (Pause icon, Square icon, RotateCcw icon) with title-attribute tooltips only. A first-time user may not understand what these do. The "Stop" button requires a confirmation click (text changes to "Confirm?"), which is good safety design, but the initial icon gives no hint of the confirmation pattern.
4. **Canned responses.** The prototype returns canned responses in a round-robin. This is fine for a prototype but should be clearly marked if used in user testing.

**Recommendation:**

- Add visible labels or a legend to the agent control buttons (at least on first use).
- Consider making the chat panel resizable or togglable to full-width for focused conversation.
- Add a label near the session tabs: "Talking to: [agent role]" to clarify which agent receives messages.

---

### Step 3.6 --- Exiting Live View

- **User goal:** Return to the previous view.
- **Visible cues:**
  - Top banner: "LIVE SUPERVISION MODE ... Press Esc to exit"
  - LiveViewHeader: "Back" link (micro text with left arrow).
- **Likely action:** Press Esc or click "Back."
- **Q1 -- Will the user form the right goal?** Yes.
- **Q2 -- Will the user notice the correct action?** Yes. The Esc hint is in the top banner.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes.
- **Q4 -- After acting, will the feedback make sense?** Yes. Navigation returns to MissionExecute page (the page the user entered from). The AppShell, LeftNav, and TopBar reappear.

**Breakdowns / confusion risks:**

1. **Esc is overloaded.** If the user has a modal open (e.g., an agent config panel), Esc might close the modal AND navigate away, or the behaviors might conflict. In the current code, the Esc listener is on `document.addEventListener('keydown')` and does not check for open modals or focused inputs.

**Recommendation:**

- Guard the Esc-to-exit handler: only trigger navigation if no modal is open and no input element is focused.

---

## Journey 4: Handle Escalation

**Scenario:** An agent has flagged an issue that requires human judgment. The user sees a notification, navigates to the escalation, understands the problem, reviews options, and makes a decision.

### Step 4.1 --- Seeing the Notification

- **User goal:** Notice that something requires my attention.
- **Visible cues:**
  - TopBar: Bell icon with a red badge showing unread count.
  - LeftNav bottom: "X need review" in accent color (9px text).
- **Likely action:** Click the bell icon.
- **Q1 -- Will the user form the right goal?** Yes. The red badge is a standard attention signal.
- **Q2 -- Will the user notice the correct action?** Yes. Bell icon with red badge is a universal pattern.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes.
- **Q4 -- After acting, will the feedback make sense?** Yes. A dropdown panel appears with a list of notifications.

**Breakdowns / confusion risks:**

1. **No sound, no browser notification, no toast for escalations.** The notification badge is passive. If the user is focused on code in Live View, they will not see the badge (Live View has no TopBar or notification bell). Escalations -- which may be time-sensitive -- have no way to interrupt the user's attention.
2. **The LeftNav counter says "X need review" but does not distinguish between reviews and escalations.** Both review-stage and escalation-stage missions are counted together. An escalation (which may be urgent) looks the same as a routine review.

**Recommendation:**

- Add an in-app toast notification for escalations that appears even in Live View.
- Consider distinguishing escalations from reviews in the LeftNav counter (e.g., "1 escalation" in red, "2 need review" in accent).
- Add sound or browser notification support for escalation events.

---

### Step 4.2 --- Navigating from Notification to Escalation

- **User goal:** Go to the escalation and understand the problem.
- **Visible cues:**
  - Notification list item shows: type icon (AlertTriangle for escalation), title, detail text, relative time, "Mark read" link.
  - Clicking the notification item navigates to `/missions/:missionId`.
- **Likely action:** Click the notification item.
- **Q1 -- Will the user form the right goal?** Yes. The notification title describes the issue.
- **Q2 -- Will the user notice the correct action?** Yes. Items are clickable (cursor: pointer).
- **Q3 -- Will the user understand the action leads toward the goal?** Mostly. The user expects to go directly to the escalation. However...
- **Q4 -- After acting, will the feedback make sense?** Partially.

**Breakdowns / confusion risks:**

1. **Notification click navigates to MissionDetail, NOT to MissionEscalation.** The `handleClick` function in NotificationCenter navigates to `/missions/${n.missionId}` -- the overview page. To reach the actual escalation page, the user must then scroll to the bottom of MissionDetail, find the NAVIGATION section, and click "ESCALATION." This is a major indirection for an urgent action.
2. **No notification type-aware routing.** An escalation notification should navigate to the escalation page (`/missions/:id/escalation`). A review notification should navigate to the review page. Currently, all notifications go to the same overview page.

**Recommendation:**

- Route escalation notifications directly to `/missions/:missionId/escalation`.
- Route stage-change and approval notifications to the relevant stage page.
- At minimum, route to `/missions/:missionId/:stage` based on the current mission stage.

---

### Step 4.3 --- Understanding the Escalation

- **User goal:** Understand what went wrong and what decision is needed.
- **Visible cues:**
  - EscalationHeader: escalation type label (e.g., "SECURITY SENSITIVE"), title in accent-colored banner, summary text, checkpoint reference, timestamp.
  - Center content: "ISSUE DETAIL" panel with detailed text, ReplayTimeline showing agent session history, and related escalations if any.
  - Right sidebar (300px): ConsequencePanel with "DECISION OPTIONS."
- **Likely action:** Read the header, then the issue detail, then review the decision options.
- **Q1 -- Will the user form the right goal?** Yes. The EscalationHeader with AlertTriangle icon and accent coloring clearly signals "problem requiring attention."
- **Q2 -- Will the user notice the correct action?** Yes. The layout guides top-to-bottom reading, with decision options clearly positioned in the right sidebar.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. The flow from "understand problem" to "choose option" is logical.
- **Q4 -- After acting, will the feedback make sense?** Yes.

**Breakdowns / confusion risks:**

1. **"DECISION OPTIONS" label does not indicate urgency or deadline.** The Settings page mentions "Escalations timeout after 24h -- auto-reject" as a configurable policy, but the escalation page itself shows no timer or deadline. The user does not know how long they have to decide.
2. **ReplayTimeline is below the issue detail.** For complex escalations, the user may need to understand the agent's reasoning chain before deciding. If the replay is long, the decision options in the right sidebar may be visible before the user has scrolled through the full context. This is a layout concern on smaller viewports.

**Recommendation:**

- Add a visible countdown or deadline indicator if escalation timeouts are configured.
- Consider making the ReplayTimeline collapsible or summarized by default, with a "Show full replay" expansion.

---

### Step 4.4 --- Making a Decision

- **User goal:** Select an option and confirm the decision.
- **Visible cues:**
  - ConsequencePanel: List of options, each as a bordered card with label, description, risk indicator (HeatNode + AlertTriangle + "Risk: [level]" text).
  - Clicking an option: expands an inline confirmation panel with "Are you sure? This will: [description]" and CONFIRM/CANCEL buttons.
  - After confirmation: the option card transforms to show a CheckCircle, the label in green, and "Decision recorded at [time]." Other options fade to 40% opacity and become non-interactive.
- **Likely action:** Click an option, read the confirmation, click CONFIRM.
- **Q1 -- Will the user form the right goal?** Yes.
- **Q2 -- Will the user notice the correct action?** Yes. Options are clearly laid out as cards.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. The two-step click-then-confirm pattern is clear.
- **Q4 -- After acting, will the feedback make sense?** Yes. The confirmed state is visually distinct (green check, disabled alternatives, timestamp). This is well designed.

**Breakdowns / confusion risks:**

1. **No undo.** Once confirmed, the decision is recorded with no undo or "change decision" button. The faded alternatives are non-interactive (`pointerEvents: 'none'`). The user sees "Decision recorded at [time]" but has no way to reverse it. For a high-stakes escalation, this could be stressful.
2. **CONFIRM button uses the accent color.** In this design system, the accent color (warm orange/amber) is also used for warnings and escalation headers. Using it for a confirmation button may feel inconsistent -- the user might interpret the accent color as "danger" rather than "confirm." A distinct green or the semantic.success color would be clearer.
3. **Risk labels are plain text strings** (e.g., "Risk: Medium -- service restart required"). The meaning depends on reading the full text. A color coding based on risk level is present via HeatNode, but the HeatNode is a small SVG element that may not be immediately interpretable.

**Recommendation:**

- Add an "Undo decision" or "Change decision" option, at least within a short time window.
- Use semantic.success color for the CONFIRM button instead of the accent color.
- Add a brief "What happens next?" note after confirmation (e.g., "Agent will resume with the selected approach.").

---

## Journey 5: Review Agent Work

**Scenario:** A mission has completed execution and is ready for human review. The user finds it, understands what changed, checks evidence, and approves or rejects.

### Step 5.1 --- Finding Missions Ready for Review

- **User goal:** Find missions that need my review.
- **Visible cues:**
  - MissionHome: "FILTER BY STAGE" buttons including "REVIEW."
  - LeftNav bottom: "X need review" counter.
  - Workflow Kanban board: REVIEW column.
- **Likely action:** Click the "REVIEW" filter button on MissionHome, or navigate to a workflow board and look at the REVIEW column.
- **Q1 -- Will the user form the right goal?** Yes. The filter is clear.
- **Q2 -- Will the user notice the correct action?** Likely. The filter buttons are visible at the top of the card list. The LeftNav counter is small but present.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes.
- **Q4 -- After acting, will the feedback make sense?** Yes. The card list filters to show only review-stage missions.

**Breakdowns / confusion risks:**

1. **The filter button for "REVIEW" is identical in visual weight to all other stage filters.** There is no special highlighting or badging on the "REVIEW" filter to indicate that items are waiting. The user must already know to filter by review.
2. **No default sorting by "needs attention."** The sort order is: escalation first, then review, then execute, then plan. This is good -- review items naturally appear near the top. But within a stage, sorting is by risk tier only, not by age or urgency.

**Recommendation:**

- Consider adding a count badge to the "REVIEW" filter button (e.g., "REVIEW (2)") to match the LeftNav counter.
- Add a "waiting since" indicator to review-stage MissionCards to help the user prioritize.

---

### Step 5.2 --- Understanding What Changed (DiffByIntent)

- **User goal:** Understand what the agent changed and whether it matches the acceptance criteria.
- **Visible cues:**
  - MissionReview page: ApprovalBar (sticky at top), DiffByIntent component in the center, EvidenceRail in the right sidebar, RollbackPreview at the bottom.
  - DiffByIntent groups changes by acceptance criterion. Each group shows: criterion text, file paths with +/- line counts, and a summary paragraph.
- **Likely action:** Read the ApprovalBar status, then review each diff group.
- **Q1 -- Will the user form the right goal?** Yes. "DIFF BY INTENT -- N groups" is a clear heading.
- **Q2 -- Will the user notice the correct action?** Yes. The DiffByIntent groups are prominently laid out.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. Grouping diffs by acceptance criterion directly answers "did the agent accomplish what was asked?"
- **Q4 -- After acting, will the feedback make sense?** Mostly.

**Breakdowns / confusion risks:**

1. **No actual diff view.** The DiffByIntent component shows file paths and line-count summaries, but there is no inline diff, expandable code view, or link to a file-level diff. The user sees "+42 / -8" for `src/middleware/auth.ts` but cannot inspect the actual changes. For a review workflow, this is a significant gap -- the user must trust the agent's summary without being able to verify the code.
2. **Summary text is agent-generated.** The summary paragraph under each group is authored by the agent. There is no human-written or independently-verified description. The user must trust this summary, which undermines the purpose of human review.
3. **No "view in IDE" or "open file" link.** Even in a prototype, the absence of a link to view the actual code is notable.

**Recommendation:**

- Add expandable inline diffs for each file in the DiffByIntent groups.
- Add a "View in Live View" link to open the workspace with the relevant file focused.
- Clearly label agent-generated summaries as such, and consider adding automated verification notes (e.g., "Tests passing: yes/no").

---

### Step 5.3 --- Checking Evidence

- **User goal:** Verify that tests pass and quality criteria are met.
- **Visible cues:**
  - Right sidebar: EvidenceRail showing evidence items with pass/fail/warning status.
- **Likely action:** Scan the evidence rail for failures or warnings.
- **Q1 -- Will the user form the right goal?** Yes. Evidence items are color-coded by status.
- **Q2 -- Will the user notice the correct action?** Yes. The right rail is visible alongside the diff.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes.
- **Q4 -- After acting, will the feedback make sense?** Yes.

**Breakdowns / confusion risks:**

1. **Evidence rail is a separate column from the diff.** On wide screens this is fine. On narrower screens, the 280px rail may be partially obscured. There is no responsive behavior defined.
2. **No drill-down into evidence items.** The evidence rail shows status and likely summary text, but there is no click-to-expand or navigation to detailed evidence artifacts (test reports, screenshots, logs). The user must trust the badge.

**Recommendation:**

- Add click-to-expand behavior on evidence items to show full detail (log output, test results, screenshots).

---

### Step 5.4 --- Approving or Rejecting

- **User goal:** Make the approve/reject decision.
- **Visible cues:**
  - ApprovalBar (sticky at top): status message ("Ready for approval" or "N blockers remaining"), and three buttons: "Re-plan" (with RotateCcw icon), "Reject" (with XCircle icon, accent/red color), "Approve" (with CheckCircle icon, green or gray).
  - If blockers remain, the Approve button has 50% opacity and `cursor: not-allowed`.
  - RollbackPreview at the bottom of the page explains what happens on rejection.
- **Likely action:** Read the ApprovalBar, then click Approve, Reject, or Re-plan.
- **Q1 -- Will the user form the right goal?** Yes. The ApprovalBar makes the decision point explicit.
- **Q2 -- Will the user notice the correct action?** Yes. The sticky bar is always visible at the top.
- **Q3 -- Will the user understand the action leads toward the goal?** Yes. Button labels are clear. The green/gray styling on Approve communicates readiness.
- **Q4 -- After acting, will the feedback make sense?** No -- no buttons have click handlers.

**Breakdowns / confusion risks:**

1. **All three buttons are non-functional.** None of the buttons (Re-plan, Reject, Approve) have `onClick` handlers. Clicking them does nothing. There is no feedback at all -- no toast, no confirmation dialog, no state change. This is a significant prototype gap.
2. **The disabled Approve button uses opacity and cursor changes but not `disabled` attribute.** The button can still be clicked (it just does nothing). Screen readers and keyboard users will not know it is disabled.
3. **"Re-plan" is ambiguous.** Does it send the mission back to the plan stage? Does it create a new plan? Does it allow editing? The label alone is insufficient.
4. **No confirmation dialog before Reject.** Rejection presumably triggers a rollback (as described in RollbackPreview), but there is no confirmation step to prevent accidental rejection.

**Recommendation:**

- Add click handlers with confirmation dialogs for Reject and Approve.
- Add proper `disabled` attribute to the Approve button when blockers exist.
- Add tooltip or subtitle to "Re-plan": "Send back to planning stage for revision."
- Show a confirmation dialog before Reject that quotes the RollbackPreview content.

---

## Extra Checks

### Hidden Prerequisites

| Issue                                                        | Location                       | Impact                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mission must be created before it can be added to a workflow | MissionCreate / WorkflowCreate | User cannot create a mission-within-a-workflow in one flow; must create mission first, then workflow.                                                                                                                                                                                      |
| Plan must be approved before agents start executing          | MissionPlan                    | No visible lifecycle guidance tells the user this.                                                                                                                                                                                                                                         |
| Ctrl+K for CommandPalette is undiscoverable                  | AppShell                       | No visible hint anywhere in the UI. The Search icon in TopBar has `onOpenCommandPalette` prop, but it is rendered in TopBar without being wired to AppShell's state (TopBar receives `onOpenCommandPalette` as a prop but AppShell does not pass it). The Search icon button does nothing. |

### Unclear Affordances

| Element                                  | Location        | Problem                                                                                                                                                                          |
| ---------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search icon in TopBar                    | TopBar.tsx      | `onClick={onOpenCommandPalette}` but AppShell never passes this prop to TopBar (TopBar is rendered inside page components, not AppShell). Clicking the Search icon does nothing. |
| Workflow title as navigation link        | Workflows.tsx   | Styled as a heading, not an obvious link. No underline, no hover underline. Only cursor and color-change on hover signal clickability.                                           |
| Settings "Save Changes" button           | Settings.tsx    | No click handler. Does nothing.                                                                                                                                                  |
| Settings dropdown (SelectControl)        | Settings.tsx    | Renders as a static `<div>`, not an actual `<select>`. The dropdown arrow is decorative. The notification preferences are not changeable.                                        |
| MissionCard as select-only, not navigate | MissionHome.tsx | Cards look like they should navigate but only select.                                                                                                                            |

### Weak or Missing Feedback

| Action                                   | Expected Feedback                    | Actual Feedback          |
| ---------------------------------------- | ------------------------------------ | ------------------------ |
| Click "CREATE MISSION" with empty fields | Validation errors                    | Success toast regardless |
| Click "Approve Plan & Begin Execution"   | Mission transitions to execute stage | Nothing (no handler)     |
| Click "Approve" in ApprovalBar           | Mission approved, transitions state  | Nothing (no handler)     |
| Click "Reject" in ApprovalBar            | Confirmation dialog, then rollback   | Nothing (no handler)     |
| Click "Re-plan" in ApprovalBar           | Mission transitions to plan stage    | Nothing (no handler)     |
| Click "Save Changes" in Settings         | Settings saved confirmation          | Nothing (no handler)     |
| Notification navigation for escalation   | Goes to escalation page              | Goes to overview page    |

### Misleading Labels

| Label                            | Location            | Why Misleading                                                                               |
| -------------------------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| "Inbox" in breadcrumb            | MissionHome TopBar  | Implies inbox/outbox dichotomy that does not exist                                           |
| "OPERATING SURFACE v0.1.0"       | AppShell bottom bar | Jargon; no meaning to users                                                                  |
| "AGENT SUPERVISION"              | LeftNav subtitle    | Accurate but too small to read (9px); if read, may confuse users unfamiliar with the concept |
| "Approve Plan & Begin Execution" | MissionPlan         | Suggests clicking will immediately start agents, but the button does nothing                 |

### Dead Ends

| Dead End                                          | Location       | Path Out                                                                                                      |
| ------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| After creating a mission                          | MissionCreate  | No navigation to new mission, no "View Mission" link. User must manually navigate back.                       |
| After creating a workflow                         | WorkflowCreate | Same as above -- toast then nothing.                                                                          |
| MissionDetail NAVIGATION section buried at bottom | MissionDetail  | User may not scroll far enough to find stage links.                                                           |
| Clicking Search icon in TopBar                    | TopBar         | Does nothing (prop not wired).                                                                                |
| "Not found" pages                                 | Various        | Have "Back to missions" link but inconsistent layout (some are centered text, some have full page structure). |

### Unclear Recovery Paths

| Situation                                              | Recovery Path                   | Problem                                                                |
| ------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------- |
| Accidentally confirming an escalation decision         | None                            | No undo, no "change decision" option. Confirmed decision is permanent. |
| Accidentally entering Live View                        | Esc or Back link                | Esc may conflict with modals. Back link is very small.                 |
| Filtered MissionHome shows "No missions match filters" | Click "ALL" filter              | Message is clear but does not suggest clicking ALL to reset.           |
| Agent stops responding in chat                         | Restart button (RotateCcw icon) | Icon-only, no label, no tooltip visible without hover.                 |

---

## Synthesis

### Steps Most Likely to Fail

1. **Step 2.3 (Starting agents after creation):** Dead end after creation. No navigation to the new mission, no lifecycle guidance explaining that plan approval is required before execution begins. User is stranded on the create form.

2. **Step 4.2 (Navigating from notification to escalation):** All notifications route to MissionDetail overview, not to the relevant stage page. For an urgent escalation, the user must then find and click through to the escalation page -- navigating past 8+ content sections to reach the buried NAVIGATION links at the bottom of MissionDetail.

3. **Step 3.3 (Peeking at execution -- finding sub-page navigation):** The NAVIGATION links in MissionDetail are at the bottom of a long scrollable page. There is no tab bar, no sidebar nav, and no top-of-page links to plan/execute/review/escalation. First-time users will likely miss these entirely.

4. **Step 5.4 (Approving or rejecting):** All action buttons are non-functional. Even accounting for prototype status, the absence of any feedback (no toast, no error, no state change) means user testing would produce misleading results.

5. **Step 5.2 (Understanding what changed):** No actual code diffs are available. The user cannot verify agent work at the code level, which undermines the entire review journey.

### Reasons First-Time Users May Hesitate

1. **Military/tactical aesthetic creates uncertainty about the tool's purpose.** Corner brackets, scanlines, Orbitron font, uppercase labels, and terms like "OPERATING SURFACE" and "MISSION" do not signal "developer tool" to most engineers. Users may spend time wondering if they are in the right application.

2. **No onboarding or contextual help.** There is no welcome screen, no tooltip tour, no empty-state guidance, and no help button. The user must infer the meaning of "missions," the lifecycle stages, and the relationship between missions and workflows entirely from the UI.

3. **Lifecycle model is never explicitly taught.** The plan-execute-review-escalation lifecycle is central to the tool but never diagrammed, explained, or even listed in a visible sequence. Users familiar with Kanban boards will partially infer it from the WorkflowDetail columns, but this requires navigating to Workflows first.

4. **Unclear which items need attention.** The LeftNav counter is the only proactive attention signal, and it is 9px text at the bottom of the sidebar. There is no dashboard, no priority inbox, no "your action needed" filter preset.

5. **Buttons that do nothing.** Multiple critical action buttons (Approve, Reject, Re-plan, Approve Plan, Save Settings) have no handlers. Users clicking these buttons will receive no feedback and may conclude the tool is broken.

### Design Changes Most Likely to Improve Task Completion

1. **Add a horizontal tab bar to all mission sub-pages.** Place Plan | Execute | Review | Escalation tabs at the top of MissionDetail, MissionPlan, MissionExecute, MissionReview, and MissionEscalation. This eliminates the buried-navigation problem (affects Journeys 3, 4, and 5).

2. **Route notifications to stage-specific pages.** Change `handleClick` in NotificationCenter to navigate to `/missions/:missionId/:stage` based on notification type or current mission stage. This fixes the escalation navigation gap (Journey 4).

3. **Add post-creation navigation.** After clicking "CREATE MISSION," navigate to MissionDetail or MissionPlan with a clear "Approve Plan to Begin Execution" call to action. This fixes the dead end (Journey 2).

4. **Wire the Search icon to CommandPalette.** Pass the `onOpenCommandPalette` handler from AppShell to the TopBar component (or have TopBar trigger the palette directly). Add a visible "Ctrl+K" hint next to the Search icon. This fixes the undiscoverable CommandPalette.

5. **Add a "needs attention" default view.** On MissionHome, default to showing escalation and review-stage missions first, with a visual indicator (colored left-border or badge) distinguishing items that require human action from items that are executing autonomously.

6. **Add inline code diffs to the review page.** Even a basic expandable diff view per file in DiffByIntent would dramatically improve the review journey, allowing the user to verify agent work at the code level.

7. **Add basic form validation and button handlers.** At minimum: required field indicators on MissionCreate, confirmation dialogs on Approve/Reject, and toast feedback on all action buttons. Without these, the prototype cannot produce valid usability test data.
