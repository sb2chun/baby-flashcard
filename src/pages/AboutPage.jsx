import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { BookOpen,Lightbulb,  Mail, Book, Brain, MessageCircle } from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('eng'); // Add state for language

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const languageParam = queryParams.get("language");
    if (languageParam) {
      setLanguage(languageParam);  // Set the language state from the query parameter
    }
  }, [location]);

  const contents = [
    {
      title: language === 'kor' ? '플래시 카드란?' : 'What are Flashcards?',
      description: language === 'kor' 
        ? '플래시카드의 개념과 교육적 효과에 대한 설명입니다'
        : 'Learn about the concept and educational benefits of flashcards',
      icon: <BookOpen className="w-10 h-10 text-blue-500" />,
      color: 'bg-blue-50',
      path: '/about/flaschards'
    },
    {
      title: language === 'kor' ? '효율적인 사용법' : 'Effective Usage Guide',
      description: language === 'kor'
        ? '플래시카드를 활용한 최적의 학습 방법을 알아보세요'
        : 'Discover optimal learning methods using flashcards',
      icon: <Lightbulb className="w-10 h-10 text-yellow-500" />,
      color: 'bg-yellow-50',
      path: '/about/instructions'
    },
    {
      title: language === 'kor' ? '문의하기' : 'Contact Us',
      description: language === 'kor'
        ? '질문이나 제안사항이 있으시면 연락해주세요'
        : 'Reach out to us with questions or suggestions',
      icon: <Mail className="w-10 h-10 text-green-500" />,
      color: 'bg-green-50',
      path: '/about/contact'
    }
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'kor' ? 'eng' : 'kor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Language Toggle Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleLanguage}
          className={`px-4 py-2 rounded-full flex items-center gap-2 transition
            ${
              language === "kor"
                ? "hover:bg-orange-400 bg-orange-500 text-white"
                : "hover:bg-red-400 bg-red-500 text-white"
            } `}
        >
          {language === 'kor' ? '한글' : 'English'}
        </button>
      </div>

      {/* Header Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-4xl font-bold text-blue-600">{language === 'kor' ? '플래시카드 학습 가이드' : 'Flashcard Learning Guide'}</h2>
            <p className="text-gray-600 text-lg mt-2">{language === 'kor' ? '우리 아이의 더 나은 학습을 위한 정보' : 'Information for better learning experience'}</p>
          </CardTitle>
        </CardHeader>
      </Card>
      
      {/* Features Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex justify-center items-center">
            <div className="">
              <h2 className="text-xl font-semibold text-gray-800">{language === 'kor' ? '알아두세요' : 'About Us'}</h2>
              <p className="text-gray-600 text-sm mt-1">{language === 'kor' ? '플래시카드의 모든 것' : 'Everything about our flashcards'}</p>
            </div>
            <span className="text-4xl">📚</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {language === 'kor' ? '과학적 학습 방법론 기반 설계' : 'Designed based on scientific learning methodologies'}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {language === 'kor' ? '언어 발달과 인지 능력 향상' : 'Enhances language development and cognitive abilities'}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              {language === 'kor' ? '전문가의 조언과 사용자 피드백 반영' : 'Incorporates expert advice and user feedback'}
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Contents Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contents.map((content, index) => (
          <Card
            key={index}
            className={`${content.color} cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
            onClick={() => navigate(`${content.path}?language=${language}`)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {content.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {content.title}
                </h3>
                <p className="text-gray-600">
                  {content.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Navigation Button */}
      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {language === "kor" ? "홈으로 이동" : "Go Home"}
        </button>
      </div>
    </div>
  );
};

export default AboutPage;