import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FlashcardPage from './pages/FlashcardPage';
import QuizPage from './pages/QuizPage';
import CardDetailPage from './pages/CardDetailPage';
import LicensePage from './pages/LicensePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactUsPage';
import FlashcardInfoPage from './pages/FlashcardInfoPage';
import InstructionPage from './pages/InstuctionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/detail" element={<CardDetailPage />} />
        <Route path="/license" element={<LicensePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about/flaschards" element={<FlashcardInfoPage />} />
        <Route path="/about/contact" element={<ContactPage />} />
        <Route path="/about/instructions" element={<InstructionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
