# Failure Path Audit -- Mission Control Prototype

> Document 7 of 10 | Date: 2026-03-24
> Cross-references: [state-model.md](./state-model.md), [information-architecture.md](./information-architecture.md)

---

## Overview

This document audits every non-happy-path state in the Mission Control prototype: empty states, loading states, error states, permission states, offline handling, and edge cases. Each finding includes file:line references and a severity assessment.

**Rating key**:

- Y = properly handled
- ~ = partially handled (exists but incomplete)
- N = not handled (missing or broken)

---

## 1. Empty States

### 1.1 MissionHome: Empty Filter Results

**File**: `MissionHome.tsx:192-198`
**Rating**: Y (with caveat)

```tsx
{
  sorted.length === 0 && (
    <EmptyState
      icon={SearchX}
      title="No missions match filters"
      description="Try adjusting your stage or risk filters to see more results."
    />
  );
}
```

The `EmptyState` component from `components/primitives/EmptyState.tsx` is used here with the `SearchX` icon, providing both a title and actionable description. This is the ONLY place in the entire application that uses the `EmptyState` component.

**Caveat**: This same message appears when zero missions exist in the system (not just when filters exclude all missions). The message "No missions match filters" is misleading in a zero-mission scenario. The `+ NEW MISSION` button exists above (`MissionHome.tsx:105-112`) but is visually disconnected from the empty state.

### 1.2 MissionPlan: No Evidence

**File**: `MissionPlan.tsx:200-207`
**Rating**: Y

```tsx
{
  missionEvidence.length > 0 ? (
    <EvidenceRail items={missionEvidence} />
  ) : (
    <div className="aw-body py-4 text-center" style={{ color: aw.textSoft }}>
      No evidence gathered yet.
      <br />
      Evidence will appear once execution begins.
    </div>
  );
}
```

Properly handled. Explains both the current state ("no evidence gathered yet") and when it will change ("once execution begins"). Applied to MSN-003 which is in plan stage with `evidenceIds: []`.

### 1.3 MissionExecute: No Agent Sessions

**File**: `MissionExecute.tsx:265-268`
**Rating**: Y (minimal)

```tsx
{
  mAgentSessions.length > 0 ? (
    <div className="space-y-1.5">{/* ...agent log entries... */}</div>
  ) : (
    <div className="aw-body-sm" style={{ color: aw.textSoft }}>
      No agent activity yet
    </div>
  );
}
```

Shows "No agent activity yet" text in the agent log pane. However:

- No guidance on how to start an agent (the gear icon for AgentConfigPanel is nearby but not referenced)
- The AgentSwimlane section above (`MissionExecute.tsx:208-217`) renders "AGENT SESSIONS (0)" heading with an empty `<div className="mt-3 space-y-4">` -- no empty state message in the swimlane area itself
- The code viewer section (`MissionExecute.tsx:274-293`) shows "No code files" if no file tree exists, which is a separate empty state

### 1.4 MissionEscalation: No Escalations

**File**: `MissionEscalation.tsx:57-86`
**Rating**: Y

```tsx
if (!selectedEscalation) {
  return (
    <PageTransition>
      <TopBar missionId={mission.id} currentStage="escalation" breadcrumbs={...} />
      <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="escalation" />
      <div className="flex h-full items-center justify-center">
        <span className="aw-body" style={{ color: aw.textSoft }}>
          No escalations for this mission.
        </span>
      </div>
    </PageTransition>
  );
}
```

Properly handled -- renders within `PageTransition` with `TopBar` and `StageTabBar` so navigation is preserved. Centered message text is clear. Note that this renders TopBar and StageTabBar correctly (lines 60-78), unlike the not-found states on Plan/Execute/Review which omit the TopBar.

### 1.5 Completed Stage: NEVER EXERCISED

**File**: `missions.ts:37-192` (all mission definitions)
**Rating**: N (critical gap)

All 5 missions in mock data:

| Mission | Stage     | artifactIds              |
| ------- | --------- | ------------------------ |
| MSN-001 | `review`  | `['ART-001', 'ART-002']` |
| MSN-002 | `execute` | none                     |
| MSN-003 | `plan`    | none                     |
| MSN-004 | `review`  | `['ART-003', 'ART-004']` |
| MSN-005 | `review`  | `['ART-005', 'ART-006']` |

**Zero completed missions.** The completed stage rendering path is never exercised. This means the following are untested:

1. `ActivityPreview.tsx:47` -- `isCompleted` evaluates to true for `completed` or `review` stages. The `review`-stage rendering IS tested by MSN-001/004/005, but `completed` specifically is not.
2. `FocusPanel.tsx:15-16` -- completed missions route to overview (no stage suffix). This path exists in code but is never hit by mock data.
3. `MissionHome.tsx:93` -- the filter chip for "completed" renders but produces 0 results.
4. Any completed-specific empty states, summary views, or post-completion affordances are unknown.

### 1.6 LiveView with No Workspace

**File**: `LiveView.tsx:136-145`
**Rating**: ~ (partial)

```tsx
const effectiveWorkspace = workspace ?? {
  id: `LV-${missionId}`,
  missionId: missionId ?? '',
  branch: mission?.branch ?? 'main',
  baseBranch: 'main',
  activeFile: '',
  openFiles: [] as string[],
  terminalSessionId: '',
  agentSessionId: '',
};
```

When no workspace data exists for a mission, LiveView constructs a fallback `effectiveWorkspace` with empty defaults. This is passed to `WorkspaceLayout` (`LiveView.tsx:194-201`), which renders:

- `FileTree` with empty `fileTree` array (`LiveView.tsx:196`: `fileTree ? [fileTree] : []`) -- shows nothing
- `CodeViewer` with empty files -- shows empty dark pane
- `BrowserPreview` with `undefined` session (`LiveView.tsx:198`): `WorkspaceLayout.tsx:68` renders `null` -- white rectangle
- `TerminalEmulator` with `undefined` session (`LiveView.tsx:199`): `WorkspaceLayout.tsx:71` renders `null` -- white rectangle
- `AgentChatPanel` with empty sessions -- renders empty chat interface

The result is a functional but mostly empty grid layout. No "No data available" messages in any quadrant. No "retry" or "reconnect" affordance. The user sees the WorkspaceLayout grid structure with blank quadrants.

### 1.7 ArtifactPanel with Empty Artifacts

**File**: `ArtifactPanel.tsx:23`
**Rating**: Y (but silent)

```tsx
if (artifacts.length === 0) return null;
```

When called with an empty array, ArtifactPanel returns `null`, rendering nothing. This is clean -- no broken UI, no empty container. However, for a completed mission where artifacts are expected, the silent disappearance gives no indication that deliverables are expected but missing. No "No artifacts produced" message is shown.

### 1.8 Additional Empty States Identified

| Component                                    | Condition                            | Current Behavior                            | File:Line                    | Rating |
| -------------------------------------------- | ------------------------------------ | ------------------------------------------- | ---------------------------- | ------ |
| MissionDetail: zero acceptance criteria      | `mission.acceptanceCriteria` is `[]` | Renders empty `<ul>` under heading          | `MissionDetail.tsx:154-167`  | N      |
| MissionDetail: zero risks                    | `mission.risks` is `[]`              | Renders empty `<div>` under RISK ASSESSMENT | `MissionDetail.tsx:176-185`  | N      |
| MissionDetail: zero evidence                 | All counts are 0                     | Shows "0 PASS / 0 FAIL / 0 WARN"            | `MissionDetail.tsx:210-218`  | ~      |
| MissionDetail: zero escalations              | `missionEscalations.length === 0`    | Section conditionally hidden                | `MissionDetail.tsx:223`      | Y      |
| MissionDetail: zero agent sessions           | Empty sessions array                 | Shows "0 sessions"                          | `MissionDetail.tsx:198`      | ~      |
| MissionExecute: no code files                | No file tree for mission             | "No code files" text                        | `MissionExecute.tsx:287-291` | ~      |
| MissionExecute: no browser/terminal sessions | Length is 0                          | SESSIONS section hidden entirely            | `MissionExecute.tsx:315`     | N      |
| FocusPanel: no mission selected              | `mission` is null                    | "Select a mission to preview" text          | `FocusPanel.tsx:21-27`       | Y      |
| CommandPalette: no search results            | Query matches nothing                | "No results found" text                     | `CommandPalette.tsx:243-247` | Y      |
| WorkspaceLayout: no browser session          | `browserSession` is undefined        | Renders `null` in grid cell                 | `WorkspaceLayout.tsx:68`     | N      |
| WorkspaceLayout: no terminal session         | `terminalSession` is undefined       | Renders `null` in grid cell                 | `WorkspaceLayout.tsx:71`     | N      |

### Empty States Summary

| Rating                | Count | Percentage |
| --------------------- | ----- | ---------- |
| Y (properly handled)  | 7     | 39%        |
| ~ (partially handled) | 5     | 28%        |
| N (not handled)       | 6     | 33%        |

---

## 2. Loading States

**File**: All pages in `apps/web/src/pages/`
**Rating**: N/A (acceptable for prototype)

All data in the Mission Control prototype is static mock data imported synchronously from `apps/web/src/data/*.ts` files. There are no asynchronous data fetching operations, no API calls, and no loading delays.

| Operation           | Current Loading Indicator                                      | Blocks UI?    | Has Timeout? | File                       |
| ------------------- | -------------------------------------------------------------- | ------------- | ------------ | -------------------------- |
| Page navigation     | `PageTransition` (framer-motion fade-in, `PageTransition.tsx`) | No -- instant | No           | AppShell children          |
| Mission list render | None -- synchronous import                                     | No            | No           | `MissionHome.tsx:3`        |
| Evidence data       | None -- synchronous                                            | No            | No           | `MissionPlan.tsx:57`       |
| Agent sessions      | None -- synchronous                                            | No            | No           | `MissionExecute.tsx:62-65` |
| Code files          | None -- synchronous                                            | No            | No           | `MissionExecute.tsx:67`    |
| LiveView workspace  | None -- synchronous                                            | No            | No           | `LiveView.tsx:117-132`     |
| All data in app     | Static imports from `data/`                                    | No            | No           | N/A                        |

**Assessment**: No loading states exist because all data is static. This is acceptable for a prototype but would be CRITICAL for production. The following loading scenarios are undesigned:

1. **API latency**: fetching missions, evidence, agent sessions from a backend
2. **WebSocket connection**: agent chat real-time updates, terminal streaming, browser preview
3. **Long-running operations**: agent launch, mission creation, plan approval
4. **Progressive loading**: large evidence rails, long chat histories, many missions

The `aw-skeleton` CSS class is defined in `index.css` but never used as a general loading pattern. No skeleton screens, no loading spinners, no progress indicators exist anywhere in the component tree.

---

## 3. Error States

### 3.1 Mission Not Found

**Rating**: Y (with structural inconsistency)

Mission not found is handled on every mission-scoped page, but with structurally inconsistent patterns:

| Page              | Wraps in PageTransition | Shows TopBar  |        Shows breadcrumbs         |         Has back link         | File:Line                     |
| ----------------- | :---------------------: | :-----------: | :------------------------------: | :---------------------------: | ----------------------------- |
| MissionDetail     |            Y            |       Y       |       Y (Missions > [ID])        |   N (relies on breadcrumbs)   | `MissionDetail.tsx:36-48`     |
| MissionPlan       |            Y            |       Y       |    Y (Missions > [ID] > Plan)    |  Y ("Back to missions" link)  | `MissionPlan.tsx:31-54`       |
| MissionExecute    |            Y            |       Y       |  Y (Missions > [ID] > Execute)   |  Y ("Back to missions" link)  | `MissionExecute.tsx:36-59`    |
| MissionReview     |            Y            |       Y       |   Y (Missions > [ID] > Review)   |  Y ("Back to missions" link)  | `MissionReview.tsx:31-54`     |
| MissionEscalation |            Y            |       Y       | Y (Missions > [ID] > Escalation) |  Y ("Back to missions" link)  | `MissionEscalation.tsx:27-50` |
| LiveView          |  N (no PageTransition)  | N (no TopBar) |        N (no breadcrumbs)        | Y ("Return to Missions" link) | `LiveView.tsx:147-167`        |

**Structural note**: All in-shell pages (Detail, Plan, Execute, Review, Escalation) now properly wrap their not-found states in `PageTransition` and show `TopBar` with breadcrumbs. LiveView's not-found state is fullscreen without any shell (deliberate -- LiveView is always outside AppShell).

### 3.2 Global 404 Not Found

**File**: `App.tsx:24-43`
**Rating**: Y

```tsx
function NotFound() {
  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Not Found' }]} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <EmptyState
          icon={AlertCircle}
          title="Page not found"
          description="The URL you followed doesn't exist in Mission Control."
        />
        <Link to="/missions" className="...">
          Go to Missions
        </Link>
      </div>
    </PageTransition>
  );
}
```

Properly handled. Uses `EmptyState` component (one of only two places it is used), renders inside AppShell with TopBar, provides a clear "Go to Missions" link. The catch-all route is at `App.tsx:89`: `{ path: '*', element: <NotFound /> }`.

### 3.3 LiveView: No Error Recovery

**File**: `LiveView.tsx:136-145, 193-202`
**Rating**: N

When workspace data is missing or incomplete, LiveView constructs an `effectiveWorkspace` with empty fallbacks (line 136-145) and renders `WorkspaceLayout` with whatever data is available (line 194-201). There is:

- No error message for missing workspace
- No "retry" button
- No "reconnect" affordance for when a backend is introduced
- No indication that data is incomplete or stale
- No fallback UI when `WorkspaceLayout` renders empty quadrants

The grid layout (`WorkspaceLayout.tsx:47-77`) rigidly maintains its 3-column, 2-row structure (`gridTemplateColumns: '200px 1fr 380px'`, `gridTemplateRows: '1fr 280px'`) regardless of whether data exists for each quadrant. Empty quadrants are blank rectangles.

### 3.4 Network Error Handling

**Rating**: N (not applicable to prototype, critical for production)

No network error handling exists anywhere in the codebase. This is expected for a static data prototype. However, no patterns or placeholders are in place for:

- API request failures (4xx, 5xx responses)
- Network timeout
- Connection loss (offline detection)
- WebSocket disconnection (agent chat, terminal, browser preview)
- Rate limiting (429 responses)
- Authentication failures (401, 403)

### 3.5 ErrorBoundary

**File**: `AppShell.tsx:85`, `ErrorBoundary.tsx:1-79`
**Rating**: Y

```tsx
<ErrorBoundary resetKey={location.pathname}>
  <Outlet />
</ErrorBoundary>
```

The `ErrorBoundary` component (`components/primitives/ErrorBoundary.tsx`) wraps the `Outlet` in AppShell. It:

- Catches render errors via `getDerivedStateFromError` (line 22-24)
- Logs to console via `componentDidCatch` (line 26-28)
- Resets on route change via `componentDidUpdate` comparing `resetKey` (line 30-33)
- Renders an error UI with: AlertTriangle icon, "Something went wrong" message, dev-mode stack trace (line 41-65), and a "Back to Missions" link (line 66-76)

**Coverage gap**: LiveView (`App.tsx:48-49`) is OUTSIDE the AppShell and therefore OUTSIDE the ErrorBoundary. A render error in LiveView will crash to a blank screen with no recovery UI. The LiveView routes have no independent ErrorBoundary.

### 3.6 WorkspaceRedirect

**File**: `WorkspaceRedirect.tsx:1-19`
**Rating**: Y

Handles legacy `/workspace/:id` URLs:

- If workspace found and has a linked mission: redirects to `/missions/:missionId/live` or workflow-scoped equivalent (line 10-14)
- If workspace not found: redirects to `/missions` (line 18)
- Uses `<Navigate replace />` for clean URL history

---

## 4. Permission States

**Rating**: N (no permission model exists)

| Action                          | Permission Required | Current Behavior                                                                            | File:Line                     |
| ------------------------------- | ------------------- | ------------------------------------------------------------------------------------------- | ----------------------------- |
| Create mission                  | Not defined         | Button always visible and functional                                                        | `MissionHome.tsx:105-112`     |
| Approve plan                    | Not defined         | Button visible when `mission.stage === 'plan'`                                              | `MissionPlan.tsx:164`         |
| Approve/Reject/Re-plan (Review) | Not defined         | Approve visually disabled when blockers exist but no actual `disabled` attribute for clicks | `ApprovalBar.tsx:72-87`       |
| Escalation decision             | Not defined         | All options visible to all users                                                            | `ConsequencePanel.tsx:49-153` |
| Enter LiveView                  | Not defined         | Link always visible                                                                         | `MissionExecute.tsx:182-193`  |
| Agent configuration             | Not defined         | Gear icon always visible                                                                    | `MissionExecute.tsx:194-200`  |
| Settings changes                | Not defined         | All toggles accessible                                                                      | Settings page                 |
| View costs                      | Not defined         | Page always accessible                                                                      | CostDashboard                 |

**Assessment**: There is no authentication system, no role model, no ownership-based access control. Critical gaps include:

1. **No auth gating on approve/reject/escalation actions** -- any user can make any decision
2. **No concept of multi-approval** -- the Settings page mentions "High-risk missions require 2 approvals" as a policy text, but the Review page has a single Approve button
3. **No ownership enforcement** -- mission owner field exists (`missions.ts:12`) but is display-only
4. **No risk-tier-based access control** -- high-risk missions are visually distinguished (RiskBadge) but not permission-gated

### ApprovalBar Approve Button: Visually Disabled But Clickable

**File**: `ApprovalBar.tsx:72-87`

```tsx
<motion.button
  style={{
    backgroundColor: canApprove ? semantic.success : aw.lineDark,
    color: aw.inverse,
    opacity: canApprove ? 1 : 0.5,
    cursor: canApprove ? 'pointer' : 'not-allowed',
  }}
  disabled={!canApprove}
  onClick={() => canApprove && onAction?.('approve')}
>
```

The button IS properly `disabled` via the HTML `disabled` attribute (line 80). It also has defensive `canApprove && ...` guard in the onClick handler (line 83). The visual styling (opacity 0.5, cursor not-allowed) correctly communicates the disabled state. The `canApprove` condition checks both `blockerCount === 0` and `mission.verificationState === 'passing'` (line 17).

**Assessment**: The ApprovalBar's conditional enable/disable is well-implemented. The gap is that it is the ONLY action in the system with conditional enablement. MissionPlan's Approve button has no equivalent guard.

---

## 5. Offline Handling

**Rating**: N (no offline capabilities)

| Aspect                   | Status | Notes                                                                   |
| ------------------------ | ------ | ----------------------------------------------------------------------- |
| Offline detection        | N      | No `navigator.onLine` check, no `online`/`offline` event listeners      |
| Service worker           | N      | No service worker registered                                            |
| Cache strategy           | N      | No caching of static assets beyond default browser behavior             |
| Offline banner/indicator | N      | No UI indication of connection status                                   |
| Offline queue            | N      | No queuing of actions for later sync                                    |
| Local data persistence   | N      | All state is in-memory React `useState`. Page refresh loses everything. |

**Assessment**: This is expected for a prototype with no backend. However, the design surface includes no patterns or placeholder components that indicate how offline scenarios would be handled in production. No connection status indicator exists in the LiveView header, TopBar, or LeftNav bottom status bar.

---

## 6. Edge Cases

### 6.1 Completed Mission with No Artifacts

**Files**: `ActivityPreview.tsx:153-159`, `ArtifactPanel.tsx:23`
**Rating**: ~ (partial)

When a completed mission has no `artifactIds` or an empty array:

1. `ActivityPreview.tsx:153-159`:

   ```tsx
   {
     isCompleted &&
       (() => {
         const missionArtifacts = artifacts.filter((a) => a.missionId === mission.id);
         return missionArtifacts.length > 0 ? <ArtifactPanel artifacts={missionArtifacts} /> : null;
       })();
   }
   ```

   If no artifacts match, `ArtifactPanel` is not rendered and `null` is returned. No "No deliverables produced" message is shown.

2. `ArtifactPanel.tsx:23`: `if (artifacts.length === 0) return null;` -- additional guard, also returns nothing.

**Impact**: A completed mission without artifacts shows no indication that deliverables were expected but are absent. The RESULT PREVIEW section (ActivityPreview) would still show browser sessions, terminal sessions, and code viewer (if they exist), but the ARTIFACTS subsection simply does not appear.

### 6.2 Mission with escalationActive but No Escalation Items

**Files**: `MissionEscalation.tsx:53-55, 57-86`, `missions.ts:159`
**Rating**: Y

```tsx
const mEscalations = escalations.filter((e) => e.missionId === mission.id);
const selectedEscalation = mEscalations[selectedEscIdx] ?? mEscalations[0];

if (!selectedEscalation) {
  // ...renders "No escalations for this mission." with TopBar and StageTabBar
}
```

If a mission has `escalationActive: true` but no actual escalation records in the escalation data, the MissionEscalation page shows "No escalations for this mission." with full navigation preserved. This is correctly handled.

**However**: The LeftNav counts this mission as needing review (`LeftNav.tsx:19-21` checks `stage === 'review' || stage === 'escalation'`). If the mission's stage is not `escalation` but `escalationActive` is true, the LeftNav count does not reflect the escalation overlay -- it only counts stage-based review. The MissionSwitcherDropdown does show the warning icon for `escalationActive` (`MissionSwitcherDropdown.tsx:230-233`).

### 6.3 WorkspaceRedirect: Legacy Path Handling

**File**: `WorkspaceRedirect.tsx:1-19`
**Rating**: Y

```tsx
export function WorkspaceRedirect() {
  const { id } = useParams<{ id: string }>();
  const workspace = workspaces.find((ws) => ws.id === id);

  if (workspace) {
    const mission = missions.find((m) => m.id === workspace.missionId);
    const to = mission?.workflowId
      ? `/workflows/${mission.workflowId}/missions/${workspace.missionId}/live`
      : `/missions/${workspace.missionId}/live`;
    return <Navigate to={to} replace />;
  }

  return <Navigate to="/missions" replace />;
}
```

Handles both cases:

- Valid workspace ID: redirects to workflow-contexted or direct LiveView URL
- Invalid workspace ID: redirects to `/missions` (safe fallback)
- Uses `replace` navigation to keep URL history clean

### 6.4 LiveView Esc Key Conflicts

**File**: `LiveView.tsx:105-113`
**Rating**: ~ (potential issue)

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      void navigate(liveBackTo);
    }
  };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, [navigate, liveBackTo]);
```

The Esc handler uses `document.addEventListener` which captures ALL Esc key presses. If any overlay, dropdown, or modal were ever added to LiveView, pressing Esc would navigate away from LiveView instead of closing the overlay. There is no `e.stopPropagation()` and no check for whether an overlay is open.

Currently, this is not a problem because LiveView has no overlays. But it is a latent issue.

### 6.5 ConsequencePanel Module-Level State Persistence

**File**: `ConsequencePanel.tsx:17`
**Rating**: ~ (clever but fragile)

```tsx
const decisionStore = new Map<string, { optionId: string; confirmedAt: string }>();
```

Escalation decisions are persisted in a module-level `Map` that survives component re-mounts (e.g., navigating away and back). This is better than pure `useState` but:

- Lost on page refresh (full page reload)
- Lost on hot module replacement during development
- Not synced to any backend
- The `panelKey` (`ConsequencePanel.tsx:27`) is derived from option IDs, which means if escalation options change, the decision is orphaned

### 6.6 StageTabBar Always Shows All Tabs

**File**: `StageTabBar.tsx:4-10`
**Rating**: ~ (design concern)

```tsx
const stages = [
  { key: 'overview', label: 'OVERVIEW', suffix: '' },
  { key: 'plan', label: 'PLAN', suffix: '/plan' },
  { key: 'execute', label: 'EXECUTE', suffix: '/execute' },
  { key: 'review', label: 'REVIEW', suffix: '/review' },
  { key: 'escalation', label: 'ESCALATION', suffix: '/escalation' },
] as const;
```

The tab bar always renders all 5 tabs regardless of the mission's current stage. A plan-stage mission shows PLAN, EXECUTE, REVIEW, and ESCALATION tabs, but the Execute, Review, and Escalation pages will show largely empty content since the mission has not reached those stages. There is no visual indication of which tabs are "available" or "active" for the current mission state.

### 6.7 MissionSwitcher Only Available on Mission Pages

**File**: `TopBar.tsx:49`
**Rating**: ~ (design limitation)

```tsx
{missionId && (
  <>
    <button ref={switcherButtonRef} ...>
```

The MissionSwitcherDropdown button only renders when `missionId` is truthy. Pages that do not pass `missionId` to TopBar:

- MissionHome (`MissionHome.tsx:98`)
- Workflows, WorkflowDetail
- CostDashboard, History, Settings
- MissionCreate

The Cmd+Shift+M keyboard shortcut (`AppShell.tsx:46-48`) dispatches the `mc:toggle-mission-switcher` event, but TopBar's listener (`TopBar.tsx:36-41`) only toggles the switcher when `missionId` exists. On non-mission pages, the shortcut silently does nothing.

---

## 7. Gap Severity Table

### State x Severity Matrix

| State Category          | Properly Handled (Y) |     Partially Handled (~)      |     Not Handled (N)     | Critical Gaps                                                                      |
| ----------------------- | :------------------: | :----------------------------: | :---------------------: | ---------------------------------------------------------------------------------- |
| **Empty states**        |          7           |               5                |            6            | Completed stage untested; WorkspaceLayout empty quadrants; hidden sessions section |
| **Loading states**      |          0           |               0                | All (N/A for prototype) | No loading patterns designed; no skeleton screens; no timeouts                     |
| **Error: not found**    |          6           |               0                |            0            | All mission pages handle not-found. LiveView handles its own.                      |
| **Error: 404**          |          1           |               0                |            0            | Global 404 well-handled.                                                           |
| **Error: render crash** |     1 (AppShell)     |               0                |      1 (LiveView)       | LiveView has no ErrorBoundary                                                      |
| **Error: network**      |          0           |               0                |           All           | No network error patterns exist                                                    |
| **Permissions**         |          0           | 1 (ApprovalBar disabled state) |            7            | No auth model, no role-based access                                                |
| **Offline**             |          0           |               0                |           All           | No offline detection or handling                                                   |
| **Edge cases**          |          3           |               4                |            1            | Esc key conflict potential; completed stage untested                               |

### Severity-Ranked Gap List

| Rank | Gap                                                   | Severity            | Impact                                                                                     | File(s)                                                                    |
| ---- | ----------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 1    | **Completed stage never exercised**                   | CRITICAL            | Entire completed flow is untested: artifact display, post-completion summary, empty states | `missions.ts` (0 completed), `ActivityPreview.tsx:47`, `ArtifactPanel.tsx` |
| 2    | **LiveView has no ErrorBoundary**                     | CRITICAL            | Render error in LiveView crashes to blank screen with no recovery                          | `App.tsx:48-49` (outside AppShell)                                         |
| 3    | **No network error handling patterns**                | HIGH (production)   | When backend is added, no error display patterns exist to follow                           | All pages                                                                  |
| 4    | **No permission model**                               | HIGH (production)   | All actions available to all users; no auth gating                                         | All action components                                                      |
| 5    | **No offline handling**                               | MEDIUM (production) | No connection status indicator; no degraded mode                                           | Global                                                                     |
| 6    | **WorkspaceLayout empty quadrants show nothing**      | MEDIUM              | User sees blank rectangles in LiveView                                                     | `WorkspaceLayout.tsx:68, 71`                                               |
| 7    | **Completed mission with no artifacts shows nothing** | MEDIUM              | Silent absence of expected deliverables                                                    | `ActivityPreview.tsx:153-159`                                              |
| 8    | **MissionExecute hides sessions section silently**    | LOW                 | User does not know browser/terminal sessions are a capability                              | `MissionExecute.tsx:315`                                                   |
| 9    | **StageTabBar shows all tabs regardless of stage**    | LOW                 | Misleading navigation to empty stage pages                                                 | `StageTabBar.tsx:4-10`                                                     |
| 10   | **LiveView Esc key not guarded against overlays**     | LOW (latent)        | Would cause navigation on Esc instead of overlay close                                     | `LiveView.tsx:105-113`                                                     |

---

## 8. Error State Inventory by Page

### MissionHome

| State                           | Handled | Treatment                                                               | File:Line                 |
| ------------------------------- | ------- | ----------------------------------------------------------------------- | ------------------------- |
| Zero missions (no data)         | ~       | Same "No missions match filters" message (misleading)                   | `MissionHome.tsx:192-198` |
| Filter yields no results        | Y       | EmptyState with SearchX icon and guidance text                          | `MissionHome.tsx:192-198` |
| FocusPanel with stale selection | ~       | FocusPanel shows last selected mission even when filtered list is empty | `MissionHome.tsx:90`      |

### MissionDetail

| State                    | Handled | Treatment                                              | File:Line                   |
| ------------------------ | ------- | ------------------------------------------------------ | --------------------------- |
| Mission not found        | Y       | PageTransition + TopBar + centered "Mission not found" | `MissionDetail.tsx:36-48`   |
| Zero agent sessions      | ~       | Shows "0 sessions" text, no guidance                   | `MissionDetail.tsx:198`     |
| Zero evidence            | ~       | Shows "0 PASS / 0 FAIL / 0 WARN"                       | `MissionDetail.tsx:210-218` |
| Zero escalations         | Y       | Section conditionally hidden                           | `MissionDetail.tsx:223`     |
| Zero acceptance criteria | N       | Empty `<ul>` rendered                                  | `MissionDetail.tsx:154-167` |
| Zero risks               | N       | Empty `<div>` under heading                            | `MissionDetail.tsx:176-185` |

### MissionPlan

| State                               | Handled | Treatment                                                               | File:Line                 |
| ----------------------------------- | ------- | ----------------------------------------------------------------------- | ------------------------- |
| Mission not found                   | Y       | PageTransition + TopBar + "Mission not found" + back link               | `MissionPlan.tsx:31-54`   |
| No evidence                         | Y       | "No evidence gathered yet. Evidence will appear once execution begins." | `MissionPlan.tsx:200-207` |
| Non-plan stage (no approve buttons) | Y       | Approval section conditionally hidden with `mission.stage === 'plan'`   | `MissionPlan.tsx:164`     |

### MissionExecute

| State                        | Handled | Treatment                                                 | File:Line                    |
| ---------------------------- | ------- | --------------------------------------------------------- | ---------------------------- |
| Mission not found            | Y       | PageTransition + TopBar + "Mission not found" + back link | `MissionExecute.tsx:36-59`   |
| No agent sessions (log pane) | Y       | "No agent activity yet" text                              | `MissionExecute.tsx:265-268` |
| No agent sessions (swimlane) | N       | Empty container, no message                               | `MissionExecute.tsx:208-217` |
| No code files                | ~       | "No code files" text                                      | `MissionExecute.tsx:287-291` |
| No browser/terminal sessions | N       | SESSIONS section silently hidden                          | `MissionExecute.tsx:315`     |

### MissionReview

| State                 | Handled | Treatment                                                 | File:Line                 |
| --------------------- | ------- | --------------------------------------------------------- | ------------------------- |
| Mission not found     | Y       | PageTransition + TopBar + "Mission not found" + back link | `MissionReview.tsx:31-54` |
| Zero evidence (rail)  | N       | EvidenceRail renders but may show empty                   | `MissionReview.tsx:143`   |
| Blockers vs. warnings | Y       | ApprovalBar distinguishes blocker count and warning count | `ApprovalBar.tsx:36-42`   |

### MissionEscalation

| State                | Handled | Treatment                                                 | File:Line                       |
| -------------------- | ------- | --------------------------------------------------------- | ------------------------------- |
| Mission not found    | Y       | PageTransition + TopBar + "Mission not found" + back link | `MissionEscalation.tsx:27-50`   |
| No escalations       | Y       | "No escalations for this mission." with full navigation   | `MissionEscalation.tsx:57-86`   |
| Multiple escalations | Y       | Escalation selector shown below ReplayTimeline            | `MissionEscalation.tsx:148-184` |

### LiveView

| State                           | Handled | Treatment                                                       | File:Line                    |
| ------------------------------- | ------- | --------------------------------------------------------------- | ---------------------------- |
| Mission not found               | Y       | Fullscreen centered with "Mission not found" + ID + return link | `LiveView.tsx:147-167`       |
| No workspace data               | ~       | Constructs effectiveWorkspace with empty defaults               | `LiveView.tsx:136-145`       |
| Empty WorkspaceLayout quadrants | N       | Blank rectangles, no messages                                   | `WorkspaceLayout.tsx:68, 71` |
| Render error                    | N       | No ErrorBoundary wrapping LiveView                              | `App.tsx:48-49`              |
| No error recovery               | N       | No retry, reconnect, or error state UI                          | --                           |

---

## 9. Structural Recommendations

### 9.1 Add ErrorBoundary to LiveView

The most critical missing error path. LiveView routes (`App.tsx:48-49`) are outside the AppShell's ErrorBoundary. Wrap the LiveView element:

```tsx
// App.tsx, lines 48-49
{ path: 'missions/:missionId/live', element: <ErrorBoundary><LiveView /></ErrorBoundary> },
{ path: 'workflows/:workflowId/missions/:missionId/live', element: <ErrorBoundary><LiveView /></ErrorBoundary> },
```

Or create a `LiveViewShell` wrapper that provides its own ErrorBoundary with LiveView-appropriate error UI.

### 9.2 Add Completed Mission to Mock Data

Add at least one mission with `stage: 'completed'` to `missions.ts` to exercise:

- ActivityPreview with `isCompleted = true` and artifacts
- FocusPanel routing to overview
- MissionHome filter for completed
- ArtifactPanel rendering (gallery + viewer)
- Post-completion summary (completed summary bar in ActivityPreview)

### 9.3 Add Empty State Messages to WorkspaceLayout Quadrants

Replace `null` returns in `WorkspaceLayout.tsx:68, 71` with placeholder UI:

```tsx
// WorkspaceLayout.tsx:68
{
  browserSession ? (
    <BrowserPreview session={browserSession} />
  ) : (
    <div className="flex h-full items-center justify-center" style={{ color: aw.textSoft }}>
      <span className="aw-body-sm">No browser session active</span>
    </div>
  );
}
```

### 9.4 Design Loading State Patterns

Before connecting to a real backend, design and document:

1. **Skeleton screens** for data-heavy views (MissionHome, CostDashboard, evidence rails)
2. **Inline spinners** for short operations (approve, create, launch)
3. **Connection indicators** for real-time views (LiveView, AgentChatPanel)
4. **Timeout handling** with user-visible retry affordances

### 9.5 Design Permission Error States

Before implementing auth, design:

1. **Disabled button states** with tooltip explaining why (e.g., "You need reviewer role to approve")
2. **Hidden vs. disabled** decision: should unauthorized actions be invisible or visible-but-disabled?
3. **401/403 response handling**: global redirect to login vs. inline error message

---

## 10. Summary Statistics

| Category                | Total States Audited |      Y       |      ~       |      N       |
| ----------------------- | -------------------: | :----------: | :----------: | :----------: |
| Empty states            |                   18 |   7 (39%)    |   5 (28%)    |   6 (33%)    |
| Loading states          |                    7 |      0       |      0       |  7 (100%)\*  |
| Error: entity not found |                    7 |   7 (100%)   |      0       |      0       |
| Error: 404 global       |                    1 |   1 (100%)   |      0       |      0       |
| Error: render crash     |                    2 |   1 (50%)    |      0       |   1 (50%)    |
| Error: network          |                    5 |      0       |      0       |  5 (100%)\*  |
| Permissions             |                    8 |      0       |   1 (12%)    |   7 (88%)    |
| Offline                 |                    4 |      0       |      0       |  4 (100%)\*  |
| Edge cases              |                    8 |   3 (38%)    |   4 (50%)    |   1 (12%)    |
| **TOTAL**               |               **60** | **19 (32%)** | **10 (17%)** | **31 (52%)** |

\* Marked as N but N/A for a static prototype. These become critical when a backend is introduced.

### Verdict

The prototype handles **entity not found states well** (100% coverage across all pages) and has a **solid global 404 page**. The **ErrorBoundary in AppShell** is correctly implemented.

The primary gaps are:

1. **Completed stage is entirely untested** (0 completed missions in data)
2. **LiveView lacks ErrorBoundary protection** (outside AppShell)
3. **Empty states are inconsistently handled** (33% missing)
4. **No loading, network, permission, or offline patterns exist** (expected for prototype but must be designed before production)

The most impactful quick fix is adding a completed mission to mock data. The most impactful structural fix is wrapping LiveView in an ErrorBoundary.
