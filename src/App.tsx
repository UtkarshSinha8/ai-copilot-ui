import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import AICopilotPage from './pages/AICopilotPage';
import RagChatPage from './pages/RagChatPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import ArchitecturePage from './pages/ArchitecturePage';

// ── Import your existing login page here ──────────────────────────────────────
import LoginPage from './pages/LoginPage';
// ─────────────────────────────────────────────────────────────────────────────

// Simple guard — replace with your existing auth logic / context if you have one
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return Boolean(token);
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard — protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="copilot" element={<AICopilotPage />} />
          <Route path="rag-chat" element={<RagChatPage />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="architecture" element={<ArchitecturePage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;