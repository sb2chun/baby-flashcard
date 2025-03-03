import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { FileText, Copyright, Image, Info } from "lucide-react";

const LicensePage = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Header Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-4xl font-bold text-blue-600">
              {language === "kor" ? "라이센스 정보" : "License Information"}
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {language === "kor"
                ? "우리 아이 플래시카드에 사용된 콘텐츠에 대한 라이센스 정보"
                : "License information for content used in Baby Flashcards"}
            </p>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Pixabay License Information */}
      <Card className="max-w-4xl mx-auto mb-8 bg-white hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <Image className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "이미지 라이센스" : "Image License"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-6 text-gray-700">
            <div className="flex items-start gap-3">
              <Copyright className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "kor" ? "Pixabay 라이센스" : "Pixabay License"}
                </h3>
                <p className="text-sm leading-relaxed">
                  {language === "kor" ? (
                    <>
                      본 웹사이트에 사용된 모든 이미지는 <a href="https://pixabay.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pixabay</a>에서 제공된 것으로, Pixabay 라이센스 하에 사용되었습니다. Pixabay 라이센스는 다음과 같은 사항을 명시합니다:
                    </>
                  ) : (
                    <>
                      All images used on this website are provided by <a href="https://pixabay.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pixabay</a> and are used under the Pixabay License. The Pixabay License states the following:
                    </>
                  )}
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-sm">
                  <li>
                    {language === "kor"
                      ? "상업적 및 비상업적 사용에 무료로 사용할 수 있습니다."
                      : "Free for commercial and non-commercial use."}
                  </li>
                  <li>
                    {language === "kor"
                      ? "귀속(attribution)이 필요하지 않습니다."
                      : "No attribution required."}
                  </li>
                  <li>
                    {language === "kor"
                      ? "콘텐츠 자체를 수정하여 사용할 수 있습니다."
                      : "Content can be modified and used."}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "kor" ? "이미지 사용 정책" : "Image Usage Policy"}
                </h3>
                <p className="text-sm leading-relaxed">
                  {language === "kor" ? (
                    <>
                      우리 아이 플래시카드는 교육 목적으로 이미지를 사용하고 있으며, 모든 이미지는 Pixabay의 라이센스 정책을 준수합니다. 다음 사항을 유의해주세요:
                    </>
                  ) : (
                    <>
                      Baby Flashcards uses images for educational purposes and complies with Pixabay's licensing policy. Please note the following:
                    </>
                  )}
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-sm">
                  <li>
                    {language === "kor"
                      ? "본 웹사이트에 사용된 모든 이미지는 교육적 목적으로만 사용됩니다."
                      : "All images used on this website are for educational purposes only."}
                  </li>
                  <li>
                    {language === "kor"
                      ? "이미지의 저작권은 원 저작자에게 있습니다."
                      : "The copyright of the images belongs to the original creators."}
                  </li>
                  <li>
                    {language === "kor"
                      ? "이미지의 무단 복제 및 재배포는 금지됩니다."
                      : "Unauthorized reproduction and redistribution of images is prohibited."}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms of Use */}
      <Card className="max-w-4xl mx-auto mb-8 bg-white hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-3">
            <FileText className="w-8 h-8 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {language === "kor" ? "이용 약관" : "Terms of Use"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-6 text-gray-700">
            <p className="text-sm leading-relaxed">
              {language === "kor" ? (
                <>
                  우리 아이 플래시카드 웹사이트 이용 시 다음 약관에 동의하는 것으로 간주됩니다:
                </>
              ) : (
                <>
                  By using the Baby Flashcards website, you agree to the following terms:
                </>
              )}
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "1. 콘텐츠 사용" : "1. Content Usage"}
                </h3>
                <p>
                  {language === "kor"
                    ? "　본 웹사이트에서 제공하는 콘텐츠는 교육 목적으로만 사용해야 하며, 상업적 용도로 재배포할 수 없습니다."
                    : "　Content provided on this website is for educational purposes only and may not be redistributed for commercial purposes."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "2. 개인정보 보호" : "2. Privacy"}
                </h3>
                <p>
                  {language === "kor"
                    ? "　사용자가 제공한 개인정보는 서비스 개선 목적으로만 사용되며, 제3자에게 제공되지 않습니다."
                    : "　Personal information provided by users is used only for service improvement purposes and is not shared with third parties."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "3. 책임 제한" : "3. Limitation of Liability"}
                </h3>
                <p>
                  {language === "kor"
                    ? "　우리 아이 플래시카드는 콘텐츠의 정확성을 보장하기 위해 노력하지만, 모든 정보에 대한 책임을 지지 않습니다."
                    : "　Baby Flashcards strives to ensure the accuracy of its content, but does not assume responsibility for all information."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  {language === "kor" ? "4. 변경 사항" : "4. Changes"}
                </h3>
                <p>
                  {language === "kor"
                    ? "　본 약관은 사전 통지 없이 변경될 수 있으며, 지속적인 사용은 변경된 약관에 동의하는 것으로 간주됩니다."
                    : "　These terms may change without prior notice, and continued use constitutes agreement to the modified terms."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copyright Notice */}
      <Card className="max-w-4xl mx-auto mb-8 bg-white hover:shadow-lg transition-all duration-300">
        <CardContent className="py-4">
          <p className="text-center text-sm text-gray-600">
            {language === "kor"
              ? `© ${new Date().getFullYear()} 우리 아이 플래시카드. 모든 권리 보유.`
              : `© ${new Date().getFullYear()} Baby Flashcards. All rights reserved.`}
          </p>
        </CardContent>
      </Card>

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

export default LicensePage;