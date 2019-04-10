const tg = require("../index");

const trackersToUse = [
  "1337x",
  "ThePirateBay",
  "Nnm",
  ["Rutracker", { login: "LennartLence", pass: "f20o5r7g10e15t6" }]
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
  }).then(items => {
    console.log(`Found ${items.length} items!`);
    tg.getMagnet(items[0]).then(i => console.log(i));
  });
});
