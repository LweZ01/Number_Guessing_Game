import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { NumberGuessingGame } from "./utils/NumberGuessingGame.js";
import { leerHighscores, guardarHighscore } from "./utils/highscoreManager.js";

const DIFICULTADES = {
  1: { nombre: "Easy", chances: 10, key: "easy" },
  2: { nombre: "Medium", chances: 5, key: "medium" },
  3: { nombre: "Hard", chances: 3, key: "hard" },
};

const mostrarBienvenida = () => {
  console.log("\nWelcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log("Try to guess it before you run out of chances.\n");
};

const elegirDificultad = async (rl) => {
  const highscores = await leerHighscores();

  console.log("Please select the difficulty level:");
  console.log(
    `1. Easy (10 chances)${highscores.easy ? ` — best: ${highscores.easy}` : ""}`,
  );
  console.log(
    `2. Medium (5 chances)${highscores.medium ? ` — best: ${highscores.medium}` : ""}`,
  );
  console.log(
    `3. Hard (3 chances)${highscores.hard ? ` — best: ${highscores.hard}` : ""}`,
  );

  const eleccion = await rl.question("Enter your choice: ");
  const dificultad = DIFICULTADES[eleccion.trim()];

  if (!dificultad) {
    console.log("Invalid option, please try again.\n");
    return elegirDificultad(rl);
  }

  console.log(
    `\nGreat! You have selected the ${dificultad.nombre} difficulty level.`,
  );
  console.log("Let's start the game!\n");

  return dificultad;
};

const jugarRonda = async (rl, dificultad) => {
  const game = new NumberGuessingGame(dificultad.chances, dificultad.key);

  while (!game.terminado) {
    const respuesta = await rl.question(
      `Enter your guess (${game.intentosRestantes} chances left, or type "hint"): `,
    );
    const texto = respuesta.trim().toLowerCase();

    if (texto === "hint") {
      if (game.lastGuess === null) {
        console.log("Make a guess first before asking for a hint!\n");
      } else {
        console.log(game.darPista() + "\n");
      }
      continue;
    }

    const numero = Number(texto);

    if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
      console.log("Please enter a valid number between 1 and 100.\n");
      continue;
    }

    const resultado = game.guess(numero);

    if (resultado === "correct") {
      console.log(
        `\nCongratulations! You guessed the correct number in ${game.attempts} attempts.`,
      );
      console.log(`Time taken: ${game.tiempoTranscurrido}s`);

      const esNuevoRecord = await guardarHighscore(
        dificultad.key,
        game.attempts,
      );
      if (esNuevoRecord) {
        console.log("New high score for this difficulty! 🏆");
      }
    } else if (resultado === "greater") {
      console.log(`Incorrect! The number is greater than ${numero}.\n`);
    } else {
      console.log(`Incorrect! The number is less than ${numero}.\n`);
    }
  }

  if (!game.hasWon) {
    console.log(`\nOut of chances! The number was ${game.secretNumber}.`);
  }
};

const preguntarSiJuegaOtraVez = async (rl) => {
  const respuesta = await rl.question("\nDo you want to play again? (y/n): ");
  return respuesta.trim().toLowerCase().startsWith("y");
};

const iniciarJuego = async () => {
  const rl = readline.createInterface({ input, output });

  try {
    mostrarBienvenida();

    let seguirJugando = true;

    while (seguirJugando) {
      const dificultad = await elegirDificultad(rl);
      await jugarRonda(rl, dificultad);
      seguirJugando = await preguntarSiJuegaOtraVez(rl);
    }

    console.log("\nThanks for playing! See you next time.\n");
  } catch (error) {
    console.error("An error has occurred:", error);
  } finally {
    rl.close();
  }
};

iniciarJuego();
