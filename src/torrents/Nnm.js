const needle = require("needle");
const xray = require("../utils/xray");

module.exports = class Nnm {
  constructor() {
    this.name = "Nnm";
    this.active = false;
    this.checked = false;
    this.requireLogin = false;

    this.BASE_LINK = "https://nnmclub.to";
  }

  async search(query) {
    const postData = require("querystring").stringify({
      nm: query,
      f: "-1",
      o: 10
    });

    const resp = await needle(
      "post",
      `${this.BASE_LINK}/forum/tracker.php?${postData}`
    );

    const items = await xray(resp.body, ".tablesorter tr", [
      {
        title: ".genmed > a > b@text",
        size: "td:nth-child(6) > u@text | int",
        seeds: ".seedmed > b@text | int",
        trackerId: ".genmed > a@href"
      }
    ]);

    return items;
  }

  async getMagnet(torrentId) {
    const resp = await needle("get", `${this.BASE_LINK}/forum/${torrentId}`);

    return await xray(resp.body, "td.gensmall > a@href");
  }

  async activate() {
    const resp = await needle("get", `${this.BASE_LINK}/forum/tracker.php`);

    if (resp.statusCode !== 200) {
      throw new Error();
    }
  }
};
