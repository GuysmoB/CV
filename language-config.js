const DEFAULT_LANGUAGE = "fr";

function normalizeLanguage(language) {
  const normalized = String(language || DEFAULT_LANGUAGE)
    .trim()
    .toLowerCase();

  if (normalized === "en" || normalized === "eng" || normalized === "english") {
    return "en";
  }

  if (normalized === "fr" || normalized === "fre" || normalized === "french") {
    return "fr";
  }

  return DEFAULT_LANGUAGE;
}

function getPdfFileName(language) {
  const normalizedLanguage = normalizeLanguage(language);
  return `remi-brauge-cv-${normalizedLanguage}.pdf`;
}

module.exports = {
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  getPdfFileName,
};
