// src/components/FlashcardApp/index.jsx
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ControlPanel from "../components/FlashcardApp/ControlPanel";
import MainContent from "../components/FlashcardApp/MainContent";
import CategorySidebar from "../components/FlashcardApp/CategorySidebar";
import useFlashcardData from "../hooks/useFlashcardData";
import { useLocation } from "react-router-dom";
import useTTS from "../hooks/useTTS"; // TTS 커스텀 훅 import

/**
 * FlashcardApp 메인 컴포넌트
 * 플래시카드 앱의 모든 상태와 로직을 관리하는 최상위 컴포넌트
 */
const FlashcardPage = () => {
  const controlPanelRef = useRef(null);
  // 기본 상태 관리
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(4);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [hideWordMode, setHideWordMode] = useState(false);
  const [language, setLanguage] = useState("");
  const [isRandomOrder, setIsRandomOrder] = useState(false);
  const [skipTtsForCurrentCard, setSkipTtsForCurrentCard] = useState(false); // 현재 카드 TTS 스킵 상태

  // 커스텀 훅을 통한 데이터 및 TTS 관리
  const { flashcardData, categories } = useFlashcardData();

  const [selectedCategories, setSelectedCategories] = useState(
    new Set(["통합"])
  );

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const languageParam = queryParams.get("language");
    if (languageParam) {
      setLanguage(languageParam); // Set the language state from the query parameter
    }
  }, [location]);

  // TTS 관련 상태 추가
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);

  // TTS 커스텀 훅 사용
  const { speak, cancelSpeech, isSpeaking } = useTTS({
    enabled: isTtsEnabled,
    language: language, // 현재 언어 설정
  });

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
  
  // TTS 실행 헬퍼 함수
  const speakWord = useCallback((word) => {
    if (isTtsEnabled && word) {
      setTimeout(() => {
        if (!isSpeaking()) {
          cancelSpeech();
          speak(word);
        }
      }, 100);
    }
  }, [isTtsEnabled, isSpeaking, speak, cancelSpeech]);
  
  // 언어 변경 처리 함수 - 즉시 읽기 제거
  const handleLanguageChange = useCallback((newLanguage) => {
    // 새 언어로 상태 업데이트
    setLanguage(newLanguage);
    
    // 현재 카드는 TTS 스킵 설정
    setSkipTtsForCurrentCard(true);
    
    // 기존 TTS 취소 (현재 읽고 있던 것 중지)
    // cancelSpeech();
  }, [cancelSpeech]);

  // 카드 변경 함수
  const handleCardChange = useCallback(
    (newIndex) => {
      if (shuffledData.length === 0) return;
  
      const nextIndex = newIndex >= 0 ? newIndex % shuffledData.length : shuffledData.length - 1;
  
      // 기존 TTS 취소
      cancelSpeech();
  
      // 새 인덱스로 업데이트
      setCurrentIndex(nextIndex);
  
      // TTS 스킵 상태가 아니면 읽기
      if (!skipTtsForCurrentCard) {
        const currentWord = shuffledData[nextIndex][`${language}_word`];
        speakWord(currentWord);
      } else {
        // 다음 카드부터는 다시 읽도록 스킵 상태 해제
        setSkipTtsForCurrentCard(false);
      }
    },
    [shuffledData, cancelSpeech, language, speakWord, skipTtsForCurrentCard]
  );

  // 컴포넌트 마운트/업데이트 시 초기 카드 설정
  useEffect(() => {
    if (shuffledData.length > 0 && !skipTtsForCurrentCard) {
      // 스킵 상태가 아닐 때만 TTS 실행
      const currentWord = shuffledData[currentIndex][`${language}_word`];
      speakWord(currentWord);
    }
  }, [shuffledData, currentIndex, language, speakWord, skipTtsForCurrentCard]);

  // 카테고리 변경 시 처리
  useEffect(() => {
    setCurrentIndex(0);
    setSkipTtsForCurrentCard(false); // 카테고리 변경 시 스킵 상태 초기화
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
  }, [intervalTime, isAutoPlay, currentIndex, shuffledData.length, handleCardChange]);

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
  }, [isAutoPlay, currentIndex, shuffledData.length, handleCardChange]);

  // 프리로드 윈도우 크기 설정
  const PRELOAD_WINDOW_SIZE = 5; // 현재 카드 기준 앞뒤로 5장씩

  const [preloadStatus, setPreloadStatus] = useState({
    loaded: new Set(),
    loading: new Set(),
    failed: new Set(),
  });

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
  }, [filteredData, preloadWindowedImages]);

  // 메인 렌더링
  return (
    <div className="min-h-screen">
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
        setLanguage={handleLanguageChange} // 언어 변경 처리 함수 전달
        isRandomOrder={isRandomOrder}
        setIsRandomOrder={setIsRandomOrder}
        isFlashcard={true}
        isTtsEnabled={isTtsEnabled}
        setIsTtsEnabled={setIsTtsEnabled}
      />
      <div className="flex flex-1 bg-gradient-to-b from-blue-50 to-purple-50">
        {/* 메인 콘텐츠 영역 */}
        <MainContent
          controlPanelRef={controlPanelRef}
          currentIndex={currentIndex}
          shuffledData={shuffledData}
          language={language}
          hideWordMode={hideWordMode}
          handleCardChange={handleCardChange}
          preloadStatus={preloadStatus}
          isImageLoaded={
            shuffledData[currentIndex]?.image
              ? preloadStatus.loaded.has(shuffledData[currentIndex].image)
              : false
          }
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
        />
      </div>
    </div>
  );
};

export default FlashcardPage;