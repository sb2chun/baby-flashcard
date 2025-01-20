import { useState, useEffect, useCallback, useMemo } from "react";
import { Timer, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";

// GitHub API 관련 상수
const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "sb2chun";
const REPO_NAME = "baby-flashcard-repo";
const GITHUB_RAW_CONTENT = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/refs/heads/master`;

// 캐시 관련 상수
const CACHE_DURATION = 60 * 60 * 1000; // 60분

const checkRateLimit = async () => {
  const response = await fetch("https://api.github.com/rate_limit");
  const data = await response.json();
  const remainingRequests = data.resources.core.remaining;
  const resetTime = data.resources.core.reset;
  return { remainingRequests, resetTime };
};

const waitUntilRateLimitResets = async (resetTime) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const waitTime = resetTime - currentTime;

  if (waitTime > 0) {
    console.log(`Rate limit 초과. ${waitTime}초 후 재시도.`);
    alert(`Rate limit 초과. ${waitTime}초 후 재시도.`);
    await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
  }
};

// 캐시된 데이터 가져오기 함수
const fetchWithConditionalGet = async (url, etags = {}) => {
  const headers = new Headers();
  if (etags[url]) {
    headers.append("If-None-Match", etags[url]);
  }

  const cachedData = localStorage.getItem(url);
  const cacheTimestamp = localStorage.getItem(`${url}_timestamp`);

  if (
    cachedData &&
    cacheTimestamp &&
    Date.now() - Number(cacheTimestamp) < CACHE_DURATION
  ) {
    console.log(`cache checked`)
    return JSON.parse(cachedData);
  }

  const response = await fetch(url, { headers });

  if (response.headers.get("etag")) {
    etags[url] = response.headers.get("etag");
    localStorage.setItem("etags", JSON.stringify(etags));
  }

  if (response.status === 304 && cachedData) {
    console.log(`cached checked - 304`)
    return JSON.parse(cachedData);
  }

  console.log(`get github api`)
  const data = await response.json();
  localStorage.setItem(url, JSON.stringify(data));
  localStorage.setItem(`${url}_timestamp`, Date.now().toString());
  return data;
};

// 모든 컨텐츠를 한 번에 가져오는 최적화된 함수
const fetchAllContent = async () => {
  try {
    const etags = JSON.parse(localStorage.getItem("etags") || "{}");
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/master?recursive=1`;
    
    const response = await fetchWithConditionalGet(url, etags);
    
    const tree = response.tree || [];
    const directories = new Map();
    const images = new Map();
    
    tree.forEach(item => {
      const pathParts = item.path.split('/');
      
      if (pathParts.length === 1 && !item.path.includes('.')) {
        const [korName, engName] = pathParts[0].split('_');
        directories.set(item.path, { path: item.path, korName, engName });
      } else if (pathParts.length === 2 && item.path.endsWith('.png')) {
        const dirPath = pathParts[0];
        if (!images.has(dirPath)) {
          images.set(dirPath, []);
        }
        images.get(dirPath).push({
          name: pathParts[1],
          url: `${GITHUB_RAW_CONTENT}/${item.path}`
        });
      }
    });

    const categories = Array.from(directories.values());
    const processedData = categories.map(category => {
      const categoryImages = images.get(category.path) || [];
      return categoryImages.map((image, index) => {
        const { korWord, engWord } = parseImageName(image.name);
        return {
          id: `${category.path}-${index + 1}`,
          image: image.url,
          backgroundColor: generateRandomColor(),
          kor_word: korWord,
          eng_word: engWord,
          category: {
            path: category.path,
            kor: category.korName,
            eng: category.engName,
          },
        };
      });
    });

    return {
      categories: [
        { path: "통합", korName: "통합", engName: "All" },
        ...categories
      ],
      flashcards: processedData.flat()
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { categories: [], flashcards: [] };
  }
};

const parseImageName = (filename) => {
  const nameWithoutExt = filename.replace(".png", "");
  const [korWord, engWord] = nameWithoutExt.split("_");
  return { korWord, engWord };
};

const generateRandomColor = () => {
  const colors = [
    "#FFB6C1", "#FFEB3B", "#9C27B0", "#FF9800", "#795548",
    "#607D8B", "#E91E63", "#2196F3", "#4CAF50",
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

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { remainingRequests, resetTime } = await checkRateLimit();
        
        if (remainingRequests === 0) {
          await waitUntilRateLimitResets(resetTime);
        }

        const { categories: loadedCategories, flashcards } = await fetchAllContent();
        
        setCategories(loadedCategories);
        setFlashcardData(flashcards);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("데이터 로딩 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    if (selectedCategory === "통합") return flashcardData;
    return flashcardData.filter(item => item.category.path === selectedCategory);
  }, [selectedCategory, flashcardData]);

  const shuffledData = useMemo(() => {
    if (isRandomOrder) {
      return [...filteredData].sort(() => Math.random() - 0.5);
    }
    return filteredData;
  }, [filteredData, isRandomOrder]);

  const nextCard = useCallback(() => {
    if (shuffledData.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % shuffledData.length);
  }, [shuffledData.length]);

  const prevCard = useCallback(() => {
    if (shuffledData.length === 0) return;
    setCurrentIndex(prev => prev === 0 ? shuffledData.length - 1 : prev - 1);
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
    setIntervalTime(prev => Math.max(1, prev + amount));
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
          <div className={`flex items-center gap-2 ${!isAutoPlay ? "opacity-50 pointer-events-none" : ""}`}>
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
              className={`px-4 py-2 rounded ${hideWordMode ? "bg-green-500 text-white" : "bg-gray-100"}`}
            >
              단어 숨김
            </button>
            <button
              onClick={() => setHideWordMode(false)}
              className={`px-4 py-2 rounded ${!hideWordMode ? "bg-green-500 text-white" : "bg-gray-100"}`}
            >
              단어 보임
            </button>
          </div>

          <div className="flex">
            <button
              onClick={() => setIsAutoPlay(true)}
              className={`px-4 py-2 rounded ${isAutoPlay ? "bg-green-500 text-white" : "bg-gray-100"}`}
            >
              자동
            </button>
            <button
              onClick={() => setIsAutoPlay(false)}
              className={`px-4 py-2 rounded ${!isAutoPlay ? "bg-green-500 text-white" : "bg-gray-100"}`}
            >
              수동
            </button>
          </div>

          <div className="flex">
            <button
              onClick={() => setIsRandomOrder(true)}
              className={`px-4 py-2 rounded ${isRandomOrder ? "bg-green-500 text-white" : "bg-gray-100"}`}
            >
              랜덤
            </button>
            <button
              onClick={() => setIsRandomOrder(false)}
              className={`px-4 py-2 rounded ${!isRandomOrder ? "bg-green-500 text-white" : "bg-gray-100"}`}
            >
              순차
            </button>
          </div>

          <div className="flex gap-2 absolute right-0">
            <button
              onClick={() => setLanguage("kor")}
              className={`px-4 py-2 rounded ${language === "kor" ? "bg-purple-500 text-white" : "bg-gray-100"}`}
            >
              한글
            </button>
            <button
              onClick={() => setLanguage("eng")}
              className={`px-4 py-2 rounded ${language === "eng" ? "bg-purple-500 text-white" : "bg-gray-100"}`}
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
