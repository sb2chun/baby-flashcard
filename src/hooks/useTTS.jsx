import { useRef, useCallback, useEffect } from 'react';

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

  // 음성 목록을 가져오는 헬퍼 함수
  const getVoices = useCallback(() => {
    return new Promise((resolve) => {
      const voices = speechSynthRef.current.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        // 음성이 아직 로드되지 않았다면 이벤트를 기다림
        const onVoicesChanged = () => {
          speechSynthRef.current.removeEventListener('voiceschanged', onVoicesChanged);
          resolve(speechSynthRef.current.getVoices());
        };
        speechSynthRef.current.addEventListener('voiceschanged', onVoicesChanged);
      }
    });
  }, []);

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

  // 텍스트를 음성으로 변환하는 함수
  const speak = useCallback(
    async (text) => {
      if (!enabled || !text) return Promise.resolve(0);

      // 기존 음성 즉시 취소
      cancelSpeech();

      return new Promise(async (resolve) => {
        try {
          // 음성 목록 가져오기 (비동기적으로)
          const voices = await getVoices();

          // 새 발화 객체 생성
          utteranceRef.current = new SpeechSynthesisUtterance(text);

          // 언어 설정
          utteranceRef.current.lang = language === 'kor' ? 'ko-KR' : 'en-US';

          // 영어 음성 선택
          if (language === 'eng') {
            let englishVoice = voices.find(voice => voice.lang === 'en-US' && !voice.name.includes('Google'));
            if (!englishVoice) {
              englishVoice = voices.find(voice => voice.lang.includes('en'));
            }

            if (englishVoice) {
              utteranceRef.current.voice = englishVoice;
              console.log("Selected English voice:", englishVoice.name, englishVoice.lang);
            }
          }

          // 발화 속도 및 피치 설정
          utteranceRef.current.rate = 1.0; // 기본 속도
          utteranceRef.current.pitch = 1.0; // 기본 피치

          // 발화 종료 이벤트
          utteranceRef.current.onend = () => {
            const duration = Math.ceil(utteranceRef.current.text.length / 5);
            resolve(duration);
          };

          // 발화 시작
          speechSynthRef.current.speak(utteranceRef.current);
        } catch (error) {
          console.error("TTS error:", error);
          resolve(0);
        }
      });
    },
    [enabled, language, cancelSpeech, getVoices]
  );

  return { speak, cancelSpeech, isSpeaking };
};

export default useTTS;
