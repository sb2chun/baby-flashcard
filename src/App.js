import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FlashcardPage from './pages/FlashcardPage';
import QuizPage from './pages/QuizPage';
import GuidePage from './pages/GuidePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        {/* 추후 추가될 페이지들 */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/guide" element={<GuidePage />} />
      </Routes>
    </Router>
  );
}

export default App;
