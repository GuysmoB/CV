const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  getPdfFileName,
} = require("../language-config.js");

test("default language is French", () => {
  assert.equal(DEFAULT_LANGUAGE, "fr");
  assert.equal(normalizeLanguage(""), "fr");
  assert.equal(normalizeLanguage("FR"), "fr");
});

test("English language resolves and generates matching PDF name", () => {
  assert.equal(normalizeLanguage("en"), "en");
  assert.equal(getPdfFileName("en"), "remi-brauge-cv-en.pdf");
  assert.equal(getPdfFileName("fr"), "remi-brauge-cv-fr.pdf");
});
