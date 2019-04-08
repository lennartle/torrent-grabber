const needle = require("needle");
const fs = require("filesize");

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
      `${this.BASE_LINK}/forum/tracker.php`,
      postData
    );

    const page = new DOMParser().parseFromString(resp.body, "text/html");

    const items = [...page.querySelectorAll(".tablesorter > tbody > tr")];

    const convertedItems = items.map(item => {
      return {
        tracker: this.name,
        title: item.querySelector(".genmed > a > b").textContent,
        size: fs(item.querySelector("td:nth-child(6) > u").textContent),
        seeds: item.querySelector(".seedmed > b").textContent,
        trackerId: item.querySelector(".genmed > a").href.split("=")[1]
      };
    });

    return convertedItems;
  }

  async getMagnet(torrentId) {
    const resp = await needle(
      "get",
      `${this.BASE_LINK}/forum/viewtopic.php?t=${torrentId}`
    );

    const page = new DOMParser().parseFromString(resp.body, "text/html");

    return page.querySelector("td.gensmall > a").href;
  }

  async activate() {
    if (!this.checked) {
      const resp = await needle("get", `${this.BASE_LINK}/forum/tracker.php`);

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
