const needle = require("needle");
const fs = require("filesize");

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

    const page = new DOMParser().parseFromString(resp.body, "text/html");

    const items = [...page.querySelectorAll("#tor-tbl > tbody > tr")];

    const filteredItems = items.filter(item => {
      return (
        item.querySelector("td:nth-child(7) > :nth-child(2)").title.length !==
          12 && item.querySelector("td:nth-child(2)").title.length !== 7
      );
    });

    const convertedItems = filteredItems.map(item => {
      return {
        tracker: this.name,
        title: item.querySelector(".t-title > a").textContent,
        size: fs(item.querySelector(".tor-size > u").textContent),
        seeds: item.querySelector("td:nth-child(7) > u").textContent,
        trackerId: item.querySelector(".t-title > a").dataset.topic_id
      };
    });

    return convertedItems;
  }

  async activate(login, pass) {
    if (!this.checked) {
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
        this.active = true;
        this.checked = true;
      }
    } else {
      this.active = true;
    }
    return;
  }
};
