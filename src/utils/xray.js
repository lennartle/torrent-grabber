const exp = (str, exp) =>
  parseInt(require("filesize")(parseFloat(str), { exponent: exp }));

const xray = require("x-ray")({
  filters: {
    int: value => {
      const intValue = parseInt(value);
      return isNaN(intValue) ? value : intValue;
    },
    match: (value, str) => {
      return typeof value === "string" && value.match(new RegExp(str)) !== null
        ? value.match(new RegExp(str))[1]
        : value;
    },
    fixSize: str => {
      if (!!str.match(/[gG]/)) {
        return exp(str, -3);
      }

      if (!!str.match(/[mM]/)) {
        return exp(str, -2);
      }
    }
  }
});

module.exports = (...args) => {
  return new Promise((resolve, reject) => {
    xray(...args)((err, data) => {
      if (err !== null) {
        reject(err);
      }

      resolve(data);
    });
  });
};
