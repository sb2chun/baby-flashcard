// src/components/FlashcardApp/ControlPanel.jsx
import { useState, useEffect, forwardRef } from "react"; // useEffect 추가
import {  Timer, Plus, Minus, VolumeX, Book, Eye, EyeOff, Shuffle, List, Languages, Home, Volume2 } from "lucide-react";
import { Link } from "react-router-dom"; // Link 컴포넌트 임포트

const ControlPanel = forwardRef(
  (
    {
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
      isFlashcard,
      isTtsEnabled, // TTS 활성화 상태
      setIsTtsEnabled, // TTS 활성화 상태 설정 함수
    },
    ref
  ) => {
    useEffect(() => {
      const updateHeight = () => {
        if (ref.current) {
          document.documentElement.style.setProperty(
            "--control-panel-height",
            `${ref.current.offsetHeight}px`
          );
        }
      };

      updateHeight(); // 처음 마운트될 때 높이 설정
      window.addEventListener("resize", updateHeight); // 창 크기 변경 시 업데이트

      return () => window.removeEventListener("resize", updateHeight);
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
      <div
        ref={ref}
        className="top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-30 border-b"
      >
        {/* Desktop view */}
          <div className="hidden md:flex flex-wrap justify-between p-3 gap-4">
            {/* Home 버튼 추가 */}
            <div className="flex items-center gap-2">
              <Link
                 to={`/?language=${language}`}  
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Home className="w-6 h-6 text-black-500" />
              </Link>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-4">

              {/* TTS Toggle Button */}
              <button
                onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                className={`${
                  isFlashcard ? "visible" : "invisible"
                } px-4 py-2 rounded-full flex items-center gap-2 transition ${
                  isTtsEnabled
                    ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                    : "bg-gray-300 hover:bg-gray-200"
                }`}
              >
              {isTtsEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span>
                  {language === "kor"
                    ? isTtsEnabled
                      ? "음성 켜기"
                      : "음성 끄기"
                    : isTtsEnabled
                    ? "Voice On"
                    : "Voice Off"}
                </span>
              </button>

              {/* Timer Controls */}
              <div
                className={`${
                  isFlashcard ? "visible" : "invisible"
                } flex items-center gap-2 ${!isAutoPlay ? "opacity-50" : ""}`}
              >
                <button
                  onClick={() => adjustInterval(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  disabled={!isAutoPlay}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <span className="min-w-[3rem] text-center font-medium">
                    {intervalTime}s
                  </span>
                </div>
                <button
                  onClick={() => adjustInterval(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  disabled={!isAutoPlay}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Auto/Manual Play */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`${
                  isFlashcard ? "visible" : "invisible"
                } px-4 py-2 rounded-full flex items-center gap-2 transition ${
                  isAutoPlay
                    ? "bg-blue-500 hover:bg-blue-400 text-white"
                    : "bg-gray-300 hover:bg-gray-200"
                }`}
              >
                <Book className="w-4 h-4" />
                <span>
                  {language === "kor"
                    ? isAutoPlay
                      ? "자동 재생"
                      : "수동 재생"
                    : isAutoPlay
                    ? "Auto"
                    : "Manual"}
                </span>
              </button>

              {/* Show/Hide Word */}
              <button
                onClick={() => setHideWordMode(!hideWordMode)}
                className={`${
                  isFlashcard ? "visible" : "invisible"
                } px-4 py-2 rounded-full flex items-center gap-2 transition ${
                  hideWordMode
                    ? "bg-green-500 hover:bg-green-400 text-white"
                    : "bg-gray-300 hover:bg-gray-200"
                }`}
              >
                {hideWordMode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>
                  {language === "kor"
                    ? hideWordMode
                      ? "단어 숨김"
                      : "단어 보임"
                    : hideWordMode
                    ? "Hide Word"
                    : "Show Word"}
                </span>
              </button>

              {/* Sequential/Random Order  */}
              <button
                onClick={() => setIsRandomOrder(!isRandomOrder)}
                className={`${
                  isFlashcard ? "visible" : "invisible"
                } px-4 py-2 rounded-full flex items-center gap-2 transition ${
                  isRandomOrder
                    ? "bg-purple-500 hover:bg-purple-400 text-white"
                    : "bg-gray-300 hover:bg-gray-200"
                }`}
              >
                {isRandomOrder ? (
                  <Shuffle className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
                <span>
                  {language === "kor"
                    ? isRandomOrder
                      ? "랜덤 진행"
                      : "순차 진행"
                    : isRandomOrder
                    ? "Random"
                    : "Sequential"}
                </span>
              </button>

              {/* 한글/Eng */}
              <button
                onClick={() => setLanguage(language === "kor" ? "eng" : "kor")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition
                      ${
                        language === "kor"
                          ? "hover:bg-orange-400 bg-orange-500 text-white"
                          : "hover:bg-red-400 bg-red-500 text-white"
                      } `}
              >
                <Languages className={`w-4 h-4`} />
                <span>{language === "kor" ? "한글" : "ENG"}</span>
              </button>
            </div>
          </div>

        {/* Mobile view */}
        <div className={`md:hidden flex my-1 p-1 justify-between
                        ${isFlashcard ? (isLandscape ? "flex-row " : "flex-col") 
                                : "flex-row"}`}
                        >
          <div className="flex gap-2 justify-start w-full">
              {/* Home 버튼 추가 */}
              <div className="flex flex-row items-center gap-2">
              <Link
                 to={`/?language=${language}`}  
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Home className="w-6 h-6 text-black-500" />
              </Link>

              {/* Auto/Manual Play */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`flex px-3 py-2 rounded text-sm rounded-full items-center whitespace-nowrap
                            ${isFlashcard ? "visible" : "hidden"} 
                            ${isAutoPlay ? "bg-blue-500 hover:bg-blue-400 text-white" : "bg-gray-300 hover:bg-gray-200"}`}
              >
                <Book className="w-4 h-4 pr-1" />
                <span>
                {isLandscape ? 
                      (language === "kor" ? 
                          isAutoPlay ? "자동 재생" : "수동 재생"
                          : isAutoPlay ? "Auto Play" : "Manual Play")
                    : (language === "kor" ? 
                          isAutoPlay ? "자동": "수동"
                          : isAutoPlay ? "Auto" : "Manual")}                  
                </span>
              </button>

              {/* Show/Hide Word */}
              <button
                onClick={() => setHideWordMode(!hideWordMode)}
                className={`${isFlashcard ? "visible" : "hidden"}
                          flex px-4 py-2 rounded text-sm rounded-full items-center whitespace-nowrap
                          ${hideWordMode ? "bg-green-500 hover:bg-green-400 text-white": "bg-gray-300 hover:bg-gray-200"}`}
              >
                {hideWordMode ? (
                  <EyeOff className="w-4 h-4 pr-1" />
                ) : (
                  <Eye className="w-4 h-4 pr-1" />
                )}
                <span>
                {isLandscape ? 
                      (language === "kor" ? 
                        hideWordMode ? "단어 숨김" : "단어 보임"
                        : hideWordMode ? "Hide Word" : "Show Word")
                    : (language === "kor" ? hideWordMode ? "숨김": "보임"
                        : hideWordMode ? "Hide" : "Show")}
                </span>
              </button>

              {/* Sequential/Random Order  */}
              <button
                onClick={() => setIsRandomOrder(!isRandomOrder)}
                className={`flex px-4 py-2 rounded text-sm rounded-full items-center whitespace-nowrap
                          ${isFlashcard ? "visible" : "hidden"} 
                          ${isRandomOrder ? "bg-purple-500 hover:bg-purple-400 text-white" : "bg-gray-300 hover:bg-gray-200"}`}
              >
                {isRandomOrder ? (
                  <Shuffle className="w-4 h-4 pr-1" />
                ) : (
                  <List className="w-4 h-4 pr-1" />
                )}
                <span>
                {isLandscape ? 
                      (language === "kor" ? 
                        isRandomOrder ? "랜덤 진행" : "순차 진행"
                          : isRandomOrder ? "Random" : "Sequential")
                    : (language === "kor" ? 
                      isRandomOrder ? "랜덤": "순차"
                          : isRandomOrder ? "Random" : "Sequential")}                     
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center w-full">
            {/* TTS Toggle Button */}
            <button
              onClick={() => setIsTtsEnabled(!isTtsEnabled)}
              className={`flex px-3 py-2 rounded text-sm rounded-full items-center whitespace-nowrap
                        ${isFlashcard ? "visible" : "hidden"} 
                        ${isTtsEnabled ? "bg-yellow-500 hover:bg-yellow-400 text-white" : "bg-gray-300 hover:bg-gray-200"}`}
            >
              <Volume2 className="w-4 h-4 pr-1" />
              <span>
                {isLandscape ? 
                      (language === "kor" ? 
                        isTtsEnabled ? "음성 켜기" : "음성 끄기"
                        : isTtsEnabled ? "Voice On" : "Voice Off")
                    : (language === "kor" ? 
                        isTtsEnabled ? "음성 켜기": "음성 끄기"
                        : isTtsEnabled ? "Voice On" : "Voice Off")}
              </span>
            </button>

              {/* Timer Controls */}
              <div
                className={`${
                  isFlashcard ? "visible" : "invisible"
                } flex items-center gap-2 ${!isAutoPlay ? "opacity-50" : ""}`}
              >
                <button
                  onClick={() => adjustInterval(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  disabled={!isAutoPlay}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <span className="min-w-[3rem] text-center font-medium">
                    {intervalTime}s
                  </span>
                </div>
                <button
                  onClick={() => adjustInterval(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  disabled={!isAutoPlay}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {/* 한글/Eng */}
              <button
                onClick={() => setLanguage(language === "kor" ? "eng" : "kor")}
                className={`flex px-3 py-2 rounded text-sm rounded-full items-center whitespace-nowrap
                      ${language === "kor" ?
                         "hover:bg-orange-400 bg-orange-500 text-white"
                          : "hover:bg-red-400 bg-red-500 text-white"} `}
              >
                <Languages className={`w-4 h-4`} />
                <span>{language === "kor" ? "한글" : "ENG"}</span>
              </button>
          </div>

        </div>

      </div>
    );
  }
);

export default ControlPanel;
