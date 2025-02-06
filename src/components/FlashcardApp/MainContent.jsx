import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";

const MainContent = ({
  currentIndex,
  shuffledData,
  language,
  hideWordMode,
  handleCardChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (shuffledData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-200">
        <p>이 카테고리에는 카드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 mt-[10vh] mt-[10vh] md:mt-[10vh] h-[90vh] md:h-[90vh] overflow-hidden
      ${isFullscreen ? "fixed inset-0 z-20 bg-white mt-[10vh] h-[90vh] w-screen" : ""}`}
    >
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center">
          <button
            onClick={() => handleCardChange(currentIndex - 1)}
            className={`absolute left-0 h-full px-2 md:px-4 flex items-center justify-center
              ${isMobile ? "bg-transparent bg-opacity-20 hover:bg-opacity-30" : "bg-white bg-opacity-20 hover:bg-opacity-30"} transition-all z-30`} // z-index 추가
          >
            <ChevronLeft size={24} className="text-black md:w-12 md:h-12" />
          </button>

          <div className="relative group flex flex-col items-center justify-center h-full">
            <img
              src={shuffledData[currentIndex].image}
              alt={shuffledData[currentIndex][`${language}_word`]}
              className={`max-h-full max-w-full object-contain px-8 md:px-16
                ${isFullscreen ? "h-[60vh]" : ""}`}
            />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute bottom-2 right-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>

          <button
            onClick={() => handleCardChange(currentIndex + 1)}
            className={`absolute right-0 h-full px-2 md:px-4 flex items-center justify-center
              ${isMobile ? "bg-transparent" : "bg-white bg-opacity-20 hover:bg-opacity-30"} transition-all`}
          >
            <ChevronRight size={24} className="text-black md:w-12 md:h-12" />
          </button>
        </div>

        <div className={`p-4 text-center ${isFullscreen ? "" : ""}`}>
          {!hideWordMode && (
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              {shuffledData[currentIndex][`${language}_word`]}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
