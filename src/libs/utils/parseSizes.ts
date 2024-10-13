const breakpoints: Record<string, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

const parseSizes = (size: string): string => {
  const sizeRegex = /(?:(sm|md|lg|xl|2xl):)?w-(\d+)/g;
  const sizes: Array<{ breakpoint: string; width: number }> = [];

  let match;
  while ((match = sizeRegex.exec(size)) !== null) {
    const breakpoint = match[1] || "base";
    const sizeValue = parseInt(match[2], 10) * 4; // Tailwind의 w-12는 48px, w-16은 64px 등
    sizes.push({ breakpoint, width: sizeValue });
  }

  // 브레이크포인트 순서에 따라 정렬: base < sm < md < lg < xl < 2xl
  const breakpointOrder = ["base", "sm", "md", "lg", "xl", "2xl"];
  sizes.sort(
    (a, b) =>
      breakpointOrder.indexOf(a.breakpoint) -
      breakpointOrder.indexOf(b.breakpoint),
  );

  // sizes 문자열 구성
  let sizesString = "";
  sizes.forEach((sizeObj) => {
    if (sizeObj.breakpoint === "base") {
      sizesString += `${sizeObj.width}px`;
    } else {
      sizesString += `(min-width: ${breakpoints[sizeObj.breakpoint]}) ${sizeObj.width}px, `;
    }
  });

  // 마지막 쉼표와 공백 제거
  return sizesString.slice(0, -2);
};

export default parseSizes;
