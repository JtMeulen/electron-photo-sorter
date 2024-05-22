const selectFolderBtn = document.getElementById("select-folder-button");
const formContainer = document.getElementById("form-container");
const folderPathText = document.getElementById("folder-path-text");
const folderOutputPathText = document.getElementById("folder-output-path-text");
const startDateInp = document.getElementById("start-date-input");
const sortBtn = document.getElementById("sort-button");

let folderPath;
let folderOutputPath;

selectFolderBtn.addEventListener("click", async () => {
  const selectedFolder = await dialog.selectFolder();
  if (!selectedFolder) return;

  // TODO: append name of folder to the folderOutputPath
  folderOutputPath = path.join(os.homedir(), "sorted-images");

  formContainer.style.visibility = "visible";

  folderPathText.innerText = selectedFolder;
  folderOutputPathText.innerText = folderOutputPath;
});

sortBtn.addEventListener("click", async () => {
  sortBtn.disabled = true;
  startDateInp.disabled = true;

  let startDate;

  // Get the start date if set in the input field
  if (startDateInp.value) {
    // Check if the date is valid, or else throw error
    if (new Date(startDateInp.value) === "Invalid Date") {
      // TODO: throw error
      // TODO: empty input field?
    } else {
      startDate = new Date(startDateInp.value);
    }
  }

  // TODO: Temp for testing!
  folderPath = path.join(os.homedir(), "/Documents/uganda");

  // Send to main using ipcRenderer
  ipcRenderer.send("sort:images", {
    folderPath,
    folderOutputPath,
    startDate,
  });
});
