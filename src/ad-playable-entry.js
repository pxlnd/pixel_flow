import "../style.css";

const uiAssetModules = import.meta.glob("../ui/**/*.{png,jpg,jpeg,gif,webp,svg}", {
  eager: true,
  import: "default",
});
const rootPngModules = import.meta.glob("../*.png", {
  eager: true,
  import: "default",
});
const levelModules = import.meta.glob("../game-data/levels/*.json", {
  eager: true,
  import: "default",
});
import.meta.glob("../game-data/themes/*.js", { eager: true });
import.meta.glob("../game-data/levels/*.js", { eager: true });

const singleLevelNumber = Number.isInteger(__PIXELFLOW_SINGLE_LEVEL__)
  ? __PIXELFLOW_SINGLE_LEVEL__
  : null;

const assetMap = {};
for (const [key, value] of Object.entries(uiAssetModules)) {
  const normalized = key.replace(/\\/g, "/");
  const idx = normalized.indexOf("/ui/");
  if (idx >= 0) {
    assetMap[normalized.slice(idx + 1)] = value;
  }
}
for (const [key, value] of Object.entries(rootPngModules)) {
  const normalized = key.replace(/\\/g, "/");
  const file = normalized.split("/").pop();
  if (file) {
    assetMap[file] = value;
  }
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
aliasAsset("ui/birds/РјР°Р»РёРЅРѕРІС‹Р№.png", "ui/birds/dark_pink.png");
aliasAsset("ui/birds/РјР°Р»РёРЅРѕРІС‹РёМ†.png", "ui/birds/dark_pink.png");

const levelMap = {};
for (const [key, value] of Object.entries(levelModules)) {
  const normalized = key.replace(/\\/g, "/");
  const match = normalized.match(/game-data\/levels\/(\d+)\.json$/);
  if (match) {
    const levelNumber = Number.parseInt(match[1], 10);
    if (singleLevelNumber && levelNumber !== singleLevelNumber) {
      continue;
    }
    levelMap["game-data/levels/" + match[1] + ".json"] = JSON.stringify(value);
  }
}

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
  raw = raw.replace(/^\/+/, "");
  raw = raw.replace(/^\.\//, "");
  raw = raw.replace(/\\/g, "/");
  try {
    raw = decodeURIComponent(raw);
  } catch {}

  const lowered = raw.toLowerCase();
  const uiIndex = lowered.lastIndexOf("/ui/");
  if (uiIndex >= 0) {
    return raw.slice(uiIndex + 1);
  }
  const levelsIndex = lowered.lastIndexOf("/game-data/levels/");
  if (levelsIndex >= 0) {
    return raw.slice(levelsIndex + 1);
  }
  if (/\/ref\.png$/i.test(raw)) {
    return "Ref.png";
  }
  if (/^dist\//i.test(raw)) {
    return raw.replace(/^dist\//i, "");
  }
  return raw;
}

function getLevelJsonCanonicalPath(normalizedPath) {
  const match = String(normalizedPath || "").match(/(?:^|\/)game-data\/levels\/(\d+)\.json$/i);
  if (!match) return "";
  return "game-data/levels/" + match[1] + ".json";
}

window.__PIXELFLOW_SINGLE_HTML__ = {
  assets: assetMap,
  levels: levelMap,
};

function normalizeFatalText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (value && typeof value.message === "string") return value.message;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function ensureFatalOverlay() {
  let root = document.getElementById("pixelflowFatalOverlay");
  if (root) return root;
  root = document.createElement("div");
  root.id = "pixelflowFatalOverlay";
  root.style.position = "fixed";
  root.style.left = "12px";
  root.style.right = "12px";
  root.style.bottom = "12px";
  root.style.zIndex = "2147483647";
  root.style.padding = "10px 12px";
  root.style.borderRadius = "12px";
  root.style.background = "rgba(26, 12, 16, 0.9)";
  root.style.color = "#fff4f4";
  root.style.font = "700 12px/1.35 Arial, sans-serif";
  root.style.whiteSpace = "pre-wrap";
  root.style.wordBreak = "break-word";
  root.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.35)";
  root.style.pointerEvents = "none";
  root.style.display = "none";
  document.body.appendChild(root);
  return root;
}

window.__PIXELFLOW_REPORT_FATAL = function reportFatal(error, context = "runtime") {
  const message = normalizeFatalText(error) || "Unknown error";
  const details = error && typeof error === "object" && error.stack ? "\n" + String(error.stack) : "";
  const text = "PixelFlow fatal error [" + context + "]\n" + message + details;
  try {
    const root = ensureFatalOverlay();
    root.textContent = text;
    root.style.display = "block";
  } catch {}
  try {
    console.error("[PixelFlow fatal][" + context + "]", error);
  } catch {}
};

window.addEventListener("error", (event) => {
  const error = event && event.error ? event.error : new Error(event && event.message ? event.message : "Script error");
  window.__PIXELFLOW_REPORT_FATAL(error, "window-error");
});

window.addEventListener("unhandledrejection", (event) => {
  window.__PIXELFLOW_REPORT_FATAL(event ? event.reason : "Unhandled promise rejection", "unhandledrejection");
});

try {
  if (window.localStorage) {
    window.localStorage.setItem("pixelflow.debug.topLevelNavVisible.v1", "false");
    window.localStorage.setItem("pixelflow.debug.settings", JSON.stringify({ panelOpen: false }));
  }
} catch {}

const debugStyle = document.createElement("style");
debugStyle.textContent = `
#debugPanel,
#debugToggleFab,
.debug-level-nav {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
`;
document.head.appendChild(debugStyle);

function hideDebugUi() {
  const panel = document.getElementById("debugPanel");
  if (panel) {
    panel.hidden = true;
    panel.classList.remove("is-visible");
    panel.style.display = "none";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  }
  const fab = document.getElementById("debugToggleFab");
  if (fab) {
    fab.hidden = true;
    fab.style.display = "none";
    fab.style.visibility = "hidden";
    fab.style.pointerEvents = "none";
    fab.tabIndex = -1;
  }
  const topNav = document.querySelector(".debug-level-nav");
  if (topNav) {
    topNav.hidden = true;
    topNav.style.display = "none";
    topNav.style.visibility = "hidden";
    topNav.style.pointerEvents = "none";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideDebugUi, { once: true });
} else {
  hideDebugUi();
}

const originalFetch = window.fetch ? window.fetch.bind(window) : null;
if (originalFetch) {
  window.fetch = function patchedFetch(input, init) {
    const rawUrl = typeof input === "string" ? input : (input && input.url) || "";
    const normalized = normalizePath(rawUrl);

    let levelKey = getLevelJsonCanonicalPath(normalized);
    if (!levelKey && singleLevelNumber && /(?:^|\/)game-data\/levels\/\d+\.json$/i.test(String(normalized || ""))) {
      levelKey = "game-data/levels/" + singleLevelNumber + ".json";
    }
    if (levelKey) {
      const levelText = levelMap[levelKey];
      if (typeof levelText === "string") {
        return Promise.resolve(
          new Response(levelText, {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
          }),
        );
      }
      return Promise.resolve(new Response("Not Found", { status: 404 }));
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
if (srcDescriptor && typeof srcDescriptor.get === "function" && typeof srcDescriptor.set === "function") {
  Object.defineProperty(HTMLImageElement.prototype, "src", {
    configurable: true,
    enumerable: srcDescriptor.enumerable,
    get() {
      return srcDescriptor.get.call(this);
    },
    set(value) {
      const normalized = normalizePath(value);
      if (assetMap[normalized]) {
        srcDescriptor.set.call(this, assetMap[normalized]);
        return;
      }
      srcDescriptor.set.call(this, value);
    },
  });
}

void (async () => {
  await import("../main.js");
})();
