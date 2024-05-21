import { app, BrowserWindow } from "electron";

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Photo Sorter",
    width: isDev ? 1050 : 600,
    height: 800,
  });

  // Open dev tools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile("./renderer/index.html");
};

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
