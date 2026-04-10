const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 3000;

const LEVEL_FILE_RE = /^level-\d+\.json$/;
const LEVELS_DIR = path.join(__dirname, 'data', 'levels');
const MANIFEST_PATH = path.join(LEVELS_DIR, 'manifest.json');
const SETTINGS_DIR = path.join(__dirname, 'data', 'settings');
const COMMON_SETTINGS_PATH = path.join(SETTINGS_DIR, 'game-settings.json');
const DEFAULT_COMMON_SETTINGS = Object.freeze({
  physics: {
    impulse: 0.2,
    braking: 0.0035
  }
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function parseLevelNumber(fileName) {
  const match = /^level-(\d+)\.json$/.exec(fileName || '');
  return match ? Number(match[1]) : null;
}

function ensureValidLevelFileName(fileName) {
  if (!LEVEL_FILE_RE.test(fileName || '')) {
    return false;
  }
  return true;
}

async function ensureLevelsDir() {
  await fs.mkdir(LEVELS_DIR, { recursive: true });
}

async function ensureSettingsDir() {
  await fs.mkdir(SETTINGS_DIR, { recursive: true });
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function readManifest() {
  try {
    const manifest = await readJson(MANIFEST_PATH);
    if (!manifest || !Array.isArray(manifest.levels)) return null;

    return manifest.levels
      .filter((entry) => ensureValidLevelFileName(entry))
      .sort((a, b) => (parseLevelNumber(a) || 0) - (parseLevelNumber(b) || 0));
  } catch {
    return null;
  }
}

async function listLevelFiles() {
  await ensureLevelsDir();

  const fromManifest = await readManifest();
  if (fromManifest && fromManifest.length) {
    return fromManifest;
  }

  const entries = await fs.readdir(LEVELS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && ensureValidLevelFileName(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => (parseLevelNumber(a) || 0) - (parseLevelNumber(b) || 0));
}

async function writeManifest(files) {
  await ensureLevelsDir();

  const uniqueSorted = [...new Set(files)]
    .filter((entry) => ensureValidLevelFileName(entry))
    .sort((a, b) => (parseLevelNumber(a) || 0) - (parseLevelNumber(b) || 0));

  await fs.writeFile(
    MANIFEST_PATH,
    `${JSON.stringify({ levels: uniqueSorted }, null, 2)}\n`,
    'utf8'
  );
}

function validateLevelPayload(body) {
  if (!body || typeof body !== 'object') {
    return 'Body должен быть JSON-объектом.';
  }

  if (!Number.isFinite(Number(body.number)) || Number(body.number) < 1) {
    return 'Поле number должно быть числом >= 1.';
  }

  if (!Array.isArray(body.stages)) {
    return 'Поле stages должно быть массивом.';
  }

  return null;
}

function normalizeImpulse(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_COMMON_SETTINGS.physics.impulse;
  return Math.max(0.05, Math.min(1, parsed));
}

function normalizeBraking(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_COMMON_SETTINGS.physics.braking;
  return Math.max(0.0005, Math.min(0.03, parsed));
}

function normalizeCommonSettings(body) {
  return {
    physics: {
      impulse: Number(normalizeImpulse(body?.physics?.impulse).toFixed(4)),
      braking: Number(normalizeBraking(body?.physics?.braking).toFixed(6))
    }
  };
}

function validateCommonSettingsPayload(body) {
  if (!body || typeof body !== 'object') {
    return 'Body должен быть JSON-объектом.';
  }

  if (!body.physics || typeof body.physics !== 'object') {
    return 'Поле physics должно быть объектом.';
  }

  const impulse = Number(body.physics.impulse);
  if (!Number.isFinite(impulse) || impulse < 0.05 || impulse > 1) {
    return 'physics.impulse должен быть числом в диапазоне 0.05..1.';
  }

  const braking = Number(body.physics.braking);
  if (!Number.isFinite(braking) || braking < 0.0005 || braking > 0.03) {
    return 'physics.braking должен быть числом в диапазоне 0.0005..0.03.';
  }

  return null;
}

async function readOrCreateCommonSettings() {
  await ensureSettingsDir();

  try {
    const parsed = await readJson(COMMON_SETTINGS_PATH);
    const normalized = normalizeCommonSettings(parsed);
    return normalized;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    const defaults = normalizeCommonSettings(DEFAULT_COMMON_SETTINGS);
    await fs.writeFile(COMMON_SETTINGS_PATH, `${JSON.stringify(defaults, null, 2)}\n`, 'utf8');
    return defaults;
  }
}

app.get('/api/settings/common', async (_req, res) => {
  try {
    const settings = await readOrCreateCommonSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).send(`Не удалось прочитать общие настройки: ${error.message}`);
  }
});

app.put('/api/settings/common', async (req, res) => {
  const payloadError = validateCommonSettingsPayload(req.body);
  if (payloadError) {
    res.status(400).send(payloadError);
    return;
  }

  const settings = normalizeCommonSettings(req.body);

  try {
    await ensureSettingsDir();
    await fs.writeFile(COMMON_SETTINGS_PATH, `${JSON.stringify(settings, null, 2)}\n`, 'utf8');

    res.json({
      ok: true,
      settings,
      path: path.relative(__dirname, COMMON_SETTINGS_PATH)
    });
  } catch (error) {
    res.status(500).send(`Не удалось сохранить общие настройки: ${error.message}`);
  }
});

app.get('/api/levels', async (_req, res) => {
  try {
    const files = await listLevelFiles();
    const levels = [];

    for (const file of files) {
      const filePath = path.join(LEVELS_DIR, file);
      try {
        const data = await readJson(filePath);
        levels.push({
          file,
          number: Number(data.number) || parseLevelNumber(file) || null,
          stageCount: Array.isArray(data.stages) ? data.stages.length : 0
        });
      } catch {
        levels.push({
          file,
          number: parseLevelNumber(file) || null,
          stageCount: 0
        });
      }
    }

    res.json({ levels });
  } catch (error) {
    res.status(500).send(`Не удалось прочитать список уровней: ${error.message}`);
  }
});

app.get('/api/levels/:fileName', async (req, res) => {
  const { fileName } = req.params;

  if (!ensureValidLevelFileName(fileName)) {
    res.status(400).send('Некорректное имя файла уровня.');
    return;
  }

  const filePath = path.join(LEVELS_DIR, fileName);

  try {
    const data = await readJson(filePath);
    res.json(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send('Файл уровня не найден.');
      return;
    }
    res.status(500).send(`Не удалось прочитать уровень: ${error.message}`);
  }
});

app.put('/api/levels/:fileName', async (req, res) => {
  const { fileName } = req.params;

  if (!ensureValidLevelFileName(fileName)) {
    res.status(400).send('Некорректное имя файла уровня.');
    return;
  }

  const payloadError = validateLevelPayload(req.body);
  if (payloadError) {
    res.status(400).send(payloadError);
    return;
  }

  const safeData = {
    number: Number(req.body.number),
    stages: req.body.stages
  };

  const filePath = path.join(LEVELS_DIR, fileName);

  try {
    await ensureLevelsDir();

    await fs.writeFile(filePath, `${JSON.stringify(safeData, null, 2)}\n`, 'utf8');

    const files = await listLevelFiles();
    if (!files.includes(fileName)) files.push(fileName);
    await writeManifest(files);

    res.json({
      ok: true,
      file: fileName,
      path: path.relative(__dirname, filePath)
    });
  } catch (error) {
    res.status(500).send(`Не удалось сохранить уровень: ${error.message}`);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
