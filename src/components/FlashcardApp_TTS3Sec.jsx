// FlashcardApp.js
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { GITHUB_PAGES_URL, CACHE_KEY, CACHE_DURATION } from "./constants";

const getVoices = async () => {
  // voices를 가져오는 Promise를 반환하는 함수
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // voices가 아직 로드되지 않은 경우 이벤트 리스너 등록
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};

const FlashcardApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(4);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [hideWordMode, setHideWordMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("통합");
  const [categories, setCategories] = useState([]);
  const [flashcardData, setFlashcardData] = useState([]);
  const [language, setLanguage] = useState("kor");
  const [isRandomOrder, setIsRandomOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // TTS 음성 목록을 관리하기 위한 state 추가
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const speakTimeoutRef = useRef(null);

  const filteredData = useMemo(() => {
    if (selectedCategory === "통합") return flashcardData;

    return flashcardData.filter((item) => {
      return item.category.path === selectedCategory;
    });
  }, [selectedCategory, flashcardData]);

  const shuffledData = useMemo(() => {
    if (isRandomOrder) {
      return [...filteredData].sort(() => Math.random() - 0.5);
    }
    return filteredData;
  }, [filteredData, isRandomOrder]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, filteredData]);

  const cancelCurrentSpeech = useCallback(() => {
    if (!speechSynthRef.current) return;

    if (currentUtteranceRef.current) {
      speechSynthRef.current.cancel();
      currentUtteranceRef.current = null;
    }
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    setIsSpeaking(false);
  }, []);
  // TTS


  const speakWord = useCallback(
    async (word) => {
      if (!speechSynthRef.current || !isTTSEnabled || !word) return;
  
      try {
        // 이전 발화 취소
        cancelCurrentSpeech();
  
        // 딜레이를 50ms로 줄임
        await new Promise((resolve) => setTimeout(resolve, 50));
  
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(word);
          const targetLang = language === "kor" ? "ko" : "en";
          utterance.lang = language === "kor" ? "ko-KR" : "en-US";
  
          const availableVoices = voices.filter((voice) =>
            voice.lang.toLowerCase().startsWith(targetLang.toLowerCase())
          );
  
          if (availableVoices.length > 0) {
            utterance.voice = availableVoices[0];
          }
  
          utterance.volume = 1;
          utterance.rate = 1;
          utterance.pitch = 1;
  
          utterance.onstart = () => {
            setIsSpeaking(true);
          };
  
          utterance.onend = () => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            resolve();
          };
  
          utterance.onerror = (event) => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            if (event.error !== "interrupted") {
              reject(event);
            } else {
              resolve();
            }
          };
  
          currentUtteranceRef.current = utterance;
          speechSynthRef.current.speak(utterance);
        });
      } catch (error) {
        console.error("TTS Speak Error:", error);
        setIsSpeaking(false);
      }
    },
    [isTTSEnabled, language, voices, cancelCurrentSpeech]
  );
  
  const handleCardChange = useCallback(
    async (newIndex) => {
      if (shuffledData.length === 0) return;
  
      // 현재 발화 중단
      cancelCurrentSpeech();
  
      const nextIndex =
        newIndex >= 0 ? newIndex % shuffledData.length : shuffledData.length - 1;
      setCurrentIndex(nextIndex);
  
      // TTS 실행 - 딜레이를 50ms로 줄임
      if (isTTSEnabled) {
        const word = shuffledData[nextIndex][`${language}_word`];
        if (word) {
          console.log("Attempting to speak:", word);
          // 짧은 딜레이 후 발화 시도
          setTimeout(() => {
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('TTS timeout')), 3000);
            });
  
            Promise.race([
              speakWord(word),
              timeoutPromise
            ]).catch(error => {
              if (error.message === 'TTS timeout') {
                console.log('TTS timed out after 3 seconds');
                cancelCurrentSpeech();
              } else {
                console.error('TTS error:', error);
              }
            });
          }, 50);
        }
      }
    },
    [
      shuffledData,
      language,
      isTTSEnabled,
      speakWord,
      cancelCurrentSpeech,
    ]
  );
  useEffect(() => {
    if (!speechSynthRef.current) return;

    let timer;
    if (isAutoPlay && shuffledData.length > 0) {
      const runTimer = () => {
        handleCardChange(currentIndex + 1);
        timer = setTimeout(runTimer, intervalTime * 1000);
      };
      timer = setTimeout(runTimer, intervalTime * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      cancelCurrentSpeech();
    };
  }, [
    intervalTime,
    isAutoPlay,
    handleCardChange,
    currentIndex,
    shuffledData.length,
    cancelCurrentSpeech,
  ]);

  const adjustInterval = (amount) => {
    if (!isAutoPlay) return;
    setIntervalTime((prev) => Math.max(1, prev + amount));
  };

  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis;
  }, []);

  // speechSynthesis 초기화 및 voices 로드
  useEffect(() => {
    const initializeSpeechSynthesis = async () => {
      speechSynthRef.current = window.speechSynthesis;

      try {
        const availableVoices = await getVoices();
        setVoices(availableVoices);
      } catch (error) {
        console.error("Failed to load voices:", error);
      }
    };

    initializeSpeechSynthesis();

    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  // voices 로드 및 이벤트 리스너 설정
  useEffect(() => {
    if (!speechSynthRef.current) return;

    const synth = speechSynthRef.current;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // TTS 리소스 정리
  useEffect(() => {
    return () => {
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const cached = localStorage.getItem(CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);

        if (
          cached &&
          cacheTimestamp &&
          Date.now() - Number(cacheTimestamp) < CACHE_DURATION
        ) {
          const parsedData = JSON.parse(cached);
          setCategories([
            { path: "통합", korName: "통합", engName: "All" },
            ...parsedData.categories.map((cat) => ({
              path: cat.path,
              korName: cat.korName,
              engName: cat.engName,
            })),
          ]);
          setFlashcardData(parsedData.categories.flatMap((cat) => cat.items));
          setIsLoading(false);
          return;
        }

        const response = await fetch(GITHUB_PAGES_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());

        setCategories([
          { path: "통합", korName: "통합", engName: "All" },
          ...data.categories.map((cat) => ({
            path: cat.path,
            korName: cat.korName,
            engName: cat.engName,
          })),
        ]);
        setFlashcardData(data.categories.flatMap((cat) => cat.items));
      } catch (error) {
        console.error("Error loading data:", error);
        alert("데이터 로딩 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isAutoPlay) {
        switch (e.code) {
          case "Space":
          case "ArrowRight":
            handleCardChange(currentIndex + 1);
            break;
          case "ArrowLeft":
            handleCardChange(
              currentIndex === 0 ? shuffledData.length - 1 : currentIndex - 1
            );
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isAutoPlay, handleCardChange, currentIndex, shuffledData.length]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Control Panel */}
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
              단어 숨김
            </button>
            <button
              onClick={() => setHideWordMode(false)}
              className={`px-4 py-2 rounded ${
                !hideWordMode ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              단어 보임
            </button>
          </div>

          <div className="flex">
            <button
              onClick={() => setIsAutoPlay(true)}
              className={`px-4 py-2 rounded ${
                isAutoPlay ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              자동
            </button>
            <button
              onClick={() => setIsAutoPlay(false)}
              className={`px-4 py-2 rounded ${
                !isAutoPlay ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              수동
            </button>
          </div>

          <div className="flex">
            <button
              onClick={() => setIsRandomOrder(true)}
              className={`px-4 py-2 rounded ${
                isRandomOrder ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              랜덤
            </button>
            <button
              onClick={() => setIsRandomOrder(false)}
              className={`px-4 py-2 rounded ${
                !isRandomOrder ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              순차
            </button>
          </div>
          <button
            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
            className={`p-2 rounded ${
              isTTSEnabled ? "bg-green-500 text-white" : "bg-gray-100"
            } ${isSpeaking ? "animate-pulse" : ""}`}
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

      {/* Main Content Area */}
      <div className="flex-1 mt-[10vh] h-[80vh] overflow-hidden">
        {shuffledData.length > 0 ? (
          <div className="relative h-full flex flex-col items-center justify-center p-4">
            <div className="relative w-full h-[60vh] flex items-center justify-center">
              <button
                onClick={() => handleCardChange(currentIndex - 1)}
                className="absolute left-0 h-full px-4 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <ChevronLeft size={48} className="text-black" />
              </button>

              <img
                src={(() => {
                  return shuffledData[currentIndex].image;
                })()}
                alt={(() => {
                  return shuffledData[currentIndex][`${language}_word`];
                })()}
                className="max-h-full object-contain"
                style={{ height: "60vh", margin: "0 60px" }}
              />

              <button
                onClick={() => handleCardChange(currentIndex + 1)}
                className="absolute right-0 h-full px-4 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <ChevronRight size={48} className="text-black" />
              </button>
            </div>

            <div className="p-4 text-center">
              {!hideWordMode && (
                <h2 className="text-4xl font-bold text-black">
                  {shuffledData[currentIndex][`${language}_word`]}
                </h2>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-200">
            <p>이 카테고리에는 카드가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Category Sidebar */}
      <div className="w-[10vw] mt-[10vh] bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">카테고리</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.path}
                onClick={() => handleCategoryChange(category.path)}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === category.path
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {language === "kor" ? category.korName : category.engName}
                {category.path !== "통합" && (
                  <span className="ml-2 text-sm">
                    (
                    {
                      flashcardData.filter(
                        (item) => item.category.path === category.path
                      ).length
                    }
                    )
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardApp;
