const { readdirSync } = require("fs");
const path = require("path");

class TorrentEngine {
  constructor() {
    this.torrents = new Map();

    this.loadTorrents();
  }

  loadTorrents() {
    const torrentsPath = path.join(__dirname, "torrents");

    readdirSync(torrentsPath).forEach(file => {
      const torrent = new (require(path.join(torrentsPath, file)))();

      this.torrents.set(torrent.name, torrent);
    });
  }

  selectTorrents(...torrents) {
    torrents.forEach(torrent => {
      let name, login, pass;

      if (torrent instanceof Array) {
        name = torrent[0];
        login = torrent[1].login;
        pass = torrent[1].pass;
      } else {
        name = torrent;
      }

      const torrentObj = this.torrents.get(name);

      if (!torrentObj.active) {
        torrentObj.activate(login, pass);
      }
    });
  }

  search(query) {}
}

module.exports = TorrentEngine;
