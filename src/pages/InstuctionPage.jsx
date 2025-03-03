import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Shuffle, 
  Volume2, 
  Zap, 
  ChevronUp, 
  BarChart2, 
  Calendar, 
  ArrowLeft 
} from "lucide-react";

const InstructionPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const location = useLocation();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const languageParam = queryParams.get("language");
    if (languageParam) {
      setLanguage(languageParam);
    }
  }, [location]);

  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Header Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-4xl font-bold text-blue-600">
              {language === "kor" ? "효율적인 사용법" : "Effective Usage Guide"}
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {language === "kor"
                ? "플래시카드를 최대한 활용하는 방법"
                : "How to maximize your flashcard learning experience"}
            </p>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Introduction Card */}
      <Card className="max-w-4xl mx-auto mb-8 bg-green-50 hover:bg-green-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "기본 사용법" : "Basic Usage"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-700 mb-4">
            {language === "kor" 
              ? "플래시카드는 간격 반복(Spaced Repetition) 학습법의 핵심 도구로, 효율적인 학습과 장기 기억력 향상에 탁월한 효과가 있습니다. 저희 웹사이트에서 제공하는 다양한 기능을 활용하여 학습 효과를 극대화해 보세요! 🌈" 
              : "Flashcards are a key tool in Spaced Repetition learning, excellent for efficient learning and long-term memory enhancement. Maximize your learning experience using the various features provided on our website! 🌈"}
          </p>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-blue-600 mb-2">
              {language === "kor" ? "간격 반복이란?" : "What is Spaced Repetition?"}
            </h3>
            <p className="text-gray-700">
              {language === "kor" 
                ? "간격 반복은 1885년 에빙하우스가 발견한 '망각 곡선'을 극복하기 위한 학습법으로, 일정한 간격을 두고 반복 학습함으로써 장기 기억으로의 전환을 촉진합니다." 
                : "Spaced Repetition is a learning technique designed to overcome the 'forgetting curve' discovered by Ebbinghaus in 1885. By reviewing information at increasing intervals, it facilitates the transition to long-term memory."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature 1: Categories */}
      <Card className="max-w-4xl mx-auto mb-8 bg-blue-50 hover:bg-blue-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("categories")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "1. 📚 카테고리별 학습 전략" : "1. 📚 Category-based Learning Strategies"}
              </h2>
            </div>
            <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === "categories" ? "" : "transform rotate-180"}`} />
          </CardTitle>
        </CardHeader>
        {activeSection === "categories" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="ml-8">
                <h3 className="font-medium text-gray-800">
                  {language === "kor" ? "학습자 수준별 추천" : "Recommendations by Level"}
                </h3>
                <ul className="list-disc ml-5 text-gray-700 mt-2 space-y-2">
                  <li>
                    <span className="font-medium text-blue-600">{language === "kor" ? "초보자" : "Beginners"}:</span> {language === "kor" ? "숫자나 과일 같은 기본 카테고리부터 시작하세요." : "Start with basic categories like numbers or fruits."}
                  </li>
                  <li>
                    <span className="font-medium text-blue-600">{language === "kor" ? "중급자" : "Intermediate"}:</span> {language === "kor" ? "공룡이나 날씨 등 다양한 주제로 어휘력을 확장하세요." : "Expand your vocabulary with diverse topics like dinosaurs or weather."}
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md ml-8">
                <h3 className="font-medium text-blue-600 mb-2">
                  {language === "kor" ? "학습 팁" : "Learning Tip"}
                </h3>
                <p className="text-gray-700">
                  {language === "kor" 
                    ? "하루에 한 카테고리에 집중하는 것보다 2-3개의 카테고리를 번갈아가며 학습하면 지루함을 줄이고 기억 효율을 높일 수 있습니다." 
                    : "Rather than focusing on one category per day, alternating between 2-3 categories can reduce boredom and increase memory efficiency."}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Feature 2: Auto/Manual Mode */}
      <Card className="max-w-4xl mx-auto mb-8 bg-yellow-50 hover:bg-yellow-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("autoMode")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "2. ⏱️ 자동/수동 모드 활용법" : "2. ⏱️ Auto/Manual Mode Usage"}
              </h2>
            </div>
            <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === "autoMode" ? "" : "transform rotate-180"}`} />
          </CardTitle>
        </CardHeader>
        {activeSection === "autoMode" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="ml-8">
                <h3 className="font-medium text-gray-800">
                  {language === "kor" ? "자동 모드" : "Auto Mode"}
                </h3>
                <p className="text-gray-700 mt-1">
                  {language === "kor" ? "집중적인 복습에 적합합니다. 시간 간격을 점점 늘려가며 설정해 보세요." : "Suitable for intensive review. Try setting time intervals that gradually increase."}
                </p>
                <ul className="list-disc ml-5 text-gray-700 mt-2 space-y-1">
                  <li>{language === "kor" ? "초기 학습: 2-3초 간격" : "Initial learning: 2-3 second intervals"}</li>
                  <li>{language === "kor" ? "익숙해진 후: 5-7초 간격" : "After familiarity: 5-7 second intervals"}</li>
                </ul>
              </div>
              
              <div className="ml-8">
                <h3 className="font-medium text-gray-800">
                  {language === "kor" ? "수동 모드" : "Manual Mode"}
                </h3>
                <p className="text-gray-700 mt-1">
                  {language === "kor" ? "깊이 있는 학습과 발음 연습에 효과적입니다." : "Effective for in-depth learning and pronunciation practice."}
                </p>
                <ul className="list-disc ml-5 text-gray-700 mt-2">
                  <li>{language === "kor" ? "카드를 보고 소리내어 읽은 후 넘기는 습관을 들이세요." : "Get in the habit of looking at the card, reading it aloud, and then flipping it."}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Feature 3: Word Show/Hide */}
      <Card className="max-w-4xl mx-auto mb-8 bg-purple-50 hover:bg-purple-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("wordVisibility")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "3. 👁️ 단어 보임/숨김 기능 활용" : "3. 👁️ Word Show/Hide Feature Usage"}
              </h2>
            </div>
            <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === "wordVisibility" ? "" : "transform rotate-180"}`} />
          </CardTitle>
        </CardHeader>
        {activeSection === "wordVisibility" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="ml-8">
                <h3 className="font-medium text-gray-800">
                  {language === "kor" ? "학습 단계별 전략" : "Learning Stage Strategies"}
                </h3>
                <ol className="list-decimal ml-5 text-gray-700 mt-2 space-y-2">
                  <li>
                    <span className="font-medium">{language === "kor" ? "초기 학습" : "Initial Learning"}:</span> {language === "kor" ? "단어 표시 켜고 익히기" : "Turn word display on and familiarize yourself"}
                  </li>
                  <li>
                    <span className="font-medium">{language === "kor" ? "중간 단계" : "Intermediate Stage"}:</span> {language === "kor" ? "단어 숨기고 맞추기" : "Hide words and try to guess them"}
                  </li>
                  <li>
                    <span className="font-medium">{language === "kor" ? "고급 단계" : "Advanced Stage"}:</span> {language === "kor" ? "단어 숨김 상태에서 문장 만들기" : "Create sentences while words are hidden"}
                  </li>
                </ol>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md ml-8">
                <h3 className="font-medium text-purple-600 mb-2">
                  {language === "kor" ? "효과적인 방법" : "Effective Method"}
                </h3>
                <p className="text-gray-700">
                  {language === "kor" 
                    ? "단어를 숨긴 상태에서 맞춰본 후, 보임 모드로 전환하여 확인하는 과정을 반복하세요." 
                    : "Repeat the process of guessing with words hidden, then switching to visible mode to check your answers."}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Feature 4: Sequential/Random */}
      <Card className="max-w-4xl mx-auto mb-8 bg-pink-50 hover:bg-pink-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("sequentialRandom")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shuffle className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "4. 🔄 순차/랜덤 진행 활용법" : "4. 🔄 Sequential/Random Progression"}
              </h2>
            </div>
            <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === "sequentialRandom" ? "" : "transform rotate-180"}`} />
          </CardTitle>
        </CardHeader>
        {activeSection === "sequentialRandom" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="ml-8">
                <h3 className="font-medium text-gray-800">
                  {language === "kor" ? "순차 진행" : "Sequential Progression"}
                </h3>
                <p className="text-gray-700 mt-1">
                  {language === "kor" ? "체계적인 학습에 적합합니다." : "Suitable for systematic learning."}
                </p>
                <ul className="list-disc ml-5 text-gray-700 mt-2 space-y-1">
                  <li>{language === "kor" ? "새로운 카테고리를 처음 학습할 때 권장" : "Recommended when learning a new category for the first time"}</li>
                  <li>{language === "kor" ? "관련 단어들의 연결성을 파악하는 데 도움" : "Helps identify connections between related words"}</li>
                </ul>
              </div>
              
              <div className="ml-8">
                <h3 className="font-medium text-gray-800">
                  {language === "kor" ? "랜덤 진행" : "Random Progression"}
                </h3>
                <p className="text-gray-700 mt-1">
                  {language === "kor" ? "기억력 강화에 탁월합니다." : "Excellent for strengthening memory."}
                </p>
                <ul className="list-disc ml-5 text-gray-700 mt-2 space-y-1">
                  <li>{language === "kor" ? "이미 학습한 내용 복습 시 활용" : "Use when reviewing previously learned content"}</li>
                  <li>{language === "kor" ? "예상치 못한 단어 등장으로 집중력 향상" : "Improves concentration through unexpected word appearances"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Feature 5: TTS */}
      <Card className="max-w-4xl mx-auto mb-8 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("tts")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "5. 🔊 TTS 기능 활용 방법" : "5. 🔊 TTS Feature Utilization"}
              </h2>
            </div>
            <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === "tts" ? "" : "transform rotate-180"}`} />
          </CardTitle>
        </CardHeader>
        {activeSection === "tts" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="ml-8">
                <ul className="list-disc ml-5 text-gray-700 mt-2 space-y-2">
                  <li>
                    <span className="font-medium">{language === "kor" ? "발음 학습" : "Pronunciation Learning"}:</span> {language === "kor" ? "정확한 발음을 들으며 따라 말해보세요." : "Listen to the correct pronunciation and repeat it."}
                  </li>
                  <li>
                    <span className="font-medium">{language === "kor" ? "멀티태스킹 학습" : "Multitasking Learning"}:</span> {language === "kor" ? "귀로 들으며 다른 활동을 할 때도 학습이 가능합니다." : "Learning is possible even while doing other activities by listening."}
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md ml-8">
                <h3 className="font-medium text-indigo-600 mb-2">
                  {language === "kor" ? "활용 팁" : "Usage Tips"}
                </h3>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>{language === "kor" ? "TTS 재생 → 따라 말하기 → 카드 넘기기 루틴 형성" : "Form a routine: TTS playback → Repeat → Flip card"}</li>
                  <li>{language === "kor" ? "같은 단어를 여러 번 들으며 발음 익히기" : "Familiarize yourself with pronunciation by listening to the same word multiple times"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Learning Schedule */}
      <Card className="max-w-4xl mx-auto mb-8 bg-orange-50 hover:bg-orange-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("schedule")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "💡 효과적인 학습 일정 예시" : "💡 Effective Learning Schedule Example"}
              </h2>
            </div>
            <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === "schedule" ? "" : "transform rotate-180"}`} />
          </CardTitle>
        </CardHeader>
        {activeSection === "schedule" && (
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-2">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="border border-orange-200 p-2 text-left">{language === "kor" ? "학습 단계" : "Learning Stage"}</th>
                    <th className="border border-orange-200 p-2 text-left">{language === "kor" ? "권장 설정" : "Recommended Settings"}</th>
                    <th className="border border-orange-200 p-2 text-left">{language === "kor" ? "시간" : "Time"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-orange-200 p-2 font-medium">{language === "kor" ? "입문" : "Introduction"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "단어 보임, 순차 진행, TTS 켬" : "Words visible, Sequential, TTS on"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "1주차, 15분/일" : "Week 1, 15 min/day"}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-orange-200 p-2 font-medium">{language === "kor" ? "기초" : "Basic"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "단어 숨김, 순차 진행, 수동 모드" : "Words hidden, Sequential, Manual mode"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "2주차, 20분/일" : "Week 2, 20 min/day"}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-orange-200 p-2 font-medium">{language === "kor" ? "중급" : "Intermediate"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "단어 숨김, 랜덤 진행, 자동 모드(5초)" : "Words hidden, Random, Auto mode (5 sec)"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "3-4주차, 25분/일" : "Weeks 3-4, 25 min/day"}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-orange-200 p-2 font-medium">{language === "kor" ? "고급" : "Advanced"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "단어 숨김, 랜덤 진행, TTS 끔(맞춰본 후 TTS로 확인)" : "Words hidden, Random, TTS off (check with TTS after guessing)"}</td>
                    <td className="border border-orange-200 p-2">{language === "kor" ? "5주차 이후, 30분/일" : "After week 5, 30 min/day"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Long-term Success Tips */}
      <Card className="max-w-4xl mx-auto mb-8 bg-red-50 hover:bg-red-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("longTerm")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "🚀 장기적 학습 성공을 위한 팁" : "🚀 Tips for Long-term Learning Success"}
              </h2>
            </div>
            <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${activeSection === "longTerm" ? "" : "transform rotate-180"}`} />
          </CardTitle>
        </CardHeader>
        {activeSection === "longTerm" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <ol className="list-decimal ml-8 text-gray-700 mt-2 space-y-4">
                <li>
                  <h3 className="font-medium text-gray-800 inline">
                    {language === "kor" ? "일관성 유지하기" : "Maintain Consistency"}
                  </h3>
                  <p className="mt-1 ml-2">
                    {language === "kor" 
                      ? "매일 짧게라도 학습하는 것이 주 1-2회 길게 하는 것보다 효과적입니다." 
                      : "Learning briefly every day is more effective than doing longer sessions 1-2 times a week."}
                  </p>
                </li>
                
                <li>
                  <h3 className="font-medium text-gray-800 inline">
                    {language === "kor" ? "복습 주기 설정" : "Set Review Cycles"}
                  </h3>
                  <ul className="list-disc ml-7 text-gray-700 mt-1 space-y-1">
                    <li>{language === "kor" ? "처음 학습: 당일 복습" : "First learning: Same-day review"}</li>
                    <li>{language === "kor" ? "2차 복습: 1일 후" : "2nd review: After 1 day"}</li>
                    <li>{language === "kor" ? "3차 복습: 3일 후" : "3rd review: After 3 days"}</li>
                    <li>{language === "kor" ? "4차 복습: 7일 후" : "4th review: After 7 days"}</li>
                    <li>{language === "kor" ? "5차 복습: 14일 후" : "5th review: After 14 days"}</li>
                  </ul>
                </li>
                
                <li>
                  <h3 className="font-medium text-gray-800 inline">
                    {language === "kor" ? "자기 평가 도입" : "Implement Self-evaluation"}
                  </h3>
                  <p className="mt-1 ml-2">
                    {language === "kor" 
                      ? "카드를 맞췄는지 틀렸는지 기록하고, 틀린 카드만 모아 집중 학습하세요." 
                      : "Record whether you got cards right or wrong, and focus on studying the cards you got wrong."}
                  </p>
                </li>
                
                <li>
                  <h3 className="font-medium text-gray-800 inline">
                    {language === "kor" ? "연관성 만들기" : "Create Associations"}
                  </h3>
                  <p className="mt-1 ml-2">
                    {language === "kor" 
                      ? "단어와 관련된 이미지나 상황을 상상하면 기억에 오래 남습니다." 
                      : "Imagining images or situations related to the word makes it stay in memory longer."}
                  </p>
                </li>
                
                <li>
                  <h3 className="font-medium text-gray-800 inline">
                    {language === "kor" ? "목표 설정" : "Set Goals"}
                  </h3>
                  <p className="mt-1 ml-2">
                    {language === "kor" 
                      ? "매일 학습할 새 단어 수와 복습할 단어 수를 미리 정해두세요. (예: 새 단어 10개, 복습 30개)" 
                      : "Set in advance how many new words you'll learn and how many you'll review each day. (e.g., 10 new words, 30 review words)"}
                  </p>
                </li>
              </ol>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Progress Tracking */}
      {/* <Card className="max-w-4xl mx-auto mb-8 bg-cyan-50 hover:bg-cyan-100 transition-all duration-300">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection("tracking")}
        >
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-6 h-6 text-cyan-500" />
               */}
               
      {/* Navigation Button */}
      <div className="text-center">
        <button
          onClick={() => navigate(`/about?language=${language}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === "kor" ? "소개 페이지로 돌아가기" : "Back to About Page"}
        </button>
      </div>

</div>
  );
}

export default InstructionPage;
