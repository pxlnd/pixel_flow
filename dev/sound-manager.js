class SoundManager {
  constructor(definitions = {}) {
    this.poolByName = new Map();
    this.unlocked = false;
    if (typeof Audio !== "function") {
      return;
    }
    for (const [name, config] of Object.entries(definitions)) {
      const src = typeof config?.src === "string" ? config.src : "";
      if (!src) {
        continue;
      }
      const channelsCount = Math.max(1, Math.min(8, Math.round(Number(config.channels) || 1)));
      const volume = Number.isFinite(config.volume) ? Math.max(0, Math.min(1, config.volume)) : 1;
      const channels = [];
      for (let i = 0; i < channelsCount; i += 1) {
        let audio = null;
        try {
          audio = new Audio(src);
        } catch {
          audio = null;
        }
        if (!audio) {
          continue;
        }
        audio.preload = "auto";
        audio.volume = volume;
        channels.push(audio);
      }
      if (channels.length === 0) {
        continue;
      }
      this.poolByName.set(name, {
        channels,
        cursor: 0,
      });
    }
  }

  unlock() {
    if (this.unlocked) {
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
          // iOS can keep the promise pending for a while; don't leave channel muted forever.
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
    this.unlocked = true;
  }

  play(name) {
    const pool = this.poolByName.get(name);
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
}
