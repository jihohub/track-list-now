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
  // eslint-disable-next-line no-cond-assign
  while ((match = sizeRegex.exec(size)) !== null) {
    const breakpoint = match[1] || "base";
    const sizeValue = parseInt(match[2], 10) * 4;
    sizes.push({ breakpoint, width: sizeValue });
  }

  const breakpointOrder = ["base", "sm", "md", "lg", "xl", "2xl"];
  sizes.sort(
    (a, b) =>
      breakpointOrder.indexOf(a.breakpoint) -
      breakpointOrder.indexOf(b.breakpoint),
  );

  let sizesString = "";
  sizes.forEach((sizeObj) => {
    if (sizeObj.breakpoint === "base") {
      sizesString += `${sizeObj.width}px`;
    } else {
      sizesString += `(min-width: ${breakpoints[sizeObj.breakpoint]}) ${sizeObj.width}px, `;
    }
  });

  return sizesString.slice(0, -2);
};

export default parseSizes;
