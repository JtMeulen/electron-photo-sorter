const selectFolderBtn = document.getElementById("select-folder-button");
const formContainer = document.getElementById("form-container");
const folderPathText = document.getElementById("folder-path-text");
const folderOutputPathText = document.getElementById("folder-output-path-text");
const startDateInp = document.getElementById("start-date-input");
const sortBtn = document.getElementById("sort-button");

selectFolderBtn.addEventListener("click", async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker

  // https://stackoverflow.com/questions/36152857/how-to-get-folder-path-using-electron
  // TODO: Need to get full folder path (ipcRenderer instead?)
  //   const dirHandle = await window.showDirectoryPicker();

  //   if (!dirHandle) {
  //     return;
  //   }


  const outputPath = path.join(os.homedir(), "sorted-images");

  formContainer.style.visibility = "visible";

  folderPathText.innerText = "hello";
  folderOutputPathText.innerText = outputPath;
});

sortBtn.addEventListener("click", async () => { 
    // https://github.com/JtMeulen/image_sort/blob/main/index.js

    // TODO: check for input in startDateInp
    // if input is incorrect, throw error

    // start sorting
});
