module.exports = class Rutracker {
  constructor() {
    this.name = "Rutracker";
    this.active = false;
  }

  activate(login, pass) {
    if (!login || !pass) {
      throw new Error("Requieres login!");
    }

    this.active = true;
  }
};
