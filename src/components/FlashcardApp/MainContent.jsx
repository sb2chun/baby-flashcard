import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";

// src/components/FlashcardApp/MainContent.jsx
const MainContent = ({
  controlPanelRef,
  currentIndex,
  shuffledData,
  language,
  hideWordMode,
  handleCardChange,
  isImageLoaded,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlPanelHeight, setControlPanelHeight] = useState(0);
  const [randomBackgroundColor, setRandomBackgroundColor] = useState("");
 
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
    const backgroundColors = [
      "bg-red-300",
      "bg-yellow-300", // 수정: typo 수정
      "bg-green-300",
      "bg-blue-300",
      "bg-purple-300",
      // 다른 색상들 추가
    ];

    const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    setRandomBackgroundColor(randomColor); // 랜덤 배경색을 업데이트
  }, [currentIndex]); // currentIndex가 변경될 때마다 배경색을 변경

  if (shuffledData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <p>이 카테고리에는 카드가 없습니다.</p>
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
      <div
        className={`flex flex-col items-center justify-center relative w-full h-full min-h-0 bg-red
          ${isFullscreen ? "flex-[0.9]" : "flex-[0.8]"}`}
      >
        {/* 이전 버튼 */}
        <button
          onClick={() => handleCardChange(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* 이미지 컨테이너 */}
        <div className={`relative w-full h-full px-2 py-1 bg-gradient-to-b from-blue-50 to-purple-50 `}>
          {/* <div className={`relative group w-full h-full ${randomBackgroundColor} rounded-2xl`}> */}
          <div className={`relative group w-full h-full bg-gradient-to-b from-blue-200 to-purple-200 rounded-2xl`}>
            <img
              src={shuffledData[currentIndex].image}
              alt={shuffledData[currentIndex][`${language}_word`]}
              className={`w-full h-full object-contain rounded-2xl shadow-lg p-1
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
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => handleCardChange(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 단어 표시 */}
        {!hideWordMode && (
          <div
            className={`flex items-center justify-center py-2
            ${isFullscreen ? "flex-[0.1]" : "flex-[0.2]"}`}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              {shuffledData[currentIndex][`${language}_word`]}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
