import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UnitSelection from './pages/UnitSelection';
import AIConceptLearning from './pages/AIConceptLearning';
import AIProblemSolving from './pages/AIProblemSolving';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="units" element={<UnitSelection />} />
          <Route path="concepts/:grade/:unitId" element={<AIConceptLearning />} />
          <Route path="problems/:grade/:unitId" element={<AIProblemSolving />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
