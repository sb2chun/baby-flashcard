import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FlashcardPage from './pages/FlashcardPage';
import QuizPage from './pages/QuizPage';
import GuidePage from './pages/GuidePage'
import AboutPage from './pages/AboutPage'
import CardDetailPage from './pages/CardDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        {/* 추후 추가될 페이지들 */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/detail" element={<CardDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
