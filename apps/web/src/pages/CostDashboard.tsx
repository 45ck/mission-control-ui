import { agentSessions } from '../data/agent-sessions';
import { missions } from '../data/missions';
import { workflows } from '../data/workflows';
import { aw, semantic } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { PageTransition } from '../components/shell/PageTransition';
import { CornerBracket } from '../components/primitives/CornerBracket';

interface MissionCostGroup {
  missionId: string;
  missionTitle: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCost: number;
}

interface ModelGroup {
  model: string;
  totalCost: number;
  totalTokens: number;
}

interface WorkflowGroup {
  workflowId: string;
  workflowTitle: string;
  totalCost: number;
  totalTokens: number;
}

function groupByMission(): MissionCostGroup[] {
  const groups: Record<string, MissionCostGroup> = {};

  for (const session of agentSessions) {
    if (!groups[session.missionId]) {
      const mission = missions.find((m) => m.id === session.missionId);
      groups[session.missionId] = {
        missionId: session.missionId,
        missionTitle: mission?.title ?? 'Unknown Mission',
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        totalCost: 0,
      };
    }
    const g = groups[session.missionId]!;
    const tokens = session.tokensUsed;
    if (tokens) {
      g.inputTokens += tokens.input;
      g.outputTokens += tokens.output;
      g.totalTokens += tokens.total;
    }
    g.totalCost += session.estimatedCost ?? 0;
  }

  return Object.values(groups).sort((a, b) => b.totalTokens - a.totalTokens);
}

function groupByModel(): ModelGroup[] {
  const groups: Record<string, ModelGroup> = {};

  for (const session of agentSessions) {
    groups[session.model] ??= {
      model: session.model,
      totalCost: 0,
      totalTokens: 0,
    };
    const g = groups[session.model]!;
    g.totalCost += session.estimatedCost ?? 0;
    g.totalTokens += session.tokensUsed?.total ?? 0;
  }

  return Object.values(groups).sort((a, b) => b.totalCost - a.totalCost);
}

function groupByWorkflow(): WorkflowGroup[] {
  return workflows.map((wf) => {
    let totalCost = 0;
    let totalTokens = 0;

    for (const missionId of wf.missionIds) {
      for (const session of agentSessions) {
        if (session.missionId === missionId) {
          totalCost += session.estimatedCost ?? 0;
          totalTokens += session.tokensUsed?.total ?? 0;
        }
      }
    }

    return {
      workflowId: wf.id,
      workflowTitle: wf.title,
      totalCost,
      totalTokens,
    };
  });
}

const BAR_VIEW_WIDTH = 400;
const BAR_HEIGHT = 20;

export function CostDashboard() {
  const missionGroups = groupByMission();
  const modelGroups = groupByModel();
  const workflowGroups = groupByWorkflow();

  const maxMissionTokens = Math.max(...missionGroups.map((g) => g.totalTokens), 1);
  const maxModelCost = Math.max(...modelGroups.map((g) => g.totalCost), 0.01);

  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Costs' }]} />

      <div className="flex-1 overflow-y-auto p-6 pb-16">
        <div className="mx-auto max-w-3xl space-y-5">
          {/* 1. Per-mission token usage bars */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              TOKEN USAGE BY MISSION
            </div>
            <div className="mt-3 space-y-4">
              {missionGroups.map((g) => {
                const inputWidth = (g.inputTokens / maxMissionTokens) * BAR_VIEW_WIDTH;
                const outputWidth = (g.outputTokens / maxMissionTokens) * BAR_VIEW_WIDTH;
                return (
                  <div key={g.missionId}>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="aw-micro" style={{ color: aw.textSoft }}>
                          {g.missionId}
                        </span>
                        <span className="aw-section-sm ml-2" style={{ color: aw.textStrong }}>
                          {g.missionTitle}
                        </span>
                      </div>
                      <span className="aw-micro" style={{ color: aw.textSoft }}>
                        {g.totalTokens.toLocaleString()} tokens
                      </span>
                    </div>
                    <svg
                      viewBox={`0 0 ${BAR_VIEW_WIDTH} ${BAR_HEIGHT + 8}`}
                      className="mt-1 w-full"
                      style={{ maxWidth: BAR_VIEW_WIDTH }}
                    >
                      <rect
                        x={0}
                        y={4}
                        width={Math.max(inputWidth, 1)}
                        height={BAR_HEIGHT}
                        fill={semantic.info}
                        rx={1}
                      />
                      <rect
                        x={inputWidth}
                        y={4}
                        width={Math.max(outputWidth, 1)}
                        height={BAR_HEIGHT}
                        fill={aw.accent}
                        rx={1}
                      />
                    </svg>
                    <div className="mt-1 flex gap-4">
                      <span className="aw-micro" style={{ color: semantic.info }}>
                        INPUT: {g.inputTokens.toLocaleString()}
                      </span>
                      <span className="aw-micro" style={{ color: aw.accent }}>
                        OUTPUT: {g.outputTokens.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Per-model cost comparison (SVG bars) */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              COST BY MODEL
            </div>
            <div className="mt-3 space-y-4">
              {modelGroups.map((g) => {
                const barWidth = (g.totalCost / maxModelCost) * BAR_VIEW_WIDTH;
                return (
                  <div key={g.model}>
                    <div className="flex items-baseline justify-between">
                      <div className="aw-section-sm" style={{ color: aw.textStrong }}>
                        {g.model}
                      </div>
                      <span className="aw-micro" style={{ color: aw.textSoft }}>
                        ${g.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <svg
                      viewBox={`0 0 ${BAR_VIEW_WIDTH} ${BAR_HEIGHT + 8}`}
                      className="mt-1 w-full"
                      style={{ maxWidth: BAR_VIEW_WIDTH }}
                    >
                      <rect
                        x={0}
                        y={4}
                        width={Math.max(barWidth, 1)}
                        height={BAR_HEIGHT}
                        fill={aw.plate}
                        rx={1}
                      />
                    </svg>
                    <div className="aw-micro mt-1" style={{ color: aw.textSoft }}>
                      {g.totalTokens.toLocaleString()} TOKENS
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Workflow-level aggregation (summary cards) */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              COST BY WORKFLOW
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workflowGroups.map((g) => (
                <div
                  key={g.workflowId}
                  className="relative border p-4"
                  style={{ borderColor: aw.lineDark }}
                >
                  <CornerBracket side="left" size="sm" />
                  <CornerBracket side="right" size="sm" />
                  <div className="aw-section-sm" style={{ color: aw.textStrong }}>
                    {g.workflowTitle}
                  </div>
                  <div className="aw-micro mt-1" style={{ color: aw.textSoft }}>
                    {g.workflowId}
                  </div>
                  <div className="mt-3 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
                    <div className="aw-subdisplay" style={{ color: aw.textStrong }}>
                      ${g.totalCost.toFixed(2)}
                    </div>
                    <div className="aw-micro mt-1" style={{ color: aw.textSoft }}>
                      {g.totalTokens.toLocaleString()} TOKENS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
