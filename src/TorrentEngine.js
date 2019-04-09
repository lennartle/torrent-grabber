const { readdirSync } = require("fs");
const path = require("path");

module.exports = class TorrentEngine {
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

  activate(...torrents) {
    const promises = [];

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

      if (!torrentObj) {
        throw new Error(`Torrent ${name} not found.`);
      }

      if (!torrentObj.active) {
        promises.push(torrentObj.activate(login, pass));
      }
    });

    return Promise.all(promises);
  }

  deactivate(...torrents) {
    torrents.forEach(torrent => {
      let name;

      if (torrent instanceof Array) {
        name = torrent[0];
      } else {
        name = torrent;
      }

      const torrentObj = this.torrents.get(name);

      if (!torrentObj) {
        throw new Error(`Torrent ${name} not found.`);
      }

      if (torrentObj.active) {
        torrentObj.active = false;
      }
    });
  }

  async search(query, opts = {}) {
    const requests = [];

    for (const [key, torrent] of this.torrents) {
      if (torrent.active) {
        requests.push(
          torrent.search(query).then(i =>
            i.map(i => {
              return { tracker: torrent.name, ...i };
            })
          )
        );
      }
    }

    let results = await Promise.all(requests);

    if (opts.groupByTracker) {
      const trackerMap = new Map();

      results.forEach(arr => {
        trackerMap.set(arr[0].tracker, arr);
      });

      results = trackerMap;
    } else {
      results = results
        .reduce((acc, val) => acc.concat(val))
        .sort((a, b) => a.seeds - b.seeds)
        .reverse();
    }

    return results;
  }

  async getMagnet(item) {
    const tracker = this.torrents.get(item.tracker);

    return await tracker.getMagnet(item.trackerId);
  }
};
