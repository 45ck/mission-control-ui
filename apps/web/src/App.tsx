import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AppShell } from './components/shell/AppShell';
import { MissionHome } from './pages/MissionHome';
import { MissionPlan } from './pages/MissionPlan';
import { MissionExecute } from './pages/MissionExecute';
import { MissionReview } from './pages/MissionReview';
import { MissionEscalation } from './pages/MissionEscalation';
import { Workflows } from './pages/Workflows';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/missions" replace />} />
          <Route path="missions" element={<MissionHome />} />
          <Route path="missions/:id/plan" element={<MissionPlan />} />
          <Route path="missions/:id/execute" element={<MissionExecute />} />
          <Route path="missions/:id/review" element={<MissionReview />} />
          <Route path="missions/:id/escalation" element={<MissionEscalation />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
