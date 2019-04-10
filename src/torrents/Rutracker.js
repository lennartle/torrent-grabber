const needle = require("needle");
const xray = require("../utils/xray");

module.exports = class Rutracker {
  constructor() {
    this.name = "Rutracker";
    this.active = false;
    this.checked = false;
    this.requireLogin = true;
    this.cookie = null;

    this.BASE_LINK = "https://projectlensrtr.tk";
  }

  async search(query) {
    const postData = require("querystring").stringify({
      nm: query,
      f: "-1",
      o: 10
    });

    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
        Cookie: this.cookie
      }
    };

    const resp = await needle(
      "post",
      `${this.BASE_LINK}/forum/tracker.php`,
      postData,
      options
    );

    const items = await xray(resp.body, "#tor-tbl > tbody > tr", [
      {
        title: ".t-title > a@text",
        size: ".tor-size > u@text | int",
        seeds: "td:nth-child(7) > u@text | int",
        trackerId: ".t-title > a@href"
      }
    ]);

    return items;
  }

  async getMagnet(torrentId) {
    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": 0,
        Cookie: this.cookie
      }
    };

    const resp = await needle(
      "post",
      `${this.BASE_LINK}/forum/${torrentId}`,
      {},
      options
    );

    return await xray(resp.body, ".magnet-link-16@href");
  }

  async activate(login, pass) {
    if (!login || !pass) {
      throw new Error("Requieres login credentials!");
    }

    const postData = require("querystring").stringify({
      login_username: login,
      login_password: pass,
      login: "Вход"
    });

    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };

    const resp = await needle(
      "post",
      `${this.BASE_LINK}/forum/login.php`,
      postData,
      options
    );

    if (resp.statusCode.toString() === "302") {
      this.cookie = resp.headers["set-cookie"][1];
    } else {
      throw new Error("Wrong credentials!");
    }
  }
};
