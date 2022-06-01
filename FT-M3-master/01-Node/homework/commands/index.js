var fs = require("fs");
var request = require("request");

module.exports = {
  date: (args, done) => done(Date()),
  pwd: (args, done) => done(process.cwd()),
  ls: (args, done) =>
    fs.readdir(".", function (err, files) {
      if (err) throw err;
      let str = "";
      files.forEach(function (file) {
        str = str + file + "\n";
      });
      done(str);
    }),
  echo: (args, done) => done(args.join(" ")),
  cat: (args, done) =>
    fs.readFile(args[0], function (err, data) {
      if (err) throw err;
      done(data);
    }),
  head: (args, done) =>
    fs.readFile(args[0], "utf-8", function (err, data) {
      if (err) throw err;
      const headLine = data.split("\n").slice(0, 10).join("\n");
      done(headLine);
    }),
  tail: (args, done) =>
    fs.readFile(args[0], "utf-8", function (err, data) {
      if (err) throw err;
      const tailLine = data.split("\n").slice(-10).join("\n");
      done(tailLine);
    }),
  curl: (args, done) => {
    request(args[0], function (err, response, body) {
      if (err) throw err;
      done(body);
    });
  },
};