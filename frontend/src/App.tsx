import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UnitSelection from './pages/UnitSelection';
import ConceptLearning from './pages/ConceptLearning';
import ProblemSolving from './pages/ProblemSolving';
import WrongAnswers from './pages/WrongAnswers';
import Achievements from './pages/Achievements';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="units" element={<UnitSelection />} />
          <Route path="units/:unitId/concepts/:conceptId" element={<ConceptLearning />} />
          <Route path="problems/:unitId" element={<ProblemSolving />} />
          <Route path="wrong-answers" element={<WrongAnswers />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
