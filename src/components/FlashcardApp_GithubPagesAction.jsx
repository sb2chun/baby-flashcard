import { useState, useEffect, useCallback, useMemo } from "react";
import { Timer, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";

// GitHub API 관련 상수
const REPO_OWNER = "sb2chun";
const REPO_NAME = "baby-flashcard";

const GITHUB_PAGES_URL = `https://${REPO_OWNER}.github.io/${REPO_NAME}/flashcards.json`;
const CACHE_KEY = "flashcards_data";
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

const generateRandomColor = () => {
  const colors = [
    "#FFB6C1",
    "#FFEB3B",
    "#9C27B0",
    "#FF9800",
    "#795548",
    "#607D8B",
    "#E91E63",
    "#2196F3",
    "#4CAF50",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true); // 로딩 시작시 명시적으로 설정
        
        // 캐시된 데이터 확인
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
          setIsLoading(false); // 캐시 데이터 로딩 완료
          return;
        }
  
        // 새로운 데이터 불러오기
        const response = await fetch(GITHUB_PAGES_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        // 캐시 업데이트
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
        setIsLoading(false); // 성공하든 실패하든 로딩 상태 해제
      }
    };
  
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    if (selectedCategory === "통합") return flashcardData;
    return flashcardData.filter(
      (item) => item.category.path === selectedCategory
    );
  }, [selectedCategory, flashcardData]);

  const shuffledData = useMemo(() => {
    if (isRandomOrder) {
      return [...filteredData].sort(() => Math.random() - 0.5);
    }
    return filteredData;
  }, [filteredData, isRandomOrder]);

  const nextCard = useCallback(() => {
    if (shuffledData.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % shuffledData.length);
  }, [shuffledData.length]);

  const prevCard = useCallback(() => {
    if (shuffledData.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? shuffledData.length - 1 : prev - 1
    );
  }, [shuffledData.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    let timer;
    if (isAutoPlay && shuffledData.length > 0) {
      timer = setInterval(nextCard, intervalTime * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [intervalTime, isAutoPlay, nextCard, shuffledData.length]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isAutoPlay) {
        switch (e.code) {
          case "Space":
          case "ArrowRight":
            nextCard();
            break;
          case "ArrowLeft":
            prevCard();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isAutoPlay, nextCard, prevCard]);

  const adjustInterval = (amount) => {
    if (!isAutoPlay) return;
    setIntervalTime((prev) => Math.max(1, prev + amount));
  };

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
                onClick={prevCard}
                className="absolute left-0 h-full px-4 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <ChevronLeft size={48} className="text-black" />
              </button>

              <img
                src={shuffledData[currentIndex].image}
                alt={shuffledData[currentIndex][`${language}_word`]}
                className="max-h-full object-contain"
                style={{ height: "60vh", margin: "0 60px" }}
              />

              <button
                onClick={nextCard}
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
                onClick={() => setSelectedCategory(category.path)}
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
