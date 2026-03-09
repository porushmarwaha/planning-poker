import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NewGame from './pages/NewGame';
import Room from './pages/Room';
import Join from './pages/Join';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/new-game" element={<NewGame />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/join/:roomId" element={<Join />} />
      </Routes>
    </Router>
  );
}

export default App;
