const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const { ensureChromeInstalled } = require("./scripts/install-chrome");
const { normalizeLanguage, getPdfFileName } = require("./language-config");

const app = express();
const customPort = Number(process.env.CV_PORT || 0);
const cliLanguage = process.argv.find((arg) => arg.startsWith("--lang="));
const requestedLanguage = normalizeLanguage(
  cliLanguage ? cliLanguage.split("=")[1] : process.env.CV_LANG || "fr",
);
const outputFile = getPdfFileName(requestedLanguage);

app.use(express.static(path.resolve(__dirname, "dist")));
app.use("/asset", express.static(path.resolve(__dirname, "dist/asset")));
app.use("/asset", express.static(path.resolve(__dirname, "asset")));

const server = app.listen(customPort, async () => {
  let browser;

  try {
    const actualPort = server.address().port;
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: ensureChromeInstalled(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const pageUrl = new URL(`http://localhost:${actualPort}/`);
    pageUrl.searchParams.set("lang", requestedLanguage);

    await page.goto(pageUrl.toString(), { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");

    await page.pdf({
      path: outputFile,
      format: "A4",
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
      preferCSSPageSize: true,
      printBackground: true,
    });

    console.log(`PDF generated successfully: ${outputFile}`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }

    server.close();
  }
});
