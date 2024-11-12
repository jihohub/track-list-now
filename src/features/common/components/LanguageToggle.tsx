import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LanguageToggle = () => {
  const router = useRouter();
  const [isKorean, setIsKorean] = useState(router.locale === "ko"); // 현재 locale에 맞춰 초기 값 설정

  const changeLanguage = (lang: string) => {
    if (router.locale === lang) return;

    // 현재 URL을 그대로 사용하면서 locale만 변경
    const { pathname, query, asPath } = router;

    router.push({ pathname, query }, asPath, {
      locale: lang,
      shallow: true,
      scroll: false, // 페이지 스크롤 위치 유지
    });
  };

  useEffect(() => {
    setIsKorean(router.locale === "ko");
  }, [router.locale]);

  const handleToggle = () => {
    const newLang = !isKorean ? "ko" : "en";
    changeLanguage(newLang);
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleToggle}
        className="relative inline-flex w-14 h-8 rounded-full bg-zinc-400 cursor-pointer transition-colors duration-300 ease-in-out"
        type="button"
        aria-label="Toggle Language"
      >
        <span
          className={`absolute w-8 h-8 rounded-full transition-transform duration-300 ease-in-out bg-zinc-900 flex items-center justify-center ${
            isKorean ? "translate-x-0" : "translate-x-6"
          }`}
        >
          {isKorean ? "KO" : "EN"}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;
