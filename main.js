const THEME_REGISTRY = window.PIXELFLOW_THEMES || {
  THEME_DEFINITIONS: [],
  DEFAULT_THEME_ID: "classic",
  getThemeConfig: () => null,
};

const LEVEL_REGISTRY = window.PIXELFLOW_LEVELS || {
  LEVEL_DEFINITIONS: [],
  DEFAULT_LEVEL_ID: "1",
  getLevelConfig: () => null,
};

const BUILTIN_FALLBACK_LEVEL = {
  id: "1",
  name: "Level 1",
  queueCardCount: 7,
  fallbackFieldPattern: [
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGGGGGBBBBBBGGGGGG",
    "GGGGGGBBBBBBGGGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBGGGGGGBBGGGG",
    "GGGGBBGGGGGGBBGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
  ],
  referenceGrid: { x: 220, y: 216, step: 32, cellSize: 30 },
  layout: {
    fieldX: 220,
    fieldY: 329,
    fieldStep: 32,
    cellSize: 32,
    fieldCols: 18,
    fieldRows: 18,
    track: { x: 106, y: 189, w: 808, h: 856, r: 50 },
    spawnPoint: { x: 152, y: 979 },
    cards: [
      { lane: 0, row: 0, x: 312, y: 1230, w: 160, h: 200, color: "green", styleKey: "mint", label: 1, ammo: 40 },
      { lane: 1, row: 0, x: 552, y: 1230, w: 160, h: 200, color: "black", styleKey: "coral", label: 2, ammo: 40 },
      { lane: 0, row: 1, x: 312, y: 1432, w: 160, h: 200, color: "green", styleKey: "sky", label: 3, ammo: 40 },
      { lane: 1, row: 1, x: 552, y: 1432, w: 160, h: 200, color: "black", styleKey: "gold", label: 4, ammo: 40 },
    ],
    slots: [
      { x: 98, y: 1130, w: 194, h: 126 },
      { x: 311, y: 1130, w: 194, h: 126 },
      { x: 520, y: 1130, w: 194, h: 126 },
      { x: 729, y: 1130, w: 194, h: 126 },
    ],
    wagonSprite: {
      x: 44,
      y: 840,
      w: 148,
      h: 116,
      anchorX: 52,
      anchorY: 96,
      seatOffsetX: 0,
      seatOffsetY: -52,
    },
    wagonMask: { x: 0, y: 820, w: 260, h: 200 },
    boardMask: { x: 0, y: 0, w: 1024, h: 1600, r: 0 },
  },
};

const BUILTIN_FALLBACK_THEME = {
  id: "classic",
  name: "Classic",
  assets: {
    referenceImage: "Ref.png",
    backButton: "ui/back_button.png",
    timerPanel: "ui/timer_panel.png",
    restartButton: "ui/restart_button.png",
    losePopup: "ui/lose_popup_space_ref.png",
  },
  board: {
    fill: "#6aa93a",
    grassPalette: ["#6a9f35", "#72aa3a", "#7bb642", "#5f9430", "#89c84b"],
    grassShade: "rgba(28, 52, 14, 0.16)",
    dirtFill: "#b98c5e",
    dirtPalette: ["#b18052", "#ba8a5b", "#c89a67", "#a9784a", "#d1a874"],
    dirtShade: "rgba(64, 40, 22, 0.2)",
  },
  track: {
    woodGradient: ["#9f6e34", "#6f451f", "#a47539"],
    sleeperColor: "#5b3619",
    sleeperHighlight: "rgba(255,255,255,0.12)",
    railMain: "#ded7ca",
    railShadow: "rgba(55,55,55,0.35)",
  },
  victory: {
    gradient: ["#d8f3ff", "#a8ddff", "#8bc9ff"],
    cloudColor: "rgba(255, 255, 255, 0.7)",
    boardGlow: "rgba(255, 255, 255, 0.42)",
  },
  colors: {},
  confettiColors: ["#ff5f5f", "#ffd166", "#6ee7b7", "#60a5fa", "#f9a8d4", "#c4b5fd"],
};

const SOUND_DEFINITIONS = {
  back_to_cell: { src: "sounds/back_to_cell.mp3", channels: 3, volume: 0.8 },
  cant_select: { src: "sounds/cant_select.mp3", channels: 2, volume: 0.9 },
  fail: { src: "sounds/Fail.mp3", channels: 1, volume: 0.9 },
  no_moves: { src: "sounds/no_moves.mp3", channels: 1, volume: 0.9 },
  win: { src: "sounds/Win.mp3", channels: 1, volume: 0.9 },
  buble: { src: "sounds/Bubble.mp3", channels: 5, volume: 0.75 },
  tap: { src: "sounds/tap.mp3", channels: 3, volume: 0.85 },
};

let LEVEL_DEFINITIONS = [];
const THEME_DEFINITIONS = Array.isArray(THEME_REGISTRY.THEME_DEFINITIONS) ? THEME_REGISTRY.THEME_DEFINITIONS : [];
let DEFAULT_LEVEL_ID = BUILTIN_FALLBACK_LEVEL.id;
const DEFAULT_THEME_ID = String(THEME_REGISTRY.DEFAULT_THEME_ID || BUILTIN_FALLBACK_THEME.id);
const LEVEL_DEFINITIONS_FALLBACK = Array.isArray(LEVEL_REGISTRY.LEVEL_DEFINITIONS) ? LEVEL_REGISTRY.LEVEL_DEFINITIONS : [];
const LEVEL_OVERRIDES_STORAGE_KEY = "pixelflow.level.overrides.v1";
const getLevelConfigRaw = typeof LEVEL_REGISTRY.getLevelConfig === "function" ? LEVEL_REGISTRY.getLevelConfig : () => null;
const getThemeConfigRaw = typeof THEME_REGISTRY.getThemeConfig === "function" ? THEME_REGISTRY.getThemeConfig : () => null;
let LEVEL_MAP = new Map();
let LEVEL_OVERRIDES_MAP = new Map();

function canonicalizeLevelName(levelConfig) {
  const levelId = String(levelConfig?.id || "").trim();
  const rawName = String(levelConfig?.name || "").trim();
  if (isPositiveIntegerString(levelId) && /^generated\b/i.test(rawName)) {
    return `Level ${levelId}`;
  }
  if (rawName.length > 0) {
    return rawName;
  }
  return isPositiveIntegerString(levelId) ? `Level ${levelId}` : "Level";
}

function rebuildLevelRegistry(levelDefinitions) {
  LEVEL_DEFINITIONS = Array.isArray(levelDefinitions)
    ? levelDefinitions
      .filter(isValidLevelConfig)
      .map((level) => {
        const normalized = cloneData(level);
        normalized.id = String(normalized.id || "");
        normalized.name = canonicalizeLevelName(normalized);
        return normalized;
      })
    : [];
  DEFAULT_LEVEL_ID = String(LEVEL_DEFINITIONS[0]?.id || BUILTIN_FALLBACK_LEVEL.id);
  LEVEL_MAP = new Map(LEVEL_DEFINITIONS.map((level) => [String(level.id), level]));
}

function upsertLevelDefinition(levelConfig) {
  if (!isValidLevelConfig(levelConfig)) {
    return;
  }
  const normalized = cloneData(levelConfig);
  const levelId = String(normalized.id || "");
  normalized.id = levelId;
  normalized.name = canonicalizeLevelName(normalized);
  const existingIndex = LEVEL_DEFINITIONS.findIndex((level) => String(level?.id || "") === levelId);
  if (existingIndex >= 0) {
    LEVEL_DEFINITIONS[existingIndex] = normalized;
  } else {
    LEVEL_DEFINITIONS.push(normalized);
  }
  LEVEL_MAP.set(levelId, normalized);
}

function getLevelOverridesStoragePayload() {
  const levels = {};
  for (const [id, level] of LEVEL_OVERRIDES_MAP.entries()) {
    levels[id] = level;
  }
  return {
    updatedAt: new Date().toISOString(),
    levels,
  };
}

function saveLevelOverridesToStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const payload = getLevelOverridesStoragePayload();
    window.localStorage.setItem(LEVEL_OVERRIDES_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

function loadLevelOverridesFromStorage() {
  LEVEL_OVERRIDES_MAP = new Map();
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  let parsed = null;
  try {
    const raw = window.localStorage.getItem(LEVEL_OVERRIDES_STORAGE_KEY);
    if (!raw) {
      return;
    }
    parsed = JSON.parse(raw);
  } catch {
    return;
  }
  const source = parsed && typeof parsed === "object" ? parsed.levels : null;
  if (!source || typeof source !== "object") {
    return;
  }
  for (const value of Object.values(source)) {
    if (!isValidLevelConfig(value)) {
      continue;
    }
    const normalized = cloneData(value);
    normalized.id = String(normalized.id || "");
    normalized.name = canonicalizeLevelName(normalized);
    LEVEL_OVERRIDES_MAP.set(normalized.id, normalized);
  }
}

function applyLoadedLevelOverrides() {
  for (const level of LEVEL_OVERRIDES_MAP.values()) {
    upsertLevelDefinition(level);
  }
}

function persistLevelOverride(levelConfig) {
  if (!isValidLevelConfig(levelConfig)) {
    return false;
  }
  const normalized = cloneData(levelConfig);
  normalized.id = String(normalized.id || "");
  normalized.name = canonicalizeLevelName(normalized);
  LEVEL_OVERRIDES_MAP.set(normalized.id, normalized);
  return saveLevelOverridesToStorage();
}

function isValidLevelConfig(config) {
  return !!config && !!config.layout && Array.isArray(config.layout.cards) && Array.isArray(config.layout.slots);
}

function isValidThemeConfig(config) {
  return !!config && typeof config === "object";
}

const getLevelConfig = (levelId) => {
  const config = LEVEL_MAP.get(String(levelId || "")) || null;
  if (isValidLevelConfig(config)) {
    return cloneData(config);
  }
  try {
    const rawConfig = getLevelConfigRaw(String(levelId || ""));
    if (isValidLevelConfig(rawConfig)) {
      return cloneData(rawConfig);
    }
  } catch {
    // Ignore legacy registry errors and continue to local fallback.
  }
  const fallbackById = LEVEL_DEFINITIONS.find((level) => level && level.id === DEFAULT_LEVEL_ID);
  if (isValidLevelConfig(fallbackById)) {
    return cloneData(fallbackById);
  }
  const fallbackRegistryLevel =
    LEVEL_DEFINITIONS_FALLBACK.find((level) => String(level?.id || "") === String(DEFAULT_LEVEL_ID))
    || LEVEL_DEFINITIONS_FALLBACK[0];
  if (isValidLevelConfig(fallbackRegistryLevel)) {
    return cloneData(fallbackRegistryLevel);
  }
  return BUILTIN_FALLBACK_LEVEL;
};

const getThemeConfig = (themeId) => {
  let config = null;
  try {
    config = getThemeConfigRaw(themeId);
  } catch {
    config = null;
  }
  if (isValidThemeConfig(config)) {
    return config;
  }
  const fallbackById = THEME_DEFINITIONS.find((theme) => theme && theme.id === DEFAULT_THEME_ID);
  if (isValidThemeConfig(fallbackById)) {
    return fallbackById;
  }
  return BUILTIN_FALLBACK_THEME;
};

const LOGICAL_WIDTH = 1024;
const LOGICAL_HEIGHT = 1600;
const FIXED_DT = 1 / 60;
const MIN_ACTIVE_UNITS_LIMIT = 1;
const MAX_ACTIVE_UNITS_LIMIT = 10;
let ACTIVE_UNITS_LIMIT = 5;
const FIRE_INTERVAL = 0.03;
const MAX_BURST_SHOTS_PER_TICK = 24;
const BULLET_RADIUS = 8;
const SHOT_TRAIL_DURATION = 0.16;
const SHOT_BOUNCE_DURATION = 0.16;
let SHOT_BOUNCE_AMOUNT = 0.2;
let SHOT_BOUNCE_SPEED = 1;
let TRACK_UNIT_SPEED = 980;
let BOTTOM_QUEUE_CARD_COUNT = 7;
let CHICKEN_SIZE_SCALE = 1.6;
let TOP_PANEL_FONT_SIZE = 67;
let TOP_LEVEL_PANEL_SCALE = 1.2;
let TOP_COINS_PANEL_SCALE = 1.2;
let BACK_BUTTON_SCALE = 1.2;
let TRACK_Y_OFFSET = -33;
let TRACK_Y_OFFSET_MOBILE = -33;
let PLAYFIELD_SCALE = 0.88;
let SLOT_SIZE_SCALE = 1.49;
let SLOT_Y_OFFSET = -72;
let SLOT_SPACING_X_MOBILE = 1.03;
let SLOT_SPACING_X_DESKTOP = 1.03;
let TRAY_BOTTOM_OFFSET = 82;
let TRAY_BOTTOM_OFFSET_DESKTOP = 82;
let TRAY_SCALE_Y_MOBILE = 1.14;
let TRAY_SCALE_Y_DESKTOP = 1.14;
let TOP_UI_Y_OFFSET = 35;
let TOP_UI_Y_OFFSET_MOBILE = 35;
let MOBILE_BOTTOM_CLUSTER_Y_OFFSET = -170;
let CARD_Y_OFFSET_ALL = -72;
let CARD_Y_OFFSET_1 = 60;
let CARD_Y_OFFSET_2 = 7;
let CARD_Y_OFFSET_3 = 0;
let CARD_Y_OFFSET_4 = 0;
let QUEUE_SPACING_X_MOBILE = 1;
let QUEUE_SPACING_X_DESKTOP = 1;
const UNIT_BLOCK_SIZE = 74;
const SHOOTER_HIT_RADIUS = 88;
const CARD_HITBOX_PADDING_X = 26;
const CARD_HITBOX_PADDING_TOP = 26;
const CARD_HITBOX_PADDING_BOTTOM = 22;
const PARKED_UNIT_TAP_RADIUS = 86;
const LEVEL_ONE_TUTORIAL_ID = "1";
const LEVEL_ONE_TUTORIAL_STEPS = {
  tapBlackCard: "tap-black-card",
  waitBlackParked: "wait-black-parked",
  tapGreenCard: "tap-green-card",
  waitGreenParked: "wait-green-parked",
  tapBlackParked: "tap-black-parked",
  done: "done",
};
const QUEUE_CARDS_RAISE_RATIO = 0.3;
const SLOT_SIZE_REDUCTION_RATIO = 0.2;
const SLOT_BIRD_FORWARD_SHIFT_RATIO = 0.2;
const SHOW_TAP_DEBUG = false;
const SPAWN_CLEAR_RADIUS = 118;
const SLOT_CLAIM_ORDER = [0, 3, 1, 2];
const TRAY_OFFSCREEN_OVERSCAN = 56;
const TRACK_TO_BOTTOM_CLUSTER_GAP_PORTRAIT = 186;
const TRACK_TO_BOTTOM_CLUSTER_GAP_LANDSCAPE = 112;
const TRACK_TO_TOP_UI_GAP_PORTRAIT = 86;
const TRACK_TO_TOP_UI_GAP_LANDSCAPE = 59;
const GLOBAL_LAYOUT_Y_SHIFT_RATIO = 0.1;
const TOP_UI_EXTRA_UP_SHIFT_RATIO = 0.04;
const TRACK_SIDE_MARGIN_RATIO = 0.05;
const TRACK_FRAME_OUTSET = 40;
const TRACK_CENTERING_UP_OFFSET = 48;
const FIELD_CENTERING_UP_RATIO = 0.02;
let BOARD_FILL_COLOR = "#6aa93a";
const BACKGROUND_ASSET_ROOT = "ui/background";
const DEFAULT_BACKGROUND_ID = "default";
const BACKGROUND_VARIANT_IDS = ["default", "blue", "orange", "purple", "pink", "water"];
const BACKGROUND_ASSET_NAMES = {
  background: "background.png",
  panel: "panel.png",
  cell: "cell.png",
  railway: "railway.png",
};
const RAILWAY_SOURCE_SIZE = { w: 401, h: 407 };
const RAILWAY_PATH_NORMALIZED = {
  x: 28.5 / RAILWAY_SOURCE_SIZE.w,
  y: 22 / RAILWAY_SOURCE_SIZE.h,
  w: 341.5 / RAILWAY_SOURCE_SIZE.w,
  h: 320 / RAILWAY_SOURCE_SIZE.h,
  // Tuned to the visual center of the lane in ui/background/default/railway.png.
  r: 50 / RAILWAY_SOURCE_SIZE.w,
};
// Chicken sprite is authored facing +X (to the right), where the beak is drawn.
const CHICKEN_FRONT_ANGLE_OFFSET = Math.PI * 0.5;
const VICTORY_ZOOM_TARGET = 1.12;
const VICTORY_ZOOM_SPEED = 3.2;
const VICTORY_CONFETTI_DURATION = 1.8;
const VICTORY_FLOAT_SPEED = 0.85;
const VICTORY_FLOAT_AMPLITUDE = 12;
const VICTORY_ART_OFFSET_Y = 110;
const VICTORY_CONFETTI_RATE = 42;
const LAUNCH_DURATION = 0.24;
const LAND_DURATION = 0.2;
const STREAK_DECAY_TIME = 1.45;
const LOSE_POPUP_ANIM_DURATION = 0.34;
const LEVEL_START_FADE_DURATION = 0.22;
const CARD_QUEUE_SPRING_STIFFNESS = 42;
const CARD_QUEUE_SPRING_DAMPING = 10.5;
const CARD_QUEUE_SETTLE_EPSILON = 2;
const CARD_QUEUE_BOUNCE_SCALE = 0.09;
const CARD_QUEUE_SCALE_STIFFNESS = 30;
const CARD_QUEUE_SCALE_DAMPING = 9;
const MIN_QUEUE_CARDS = 2;
const MAX_QUEUE_CARDS = 24;
const BACK_BUTTON_UI = {
  x: 34,
  y: 30,
  w: 108,
  h: 108,
};
const TOP_PANEL_FONT_WEIGHT = 800;
const TOP_PANEL_FONT_FAMILY = "\"Baloo 2\", \"Arial Rounded MT Bold\", \"Trebuchet MS\", Arial, sans-serif";
const TIMER_PANEL_UI = {
  y: 36,
  w: 256,
  h: 95,
  label: "Level",
  textColor: "#335b90",
  textStroke: "rgba(255, 255, 255, 0.92)",
};
const COINS_UI = {
  panelY: 36,
  panelW: 256,
  panelH: 95,
  rightMargin: 30,
  amount: "1375",
  amountColor: "#15479f",
  amountStroke: "rgba(255, 255, 255, 0.86)",
  amountXFactor: 0.67,
  coinW: 96,
  coinH: 95,
  coinOffsetX: -34,
  coinOffsetY: 0,
  plusW: 48,
  plusH: 51,
  plusOffsetX: 54,
  plusOffsetY: 50,
};
const LOSE_POPUP_UI = {
  w: 646,
  h: 663,
  y: 392,
  outerRadius: 26,
  innerPadding: 18,
  closeSize: 40,
};
const LOSE_POPUP_Y_OFFSET = 70;
const LOSE_POPUP_BIRDS_DROP_RATIO = 0.15;
const LOSE_OFFER_UI = {
  gapFromPopupBottom: 95,
  widthToPopupRatio: 1,
  scale: 1.05,
  sidePadding: 18,
  bottomSafeMargin: 20,
  fallbackW: 663,
  fallbackH: 433,
  fallbackButtonW: 392,
  fallbackButtonH: 138,
  buttonWidthRatio: 0.6,
  buttonBottomOverlapFactor: 0.92,
  buttonOffsetY: 30,
};
const LOSE_TOP_STATS_UI = {
  topOffset: -16,
  sidePadding: 18,
  gap: 62,
  targetHeight: 96,
  maxScale: 1.08,
  minScale: 0.72,
  heartTextXRatio: 0.18,
  heartTextYRatio: 0.57,
  heartTextColor: "#ffffff",
  heartTextStroke: "rgba(173, 21, 51, 0.95)",
  livesTimerTextXRatio: 0.76,
  livesTimerTextYRatio: 0.57,
  livesTimerTextOffsetX: -12,
  livesTimerTextOffsetY: -2,
  coinsTextXRatio: 0.76,
  coinsTextYRatio: 0.54,
  coinsTextOffsetX: -20,
  coinsTextOffsetY: -5,
  coinsTextFontScale: 1.3,
  coinsTextColor: "#17439c",
  coinsTextStroke: "rgba(255, 255, 255, 0.9)",
};
const BASE_TOP_UI = {
  timerY: TIMER_PANEL_UI.y,
  timerW: TIMER_PANEL_UI.w,
  timerH: TIMER_PANEL_UI.h,
  coinsY: COINS_UI.panelY,
  coinsW: COINS_UI.panelW,
  coinsH: COINS_UI.panelH,
  backY: BACK_BUTTON_UI.y,
  backW: BACK_BUTTON_UI.w,
  backH: BACK_BUTTON_UI.h,
};

const DEBUG_STORAGE_KEY = "pixelflow.debug.settings";
const DEBUG_STORAGE_KEYS_FALLBACK = [
  "pixelflow.debug.settings.v4",
  "pixelflow.debug.settings.v3",
  "pixelflow.debug.settings.v2",
  "pixelflow.debug.settings.v1",
];
const DEBUG_TOP_NAV_VISIBLE_STORAGE_KEY = "pixelflow.debug.topLevelNavVisible.v1";
const DEBUG_DEFAULTS = {
  shotBounceAmount: 0.2,
  shotBounceSpeed: 1,
  trackUnitSpeed: 980,
  queueCardCount: 7,
  activeUnitsLimit: 5,
  chickenSizeScale: 1.22,
  topPanelFontSize: 67,
  topLevelPanelScale: 1.2,
  topCoinsPanelScale: 1.2,
  backButtonScale: 1.2,
  trackYOffset: -33,
  trackYOffsetMobile: -33,
  playfieldScale: 0.88,
  slotSizeScale: 1.49,
  slotYOffset: -72,
  slotSpacingXMobile: 1.03,
  slotSpacingXDesktop: 1.03,
  trayBottomOffset: 82,
  trayBottomOffsetDesktop: 82,
  trayScaleYMobile: 1.14,
  trayScaleYDesktop: 1.14,
  queueSpacingXMobile: 1,
  queueSpacingXDesktop: 1,
  topUiYOffset: 35,
  topUiYOffsetMobile: 35,
  mobileBottomClusterYOffset: -170,
  cardYOffsetAll: -72,
  cardYOffset1: 60,
  cardYOffset2: 7,
  cardYOffset3: 0,
  cardYOffset4: 0,
  topLevelNavVisible: false,
  levelId: DEFAULT_LEVEL_ID,
  themeId: DEFAULT_THEME_ID,
  backgroundId: DEFAULT_BACKGROUND_ID,
};

const LEVELS_PATH = "game-data/levels";
const LEVEL_MANIFEST_PATH = `${LEVELS_PATH}/manifest.json`;
const MAX_AUTOLOAD_LEVELS = 50;
const MAX_AUTOLOAD_MISSES_IN_A_ROW = 5;
const LEVEL_LOAD_BATCH_SIZE = 6;

function normalizeBackgroundId(backgroundId) {
  const normalized = String(backgroundId || "")
    .trim()
    .toLowerCase();
  return BACKGROUND_VARIANT_IDS.includes(normalized) ? normalized : DEFAULT_BACKGROUND_ID;
}

function getBackgroundAssetPath(backgroundId, assetKey) {
  const resolvedId = normalizeBackgroundId(backgroundId);
  const fileName = BACKGROUND_ASSET_NAMES[assetKey];
  if (!fileName) {
    return "";
  }
  return `${BACKGROUND_ASSET_ROOT}/${resolvedId}/${fileName}`;
}

async function loadLevelJSONByNumber(levelNumber) {
  try {
    const response = await fetch(`${LEVELS_PATH}/${levelNumber}.json`, { cache: "default" });
    if (!response.ok) {
      return null;
    }
    const parsed = await response.json();
    const level = parsed && typeof parsed === "object" && parsed.level ? parsed.level : parsed;
    if (!level || typeof level !== "object") {
      return null;
    }
    const normalizedLevel = cloneData(level);
    normalizedLevel.id = String(levelNumber);
    normalizedLevel.name = isPositiveIntegerString(normalizedLevel.name)
      ? `Level ${levelNumber}`
      : String(normalizedLevel.name || `Level ${levelNumber}`);
    if (
      /^debug\b/i.test(normalizedLevel.name)
      || isGenericLevelName(normalizedLevel.name)
    ) {
      normalizedLevel.name = `Level ${levelNumber}`;
    }
    if (normalizedLevel.pixelArt && typeof normalizedLevel.pixelArt === "object" && !normalizedLevel.pixelArt.id) {
      normalizedLevel.pixelArt.id = `level-${levelNumber}-art`;
    }
    return isValidLevelConfig(normalizedLevel) ? normalizedLevel : null;
  } catch {
    return null;
  }
}

function normalizeLevelNumber(value) {
  const normalized = Math.trunc(Number(value));
  if (!Number.isFinite(normalized)) {
    return null;
  }
  if (normalized < 1 || normalized > MAX_AUTOLOAD_LEVELS) {
    return null;
  }
  return normalized;
}

async function loadLevelManifestNumbers() {
  try {
    const response = await fetch(LEVEL_MANIFEST_PATH, { cache: "default" });
    if (!response.ok) {
      return [];
    }
    const parsed = await response.json();
    const numbersRaw = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.levels)
        ? parsed.levels
        : Array.isArray(parsed?.levelNumbers)
          ? parsed.levelNumbers
          : [];
    const uniqueNumbers = new Set();
    for (const value of numbersRaw) {
      const number = normalizeLevelNumber(value);
      if (number !== null) {
        uniqueNumbers.add(number);
      }
    }
    return [...uniqueNumbers].sort((a, b) => a - b);
  } catch {
    return [];
  }
}

async function loadLevelDefinitionsByNumbers(levelNumbers) {
  const normalizedNumbers = Array.isArray(levelNumbers)
    ? levelNumbers
      .map((value) => normalizeLevelNumber(value))
      .filter((value) => value !== null)
    : [];
  if (normalizedNumbers.length === 0) {
    return [];
  }
  const levels = [];
  for (let index = 0; index < normalizedNumbers.length; index += LEVEL_LOAD_BATCH_SIZE) {
    const batchNumbers = normalizedNumbers.slice(index, index + LEVEL_LOAD_BATCH_SIZE);
    const batch = await Promise.all(batchNumbers.map((number) => loadLevelJSONByNumber(number)));
    for (const level of batch) {
      if (level) {
        levels.push(level);
      }
    }
  }
  return levels;
}

async function loadLevelDefinitions() {
  const manifestNumbers = await loadLevelManifestNumbers();
  if (manifestNumbers.length > 0) {
    return loadLevelDefinitionsByNumbers(manifestNumbers);
  }

  const levels = [];
  let missesInARow = 0;
  let levelNumber = 1;
  while (levelNumber <= MAX_AUTOLOAD_LEVELS && missesInARow < MAX_AUTOLOAD_MISSES_IN_A_ROW) {
    const batchNumbers = [];
    for (
      let i = 0;
      i < LEVEL_LOAD_BATCH_SIZE && levelNumber <= MAX_AUTOLOAD_LEVELS;
      i += 1, levelNumber += 1
    ) {
      batchNumbers.push(levelNumber);
    }

    const batch = await Promise.all(batchNumbers.map((number) => loadLevelJSONByNumber(number)));
    for (const level of batch) {
      if (!level) {
        missesInARow += 1;
        if (missesInARow >= MAX_AUTOLOAD_MISSES_IN_A_ROW) {
          break;
        }
        continue;
      }
      missesInARow = 0;
      levels.push(level);
    }
  }
  return levels;
}

const DEFAULT_COLORS = {
  white: "#ffffff",
  shadow: "rgba(0, 0, 0, 0.55)",
  usedOverlay: "rgba(13, 15, 16, 0.56)",
  badgeBg: "rgba(17, 20, 26, 0.85)",
  bulletGreen: "#dcffc2",
  bulletGreenCore: "#7ede55",
  bulletBlack: "#d8d8d8",
  bulletBlackCore: "#222222",
  particleGreen: "#8fe266",
  particleBlack: "#161616",
  clearedGround: "#3f3b37",
  sceneShadow: "rgba(19, 32, 10, 0.2)",
  fieldShadow: "rgba(16, 28, 9, 0.24)",
  blockShadow: "rgba(15, 24, 8, 0.28)",
  ringGreen: "rgba(163, 243, 111, 0.85)",
  ringBlack: "rgba(236, 236, 236, 0.8)",
  slotPulse: "rgba(255, 235, 140, 0.7)",
  textGlow: "rgba(0, 0, 0, 0.45)",
};

const BLOCK_CHAR_TO_COLOR = {
  G: "green",
  B: "black",
  K: "black",
  C: "blue",
  W: "white",
  Y: "yellow",
  R: "red",
  H: "red_alt",
  O: "orange",
  N: "brown",
  A: "gray",
  P: "light_purple",
  M: "dark_pink",
  D: "dark_blue",
  V: "dark_purple",
  L: "light_green",
  F: "pink",
  E: "peach",
  S: "rose",
  T: "orchid",
  ".": null,
  " ": null,
  "_": null,
};

const BLOCK_COLOR_TO_PATTERN_CHAR = {
  green: "G",
  black: "K",
  blue: "C",
  white: "W",
  yellow: "Y",
  red: "R",
  red_alt: "H",
  orange: "O",
  brown: "N",
  gray: "A",
  light_purple: "P",
  dark_pink: "M",
  dark_blue: "D",
  dark_purple: "V",
  light_green: "L",
  pink: "F",
  peach: "E",
  rose: "S",
  orchid: "T",
};

const BLOCK_COLOR_TO_RGB = {
  green: { r: 129, g: 195, b: 65 },
  black: { r: 42, g: 42, b: 42 },
  blue: { r: 86, g: 194, b: 241 },
  white: { r: 245, g: 247, b: 251 },
  yellow: { r: 255, g: 215, b: 64 },
  red: { r: 239, g: 64, b: 50 },
  orange: { r: 252, g: 150, b: 42 },
  brown: { r: 157, g: 98, b: 61 },
  light_purple: { r: 177, g: 142, b: 234 },
  dark_pink: { r: 204, g: 67, b: 156 },
  dark_blue: { r: 53, g: 97, b: 173 },
  dark_purple: { r: 110, g: 72, b: 171 },
  light_green: { r: 155, g: 224, b: 95 },
  gray: { r: 156, g: 156, b: 156 },
  pink: { r: 223, g: 122, b: 225 },
  peach: { r: 234, g: 197, b: 150 },
  rose: { r: 220, g: 96, b: 140 },
  orchid: { r: 164, g: 109, b: 210 },
  red_alt: { r: 255, g: 56, b: 142 },
  dirty_pink: { r: 214, g: 146, b: 167 },
  beige: { r: 223, g: 177, b: 128 },
  gray_alt: { r: 156, g: 156, b: 156 },
};

const DEBUG_IMAGE_GENERATOR_BASE_COLOR_TO_RGB = Object.freeze(
  Object.fromEntries(
    Object.entries(BLOCK_COLOR_TO_RGB)
      .filter(([color]) => Object.prototype.hasOwnProperty.call(BLOCK_COLOR_TO_PATTERN_CHAR, color))
      .map(([color, sample]) => [color, { r: sample.r, g: sample.g, b: sample.b }])
  )
);

const BLOCK_COLOR_LABELS = {
  green: "зелёный",
  black: "чёрный",
  blue: "голубой",
  white: "белый",
  yellow: "жёлтый",
  red: "красный",
  orange: "оранжевый",
  brown: "коричневый",
  light_purple: "сиреневый",
  dark_pink: "тёмно-розовый",
  dark_blue: "тёмно-синий",
  dark_purple: "тёмно-фиолетовый",
  light_green: "салатовый",
  gray: "серый",
  pink: "розовый",
  peach: "персиковый",
  rose: "роза",
  orchid: "орхидея",
  red_alt: "малиновый",
  dirty_pink: "припылённо-розовый",
  beige: "бежевый",
  gray_alt: "серый",
};

const CHICKEN_SPRITE_SOURCE_BY_COLOR = {
  green: "ui/birds/green.png",
  black: "ui/birds/black.png",
  blue: "ui/birds/blue.png",
  white: "ui/birds/white.png",
  yellow: "ui/birds/yellow.png",
  red: "ui/birds/red.png",
  orange: "ui/birds/orange.png",
  brown: "ui/birds/brown.png",
  light_purple: "ui/birds/light_purple.png",
  dark_pink: "ui/birds/dark_pink.png",
  dark_blue: "ui/birds/dark_blue.png",
  dark_purple: "ui/birds/dark_purple.png",
  light_green: "ui/birds/light_green.png",
  dirty_pink: "ui/birds/dirty_pink.png",
  beige: "ui/birds/beige.png",
  gray: "ui/birds/grey.png",
  dark_dark_blue: "ui/birds/dark_dark_blue.png",
  very_dark_blue: "ui/birds/very_dark_blue.png",
  blue_alt: "ui/birds/blue_alt.png",
  levender: "ui/birds/levender.png",
  малиновый: "ui/birds/малиновый.png",
};

const BLOCK_TILE_SOURCE_BY_COLOR = {
  green: "ui/blocks/green.png",
  black: "ui/blocks/black.png",
  blue: "ui/blocks/blue.png",
  white: "ui/blocks/white.png",
  yellow: "ui/blocks/yellow.png",
  red: "ui/blocks/red.png",
  red_alt: "ui/blocks/hot_pink.png",
  orange: "ui/blocks/orange.png",
  brown: "ui/blocks/brown.png",
  light_purple: "ui/blocks/light_purple.png",
  dark_pink: "ui/blocks/dark_pink.png",
  dark_blue: "ui/blocks/dark_blue.png",
  dark_purple: "ui/blocks/dark_purple.png",
  light_green: "ui/blocks/light_green.png",
  gray: "ui/blocks/gray.png",
  gray_alt: "ui/blocks/gray_alt.png",
  pink: "ui/blocks/pink.png",
  peach: "ui/blocks/peach.png",
  rose: "ui/blocks/rose.png",
  orchid: "ui/blocks/orchid.png",
  magenta: "ui/blocks/magenta.png",
  dirty_pink: "ui/blocks/dirty_pink.png",
  beige: "ui/blocks/beige.png",
};

const BLOCK_TILE_COLOR_ALIASES = {
  pink: "dark_pink",
  magenta: "dark_pink",
  violet: "dark_purple",
  purple: "dark_purple",
  cyan: "blue",
  sky: "blue",
  lime: "light_green",
  crimson: "red_alt",
  grey: "gray",
  lilac: "orchid",
};

const DEBUG_IMAGE_LEVEL_ID = "debug-image-level";
const DEBUG_IMAGE_GRID_MIN = 4;
const DEBUG_IMAGE_GRID_MAX = 40;
const DEBUG_IMAGE_SCALE_MIN = 0.5;
const DEBUG_IMAGE_SCALE_MAX = 3;
const DEBUG_IMAGE_OFFSET_Y_DEFAULT = -37;
const MAX_SIMULATION_DT = 0.2;
const MAX_SIM_STEPS_PER_FRAME = 8;
const MAX_ACTIVE_FLOAT_TEXTS = 3;
const MAX_ACTIVE_PARTICLES = 520;
const MAX_ACTIVE_IMPACT_RINGS = 36;
const MAX_ACTIVE_BLOCK_WAVES = 8;
const MAX_ACTIVE_SLOT_BURSTS = 24;
const WAVE_OFFSET_VISUAL_EPSILON = 0.18;

const BLOCK_COLOR_CONFIG = {
  green: {
    styleKeys: ["mint", "sky"],
    sprite: { base: "#79be3d", mid: "#66a831", dark: "#4f8224" },
    face: "#81c341",
    projectile: {
      core: "#7ede55",
      light: "#dcffc2",
      glowMid: "rgba(164,255,128,0.22)",
      glowEnd: "rgba(190,255,160,0.55)",
      auraInner: "rgba(212,255,184,0.75)",
      auraMid: "rgba(160,244,105,0.34)",
    },
    ring: "rgba(163, 243, 111, 0.85)",
    slotBurst: "rgba(155, 244, 111, 0.72)",
    particle: "#8fe266",
    accentRgb: "160, 255, 105",
  },
  black: {
    styleKeys: ["coral", "gold"],
    sprite: { base: "#3a3a3a", mid: "#2f2f2f", dark: "#1d1d1d" },
    face: "#2a2a2a",
    projectile: {
      core: "#222222",
      light: "#f2f2f2",
      glowMid: "rgba(255,255,255,0.24)",
      glowEnd: "rgba(255,255,255,0.62)",
      auraInner: "rgba(255,255,255,0.78)",
      auraMid: "rgba(245,245,245,0.30)",
    },
    ring: "rgba(236, 236, 236, 0.8)",
    slotBurst: "rgba(255, 235, 140, 0.7)",
    particle: "#161616",
    accentRgb: "255, 255, 255",
  },
  blue: {
    styleKeys: ["sky", "mint"],
    sprite: { base: "#67cdf6", mid: "#49afe4", dark: "#2f8cc2" },
    face: "#58c2f1",
    projectile: {
      core: "#2c9fda",
      light: "#b7ecff",
      glowMid: "rgba(113,213,255,0.24)",
      glowEnd: "rgba(164,231,255,0.58)",
      auraInner: "rgba(202,242,255,0.82)",
      auraMid: "rgba(96,194,238,0.34)",
    },
    ring: "rgba(128, 219, 255, 0.9)",
    slotBurst: "rgba(131, 223, 255, 0.76)",
    particle: "#4bb4e8",
    accentRgb: "114, 214, 255",
  },
  white: {
    styleKeys: ["pearl", "cloud"],
    sprite: { base: "#f8fafc", mid: "#e8edf3", dark: "#cfd7e3" },
    face: "#f5f7fb",
    projectile: {
      core: "#d7dee8",
      light: "#ffffff",
      glowMid: "rgba(255,255,255,0.34)",
      glowEnd: "rgba(255,255,255,0.68)",
      auraInner: "rgba(255,255,255,0.86)",
      auraMid: "rgba(235,242,255,0.34)",
    },
    ring: "rgba(255, 255, 255, 0.96)",
    slotBurst: "rgba(255, 255, 255, 0.82)",
    particle: "#eef3fb",
    accentRgb: "255, 255, 255",
  },
  yellow: {
    styleKeys: ["sun", "lemon"],
    sprite: { base: "#ffd84c", mid: "#f7c92d", dark: "#d8a819" },
    face: "#ffd740",
    projectile: {
      core: "#e3b414",
      light: "#fff4b0",
      glowMid: "rgba(255,231,116,0.24)",
      glowEnd: "rgba(255,241,173,0.58)",
      auraInner: "rgba(255,248,192,0.76)",
      auraMid: "rgba(255,220,92,0.34)",
    },
    ring: "rgba(255, 227, 102, 0.9)",
    slotBurst: "rgba(255, 223, 120, 0.76)",
    particle: "#f2c31d",
    accentRgb: "255, 224, 96",
  },
  red: {
    styleKeys: ["rose", "ember"],
    sprite: { base: "#ff6356", mid: "#ee4031", dark: "#c5271c" },
    face: "#ef4032",
    projectile: {
      core: "#d63124",
      light: "#ffbeb8",
      glowMid: "rgba(255,120,108,0.26)",
      glowEnd: "rgba(255,178,170,0.58)",
      auraInner: "rgba(255,210,206,0.74)",
      auraMid: "rgba(255,101,89,0.34)",
    },
    ring: "rgba(255, 123, 112, 0.88)",
    slotBurst: "rgba(255, 138, 128, 0.74)",
    particle: "#ee4031",
    accentRgb: "255, 120, 108",
  },
};

function deriveBlockColorConfigFromRgb(sample) {
  const r = clamp(Math.round(sample?.r ?? 129), 0, 255);
  const g = clamp(Math.round(sample?.g ?? 195), 0, 255);
  const b = clamp(Math.round(sample?.b ?? 65), 0, 255);
  const baseRgb = { r: clamp(Math.round(r * 1.08), 0, 255), g: clamp(Math.round(g * 1.08), 0, 255), b: clamp(Math.round(b * 1.08), 0, 255) };
  const midRgb = { r: clamp(Math.round(r * 0.96), 0, 255), g: clamp(Math.round(g * 0.96), 0, 255), b: clamp(Math.round(b * 0.96), 0, 255) };
  const darkRgb = { r: clamp(Math.round(r * 0.74), 0, 255), g: clamp(Math.round(g * 0.74), 0, 255), b: clamp(Math.round(b * 0.74), 0, 255) };
  const particleRgb = { r: clamp(Math.round(r * 0.88), 0, 255), g: clamp(Math.round(g * 0.88), 0, 255), b: clamp(Math.round(b * 0.88), 0, 255) };
  return {
    styleKeys: ["mint", "sky"],
    sprite: {
      base: `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`,
      mid: `rgb(${midRgb.r}, ${midRgb.g}, ${midRgb.b})`,
      dark: `rgb(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b})`,
    },
    face: `rgb(${r}, ${g}, ${b})`,
    projectile: {
      core: `rgb(${clamp(Math.round(r * 0.9), 0, 255)}, ${clamp(Math.round(g * 0.9), 0, 255)}, ${clamp(Math.round(b * 0.9), 0, 255)})`,
      light: `rgb(${clamp(Math.round(r * 1.18), 0, 255)}, ${clamp(Math.round(g * 1.18), 0, 255)}, ${clamp(Math.round(b * 1.18), 0, 255)})`,
      glowMid: `rgba(${r},${g},${b},0.24)`,
      glowEnd: `rgba(${r},${g},${b},0.58)`,
      auraInner: `rgba(${r},${g},${b},0.76)`,
      auraMid: `rgba(${r},${g},${b},0.34)`,
    },
    ring: `rgba(${r}, ${g}, ${b}, 0.88)`,
    slotBurst: `rgba(${r}, ${g}, ${b}, 0.74)`,
    particle: `rgb(${particleRgb.r}, ${particleRgb.g}, ${particleRgb.b})`,
    accentRgb: `${r}, ${g}, ${b}`,
  };
}

function getBlockColorConfig(color) {
  const normalized = normalizeBlockColorName(color);
  if (normalized && Object.prototype.hasOwnProperty.call(BLOCK_COLOR_CONFIG, normalized)) {
    return BLOCK_COLOR_CONFIG[normalized];
  }
  if (normalized && Object.prototype.hasOwnProperty.call(BLOCK_COLOR_TO_RGB, normalized)) {
    const derived = deriveBlockColorConfigFromRgb(BLOCK_COLOR_TO_RGB[normalized]);
    BLOCK_COLOR_CONFIG[normalized] = derived;
    return derived;
  }
  return BLOCK_COLOR_CONFIG.green;
}

function getPatternCellColor(cell) {
  if (cell === undefined || cell === null) {
    return null;
  }
  const normalized = String(cell).charAt(0).toUpperCase();
  return Object.prototype.hasOwnProperty.call(BLOCK_CHAR_TO_COLOR, normalized)
    ? BLOCK_CHAR_TO_COLOR[normalized]
    : null;
}

function getPatternCellChar(color) {
  return BLOCK_COLOR_TO_PATTERN_CHAR[color] || ".";
}

function normalizeBlockColorName(color) {
  const normalized = String(color || "").trim().toLowerCase();
  if (!normalized || normalized === "." || normalized === "_" || normalized === " ") {
    return null;
  }
  if (Object.prototype.hasOwnProperty.call(BLOCK_COLOR_TO_RGB, normalized)) {
    return normalized;
  }
  if (Object.prototype.hasOwnProperty.call(BLOCK_COLOR_CONFIG, normalized)) {
    return normalized;
  }
  if (Object.prototype.hasOwnProperty.call(BLOCK_TILE_SOURCE_BY_COLOR, normalized)) {
    return normalized;
  }
  const alias = BLOCK_TILE_COLOR_ALIASES[normalized];
  if (alias) {
    return alias;
  }
  return normalized;
}

function normalizeColorMatrixCell(cell) {
  if (cell === undefined || cell === null) {
    return null;
  }
  if (typeof cell === "string") {
    const raw = cell.trim();
    if (!raw || raw === "." || raw === "_" || raw === " ") {
      return null;
    }
    if (raw.length === 1) {
      return getPatternCellColor(raw);
    }
    return normalizeBlockColorName(raw);
  }
  return null;
}

function clampDebugImageGridSize(value) {
  return clamp(Math.round(Number(value) || 18), DEBUG_IMAGE_GRID_MIN, DEBUG_IMAGE_GRID_MAX);
}

function clampDebugImageScale(value) {
  return clamp(Number(value) || 1, DEBUG_IMAGE_SCALE_MIN, DEBUG_IMAGE_SCALE_MAX);
}

function clampDebugImageOffsetY(value) {
  return clamp(Math.round(Number(value) || 0), -240, 240);
}

function isPositiveIntegerString(value) {
  return /^[1-9]\d*$/.test(String(value || "").trim());
}

function isGenericLevelName(value) {
  return /^level\s+\d+$/i.test(String(value || "").trim());
}

function getNearestBlockColor(r, g, b) {
  let bestColor = "green";
  let bestDistance = Infinity;
  for (const [color, sample] of Object.entries(BLOCK_COLOR_TO_RGB)) {
    const dr = r - sample.r;
    const dg = g - sample.g;
    const db = b - sample.b;
    const distanceSq = dr * dr + dg * dg + db * db;
    if (distanceSq < bestDistance) {
      bestDistance = distanceSq;
      bestColor = color;
    }
  }
  return bestColor;
}

function srgbToLinear(channel) {
  const value = clamp(channel, 0, 255) / 255;
  if (value <= 0.04045) {
    return value / 12.92;
  }
  return Math.pow((value + 0.055) / 1.055, 2.4);
}

function rgbToLab(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175;
  const z = lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041;

  const whiteX = 0.95047;
  const whiteY = 1;
  const whiteZ = 1.08883;

  const fx = x / whiteX;
  const fy = y / whiteY;
  const fz = z / whiteZ;

  const transform = (value) => {
    const epsilon = 216 / 24389;
    const kappa = 24389 / 27;
    return value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116;
  };

  const tx = transform(fx);
  const ty = transform(fy);
  const tz = transform(fz);

  return {
    l: 116 * ty - 16,
    a: 500 * (tx - ty),
    b: 200 * (ty - tz),
  };
}

function unpremultiplyRgba(r, g, b, a) {
  if (a <= 0) {
    return { r: 0, g: 0, b: 0 };
  }
  const alpha = clamp(a, 1, 255);
  return {
    r: clamp((r * 255) / alpha, 0, 255),
    g: clamp((g * 255) / alpha, 0, 255),
    b: clamp((b * 255) / alpha, 0, 255),
  };
}

function getLuma(r, g, b) {
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function getHueDegrees(r, g, b) {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const delta = max - min;
  if (delta <= 0.00001) {
    return null;
  }
  let hue = 0;
  if (max === nr) {
    hue = ((ng - nb) / delta) % 6;
  } else if (max === ng) {
    hue = (nb - nr) / delta + 2;
  } else {
    hue = (nr - ng) / delta + 4;
  }
  hue *= 60;
  if (hue < 0) {
    hue += 360;
  }
  return hue;
}

function getColorSaturationRatio(r, g, b) {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  if (max <= 0.00001) {
    return 0;
  }
  return (max - min) / max;
}

function getDebugImageColorFamily(r, g, b) {
  const saturation = getColorSaturationRatio(r, g, b);
  if (saturation < 0.14) {
    return null;
  }
  const hue = getHueDegrees(r, g, b);
  if (hue === null) {
    return null;
  }
  if (hue < 18 || hue >= 345) {
    return "red";
  }
  if (hue < 48) {
    return "orange";
  }
  if (hue < 72) {
    return "yellow";
  }
  if (hue < 170) {
    return "green";
  }
  if (hue < 255) {
    return "blue";
  }
  if (hue < 300) {
    return "purple";
  }
  return "pink";
}

let CURRENT_LEVEL = getLevelConfig(DEFAULT_LEVEL_ID);
let CURRENT_THEME = getThemeConfig(DEFAULT_THEME_ID);
let LAYOUT = cloneLevelLayout(CURRENT_LEVEL.layout);
let BASE_LAYOUT = createBaseLayout(LAYOUT);
let FALLBACK_FIELD_PATTERN = [...CURRENT_LEVEL.fallbackFieldPattern];
let COLORS = { ...DEFAULT_COLORS, ...(CURRENT_THEME.colors || {}) };
let CONFETTI_COLORS = [...(CURRENT_THEME.confettiColors || ["#ff5f5f", "#ffd166", "#6ee7b7", "#60a5fa", "#f9a8d4", "#c4b5fd"])];

syncLevelGlobals(CURRENT_LEVEL);
syncThemeGlobals(CURRENT_THEME);

function cloneData(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function cloneLevelLayout(layout) {
  return cloneData(layout);
}

function createBaseLayout(layout) {
  return {
    fieldX: layout.fieldX,
    fieldY: layout.fieldY,
    fieldStep: layout.fieldStep,
    cellSize: layout.cellSize,
    fieldCols: layout.fieldCols,
    fieldRows: layout.fieldRows,
    track: { ...layout.track },
    spawnPoint: { ...layout.spawnPoint },
    slots: layout.slots.map((slot) => ({ ...slot })),
    cards: layout.cards.map((card) => ({ ...card })),
  };
}

function syncLevelGlobals(levelConfig, options = {}) {
  const { displayLevelNumber = null } = options;
  CURRENT_LEVEL = cloneData(levelConfig);
  BOTTOM_QUEUE_CARD_COUNT = clamp(
    Math.round(Number(CURRENT_LEVEL?.queueCardCount ?? BOTTOM_QUEUE_CARD_COUNT)),
    MIN_QUEUE_CARDS,
    MAX_QUEUE_CARDS
  );
  CURRENT_LEVEL.queueCardCount = BOTTOM_QUEUE_CARD_COUNT;
  LAYOUT = cloneLevelLayout(CURRENT_LEVEL.layout);
  BASE_LAYOUT = createBaseLayout(LAYOUT);
  FALLBACK_FIELD_PATTERN = [...(CURRENT_LEVEL.fallbackFieldPattern || [])];
  const normalizedDisplayLevelNumber = Number.isFinite(displayLevelNumber)
    ? Math.max(1, Math.trunc(displayLevelNumber))
    : null;
  TIMER_PANEL_UI.label = normalizedDisplayLevelNumber !== null
    ? `Level ${normalizedDisplayLevelNumber}`
    : (CURRENT_LEVEL.name || "Level");
  if (typeof document !== "undefined") {
    document.title = `PixelFlow - ${TIMER_PANEL_UI.label}`;
  }
}

function syncThemeGlobals(themeConfig) {
  CURRENT_THEME = cloneData(themeConfig);
  BOARD_FILL_COLOR = String(CURRENT_THEME.board?.fill || "#6aa93a");
  COLORS = { ...DEFAULT_COLORS, ...(CURRENT_THEME.colors || {}) };
  CONFETTI_COLORS = [...(CURRENT_THEME.confettiColors || ["#ff5f5f", "#ffd166", "#6ee7b7", "#60a5fa", "#f9a8d4", "#c4b5fd"])];
}

const STABLE_LAYOUT_ANCHOR = createBaseLayout(cloneLevelLayout(getLevelConfig(DEFAULT_LEVEL_ID).layout));

function getThemeAsset(key, fallbackPath) {
  const value = CURRENT_THEME.assets?.[key];
  return typeof value === "string" && value.length > 0 ? value : fallbackPath;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getTopPanelFont() {
  return `${TOP_PANEL_FONT_WEIGHT} ${Math.round(TOP_PANEL_FONT_SIZE)}px ${TOP_PANEL_FONT_FAMILY}`;
}

function getCardYOffsetByIndex(index) {
  if (index === 0) return CARD_Y_OFFSET_1;
  if (index === 1) return CARD_Y_OFFSET_2;
  if (index === 2) return CARD_Y_OFFSET_3;
  if (index === 3) return CARD_Y_OFFSET_4;
  return 0;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgb(hex, fallback = { r: 127, g: 127, b: 127 }) {
  if (typeof hex !== "string") {
    return { ...fallback };
  }
  const normalized = hex.trim().replace(/^#/, "");
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
      return { r, g, b };
    }
    return { ...fallback };
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
      return { r, g, b };
    }
  }
  return { ...fallback };
}

function rgbToHsl(r, g, b) {
  const nr = clamp(r, 0, 255) / 255;
  const ng = clamp(g, 0, 255) / 255;
  const nb = clamp(b, 0, 255) / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === nr) {
    hue = (ng - nb) / delta + (ng < nb ? 6 : 0);
  } else if (max === ng) {
    hue = (nb - nr) / delta + 2;
  } else {
    hue = (nr - ng) / delta + 4;
  }

  return { h: hue / 6, s: saturation, l: lightness };
}

function hslToRgb(h, s, l) {
  const hue = ((h % 1) + 1) % 1;
  const saturation = clamp(s, 0, 1);
  const lightness = clamp(l, 0, 1);

  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return { r: value, g: value, b: value };
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const toChannel = (t) => {
    let channelT = t;
    if (channelT < 0) channelT += 1;
    if (channelT > 1) channelT -= 1;
    if (channelT < 1 / 6) return p + (q - p) * 6 * channelT;
    if (channelT < 1 / 2) return q;
    if (channelT < 2 / 3) return p + (q - p) * (2 / 3 - channelT) * 6;
    return p;
  };

  return {
    r: Math.round(toChannel(hue + 1 / 3) * 255),
    g: Math.round(toChannel(hue) * 255),
    b: Math.round(toChannel(hue - 1 / 3) * 255),
  };
}

function easeOutCubic(t) {
  const u = 1 - clamp(t, 0, 1);
  return 1 - u * u * u;
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const u = clamp(t, 0, 1) - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

function quadraticBezierPoint(a, b, c, t) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * b.x + t * t * c.x,
    y: u * u * a.y + 2 * u * t * b.y + t * t * c.y,
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isInsideRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function createBufferCanvas(width, height, alpha = true) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d", { alpha });
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
  }
  return { canvas, ctx };
}

function compactListInPlace(list, updateItem) {
  let writeIndex = 0;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (updateItem(item, i)) {
      list[writeIndex] = item;
      writeIndex += 1;
    }
  }
  list.length = writeIndex;
  return list;
}

function createRoundedRectPath(x, y, w, h, r, samplesPerArc = 18) {
  const points = [];
  const pushPoint = (px, py) => {
    const last = points[points.length - 1];
    if (!last || Math.hypot(last.x - px, last.y - py) > 0.5) {
      points.push({ x: px, y: py });
    }
  };
  const pushLine = (fromX, fromY, toX, toY, steps) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pushPoint(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t);
    }
  };
  const pushArc = (cx, cy, radius, startAngle, endAngle, steps) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = startAngle + (endAngle - startAngle) * t;
      pushPoint(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
  };

  pushLine(x + r, y, x + w - r, y, 32);
  pushArc(x + w - r, y + r, r, -Math.PI / 2, 0, samplesPerArc);
  pushLine(x + w, y + r, x + w, y + h - r, 32);
  pushArc(x + w - r, y + h - r, r, 0, Math.PI / 2, samplesPerArc);
  pushLine(x + w - r, y + h, x + r, y + h, 32);
  pushArc(x + r, y + h - r, r, Math.PI / 2, Math.PI, samplesPerArc);
  pushLine(x, y + h - r, x, y + r, 32);
  pushArc(x + r, y + r, r, Math.PI, Math.PI * 1.5, samplesPerArc);

  return points;
}

function getRailwayConveyorRect(trackRect) {
  const framePad = 40;
  const frame = {
    x: trackRect.x - framePad,
    y: trackRect.y - framePad,
    w: trackRect.w + framePad * 2,
    h: trackRect.h + framePad * 2,
  };
  const x = Math.round(frame.x + frame.w * RAILWAY_PATH_NORMALIZED.x);
  const y = Math.round(frame.y + frame.h * RAILWAY_PATH_NORMALIZED.y);
  const w = Math.max(120, Math.round(frame.w * RAILWAY_PATH_NORMALIZED.w));
  const h = Math.max(120, Math.round(frame.h * RAILWAY_PATH_NORMALIZED.h));
  const radiusByWidth = frame.w * RAILWAY_PATH_NORMALIZED.r;
  const radiusByHeight = frame.h * (50 / RAILWAY_SOURCE_SIZE.h);
  const r = Math.max(10, Math.round(Math.min(radiusByWidth, radiusByHeight)));
  return { x, y, w, h, r };
}

class Block {
  constructor(id, col, row, color) {
    this.id = id;
    this.col = col;
    this.row = row;
    this.color = color;
    this.layer = Math.min(
      col,
      row,
      LAYOUT.fieldCols - 1 - col,
      LAYOUT.fieldRows - 1 - row
    );
    this.alive = false;
    this.spiralIndex = Number.MAX_SAFE_INTEGER;
    this.spiralOrder = Number.MAX_SAFE_INTEGER;
    this.hitFlash = 0;
    this.x = LAYOUT.fieldX + col * LAYOUT.fieldStep;
    this.y = LAYOUT.fieldY + row * LAYOUT.fieldStep;
    this.size = LAYOUT.cellSize;
  }

  update(dt) {
    this.hitFlash = Math.max(0, this.hitFlash - dt * 5);
  }
}

class Conveyor {
  constructor() {
    this.trackRect = { ...LAYOUT.track };
    this.path = [];
    this.totalLength = 0;
    this.segmentLengths = [];
    this.spawnDistance = 0;
    this.setTrackRect(LAYOUT.track, LAYOUT.spawnPoint);
  }

  setTrackRect(trackRect, spawnPoint = LAYOUT.spawnPoint) {
    this.trackRect = getRailwayConveyorRect(trackRect);
    this.path = createRoundedRectPath(
      this.trackRect.x,
      this.trackRect.y,
      this.trackRect.w,
      this.trackRect.h,
      this.trackRect.r
    );
    this.totalLength = 0;
    this.segmentLengths = [];
    for (let i = 0; i < this.path.length; i++) {
      const a = this.path[i];
      const b = this.path[(i + 1) % this.path.length];
      const segmentLength = distance(a, b);
      this.segmentLengths.push(segmentLength);
      this.totalLength += segmentLength;
    }
    this.spawnDistance = this.closestPathDistance(spawnPoint);
  }

  pointAtDistance(trackDistance) {
    let d = ((trackDistance % this.totalLength) + this.totalLength) % this.totalLength;
    for (let i = 0; i < this.segmentLengths.length; i++) {
      const len = this.segmentLengths[i];
      if (d <= len || i === this.segmentLengths.length - 1) {
        const a = this.path[i];
        const b = this.path[(i + 1) % this.path.length];
        const t = len === 0 ? 0 : d / len;
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
        };
      }
      d -= len;
    }
    return { ...this.path[0] };
  }

  closestPathDistance(point) {
    let bestDistance = 0;
    let bestScore = Infinity;
    let traveled = 0;

    for (let i = 0; i < this.path.length; i++) {
      const p = this.path[i];
      const score = Math.hypot(point.x - p.x, point.y - p.y);
      if (score < bestScore) {
        bestScore = score;
        bestDistance = traveled;
      }
      traveled += this.segmentLengths[i];
    }

    return bestDistance;
  }
}

class Unit {
  constructor(id, color, ammo, launchFrom, conveyor, styleKey, label) {
    this.id = id;
    this.color = color;
    this.ammo = ammo;
    this.maxAmmo = ammo;
    this.styleKey = styleKey || getBlockColorConfig(color).styleKeys[0];
    this.label = label ?? id;
    this.slotIndex = null;
    this.speed = TRACK_UNIT_SPEED;
    this.cooldown = 0;
    this.state = "launching";
    this.launchFrom = { ...launchFrom };
    this.conveyor = conveyor;
    this.launchTo = conveyor.pointAtDistance(conveyor.spawnDistance);
    this.landFrom = { ...this.launchTo };
    this.landTo = null;
    this.launchProgress = 0;
    this.landProgress = 0;
    this.loopDistance = 0;
    this.distanceOnTrack = conveyor.spawnDistance;
    this.position = { ...launchFrom };
    this.prevPosition = { ...launchFrom };
    this.launchArcHeight = 36 + Math.random() * 24;
    this.launchControl = {
      x: (this.launchFrom.x + this.launchTo.x) * 0.5,
      y: Math.min(this.launchFrom.y, this.launchTo.y) - this.launchArcHeight,
    };
    this.landControl = { ...this.landFrom };
    this.scaleX = 1;
    this.scaleY = 1;
    this.parkBounce = 0;
    this.shotBounceTime = SHOT_BOUNCE_DURATION;
    this.renderRotation = null;
    this.currentTrackRegion = null;
    this.regionFrontierLock = null;
    this.alive = true;
  }

  triggerShotBounce() {
    this.shotBounceTime = 0;
  }

  getShotScale() {
    if (this.shotBounceTime >= SHOT_BOUNCE_DURATION) {
      return 1;
    }
    const t = clamp(this.shotBounceTime / SHOT_BOUNCE_DURATION, 0, 1);
    return 1 + SHOT_BOUNCE_AMOUNT * (1 - easeOutCubic(t));
  }

  update(dt, game) {
    if (!this.alive) {
      return;
    }

    this.parkBounce = Math.max(0, this.parkBounce - dt * 5.5);
    const speedMul = Math.max(0.2, SHOT_BOUNCE_SPEED);
    this.shotBounceTime = Math.min(
      SHOT_BOUNCE_DURATION,
      this.shotBounceTime + dt * speedMul,
    );

    if (this.state === "launching") {
      this.launchProgress = Math.min(1, this.launchProgress + dt / LAUNCH_DURATION);
      const launchT = easeOutCubic(this.launchProgress);
      this.position = quadraticBezierPoint(this.launchFrom, this.launchControl, this.launchTo, launchT);
      if (this.launchProgress >= 1) {
        this.state = "moving";
        this.position = this.conveyor.pointAtDistance(this.distanceOnTrack);
        this.prevPosition = { ...this.position };
        this.currentTrackRegion = null;
        this.regionFrontierLock = null;
        this.renderRotation = game.getTrackSideFacingAngle(this.position);
        game.normalizeShooterQueues(game.cards);
      }
    } else if (this.state === "landing") {
      this.landProgress = Math.min(1, this.landProgress + dt / LAND_DURATION);
      const landingT = easeOutBack(this.landProgress);
      this.position = quadraticBezierPoint(this.landFrom, this.landControl, this.landTo, landingT);
      if (this.landProgress >= 1) {
        this.state = "parked";
        this.position = { ...this.landTo };
        this.prevPosition = { ...this.position };
        this.parkBounce = 1;
        game.triggerParkedUnitFx(this);
        game.onTutorialUnitParked(this);
      }
    } else {
      this.cooldown = Math.max(0, this.cooldown - dt);
      if (game.gameState !== "playing") {
        this.alive = false;
        if (this.slotIndex !== null) {
          game.freeSlot(this.slotIndex, this.id);
        }
        return;
      }

      if (this.ammo <= 0) {
        this.alive = false;
        if (this.slotIndex !== null) {
          game.freeSlot(this.slotIndex, this.id);
        }
        return;
      }

      if (this.state === "parked") {
        if (this.slotIndex !== null) {
          const slotCenter = game.getSlotCenter(this.slotIndex);
          if (slotCenter) {
            this.position = { ...slotCenter };
          }
        }
      }

      if (this.state === "moving") {
        this.speed = TRACK_UNIT_SPEED;
        const delta = this.speed * dt;
        this.loopDistance += delta;
        this.distanceOnTrack -= delta;
        this.position = this.conveyor.pointAtDistance(this.distanceOnTrack);

        if (this.loopDistance >= game.conveyor.totalLength) {
          if (this.ammo > 0 && game.hasTargetForColor(this.color)) {
            this.loopDistance -= game.conveyor.totalLength;
            return;
          }
          const freeSlotIndex = game.claimFreeSlot(this.id);
          if (freeSlotIndex === null) {
            game.playSound("no_moves");
            this.alive = false;
            game.startLoseSequence();
            return;
          }
          this.slotIndex = freeSlotIndex;
          game.playSound("back_to_cell");
          this.landTo = game.getSlotCenter(freeSlotIndex);
          this.landFrom = { ...this.position };
          const dx = this.landTo.x - this.landFrom.x;
          const dy = this.landTo.y - this.landFrom.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const nx = -dy / dist;
          const ny = dx / dist;
          const lift = 20 + Math.min(44, dist * 0.14);
          this.landControl = {
            x: (this.landFrom.x + this.landTo.x) * 0.5 + nx * (Math.random() * 8 - 4),
            y: (this.landFrom.y + this.landTo.y) * 0.5 - lift + ny * (Math.random() * 4 - 2),
          };
          this.landProgress = 0;
          this.state = "landing";
          return;
        }
      }

      if (this.state !== "moving") {
        return;
      }

      if (this.cooldown > 0) {
        return;
      }

      let shotsFired = 0;
      const sweepStart = this.prevPosition ? { ...this.prevPosition } : { ...this.position };
      const sweepEnd = this.position ? { ...this.position } : { ...sweepStart };
      const sweepDistance = Math.hypot(sweepEnd.x - sweepStart.x, sweepEnd.y - sweepStart.y);
      const sampleStep = Math.max(1, LAYOUT.cellSize * 0.12);
      const sampleCount = Math.max(1, Math.ceil(sweepDistance / sampleStep));

      for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
        if (this.ammo <= 0 || shotsFired >= MAX_BURST_SHOTS_PER_TICK) {
          break;
        }
        const t = sampleCount <= 1 ? 1 : sampleIndex / (sampleCount - 1);
        const samplePoint = {
          x: sweepStart.x + (sweepEnd.x - sweepStart.x) * t,
          y: sweepStart.y + (sweepEnd.y - sweepStart.y) * t,
        };
        const shootDirection = game.getInwardShootDirection(samplePoint);
        if (!shootDirection) {
          continue;
        }
        const sampleRegion = game.getTrackRegionForPoint(samplePoint);
        if (sampleRegion !== this.currentTrackRegion) {
          this.currentTrackRegion = sampleRegion;
          this.regionFrontierLock = game.getTrackRegionFrontierLock(sampleRegion);
        }
        const target = game.findTargetOnLine(samplePoint, this.color, shootDirection, {
          frontierLock: this.regionFrontierLock,
        });
        if (!target) {
          continue;
        }
        this.ammo -= 1;
        game.fireProjectile(this, target);
        shotsFired += 1;
        break;
      }

      if (shotsFired > 0) {
        this.cooldown = FIRE_INTERVAL;
        this.triggerShotBounce();
      }
    }

    this.scaleX = 1;
    this.scaleY = 1;
    this.prevPosition = { ...this.position };
  }
}

class SlotManager {
  constructor(slots, claimOrder = []) {
    this.slots = slots;
    this.claimOrder = claimOrder.length ? [...claimOrder] : slots.map((_, index) => index);
    this.occupants = Array(slots.length).fill(null);
  }

  reset() {
    this.occupants = Array(this.slots.length).fill(null);
  }

  claim(unitId) {
    for (const index of this.claimOrder) {
      if (index < 0 || index >= this.occupants.length) {
        continue;
      }
      if (this.occupants[index] === null) {
        this.occupants[index] = unitId;
        return index;
      }
    }
    return null;
  }

  free(slotIndex, unitId) {
    if (slotIndex === null || slotIndex === undefined) {
      return;
    }
    if (slotIndex < 0 || slotIndex >= this.occupants.length) {
      return;
    }
    if (this.occupants[slotIndex] === unitId) {
      this.occupants[slotIndex] = null;
    }
  }

  getCenter(slotIndex) {
    const slot = this.slots[slotIndex];
    if (!slot) {
      return null;
    }
    return {
      x: slot.x + slot.w * 0.5,
      y: slot.y + slot.h * 0.5,
    };
  }
}

class CardManager {
  constructor(cardLayouts, queueCardCount = BOTTOM_QUEUE_CARD_COUNT) {
    this.baseLayouts = cardLayouts.map((card) => ({ ...card }));
    this.updateDerivedLayoutValues();
    this.queueCardCount = clamp(Math.round(queueCardCount), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
    this.cardLayouts = this.buildLayouts(this.queueCardCount);
    this.cards = [];
  }

  updateDerivedLayoutValues() {
    this.laneOrder = [...new Set(this.baseLayouts.map((card) => card.lane))].sort((a, b) => a - b);
    this.laneCount = Math.max(1, this.laneOrder.length);
    this.defaultSize = {
      w: this.baseLayouts[0]?.w || 160,
      h: this.baseLayouts[0]?.h || 200,
    };
    const topRowLayouts = this.baseLayouts.filter((card) => card.row === 0);
    this.topRowY = topRowLayouts.length > 0 ? Math.min(...topRowLayouts.map((card) => card.y)) : 0;
    const laneXByLane = {};
    for (const lane of this.laneOrder) {
      const front = this.baseLayouts.find((card) => card.lane === lane && card.row === 0);
      if (front) {
        laneXByLane[lane] = front.x;
      }
    }
    const firstLaneX = laneXByLane[this.laneOrder[0]] ?? this.baseLayouts[0]?.x ?? 312;
    const secondLaneX = laneXByLane[this.laneOrder[1]];
    this.defaultLaneSpacing = secondLaneX !== undefined ? secondLaneX - firstLaneX : 240;
    this.laneXByLane = laneXByLane;
    this.rowSpacing = this.deriveRowSpacing();
  }

  setBaseLayouts(cardLayouts) {
    this.baseLayouts = cardLayouts.map((card) => ({ ...card }));
    this.updateDerivedLayoutValues();
    this.cardLayouts = this.buildLayouts(this.queueCardCount);
  }

  deriveRowSpacing() {
    const firstLane = this.laneOrder[0];
    const laneLayouts = this.baseLayouts
      .filter((card) => card.lane === firstLane)
      .sort((a, b) => a.row - b.row);
    if (laneLayouts.length >= 2) {
      return Math.max(1, laneLayouts[1].y - laneLayouts[0].y);
    }
    return 202;
  }

  setQueueCardCount(count) {
    const clamped = clamp(Math.round(count), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
    const changed = clamped !== this.queueCardCount;
    this.queueCardCount = clamped;
    this.cardLayouts = this.buildLayouts(this.queueCardCount);
    return changed;
  }

  buildLayouts(count) {
    const layouts = [];
    for (let i = 0; i < count; i++) {
      const laneIndex = i % this.laneCount;
      const lane = this.laneOrder[laneIndex] ?? laneIndex;
      const row = Math.floor(i / this.laneCount);
      const fallbackX = (this.baseLayouts[0]?.x ?? 312) + laneIndex * this.defaultLaneSpacing;
      layouts.push({
        lane,
        row,
        x: this.laneXByLane[lane] ?? fallbackX,
        y: this.topRowY + row * this.rowSpacing,
        w: this.defaultSize.w,
        h: this.defaultSize.h,
      });
    }
    return layouts;
  }

  buildColorCounts(blocks) {
    return blocks.reduce((acc, block) => {
      if (!block?.color) {
        return acc;
      }
      acc[block.color] = (acc[block.color] || 0) + 1;
      return acc;
    }, {});
  }

  getColorSample(color) {
    const normalized = normalizeBlockColorName(color);
    if (!normalized) {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(BLOCK_COLOR_TO_RGB, normalized)) {
      return BLOCK_COLOR_TO_RGB[normalized];
    }
    const alias = BLOCK_TILE_COLOR_ALIASES[normalized];
    if (alias && Object.prototype.hasOwnProperty.call(BLOCK_COLOR_TO_RGB, alias)) {
      return BLOCK_COLOR_TO_RGB[alias];
    }
    return null;
  }

  getNearestColorFromSet(color, candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return "green";
    }
    const source = this.getColorSample(color);
    if (!source) {
      return candidates[0];
    }
    let bestColor = candidates[0];
    let bestDistance = Infinity;
    for (const candidate of candidates) {
      const sample = this.getColorSample(candidate);
      if (!sample) {
        continue;
      }
      const dr = source.r - sample.r;
      const dg = source.g - sample.g;
      const db = source.b - sample.b;
      const distanceSq = dr * dr + dg * dg + db * db;
      if (distanceSq < bestDistance) {
        bestDistance = distanceSq;
        bestColor = candidate;
      }
    }
    return bestColor;
  }

  remapBlocksToQueueCapacity(blocks, capacity) {
    const maxColors = Math.max(1, Math.round(Number(capacity) || 1));
    const initialCounts = this.buildColorCounts(blocks);
    const colors = Object.keys(initialCounts).filter((color) => initialCounts[color] > 0);
    if (colors.length <= maxColors) {
      return initialCounts;
    }
    const keepColors = colors
      .slice()
      .sort((a, b) => {
        const diff = (initialCounts[b] || 0) - (initialCounts[a] || 0);
        if (diff !== 0) {
          return diff;
        }
        return a.localeCompare(b);
      })
      .slice(0, maxColors);
    const keepSet = new Set(keepColors);
    for (const block of blocks) {
      if (!block?.color || keepSet.has(block.color)) {
        continue;
      }
      block.color = this.getNearestColorFromSet(block.color, keepColors);
    }
    return this.buildColorCounts(blocks);
  }

  distributeColors(cards, blocks) {
    const colorCounts = this.remapBlocksToQueueCapacity(blocks, cards.length);
    const colors = Object.keys(colorCounts).filter((color) => colorCounts[color] > 0);
    if (cards.length === 0) {
      return colorCounts;
    }
    if (colors.length === 0) {
      for (const card of cards) {
        card.color = "green";
      }
      return colorCounts;
    }

    const totalBlocks = colors.reduce((sum, color) => sum + colorCounts[color], 0);
    const targets = colors.map((color) => {
      const exact = totalBlocks > 0 ? (colorCounts[color] / totalBlocks) * cards.length : cards.length / colors.length;
      return { color, exact, count: Math.floor(exact), remainder: exact - Math.floor(exact) };
    });

    for (const target of targets) {
      if (target.count === 0) {
        target.count = 1;
      }
    }

    let assigned = targets.reduce((sum, target) => sum + target.count, 0);
    while (assigned > cards.length) {
      targets.sort((a, b) => (a.remainder - b.remainder) || (b.count - a.count));
      const candidate = targets.find((target) => target.count > 1);
      if (!candidate) {
        break;
      }
      candidate.count -= 1;
      assigned -= 1;
    }
    while (assigned < cards.length) {
      targets.sort((a, b) => (b.remainder - a.remainder) || (b.count - a.count));
      targets[0].count += 1;
      assigned += 1;
    }

    const remaining = new Map(targets.map((target) => [target.color, target.count]));
    let previousColor = null;
    for (const card of cards) {
      const candidates = targets
        .filter((target) => (remaining.get(target.color) || 0) > 0)
        .slice()
        .sort((a, b) => {
          const remainA = remaining.get(a.color) || 0;
          const remainB = remaining.get(b.color) || 0;
          if (remainA !== remainB) {
            return remainB - remainA;
          }
          if (a.color === previousColor && b.color !== previousColor) {
            return 1;
          }
          if (b.color === previousColor && a.color !== previousColor) {
            return -1;
          }
          return 0;
        });
      const pick = candidates[0] || targets[0];
      card.color = pick.color;
      remaining.set(pick.color, (remaining.get(pick.color) || 0) - 1);
      previousColor = pick.color;
    }

    return colorCounts;
  }

  resetFromBlocks(blocks) {
    this.cards = this.createFromBlocks(blocks);
    return this.cards;
  }

  createFromBlocks(blocks) {
    const cards = this.cardLayouts.map((card, index) => ({
      ...card,
      index,
      color: "green",
      styleKey: "mint",
      label: card.label ?? index + 1,
      ammo: 0,
      used: false,
      targetX: card.x,
      targetY: card.y,
      queueVx: 0,
      queueVy: 0,
      queueScale: 1,
      queueScaleV: 0,
    }));
    const colorCounts = this.distributeColors(cards, blocks);
    const styleIndexByColor = {};
    for (const card of cards) {
      styleIndexByColor[card.color] = styleIndexByColor[card.color] || 0;
      const styleKeys = getBlockColorConfig(card.color).styleKeys;
      card.styleKey = styleKeys[styleIndexByColor[card.color] % styleKeys.length] || styleKeys[0];
      styleIndexByColor[card.color] += 1;
    }

    const cardIndexesByColor = cards.reduce((acc, card, index) => {
      if (!acc[card.color]) {
        acc[card.color] = [];
      }
      acc[card.color].push(index);
      return acc;
    }, {});

    for (const [color, indexes] of Object.entries(cardIndexesByColor)) {
      const total = colorCounts[color] || 0;
      if (indexes.length === 0 || total <= 0) {
        continue;
      }
      const base = Math.floor(total / indexes.length);
      const remainder = total % indexes.length;
      indexes.forEach((cardIndex, i) => {
        cards[cardIndex].ammo = base + (i < remainder ? 1 : 0);
      });
    }

    for (const card of cards) {
      if (card.ammo <= 0) {
        card.used = true;
      }
    }

    return this.normalizeQueues(cards);
  }

  getCardLayout(lane, row) {
    return this.cardLayouts.find((card) => card.lane === lane && card.row === row) || null;
  }

  normalizeQueues(cards) {
    const lanes = [...new Set(cards.map((card) => card.lane))];
    for (const lane of lanes) {
      const activeInLane = cards
        .filter((card) => card.lane === lane && !card.used)
        .sort((a, b) => (a.row - b.row) || (a.index - b.index));
      if (activeInLane.length === 0) {
        continue;
      }
      activeInLane.forEach((card, row) => {
        const layout = this.getCardLayout(lane, row) || this.getCardLayout(lane, 0);
        if (!layout) {
          return;
        }
        const hadPosition = Number.isFinite(card.x) && Number.isFinite(card.y);
        const wasRow = card.row;
        card.row = row;
        card.w = layout.w;
        card.h = layout.h;
        card.targetX = layout.x;
        card.targetY = layout.y;
        if (!hadPosition) {
          card.x = layout.x;
          card.y = layout.y;
        } else if (Math.abs(card.targetX - card.x) > 0.5 || Math.abs(card.targetY - card.y) > 0.5) {
          const movingForward = row < wasRow;
          if (movingForward) {
            card.queueVy -= 22;
            card.queueScale = Math.max(0.9, card.queueScale - CARD_QUEUE_BOUNCE_SCALE);
          }
        }
      });
    }
    this.cards = cards;
    return cards;
  }

  updateQueueAnimations(dt) {
    let animating = false;
    for (const card of this.cards) {
      if (!Number.isFinite(card.x) || !Number.isFinite(card.y)) {
        card.x = Number.isFinite(card.targetX) ? card.targetX : 0;
        card.y = Number.isFinite(card.targetY) ? card.targetY : 0;
      }
      if (!Number.isFinite(card.targetX) || !Number.isFinite(card.targetY)) {
        card.targetX = card.x;
        card.targetY = card.y;
      }
      card.queueVx = Number.isFinite(card.queueVx) ? card.queueVx : 0;
      card.queueVy = Number.isFinite(card.queueVy) ? card.queueVy : 0;
      card.queueScale = Number.isFinite(card.queueScale) ? card.queueScale : 1;
      card.queueScaleV = Number.isFinite(card.queueScaleV) ? card.queueScaleV : 0;

      const dx = card.targetX - card.x;
      const dy = card.targetY - card.y;
      card.queueVx += dx * CARD_QUEUE_SPRING_STIFFNESS * dt;
      card.queueVy += dy * CARD_QUEUE_SPRING_STIFFNESS * dt;
      const velocityDamping = Math.exp(-CARD_QUEUE_SPRING_DAMPING * dt);
      card.queueVx *= velocityDamping;
      card.queueVy *= velocityDamping;
      card.x += card.queueVx * dt;
      card.y += card.queueVy * dt;

      const scaleDelta = 1 - card.queueScale;
      card.queueScaleV += scaleDelta * CARD_QUEUE_SCALE_STIFFNESS * dt;
      card.queueScaleV *= Math.exp(-CARD_QUEUE_SCALE_DAMPING * dt);
      card.queueScale += card.queueScaleV * dt;

      const settledPosition =
        Math.abs(card.targetX - card.x) <= CARD_QUEUE_SETTLE_EPSILON &&
        Math.abs(card.targetY - card.y) <= CARD_QUEUE_SETTLE_EPSILON &&
        Math.abs(card.queueVx) <= CARD_QUEUE_SETTLE_EPSILON * 4 &&
        Math.abs(card.queueVy) <= CARD_QUEUE_SETTLE_EPSILON * 4;
      const settledScale =
        Math.abs(1 - card.queueScale) <= 0.01 &&
        Math.abs(card.queueScaleV) <= 0.05;

      if (settledPosition) {
        card.x = card.targetX;
        card.y = card.targetY;
        card.queueVx = 0;
        card.queueVy = 0;
      } else {
        animating = true;
      }

      if (settledScale) {
        card.queueScale = 1;
        card.queueScaleV = 0;
      } else {
        animating = true;
      }
    }
    return animating;
  }

  hasAnimatingCards() {
    return this.cards.some((card) => (
      Math.abs((card.targetX ?? card.x ?? 0) - (card.x ?? 0)) > CARD_QUEUE_SETTLE_EPSILON ||
      Math.abs((card.targetY ?? card.y ?? 0) - (card.y ?? 0)) > CARD_QUEUE_SETTLE_EPSILON ||
      Math.abs(card.queueVx || 0) > CARD_QUEUE_SETTLE_EPSILON * 4 ||
      Math.abs(card.queueVy || 0) > CARD_QUEUE_SETTLE_EPSILON * 4 ||
      Math.abs((card.queueScale ?? 1) - 1) > 0.01 ||
      Math.abs(card.queueScaleV || 0) > 0.05
    ));
  }

  isFrontRowCard(card) {
    return !!card && card.row === 0 && !card.used;
  }

  getFrontLaneIds() {
    return [...new Set(this.cardLayouts.map((card) => card.lane))];
  }

  getActiveFrontCardInLane(lane) {
    return this.cards.find((card) => card.lane === lane && this.isFrontRowCard(card)) || null;
  }

  getCardPigCenter(card) {
    return {
      x: card.x + card.w / 2,
      y: card.y + card.h / 2,
    };
  }

  getCardBadgeRect(card) {
    const center = this.getCardPigCenter(card);
    const badgeY = card.y + card.h - 16;
    return {
      x: center.x - 38,
      y: badgeY - 13,
      w: 76,
      h: 24,
    };
  }

  isPointOnCard(card, x, y, options = {}) {
    const visualLiftY = Number.isFinite(options.visualLiftY) ? options.visualLiftY : 0;
    const center = this.getCardPigCenter(card);
    const visualCenterY = center.y - visualLiftY;
    const onPig = Math.hypot(x - center.x, y - visualCenterY) <= SHOOTER_HIT_RADIUS;
    const onCardRect =
      x >= card.x - CARD_HITBOX_PADDING_X &&
      x <= card.x + card.w + CARD_HITBOX_PADDING_X &&
      y >= card.y - visualLiftY - CARD_HITBOX_PADDING_TOP &&
      y <= card.y - visualLiftY + card.h + CARD_HITBOX_PADDING_BOTTOM;
    if (card.row === 0) {
      return onCardRect;
    }
    return onPig || onCardRect;
  }

  findTapTarget(x, y, options = {}) {
    const visualLiftY = Number.isFinite(options.visualLiftY) ? options.visualLiftY : 0;
    let best = null;
    let bestDistance = Infinity;
    for (const lane of this.getFrontLaneIds()) {
      const activeCard = this.getActiveFrontCardInLane(lane);
      if (!activeCard || !this.isPointOnCard(activeCard, x, y, { visualLiftY })) {
        continue;
      }
      const center = this.getCardPigCenter(activeCard);
      const score = Math.hypot(x - center.x, y - (center.y - visualLiftY));
      if (score < bestDistance) {
        bestDistance = score;
        best = activeCard;
      }
    }
    return best;
  }

  findAnyTapTarget(x, y, options = {}) {
    const visualLiftY = Number.isFinite(options.visualLiftY) ? options.visualLiftY : 0;
    let best = null;
    let bestDistance = Infinity;
    for (const card of this.cards) {
      if (!card || !this.isPointOnCard(card, x, y, { visualLiftY })) {
        continue;
      }
      const center = this.getCardPigCenter(card);
      const score = Math.hypot(x - center.x, y - (center.y - visualLiftY));
      if (score < bestDistance) {
        bestDistance = score;
        best = card;
      }
    }
    return best;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.width = LOGICAL_WIDTH;
    this.height = LOGICAL_HEIGHT;
    this.screenWidth = LOGICAL_WIDTH;
    this.screenHeight = LOGICAL_HEIGHT;
    this.viewportScale = 1;
    this.viewportOffsetX = 0;
    this.viewportOffsetY = 0;
    this.dpr = 1;
    this.currentLevelId = CURRENT_LEVEL.id;
    this.currentThemeId = CURRENT_THEME.id;
    this.availableLevels = [];
    this.availableThemes = THEME_DEFINITIONS.map((theme) => ({ id: theme.id, name: theme.name }));
    this.refreshAvailableLevels();
    const SoundManagerClass = typeof SoundManager === "function" ? SoundManager : null;
    this.soundManager = SoundManagerClass
      ? new SoundManagerClass(SOUND_DEFINITIONS)
      : { play: () => {} };

    this.backButtonImage = new Image();
    this.backButtonImage.src = getThemeAsset("backButton", "ui/back_button.png");
    this.backButtonImage.decoding = "async";
    this.timerPanelImage = new Image();
    this.timerPanelImage.src = getThemeAsset("timerPanel", "ui/timer_panel.png");
    this.timerPanelImage.decoding = "async";
    this.restartButtonImage = new Image();
    this.restartButtonImage.src = getThemeAsset("restartButton", "ui/restart_button.png");
    this.restartButtonImage.decoding = "async";
    this.losePopupImage = new Image();
    this.losePopupImage.src = "ui/lose_popup_space_ref.png";
    this.losePopupImage.decoding = "async";
    this.losePopupBirdsImage = new Image();
    this.losePopupBirdsImage.src = "ui/loose.png";
    this.losePopupBirdsImage.decoding = "async";
    this.loseTopHeartPanelImage = new Image();
    this.loseTopHeartPanelImage.src = "ui/Lose/heart.png";
    this.loseTopHeartPanelImage.decoding = "async";
    this.loseTopCoinsPanelImage = new Image();
    this.loseTopCoinsPanelImage.src = "ui/Lose/coins.png";
    this.loseTopCoinsPanelImage.decoding = "async";
    this.loseCoinsButtonImage = new Image();
    this.loseCoinsButtonImage.src = "ui/Lose/coins_button.png";
    this.loseCoinsButtonImage.decoding = "async";
    this.loseAdsButtonImage = new Image();
    this.loseAdsButtonImage.src = "ui/Lose/ads_button.png";
    this.loseAdsButtonImage.decoding = "async";
    this.loseOfferImage = new Image();
    this.loseOfferImage.src = "ui/Lose/Offer.png";
    this.loseOfferImage.decoding = "async";
    this.loseOfferPurchaseButtonImage = new Image();
    this.loseOfferPurchaseButtonImage.src = "ui/Lose/purchase_button.png";
    this.loseOfferPurchaseButtonImage.decoding = "async";
    this.woodImage = new Image();
    this.woodImage.src = getBackgroundAssetPath(DEFAULT_BACKGROUND_ID, "panel");
    this.woodImage.decoding = "async";
    this.slotCellImage = new Image();
    this.slotCellImage.src = getBackgroundAssetPath(DEFAULT_BACKGROUND_ID, "cell");
    this.slotCellImage.decoding = "async";
    this.railwayImage = new Image();
    this.railwayImage.src = getBackgroundAssetPath(DEFAULT_BACKGROUND_ID, "railway");
    this.railwayImage.decoding = "async";
    this.backdropImage = new Image();
    this.backdropImage.src = getBackgroundAssetPath(DEFAULT_BACKGROUND_ID, "background");
    this.backdropImage.decoding = "async";
    this.tutorHandImage = new Image();
    this.tutorHandImage.src = "ui/tutor_hand.png";
    this.tutorHandImage.decoding = "async";
    this.blockTemplateImage = new Image();
    this.blockTemplateImage.src = "ui/block.png";
    this.blockTemplateImage.decoding = "async";
    this.blockTileImageByColor = {};
    this.blockTileColorSampleByColor = {};
    this.blockTileUsesSourceImage = {};
    this.chickenSpriteColorSampleByColor = {};
    this.debugBlockColorPalette = [];
    this.debugImageBucketColorCache = new Map();
    this.generatedBackdropCache = null;
    this.referenceAssetsRebuildScheduled = false;

    this.sprites = {
      holeTile: null,
      greenTile: null,
      blackTile: null,
      blueTile: null,
      fieldGround: null,
      wagon: null,
      wagonMask: null,
      grassTile: null,
      grassPattern: null,
      dirtPattern: null,
      woodPattern: null,
      chickenByColor: {},
    };
    this.chickenSpriteImageByColor = {};
    this.initChickenSpriteImages();
    this.initBlockTileImages();
    this.rebuildBlockColorSamplerPalette();

    const staticSceneLayer = createBufferCanvas(this.width, this.height, false);
    this.staticSceneLayer = staticSceneLayer.canvas;
    this.staticSceneCtx = staticSceneLayer.ctx;
    const blockFieldLayer = createBufferCanvas(this.width, this.height, true);
    this.blockFieldLayer = blockFieldLayer.canvas;
    this.blockFieldCtx = blockFieldLayer.ctx;
    this.blockFieldLayerDirty = true;

    this.conveyor = new Conveyor();
    this.spiralOrderByCell = this.buildSpiralOrderMap(LAYOUT.fieldCols, LAYOUT.fieldRows);
    this.spiralTraversalOrderByCell = this.buildSpiralTraversalOrderMap(LAYOUT.fieldCols, LAYOUT.fieldRows);
    this.blocks = [];
    this.blocksBySpiral = [];
    this.blockByCell = new Map();
    this.targetingCacheVersion = 1;
    this.allowedReachableProbeCache = new Map();
    this.trackProbeWindowCache = new Map();
    this.trackSideSamples = null;
    this.trackSideSamplesKey = "";
    this.nextSpiralTargetsCache = [];
    this.nextSpiralTargetsCacheVersion = -1;
    this.contourGhostTargetsCache = [];
    this.contourGhostTargetsCacheVersion = -1;
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.blockWaves = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.confetti = [];
    this.cardManager = new CardManager(LAYOUT.cards, BOTTOM_QUEUE_CARD_COUNT);
    this.slotManager = new SlotManager(LAYOUT.slots, SLOT_CLAIM_ORDER);
    this.backButtonRect = { ...BACK_BUTTON_UI };
    this.restartButtonRect = { x: 0, y: 0, w: COINS_UI.panelW, h: COINS_UI.panelH };
    this.loseCloseRect = { x: 0, y: 0, w: 0, h: 0 };
    this.loseContinueRect = { x: 0, y: 0, w: 0, h: 0 };
    this.loseFreeRect = { x: 0, y: 0, w: 0, h: 0 };
    this.loseOfferPurchaseRect = { x: 0, y: 0, w: 0, h: 0 };
    this.loseContinueSnapshot = [];
    this.cards = [];
    this.wagon = {
      x: LAYOUT.spawnPoint.x,
      y: LAYOUT.spawnPoint.y,
      distance: 0,
      color: null,
      moving: false,
    };
    this.tutorial = this.createTutorialState();

    this.gameState = "loading";
    this.remainingBlocks = 0;
    this.hoverHotspot = null;
    this.lastTimestamp = 0;
    this.simAccumulator = 0;
    this.needsRender = true;
    this.isLoopRunning = false;
    this.unitIdCounter = 0;
    this.cameraZoom = 1;
    this.cameraZoomTarget = 1;
    this.cameraShakeTime = 0;
    this.cameraShakeDuration = 0;
    this.cameraShakeAmp = 0;
    this.cameraShakeX = 0;
    this.cameraShakeY = 0;
    this.successStreak = 0;
    this.streakTimer = 0;
    this.victoryConfettiTime = 0;
    this.victoryFloatTime = 0;
    this.victoryConfettiSpawnCarry = 0;
    this.victoryCompleteEventPending = false;
    this.levelStartFade = 0;
    this.losePopupAppear = 1;
    this.debugPanel = document.getElementById("debugPanel");
    this.debugToggleFab = document.getElementById("debugToggleFab");
    this.debugButton = document.getElementById("debug6");
    this.debugLoseButton = document.getElementById("debugLose");
    this.debugResetButton = document.getElementById("debugReset");
    this.debugExportButton = document.getElementById("debugExport");
    this.debugExportLevelButton = document.getElementById("debugExportLevel");
    this.debugImageLevelToggleButton = document.getElementById("debugImageLevelToggle");
    this.debugImageLevelSection = document.getElementById("debugImageLevelSection");
    this.debugLevelSelect = document.getElementById("debugLevelSelect");
    this.debugThemeSelect = document.getElementById("debugThemeSelect");
    this.debugBackgroundButtons = {
      default: document.getElementById("debugBgDefault"),
      blue: document.getElementById("debugBgBlue"),
      orange: document.getElementById("debugBgOrange"),
      purple: document.getElementById("debugBgPurple"),
      pink: document.getElementById("debugBgPink"),
      water: document.getElementById("debugBgWater"),
    };
    this.debugCurrentLevelNameInput = document.getElementById("debugCurrentLevelName");
    this.debugSaveCurrentLevelNameButton = document.getElementById("debugSaveCurrentLevelName");
    this.debugLevelTopNav = document.querySelector(".debug-level-nav");
    this.debugLevelTopNavToggle = document.getElementById("debugLevelTopNavToggle");
    this.debugLevelPrevTopButton = document.getElementById("debugLevelPrevTop");
    this.debugLevelNextTopButton = document.getElementById("debugLevelNextTop");
    this.debugLevelTopLabel = document.getElementById("debugLevelTopLabel");
    this.debugImageUploadInput = document.getElementById("debugImageUpload");
    this.debugImageFileName = document.getElementById("debugImageFileName");
    this.debugImageGridColsInput = document.getElementById("debugImageGridCols");
    this.debugImageGridRowsInput = document.getElementById("debugImageGridRows");
    this.debugImageScaleInput = document.getElementById("debugImageScale");
    this.debugImageScaleValue = document.getElementById("debugImageScaleValue");
    this.debugImageOffsetYInput = document.getElementById("debugImageOffsetY");
    this.debugImageOffsetYValue = document.getElementById("debugImageOffsetYValue");
    this.debugImageCreateButton = document.getElementById("debugImageCreate");
    this.debugImageRefreshButton = document.getElementById("debugImageRefresh");
    this.debugImageStatus = document.getElementById("debugImageStatus");
    this.debugSaveLevelNumberInput = document.getElementById("debugSaveLevelNumber");
    this.debugSaveLevelNameInput = document.getElementById("debugSaveLevelName");
    this.debugSaveCurrentLevelButton = document.getElementById("debugSaveCurrentLevel");
    this.debugSaveTargetLevelButton = document.getElementById("debugSaveTargetLevel");
    this.debugPickLevelsFolderButton = document.getElementById("debugPickLevelsFolder");
    this.debugPaintModeInput = document.getElementById("debugPaintMode");
    this.debugPaintToolSelect = document.getElementById("debugPaintTool");
    this.debugPaintColorSelect = document.getElementById("debugPaintColor");
    this.shotBounceSizeInput = document.getElementById("shotBounceSize");
    this.shotBounceSizeValue = document.getElementById("shotBounceSizeValue");
    this.shotBounceSpeedInput = document.getElementById("shotBounceSpeed");
    this.shotBounceSpeedValue = document.getElementById("shotBounceSpeedValue");
    this.railSpeedInput = document.getElementById("railSpeed");
    this.railSpeedValue = document.getElementById("railSpeedValue");
    this.queueCardsInput = document.getElementById("queueCards");
    this.queueCardsValue = document.getElementById("queueCardsValue");
    this.maxActiveUnitsInput = document.getElementById("maxActiveUnits");
    this.maxActiveUnitsValue = document.getElementById("maxActiveUnitsValue");
    this.chickenSizeScaleInput = document.getElementById("chickenSizeScale");
    this.chickenSizeScaleValue = document.getElementById("chickenSizeScaleValue");
    this.topPanelFontSizeInput = document.getElementById("topPanelFontSize");
    this.topPanelFontSizeValue = document.getElementById("topPanelFontSizeValue");
    this.levelPanelScaleInput = document.getElementById("levelPanelScale");
    this.levelPanelScaleValue = document.getElementById("levelPanelScaleValue");
    this.coinsPanelScaleInput = document.getElementById("coinsPanelScale");
    this.coinsPanelScaleValue = document.getElementById("coinsPanelScaleValue");
    this.backButtonScaleInput = document.getElementById("backButtonScale");
    this.backButtonScaleValue = document.getElementById("backButtonScaleValue");
    this.trackYOffsetInput = document.getElementById("trackYOffset");
    this.trackYOffsetValue = document.getElementById("trackYOffsetValue");
    this.trackYOffsetMobileInput = document.getElementById("trackYOffsetMobile");
    this.trackYOffsetMobileValue = document.getElementById("trackYOffsetMobileValue");
    this.playfieldScaleInput = document.getElementById("playfieldScale");
    this.playfieldScaleValue = document.getElementById("playfieldScaleValue");
    this.slotSizeScaleInput = document.getElementById("slotSizeScale");
    this.slotSizeScaleValue = document.getElementById("slotSizeScaleValue");
    this.slotYOffsetInput = document.getElementById("slotYOffset");
    this.slotYOffsetValue = document.getElementById("slotYOffsetValue");
    this.slotSpacingXMobileInput = document.getElementById("slotSpacingXMobile");
    this.slotSpacingXMobileValue = document.getElementById("slotSpacingXMobileValue");
    this.slotSpacingXDesktopInput = document.getElementById("slotSpacingXDesktop");
    this.slotSpacingXDesktopValue = document.getElementById("slotSpacingXDesktopValue");
    this.trayBottomOffsetInput = document.getElementById("trayBottomOffset");
    this.trayBottomOffsetValue = document.getElementById("trayBottomOffsetValue");
    this.trayBottomOffsetDesktopInput = document.getElementById("trayBottomOffsetDesktop");
    this.trayBottomOffsetDesktopValue = document.getElementById("trayBottomOffsetDesktopValue");
    this.trayScaleYMobileInput = document.getElementById("trayScaleYMobile");
    this.trayScaleYMobileValue = document.getElementById("trayScaleYMobileValue");
    this.trayScaleYDesktopInput = document.getElementById("trayScaleYDesktop");
    this.trayScaleYDesktopValue = document.getElementById("trayScaleYDesktopValue");
    this.queueSpacingXMobileInput = document.getElementById("queueSpacingXMobile");
    this.queueSpacingXMobileValue = document.getElementById("queueSpacingXMobileValue");
    this.queueSpacingXDesktopInput = document.getElementById("queueSpacingXDesktop");
    this.queueSpacingXDesktopValue = document.getElementById("queueSpacingXDesktopValue");
    this.topUiYOffsetInput = document.getElementById("topUiYOffset");
    this.topUiYOffsetValue = document.getElementById("topUiYOffsetValue");
    this.topUiYOffsetMobileInput = document.getElementById("topUiYOffsetMobile");
    this.topUiYOffsetMobileValue = document.getElementById("topUiYOffsetMobileValue");
    this.mobileBottomClusterYOffsetInput = document.getElementById("mobileBottomClusterYOffset");
    this.mobileBottomClusterYOffsetValue = document.getElementById("mobileBottomClusterYOffsetValue");
    this.cardAllYOffsetInput = document.getElementById("cardAllYOffset");
    this.cardAllYOffsetValue = document.getElementById("cardAllYOffsetValue");
    this.card1YOffsetInput = document.getElementById("card1YOffset");
    this.card1YOffsetValue = document.getElementById("card1YOffsetValue");
    this.card2YOffsetInput = document.getElementById("card2YOffset");
    this.card2YOffsetValue = document.getElementById("card2YOffsetValue");
    this.card3YOffsetInput = document.getElementById("card3YOffset");
    this.card3YOffsetValue = document.getElementById("card3YOffsetValue");
    this.card4YOffsetInput = document.getElementById("card4YOffset");
    this.card4YOffsetValue = document.getElementById("card4YOffsetValue");
    this.debugPanelVisible = false;
    this.suppressDebugSave = false;
    this.debugContentSelectorsBound = false;
    this.debugGeneratedSourceImage = null;
    this.debugGeneratedBaseLevelId = DEFAULT_LEVEL_ID;
    this.debugImageSettingsByLevel = {};
    this.debugLevelsDirHandle = null;
    this.debugLevelsDirName = "";
    this.debugSaveTargetDirty = false;
    this.debugPaintModeEnabled = false;
    this.debugPaintTool = "paint";
    this.debugPaintColor = "blue";
    this.debugPaintHoverCell = null;
    this.currentBackgroundId = DEFAULT_BACKGROUND_ID;
    this.topLevelNavVisible = true;

    this.loadDebugSettings();
    this.initDebugControls();

    this.bindEvents();
    this.resize();

    this.backButtonImage.onload = () => {
      this.invalidate(false);
    };
    this.timerPanelImage.onload = () => {
      this.invalidate(false);
    };
    this.restartButtonImage.onload = () => {
      this.invalidate(false);
    };
    this.losePopupImage.onload = () => {
      this.invalidate(false);
    };
    this.losePopupBirdsImage.onload = () => {
      this.invalidate(false);
    };
    this.loseTopHeartPanelImage.onload = () => {
      this.invalidate(false);
    };
    this.loseTopCoinsPanelImage.onload = () => {
      this.invalidate(false);
    };
    this.loseCoinsButtonImage.onload = () => {
      this.invalidate(false);
    };
    this.loseAdsButtonImage.onload = () => {
      this.invalidate(false);
    };
    this.loseOfferImage.onload = () => {
      this.invalidate(false);
    };
    this.loseOfferPurchaseButtonImage.onload = () => {
      this.invalidate(false);
    };
    this.woodImage.onload = () => {
      this.sprites.woodPattern = this.createWoodPatternTile();
      this.rebuildStaticSceneLayer();
      this.invalidate(false);
    };
    this.slotCellImage.onload = () => {
      this.rebuildStaticSceneLayer();
      this.invalidate(false);
    };
    this.railwayImage.onload = () => {
      this.rebuildStaticSceneLayer();
      this.invalidate(false);
    };
    this.backdropImage.onload = () => {
      this.generatedBackdropCache = null;
      this.rebuildStaticSceneLayer();
      this.invalidate(false);
    };
    this.blockTemplateImage.onload = () => {
      this.buildReferenceAssets();
      this.invalidate(false);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.invalidate(false));
    }

    this.buildReferenceAssets();
    this.restart();
  }

  playSound(name) {
    this.soundManager.play(name);
  }

  buildReferenceAssets() {
    const blockColors = new Set([
      ...Object.keys(BLOCK_COLOR_CONFIG),
      ...Object.keys(BLOCK_TILE_SOURCE_BY_COLOR),
    ]);
    this.blockTileUsesSourceImage = {};
    for (const color of blockColors) {
      this.sprites[`${color}Tile`] = this.createBlockSprite(color);
      this.blockTileUsesSourceImage[color] = !!this.getLoadedBlockTileImage(color);
    }
    this.sprites.greenTile = this.sprites.greenTile || this.createBlockSprite("green");
    this.sprites.blackTile = this.sprites.blackTile || this.sprites.greenTile;
    this.sprites.blueTile = this.sprites.blueTile || this.sprites.greenTile;
    this.sprites.whiteTile = this.sprites.whiteTile || this.sprites.greenTile;
    this.sprites.yellowTile = this.sprites.yellowTile || this.sprites.greenTile;
    this.sprites.redTile = this.sprites.redTile || this.sprites.greenTile;
    this.sprites.chickenByColor = {};
    const chickenColors = new Set([
      ...Object.keys(CHICKEN_SPRITE_SOURCE_BY_COLOR),
      ...Object.keys(this.chickenSpriteImageByColor),
    ]);
    for (const color of chickenColors) {
      const imageSprite = this.chickenSpriteImageByColor[color];
      if (imageSprite && imageSprite.complete && imageSprite.naturalWidth > 0 && imageSprite.naturalHeight > 0) {
        this.sprites.chickenByColor[color] = imageSprite;
      }
    }
    this.sprites.holeTile = null;
    this.sprites.fieldGround = null;
    this.sprites.wagon = null;
    this.sprites.wagonMask = null;
    this.sprites.grassTile = null;
    const boardTheme = CURRENT_THEME.board || {};
    this.sprites.grassPattern = this.createBackdropPattern(
      boardTheme.fill || BOARD_FILL_COLOR,
      boardTheme.grassPalette || ["#6a9f35", "#72aa3a", "#7bb642", "#5f9430", "#89c84b"],
      boardTheme.grassShade || "rgba(28, 52, 14, 0.16)"
    );
    this.sprites.dirtPattern = this.createBackdropPattern(
      boardTheme.dirtFill || "#b98c5e",
      boardTheme.dirtPalette || ["#b18052", "#ba8a5b", "#c89a67", "#a9784a", "#d1a874"],
      boardTheme.dirtShade || "rgba(64, 40, 22, 0.2)"
    );
    this.sprites.woodPattern = this.createWoodPatternTile();
    this.rebuildStaticSceneLayer();
    this.rebuildBlockFieldLayer();
  }

  scheduleReferenceAssetsRebuild() {
    if (this.referenceAssetsRebuildScheduled) {
      return;
    }
    this.referenceAssetsRebuildScheduled = true;
    requestAnimationFrame(() => {
      this.referenceAssetsRebuildScheduled = false;
      this.buildReferenceAssets();
      this.invalidate(false);
    });
  }

  initChickenSpriteImages() {
    for (const [color, src] of Object.entries(CHICKEN_SPRITE_SOURCE_BY_COLOR)) {
      this.registerChickenSpriteImageSource(color, src);
    }
    // For file:// sessions directory listing is often unavailable; probe by predictable color filenames.
    const isFileProtocol = typeof window !== "undefined" && window.location?.protocol === "file:";
    if (isFileProtocol) {
      for (const color of Object.keys(BLOCK_TILE_SOURCE_BY_COLOR)) {
        this.registerChickenSpriteImageSource(color, `ui/birds/${color}.png`);
      }
    }
    void this.discoverChickenSpriteSourcesFromUiDirectory();
  }

  registerChickenSpriteImageSource(color, src) {
    const normalizedColor = String(color || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
    const normalizedSrc = String(src || "").trim();
    if (!normalizedColor || !normalizedSrc) {
      return;
    }
    if (this.chickenSpriteImageByColor[normalizedColor]) {
      return;
    }
    CHICKEN_SPRITE_SOURCE_BY_COLOR[normalizedColor] = normalizedSrc;
    const image = new Image();
    image.decoding = "async";
    image.src = normalizedSrc;
    image.onload = () => {
      try {
        const sample = this.extractRepresentativeColorFromImage(image);
        if (sample) {
          this.chickenSpriteColorSampleByColor[normalizedColor] = sample;
        }
      } catch {
        // On file://, reading pixels can throw SecurityError (tainted canvas).
      }
      this.scheduleReferenceAssetsRebuild();
    };
    image.onerror = () => {
      delete this.chickenSpriteColorSampleByColor[normalizedColor];
    };
    this.chickenSpriteImageByColor[normalizedColor] = image;
  }

  normalizeDiscoveredChickenColorKey(baseName) {
    const normalized = String(baseName || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_")
      .replace(/_+\d+$/, "")
      .replace(/^chicken_+/, "")
      .replace(/_+chicken$/, "")
      .replace(/^bird_+/, "")
      .replace(/_+bird$/, "");
    if (!normalized || normalized === "chicken" || normalized === "bird") {
      return null;
    }
    return normalized;
  }

  async discoverChickenSpriteSourcesFromUiDirectory() {
    if (typeof fetch !== "function") {
      return;
    }
    let response;
    try {
      response = await fetch("ui/birds/", { cache: "no-store" });
    } catch {
      return;
    }
    if (!response?.ok) {
      return;
    }
    let html = "";
    try {
      html = await response.text();
    } catch {
      return;
    }
    if (!html || typeof html !== "string") {
      return;
    }
    const hrefMatches = [...html.matchAll(/href\s*=\s*["']([^"']+?\.png(?:\?[^"']*)?)["']/gi)];
    if (hrefMatches.length === 0) {
      return;
    }
    for (const match of hrefMatches) {
      const rawHref = String(match[1] || "").trim();
      if (!rawHref) {
        continue;
      }
      const decodedHref = decodeURIComponent(rawHref.split("?")[0].split("#")[0]);
      const fileName = decodedHref.split("/").filter(Boolean).pop() || "";
      if (!fileName.toLowerCase().endsWith(".png")) {
        continue;
      }
      const baseName = fileName.slice(0, -4).trim().toLowerCase();
      const colorKey = baseName
        .replace(/[\s-]+/g, "_")
        .replace(/_alt(?:_\d+)?$/, "");
      if (!colorKey || !/^[a-z0-9_]+$/.test(colorKey)) {
        continue;
      }
      if (baseName.includes("legacy") || baseName.includes("backup")) {
        continue;
      }
      if (Object.prototype.hasOwnProperty.call(CHICKEN_SPRITE_SOURCE_BY_COLOR, colorKey)) {
        continue;
      }
      this.registerChickenSpriteImageSource(colorKey, `ui/birds/${fileName}`);
    }
  }

  initBlockTileImages() {
    for (const [color, src] of Object.entries(BLOCK_TILE_SOURCE_BY_COLOR)) {
      this.registerBlockTileImageSource(color, src);
    }
    void this.discoverBlockTileSourcesFromUiDirectory();
  }

  registerBlockTileImageSource(color, src) {
    const normalizedColor = String(color || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
    const normalizedSrc = String(src || "").trim();
    if (!normalizedColor || !normalizedSrc) {
      return;
    }
    if (this.blockTileImageByColor[normalizedColor]) {
      return;
    }
    BLOCK_TILE_SOURCE_BY_COLOR[normalizedColor] = normalizedSrc;
    const image = new Image();
    image.decoding = "async";
    image.src = normalizedSrc;
    image.onload = () => {
      try {
        const sample = this.extractRepresentativeColorFromImage(image);
        if (sample) {
          this.blockTileColorSampleByColor[normalizedColor] = sample;
          BLOCK_COLOR_TO_RGB[normalizedColor] = sample;
        }
      } catch {
        // On file://, reading pixels can throw SecurityError (tainted canvas).
      }
      this.rebuildBlockColorSamplerPalette();
      this.scheduleReferenceAssetsRebuild();
    };
    image.onerror = () => {
      delete this.blockTileColorSampleByColor[normalizedColor];
      this.rebuildBlockColorSamplerPalette();
    };
    this.blockTileImageByColor[normalizedColor] = image;
  }

  async discoverBlockTileSourcesFromUiDirectory() {
    if (typeof fetch !== "function") {
      return;
    }
    let response;
    try {
      response = await fetch("ui/blocks/", { cache: "no-store" });
    } catch {
      return;
    }
    if (!response?.ok) {
      return;
    }
    let html = "";
    try {
      html = await response.text();
    } catch {
      return;
    }
    if (!html || typeof html !== "string") {
      return;
    }
    const hrefMatches = [...html.matchAll(/href\s*=\s*["']([^"']+?\.png(?:\?[^"']*)?)["']/gi)];
    if (hrefMatches.length === 0) {
      return;
    }
    for (const match of hrefMatches) {
      const rawHref = String(match[1] || "").trim();
      if (!rawHref) {
        continue;
      }
      const decodedHref = decodeURIComponent(rawHref.split("?")[0].split("#")[0]);
      const fileName = decodedHref.split("/").filter(Boolean).pop() || "";
      if (!fileName.toLowerCase().endsWith(".png")) {
        continue;
      }
      const baseName = fileName.slice(0, -4).trim().toLowerCase();
      const colorKey = baseName
        .replace(/[\s-]+/g, "_")
        .replace(/^tile_+/, "");
      if (!/^[a-z0-9_]+$/.test(colorKey)) {
        continue;
      }
      if (Object.prototype.hasOwnProperty.call(BLOCK_TILE_SOURCE_BY_COLOR, colorKey)) {
        continue;
      }
      this.registerBlockTileImageSource(colorKey, `ui/blocks/${fileName}`);
    }
  }

  extractRepresentativeColorFromImage(image) {
    const sourceWidth = Math.max(1, Math.round(image.naturalWidth || image.width || 0));
    const sourceHeight = Math.max(1, Math.round(image.naturalHeight || image.height || 0));
    const maxDimension = Math.max(sourceWidth, sourceHeight);
    const sampleLimit = 64;
    const sampleScale = maxDimension > sampleLimit ? sampleLimit / maxDimension : 1;
    const width = Math.max(1, Math.round(sourceWidth * sampleScale));
    const height = Math.max(1, Math.round(sourceHeight * sampleScale));
    if (width <= 0 || height <= 0) {
      return null;
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!ctx) {
      return null;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, width, height);
    let imageData;
    try {
      imageData = ctx.getImageData(0, 0, width, height);
    } catch {
      return null;
    }
    const { data } = imageData;
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let weightSum = 0;
    const buckets = new Map();
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 20) {
        continue;
      }
      const weight = alpha / 255;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      sumR += r * weight;
      sumG += g * weight;
      sumB += b * weight;
      weightSum += weight;
      const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
      buckets.set(key, (buckets.get(key) || 0) + weight);
    }
    if (weightSum <= 0) {
      return null;
    }
    let dominantKey = "";
    let dominantWeight = -1;
    for (const [key, weight] of buckets.entries()) {
      if (weight > dominantWeight) {
        dominantWeight = weight;
        dominantKey = key;
      }
    }
    const [bucketR = 0, bucketG = 0, bucketB = 0] = dominantKey
      .split("-")
      .map((value) => clamp(Number(value) || 0, 0, 15));
    const dominantR = bucketR * 16 + 8;
    const dominantG = bucketG * 16 + 8;
    const dominantB = bucketB * 16 + 8;
    const avgR = sumR / weightSum;
    const avgG = sumG / weightSum;
    const avgB = sumB / weightSum;
    return {
      r: Math.round(clamp(lerp(avgR, dominantR, 0.62), 0, 255)),
      g: Math.round(clamp(lerp(avgG, dominantG, 0.62), 0, 255)),
      b: Math.round(clamp(lerp(avgB, dominantB, 0.62), 0, 255)),
    };
  }

  rebuildBlockColorSamplerPalette() {
    this.debugImageBucketColorCache = new Map();
    this.debugBlockColorPalette = Object.entries(DEBUG_IMAGE_GENERATOR_BASE_COLOR_TO_RGB).map(([color, sample]) => ({
      color,
      r: sample.r,
      g: sample.g,
      b: sample.b,
      lab: rgbToLab(sample.r, sample.g, sample.b),
      hue: getHueDegrees(sample.r, sample.g, sample.b),
      saturation: getColorSaturationRatio(sample.r, sample.g, sample.b),
      luma: getLuma(sample.r, sample.g, sample.b) / 255,
      family: getDebugImageColorFamily(sample.r, sample.g, sample.b),
    }));
  }

  getNearestDebugPaletteColor(r, g, b) {
    const palette = this.debugBlockColorPalette;
    if (!Array.isArray(palette) || palette.length === 0) {
      return getNearestBlockColor(r, g, b);
    }
    let bestColor = palette[0].color;
    let bestDistance = Infinity;
    for (const sample of palette) {
      const dR = r - sample.r;
      const dG = g - sample.g;
      const dB = b - sample.b;
      const distanceSq = dR * dR + dG * dG + dB * dB;
      if (distanceSq < bestDistance) {
        bestDistance = distanceSq;
        bestColor = sample.color;
      }
    }
    return bestColor;
  }

  getColorSampleForColorKey(color) {
    const normalized = normalizeBlockColorName(color);
    if (!normalized) {
      return null;
    }
    const direct =
      this.blockTileColorSampleByColor[normalized]
      || this.chickenSpriteColorSampleByColor[normalized]
      || BLOCK_COLOR_TO_RGB[normalized];
    if (direct) {
      return direct;
    }
    const alias = BLOCK_TILE_COLOR_ALIASES[normalized];
    if (alias) {
      const aliasSample =
        this.blockTileColorSampleByColor[alias]
        || this.chickenSpriteColorSampleByColor[alias]
        || BLOCK_COLOR_TO_RGB[alias];
      if (aliasSample) {
        return aliasSample;
      }
    }
    // Name-based fallback so unknown shades don't flash green before PNG finishes loading.
    if (normalized.includes("pink") || normalized.includes("малинов")) {
      return BLOCK_COLOR_TO_RGB.pink || BLOCK_COLOR_TO_RGB.dark_pink || null;
    }
    if (normalized.includes("purple") || normalized.includes("violet") || normalized.includes("levender") || normalized.includes("lavender")) {
      return BLOCK_COLOR_TO_RGB.light_purple || BLOCK_COLOR_TO_RGB.dark_purple || null;
    }
    if (normalized.includes("blue")) {
      return BLOCK_COLOR_TO_RGB.dark_blue || BLOCK_COLOR_TO_RGB.blue || null;
    }
    if (normalized.includes("green")) {
      return BLOCK_COLOR_TO_RGB.light_green || BLOCK_COLOR_TO_RGB.green || null;
    }
    if (normalized.includes("beige") || normalized.includes("peach")) {
      return BLOCK_COLOR_TO_RGB.peach || null;
    }
    if (normalized.includes("gray") || normalized.includes("grey")) {
      return BLOCK_COLOR_TO_RGB.gray || null;
    }
    return null;
  }

  getNearestColorKeyFromSample(targetSample, colorKeys, sampleByColor) {
    if (!targetSample || !Array.isArray(colorKeys) || colorKeys.length === 0 || !sampleByColor) {
      return null;
    }
    const targetLab = rgbToLab(targetSample.r, targetSample.g, targetSample.b);
    let bestKey = null;
    let bestDistance = Infinity;
    for (const key of colorKeys) {
      const sample = sampleByColor[key];
      if (!sample) {
        continue;
      }
      const sampleLab = rgbToLab(sample.r, sample.g, sample.b);
      const dL = targetLab.l - sampleLab.l;
      const dA = targetLab.a - sampleLab.a;
      const dB = targetLab.b - sampleLab.b;
      const distanceSq = dL * dL + dA * dA + dB * dB;
      if (distanceSq < bestDistance) {
        bestDistance = distanceSq;
        bestKey = key;
      }
    }
    return bestKey;
  }

  getAvailableLoadedBlockTileColorKeys() {
    return Object.keys(this.blockTileImageByColor).filter((key) => {
      const image = this.blockTileImageByColor[key];
      return !!(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
    });
  }

  getAvailableLoadedChickenColorKeys() {
    return Object.keys(this.chickenSpriteImageByColor).filter((key) => {
      const image = this.chickenSpriteImageByColor[key];
      return !!(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
    });
  }

  pickSampledBlockColor(r, g, b, a) {
    if (a < 56) {
      return null;
    }
    const unpremul = unpremultiplyRgba(r, g, b, a);
    return this.getNearestDebugPaletteColor(unpremul.r, unpremul.g, unpremul.b);
  }

  buildDebugImageQuantizedPixelMap(data, sourceWidth, sourceHeight) {
    const total = sourceWidth * sourceHeight;
    const quantized = new Array(total);
    const bucketCache = new Map();
    for (let index = 0, pixelIndex = 0; pixelIndex < total; pixelIndex += 1, index += 4) {
      const alpha = data[index + 3];
      if (alpha < 20) {
        quantized[pixelIndex] = null;
        continue;
      }
      const unpremul = unpremultiplyRgba(data[index], data[index + 1], data[index + 2], alpha);
      const bucketKey = `${Math.floor(unpremul.r / 16)}-${Math.floor(unpremul.g / 16)}-${Math.floor(unpremul.b / 16)}`;
      let mappedColor = bucketCache.get(bucketKey);
      if (!mappedColor) {
        mappedColor = this.pickSampledBlockColor(unpremul.r, unpremul.g, unpremul.b, alpha);
        if (mappedColor) {
          bucketCache.set(bucketKey, mappedColor);
        }
      }
      quantized[pixelIndex] = mappedColor || null;
    }
    this.debugImageBucketColorCache = bucketCache;
    return quantized;
  }

  sampleDebugImageCellColor(quantizedPixels, sourceWidth, sx0, sy0, sx1, sy1) {
    const cellWidth = Math.max(1, sx1 - sx0);
    const cellHeight = Math.max(1, sy1 - sy0);
    const area = cellWidth * cellHeight;
    const colorWeights = new Map();
    let opaqueWeight = 0;

    for (let sy = sy0; sy < sy1; sy++) {
      let pixelIndex = sy * sourceWidth + sx0;
      for (let sx = sx0; sx < sx1; sx++, pixelIndex += 1) {
        const mappedColor = quantizedPixels[pixelIndex];
        if (!mappedColor) {
          continue;
        }
        colorWeights.set(mappedColor, (colorWeights.get(mappedColor) || 0) + 1);
        opaqueWeight += 1;
      }
    }

    if (opaqueWeight <= Math.max(1, area * 0.06)) {
      return { color: null, purity: 0, weight: 0 };
    }

    let dominantColor = null;
    let dominantWeight = -1;
    for (const [color, weight] of colorWeights.entries()) {
      if (weight > dominantWeight) {
        dominantWeight = weight;
        dominantColor = color;
      }
    }

    return {
      color: dominantColor,
      purity: dominantWeight / Math.max(1, opaqueWeight),
      weight: opaqueWeight,
    };
  }

  sampleDebugImageMatrixForPhase(quantizedPixels, sourceWidth, sourceHeight, cols, rows, phaseX = 0, phaseY = 0) {
    const stepX = sourceWidth / Math.max(1, cols);
    const stepY = sourceHeight / Math.max(1, rows);
    const colorMatrix = [];
    const colorCounts = {};
    let filledCells = 0;
    let totalPurity = 0;
    let scoredCells = 0;

    for (let row = 0; row < rows; row++) {
      const nextRow = [];
      let sy0 = Math.floor(row * stepY + phaseY * stepY);
      let sy1 = Math.floor((row + 1) * stepY + phaseY * stepY);
      sy0 = clamp(sy0, 0, Math.max(0, sourceHeight - 1));
      sy1 = clamp(Math.max(sy0 + 1, sy1), sy0 + 1, sourceHeight);

      for (let col = 0; col < cols; col++) {
        let sx0 = Math.floor(col * stepX + phaseX * stepX);
        let sx1 = Math.floor((col + 1) * stepX + phaseX * stepX);
        sx0 = clamp(sx0, 0, Math.max(0, sourceWidth - 1));
        sx1 = clamp(Math.max(sx0 + 1, sx1), sx0 + 1, sourceWidth);

        const sampled = this.sampleDebugImageCellColor(quantizedPixels, sourceWidth, sx0, sy0, sx1, sy1);
        const color = sampled.color;
        if (color !== null) {
          colorCounts[color] = (colorCounts[color] || 0) + 1;
          filledCells += 1;
          totalPurity += sampled.purity;
          scoredCells += 1;
        }
        nextRow.push(color);
      }
      colorMatrix.push(nextRow);
    }

    return {
      colorMatrix,
      colorCounts,
      filledCells,
      score: scoredCells > 0 ? totalPurity / scoredCells : 0,
    };
  }

  resolveBlockTileColorKey(color) {
    const normalized = String(color || "").trim().toLowerCase();
    const requestedColor = normalizeBlockColorName(normalized);
    if (!requestedColor) {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(BLOCK_TILE_SOURCE_BY_COLOR, requestedColor)) {
      return requestedColor;
    }
    const alias = BLOCK_TILE_COLOR_ALIASES[requestedColor];
    if (alias && Object.prototype.hasOwnProperty.call(BLOCK_TILE_SOURCE_BY_COLOR, alias)) {
      return alias;
    }
    const loadedKeys = this.getAvailableLoadedBlockTileColorKeys();
    const nearest = this.getNearestColorKeyFromSample(
      this.getColorSampleForColorKey(requestedColor),
      loadedKeys,
      this.blockTileColorSampleByColor
    );
    if (nearest) {
      return nearest;
    }
    if (loadedKeys.length > 0) {
      return loadedKeys[0];
    }
    return null;
  }

  resolveChickenSpriteColorKey(color) {
    const normalized = String(color || "").trim().toLowerCase();
    const requestedColor = normalizeBlockColorName(normalized);
    const loadedKeys = this.getAvailableLoadedChickenColorKeys();
    if (loadedKeys.length === 0) {
      return null;
    }
    if (!requestedColor) {
      return loadedKeys[0];
    }
    const alias = BLOCK_TILE_COLOR_ALIASES[requestedColor];
    const directCandidates = [requestedColor, alias].filter(Boolean);
    for (const key of directCandidates) {
      if (loadedKeys.includes(key)) {
        return key;
      }
    }
    const nearest = this.getNearestColorKeyFromSample(
      this.getColorSampleForColorKey(requestedColor),
      loadedKeys,
      this.chickenSpriteColorSampleByColor
    );
    if (nearest) {
      return nearest;
    }
    return loadedKeys[0];
  }

  getLoadedBlockTileImage(color) {
    const key = this.resolveBlockTileColorKey(color);
    if (!key) {
      return null;
    }
    const image = this.blockTileImageByColor[key];
    if (!image || !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
      return null;
    }
    return image;
  }

  getBlockSpritePalette(color) {
    if (Object.prototype.hasOwnProperty.call(BLOCK_COLOR_CONFIG, color)) {
      return getBlockColorConfig(color).sprite;
    }
    const sample = this.getColorSampleForColorKey(color) || BLOCK_COLOR_TO_RGB.green || { r: 129, g: 195, b: 65 };
    const toRgb = (mul) => ({
      r: clamp(Math.round(sample.r * mul), 0, 255),
      g: clamp(Math.round(sample.g * mul), 0, 255),
      b: clamp(Math.round(sample.b * mul), 0, 255),
    });
    const base = toRgb(1.06);
    const mid = toRgb(0.95);
    const dark = toRgb(0.74);
    return {
      base: `rgb(${base.r}, ${base.g}, ${base.b})`,
      mid: `rgb(${mid.r}, ${mid.g}, ${mid.b})`,
      dark: `rgb(${dark.r}, ${dark.g}, ${dark.b})`,
    };
  }

  getBlockFaceColor(color) {
    if (Object.prototype.hasOwnProperty.call(BLOCK_COLOR_CONFIG, color)) {
      return getBlockColorConfig(color).face;
    }
    const sample = this.getColorSampleForColorKey(color) || BLOCK_COLOR_TO_RGB.green || { r: 129, g: 195, b: 65 };
    return `rgb(${sample.r}, ${sample.g}, ${sample.b})`;
  }

  createBlockSprite(color) {
    const size = Math.max(8, Math.round(LAYOUT.cellSize || 30));
    const tile = document.createElement("canvas");
    tile.width = size;
    tile.height = size;
    const tileCtx = tile.getContext("2d", { alpha: true });
    if (!tileCtx) {
      return null;
    }
    const sourceImage = this.getLoadedBlockTileImage(color);
    if (sourceImage) {
      tileCtx.clearRect(0, 0, size, size);
      tileCtx.imageSmoothingEnabled = true;
      tileCtx.imageSmoothingQuality = "high";
      tileCtx.drawImage(sourceImage, 0, 0, size, size);
      return tile;
    }
    const palette = this.getBlockSpritePalette(color);
    const template = this.blockTemplateImage;
    if (template && template.complete && template.naturalWidth > 0 && template.naturalHeight > 0) {
      const baseRgb = hexToRgb(palette.base);
      const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
      tileCtx.clearRect(0, 0, size, size);
      tileCtx.drawImage(template, 0, 0, size, size);
      const imageData = tileCtx.getImageData(0, 0, size, size);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha === 0) {
          continue;
        }
        const sourceR = data[i];
        const sourceG = data[i + 1];
        const sourceB = data[i + 2];
        const sourceHsl = rgbToHsl(sourceR, sourceG, sourceB);
        const sourceLuma = (sourceR * 0.2126 + sourceG * 0.7152 + sourceB * 0.0722) / 255;
        const satMix = clamp(baseHsl.s * 1.25, 0, 1);
        const mappedSaturation = clamp(
          lerp(sourceHsl.s * 0.14, sourceHsl.s * 1.04, satMix),
          0,
          1
        );
        const mappedLightness = clamp(
          sourceHsl.l + (baseHsl.l - 0.5) * 0.2,
          0.04,
          0.96
        );
        const recolored = hslToRgb(baseHsl.h, mappedSaturation, mappedLightness);
        const gloss = clamp((sourceLuma - 0.76) / 0.24, 0, 1);
        const shadow = clamp((0.28 - sourceLuma) / 0.28, 0, 1);

        data[i] = Math.round(clamp(lerp(recolored.r, 255, gloss * 0.28) * (1 - shadow * 0.08), 0, 255));
        data[i + 1] = Math.round(clamp(lerp(recolored.g, 255, gloss * 0.28) * (1 - shadow * 0.08), 0, 255));
        data[i + 2] = Math.round(clamp(lerp(recolored.b, 255, gloss * 0.28) * (1 - shadow * 0.08), 0, 255));
      }
      tileCtx.putImageData(imageData, 0, 0);
      return tile;
    }

    const fallbackGrad = tileCtx.createLinearGradient(0, 0, size, size);
    fallbackGrad.addColorStop(0, palette.base);
    fallbackGrad.addColorStop(0.56, palette.mid);
    fallbackGrad.addColorStop(1, palette.dark);
    tileCtx.fillStyle = fallbackGrad;
    roundedRect(tileCtx, 0, 0, size, size, Math.max(4, Math.round(size * 0.18)));
    tileCtx.fill();

    tileCtx.fillStyle = "rgba(255, 255, 255, 0.18)";
    roundedRect(tileCtx, 1.5, 1.5, size - 3, size * 0.36, Math.max(3, Math.round(size * 0.16)));
    tileCtx.fill();

    tileCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    tileCtx.lineWidth = 1;
    roundedRect(tileCtx, 0.5, 0.5, size - 1, size - 1, Math.max(3, Math.round(size * 0.18)) - 0.5);
    tileCtx.stroke();
    return tile;
  }

  getChickenSpritePalette(color) {
    const config = BLOCK_COLOR_CONFIG[color];
    if (config?.sprite) {
      return config.sprite;
    }
    const sample = this.getColorSampleForColorKey(color) || BLOCK_COLOR_TO_RGB.green || { r: 129, g: 195, b: 65 };
    const toRgb = (mul) => ({
      r: clamp(Math.round(sample.r * mul), 0, 255),
      g: clamp(Math.round(sample.g * mul), 0, 255),
      b: clamp(Math.round(sample.b * mul), 0, 255),
    });
    const base = toRgb(1.06);
    const mid = toRgb(0.95);
    const dark = toRgb(0.74);
    return {
      base: `rgb(${base.r}, ${base.g}, ${base.b})`,
      mid: `rgb(${mid.r}, ${mid.g}, ${mid.b})`,
      dark: `rgb(${dark.r}, ${dark.g}, ${dark.b})`,
    };
  }

  createChickenSprite(color) {
    const palette = this.getChickenSpritePalette(color);
    const width = 220;
    const height = 220;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return null;
    }
    ctx.imageSmoothingEnabled = true;

    const bodyX = 42;
    const bodyY = 54;
    const bodyW = 136;
    const bodyH = 118;
    const wingW = 46;
    const wingH = 36;
    const wingY = bodyY + 26;
    const legW = 20;
    const legH = 26;
    const legY = bodyY + bodyH - 3;

    // Soft drop shadow under character.
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(width * 0.5, bodyY + bodyH + 28, 10, width * 0.5, bodyY + bodyH + 28, 62);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.22)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(width * 0.5, bodyY + bodyH + 28, 62, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Crest (behind body top edge).
    const crestW = 20;
    const crestH = 24;
    const crestX = bodyX + bodyW * 0.5 - crestW * 0.5;
    const crestY = bodyY - 20;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.22)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 3;
    const crestGrad = ctx.createLinearGradient(0, crestY, 0, crestY + crestH);
    crestGrad.addColorStop(0, "#ff5e5e");
    crestGrad.addColorStop(0.55, "#ff3f3f");
    crestGrad.addColorStop(1, "#d82222");
    ctx.fillStyle = crestGrad;
    roundedRect(ctx, crestX, crestY, crestW, crestH, 6);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1.4;
    roundedRect(ctx, crestX + 0.7, crestY + 0.7, crestW - 1.4, crestH - 1.4, 4.8);
    ctx.stroke();

    // Wings behind body.
    const wingGrad = ctx.createLinearGradient(0, wingY, 0, wingY + wingH);
    wingGrad.addColorStop(0, palette.base);
    wingGrad.addColorStop(0.5, palette.mid);
    wingGrad.addColorStop(1, palette.dark);
    const drawWing = (x) => {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.16)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = wingGrad;
      roundedRect(ctx, x, wingY, wingW, wingH, 9);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      roundedRect(ctx, x + 2, wingY + 2, wingW - 4, 10, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 1;
      roundedRect(ctx, x + 0.6, wingY + 0.6, wingW - 1.2, wingH - 1.2, 8.4);
      ctx.stroke();
    };
    drawWing(bodyX - wingW + 9);
    drawWing(bodyX + bodyW - 9);

    // Single front beak (front direction marker).
    const beakW = 18;
    const beakH = 16;
    const beakX = bodyX + bodyW - 2;
    const beakY = bodyY + bodyH * 0.5 - beakH * 0.5;
    const beakGrad = ctx.createLinearGradient(beakX, beakY, beakX + beakW, beakY + beakH);
    beakGrad.addColorStop(0, "#ffb249");
    beakGrad.addColorStop(0.6, "#ff8b21");
    beakGrad.addColorStop(1, "#f66a12");
    ctx.fillStyle = beakGrad;
    roundedRect(ctx, beakX, beakY, beakW, beakH, 5);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.26)";
    roundedRect(ctx, beakX + 1.5, beakY + 1.5, beakW - 3, 5, 3);
    ctx.fill();

    // Legs.
    const legGrad = ctx.createLinearGradient(0, legY, 0, legY + legH);
    legGrad.addColorStop(0, "#ff8f26");
    legGrad.addColorStop(0.55, "#ff671a");
    legGrad.addColorStop(1, "#f44b11");
    const drawLeg = (x) => {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = legGrad;
      roundedRect(ctx, x, legY, legW, legH, 5);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      roundedRect(ctx, x + 1.4, legY + 1.4, legW - 2.8, 6, 3);
      ctx.fill();
    };
    drawLeg(bodyX + 30);
    drawLeg(bodyX + bodyW - 30 - legW);

    // Main body (plastic volume).
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    const bodyGrad = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyH);
    bodyGrad.addColorStop(0, palette.base);
    bodyGrad.addColorStop(0.32, palette.mid);
    bodyGrad.addColorStop(0.76, palette.mid);
    bodyGrad.addColorStop(1, palette.dark);
    ctx.fillStyle = bodyGrad;
    roundedRect(ctx, bodyX, bodyY, bodyW, bodyH, 14);
    ctx.fill();
    ctx.restore();

    // Top glossy strip.
    const topGloss = ctx.createLinearGradient(0, bodyY + 2, 0, bodyY + 24);
    topGloss.addColorStop(0, "rgba(255,255,255,0.44)");
    topGloss.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = topGloss;
    roundedRect(ctx, bodyX + 4, bodyY + 3, bodyW - 8, 18, 8);
    ctx.fill();

    // Side inner highlights + bottom shade for bevel feel.
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    roundedRect(ctx, bodyX + 4, bodyY + 10, 8, bodyH - 24, 5);
    ctx.fill();
    roundedRect(ctx, bodyX + bodyW - 12, bodyY + 10, 8, bodyH - 24, 5);
    ctx.fill();
    const bottomShade = ctx.createLinearGradient(0, bodyY + bodyH - 26, 0, bodyY + bodyH);
    bottomShade.addColorStop(0, "rgba(0,0,0,0)");
    bottomShade.addColorStop(1, "rgba(0,0,0,0.2)");
    ctx.fillStyle = bottomShade;
    roundedRect(ctx, bodyX + 2, bodyY + bodyH - 24, bodyW - 4, 22, 7);
    ctx.fill();

    // Frame stroke like original.
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.52)";
    roundedRect(ctx, bodyX + 0.9, bodyY + 0.9, bodyW - 1.8, bodyH - 1.8, 13.1);
    ctx.stroke();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
    roundedRect(ctx, bodyX + 2, bodyY + 2, bodyW - 4, bodyH - 4, 11.8);
    ctx.stroke();

    return canvas;
  }

  createBackdropPattern(fillColor, palette, shadeDark) {
    const tile = document.createElement("canvas");
    const patch = 64;
    const sub = 16;
    tile.width = patch;
    tile.height = patch;
    const tileCtx = tile.getContext("2d", { alpha: false });
    if (!tileCtx) {
      return null;
    }
    tileCtx.imageSmoothingEnabled = false;
    tileCtx.fillStyle = fillColor;
    tileCtx.fillRect(0, 0, patch, patch);
    const seed = palette.length * 13 + fillColor.length;
    for (let sy = 0; sy < patch; sy += sub) {
      for (let sx = 0; sx < patch; sx += sub) {
        const tone = Math.abs(seed + sx / sub + (sy / sub) * 3) % palette.length;
        tileCtx.fillStyle = palette[tone];
        tileCtx.fillRect(sx, sy, sub, sub);
      }
    }
    tileCtx.fillStyle = "rgba(255,255,255,0.12)";
    tileCtx.fillRect(0, 0, patch, 4);
    tileCtx.fillRect(0, 0, 4, patch);
    tileCtx.fillStyle = shadeDark;
    tileCtx.fillRect(0, patch - 4, patch, 4);
    tileCtx.fillRect(patch - 4, 0, 4, patch);
    return tile;
  }

  createWoodPatternTile() {
    const image = this.woodImage;
    if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) {
      return null;
    }
    const tile = document.createElement("canvas");
    const tileW = 192;
    const tileH = 192;
    tile.width = tileW;
    tile.height = tileH;
    const tileCtx = tile.getContext("2d", { alpha: true });
    if (!tileCtx) {
      return null;
    }
    const inset = 18;
    const srcW = Math.max(8, image.naturalWidth - inset * 2);
    const srcH = Math.max(8, image.naturalHeight - inset * 2);
    tileCtx.imageSmoothingEnabled = true;
    tileCtx.drawImage(image, inset, inset, srcW, srcH, 0, 0, tileW, tileH);
    return tile;
  }

  rebuildStaticSceneLayer() {
    if (!this.staticSceneCtx) {
      return;
    }
    if (this.staticSceneLayer.width !== this.width || this.staticSceneLayer.height !== this.height) {
      this.staticSceneLayer.width = this.width;
      this.staticSceneLayer.height = this.height;
      this.staticSceneCtx.imageSmoothingEnabled = false;
    }
    this.staticSceneCtx.clearRect(0, 0, this.width, this.height);
    this.drawBackground(this.staticSceneCtx);
    this.drawWagonLayer(this.staticSceneCtx);
    this.drawSlotState(this.staticSceneCtx);
  }

  rebuildBlockFieldLayer() {
    if (!this.blockFieldCtx) {
      return;
    }
    if (this.blockFieldLayer.width !== this.width || this.blockFieldLayer.height !== this.height) {
      this.blockFieldLayer.width = this.width;
      this.blockFieldLayer.height = this.height;
      this.blockFieldCtx.imageSmoothingEnabled = false;
    }
    this.blockFieldCtx.clearRect(0, 0, this.width, this.height);
    for (const block of this.blocks) {
      if (!block.alive) {
        continue;
      }
      this.drawVolumetricBlock(this.blockFieldCtx, block, block.x, block.y, {
        alpha: 0.96,
        shadowOpacity: 0.22,
        bevelStrength: 0.26,
        offsetY: 0,
      });
    }
    this.blockFieldLayerDirty = false;
  }

  markBlockFieldLayerDirty() {
    this.blockFieldLayerDirty = true;
  }

  ensureBlockFieldLayerFresh() {
    if (!this.blockFieldLayerDirty) {
      return;
    }
    this.rebuildBlockFieldLayer();
  }

  drawTiledBackdrop(ctx, rect, fillColor, palette, shadeDark) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();

    ctx.fillStyle = fillColor;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    const patternTile =
      fillColor === ((CURRENT_THEME.board || {}).dirtFill || "#b98c5e")
        ? this.sprites.dirtPattern
        : this.sprites.grassPattern;
    if (patternTile) {
      const pattern = ctx.createPattern(patternTile, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      }
    }

    ctx.restore();
  }

  drawFieldWoodUnderlay(ctx) {
    const fieldRect = {
      x: LAYOUT.fieldX - 8,
      y: LAYOUT.fieldY - 8,
      w: LAYOUT.fieldCols * LAYOUT.fieldStep + 16,
      h: LAYOUT.fieldRows * LAYOUT.fieldStep + 16,
      r: 26,
    };
    ctx.save();
    roundedRect(ctx, fieldRect.x, fieldRect.y, fieldRect.w, fieldRect.h, fieldRect.r);
    ctx.clip();

    const woodPatternTile = this.sprites.woodPattern;
    const woodPattern = woodPatternTile ? ctx.createPattern(woodPatternTile, "repeat") : null;
    if (woodPattern) {
      ctx.fillStyle = woodPattern;
      ctx.fillRect(fieldRect.x, fieldRect.y, fieldRect.w, fieldRect.h);
    } else {
      ctx.fillStyle = "#8f5127";
      ctx.fillRect(fieldRect.x, fieldRect.y, fieldRect.w, fieldRect.h);
    }

    const glaze = ctx.createLinearGradient(0, fieldRect.y, 0, fieldRect.y + fieldRect.h);
    glaze.addColorStop(0, "rgba(255, 255, 255, 0.06)");
    glaze.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    glaze.addColorStop(1, "rgba(0, 0, 0, 0.14)");
    ctx.fillStyle = glaze;
    ctx.fillRect(fieldRect.x, fieldRect.y, fieldRect.w, fieldRect.h);
    ctx.restore();

    ctx.save();
    roundedRect(ctx, fieldRect.x + 0.5, fieldRect.y + 0.5, fieldRect.w - 1, fieldRect.h - 1, fieldRect.r - 0.5);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(45, 22, 10, 0.45)";
    ctx.stroke();
    ctx.restore();
  }

  drawRailwayFrame(ctx, frameRect) {
    const image = this.railwayImage;
    if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) {
      return false;
    }

    const imageAspect = image.naturalWidth / image.naturalHeight;
    const targetAspect = frameRect.w / frameRect.h;
    let drawW = frameRect.w;
    let drawH = frameRect.h;
    if (targetAspect > imageAspect) {
      drawH = drawW / imageAspect;
    } else {
      drawW = drawH * imageAspect;
    }
    const drawX = frameRect.x + (frameRect.w - drawW) * 0.5;
    const drawY = frameRect.y + (frameRect.h - drawH) * 0.5;

    ctx.save();
    const prevSmoothing = ctx.imageSmoothingEnabled;
    const prevSmoothingQuality = ctx.imageSmoothingQuality;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.imageSmoothingQuality = prevSmoothingQuality;
    ctx.imageSmoothingEnabled = prevSmoothing;
    ctx.restore();
    return true;
  }

  getBottomQueueUnderlayRect() {
    const queueCards =
      this.cardManager && Array.isArray(this.cardManager.cardLayouts) && this.cardManager.cardLayouts.length > 0
        ? this.cardManager.cardLayouts
        : LAYOUT.cards;
    const elements = [...LAYOUT.slots, ...queueCards];
    if (!elements.length) {
      return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const item of elements) {
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + item.w);
      maxY = Math.max(maxY, item.y + item.h);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return null;
    }

    const vw = Math.max(1, window.innerWidth || this.canvas.clientWidth || LOGICAL_WIDTH);
    const vh = Math.max(1, window.innerHeight || this.canvas.clientHeight || LOGICAL_HEIGHT);
    const isPortrait = vh >= vw;
    // Keep tray geometry identical across orientations (match portrait/mobile behavior).
    const usePortraitTray = true;

    const padTop = usePortraitTray ? 26 : 20;
    const padBottom = usePortraitTray ? 28 : 30;
    const rawY = Math.floor(minY - padTop);
    const rawBottom = Math.ceil(maxY + padBottom);
    const y = usePortraitTray ? rawY : clamp(rawY, 0, this.height);
    const safeScale = Math.max(0.0001, this.viewportScale || 1);
    const visibleWorldBottom = (this.screenHeight - this.viewportOffsetY) / safeScale;
    const anchorOffset = usePortraitTray ? TRAY_BOTTOM_OFFSET : TRAY_BOTTOM_OFFSET_DESKTOP;
    const contentBottom = rawBottom + anchorOffset + (usePortraitTray ? 0 : 8);
    // Hard guarantee: tray must always extend below the visible viewport bottom, regardless of device aspect.
    const viewportBottomTarget = visibleWorldBottom + TRAY_OFFSCREEN_OVERSCAN;
    const bottom = Math.max(contentBottom + TRAY_OFFSCREEN_OVERSCAN, viewportBottomTarget);
    // Keep a small horizontal overscan in all viewports to avoid visible corner seams.
    const sideOverscan = 24;
    const x = -sideOverscan;
    const right = this.width + sideOverscan;
    const w = Math.max(0, right - x);
    const rawH = Math.max(1, bottom - y);
    const trayScaleY = usePortraitTray ? TRAY_SCALE_Y_MOBILE : TRAY_SCALE_Y_DESKTOP;
    const h = Math.max(1, Math.round(rawH * trayScaleY));
    const scaledY = bottom - h;
    if (w <= 0 || h <= 0) {
      return null;
    }

    return {
      x,
      y: scaledY,
      w,
      h,
      r: Math.min(usePortraitTray ? 58 : 30, Math.floor(Math.min(w, h) * (usePortraitTray ? 0.26 : 0.16))),
    };
  }

  drawGrassBackdrop(ctx, rect) {
    const boardTheme = CURRENT_THEME.board || {};
    this.drawTiledBackdrop(
      ctx,
      rect,
      boardTheme.fill || BOARD_FILL_COLOR,
      boardTheme.grassPalette || ["#6a9f35", "#72aa3a", "#7bb642", "#5f9430", "#89c84b"],
      boardTheme.grassShade || "rgba(28, 52, 14, 0.16)"
    );
  }

  drawDirtBackdrop(ctx, rect) {
    const boardTheme = CURRENT_THEME.board || {};
    this.drawTiledBackdrop(
      ctx,
      rect,
      boardTheme.dirtFill || "#b98c5e",
      boardTheme.dirtPalette || ["#b18052", "#ba8a5b", "#c89a67", "#a9784a", "#d1a874"],
      boardTheme.dirtShade || "rgba(64, 40, 22, 0.2)"
    );
  }

  getViewportWorldRect() {
    return {
      x: -this.viewportOffsetX / this.viewportScale,
      y: -this.viewportOffsetY / this.viewportScale,
      w: this.screenWidth / this.viewportScale,
      h: this.screenHeight / this.viewportScale,
    };
  }

  drawViewportBackdrop(ctx) {
    const worldRect = this.getViewportWorldRect();
    this.drawGeneratedBackdrop(ctx, worldRect);
  }

  createSeededRandom(seed) {
    let state = (seed >>> 0) || 0x6d2b79f5;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0x100000000;
    };
  }

  getGeneratedBackdropCanvas(targetW, targetH) {
    const width = Math.max(1, Math.ceil(targetW));
    const height = Math.max(1, Math.ceil(targetH));
    const image = this.backdropImage;
    if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) {
      return null;
    }

    const cached = this.generatedBackdropCache;
    if (cached && cached.width === width && cached.height === height) {
      return cached.canvas;
    }

    const layer = createBufferCanvas(width, height, false);
    const out = layer.canvas;
    const outCtx = layer.ctx;
    outCtx.imageSmoothingEnabled = true;

    const imgW = image.naturalWidth;
    const imgH = image.naturalHeight;
    const coverScale = Math.max(width / imgW, height / imgH);
    const drawW = imgW * coverScale;
    const drawH = imgH * coverScale;
    const drawX = (width - drawW) * 0.5;
    const drawY = (height - drawH) * 0.5;
    outCtx.drawImage(image, drawX, drawY, drawW, drawH);

    this.generatedBackdropCache = { width, height, canvas: out };
    return out;
  }

  drawGeneratedBackdrop(ctx, rect) {
    const generated = this.getGeneratedBackdropCanvas(rect.w, rect.h);
    if (generated) {
      ctx.drawImage(generated, rect.x, rect.y, rect.w, rect.h);
      return;
    }
    this.drawGrassBackdrop(ctx, rect);
  }

  updateViewportTransform() {
    const scaleX = this.screenWidth / this.width;
    const scaleY = this.screenHeight / this.height;
    const tuning = this.getViewportAdaptiveTuning();
    this.viewportScale = Math.max(0.0001, Math.min(scaleX, scaleY));
    this.viewportOffsetX = Math.round((this.screenWidth - this.width * this.viewportScale) * 0.5);
    const freeY = this.screenHeight - this.height * this.viewportScale;
    if (Number.isFinite(tuning.viewportTopPadding)) {
      this.viewportOffsetY = Math.round(clamp(tuning.viewportTopPadding, 0, Math.max(0, freeY)));
    } else {
      this.viewportOffsetY = Math.round(freeY * 0.5);
    }
  }

  restart() {
    this.blocks = this.createBlocksFromReference();
    this.blocksBySpiral = this.blocks
      .slice()
      .sort((a, b) => (a.spiralIndex - b.spiralIndex) || (a.spiralOrder - b.spiralOrder));
    this.blockByCell = new Map(this.blocks.map((block) => [`${block.col},${block.row}`, block]));
    this.invalidateTargetingCaches();
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.blockWaves = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.confetti = [];
    this.loseContinueSnapshot = [];
    this.cards = this.cardManager.resetFromBlocks(this.blocks);
    this.enforceLevelOneTutorialQueue();
    this.slotManager.reset();
    this.setupLevelOneTutorial();
    this.setWagonIdle();
    this.cameraZoom = 1;
    this.cameraZoomTarget = 1;
    this.cameraShakeTime = 0;
    this.cameraShakeDuration = 0;
    this.cameraShakeAmp = 0;
    this.cameraShakeX = 0;
    this.cameraShakeY = 0;
    this.successStreak = 0;
    this.streakTimer = 0;
    this.victoryConfettiTime = 0;
    this.victoryFloatTime = 0;
    this.victoryConfettiSpawnCarry = 0;
    this.victoryCompleteEventPending = false;
    this.levelStartFade = 1;
    this.losePopupAppear = 1;

    this.gameState = "playing";
    this.remainingBlocks = this.blocks.length;
    this.loseCloseRect = this.getLoseCloseRect();
    this.rebuildBlockFieldLayer();
    this.lastTimestamp = performance.now();
    this.invalidate(true);
  }

  createBlocksFromReference() {
    const blocks = [];
    let id = 0;

    for (let row = 0; row < LAYOUT.fieldRows; row++) {
      for (let col = 0; col < LAYOUT.fieldCols; col++) {
        const blockColor = this.getCellColor(col, row);
        if (!blockColor) {
          continue;
        }
        id += 1;
        const block = new Block(id, col, row, blockColor);
        const key = `${col},${row}`;
        if (this.spiralOrderByCell.has(key)) {
          block.spiralIndex = this.spiralOrderByCell.get(key);
        }
        if (this.spiralTraversalOrderByCell.has(key)) {
          block.spiralOrder = this.spiralTraversalOrderByCell.get(key);
        }
        blocks.push(block);
      }
    }

    return blocks;
  }

  buildSpiralOrderMap(cols, rows) {
    const orderByCell = new Map();
    const centerCol = Math.floor((cols - 1) / 2);
    const centerRow = Math.floor((rows - 1) / 2);
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const ringIndex = Math.max(Math.abs(col - centerCol), Math.abs(row - centerRow));
        orderByCell.set(`${col},${row}`, ringIndex);
      }
    }
    return orderByCell;
  }

  buildSpiralTraversalOrderMap(cols, rows) {
    const orderByCell = new Map();
    const total = cols * rows;
    let visited = 0;
    let x = Math.floor((cols - 1) / 2);
    let y = Math.floor((rows - 1) / 2);
    const dirs = [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1],
    ];

    const pushCell = (col, row) => {
      if (col < 0 || row < 0 || col >= cols || row >= rows) {
        return;
      }
      const key = `${col},${row}`;
      if (orderByCell.has(key)) {
        return;
      }
      orderByCell.set(key, visited);
      visited += 1;
    };

    pushCell(x, y);
    let stepLength = 1;
    let dirIndex = 0;
    while (visited < total) {
      for (let turn = 0; turn < 2; turn++) {
        const [dx, dy] = dirs[dirIndex % dirs.length];
        for (let step = 0; step < stepLength; step++) {
          x += dx;
          y += dy;
          pushCell(x, y);
          if (visited >= total) {
            break;
          }
        }
        dirIndex += 1;
        if (visited >= total) {
          break;
        }
      }
      stepLength += 1;
    }

    return orderByCell;
  }

  createCardsFromBlocks() {
    this.cards = this.cardManager.createFromBlocks(this.blocks);
    return this.cards;
  }

  setQueueCardCount(count) {
    const nextCount = clamp(Math.round(Number(count) || BOTTOM_QUEUE_CARD_COUNT), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
    BOTTOM_QUEUE_CARD_COUNT = nextCount;
    const changed = this.cardManager.setQueueCardCount(nextCount);
    if (changed) {
      this.restart();
    }
    return changed;
  }

  getViewportAdaptiveTuning() {
    const vw = Math.max(1, window.innerWidth || this.canvas.clientWidth || LOGICAL_WIDTH);
    const vh = Math.max(1, window.innerHeight || this.canvas.clientHeight || LOGICAL_HEIGHT);
    const isPortrait = vh >= vw;
    if (isPortrait) {
      const aspect = vh / vw;
      const tallness = clamp((aspect - 1.78) / 0.5, 0, 1);
      return {
        playfieldScaleMul: 1.03 - tallness * 0.02,
        topUiYOffsetAdd: -10,
        trackYOffsetAdd: 58 + tallness * 10,
        slotYOffsetAdd: 128 + tallness * 22,
        cardYOffsetAllAdd: 140 + tallness * 28,
        cardOffsetMul: 0.62,
        cardLaneSpacingMul: 0.84,
        backButtonScaleMul: 0.94,
        topLevelPanelScaleMul: 0.9,
        topCoinsPanelScaleMul: 0.92,
        viewportTopPadding: 14,
      };
    }

    return {
      playfieldScaleMul: 0.98,
      topUiYOffsetAdd: 0,
      trackYOffsetAdd: 8,
      slotYOffsetAdd: 14,
      cardYOffsetAllAdd: 10,
      cardOffsetMul: 0.86,
      cardLaneSpacingMul: 0.92,
      backButtonScaleMul: 1,
      topLevelPanelScaleMul: 1,
      topCoinsPanelScaleMul: 1,
      viewportTopPadding: null,
    };
  }

  isMobilePortraitViewport() {
    const vw = Math.max(1, window.innerWidth || this.canvas.clientWidth || LOGICAL_WIDTH);
    const vh = Math.max(1, window.innerHeight || this.canvas.clientHeight || LOGICAL_HEIGHT);
    return vh >= vw;
  }

  isMobileLikeViewport() {
    return this.isMobilePortraitViewport();
  }

  applyDebugLayout() {
    const layoutAnchor = STABLE_LAYOUT_ANCHOR;
    const tuning = this.getViewportAdaptiveTuning();
    const isMobilePortrait = this.isMobilePortraitViewport();
    const globalLayoutShiftY = Math.round(this.height * GLOBAL_LAYOUT_Y_SHIFT_RATIO);
    const topUiExtraUpShiftY = Math.round(this.height * TOP_UI_EXTRA_UP_SHIFT_RATIO);
    const baseTopUiYOffset = TOP_UI_Y_OFFSET_MOBILE;
    const effectiveTopUiYOffset = baseTopUiYOffset + tuning.topUiYOffsetAdd + globalLayoutShiftY - topUiExtraUpShiftY;
    const baseTrackYOffset = TRACK_Y_OFFSET_MOBILE;
    const effectiveTrackYOffset = baseTrackYOffset + tuning.trackYOffsetAdd + globalLayoutShiftY - TRACK_CENTERING_UP_OFFSET;
    const effectiveSlotYOffset = SLOT_Y_OFFSET + tuning.slotYOffsetAdd;
    const effectiveCardYOffsetAll = CARD_Y_OFFSET_ALL + tuning.cardYOffsetAllAdd;
    const effectiveCardOffsetMul = tuning.cardOffsetMul;
    const effectiveQueueSpacingX = isMobilePortrait ? QUEUE_SPACING_X_MOBILE : QUEUE_SPACING_X_DESKTOP;
    const effectiveCardLaneSpacingMul = tuning.cardLaneSpacingMul * effectiveQueueSpacingX;
    const effectiveSlotSpacingX = SLOT_SPACING_X_MOBILE;
    const effectiveBackButtonScale = BACK_BUTTON_SCALE * tuning.backButtonScaleMul;
    const effectiveTopLevelPanelScale = TOP_LEVEL_PANEL_SCALE * tuning.topLevelPanelScaleMul;
    const effectiveTopCoinsPanelScale = TOP_COINS_PANEL_SCALE * tuning.topCoinsPanelScaleMul;

    TIMER_PANEL_UI.w = Math.round(BASE_TOP_UI.timerW * effectiveTopLevelPanelScale);
    TIMER_PANEL_UI.h = Math.round(BASE_TOP_UI.timerH * effectiveTopLevelPanelScale);
    COINS_UI.panelW = Math.round(BASE_TOP_UI.coinsW * effectiveTopCoinsPanelScale);
    COINS_UI.panelH = Math.round(BASE_TOP_UI.coinsH * effectiveTopCoinsPanelScale);
    this.backButtonRect.w = Math.round(BASE_TOP_UI.backW * effectiveBackButtonScale);
    this.backButtonRect.h = Math.round(BASE_TOP_UI.backH * effectiveBackButtonScale);
    const viewportWorld = this.getViewportWorldRect();
    const horizontalBoundsX = 0;
    const horizontalBoundsW = this.width;
    const trackSideMargin = Math.max(16, Math.round(horizontalBoundsW * TRACK_SIDE_MARGIN_RATIO));
    const targetOuterTrackW = Math.max(120, Math.round(horizontalBoundsW - trackSideMargin * 2));
    const targetTrackW = Math.max(120, targetOuterTrackW - TRACK_FRAME_OUTSET * 2);
    const trackScale = Math.max(0.0001, targetTrackW / layoutAnchor.track.w);
    const trackAspect = layoutAnchor.track.h / layoutAnchor.track.w;
    const trackCenterX = horizontalBoundsX + horizontalBoundsW * 0.5;
    const baseTrackCenterY = layoutAnchor.track.y + layoutAnchor.track.h * 0.5 + effectiveTrackYOffset;
    LAYOUT.track.w = targetTrackW;
    LAYOUT.track.h = Math.max(120, Math.round(targetTrackW * trackAspect));
    LAYOUT.track.r = Math.max(10, Math.round(layoutAnchor.track.r * trackScale));
    LAYOUT.track.x = Math.round(trackCenterX - LAYOUT.track.w * 0.5);
    LAYOUT.track.y = Math.round(baseTrackCenterY - LAYOUT.track.h * 0.5);

    const minTopUiY = Math.round(viewportWorld.y + 12);
    const trackToTopUiGap = isMobilePortrait ? TRACK_TO_TOP_UI_GAP_PORTRAIT : TRACK_TO_TOP_UI_GAP_LANDSCAPE;
    const topUiBottom = Math.round(LAYOUT.track.y - trackToTopUiGap);
    TIMER_PANEL_UI.y = Math.max(minTopUiY, topUiBottom - TIMER_PANEL_UI.h);
    const sideButtonY = Math.max(minTopUiY, Math.round(TIMER_PANEL_UI.y + (TIMER_PANEL_UI.h - this.backButtonRect.h) * 0.5));
    this.backButtonRect.y = sideButtonY;
    BACK_BUTTON_UI.y = sideButtonY;
    COINS_UI.panelY = sideButtonY;
    const sideButtonGap = Math.max(10, Math.round(LAYOUT.track.w * 0.02));
    this.backButtonRect.x = Math.round(LAYOUT.track.x + sideButtonGap);
    COINS_UI.rightMargin = Math.round(this.width - (LAYOUT.track.x + LAYOUT.track.w) + sideButtonGap);
    this.restartButtonRect = this.getRestartButtonRect();

    const baseTrackCenterX = layoutAnchor.track.x + layoutAnchor.track.w * 0.5;
    const baseTrackCenterYForSpawn = layoutAnchor.track.y + layoutAnchor.track.h * 0.5 + effectiveTrackYOffset;
    const baseSpawnOffsetX = layoutAnchor.spawnPoint.x - baseTrackCenterX;
    const baseSpawnOffsetY = layoutAnchor.spawnPoint.y - (layoutAnchor.track.y + layoutAnchor.track.h * 0.5);
    LAYOUT.spawnPoint.x = Math.round(trackCenterX + baseSpawnOffsetX * trackScale);
    LAYOUT.spawnPoint.y = Math.round(baseTrackCenterYForSpawn + baseSpawnOffsetY * trackScale);
    this.conveyor.setTrackRect(LAYOUT.track, LAYOUT.spawnPoint);
    this.invalidateTargetingCaches(true);

    const runtimeDebugImageScale = this.getDebugImageScale();
    LAYOUT.fieldStep = Math.max(12, Math.round(BASE_LAYOUT.fieldStep * trackScale * runtimeDebugImageScale));
    LAYOUT.cellSize = Math.max(10, Math.round(BASE_LAYOUT.cellSize * trackScale * runtimeDebugImageScale));
    const fieldCenterX = LAYOUT.track.x + LAYOUT.track.w * 0.5;
    const runtimeDebugImageOffsetY = this.getDebugImageOffsetY();
    const fieldCenterY =
      LAYOUT.track.y + LAYOUT.track.h * 0.5 - LAYOUT.track.h * FIELD_CENTERING_UP_RATIO + runtimeDebugImageOffsetY;
    const fieldW = LAYOUT.fieldCols * LAYOUT.fieldStep;
    const fieldH = LAYOUT.fieldRows * LAYOUT.fieldStep;
    LAYOUT.fieldX = Math.round(fieldCenterX - fieldW * 0.5);
    LAYOUT.fieldY = Math.round(fieldCenterY - fieldH * 0.5);

    for (const block of this.blocks) {
      block.x = LAYOUT.fieldX + block.col * LAYOUT.fieldStep;
      block.y = LAYOUT.fieldY + block.row * LAYOUT.fieldStep;
      block.size = LAYOUT.cellSize;
    }

    for (let i = 0; i < LAYOUT.slots.length; i++) {
      const baseSlot = layoutAnchor.slots[i];
      const slot = LAYOUT.slots[i];
      if (!baseSlot || !slot) {
        continue;
      }
      const w = Math.max(90, Math.round(baseSlot.w * SLOT_SIZE_SCALE));
      const h = Math.max(72, Math.round(baseSlot.h * SLOT_SIZE_SCALE));
      const reducedW = Math.max(72, Math.round(w * (1 - SLOT_SIZE_REDUCTION_RATIO)));
      const reducedH = Math.max(58, Math.round(h * (1 - SLOT_SIZE_REDUCTION_RATIO)));
      const baseCenterX = baseSlot.x + baseSlot.w * 0.5;
      const centerX = fieldCenterX + (baseCenterX - fieldCenterX) * effectiveSlotSpacingX;
      const centerY = baseSlot.y + baseSlot.h * 0.5 + effectiveSlotYOffset;
      const keepTopAnchorShiftY = Math.round((h - reducedH) * 0.5);
      slot.w = reducedW;
      slot.h = reducedH;
      slot.x = Math.round(centerX - reducedW * 0.5);
      slot.y = Math.round(centerY - reducedH * 0.5 - keepTopAnchorShiftY);
    }

    const dynamicCardLayouts = layoutAnchor.cards.map((baseCard, index) => ({
      ...baseCard,
      x: Math.round(fieldCenterX + (baseCard.x + baseCard.w * 0.5 - fieldCenterX) * effectiveCardLaneSpacingMul - baseCard.w * 0.5),
      y: Math.round(baseCard.y + effectiveCardYOffsetAll + getCardYOffsetByIndex(index) * effectiveCardOffsetMul),
    }));

    if (isMobilePortrait) {
      // Match reference: top 4 tray slots are empty; queue birds start below in a 2-column stack.
      const mobileCardW = Math.round(clamp((LAYOUT.slots[0]?.w || 194) * 0.74, 132, 158));
      const mobileCardH = Math.round(mobileCardW * 1.26);
      const trayCenterX =
        LAYOUT.slots.length > 0
          ? LAYOUT.slots.reduce((sum, slot) => sum + slot.x + slot.w * 0.5, 0) / LAYOUT.slots.length
          : this.width * 0.5;
      const slotsBottom = LAYOUT.slots.length > 0 ? Math.max(...LAYOUT.slots.map((slot) => slot.y + slot.h)) : 1240;
      const slotCenters = [...LAYOUT.slots]
        .map((slot) => slot.x + slot.w * 0.5)
        .sort((a, b) => a - b);
      const colGap = Math.round(196 * effectiveQueueSpacingX);
      let colCenters =
        slotCenters.length >= 4
          ? [slotCenters[1], slotCenters[2]]
          : [trayCenterX - colGap * 0.5, trayCenterX + colGap * 0.5];
      const chickenScaleOverflow = Math.max(0, CHICKEN_SIZE_SCALE - 1);
      const extraColSpread = Math.round(mobileCardW * chickenScaleOverflow * 0.28);
      colCenters = [colCenters[0] - extraColSpread, colCenters[1] + extraColSpread];
      const firstRowY = Math.round(slotsBottom + Math.max(4, mobileCardH * 0.04));
      const baseRowGap = Math.round(mobileCardH * 0.68);
      const extraRowGap = Math.round(mobileCardH * chickenScaleOverflow * 0.72);
      const rowGap = baseRowGap + extraRowGap;
      for (let i = 0; i < dynamicCardLayouts.length; i += 1) {
        const card = dynamicCardLayouts[i];
        const col = i % 2;
        const row = Math.floor(i / 2);
        card.lane = col;
        card.row = row;
        card.w = mobileCardW;
        card.h = mobileCardH;
        card.x = Math.round(colCenters[col] - mobileCardW * 0.5);
        card.y = Math.round(firstRowY + row * rowGap);
      }

      if (Math.abs(MOBILE_BOTTOM_CLUSTER_Y_OFFSET) >= 1) {
        const mobileShiftY = Math.round(MOBILE_BOTTOM_CLUSTER_Y_OFFSET);
        for (const slot of LAYOUT.slots) {
          slot.y += mobileShiftY;
        }
        for (const card of dynamicCardLayouts) {
          card.y += mobileShiftY;
        }
      }
    }
    else {
      // Desktop: preserve top row position, but increase row spacing when chicken scale grows
      // so queue rows don't visually overlap.
      const chickenScaleOverflow = Math.max(0, CHICKEN_SIZE_SCALE - 1);
      if (chickenScaleOverflow > 0.001) {
        const topRowLayouts = dynamicCardLayouts.filter((card) => card.row === 0);
        const firstLane = topRowLayouts.length > 0 ? topRowLayouts[0].lane : 0;
        const laneLayouts = dynamicCardLayouts
          .filter((card) => card.lane === firstLane)
          .sort((a, b) => a.row - b.row);
        const sampleCard = dynamicCardLayouts[0];
        const sampleHeight = Math.max(1, Math.round(sampleCard?.h || 200));
        const baseRowGap = laneLayouts.length >= 2
          ? Math.max(1, Math.round(laneLayouts[1].y - laneLayouts[0].y))
          : Math.max(1, Math.round(sampleHeight * 1.01));
        const extraRowGap = Math.round(sampleHeight * chickenScaleOverflow * 0.9);
        const rowGap = baseRowGap + extraRowGap;
        const topRowY = topRowLayouts.length > 0
          ? Math.min(...topRowLayouts.map((card) => card.y))
          : Math.round(sampleCard?.y || 0);

        for (const card of dynamicCardLayouts) {
          card.y = Math.round(topRowY + card.row * rowGap);
        }
      }
    }

    const trackBottom = LAYOUT.track.y + LAYOUT.track.h;
    const trackToClusterGap = TRACK_TO_BOTTOM_CLUSTER_GAP_PORTRAIT;
    const targetTop = trackBottom + trackToClusterGap;
    const clusterBottom = Math.max(
      ...LAYOUT.slots.map((slot) => slot.y + slot.h),
      ...dynamicCardLayouts.map((card) => card.y + card.h)
    );
    const clusterTop = Math.min(
      ...LAYOUT.slots.map((slot) => slot.y),
      ...dynamicCardLayouts.map((card) => card.y)
    );
    const anchorShiftY = Math.round(targetTop - clusterTop);
    if (Math.abs(anchorShiftY) >= 1) {
      for (const slot of LAYOUT.slots) {
        slot.y += anchorShiftY;
      }
      for (const card of dynamicCardLayouts) {
        card.y += anchorShiftY;
      }
    }

    if (dynamicCardLayouts.length > 0 && QUEUE_CARDS_RAISE_RATIO > 0) {
      const raisePx = Math.round(Math.max(1, dynamicCardLayouts[0].h) * QUEUE_CARDS_RAISE_RATIO);
      for (const card of dynamicCardLayouts) {
        card.y -= raisePx;
      }
    }

    this.cardManager.setBaseLayouts(dynamicCardLayouts);
    this.cardManager.setQueueCardCount(this.cardManager.queueCardCount);
    this.cards = this.cardManager.normalizeQueues(this.cards);
    this.rebuildStaticSceneLayer();
    this.rebuildBlockFieldLayer();

    this.invalidate(false);
  }

  getValidLevelId(levelId) {
    const normalized = String(levelId || "");
    return this.availableLevels.some((level) => level.id === normalized) ? normalized : DEFAULT_LEVEL_ID;
  }

  getValidThemeId(themeId) {
    const normalized = String(themeId || "");
    return this.availableThemes.some((theme) => theme.id === normalized) ? normalized : DEFAULT_THEME_ID;
  }

  setImageSource(image, nextSrc) {
    if (!image || !nextSrc || image.src.endsWith(nextSrc)) {
      return false;
    }
    image.src = nextSrc;
    return true;
  }

  syncDebugBackgroundButtons() {
    const currentId = normalizeBackgroundId(this.currentBackgroundId);
    if (!this.debugBackgroundButtons || typeof this.debugBackgroundButtons !== "object") {
      return;
    }
    for (const backgroundId of BACKGROUND_VARIANT_IDS) {
      const button = this.debugBackgroundButtons[backgroundId];
      if (!button) {
        continue;
      }
      const isActive = backgroundId === currentId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  applyBackgroundConfig(backgroundId, options = {}) {
    const { save = true } = options;
    const nextBackgroundId = normalizeBackgroundId(backgroundId);
    this.currentBackgroundId = nextBackgroundId;

    const bgPath = getBackgroundAssetPath(nextBackgroundId, "background");
    const panelPath = getBackgroundAssetPath(nextBackgroundId, "panel");
    const cellPath = getBackgroundAssetPath(nextBackgroundId, "cell");
    const railwayPath = getBackgroundAssetPath(nextBackgroundId, "railway");

    this.setImageSource(this.backdropImage, bgPath);
    this.setImageSource(this.woodImage, panelPath);
    this.setImageSource(this.slotCellImage, cellPath);
    this.setImageSource(this.railwayImage, railwayPath);
    this.generatedBackdropCache = null;

    if (typeof document !== "undefined" && document.body) {
      document.body.style.backgroundImage = `url("${bgPath}")`;
      document.body.style.backgroundSize = "402px 874px";
    }

    this.syncDebugBackgroundButtons();
    this.rebuildStaticSceneLayer();
    this.invalidate(false);

    if (save) {
      this.saveDebugSettings();
    }
  }

  applyLevelConfig(levelId, options = {}) {
    const { restart = true, displayLevelNumber = null } = options;
    const nextLevelId = this.getValidLevelId(levelId);
    syncLevelGlobals(getLevelConfig(nextLevelId), { displayLevelNumber });
    this.currentLevelId = nextLevelId;
    this.syncDebugImageInputsForLevel(this.currentLevelId);
    this.spiralOrderByCell = this.buildSpiralOrderMap(LAYOUT.fieldCols, LAYOUT.fieldRows);
    this.spiralTraversalOrderByCell = this.buildSpiralTraversalOrderMap(LAYOUT.fieldCols, LAYOUT.fieldRows);
    this.conveyor.setTrackRect(LAYOUT.track, LAYOUT.spawnPoint);
    this.cardManager = new CardManager(LAYOUT.cards, BOTTOM_QUEUE_CARD_COUNT);
    this.slotManager = new SlotManager(LAYOUT.slots, SLOT_CLAIM_ORDER);
    this.cards = [];
    this.blocks = [];
    this.blocksBySpiral = [];
    this.blockByCell = new Map();
    this.invalidateTargetingCaches(true);
    this.setWagonIdle();
    this.applyDebugLayout();
    if (this.queueCardsInput) {
      this.queueCardsInput.value = String(BOTTOM_QUEUE_CARD_COUNT);
    }
    if (this.queueCardsValue) {
      const text = String(BOTTOM_QUEUE_CARD_COUNT);
      this.queueCardsValue.value = text;
      this.queueCardsValue.textContent = text;
    }
    this.syncDebugPaintColorOptions();
    if (restart) {
      this.restart();
    }
    this.invalidate(false);
  }

  applyThemeConfig(themeId, options = {}) {
    const { restart = true } = options;
    const nextThemeId = this.getValidThemeId(themeId);
    syncThemeGlobals(getThemeConfig(nextThemeId));
    this.currentThemeId = nextThemeId;

    this.setImageSource(this.backButtonImage, getThemeAsset("backButton", "ui/back_button.png"));
    this.setImageSource(this.timerPanelImage, getThemeAsset("timerPanel", "ui/timer_panel.png"));
    this.setImageSource(this.restartButtonImage, getThemeAsset("restartButton", "ui/restart_button.png"));
    this.setImageSource(this.losePopupImage, getThemeAsset("losePopup", "ui/lose_popup_space_ref.png"));
    this.buildReferenceAssets();
    if (restart) {
      this.restart();
    }
    this.invalidate(false);
  }

  applyContentConfig(levelId, themeId, options = {}) {
    const { restart = true } = options;
    this.applyThemeConfig(themeId, { restart: false });
    this.applyLevelConfig(levelId, { restart });
  }

  getDebugSettingsState() {
    return {
      shotBounceAmount: SHOT_BOUNCE_AMOUNT,
      shotBounceSpeed: SHOT_BOUNCE_SPEED,
      trackUnitSpeed: TRACK_UNIT_SPEED,
      queueCardCount: BOTTOM_QUEUE_CARD_COUNT,
      activeUnitsLimit: ACTIVE_UNITS_LIMIT,
      chickenSizeScale: CHICKEN_SIZE_SCALE,
      topPanelFontSize: TOP_PANEL_FONT_SIZE,
      topLevelPanelScale: TOP_LEVEL_PANEL_SCALE,
      topCoinsPanelScale: TOP_COINS_PANEL_SCALE,
      backButtonScale: BACK_BUTTON_SCALE,
      trackYOffset: TRACK_Y_OFFSET,
      trackYOffsetMobile: TRACK_Y_OFFSET_MOBILE,
      playfieldScale: PLAYFIELD_SCALE,
      slotSizeScale: SLOT_SIZE_SCALE,
      slotYOffset: SLOT_Y_OFFSET,
      slotSpacingXMobile: SLOT_SPACING_X_MOBILE,
      slotSpacingXDesktop: SLOT_SPACING_X_DESKTOP,
      trayBottomOffset: TRAY_BOTTOM_OFFSET,
      trayBottomOffsetDesktop: TRAY_BOTTOM_OFFSET_DESKTOP,
      trayScaleYMobile: TRAY_SCALE_Y_MOBILE,
      trayScaleYDesktop: TRAY_SCALE_Y_DESKTOP,
      queueSpacingXMobile: QUEUE_SPACING_X_MOBILE,
      queueSpacingXDesktop: QUEUE_SPACING_X_DESKTOP,
      topUiYOffset: TOP_UI_Y_OFFSET,
      topUiYOffsetMobile: TOP_UI_Y_OFFSET_MOBILE,
      mobileBottomClusterYOffset: MOBILE_BOTTOM_CLUSTER_Y_OFFSET,
      cardYOffsetAll: CARD_Y_OFFSET_ALL,
      cardYOffset1: CARD_Y_OFFSET_1,
      cardYOffset2: CARD_Y_OFFSET_2,
      cardYOffset3: CARD_Y_OFFSET_3,
      cardYOffset4: CARD_Y_OFFSET_4,
      topLevelNavVisible: this.topLevelNavVisible,
      debugImageSettingsByLevel: cloneData(this.debugImageSettingsByLevel || {}),
      levelId: this.getValidLevelId(this.currentLevelId),
      themeId: this.getValidThemeId(this.currentThemeId),
      backgroundId: normalizeBackgroundId(this.currentBackgroundId),
    };
  }

  applyDebugSettings(settings) {
    SHOT_BOUNCE_AMOUNT = clamp(Number(settings.shotBounceAmount ?? DEBUG_DEFAULTS.shotBounceAmount), 0.05, 0.7);
    SHOT_BOUNCE_SPEED = clamp(Number(settings.shotBounceSpeed ?? DEBUG_DEFAULTS.shotBounceSpeed), 0.4, 2.6);
    TRACK_UNIT_SPEED = clamp(Number(settings.trackUnitSpeed ?? DEBUG_DEFAULTS.trackUnitSpeed), 420, 1400);
    BOTTOM_QUEUE_CARD_COUNT = clamp(
      Math.round(Number(settings.queueCardCount ?? DEBUG_DEFAULTS.queueCardCount)),
      MIN_QUEUE_CARDS,
      MAX_QUEUE_CARDS
    );
    ACTIVE_UNITS_LIMIT = clamp(
      Math.round(Number(settings.activeUnitsLimit ?? DEBUG_DEFAULTS.activeUnitsLimit)),
      MIN_ACTIVE_UNITS_LIMIT,
      MAX_ACTIVE_UNITS_LIMIT
    );
    CHICKEN_SIZE_SCALE = clamp(Number(settings.chickenSizeScale ?? DEBUG_DEFAULTS.chickenSizeScale), 0.6, 1.8);
    TOP_PANEL_FONT_SIZE = clamp(Number(settings.topPanelFontSize ?? DEBUG_DEFAULTS.topPanelFontSize), 24, 80);
    TOP_LEVEL_PANEL_SCALE = clamp(Number(settings.topLevelPanelScale ?? DEBUG_DEFAULTS.topLevelPanelScale), 0.6, 1.8);
    TOP_COINS_PANEL_SCALE = clamp(Number(settings.topCoinsPanelScale ?? DEBUG_DEFAULTS.topCoinsPanelScale), 0.6, 1.8);
    BACK_BUTTON_SCALE = clamp(Number(settings.backButtonScale ?? DEBUG_DEFAULTS.backButtonScale), 0.6, 1.8);
    TRACK_Y_OFFSET = clamp(Number(settings.trackYOffset ?? DEBUG_DEFAULTS.trackYOffset), -220, 260);
    TRACK_Y_OFFSET_MOBILE = clamp(Number(settings.trackYOffsetMobile ?? DEBUG_DEFAULTS.trackYOffsetMobile), -220, 260);
    PLAYFIELD_SCALE = clamp(Number(settings.playfieldScale ?? DEBUG_DEFAULTS.playfieldScale), 0.7, 1.5);
    SLOT_SIZE_SCALE = clamp(Number(settings.slotSizeScale ?? DEBUG_DEFAULTS.slotSizeScale), 0.6, 1.7);
    SLOT_Y_OFFSET = clamp(Number(settings.slotYOffset ?? DEBUG_DEFAULTS.slotYOffset), -220, 260);
    SLOT_SPACING_X_MOBILE = clamp(Number(settings.slotSpacingXMobile ?? DEBUG_DEFAULTS.slotSpacingXMobile), 0.6, 1.8);
    SLOT_SPACING_X_DESKTOP = clamp(Number(settings.slotSpacingXDesktop ?? DEBUG_DEFAULTS.slotSpacingXDesktop), 0.6, 1.8);
    TRAY_BOTTOM_OFFSET = clamp(Number(settings.trayBottomOffset ?? DEBUG_DEFAULTS.trayBottomOffset), -320, 320);
    TRAY_BOTTOM_OFFSET_DESKTOP = clamp(
      Number(settings.trayBottomOffsetDesktop ?? DEBUG_DEFAULTS.trayBottomOffsetDesktop),
      -320,
      320
    );
    TRAY_SCALE_Y_MOBILE = clamp(Number(settings.trayScaleYMobile ?? DEBUG_DEFAULTS.trayScaleYMobile), 0.5, 1.8);
    TRAY_SCALE_Y_DESKTOP = clamp(Number(settings.trayScaleYDesktop ?? DEBUG_DEFAULTS.trayScaleYDesktop), 0.5, 1.8);
    QUEUE_SPACING_X_MOBILE = clamp(Number(settings.queueSpacingXMobile ?? DEBUG_DEFAULTS.queueSpacingXMobile), 0.6, 1.8);
    QUEUE_SPACING_X_DESKTOP = clamp(Number(settings.queueSpacingXDesktop ?? DEBUG_DEFAULTS.queueSpacingXDesktop), 0.6, 1.8);
    TOP_UI_Y_OFFSET = clamp(Number(settings.topUiYOffset ?? DEBUG_DEFAULTS.topUiYOffset), -60, 220);
    TOP_UI_Y_OFFSET_MOBILE = clamp(Number(settings.topUiYOffsetMobile ?? DEBUG_DEFAULTS.topUiYOffsetMobile), -60, 220);
    MOBILE_BOTTOM_CLUSTER_Y_OFFSET = clamp(
      Number(settings.mobileBottomClusterYOffset ?? DEBUG_DEFAULTS.mobileBottomClusterYOffset),
      -220,
      220
    );
    CARD_Y_OFFSET_ALL = clamp(Number(settings.cardYOffsetAll ?? DEBUG_DEFAULTS.cardYOffsetAll), -260, 260);
    CARD_Y_OFFSET_1 = clamp(Number(settings.cardYOffset1 ?? DEBUG_DEFAULTS.cardYOffset1), -260, 260);
    CARD_Y_OFFSET_2 = clamp(Number(settings.cardYOffset2 ?? DEBUG_DEFAULTS.cardYOffset2), -260, 260);
    CARD_Y_OFFSET_3 = clamp(Number(settings.cardYOffset3 ?? DEBUG_DEFAULTS.cardYOffset3), -260, 260);
    CARD_Y_OFFSET_4 = clamp(Number(settings.cardYOffset4 ?? DEBUG_DEFAULTS.cardYOffset4), -260, 260);
    this.topLevelNavVisible = settings.topLevelNavVisible !== false;
    this.setTopLevelDebugNavVisible(this.topLevelNavVisible);
    this.debugImageSettingsByLevel = {};
    if (settings.debugImageSettingsByLevel && typeof settings.debugImageSettingsByLevel === "object") {
      for (const [levelId, value] of Object.entries(settings.debugImageSettingsByLevel)) {
        if (!value || typeof value !== "object") {
          continue;
        }
        const key = String(levelId || "").trim();
        if (!key) {
          continue;
        }
        this.debugImageSettingsByLevel[key] = {
          imageScale: clampDebugImageScale(value.imageScale ?? 1),
          offsetY: clampDebugImageOffsetY(value.offsetY ?? DEBUG_IMAGE_OFFSET_Y_DEFAULT),
        };
      }
    }
    this.currentLevelId = this.getValidLevelId(settings.levelId ?? DEBUG_DEFAULTS.levelId);
    this.currentThemeId = this.getValidThemeId(settings.themeId ?? DEBUG_DEFAULTS.themeId);
    this.currentBackgroundId = normalizeBackgroundId(settings.backgroundId ?? DEBUG_DEFAULTS.backgroundId);
    this.applyBackgroundConfig(this.currentBackgroundId, { save: false });
  }

  loadDebugSettings() {
    let topLevelNavVisible = DEBUG_DEFAULTS.topLevelNavVisible !== false;
    try {
      if (window.location.hash.startsWith("#dbg=")) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      window.localStorage.removeItem(DEBUG_STORAGE_KEY);
      for (const key of DEBUG_STORAGE_KEYS_FALLBACK) {
        window.localStorage.removeItem(key);
      }
      const persistedTopNavVisible = window.localStorage.getItem(DEBUG_TOP_NAV_VISIBLE_STORAGE_KEY);
      if (persistedTopNavVisible === "0") {
        topLevelNavVisible = false;
      } else if (persistedTopNavVisible === "1") {
        topLevelNavVisible = true;
      }
    } catch {
      // Ignore storage/history errors in restricted contexts.
    }
    this.applyDebugSettings({
      ...DEBUG_DEFAULTS,
      topLevelNavVisible,
    });
    // Keep startup deterministic even if external tooling restores form state.
    PLAYFIELD_SCALE = clamp(Number(DEBUG_DEFAULTS.playfieldScale), 0.7, 1.5);
    this.applyContentConfig(this.currentLevelId, this.currentThemeId, { restart: false });
  }

  saveDebugSettings() {
    if (this.suppressDebugSave) {
      return;
    }
    try {
      window.localStorage.setItem(DEBUG_TOP_NAV_VISIBLE_STORAGE_KEY, this.topLevelNavVisible ? "1" : "0");
    } catch {
      // Ignore storage failures.
    }
  }

  clearDebugSettings() {
    try {
      window.localStorage.removeItem(DEBUG_TOP_NAV_VISIBLE_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  }

  async exportDebugSettingsJSON() {
    const state = this.getDebugSettingsState();
    const payload = {
      exportedAt: new Date().toISOString(),
      settings: state,
    };
    const json = `${JSON.stringify(payload, null, 2)}\n`;
    const stamp = payload.exportedAt.replace(/[:.]/g, "-");
    const fileName = `pixelflow-debug-settings-${stamp}.json`;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(json);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (this.debugExportButton) {
      const original = this.debugExportButton.textContent;
      this.debugExportButton.textContent = copied ? "скопировано" : "сохранено";
      setTimeout(() => {
        if (this.debugExportButton) {
          this.debugExportButton.textContent = original || "debug json";
        }
      }, 1200);
    }
  }

  getSuggestedExportLevelNumber() {
    if (isPositiveIntegerString(this.currentLevelId)) {
      return Number(this.currentLevelId);
    }
    const used = new Set(
      this.availableLevels
        .map((level) => String(level.id || ""))
        .filter((id) => isPositiveIntegerString(id))
        .map((id) => Number(id))
    );
    let candidate = 1;
    while (used.has(candidate)) {
      candidate += 1;
    }
    return candidate;
  }

  normalizeDebugLevelNumber(value, fallback = this.getSuggestedExportLevelNumber()) {
    const parsed = Number(String(value ?? "").trim());
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return clamp(Math.round(parsed), 1, 9999);
  }

  getDebugSaveLevelNumber(fallback = this.getSuggestedExportLevelNumber()) {
    const levelNumber = this.normalizeDebugLevelNumber(this.debugSaveLevelNumberInput?.value, fallback);
    if (this.debugSaveLevelNumberInput) {
      this.debugSaveLevelNumberInput.value = String(levelNumber);
    }
    return levelNumber;
  }

  getDebugSaveLevelName(levelNumber) {
    const raw = String(this.debugSaveLevelNameInput?.value || "").trim();
    const name = raw.length > 0 ? raw : `Level ${levelNumber}`;
    if (this.debugSaveLevelNameInput) {
      this.debugSaveLevelNameInput.value = name;
    }
    return name;
  }

  syncDebugSaveTargetInputs(preferredLevelId = this.currentLevelId, options = {}) {
    const { force = false } = options;
    if (this.debugSaveTargetDirty && !force) {
      return;
    }
    const isDebugGeneratedLevel = String(preferredLevelId || "") === DEBUG_IMAGE_LEVEL_ID;
    const effectiveId = isDebugGeneratedLevel ? this.debugGeneratedBaseLevelId : preferredLevelId;
    const numericId = isDebugGeneratedLevel
      ? this.getSuggestedExportLevelNumber()
      : (isPositiveIntegerString(effectiveId) ? Number(effectiveId) : this.getSuggestedExportLevelNumber());
    if (this.debugSaveLevelNumberInput) {
      this.debugSaveLevelNumberInput.value = String(numericId);
    }
    if (this.debugSaveLevelNameInput) {
      const currentName = String(this.debugSaveLevelNameInput.value || "").trim();
      const isGeneric = /^level\s+\d+$/i.test(currentName) || /^generated\b/i.test(currentName);
      if (!currentName || isGeneric) {
        this.debugSaveLevelNameInput.value = `Level ${numericId}`;
      }
    }
  }

  buildCurrentLevelExport(levelNumber, levelName) {
    const level = cloneData(CURRENT_LEVEL);
    level.id = String(levelNumber);
    level.name = String(levelName || `Level ${levelNumber}`);
    level.queueCardCount = clamp(
      Math.round(Number(this.cardManager?.queueCardCount ?? BOTTOM_QUEUE_CARD_COUNT)),
      MIN_QUEUE_CARDS,
      MAX_QUEUE_CARDS
    );
    if (level.pixelArt && typeof level.pixelArt === "object") {
      level.pixelArt.id = `level-${levelNumber}-art`;
    }
    return {
      exportedAt: new Date().toISOString(),
      levelNumber,
      level,
    };
  }

  async downloadLevelPayload(payload) {
    const json = `${JSON.stringify(payload, null, 2)}\n`;
    const fileName = `${payload.levelNumber}.json`;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(json);
        copied = true;
      } catch {
        copied = false;
      }
    }
    return { copied, json };
  }

  async pickDebugLevelsFolder() {
    if (typeof window.showDirectoryPicker !== "function") {
      this.setDebugImageStatus(
        "Запись в папку недоступна в этом режиме (обычно file://). Запусти через localhost или используй кнопку 'уровень json'.",
        "error"
      );
      return false;
    }
    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      this.debugLevelsDirHandle = handle;
      this.debugLevelsDirName = String(handle?.name || "");
      this.setDebugImageStatus(
        `Папка выбрана: ${this.debugLevelsDirName || "(без имени)"}. Следующие сохранения пишутся туда.`,
        "success"
      );
      return true;
    } catch {
      this.setDebugImageStatus("Выбор папки отменён.", "error");
      return false;
    }
  }

  async writeLevelPayloadToPickedFolder(payload) {
    if (!this.debugLevelsDirHandle) {
      return false;
    }
    const json = `${JSON.stringify(payload, null, 2)}\n`;
    try {
      const fileHandle = await this.debugLevelsDirHandle.getFileHandle(`${payload.levelNumber}.json`, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(json);
      await writable.close();
      const verifyHandle = await this.debugLevelsDirHandle.getFileHandle(`${payload.levelNumber}.json`, { create: false });
      const verifyFile = await verifyHandle.getFile();
      if (!verifyFile || verifyFile.size <= 0) {
        return false;
      }
      return true;
    } catch {
      this.debugLevelsDirHandle = null;
      this.debugLevelsDirName = "";
      return false;
    }
  }

  async doesLevelFileExistInPickedFolder(levelNumber) {
    if (!this.debugLevelsDirHandle) {
      return false;
    }
    try {
      await this.debugLevelsDirHandle.getFileHandle(`${levelNumber}.json`, { create: false });
      return true;
    } catch (error) {
      if (error && typeof error === "object" && String(error.name || "") === "NotFoundError") {
        return false;
      }
      throw error;
    }
  }

  async saveCurrentLevelPayload(payload, {
    triggerButton = null,
    requireFolderWrite = true,
    confirmOverwrite = false,
  } = {}) {
    let writtenToFolder = false;
    if (requireFolderWrite) {
      if (!this.debugLevelsDirHandle) {
        const picked = await this.pickDebugLevelsFolder();
        if (!picked) {
          this.setDebugImageStatus("Сохранение отменено: папка уровней не выбрана.", "error");
          return false;
        }
      }
      if (confirmOverwrite) {
        let fileExists = false;
        try {
          fileExists = await this.doesLevelFileExistInPickedFolder(payload.levelNumber);
        } catch {
          this.setDebugImageStatus("Не удалось проверить существование файла в папке уровней.", "error");
          return false;
        }
        if (fileExists) {
          const confirmed = typeof window.confirm === "function"
            ? window.confirm(
              `Файл ${payload.levelNumber}.json уже существует в папке '${this.debugLevelsDirName || "levels"}'. Перезаписать его?`
            )
            : true;
          if (!confirmed) {
            this.setDebugImageStatus("Сохранение отменено: существующий файл не перезаписан.", "info");
            return false;
          }
        }
      }
      writtenToFolder = await this.writeLevelPayloadToPickedFolder(payload);
      if (!writtenToFolder) {
        this.setDebugImageStatus("Не удалось записать файл в папку. Нажми 'папка уровней' и выбери её заново.", "error");
        return false;
      }
    }

    const persistedLocally = persistLevelOverride(payload.level);
    upsertLevelDefinition(payload.level);
    this.fillDebugContentSelectors();
    this.applyLevelConfig(String(payload.levelNumber), { restart: true });
    this.syncDebugContentSelectors();
    this.debugSaveTargetDirty = false;
    this.syncDebugSaveTargetInputs(String(payload.levelNumber), { force: true });

    let copied = false;
    if (!requireFolderWrite) {
      const result = await this.downloadLevelPayload(payload);
      copied = result.copied;
    }

    if (triggerButton) {
      const original = triggerButton.textContent;
      triggerButton.textContent = requireFolderWrite
        ? "сохранено в папку"
        : (copied ? "скачано+скопировано" : "скачано");
      setTimeout(() => {
        if (triggerButton) {
          triggerButton.textContent = original || "сохранить";
        }
      }, 1500);
    }

    this.setDebugImageStatus(
      requireFolderWrite
        ? `Уровень ${payload.levelNumber} сохранён в папку '${this.debugLevelsDirName || "levels"}', обновлён в списке${persistedLocally ? " и закреплён после перезагрузки." : "."}`
        : `Уровень ${payload.levelNumber} обновлён в списке${persistedLocally ? " и закреплён после перезагрузки." : "."} JSON скачан как ${payload.levelNumber}.json.`,
      "success"
    );
    return true;
  }

  async saveOverCurrentLevel() {
    const fallback = this.getSuggestedExportLevelNumber();
    const targetLevelId =
      String(this.currentLevelId || "") === DEBUG_IMAGE_LEVEL_ID
        ? this.debugGeneratedBaseLevelId
        : this.currentLevelId;
    const levelNumber = this.normalizeDebugLevelNumber(targetLevelId, fallback);
    if (!isPositiveIntegerString(targetLevelId)) {
      this.setDebugImageStatus(
        `Открыт служебный уровень (${this.currentLevelId}). Сохраняю в номер ${levelNumber}.`,
        "info"
      );
    }
    const levelName = String(CURRENT_LEVEL?.name || `Level ${levelNumber}`);
    const payload = this.buildCurrentLevelExport(levelNumber, levelName);
    await this.saveCurrentLevelPayload(payload, {
      triggerButton: this.debugSaveCurrentLevelButton,
      requireFolderWrite: true,
      confirmOverwrite: false,
    });
  }

  async saveToTargetLevel() {
    const levelNumber = this.getDebugSaveLevelNumber();
    const levelName = this.getDebugSaveLevelName(levelNumber);
    const payload = this.buildCurrentLevelExport(levelNumber, levelName);
    await this.saveCurrentLevelPayload(payload, {
      triggerButton: this.debugSaveTargetLevelButton || this.debugExportLevelButton,
      requireFolderWrite: true,
      confirmOverwrite: true,
    });
  }

  async exportCurrentLevelJSON() {
    const levelNumber = this.getDebugSaveLevelNumber();
    const levelName = this.getDebugSaveLevelName(levelNumber);
    const payload = this.buildCurrentLevelExport(levelNumber, levelName);
    const { copied } = await this.downloadLevelPayload(payload);
    if (this.debugExportLevelButton) {
      const original = this.debugExportLevelButton.textContent;
      this.debugExportLevelButton.textContent = copied ? "скачано+скопировано" : "скачано";
      setTimeout(() => {
        if (this.debugExportLevelButton) {
          this.debugExportLevelButton.textContent = original || "уровень json";
        }
      }, 1200);
    }
    this.setDebugImageStatus(`JSON экспортирован как ${payload.levelNumber}.json`, "success");
  }

  syncDebugInputsFromState() {
    const pairs = [
      [this.shotBounceSizeInput, SHOT_BOUNCE_AMOUNT],
      [this.shotBounceSpeedInput, SHOT_BOUNCE_SPEED],
      [this.railSpeedInput, TRACK_UNIT_SPEED],
      [this.queueCardsInput, BOTTOM_QUEUE_CARD_COUNT],
      [this.maxActiveUnitsInput, ACTIVE_UNITS_LIMIT],
      [this.chickenSizeScaleInput, CHICKEN_SIZE_SCALE],
      [this.topPanelFontSizeInput, TOP_PANEL_FONT_SIZE],
      [this.levelPanelScaleInput, TOP_LEVEL_PANEL_SCALE],
      [this.coinsPanelScaleInput, TOP_COINS_PANEL_SCALE],
      [this.backButtonScaleInput, BACK_BUTTON_SCALE],
      [this.trackYOffsetInput, TRACK_Y_OFFSET],
      [this.trackYOffsetMobileInput, TRACK_Y_OFFSET_MOBILE],
      [this.playfieldScaleInput, PLAYFIELD_SCALE],
      [this.slotSizeScaleInput, SLOT_SIZE_SCALE],
      [this.slotYOffsetInput, SLOT_Y_OFFSET],
      [this.slotSpacingXMobileInput, SLOT_SPACING_X_MOBILE],
      [this.slotSpacingXDesktopInput, SLOT_SPACING_X_DESKTOP],
      [this.trayBottomOffsetInput, TRAY_BOTTOM_OFFSET],
      [this.trayBottomOffsetDesktopInput, TRAY_BOTTOM_OFFSET_DESKTOP],
      [this.trayScaleYMobileInput, TRAY_SCALE_Y_MOBILE],
      [this.trayScaleYDesktopInput, TRAY_SCALE_Y_DESKTOP],
      [this.queueSpacingXMobileInput, QUEUE_SPACING_X_MOBILE],
      [this.queueSpacingXDesktopInput, QUEUE_SPACING_X_DESKTOP],
      [this.topUiYOffsetInput, TOP_UI_Y_OFFSET],
      [this.topUiYOffsetMobileInput, TOP_UI_Y_OFFSET_MOBILE],
      [this.mobileBottomClusterYOffsetInput, MOBILE_BOTTOM_CLUSTER_Y_OFFSET],
      [this.cardAllYOffsetInput, CARD_Y_OFFSET_ALL],
      [this.card1YOffsetInput, CARD_Y_OFFSET_1],
      [this.card2YOffsetInput, CARD_Y_OFFSET_2],
      [this.card3YOffsetInput, CARD_Y_OFFSET_3],
      [this.card4YOffsetInput, CARD_Y_OFFSET_4],
    ];
    for (const [input, value] of pairs) {
      if (!input) {
        continue;
      }
      input.value = String(value);
      input.dispatchEvent(new Event("input"));
    }
  }

  resetDebugSettings() {
    this.suppressDebugSave = true;
    this.applyDebugSettings(DEBUG_DEFAULTS);
    this.applyContentConfig(this.currentLevelId, this.currentThemeId, { restart: false });
    this.syncDebugInputsFromState();
    this.syncDebugContentSelectors();
    this.suppressDebugSave = false;
    this.clearDebugSettings();
    this.applyDebugLayout();
    this.invalidate(false);
  }

  normalizeShooterQueues(cards) {
    this.cards = this.cardManager.normalizeQueues(cards);
    this.ensurePlayableFrontQueueColor();
    return this.cards;
  }

  updateCardQueueAnimations(dt) {
    return this.cardManager.updateQueueAnimations(dt);
  }

  hasAnimatingCards() {
    return this.cardManager.hasAnimatingCards();
  }

  isFrontRowCard(card) {
    return this.cardManager.isFrontRowCard(card);
  }

  getFrontLaneIds() {
    return this.cardManager.getFrontLaneIds();
  }

  getActiveFrontCardInLane(lane) {
    return this.cardManager.getActiveFrontCardInLane(lane);
  }

  getCardPigCenter(card) {
    return this.cardManager.getCardPigCenter(card);
  }

  createTutorialState() {
    return {
      active: false,
      step: LEVEL_ONE_TUTORIAL_STEPS.done,
      handTime: 0,
      firstBlackUnitId: null,
      greenUnitId: null,
    };
  }

  isLevelOneTutorialEnabled() {
    return String(this.currentLevelId || "") === LEVEL_ONE_TUTORIAL_ID;
  }

  swapCardPayload(cardA, cardB) {
    if (!cardA || !cardB || cardA === cardB) {
      return;
    }
    const payloadA = {
      color: cardA.color,
      styleKey: cardA.styleKey,
      ammo: cardA.ammo,
    };
    cardA.color = cardB.color;
    cardA.styleKey = cardB.styleKey;
    cardA.ammo = cardB.ammo;
    cardA.used = cardA.ammo <= 0;
    cardB.color = payloadA.color;
    cardB.styleKey = payloadA.styleKey;
    cardB.ammo = payloadA.ammo;
    cardB.used = cardB.ammo <= 0;
  }

  enforceLevelOneTutorialQueue() {
    if (!this.isLevelOneTutorialEnabled()) {
      return;
    }
    const rightFront = this.getActiveFrontCardInLane(1);
    const leftFront = this.getActiveFrontCardInLane(0);
    if (rightFront && rightFront.color !== "black") {
      const donor = this.cards.find((card) => !card.used && card.color === "black" && card.index !== rightFront.index);
      if (donor) {
        this.swapCardPayload(rightFront, donor);
      }
    }
    if (leftFront && leftFront.color !== "green") {
      const donor = this.cards.find((card) => !card.used && card.color === "green" && card.index !== leftFront.index);
      if (donor) {
        this.swapCardPayload(leftFront, donor);
      }
    }
    this.cards = this.normalizeShooterQueues(this.cards);
  }

  ensurePlayableFrontQueueColor() {
    if (this.gameState !== "playing") {
      return false;
    }
    if (this.isLevelOneTutorialEnabled()) {
      return false;
    }
    const target = this.getNextSpiralTarget();
    if (!target?.color) {
      return false;
    }
    const targetColor = target.color;
    const frontCards = this.getFrontLaneIds()
      .map((lane) => this.getActiveFrontCardInLane(lane))
      .filter((card) => !!card && !card.used && card.ammo > 0);
    if (frontCards.length === 0) {
      return false;
    }
    if (frontCards.some((card) => card.color === targetColor)) {
      return false;
    }
    const donor = this.cards.find(
      (card) => !card.used && card.ammo > 0 && card.color === targetColor && !frontCards.includes(card)
    );
    if (!donor) {
      return false;
    }
    const receiver = frontCards.find((card) => card.color !== targetColor) || frontCards[0];
    if (!receiver || receiver === donor) {
      return false;
    }
    this.swapCardPayload(receiver, donor);
    this.cards = this.cardManager.normalizeQueues(this.cards);
    return true;
  }

  setupLevelOneTutorial() {
    this.tutorial = this.createTutorialState();
    if (!this.isLevelOneTutorialEnabled()) {
      return;
    }
    this.tutorial.active = true;
    this.tutorial.step = LEVEL_ONE_TUTORIAL_STEPS.tapBlackCard;
  }

  finishTutorial() {
    this.tutorial.active = false;
    this.tutorial.step = LEVEL_ONE_TUTORIAL_STEPS.done;
  }

  getTutorialTargetCard(color) {
    if (!this.tutorial?.active) {
      return null;
    }
    if (color === "black") {
      const rightFront = this.getActiveFrontCardInLane(1);
      if (rightFront && rightFront.color === "black") {
        return rightFront;
      }
    }
    if (color === "green") {
      const leftFront = this.getActiveFrontCardInLane(0);
      if (leftFront && leftFront.color === "green") {
        return leftFront;
      }
    }
    return this.cards.find((card) => this.isFrontRowCard(card) && card.color === color) || null;
  }

  getTutorialTargetBlackParkedUnit() {
    if (!this.tutorial?.active) {
      return null;
    }
    const firstUnitId = this.tutorial.firstBlackUnitId;
    if (Number.isFinite(firstUnitId)) {
      const unit = this.units.find(
        (item) => item.id === firstUnitId && item.alive && item.state === "parked" && item.color === "black" && item.ammo > 0
      );
      if (unit) {
        return unit;
      }
    }
    return this.units.find((unit) => unit.alive && unit.state === "parked" && unit.color === "black" && unit.ammo > 0) || null;
  }

  getTutorialTapTarget() {
    if (!this.tutorial?.active || this.gameState !== "playing") {
      return null;
    }
    const step = this.tutorial.step;
    if (step === LEVEL_ONE_TUTORIAL_STEPS.tapBlackCard) {
      const card = this.getTutorialTargetCard("black");
      return card ? { type: "card", card } : null;
    }
    if (step === LEVEL_ONE_TUTORIAL_STEPS.tapGreenCard) {
      const card = this.getTutorialTargetCard("green");
      return card ? { type: "card", card } : null;
    }
    if (step === LEVEL_ONE_TUTORIAL_STEPS.tapBlackParked) {
      const unit = this.getTutorialTargetBlackParkedUnit();
      return unit ? { type: "parkedUnit", unit } : null;
    }
    return null;
  }

  isPointOnTutorialTarget(target, x, y) {
    if (!target) {
      return false;
    }
    if (target.type === "card") {
      return this.cardManager.isPointOnCard(target.card, x, y, {
        visualLiftY: this.getQueueVisualLiftY(),
      });
    }
    if (target.type === "parkedUnit") {
      return Math.hypot(x - target.unit.position.x, y - target.unit.position.y) <= PARKED_UNIT_TAP_RADIUS;
    }
    return false;
  }

  onTutorialUnitParked(unit) {
    if (!this.tutorial?.active || !unit) {
      return;
    }
    if (this.tutorial.step === LEVEL_ONE_TUTORIAL_STEPS.waitBlackParked && unit.color === "black") {
      this.tutorial.firstBlackUnitId = unit.id;
      this.tutorial.step = LEVEL_ONE_TUTORIAL_STEPS.tapGreenCard;
      this.invalidate(true);
      return;
    }
    if (this.tutorial.step === LEVEL_ONE_TUTORIAL_STEPS.waitGreenParked && unit.color === "green") {
      this.tutorial.greenUnitId = unit.id;
      this.tutorial.step = LEVEL_ONE_TUTORIAL_STEPS.tapBlackParked;
      this.invalidate(true);
    }
  }

  updateTutorialState(dt) {
    if (!this.tutorial?.active) {
      return;
    }
    this.tutorial.handTime += dt;
    if (this.tutorial.step === LEVEL_ONE_TUTORIAL_STEPS.tapBlackParked && !this.getTutorialTargetBlackParkedUnit()) {
      this.finishTutorial();
      this.invalidate(true);
    }
  }

  drawTutorialHand(ctx) {
    if (!this.tutorial?.active) {
      return;
    }
    const target = this.getTutorialTapTarget();
    if (!target) {
      return;
    }
    const hand = this.tutorHandImage;
    if (!hand || !hand.complete || hand.naturalWidth <= 0 || hand.naturalHeight <= 0) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    if (target.type === "card") {
      const center = this.getCardPigCenter(target.card);
      targetX = center.x;
      targetY = center.y - this.getQueueVisualLiftY();
    } else if (target.type === "parkedUnit") {
      targetX = target.unit.position.x;
      targetY = target.unit.position.y;
    }

    const floatX = Math.sin(this.tutorial.handTime * 6.2) * 10;
    const pulse = 0.84 + 0.16 * Math.sin(this.tutorial.handTime * 7.5);
    const ringR = target.type === "card" ? 58 : 52;
    const handW = 157;
    const handH = handW * (hand.naturalHeight / hand.naturalWidth);
    const handX = targetX + 74 + floatX;
    const handY = targetY;

    ctx.save();
    ctx.globalAlpha = 0.6 + pulse * 0.35;
    ctx.strokeStyle = "rgba(255, 247, 210, 0.96)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(targetX, targetY, ringR * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    ctx.translate(handX, handY);
    ctx.rotate(-Math.PI * 0.5 + Math.PI / 6);
    ctx.drawImage(hand, -handW * 0.5, -handH * 0.5, handW, handH);
    ctx.restore();
  }

  getCellColor(col, row) {
    const matrix = CURRENT_LEVEL?.pixelArt?.colorMatrix;
    if (Array.isArray(matrix)) {
      const normalized = normalizeColorMatrixCell(matrix[row]?.[col]);
      if (normalized !== null) {
        return normalized;
      }
    }
    const fallbackRow = FALLBACK_FIELD_PATTERN[row] || "";
    const fallbackCell = fallbackRow[col] || ".";
    const parsedColor = getPatternCellColor(fallbackCell);
    if (parsedColor !== null) {
      return parsedColor;
    }
    return null;
  }

  spawnUnit(cardIndex) {
    if (this.gameState !== "playing") {
      return false;
    }

    const activeUnitCount = this.units.reduce((count, unit) => count + (unit.alive ? 1 : 0), 0);
    if (activeUnitCount >= ACTIVE_UNITS_LIMIT) {
      return false;
    }
    const card = this.cards[cardIndex];
    if (!card) {
      return false;
    }
    if (!this.isSpawnAreaClear()) {
      return false;
    }
    if (!this.isFrontRowCard(card)) {
      return false;
    }
    if (card.used) {
      return false;
    }
    if (card.ammo <= 0) {
      card.used = true;
      this.normalizeShooterQueues(this.cards);
      return false;
    }

    this.unitIdCounter += 1;
    const launchFrom = {
      x: card.x + card.w * 0.5,
      y: card.y + card.h * 0.56,
    };
    const unit = new Unit(
      this.unitIdCounter,
      card.color,
      card.ammo,
      launchFrom,
      this.conveyor,
      card.styleKey,
      card.label
    );
    this.units.push(unit);
    card.used = true;
    if (this.tutorial?.active) {
      if (this.tutorial.step === LEVEL_ONE_TUTORIAL_STEPS.tapBlackCard && card.color === "black") {
        this.tutorial.step = LEVEL_ONE_TUTORIAL_STEPS.waitBlackParked;
        this.tutorial.firstBlackUnitId = unit.id;
      } else if (this.tutorial.step === LEVEL_ONE_TUTORIAL_STEPS.tapGreenCard && card.color === "green") {
        this.tutorial.step = LEVEL_ONE_TUTORIAL_STEPS.waitGreenParked;
        this.tutorial.greenUnitId = unit.id;
      }
    }
    this.invalidate(true);
    return true;
  }

  isSpawnAreaClear() {
    const spawn = this.conveyor.pointAtDistance(this.conveyor.spawnDistance);
    for (const unit of this.units) {
      if (!unit.alive) {
        continue;
      }
      if (unit.state === "launching") {
        return false;
      }
      if (unit.state !== "moving") {
        continue;
      }
      if (Math.hypot(unit.position.x - spawn.x, unit.position.y - spawn.y) < SPAWN_CLEAR_RADIUS) {
        return false;
      }
    }
    return true;
  }

  relaunchParkedUnit(unit) {
    if (!unit || !unit.alive || unit.state !== "parked" || unit.ammo <= 0 || this.gameState !== "playing") {
      return false;
    }
    if (unit.slotIndex !== null) {
      this.freeSlot(unit.slotIndex, unit.id);
      unit.slotIndex = null;
    }
    unit.state = "launching";
    unit.launchFrom = { ...unit.position };
    unit.launchTo = this.conveyor.pointAtDistance(this.conveyor.spawnDistance);
    unit.launchControl = {
      x: (unit.launchFrom.x + unit.launchTo.x) * 0.5,
      y: Math.min(unit.launchFrom.y, unit.launchTo.y) - (30 + Math.random() * 20),
    };
    unit.launchProgress = 0;
    unit.landProgress = 0;
    unit.landTo = null;
    unit.landFrom = { ...unit.launchTo };
    unit.landControl = { ...unit.landFrom };
    unit.loopDistance = 0;
    unit.distanceOnTrack = this.conveyor.spawnDistance;
    unit.cooldown = 0;
    unit.parkBounce = 0;
    unit.renderRotation = null;
    unit.prevPosition = { ...unit.position };
    if (this.tutorial?.active && this.tutorial.step === LEVEL_ONE_TUTORIAL_STEPS.tapBlackParked && unit.color === "black") {
      this.finishTutorial();
    }
    this.invalidate(true);
    return true;
  }

  tryRelaunchParkedUnitAt(x, y) {
    const hitRadius = PARKED_UNIT_TAP_RADIUS;
    let bestUnit = null;
    let bestDistance = Infinity;
    let bestY = -Infinity;
    for (let i = this.units.length - 1; i >= 0; i--) {
      const unit = this.units[i];
      if (!unit.alive || unit.state !== "parked" || unit.ammo <= 0) {
        continue;
      }
      const d = Math.hypot(x - unit.position.x, y - unit.position.y);
      if (d > hitRadius) {
        continue;
      }
      if (d < bestDistance || (Math.abs(d - bestDistance) < 0.0001 && unit.position.y > bestY)) {
        bestDistance = d;
        bestY = unit.position.y;
        bestUnit = unit;
      }
    }
    if (bestUnit) {
      return this.relaunchParkedUnit(bestUnit);
    }
    return false;
  }

  claimFreeSlot(unitId) {
    return this.slotManager.claim(unitId);
  }

  freeSlot(slotIndex, unitId) {
    this.slotManager.free(slotIndex, unitId);
  }

  getSlotVisualLiftY() {
    const slot = LAYOUT.slots[0];
    if (!slot) {
      return 0;
    }
    if (this.isMobilePortraitViewport()) {
      return Math.round(slot.h * 0.712);
    }
    return Math.round(slot.h * 0.712);
  }

  getQueueVisualLiftY() {
    const slot = LAYOUT.slots[0];
    if (!slot) {
      return 0;
    }
    if (this.isMobilePortraitViewport()) {
      return Math.round(slot.h * 0.52);
    }
    return Math.round(slot.h * 0.44);
  }

  getSlotCenter(slotIndex) {
    const center = this.slotManager.getCenter(slotIndex);
    if (!center) {
      return null;
    }
    const slot = LAYOUT.slots[slotIndex];
    const forwardShift = slot ? Math.round(slot.h * SLOT_BIRD_FORWARD_SHIFT_RATIO) : 0;
    return {
      x: center.x,
      y: center.y - this.getSlotVisualLiftY() - forwardShift,
    };
  }

  handleUnitReturned(unit) {
    void unit;
  }

  spawnImpactRing(x, y, color, size = 1) {
    while (this.impactRings.length >= MAX_ACTIVE_IMPACT_RINGS) {
      this.impactRings.shift();
    }
    const colorConfig = getBlockColorConfig(color);
    this.impactRings.push({
      x,
      y,
      life: 0.24,
      maxLife: 0.24,
      startR: 8,
      endR: 30 + size * 18,
      color: colorConfig.ring,
      lineWidth: 3.2 - Math.min(1.6, size * 0.6),
    });
  }

  spawnSlotBurst(x, y, color) {
    while (this.slotBursts.length >= MAX_ACTIVE_SLOT_BURSTS) {
      this.slotBursts.shift();
    }
    const colorConfig = getBlockColorConfig(color);
    this.slotBursts.push({
      x,
      y,
      life: 0.32,
      maxLife: 0.32,
      r: 10,
      maxR: 56,
      color: colorConfig.slotBurst,
    });
  }

  spawnFloatText(x, y, text, color = "#ffffff", scale = 1) {
    while (this.floatTexts.length >= MAX_ACTIVE_FLOAT_TEXTS) {
      this.floatTexts.shift();
    }
    this.floatTexts.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 18,
      vy: -34,
      life: 0.58,
      maxLife: 0.58,
      text,
      color,
      scale,
    });
  }

  triggerParkedUnitFx(unit) {
    this.spawnSlotBurst(unit.position.x, unit.position.y, unit.color);
    this.spawnImpactRing(unit.position.x, unit.position.y, unit.color, 0.55);
    this.spawnParticles(unit.position.x, unit.position.y, unit.color, 11);
  }

  setWagonIdle() {
    this.wagon.distance = this.conveyor.spawnDistance;
    this.wagon.moving = false;
    this.wagon.color = null;
    const point = this.conveyor.pointAtDistance(this.wagon.distance);
    this.wagon.x = point.x;
    this.wagon.y = point.y;
  }

  startWagonRide(color, distance) {
    this.wagon.moving = true;
    this.wagon.color = color;
    this.setWagonRideDistance(distance, color);
  }

  setWagonRideDistance(distance, color) {
    this.wagon.distance = distance;
    this.wagon.moving = true;
    this.wagon.color = color;
    const point = this.conveyor.pointAtDistance(distance);
    this.wagon.x = point.x;
    this.wagon.y = point.y;
  }

  getWagonSeatPoint() {
    return {
      x: this.wagon.x + LAYOUT.wagonSprite.seatOffsetX,
      y: this.wagon.y + LAYOUT.wagonSprite.seatOffsetY,
    };
  }

  getFieldCenter() {
    return {
      x: LAYOUT.fieldX + (LAYOUT.fieldCols * LAYOUT.fieldStep) / 2,
      y: LAYOUT.fieldY + (LAYOUT.fieldRows * LAYOUT.fieldStep) / 2,
    };
  }

  getTrackSideFacingAngle(point) {
    const trackRect = this.conveyor?.trackRect;
    if (!trackRect) {
      return CHICKEN_FRONT_ANGLE_OFFSET;
    }
    const left = trackRect.x;
    const right = trackRect.x + trackRect.w;
    const top = trackRect.y;
    const bottom = trackRect.y + trackRect.h;
    const distances = [
      { side: "top", value: Math.abs(point.y - top) },
      { side: "bottom", value: Math.abs(point.y - bottom) },
      { side: "left", value: Math.abs(point.x - left) },
      { side: "right", value: Math.abs(point.x - right) },
    ];
    distances.sort((a, b) => a.value - b.value);
    const closestSide = distances[0].side;
    if (closestSide === "bottom") {
      return -Math.PI * 0.5 + CHICKEN_FRONT_ANGLE_OFFSET;
    }
    if (closestSide === "right") {
      return Math.PI + CHICKEN_FRONT_ANGLE_OFFSET;
    }
    if (closestSide === "left") {
      return CHICKEN_FRONT_ANGLE_OFFSET;
    }
    return Math.PI * 0.5 + CHICKEN_FRONT_ANGLE_OFFSET;
  }

  getTrackRegionForPoint(point) {
    const trackRect = this.conveyor?.trackRect;
    if (!trackRect || !point) {
      return null;
    }
    const left = trackRect.x;
    const right = trackRect.x + trackRect.w;
    const top = trackRect.y;
    const bottom = trackRect.y + trackRect.h;
    const radius = Math.max(0, Number(trackRect.r) || 0);
    const epsilon = Math.max(2, LAYOUT.cellSize * 0.18);
    const inLeftCornerBand = point.x <= left + radius + epsilon;
    const inRightCornerBand = point.x >= right - radius - epsilon;
    const inTopCornerBand = point.y <= top + radius + epsilon;
    const inBottomCornerBand = point.y >= bottom - radius - epsilon;

    if (inLeftCornerBand && inTopCornerBand) {
      return "top-left";
    }
    if (inRightCornerBand && inTopCornerBand) {
      return "top-right";
    }
    if (inLeftCornerBand && inBottomCornerBand) {
      return "bottom-left";
    }
    if (inRightCornerBand && inBottomCornerBand) {
      return "bottom-right";
    }

    const distances = [
      { side: "top", value: Math.abs(point.y - top) },
      { side: "bottom", value: Math.abs(point.y - bottom) },
      { side: "left", value: Math.abs(point.x - left) },
      { side: "right", value: Math.abs(point.x - right) },
    ];
    distances.sort((a, b) => a.value - b.value);
    return distances[0]?.side || null;
  }

  getInwardShootDirection(sourcePoint) {
    const trackRect = this.conveyor?.trackRect;
    if (trackRect) {
      const closestTrackSide = [
        { distance: Math.abs(sourcePoint.y - trackRect.y), direction: { x: 0, y: 1, side: "top" } },
        { distance: Math.abs(sourcePoint.y - (trackRect.y + trackRect.h)), direction: { x: 0, y: -1, side: "bottom" } },
        { distance: Math.abs(sourcePoint.x - trackRect.x), direction: { x: 1, y: 0, side: "left" } },
        { distance: Math.abs(sourcePoint.x - (trackRect.x + trackRect.w)), direction: { x: -1, y: 0, side: "right" } },
      ].sort((a, b) => a.distance - b.distance)[0];
      if (closestTrackSide?.direction) {
        return closestTrackSide.direction;
      }
    }

    const fieldWidth = LAYOUT.fieldCols * LAYOUT.fieldStep;
    const fieldHeight = LAYOUT.fieldRows * LAYOUT.fieldStep;
    const left = LAYOUT.fieldX;
    const right = left + fieldWidth;
    const top = LAYOUT.fieldY;
    const bottom = LAYOUT.fieldY + fieldHeight;
    const laneTolerance = LAYOUT.cellSize * 0.65;
    const alignedX = sourcePoint.x >= left - laneTolerance && sourcePoint.x <= right + laneTolerance;
    const alignedY = sourcePoint.y >= top - laneTolerance && sourcePoint.y <= bottom + laneTolerance;
    const distTop = Math.abs(sourcePoint.y - top);
    const distBottom = Math.abs(sourcePoint.y - bottom);
    const distLeft = Math.abs(sourcePoint.x - left);
    const distRight = Math.abs(sourcePoint.x - right);
    const distances = [
      { side: "top", distance: distTop, aligned: alignedX, direction: { x: 0, y: 1, side: "top" } },
      { side: "bottom", distance: distBottom, aligned: alignedX, direction: { x: 0, y: -1, side: "bottom" } },
      { side: "left", distance: distLeft, aligned: alignedY, direction: { x: 1, y: 0, side: "left" } },
      { side: "right", distance: distRight, aligned: alignedY, direction: { x: -1, y: 0, side: "right" } },
    ].sort((a, b) => a.distance - b.distance);

    for (const candidate of distances) {
      if (!candidate.aligned) {
        continue;
      }
      if (candidate.distance <= distances[0].distance + 0.001) {
        return candidate.direction;
      }
    }
    return distances[0]?.direction || null;
  }

  getLineHitForBlock(sourcePoint, direction, block, lineHalfWidth) {
    const center = this.blockCenter(block);
    const dx = center.x - sourcePoint.x;
    const dy = center.y - sourcePoint.y;
    const forwardDistance = dx * direction.x + dy * direction.y;
    if (forwardDistance <= 0) {
      return null;
    }
    const sideDistance = Math.abs(dx * direction.y - dy * direction.x);
    if (sideDistance > lineHalfWidth) {
      return null;
    }
    return { forwardDistance, sideDistance };
  }

  getShotLineHalfWidth() {
    return Math.max(8, LAYOUT.cellSize * 0.48);
  }

  isPathBlockedByPlacedBlocks(sourcePoint, direction, targetForwardDistance, lineHalfWidth, ignoreBlockId = null) {
    for (const block of this.blocks) {
      if (!block.alive) {
        continue;
      }
      if (ignoreBlockId !== null && block.id === ignoreBlockId) {
        continue;
      }
      const hit = this.getLineHitForBlock(sourcePoint, direction, block, lineHalfWidth);
      if (!hit) {
        continue;
      }
      if (hit.forwardDistance < targetForwardDistance - 0.0001) {
        return true;
      }
    }
    return false;
  }

  getNextSpiralTarget() {
    const targets = this.getNextSpiralTargets();
    if (targets.length > 0) {
      return targets[0];
    }
    return null;
  }

  getNextSpiralTargets() {
    if (this.nextSpiralTargetsCacheVersion === this.targetingCacheVersion) {
      return this.nextSpiralTargetsCache;
    }
    let minPendingSpiralIndex = Number.POSITIVE_INFINITY;

    for (const block of this.blocksBySpiral) {
      if (block.alive) {
        continue;
      }
      minPendingSpiralIndex = Math.min(minPendingSpiralIndex, block.spiralIndex);
    }
    if (!Number.isFinite(minPendingSpiralIndex)) {
      this.nextSpiralTargetsCache = [];
      this.nextSpiralTargetsCacheVersion = this.targetingCacheVersion;
      return this.nextSpiralTargetsCache;
    }

    const targets = [];
    for (const block of this.blocksBySpiral) {
      if (block.alive || block.spiralIndex !== minPendingSpiralIndex) {
        continue;
      }
      // Never allow building an outer-side block while a direct inner neighbor is still pending.
      let hasPendingInnerNeighbor = false;
      const neighbors = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (const [dx, dy] of neighbors) {
        const neighbor = this.blockByCell.get(`${block.col + dx},${block.row + dy}`);
        if (!neighbor) {
          continue;
        }
        if (neighbor.spiralIndex < block.spiralIndex && !neighbor.alive) {
          hasPendingInnerNeighbor = true;
          break;
        }
      }
      if (hasPendingInnerNeighbor) {
        continue;
      }
      targets.push(block);
    }

    if (targets.length > 0) {
      targets.sort((a, b) => (a.spiralOrder - b.spiralOrder) || (a.id - b.id));
      this.nextSpiralTargetsCache = targets;
      this.nextSpiralTargetsCacheVersion = this.targetingCacheVersion;
      return this.nextSpiralTargetsCache;
    }

    // Safety fallback: if strict filter removed everything, keep inner ring available.
    const fallbackTargets = [];
    for (const block of this.blocksBySpiral) {
      if (!block.alive && block.spiralIndex === minPendingSpiralIndex) {
        fallbackTargets.push(block);
      }
    }
    fallbackTargets.sort((a, b) => (a.spiralOrder - b.spiralOrder) || (a.id - b.id));
    this.nextSpiralTargetsCache = fallbackTargets;
    this.nextSpiralTargetsCacheVersion = this.targetingCacheVersion;
    return this.nextSpiralTargetsCache;
  }

  getContourGhostTargets() {
    if (this.contourGhostTargetsCacheVersion === this.targetingCacheVersion) {
      return this.contourGhostTargetsCache;
    }
    if (this.remainingBlocks <= 0) {
      this.contourGhostTargetsCache = [];
      this.contourGhostTargetsCacheVersion = this.targetingCacheVersion;
      return this.contourGhostTargetsCache;
    }
    const hasFilledBlocks = this.remainingBlocks < this.blocks.length;
    if (!hasFilledBlocks) {
      const targets = this.getNextSpiralTargets();
      this.contourGhostTargetsCache = targets;
      this.contourGhostTargetsCacheVersion = this.targetingCacheVersion;
      return this.contourGhostTargetsCache;
    }

    const contourTargets = [];
    const neighbors = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (const block of this.blocksBySpiral) {
      if (block.alive) {
        continue;
      }
      for (const [dx, dy] of neighbors) {
        const neighbor = this.blockByCell.get(`${block.col + dx},${block.row + dy}`);
        if (!neighbor || !neighbor.alive) {
          continue;
        }
        contourTargets.push(block);
        break;
      }
    }

    if (contourTargets.length === 0) {
      const targets = this.getNextSpiralTargets();
      this.contourGhostTargetsCache = targets;
      this.contourGhostTargetsCacheVersion = this.targetingCacheVersion;
      return this.contourGhostTargetsCache;
    }
    contourTargets.sort((a, b) => (a.spiralIndex - b.spiralIndex) || (a.spiralOrder - b.spiralOrder) || (a.id - b.id));
    this.contourGhostTargetsCache = contourTargets;
    this.contourGhostTargetsCacheVersion = this.targetingCacheVersion;
    return this.contourGhostTargetsCache;
  }

  getSpiralBuildPriority(target, forwardDistance) {
    const spiralIndex = Number.isFinite(target?.spiralIndex) ? target.spiralIndex : Number.MAX_SAFE_INTEGER;
    const distancePriority = Number.isFinite(forwardDistance) ? forwardDistance : Number.MAX_SAFE_INTEGER;
    const spiralOrder = Number.isFinite(target?.spiralOrder) ? target.spiralOrder : Number.MAX_SAFE_INTEGER;
    return {
      spiralIndex,
      distancePriority,
      spiralOrder,
    };
  }

  isSpiralBuildPriorityBetter(next, current) {
    if (!current) {
      return true;
    }
    if (next.spiralIndex !== current.spiralIndex) {
      return next.spiralIndex < current.spiralIndex;
    }
    if (next.distancePriority !== current.distancePriority) {
      return next.distancePriority < current.distancePriority;
    }
    if (next.spiralOrder !== current.spiralOrder) {
      return next.spiralOrder < current.spiralOrder;
    }
    return false;
  }

  getFirstPendingSpiralBlock() {
    for (const block of this.blocksBySpiral) {
      if (!block.alive) {
        return block;
      }
    }
    return null;
  }

  getOrderedTargetSideProbes(target) {
    if (!target) {
      return [];
    }
    const targetCenter = this.blockCenter(target);
    const fieldWidth = LAYOUT.fieldCols * LAYOUT.fieldStep;
    const fieldHeight = LAYOUT.fieldRows * LAYOUT.fieldStep;
    const fieldLeft = LAYOUT.fieldX;
    const fieldTop = LAYOUT.fieldY;
    const fieldRight = fieldLeft + fieldWidth;
    const fieldBottom = fieldTop + fieldHeight;
    const preferenceRank = { top: 0, bottom: 1, left: 2, right: 3 };
    return [
      {
        side: "top",
        distance: Math.abs(targetCenter.y - fieldTop),
        sourcePoint: { x: targetCenter.x, y: fieldTop - LAYOUT.cellSize },
        direction: { x: 0, y: 1, side: "top" },
      },
      {
        side: "bottom",
        distance: Math.abs(fieldBottom - targetCenter.y),
        sourcePoint: { x: targetCenter.x, y: fieldBottom + LAYOUT.cellSize },
        direction: { x: 0, y: -1, side: "bottom" },
      },
      {
        side: "left",
        distance: Math.abs(targetCenter.x - fieldLeft),
        sourcePoint: { x: fieldLeft - LAYOUT.cellSize, y: targetCenter.y },
        direction: { x: 1, y: 0, side: "left" },
      },
      {
        side: "right",
        distance: Math.abs(fieldRight - targetCenter.x),
        sourcePoint: { x: fieldRight + LAYOUT.cellSize, y: targetCenter.y },
        direction: { x: -1, y: 0, side: "right" },
      },
    ].sort((a, b) => (a.distance - b.distance) || (preferenceRank[a.side] - preferenceRank[b.side]));
  }

  invalidateTargetingCaches(clearTrackSamples = false) {
    this.targetingCacheVersion += 1;
    this.allowedReachableProbeCache.clear();
    this.trackProbeWindowCache.clear();
    this.nextSpiralTargetsCache = [];
    this.nextSpiralTargetsCacheVersion = -1;
    this.contourGhostTargetsCache = [];
    this.contourGhostTargetsCacheVersion = -1;
    if (clearTrackSamples) {
      this.trackSideSamples = null;
      this.trackSideSamplesKey = "";
    }
  }

  getTrackSideSamples() {
    const conveyor = this.conveyor;
    const trackRect = conveyor?.trackRect;
    if (!conveyor || !trackRect || !Number.isFinite(conveyor.totalLength) || conveyor.totalLength <= 0) {
      return { top: [], bottom: [], left: [], right: [] };
    }
    const key = [
      Math.round(trackRect.x),
      Math.round(trackRect.y),
      Math.round(trackRect.w),
      Math.round(trackRect.h),
      Math.round(trackRect.r),
      Math.round(conveyor.totalLength),
      Math.round(LAYOUT.fieldX),
      Math.round(LAYOUT.fieldY),
      Math.round(LAYOUT.fieldCols * LAYOUT.fieldStep),
      Math.round(LAYOUT.fieldRows * LAYOUT.fieldStep),
    ].join(":");
    if (this.trackSideSamples && this.trackSideSamplesKey === key) {
      return this.trackSideSamples;
    }

    const samples = { top: [], bottom: [], left: [], right: [] };
    const sampleStep = 1;
    for (let distance = 0; distance < conveyor.totalLength; distance += sampleStep) {
      const point = conveyor.pointAtDistance(distance);
      const direction = this.getInwardShootDirection(point);
      if (!direction?.side || !samples[direction.side]) {
        continue;
      }
      samples[direction.side].push(point);
    }

    this.trackSideSamples = samples;
    this.trackSideSamplesKey = key;
    return samples;
  }

  hasTrackShotWindowForProbe(target, probe, lineHalfWidth) {
    if (!target || !probe?.side || !probe.direction) {
      return false;
    }
    const cacheKey = `${this.targetingCacheVersion}:${target.id}:${probe.side}`;
    if (this.trackProbeWindowCache.has(cacheKey)) {
      return this.trackProbeWindowCache.get(cacheKey);
    }

    const sideSamples = this.getTrackSideSamples()[probe.side] || [];
    for (const samplePoint of sideSamples) {
      const hit = this.getLineHitForBlock(samplePoint, probe.direction, target, lineHalfWidth);
      if (!hit) {
        continue;
      }
      if (this.isPathBlockedByPlacedBlocks(
        samplePoint,
        probe.direction,
        hit.forwardDistance,
        lineHalfWidth * 0.9,
        target.id
      )) {
        continue;
      }
      this.trackProbeWindowCache.set(cacheKey, true);
      return true;
    }

    this.trackProbeWindowCache.set(cacheKey, false);
    return false;
  }

  isSideReachableForTargetByTrack(side, targetCenter, lineHalfWidth) {
    const trackRect = this.conveyor?.trackRect;
    if (!trackRect) {
      return true;
    }
    const radius = Math.max(0, Number(trackRect.r) || 0);
    const minTopX = trackRect.x + radius;
    const maxTopX = trackRect.x + trackRect.w - radius;
    const minLeftY = trackRect.y + radius;
    const maxLeftY = trackRect.y + trackRect.h - radius;

    if (side === "top" || side === "bottom") {
      return targetCenter.x >= minTopX - lineHalfWidth && targetCenter.x <= maxTopX + lineHalfWidth;
    }
    if (side === "left" || side === "right") {
      return targetCenter.y >= minLeftY - lineHalfWidth && targetCenter.y <= maxLeftY + lineHalfWidth;
    }
    return true;
  }

  getPreferredReachableProbeForTarget(target) {
    if (!target) {
      return null;
    }
    const lineHalfWidth = this.getShotLineHalfWidth();
    const targetCenter = this.blockCenter(target);
    const probes = this.getOrderedTargetSideProbes(target);
    for (const probe of probes) {
      if (!this.isSideReachableForTargetByTrack(probe.side, targetCenter, lineHalfWidth)) {
        continue;
      }
      if (!this.hasTrackShotWindowForProbe(target, probe, lineHalfWidth)) {
        continue;
      }
      return probe;
    }
    return null;
  }

  getAllowedReachableProbesForTarget(target) {
    if (!target) {
      return [];
    }
    const cacheKey = `${this.targetingCacheVersion}:${target.id}`;
    if (this.allowedReachableProbeCache.has(cacheKey)) {
      return this.allowedReachableProbeCache.get(cacheKey);
    }
    const lineHalfWidth = this.getShotLineHalfWidth();
    const targetCenter = this.blockCenter(target);
    const reachable = [];
    const probes = this.getOrderedTargetSideProbes(target);
    for (const probe of probes) {
      if (!this.isSideReachableForTargetByTrack(probe.side, targetCenter, lineHalfWidth)) {
        continue;
      }
      if (!this.hasTrackShotWindowForProbe(target, probe, lineHalfWidth)) {
        continue;
      }
      reachable.push(probe);
    }

    if (reachable.length === 0) {
      this.allowedReachableProbeCache.set(cacheKey, []);
      return [];
    }
    this.allowedReachableProbeCache.set(cacheKey, reachable);
    return reachable;
  }

  getTargetRegionTags(target, activeTargets) {
    if (!target || !Array.isArray(activeTargets) || activeTargets.length === 0) {
      return new Set();
    }
    let minRow = Infinity;
    let maxRow = -Infinity;
    let minCol = Infinity;
    let maxCol = -Infinity;
    for (const activeTarget of activeTargets) {
      if (!activeTarget) {
        continue;
      }
      minRow = Math.min(minRow, activeTarget.row);
      maxRow = Math.max(maxRow, activeTarget.row);
      minCol = Math.min(minCol, activeTarget.col);
      maxCol = Math.max(maxCol, activeTarget.col);
    }

    if (minRow === maxRow && minCol === maxCol) {
      return new Set(["all"]);
    }

    const tags = new Set();
    const onTop = target.row === minRow;
    const onBottom = target.row === maxRow;
    const onLeft = target.col === minCol;
    const onRight = target.col === maxCol;

    if (onTop) {
      tags.add("top");
    }
    if (onBottom) {
      tags.add("bottom");
    }
    if (onLeft) {
      tags.add("left");
    }
    if (onRight) {
      tags.add("right");
    }
    if (onTop && onLeft) {
      tags.add("top-left");
    }
    if (onTop && onRight) {
      tags.add("top-right");
    }
    if (onBottom && onLeft) {
      tags.add("bottom-left");
    }
    if (onBottom && onRight) {
      tags.add("bottom-right");
    }

    return tags;
  }

  doesTrackRegionMatchTarget(trackRegion, targetRegionTags) {
    if (!trackRegion || !(targetRegionTags instanceof Set) || targetRegionTags.size === 0) {
      return true;
    }
    if (targetRegionTags.has("all")) {
      return true;
    }
    if (trackRegion === "top-left" || trackRegion === "top-right" || trackRegion === "bottom-left" || trackRegion === "bottom-right") {
      return targetRegionTags.has(trackRegion);
    }
    if (trackRegion === "top") {
      return targetRegionTags.has("top");
    }
    if (trackRegion === "bottom") {
      return targetRegionTags.has("bottom");
    }
    if (trackRegion === "left") {
      return targetRegionTags.has("left");
    }
    if (trackRegion === "right") {
      return targetRegionTags.has("right");
    }
    return true;
  }

  isTargetOnTrackRegionFrontier(target, trackRegion, activeTargets) {
    if (!target || !trackRegion || !Array.isArray(activeTargets) || activeTargets.length === 0) {
      return true;
    }

    const regionTargets = activeTargets.filter((candidate) => {
      const candidateRegionTags = this.getTargetRegionTags(candidate, activeTargets);
      return this.doesTrackRegionMatchTarget(trackRegion, candidateRegionTags);
    });
    if (regionTargets.length === 0) {
      return true;
    }

    if (trackRegion === "top") {
      const frontierRow = Math.min(...regionTargets.map((candidate) => candidate.row));
      return target.row === frontierRow;
    }
    if (trackRegion === "bottom") {
      const frontierRow = Math.max(...regionTargets.map((candidate) => candidate.row));
      return target.row === frontierRow;
    }
    if (trackRegion === "left") {
      const frontierCol = Math.min(...regionTargets.map((candidate) => candidate.col));
      return target.col === frontierCol;
    }
    if (trackRegion === "right") {
      const frontierCol = Math.max(...regionTargets.map((candidate) => candidate.col));
      return target.col === frontierCol;
    }
    if (trackRegion === "top-left") {
      const frontierRow = Math.min(...regionTargets.map((candidate) => candidate.row));
      const frontierCol = Math.min(...regionTargets.map((candidate) => candidate.col));
      return target.row === frontierRow && target.col === frontierCol;
    }
    if (trackRegion === "top-right") {
      const frontierRow = Math.min(...regionTargets.map((candidate) => candidate.row));
      const frontierCol = Math.max(...regionTargets.map((candidate) => candidate.col));
      return target.row === frontierRow && target.col === frontierCol;
    }
    if (trackRegion === "bottom-left") {
      const frontierRow = Math.max(...regionTargets.map((candidate) => candidate.row));
      const frontierCol = Math.min(...regionTargets.map((candidate) => candidate.col));
      return target.row === frontierRow && target.col === frontierCol;
    }
    if (trackRegion === "bottom-right") {
      const frontierRow = Math.max(...regionTargets.map((candidate) => candidate.row));
      const frontierCol = Math.max(...regionTargets.map((candidate) => candidate.col));
      return target.row === frontierRow && target.col === frontierCol;
    }
    return true;
  }

  getTrackRegionFrontierLock(trackRegion, activeTargets = null) {
    if (!trackRegion) {
      return null;
    }
    const targets = Array.isArray(activeTargets) ? activeTargets : this.getNextSpiralTargets();
    if (targets.length === 0) {
      return null;
    }
    const regionTargets = targets.filter((candidate) => {
      const candidateRegionTags = this.getTargetRegionTags(candidate, targets);
      return this.doesTrackRegionMatchTarget(trackRegion, candidateRegionTags);
    });
    if (regionTargets.length === 0) {
      return null;
    }

    if (trackRegion === "top") {
      return { region: trackRegion, row: Math.min(...regionTargets.map((candidate) => candidate.row)) };
    }
    if (trackRegion === "bottom") {
      return { region: trackRegion, row: Math.max(...regionTargets.map((candidate) => candidate.row)) };
    }
    if (trackRegion === "left") {
      return { region: trackRegion, col: Math.min(...regionTargets.map((candidate) => candidate.col)) };
    }
    if (trackRegion === "right") {
      return { region: trackRegion, col: Math.max(...regionTargets.map((candidate) => candidate.col)) };
    }
    if (trackRegion === "top-left") {
      return {
        region: trackRegion,
        row: Math.min(...regionTargets.map((candidate) => candidate.row)),
        col: Math.min(...regionTargets.map((candidate) => candidate.col)),
      };
    }
    if (trackRegion === "top-right") {
      return {
        region: trackRegion,
        row: Math.min(...regionTargets.map((candidate) => candidate.row)),
        col: Math.max(...regionTargets.map((candidate) => candidate.col)),
      };
    }
    if (trackRegion === "bottom-left") {
      return {
        region: trackRegion,
        row: Math.max(...regionTargets.map((candidate) => candidate.row)),
        col: Math.min(...regionTargets.map((candidate) => candidate.col)),
      };
    }
    if (trackRegion === "bottom-right") {
      return {
        region: trackRegion,
        row: Math.max(...regionTargets.map((candidate) => candidate.row)),
        col: Math.max(...regionTargets.map((candidate) => candidate.col)),
      };
    }
    return { region: trackRegion };
  }

  doesTargetMatchTrackRegionFrontierLock(target, frontierLock) {
    if (!target || !frontierLock) {
      return true;
    }
    if (Number.isFinite(frontierLock.row) && target.row !== frontierLock.row) {
      return false;
    }
    if (Number.isFinite(frontierLock.col) && target.col !== frontierLock.col) {
      return false;
    }
    return true;
  }

  getNextSpiralTargetForColor(color) {
    const targets = this.getNextSpiralTargets();
    for (const target of targets) {
      if (target.color === color) {
        return target;
      }
    }
    return null;
  }

  canColorShootNextSpiralTargetFromTrack(color) {
    const conveyor = this.conveyor;
    if (!conveyor || !Number.isFinite(conveyor.totalLength) || conveyor.totalLength <= 0) {
      return false;
    }
    const sampleStep = Math.max(1, LAYOUT.cellSize * 0.12);
    const sampleCount = Math.max(1, Math.ceil(conveyor.totalLength / sampleStep));
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const distance = (sampleIndex / sampleCount) * conveyor.totalLength;
      const samplePoint = conveyor.pointAtDistance(distance);
      const direction = this.getInwardShootDirection(samplePoint);
      if (!direction) {
        continue;
      }
      if (this.findTargetOnLine(samplePoint, color, direction)) {
        return true;
      }
    }
    return false;
  }

  canColorShootNextSpiralTarget(color) {
    const colorTargets = this.getNextSpiralTargets().filter((target) => target.color === color);
    if (colorTargets.length === 0) {
      return false;
    }
    if (!colorTargets.some((target) => this.getAllowedReachableProbesForTarget(target).length > 0)) {
      return false;
    }
    return this.canColorShootNextSpiralTargetFromTrack(color);
  }

  getAxisDistanceToTargetForSide(sourcePoint, target, side) {
    if (!sourcePoint || !target || !side) {
      return Number.POSITIVE_INFINITY;
    }
    const center = this.blockCenter(target);
    if (side === "top" || side === "bottom") {
      return Math.abs(center.x - sourcePoint.x);
    }
    if (side === "left" || side === "right") {
      return Math.abs(center.y - sourcePoint.y);
    }
    return Math.hypot(center.x - sourcePoint.x, center.y - sourcePoint.y);
  }

  isRegionFallbackPriorityBetter(next, current) {
    if (!current) {
      return true;
    }
    if (next.spiralIndex !== current.spiralIndex) {
      return next.spiralIndex < current.spiralIndex;
    }
    if (next.axisDistance !== current.axisDistance) {
      return next.axisDistance < current.axisDistance;
    }
    if (next.spiralOrder !== current.spiralOrder) {
      return next.spiralOrder < current.spiralOrder;
    }
    return false;
  }

  findTargetOnLine(sourcePoint, color, direction, options = {}) {
    const lineHalfWidth = this.getShotLineHalfWidth();
    const sourceRegion = this.getTrackRegionForPoint(sourcePoint);
    const activeTargets = this.getNextSpiralTargets();
    const frontierLock = options?.frontierLock || null;
    let bestTarget = null;
    let bestPriority = null;

    for (const target of activeTargets) {
      if (target.color !== color) {
        continue;
      }
      const targetRegionTags = this.getTargetRegionTags(target, activeTargets);
      if (!this.doesTrackRegionMatchTarget(sourceRegion, targetRegionTags)) {
        continue;
      }
      if (!this.doesTargetMatchTrackRegionFrontierLock(target, frontierLock)) {
        continue;
      }
      if (!frontierLock && !this.isTargetOnTrackRegionFrontier(target, sourceRegion, activeTargets)) {
        continue;
      }
      const allowedProbes = this.getAllowedReachableProbesForTarget(target);
      if (!allowedProbes.some((probe) => probe.direction.side === direction.side)) {
        continue;
      }

      const hit = this.getLineHitForBlock(sourcePoint, direction, target, lineHalfWidth);
      if (!hit) {
        continue;
      }
      if (this.isPathBlockedByPlacedBlocks(
        sourcePoint,
        direction,
        hit.forwardDistance,
        lineHalfWidth * 0.9,
        target.id
      )) {
        continue;
      }
      const priority = this.getSpiralBuildPriority(target, hit.forwardDistance);
      if (!this.isSpiralBuildPriorityBetter(priority, bestPriority)) {
        continue;
      }
      bestPriority = priority;
      bestTarget = target;
    }

    return bestTarget;
  }

  hasTargetForColor(color) {
    if (!color) {
      return false;
    }
    return this.canColorShootNextSpiralTarget(color);
  }

  fireProjectile(unit, block) {
    this.playSound("buble");
    const target = this.blockCenter(block);
    this.damageBlock(block, unit.color);

    this.projectiles.push({
      fromX: unit.position.x,
      fromY: unit.position.y,
      toX: target.x,
      toY: target.y,
      life: SHOT_TRAIL_DURATION,
      maxLife: SHOT_TRAIL_DURATION,
      color: unit.color,
    });
  }

  damageBlock(block, color) {
    if (!block || block.alive) {
      return;
    }

    const activeTargets = this.getNextSpiralTargets();
    if (!activeTargets.some((target) => target.id === block.id)) {
      return;
    }

    block.alive = true;
    block.hitFlash = 1;
    this.remainingBlocks -= 1;
    this.invalidateTargetingCaches();
    this.markBlockFieldLayerDirty();

    const center = this.blockCenter(block);
    this.spawnParticles(center.x, center.y, color, 28);
    this.spawnImpactRing(center.x, center.y, color, 1.1);
    this.spawnImpactRing(center.x, center.y, color, 1.65);
    this.spawnBlockWave(center.x, center.y);

    this.successStreak += 1;
    this.streakTimer = STREAK_DECAY_TIME;
    if (this.successStreak === 3) {
      this.spawnFloatText(center.x, center.y - 18, "Nice", "#fff8c2", 1.22);
    } else if (this.successStreak === 5) {
      this.spawnFloatText(center.x, center.y - 20, "Great", "#ffe7a8", 1.34);
    } else if (this.successStreak >= 8) {
      this.spawnFloatText(center.x, center.y - 22, "Perfect", "#ffda7f", 1.48);
      this.successStreak = 4;
    }

  }

  spawnBlockWave(x, y) {
    while (this.blockWaves.length >= MAX_ACTIVE_BLOCK_WAVES) {
      this.blockWaves.shift();
    }
    this.blockWaves.push({
      x,
      y,
      life: 0.34,
      maxLife: 0.34,
      startR: 8,
      endR: 300,
      bandWidth: 34,
      jumpHeight: 13,
    });
    this.blockWaves.push({
      x,
      y,
      life: 0.28,
      maxLife: 0.28,
      startR: 24,
      endR: 340,
      bandWidth: 46,
      jumpHeight: 7,
    });
    while (this.blockWaves.length > MAX_ACTIVE_BLOCK_WAVES) {
      this.blockWaves.shift();
    }
  }

  blockCenter(block) {
    return {
      x: block.x + block.size * 0.5,
      y: block.y + block.size * 0.5,
    };
  }

  spawnParticles(x, y, color, amount) {
    if (this.particles.length >= MAX_ACTIVE_PARTICLES) {
      return;
    }
    const particleColor = getBlockColorConfig(color).particle;
    const available = Math.max(0, MAX_ACTIVE_PARTICLES - this.particles.length);
    const spawnAmount = Math.min(amount, available);
    for (let i = 0; i < spawnAmount; i++) {
      const angle = (Math.PI * 2 * i) / Math.max(1, spawnAmount) + Math.random() * 0.3;
      const speed = 36 + Math.random() * 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.22 + Math.random() * 0.2,
        maxLife: 0.38,
        size: 3 + Math.random() * 3,
        color: particleColor,
      });
    }
  }

  hasSpawnableSlimes() {
    if (this.units.some((unit) => unit.alive)) {
      return true;
    }
    return this.cards.some((card) => !card.used && card.ammo > 0);
  }

  checkVictoryReady() {
    if (this.gameState !== "playing") {
      return false;
    }
    if (this.remainingBlocks > 0) {
      return false;
    }
    if (this.projectiles.length > 0) {
      return false;
    }
    return !this.hasSpawnableSlimes();
  }

  startVictorySequence() {
    if (this.gameState === "victory") {
      return;
    }
    this.gameState = "victory";
    this.playSound("win");
    this.cameraZoomTarget = VICTORY_ZOOM_TARGET;
    this.victoryConfettiTime = VICTORY_CONFETTI_DURATION;
    this.victoryFloatTime = 0;
    this.victoryConfettiSpawnCarry = 0;
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.cameraShakeTime = 0;
    this.cameraShakeDuration = 0;
    this.cameraShakeAmp = 0;
    this.cameraShakeX = 0;
    this.cameraShakeY = 0;
    this.spawnConfettiBurst(64);
    this.victoryCompleteEventPending = true;
    this.loseContinueSnapshot = [];
  }

  buildLoseContinueSnapshotFromCurrentState() {
    const snapshot = [];
    for (const card of this.cards) {
      if (!card || card.used || card.ammo <= 0) {
        continue;
      }
      snapshot.push({
        label: card.label,
        color: card.color,
        ammo: Math.max(1, Math.round(card.ammo)),
        styleKey: card.styleKey || null,
      });
    }
    for (const unit of this.units) {
      if (!unit) {
        continue;
      }
      const state = String(unit.state || "");
      const isFieldState = state === "launching" || state === "moving" || state === "landing" || state === "parked";
      if (!isFieldState) {
        continue;
      }
      const ammo = Math.max(0, Math.round(unit.ammo));
      if (ammo <= 0) {
        continue;
      }
      snapshot.push({
        label: unit.label,
        color: unit.color,
        ammo,
        styleKey: unit.styleKey || null,
      });
    }
    return snapshot;
  }

  startLoseSequence() {
    if (this.gameState !== "playing") {
      return;
    }
    this.loseContinueSnapshot = this.buildLoseContinueSnapshotFromCurrentState();
    this.gameState = "lose";
    this.playSound("fail");
    const parkedUnits = this.units.filter(
      (unit) => unit.alive && unit.state === "parked" && unit.slotIndex !== null && unit.ammo > 0
    );
    this.units = parkedUnits;
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.blockWaves = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.slotManager.reset();
    for (const unit of this.units) {
      const slotIndex = unit.slotIndex;
      if (slotIndex === null || slotIndex === undefined) {
        continue;
      }
      if (slotIndex < 0 || slotIndex >= this.slotManager.occupants.length) {
        continue;
      }
      this.slotManager.occupants[slotIndex] = unit.id;
      const slotCenter = this.getSlotCenter(slotIndex);
      if (slotCenter) {
        unit.position = { ...slotCenter };
        unit.prevPosition = { ...slotCenter };
      }
    }
    for (const block of this.blocks) {
      block.hitFlash = 0;
    }
    this.successStreak = 0;
    this.streakTimer = 0;
    this.losePopupAppear = 0;
    this.loseCloseRect = this.getLoseCloseRect();
    this.invalidate(true);
  }

  continueFromLoseWithOneSlot() {
    return this.continueFromLoseWithOneSlotCore({ spendCoins: true });
  }

  continueFromLoseWithAd() {
    return dispatchUnityRewardEvent();
  }

  continueFromLoseWithOneSlotCore({ spendCoins = true } = {}) {
    if (this.gameState !== "lose") {
      return false;
    }
    if (spendCoins) {
      const continueCost = this.getLoseContinueCoinsCost();
      const currentCoins = this.getCurrentExternalCoinsCount();
      if (currentCoins < continueCost) {
        return false;
      }
      const nextCoins = Math.max(0, currentCoins - continueCost);
      this.externalCoinsCount = nextCoins;
      pendingExternalCoinsCount = nextCoins;
      persistExternalCoinsCount(nextCoins);
    }

    const continueSnapshot = Array.isArray(this.loseContinueSnapshot) && this.loseContinueSnapshot.length > 0
      ? this.loseContinueSnapshot
      : this.buildLoseContinueSnapshotFromCurrentState();
    this.loseContinueSnapshot = [];

    // Continue should fully clear birds from field/slots and rebuild queue from cards.
    this.units = [];
    this.slotManager.reset();

    for (const card of this.cards) {
      card.used = true;
      card.ammo = 0;
    }

    const cardsSorted = this.cards.slice().sort((a, b) => a.index - b.index);
    const cardsByLabel = new Map();
    for (const card of cardsSorted) {
      const labelKey = String(card.label);
      if (!cardsByLabel.has(labelKey)) {
        cardsByLabel.set(labelKey, []);
      }
      cardsByLabel.get(labelKey).push(card);
    }
    const claimedCardIndexes = new Set();
    const claimCardByLabel = (label) => {
      const cardsForLabel = cardsByLabel.get(String(label)) || [];
      for (const card of cardsForLabel) {
        if (claimedCardIndexes.has(card.index)) {
          continue;
        }
        return card;
      }
      return null;
    };
    const claimAnyCard = () => cardsSorted.find((card) => !claimedCardIndexes.has(card.index)) || null;

    for (const entry of continueSnapshot) {
      const ammo = Math.max(0, Math.round(entry?.ammo));
      if (!entry || !entry.color || ammo <= 0) {
        continue;
      }
      const targetCard = claimCardByLabel(entry.label) || claimAnyCard();
      if (!targetCard) {
        break;
      }
      claimedCardIndexes.add(targetCard.index);
      targetCard.used = false;
      targetCard.ammo = ammo;
      targetCard.color = entry.color;
      if (entry.styleKey) {
        targetCard.styleKey = entry.styleKey;
      }
    }
    this.normalizeShooterQueues(this.cards);
    this.gameState = "playing";
    this.losePopupAppear = 1;
    this.successStreak = 0;
    this.streakTimer = 0;
    this.invalidate(true);
    return true;
  }

  getCurrentExternalCoinsCount() {
    return resolveExternalCoinsCount(this);
  }

  getLoseContinueCoinsCost() {
    return resolveExternalTimeOutCoinsCost(this);
  }

  canContinueFromLoseForCoins() {
    return this.getCurrentExternalCoinsCount() >= this.getLoseContinueCoinsCost();
  }

  triggerDebug6() {
    if (this.blocks.length === 0) {
      return false;
    }

    for (const block of this.blocks) {
      block.alive = true;
      block.hitFlash = 0;
    }
    this.invalidateTargetingCaches();
    this.rebuildBlockFieldLayer();
    for (const card of this.cards) {
      card.used = true;
      card.ammo = 0;
    }

    this.remainingBlocks = 0;
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.successStreak = 0;
    this.streakTimer = 0;

    if (this.gameState !== "victory") {
      this.startVictorySequence();
    } else {
      this.victoryConfettiTime = VICTORY_CONFETTI_DURATION;
      this.victoryConfettiSpawnCarry = 0;
      this.spawnConfettiBurst(64);
    }
    this.invalidate(true);
    return true;
  }

  triggerDebugLose() {
    if (this.gameState === "lose") {
      return true;
    }
    if (this.gameState !== "playing") {
      return false;
    }
    this.startLoseSequence();
    this.invalidate(true);
    return true;
  }

  spawnConfettiBurst(amount) {
    for (let i = 0; i < amount; i++) {
      const x = Math.random() * this.width;
      const y = -16 - Math.random() * 74;
      const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 90 + Math.random() * 180;
      this.confetti.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 50,
        vy: Math.sin(angle) * speed + 40 + Math.random() * 90,
        size: 16 + Math.random() * 18,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 6,
        life: 6 + Math.random() * 2.5,
        maxLife: 8.5,
      });
    }
  }

  updateConfetti(dt) {
    compactListInPlace(this.confetti, (piece) => {
      piece.x += piece.vx * dt;
      piece.y += piece.vy * dt;
      piece.vx *= 0.997;
      piece.vy += 280 * dt;
      piece.rotation += piece.spin * dt;
      piece.life -= dt;
      return piece.life > 0 && piece.y < this.height + 80;
    });
  }

  update(dt) {
    const cardsAnimating = this.updateCardQueueAnimations(dt);
    if (cardsAnimating) {
      this.needsRender = true;
    }

    if (this.levelStartFade > 0) {
      this.levelStartFade = Math.max(0, this.levelStartFade - dt / LEVEL_START_FADE_DURATION);
    }

    if (this.gameState === "victory") {
      this.victoryConfettiTime = Math.max(0, this.victoryConfettiTime - dt);
      this.victoryConfettiSpawnCarry += dt * VICTORY_CONFETTI_RATE;
      const spawnNow = Math.floor(this.victoryConfettiSpawnCarry);
      if (spawnNow > 0) {
        this.victoryConfettiSpawnCarry -= spawnNow;
        this.spawnConfettiBurst(spawnNow);
      }
      this.victoryFloatTime += dt;
      this.updateConfetti(dt);
      this.cameraZoom += (this.cameraZoomTarget - this.cameraZoom) * Math.min(1, dt * VICTORY_ZOOM_SPEED);
      if (
        this.victoryCompleteEventPending &&
        this.victoryConfettiTime <= 0 &&
        Math.abs(this.cameraZoomTarget - this.cameraZoom) <= 0.01
      ) {
        this.victoryCompleteEventPending = false;
        dispatchUnityCompleteEvent(this);
      }
      this.cameraShakeTime = 0;
      this.cameraShakeX = 0;
      this.cameraShakeY = 0;
      return;
    }
    if (this.gameState === "lose") {
      this.losePopupAppear = Math.min(1, this.losePopupAppear + dt / LOSE_POPUP_ANIM_DURATION);
      return;
    }

    if (this.streakTimer > 0) {
      this.streakTimer = Math.max(0, this.streakTimer - dt);
      if (this.streakTimer <= 0) {
        this.successStreak = 0;
      }
    }

    if (this.ensurePlayableFrontQueueColor()) {
      this.needsRender = true;
    }

    for (const block of this.blocks) {
      block.update(dt);
    }

    for (const unit of this.units) {
      unit.update(dt, this);
    }
    this.units = this.units.filter((unit) => unit.alive);

    compactListInPlace(this.projectiles, (projectile) => {
      projectile.life -= dt;
      return projectile.life > 0;
    });

    compactListInPlace(this.particles, (particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.95;
      particle.vy = particle.vy * 0.95 + 22 * dt;
      particle.life -= dt;
      return particle.life > 0;
    });

    compactListInPlace(this.impactRings, (ring) => {
      ring.life -= dt;
      return ring.life > 0;
    });

    compactListInPlace(this.blockWaves, (wave) => {
      wave.life -= dt;
      return wave.life > 0;
    });

    compactListInPlace(this.slotBursts, (burst) => {
      burst.life -= dt;
      return burst.life > 0;
    });

    compactListInPlace(this.floatTexts, (text) => {
      text.x += text.vx * dt;
      text.y += text.vy * dt;
      text.vy *= 0.96;
      text.life -= dt;
      return text.life > 0;
    });

    if (this.checkVictoryReady()) {
      this.startVictorySequence();
    }

    this.updateTutorialState(dt);
    this.updateConfetti(dt);
    this.cameraZoom += (this.cameraZoomTarget - this.cameraZoom) * Math.min(1, dt * VICTORY_ZOOM_SPEED);
  }

  drawLoading(ctx) {
    ctx.fillStyle = "#214113";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = COLORS.white;
    ctx.font = "700 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = this.gameState === "error" ? "Failed to initialize game" : "Loading...";
    ctx.fillText(label, this.width / 2, this.height / 2);
  }

  drawBackground(ctx) {
    const trackTheme = CURRENT_THEME.track || {};
    this.drawGeneratedBackdrop(ctx, { x: 0, y: 0, w: this.width, h: this.height });

    // Wood ring around track.
    const outerWood = {
      x: LAYOUT.track.x - 40,
      y: LAYOUT.track.y - 40,
      w: LAYOUT.track.w + 80,
      h: LAYOUT.track.h + 80,
      r: LAYOUT.track.r + 36,
    };
    const innerWood = {
      x: LAYOUT.track.x + 40,
      y: LAYOUT.track.y + 40,
      w: LAYOUT.track.w - 80,
      h: LAYOUT.track.h - 80,
      r: Math.max(8, LAYOUT.track.r - 34),
    };

    // Prefer pixel-art railway sprite for a closer 1:1 visual match.
    if (this.drawRailwayFrame(ctx, outerWood)) {
      return;
    }

    // Fallback center fill for procedural rails.
    ctx.save();
    roundedRect(ctx, innerWood.x, innerWood.y, innerWood.w, innerWood.h, innerWood.r);
    ctx.clip();
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(innerWood.x, innerWood.y, innerWood.w, innerWood.h);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = COLORS.sceneShadow;
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 14;
    ctx.beginPath();
    roundedRect(ctx, outerWood.x, outerWood.y, outerWood.w, outerWood.h, outerWood.r);
    roundedRect(ctx, innerWood.x, innerWood.y, innerWood.w, innerWood.h, innerWood.r);
    const woodGrad = ctx.createLinearGradient(0, outerWood.y, 0, outerWood.y + outerWood.h);
    const woodStops = trackTheme.woodGradient || ["#9f6e34", "#6f451f", "#a47539"];
    woodGrad.addColorStop(0, woodStops[0] || "#9f6e34");
    woodGrad.addColorStop(0.5, woodStops[1] || woodStops[0] || "#6f451f");
    woodGrad.addColorStop(1, woodStops[2] || woodStops[1] || "#a47539");
    ctx.fillStyle = woodGrad;
    // roundedRect() starts a new path internally, so fill the outer wood first...
    ctx.fill();
    ctx.restore();

    // Sleepers along the path.
    for (let d = 0; d < this.conveyor.totalLength; d += 26) {
      const p = this.conveyor.pointAtDistance(d);
      const p2 = this.conveyor.pointAtDistance(d + 2);
      const tangent = Math.atan2(p2.y - p.y, p2.x - p.x);
      const angle = tangent + Math.PI * 0.5;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(angle);
      ctx.fillStyle = trackTheme.sleeperColor || "#5b3619";
      ctx.fillRect(-19, -6, 38, 12);
      ctx.fillStyle = trackTheme.sleeperHighlight || "rgba(255,255,255,0.12)";
      ctx.fillRect(-19, -6, 38, 3);
      ctx.restore();
    }

    // Metal rails.
    const outerRail = {
      x: LAYOUT.track.x - 24,
      y: LAYOUT.track.y - 24,
      w: LAYOUT.track.w + 48,
      h: LAYOUT.track.h + 48,
      r: LAYOUT.track.r + 22,
    };
    const innerRail = {
      x: LAYOUT.track.x + 24,
      y: LAYOUT.track.y + 24,
      w: LAYOUT.track.w - 48,
      h: LAYOUT.track.h - 48,
      r: Math.max(8, LAYOUT.track.r - 22),
    };
    const strokeRail = (rect) => {
      roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
      ctx.strokeStyle = trackTheme.railMain || "#ded7ca";
      ctx.lineWidth = 6;
      ctx.stroke();
      roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
      ctx.strokeStyle = trackTheme.railShadow || "rgba(55,55,55,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    ctx.save();
    strokeRail(outerRail);
    strokeRail(innerRail);
    ctx.restore();

  }

  drawVictoryBackground(ctx) {
    const victoryTheme = CURRENT_THEME.victory || {};
    const worldRect = this.getViewportWorldRect();
    const gradientStops = victoryTheme.gradient || ["#d8f3ff", "#a8ddff", "#8bc9ff"];
    const gradient = ctx.createLinearGradient(0, worldRect.y, 0, worldRect.y + worldRect.h);
    gradient.addColorStop(0, gradientStops[0] || "#d8f3ff");
    gradient.addColorStop(0.55, gradientStops[1] || gradientStops[0] || "#a8ddff");
    gradient.addColorStop(1, gradientStops[2] || gradientStops[1] || "#8bc9ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(worldRect.x, worldRect.y, worldRect.w, worldRect.h);

    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = victoryTheme.cloudColor || "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(worldRect.x + worldRect.w * 0.16, worldRect.y + worldRect.h * 0.18, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(worldRect.x + worldRect.w * 0.84, worldRect.y + worldRect.h * 0.28, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawVictoryArtwork(ctx) {
    const floatOffset = Math.sin(this.victoryFloatTime * Math.PI * VICTORY_FLOAT_SPEED) * VICTORY_FLOAT_AMPLITUDE;
    const boardX = LAYOUT.fieldX;
    const boardY = LAYOUT.fieldY + VICTORY_ART_OFFSET_Y;
    const boardW = LAYOUT.fieldCols * LAYOUT.fieldStep;
    const boardH = LAYOUT.fieldRows * LAYOUT.fieldStep;
    const centerX = boardX + boardW * 0.5;
    const centerY = boardY + boardH * 0.5 + floatOffset;

    ctx.save();
    const halo = ctx.createRadialGradient(centerX, centerY - boardH * 0.08, boardW * 0.12, centerX, centerY, boardW * 0.72);
    halo.addColorStop(0, "rgba(255, 255, 255, 0.34)");
    halo.addColorStop(0.45, "rgba(255, 255, 255, 0.16)");
    halo.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, boardW * 0.58, boardH * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    for (const block of this.blocks) {
      const x = block.x;
      const y = block.y + VICTORY_ART_OFFSET_Y + floatOffset;
      this.drawVolumetricBlock(ctx, block, x, y, {
        alpha: 1,
        shadowOpacity: 0.32,
        bevelStrength: 0.34,
      });
    }
  }

  drawVolumetricBlock(ctx, block, x, y, options = {}) {
    const size = block.size;
    const spriteKey = `${block.color}Tile`;
    const sprite = this.sprites[spriteKey] || null;
    const resolvedTileColor = this.resolveBlockTileColorKey(block.color);
    const usesSourceSprite = !!(resolvedTileColor && this.blockTileUsesSourceImage[resolvedTileColor]);
    const baseColor = this.getBlockFaceColor(block.color);
    const alpha = options.alpha ?? 1;
    const shadowOpacity = options.shadowOpacity ?? 0.24;
    const bevelStrength = options.bevelStrength ?? 0.28;
    const offsetY = options.offsetY ?? 0;
    const drawY = y + offsetY;
    const depth = Math.max(3, Math.round(size * 0.14));
    const innerInset = Math.max(2, Math.round(size * 0.1));
    const corner = Math.max(6, Math.round(size * 0.24));
    const usesTemplateSprite =
      !!sprite && (
        usesSourceSprite || (
          !!this.blockTemplateImage &&
          this.blockTemplateImage.complete &&
          this.blockTemplateImage.naturalWidth > 0 &&
          this.blockTemplateImage.naturalHeight > 0
        )
      );

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.fillStyle = `rgba(10, 14, 10, ${shadowOpacity + (usesTemplateSprite ? 0.02 : 0.04)})`;
    roundedRect(ctx, x + 1, drawY + depth + (usesTemplateSprite ? 1 : 3), size - 2, size - 1, corner);
    ctx.fill();

    if (sprite) {
      ctx.drawImage(sprite, x, drawY, size, size);
    } else {
      roundedRect(ctx, x, drawY, size, size, corner);
      ctx.fillStyle = baseColor;
      ctx.fill();
    }

    if (usesTemplateSprite) {
      ctx.restore();
      return;
    }

    // Bottom face only (no right shift), to keep the block aligned.
    roundedRect(ctx, x, drawY + depth, size, size - depth, corner);
    const sideGrad = ctx.createLinearGradient(x, drawY + depth, x, drawY + size);
    sideGrad.addColorStop(0, "rgba(0, 0, 0, 0.12)");
    sideGrad.addColorStop(1, "rgba(0, 0, 0, 0.32)");
    ctx.fillStyle = sideGrad;
    ctx.fill();

    roundedRect(ctx, x, drawY, size, size, corner);
    const faceGrad = ctx.createLinearGradient(x, drawY, x + size, drawY + size);
    faceGrad.addColorStop(0, `rgba(255, 255, 255, ${0.24 + bevelStrength * 0.2})`);
    faceGrad.addColorStop(0.48, "rgba(255, 255, 255, 0.06)");
    faceGrad.addColorStop(1, `rgba(0, 0, 0, ${0.2 + bevelStrength * 0.22})`);
    ctx.fillStyle = faceGrad;
    ctx.fill();

    // Inner cap for "puffy" 3D tile look like in your reference.
    roundedRect(
      ctx,
      x + innerInset,
      drawY + innerInset,
      size - innerInset * 2,
      size - innerInset * 2,
      Math.max(4, corner - 3)
    );
    const capGrad = ctx.createLinearGradient(x, drawY, x + size, drawY + size);
    capGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    capGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.08)");
    capGrad.addColorStop(1, "rgba(0, 0, 0, 0.18)");
    ctx.fillStyle = capGrad;
    ctx.fill();

    ctx.lineWidth = 1;
    roundedRect(ctx, x + 0.5, drawY + 0.5, size - 1, size - 1, corner - 0.5);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.26 + bevelStrength * 0.2})`;
    ctx.stroke();
    roundedRect(ctx, x + 1.5, drawY + 1.5, size - 3, size - 3, corner - 1.5);
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.28 + bevelStrength * 0.24})`;
    ctx.stroke();

    ctx.restore();
  }

  drawDestroyedBlocks(ctx) {
    this.ensureBlockFieldLayerFresh();
    if (this.blockFieldLayer) {
      ctx.drawImage(this.blockFieldLayer, 0, 0);
    } else {
      for (const block of this.blocks) {
        if (!block.alive) {
          continue;
        }
        this.drawVolumetricBlock(ctx, block, block.x, block.y, {
          alpha: 0.96,
          shadowOpacity: 0.22,
          bevelStrength: 0.26,
          offsetY: 0,
        });
      }
    }

    if (this.blockWaves.length > 0) {
      const movedBlocks = [];
      for (const block of this.blocks) {
        if (!block.alive) {
          continue;
        }
        const waveOffsetY = this.getBlockWaveOffsetY(block);
        if (Math.abs(waveOffsetY) < WAVE_OFFSET_VISUAL_EPSILON) {
          continue;
        }
        movedBlocks.push({ block, waveOffsetY });
      }

      if (movedBlocks.length > 0) {
        for (const item of movedBlocks) {
          const block = item.block;
          const patchPad = Math.max(2, Math.ceil(block.size * 0.2));
          const srcX = Math.max(0, Math.floor(block.x - patchPad));
          const srcY = Math.max(0, Math.floor(block.y - patchPad));
          const srcW = Math.min(this.width - srcX, Math.ceil(block.size + patchPad * 2));
          const srcH = Math.min(this.height - srcY, Math.ceil(block.size + patchPad * 2));
          if (srcW <= 0 || srcH <= 0) {
            continue;
          }
          if (this.staticSceneLayer) {
            ctx.drawImage(this.staticSceneLayer, srcX, srcY, srcW, srcH, srcX, srcY, srcW, srcH);
          }
        }

        for (const item of movedBlocks) {
          this.drawVolumetricBlock(ctx, item.block, item.block.x, item.block.y, {
            alpha: 0.96,
            shadowOpacity: 0.22,
            bevelStrength: 0.26,
            offsetY: item.waveOffsetY,
          });
        }
      }
    }

    for (const block of this.blocks) {
      if (!block.alive || block.hitFlash <= 0) {
        continue;
      }
      ctx.save();
      ctx.globalAlpha = block.hitFlash * 0.25;
      const flashRgb = this.getColorSampleForColorKey(block.color) || BLOCK_COLOR_TO_RGB.green;
      ctx.fillStyle = `rgb(${flashRgb.r}, ${flashRgb.g}, ${flashRgb.b})`;
      const waveOffsetY = this.getBlockWaveOffsetY(block);
      roundedRect(ctx, block.x, block.y + waveOffsetY, block.size, block.size, 8);
      ctx.fill();
      ctx.restore();
    }
  }

  getBlockWaveOffsetY(block) {
    if (!block || !block.alive || this.blockWaves.length === 0) {
      return 0;
    }
    const center = this.blockCenter(block);
    let offset = 0;
    for (const wave of this.blockWaves) {
      const t = 1 - wave.life / wave.maxLife;
      const waveRadius = lerp(wave.startR, wave.endR, easeOutCubic(t));
      const d = Math.hypot(center.x - wave.x, center.y - wave.y);
      const influence = 1 - Math.abs(d - waveRadius) / wave.bandWidth;
      if (influence <= 0) {
        continue;
      }
      offset += -wave.jumpHeight * influence * (1 - t);
    }
    return offset;
  }

  drawTargetSilhouette(ctx) {
    const targets = this.getContourGhostTargets();
    if (targets.length === 0) {
      return;
    }

    const now = performance.now();
    const globalPulse = 0.5 + 0.5 * Math.sin(now * 0.0042);
    for (let index = 0; index < targets.length; index += 1) {
      const target = targets[index];
      const isBlackTarget = String(target.color || "").toLowerCase() === "black";
      const colorGhostAlphaMul = isBlackTarget ? 1 : 0.58;
      const localPulse = 0.5 + 0.5 * Math.sin(now * 0.005 + index * 0.47);
      const pulse = 0.65 * globalPulse + 0.35 * localPulse;
      const centerX = target.x + target.size * 0.5;
      const centerY = target.y + target.size * 0.5;
      const alphaBase = (0.62 + 0.24 * pulse) * colorGhostAlphaMul;
      const glowAlpha = (0.22 * alphaBase) * (0.92 + 0.3 * pulse);
      const glowRadius = target.size * (0.82 + 0.18 * pulse);
      const growScale = 0.95 + 0.12 * pulse;
      const liftY = -target.size * (0.015 + 0.03 * pulse);

      ctx.save();
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY + target.size * 0.16,
        0,
        centerX,
        centerY + target.size * 0.16,
        glowRadius
      );
      glowGradient.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha.toFixed(3)})`);
      glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glowGradient;
      roundedRect(
        ctx,
        target.x - target.size * 0.18,
        target.y + target.size * 0.16,
        target.size * 1.36,
        target.size * 1.08,
        Math.max(8, target.size * 0.32)
      );
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(growScale, growScale);
      ctx.translate(-centerX, -centerY + liftY);
      this.drawVolumetricBlock(ctx, target, target.x, target.y, {
        alpha: 0.78 * alphaBase,
        shadowOpacity: 0.14,
        bevelStrength: 0.18,
      });
      roundedRect(ctx, target.x + 0.5, target.y + 0.5, target.size - 1, target.size - 1, 8);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${(0.62 * alphaBase).toFixed(3)})`;
      ctx.stroke();
      ctx.restore();
    }
  }

  drawLevelStartFade(ctx) {
    if (this.levelStartFade <= 0.001) {
      return;
    }
    const t = clamp(this.levelStartFade, 0, 1);
    const alpha = t * t * 0.78;
    ctx.save();
    // Draw fade in screen space so it covers the full canvas, not just viewport frame.
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    ctx.restore();
  }

  drawUnitsOnTrack(ctx) {
    const unitsByDepth = this.units
      .filter((unit) => unit.alive)
      .slice()
      .sort((a, b) => {
        if (a.position.y !== b.position.y) {
          return a.position.y - b.position.y;
        }
        return a.id - b.id;
      });
    for (const unit of unitsByDepth) {
      const drawX = unit.position.x;
      const drawY = unit.position.y;
      const shotScale = unit.getShotScale();
      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.scale(shotScale, shotScale);
      if (unit.state === "moving") {
        const targetAngle = this.getTrackSideFacingAngle(unit.position);
        const currentAngle = Number.isFinite(unit.renderRotation)
          ? unit.renderRotation
          : targetAngle;
        const delta = Math.atan2(
          Math.sin(targetAngle - currentAngle),
          Math.cos(targetAngle - currentAngle)
        );
        const nextAngle = currentAngle + delta * 0.22;
        unit.renderRotation = nextAngle;
        ctx.rotate(nextAngle);
      }
      ctx.translate(-drawX, -drawY);
      if (!this.drawUnitChicken(ctx, unit)) {
        this.drawUnitBlock(ctx, drawX, drawY, UNIT_BLOCK_SIZE, unit.color, 1);
        this.drawAmmoOnBlock(ctx, drawX, drawY, unit.ammo, 30);
      }
      ctx.restore();
    }
  }

  drawSlotState(ctx) {
    const visualLiftY = this.getSlotVisualLiftY();
    for (const slot of LAYOUT.slots) {
      const image = this.slotCellImage;
      const fitSize = Math.round(Math.min(slot.w, slot.h) * 0.9);
      const drawX = Math.round(slot.x + (slot.w - fitSize) * 0.5);
      const drawY = Math.round(slot.y + (slot.h - fitSize) * 0.5 - visualLiftY);
      if (image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, drawX, drawY, fitSize, fitSize);
        ctx.restore();
        continue;
      }

      ctx.save();
      ctx.fillStyle = "rgba(85, 49, 27, 0.8)";
      roundedRect(ctx, drawX, drawY, fitSize, fitSize, Math.round(fitSize * 0.16));
      ctx.fill();
      ctx.restore();
    }
  }

  drawUnitBlock(ctx, x, y, size, color, alpha = 1) {
    const drawX = x - size * 0.5;
    const drawY = y - size * 0.5;
    const proxyBlock = { color, size };
    this.drawVolumetricBlock(ctx, proxyBlock, drawX, drawY, {
      alpha,
      shadowOpacity: 0.28,
      bevelStrength: 0.32,
    });
  }

  drawWagonLayer(ctx) {
    void ctx;
  }

  drawBottomCleanup(ctx) {
    const rect = this.getBottomQueueUnderlayRect();
    if (!rect) {
      return;
    }

    const woodImage = this.woodImage;
    if (woodImage && woodImage.complete && woodImage.naturalWidth > 0 && woodImage.naturalHeight > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(woodImage, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
      return;
    }

    // Fallback if image is not yet loaded.
    ctx.save();
    roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
    ctx.fillStyle = "#8f5127";
    ctx.fill();
    ctx.restore();
  }

  drawAmmoOnBlock(ctx, x, y, value, baseFontSize = 30) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = COLORS.white;
    const text = String(value);
    const digits = text.length;
    const fontSize = digits >= 4 ? Math.round(baseFontSize * 0.68) : digits === 3 ? Math.round(baseFontSize * 0.82) : baseFontSize;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.82)";
    ctx.lineWidth = Math.max(4, Math.round(fontSize * 0.22));
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.font = `900 ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(text, x, y + 1);
    ctx.fillText(text, x, y + 1);
    ctx.restore();
  }

  drawAmmoOnChicken(ctx, x, y, value, baseFontSize = 30) {
    ctx.save();
    const text = String(value);
    const digits = text.length;
    const fontSize = digits >= 4 ? Math.round(baseFontSize * 0.62) : digits === 3 ? Math.round(baseFontSize * 0.76) : baseFontSize;
    ctx.font = `900 ${fontSize}px "Baloo 2", "Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = Math.max(5, Math.round(fontSize * 0.28));
    ctx.fillStyle = "#ffffff";
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawChickenSprite(ctx, centerX, centerY, color, ammo, options = {}) {
    const colorKey = this.resolveChickenSpriteColorKey(color);
    const sprite = this.sprites.chickenByColor?.[colorKey];
    if (!sprite || !sprite.width || !sprite.height) {
      return false;
    }
    const size = Math.max(1, options.size ?? UNIT_BLOCK_SIZE * 1.25);
    const scaleMul = Math.max(0.1, options.scaleMul ?? 1);
    const anchorY = options.anchorY ?? 0.53;
    const numberYRatio = options.numberYRatio ?? 0.44;
    const fontBase = options.fontBase ?? 38;
    const fitScale = Math.min((size * scaleMul) / sprite.width, (size * scaleMul) / sprite.height);
    const drawW = sprite.width * fitScale;
    const drawH = sprite.height * fitScale;
    const drawX = centerX - drawW * 0.5;
    const drawY = centerY - drawH * anchorY;
    const numberY = drawY + drawH * numberYRatio;

    ctx.save();
    const prevSmoothing = ctx.imageSmoothingEnabled;
    const prevSmoothingQuality = ctx.imageSmoothingQuality;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(sprite, drawX, drawY, drawW, drawH);
    ctx.imageSmoothingQuality = prevSmoothingQuality;
    ctx.imageSmoothingEnabled = prevSmoothing;

    this.drawAmmoOnChicken(ctx, centerX, numberY, ammo, fontBase * scaleMul);
    ctx.restore();
    return true;
  }

  drawUnitChicken(ctx, unit) {
    return this.drawChickenSprite(
      ctx,
      unit.position.x,
      unit.position.y,
      unit.color,
      unit.ammo,
      {
        size: UNIT_BLOCK_SIZE * 1.95,
        scaleMul: CHICKEN_SIZE_SCALE,
        anchorY: 0.53,
        numberYRatio: 0.452,
        fontBase: 35,
      }
    );
  }

  drawQueueChicken(ctx, card, queueScale = 1) {
    const center = this.getCardPigCenter(card);
    const queueLiftY = this.getQueueVisualLiftY();
    const maxW = card.w * 0.9;
    const maxH = card.h * 0.78;
    const fitSize = Math.min(maxW, maxH) * Math.max(0.1, queueScale);
    return this.drawChickenSprite(ctx, center.x, center.y - queueLiftY, card.color, card.ammo, {
      size: fitSize,
      scaleMul: CHICKEN_SIZE_SCALE,
      anchorY: 0.53,
      numberYRatio: 0.452,
      fontBase: 39,
    });
  }

  drawFrontQueueCard(ctx, card, queueScale = 1) {
    const centerX = card.x + card.w * 0.5;
    const centerY = card.y + card.h * 0.5 - this.getQueueVisualLiftY();
    const scale = Math.max(0.1, queueScale);
    const bodyW = card.w * 0.72 * scale;
    const bodyH = card.h * 0.52 * scale;
    const bodyX = centerX - bodyW * 0.5;
    const bodyY = centerY - bodyH * 0.5 + card.h * 0.02;
    const nubW = Math.max(12, bodyW * 0.13);
    const nubH = Math.max(16, bodyH * 0.36);
    const legW = Math.max(10, bodyW * 0.12);
    const legH = Math.max(7, bodyH * 0.13);
    const legY = bodyY + bodyH - 1;

    ctx.save();

    ctx.fillStyle = "#f0d05e";
    roundedRect(ctx, bodyX - nubW + 4, centerY - nubH * 0.5, nubW, nubH, 7);
    ctx.fill();
    roundedRect(ctx, bodyX + bodyW - 4, centerY - nubH * 0.5, nubW, nubH, 7);
    ctx.fill();

    const grad = ctx.createLinearGradient(0, bodyY, 0, bodyY + bodyH);
    grad.addColorStop(0, "#f9e889");
    grad.addColorStop(0.48, "#f0d357");
    grad.addColorStop(1, "#ddb63f");
    ctx.fillStyle = grad;
    roundedRect(ctx, bodyX, bodyY, bodyW, bodyH, 12);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.26)";
    roundedRect(ctx, bodyX + 4, bodyY + 3, bodyW - 8, bodyH * 0.24, 7);
    ctx.fill();

    ctx.fillStyle = "#ef6b44";
    roundedRect(ctx, bodyX + bodyW * 0.2 - legW * 0.5, legY, legW, legH, 3);
    ctx.fill();
    roundedRect(ctx, bodyX + bodyW * 0.8 - legW * 0.5, legY, legW, legH, 3);
    ctx.fill();

    ctx.strokeStyle = "rgba(85, 49, 20, 0.35)";
    ctx.lineWidth = 1.2;
    roundedRect(ctx, bodyX + 0.6, bodyY + 0.6, bodyW - 1.2, bodyH - 1.2, 11.2);
    ctx.stroke();

    this.drawAmmoOnBlock(ctx, centerX, bodyY + bodyH * 0.56, card.ammo, 36 * scale);
    ctx.restore();
    return true;
  }

  drawCardState(ctx) {
    const queueLiftY = this.getQueueVisualLiftY();
    const cardsToDraw = [...this.cards].sort((a, b) => a.row - b.row);
    for (const card of cardsToDraw) {
      if (card.used) {
        continue;
      }
      const queueScale = clamp(card.queueScale || 1, 0.88, 1.12);
      if (!this.drawQueueChicken(ctx, card, queueScale)) {
        const center = this.getCardPigCenter(card);
        this.drawUnitBlock(ctx, center.x, center.y - queueLiftY, UNIT_BLOCK_SIZE * queueScale, card.color, 1);
        this.drawAmmoOnBlock(ctx, center.x, center.y - queueLiftY, card.ammo, 30 * queueScale);
      }
    }
  }

  drawTapDebug(ctx) {
    if (!SHOW_TAP_DEBUG) {
      return;
    }

    ctx.save();
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);

    for (const lane of this.getFrontLaneIds()) {
      const card = this.getActiveFrontCardInLane(lane);
      if (!card) {
        continue;
      }

      const center = this.getCardPigCenter(card);
      const visualLiftY = this.getQueueVisualLiftY();
      ctx.strokeStyle = "rgba(255, 80, 80, 0.95)";
      ctx.beginPath();
      ctx.arc(center.x, center.y - visualLiftY, SHOOTER_HIT_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255, 80, 80, 0.95)";
    for (const unit of this.units) {
      if (!unit.alive || unit.state !== "parked" || unit.ammo <= 0) {
        continue;
      }
      ctx.beginPath();
      ctx.arc(unit.position.x, unit.position.y, PARKED_UNIT_TAP_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.restore();
  }

  drawDebugPaintOverlay(ctx) {
    if (!this.debugPaintModeEnabled) {
      return;
    }
    const fieldW = LAYOUT.fieldCols * LAYOUT.fieldStep;
    const fieldH = LAYOUT.fieldRows * LAYOUT.fieldStep;
    const image = this.debugGeneratedSourceImage?.image || null;
    if (image) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, LAYOUT.fieldX, LAYOUT.fieldY, fieldW, fieldH);
      ctx.restore();
    }

    ctx.save();
    for (let row = 0; row < LAYOUT.fieldRows; row++) {
      for (let col = 0; col < LAYOUT.fieldCols; col++) {
        const color = this.getCellColor(col, row);
        const x = LAYOUT.fieldX + col * LAYOUT.fieldStep;
        const y = LAYOUT.fieldY + row * LAYOUT.fieldStep;
        if (color) {
          const sprite = this.sprites[`${color}Tile`] || null;
          if (sprite) {
            ctx.globalAlpha = 1;
            ctx.drawImage(sprite, x, y, LAYOUT.cellSize, LAYOUT.cellSize);
          }
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, LAYOUT.cellSize - 1, LAYOUT.cellSize - 1);
      }
    }

    if (this.debugPaintHoverCell) {
      const x = LAYOUT.fieldX + this.debugPaintHoverCell.col * LAYOUT.fieldStep;
      const y = LAYOUT.fieldY + this.debugPaintHoverCell.row * LAYOUT.fieldStep;
      ctx.strokeStyle = this.debugPaintTool === "erase" ? "rgba(255, 108, 108, 0.95)" : "rgba(122, 233, 255, 0.95)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, LAYOUT.cellSize - 2, LAYOUT.cellSize - 2);
    }
    ctx.restore();
  }

  drawProjectiles(ctx) {
    for (const projectile of this.projectiles) {
      const projectilePalette = getBlockColorConfig(projectile.color).projectile;
      const bulletCoreColor = projectilePalette.core;
      const bulletLightColor = projectilePalette.light;
      const fade = projectile.maxLife > 0 ? projectile.life / projectile.maxLife : 0;
      const progress = easeOutCubic(1 - fade);
      const blockSize = LAYOUT.cellSize * 0.78;
      const blockSprite = this.sprites[`${projectile.color}Tile`] || null;
      const dx = projectile.toX - projectile.fromX;
      const dy = projectile.toY - projectile.fromY;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const headX = projectile.fromX + dx * progress;
      const headY = projectile.fromY + dy * progress;
      const trailLengthPx = Math.min(dist * 0.84, 220);
      const trailBackProgress = Math.max(0, progress - trailLengthPx / dist);
      ctx.save();
      const tailX = projectile.fromX + dx * trailBackProgress;
      const tailY = projectile.fromY + dy * trailBackProgress;

      const glow = ctx.createLinearGradient(tailX, tailY, headX, headY);
      glow.addColorStop(0, "rgba(255,255,255,0)");
      glow.addColorStop(0.55, projectilePalette.glowMid);
      glow.addColorStop(1, projectilePalette.glowEnd);
      ctx.globalAlpha = 0.9 * fade;
      ctx.strokeStyle = glow;
      ctx.lineCap = "round";
      ctx.lineWidth = BULLET_RADIUS * 2.7;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      ctx.globalAlpha = 0.95 * fade;
      ctx.strokeStyle = bulletLightColor;
      ctx.lineWidth = BULLET_RADIUS * 1.25;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      const trailSamples = 16;
      for (let i = 0; i < trailSamples; i++) {
        const t = i / Math.max(1, trailSamples - 1);
        const segT = lerp(trailBackProgress, progress, t);
        const px = projectile.fromX + dx * segT;
        const py = projectile.fromY + dy * segT;
        const tailToHead = t;
        const size = blockSize * (0.22 + tailToHead * 0.62);
        ctx.globalAlpha = (0.05 + tailToHead * 0.48) * fade;
        if (blockSprite) {
          ctx.drawImage(blockSprite, px - size * 0.5, py - size * 0.5, size, size);
        } else {
          ctx.fillStyle = bulletCoreColor;
          roundedRect(ctx, px - size * 0.5, py - size * 0.5, size, size, 5);
          ctx.fill();
        }
      }

      const auraR = blockSize * (1.35 + (1 - fade) * 0.42);
      const aura = ctx.createRadialGradient(headX, headY, 0, headX, headY, auraR);
      aura.addColorStop(0, projectilePalette.auraInner);
      aura.addColorStop(0.4, projectilePalette.auraMid);
      aura.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = 0.95 * fade;
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(headX, headY, auraR, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.96 * fade;
      ctx.fillStyle = COLORS.blockShadow;
      roundedRect(ctx, headX - blockSize / 2 + 2, headY - blockSize / 2 + 3, blockSize, blockSize, 6);
      ctx.fill();
      if (blockSprite) {
        ctx.drawImage(blockSprite, headX - blockSize / 2, headY - blockSize / 2, blockSize, blockSize);
      } else {
        ctx.fillStyle = bulletCoreColor;
        roundedRect(ctx, headX - blockSize / 2, headY - blockSize / 2, blockSize, blockSize, 6);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawParticles(ctx) {
    if (this.particles.length === 0) {
      return;
    }
    ctx.save();
    for (const particle of this.particles) {
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
    }
    ctx.restore();
  }

  drawImpactFx(ctx) {
    if (this.impactRings.length > 0) {
      ctx.save();
    }
    for (const ring of this.impactRings) {
      const t = 1 - ring.life / ring.maxLife;
      const radius = lerp(ring.startR, ring.endR, easeOutCubic(t));
      ctx.globalAlpha = (1 - t) * 0.95;
      ctx.lineWidth = ring.lineWidth;
      ctx.strokeStyle = ring.color;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.impactRings.length > 0) {
      ctx.restore();
    }

    if (this.slotBursts.length > 0) {
      ctx.save();
    }
    for (const burst of this.slotBursts) {
      const t = 1 - burst.life / burst.maxLife;
      const radius = lerp(burst.r, burst.maxR, easeOutCubic(t));
      ctx.globalAlpha = (1 - t) * 0.58;
      const gradient = ctx.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, radius);
      gradient.addColorStop(0, burst.color);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    if (this.slotBursts.length > 0) {
      ctx.restore();
    }
  }

  drawFloatingTexts(ctx) {
    if (this.floatTexts.length === 0) {
      return;
    }
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = COLORS.textGlow;
    ctx.lineWidth = 6;
    for (const item of this.floatTexts) {
      const t = item.maxLife > 0 ? item.life / item.maxLife : 0;
      ctx.globalAlpha = t;
      ctx.font = `900 ${Math.round(46 * item.scale)}px Arial`;
      ctx.strokeText(item.text, item.x, item.y);
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, item.x, item.y);
    }
    ctx.restore();
  }

  drawConfetti(ctx) {
    for (const piece of this.confetti) {
      const alpha = Math.max(0, piece.life / piece.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size * 0.5, -piece.size * 0.25, piece.size, piece.size * 0.5);
      ctx.restore();
    }
  }

  drawBackButton(ctx) {
    if (!this.backButtonImage.complete || this.backButtonImage.naturalWidth === 0) {
      return;
    }

    const { x, y, w, h } = this.backButtonRect;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(this.backButtonImage, x, y, w, h);
    ctx.restore();
  }

  drawTopTimerPanel(ctx) {
    if (!this.timerPanelImage.complete || this.timerPanelImage.naturalWidth === 0) {
      return;
    }

    const panelW = TIMER_PANEL_UI.w;
    const panelH = TIMER_PANEL_UI.h;
    const panelX = (this.width - panelW) * 0.5;
    const panelY = TIMER_PANEL_UI.y;
    const textX = panelX + panelW * 0.5;
    const textY = panelY + panelH * 0.5 + 4;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.24)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(this.timerPanelImage, panelX, panelY, panelW, panelH);
    ctx.restore();

    ctx.save();
    ctx.font = getTopPanelFont();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 6;
    ctx.strokeStyle = TIMER_PANEL_UI.textStroke;
    ctx.fillStyle = TIMER_PANEL_UI.textColor;
    ctx.strokeText(TIMER_PANEL_UI.label, textX, textY);
    ctx.fillText(TIMER_PANEL_UI.label, textX, textY);
    ctx.restore();
  }

  drawTopCoinsPanel(ctx) {
    if (!this.restartButtonImage.complete || this.restartButtonImage.naturalWidth === 0) {
      return;
    }

    const panel = this.getRestartButtonRect();
    this.restartButtonRect = panel;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.drawImage(this.restartButtonImage, panel.x, panel.y, panel.w, panel.h);
    ctx.restore();
  }

  getRestartButtonRect() {
    const panelW = this.backButtonRect.w;
    const panelH = this.backButtonRect.h;
    const panelCenterX = this.width - COINS_UI.rightMargin - panelW * 0.5;
    const panelCenterY = this.backButtonRect.y + panelH * 0.5;
    return {
      x: panelCenterX - panelW * 0.5,
      y: panelCenterY - panelH * 0.5,
      w: panelW,
      h: panelH,
    };
  }

  getLoseTopStatsRects() {
    const sourceHeartW =
      this.loseTopHeartPanelImage?.naturalWidth > 0 ? this.loseTopHeartPanelImage.naturalWidth : 240;
    const sourceHeartH =
      this.loseTopHeartPanelImage?.naturalHeight > 0 ? this.loseTopHeartPanelImage.naturalHeight : 96;
    const sourceCoinsW =
      this.loseTopCoinsPanelImage?.naturalWidth > 0 ? this.loseTopCoinsPanelImage.naturalWidth : 244;
    const sourceCoinsH =
      this.loseTopCoinsPanelImage?.naturalHeight > 0 ? this.loseTopCoinsPanelImage.naturalHeight : 96;
    const baseHeight = LOSE_TOP_STATS_UI.targetHeight;
    const heartScale = baseHeight / sourceHeartH;
    const coinsScale = baseHeight / sourceCoinsH;
    let heartW = sourceHeartW * heartScale;
    let heartH = sourceHeartH * heartScale;
    let coinsW = sourceCoinsW * coinsScale;
    let coinsH = sourceCoinsH * coinsScale;
    let gap = LOSE_TOP_STATS_UI.gap;
    let totalW = heartW + coinsW + gap;
    const maxTotalW = Math.max(100, this.width - LOSE_TOP_STATS_UI.sidePadding * 2);
    const maxScaleFromWidth = maxTotalW / totalW;
    const scaled = clamp(maxScaleFromWidth, LOSE_TOP_STATS_UI.minScale, LOSE_TOP_STATS_UI.maxScale);
    heartW *= scaled;
    heartH *= scaled;
    coinsW *= scaled;
    coinsH *= scaled;
    gap *= scaled;
    totalW = heartW + coinsW + gap;
    const x = (this.width - totalW) * 0.5;
    const y = Math.max(14, TIMER_PANEL_UI.y + LOSE_TOP_STATS_UI.topOffset);
    return {
      heart: { x, y, w: heartW, h: heartH },
      coins: { x: x + heartW + gap, y, w: coinsW, h: coinsH },
    };
  }

  drawLoseTopStats(ctx, alpha = 1) {
    const heartsCountValue = resolveExternalHeartsCount(this);
    const heartsCount = String(heartsCountValue);
    const maxLivesCountValue = resolveExternalMaxLivesCount(this);
    const livesTimerText = resolveExternalLivesTimer(this);
    const isLivesFull = maxLivesCountValue > 0 && heartsCountValue >= maxLivesCountValue;
    const heartsTimerDisplayText = isLivesFull ? "full" : livesTimerText || "--:--";
    const coinsCount = String(this.getCurrentExternalCoinsCount());
    const { heart, coins } = this.getLoseTopStatsRects();

    const drawPanel = (image, rect, fallbackTop = "#dce8ff", fallbackBottom = "#b8cff5") => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(8, 14, 36, 0.26)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      if (image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
        ctx.imageSmoothingEnabled = true;
        if ("imageSmoothingQuality" in ctx) {
          ctx.imageSmoothingQuality = "high";
        }
        ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
      } else {
        const grad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
        grad.addColorStop(0, fallbackTop);
        grad.addColorStop(1, fallbackBottom);
        roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, Math.round(rect.h * 0.28));
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    };

    drawPanel(this.loseTopHeartPanelImage, heart, "#ff7b68", "#f04f44");
    drawPanel(this.loseTopCoinsPanelImage, coins, "#f5f9ff", "#d7e5ff");

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = LOSE_TOP_STATS_UI.heartTextColor;
    ctx.strokeStyle = LOSE_TOP_STATS_UI.heartTextStroke;
    ctx.lineWidth = Math.max(3, heart.h * 0.05);
    ctx.lineJoin = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.max(20, Math.round(heart.h * 0.44))}px "Open Sans", Arial, sans-serif`;
    const heartsX = heart.x + heart.w * LOSE_TOP_STATS_UI.heartTextXRatio;
    const heartsY = heart.y + heart.h * LOSE_TOP_STATS_UI.heartTextYRatio;
    ctx.strokeText(heartsCount, heartsX, heartsY);
    ctx.fillText(heartsCount, heartsX, heartsY);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = LOSE_TOP_STATS_UI.coinsTextColor;
    ctx.strokeStyle = LOSE_TOP_STATS_UI.coinsTextStroke;
    ctx.lineWidth = Math.max(2, heart.h * 0.045);
    ctx.lineJoin = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${Math.max(20, Math.round(heart.h * 0.32 * LOSE_TOP_STATS_UI.coinsTextFontScale))}px "Open Sans", Arial, sans-serif`;
    const livesTimerX = heart.x + heart.w * LOSE_TOP_STATS_UI.livesTimerTextXRatio + LOSE_TOP_STATS_UI.livesTimerTextOffsetX;
    const livesTimerY = heart.y + heart.h * LOSE_TOP_STATS_UI.livesTimerTextYRatio + LOSE_TOP_STATS_UI.livesTimerTextOffsetY;
    ctx.strokeText(heartsTimerDisplayText, livesTimerX, livesTimerY);
    ctx.fillText(heartsTimerDisplayText, livesTimerX, livesTimerY);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = LOSE_TOP_STATS_UI.coinsTextColor;
    ctx.strokeStyle = LOSE_TOP_STATS_UI.coinsTextStroke;
    ctx.lineWidth = Math.max(2, coins.h * 0.045);
    ctx.lineJoin = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${Math.max(20, Math.round(coins.h * 0.32 * LOSE_TOP_STATS_UI.coinsTextFontScale))}px "Open Sans", Arial, sans-serif`;
    const coinsX = coins.x + coins.w * LOSE_TOP_STATS_UI.coinsTextXRatio + LOSE_TOP_STATS_UI.coinsTextOffsetX;
    const coinsY = coins.y + coins.h * LOSE_TOP_STATS_UI.coinsTextYRatio + LOSE_TOP_STATS_UI.coinsTextOffsetY;
    ctx.strokeText(coinsCount, coinsX, coinsY);
    ctx.fillText(coinsCount, coinsX, coinsY);
    ctx.restore();
  }

  getLosePopupRect() {
    const targetScale = 1.1;
    let w = LOSE_POPUP_UI.w * targetScale;
    let h = LOSE_POPUP_UI.h * targetScale;
    const fitScale = Math.min((this.width * 0.96) / w, (this.height * 0.9) / h, 1);
    w *= fitScale;
    h *= fitScale;
    const centeredY = (this.height - h) * 0.5 - 60 + LOSE_POPUP_Y_OFFSET;
    const y = clamp(centeredY, 20, this.height - h - 20);
    return {
      x: (this.width - w) * 0.5,
      y,
      w,
      h,
    };
  }

  getLoseCloseRect(popupRect = null) {
    const popup = popupRect || this.getLosePopupRect();
    return {
      x: popup.x + popup.w - 76,
      y: popup.y + 16,
      w: 58,
      h: 58,
    };
  }

  getLoseButtonRects(popupRect = null) {
    const popup = popupRect || this.getLosePopupRect();
    const sx = popup.w / 646;
    const sy = popup.h / 663;
    const buttonScale = 0.9;
    const baseButtonW = 269 * sx;
    const baseButtonH = 114 * sy;
    const buttonW = baseButtonW * buttonScale;
    const buttonH = baseButtonH * buttonScale;
    const baseButtonY = popup.y + popup.h - 174 * sy;
    const buttonY = baseButtonY + (baseButtonH - buttonH) * 0.5;
    const targetGap = 25 * sx;
    const sideInset = (popup.w - baseButtonW - buttonW - targetGap) * 0.5;
    const left = {
      x: popup.x + sideInset + (baseButtonW - buttonW) * 0.5,
      y: buttonY,
      w: buttonW,
      h: buttonH,
    };
    const right = {
      x: popup.x + popup.w - sideInset - baseButtonW + (baseButtonW - buttonW) * 0.5,
      y: buttonY,
      w: buttonW,
      h: buttonH,
    };
    return { left, right };
  }

  getLoseOfferRects(popupRect = null) {
    const popup = popupRect || this.getLosePopupRect();
    const sourceOfferW = this.loseOfferImage?.naturalWidth > 0 ? this.loseOfferImage.naturalWidth : LOSE_OFFER_UI.fallbackW;
    const sourceOfferH = this.loseOfferImage?.naturalHeight > 0 ? this.loseOfferImage.naturalHeight : LOSE_OFFER_UI.fallbackH;
    const sourceButtonW = this.loseOfferPurchaseButtonImage?.naturalWidth > 0
      ? this.loseOfferPurchaseButtonImage.naturalWidth
      : LOSE_OFFER_UI.fallbackButtonW;
    const sourceButtonH = this.loseOfferPurchaseButtonImage?.naturalHeight > 0
      ? this.loseOfferPurchaseButtonImage.naturalHeight
      : LOSE_OFFER_UI.fallbackButtonH;
    const sidePadding = LOSE_OFFER_UI.sidePadding;
    const gap = LOSE_OFFER_UI.gapFromPopupBottom;
    let offerW = Math.min(
      popup.w * LOSE_OFFER_UI.widthToPopupRatio * LOSE_OFFER_UI.scale,
      this.width - sidePadding * 2
    );
    let offerH = offerW * (sourceOfferH / sourceOfferW);
    const offerRect = {
      x: (this.width - offerW) * 0.5,
      y: popup.y + popup.h + gap,
      w: offerW,
      h: offerH,
    };
    const buttonW = offerRect.w * LOSE_OFFER_UI.buttonWidthRatio;
    const buttonH = buttonW * (sourceButtonH / sourceButtonW);
    const buttonRect = {
      x: offerRect.x + (offerRect.w - buttonW) * 0.5,
      y: offerRect.y + offerRect.h - buttonH * LOSE_OFFER_UI.buttonBottomOverlapFactor + LOSE_OFFER_UI.buttonOffsetY,
      w: buttonW,
      h: buttonH,
    };
    return { offer: offerRect, button: buttonRect };
  }

  shouldShowLoseOffer() {
    return !resolveExternalSubscriptionStatus(this);
  }

  drawLoseBirdRow(ctx, popupX, popupY, popupW, popupH, alpha = 1) {
    const sx = popupW / 646;
    const sy = popupH / 663;
    if (!this.losePopupBirdsImage.complete || this.losePopupBirdsImage.naturalWidth <= 0) {
      return;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    const x = popupX + 128 * sx;
    const y = popupY + 244 * sy * (1 - LOSE_POPUP_BIRDS_DROP_RATIO) + 52 * sy;
    const w = 390 * sx;
    const h = 158 * sy;
    ctx.drawImage(this.losePopupBirdsImage, x, y, w, h);
    ctx.restore();
  }

  drawLoseSpaceBadge(ctx, centerX, centerY, width, height) {
    const badgeX = centerX - width * 0.5;
    const badgeY = centerY - height * 0.5;

    ctx.save();
    ctx.shadowColor = "rgba(18, 46, 120, 0.2)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    const panelGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + height);
    panelGrad.addColorStop(0, "#d7e4fb");
    panelGrad.addColorStop(1, "#c3d1ee");
    roundedRect(ctx, badgeX, badgeY, width, height, 24);
    ctx.fillStyle = panelGrad;
    ctx.fill();
    ctx.restore();

    const conveyorX = badgeX + 34;
    const conveyorY = badgeY + 98;
    const conveyorW = width - 68;
    const conveyorH = 54;
    ctx.save();
    const conveyorGrad = ctx.createLinearGradient(conveyorX, conveyorY, conveyorX, conveyorY + conveyorH);
    conveyorGrad.addColorStop(0, "#5f6885");
    conveyorGrad.addColorStop(1, "#313a57");
    roundedRect(ctx, conveyorX, conveyorY, conveyorW, conveyorH, 20);
    ctx.fillStyle = conveyorGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const rollerX = conveyorX + 32 + i * ((conveyorW - 64) / 4);
      ctx.beginPath();
      ctx.arc(rollerX, conveyorY + conveyorH * 0.5, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#1d2339";
      ctx.fill();
    }
    ctx.restore();

    const slotW = 64;
    const slotH = 74;
    const slotGap = 18;
    const slotsX = centerX - (slotW * 3 + slotGap * 2) * 0.5;
    const slotsY = badgeY + 28;
    for (let i = 0; i < 3; i++) {
      const slotX = slotsX + i * (slotW + slotGap);
      ctx.save();
      ctx.fillStyle = "#223054";
      roundedRect(ctx, slotX, slotsY, slotW, slotH, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      const orbGrad = ctx.createLinearGradient(slotX, slotsY, slotX, slotsY + slotH);
      orbGrad.addColorStop(0, "#ffb65f");
      orbGrad.addColorStop(1, "#ff6b57");
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(slotX + slotW * 0.5, slotsY + slotH * 0.54, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = "#ff8d4e";
    ctx.beginPath();
    ctx.moveTo(centerX, badgeY + 172);
    ctx.lineTo(centerX - 24, badgeY + 214);
    ctx.lineTo(centerX + 24, badgeY + 214);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NO ROOM", centerX, badgeY + 244);
    ctx.restore();
  }

  drawLoseButtons(ctx, popupX, popupY, popupW, popupH) {
    const popup = { x: popupX, y: popupY, w: popupW, h: popupH };
    const { left, right } = this.getLoseButtonRects(popup);
    const continueCost = this.getLoseContinueCoinsCost();
    const canContinueForCoins = this.canContinueFromLoseForCoins();
    const continueButtonAlpha = canContinueForCoins ? 1 : 0.46;
    const drawButton = (image, rect, alpha = 1, fallbackTop = "#7bcfff", fallbackBottom = "#4a95ef") => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(20, 38, 87, 0.24)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      if (image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
        ctx.imageSmoothingEnabled = true;
        if ("imageSmoothingQuality" in ctx) {
          ctx.imageSmoothingQuality = "high";
        }
        ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
      } else {
        const grad = ctx.createLinearGradient(0, rect.y, 0, rect.y + rect.h);
        grad.addColorStop(0, fallbackTop);
        grad.addColorStop(1, fallbackBottom);
        roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, Math.round(rect.h * 0.36));
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    };

    drawButton(
      this.loseCoinsButtonImage,
      left,
      continueButtonAlpha,
      canContinueForCoins ? "#9ce53f" : "#9ba7a5",
      canContinueForCoins ? "#53ca1c" : "#727f7b"
    );
    drawButton(this.loseAdsButtonImage, right, 1, "#7bcfff", "#4a95ef");

    ctx.save();
    const textAreaStartRatio = 0.46;
    const leftFontSize = Math.max(16, Math.round(left.h * 0.3744));
    ctx.font = `800 ${leftFontSize}px "Open Sans", Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = continueButtonAlpha;
    const leftTextX = left.x + left.w * (textAreaStartRatio + (1 - textAreaStartRatio) * 0.5) - 25;
    const leftTextY = left.y + left.h * 0.5 - 7.5;
    ctx.fillText(String(continueCost), leftTextX, leftTextY);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#ffffff";
    const rightFontSize = Math.max(14, Math.round(right.h * 0.36));
    ctx.font = `800 ${rightFontSize}px "Open Sans", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const rightTextX = right.x + right.w * (textAreaStartRatio + (1 - textAreaStartRatio) * 0.5) - 25;
    const rightTextY = right.y + right.h * 0.5 - 7.5;
    ctx.fillText("FREE", rightTextX, rightTextY);
    ctx.restore();
  }

  drawLoseOffer(ctx, popupRect, alpha = 1) {
    const { offer, button } = this.getLoseOfferRects(popupRect);
    this.loseOfferPurchaseRect = button;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "rgba(12, 19, 44, 0.26)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;
    if (this.loseOfferImage.complete && this.loseOfferImage.naturalWidth > 0 && this.loseOfferImage.naturalHeight > 0) {
      ctx.imageSmoothingEnabled = true;
      if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = "high";
      }
      ctx.drawImage(this.loseOfferImage, offer.x, offer.y, offer.w, offer.h);
    } else {
      const fallbackGrad = ctx.createLinearGradient(offer.x, offer.y, offer.x, offer.y + offer.h);
      fallbackGrad.addColorStop(0, "#f6c451");
      fallbackGrad.addColorStop(1, "#ef8d32");
      roundedRect(ctx, offer.x, offer.y, offer.w, offer.h, Math.round(offer.h * 0.14));
      ctx.fillStyle = fallbackGrad;
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    if (
      this.loseOfferPurchaseButtonImage.complete &&
      this.loseOfferPurchaseButtonImage.naturalWidth > 0 &&
      this.loseOfferPurchaseButtonImage.naturalHeight > 0
    ) {
      ctx.imageSmoothingEnabled = true;
      if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = "high";
      }
      ctx.drawImage(this.loseOfferPurchaseButtonImage, button.x, button.y, button.w, button.h);
    } else {
      const buttonGrad = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.h);
      buttonGrad.addColorStop(0, "#98e24f");
      buttonGrad.addColorStop(1, "#60be2f");
      roundedRect(ctx, button.x, button.y, button.w, button.h, Math.round(button.h * 0.42));
      ctx.fillStyle = buttonGrad;
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `800 ${Math.max(18, Math.round(button.h * 0.44))}px "Open Sans", Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Get now!", button.x + button.w * 0.5, button.y + button.h * 0.52);
    }
    ctx.restore();
  }

  drawLosePopup(ctx) {
    const popup = this.getLosePopupRect();
    const animT = clamp(this.losePopupAppear, 0, 1);
    const fade = easeOutCubic(animT);
    const scale = 0.86 + 0.14 * easeOutBack(animT);
    const lift = (1 - fade) * 26;
    const centerX = popup.x + popup.w * 0.5;
    const centerY = popup.y + popup.h * 0.5 + lift;
    const drawRect = {
      x: centerX - (popup.w * scale) * 0.5,
      y: centerY - (popup.h * scale) * 0.5,
      w: popup.w * scale,
      h: popup.h * scale,
    };
    this.loseCloseRect = this.getLoseCloseRect(drawRect);
    const loseButtons = this.getLoseButtonRects(drawRect);
    this.loseContinueRect = loseButtons.left;
    this.loseFreeRect = loseButtons.right;
    if (this.shouldShowLoseOffer()) {
      const loseOfferRects = this.getLoseOfferRects(drawRect);
      this.loseOfferPurchaseRect = loseOfferRects.button;
    } else {
      this.loseOfferPurchaseRect = { x: 0, y: 0, w: 0, h: 0 };
    }

    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = `rgba(7, 14, 28, ${0.74 * fade})`;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    ctx.restore();
    this.drawLoseTopStats(ctx, fade);

    if (this.losePopupImage.complete && this.losePopupImage.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.42 * fade;
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 34;
      ctx.shadowOffsetY = 12;
      roundedRect(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h, Math.max(20, drawRect.w * 0.05));
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = fade;
      ctx.imageSmoothingEnabled = true;
      if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = "high";
      }
      ctx.drawImage(this.losePopupImage, drawRect.x, drawRect.y, drawRect.w, drawRect.h);
      this.drawLoseBirdRow(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h, fade);
      this.drawLoseButtons(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h);
      if (this.shouldShowLoseOffer()) {
        this.drawLoseOffer(ctx, drawRect, fade);
      }
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.globalAlpha = 0.42 * fade;
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 12;
    roundedRect(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h, Math.max(20, drawRect.w * 0.05));
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.shadowColor = "rgba(19, 52, 110, 0.3)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 10;
    roundedRect(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h, LOSE_POPUP_UI.outerRadius);
    ctx.fillStyle = "#eef0f5";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = fade;
    roundedRect(ctx, drawRect.x + 3, drawRect.y + 3, drawRect.w - 6, drawRect.h - 6, LOSE_POPUP_UI.outerRadius - 2);
    ctx.strokeStyle = "#7ea4e5";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    const innerX = drawRect.x + LOSE_POPUP_UI.innerPadding;
    const innerY = drawRect.y + 136;
    const innerW = drawRect.w - LOSE_POPUP_UI.innerPadding * 2;
    const innerH = drawRect.h - 160;
    ctx.save();
    ctx.globalAlpha = fade;
    roundedRect(ctx, innerX, innerY, innerW, innerH, 22);
    ctx.fillStyle = "#c7d0e3";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#474a7a";
    ctx.font = "900 62px Arial";
    ctx.fillText("OUT OF SPACE!", drawRect.x + drawRect.w * 0.5, drawRect.y + 62);
    ctx.font = "700 28px Arial";
    ctx.fillStyle = "#2dac28";
    ctx.fillText("Clear conveyor and open up", drawRect.x + drawRect.w * 0.5, drawRect.y + 104);
    ctx.fillText("slots to keep playing!", drawRect.x + drawRect.w * 0.5, drawRect.y + 136);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#8ca3d1";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    const close = this.loseCloseRect;
    ctx.beginPath();
    ctx.moveTo(close.x + 12, close.y + 12);
    ctx.lineTo(close.x + close.w - 12, close.y + close.h - 12);
    ctx.moveTo(close.x + close.w - 12, close.y + 12);
    ctx.lineTo(close.x + 12, close.y + close.h - 12);
    ctx.stroke();
    ctx.restore();

    this.drawLoseSpaceBadge(ctx, drawRect.x + drawRect.w * 0.5, drawRect.y + 314, 430, 250);
    this.drawLoseButtons(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h);
    if (this.shouldShowLoseOffer()) {
      this.drawLoseOffer(ctx, drawRect, fade);
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    ctx.save();
    ctx.translate(this.viewportOffsetX, this.viewportOffsetY);
    ctx.scale(this.viewportScale, this.viewportScale);
    this.drawViewportBackdrop(ctx);

    if (this.gameState === "loading") {
      this.drawLoading(ctx);
      this.drawTopTimerPanel(ctx);
      this.drawTopCoinsPanel(ctx);
      this.drawBackButton(ctx);
      ctx.restore();
      this.needsRender = false;
      return;
    }

    if (this.gameState === "victory") {
      this.drawVictoryBackground(ctx);
      const fieldCenter = this.getFieldCenter();
      ctx.save();
      ctx.translate(fieldCenter.x, fieldCenter.y);
      ctx.scale(this.cameraZoom, this.cameraZoom);
      ctx.translate(-fieldCenter.x, -fieldCenter.y);
      this.drawVictoryArtwork(ctx);
      this.drawDebugPaintOverlay(ctx);
      ctx.restore();
      this.drawConfetti(ctx);
      this.drawTopTimerPanel(ctx);
      this.drawTopCoinsPanel(ctx);
      this.drawBackButton(ctx);
      this.drawLevelStartFade(ctx);
      ctx.restore();
      this.needsRender = false;
      return;
    }

    const fieldCenter = this.getFieldCenter();
    ctx.save();
    ctx.translate(fieldCenter.x, fieldCenter.y);
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(-fieldCenter.x, -fieldCenter.y);
    if (this.staticSceneLayer) {
      ctx.drawImage(this.staticSceneLayer, 0, 0);
    } else {
      this.drawBackground(ctx);
      this.drawWagonLayer(ctx);
    }
    this.drawBottomCleanup(ctx);
    this.drawSlotState(ctx);
    this.drawDestroyedBlocks(ctx);
    this.drawTargetSilhouette(ctx);
    this.drawProjectiles(ctx);
    this.drawImpactFx(ctx);
    this.drawParticles(ctx);
    this.drawFloatingTexts(ctx);
    this.drawCardState(ctx);
    this.drawUnitsOnTrack(ctx);
    this.drawTapDebug(ctx);
    this.drawDebugPaintOverlay(ctx);
    ctx.restore();
    this.drawConfetti(ctx);
    this.drawTopTimerPanel(ctx);
    this.drawTopCoinsPanel(ctx);
    this.drawBackButton(ctx);
    this.drawTutorialHand(ctx);
    this.drawLevelStartFade(ctx);
    if (this.gameState === "lose") {
      this.drawLosePopup(ctx);
    }
    ctx.restore();
    this.needsRender = false;
  }

  frame(timestamp) {
    if (!this.isLoopRunning) {
      return;
    }

    const dt = clamp((timestamp - this.lastTimestamp) / 1000, 0, MAX_SIMULATION_DT);
    this.lastTimestamp = timestamp;
    let animating = this.hasActiveAnimations();

    if (animating) {
      this.simAccumulator = Math.min(MAX_SIMULATION_DT, this.simAccumulator + dt);
      let steps = 0;
      const maxSteps = MAX_SIM_STEPS_PER_FRAME;
      while (this.simAccumulator >= FIXED_DT && steps < maxSteps) {
        this.update(FIXED_DT);
        this.simAccumulator -= FIXED_DT;
        steps += 1;
      }
      if (steps >= maxSteps) {
        this.simAccumulator = 0;
      }
      animating = this.hasActiveAnimations();
    } else {
      this.simAccumulator = 0;
    }

    if (this.needsRender || animating) {
      this.render();
    }

    if (this.hasActiveAnimations()) {
      requestAnimationFrame((t) => this.frame(t));
    } else {
      this.isLoopRunning = false;
    }
  }

  hasActiveAnimations() {
    if (this.gameState === "lose") {
      return this.losePopupAppear < 0.999 || this.levelStartFade > 0.001 || this.hasAnimatingCards();
    }
    const tutorialAnimating = this.tutorial?.active && this.getTutorialTapTarget() !== null;
    const hasActiveUnits = this.units.some((unit) => unit.alive && unit.state !== "parked");
    const targetPulseAnimating = this.gameState === "playing" && this.getContourGhostTargets().length > 0;
    const cardsAnimating = this.hasAnimatingCards();
    const zoomAnimating = Math.abs(this.cameraZoomTarget - this.cameraZoom) > 0.001;
    if (
      (this.gameState === "playing" && hasActiveUnits) ||
      targetPulseAnimating ||
      cardsAnimating ||
      this.projectiles.length > 0 ||
      this.particles.length > 0 ||
      this.impactRings.length > 0 ||
      this.blockWaves.length > 0 ||
      this.slotBursts.length > 0 ||
      this.floatTexts.length > 0 ||
      this.confetti.length > 0 ||
      this.victoryConfettiTime > 0 ||
      this.levelStartFade > 0.001 ||
      tutorialAnimating ||
      zoomAnimating
    ) {
      return true;
    }

    return this.blocks.some((block) => block.hitFlash > 0);
  }

  invalidate(animate = false) {
    this.needsRender = true;
    if (animate || this.hasActiveAnimations()) {
      if (!this.isLoopRunning) {
        this.isLoopRunning = true;
        const now = performance.now();
        this.lastTimestamp = now;
        this.simAccumulator = 0;
        requestAnimationFrame((t) => this.frame(t));
      }
    } else {
      this.render();
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.screenWidth = Math.max(1, Math.round(rect.width || window.innerWidth || this.width));
    this.screenHeight = Math.max(1, Math.round(rect.height || window.innerHeight || this.height));
    this.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.canvas.width = this.screenWidth * this.dpr;
    this.canvas.height = this.screenHeight * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.updateViewportTransform();
    this.applyDebugLayout();
  }

  hitTest(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  handlePointerMove(x, y) {
    if (this.debugPaintModeEnabled) {
      this.debugPaintHoverCell = this.getFieldCellAt(x, y);
      this.canvas.style.cursor = this.debugPaintHoverCell ? "crosshair" : "default";
      this.invalidate(false);
      return;
    }
    if (this.gameState === "playing" && this.tutorial?.active) {
      const overRestart = isInsideRect(x, y, this.restartButtonRect);
      const target = this.getTutorialTapTarget();
      this.canvas.style.cursor = overRestart || (target && this.isPointOnTutorialTarget(target, x, y))
        ? "pointer"
        : "default";
      return;
    }
    if (this.gameState === "lose") {
      const overClose = isInsideRect(x, y, this.loseCloseRect);
      const overContinue = this.canContinueFromLoseForCoins() && isInsideRect(x, y, this.loseContinueRect);
      const overFree = isInsideRect(x, y, this.loseFreeRect);
      const overOfferPurchase = this.shouldShowLoseOffer() && isInsideRect(x, y, this.loseOfferPurchaseRect);
      this.canvas.style.cursor = overClose || overContinue || overFree || overOfferPurchase ? "pointer" : "default";
      return;
    }
    if (this.gameState === "victory") {
      const overBack = isInsideRect(x, y, this.backButtonRect);
      const overRestart = isInsideRect(x, y, this.restartButtonRect);
      this.canvas.style.cursor = overBack || overRestart ? "pointer" : "default";
      return;
    }
    const overBack = isInsideRect(x, y, this.backButtonRect);
    const overRestart = isInsideRect(x, y, this.restartButtonRect);
    this.canvas.style.cursor = overBack || overRestart ? "pointer" : "default";
  }

  handlePointerDown(x, y) {
    if (this.debugPaintModeEnabled) {
      if (this.applyDebugPaintAt(x, y)) {
        this.invalidate(false);
      }
      return;
    }
    if (isInsideRect(x, y, this.restartButtonRect)) {
      this.restart();
      return;
    }
    if (this.gameState === "playing" && this.tutorial?.active) {
      const target = this.getTutorialTapTarget();
      if (!target || !this.isPointOnTutorialTarget(target, x, y)) {
        const anyCard = this.cardManager.findAnyTapTarget(x, y, {
          visualLiftY: this.getQueueVisualLiftY(),
        });
        if (anyCard) {
          this.playSound("cant_select");
        }
        return;
      }
      if (target.type === "card") {
        const didSpawn = this.spawnUnit(target.card.index);
        this.playSound(didSpawn ? "tap" : "cant_select");
        return;
      }
      if (target.type === "parkedUnit") {
        this.relaunchParkedUnit(target.unit);
      }
      return;
    }
    if (this.gameState === "lose") {
      if (isInsideRect(x, y, this.loseCloseRect)) {
        dispatchUnityCloseEvent(this);
      } else if (isInsideRect(x, y, this.loseContinueRect)) {
        if (!this.canContinueFromLoseForCoins()) {
          this.playSound("cant_select");
          return;
        }
        this.continueFromLoseWithOneSlot();
      } else if (isInsideRect(x, y, this.loseFreeRect)) {
        if (!this.continueFromLoseWithAd()) {
          this.playSound("cant_select");
        }
      } else if (this.shouldShowLoseOffer() && isInsideRect(x, y, this.loseOfferPurchaseRect)) {
        dispatchUnitySubscriptionRequestEvent();
      }
      return;
    }
    if (isInsideRect(x, y, this.backButtonRect)) {
      dispatchUnityCloseEvent(this);
      return;
    }
    if (this.gameState !== "playing") {
      return;
    }
    if (this.tryRelaunchParkedUnitAt(x, y)) {
      return;
    }
    const tapCard = this.cardManager.findTapTarget(x, y, {
      visualLiftY: this.getQueueVisualLiftY(),
    });
    if (tapCard) {
      const didSpawn = this.spawnUnit(tapCard.index);
      this.playSound(didSpawn ? "tap" : "cant_select");
      return;
    }
    const anyCard = this.cardManager.findAnyTapTarget(x, y, {
      visualLiftY: this.getQueueVisualLiftY(),
    });
    if (anyCard) {
      this.playSound("cant_select");
    }
  }

  getPointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const worldX = (px - this.viewportOffsetX) / this.viewportScale;
    const worldY = (py - this.viewportOffsetY) / this.viewportScale;
    if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) {
      return null;
    }
    return {
      x: worldX,
      y: worldY,
    };
  }

  syncDebugContentSelectors() {
    if (this.debugLevelSelect) {
      this.debugLevelSelect.value = this.getValidLevelId(this.currentLevelId);
    }
    if (this.debugThemeSelect) {
      this.debugThemeSelect.value = this.getValidThemeId(this.currentThemeId);
    }
    this.syncDebugCurrentLevelNameInput();
    this.updateTopLevelDebugNav();
    this.syncDebugSaveTargetInputs(this.currentLevelId);
  }

  refreshAvailableLevels() {
    this.availableLevels = LEVEL_DEFINITIONS.map((level) => ({
      id: String(level.id),
      name: String(level.name || `Level ${level.id}`),
    }));
  }

  fillDebugContentSelectors() {
    const fillSelect = (select, options, selectedId) => {
      if (!select) {
        return;
      }
      select.innerHTML = "";
      for (const optionData of options) {
        const option = document.createElement("option");
        option.value = optionData.id;
        option.textContent = optionData.name;
        select.appendChild(option);
      }
      select.value = selectedId;
    };

    this.refreshAvailableLevels();
    fillSelect(this.debugLevelSelect, this.availableLevels, this.getValidLevelId(this.currentLevelId));
    fillSelect(this.debugThemeSelect, this.availableThemes, this.getValidThemeId(this.currentThemeId));
    this.syncDebugCurrentLevelNameInput();
    this.updateTopLevelDebugNav();
    this.syncDebugSaveTargetInputs(this.currentLevelId);
  }

  syncDebugCurrentLevelNameInput() {
    if (!this.debugCurrentLevelNameInput) {
      return;
    }
    const levelName = String(CURRENT_LEVEL?.name || "").trim();
    this.debugCurrentLevelNameInput.value = levelName.length > 0
      ? levelName
      : `Level ${this.getValidLevelId(this.currentLevelId)}`;
  }

  async saveCurrentLevelNameFromDebug() {
    const levelId = this.getValidLevelId(this.currentLevelId);
    const rawName = String(this.debugCurrentLevelNameInput?.value || "").trim();
    const levelNumber = this.normalizeDebugLevelNumber(levelId, this.getSuggestedExportLevelNumber());
    const nextName = rawName.length > 0 ? rawName : `Level ${levelNumber}`;
    if (this.debugCurrentLevelNameInput) {
      this.debugCurrentLevelNameInput.value = nextName;
    }

    const updatedLevel = cloneData(CURRENT_LEVEL);
    updatedLevel.id = levelId;
    updatedLevel.name = nextName;

    syncLevelGlobals(updatedLevel);
    upsertLevelDefinition(updatedLevel);
    const persistedLocally = persistLevelOverride(updatedLevel);

    this.fillDebugContentSelectors();
    this.syncDebugContentSelectors();
    this.invalidate(false);

    if (this.debugSaveCurrentLevelNameButton) {
      const original = this.debugSaveCurrentLevelNameButton.textContent;
      this.debugSaveCurrentLevelNameButton.textContent = "сохранено";
      setTimeout(() => {
        if (this.debugSaveCurrentLevelNameButton) {
          this.debugSaveCurrentLevelNameButton.textContent = original || "сохранить имя";
        }
      }, 1200);
    }

    this.setDebugImageStatus(
      `Имя уровня ${levelNumber} обновлено на "${nextName}"${persistedLocally ? " и закреплено после перезагрузки." : "."}`,
      "success"
    );
  }

  getTopLevelDebugList() {
    const levels = Array.isArray(this.availableLevels) ? this.availableLevels : [];
    return levels.filter((level) => String(level?.id || "") !== DEBUG_IMAGE_LEVEL_ID);
  }

  updateTopLevelDebugNav() {
    if (!this.debugLevelTopLabel || !this.debugLevelPrevTopButton || !this.debugLevelNextTopButton) {
      return;
    }
    const levels = this.getTopLevelDebugList();
    if (levels.length === 0) {
      this.debugLevelTopLabel.textContent = "No levels";
      this.debugLevelPrevTopButton.disabled = true;
      this.debugLevelNextTopButton.disabled = true;
      return;
    }
    const currentId = this.getValidLevelId(this.currentLevelId);
    const currentIndex = levels.findIndex((level) => String(level.id) === currentId);
    const resolvedIndex = currentIndex >= 0 ? currentIndex : 0;
    const active = levels[resolvedIndex];
    const displayName = String(active?.name || `Level ${active?.id || ""}`).trim();
    this.debugLevelTopLabel.textContent = `${resolvedIndex + 1}/${levels.length} · ${displayName}`;
    const disabled = levels.length <= 1;
    this.debugLevelPrevTopButton.disabled = disabled;
    this.debugLevelNextTopButton.disabled = disabled;
  }

  shiftLevelByDebugNav(offset) {
    const step = Number(offset);
    if (!Number.isFinite(step) || step === 0) {
      return;
    }
    const levels = this.getTopLevelDebugList();
    if (levels.length === 0) {
      return;
    }
    const currentId = this.getValidLevelId(this.currentLevelId);
    const currentIndex = levels.findIndex((level) => String(level.id) === currentId);
    const from = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (from + Math.sign(step) + levels.length) % levels.length;
    const nextLevel = levels[nextIndex];
    if (!nextLevel) {
      return;
    }
    this.applyLevelConfig(nextLevel.id, { restart: true });
    this.debugSaveTargetDirty = false;
    this.syncDebugContentSelectors();
    this.saveDebugSettings();
  }

  initDebugContentSelectors() {
    this.fillDebugContentSelectors();
    this.setTopLevelDebugNavVisible(this.topLevelNavVisible);

    if (this.debugContentSelectorsBound) {
      return;
    }
    this.debugContentSelectorsBound = true;

    if (this.debugLevelSelect) {
      this.debugLevelSelect.addEventListener("change", () => {
        this.applyLevelConfig(this.debugLevelSelect.value, { restart: true });
        this.debugSaveTargetDirty = false;
        this.syncDebugContentSelectors();
        this.saveDebugSettings();
      });
    }

    if (this.debugThemeSelect) {
      this.debugThemeSelect.addEventListener("change", () => {
        this.applyThemeConfig(this.debugThemeSelect.value, { restart: true });
        this.syncDebugContentSelectors();
        this.saveDebugSettings();
      });
    }

    if (this.debugCurrentLevelNameInput) {
      this.debugCurrentLevelNameInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") {
          return;
        }
        void this.saveCurrentLevelNameFromDebug();
        event.preventDefault();
      });
    }

    if (this.debugSaveCurrentLevelNameButton) {
      this.debugSaveCurrentLevelNameButton.addEventListener("click", (event) => {
        void this.saveCurrentLevelNameFromDebug();
        event.preventDefault();
      });
    }

    if (this.debugLevelTopNavToggle) {
      this.debugLevelTopNavToggle.checked = this.topLevelNavVisible;
      this.debugLevelTopNavToggle.addEventListener("change", () => {
        this.setTopLevelDebugNavVisible(!!this.debugLevelTopNavToggle?.checked);
        this.saveDebugSettings();
      });
    }
  }

  setTopLevelDebugNavVisible(visible) {
    this.topLevelNavVisible = !!visible;
    if (this.debugLevelTopNavToggle) {
      this.debugLevelTopNavToggle.checked = this.topLevelNavVisible;
    }
    if (this.debugLevelTopNav) {
      this.debugLevelTopNav.hidden = !this.topLevelNavVisible;
    }
  }

  setDebugImageGeneratorVisible(visible) {
    if (this.debugImageLevelSection) {
      this.debugImageLevelSection.classList.toggle("is-collapsed", !visible);
    }
  }

  setDebugImageStatus(message, tone = "info") {
    if (!this.debugImageStatus) {
      return;
    }
    this.debugImageStatus.textContent = message;
    this.debugImageStatus.dataset.tone = tone;
  }

  syncDebugImageFileName() {
    if (!this.debugImageFileName) {
      return;
    }
    if (!this.debugGeneratedSourceImage) {
      this.debugImageFileName.textContent = "файл не выбран";
      return;
    }
    const { fileName, width, height } = this.debugGeneratedSourceImage;
    this.debugImageFileName.textContent = `${fileName} (${width}x${height})`;
  }

  getDebugPaintAvailableColors() {
    const seen = new Set();
    const colors = [];
    for (let row = 0; row < LAYOUT.fieldRows; row++) {
      for (let col = 0; col < LAYOUT.fieldCols; col++) {
        const color = this.getCellColor(col, row);
        if (!color || seen.has(color)) {
          continue;
        }
        seen.add(color);
        colors.push(color);
      }
    }
    if (colors.length === 0) {
      colors.push("blue", "white", "black");
    }
    return colors;
  }

  normalizeColorMatrixForLayout(colorMatrix) {
    const normalizedRows = [];
    for (let row = 0; row < LAYOUT.fieldRows; row++) {
      const sourceRow = Array.isArray(colorMatrix?.[row]) ? colorMatrix[row] : [];
      const targetRow = [];
      for (let col = 0; col < LAYOUT.fieldCols; col++) {
        targetRow.push(normalizeColorMatrixCell(sourceRow[col]));
      }
      normalizedRows.push(targetRow);
    }
    return normalizedRows;
  }

  deriveColorMatrixFromFallbackPattern() {
    const matrix = [];
    for (let row = 0; row < LAYOUT.fieldRows; row++) {
      const line = FALLBACK_FIELD_PATTERN[row] || "";
      const nextRow = [];
      for (let col = 0; col < LAYOUT.fieldCols; col++) {
        nextRow.push(getPatternCellColor(line[col]));
      }
      matrix.push(nextRow);
    }
    return matrix;
  }

  ensureCurrentLevelColorMatrix() {
    if (!CURRENT_LEVEL.pixelArt || typeof CURRENT_LEVEL.pixelArt !== "object") {
      CURRENT_LEVEL.pixelArt = {
        id: String(CURRENT_LEVEL.id || this.currentLevelId || "debug-level"),
      };
    }
    const sourceMatrix = Array.isArray(CURRENT_LEVEL.pixelArt.colorMatrix)
      ? CURRENT_LEVEL.pixelArt.colorMatrix
      : this.deriveColorMatrixFromFallbackPattern();
    const normalized = this.normalizeColorMatrixForLayout(sourceMatrix);
    CURRENT_LEVEL.pixelArt.colorMatrix = normalized;
    return normalized;
  }

  syncDebugPaintColorOptions() {
    if (!this.debugPaintColorSelect) {
      return;
    }
    const options = this.getDebugPaintAvailableColors();
    const current = options.includes(this.debugPaintColor) ? this.debugPaintColor : options[0];
    this.debugPaintColor = current;
    this.debugPaintColorSelect.innerHTML = "";
    for (const color of options) {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = BLOCK_COLOR_LABELS[color] || color;
      this.debugPaintColorSelect.append(option);
    }
    this.debugPaintColorSelect.value = current;
  }

  getFieldCellAt(x, y) {
    if (x < LAYOUT.fieldX || y < LAYOUT.fieldY) {
      return null;
    }
    const col = Math.floor((x - LAYOUT.fieldX) / LAYOUT.fieldStep);
    const row = Math.floor((y - LAYOUT.fieldY) / LAYOUT.fieldStep);
    if (col < 0 || row < 0 || col >= LAYOUT.fieldCols || row >= LAYOUT.fieldRows) {
      return null;
    }
    return { col, row };
  }

  setFallbackCellColor(col, row, colorOrNull) {
    const sourceRow = FALLBACK_FIELD_PATTERN[row] || "";
    const rowChars = sourceRow.split("");
    while (rowChars.length < LAYOUT.fieldCols) {
      rowChars.push(".");
    }
    const normalizedColor = normalizeBlockColorName(colorOrNull);
    rowChars[col] = normalizedColor ? getPatternCellChar(normalizedColor) : ".";
    FALLBACK_FIELD_PATTERN[row] = rowChars.join("");
    const matrix = this.ensureCurrentLevelColorMatrix();
    matrix[row][col] = normalizedColor;
    CURRENT_LEVEL.pixelArt.colorMatrix = matrix;
  }

  applyPatternEditToCurrentLevel() {
    CURRENT_LEVEL.fallbackFieldPattern = [...FALLBACK_FIELD_PATTERN];
    const pattern = [...FALLBACK_FIELD_PATTERN];
    const colorMatrix = this.ensureCurrentLevelColorMatrix();
    CURRENT_LEVEL.pixelArt.pattern = pattern;
    CURRENT_LEVEL.pixelArt.colorMatrix = colorMatrix;
    if (!CURRENT_LEVEL.pixelArt.grid) {
      CURRENT_LEVEL.pixelArt.grid = {};
    }
    CURRENT_LEVEL.pixelArt.grid.cols = LAYOUT.fieldCols;
    CURRENT_LEVEL.pixelArt.grid.rows = LAYOUT.fieldRows;
    upsertLevelDefinition(CURRENT_LEVEL);
    this.syncDebugPaintColorOptions();
  }

  applyDebugPaintAt(x, y) {
    if (!this.debugPaintModeEnabled) {
      return false;
    }
    const hit = this.getFieldCellAt(x, y);
    this.debugPaintHoverCell = hit;
    if (!hit) {
      return false;
    }
    const currentColor = this.getCellColor(hit.col, hit.row);
    let nextColor = currentColor;
    if (this.debugPaintTool === "erase") {
      nextColor = null;
    } else {
      nextColor = this.debugPaintColor;
    }
    if (nextColor === currentColor) {
      return false;
    }
    this.setFallbackCellColor(hit.col, hit.row, nextColor);
    this.applyPatternEditToCurrentLevel();
    this.restart();
    this.setDebugImageStatus(
      `Изменено: (${hit.col + 1}, ${hit.row + 1}) -> ${nextColor ? (BLOCK_COLOR_LABELS[nextColor] || nextColor) : "пусто"}`,
      "success"
    );
    return true;
  }

  syncDebugImageGridInputs(cols, rows) {
    const nextCols = clampDebugImageGridSize(cols);
    const nextRows = clampDebugImageGridSize(rows);
    if (this.debugImageGridColsInput) {
      this.debugImageGridColsInput.value = String(nextCols);
    }
    if (this.debugImageGridRowsInput) {
      this.debugImageGridRowsInput.value = String(nextRows);
    }
  }

  getDebugImageGridSize() {
    const cols = clampDebugImageGridSize(this.debugImageGridColsInput?.value);
    const rows = clampDebugImageGridSize(this.debugImageGridRowsInput?.value);
    this.syncDebugImageGridInputs(cols, rows);
    return { cols, rows };
  }

  syncDebugImageScaleInput(scale) {
    const nextScale = clampDebugImageScale(scale);
    if (this.debugImageScaleInput) {
      this.debugImageScaleInput.value = nextScale.toFixed(2);
    }
    if (this.debugImageScaleValue) {
      const text = `${nextScale.toFixed(2)}x`;
      this.debugImageScaleValue.value = text;
      this.debugImageScaleValue.textContent = text;
    }
    return nextScale;
  }

  getDebugImageSettingsLevelId(levelId = this.currentLevelId) {
    const rawId = String(levelId || DEFAULT_LEVEL_ID);
    if (rawId === DEBUG_IMAGE_LEVEL_ID) {
      const baseId = String(this.debugGeneratedBaseLevelId || DEFAULT_LEVEL_ID);
      return baseId === DEBUG_IMAGE_LEVEL_ID ? DEFAULT_LEVEL_ID : baseId;
    }
    return rawId;
  }

  getDebugImageSettingsForLevel(levelId = this.currentLevelId) {
    const key = this.getDebugImageSettingsLevelId(levelId);
    const raw = this.debugImageSettingsByLevel?.[key];
    const currentKey = this.getDebugImageSettingsLevelId(this.currentLevelId);
    const levelConfig = key === currentKey ? CURRENT_LEVEL : LEVEL_MAP.get(String(key));
    const fallbackScale = clampDebugImageScale(levelConfig?.pixelArt?.artScale ?? 1);
    const fallbackOffsetY = clampDebugImageOffsetY(levelConfig?.pixelArt?.offsetY ?? DEBUG_IMAGE_OFFSET_Y_DEFAULT);
    return {
      imageScale: clampDebugImageScale(raw?.imageScale ?? fallbackScale),
      offsetY: clampDebugImageOffsetY(raw?.offsetY ?? fallbackOffsetY),
    };
  }

  setDebugImageSettingsForLevel(levelId = this.currentLevelId, patch = {}) {
    const key = this.getDebugImageSettingsLevelId(levelId);
    const prev = this.getDebugImageSettingsForLevel(key);
    this.debugImageSettingsByLevel[key] = {
      imageScale: clampDebugImageScale(
        Object.prototype.hasOwnProperty.call(patch, "imageScale") ? patch.imageScale : prev.imageScale
      ),
      offsetY: clampDebugImageOffsetY(
        Object.prototype.hasOwnProperty.call(patch, "offsetY") ? patch.offsetY : prev.offsetY
      ),
    };
    return this.debugImageSettingsByLevel[key];
  }

  syncDebugImageInputsForLevel(levelId = this.currentLevelId) {
    const settings = this.getDebugImageSettingsForLevel(levelId);
    this.syncDebugImageScaleInput(settings.imageScale);
    this.syncDebugImageOffsetYInput(settings.offsetY);
    return settings;
  }

  persistCurrentLevelFieldGeometryFromLayout() {
    if (!CURRENT_LEVEL || !CURRENT_LEVEL.layout || !LAYOUT) {
      return;
    }
    CURRENT_LEVEL.layout.fieldCols = LAYOUT.fieldCols;
    CURRENT_LEVEL.layout.fieldRows = LAYOUT.fieldRows;
    CURRENT_LEVEL.layout.fieldStep = LAYOUT.fieldStep;
    CURRENT_LEVEL.layout.cellSize = LAYOUT.cellSize;
    CURRENT_LEVEL.layout.fieldX = LAYOUT.fieldX;
    CURRENT_LEVEL.layout.fieldY = LAYOUT.fieldY;

    if (!CURRENT_LEVEL.referenceGrid || typeof CURRENT_LEVEL.referenceGrid !== "object") {
      CURRENT_LEVEL.referenceGrid = {};
    }
    CURRENT_LEVEL.referenceGrid.x = LAYOUT.fieldX;
    CURRENT_LEVEL.referenceGrid.y = LAYOUT.fieldY;
    CURRENT_LEVEL.referenceGrid.step = LAYOUT.fieldStep;
    CURRENT_LEVEL.referenceGrid.cellSize = LAYOUT.cellSize;

    if (CURRENT_LEVEL.pixelArt && typeof CURRENT_LEVEL.pixelArt === "object") {
      if (!CURRENT_LEVEL.pixelArt.grid || typeof CURRENT_LEVEL.pixelArt.grid !== "object") {
        CURRENT_LEVEL.pixelArt.grid = {};
      }
      CURRENT_LEVEL.pixelArt.grid.cols = LAYOUT.fieldCols;
      CURRENT_LEVEL.pixelArt.grid.rows = LAYOUT.fieldRows;
    }

    upsertLevelDefinition(CURRENT_LEVEL);
  }

  applyDebugImageScale(nextScale) {
    const clamped = clampDebugImageScale(nextScale);
    this.setDebugImageSettingsForLevel(this.currentLevelId, { imageScale: clamped });
    if (CURRENT_LEVEL.pixelArt && typeof CURRENT_LEVEL.pixelArt === "object") {
      CURRENT_LEVEL.pixelArt.artScale = clamped;
    }
    this.applyDebugLayout();
    this.persistCurrentLevelFieldGeometryFromLayout();
    this.invalidate(false);
    return clamped;
  }

  getDebugImageScale() {
    return this.syncDebugImageScaleInput(this.debugImageScaleInput?.value);
  }

  syncDebugImageOffsetYInput(offsetY) {
    const nextOffsetY = clampDebugImageOffsetY(offsetY);
    if (this.debugImageOffsetYInput) {
      this.debugImageOffsetYInput.value = String(nextOffsetY);
    }
    if (this.debugImageOffsetYValue) {
      const text = String(nextOffsetY);
      this.debugImageOffsetYValue.value = text;
      this.debugImageOffsetYValue.textContent = text;
    }
    return nextOffsetY;
  }

  applyDebugImageOffsetY(nextOffsetY) {
    const clamped = clampDebugImageOffsetY(nextOffsetY);
    this.setDebugImageSettingsForLevel(this.currentLevelId, { offsetY: clamped });
    if (CURRENT_LEVEL.pixelArt && typeof CURRENT_LEVEL.pixelArt === "object") {
      CURRENT_LEVEL.pixelArt.offsetY = clamped;
    }
    this.applyDebugLayout();
    this.persistCurrentLevelFieldGeometryFromLayout();
    this.invalidate(false);
    return clamped;
  }

  getDebugImageOffsetY() {
    return this.syncDebugImageOffsetYInput(this.debugImageOffsetYInput?.value);
  }

  getDebugImageBaseLevelId() {
    const candidate = this.currentLevelId === DEBUG_IMAGE_LEVEL_ID ? this.debugGeneratedBaseLevelId : this.currentLevelId;
    const normalized = String(candidate || DEFAULT_LEVEL_ID);
    return normalized === DEBUG_IMAGE_LEVEL_ID ? DEFAULT_LEVEL_ID : this.getValidLevelId(normalized);
  }

  loadDebugImageFile(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Не удалось прочитать картинку."));
      };
      image.src = objectUrl;
    });
  }

  async handleDebugImageSelection() {
    const file = this.debugImageUploadInput?.files?.[0] || null;
    if (!file) {
      this.debugGeneratedSourceImage = null;
      this.syncDebugImageFileName();
      this.setDebugImageStatus("Выбери изображение, затем укажи сетку и нажми создать.");
      return;
    }
    try {
      const image = await this.loadDebugImageFile(file);
      this.debugGeneratedSourceImage = {
        fileName: file.name,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        image,
      };
      this.syncDebugImageFileName();
      this.setDebugImageStatus("Картинка загружена. Теперь можно создать или обновить уровень.", "success");
    } catch (error) {
      this.debugGeneratedSourceImage = null;
      this.syncDebugImageFileName();
      this.setDebugImageStatus(error instanceof Error ? error.message : "Не удалось загрузить картинку.", "error");
    }
  }

  sampleDebugImageToMatrix(image, cols, rows) {
    const sample = document.createElement("canvas");
    const sourceWidth = Math.max(1, Math.round(image.naturalWidth || image.width || cols));
    const sourceHeight = Math.max(1, Math.round(image.naturalHeight || image.height || rows));
    sample.width = sourceWidth;
    sample.height = sourceHeight;
    const ctx = sample.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!ctx) {
      throw new Error("Не удалось создать canvas для генератора.");
    }
    ctx.clearRect(0, 0, sourceWidth, sourceHeight);
    ctx.imageSmoothingEnabled = false;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "low";
    }
    ctx.drawImage(image, 0, 0, sourceWidth, sourceHeight);
    const { data } = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
    const quantizedPixels = this.buildDebugImageQuantizedPixelMap(data, sourceWidth, sourceHeight);
    const phaseCandidates = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];
    let bestResult = null;

    for (const phaseY of phaseCandidates) {
      for (const phaseX of phaseCandidates) {
        const candidate = this.sampleDebugImageMatrixForPhase(
          quantizedPixels,
          sourceWidth,
          sourceHeight,
          cols,
          rows,
          phaseX,
          phaseY
        );
        if (
          !bestResult
          || candidate.score > bestResult.score + 0.0001
          || (Math.abs(candidate.score - bestResult.score) <= 0.0001 && candidate.filledCells > bestResult.filledCells)
        ) {
          bestResult = candidate;
        }
      }
    }
    return bestResult || { colorMatrix: [], colorCounts: {}, filledCells: 0 };
  }

  buildDebugImageLevel(colorMatrix, metadata = {}) {
    const rows = colorMatrix.length;
    const cols = colorMatrix[0]?.length || 0;
    const baseLevelId = this.getDebugImageBaseLevelId();
    const baseLevel = getLevelConfig(baseLevelId);
    const level = cloneData(baseLevel);
    const baseFieldWidth = Math.max(1, baseLevel.layout.fieldCols * baseLevel.layout.fieldStep);
    const baseFieldHeight = Math.max(1, baseLevel.layout.fieldRows * baseLevel.layout.fieldStep);
    const artScale = clampDebugImageScale(metadata.imageScale);
    const baseStep = Math.min(baseFieldWidth / Math.max(1, cols), baseFieldHeight / Math.max(1, rows));
    const fieldStep = Math.max(12, Math.floor(baseStep * artScale));
    const cellSize = Math.max(10, fieldStep - Math.max(2, Math.round(fieldStep * 0.08)));
    const fieldWidth = cols * fieldStep;
    const fieldHeight = rows * fieldStep;
    const centerX = baseLevel.layout.fieldX + baseFieldWidth * 0.5;
    const centerY = baseLevel.layout.fieldY + baseFieldHeight * 0.5;
    const offsetY = clampDebugImageOffsetY(metadata.offsetY);
    const fieldX = Math.round(centerX - fieldWidth * 0.5);
    const fieldY = Math.round(centerY - fieldHeight * 0.5 + offsetY);
    const pattern = colorMatrix.map((row) => row.map((cell) => getPatternCellChar(cell)).join(""));
    const levelNumber = this.normalizeDebugLevelNumber(metadata.levelNumber, this.getSuggestedExportLevelNumber());
    const levelName = String(metadata.levelName || `Level ${levelNumber}`).trim() || `Level ${levelNumber}`;

    level.id = DEBUG_IMAGE_LEVEL_ID;
    level.name = levelName;
    level.fallbackFieldPattern = pattern;
    level.pixelArt = {
      id: DEBUG_IMAGE_LEVEL_ID,
      name: metadata.fileName || "Generated image",
      sourceFileName: metadata.fileName || "",
      artScale,
      offsetY,
      grid: { cols, rows },
      pattern,
      colorMatrix,
    };
    level.referenceGrid = {
      x: fieldX,
      y: fieldY,
      step: fieldStep,
      cellSize,
    };
    level.layout.fieldCols = cols;
    level.layout.fieldRows = rows;
    level.layout.fieldStep = fieldStep;
    level.layout.cellSize = cellSize;
    level.layout.fieldX = fieldX;
    level.layout.fieldY = fieldY;

    return { level, baseLevelId };
  }

  generateDebugImageLevel() {
    if (!this.debugGeneratedSourceImage?.image) {
      this.setDebugImageStatus("Сначала загрузи картинку для генерации уровня.", "error");
      return false;
    }

    const { cols, rows } = this.getDebugImageGridSize();
    const imageScale = this.getDebugImageScale();
    const offsetY = this.getDebugImageOffsetY();
    const levelNumber = this.getDebugSaveLevelNumber(this.getSuggestedExportLevelNumber());
    const levelName = this.getDebugSaveLevelName(levelNumber);
    const { colorMatrix, colorCounts, filledCells } = this.sampleDebugImageToMatrix(this.debugGeneratedSourceImage.image, cols, rows);

    if (filledCells <= 0) {
      this.setDebugImageStatus("В выбранной картинке не найдено ни одного непрозрачного пикселя.", "error");
      return false;
    }

    const { level, baseLevelId } = this.buildDebugImageLevel(colorMatrix, {
      fileName: this.debugGeneratedSourceImage.fileName,
      imageScale,
      offsetY,
      levelNumber,
      levelName,
    });
    const colorSummary = Object.keys(colorCounts)
      .map((color) => `${BLOCK_COLOR_LABELS[color] || color}: ${colorCounts[color]}`)
      .join(", ");

    this.debugGeneratedBaseLevelId = baseLevelId;
    upsertLevelDefinition(level);
    this.fillDebugContentSelectors();
    this.applyLevelConfig(level.id, { restart: true });
    this.syncDebugContentSelectors();
    this.setDebugImageStatus(
      `Собран ${levelName} (${cols}x${rows}) с размером ${imageScale.toFixed(2)}x и Y ${offsetY}. Блоков: ${filledCells}. ${colorSummary}`,
      "success"
    );
    return true;
  }

  initDebugControls() {
    if (this.debugPanel) {
      this.debugPanel.classList.remove("is-visible");
    }
    this.setDebugImageGeneratorVisible(false);
    this.initDebugContentSelectors();
    this.syncDebugContentSelectors();
    this.syncDebugImageGridInputs(CURRENT_LEVEL.layout?.fieldCols || 18, CURRENT_LEVEL.layout?.fieldRows || 18);
    this.syncDebugImageInputsForLevel(this.currentLevelId);
    this.syncDebugBackgroundButtons();
    this.syncDebugPaintColorOptions();
    this.syncDebugImageFileName();
    this.setDebugImageStatus("Выбери изображение, затем укажи сетку и нажми создать.");
    const bindRange = (input, output, currentValue, parseValue, formatValue, onApply) => {
      if (!input) {
        return;
      }
      input.value = String(currentValue);
      input.addEventListener("input", () => {
        const parsed = parseValue(input.value);
        const nextValue = onApply(parsed);
        if (output) {
          const text = formatValue(nextValue);
          output.value = text;
          output.textContent = text;
        }
        this.saveDebugSettings();
      });
      input.dispatchEvent(new Event("input"));
    };

    if (this.shotBounceSizeInput) {
      this.shotBounceSizeInput.value = SHOT_BOUNCE_AMOUNT.toFixed(2);
      this.shotBounceSizeInput.addEventListener("input", () => {
        const value = Number(this.shotBounceSizeInput.value);
        SHOT_BOUNCE_AMOUNT = clamp(value, 0.05, 0.7);
        if (this.shotBounceSizeValue) {
          this.shotBounceSizeValue.value = SHOT_BOUNCE_AMOUNT.toFixed(2);
          this.shotBounceSizeValue.textContent = SHOT_BOUNCE_AMOUNT.toFixed(2);
        }
        this.saveDebugSettings();
      });
      this.shotBounceSizeInput.dispatchEvent(new Event("input"));
    }
    if (this.shotBounceSpeedInput) {
      this.shotBounceSpeedInput.value = SHOT_BOUNCE_SPEED.toFixed(2);
      this.shotBounceSpeedInput.addEventListener("input", () => {
        const value = Number(this.shotBounceSpeedInput.value);
        SHOT_BOUNCE_SPEED = clamp(value, 0.4, 2.6);
        if (this.shotBounceSpeedValue) {
          const text = `${SHOT_BOUNCE_SPEED.toFixed(2)}x`;
          this.shotBounceSpeedValue.value = text;
          this.shotBounceSpeedValue.textContent = text;
        }
        this.saveDebugSettings();
      });
      this.shotBounceSpeedInput.dispatchEvent(new Event("input"));
    }
    if (this.railSpeedInput) {
      this.railSpeedInput.value = String(Math.round(TRACK_UNIT_SPEED));
      this.railSpeedInput.addEventListener("input", () => {
        const value = Number(this.railSpeedInput.value);
        TRACK_UNIT_SPEED = clamp(value, 420, 1400);
        if (this.railSpeedValue) {
          const text = String(Math.round(TRACK_UNIT_SPEED));
          this.railSpeedValue.value = text;
          this.railSpeedValue.textContent = text;
        }
        this.saveDebugSettings();
      });
      this.railSpeedInput.dispatchEvent(new Event("input"));
    }
    if (this.queueCardsInput) {
      this.queueCardsInput.value = String(BOTTOM_QUEUE_CARD_COUNT);
      this.queueCardsInput.addEventListener("input", () => {
        const value = clamp(Math.round(Number(this.queueCardsInput.value)), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
        if (String(value) !== this.queueCardsInput.value) {
          this.queueCardsInput.value = String(value);
        }
        if (this.queueCardsValue) {
          const text = String(value);
          this.queueCardsValue.value = text;
          this.queueCardsValue.textContent = text;
        }
        this.setQueueCardCount(value);
        this.saveDebugSettings();
      });
      this.queueCardsInput.dispatchEvent(new Event("input"));
    }
    bindRange(
      this.maxActiveUnitsInput,
      this.maxActiveUnitsValue,
      ACTIVE_UNITS_LIMIT,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        ACTIVE_UNITS_LIMIT = clamp(Math.round(value), MIN_ACTIVE_UNITS_LIMIT, MAX_ACTIVE_UNITS_LIMIT);
        return ACTIVE_UNITS_LIMIT;
      }
    );
    bindRange(
      this.chickenSizeScaleInput,
      this.chickenSizeScaleValue,
      CHICKEN_SIZE_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        CHICKEN_SIZE_SCALE = clamp(value, 0.6, 1.8);
        this.invalidate(false);
        return CHICKEN_SIZE_SCALE;
      }
    );

    bindRange(
      this.topPanelFontSizeInput,
      this.topPanelFontSizeValue,
      TOP_PANEL_FONT_SIZE,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TOP_PANEL_FONT_SIZE = clamp(value, 24, 80);
        this.invalidate(false);
        return TOP_PANEL_FONT_SIZE;
      }
    );

    bindRange(
      this.levelPanelScaleInput,
      this.levelPanelScaleValue,
      TOP_LEVEL_PANEL_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        TOP_LEVEL_PANEL_SCALE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return TOP_LEVEL_PANEL_SCALE;
      }
    );
    bindRange(
      this.coinsPanelScaleInput,
      this.coinsPanelScaleValue,
      TOP_COINS_PANEL_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        TOP_COINS_PANEL_SCALE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return TOP_COINS_PANEL_SCALE;
      }
    );
    bindRange(
      this.backButtonScaleInput,
      this.backButtonScaleValue,
      BACK_BUTTON_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        BACK_BUTTON_SCALE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return BACK_BUTTON_SCALE;
      }
    );
    bindRange(
      this.trackYOffsetInput,
      this.trackYOffsetValue,
      TRACK_Y_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TRACK_Y_OFFSET = clamp(value, -220, 260);
        this.applyDebugLayout();
        return TRACK_Y_OFFSET;
      }
    );
    bindRange(
      this.trackYOffsetMobileInput,
      this.trackYOffsetMobileValue,
      TRACK_Y_OFFSET_MOBILE,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TRACK_Y_OFFSET_MOBILE = clamp(value, -220, 260);
        this.applyDebugLayout();
        return TRACK_Y_OFFSET_MOBILE;
      }
    );
    bindRange(
      this.playfieldScaleInput,
      this.playfieldScaleValue,
      PLAYFIELD_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        PLAYFIELD_SCALE = clamp(value, 0.7, 1.5);
        this.applyDebugLayout();
        return PLAYFIELD_SCALE;
      }
    );
    bindRange(
      this.slotSizeScaleInput,
      this.slotSizeScaleValue,
      SLOT_SIZE_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        SLOT_SIZE_SCALE = clamp(value, 0.6, 1.7);
        this.applyDebugLayout();
        return SLOT_SIZE_SCALE;
      }
    );
    bindRange(
      this.slotYOffsetInput,
      this.slotYOffsetValue,
      SLOT_Y_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        SLOT_Y_OFFSET = clamp(value, -220, 260);
        this.applyDebugLayout();
        return SLOT_Y_OFFSET;
      }
    );
    bindRange(
      this.slotSpacingXMobileInput,
      this.slotSpacingXMobileValue,
      SLOT_SPACING_X_MOBILE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        SLOT_SPACING_X_MOBILE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return SLOT_SPACING_X_MOBILE;
      }
    );
    bindRange(
      this.slotSpacingXDesktopInput,
      this.slotSpacingXDesktopValue,
      SLOT_SPACING_X_DESKTOP,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        SLOT_SPACING_X_DESKTOP = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return SLOT_SPACING_X_DESKTOP;
      }
    );
    bindRange(
      this.trayBottomOffsetInput,
      this.trayBottomOffsetValue,
      TRAY_BOTTOM_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TRAY_BOTTOM_OFFSET = clamp(value, -320, 320);
        this.applyDebugLayout();
        return TRAY_BOTTOM_OFFSET;
      }
    );
    bindRange(
      this.trayBottomOffsetDesktopInput,
      this.trayBottomOffsetDesktopValue,
      TRAY_BOTTOM_OFFSET_DESKTOP,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TRAY_BOTTOM_OFFSET_DESKTOP = clamp(value, -320, 320);
        this.applyDebugLayout();
        return TRAY_BOTTOM_OFFSET_DESKTOP;
      }
    );
    bindRange(
      this.trayScaleYMobileInput,
      this.trayScaleYMobileValue,
      TRAY_SCALE_Y_MOBILE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        TRAY_SCALE_Y_MOBILE = clamp(value, 0.5, 1.8);
        this.applyDebugLayout();
        return TRAY_SCALE_Y_MOBILE;
      }
    );
    bindRange(
      this.trayScaleYDesktopInput,
      this.trayScaleYDesktopValue,
      TRAY_SCALE_Y_DESKTOP,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        TRAY_SCALE_Y_DESKTOP = clamp(value, 0.5, 1.8);
        this.applyDebugLayout();
        return TRAY_SCALE_Y_DESKTOP;
      }
    );
    bindRange(
      this.queueSpacingXMobileInput,
      this.queueSpacingXMobileValue,
      QUEUE_SPACING_X_MOBILE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        QUEUE_SPACING_X_MOBILE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return QUEUE_SPACING_X_MOBILE;
      }
    );
    bindRange(
      this.queueSpacingXDesktopInput,
      this.queueSpacingXDesktopValue,
      QUEUE_SPACING_X_DESKTOP,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        QUEUE_SPACING_X_DESKTOP = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return QUEUE_SPACING_X_DESKTOP;
      }
    );
    bindRange(
      this.topUiYOffsetInput,
      this.topUiYOffsetValue,
      TOP_UI_Y_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TOP_UI_Y_OFFSET = clamp(value, -60, 220);
        this.applyDebugLayout();
        return TOP_UI_Y_OFFSET;
      }
    );
    bindRange(
      this.topUiYOffsetMobileInput,
      this.topUiYOffsetMobileValue,
      TOP_UI_Y_OFFSET_MOBILE,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TOP_UI_Y_OFFSET_MOBILE = clamp(value, -60, 220);
        this.applyDebugLayout();
        return TOP_UI_Y_OFFSET_MOBILE;
      }
    );
    bindRange(
      this.mobileBottomClusterYOffsetInput,
      this.mobileBottomClusterYOffsetValue,
      MOBILE_BOTTOM_CLUSTER_Y_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        MOBILE_BOTTOM_CLUSTER_Y_OFFSET = clamp(value, -220, 220);
        this.applyDebugLayout();
        return MOBILE_BOTTOM_CLUSTER_Y_OFFSET;
      }
    );
    bindRange(
      this.cardAllYOffsetInput,
      this.cardAllYOffsetValue,
      CARD_Y_OFFSET_ALL,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_ALL = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_ALL;
      }
    );
    bindRange(
      this.card1YOffsetInput,
      this.card1YOffsetValue,
      CARD_Y_OFFSET_1,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_1 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_1;
      }
    );
    bindRange(
      this.card2YOffsetInput,
      this.card2YOffsetValue,
      CARD_Y_OFFSET_2,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_2 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_2;
      }
    );
    bindRange(
      this.card3YOffsetInput,
      this.card3YOffsetValue,
      CARD_Y_OFFSET_3,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_3 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_3;
      }
    );
    bindRange(
      this.card4YOffsetInput,
      this.card4YOffsetValue,
      CARD_Y_OFFSET_4,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_4 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_4;
      }
    );

    if (this.debugImageUploadInput) {
      this.debugImageUploadInput.addEventListener("change", () => {
        void this.handleDebugImageSelection();
      });
    }
    if (this.debugImageScaleInput) {
      this.debugImageScaleInput.addEventListener("input", () => {
        const nextScale = this.syncDebugImageScaleInput(this.debugImageScaleInput.value);
        this.applyDebugImageScale(nextScale);
      });
      this.debugImageScaleInput.dispatchEvent(new Event("input"));
    }
    if (this.debugImageOffsetYInput) {
      this.debugImageOffsetYInput.addEventListener("input", () => {
        const nextOffsetY = this.syncDebugImageOffsetYInput(this.debugImageOffsetYInput.value);
        this.applyDebugImageOffsetY(nextOffsetY);
      });
      this.debugImageOffsetYInput.dispatchEvent(new Event("input"));
    }
    if (this.debugImageCreateButton) {
      this.debugImageCreateButton.addEventListener("click", (event) => {
        this.generateDebugImageLevel();
        event.preventDefault();
      });
    }
    if (this.debugImageRefreshButton) {
      this.debugImageRefreshButton.addEventListener("click", (event) => {
        this.generateDebugImageLevel();
        event.preventDefault();
      });
    }
    if (this.debugPaintModeInput) {
      this.debugPaintModeInput.checked = this.debugPaintModeEnabled;
      this.debugPaintModeInput.addEventListener("change", () => {
        this.debugPaintModeEnabled = !!this.debugPaintModeInput?.checked;
        this.debugPaintHoverCell = null;
        if (!this.debugPaintModeEnabled) {
          this.canvas.style.cursor = "default";
        }
        this.invalidate(false);
      });
    }
    if (this.debugPaintToolSelect) {
      this.debugPaintToolSelect.value = this.debugPaintTool;
      this.debugPaintToolSelect.addEventListener("change", () => {
        const value = this.debugPaintToolSelect?.value === "erase" ? "erase" : "paint";
        this.debugPaintTool = value;
      });
    }
    if (this.debugPaintColorSelect) {
      this.debugPaintColorSelect.addEventListener("change", () => {
        const value = String(this.debugPaintColorSelect?.value || "");
        if (value) {
          this.debugPaintColor = value;
        }
      });
    }
    if (this.debugSaveLevelNumberInput) {
      this.debugSaveLevelNumberInput.addEventListener("input", () => {
        this.debugSaveTargetDirty = true;
        const levelNumber = this.getDebugSaveLevelNumber();
        if (this.debugSaveLevelNameInput) {
          const currentName = String(this.debugSaveLevelNameInput.value || "").trim();
          if (!currentName || /^level\s+\d+$/i.test(currentName)) {
            this.debugSaveLevelNameInput.value = `Level ${levelNumber}`;
          }
        }
      });
      this.syncDebugSaveTargetInputs(this.currentLevelId, { force: true });
    }
    if (this.debugSaveLevelNameInput) {
      this.debugSaveLevelNameInput.addEventListener("input", () => {
        this.debugSaveTargetDirty = true;
      });
    }
  }

  setDebugPanelVisible(visible) {
    this.debugPanelVisible = visible;
    if (this.debugPanel) {
      this.debugPanel.classList.toggle("is-visible", visible);
    }
    if (this.debugToggleFab) {
      this.debugToggleFab.textContent = visible ? "CLOSE" : "DBG";
    }
  }

  toggleDebugPanel() {
    this.setDebugPanelVisible(!this.debugPanelVisible);
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    const unlockAudio = () => {
      if (this.soundManager && typeof this.soundManager.unlock === "function") {
        this.soundManager.unlock();
      }
    };
    window.addEventListener("pointerdown", unlockAudio, { passive: true, once: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true, once: true });
    window.addEventListener("mousedown", unlockAudio, { passive: true, once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("keydown", (event) => {
      if (event.code !== "Space" || event.repeat) {
        return;
      }
      const tag = event.target && event.target.tagName ? String(event.target.tagName).toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }
      this.toggleDebugPanel();
      event.preventDefault();
    });
    this.canvas.addEventListener("pointermove", (event) => {
      const point = this.getPointerPosition(event);
      if (!point) {
        this.canvas.style.cursor = "default";
        return;
      }
      this.handlePointerMove(point.x, point.y);
    });
    this.canvas.addEventListener("pointerdown", (event) => {
      unlockAudio();
      const point = this.getPointerPosition(event);
      if (!point) {
        return;
      }
      this.handlePointerDown(point.x, point.y);
      event.preventDefault();
    });
    if (this.debugPanel) {
      // Keep scroll gestures inside the debug panel so the canvas doesn't steal them on mobile.
      const stopPropagation = (event) => {
        event.stopPropagation();
      };
      this.debugPanel.addEventListener("pointerdown", stopPropagation, { passive: true });
      this.debugPanel.addEventListener("pointermove", stopPropagation, { passive: true });
      this.debugPanel.addEventListener("wheel", stopPropagation, { passive: true });
      this.debugPanel.addEventListener("touchstart", stopPropagation, { passive: true });
      this.debugPanel.addEventListener("touchmove", stopPropagation, { passive: true });
    }
    if (this.debugButton) {
      this.debugButton.addEventListener("click", (event) => {
        this.triggerDebug6();
        event.preventDefault();
      });
    }
    if (this.debugLoseButton) {
      this.debugLoseButton.addEventListener("click", (event) => {
        this.triggerDebugLose();
        event.preventDefault();
      });
    }
    if (this.debugResetButton) {
      this.debugResetButton.addEventListener("click", (event) => {
        this.resetDebugSettings();
        event.preventDefault();
      });
    }
    if (this.debugExportButton) {
      this.debugExportButton.addEventListener("click", (event) => {
        this.exportDebugSettingsJSON();
        event.preventDefault();
      });
    }
    if (this.debugExportLevelButton) {
      this.debugExportLevelButton.addEventListener("click", (event) => {
        void this.exportCurrentLevelJSON();
        event.preventDefault();
      });
    }
    if (this.debugSaveCurrentLevelButton) {
      this.debugSaveCurrentLevelButton.addEventListener("click", (event) => {
        void this.saveOverCurrentLevel();
        event.preventDefault();
      });
    }
    if (this.debugSaveTargetLevelButton) {
      this.debugSaveTargetLevelButton.addEventListener("click", (event) => {
        void this.saveToTargetLevel();
        event.preventDefault();
      });
    }
    if (this.debugPickLevelsFolderButton) {
      this.debugPickLevelsFolderButton.addEventListener("click", (event) => {
        void this.pickDebugLevelsFolder();
        event.preventDefault();
      });
    }
    if (this.debugImageLevelToggleButton) {
      this.debugImageLevelToggleButton.addEventListener("click", (event) => {
        const hidden = !!this.debugImageLevelSection?.classList.contains("is-collapsed");
        this.setDebugImageGeneratorVisible(hidden);
        event.preventDefault();
      });
    }
    for (const backgroundId of BACKGROUND_VARIANT_IDS) {
      const button = this.debugBackgroundButtons?.[backgroundId];
      if (!button) {
        continue;
      }
      button.addEventListener("click", (event) => {
        this.applyBackgroundConfig(backgroundId);
        event.preventDefault();
      });
    }
    if (this.debugToggleFab) {
      this.debugToggleFab.addEventListener("click", (event) => {
        this.toggleDebugPanel();
        event.preventDefault();
      });
    }
    if (this.debugLevelPrevTopButton) {
      this.debugLevelPrevTopButton.addEventListener("click", (event) => {
        this.shiftLevelByDebugNav(-1);
        event.preventDefault();
      });
    }
    if (this.debugLevelNextTopButton) {
      this.debugLevelNextTopButton.addEventListener("click", (event) => {
        this.shiftLevelByDebugNav(1);
        event.preventDefault();
      });
    }
  }

  advanceTime(ms) {
    const steps = Math.max(1, Math.round(ms / (FIXED_DT * 1000)));
    for (let i = 0; i < steps; i++) {
      this.update(FIXED_DT);
    }
    this.lastTimestamp = performance.now();
    this.invalidate(false);
  }

  renderGameToText() {
    const blocksByColor = this.blocks.reduce((acc, block) => {
      if (!block.alive) {
        acc[block.color] = (acc[block.color] || 0) + 1;
      }
      return acc;
    }, {});
    return JSON.stringify({
      mode: this.gameState,
      scene: "procedural_reskin",
      source: "procedural",
      levelId: this.currentLevelId,
      themeId: this.currentThemeId,
      generatedLevel:
        this.currentLevelId === DEBUG_IMAGE_LEVEL_ID
          ? {
            fileName: this.debugGeneratedSourceImage?.fileName || "",
            cols: LAYOUT.fieldCols,
            rows: LAYOUT.fieldRows,
            artScale: clampDebugImageScale(CURRENT_LEVEL.pixelArt?.artScale),
            offsetY: clampDebugImageOffsetY(CURRENT_LEVEL.pixelArt?.offsetY),
            baseLevelId: this.debugGeneratedBaseLevelId,
          }
          : null,
      unitTheme: "numbered_slimes",
      coordinateSystem: {
        origin: "top-left",
        xDirection: "right",
        yDirection: "down",
        units: "canvas pixels",
      },
      remainingBlocks: this.remainingBlocks,
      blocksTotal: this.blocks.length,
      queueCards: this.cardManager.queueCardCount,
      blocksByColor,
      units: this.units.map((unit) => ({
        id: unit.id,
        color: unit.color,
        styleKey: unit.styleKey,
        label: unit.label,
        ammo: unit.ammo,
        slotIndex: unit.slotIndex,
        x: Number(unit.position.x.toFixed(1)),
        y: Number(unit.position.y.toFixed(1)),
      })),
      slimeCards: this.cards.map((card) => ({
        index: card.index,
        lane: card.lane,
        row: card.row,
        color: card.color,
        styleKey: card.styleKey,
        label: card.label,
        ammo: card.ammo,
        used: card.used,
        x: card.x,
        y: card.y,
        w: card.w,
        h: card.h,
      })),
    });
  }
}

let pendingExternalLevelSelection = null;
let pendingExternalCoinsCount = null;
let pendingExternalHeartsCount = null;
let pendingExternalMaxLivesCount = null;
let pendingExternalLivesTimer = null;
let pendingExternalSubscriptionStatus = null;
let pendingExternalTimeOutCoinsCost = null;
const EXTERNAL_COINS_STORAGE_KEY = "pixelflow.external.coins.v1";
const EXTERNAL_HEARTS_STORAGE_KEY = "pixelflow.external.hearts.v1";
const EXTERNAL_MAX_LIVES_STORAGE_KEY = "pixelflow.external.max_lives.v1";
const EXTERNAL_SUBSCRIPTION_STATUS_STORAGE_KEY = "pixelflow.external.subscription_status.v1";
const EXTERNAL_TIMEOUT_COINS_COST_STORAGE_KEY = "pixelflow.external.timeout_coins_cost.v1";
const DEFAULT_TIMEOUT_COINS_COST = 50;

function normalizeExternalCoinsCount(value) {
  const raw = String(value ?? "").trim();
  if (raw.length === 0) {
    return null;
  }
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.max(0, Math.trunc(numeric));
}

function persistExternalCoinsCount(value) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(EXTERNAL_COINS_STORAGE_KEY, String(value));
    return true;
  } catch {
    return false;
  }
}

function normalizeExternalHeartsCount(value) {
  const raw = String(value ?? "").trim();
  if (raw.length === 0) {
    return null;
  }
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.max(0, Math.trunc(numeric));
}

function persistExternalHeartsCount(value) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(EXTERNAL_HEARTS_STORAGE_KEY, String(value));
    return true;
  } catch {
    return false;
  }
}

function normalizeExternalMaxLivesCount(value) {
  const raw = String(value ?? "").trim();
  if (raw.length === 0) {
    return null;
  }
  let normalizedRaw = raw;
  if (
    normalizedRaw.length >= 2 &&
    ((normalizedRaw.startsWith("'") && normalizedRaw.endsWith("'")) ||
      (normalizedRaw.startsWith("\"") && normalizedRaw.endsWith("\"")))
  ) {
    normalizedRaw = normalizedRaw.slice(1, -1).trim();
  }
  if (normalizedRaw.length === 0) {
    return null;
  }
  const numeric = Number(normalizedRaw);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.max(0, Math.trunc(numeric));
}

function normalizeExternalLivesTimer(value) {
  const raw = String(value ?? "").trim();
  if (raw.length === 0) {
    return null;
  }
  let normalizedRaw = raw;
  if (
    normalizedRaw.length >= 2 &&
    ((normalizedRaw.startsWith("'") && normalizedRaw.endsWith("'")) ||
      (normalizedRaw.startsWith("\"") && normalizedRaw.endsWith("\"")))
  ) {
    normalizedRaw = normalizedRaw.slice(1, -1).trim();
  }
  if (normalizedRaw.length === 0) {
    return null;
  }
  return normalizedRaw;
}

function persistExternalMaxLivesCount(value) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(EXTERNAL_MAX_LIVES_STORAGE_KEY, String(value));
    return true;
  } catch {
    return false;
  }
}

function normalizeExternalSubscriptionStatus(value) {
  const raw = String(value ?? "").trim();
  if (raw.length === 0) {
    return null;
  }
  let normalizedRaw = raw;
  if (
    normalizedRaw.length >= 2 &&
    ((normalizedRaw.startsWith("'") && normalizedRaw.endsWith("'")) ||
      (normalizedRaw.startsWith("\"") && normalizedRaw.endsWith("\"")))
  ) {
    normalizedRaw = normalizedRaw.slice(1, -1).trim();
  }
  const lowered = normalizedRaw.toLowerCase();
  if (lowered === "true" || lowered === "1" || lowered === "yes") {
    return true;
  }
  if (lowered === "false" || lowered === "0" || lowered === "no") {
    return false;
  }
  return null;
}

function persistExternalSubscriptionStatus(value) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(EXTERNAL_SUBSCRIPTION_STATUS_STORAGE_KEY, value ? "1" : "0");
    return true;
  } catch {
    return false;
  }
}

function normalizeExternalTimeOutCoinsCost(value) {
  const raw = String(value ?? "").trim();
  if (raw.length === 0) {
    return null;
  }
  let normalizedRaw = raw;
  if (
    normalizedRaw.length >= 2 &&
    ((normalizedRaw.startsWith("'") && normalizedRaw.endsWith("'")) ||
      (normalizedRaw.startsWith("\"") && normalizedRaw.endsWith("\"")))
  ) {
    normalizedRaw = normalizedRaw.slice(1, -1).trim();
  }
  if (normalizedRaw.length === 0) {
    return null;
  }
  const numeric = Number(normalizedRaw);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.max(0, Math.trunc(numeric));
}

function persistExternalTimeOutCoinsCost(value) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(EXTERNAL_TIMEOUT_COINS_COST_STORAGE_KEY, String(value));
    return true;
  } catch {
    return false;
  }
}

function loadExternalCountFromStorage(storageKey) {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === null || raw === undefined) {
      return null;
    }
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    return Math.max(0, Math.trunc(numeric));
  } catch {
    return null;
  }
}

function resolveExternalCoinsCount(gameInstance) {
  const fromGame = normalizeExternalCoinsCount(gameInstance?.externalCoinsCount);
  if (fromGame !== null) {
    return fromGame;
  }
  const fromPending = normalizeExternalCoinsCount(pendingExternalCoinsCount);
  if (fromPending !== null) {
    return fromPending;
  }
  const fromStorage = loadExternalCountFromStorage(EXTERNAL_COINS_STORAGE_KEY);
  return fromStorage ?? 0;
}

function resolveExternalHeartsCount(gameInstance) {
  const fromGame = normalizeExternalHeartsCount(gameInstance?.externalHeartsCount);
  if (fromGame !== null) {
    return fromGame;
  }
  const fromPending = normalizeExternalHeartsCount(pendingExternalHeartsCount);
  if (fromPending !== null) {
    return fromPending;
  }
  const fromStorage = loadExternalCountFromStorage(EXTERNAL_HEARTS_STORAGE_KEY);
  return fromStorage ?? 0;
}

function resolveExternalMaxLivesCount(gameInstance) {
  const fromGame = normalizeExternalMaxLivesCount(gameInstance?.externalMaxLivesCount);
  if (fromGame !== null) {
    return fromGame;
  }
  const fromPending = normalizeExternalMaxLivesCount(pendingExternalMaxLivesCount);
  if (fromPending !== null) {
    return fromPending;
  }
  const fromStorage = loadExternalCountFromStorage(EXTERNAL_MAX_LIVES_STORAGE_KEY);
  return fromStorage ?? 0;
}

function resolveExternalLivesTimer(gameInstance) {
  const fromGame = normalizeExternalLivesTimer(gameInstance?.externalLivesTimer);
  if (fromGame !== null) {
    return fromGame;
  }
  const fromPending = normalizeExternalLivesTimer(pendingExternalLivesTimer);
  if (fromPending !== null) {
    return fromPending;
  }
  return null;
}

function resolveExternalSubscriptionStatus(gameInstance) {
  const fromGame = normalizeExternalSubscriptionStatus(gameInstance?.externalSubscriptionStatus);
  if (fromGame !== null) {
    return fromGame;
  }
  const fromPending = normalizeExternalSubscriptionStatus(pendingExternalSubscriptionStatus);
  if (fromPending !== null) {
    return fromPending;
  }
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const fromStorage = normalizeExternalSubscriptionStatus(
      window.localStorage.getItem(EXTERNAL_SUBSCRIPTION_STATUS_STORAGE_KEY)
    );
    return fromStorage ?? false;
  } catch {
    return false;
  }
}

function resolveExternalTimeOutCoinsCost(gameInstance) {
  const fromGame = normalizeExternalTimeOutCoinsCost(gameInstance?.externalTimeOutCoinsCost);
  if (fromGame !== null) {
    return fromGame;
  }
  const fromPending = normalizeExternalTimeOutCoinsCost(pendingExternalTimeOutCoinsCost);
  if (fromPending !== null) {
    return fromPending;
  }
  const fromStorage = loadExternalCountFromStorage(EXTERNAL_TIMEOUT_COINS_COST_STORAGE_KEY);
  if (fromStorage !== null) {
    return fromStorage;
  }
  return DEFAULT_TIMEOUT_COINS_COST;
}

function dispatchUnityCloseEvent(gameInstance) {
  if (typeof window === "undefined") {
    return false;
  }
  const coinsCount = resolveExternalCoinsCount(gameInstance);
  const heartsCount = resolveExternalHeartsCount(gameInstance);
  const closeUrl = `uniwebview://close?coins=${encodeURIComponent(String(coinsCount))}&hearts=${encodeURIComponent(String(heartsCount))}`;
  try {
    window.location.href = closeUrl;
    return true;
  } catch {
    return false;
  }
}

function dispatchUnityCompleteEvent(gameInstance) {
  if (typeof window === "undefined") {
    return false;
  }
  const coinsCount = resolveExternalCoinsCount(gameInstance);
  const heartsCount = resolveExternalHeartsCount(gameInstance);
  const completeUrl = `uniwebview://complete?coins=${encodeURIComponent(String(coinsCount))}&hearts=${encodeURIComponent(String(heartsCount))}`;
  try {
    window.location.href = completeUrl;
    return true;
  } catch {
    return false;
  }
}

function dispatchUnityRewardEvent() {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.location.href = "uniwebview://reward";
    return true;
  } catch {
    return false;
  }
}

function dispatchUnitySubscriptionRequestEvent() {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.location.href = "uniwebview://subscription_request";
    return true;
  } catch {
    return false;
  }
}

if (typeof window !== "undefined") {
  const applyExternalTimeOutCoinsCost = (timeOutCoinsCost) => {
    pendingExternalTimeOutCoinsCost = timeOutCoinsCost;
    const normalized = normalizeExternalTimeOutCoinsCost(timeOutCoinsCost);
    if (normalized === null) {
      return false;
    }
    return persistExternalTimeOutCoinsCost(normalized);
  };
  window.setLevel = (indexOrId) => {
    pendingExternalLevelSelection = indexOrId;
    return false;
  };
  window.setCoins = (coinsCount) => {
    pendingExternalCoinsCount = coinsCount;
    const normalized = normalizeExternalCoinsCount(coinsCount);
    if (normalized === null) {
      return false;
    }
    return persistExternalCoinsCount(normalized);
  };
  window.setHearts = (heartsCount) => {
    pendingExternalHeartsCount = heartsCount;
    const normalized = normalizeExternalHeartsCount(heartsCount);
    if (normalized === null) {
      return false;
    }
    return persistExternalHeartsCount(normalized);
  };
  window.setMaxLives = (maxLivesCount) => {
    pendingExternalMaxLivesCount = maxLivesCount;
    const normalized = normalizeExternalMaxLivesCount(maxLivesCount);
    if (normalized === null) {
      return false;
    }
    return persistExternalMaxLivesCount(normalized);
  };
  window.setLivesTimer = (livesTimer) => {
    pendingExternalLivesTimer = livesTimer;
    return normalizeExternalLivesTimer(livesTimer) !== null;
  };
  window.setSubscriptionStatus = (subscriptionStatus) => {
    pendingExternalSubscriptionStatus = subscriptionStatus;
    const normalized = normalizeExternalSubscriptionStatus(subscriptionStatus);
    if (normalized === null) {
      return false;
    }
    return persistExternalSubscriptionStatus(normalized);
  };
  window.setTimeOutCoinsCost = applyExternalTimeOutCoinsCost;
  window.setTimeoutCoinsCost = applyExternalTimeOutCoinsCost;
  window.rewardResult = () => false;
}

async function bootstrapGame() {
  const fallbackLevels = LEVEL_DEFINITIONS_FALLBACK.length ? LEVEL_DEFINITIONS_FALLBACK : [BUILTIN_FALLBACK_LEVEL];
  rebuildLevelRegistry(fallbackLevels);
  loadLevelOverridesFromStorage();
  applyLoadedLevelOverrides();

  const initialLevel = getLevelConfig(DEFAULT_LEVEL_ID);
  syncLevelGlobals(initialLevel);

  const canvas = document.getElementById("gameCanvas");
  const game = new Game(canvas);
  game.externalMaxLivesCount = resolveExternalMaxLivesCount(game);
  game.externalLivesTimer = resolveExternalLivesTimer(game);
  game.externalSubscriptionStatus = resolveExternalSubscriptionStatus(game);

  const resolveExternalLevelSelection = (value) => {
    const levels = Array.isArray(game.availableLevels) ? game.availableLevels : [];
    if (levels.length === 0) {
      return null;
    }

    const raw = String(value ?? "").trim();
    if (raw.length === 0) {
      return null;
    }

    if (levels.some((level) => level.id === raw)) {
      const displayLevelNumber = isPositiveIntegerString(raw) ? Number(raw) : null;
      return {
        targetLevelId: raw,
        displayLevelNumber,
      };
    }

    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    const index = Math.trunc(numeric);
    if (index < 0) {
      return null;
    }

    // Preferred path for Unity: index in available levels (0-based).
    // For indexes outside the range, loop cyclically through the available levels.
    const normalizedIndex = index % levels.length;
    return {
      targetLevelId: levels[normalizedIndex].id,
      displayLevelNumber: index > 0 ? index : 1,
    };
  };

  window.game = game;
  window.setLevel = (indexOrId) => {
    pendingExternalLevelSelection = indexOrId;
    const selection = resolveExternalLevelSelection(indexOrId);
    if (!selection) {
      return false;
    }
    game.applyLevelConfig(selection.targetLevelId, {
      restart: true,
      displayLevelNumber: selection.displayLevelNumber,
    });
    game.syncDebugContentSelectors();
    game.saveDebugSettings();
    return true;
  };
  window.setCoins = (coinsCount) => {
    pendingExternalCoinsCount = coinsCount;
    const normalized = normalizeExternalCoinsCount(coinsCount);
    if (normalized === null) {
      return false;
    }
    game.externalCoinsCount = normalized;
    game.invalidate(false);
    return persistExternalCoinsCount(normalized);
  };
  window.setHearts = (heartsCount) => {
    pendingExternalHeartsCount = heartsCount;
    const normalized = normalizeExternalHeartsCount(heartsCount);
    if (normalized === null) {
      return false;
    }
    game.externalHeartsCount = normalized;
    return persistExternalHeartsCount(normalized);
  };
  window.setMaxLives = (maxLivesCount) => {
    pendingExternalMaxLivesCount = maxLivesCount;
    const normalized = normalizeExternalMaxLivesCount(maxLivesCount);
    if (normalized === null) {
      return false;
    }
    game.externalMaxLivesCount = normalized;
    game.invalidate(false);
    return persistExternalMaxLivesCount(normalized);
  };
  window.setLivesTimer = (livesTimer) => {
    pendingExternalLivesTimer = livesTimer;
    const normalized = normalizeExternalLivesTimer(livesTimer);
    if (normalized === null) {
      return false;
    }
    game.externalLivesTimer = normalized;
    game.invalidate(false);
    return true;
  };
  window.setSubscriptionStatus = (subscriptionStatus) => {
    pendingExternalSubscriptionStatus = subscriptionStatus;
    const normalized = normalizeExternalSubscriptionStatus(subscriptionStatus);
    if (normalized === null) {
      return false;
    }
    game.externalSubscriptionStatus = normalized;
    game.invalidate(false);
    return persistExternalSubscriptionStatus(normalized);
  };
  const applyExternalTimeOutCoinsCost = (timeOutCoinsCost) => {
    pendingExternalTimeOutCoinsCost = timeOutCoinsCost;
    const normalized = normalizeExternalTimeOutCoinsCost(timeOutCoinsCost);
    if (normalized === null) {
      return false;
    }
    game.externalTimeOutCoinsCost = normalized;
    game.invalidate(false);
    return persistExternalTimeOutCoinsCost(normalized);
  };
  window.setTimeOutCoinsCost = applyExternalTimeOutCoinsCost;
  window.setTimeoutCoinsCost = applyExternalTimeOutCoinsCost;
  window.rewardResult = (result) => {
    const normalized = String(result ?? "").trim().toLowerCase();
    if (normalized !== "true") {
      return false;
    }
    return game.continueFromLoseWithOneSlotCore({ spendCoins: false });
  };
  window.advanceTime = (ms) => game.advanceTime(ms);
  window.render_game_to_text = () => game.renderGameToText();
  window.debug6 = () => game.triggerDebug6();
  window.debugLose = () => game.triggerDebugLose();

  if (pendingExternalLevelSelection !== null && pendingExternalLevelSelection !== undefined) {
    window.setLevel(pendingExternalLevelSelection);
  }
  if (pendingExternalCoinsCount !== null && pendingExternalCoinsCount !== undefined) {
    window.setCoins(pendingExternalCoinsCount);
  }
  if (pendingExternalHeartsCount !== null && pendingExternalHeartsCount !== undefined) {
    window.setHearts(pendingExternalHeartsCount);
  }
  if (pendingExternalMaxLivesCount !== null && pendingExternalMaxLivesCount !== undefined) {
    window.setMaxLives(pendingExternalMaxLivesCount);
  }
  if (pendingExternalLivesTimer !== null && pendingExternalLivesTimer !== undefined) {
    window.setLivesTimer(pendingExternalLivesTimer);
  }
  if (pendingExternalSubscriptionStatus !== null && pendingExternalSubscriptionStatus !== undefined) {
    window.setSubscriptionStatus(pendingExternalSubscriptionStatus);
  }
  if (pendingExternalTimeOutCoinsCost !== null && pendingExternalTimeOutCoinsCost !== undefined) {
    window.setTimeOutCoinsCost(pendingExternalTimeOutCoinsCost);
  }

  void hydrateLevelDefinitionsInBackground(game);
}

async function hydrateLevelDefinitionsInBackground(game) {
  const loadedLevels = await loadLevelDefinitions();
  if (!loadedLevels.length) {
    return;
  }

  rebuildLevelRegistry(loadedLevels);
  loadLevelOverridesFromStorage();
  applyLoadedLevelOverrides();

  if (game && typeof game.fillDebugContentSelectors === "function") {
    game.fillDebugContentSelectors();
    game.syncDebugContentSelectors();
  }

  if (pendingExternalLevelSelection !== null && pendingExternalLevelSelection !== undefined && typeof window.setLevel === "function") {
    window.setLevel(pendingExternalLevelSelection);
  }
}

void bootstrapGame();
