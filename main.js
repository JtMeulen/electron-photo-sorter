const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const ExifReader = require("exifreader");
const { glob } = require("glob");
const fs = require("fs");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Photo Sorter",
    width: isDev ? 1050 : 600,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Open dev tools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));

  ipcMain.handle("dialog:openDirectory", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    }
  });
};

const createAboutWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "About - Photo Sorter",
    width: 420,
    height: 280,
  });

  mainWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
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

// Respond to ipcRenderer events
ipcMain.on("sort:images", async (e, data) => {
  // Logic from: https://github.com/JtMeulen/image_sort/tree/main
  const { folderPath, folderOutputPath, startDate } = data;

  const images = [];

  console.log(`Starting script to copy images for path: "${folderPath}"..`);

  if (!fs.existsSync(folderPath)) {
    console.error(`Folder ${folderPath} does not exist. Exiting..`);
    return;
  }

  if (fs.existsSync(folderOutputPath)) {
    console.log("Deleting existing folder..");
    fs.rmdirSync(folderOutputPath, { recursive: true });
  }

  console.log("Fetching all files..");
  const files = await glob(`${folderPath}/**/*.{jpg,jpeg,png,heic,heif}`);

  console.log("Extracting image dates..");
  for (const file of files) {
    const tags = await ExifReader.load(file);
    const imageDateRaw = tags["DateTimeOriginal"].description;

    // Convert YYYY:MM:DD to YYYY-MM-DD for JS Date compatibility
    const imageDate = imageDateRaw.replace(
      /(\d{4}):(\d{2}):(\d{2})/,
      "$1-$2-$3"
    );

    images.push({ file, date: imageDate });
  }

  // Sort the array oldest to newest
  console.log("Sorting images from oldest to newest..");
  images.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  console.log("Creating 'sorted' folder..");
  fs.mkdirSync(folderOutputPath);

  let currentDay = 1;
  // If user input is provided we use that
  console.log(startDate)
  let currentDate = startDate
    ? getFullDate(startDate)
    : getFullDate(images[0].date);

  console.log("Copying images to 'sorted' folder..");
  for (const image of images) {
    const imageDate = getFullDate(image.date);

    if (imageDate !== currentDate) {
      // Get the difference in days between currentDate and imageDate
      // TODO: this could use some refinement
      const diffInTime = new Date(imageDate) - new Date(currentDate);
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      currentDay += Math.round(diffInDays);
      currentDate = getFullDate(imageDate);
    }

    if (!fs.existsSync(`${folderOutputPath}/Day ${currentDay}`)) {
      console.log(`Creating folder for 'Day ${currentDay}'..`);
      fs.mkdirSync(`${folderOutputPath}/Day ${currentDay}`);
    }

    // Only use the filename for the image, even if its in a subfolders
    const filename = image.file.split("/").pop();

    fs.copyFileSync(
      image.file,
      `${folderOutputPath}/Day ${currentDay}/${filename}`
    );
  }

  console.log("Done!");
  // TODO: send event to say the script is done!
});

const getFullDate = (date) => {
  const dateFormat = new Date(date);
  return `${dateFormat.getFullYear()}-${
    dateFormat.getMonth() + 1
  }-${dateFormat.getDate()}`;
};
