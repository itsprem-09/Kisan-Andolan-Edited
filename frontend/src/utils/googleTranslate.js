// utils/googleTranslate.js
export const loadGoogleTranslate = () => {
  return new Promise((resolve) => {
    if (window.google?.translate?.TranslateElement) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi",
          autoDisplay: false,
        },
        "google_translate_element"
      );
      resolve();
    };
  });
};
