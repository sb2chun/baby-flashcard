// src/components/FlashcardApp/index.jsx
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ControlPanel from "./FlashcardApp/ControlPanel";
import MainContent from "./FlashcardApp/MainContent";
import CategorySidebar from "./FlashcardApp/CategorySidebar";
import useFlashcardData from "../hooks/useFlashcardData";

/**
 * FlashcardApp 메인 컴포넌트
 * 플래시카드 앱의 모든 상태와 로직을 관리하는 최상위 컴포넌트
 */
const FlashcardApp = () => {
  const controlPanelRef = useRef(null);
  // 기본 상태 관리
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(4);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [hideWordMode, setHideWordMode] = useState(false);
  const [language, setLanguage] = useState("kor");
  const [isRandomOrder, setIsRandomOrder] = useState(false);

  // 커스텀 훅을 통한 데이터 및 TTS 관리
  const { flashcardData, categories, isLoading } = useFlashcardData();

  const [selectedCategories, setSelectedCategories] = useState(
    new Set(["통합"])
  );

  // 선택된 카테고리에 따른 데이터 필터링
  const filteredData = useMemo(() => {
    if (selectedCategories.has("통합")) return flashcardData;
    return flashcardData.filter((item) =>
      selectedCategories.has(item.category.path)
    );
  }, [selectedCategories, flashcardData]);

  // 랜덤/순차 정렬 처리
  const shuffledData = useMemo(() => {
    if (isRandomOrder) {
      return [...filteredData].sort(() => Math.random() - 0.5);
    }
    return filteredData;
  }, [filteredData, isRandomOrder]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategories, filteredData]);

  // 자동 재생 타이머 관리
  useEffect(() => {
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
    };
  }, [intervalTime, isAutoPlay, currentIndex, shuffledData.length]);

  // 카드 변경 핸들러
  const handleCardChange = async (newIndex) => {
    if (shuffledData.length === 0) return;

    const nextIndex =
      newIndex >= 0 ? newIndex % shuffledData.length : shuffledData.length - 1;

    setCurrentIndex(nextIndex);
  };

  // 키보드 이벤트 처리 (수동 모드에서만 동작)
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
  }, [isAutoPlay, currentIndex, shuffledData.length]);

  // 프리로드 윈도우 크기 설정
  const PRELOAD_WINDOW_SIZE = 5; // 현재 카드 기준 앞뒤로 5장씩

  const [preloadStatus, setPreloadStatus] = useState({
    loaded: new Set(),
    loading: new Set(),
    failed: new Set()
  });

 // 이미지 프리로더 함수
 const preloadImage = async (imageUrl) => {
  if (!imageUrl) return;
  if (preloadStatus.loaded.has(imageUrl) || preloadStatus.loading.has(imageUrl)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    setPreloadStatus(prev => ({
      ...prev,
      loading: new Set([...prev.loading, imageUrl])
    }));

    img.onload = () => {
      setPreloadStatus(prev => ({
        ...prev,
        loaded: new Set([...prev.loaded, imageUrl]),
        loading: new Set([...prev.loading].filter(url => url !== imageUrl))
      }));
      resolve(imageUrl);
    };

    img.onerror = () => {
      setPreloadStatus(prev => ({
        ...prev,
        failed: new Set([...prev.failed, imageUrl]),
        loading: new Set([...prev.loading].filter(url => url !== imageUrl))
      }));
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };

    img.src = imageUrl;
  });
};

// 윈도우 범위의 이미지만 프리로드
const preloadWindowedImages = useCallback((centerIndex) => {
  if (!shuffledData || shuffledData.length === 0) return;

  const windowedImages = [];
  const dataLength = shuffledData.length;

  // 현재 인덱스를 중심으로 앞뒤로 PRELOAD_WINDOW_SIZE만큼의 이미지를 선택
  for (let offset = -PRELOAD_WINDOW_SIZE; offset <= PRELOAD_WINDOW_SIZE; offset++) {
    let index = centerIndex + offset;
    
    // 배열의 범위를 벗어나면 순환
    if (index < 0) index = dataLength + index;
    if (index >= dataLength) index = index - dataLength;

    const imageUrl = shuffledData[index]?.image;
    if (imageUrl) windowedImages.push(imageUrl);
  }

  // 선택된 윈도우 범위의 이미지만 프리로드
  Promise.all(
    windowedImages.map(imageUrl => preloadImage(imageUrl))
  ).catch(error => {
    console.error('Some images failed to preload:', error);
  });

  // 윈도우 밖의 이미지는 메모리에서 해제 (선택적)
  const clearOldImages = () => {
    const windowedImageSet = new Set(windowedImages);
    setPreloadStatus(prev => ({
      loaded: new Set([...prev.loaded].filter(url => windowedImageSet.has(url))),
      loading: new Set([...prev.loading].filter(url => windowedImageSet.has(url))),
      failed: new Set([...prev.failed].filter(url => windowedImageSet.has(url)))
    }));
  };

  // 메모리 관리가 중요한 경우에만 활성화
  // clearOldImages();
}, [shuffledData]);

// 카드 변경 시 윈도우 범위 업데이트
useEffect(() => {
  if (shuffledData && shuffledData.length > 0) {
    preloadWindowedImages(currentIndex);
  }
}, [currentIndex, preloadWindowedImages]);

// 카테고리 변경 시 새로운 윈도우 범위의 이미지만 프리로드
useEffect(() => {
  if (filteredData && filteredData.length > 0) {
    preloadWindowedImages(0); // 새 카테고리의 첫 번째 카드 기준으로 윈도우 설정
  }
}, [filteredData]);

  // 메인 렌더링
  return (
    <div className="flex flex-col">
      {/* 상단 컨트롤 패널 */}
      <ControlPanel
        ref={controlPanelRef}
        intervalTime={intervalTime}
        setIntervalTime={setIntervalTime}
        isAutoPlay={isAutoPlay}
        setIsAutoPlay={setIsAutoPlay}
        hideWordMode={hideWordMode}
        setHideWordMode={setHideWordMode}
        language={language}
        setLanguage={setLanguage}
        isRandomOrder={isRandomOrder}
        setIsRandomOrder={setIsRandomOrder}
      />
      <div className="flex flex-1">
        {/* 메인 콘텐츠 영역 */}
        <MainContent
          className="overflow-hidden"
          controlPanelRef={controlPanelRef}
          currentIndex={currentIndex}
          shuffledData={shuffledData}
          language={language}
          hideWordMode={hideWordMode}
          handleCardChange={handleCardChange}
          preloadStatus={preloadStatus}
          isImageLoaded={shuffledData[currentIndex]?.image ? 
            preloadStatus.loaded.has(shuffledData[currentIndex].image) : 
            false}
        />

        {/* 카테고리 사이드바 */}
        <CategorySidebar
          className="overflow-y-auto"
          controlPanelRef={controlPanelRef}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          language={language}
          flashcardData={flashcardData}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </div>
  );
};

export default FlashcardApp;
