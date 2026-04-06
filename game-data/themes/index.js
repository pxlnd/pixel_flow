(function initPixelFlowThemes(global) {
  const THEME_DEFINITIONS = [global.PIXELFLOW_THEME_CLASSIC, global.PIXELFLOW_THEME_SUNSET].filter(Boolean);
  const DEFAULT_THEME_ID = THEME_DEFINITIONS[0]?.id || "classic";
  const THEME_MAP = new Map(THEME_DEFINITIONS.map((theme) => [theme.id, theme]));

  function clone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function getThemeConfig(themeId) {
    return clone(THEME_MAP.get(themeId) || THEME_MAP.get(DEFAULT_THEME_ID));
  }

  global.PIXELFLOW_THEMES = {
    THEME_DEFINITIONS,
    DEFAULT_THEME_ID,
    getThemeConfig,
  };
})(window);
