import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import ControlPanel from "../components/FlashcardApp/ControlPanel";
import CategorySidebar from "../components/FlashcardApp/CategorySidebar";
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Book, Bookmark, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Alert, AlertDescription } from '../components/ui/Alert';
import useFlashcardData from "../hooks/useFlashcardData";
import CardDetailContent from '../components/FlashcardApp/CardDetailContent';

const CardDetailPage = () => {
  const [language, setLanguage] = useState("");
  const { flashcardData, categories } = useFlashcardData();
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState(
    new Set(["통합"])
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const languageParam = queryParams.get("language");
    if (languageParam) {
      setLanguage(languageParam);  // Set the language state from the query parameter
    }
  }, [location]);

  const [cardDetails, setCardDetails] = useState({});

  useEffect(() => {
    fetch("https://sb2chun.github.io/baby-flashcard/card_details.json")
      .then((res) => res.json())
      .then((data) => setCardDetails(data));
  }, []);
  
  const navigate = useNavigate();

  //////
  const controlPanelRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
    // 이미지 프리로더 함수
  const preloadImage = async (imageUrl) => {
    if (!imageUrl) return;
    if (
      preloadStatus.loaded.has(imageUrl) ||
      preloadStatus.loading.has(imageUrl)
    ) {
      return;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      setPreloadStatus((prev) => ({
        ...prev,
        loading: new Set([...prev.loading, imageUrl]),
      }));

      img.onload = () => {
        setPreloadStatus((prev) => ({
          ...prev,
          loaded: new Set([...prev.loaded, imageUrl]),
          loading: new Set([...prev.loading].filter((url) => url !== imageUrl)),
        }));
        resolve(imageUrl);
      };

      img.onerror = () => {
        setPreloadStatus((prev) => ({
          ...prev,
          failed: new Set([...prev.failed, imageUrl]),
          loading: new Set([...prev.loading].filter((url) => url !== imageUrl)),
        }));
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };

      img.src = imageUrl;
    });
  };
  const filteredData = useMemo(() => {
    if (selectedCategories.has("통합")) return flashcardData;
    return flashcardData.filter((item) =>
      selectedCategories.has(item.category.path)
    );
  }, [selectedCategories, flashcardData]);

  const shuffledData = useMemo(() => {
    return [...filteredData].sort(() => Math.random() - 0.5);
  }, [filteredData]);

  // 프리로드 윈도우 크기 설정
  const PRELOAD_WINDOW_SIZE = 5; // 현재 카드 기준 앞뒤로 5장씩

  const [preloadStatus, setPreloadStatus] = useState({
    loaded: new Set(),
    loading: new Set(),
    failed: new Set(),
  });
  
  // 윈도우 범위의 이미지만 프리로드
  const preloadWindowedImages = useCallback(
    (centerIndex) => {
      if (!shuffledData || shuffledData.length === 0) return;

      const windowedImages = [];
      const dataLength = shuffledData.length;

      // 현재 인덱스를 중심으로 앞뒤로 PRELOAD_WINDOW_SIZE만큼의 이미지를 선택
      for (
        let offset = -PRELOAD_WINDOW_SIZE;
        offset <= PRELOAD_WINDOW_SIZE;
        offset++
      ) {
        let index = centerIndex + offset;

        // 배열의 범위를 벗어나면 순환
        if (index < 0) index = dataLength + index;
        if (index >= dataLength) index = index - dataLength;

        const imageUrl = shuffledData[index]?.image;
        if (imageUrl) windowedImages.push(imageUrl);
      }

      // 선택된 윈도우 범위의 이미지만 프리로드
      Promise.all(
        windowedImages.map((imageUrl) => preloadImage(imageUrl))
      ).catch((error) => {
        console.error("Some images failed to preload:", error);
      });
    },
    [shuffledData]
  );

  // 카드 변경 핸들러
  const handleCardChange = async (newIndex) => {
    if (shuffledData.length === 0) return;

    const nextIndex =
      newIndex >= 0 ? newIndex % shuffledData.length : shuffledData.length - 1;

    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    if (shuffledData && shuffledData.length > 0) {
      preloadWindowedImages(currentIndex);
    }
  }, [currentIndex, preloadWindowedImages]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategories, filteredData]);

  
  // 카테고리 변경 시 새로운 윈도우 범위의 이미지만 프리로드
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      preloadWindowedImages(0); // 새 카테고리의 첫 번째 카드 기준으로 윈도우 설정
    }
  }, [filteredData]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Navigation Header */}
    <ControlPanel
      ref={controlPanelRef}
      language={language}
      setLanguage={setLanguage}
    />

      {/* Main Content */}
      <div className="flex flex-row md:flex-row w-full">

      <CardDetailContent
        controlPanelRef={controlPanelRef}
        currentIndex={currentIndex}
        shuffledData={shuffledData}
        language={language}
        handleCardChange={handleCardChange}
        isImageLoaded={shuffledData[currentIndex]?.image ? 
            preloadStatus.loaded.has(shuffledData[currentIndex].image) : 
            false}
        isFlashcard={false}
      />

      {/* Category Sidebar */}
      <CategorySidebar
        controlPanelRef={controlPanelRef}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        language={language}
        flashcardData={flashcardData}
        setCurrentIndex={setCurrentIndex}
        filterAll={false}
      />
      </div>
    </div>
  );
};

export default CardDetailPage;