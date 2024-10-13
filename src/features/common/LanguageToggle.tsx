// /features/common/LanguageToggle.tsx
import { useRouter } from "next/router";
import { useState } from "react";

const LanguageToggle = () => {
  const router = useRouter();
  const [isKorean, setIsKorean] = useState(router.locale === "ko"); // 현재 locale에 맞춰 초기 값 설정

  const changeLanguage = (lang) => {
    if (router.locale !== lang) {
      router.push(router.pathname, router.asPath, { locale: lang });
    }
  };

  const handleToggle = () => {
    setIsKorean((prevIsKorean) => {
      const newLang = !prevIsKorean ? "ko" : "en";
      changeLanguage(newLang);
      return !prevIsKorean;
    });
  };

  return (
    <div className="flex items-center space-x-3">
      <div
        onClick={handleToggle}
        className="relative inline-block w-14 h-8 rounded-full bg-zinc-400 cursor-pointer transition-colors duration-300 ease-in-out"
      >
        <span
          className={`absolute w-8 h-8 rounded-full transition-transform duration-300 ease-in-out bg-zinc-900 flex items-center justify-center ${
            isKorean ? "translate-x-0" : "translate-x-6"
          }`}
        >
          {isKorean ? "KO" : "EN"}
        </span>
      </div>
    </div>
  );
};

export default LanguageToggle;
