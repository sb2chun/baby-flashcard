// src/components/FlashcardApp/MainContent.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

const MainContent = ({
  currentIndex,
  shuffledData,
  language,
  hideWordMode,
  handleCardChange
}) => {
  if (shuffledData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-200">
        <p>이 카테고리에는 카드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 mt-[10vh] h-[80vh] overflow-hidden">
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        <div className="relative w-full h-[60vh] flex items-center justify-center">
          {/* 이전 카드 버튼 */}
          <button
            onClick={() => handleCardChange(currentIndex - 1)}
            className="absolute left-0 h-full px-4 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <ChevronLeft size={48} className="text-black" />
          </button>

          {/* 현재 카드 이미지 */}
          <img
            src={shuffledData[currentIndex].image}
            alt={shuffledData[currentIndex][`${language}_word`]}
            className="max-h-full object-contain"
            style={{ height: "60vh", margin: "0 60px" }}
          />

          {/* 다음 카드 버튼 */}
          <button
            onClick={() => handleCardChange(currentIndex + 1)}
            className="absolute right-0 h-full px-4 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <ChevronRight size={48} className="text-black" />
          </button>
        </div>

        {/* 단어 표시 영역 */}
        <div className="p-4 text-center">
          {!hideWordMode && (
            <h2 className="text-4xl font-bold text-black">
              {shuffledData[currentIndex][`${language}_word`]}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;