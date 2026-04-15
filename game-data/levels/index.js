(function initPixelFlowLevels(global) {
  const LEVEL_DEFINITIONS = Object.keys(global)
    .filter((key) => /^PIXELFLOW_LEVEL_\d+$/.test(key))
    .sort((a, b) => {
      const aNumber = Number(a.slice("PIXELFLOW_LEVEL_".length));
      const bNumber = Number(b.slice("PIXELFLOW_LEVEL_".length));
      return aNumber - bNumber;
    })
    .map((key) => global[key])
    .filter(Boolean);
  const DEFAULT_LEVEL_ID = LEVEL_DEFINITIONS[0]?.id || "1";
  const LEVEL_MAP = new Map(LEVEL_DEFINITIONS.map((level) => [level.id, level]));

  function clone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function getLevelConfig(levelId) {
    return clone(LEVEL_MAP.get(levelId) || LEVEL_MAP.get(DEFAULT_LEVEL_ID));
  }

  global.PIXELFLOW_LEVELS = {
    LEVEL_DEFINITIONS,
    DEFAULT_LEVEL_ID,
    getLevelConfig,
  };
})(window);
