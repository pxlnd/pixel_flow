class SoundManager {
  constructor(definitions = {}) {
    this.definitionByName = new Map();
    this.bufferByName = new Map();
    this.loadingByName = new Map();
    this.poolByName = new Map();
    this.audioContext = null;
    this.webAudioEnabled = false;
    this.unlocked = false;
    this.warmupStarted = false;
    this.isFileProtocol =
      typeof window !== "undefined"
      && window.location
      && window.location.protocol === "file:";

    const AudioContextClass =
      typeof window !== "undefined"
        ? (window.AudioContext || window.webkitAudioContext || null)
        : null;
    // In file:// mode many browsers block fetch/decode for local audio files.
    // Prefer HTMLAudio fallback there to keep SFX reliable in direct index.html runs.
    if (!this.isFileProtocol && AudioContextClass && typeof fetch === "function") {
      try {
        this.audioContext = new AudioContextClass({ latencyHint: "interactive" });
        this.webAudioEnabled = true;
      } catch {
        this.audioContext = null;
        this.webAudioEnabled = false;
      }
    }

    for (const [name, config] of Object.entries(definitions)) {
      const src = typeof config?.src === "string" ? config.src : "";
      if (!src) {
        continue;
      }
      const channelsCount = Math.max(1, Math.min(8, Math.round(Number(config.channels) || 1)));
      const volume = Number.isFinite(config.volume) ? Math.max(0, Math.min(1, config.volume)) : 1;
      this.definitionByName.set(name, {
        src,
        channelsCount,
        volume,
      });
    }
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
      channels.push(audio);
    }
    if (channels.length === 0) {
      return null;
    }
    const pool = { channels, cursor: 0 };
    this.poolByName.set(name, pool);
    return pool;
  }

  ensureAllFallbackPools() {
    for (const name of this.definitionByName.keys()) {
      this.ensureFallbackPool(name);
    }
  }

  queueWarmupBuffers() {
    if (!this.webAudioEnabled || this.warmupStarted) {
      return;
    }
    this.warmupStarted = true;
    setTimeout(() => {
      this.warmupBuffers();
    }, 0);
  }

  warmupBuffers() {
    if (!this.webAudioEnabled) {
      return;
    }
    const names = [...this.definitionByName.keys()];
    names.sort((a, b) => {
      if (a === "buble") {
        return -1;
      }
      if (b === "buble") {
        return 1;
      }
      return 0;
    });
    for (const name of names) {
      void this.ensureBufferLoaded(name);
    }
  }

  decodeAudioData(ctx, arrayBuffer) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const finishResolve = (buffer) => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(buffer);
      };
      const finishReject = (error) => {
        if (settled) {
          return;
        }
        settled = true;
        reject(error);
      };

      try {
        const maybePromise = ctx.decodeAudioData(arrayBuffer, finishResolve, finishReject);
        if (maybePromise && typeof maybePromise.then === "function") {
          maybePromise.then(finishResolve).catch(finishReject);
        }
      } catch (error) {
        finishReject(error);
      }
    });
  }

  ensureBufferLoaded(name) {
    if (!this.webAudioEnabled || !this.audioContext) {
      return Promise.resolve(null);
    }
    if (this.bufferByName.has(name)) {
      return Promise.resolve(this.bufferByName.get(name));
    }
    if (this.loadingByName.has(name)) {
      return this.loadingByName.get(name);
    }
    const definition = this.definitionByName.get(name);
    if (!definition?.src) {
      return Promise.resolve(null);
    }

    const loadingPromise = (async () => {
      try {
        const response = await fetch(definition.src, { cache: "force-cache" });
        if (!response.ok) {
          return null;
        }
        const raw = await response.arrayBuffer();
        const decoded = await this.decodeAudioData(this.audioContext, raw.slice(0));
        this.bufferByName.set(name, decoded);
        return decoded;
      } catch {
        return null;
      } finally {
        this.loadingByName.delete(name);
      }
    })();
    this.loadingByName.set(name, loadingPromise);
    return loadingPromise;
  }

  unlockFallbackPools() {
    if (this.poolByName.size === 0) {
      return;
    }
    for (const pool of this.poolByName.values()) {
      for (const audio of pool.channels) {
        const prevMuted = !!audio.muted;
        let settled = false;
        const settle = () => {
          if (settled) {
            return;
          }
          settled = true;
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch {
            // Ignore reset failures.
          }
          audio.muted = prevMuted;
        };
        try {
          audio.muted = true;
          audio.currentTime = 0;
          const playResult = audio.play();
          const timeoutId = setTimeout(settle, 450);
          if (playResult && typeof playResult.then === "function") {
            playResult
              .then(() => {
                clearTimeout(timeoutId);
                settle();
              })
              .catch(() => {
                clearTimeout(timeoutId);
                settle();
              });
          } else {
            clearTimeout(timeoutId);
            settle();
          }
        } catch {
          settle();
        }
      }
    }
  }

  playFromWebAudio(name) {
    if (!this.webAudioEnabled || !this.audioContext || !this.unlocked) {
      return false;
    }
    const definition = this.definitionByName.get(name);
    const buffer = this.bufferByName.get(name);
    if (!definition || !buffer) {
      return false;
    }
    try {
      if (this.audioContext.state !== "running") {
        void this.audioContext.resume();
        return false;
      }
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      const gain = this.audioContext.createGain();
      gain.gain.value = definition.volume;
      source.connect(gain);
      gain.connect(this.audioContext.destination);
      source.start(0);
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
    if (this.webAudioEnabled && this.audioContext) {
      void this.audioContext.resume();
      this.queueWarmupBuffers();
    }
    this.ensureAllFallbackPools();
    this.unlockFallbackPools();
  }

  play(name) {
    if (this.webAudioEnabled) {
      this.queueWarmupBuffers();
      if (this.playFromWebAudio(name)) {
        return;
      }
      void this.ensureBufferLoaded(name);
    }
    this.playFromFallbackPool(name);
  }
}
