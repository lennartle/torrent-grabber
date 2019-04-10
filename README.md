# Torrent Grabber

Fast torrent search module for nodejs

---

## List of available trackers

- 1337x
- ThePirateBay
- Nnm
- Rutracker

## Installation

```shell
$ npm i torrent-grabber
```

## Example Single

Activation needs only once, for checking tracker availability and login

```js
const tg = require("torrent-grabber");

tg.activate("ThePirateBay").then(name => {
  console.log(`${name} is ready!`);

  tg.search("the greatest showman", {
    groupByTracker: false
  }).then(items => console.log(items));
});
```

## Example Multiple

```js
const tg = require("torrent-grabber");

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

//or async/await

(async () => {
  await Promise.all(trackersToUse.map(tracker => tg.activate(tracker)));

  const searchResult = await tg.search("the greatest showman", {
    groupByTracker: false
  });
  console.log(searchResult);

  const magnetURI = await tg.getMagnet(searchResult[20]);
  console.log(magnetURI);
})();
```

## API

### Activating tracker

```js
tg.activate(trackerName).then(name => {
  console.log(`${name} is ready!`);
});

//or

tg.activate([trackerName, { login: "login", pass: "pass" }]).then(name => {
  console.log(`${name} is ready!`);
});
```

### Disabling tracker

```js
tg.disable(trackerName);
```

### Searching

```js
tg.search(query, { groupByTracker: false }).then(items => console.log(items));
```

### Get magnetURI

```js
tg.getMagnet(torrentItem).then(magnet => console.log(magnet));
```

## Authors

- Lennart Le

## License

MIT License
