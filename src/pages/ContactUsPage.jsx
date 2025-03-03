import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { MessageCircle, Mail, Phone, MapPin, Globe, Users, ArrowLeft } from "lucide-react";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
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

  const sendFeedback = (e) => {
    e.preventDefault();
  
    if (!feedback.trim()) {
      setStatus(
        language === "kor" ? "메시지를 입력해주세요." : "Please enter a message."
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
      emailjs
        .sendForm(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          form.current,
          { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY }
        )
        .then(
          () => {
            localStorage.setItem("feedbackSentTime", currentTime.toString());
  
            setStatus(
              language === "kor"
                ? "메시지가 성공적으로 전송되었습니다!"
                : "Message sent successfully!"
            );
            setFeedback("");
            setEmail("");
            setSubject("");
                },
          (error) => {
            setStatus(
                language === "kor"
                  ? "메시지 전송에 실패했습니다. 다시 시도해주세요."
                  : "Failed to send message. Please try again."
              );
          }
        );
  
    //   if (result.status === 200) {
    //     // 피드백 전송 후 localStorage에 전송 시간을 기록
    //     localStorage.setItem("feedbackSentTime", currentTime.toString());
  
    //     setStatus(
    //       language === "kor"
    //         ? "메시지가 성공적으로 전송되었습니다!"
    //         : "Message sent successfully!"
    //     );
    //     setFeedback("");
    //     setEmail("");
    //     setSubject("");
    //   } else {
    //     setStatus(
    //       language === "kor"
    //         ? "메시지 전송에 실패했습니다. 다시 시도해주세요."
    //         : "Failed to send message. Please try again."
    //     );
    //   }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus(
        language === "kor"
          ? "메시지 전송에 실패했습니다. 다시 시도해주세요."
          : "Failed to send message. Please try again."
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
              {language === "kor" ? "문의하기" : "Contact Us"}
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {language === "kor"
                ? "궁금한 점이나 의견을 보내주세요"
                : "Send us your questions or feedback"}
            </p>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Contact Methods */}
      <Card className="max-w-4xl mx-auto mb-8 bg-blue-50 hover:bg-blue-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <Globe className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "연락 방법" : "Contact Methods"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-gray-800 text-lg">
                  {language === "kor" ? "이메일" : "Email"}
                </h3>
              </div>
              <p className="text-gray-600 ml-9">support@babyflashcard.xyz</p>
              <p className="text-gray-500 ml-9 text-sm mt-1">
                {language === "kor" 
                  ? "24시간 이내에 답변드립니다"
                  : "We'll respond within 24 hours"}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-800 text-lg">
                  {language === "kor" ? "소셜 미디어" : "Social Media"}
                </h3>
              </div>
              <p className="text-gray-600 ml-9">@BabyFlashcard</p>
              <p className="text-gray-500 ml-9 text-sm mt-1">
                {language === "kor" 
                  ? "인스타그램, 트위터에서 팔로우하세요"
                  : "Follow us on Instagram and Twitter"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="max-w-4xl mx-auto mb-8 bg-purple-50 hover:bg-purple-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <MessageCircle className="w-8 h-8 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "자주 묻는 질문" : "Frequently Asked Questions"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {[
              {
                question: language === "kor" ? "Q. 플래시카드를 사용하는 최적의 나이는 언제인가요?" : "Q. What is the optimal age to use flashcards?",
                answer: language === "kor" ? "A. 플래시카드는 6개월부터 7세 아이들에게 적합합니다. 특히 언어 발달이 활발한 1-3세에 효과적입니다." 
                  : "A. Flashcards are suitable for children from 6 months to 7 years old. They are especially effective for ages 1-3 when language development is active."
              },
              {
                question: language === "kor" ? "Q. 하루에 얼마나 사용하는 것이 좋을까요?" : "Q. How long should I use flashcards each day?",
                answer: language === "kor" ? "A. 플래시 카드 학습은 짧고 빈번한 학습을 통해 아이의 기억력 향상에 효과적이며, 에빙하우스의 간격 효과 연구에 따라 5-10분씩 하루 2-3회 학습이 적절하고, 즐거운 학습 분위기가 중요합니다."
                  : "A. Flash card learning is effective in enhancing children's memory through short and frequent study sessions. According to Ebbinghaus's spacing effect research (1885), 5-10 minute sessions, 2-3 times a day, are appropriate, considering children's attention span. Maintaining a positive and enjoyable learning atmosphere is also crucial."
              },
              {
                question: language === "kor" ? "Q. 오프라인 버전도 제공하나요?" : "Q. Do you offer an offline version?",
                answer: language === "kor" ? "A. 현재 웹 버전만 제공되지만, 모바일에서도 최적화되어 불편함 없이 사용 가능하며, 필요시 홈 화면에 추가하여 앱처럼 이용할 수 있습니다."
                  : "A. While we currently offer only the web version, it is optimized for mobile use, ensuring a seamless experience. You can also add it to your home screen for app-like convenience."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                
                <h3 className="font-semibold text-gray-800 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        {/* 추가된 플래시카드 관련 링크 */}
        <div className="mt-4 text-end">
            <a href="https://scholar.google.com/scholar?hl=ko&as_sdt=0%2C5&q=Flashcards&btnG=" 
            target="_blank" 
            className="text-blue-600 hover:underline">
            {language == "kor" ? "플래시카드 관련 학술 연구 보기" : "View Academic Research on Flashcards"}
            </a>
        </div>
        </CardContent>
      </Card>

      {/* Contact & Feedback Form */}
      <Card className="max-w-4xl mx-auto mb-8 bg-orange-50 hover:bg-orange-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <Mail className="w-8 h-8 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "문의 및 피드백" : "Contact & Feedback"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-center text-gray-700 mb-6">
            {language === "kor"
              ? (<>저희 서비스에 대한 의견이나 제안이 있으시면 아래 양식을 통해 보내주세요. <br />여러분의 피드백은 서비스 개선에 큰 도움이 됩니다. </>)
              : (<>If you have any opinions or suggestions about our service, please send them through the form below. <br /> Your feedback helps us improve our service.</> )
            }
          </p>
          <form ref={form} onSubmit={sendFeedback} className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                {language === "kor" ? "제목" : "Subject"}
              </label>
              <input
                type="text"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-inner"
                placeholder={language === "kor" ? "제목을 입력하세요" : "Enter subject"}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                {language === "kor" ? "메시지" : "Message"}
              </label>
              <textarea
                name="message"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-inner"
                rows="4"
                placeholder={
                  language === "kor"
                    ? "메시지를 입력하세요..."
                    : "Enter your message here..."
                }
              />
            </div>
            
            <div className="flex justify-center mt-6 items-center gap-2">
                <input
                    type="submit"
                    value={language === "kor" ? "메시지 보내기" : "Send Message"}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all"
                />
                </div>
            {status && (
              <p className={`text-sm ${status.includes('실패') || status.includes('Failed') ? 'text-red-600' : 'text-green-600'} mt-2 text-center font-medium`}>
                {status}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

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
};

export default ContactPage;