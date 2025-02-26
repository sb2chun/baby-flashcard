// src/hooks/useTTS.js
import { useRef, useCallback } from 'react';

/**
 * TTS(Text-to-Speech) 기능을 위한 커스텀 훅
 * @param {Object} options - TTS 옵션
 * @param {boolean} options.enabled - TTS 활성화 여부
 * @param {string} options.language - 언어 설정 ('kor' 또는 'eng')
 * @returns {Object} - speak 함수와 cancelSpeech 함수
 */
const useTTS = ({ enabled, language }) => {
  const speechSynthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // 현재 말하고 있는지 확인하는 함수
  const isSpeaking = useCallback(() => {
    return speechSynthRef.current.speaking;
  }, []);

  // TTS 취소 함수
  const cancelSpeech = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  }, []);
  
  const speak = useCallback(
    (text) => {
  
      if (!enabled || !text) return Promise.resolve(0);
  
      // 기존 음성 즉시 취소
      cancelSpeech();
  
      return new Promise((resolve) => {
        setTimeout(() => {
          // 새 발화 객체 생성
          utteranceRef.current = new SpeechSynthesisUtterance(text);
  
          // 언어 설정
          utteranceRef.current.lang = language === 'kor' ? 'ko-KR' : 'en-US';
  
          // 발화 속도
          utteranceRef.current.rate = 1.0;
  
          // 발화 종료 이벤트
          utteranceRef.current.onend = () => {
            const duration = Math.ceil(utteranceRef.current.text.length / 5);
            resolve(duration);
          };
  
          // 발화 시작
          speechSynthRef.current.speak(utteranceRef.current);
        }, 0);
      });
    },
    [enabled, language, cancelSpeech]
  );
  

  return { speak, cancelSpeech, isSpeaking };
};

export default useTTS;