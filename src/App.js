import './App.css';
import './styles/index.css'
import FlashCardApp from './components/FlashcardApp'

function App() {
  return (
    <div className="App">
      <FlashCardApp />
    </div>
  );
}

export default App;


// // src/App.js
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { ControlPanel } from './components/controls/ControlPanel';
// import { CategorySidebar } from './components/CategorySidebar';
// import { Flashcard } from './components/Flashcard';
// import { useTTS } from './hooks/useTTS';
// import { GITHUB_PAGES_URL, CACHE_KEY, CACHE_DURATION } from './components/constants';

// const FlashcardApp = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [intervalTime, setIntervalTime] = useState(4);
//   const [isAutoPlay, setIsAutoPlay] = useState(true);
//   const [hideWordMode, setHideWordMode] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("통합");
//   const [categories, setCategories] = useState([]);
//   const [flashcardData, setFlashcardData] = useState([]);
//   const [language, setLanguage] = useState("kor");
//   const [isRandomOrder, setIsRandomOrder] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const tts = useTTS(language);

//   // 선택된 카테고리에 따른 데이터 필터링
//   const filteredData = useMemo(() => {
//     if (selectedCategory === "통합") return flashcardData;
//     return flashcardData.filter((item) => item.category.path === selectedCategory);
//   }, [selectedCategory, flashcardData]);

//   // 랜덤/순차 정렬에 따른 데이터 정렬
//   const shuffledData = useMemo(() => {
//     if (isRandomOrder) {
//       return [...filteredData].sort(() => Math.random() - 0.5);
//     }
//     return filteredData;
//   }, [filteredData, isRandomOrder]);

//   const handleCardChange = useCallback(
//     async (newIndex) => {
//       if (shuffledData.length === 0) return;

//       tts.cancelCurrentSpeech();

//       // Ensure newIndex is within bounds
//       const safeIndex = ((newIndex % shuffledData.length) + shuffledData.length) % shuffledData.length;
//       setCurrentIndex(safeIndex);

//       if (tts.isTTSEnabled) {
//         const word = shuffledData[safeIndex][`${language}_word`];
//         if (word) {
//           tts.speakTimeoutRef.current = setTimeout(() => {
//             tts.speakWord(word);
//           }, 300);
//         }
//       }
//     },
//     [shuffledData, language, tts]
//   );

//   // 자동 재생 타이머
//   useEffect(() => {
//     let timer;
//     if (isAutoPlay && shuffledData.length > 0) {
//       const runTimer = () => {
//         handleCardChange(currentIndex + 1);
//         timer = setTimeout(runTimer, intervalTime * 1000);
//       };
//       timer = setTimeout(runTimer, intervalTime * 1000);
//     }

//     return () => {
//       if (timer) clearTimeout(timer);
//       tts.cancelCurrentSpeech();
//     };
//   }, [intervalTime, isAutoPlay, handleCardChange, currentIndex, shuffledData.length, tts]);

//   // 키보드 이벤트 처리
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (!isAutoPlay) {
//         switch (e.code) {
//           case "Space":
//           case "ArrowRight":
//             handleCardChange(currentIndex + 1);
//             break;
//           case "ArrowLeft":
//             handleCardChange(
//               currentIndex === 0 ? shuffledData.length - 1 : currentIndex - 1
//             );
//             break;
//           default:
//             break;
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [isAutoPlay, handleCardChange, currentIndex, shuffledData.length]);

//   // 데이터 로딩
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsLoading(true);

//         const cached = localStorage.getItem(CACHE_KEY);
//         const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);

//         if (
//           cached &&
//           cacheTimestamp &&
//           Date.now() - Number(cacheTimestamp) < CACHE_DURATION
//         ) {
//           const parsedData = JSON.parse(cached);
//           setCategories([
//             { path: "통합", korName: "통합", engName: "All" },
//             ...parsedData.categories.map((cat) => ({
//               path: cat.path,
//               korName: cat.korName,
//               engName: cat.engName,
//             })),
//           ]);
//           setFlashcardData(parsedData.categories.flatMap((cat) => cat.items));
//           setIsLoading(false);
//           return;
//         }

//         const response = await fetch(GITHUB_PAGES_URL);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();

//         localStorage.setItem(CACHE_KEY, JSON.stringify(data));
//         localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());

//         setCategories([
//           { path: "통합", korName: "통합", engName: "All" },
//           ...data.categories.map((cat) => ({
//             path: cat.path,
//             korName: cat.korName,
//             engName: cat.engName,
//           })),
//         ]);
//         setFlashcardData(data.categories.flatMap((cat) => cat.items));
//       } catch (error) {
//         console.error("Error loading data:", error);
//         alert("데이터 로딩 중 오류가 발생했습니다.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // 카테고리 변경 시 인덱스 초기화
//   useEffect(() => {
//     setCurrentIndex(0);
//   }, [selectedCategory]);

//   const adjustInterval = (amount) => {
//     if (!isAutoPlay) return;
//     setIntervalTime((prev) => Math.max(1, prev + amount));
//   };

//   if (isLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="text-xl">로딩 중...</div>
//       </div>
//     );
//   }

//   const controlPanelProps = {
//     isAutoPlay,
//     intervalTime,
//     adjustInterval,
//     hideWordMode,
//     setHideWordMode,
//     setIsAutoPlay,
//     isRandomOrder,
//     setIsRandomOrder,
//     isTTSEnabled: tts.isTTSEnabled,
//     setIsTTSEnabled: tts.setIsTTSEnabled,
//     isSpeaking: tts.isSpeaking,
//     language,
//     setLanguage
//   };

//   const categorySidebarProps = {
//     categories,
//     selectedCategory,
//     setSelectedCategory,
//     flashcardData,
//     language
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <ControlPanel {...controlPanelProps} />
//       <div className="flex-1 mt-[10vh] h-[80vh] overflow-hidden">
//         {shuffledData.length > 0 ? (
//           <Flashcard
//             currentCard={shuffledData[currentIndex]}
//             hideWordMode={hideWordMode}
//             language={language}
//             onPrevious={() => handleCardChange(currentIndex - 1)}
//             onNext={() => handleCardChange(currentIndex + 1)}
//           />
//         ) : (
//           <div className="h-full flex items-center justify-center bg-gray-200">
//             <p>이 카테고리에는 카드가 없습니다.</p>
//           </div>
//         )}
//       </div>
//       <CategorySidebar {...categorySidebarProps} />
//     </div>
//   );
// };

// export default FlashcardApp;