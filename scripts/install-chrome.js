const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const puppeteer = require("puppeteer");

function findChromeExecutable(rootPath) {
  if (!rootPath || !fs.existsSync(rootPath)) {
    return null;
  }

  const queue = [rootPath];

  while (queue.length > 0) {
    const currentPath = queue.pop();
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        queue.push(fullPath);
      } else if (entry.name.toLowerCase() === "chrome.exe") {
        return fullPath;
      }
    }
  }

  return null;
}

function findChromeArchive(rootPath) {
  if (!rootPath || !fs.existsSync(rootPath)) {
    return null;
  }

  const queue = [rootPath];

  while (queue.length > 0) {
    const currentPath = queue.pop();
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        queue.push(fullPath);
      } else if (entry.name.toLowerCase().endsWith("-chrome-win64.zip")) {
        return fullPath;
      }
    }
  }

  return null;
}

function extractChromeArchive(zipPath) {
  const archiveName = path.basename(zipPath, ".zip");
  const version = archiveName.replace("-chrome-win64", "");
  const cacheDir = path.dirname(zipPath);
  const destination = path.join(cacheDir, `win64-${version}`);
  const executablePath = path.join(destination, "chrome-win64", "chrome.exe");

  if (fs.existsSync(executablePath)) {
    return executablePath;
  }

  if (fs.existsSync(destination)) {
    fs.rmSync(destination, { recursive: true, force: true });
  }

  execSync(
    `powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${destination}' -Force"`,
    { stdio: "inherit", shell: true },
  );

  return fs.existsSync(executablePath) ? executablePath : null;
}

function ensureChromeInstalled() {
  const cacheRoot = path.join(os.homedir(), ".cache", "puppeteer");
  const existingExecutable = findChromeExecutable(cacheRoot);
  if (existingExecutable) {
    return existingExecutable;
  }

  const candidatePaths = [
    puppeteer.executablePath(),
    path.join(
      process.env.PROGRAMFILES || "C:\\Program Files",
      "Google",
      "Chrome",
      "Application",
      "chrome.exe",
    ),
    path.join(
      process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)",
      "Google",
      "Chrome",
      "Application",
      "chrome.exe",
    ),
    path.join(
      process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"),
      "Google",
      "Chrome",
      "Application",
      "chrome.exe",
    ),
  ].filter(Boolean);

  const foundSystemChrome = candidatePaths.find(
    (candidate) => candidate && fs.existsSync(candidate),
  );
  if (foundSystemChrome) {
    return foundSystemChrome;
  }

  const chromeArchive = findChromeArchive(cacheRoot);
  if (chromeArchive) {
    const extractedPath = extractChromeArchive(chromeArchive);
    if (extractedPath) {
      return extractedPath;
    }
  }

  if (fs.existsSync(cacheRoot)) {
    fs.rmSync(cacheRoot, { recursive: true, force: true });
  }

  try {
    execSync("npx puppeteer browsers install chrome", {
      stdio: "inherit",
      shell: true,
    });
  } catch (error) {
    console.warn("Puppeteer Chrome install warning:", error.message);
  }

  const installedExecutable = findChromeExecutable(cacheRoot);
  if (installedExecutable) {
    return installedExecutable;
  }

  const retryArchive = findChromeArchive(cacheRoot);
  if (retryArchive) {
    const extractedPath = extractChromeArchive(retryArchive);
    if (extractedPath) {
      return extractedPath;
    }
  }

  throw new Error(
    "Could not find a Chrome executable for Puppeteer. Please install Chrome manually or rerun npm install.",
  );
}

if (require.main === module) {
  try {
    const executablePath = ensureChromeInstalled();
    console.log(`Chrome ready at: ${executablePath}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { ensureChromeInstalled };
