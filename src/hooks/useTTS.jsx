// src/hooks/useTTS.js
import { useState, useRef, useCallback } from "react";

const useTTS = () => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const speakTimeoutRef = useRef(null);
  const [language, setLanguage] = useState("kor");

  const cancelCurrentSpeech = useCallback(() => {
    if (!speechSynthRef.current) return;

    if (currentUtteranceRef.current) {
      speechSynthRef.current.cancel();
      currentUtteranceRef.current = null;
    }
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    setIsSpeaking(false);
  }, []);
  
  const speakWord = useCallback(
    async (word) => {
      if (!speechSynthRef.current || !isTTSEnabled || !word) return;

      try {
        // 이전 발화 취소
        cancelCurrentSpeech();

        // 딜레이를 50ms로 줄임
        await new Promise((resolve) => setTimeout(resolve, 50));

        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(word);
          const targetLang = language === "kor" ? "ko" : "en";
          utterance.lang = language === "kor" ? "ko-KR" : "en-US";

          const availableVoices = voices.filter((voice) =>
            voice.lang.toLowerCase().startsWith(targetLang.toLowerCase())
          );

          if (availableVoices.length > 0) {
            utterance.voice = availableVoices[0];
          }

          utterance.volume = 1;
          utterance.rate = 1;
          utterance.pitch = 1;

          utterance.onstart = () => {
            setIsSpeaking(true);
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            resolve();
          };

          utterance.onerror = (event) => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            if (event.error !== "interrupted") {
              reject(event);
            } else {
              resolve();
            }
          };

          currentUtteranceRef.current = utterance;
          speechSynthRef.current.speak(utterance);
        });
      } catch (error) {
        console.error("TTS Speak Error:", error);
        setIsSpeaking(false);
      }
    },
    [isTTSEnabled, language, voices, cancelCurrentSpeech]
  );



  return {
    isTTSEnabled,
    setIsTTSEnabled,
    speakWord,
    isSpeaking,
    cancelCurrentSpeech,
  };
};

export default useTTS;
