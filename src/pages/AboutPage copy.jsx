import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Book, BookOpen, Pointer, Star, MessageCircle, Mail } from "lucide-react";
import emailjs from "@emailjs/browser";

const AboutPage = () => {
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
      setLanguage(languageParam);
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
    const feedbackSentTime = localStorage.getItem("feedbackSentTime");
    const currentTime = new Date().getTime();

    // 피드백을 보낸 시간이 있고, 그 시간이 1시간 이내라면
    if (
      feedbackSentTime &&
      currentTime - feedbackSentTime < 1 * 60 * 60 * 1000
    ) {
      const remainingTime = (
        (1 * 60 * 60 * 1000 - (currentTime - feedbackSentTime)) /
        1000
      ).toFixed(0); // 남은 시간 계산
      setStatus(
        language === "kor"
          ? `1시간이 지나야 피드백을 다시 보낼 수 있습니다. 남은 시간: ${remainingTime}초`
          : `You can send feedback again after 1 hour. Remaining time: ${remainingTime} seconds`
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

      if (result.text === "OK") {
        // 피드백 전송 후 localStorage에 전송 시간을 기록
        localStorage.setItem("feedbackSentTime", currentTime.toString());

        setStatus(
          language === "kor"
            ? "피드백이 성공적으로 전송되었습니다!"
            : "Feedback sent successfully!"
        );
        setFeedback("");
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
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
              {language === "kor" ? "우리 아이 플래시카드" : "Baby Flashcards"}
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {language === "kor"
                ? "아이들의 두뇌 발달을 위한 최적의 학습 도구"
                : "The optimal learning tool for children's brain development"}
            </p>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 플래시카드 소개 */}
      <Card className="max-w-4xl mx-auto mb-8 bg-blue-50 hover:bg-blue-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <Book className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "플래시카드란?" : "What is Flashcard?"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-700 leading-relaxed">
            {language === "kor" ? (
              <>
                <span className="font-semibold text-blue-600">플래시카드</span>는
                짧은 시간 동안 정보를 효과적으로 학습하는{" "}
                <span className="font-semibold text-green-600">교육 도구</span>
                입니다.
                <br />
                미국 인간능력계발 연구소의{" "}
                <span className="font-semibold text-red-500">글랜 도만 박사</span>가
                개발한 <span className="text-purple-600">두뇌 자극 학습법</span>
                으로, 일정한 크기의 카드를 빠르게 보여주어{" "}
                <span className="font-semibold text-yellow-500">우뇌를 활성화</span>
                하는 방식입니다.
                <br />
                <span className="underline decoration-wavy decoration-blue-400">
                  유럽, 미국, 한국
                </span>{" "}
                등 교육열이 높은 나라에서 어린 아이들을 대상으로 활발하게 사용되고
                있으며, 특히{" "}
                <span className="font-bold text-pink-600">
                  유아와 어린이의 언어 학습
                </span>
                에 널리 활용되고 있습니다.
              </>
            ) : (
              <>
                A <span className="font-semibold text-blue-600">flashcard</span> is an{" "}
                <span className="font-semibold text-green-600">educational tool</span>{" "}
                for effective short-term learning.
                <br />
                It's a <span className="text-purple-600">brain-stimulating learning method</span>{" "}
                developed by <span className="font-semibold text-red-500">Dr. Glenn Doman</span>{" "}
                of the American Institute for Human Potential, which{" "}
                <span className="font-semibold text-yellow-500">activates the right brain</span>{" "}
                by quickly showing cards of a specific size.
                <br />
                It's actively used for young children in education-focused countries like{" "}
                <span className="underline decoration-wavy decoration-blue-400">
                  USA, Europe, and Korea
                </span>
                , and is particularly effective for{" "}
                <span className="font-bold text-pink-600">
                  language learning in infants and children
                </span>
                .
              </>
            )}
          </p>
        </CardContent>
      </Card>

      {/* 플래시카드의 효능 */}
      <Card className="max-w-4xl mx-auto mb-8 bg-green-50 hover:bg-green-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <Book className="w-8 h-8 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "플래시카드의 효과" : "Benefits of Flashcards"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: language === "kor" ? "기억력 향상" : "Memory Enhancement",
                description:
                  language === "kor"
                    ? "반복 학습을 통해 기억력을 향상시킵니다"
                    : "Improves memory through repetitive learning",
                color: "bg-blue-100",
              },
              {
                title: language === "kor" ? "언어 습득" : "Language Acquisition",
                description:
                  language === "kor"
                    ? "시각적 학습으로 언어 습득이 용이합니다"
                    : "Facilitates language learning through visual aids",
                color: "bg-red-100",
              },
              {
                title: language === "kor" ? "재미있는 학습" : "Fun Learning",
                description:
                  language === "kor"
                    ? "게임 형식으로 학습을 재미있게 만듭니다"
                    : "Makes learning fun through gamification",
                color: "bg-purple-100",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.color} p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300`}
              >
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 학습 가이드 */}
      <Card className="max-w-4xl mx-auto mb-8 bg-purple-50 hover:bg-purple-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "효과적인 학습법" : "Effective Learning Methods"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "카테고리 선택하기" : "Select a Category"}
                </h3>
                <p>
                  {language === "kor"
                    ? "아이에게 적합한 카테고리를 선택하고 학습을 시작하세요. 다양한 주제의 플래시카드가 준비되어 있습니다."
                    : "Choose the category that suits your child and start learning. There are flashcards on a variety of topics."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Pointer className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "학습 모드 활용하기" : "Use Learning Modes"}
                </h3>
                <p>
                  {language === "kor"
                    ? "카드를 넘기면서 새로운 단어를 학습합니다. 자동/수동 모드를 선택해 아이의 학습 속도에 맞게 진행하세요."
                    : "Learn new words by flipping cards. Choose auto or manual mode to match your child's learning pace."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "퀴즈로 복습하기" : "Review with Quiz"}
                </h3>
                <p>
                  {language === "kor"
                    ? "플래시카드로 학습한 후에는 Quiz 화면을 통해 내용을 복습하고 확인하세요. 퀴즈를 통해 내용을 복습하면 더욱 효과적입니다."
                    : "After studying with flashcards, review and check the content through the Quiz screen. Reviewing the content through the quiz is more effective."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "꾸준한 학습하기" : "Consistent Learning"}
                </h3>
                <p>
                  {language === "kor"
                    ? "매일 조금씩 꾸준히 학습하는 것이 중요합니다. 아이가 지루해하지 않도록 짧고 즐겁게 진행하세요."
                    : "Consistent daily learning is important. Keep sessions short and enjoyable so your child doesn't get bored."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Feedback Section */}
      <Card className="max-w-4xl mx-auto mb-8 bg-orange-50 hover:bg-orange-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <MessageCircle className="w-8 h-8 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "피드백 & 문의하기" : "Feedback & Contact"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-center text-gray-700 mb-6">
            {language === "kor"
              ? "여러분의 소중한 의견과 문의사항이 있다면 언제든지 아래 입력창에 작성해 주세요. 여러분의 피드백은 앱을 발전시키는 데 큰 도움이 됩니다!"
              : "If you have any questions or ideas, please feel free to share them below. Your feedback is invaluable in helping us improve the app!"}
          </p>
          <form ref={form} onSubmit={sendFeedback} className="max-w-lg mx-auto">
            <textarea
              name="feedback_message"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-4 border rounded-lg bg-white shadow-inner"
              rows="4"
              placeholder={
                language === "kor"
                  ? "여기에 의견을 입력하세요..."
                  : "Enter your feedback here..."
              }
            />
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {language === "kor" ? "의견 보내기" : "Send Feedback"}
              </button>
            </div>
            {status && (
              <p className="text-sm text-gray-600 mt-2 text-center">{status}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* License Info Link */}
      <div className="text-center mb-4">
        <a 
          href="/license" 
          onClick={(e) => {
            e.preventDefault();
            navigate(`/license?language=${language}`);
          }}
          className="text-blue-600 hover:underline text-sm"
        >
          {language === "kor" ? "라이센스 정보" : "License Information"}
        </a>
      </div>

      {/* Navigation Button */}
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

export default AboutPage;