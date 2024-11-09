import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const useScrollRestoration = () => {
  const router = useRouter();
  const scrollPositions = useRef<{ [key: string]: number }>({});
  const isBack = useRef(false);

  useEffect(() => {
    // 브라우저의 뒤로가기/앞으로가기 감지
    router.beforePopState(() => {
      isBack.current = true;
      return true;
    });

    // 페이지 이동 시작 시 현재 스크롤 위치 저장
    const saveScrollPosition = () => {
      scrollPositions.current[router.asPath] = window.scrollY;
    };

    // 페이지 이동 완료 후 스크롤 위치 복원 또는 최상단 이동
    const restoreScrollPosition = (nextPath: string) => {
      if (isBack.current) {
        // 뒤로가기의 경우 저장된 위치로 스크롤
        const savedPosition = scrollPositions.current[nextPath];
        if (savedPosition !== undefined) {
          setTimeout(() => {
            window.scrollTo(0, savedPosition);
          }, 0);
        }
        isBack.current = false;
      } else {
        // 새로운 페이지로 이동한 경우 최상단으로 스크롤
        window.scrollTo(0, 0);
      }
    };

    // 이벤트 리스너 등록
    router.events.on("routeChangeStart", saveScrollPosition);
    router.events.on("routeChangeComplete", restoreScrollPosition);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      router.events.off("routeChangeStart", saveScrollPosition);
      router.events.off("routeChangeComplete", restoreScrollPosition);
    };
  }, [router]);
};

export default useScrollRestoration;
