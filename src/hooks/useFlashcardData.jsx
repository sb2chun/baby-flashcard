// src/hooks/useFlashcardData.js
import { useState, useEffect } from 'react';
import { GITHUB_PAGES_URL, CACHE_KEY, CACHE_DURATION } from '../constants';

const useFlashcardData = () => {
  const [flashcardData, setFlashcardData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // 캐시된 데이터 확인
        const cached = localStorage.getItem(CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);

        // 유효한 캐시가 있는 경우
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

        // 새로운 데이터 로드
        const response = await fetch(GITHUB_PAGES_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 캐시 업데이트
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());

        // 상태 업데이트
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

  return {
    flashcardData,
    categories,
    isLoading
  };
};

export default useFlashcardData;