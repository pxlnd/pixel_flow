class SoundManager {
  constructor(definitions = {}) {
    this.definitionByName = new Map();
    this.soundByName = new Map();
    this.poolByName = new Map();
    this.lastPlayAtByName = new Map();
    this.unlocked = false;
    this.howlerEnabled = typeof Howl === "function" && typeof Howler !== "undefined" && !!Howler;

    for (const [name, config] of Object.entries(definitions)) {
      const src = typeof config?.src === "string" ? config.src : "";
      if (!src) {
        continue;
      }
      const channelsCount = Math.max(1, Math.min(16, Math.round(Number(config.channels) || 1)));
      const volume = Number.isFinite(config.volume) ? Math.max(0, Math.min(1, Number(config.volume))) : 1;
      const minIntervalMs = Math.max(0, Math.round(Number(config?.minIntervalMs) || 0));
      const definition = { src, channelsCount, volume, minIntervalMs };
      this.definitionByName.set(name, definition);
      if (this.howlerEnabled) {
        const sound = this.createHowl(definition);
        if (sound) {
          this.soundByName.set(name, sound);
        }
      }
    }
  }

  createHowl(definition) {
    try {
      return new Howl({
        src: [definition.src],
        preload: true,
        volume: definition.volume,
        pool: definition.channelsCount,
      });
    } catch {
      return null;
    }
  }

  getNowMs() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }
    return Date.now();
  }

  ensureFallbackPool(name) {
    if (this.poolByName.has(name)) {
      return this.poolByName.get(name);
    }
    const definition = this.definitionByName.get(name);
    if (!definition || typeof Audio !== "function") {
      return null;
    }
    const channels = [];
    for (let i = 0; i < definition.channelsCount; i += 1) {
      let audio = null;
      try {
        audio = new Audio(definition.src);
      } catch {
        audio = null;
      }
      if (!audio) {
        continue;
      }
      audio.preload = "auto";
      audio.volume = definition.volume;
      try {
        audio.load();
      } catch {
        // Ignore eager-loading failures.
      }
      channels.push(audio);
    }
    if (channels.length === 0) {
      return null;
    }
    const pool = { channels, cursor: 0 };
    this.poolByName.set(name, pool);
    return pool;
  }

  playFromHowler(name, definition) {
    const sound = this.soundByName.get(name);
    if (!sound) {
      return false;
    }
    try {
      sound.volume(definition.volume);
      sound.play();
      return true;
    } catch {
      return false;
    }
  }

  playFromFallbackPool(name) {
    const pool = this.poolByName.get(name) || this.ensureFallbackPool(name);
    if (!pool || pool.channels.length === 0) {
      return;
    }

    const channels = pool.channels;
    const channelCount = channels.length;
    let picked = null;
    for (let i = 0; i < channelCount; i += 1) {
      const index = (pool.cursor + i) % channelCount;
      const candidate = channels[index];
      if (candidate.paused || candidate.ended) {
        picked = candidate;
        pool.cursor = (index + 1) % channelCount;
        break;
      }
    }

    if (!picked) {
      picked = channels[pool.cursor];
      pool.cursor = (pool.cursor + 1) % channelCount;
    }

    try {
      picked.currentTime = 0;
      const playResult = picked.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {});
      }
    } catch {
      // Ignore audio playback failures (e.g. autoplay restrictions).
    }
  }

  unlock() {
    if (this.unlocked) {
      return;
    }
    this.unlocked = true;

    if (this.howlerEnabled) {
      if (Howler.ctx && typeof Howler.ctx.resume === "function") {
        try {
          const resumeResult = Howler.ctx.resume();
          if (resumeResult && typeof resumeResult.catch === "function") {
            resumeResult.catch(() => {});
          }
        } catch {
          // Ignore resume failures.
        }
      }

      for (const sound of this.soundByName.values()) {
        try {
          if (typeof sound.state === "function" && sound.state() === "unloaded") {
            sound.load();
          }
        } catch {
          // Ignore explicit preload failures.
        }
      }
      return;
    }

    for (const name of this.definitionByName.keys()) {
      this.ensureFallbackPool(name);
    }
  }

  play(name) {
    const definition = this.definitionByName.get(name);
    if (!definition || !this.unlocked) {
      return;
    }
    const now = this.getNowMs();
    if (definition.minIntervalMs > 0) {
      const lastPlayAt = this.lastPlayAtByName.get(name) ?? -Infinity;
      if (now - lastPlayAt < definition.minIntervalMs) {
        return;
      }
      this.lastPlayAtByName.set(name, now);
    }

    if (this.howlerEnabled && this.playFromHowler(name, definition)) {
      return;
    }

    this.playFromFallbackPool(name);
  }
}
