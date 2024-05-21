const selectFolderBtn = document.getElementById("select-folder-button");
const formContainer = document.getElementById("form-container");
const folderPathText = document.getElementById("folder-path-text");
const folderOutputPathText = document.getElementById("folder-output-path-text");
const startDateInp = document.getElementById("start-date-input");
const sortBtn = document.getElementById("sort-button");

const IMAGE_FILE_EXTENSIONS = "jpg,jpeg,png,heic,heif";

let folderPath;
let folderOutputPath;

selectFolderBtn.addEventListener("click", async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker

  // https://stackoverflow.com/questions/36152857/how-to-get-folder-path-using-electron
  // TODO: Need to get full folder path (ipcRenderer instead?)
  //   const dirHandle = await window.showDirectoryPicker();

  //   if (!dirHandle) {
  //     return;
  //   }

  folderOutputPath = path.join(os.homedir(), "sorted-images");

  formContainer.style.visibility = "visible";

  folderPathText.innerText = "hello";
  folderOutputPathText.innerText = folderOutputPath;
});

sortBtn.addEventListener("click", async () => {
  sortBtn.disabled = true;

  const images = [];
  let startDate;

  // https://github.com/JtMeulen/image_sort/blob/main/index.js

  // Get the start date if set in the input field
  if (startDateInp.value) {
    // Check if the date is valid, or else throw error
    if (new Date(startDateInp.value) !== "Invalid Date") {
      // TODO: throw error
      // TODO: empty input field?
    } else {
      startDate = new Date(startDateInp.value);
    }
  }

  // TODO: Temp for testing!
  folderPath = path.join(os.homedir(), "/Documents/uganda");

  const files = await glob.find(
    `${folderPath}/**/*.{${IMAGE_FILE_EXTENSIONS}}`
  );

  console.log(files);
  // start sorting

  console.log("Extracting image dates..");
  for (const file of files) {
    const tags = await ExifReader.load(file);
    console.log("read file: " + file);
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
});
