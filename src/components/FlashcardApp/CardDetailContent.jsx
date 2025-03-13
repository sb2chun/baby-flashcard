import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Alert, AlertDescription } from "../ui/Alert";
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

const CardDetailContent = ({
  controlPanelRef,
  currentIndex,
  shuffledData,
  language,
  handleCardChange,
  isImageLoaded,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState([]);
  const [controlPanelHeight, setControlPanelHeight] = useState(0);
  const [flashcardData, setFlashcardData] = useState(null);

  // 컴포넌트 마운트 시 JSON 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/flashcardsInfo.json');
        const data = await response.json();
        setFlashcardData(data);
      } catch (error) {
        console.error('Error loading flashcard data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (controlPanelRef.current) {
        setControlPanelHeight(controlPanelRef.current.offsetHeight);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controlPanelRef]);

  useEffect(() => {
    if (!shuffledData || shuffledData.length === 0) return;

    const correctAnswer = shuffledData[currentIndex][`${language}_word`];
    const currentCategoryPath = shuffledData[currentIndex].category.path;

    const otherOptions = shuffledData
      .filter(
        (item, idx) =>
          idx !== currentIndex &&
          item.category.path === currentCategoryPath &&
          item[`${language}_word`] !== correctAnswer
      )
      .map((item) => item[`${language}_word`])
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setOptions(
      [...otherOptions, correctAnswer].sort(() => Math.random() - 0.5)
    );
  }, [currentIndex, shuffledData, language]);

  const handleAnswerSelect = (answer) => {
    const correctAnswer = shuffledData[currentIndex][`${language}_word`];
    setSelectedAnswer(answer);
    setIsCorrect(answer === correctAnswer);
    setShowFeedback(true);

    if (answer === correctAnswer) {
      setTimeout(() => {
        handleCardChange(currentIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  // 현재 아이템을 찾는 함수
  const findCurrentItem = () => {
    if (!flashcardData || !shuffledData || shuffledData.length === 0) return null;
    
    const currentWord = shuffledData[currentIndex][`${language}_word`];
    for (const category of flashcardData.categories) {
      const item = category.items.find(
        item => item[`${language}_word`]?.toLowerCase() === currentWord.toLowerCase()
      );
      if (item) return item;
    }
    
    return null;
  };

  const currentItem = findCurrentItem();

  if (shuffledData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full p-6 text-center">
          <p className="text-gray-500">
            No questions available in this category
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col bg-gradient-to-b from-blue-50 to-purple-50
                ${isFullscreen ? "fixed inset-0 z-20 bg-white w-screen" : ""}`}
      style={{
        height: `calc(100vh - ${controlPanelHeight}px)`,
        marginTop: `${controlPanelHeight}px`,
      }}
    >
      {/* Card Preview */}
      <div
        className={`flex-[0.5] relative group w-full h-full min-h-0 flex items-center justify-center px-3 py-1`}
      >
        {/* 왼쪽 이동 버튼 */}
        <button
          onClick={() => handleCardChange(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/80 hover:bg-white shadow-md transition z-10 w-12 h-12 flex items-center justify-center"
        >
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>

        <Card className="h-full overflow-hidden">
          <CardContent className="h-full">
            <div className="flex flex-1 flex-col md:flex-row gap-6 h-full">
              <div className="flex-[0.7] overflow-hidden w-full md:w-1/2 flex items-center justify-center h-full">
                <img
                  src={shuffledData[currentIndex].image}
                  alt={
                    language === "kor"
                      ? shuffledData[currentIndex].kor_word
                      : shuffledData[currentIndex].eng_word
                  }
                  className="w-full h-full object-contain rounded-lg shadow-lg"
                />
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex-[0.3] ">
                <h1 className="inline-block whitespace-nowrap px-3 py-1 bg-blue-100 text-blue-600 text-xl font-bold rounded-full mb-4 truncate">
                  {language === "kor"
                    ? shuffledData[currentIndex].category.kor
                    : shuffledData[currentIndex].category.eng}
                </h1>
                <h2 className="text-purple-600 text-3xl font-bold mb-2 truncate">
                  {language === "kor"
                    ? shuffledData[currentIndex].kor_word
                    : shuffledData[currentIndex].eng_word}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 오른쪽 이동 버튼 */}
        <button
          onClick={() => handleCardChange(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/80 hover:bg-white shadow-md transition z-10 w-12 h-12 flex items-center justify-center"
        >
          <ChevronRight className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* Detailed Information */}
      <div
        className={`flex-[0.5] relative group w-full h-full min-h-0 px-3 py-1`}
      >
        <Card>
          <CardContent className="w-full p-6">
            {currentItem ? (
              <Tabs defaultValue="first" className="font-bold">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="first">
                    {language === "kor" 
                      ? currentItem.details.first.kor_title 
                      : currentItem.details.first.eng_title}
                  </TabsTrigger>
                  <TabsTrigger value="second">
                    {language === "kor" 
                      ? currentItem.details.second.kor_title 
                      : currentItem.details.second.eng_title}
                  </TabsTrigger>
                  <TabsTrigger value="third">
                    {language === "kor" 
                      ? currentItem.details.third.kor_title 
                      : currentItem.details.third.eng_title}
                  </TabsTrigger>
                  <TabsTrigger value="fourth">
                    {language === "kor" 
                      ? currentItem.details.fourth.kor_title 
                      : currentItem.details.fourth.eng_title}
                  </TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <TabsContent value="first">
                    <p className="text-gray-600 leading-relaxed">
                      {language === "kor"
                        ? currentItem.details.first.kor_desc
                        : currentItem.details.first.eng_desc}
                    </p>
                  </TabsContent>
                  <TabsContent value="second">
                    <p className="text-gray-600 leading-relaxed">
                      {language === "kor"
                        ? currentItem.details.second.kor_desc
                        : currentItem.details.second.eng_desc}
                    </p>
                  </TabsContent>
                  <TabsContent value="third">
                    <p className="text-gray-600 leading-relaxed">
                      {language === "kor"
                        ? currentItem.details.third.kor_desc
                        : currentItem.details.third.eng_desc}
                    </p>
                  </TabsContent>
                  <TabsContent value="fourth">
                    <p className="text-gray-600 leading-relaxed">
                      {language === "kor"
                        ? currentItem.details.fourth.kor_desc
                        : currentItem.details.fourth.eng_desc}
                    </p>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <p className="text-gray-500 text-center">
                {language === "kor" 
                  ? "상세 정보를 불러오는 중..." 
                  : "Loading details..."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardDetailContent;