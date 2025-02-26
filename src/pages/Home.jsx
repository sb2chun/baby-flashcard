import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Book, Brain, HelpCircle, FileText } from 'lucide-react';

const Home = () => {
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
      title: language === 'kor' ? '플래시카드' : 'Flashcards',
      description: language === 'kor' ? '이미지와 단어로 배우는 학습' : 'Learn through images and words',
      icon: <Book className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-100 hover:bg-blue-200',
      path: '/flashcards'
    },
    {
      title: language === 'kor' ? '퀴즈 게임' : 'Quiz Game',
      description: language === 'kor' ? '배운 내용을 퀴즈로 복습해요' : 'Review learned content with quizzes',
      icon: <Brain className="w-8 h-8 text-green-500" />,
      color: 'bg-green-100 hover:bg-green-200',
      path: '/quiz'
    },
    {
      title: language === 'kor' ? '카드 정보' : 'Card Details',
      // description: language === 'kor' ? '각 카드에 대한 상세 정보를 확인하세요' : 'View detailed information about each card',
      description: language === 'kor' ? '이 페이지는 현재 개발 중입니다. 곧 더 많은 정보를 제공할 예정입니다.' : 'This page is currently under development. More information will be available soon.',
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      // color: 'bg-orange-100 hover:bg-orange-200',
      color: 'bg-gray-100 hover:bg-gray-200',
      // path: '/detail'
      path: '/'
    },
    {
      title: language === 'kor' ? '학습 가이드' : 'Learning Guide',
      description: language === 'kor' ? '플래시카드 활용 방법을 알아보세요' : 'Learn how to use flashcards',
      icon: <HelpCircle className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-100 hover:bg-purple-200',
      path: '/guide'
    },
    {
      title: language === 'kor' ? '소개' : 'About',
      description: language === 'kor' ? '이 웹사이트와 제공하는 서비스에 대해 알아보세요' : 'Learn about this website and the services we offer',  icon: <HelpCircle className="w-8 h-8 text-purple-500" />,
      color: 'bg-red-100 hover:bg-red-200',
      path: '/about'
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
            } `}        >
          {language === 'kor' ? '한글' : 'English'}
        </button>
      </div>

      {/* Header Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-4xl font-bold text-blue-600">{language === 'kor' ? '우리 아이 플래시카드' : 'Baby Flashcards'}</h2>
            <p className="text-gray-600 text-lg mt-2">{language === 'kor' ? '다양한 방법으로 즐기는 스마트 학습' : 'Smart learning through various methods'}</p>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Features Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex justify-center items-center">
            <div className="">
              <h2 className="text-xl font-semibold text-gray-800">{language === 'kor' ? '주요 기능' : 'Key Features'}</h2>
              <p className="text-gray-600 text-sm mt-1">{language === 'kor' ? '이미지와 단어로 쉽게 배워요' : 'Learn easily with images and words'}</p>
            </div>
            <span className="text-4xl">✨</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {language === 'kor' ? '자동/수동 모드로 학습 속도 조절' : 'Adjust learning speed with auto/manual mode'}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {language === 'kor' ? '한글/영어 전환으로 이중 언어 학습' : 'Learn in both Korean/English'}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              {language === 'kor' ? '다양한 카테고리별 학습 콘텐츠' : 'Various category-based learning content'}
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

      {/* Start Button */}
      <div className="text-center">
        <button 
          onClick={() => navigate('/flashcards')}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {language === 'kor' ? '학습 시작하기' : 'Start Learning'}
        </button>
      </div>
    </div>
  );
};

export default Home;
