import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SemestersPage from './pages/SemestersPage';
import GoalTrackerPage from './pages/GoalTrackerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/semesters" element={<SemestersPage />} />
          <Route path="/goals" element={<GoalTrackerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
