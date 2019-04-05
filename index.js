const tor = new (require("./src/TorrentEngine"))();


tor.selectTorrents(["Rutracker", { login: "kek", pass: "sdf" }], "Nnm");

console.log(tor);
