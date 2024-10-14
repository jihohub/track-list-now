const path = require("path");

module.exports = {
  i18n: {
    locales: ["ko", "en"],
    defaultLocale: "ko",
    localePath: path.resolve("./public/locales"),
  },
};
