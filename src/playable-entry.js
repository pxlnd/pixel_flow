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

const levelMap = {};
for (const [key, value] of Object.entries(levelModules)) {
  const normalized = key.replace(/\\/g, "/");
  const match = normalized.match(/game-data\/levels\/(\d+)\.json$/);
  if (match) {
    levelMap[`game-data/levels/${match[1]}.json`] = value;
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
  raw = raw.replace(/^\/+/, "").replace(/^\.?\//, "").replace(/\\/g, "/");
  const uiPos = raw.toLowerCase().lastIndexOf("/ui/");
  if (uiPos >= 0) return raw.slice(uiPos + 1);
  const levelPos = raw.toLowerCase().lastIndexOf("/game-data/levels/");
  if (levelPos >= 0) return raw.slice(levelPos + 1);
  if (/\/ref\.png$/i.test(raw)) return "Ref.png";
  return raw;
}

window.__PIXELFLOW_SINGLE_HTML__ = {
  assets: assetMap,
  levels: levelMap,
};

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
    const levelMatch = normalized.match(/(?:^|\/)game-data\/levels\/(\d+)\.json$/i);
    if (levelMatch) {
      const key = `game-data/levels/${levelMatch[1]}.json`;
      if (levelMap[key]) {
        return Promise.resolve(
          new Response(JSON.stringify(levelMap[key]), {
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
    if (assetMap[normalized]) {
      return originalFetch(assetMap[normalized], init);
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
  await import("../game-data/themes/theme-classic.js");
  await import("../game-data/themes/theme-sunset.js");
  await import("../game-data/themes/index.js");
  await import("../game-data/levels/level-1.js");
  await import("../game-data/levels/level-2.js");
  await import("../game-data/levels/index.js");
  await import("../main.js");
})();

