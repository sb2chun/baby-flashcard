// src/components/FlashcardApp/index.jsx
import { useState, useEffect, useMemo } from 'react';
import ControlPanel from './FlashcardApp/ControlPanel';
import MainContent from './FlashcardApp/MainContent';
import CategorySidebar from './FlashcardApp/CategorySidebar';
import useFlashcardData from '../hooks/useFlashcardData';
import useTTS from '../hooks/useTTS';

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
  const { 
    flashcardData, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    isLoading 
  } = useFlashcardData();

  const { 
    isTTSEnabled, 
    setIsTTSEnabled, 
    speakWord, 
    isSpeaking,
    cancelCurrentSpeech 
  } = useTTS();

  // 선택된 카테고리에 따른 데이터 필터링
  const filteredData = useMemo(() => {
    if (selectedCategory === "통합") return flashcardData;
    return flashcardData.filter(item => item.category.path === selectedCategory);
  }, [selectedCategory, flashcardData]);

  // 랜덤/순차 정렬 처리
  const shuffledData = useMemo(() => {
    if (isRandomOrder) {
      return [...filteredData].sort(() => Math.random() - 0.5);
    }
    return filteredData;
  }, [filteredData, isRandomOrder]);

  // 카테고리 변경 시 카드 인덱스 초기화
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, filteredData]);

  // 카드 변경 핸들러
  const handleCardChange = async (newIndex) => {
    if (shuffledData.length === 0) return;

    cancelCurrentSpeech();
    const nextIndex = newIndex >= 0 ? newIndex % shuffledData.length : shuffledData.length - 1;

    setCurrentIndex(nextIndex);

    if (isTTSEnabled) {
      const word = shuffledData[nextIndex][`${language}_word`];
      if (word) {
        setTimeout(() => {
          speakWord(word).catch(console.error);
        }, 50);
      }
    }
  };

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
      cancelCurrentSpeech();
    };
  }, [intervalTime, isAutoPlay, currentIndex, shuffledData.length, cancelCurrentSpeech]);

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
            handleCardChange(currentIndex === 0 ? shuffledData.length - 1 : currentIndex - 1);
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
    <div className="flex h-screen overflow-hidden">
      {/* 상단 컨트롤 패널 */}
      <ControlPanel 
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

      {/* 메인 콘텐츠 영역 */}
      <MainContent 
        currentIndex={currentIndex}
        shuffledData={shuffledData}
        language={language}
        hideWordMode={hideWordMode}
        handleCardChange={handleCardChange}
      />

      {/* 카테고리 사이드바 */}
      <CategorySidebar 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        language={language}
        flashcardData={flashcardData}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
};

export default FlashcardApp;