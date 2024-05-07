import { access, constants, promises, unlink, writeFile } from "fs";
import path from "path";
const readdrip = require("readdirp");
import { app, dialog } from "electron";

const dbFilePath = path.join(app.getAppPath(), "library.json");

// open dialog so user can choose folder
// フォルダを選択するためのダイアログを開く
export async function selectDirectory() {
  // options for file dialog
  // ファイルダイアログのオプション
  const dialogOptions = {
    properties: ["openDirectory"], // allow only dirs to be chosen
  };

  try {
    // show file dialog
    // ファイルダイアログを表示
    const result = await dialog.showOpenDialog(dialogOptions);
    if (!result.canceled) {
      // selected dir paths
      // 選択されたディレクトリのパス
      const root = result.filePaths[0];
      console.log("selected file paths", root, typeof root);

      scanFolders(root);
      return root;
    } else {
      // dialog canceled
      // ダイアログをキャンセル
      return;
    }
  } catch (err) {
    console.error("Error reading directories: ", err);
  }
}
// walk through user selected directory and add subfolders and files to json file
// ユーザが選択したディレクトリをウォークスルーし、サブフォルダとファイルをjsonファイルに追加する
function scanFolders(rootFolder) {
  const folders = [];
  const files = [];
  // options for readdirp
  // readdirpのオプション
  const dirOptions = {
    type: "files_directories",
    fileFilter: ["*.cbz", "*.cbr", "*.pdf"],
  };

  const stream = readdrip(rootFolder, dirOptions);
  stream
    .on("data", (entry) => {
      console.log(entry.fullPath);
      if (entry.dirent.isDirectory()) {
        // directories
        // ダイレクトリー
        folders.push({
          name: entry.basename,
          path: entry.fullPath,
        });
      } else {
        files.push({
          // files
          // ファイル
          name: entry.basename,
          path: entry.fullPath,
          read: false,
          //new: true, // TODO
        });
      }
    })
    .on("end", () => {
      // check for current db file
      // 現在のdbファイルを確認する
      access(dbFilePath, constants.F_OK, (err) => {
        if (!err) {
          // file exists, delete
          // ファイルがある、消す
          unlink(dbFilePath, (err) => {
            if (err) {
              console.error("error deleting file", err);
              return;
            }
            // write new data to file
            //　新しいデータをファイルに書き込む
            writeDataToFile({ folders, files });
            console.log("replaced old db file with new");
          });
        } else {
          // no file exists, make a new one
          //　ファイルがない、新しいファイルを作成する
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
//　ファイルに書き込む
function writeDataToFile(data) {
  writeFile(dbFilePath, JSON.stringify(data), (err) => {
    if (err) {
      console.error("Error saving data:", err);
    } else {
      console.log("Data saved successfully!");
    }
  });
}

export function deleteLibraryFile() {
  unlink(dbFilePath, (err) => {
    if (err) {
      console.error("error deleting file", err);
      return;
    }
  });
}

// load directories from library.json
//　library.jsonからディレクトリを読み込む
export async function readLibraryFolders() {
  try {
    const data = await promises.readFile(dbFilePath);
    //console.log("raw data", data);
    const { folders } = JSON.parse(data);
    //console.log("folder data:", folders);

    return folders;
  } catch (error) {
    console.error("Error reading folder data:", error);
  }
}
// load files from selected directory
//　選択したディレクトリからファイルを読み込む
export async function readLibraryFiles(selectedFolderPath) {
  try {
    //console.log("target folder", selectedFolderPath);
    const data = await promises.readFile(dbFilePath);
    const { files } = JSON.parse(data);
    //console.log("file data:", files);

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

