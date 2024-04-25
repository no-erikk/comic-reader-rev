import { access, constants, promises, readFile, unlink, writeFile } from "fs";
import path from "path";
const readdrip = require("readdirp");
import { app, dialog } from "electron";

const dbFilePath = path.join(app.getAppPath(), "library.json");
console.log("Data file path:", dbFilePath);

// open dialog so user can choose folder
export async function selectDirectory() {
  // options for file dialog
  const dialogOptions = {
    properties: ["openDirectory"], // allow only dirs to be chosen
  };

  try {
    // show file dialog
    const result = await dialog.showOpenDialog(dialogOptions);
    if (!result.canceled) {
      //selected dir paths
      const root = result.filePaths[0];
      console.log("selected file paths", root);

      scanFolders(root);
    } else {
      // dialog canceled
      return;
    }
  } catch (err) {
    console.error("Error reading directories: ", err);
  }
}
// walk through user selected directory and add subfolders and files to json file
async function scanFolders(rootFolder) {
  const folders = [];
  const files = [];
  // options for readdirp
  const dirOptions = {
    type: "files_directories",
    fileFilter: ["*.cbz", "*.cbr", "*.pdf"],
  };

  const stream = await readdrip(rootFolder, dirOptions);
  stream
    .on("data", (entry) => {
      console.log(entry.fullPath);
      if (entry.dirent.isDirectory()) {
        // directories
        folders.push({
          name: entry.basename,
          path: entry.fullPath,
        });
      } else {
        files.push({
          // files
          name: entry.basename,
          path: entry.fullPath,
          //folder: path.dirname(entry.fullPath),
          read: false,
          //new: true, // TODO
        });
      }
    })
    .on("end", () => {
      // check for current db file
      access(dbFilePath, constants.F_OK, (err) => {
        if (!err) {
          // file exists, delete
          unlink(dbFilePath, (err) => {
            if (err) {
              console.error("error deleting file", err);
              return;
            }
            // write new data to file
            writeDataToFile({ folders, files });
            console.log("replaced old db file with new");
          });
        } else {
          // no file exists, make a new one
          writeDataToFile({ folders, files });
          console.log("created brand new db file");
        }
      });
    })
    .on("error", (err) => {
      console.error("Error while scanning folders:", err);
    });
}

// save to file
function writeDataToFile(data) {
  writeFile(dbFilePath, JSON.stringify(data), (err) => {
    if (err) {
      console.error("Error saving data:", err);
    } else {
      console.log("Data saved successfully!");
    }
  });
}

// load directories from library.json on startup
export async function readLibraryFolders() {
  try {
    const data = await promises.readFile(dbFilePath);
    console.log("raw data", data);
    const { folders } = JSON.parse(data);
    console.log("folder data:", folders);

    return folders;
  } catch (error) {
    console.error("Error reading folder data:", error);
  }
}

export async function readLibraryFiles(selectedFolderPath) {
  try {
    console.log("target folder", selectedFolderPath);
    const data = await promises.readFile(dbFilePath);
    const { files } = JSON.parse(data);
    console.log("file data:", files);

    const filteredFiles = files.filter(
      (file) => path.dirname(file.path) === selectedFolderPath,
    );
    //console.log("filtered data", filteredFiles);

    return filteredFiles;
  } catch (error) {
    console.error("Error reading file data:", error);
    return [];
  }
}

