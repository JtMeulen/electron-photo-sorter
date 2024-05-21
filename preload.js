const os = require("os");
const path = require("path");
const ExifReader = require("exifreader");
const { glob } = require("glob");

const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld("ExifReader", {
  load: async (...args) => ExifReader.load(...args),
});

contextBridge.exposeInMainWorld("glob", {
  find: async (...args) => glob(...args),
});
