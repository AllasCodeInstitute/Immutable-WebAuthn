export class FakeTime {
  #now: number;
  constructor(date: Date | number = Date.now()) { this.#now = +date; Date.now = () => this.#now; }
  restore() { Date.now = this.#realNow; }
  #realNow = Date.now;
}
