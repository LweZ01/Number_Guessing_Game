export class NumberGuessingGame {
  constructor(chances, difficulty) {
    this.secretNumber = Math.floor(Math.random() * 100) + 1;
    this.chances = chances;
    this.difficulty = difficulty;
    this.attempts = 0;
    this.hasWon = false;
    this.lastGuess = null;
    this.startTime = Date.now();
    this.endTime = null;
  }

  guess(numero) {
    this.attempts++;
    this.lastGuess = numero;

    if (numero === this.secretNumber) {
      this.hasWon = true;
      this.endTime = Date.now();
      return "correct";
    }

    return numero < this.secretNumber ? "greater" : "less";
  }

  darPista() {
    const distancia = Math.abs(this.secretNumber - this.lastGuess);
    const paridad = this.secretNumber % 2 === 0 ? "even" : "odd";

    let cercania;
    if (distancia <= 5) cercania = "very close";
    else if (distancia <= 15) cercania = "close";
    else cercania = "far";

    return `Hint: you are ${cercania} to the number, and it's ${paridad}.`;
  }

  get intentosRestantes() {
    return this.chances - this.attempts;
  }

  get terminado() {
    return this.hasWon || this.attempts >= this.chances;
  }

  get tiempoTranscurrido() {
    const fin = this.endTime ?? Date.now();
    return ((fin - this.startTime) / 1000).toFixed(1);
  }
}
