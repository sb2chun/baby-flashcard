import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { BookOpen, Pointer, Star, Mail } from "lucide-react";
import emailjs from '@emailjs/browser';

const GuidePage = ({  }) => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");
  const form = useRef();

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const languageParam = queryParams.get("language");
    if (languageParam) {
      setLanguage(languageParam);  // Set the language state from the query parameter
    }
  }, [location]);

  
  const sendFeedback = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setStatus(
        language === "kor" ? "피드백을 입력해주세요." : "Please enter feedback."
      );
      return;
    }
  
    // 이미 피드백을 보낸 사용자인지 확인
    const feedbackSentTime = localStorage.getItem('feedbackSentTime');
    const currentTime = new Date().getTime();
  
    // 피드백을 보낸 시간이 있고, 그 시간이 2시간 이내라면
    if (feedbackSentTime && (currentTime - feedbackSentTime) < 2 * 60 * 60 * 1000) {
      const remainingTime = ((2 * 60 * 60 * 1000 - (currentTime - feedbackSentTime)) / 1000).toFixed(0); // 남은 시간 계산
      setStatus(
        language === "kor" 
          ? `2시간이 지나야 피드백을 다시 보낼 수 있습니다. 남은 시간: ${remainingTime}초` 
          : `You can send feedback again after 2 hours. Remaining time: ${remainingTime} seconds`
      );
      return;
    }
  
    try {
      const result = await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
  
      if (result.text === 'OK') {
        // 피드백 전송 후 localStorage에 전송 시간을 기록
        localStorage.setItem('feedbackSentTime', currentTime.toString());
        
        setStatus(
          language === "kor"
            ? "피드백이 성공적으로 전송되었습니다!"
            : "Feedback sent successfully!"
        );
        setFeedback("");
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus(
        language === "kor"
          ? "피드백 전송에 실패했습니다. 다시 시도해주세요."
          : "Failed to send feedback. Please try again."
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Header Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-4xl font-bold text-blue-600">
              {language === "kor" ? "학습 가이드" : "Learning Guide"}
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {language === "kor"
                ? "플래시카드를 활용한 효과적인 학습법"
                : "Effective learning methods using flashcards"}
            </p>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Guide Content */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex justify-center items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor"
                  ? "효과적인 학습법"
                  : "Effective Learning Methods"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {language === "kor"
                  ? "플래시카드를 통해 이미지와 단어를 쉽게 학습하는 방법"
                  : "How to easily learn words and images through flashcards"}
              </p>
            </div>
            <span className="text-4xl">📚</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span>
                {language === "kor"
                  ? "학습을 시작하기 전에 카테고리를 선택해 주세요."
                  : "Please select a category before starting your learning."}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Pointer className="w-5 h-5 text-green-500" />
              <span>
                {language === "kor"
                  ? "카드를 넘길 때마다 새 단어를 배우게 됩니다. 자동 모드로 빠르게 진행하거나, 수동 모드로 천천히 학습하세요."
                  : "You will learn a new word every time you flip a card. You can speed up with auto mode or go slow with manual mode."}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span>
                {language === "kor"
                  ? "퀴즈 게임을 통해 학습한 내용을 복습해 보세요. 선택지에서 올바른 단어를 찾아보며 재미있게 학습할 수 있습니다."
                  : "Review what you learned through the quiz game. Find the correct word from the choices and have fun learning."}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="max-w-4xl mx-auto mb-8 bg-green-100 border-green-300">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-green-700">
              {language === "kor"
                ? "여러분의 의견을 듣고 싶어요!"
                : "We want to hear your feedback!"}
            </h2>
            <Mail className="w-6 h-6 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent >
          <p className="text-gray-700 text-sm">
            {language === "kor"
              ? "더 좋은 아이디어나 피드백이 있다면 아래 입력창에 작성 후 '의견 보내기' 버튼을 눌러주세요. 여러분의 의견이 앱을 발전시키는 데 큰 도움이 됩니다!"
              : "If you have any great ideas or feedback, please write them below and click the 'Send Feedback' button. Your feedback helps us improve the app!"}
          </p>
          <form ref={form} onSubmit={sendFeedback} className="mt-4">
            <textarea
              name="feedback_message" // Add name attribute for emailjs
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder={
                language === "kor"
                  ? "여기에 의견을 입력하세요..."
                  : "Enter your feedback here..."
              }
            />
            <button
              type="submit"
              className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all"
            >
              {language === "kor" ? "의견 보내기" : "Send Feedback"}
            </button>
            {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
          </form>
          {/* <div className="mt-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder={language === "kor" ? "여기에 의견을 입력하세요..." : "Enter your feedback here..."}
            />
            <button
              onClick={(e) => sendFeedback(e)}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all"
            >
              {language === "kor" ? "의견 보내기" : "Send Feedback"}
            </button>
            {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
          </div> */}
        </CardContent>
      </Card>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {language === "kor" ? "홈으로 이동" : "Go Home"}
        </button>
      </div>
    </div>
  );
};

export default GuidePage;
