# Torrent Grabber

Fast torrent search module for nodejs

---

### List of available trackers

- 1337x
- ThePirateBay
- Nnm
- Rutracker

### Installation

```shell
$ npm i torrent-grabber
```

### Usage Single

Activation needs only once, for checking tracker availability and login

```js
import tg from "torrent-grabber";

tg.activate("ThePirateBay").then(name => {
  console.log(`${name} is ready!`);

  tg.search("the greatest showman", {
    groupByTracker: false
  }).then(items => console.log(items));
});
```

### Usage Multiple

```js
import tg from "torrent-grabber";

const trackersToUse = [
  "1337x",
  "ThePirateBay",
  "Nnm",
  ["Rutracker", { login: "login", pass: "pass" }]
];

Promise.all(
  trackersToUse.map(tracker => {
    return tg.activate(tracker).then(name => {
      console.log(`${name} is ready!`);
    });
  })
).then(() => {
  tg.search("the greatest showman", {
    groupByTracker: false
  }).then(items => console.log(items));
});
```

### Authors

- Lennart Le

### License

This project is licensed under the MIT License
