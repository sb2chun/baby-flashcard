import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";

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

  if (shuffledData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <p>이 카테고리에는 카드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col
        ${isFullscreen ? "fixed inset-0 z-20 bg-white w-screen" : ""}`}
      style={{
        height: `calc(100vh - ${controlPanelHeight}px)`,
        marginTop: `${controlPanelHeight}px`,
      }}
    >
      <div className="flex-1 flex flex-col h-full py-2">
        {/* 이미지 섹션 - isFullscreen일 때만 더 큰 비율 적용 */}
        <div className={`flex items-center justify-center relative min-h-0
          ${isFullscreen ? "flex-[0.9]" : "flex-[0.8]"}`}>
          <button
            onClick={() => handleCardChange(currentIndex - 1)}
            className="absolute bg-transparent left-0 h-full px-2 md:px-4 flex items-center justify-center z-10"
          >
            <ChevronLeft size={24} className="text-black md:w-12 md:h-12" />
          </button>

          <div className="relative group h-full w-full flex items-center justify-center">
            <img
              src={shuffledData[currentIndex].image}
              alt={shuffledData[currentIndex][`${language}_word`]}
              className={`max-h-full max-w-full object-contain px-8 md:px-16
                ${isImageLoaded ? "opacity-100" : "opacity-0"}
                transition-opacity duration-300`}
            />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute bottom-2 right-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity z-40"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>

          <button
            onClick={() => handleCardChange(currentIndex + 1)}
            className="absolute bg-transparent right-0 h-full px-2 md:px-4 flex items-center justify-center z-10"
          >
            <ChevronRight size={24} className="text-black md:w-12 md:h-12" />
          </button>
        </div>

        {/* 텍스트 섹션 - isFullscreen일 때만 더 작은 비율 적용 */}
        {!hideWordMode && (
          <div className={`flex items-center justify-center min-h-0
            ${isFullscreen ? "flex-[0.1]" : "flex-[0.2]"}`}>
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