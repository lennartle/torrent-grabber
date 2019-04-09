const needle = require("needle");
const xray = require("../utils/xray");

module.exports = class ThePirateBay {
  constructor() {
    this.name = "ThePirateBay";
    this.active = false;
    this.checked = false;
    this.requireLogin = false;

    this.BASE_LINK = "https://piratebay.live";
  }

  async search(query) {
    console.log(`${this.BASE_LINK}/search/${query}/0/99/0`)
    const resp = await needle(
      "get",
      `${this.BASE_LINK}/search/${query}/0/99/0`
    );

    const items = await xray(resp.body, "#searchResult tr", [
      {
        title: "a.detLink@text",
        size: '.detDesc@text | match: "Size.(.+?)," | fixSize',
        seeds: "td:nth-child(3)@text | int",
        trackerId: "td:nth-child(2) > a:nth-child(2)@href"
      }
    ]);

    return items;
  }

  async getMagnet(torrentId) {
    return torrentId;
  }

  async activate() {
    if (!this.checked) {
      const resp = await needle("get", this.BASE_LINK);

      if (resp.statusCode == 200) {
        this.active = true;
        this.checked = true;
      }
    } else {
      this.active = true;
    }

    return this.name;
  }
};
