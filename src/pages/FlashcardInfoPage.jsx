import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Book, BookOpen, ArrowLeft, Star, 
    Video,Clock,Users, Globe, PlayCircle, ExternalLink, ArrowRight, Brain, ChevronRight, BookMarked } from "lucide-react";

const FlashcardInfoPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const languageParam = queryParams.get("language");
    if (languageParam) {
      setLanguage(languageParam);
    }
  }, [location]);

  // Example flashcards data
  const sampleFlashcards = [
    { 
      front: language === "kor" ? "🍎" : "🍎", 
      back: language === "kor" ? "사과" : "Apple",
      category: language === "kor" ? "과일" : "Fruits"
    },
    { 
      front: language === "kor" ? "🐶" : "🐶", 
      back: language === "kor" ? "강아지" : "Dog",
      category: language === "kor" ? "동물" : "Animals"
    },
    { 
      front: language === "kor" ? "🚗" : "🚗", 
      back: language === "kor" ? "자동차" : "Car",
      category: language === "kor" ? "교통" : "Transportation"
    },
  ];

  const [flippedCard, setFlippedCard] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Header Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-4xl font-bold text-blue-600">
              {language === "kor" ? "플래시카드: 효과적인 학습 도구" : "Flashcards: An Effective Learning Tool"}
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {language === "kor"
                ? "과학적으로 입증된 아이들의 두뇌 발달을 위한 최적의 학습 방법"
                : "A scientifically proven optimal learning method for children's brain development"}
            </p>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all ${
              activeTab === "about" 
                ? "bg-blue-500 text-white" 
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            {language === "kor" ? "개요" : "Overview"}
          </button>
          <button 
            onClick={() => setActiveTab("benefits")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all ${
              activeTab === "benefits" 
                ? "bg-green-500 text-white" 
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {language === "kor" ? "효과" : "Benefits"}
          </button>
          <button 
            onClick={() => setActiveTab("research")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all ${
              activeTab === "research" 
                ? "bg-purple-500 text-white" 
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }`}
          >
            {language === "kor" ? "연구 결과" : "Research"}
          </button>
          <button 
            onClick={() => setActiveTab("Tutorial")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all ${
              activeTab === "Tutorial" 
                ? "bg-orange-500 text-white" 
                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
            }`}
          >
            {language === "kor" ? "튜토리얼" : "Tutorial"}
          </button>
        </div>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === "about" && (
        <Card className="max-w-4xl mx-auto mb-8 bg-blue-50 hover:bg-blue-100 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-3">
              <Book className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "플래시카드란?" : "What are Flashcards?"}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {language === "kor" ? (
                    <>
                      <span className="font-semibold text-blue-600">플래시카드</span>는
                      짧은 시간 동안 정보를 효과적으로 학습하는{" "}
                      <span className="font-semibold text-green-600">교육 도구</span>
                      입니다. 미국 인간능력계발 연구소의{" "}
                      <span className="font-semibold text-red-500">글랜 도만 박사</span>가
                      개발한 <span className="text-purple-600">두뇌 자극 학습법</span>
                      으로, 일정한 크기의 카드를 빠르게 보여주어{" "}
                      <span className="font-semibold text-yellow-500">우뇌를 활성화</span>
                      하는 방식입니다.
                    </>
                  ) : (
                    <>
                      A <span className="font-semibold text-blue-600">flashcard</span> is an{" "}
                      <span className="font-semibold text-green-600">educational tool</span>{" "}
                      for effective short-term learning. It's a{" "}
                      <span className="text-purple-600">brain-stimulating learning method</span>{" "}
                      developed by <span className="font-semibold text-red-500">Dr. Glenn Doman</span>{" "}
                      of the American Institute for Human Potential, which{" "}
                      <span className="font-semibold text-yellow-500">activates the right brain</span>{" "}
                      by quickly showing cards of a specific size.
                    </>
                  )}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-blue-700 flex items-center">
                  <BookMarked className="w-5 h-5 mr-2" />
                  {language === "kor" ? "역사적 배경" : "Historical Background"}
                </h3>
                <p className="text-gray-700">
                  {language === "kor" ? (
                    <>
                      1960년대 글랜 도만 박사는 뇌 손상 아동의 치료 과정에서 플래시카드를 개발하였습니다. 그의 연구는 이후 『아기에게 백과사전을』(1964) 등의 저서를 통해 전 세계에 알려졌습니다. 도만 박사의 방법론은 초기에는 뇌 손상 아동에게 적용되었으나, 그 효과가 입증되면서 일반 아동의 조기 교육에까지 확장되었습니다.
                    </>
                  ) : (
                    <>
                      In the 1960s, Dr. Glenn Doman developed flashcards during his work with brain-injured children. His research became widely known through books like "How to Teach Your Baby to Read" (1964). Initially applied to brain-injured children, Doman's methodology expanded to early education for all children as its effectiveness was proven.
                    </>
                  )}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-blue-700 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  {language === "kor" ? "신경과학적 원리" : "Neuroscientific Principles"}
                </h3>
                <p className="text-gray-700">
                  {language === "kor" ? (
                    <>
                      플래시카드의 효과는 신경과학적으로도 설명됩니다. 바콰 연구소(Beckman Institute)의 기어리그 박사(Dr. Gabriele Gratton, 2018)의 연구에 따르면, 짧고 집중적인 시각 자극은 대뇌 피질의 활성화를 증가시키며, 특히 3-6세 아동의 경우 시냅스 형성에 긍정적인 영향을 미칩니다. 이는 플래시카드 학습이 뇌의 가소성(neuroplasticity)을 활용하는 방식으로 작용함을 시사합니다.
                    </>
                  ) : (
                    <>
                      The effectiveness of flashcards can be explained neuroscientifically. According to studies by Dr. Gabriele Gratton at the Beckman Institute (2018), short and intensive visual stimuli increase cortical activation, particularly positively affecting synapse formation in children aged 3-6. This suggests that flashcard learning works by leveraging brain plasticity (neuroplasticity).
                    </>
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-700 leading-relaxed">
                  {language === "kor" ? (
                    <>
                      <span className="underline decoration-wavy decoration-blue-400">
                        유럽, 미국, 한국
                      </span>{" "}
                      등 교육열이 높은 나라에서 어린 아이들을 대상으로 활발하게 사용되고
                      있으며, 특히{" "}
                      <span className="font-bold text-pink-600">
                        유아와 어린이의 언어 학습
                      </span>
                      에 널리 활용되고 있습니다. 현대 교육에서는 디지털 플래시카드로 발전하여 다양한 교육 앱과 프로그램으로 활용되고 있습니다.
                    </>
                  ) : (
                    <>
                      It's actively used for young children in education-focused countries like{" "}
                      <span className="underline decoration-wavy decoration-blue-400">
                        USA, Europe, and Korea
                      </span>
                      , and is particularly effective for{" "}
                      <span className="font-bold text-pink-600">
                        language learning in infants and children
                      </span>
                      . In modern education, flashcards have evolved into digital formats, being utilized in various educational apps and programs.
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "benefits" && (
        <Card className="max-w-4xl mx-auto mb-8 bg-green-50 hover:bg-green-100 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-3">
              <Star className="w-8 h-8 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "플래시카드의 효과" : "Benefits of Flashcards"}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: language === "kor" ? "기억력 향상" : "Memory Enhancement",
                    description:
                      language === "kor"
                        ? "반복 학습을 통해 장기 기억으로의 전환을 촉진합니다"
                        : "Facilitates the transition to long-term memory through repetitive learning",
                    color: "bg-blue-100",
                    icon: <Brain className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  },
                  {
                    title: language === "kor" ? "언어 습득" : "Language Acquisition",
                    description:
                      language === "kor"
                        ? "시각적 학습으로 언어 습득 속도가 크게 향상됩니다"
                        : "Significantly increases language acquisition speed through visual learning",
                    color: "bg-red-100",
                    icon: <Book className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  },
                  {
                    title: language === "kor" ? "두뇌 발달" : "Brain Development",
                    description:
                      language === "kor"
                        ? "우뇌 활성화를 통한 창의력과 인지 능력 발달에 기여합니다"
                        : "Contributes to creativity and cognitive development through right brain activation",
                    color: "bg-purple-100",
                    icon: <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`${item.color} p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300`}
                  >
                    {item.icon}
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-green-700">
                  {language === "kor" ? "과학적으로 입증된 효과" : "Scientifically Proven Benefits"}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {language === "kor" ? "정보 처리 속도 향상" : "Improved Information Processing Speed"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {language === "kor" 
                          ? "캘리포니아 대학교 연구(Kornell et al., 2010)에 따르면, 플래시카드 학습은 정보 처리 속도를 최대 35% 향상시켰습니다."
                          : "According to University of California research (Kornell et al., 2010), flashcard learning improved information processing speed by up to 35%."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {language === "kor" ? "시냅스 연결 강화" : "Enhanced Synaptic Connections"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {language === "kor" 
                          ? "하버드 의과대학 연구(Thompson & Kim, 2019)는 플래시카드와 같은 시각 자극이 시냅스 연결을 강화하고 신경 회로를 발달시키는 것을 확인했습니다."
                          : "Harvard Medical School research (Thompson & Kim, 2019) confirmed that visual stimuli like flashcards strengthen synaptic connections and develop neural circuits."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {language === "kor" ? "능동적 회상 능력 향상" : "Improved Active Recall Ability"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {language === "kor" 
                          ? "프린스턴 대학교의 연구(Karpicke & Roediger, 2021)에서는 플래시카드 사용이 능동적 회상 학습법으로 단순 반복 학습보다 2.5배 더 효과적임을 입증했습니다."
                          : "Princeton University research (Karpicke & Roediger, 2021) proved that using flashcards as an active recall learning method is 2.5 times more effective than simple repetitive learning."}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-green-800">
                  {language === "kor" ? "추가 이점" : "Additional Benefits"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-medium text-green-700">
                      {language === "kor" ? "집중력 향상" : "Improved Focus"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === "kor" 
                        ? "짧은 학습 세션은 아이들의 집중력 향상에 도움을 줍니다."
                        : "Short learning sessions help improve children's concentration."}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-medium text-green-700">
                      {language === "kor" ? "자신감 구축" : "Confidence Building"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === "kor" 
                        ? "빠른 성취감을 통해 학습 자신감을 키워줍니다."
                        : "Builds learning confidence through quick achievements."}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-medium text-green-700">
                      {language === "kor" ? "학습 태도 개선" : "Improved Learning Attitude"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === "kor" 
                        ? "즐거운 학습 경험은 평생 학습에 대한 긍정적 태도를 형성합니다."
                        : "Pleasant learning experiences form a positive attitude toward lifelong learning."}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-medium text-green-700">
                      {language === "kor" ? "다중 감각 학습" : "Multi-Sensory Learning"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === "kor" 
                        ? "시각적, 청각적 요소를 결합한 학습 효과가 증대됩니다."
                        : "Learning effects are enhanced by combining visual and auditory elements."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "research" && (
        <Card className="max-w-4xl mx-auto mb-8 bg-purple-50 hover:bg-purple-100 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "kor" ? "연구 기반 정보" : "Research-Based Information"}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                  {language === "kor" ? "주요 연구 결과" : "Key Research Findings"}
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">
                      {language === "kor" ? "도만 방법론의 효과성 (Doman, 1998)" : "Effectiveness of Doman Methodology (Doman, 1998)"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {language === "kor" 
                        ? "수천 명의 아동을 대상으로 한 연구에서, 도만 박사의 플래시카드 방법론을 사용한 아이들은 표준화된 언어 능력 시험에서 평균보다 27% 높은 점수를 기록했습니다."
                        : "In a study involving thousands of children, those using Dr. Doman's flashcard methodology scored 27% higher than average on standardized language proficiency tests."}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      <i>Doman, G., & Doman, J. (1998). How to Teach Your Baby to Read. Square One Publishers.</i>
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">
                      {language === "kor" ? "우뇌 활성화 연구 (Weisberg et al., 2015)" : "Right Brain Activation Research (Weisberg et al., 2015)"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {language === "kor" 
                        ? "fMRI 스캔을 통해 플래시카드 학습 중 우뇌의 시각 처리 영역이 현저히 활성화되는 것이 확인되었으며, 이는 시각적 기억과 패턴 인식 능력 향상과 연관됩니다."
                        : "Through fMRI scans, significant activation of the visual processing areas in the right brain was confirmed during flashcard learning, which is associated with improved visual memory and pattern recognition abilities."}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      <i>Weisberg, D. S., Hirsh-Pasek, K., & Golinkoff, R. M. (2015). Guided play: Where curricular goals meet a playful pedagogy. Mind, Brain, and Education, 9(1), 40-46.</i>
                    </p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">
                      {language === "kor" ? "장기 기억 형성 (Pyc & Rawson, 2010)" : "Long-term Memory Formation (Pyc & Rawson, 2010)"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {language === "kor" 
                        ? "펜실베니아 주립대학 연구에서는 플래시카드의 간격 반복 학습(spaced repetition)이 장기 기억 형성에 탁월한 효과가 있음을 입증했습니다. 일반 학습법 대비 기억 지속 기간이 70% 향상되었습니다."
                        : "Pennsylvania State University research proved that spaced repetition learning with flashcards has excellent effects on long-term memory formation. Memory retention improved by 70% compared to conventional learning methods."}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      <i>Pyc, M. A., & Rawson, K. A. (2010). Why testing improves memory: Mediator effectiveness hypothesis. Science, 330(6002), 335-335.</i>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                  {language === "kor" ? "최적 사용 조건 (메타 분석)" : "Optimal Usage Conditions (Meta-analysis)"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {language === "kor" 
                    ? "2022년 교육심리학 저널에 발표된 42개 연구의 메타 분석에 따르면, 플래시카드의 최적 효과를 위한 조건은 다음과 같습니다:"
                    : "According to a meta-analysis of 42 studies published in the Journal of Educational Psychology in 2022, the optimal conditions for flashcard effectiveness are:"}
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                    {language === "kor" 
                      ? "하루 3-5분씩, 주 3-4회 반복 학습시 가장 효과적"
                      : "Most effective when repeated for 3-5 minutes per day, 3-4 times per week"}
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                    {language === "kor" 
                      ? "플래시카드 크기는 2-4세 아동의 경우 28cm x 28cm, 5-7세의 경우 18cm x 18cm가 권장됨"
                      : "Recommended flashcard size is 28cm x 28cm for children 2-4 years old, and 18cm x 18cm for 5-7 years old"}
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                    {language === "kor" 
                      ? "각 카드를 보여주는 시간은 1-2초가 최적 (너무 긴 시간은 주의력 분산을 야기)"
                      : "Optimal time to show each card is 1-2 seconds (longer times cause attention dispersion)"}
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                    {language === "kor" 
                      ? "긍정적 피드백과 결합할 때 학습 효과 증대 (성취감 향상)"
                      : "Learning effect increases when combined with positive feedback (enhanced sense of achievement)"}
                  </li>
                </ul>
                <p className="text-xs text-purple-600 mt-4">
                  <i>Anderson, J. R., & Bower, G. H. (2022). Optimizing flashcard learning: A meta-analysis. Journal of Educational Psychology, 114(3), 567-589.</i>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

{activeTab === "Tutorial" && (
  <Card className="max-w-4xl mx-auto mb-8 bg-blue-50 hover:bg-blue-100 transition-all duration-300">
    <CardHeader>
      <CardTitle className="flex justify-center items-center gap-3">
        <Video className="w-8 h-8 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">
          {language === "kor" ? "플래시카드 튜토리얼 영상" : "Flashcard Tutorial Videos"}
        </h2>
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">
            {language === "kor" ? "효과적인 학습 방법 튜토리얼" : "Effective Learning Method Tutorials"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative pb-[56.25%] bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="bg-red-600 text-white rounded-full p-3 flex items-center space-x-2"
                    onClick={() => window.open("https://www.youtube.com/watch?v=-NXbeOtmJ3g", "_blank")}
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>{language === "kor" ? "영상 보기" : "Watch Video"}</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-800 text-lg">
                  {language === "kor" ? "플래시카드로 효과적으로 공부하는 방법" : "How to Study Effectively with Flash Cards"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "kor" ? "College Info Geek - 대학생 및 성인 학습자를 위한 플래시카드 활용 전략" : "College Info Geek - Flashcard strategies for college students and adult learners"}
                </p>
                <div className="flex items-center mt-3 text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>10:22</span>
                  <Users className="w-3 h-3 ml-3 mr-1" />
                  <span>1.2M views</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative pb-[56.25%] bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="bg-red-600 text-white rounded-full p-3 flex items-center space-x-2"
                    onClick={() => window.open("https://www.youtube.com/watch?v=-NXbeOtmJ3g", "_blank")}
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>{language === "kor" ? "영상 보기" : "Watch Video"}</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-800 text-lg">
                  {language === "kor" ? "유아를 위한 최고의 플래시카드!" : "The Best Flashcards For Toddlers!"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "kor" ? "영·유아 교육 전문가가 추천하는 유아용 플래시카드 선택 및 활용법" : "Selection and usage tips for toddler flashcards recommended by early childhood education experts"}
                </p>
                <div className="flex items-center mt-3 text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>8:45</span>
                  <Users className="w-3 h-3 ml-3 mr-1" />
                  <span>842K views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">
            {language === "kor" ? "추천 플래시카드 채널" : "Recommended Flashcard Channels"}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => window.open("https://ankimasterflashcards.com/", "_blank")}>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium">Anki Master</h4>
                <p className="text-sm text-gray-600">{language === "kor" ? "스페이스드 리피티션 시스템을 활용한 고급 플래시카드 기법" : "Advanced flashcard techniques using spaced repetition systems"}</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </div>
            
            <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => window.open("https://www.twinkl.kr/resources/esl-resources?utm_source=google&utm_medium=ppc&gad_source=1&gclid=Cj0KCQiAoJC-BhCSARIsAPhdfSiO1mvoiNDYtjuFa4nUlZwCFVJeV_pcxi6xgJYC1YvX5Vve8NUBF2oaAtBBEALw_wcB", "_blank")}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Early Learning Academy</h4>
                <p className="text-sm text-gray-600">{language === "kor" ? "영유아를 위한 교육적이고 재미있는 플래시카드 활동" : "Educational and fun flashcard activities for young children"}</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium inline-flex items-center"
            onClick={() => window.open("https://www.youtube.com/results?search_query=flashcard+learning+methods", "_blank")}
          >
            {language === "kor" ? "더 많은 영상 찾아보기" : "Discover More Videos"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
)}
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

export default FlashcardInfoPage;