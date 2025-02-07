// src/components/FlashcardApp/index.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import ControlPanel from "./FlashcardApp/ControlPanel";
import MainContent from "./FlashcardApp/MainContent";
import CategorySidebar from "./FlashcardApp/CategorySidebar";
import useFlashcardData from "../hooks/useFlashcardData";
import useTTS from "../hooks/useTTS";

/**
 * FlashcardApp 메인 컴포넌트
 * 플래시카드 앱의 모든 상태와 로직을 관리하는 최상위 컴포넌트
 */
const FlashcardApp = () => {
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

  const {
    isTTSEnabled,
    setIsTTSEnabled,
    speakWord,
    isSpeaking,
    cancelCurrentSpeech,
  } = useTTS();

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

  const preloadedImagesRef = useRef(new Set());
  const controlPanelRef = useRef(null);

  // 이미지 미리 로드하는 함수
  const preloadImages = (images) => {
    images.forEach((image) => {
      // 이미지가 이미 로드된 경우, 중복해서 로드하지 않음
      if (!preloadedImagesRef.current.has(image)) {
        const img = new Image();
        img.src = image;
        preloadedImagesRef.current.add(image); // 로드된 이미지로 기록
      }
    });
  };

  // 앱 로드 시 전체 이미지 프리로드
  useEffect(() => {
    if (!isLoading && flashcardData.length > 0) {
      const allImages = flashcardData.map((item) => item.image);
      preloadImages(allImages);
    }
  }, [isLoading, flashcardData]);

  useEffect(() => {
    // 현재 카테고리의 이미지들을 미리 로드
    const imagesToPreload = filteredData.map((item) => item.image);
    preloadImages(imagesToPreload);
  }, [filteredData]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategories, filteredData]);

  // 카드 변경 핸들러
  const handleCardChange = async (newIndex) => {
    if (shuffledData.length === 0) return;

    cancelCurrentSpeech();
    const nextIndex =
      newIndex >= 0 ? newIndex % shuffledData.length : shuffledData.length - 1;

    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    // 페이지가 완전히 렌더링된 후 스크롤을 맨 위로 올림
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }, 0);
  }, []);

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

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

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
        isTTSEnabled={isTTSEnabled}
        setIsTTSEnabled={setIsTTSEnabled}
        isSpeaking={isSpeaking}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* 메인 콘텐츠 영역 */}
        <MainContent
          controlPanelRef={controlPanelRef}
          currentIndex={currentIndex}
          shuffledData={shuffledData}
          language={language}
          hideWordMode={hideWordMode}
          handleCardChange={handleCardChange}
        />

        {/* 카테고리 사이드바 */}
        <CategorySidebar
          controlPanelRef={controlPanelRef}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          language={language}
          flashcardData={flashcardData}
          setCurrentIndex={setCurrentIndex}
          className="overflow-y-auto"
        />
      </div>
    </div>
  );
};

export default FlashcardApp;
