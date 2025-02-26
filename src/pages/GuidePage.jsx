import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { BookOpen, Pointer, Star, Mail } from "lucide-react";

const GuidePage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const location = useLocation();
  const form = useRef();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const languageParam = queryParams.get("language");
    if (languageParam) {
      setLanguage(languageParam);
    }
  }, [location]);

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
                {language === "kor" ? "효과적인 학습법" : "Effective Learning Methods"}
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
                  ? "카테고리를 선택하고 학습을 시작하세요."
                  : "Select a category and start learning."}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Pointer className="w-5 h-5 text-green-500" />
              <span>
                {language === "kor"
                  ? "카드를 넘기면서 새로운 단어를 학습합니다. 자동/수동 모드를 선택해 진행하세요."
                  : "Flip cards to learn new words. Choose auto or manual mode to proceed."}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span>
                {language === "kor"
                  ? "퀴즈로 학습 내용을 복습하고 재미있게 학습하세요."
                  : "Review what you've learned with the quiz and have fun."}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-yellow-500" />
              <span>
                {language === "kor"
                  ? "피드백을 통해 더 나은 학습 경험을 제공해주세요."
                  : "Provide feedback for a better learning experience."}
              </span>
            </p>
          </div>
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
