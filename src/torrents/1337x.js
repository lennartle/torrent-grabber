const needle = require("needle");

module.exports = class _1337x {
  constructor() {
    this.name = "1337x";
    this.active = false;
    this.checked = false;
    this.requireLogin = false;

    this.BASE_LINK = "https://1337x.to";
  }

  async search(query) {
    const resp = await needle(
      "get",
      `${this.BASE_LINK}/sort-search/${query}/seeders/desc/1/`
    );
    const page = new DOMParser().parseFromString(resp.body, "text/html");

    const items = [...page.querySelectorAll("tbody > tr")];
    const convertedItems = items.map(item => {
      return {
        tracker: this.name,
        title: item.querySelector(".name > a:nth-child(2)").textContent,
        size: item.querySelector(".size").childNodes[0].textContent,
        seeds: item.querySelector(".seeds").textContent,
        trackerId: item.querySelector(".name > a:nth-child(2)").attributes[
          "href"
        ].value
      };
    });

    return convertedItems;
  }

  async getMagnet(torrentId) {
    const resp = await needle("get", `${this.BASE_LINK}${torrentId}`);

    const page = new DOMParser().parseFromString(resp.body, "text/html");

    return page.querySelector(".fbebafbe").href;
  }

  async activate() {
    if (!this.checked) {
      const resp = await needle("get", `${this.BASE_LINK}`);

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
