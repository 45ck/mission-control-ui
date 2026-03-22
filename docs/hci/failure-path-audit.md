# Failure Path Audit -- Mission Control Prototype

**Auditor**: HCI Expert (Automated)
**Date**: 2026-03-23
**Scope**: All pages, components, and interaction paths in `apps/web/src`
**Methodology**: Systematic enumeration of every non-happy-path state implied by the prototype's design surface

---

## 1) Empty States

| Screen / Component                                      | What is empty                                             | Current empty state treatment                                                                             | Has guidance?                                                       | Has call to action?                                                                             | Rating                                           |
| ------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ | --- | ------- |
| MissionHome (filtered list)                             | No missions match stage+risk filter combination           | Inline text: "No missions match filters"                                                                  | No -- does not say which filters are active or how to clear them    | No -- no "Clear filters" button                                                                 | PARTIAL                                          |
| MissionHome (zero missions total)                       | No missions exist at all                                  | Falls through to same "No missions match filters" text                                                    | No -- misleading; says "no match" when problem is "none exist"      | No -- the "+ NEW MISSION" button exists above but is visually disconnected from the empty state | PARTIAL                                          |
| FocusPanel (no selection)                               | No mission selected                                       | Inline text: "Select a mission to preview"                                                                | Yes -- tells user what to do                                        | No CTA needed -- guidance is sufficient                                                         | OK                                               |
| MissionExecute (overview, no agent sessions)            | No agent sessions for mission                             | Text: "No agent activity yet" in the agent log pane                                                       | Partial -- explains absence but not why or how to start             | No -- no "Launch Agent" CTA in this context; user must find the gear icon                       | PARTIAL                                          |
| MissionExecute (overview, no code files)                | No file tree for mission                                  | Text: "No code files"                                                                                     | No -- does not explain when files will appear                       | No                                                                                              | PARTIAL                                          |
| MissionExecute (overview, no browser/terminal sessions) | No sessions                                               | Entire SESSIONS section silently hidden (`mBrowserSessions.length > 0                                     |                                                                     | mTerminalSessions.length > 0`)                                                                  | No -- user has no idea sessions are a capability | No  | MISSING |
| MissionExecute (chat mode, zero messages)               | Empty message list when agent session has no chat history | Renders empty `<div>` -- blank white space                                                                | No                                                                  | No                                                                                              | MISSING                                          |
| MissionPlan (evidence rail)                             | No evidence gathered yet                                  | "No evidence gathered yet. Evidence will appear once execution begins."                                   | Yes -- explains why and when                                        | No CTA needed at this stage                                                                     | OK                                               |
| MissionEscalation (no escalations)                      | Mission exists but has no escalations                     | Text: "No escalations for this mission."                                                                  | Minimal -- does not explain what escalations are or when they occur | No                                                                                              | PARTIAL                                          |
| MissionDetail (zero acceptance criteria)                | Mission with empty `acceptanceCriteria` array             | Renders empty `<ul>` -- blank space under heading                                                         | No                                                                  | No                                                                                              | MISSING                                          |
| MissionDetail (zero risks)                              | Mission with empty `risks` array                          | Renders empty `<div>` under RISK ASSESSMENT heading                                                       | No                                                                  | No                                                                                              | MISSING                                          |
| MissionDetail (zero evidence)                           | All evidence counts show "0 PASS / 0 FAIL / 0 WARN"       | Shows the zeros, which is informative but not explanatory                                                 | No guidance on when evidence appears                                | No                                                                                              | PARTIAL                                          |
| MissionDetail (zero escalations)                        | No escalation alerts                                      | Section conditionally hidden (`missionEscalations.length > 0`)                                            | N/A -- user does not see it                                         | N/A                                                                                             | OK                                               |
| MissionDetail (zero agent sessions)                     | "0 sessions"                                              | Shows "0 sessions" text                                                                                   | No                                                                  | No                                                                                              | PARTIAL                                          |
| WorkflowDetail Kanban (empty column)                    | A stage column has zero missions                          | Dashed border: "No missions"                                                                              | No guidance                                                         | No                                                                                              | PARTIAL                                          |
| WorkflowDetail Kanban (all columns empty)               | Workflow with zero missions                               | All four columns show "No missions" simultaneously                                                        | No -- does not say "Add missions to this workflow"                  | No                                                                                              | PARTIAL                                          |
| Workflows page (zero workflows)                         | No workflows exist                                        | Would render heading "ACTIVE WORKFLOWS (0)" with empty space below                                        | No guidance text                                                    | The "+ CREATE WORKFLOW" button exists but no empty-state messaging                              | MISSING                                          |
| EvidenceRail (zero items)                               | No evidence items passed to rail                          | Shows "0 pass" summary line and empty filter bar, then renders nothing                                    | No -- looks broken                                                  | No                                                                                              | MISSING                                          |
| EvidenceRail (all filtered out)                         | Active filter matches no items                            | Filter buttons visible but content area is empty -- no "No results" message                               | No                                                                  | No                                                                                              | MISSING                                          |
| NotificationCenter (zero notifications)                 | No notifications in data                                  | Renders empty scrollable `<div>` -- blank dropdown                                                        | No -- should say "No notifications" or "All caught up"              | No                                                                                              | MISSING                                          |
| CommandPalette (no search results)                      | Query matches nothing                                     | "No results found"                                                                                        | Yes -- concise and clear                                            | No -- could suggest broadening query                                                            | OK                                               |
| AgentChatPanel (zero sessions)                          | No agent sessions passed                                  | `sessions[0]?.id` returns undefined; SessionTabs renders empty div                                        | No -- blank tab bar                                                 | No                                                                                              | MISSING                                          |
| CodeViewer (no open files)                              | `openFiles` is empty                                      | Empty tab bar, dark background, no content                                                                | No                                                                  | No                                                                                              | MISSING                                          |
| CodeViewer (active file not found)                      | `activeFile` path doesn't match any `CodeFile`            | `file` is undefined, `lines` is `[]` -- renders empty dark pane                                           | No -- silent failure                                                | No                                                                                              | MISSING                                          |
| History page (zero missions)                            | No missions exist                                         | Empty timeline with just the vertical line -- looks broken                                                | No                                                                  | No                                                                                              | MISSING                                          |
| CostDashboard (zero agent sessions)                     | No sessions to compute costs from                         | Empty arrays, `Math.max(...[])` returns `-Infinity` -- **potential runtime bug** in bar width calculation | No                                                                  | No                                                                                              | MISSING                                          |
| WorkspaceLayout (no browser session)                    | `browserSession` is undefined                             | Renders `null` in the browser quadrant -- empty white rectangle                                           | No                                                                  | No                                                                                              | MISSING                                          |
| WorkspaceLayout (no terminal session)                   | `terminalSession` is undefined                            | Renders `null` in the terminal quadrant -- empty white rectangle                                          | No                                                                  | No                                                                                              | MISSING                                          |

### Summary: 27 empty states identified. 3 rated OK, 10 PARTIAL, 14 MISSING.

---

## 2) Loading States

| Operation                   | Current loading indicator                      | Location                    | Blocks interaction?                             | Has timeout handling?               |
| --------------------------- | ---------------------------------------------- | --------------------------- | ----------------------------------------------- | ----------------------------------- |
| Page navigation             | `PageTransition` (framer-motion fade-in)       | Wraps page content          | No -- instant because data is mock              | No                                  |
| Mission list render         | None                                           | MissionHome                 | No                                              | No                                  |
| Agent chat "typing"         | `TypingIndicator` (3 bouncing dots)            | AgentChatPanel message area | Yes -- input disabled during typing + streaming | No timeout; hardcoded 1500ms delay  |
| Agent chat streaming        | `StreamingMessage` with cursor blink           | AgentChatPanel message area | Yes -- input disabled                           | No timeout; streams until complete  |
| BrowserPreview default page | "Loading..." text with `aw-skeleton` class     | BrowserPreview viewport     | No                                              | No                                  |
| Terminal streaming          | Pulsing `_` cursor                             | TerminalEmulator            | No                                              | No -- streams until all lines shown |
| Create Mission submit       | None -- instant toast                          | MissionCreate               | No -- button stays clickable                    | No                                  |
| Create Workflow submit      | None -- instant toast                          | WorkflowCreate              | No -- button stays clickable                    | No                                  |
| Settings save               | None                                           | Settings                    | No feedback at all                              | No                                  |
| Command Palette open        | None                                           | CommandPalette              | No -- instant filter from in-memory data        | No                                  |
| Live View load              | None                                           | LiveView                    | No -- renders synchronously from mock data      | No                                  |
| Agent launch                | Button changes to "AGENT LAUNCHED" immediately | AgentConfigPanel            | Button becomes disabled                         | No                                  |

### Analysis

There are **zero real loading states** in the prototype. This is expected for a static prototype, but the design does not include any patterns, skeletons, or placeholder states that show how the production system will handle:

- **API latency** (fetching missions, evidence, agent sessions)
- **WebSocket connection** (agent chat, terminal, browser preview)
- **Long-running operations** (agent launch, mission creation, plan approval)
- **Progressive loading** (large evidence rails, long chat histories)

**No skeleton screens exist.** The `aw-skeleton` class is used exactly once (BrowserPreview default page) and is not a general-purpose loading pattern.

**No timeout handling exists anywhere.** If a real API call takes >5 seconds, the user sees nothing. If it takes >30 seconds, there is no way to cancel, retry, or even know something is wrong.

**Critical gap**: The design gives no indication of what the loading experience will feel like in production.

---

## 3) Validation Errors

| Form / Input                             | Validation rules                                            | When validation runs | Error message                        | Error placement | Recovery path |
| ---------------------------------------- | ----------------------------------------------------------- | -------------------- | ------------------------------------ | --------------- | ------------- |
| MissionCreate: Title                     | None                                                        | Never                | None                                 | N/A             | N/A           |
| MissionCreate: Goal                      | None                                                        | Never                | None                                 | N/A             | N/A           |
| MissionCreate: Scope Boundary            | None                                                        | Never                | None                                 | N/A             | N/A           |
| MissionCreate: Owner                     | None                                                        | Never                | None                                 | N/A             | N/A           |
| MissionCreate: Risk Tier                 | Default selected (always valid)                             | N/A                  | N/A                                  | N/A             | N/A           |
| MissionCreate: Acceptance Criteria input | Trims whitespace; skips empty                               | On add (Enter/click) | None -- silently ignores empty input | N/A             | N/A           |
| MissionCreate: Risk input                | Trims whitespace; skips empty                               | On add (Enter/click) | None -- silently ignores empty input | N/A             | N/A           |
| MissionCreate: Submit                    | **None** -- fires `handleCreate()` regardless of form state | On click             | None -- always shows success toast   | N/A             | N/A           |
| WorkflowCreate: Title                    | None                                                        | Never                | None                                 | N/A             | N/A           |
| WorkflowCreate: Description              | None                                                        | Never                | None                                 | N/A             | N/A           |
| WorkflowCreate: Owner                    | None                                                        | Never                | None                                 | N/A             | N/A           |
| WorkflowCreate: Mission selection        | None -- zero missions is accepted                           | Never                | None                                 | N/A             | N/A           |
| WorkflowCreate: Submit                   | **None** -- fires regardless                                | On click             | None -- always shows success toast   | N/A             | N/A           |
| AgentConfigPanel: Max Tokens             | Range slider (1000-200000)                                  | Continuous           | N/A -- constrained by slider         | N/A             | N/A           |
| AgentConfigPanel: Timeout                | Range slider (30-600)                                       | Continuous           | N/A -- constrained by slider         | N/A             | N/A           |
| AgentChatPanel: Message input            | Trims and checks non-empty                                  | On Enter/Send click  | None -- silently ignores empty       | N/A             | N/A           |
| Settings: Policies                       | Toggle only                                                 | N/A                  | N/A                                  | N/A             | N/A           |
| Settings: Save                           | **None** -- button does nothing                             | On click             | None -- no feedback                  | N/A             | N/A           |

### Analysis

**There is zero validation in any form.** Not one field has:

- Required field indicators (no asterisks, no "required" labels)
- Character limits or length validation
- Format validation (e.g., owner could be an email)
- Duplicate detection (what if mission title already exists?)
- Cross-field validation (e.g., high-risk mission should have acceptance criteria)

**Both create forms will "succeed" with completely empty fields.** The MissionCreate form produces a preview showing "Untitled Mission" / "No goal specified" / "No scope defined" / "Unassigned" -- but the Create button fires a success toast anyway. There is no indication to the user that they have created an incomplete mission.

**The Settings page Save button does nothing.** No click handler, no feedback, no state change. The user clicks it and nothing happens.

**Critical gap**: The prototype teaches users that forms have no constraints. When validation is added in production, the UX will feel like a regression.

---

## 4) Permission and Authorization Failures

| Action / Screen          | Required permission | What happens without permission                                    | User feedback                                                |
| ------------------------ | ------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Create Mission           | Not defined         | N/A -- no auth system                                              | None                                                         |
| Approve Plan             | Not defined         | Button is always visible and clickable                             | None                                                         |
| Reject Mission (Review)  | Not defined         | Button is always visible and clickable                             | None                                                         |
| Approve Mission (Review) | Not defined         | Button is visually disabled when blockers exist but still rendered | Disabled state via `cursor: not-allowed` and reduced opacity |
| Escalation Decision      | Not defined         | All users see all options                                          | None                                                         |
| Agent Launch             | Not defined         | Button is always visible                                           | None                                                         |
| Settings Save            | Not defined         | Button is always visible                                           | None                                                         |
| Agent Stop/Pause/Restart | Not defined         | Controls always visible                                            | None                                                         |

### Analysis

**There is no permission model anywhere in the prototype.** No concept of:

- Roles (reviewer, operator, admin)
- Ownership-based access (only mission owner can approve)
- Risk-tier-based permissions (high-risk missions need senior approval)

The Settings page mentions "High-risk missions require 2 approvals" as a policy, but the Review page has a single Approve button with no concept of multi-approval.

**Critical gap**: For a mission-control system managing autonomous agents, the absence of authorization design is a significant risk. The prototype does not even hint at who can approve what.

---

## 5) Network and Connectivity Failures

| Operation                            | Behavior on network failure       | Retry available? | Data preserved? | Offline fallback? |
| ------------------------------------ | --------------------------------- | ---------------- | --------------- | ----------------- |
| Any page load                        | N/A -- all data is in-memory mock | N/A              | N/A             | N/A               |
| Mission create                       | N/A -- mock                       | N/A              | N/A             | N/A               |
| Agent chat send                      | N/A -- mock with canned responses | N/A              | N/A             | N/A               |
| Agent lifecycle (pause/stop/restart) | N/A -- mock                       | N/A              | N/A             | N/A               |
| Notification load                    | N/A -- mock                       | N/A              | N/A             | N/A               |

### Analysis

**There is no network layer, so there are no network failure designs.** This is the most dangerous gap in the prototype because:

1. **No error boundary exists.** The entire React app has zero `ErrorBoundary` components. A runtime error in any component will crash the whole page with the default React error screen.

2. **No global error handling pattern.** There is no toast system for API errors, no error banner, no retry mechanism designed.

3. **No API error shape defined.** The prototype does not model what error responses look like, so there is no design for how to display "403 Forbidden" vs "500 Internal Server Error" vs "429 Rate Limited" vs "Network timeout."

4. **The agent chat is a WebSocket use case.** The design shows a real-time streaming chat with agents. There is no design for:
   - WebSocket connection lost
   - WebSocket reconnection
   - Message delivery failure
   - Message ordering issues
   - Stale session state

5. **The Live View is a real-time dashboard.** There is no design for what happens when the live data feed drops.

**Critical gap**: This is the single largest category of missing failure handling. Every future API integration will need error handling designed from scratch because the prototype provides zero patterns to follow.

---

## 6) Partial Completion

| Flow                         | Can be partially completed?                      | What happens if abandoned?                      | Can be resumed? | Is progress saved?                  |
| ---------------------------- | ------------------------------------------------ | ----------------------------------------------- | --------------- | ----------------------------------- |
| MissionCreate form           | Yes -- user can fill some fields                 | All data lost on navigation                     | No              | No                                  |
| WorkflowCreate form          | Yes -- user can fill some fields                 | All data lost on navigation                     | No              | No                                  |
| Escalation decision          | Yes -- user can select but not confirm           | Selection state reset on remount                | No              | No                                  |
| Agent chat conversation      | Yes -- user can type but not send                | Draft text lost on session switch or navigation | No              | No                                  |
| Mission approval flow (Plan) | Yes -- user can view but not approve             | No data to lose                                 | N/A             | N/A                                 |
| Mission review flow          | Yes -- user can view diff but not approve/reject | No data to lose                                 | N/A             | N/A                                 |
| Agent config + launch        | Yes -- user can configure but not launch         | Config state lost on close                      | No              | No                                  |
| Notification mark-as-read    | Yes -- partial reads tracked in component state  | State lost on remount (back to initial data)    | No              | No -- `readIds` is local `useState` |

### Analysis

**No form has auto-save, drafts, or navigation guards.** If a user fills out the MissionCreate form with a detailed goal, scope boundary, 5 acceptance criteria, and 3 risks -- then accidentally clicks a sidebar link -- everything is gone. No "unsaved changes" warning. No confirmation dialog. No draft.

**Notification read state is ephemeral.** The `readIds` state in NotificationCenter uses `useState`, which resets when the component unmounts and remounts. This means marking notifications as read has no persistence -- refreshing the page un-reads everything.

**The agent config panel state is ephemeral.** Closing and reopening the agent config panel resets all settings to defaults.

**Critical gap**: For a tool that manages multi-step mission lifecycles, the lack of any state persistence or navigation protection is a significant usability risk.

---

## 7) Undo, Cancel, and Recovery

| Action                                      | Reversible?              | Undo mechanism                                                    | Confirmation required?                 | Time limit on undo?                                                   |
| ------------------------------------------- | ------------------------ | ----------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| Create Mission                              | No                       | None -- mission "created" is a mock toast                         | No confirmation                        | N/A                                                                   |
| Create Workflow                             | No                       | None -- same mock toast                                           | No confirmation                        | N/A                                                                   |
| Approve Plan                                | No                       | None -- button click has no handler                               | N/A                                    | N/A                                                                   |
| Reject Plan (request changes)               | No                       | None -- button click has no handler                               | N/A                                    | N/A                                                                   |
| Approve Mission (Review)                    | No                       | None -- button disabled when blockers exist, no handler otherwise | No                                     | N/A                                                                   |
| Reject Mission (Review)                     | No                       | None -- no handler                                                | No                                     | N/A                                                                   |
| Re-plan Mission (Review)                    | No                       | None -- no handler                                                | No                                     | N/A                                                                   |
| Escalation Decision (Confirm)               | No                       | None -- decision is final once confirmed                          | **Yes** -- 2-step: select then confirm | N/A                                                                   |
| Agent Stop                                  | Partial                  | 2-step: click Stop, then "Confirm?"                               | **Yes** -- 2-step confirmation         | No explicit timeout, but Confirm text resets if user clicks elsewhere |
| Agent Pause                                 | No                       | Toggle to Resume                                                  | No -- immediate toggle                 | N/A                                                                   |
| Agent Launch                                | No                       | Cannot un-launch -- button permanently disabled                   | No confirmation                        | N/A                                                                   |
| Remove acceptance criterion (MissionCreate) | No                       | None -- immediately removed from list                             | No                                     | N/A                                                                   |
| Remove risk (MissionCreate)                 | No                       | None -- immediately removed from list                             | No                                     | N/A                                                                   |
| Remove mission from workflow order          | No                       | None -- immediately removed                                       | No                                     | N/A                                                                   |
| Close file tab (CodeViewer)                 | No                       | None -- tab immediately closed                                    | No                                     | N/A                                                                   |
| Mark notification as read                   | No                       | None -- no mark-as-unread                                         | No                                     | N/A                                                                   |
| Settings policy toggle                      | No undo, but toggle back | Toggle back to previous state                                     | No                                     | N/A                                                                   |
| Settings Save                               | N/A                      | Button has no handler                                             | N/A                                    | N/A                                                                   |

### Analysis

**Two actions have confirmation dialogs:**

1. **Escalation Decision**: Select -> Confirm/Cancel. This is well-designed. The confirmation shows what will happen ("Are you sure? This will: [description]").
2. **Agent Stop**: Click -> "Confirm?" text replaces icon. This is adequate but minimal.

**Every other destructive action has no confirmation.** Removing acceptance criteria and risks from the create forms is immediate and irreversible. There is no undo stack. No "deleted -- undo?" toast pattern.

**Agent Launch is irreversible by design.** Once launched, the button permanently shows "AGENT LAUNCHED" (disabled). There is no way to cancel a launch, reconfigure, or un-launch. This is a significant concern for a safety-critical agent management tool.

**The MissionReview page mentions "ROLLBACK PREVIEW"** with a hardcoded commit hash, which is the only place in the UI that acknowledges the concept of reverting changes. But it has no associated action button.

**Critical gap**: In a mission-control system where agents make real code changes, the lack of undo/rollback mechanisms is a serious design gap.

---

## 8) Concurrent and Conflict States

| Scenario                                            | Current handling | User feedback                                  |
| --------------------------------------------------- | ---------------- | ---------------------------------------------- |
| Two users viewing same mission                      | Not addressed    | None -- no presence indicators                 |
| Two users editing same escalation decision          | Not addressed    | None -- no locking, no optimistic concurrency  |
| Mission stage changes while user is on detail page  | Not addressed    | None -- data is static mock                    |
| Evidence status updates while viewing evidence rail | Not addressed    | None -- no real-time updates                   |
| Agent completes while user is typing a message      | Not addressed    | None -- chat state is local                    |
| Notification arrives while dropdown is open         | Not addressed    | None -- notification list is static            |
| User opens Live View for same mission in two tabs   | Not addressed    | Would render independently from same mock data |
| Mission deleted while user is on its detail page    | Not addressed    | User would see stale data until navigation     |
| Workflow modified while user is on WorkflowDetail   | Not addressed    | None                                           |

### Analysis

**There is zero concurrency handling.** This is expected for a static prototype, but the designs do not include:

- User presence indicators ("Alex is also viewing this mission")
- Optimistic locking ("This mission was updated. Refresh to see changes.")
- Conflict resolution ("Your decision conflicts with a decision made by...")
- Real-time update indicators (badge counts, status changes)

For a multi-user mission control system, this is a significant gap. The escalation decision flow is particularly dangerous: two users could both select and confirm different options with no awareness of each other.

---

## Summary Table

| Category                | Items audited | Handled well | Partially handled | Not handled  | Critical gaps                                                                            |
| ----------------------- | ------------- | ------------ | ----------------- | ------------ | ---------------------------------------------------------------------------------------- |
| 1. Empty states         | 27            | 3 (11%)      | 10 (37%)          | 14 (52%)     | EvidenceRail, ChatPanel, NotificationCenter, CostDashboard (runtime bug), Workflows page |
| 2. Loading states       | 12            | 0 (0%)       | 3 (25%)           | 9 (75%)      | No loading patterns exist; no skeletons, no timeouts, no cancel                          |
| 3. Validation errors    | 17            | 1 (6%)       | 0 (0%)            | 16 (94%)     | Both create forms accept empty submissions; Settings save does nothing                   |
| 4. Permissions          | 8             | 0 (0%)       | 1 (13%)           | 7 (87%)      | No permission model at all; no role-based access                                         |
| 5. Network failures     | 5             | 0 (0%)       | 0 (0%)            | 5 (100%)     | No error boundary; no API error patterns; no offline handling                            |
| 6. Partial completion   | 8             | 0 (0%)       | 0 (0%)            | 8 (100%)     | No auto-save; no navigation guards; no draft persistence                                 |
| 7. Undo/cancel/recovery | 17            | 2 (12%)      | 2 (12%)           | 13 (76%)     | Agent launch irreversible; no undo for destructive list edits                            |
| 8. Concurrency          | 9             | 0 (0%)       | 0 (0%)            | 9 (100%)     | No presence; no locking; no conflict resolution                                          |
| **TOTAL**               | **103**       | **6 (6%)**   | **16 (16%)**      | **81 (79%)** |                                                                                          |

---

## Synthesis

### Top 5 Most Likely Failure Scenarios Users Will Encounter

1. **Accidental data loss in create forms.** User fills out a detailed mission or workflow, accidentally navigates away, and loses everything. No navigation guard, no auto-save, no draft. This will happen frequently because the sidebar is always visible and clickable.

2. **Empty mission with fake success.** User clicks "CREATE MISSION" with zero fields filled. Gets a success toast. Goes to mission list. The "mission" does not actually exist (mock), but the design teaches them that empty submissions are valid. When real validation is added, this becomes a confusing behavior change.

3. **Blank panels in Live View.** User enters Live View for a mission that has no browser session, no terminal session, or no code files. Two of the four quadrants render as empty white rectangles with no explanation. The layout grid remains rigid, wasting 50%+ of screen real estate on nothing.

4. **Notification state not persisting.** User marks 5 notifications as read. Navigates away. Comes back. All 5 are unread again. This will train users to stop using the notification system.

5. **Agent chat with no sessions.** User switches to Chat mode on MissionExecute for a mission with no agent sessions. The AgentChatPanel receives an empty array, `sessions[0]?.id` is undefined, and the panel renders as a broken-looking empty state with no tabs, no status bar, but an active input field that does nothing useful.

### Top 5 Missing or Broken Failure States

1. **CostDashboard with zero agent sessions.** `Math.max(...[])` returns `-Infinity`. This is used as a divisor for bar width calculations. `Math.max(...missionGroups.map(g => g.totalTokens), 1)` is safe because of the `,1` fallback. But if `agentSessions` is empty, `missionGroups` is `[]`, `modelGroups` is `[]`, and `workflowGroups` has all zeros. The SVG bars will render with width `1` (the fallback), which is cosmetically wrong but not crashing. However, the page will show empty sections with no "No data" messaging. Rating: **functional bug risk**.

2. **No React ErrorBoundary.** There is no error boundary anywhere in the component tree. If any component throws (e.g., accessing a property on undefined mission data), the entire application crashes to a white screen. No recovery path, no "go back" link, no error reporting. This is the most dangerous missing piece.

3. **EvidenceRail with zero items after filtering.** User clicks a filter (e.g., "Policy") and no items match. The rail shows the filter buttons and sort control, then... nothing. No "No items match this filter" message. The user might think the UI is broken or loading.

4. **NotificationCenter with zero notifications.** The dropdown opens and shows the header "NOTIFICATIONS" and then an empty scrollable area. No "All caught up" or "No notifications" message. Looks broken.

5. **AgentChatPanel empty message list.** When `allMessages` is an empty array and there is no typing/streaming state, the message area is completely blank. Combined with the issue of zero sessions (no tabs to display), the entire panel is a mostly empty box with only an input field at the bottom.

### Pattern: Which Failure Category Is Systematically Ignored?

**Network and connectivity failures are 100% unhandled.** Not a single component in the entire prototype addresses what happens when data is unavailable, stale, or fails to load. This is not just a "prototype limitation" -- it is a design gap. The prototype does not even include placeholder patterns (skeletons, error banners, retry buttons) that would signal how these cases should be handled.

The second most systematically ignored category is **partial completion / state persistence** (100% unhandled). Every piece of user input is stored in ephemeral `useState` with no persistence layer, no navigation guards, and no draft mechanism.

The third is **concurrency** (100% unhandled), though this is more understandable for a prototype.

### Quickest Wins (Easy to Fix)

1. **Add "No results" message to EvidenceRail.** Two lines of JSX after the filter loop:

   ```tsx
   {
     filteredAndSorted.length === 0 && (
       <div className="aw-body py-4 text-center" style={{ color: aw.textSoft }}>
         No evidence items match this filter.
       </div>
     );
   }
   ```

2. **Add "No notifications" message to NotificationCenter.** Same pattern inside the dropdown:

   ```tsx
   {
     notifications.length === 0 && (
       <div className="aw-body px-3 py-6 text-center" style={{ color: aw.textSoft }}>
         No notifications yet.
       </div>
     );
   }
   ```

3. **Add "All caught up" state for all-read notifications.** Check `unreadCount === 0` and show a subtle message.

4. **Disable create buttons when required fields are empty.** Add `disabled={!title.trim()}` to both MissionCreate and WorkflowCreate submit buttons. Show disabled styling. Minimal effort, large UX improvement.

5. **Add empty state to Workflows page.** When `workflows.length === 0`, show an EmptyState component with the GitBranch icon and "Create your first workflow" CTA. Already have the EmptyState primitive; just need to use it.

6. **Add empty state for AgentChatPanel with zero sessions.** Show "No agent sessions. Launch an agent to begin." with a link or button.

7. **Fix MissionHome empty state.** Differentiate "no missions match filters" (show "Clear filters" button) from "no missions exist at all" (show "Create your first mission" CTA).

8. **Add empty panel states to WorkspaceLayout.** When `browserSession` is undefined, render a placeholder: "No browser session active." Same for terminal.

### Structural Issues (Need Architectural Changes)

1. **React ErrorBoundary.** The app needs at minimum a top-level ErrorBoundary in `App.tsx` that catches render errors and shows a recovery UI. Ideally, page-level boundaries too, so one broken page does not take down the whole app. This requires adding a class component (React error boundaries cannot be function components) or using a library like `react-error-boundary`.

2. **Form state persistence.** The create forms need either:
   - A `useBeforeUnload` / router `useBlocker` hook to warn on navigation with unsaved changes, or
   - Auto-save to localStorage/sessionStorage, or
   - Both.
     This requires a form state management decision (local storage, URL params, or a state management library).

3. **API error handling architecture.** Before connecting to a real backend, the team needs to design:
   - A global error boundary + toast system for API errors
   - Per-request error states (inline error messages in components)
   - Retry mechanisms (automatic for idempotent GETs, manual for mutations)
   - Timeout configuration and user-visible timeout indicators
     This is not a component fix -- it is an architectural decision about where error state lives and how it propagates.

4. **Loading state architecture.** The prototype needs a skeleton/loading pattern library. Options include:
   - Skeleton screens (preferred for data-heavy views like MissionHome, CostDashboard)
   - Spinner overlays (acceptable for short operations like create/approve)
   - Progressive loading (for chat history, evidence rails)
     This requires deciding on a loading state primitive and retrofitting it across all data-consuming components.

5. **Permission model integration.** The prototype needs to design how permissions affect the UI:
   - Which buttons are hidden vs disabled vs shown-with-error?
   - How does the UI communicate "you need X permission to do Y"?
   - How does multi-approval (2 approvals for high-risk) appear in the Review flow?
     This requires a permission model design before the UI can be updated.

6. **Real-time state management.** The Live View, Agent Chat, and Evidence Rail all imply real-time data streams. The prototype needs to design:
   - Connection status indicators (connected / reconnecting / disconnected)
   - Stale data warnings
   - Optimistic updates with rollback
     This requires choosing a real-time data layer (WebSocket, SSE, polling) and designing the UX around connection lifecycle.

7. **Concurrency and conflict resolution for escalation decisions.** When two users can both see and confirm escalation options, the system needs:
   - Optimistic locking (show "this escalation was resolved by X at Y" if someone else decided first)
   - Or pessimistic locking (lock the escalation to the first user who opens it)
   - Either way, presence indicators showing who else is viewing the escalation

---

## Appendix: Component-Level Failure Path Inventory

### MissionCreate (`apps/web/src/pages/MissionCreate.tsx`)

- **F1**: Submit with all fields empty -> success toast (should: validate required fields)
- **F2**: Submit with extremely long title (10,000 chars) -> no length limit (should: cap at reasonable length)
- **F3**: Submit with XSS payload in title -> renders in preview card (should: sanitize, though React auto-escapes)
- **F4**: Add duplicate acceptance criteria -> accepted (should: warn or deduplicate)
- **F5**: Navigate away with filled form -> data lost silently (should: warn unsaved changes)
- **F6**: Rapidly double-click Create -> two success toasts (should: disable button during "submission")

### WorkflowCreate (`apps/web/src/pages/WorkflowCreate.tsx`)

- **F1-F5**: Same issues as MissionCreate
- **F6**: Select 50+ missions -> no pagination or scrolling limit on checkbox list (should: paginate or virtualize)
- **F7**: Drag-to-reorder not functional (GripVertical icon is visual only) -> (should: either implement or remove grip icon to avoid confusion)

### MissionExecute (`apps/web/src/pages/MissionExecute.tsx`)

- **F1**: Switch to Chat mode with 0 agent sessions -> broken AgentChatPanel
- **F2**: Open Agent Config, launch, close, reopen -> config panel resets but shows "LAUNCH AGENT" again (state is per-mount)
- **F3**: AgentConfigPanel overlaps content -> absolute positioned panel covers right rail evidence

### AgentChatPanel (`apps/web/src/components/execute/AgentChatPanel.tsx`)

- **F1**: Zero sessions -> empty tabs, no status bar, input still enabled
- **F2**: User sends message, switches session tab -> local messages filtered by session ID, but typing/streaming state is global (streaming response may appear in wrong session context)
- **F3**: User sends message during streaming -> blocked by `disabled` state, but no visual explanation of why
- **F4**: Very long message -> no character limit, textarea grows but no scroll handling

### ConsequencePanel (`apps/web/src/components/escalation/ConsequencePanel.tsx`)

- **F1**: Zero options -> renders empty `<div>` (should: "No decision options available")
- **F2**: User confirms decision, then page remounts -> decision state lost (useState ephemeral)
- **F3**: User wants to undo a confirmed decision -> impossible; no undo mechanism
- **F4**: All options have identical labels -> no disambiguation

### NotificationCenter (`apps/web/src/components/shell/NotificationCenter.tsx`)

- **F1**: Zero notifications -> blank dropdown
- **F2**: 100+ notifications -> no virtualization, may be slow to render
- **F3**: Notification links to mission that no longer exists -> navigates to MissionDetail "not found" state
- **F4**: Click notification -> navigates to `/missions/${n.missionId}` even if mission is workflow-contexted (should use workflow prefix when applicable)

### CommandPalette (`apps/web/src/components/shell/CommandPalette.tsx`)

- **F1**: Very long mission title -> truncated with CSS, but may break layout at extreme lengths
- **F2**: Special characters in search -> regex-safe because using `String.includes()` not regex
- **F3**: Rapid open/close -> `setTimeout` for focus may fire after close

### WorkspaceRedirect (`apps/web/src/pages/WorkspaceRedirect.tsx`)

- **F1**: Unknown workspace ID -> silent redirect to `/missions` (OK -- handled)
- **F2**: Workspace maps to non-existent mission -> redirects to LiveView which shows "Mission not found" (OK -- handled)

### ApprovalBar (`apps/web/src/components/review/ApprovalBar.tsx`)

- **F1**: Approve, Reject, Re-plan buttons have no `onClick` handlers -> buttons are clickable but do nothing
- **F2**: `canApprove` is false but user clicks Approve -> button has disabled styling via CSS (`cursor: not-allowed`, `opacity: 0.5`) but no `disabled` attribute -- **the button is still technically clickable**

### 404 Route (`App.tsx NotFound`)

- **F1**: 404 shows EmptyState + "Go to Missions" link -> well-handled
- **F2**: 404 inside AppShell preserves sidebar navigation -> well-handled
- **F3**: LiveView routes are outside AppShell -- a bad Live View URL renders the LiveView's own "Mission not found" state without the AppShell -> user has no sidebar to navigate, only the "Return to Missions" link. This is acceptable but inconsistent.
