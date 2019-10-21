const tg = require("../index");

const trackersToUse = [
  "1337x",
  "ThePirateBay",
  "Nnm",
  // ["Rutracker", { login: "LennartLence", pass: "f20o5r7g10e15t6" }]
];

// Promise.all(
//   trackersToUse.map(tracker => {
//     return tg.activate(tracker).then(name => {
//       console.log(`${name} is ready!`);
//     });
//   })
// ).then(() => {
//   tg.search("the greatest showman", {
//     groupByTracker: false
//   }).then(items => {
//     console.log(`Found ${items.length} items!`);
//     tg.getMagnet(items[0]).then(i => console.log(i));
//   });
// });

(async () => {
  await Promise.all(trackersToUse.map(tracker => tg.activate(tracker)));

  const searchResult = await tg.search("the greatest showman", {
    groupByTracker: false
  });
  console.log(searchResult);

  const magnetURI = await tg.getMagnet(searchResult[1]);
  console.log(magnetURI);
})();
