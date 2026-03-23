import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useBlocker } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mission, Stage, RiskTier, VerificationState } from '../data/missions';
import { aw, semantic, transitions } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { PageTransition } from '../components/shell/PageTransition';
import { PanelPins } from '../components/primitives/PanelPins';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { MissionCard } from '../components/mission/MissionCard';

export function MissionCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [scopeBoundary, setScopeBoundary] = useState('');
  const [riskTier, setRiskTier] = useState<RiskTier>('low');
  const [owner, setOwner] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>([]);
  const [risks, setRisks] = useState<string[]>([]);
  const [criterionInput, setCriterionInput] = useState('');
  const [riskInput, setRiskInput] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; goal?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const isDirty =
    title !== '' ||
    goal !== '' ||
    scopeBoundary !== '' ||
    owner !== '' ||
    acceptanceCriteria.length > 0 ||
    risks.length > 0;

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

  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const previewMission = useMemo<Mission>(
    () => ({
      id: 'MSN-NEW',
      title: title || 'Untitled Mission',
      goal: goal || 'No goal specified',
      scopeBoundary: scopeBoundary || 'No scope defined',
      risks: risks.filter((r) => r.trim() !== ''),
      acceptanceCriteria: acceptanceCriteria.filter((c) => c.trim() !== ''),
      owner: owner || 'Unassigned',
      stage: 'plan' as Stage,
      riskTier,
      verificationState: 'pending' as VerificationState,
      agentSessionIds: [],
      browserSessionIds: [],
      terminalSessionIds: [],
      evidenceIds: [],
      escalationIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [title, goal, scopeBoundary, risks, acceptanceCriteria, owner, riskTier],
  );

  const addCriterion = useCallback(() => {
    const trimmed = criterionInput.trim();
    if (trimmed) {
      setAcceptanceCriteria((prev) => [...prev, trimmed]);
      setCriterionInput('');
    }
  }, [criterionInput]);

  const removeCriterion = useCallback((index: number) => {
    setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addRisk = useCallback(() => {
    const trimmed = riskInput.trim();
    if (trimmed) {
      setRisks((prev) => [...prev, trimmed]);
      setRiskInput('');
    }
  }, [riskInput]);

  const removeRisk = useCallback((index: number) => {
    setRisks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  function handleCreate() {
    const newErrors: { title?: string; goal?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!goal.trim()) newErrors.goal = 'Goal is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitted(true);
    setShowToast(true);
    navTimerRef.current = setTimeout(() => {
      void navigate('/missions');
    }, 1200);
  }

  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Missions', to: '/missions' }, { label: 'Create' }]} />

      <div className="flex flex-1 overflow-hidden">
        {/* Form */}
        <div className="w-[60%] overflow-y-auto p-6 pb-16">
          <div className="space-y-5">
            {/* Title */}
            <div
              className="relative border p-5"
              style={{ borderColor: errors.title ? semantic.error : aw.lineDark }}
            >
              <PanelPins corners="all" />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label htmlFor="mission-title" className="aw-micro" style={{ color: aw.textSoft }}>
                TITLE <span style={{ color: semantic.error }}>*</span>
              </label>
              <input
                id="mission-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                className="aw-section aw-focus-ring mt-2 block w-full border px-3 py-2"
                style={{
                  borderColor: errors.title ? semantic.error : aw.lineDark,
                  backgroundColor: 'transparent',
                  color: aw.textStrong,
                }}
                placeholder="Mission title"
              />
              {errors.title && (
                <div className="aw-micro mt-1" style={{ color: semantic.error }}>
                  {errors.title}
                </div>
              )}
            </div>

            {/* Goal */}
            <div
              className="relative border p-5"
              style={{ borderColor: errors.goal ? semantic.error : aw.lineDark }}
            >
              <PanelPins />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label htmlFor="mission-goal" className="aw-micro" style={{ color: aw.textSoft }}>
                GOAL <span style={{ color: semantic.error }}>*</span>
              </label>
              <textarea
                id="mission-goal"
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value);
                  if (errors.goal) setErrors((prev) => ({ ...prev, goal: undefined }));
                }}
                rows={3}
                className="aw-body aw-focus-ring mt-2 block w-full resize-y border px-3 py-2"
                style={{
                  borderColor: errors.goal ? semantic.error : aw.lineDark,
                  backgroundColor: 'transparent',
                  color: aw.text,
                }}
                placeholder="Describe the mission goal"
              />
              {errors.goal && (
                <div className="aw-micro mt-1" style={{ color: semantic.error }}>
                  {errors.goal}
                </div>
              )}
            </div>

            {/* Scope Boundary */}
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label htmlFor="mission-scope" className="aw-micro" style={{ color: aw.textSoft }}>
                SCOPE BOUNDARY
              </label>
              <textarea
                id="mission-scope"
                value={scopeBoundary}
                onChange={(e) => setScopeBoundary(e.target.value)}
                rows={3}
                className="aw-body aw-focus-ring mt-2 block w-full resize-y border px-3 py-2"
                style={{
                  borderColor: aw.lineDark,
                  backgroundColor: 'transparent',
                  color: aw.text,
                }}
                placeholder="Define what is in and out of scope"
              />
            </div>

            {/* Risk Tier */}
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label
                htmlFor="mission-risk-tier"
                className="aw-micro"
                style={{ color: aw.textSoft }}
              >
                RISK TIER
              </label>
              <select
                id="mission-risk-tier"
                value={riskTier}
                onChange={(e) => setRiskTier(e.target.value as RiskTier)}
                className="aw-section aw-focus-ring mt-2 block w-full border px-3 py-2"
                style={{
                  borderColor: aw.lineDark,
                  backgroundColor: 'transparent',
                  color: aw.textStrong,
                }}
              >
                <option value="low">LOW</option>
                <option value="medium">MEDIUM</option>
                <option value="high">HIGH</option>
              </select>
            </div>

            {/* Owner */}
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label htmlFor="mission-owner" className="aw-micro" style={{ color: aw.textSoft }}>
                OWNER
              </label>
              <input
                id="mission-owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="aw-section aw-focus-ring mt-2 block w-full border px-3 py-2"
                style={{
                  borderColor: aw.lineDark,
                  backgroundColor: 'transparent',
                  color: aw.textStrong,
                }}
                placeholder="Owner name"
              />
            </div>

            {/* Acceptance Criteria */}
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins corners="all" />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label
                htmlFor="mission-criterion"
                className="aw-micro"
                style={{ color: aw.textSoft }}
              >
                ACCEPTANCE CRITERIA
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="mission-criterion"
                  type="text"
                  value={criterionInput}
                  onChange={(e) => setCriterionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCriterion();
                    }
                  }}
                  className="aw-body aw-focus-ring block flex-1 border px-3 py-2"
                  style={{
                    borderColor: aw.lineDark,
                    backgroundColor: 'transparent',
                    color: aw.text,
                  }}
                  placeholder="Add a criterion..."
                />
                <button
                  onClick={addCriterion}
                  className="aw-micro aw-focus-ring shrink-0 border px-3 py-2 transition-colors"
                  style={{ borderColor: aw.lineDark, color: aw.textSoft }}
                >
                  +
                </button>
              </div>
              {acceptanceCriteria.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {acceptanceCriteria.map((criterion, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border px-3 py-1.5"
                      style={{ borderColor: aw.lineFaint }}
                    >
                      <span className="aw-body flex-1" style={{ color: aw.text }}>
                        {criterion}
                      </span>
                      <button
                        onClick={() => removeCriterion(i)}
                        className="aw-micro aw-focus-ring shrink-0 px-1.5 py-0.5 transition-colors"
                        style={{ color: aw.textSoft }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Identified Risks */}
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins corners="all" />
              <CornerBracket side="left" />
              <CornerBracket side="right" />
              <label htmlFor="mission-risk" className="aw-micro" style={{ color: aw.textSoft }}>
                IDENTIFIED RISKS
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="mission-risk"
                  type="text"
                  value={riskInput}
                  onChange={(e) => setRiskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRisk();
                    }
                  }}
                  className="aw-body aw-focus-ring block flex-1 border px-3 py-2"
                  style={{
                    borderColor: aw.lineDark,
                    backgroundColor: 'transparent',
                    color: aw.text,
                  }}
                  placeholder="Add a risk..."
                />
                <button
                  onClick={addRisk}
                  className="aw-micro aw-focus-ring shrink-0 border px-3 py-2 transition-colors"
                  style={{ borderColor: aw.lineDark, color: aw.textSoft }}
                >
                  +
                </button>
              </div>
              {risks.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {risks.map((risk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border px-3 py-1.5"
                      style={{ borderColor: aw.lineFaint }}
                    >
                      <span className="aw-body flex-1" style={{ color: aw.text }}>
                        {risk}
                      </span>
                      <button
                        onClick={() => removeRisk(i)}
                        className="aw-micro aw-focus-ring shrink-0 px-1.5 py-0.5 transition-colors"
                        style={{ color: aw.textSoft }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create button */}
            <div className="relative">
              <button
                onClick={handleCreate}
                className="aw-section aw-focus-ring w-full px-4 py-2.5 transition-colors"
                style={{ backgroundColor: aw.accent, color: aw.inverse }}
              >
                CREATE MISSION
              </button>

              {/* Success toast */}
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
                    Mission created successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="w-[40%] overflow-y-auto border-l p-6" style={{ borderColor: aw.line }}>
          <div className="aw-micro mb-4" style={{ color: aw.textSoft }}>
            PREVIEW
          </div>
          <MissionCard mission={previewMission} selected={false} onClick={() => undefined} />
        </div>
      </div>
    </PageTransition>
  );
}
