import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Alert, AlertDescription } from "../ui/Alert";
import { Check, X, ChevronLeft, ChevronRight, Minimize2, Maximize2 } from "lucide-react";

const QuizMainContent = ({
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

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50
                ${isFullscreen ? "fixed inset-0 z-20 bg-white w-screen" : ""}`}
      style={{
        height: `calc(100vh - ${controlPanelHeight}px)`, // ControlPanel 높이 제외
        marginTop: `${controlPanelHeight}px`, // ControlPanel 높이만큼 아래로 밀기
      }}
    >
      {/* 이미지 & 좌우 이동 버튼 */}
      <div className={`flex-[0.8] relative group w-full h-full min-h-0 flex items-center justify-center px-3 py-1`}>
        {/* 왼쪽 이동 버튼 */}
        <button
          onClick={() => handleCardChange(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/80 hover:bg-white shadow-md transition z-10 w-12 h-12 flex items-center justify-center"
        >
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>

        <img
          src={shuffledData[currentIndex].image}
          alt="Quiz"
          className={`w-full h-full object-contain rounded-2xl shadow-lg md:p-1
            transition-opacity duration-300 border `}
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

        {/* 오른쪽 이동 버튼 */}
        <button
          onClick={() => handleCardChange(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/80 hover:bg-white shadow-md transition z-10 w-12 h-12 flex items-center justify-center"
        >
          <ChevronRight className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      {/* 문제 텍스트 */}
      <h2 className="flex-[0.05] text-base md:text-2xl font-bold text-center my-0 md:my-3 text-gray-800">
        {language === "kor"
          ? "이 그림의 단어를 선택하세요"
          : "Select the word for this image"}
      </h2>

      {/* 선택지 버튼들 */}
      <div className="flex-[0.15] grid grid-cols-2 
                    gap-1 md:gap-8 w-full max-w-6xl py-1 md:py-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={showFeedback}
            className={`p-1 md:p-2 rounded-lg text-l md:text-xl font-medium transition-all w-full 
                        shadow-sm 
              ${
                selectedAnswer === option
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }
              ${showFeedback ? "cursor-not-allowed" : "hover:shadow-lg"}
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 중앙 피드백 메시지 */}
      {showFeedback && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            px-2 py-2  md:px-8 md:py-4 rounded-lg text-xl font-semibold transition-opacity duration-500
            ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}
            ${showFeedback ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          {isCorrect
            ? language === "kor"
              ? "정답입니다!"
              : "Correct!"
            : language === "kor"
            ? "오답입니다. 다시 선택해주세요."
            : "Incorrect. Please try again."}
        </div>
      )}
    </div>
  );
};

export default QuizMainContent;
