import { app, BrowserWindow, Menu } from "electron";

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

const createAboutWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "About - Photo Sorter",
    width: 420,
    height: 280,
  });

  mainWindow.loadFile("./renderer/about.html");
};

app.whenReady().then(() => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

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

// Creating menu
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: "About", click: () => createAboutWindow() }],
        },
      ]
    : []),
  { role: "fileMenu" },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [{ label: "About", click: () => createAboutWindow() }],
        },
      ]
    : []),
];
