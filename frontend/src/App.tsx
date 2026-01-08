import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UnitSelection from './pages/UnitSelection';
import ConceptLearning from './pages/ConceptLearning';
import ProblemSolving from './pages/ProblemSolving';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="units" element={<UnitSelection />} />
          <Route path="units/:unitId/concepts/:conceptId" element={<ConceptLearning />} />
          <Route path="problems/:unitId" element={<ProblemSolving />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
