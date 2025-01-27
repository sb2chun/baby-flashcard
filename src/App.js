import { useState, useEffect } from "react";
import "./App.css";
import "./styles/index.css";
import FlashCardApp from "./components/FlashcardApp";

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile
    const checkMobileDevice = () => {
      const mobileCheck =
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobileCheck);
    };

    // Initial check
    checkMobileDevice();

    // Add resize listener
    window.addEventListener("resize", checkMobileDevice);

    // Cleanup listener
    return () => window.removeEventListener("resize", checkMobileDevice);
  }, []);

  return (
    <div className="App relative min-h-screen flex flex-col">
      <FlashCardApp />

      {/* 모바일 환경에서만 footer 렌더링 */}
      {isMobile && (
        <footer className="absolute bottom-0 left-0 w-full text-center py-2 bg-gray-100">
          모바일에서 더 나은 화면을 원하신다면, 브라우저 설정에서 '데스크톱
          버전'을 선택해주세요.
        </footer>
      )}
    </div>
  );
};

export default App;
