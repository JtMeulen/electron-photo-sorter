const selectFolderBtn = document.getElementById("select-folder-button");
const formContainer = document.getElementById("form-container");
const folderPathText = document.getElementById("folder-path-text");
const folderOutputPathText = document.getElementById("folder-output-path-text");
const startDateInp = document.getElementById("start-date-input");
const sortBtn = document.getElementById("sort-button");
const progressContainer = document.getElementById("progress");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const progressBarFill = document.getElementById("progress-bar-fill");

let folderPath;
let folderOutputPath;

selectFolderBtn.addEventListener("click", async () => {
	selectFolderBtn.disabled = true;
	folderPath = await dialog.selectFolder();
	selectFolderBtn.disabled = false;

	if (!folderPath) return;

	// TODO: append name of folder to the folderOutputPath
	folderOutputPath = path.join(os.homedir(), "sorted-images");

	formContainer.style.visibility = "visible";

	folderPathText.innerText = folderPath;
	folderOutputPathText.innerText = folderOutputPath;
});

sortBtn.addEventListener("click", async () => {
	sortBtn.disabled = true;
	startDateInp.disabled = true;

	let startDate;

	// Get the start date if set in the input field
	if (startDateInp.value) {
		// Check if the date is valid, or else throw error
		if (new Date(startDateInp.value) === "Invalid Date" || isNaN(new Date(startDateInp.value))) {
			showToast("Invalid date type", "error");
			sortBtn.disabled = false;
			startDateInp.disabled = false;
			startDateInp.value = "";
			return;
		} else {
			startDate = new Date(startDateInp.value);
		}
	}

	// Send to main using ipcRenderer
	ipcRenderer.send("sort:images", {
		folderPath,
		folderOutputPath,
		startDate,
	});
});

// Handle progress bar
ipcRenderer.on("progress:data", (data) => {
	progressContainer.style.visibility = "visible";
	progressText.innerText = data.step;
	progressBarFill.style.width = `${data.progress}%`;
});

ipcRenderer.on("progress:done", () => {
	showToast("Images sorted successfully", "success");

	// Reset form
	folderPath = "";
	folderOutputPath = "";

	formContainer.style.visibility = "hidden";
	progressContainer.style.visibility = "hidden";

	sortBtn.disabled = false;
	startDateInp.disabled = false;

	startDateInp.value = "";
	folderPathText.innerText = "";
	folderOutputPathText.innerText = "";
	progressText.innerText = "";
	progressBarFill.style.width = "0";
});

const showToast = (message, type) => {
	Toastify.toast({
		className: `toast-${type}`,
		text: message,
		close: false,
		position: "top",
		duration: 2000,
	});
};
