const needle = require("needle");

module.exports = class ThePirateBay {
  constructor() {
    this.name = "ThePirateBay";
    this.active = false;
    this.checked = false;
    this.requireLogin = false;

    this.BASE_LINK = "https://piratebay.live";
  }

  async search(query) {
    const resp = await needle(
      "get",
      `${this.BASE_LINK}/search/${query}/0/99/0`
    );

    const page = new DOMParser().parseFromString(resp.body, "text/html");

    const items = [...page.querySelectorAll("#searchResult > tbody > tr")];

    const convertedItems = items.map(item => {
      try {
        let size = item.querySelector(".detDesc").innerText.split(",")[1];

        size = size.split(" ")[2].replace("MiB", "MB");
        size = size.replace("GiB", "GB");

        let path = item.querySelector("td:nth-child(2) > div > a");

        return {
          tracker: this.name,
          title: item.querySelector(".detLink").innerText,
          size: size,
          seeds: item.querySelector("td:nth-child(3)").textContent,
          trackerId: path.pathname.split("/")[2]
        };
      } catch (error) {}
    });

    return convertedItems.filter(i => !!i);
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

    return;
  }
};
