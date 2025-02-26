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
  const [options, setOptions] = useState([]); // 보기 목록을 상태로 관리
  const [controlPanelHeight, setControlPanelHeight] = useState(0);

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
  }, [currentIndex, shuffledData, language]); // 문제가 변경될 때만 실행

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

  const sampleData = {
    category: "fruits",
    id: "apple",
    image:
      "https://raw.githubusercontent.com/sb2chun/baby-flashcard/main/public/images/공룡_Dinosaur/데이노케이루스_Deinocheirus.jpg",
    korName: "사과",
    engName: "Apple",
    details: {
      origin: {
        kor: "사과는 중앙아시아가 원산지이며, 실크로드를 따라 세계로 전파되었습니다.",
        eng: "Apples originated in Central Asia and spread worldwide along the Silk Road.",
      },
      nutrition: {
        kor: "사과는 식이섬유, 비타민 C, 항산화물질이 풍부합니다.",
        eng: "Apples are rich in dietary fiber, vitamin C, and antioxidants.",
      },
      benefits: {
        kor: "심장 건강 개선, 혈당 조절, 소화 촉진에 도움을 줍니다.",
        eng: "Helps improve heart health, regulate blood sugar, and promote digestion.",
      },
      stories: {
        kor: "그리스 신화의 '불화의 사과', 뉴턴의 만유인력 발견 등 많은 이야기의 소재입니다.",
        eng: "Featured in many stories including Greek mythology's \"Apple of Discord\" and Newton's discovery of gravity.",
      },
    },
    relatedCards: [
      { id: "orange", name: { kor: "오렌지", eng: "Orange" } },
      { id: "banana", name: { kor: "바나나", eng: "Banana" } },
    ],
  };

  return (
    <div
      className={`flex-1 flex flex-col bg-gradient-to-b from-blue-50 to-purple-50
                ${isFullscreen ? "fixed inset-0 z-20 bg-white w-screen" : ""}`}
      style={{
        height: `calc(100vh - ${controlPanelHeight}px)`, // ControlPanel 높이 제외
        marginTop: `${controlPanelHeight}px`, // ControlPanel 높이만큼 아래로 밀기
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
                ? shuffledData[currentIndex].path
                : shuffledData[currentIndex].engName
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
            <Tabs defaultValue="origin" className="font-bold">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="origin">
                  {language === "kor" ? "기원" : "Origin"}
                </TabsTrigger>
                <TabsTrigger value="nutrition">
                  {language === "kor" ? "영양" : "Nutrition"}
                </TabsTrigger>
                <TabsTrigger value="benefits">
                  {language === "kor" ? "효능" : "Benefits"}
                </TabsTrigger>
                <TabsTrigger value="stories">
                  {language === "kor" ? "이야기" : "Stories"}
                </TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <TabsContent value="origin">
                  <p className="text-gray-600 leading-relaxed">
                    {language === "kor"
                      ? sampleData.details.origin.kor
                      : sampleData.details.origin.eng}
                  </p>
                </TabsContent>
                <TabsContent value="nutrition">
                  <p className="text-gray-600 leading-relaxed">
                    {language === "kor"
                      ? sampleData.details.nutrition.kor
                      : sampleData.details.nutrition.eng}
                  </p>
                </TabsContent>
                <TabsContent value="benefits">
                  <p className="text-gray-600 leading-relaxed">
                    {language === "kor"
                      ? sampleData.details.benefits.kor
                      : sampleData.details.benefits.eng}
                  </p>
                </TabsContent>
                <TabsContent value="stories">
                  <p className="text-gray-600 leading-relaxed">
                    {language === "kor"
                      ? sampleData.details.stories.kor
                      : sampleData.details.stories.eng}
                  </p>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardDetailContent;
