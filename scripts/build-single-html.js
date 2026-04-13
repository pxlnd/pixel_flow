#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const outputHtmlPath = path.join(distDir, "index.html");
const NETWORKS = [
  { key: "AL", name: "AppLovin" },
  { key: "GA", name: "GoogleAds" },
  { key: "MT", name: "Mintegral" },
];

function toPosix(value) {
  return value.replace(/\\/g, "/");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readText(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  return fs.readFileSync(absolutePath, "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function collectFilesRecursively(baseDir) {
  const absoluteBase = path.join(projectRoot, baseDir);
  if (!fs.existsSync(absoluteBase)) {
    return [];
  }
  const out = [];
  const stack = [absoluteBase];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      const rel = toPosix(path.relative(projectRoot, absolute));
      out.push(rel);
    }
  }
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

function mimeByExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".ttf":
      return "font/ttf";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    case ".mp3":
      return "audio/mpeg";
    case ".ogg":
      return "audio/ogg";
    case ".wav":
      return "audio/wav";
    case ".m4a":
      return "audio/mp4";
    case ".aac":
      return "audio/aac";
    default:
      return "application/octet-stream";
  }
}

async function toDataUri(relativePath, options = {}) {
  const preferWebp = options.preferWebp !== false;
  const quality = Number.isInteger(options.quality)
    ? Math.max(1, Math.min(100, options.quality))
    : 92;
  const absolutePath = path.join(projectRoot, relativePath);
  const buffer = fs.readFileSync(absolutePath);
  const ext = path.extname(relativePath).toLowerCase();
  if (preferWebp && (ext === ".png" || ext === ".jpg" || ext === ".jpeg")) {
    const webpBuffer = await sharp(buffer).webp({ quality }).toBuffer();
    return `data:image/webp;base64,${webpBuffer.toString("base64")}`;
  }
  if (!preferWebp && (ext === ".jpg" || ext === ".jpeg")) {
    const jpegBuffer = await sharp(buffer).jpeg({ quality, mozjpeg: true }).toBuffer();
    return `data:image/jpeg;base64,${jpegBuffer.toString("base64")}`;
  }
  if (!preferWebp && ext === ".png") {
    const pngBuffer = await sharp(buffer).png({
      compressionLevel: 9,
      effort: 10,
      palette: quality < 100,
      quality,
    }).toBuffer();
    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
  }
  const fallbackMime = mimeByExtension(relativePath);
  return `data:${fallbackMime};base64,${buffer.toString("base64")}`;
}

function getScriptSourcesFromIndex(indexHtml) {
  const regex = /<script\s+src="([^"]+)"><\/script>/g;
  const sources = [];
  let match = regex.exec(indexHtml);
  while (match) {
    sources.push(match[1]);
    match = regex.exec(indexHtml);
  }
  return sources;
}

function normalizeScriptSrcToPath(src) {
  return src.split("?")[0].trim().replace(/^\.\//, "");
}

function escapeForInlineScript(jsCode) {
  return jsCode.replace(/<\/script>/gi, "<\\/script>");
}

function parseDataUri(value) {
  if (!/^data:/i.test(value)) {
    return null;
  }
  const commaIndex = value.indexOf(",");
  if (commaIndex < 0) {
    return null;
  }
  const meta = value.slice("data:".length, commaIndex);
  const payload = value.slice(commaIndex + 1);
  return { meta, payload };
}

function toBase64DataUri(meta, payload) {
  if (/;base64(?:;|$)/i.test(meta)) {
    return `data:${meta},${payload}`;
  }
  let decodedPayload = payload;
  try {
    decodedPayload = decodeURIComponent(payload);
  } catch {}
  const base64Payload = Buffer.from(String(decodedPayload), "utf8").toString("base64");
  return `data:${meta};base64,${base64Payload}`;
}

function normalizeCssDataUrisToBase64(cssText) {
  return String(cssText || "").replace(/url\(([^)]+)\)/gi, (full, rawValue) => {
    const unquoted = String(rawValue || "").trim().replace(/^['"]|['"]$/g, "");
    if (!/^data:/i.test(unquoted)) {
      return full;
    }
    const parsed = parseDataUri(unquoted);
    if (!parsed) {
      return full;
    }
    const normalized = toBase64DataUri(parsed.meta, parsed.payload);
    return `url("${normalized}")`;
  });
}

function normalizeQuotedDataUrisToBase64(inputText) {
  let output = String(inputText || "");
  const patterns = [
    { quote: '"', pattern: /"data:([^,"]+),([^"]*)"/gi },
    { quote: "'", pattern: /'data:([^,']+),([^']*)'/gi },
  ];
  for (const { quote, pattern } of patterns) {
    output = output.replace(pattern, (fullMatch, meta, payload) => (
      `${quote}${toBase64DataUri(meta, payload)}${quote}`
    ));
  }
  return output;
}

function countNonBase64QuotedDataUris(inputText) {
  const source = String(inputText || "");
  const patterns = [
    /"data:([^,"]+),([^"]*)"/gi,
    /'data:([^,']+),([^']*)'/gi,
  ];
  let count = 0;
  for (const pattern of patterns) {
    source.replace(pattern, (fullMatch, meta) => {
      if (!/;base64(?:;|$)/i.test(meta)) {
        count += 1;
      }
      return fullMatch;
    });
  }
  return count;
}

function inlineCssAssetUrls(cssText, assetMap) {
  return String(cssText || "").replace(/url\(([^)]+)\)/gi, (full, rawValue) => {
    const unquoted = String(rawValue || "").trim().replace(/^['"]|['"]$/g, "");
    if (!unquoted || /^data:/i.test(unquoted) || /^(https?:|blob:)/i.test(unquoted)) {
      return full;
    }
    const normalized = unquoted.replace(/\\/g, "/").replace(/^\.\//, "");
    const mapped = assetMap[normalized];
    if (!mapped) {
      return full;
    }
    return `url("${mapped}")`;
  });
}

function buildNetworkAdapter(networkKey) {
  return `(function initPlayableNetworkAdapter(){
  var NETWORK = ${JSON.stringify(networkKey)};
  var clicked = false;
  var firstInteractionAt = 0;
  var landingUrl = "https://example.com";
  var didReportReady = false;
  var didReportEnd = false;
  var lastMode = "";
  var canOpenStore = false;
  var endOverlayShown = false;
  var nativeExitApiExit = (window.ExitApi && typeof window.ExitApi.exit === "function")
    ? window.ExitApi.exit.bind(window.ExitApi)
    : null;
  var nativeInstall = (typeof window.install === "function")
    ? window.install.bind(window)
    : null;

  function markFirstInteraction() {
    if (firstInteractionAt === 0) {
      firstInteractionAt = Date.now();
      window.__playableFirstInteractionAt = firstInteractionAt;
    }
  }

  function networkOpen(url) {
    var target = String(url || landingUrl || "https://example.com");

    if (NETWORK === "MT" && typeof nativeInstall === "function") {
      safeCall(["gameEnd", "gameEndV", "gameEndY"]);
      try {
        nativeInstall();
        return true;
      } catch {}
    }

    if (NETWORK === "GA") {
      if (window.ExitApi && typeof window.ExitApi.exit === "function") {
        window.ExitApi.exit();
        return true;
      }
      if (typeof nativeExitApiExit === "function") {
        nativeExitApiExit();
        return true;
      }
    }

    if (window.mraid && typeof window.mraid.open === "function") {
      try {
        window.mraid.open(target);
        return true;
      } catch {}
    }

    if (window.dapi && typeof window.dapi.openStoreUrl === "function") {
      try {
        window.dapi.openStoreUrl();
        return true;
      } catch {}
    }

    if (window.open) {
      window.open(target, "_blank");
      return true;
    }
    return false;
  }

  window.playableSetLandingUrl = function setLandingUrl(url) {
    landingUrl = String(url || landingUrl);
  };

  window.playableOpen = function playableOpen(url) {
    markFirstInteraction();
    if (!canOpenStore) return false;
    if (clicked) return false;
    clicked = true;
    return networkOpen(url);
  };

  if (typeof window.install !== "function") {
    window.install = function install() {
      return networkOpen(landingUrl);
    };
  }

  function safeCall(nameList) {
    for (var i = 0; i < nameList.length; i += 1) {
      var fnName = nameList[i];
      if (typeof window[fnName] === "function") {
        try { window[fnName](); } catch {}
      }
    }
  }

  function reportReadyOnce() {
    if (didReportReady) return;
    didReportReady = true;
    safeCall(["gameReady", "gameReadyV", "gameReadyY"]);
  }

  function reportEndOnce() {
    if (didReportEnd) return;
    didReportEnd = true;
    canOpenStore = true;
    safeCall(["gameEnd", "gameEndV", "gameEndY"]);
    showEndOverlay();
  }

  function reportClose() {
    safeCall(["gameClose", "gameCloseV", "gameCloseY"]);
  }

  if (typeof window.gameStart !== "function") {
    window.gameStart = function gameStart() {};
  }
  if (typeof window.gameRetry !== "function") {
    window.gameRetry = function gameRetry() {};
  }
  if (typeof window.gameClose !== "function") {
    window.gameClose = function gameClose() {};
  }
  if (typeof window.gameEnd !== "function") {
    window.gameEnd = function gameEnd() {};
  }
  if (typeof window.gameReady !== "function") {
    window.gameReady = function gameReady() {};
  }

  function showEndOverlay() {
    if (endOverlayShown) return;
    endOverlayShown = true;
    var root = document.createElement("div");
    root.id = "playable_end_overlay";
    root.style.position = "fixed";
    root.style.inset = "0";
    root.style.zIndex = "2147483647";
    root.style.background = "transparent";
    root.style.display = "flex";
    root.style.alignItems = "center";
    root.style.justifyContent = "center";
    root.style.padding = "16px";
    root.style.pointerEvents = "auto";
    root.style.touchAction = "none";
    root.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });
    root.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.playableOpen(landingUrl);
    });
    document.body.appendChild(root);
  }

  if (!window.ExitApi) {
    window.ExitApi = {
      exit: function exit() {
        return window.playableOpen(landingUrl);
      },
    };
  }

  if (window.ExitApi && typeof window.ExitApi.exit !== "function") {
    window.ExitApi.exit = function exit() {
      return window.playableOpen(landingUrl);
    };
  }

  function tryReadGameMode() {
    try {
      if (typeof window.render_game_to_text === "function") {
        var raw = window.render_game_to_text();
        var parsed = raw ? JSON.parse(raw) : null;
        if (parsed && typeof parsed.mode === "string") {
          return parsed.mode;
        }
      }
      if (window.game && typeof window.game.gameState === "string") {
        return window.game.gameState;
      }
    } catch {}
    return "";
  }

  function monitorLifecycle() {
    var mode = tryReadGameMode();
    if (mode && mode !== lastMode) {
      if (mode === "playing") {
        reportReadyOnce();
      }
      if (mode === "won" || mode === "victory" || mode === "lose" || mode === "lost") {
        reportEndOnce();
      }
      lastMode = mode;
    }
    if (NETWORK === "MT" && !didReportReady && window.game) {
      reportReadyOnce();
    }
  }

  var lifecycleTimer = setInterval(monitorLifecycle, 250);
  window.addEventListener("beforeunload", function () {
    clearInterval(lifecycleTimer);
    reportClose();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      reportClose();
    }
  });
  window.addEventListener("pointerdown", markFirstInteraction, { passive: true, once: true });
  // Allow full-screen tap-to-store only after game ends.
  document.addEventListener("pointerup", function onAnyTap() {
    if (!canOpenStore) return;
    window.playableOpen(landingUrl);
  }, { passive: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      reportReadyOnce();
    }, { once: true });
  } else {
    reportReadyOnce();
  }
})();`;
}

function createZipWithIndexHtml(zipPath, htmlContent) {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pixelflow-playable-"));
  const tmpFolder = path.join(tmpRoot, "payload");
  const tmpIndexPath = path.join(tmpFolder, "index.html");
  fs.mkdirSync(tmpFolder, { recursive: true });
  fs.writeFileSync(tmpIndexPath, htmlContent, "utf8");
  try {
    execFileSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Compress-Archive -Path "${tmpIndexPath}" -DestinationPath "${zipPath}" -Force`,
      ],
      { stdio: "pipe" },
    );
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

function parseCliArgs(argv) {
  let levelNumber = null;
  let imageQuality = null;
  let imageQualityAl = null;
  let imageQualityOther = null;
  function parseQuality(value) {
    const parsed = Number.parseInt(String(value || "").trim(), 10);
    if (!Number.isInteger(parsed)) return null;
    return Math.max(1, Math.min(100, parsed));
  }
  for (let i = 0; i < argv.length; i += 1) {
    const token = String(argv[i] || "").trim();
    if (!token) continue;
    if (token.startsWith("--level=")) {
      const value = token.slice("--level=".length).trim();
      const parsed = Number.parseInt(value, 10);
      if (Number.isInteger(parsed) && parsed > 0) {
        levelNumber = parsed;
      }
      continue;
    }
    if (token === "--level" && i + 1 < argv.length) {
      const value = String(argv[i + 1] || "").trim();
      const parsed = Number.parseInt(value, 10);
      if (Number.isInteger(parsed) && parsed > 0) {
        levelNumber = parsed;
      }
      i += 1;
      continue;
    }
    if (token.startsWith("--quality=")) {
      imageQuality = parseQuality(token.slice("--quality=".length));
      continue;
    }
    if (token === "--quality" && i + 1 < argv.length) {
      imageQuality = parseQuality(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token.startsWith("--quality-al=")) {
      imageQualityAl = parseQuality(token.slice("--quality-al=".length));
      continue;
    }
    if (token === "--quality-al" && i + 1 < argv.length) {
      imageQualityAl = parseQuality(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token.startsWith("--quality-other=")) {
      imageQualityOther = parseQuality(token.slice("--quality-other=".length));
      continue;
    }
    if (token === "--quality-other" && i + 1 < argv.length) {
      imageQualityOther = parseQuality(argv[i + 1]);
      i += 1;
      continue;
    }
    if (/^\d+$/.test(token)) {
      const parsed = Number.parseInt(token, 10);
      if (Number.isInteger(parsed) && parsed > 0) {
        levelNumber = parsed;
      }
    }
  }
  return { levelNumber, imageQuality, imageQualityAl, imageQualityOther };
}

function buildPrelude(assetMap, levelJsonMap, options = {}) {
  const payload = {
    assets: assetMap,
    levels: levelJsonMap,
    options: {
      singleLevelNumber: Number.isInteger(options.singleLevelNumber) ? options.singleLevelNumber : null,
    },
  };

  const prelude = `(function initSingleHtmlRuntime(){
  const payload = ${JSON.stringify(payload)};
  const assetMap = payload.assets || {};
  const levelMap = payload.levels || {};
  const singleLevelNumber = Number.isInteger(payload?.options?.singleLevelNumber)
    ? payload.options.singleLevelNumber
    : null;

  function normalizePath(input) {
    if (input == null) return "";
    let raw = String(input).trim();
    if (!raw) return "";
    if (raw.startsWith("data:")) return raw;
    try {
      const url = new URL(raw, window.location.href);
      raw = url.pathname || raw;
    } catch {}
    raw = raw.split("?")[0].split("#")[0];
    raw = raw.replace(/^\\/+/, "");
    raw = raw.replace(/^\\.\\//, "");
    raw = raw.replace(/\\\\/g, "/");
    try {
      raw = decodeURIComponent(raw);
    } catch {}

    const lowered = raw.toLowerCase();
    const uiIndex = lowered.lastIndexOf("/ui/");
    if (uiIndex >= 0) {
      raw = raw.slice(uiIndex + 1);
      return raw;
    }
    const levelsIndex = lowered.lastIndexOf("/game-data/levels/");
    if (levelsIndex >= 0) {
      raw = raw.slice(levelsIndex + 1);
      return raw;
    }
    if (lowered.endsWith("/ref.png")) {
      return "Ref.png";
    }
    if (/^dist\\//i.test(raw)) {
      raw = raw.replace(/^dist\\//i, "");
    }
    return raw;
  }

  function getLevelJsonCanonicalPath(normalizedPath) {
    const match = String(normalizedPath || "").match(/(?:^|\\/)game-data\\/levels\\/(\\d+)\\.json$/i);
    if (!match) return "";
    return "game-data/levels/" + match[1] + ".json";
  }

  window.__PIXELFLOW_SINGLE_HTML__ = {
    assets: assetMap,
    levels: levelMap,
  };

  // Force-hide debug UI in standalone builds.
  try {
    if (window.localStorage) {
      window.localStorage.setItem("pixelflow.debug.topLevelNavVisible.v1", "false");
      window.localStorage.setItem("pixelflow.debug.settings", JSON.stringify({ panelOpen: false }));
    }
  } catch {}

  const originalFetch = window.fetch ? window.fetch.bind(window) : null;
  if (originalFetch) {
    window.fetch = function patchedFetch(input, init) {
      const rawUrl = typeof input === "string" ? input : (input && input.url) || "";
      const normalized = normalizePath(rawUrl);

      let levelKey = getLevelJsonCanonicalPath(normalized);
      if (!levelKey && singleLevelNumber && /(?:^|\\/)game-data\\/levels\\/\\d+\\.json$/i.test(String(normalized || ""))) {
        levelKey = "game-data/levels/" + singleLevelNumber + ".json";
      }
      if (!levelKey && singleLevelNumber && /^game-data\\/levels\\/\\d+\\.json$/i.test(String(normalized || ""))) {
        levelKey = "game-data/levels/" + singleLevelNumber + ".json";
      }
      if (!levelKey && singleLevelNumber && /^game-data\\/levels\\/1\\.json$/i.test(String(normalized || ""))) {
        levelKey = "game-data/levels/" + singleLevelNumber + ".json";
      }
      if (levelKey) {
        const levelText = levelMap[levelKey];
        if (typeof levelText === "string") {
          return Promise.resolve(new Response(levelText, {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
          }));
        }
        return Promise.resolve(new Response("Not Found", {
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }));
      }

      if (normalized === "ui/birds/" || normalized === "ui/blocks/" || normalized === "ui/birds" || normalized === "ui/blocks") {
        return Promise.resolve(new Response("Not Found", { status: 404 }));
      }

      const mappedAsset = assetMap[normalized];
      if (mappedAsset) {
        return originalFetch(mappedAsset, init);
      }

      return originalFetch(input, init);
    };
  }

  const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (srcDescriptor && typeof srcDescriptor.set === "function" && typeof srcDescriptor.get === "function") {
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: true,
      enumerable: srcDescriptor.enumerable,
      get: function getPatchedSrc() {
        return srcDescriptor.get.call(this);
      },
      set: function setPatchedSrc(value) {
        const normalized = normalizePath(value);
        const mappedAsset = assetMap[normalized];
        if (mappedAsset) {
          srcDescriptor.set.call(this, mappedAsset);
          return;
        }
        srcDescriptor.set.call(this, value);
      },
    });
  }

  function hideDebugUi() {
    var fab = document.getElementById("debugToggleFab");
    if (fab) {
      fab.hidden = true;
      fab.style.display = "none";
      fab.style.visibility = "hidden";
      fab.style.pointerEvents = "none";
      fab.setAttribute("aria-hidden", "true");
      fab.tabIndex = -1;
    }
    var panel = document.getElementById("debugPanel");
    if (panel) {
      panel.hidden = true;
      panel.classList.remove("is-visible");
      panel.style.display = "none";
      panel.style.visibility = "hidden";
      panel.style.pointerEvents = "none";
      panel.setAttribute("aria-hidden", "true");
    }
    const nav = document.querySelector(".debug-level-nav");
    if (nav) {
      nav.hidden = true;
      nav.style.display = "none";
      nav.style.visibility = "hidden";
      nav.style.pointerEvents = "none";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideDebugUi, { once: true });
  } else {
    hideDebugUi();
  }
})();`;

  return prelude;
}

function injectHeadTags(indexHtml, networkKey) {
  const orientationMeta = `<meta name="ad.orientation" content="portrait,landscape">`;
  const networkMeta = `<meta name="playable.network" content="${networkKey}">`;
  let output = indexHtml.replace(/<meta charset="UTF-8">/i, '<meta charset="UTF-8" />');
  if (networkKey === "GA") {
    output = output.replace(
      /<meta name="viewport"[^>]*>/i,
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    );
  } else {
    output = output.replace(
      /<meta name="viewport"[^>]*>/i,
      '<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0"/>',
    );
  }
  // Remove external font requests for strict playable validators.
  output = output.replace(/^\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*$/gim, "");
  output = output.replace(/^\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*$/gim, "");
  output = output.replace(/^\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Baloo\+2:[^"]+" rel="stylesheet">\s*$/gim, "");
  if (networkKey === "GA" && !/exitapi\.js/i.test(output)) {
    output = output.replace(
      "</head>",
      '  <script type="text/javascript" src="https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js"></script>\n</head>',
    );
  }
  if (!output.includes(`name="ad.orientation"`)) {
    output = output.replace("</head>", `  ${orientationMeta}\n  ${networkMeta}\n</head>`);
  } else if (!output.includes(`name="playable.network"`)) {
    output = output.replace("</head>", `  ${networkMeta}\n</head>`);
  }
  return output;
}

function buildEmbeddedFontCss(assetMap) {
  const bold = assetMap["fonts/Baloo2-Bold.ttf"] || "";
  const extraBold = assetMap["fonts/Baloo2-ExtraBold.ttf"] || "";
  if (!bold && !extraBold) {
    return "";
  }
  const blocks = [];
  if (bold) {
    blocks.push(`@font-face {
  font-family: "Baloo 2";
  src: url("${bold}") format("truetype");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}`);
  }
  if (extraBold) {
    blocks.push(`@font-face {
  font-family: "Baloo 2";
  src: url("${extraBold}") format("truetype");
  font-style: normal;
  font-weight: 800;
  font-display: swap;
}`);
  }
  return blocks.join("\n\n");
}

async function buildEmbeddedFontAssetMap() {
  const assetMap = {};
  if (fileExists("fonts/Baloo2-Bold.ttf")) {
    assetMap["fonts/Baloo2-Bold.ttf"] = await toDataUri("fonts/Baloo2-Bold.ttf", { preferWebp: false });
  }
  if (fileExists("fonts/Baloo2-ExtraBold.ttf")) {
    assetMap["fonts/Baloo2-ExtraBold.ttf"] = await toDataUri("fonts/Baloo2-ExtraBold.ttf", { preferWebp: false });
  }
  return assetMap;
}

async function buildEmbeddedSoundAssetMap() {
  const assetMap = {};
  for (const relPath of collectFilesRecursively("sounds")) {
    if (relPath.toLowerCase().endsWith(".ds_store")) {
      continue;
    }
    const dataUri = await toDataUri(relPath, { preferWebp: false });
    assetMap[relPath] = dataUri;
    const lowerPath = relPath.toLowerCase();
    if (!assetMap[lowerPath]) {
      assetMap[lowerPath] = dataUri;
    }
  }
  return assetMap;
}

function readHowlerRuntimeCode() {
  const candidates = [
    path.join(projectRoot, "node_modules", "howler", "dist", "howler.core.min.js"),
    path.join(projectRoot, "node_modules", "howler", "dist", "howler.min.js"),
  ];
  for (const candidatePath of candidates) {
    if (fs.existsSync(candidatePath)) {
      return fs.readFileSync(candidatePath, "utf8");
    }
  }
  throw new Error(
    "howler.js runtime was not found in node_modules. Run `npm install howler` and build again.",
  );
}

function buildHowlerSoundManagerRuntime(soundAssetMap) {
  const howlerRuntimeCode = readHowlerRuntimeCode();
  const serializedSoundMap = JSON.stringify(soundAssetMap || {});
  return `${howlerRuntimeCode}
;(function initSingleHtmlSoundManager(){
  var soundMap = ${serializedSoundMap};

  function normalizeSoundPath(input) {
    if (input == null) return "";
    var raw = String(input).trim();
    if (!raw) return "";
    if (raw.indexOf("data:") === 0) return raw;
    try {
      raw = new URL(raw, window.location.href).pathname || raw;
    } catch (error) {}
    raw = raw.split("?")[0].split("#")[0];
    raw = raw.replace(/^\\/+/, "");
    raw = raw.replace(/^\\.\\//, "");
    raw = raw.replace(/\\\\/g, "/");
    try {
      raw = decodeURIComponent(raw);
    } catch (error) {}
    var lowered = raw.toLowerCase();
    var soundsIndex = lowered.lastIndexOf("/sounds/");
    if (soundsIndex >= 0) {
      return raw.slice(soundsIndex + 1);
    }
    if (/^dist\\//i.test(raw)) {
      raw = raw.replace(/^dist\\//i, "");
    }
    return raw;
  }

  function resolveSoundSrc(src) {
    var normalized = normalizeSoundPath(src);
    if (soundMap[normalized]) {
      return soundMap[normalized];
    }
    var lowered = normalized.toLowerCase();
    if (soundMap[lowered]) {
      return soundMap[lowered];
    }
    return src;
  }

  function SoundManager(definitions) {
    this.howlByName = new Map();
    this.unlocked = false;
    var source = definitions && typeof definitions === "object" ? definitions : {};
    var entries = Object.entries(source);
    for (var i = 0; i < entries.length; i += 1) {
      var entry = entries[i];
      var name = entry[0];
      var config = entry[1] || {};
      var rawSrc = typeof config.src === "string" ? config.src : "";
      if (!rawSrc) {
        continue;
      }
      var channelsCount = Math.max(1, Math.min(8, Math.round(Number(config.channels) || 1)));
      var volume = Number.isFinite(config.volume) ? Math.max(0, Math.min(1, Number(config.volume))) : 1;
      var resolvedSrc = resolveSoundSrc(rawSrc);
      try {
        var howl = new Howl({
          src: [resolvedSrc],
          preload: true,
          pool: channelsCount,
          volume: volume,
          html5: false,
        });
        this.howlByName.set(name, howl);
      } catch (error) {
        // Ignore malformed per-sound config and continue with remaining sounds.
      }
    }
  }

  SoundManager.prototype.unlock = function unlock() {
    if (this.unlocked) {
      return;
    }
    this.unlocked = true;
    try {
      if (typeof Howler !== "undefined" && Howler.ctx && typeof Howler.ctx.resume === "function") {
        void Howler.ctx.resume();
      }
    } catch (error) {
      // Ignore unlock failures.
    }
  };

  SoundManager.prototype.play = function play(name) {
    var howl = this.howlByName.get(name);
    if (!howl) {
      return;
    }
    try {
      if (typeof Howler !== "undefined" && Howler.ctx && typeof Howler.ctx.resume === "function" && Howler.ctx.state === "suspended") {
        void Howler.ctx.resume();
      }
    } catch (error) {
      // Ignore resume failures.
    }
    try {
      howl.play();
    } catch (error) {
      // Ignore autoplay restrictions and transient playback errors.
    }
  };

  window.SoundManager = SoundManager;
})();`;
}

function buildTranspiledAdBundle(options = {}) {
  const env = { ...process.env };
  if (Number.isInteger(options.singleLevelNumber)) {
    env.PIXELFLOW_SINGLE_LEVEL = String(options.singleLevelNumber);
  } else {
    delete env.PIXELFLOW_SINGLE_LEVEL;
  }
  execFileSync(
    process.execPath,
    [
      path.join(projectRoot, "node_modules", "vite", "bin", "vite.js"),
      "build",
      "-c",
      path.join(projectRoot, "vite.ad.config.mjs"),
    ],
    {
      cwd: projectRoot,
      env,
      stdio: "pipe",
    },
  );
}

function getBuiltAdBundle() {
  const builtFiles = collectFilesRecursively("dist_adbundle");
  const jsPath = builtFiles.find((filePath) => filePath.endsWith(".js"));
  if (!jsPath) {
    throw new Error("Vite ad bundle JS output not found in dist_adbundle.");
  }
  const cssPath = builtFiles.find((filePath) => filePath.endsWith(".css")) || null;
  return {
    jsCode: readText(jsPath),
    cssCode: cssPath ? readText(cssPath) : "",
  };
}

async function buildAssetMap(options = {}) {
  const preferWebp = options.preferWebp !== false;
  const quality = Number.isInteger(options.quality)
    ? Math.max(1, Math.min(100, options.quality))
    : 92;
  const assetMap = {};
  for (const relPath of collectFilesRecursively("ui")) {
    if (relPath.toLowerCase().endsWith(".ds_store")) {
      continue;
    }
    assetMap[relPath] = await toDataUri(relPath, { preferWebp, quality });
  }
  if (fileExists("Ref.png")) {
    assetMap["Ref.png"] = await toDataUri("Ref.png", { preferWebp, quality });
  }
  for (const relPath of collectFilesRecursively("fonts")) {
    assetMap[relPath] = await toDataUri(relPath, { preferWebp: false });
  }

  function aliasAsset(from, to) {
    if (!assetMap[from] && assetMap[to]) {
      assetMap[from] = assetMap[to];
    }
  }

  aliasAsset("ui/block.png", "ui/blocks/green.png");
  aliasAsset("ui/birds/gray_alt.png", "ui/birds/grey.png");
  aliasAsset("ui/birds/pink.png", "ui/birds/red.png");
  aliasAsset("ui/birds/peach.png", "ui/birds/beige.png");
  aliasAsset("ui/birds/rose.png", "ui/birds/red_alt.png");
  aliasAsset("ui/birds/orchid.png", "ui/birds/levender.png");
  aliasAsset("ui/birds/magenta.png", "ui/birds/dark_pink.png");
  aliasAsset("ui/birds/малиновый.png", "ui/birds/dark_pink.png");
  aliasAsset("ui/birds/малиновый.png", "ui/birds/dark_pink.png");
  return assetMap;
}

function createSingleHtml(indexHtml, styleCss, transpiledBundleJs, networkKey, assetMap, soundRuntimeCode = "") {
  let output = injectHeadTags(indexHtml, networkKey);
  const normalizedStyleCss = normalizeCssDataUrisToBase64(styleCss);
  const normalizedBundleJs = normalizeQuotedDataUrisToBase64(transpiledBundleJs);
  const normalizedSoundRuntimeCode = normalizeQuotedDataUrisToBase64(soundRuntimeCode);
  const embeddedFontsCss = buildEmbeddedFontCss(assetMap);
  output = output.replace(/<link rel="stylesheet" href="\/?style\.css">/, () => (
    `<style>\n${embeddedFontsCss}${embeddedFontsCss ? "\n\n" : ""}${normalizedStyleCss}\n\n/* standalone-build override: remove all debug UI */\n#debugPanel,\n#debugToggleFab,\n.debug-level-nav {\n  display: none !important;\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\n</style>`
  ));
  output = output.replace(/<script\b[^>]*src="[^"]+"[^>]*><\/script>\s*/g, "");
  const mergedCode = [normalizedSoundRuntimeCode, buildNetworkAdapter(networkKey), normalizedBundleJs]
    .filter((value) => String(value || "").trim().length > 0)
    .join("\n;\n");
  const scriptsBundle = `<script>\n${escapeForInlineScript(mergedCode)}\n</script>`;
  output = output.replace("</body>", () => `${scriptsBundle}\n</body>`);
  output = normalizeQuotedDataUrisToBase64(output);
  const nonBase64DataUriCount = countNonBase64QuotedDataUris(output);
  if (nonBase64DataUriCount > 0) {
    throw new Error(`Found ${nonBase64DataUriCount} non-base64 quoted data URI assets after single-html build.`);
  }
  return output;
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  const indexHtml = readText("playable.index.html");
  if (cli.levelNumber) {
    const selectedLevelPath = `game-data/levels/${cli.levelNumber}.json`;
    if (!fileExists(selectedLevelPath)) {
      throw new Error(`Level file not found: ${selectedLevelPath}`);
    }
  }

  ensureDir(distDir);
  buildTranspiledAdBundle({ singleLevelNumber: cli.levelNumber });
  const builtBundle = getBuiltAdBundle();
  const fontAssetMap = await buildEmbeddedFontAssetMap();
  const soundAssetMap = await buildEmbeddedSoundAssetMap();
  const soundRuntimeCode = buildHowlerSoundManagerRuntime(soundAssetMap);

  for (const distFile of collectFilesRecursively("dist")) {
    if (/_level\d+\.(html|zip)$/i.test(distFile)) {
      fs.rmSync(path.join(projectRoot, distFile), { force: true });
    }
  }

  const defaultOutput = createSingleHtml(
    indexHtml,
    builtBundle.cssCode,
    builtBundle.jsCode,
    "AL",
    fontAssetMap,
    soundRuntimeCode,
  );
  fs.writeFileSync(outputHtmlPath, defaultOutput, "utf8");
  fs.writeFileSync(path.join(distDir, "index_AL.html"), defaultOutput, "utf8");
  for (const network of NETWORKS) {
    if (network.key === "AL") {
      continue;
    }
    const networkHtml = createSingleHtml(
      indexHtml,
      builtBundle.cssCode,
      builtBundle.jsCode,
      network.key,
      fontAssetMap,
      soundRuntimeCode,
    );
    const zipPath = path.join(distDir, `index_${network.key}.zip`);
    createZipWithIndexHtml(zipPath, networkHtml);
    const staleHtmlPath = path.join(distDir, `index_${network.key}.html`);
    if (fs.existsSync(staleHtmlPath)) {
      fs.rmSync(staleHtmlPath, { force: true });
    }
  }

  console.log(`Built single-file bundle: ${toPosix(path.relative(projectRoot, outputHtmlPath))}`);
  console.log("Built network bundles: index_AL.html, index_GA.zip, index_MT.zip");
  console.log("Build pipeline: Vite ad bundle (classic IIFE, transpiled)");
  if (cli.levelNumber) {
    console.log(`Embedded selected level only: ${cli.levelNumber}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
