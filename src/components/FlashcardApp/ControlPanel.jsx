// src/components/FlashcardApp/ControlPanel.jsx
import { Timer, Plus, Minus, Volume2, VolumeX } from "lucide-react";

const ControlPanel = ({
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
  isSpeaking
}) => {
  const adjustInterval = (amount) => {
    if (!isAutoPlay) return;
    setIntervalTime((prev) => Math.max(1, prev + amount));
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-[10vh] bg-white shadow-md z-20">
      <div className="flex items-center justify-center h-full gap-6 px-4">
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
    </div>
  );
};

export default ControlPanel;
