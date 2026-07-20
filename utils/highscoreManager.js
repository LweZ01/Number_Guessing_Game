import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HIGHSCORE_PATH = join(__dirname, "highscores.json");

const DEFAULT_SCORES = {
  easy: null,
  medium: null,
  hard: null,
};

export async function leerHighscores() {
  if (!existsSync(HIGHSCORE_PATH)) {
    return { ...DEFAULT_SCORES };
  }

  try {
    const contenido = await readFile(HIGHSCORE_PATH, "utf-8");
    return { ...DEFAULT_SCORES, ...JSON.parse(contenido) };
  } catch {
    return { ...DEFAULT_SCORES };
  }
}

export async function guardarHighscore(dificultad, attempts) {
  const scores = await leerHighscores();
  const actual = scores[dificultad];

  const esNuevoRecord = actual === null || attempts < actual;

  if (esNuevoRecord) {
    scores[dificultad] = attempts;
    await writeFile(HIGHSCORE_PATH, JSON.stringify(scores, null, 2), "utf-8");
  }

  return esNuevoRecord;
}
