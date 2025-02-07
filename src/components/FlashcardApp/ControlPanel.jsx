// src/components/FlashcardApp/ControlPanel.jsx
import { Timer, Plus, Minus, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, forwardRef } from "react"; // useEffect 추가

const ControlPanel = forwardRef(({
  intervalTime,
  setIntervalTime,
  isAutoPlay,
  setIsAutoPlay,
  hideWordMode,
  setHideWordMode,
  language,
  setLanguage,
  isRandomOrder,
  setIsRandomOrder,
  isTTSEnabled,
  setIsTTSEnabled,
  isSpeaking,
}, ref) => {
  
  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const height = ref.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--control-panel-height",
          `${height}px`
        );
        // RAF를 사용하여 리플로우 최적화
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(
            "--control-panel-height",
            `${height}px`
          );
        });
      }
    };
  
    // ResizeObserver를 사용하여 더 정확한 높이 감지
    const resizeObserver = new ResizeObserver(updateHeight);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
  
    updateHeight(); // 초기 높이 설정
    window.addEventListener("resize", updateHeight);
  
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [ref]);

  const adjustInterval = (amount) => {
    if (!isAutoPlay) return;
    setIntervalTime((prev) => Math.max(1, prev + amount));
  };

  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={ref} className="fixed top-0 left-0 right-0 bg-white shadow-md z-30">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-center gap-6 my-2">
        <div
          className={`flex items-center gap-2 ${
            !isAutoPlay ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <button
            onClick={() => adjustInterval(-1)}
            className="p-2 hover:bg-gray-100 rounded"
            disabled={!isAutoPlay}
          >
            <Minus size={20} />
          </button>
          <Timer size={20} />
          <span className="min-w-[3rem] text-center">{intervalTime}초</span>
          <button
            onClick={() => adjustInterval(1)}
            className="p-2 hover:bg-gray-100 rounded"
            disabled={!isAutoPlay}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Other desktop controls */}
        <div className="flex">
          <button
            onClick={() => setHideWordMode(true)}
            className={`px-4 py-2 rounded ${
              hideWordMode ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            {language === "kor" ? "단어 숨김" : "Hide Words"}
          </button>
          <button
            onClick={() => setHideWordMode(false)}
            className={`px-4 py-2 rounded ${
              !hideWordMode ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            {language === "kor" ? "단어 보임" : "Show Words"}
          </button>
        </div>

        <div className="flex">
          <button
            onClick={() => setIsAutoPlay(true)}
            className={`px-4 py-2 rounded ${
              isAutoPlay ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            {language === "kor" ? "자동" : "Auto"}
          </button>
          <button
            onClick={() => setIsAutoPlay(false)}
            className={`px-4 py-2 rounded ${
              !isAutoPlay ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            {language === "kor" ? "수동" : "Manual"}
          </button>
        </div>

        <div className="flex">
          <button
            onClick={() => setIsRandomOrder(true)}
            className={`px-4 py-2 rounded ${
              isRandomOrder ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            {language === "kor" ? "랜덤" : "Random"}
          </button>
          <button
            onClick={() => setIsRandomOrder(false)}
            className={`px-4 py-2 rounded ${
              !isRandomOrder ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            {language === "kor" ? "순차" : "Sequential"}
          </button>
        </div>
        <button
          onClick={() => setIsTTSEnabled(!isTTSEnabled)}
          className={`p-2 rounded hidden
            ${isTTSEnabled ? "bg-green-500 text-white" : "bg-gray-100"} 
            ${isSpeaking ? "animate-pulse" : ""}`}
        >
          {isTTSEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        <div className="flex absolute right-5">
          <button
            onClick={() => setLanguage("kor")}
            className={`px-4 py-2 rounded ${
              language === "kor" ? "bg-purple-500 text-white" : "bg-gray-100"
            }`}
          >
            한글
          </button>
          <button
            onClick={() => setLanguage("eng")}
            className={`px-4 py-2 rounded ${
              language === "eng" ? "bg-purple-500 text-white" : "bg-gray-100"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Mobile view */}
      <div className={`md:hidden flex my-2 p-1 space-y-1 justify-between ${isLandscape ? "flex-row " : "flex-col"}`}>
        {/* 기능들 (첫 번째 줄) */}
        <div className="flex gap-2 justify-start w-full">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-2 py-1 rounded text-sm ${isAutoPlay ? "bg-green-500 text-white" : "bg-gray-100"}`}
          >
            {language === "kor"
              ? isAutoPlay
                ? "자동 넘기기"
                : "수동 넘기기"
              : isAutoPlay
                ? "Auto Next"
                : "Manual Next"}
          </button>
          <button
            onClick={() => setHideWordMode(!hideWordMode)}
            className={`px-2 py-1 rounded text-sm ${hideWordMode ? "bg-green-500 text-white" : "bg-gray-100"}`}
          >
            {language === "kor"
              ? hideWordMode
                ? "단어 숨김"
                : "단어 보임"
              : hideWordMode
                ? "Hide Word"
                : "Show Word"}
          </button>
          <button
            onClick={() => setIsRandomOrder(!isRandomOrder)}
            className={`px-2 py-1 rounded text-sm ${isRandomOrder ? "bg-green-500 text-white" : "bg-gray-100"}`}
          >
            {language === "kor"
              ? isRandomOrder
                ? "랜덤 재생"
                : "순차 재생"
              : isRandomOrder
                ? "Random Play"
                : "Sequential Play"}
          </button>
        </div>

        {/* 시간 조정 + 한글/Eng (두 번째 줄) */}
        <div className="flex justify-between items-center w-full">
          {/* 시간 조정 */}
          <div
            className={`flex items-center gap-2 ${!isAutoPlay ? "opacity-50 pointer-events-none" : ""}`}
          >
            <button
              onClick={() => adjustInterval(-1)}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={!isAutoPlay}
            >
              <Minus size={16} />
            </button>
            <Timer size={16} />
            <span className="min-w-[2.5rem] text-center text-sm">
              {intervalTime}초
            </span>
            <button
              onClick={() => adjustInterval(1)}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={!isAutoPlay}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex absolute right-5">
            <button
              onClick={() => setLanguage(language === "kor" ? "eng" : "kor")}
              className={`px-2 py-1 rounded text-sm ${language === "kor" ? "bg-purple-500 text-white" : "bg-gray-100"}`}
            >
              {language === "kor" ? "한글" : "English"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ControlPanel;
