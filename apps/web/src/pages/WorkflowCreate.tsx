import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useBlocker } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, X, ListChecks } from 'lucide-react';
import { missions as allMissions } from '../data/missions';
import type { Mission } from '../data/missions';
import { aw, semantic, transitions } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { PageTransition } from '../components/shell/PageTransition';
import { PanelPins } from '../components/primitives/PanelPins';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { RuleLabel } from '../components/primitives/RuleLabel';
import { EmptyState } from '../components/primitives/EmptyState';

/* ------------------------------------------------------------------ */
/*  Sub-component: Mission selector (checkbox list)                    */
/* ------------------------------------------------------------------ */
function MissionSelector({
  missions,
  selectedIds,
  onToggle,
}: {
  missions: Mission[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mt-2 space-y-1.5">
      {missions.map((m) => {
        const checked = selectedIds.includes(m.id);
        return (
          <label
            key={m.id}
            className="flex cursor-pointer items-center gap-2 border p-2.5 transition-colors hover:bg-[var(--color-aw-haze)]"
            style={{
              borderColor: checked ? aw.accent : aw.lineFaint,
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(m.id)}
              className="accent-current"
              style={{ accentColor: aw.accent }}
            />
            <span className="aw-micro" style={{ color: aw.textSoft }}>
              {m.id}
            </span>
            <span className="aw-section-sm flex-1" style={{ color: aw.textStrong }}>
              {m.title}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Ordered mission list (visual only, with grip+remove)*/
/* ------------------------------------------------------------------ */
function OrderedMissionList({
  missions,
  onRemove,
}: {
  missions: Mission[];
  onRemove: (id: string) => void;
}) {
  if (missions.length === 0) {
    return (
      <div className="mt-2">
        <EmptyState
          icon={ListChecks}
          title="No missions selected"
          description="Select missions above to add them to this workflow."
        />
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      {missions.map((m, i) => (
        <div
          key={m.id}
          className="flex items-center gap-2 border px-3 py-2"
          style={{ borderColor: aw.lineFaint }}
        >
          <GripVertical className="h-4 w-4 shrink-0" style={{ color: aw.textSoft }} />
          <span className="aw-micro w-5 text-right" style={{ color: aw.textSoft }}>
            {i + 1}.
          </span>
          <span className="aw-section-sm flex-1" style={{ color: aw.textStrong }}>
            {m.title}
          </span>
          <button
            className="aw-focus-ring shrink-0 p-0.5 transition-colors"
            onClick={() => onRemove(m.id)}
          >
            <X className="h-3.5 w-3.5" style={{ color: aw.textSoft }} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Preview panel (right column)                        */
/* ------------------------------------------------------------------ */
function WorkflowPreview({
  title,
  description,
  owner,
  missionCount,
}: {
  title: string;
  description: string;
  owner: string;
  missionCount: number;
}) {
  return (
    <div className="relative border p-6" style={{ borderColor: aw.lineDark }}>
      <CornerBracket side="left" />
      <CornerBracket side="right" />
      <div className="flex items-center gap-3">
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          WF-NEW
        </span>
        <RuleLabel accent>ACTIVE</RuleLabel>
      </div>
      <div className="aw-section-lg mt-2" style={{ color: aw.textStrong }}>
        {title || 'Untitled Workflow'}
      </div>
      <div className="aw-body mt-2" style={{ color: aw.text }}>
        {description || 'No description'}
      </div>
      <div className="aw-micro mt-2" style={{ color: aw.textSoft }}>
        Owner: {owner || 'Unassigned'}
      </div>
      <div className="aw-micro mt-2" style={{ color: aw.textSoft }}>
        {missionCount} mission{missionCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */
export function WorkflowCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [selectedMissionIds, setSelectedMissionIds] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const isDirty =
    title !== '' || description !== '' || owner !== '' || selectedMissionIds.length > 0;

  const blocker = useBlocker(isDirty && !submitted);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const leave = window.confirm('You have unsaved changes. Leave anyway?');
      if (leave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!isDirty || submitted) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, submitted]);

  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
  }, []);

  const toggleMission = useCallback((id: string) => {
    setSelectedMissionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const removeMission = useCallback((id: string) => {
    setSelectedMissionIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const selectedMissions = allMissions.filter((m) => selectedMissionIds.includes(m.id));

  function handleCreate() {
    const newErrors: { title?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitted(true);
    setShowToast(true);
    setTimeout(() => {
      void navigate('/workflows');
    }, 1200);
  }

  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Workflows', to: '/workflows' }, { label: 'Create' }]} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left column: form */}
        <div className="w-[60%] overflow-y-auto p-6 pb-16">
          <div className="space-y-5">
            <FormFieldTitle
              value={title}
              onChange={handleTitleChange}
              error={errors.title}
              onClearError={() => setErrors((prev) => ({ ...prev, title: undefined }))}
            />
            <FormFieldDescription value={description} onChange={setDescription} />
            <FormFieldOwner value={owner} onChange={setOwner} />

            {/* Mission selector */}
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label className="aw-micro" style={{ color: aw.textSoft }}>
                SELECT MISSIONS
              </label>
              <MissionSelector
                missions={allMissions}
                selectedIds={selectedMissionIds}
                onToggle={toggleMission}
              />
            </div>

            {/* Ordered mission list */}
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label className="aw-micro" style={{ color: aw.textSoft }}>
                MISSION ORDER ({selectedMissions.length})
              </label>
              <OrderedMissionList missions={selectedMissions} onRemove={removeMission} />
            </div>

            {/* Create button */}
            <div className="relative">
              <button
                onClick={handleCreate}
                className="aw-section aw-focus-ring w-full px-4 py-2.5 transition-colors"
                style={{ backgroundColor: aw.accent, color: aw.inverse }}
              >
                CREATE WORKFLOW
              </button>

              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={transitions.normal}
                    className="aw-body mt-3 border px-4 py-3 text-center"
                    style={{
                      borderColor: aw.lineDark,
                      backgroundColor: aw.haze,
                      color: aw.textStrong,
                    }}
                  >
                    Workflow created successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right column: preview */}
        <div className="w-[40%] overflow-y-auto border-l p-6" style={{ borderColor: aw.line }}>
          <div className="aw-micro mb-4" style={{ color: aw.textSoft }}>
            PREVIEW
          </div>
          <WorkflowPreview
            title={title}
            description={description}
            owner={owner}
            missionCount={selectedMissions.length}
          />
        </div>
      </div>
    </PageTransition>
  );
}

/* ------------------------------------------------------------------ */
/*  Extracted form fields (to keep main function under 80 lines)       */
/* ------------------------------------------------------------------ */
function FormFieldTitle({
  value,
  onChange,
  error,
  onClearError,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onClearError?: () => void;
}) {
  return (
    <div
      className="relative border p-5"
      style={{ borderColor: error ? semantic.error : aw.lineDark }}
    >
      <PanelPins corners="all" />
      <CornerBracket side="left" />
      <CornerBracket side="right" />
      <label htmlFor="workflow-title" className="aw-micro" style={{ color: aw.textSoft }}>
        TITLE <span style={{ color: semantic.error }}>*</span>
      </label>
      <input
        id="workflow-title"
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (error) onClearError?.();
        }}
        className="aw-section aw-focus-ring mt-2 block w-full border px-3 py-2"
        style={{
          borderColor: error ? semantic.error : aw.lineDark,
          backgroundColor: 'transparent',
          color: aw.textStrong,
        }}
        placeholder="Workflow title"
      />
      {error && (
        <div className="aw-micro mt-1" style={{ color: semantic.error }}>
          {error}
        </div>
      )}
    </div>
  );
}

function FormFieldDescription({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
      <PanelPins />
      <CornerBracket side="left" />
      <CornerBracket side="right" />
      <label htmlFor="workflow-description" className="aw-micro" style={{ color: aw.textSoft }}>
        DESCRIPTION
      </label>
      <textarea
        id="workflow-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="aw-body aw-focus-ring mt-2 block w-full resize-y border px-3 py-2"
        style={{ borderColor: aw.lineDark, backgroundColor: 'transparent', color: aw.text }}
        placeholder="Describe the workflow"
      />
    </div>
  );
}

function FormFieldOwner({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
      <PanelPins />
      <CornerBracket side="left" />
      <CornerBracket side="right" />
      <label htmlFor="workflow-owner" className="aw-micro" style={{ color: aw.textSoft }}>
        OWNER
      </label>
      <input
        id="workflow-owner"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="aw-section aw-focus-ring mt-2 block w-full border px-3 py-2"
        style={{ borderColor: aw.lineDark, backgroundColor: 'transparent', color: aw.textStrong }}
        placeholder="Owner name"
      />
    </div>
  );
}
