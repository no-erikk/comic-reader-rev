import Database from "better-sqlite3";
import { dialog } from "electron";
import path from "path";
const readdrip = require("readdirp");
const fs = require("fs");

// check for database file
const dbPath = "db.json";
let db;
if (!fs.existsSync(dbPath)) {
  // if not found initialize new database
  db = new Database(dbPath);
  //db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS directories (
        id INTEGER PRIMARY KEY,
        name TEXT,
        path TEXT UNIQUE NOT NULL,
        parent_id INTEGER,
        FOREIGN KEY (parent_id) REFERENCES directories(id)
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        directory_id INTEGER NOT NULL,
        FOREIGN KEY (directory_id) REFERENCES directories(id)
    )
  `);

  console.log("no database found, created new database");
}

// scan file paths and return directories
export async function ReadDirectories() {
  // options for file dialog
  const dialogOptions = {
    properties: ["openDirectory"], // allow only dirs to be chosen
  };

  try {
    // show file dialog
    const result = await dialog.showOpenDialog(dialogOptions);
    if (!result.canceled) {
      console.log("selected file paths", result.filePaths[0]);
      //selected dir paths
      const root = result.filePaths[0];

      // build file tree with readdrip then insert to database
      buildFileTree(root);
    } else {
      // dialog canceled
      return;
    }
  } catch (error) {
    console.error("Error reading directories: ", error);
  }
}

async function buildFileTree(rootDir) {
  // options for readdrip
  const dirOptions = {
    type: "files_directories",
    fileFilter: ["*.cbz", "*.cbr", "*.pdf"],
  };

  // initialize stream
  const stream = await readdrip(rootDir, dirOptions);

  // open database connection if not already open
  if (!db) {
    db = new Database(dbPath);
    console.log("database opened");
  }

  // INSERT rootDir as first entry so it can be referenced by all files and directories in it
  const rootName = rootDir.split("\\").pop();
  console.log(rootName);
  const insertRootDir = db.prepare(
    `INSERT OR IGNORE INTO directories (name, path, parent_id) VALUES (?, ?, NULL)`,
  );
  insertRootDir.run(rootName, rootDir);

  stream
    .on("data", (entry) => {
      const entryPath = entry.fullPath;
      const parentDirectory = path.dirname(entryPath); // always include
      const dirName = path.basename(entryPath);

      // debug logs
      console.log("processing entrypoint: ", entryPath);
      //console.log('entry point is directory?', entry.dirent.isDirectory(), parentDirectory)

      // insert directories
      if (entry.dirent.isDirectory()) {
        // PREP insert to database // using INSERT OR IGNORE to ignore duplicates
        const insertDirectory = db.prepare(
          `INSERT OR IGNORE INTO directories (name, path, parent_id) VALUES (?, ?, ?)`,
        );
        // PREP if parent directory equals user chosen directory assign as user chosen directory otherwise get matching directory
        const parentId =
          parentDirectory === rootDir
            ? db
                .prepare(`SELECT id FROM directories WHERE path = ?`)
                .pluck()
                .get(rootDir)
            : db
                .prepare(`SELECT id FROM directories WHERE path = ?`)
                .pluck()
                .get(parentDirectory);

        // INSERT entryPath and parentId to "directories" table
        const result = insertDirectory.run(dirName, entryPath, parentId);

        // debug logs
        //console.log('Parent directory:', parentDirectory)
        //console.log('Parent ID:', parentId)
        console.log("Insert directory result:", result);
      } else {
        // insert files
        const fileName = path.basename(entryPath);
        const parsedFileName = path.parse(fileName).name;

        //PREP match parent directory with paths in "directories" to get corresponding directory_id
        const directoryId = db
          .prepare(`SELECT id FROM directories WHERE path = ?`)
          .pluck()
          .get(parentDirectory);
        //console.log('Directory ID for', parentDirectory, ':', directoryId)

        // INSERT name and directory_id into "files" table
        db.prepare(`INSERT INTO files (name, directory_id) VALUES (?,?)`).run(
          parsedFileName,
          directoryId,
        );
      }

      // debug logs
      //console.log('entryPath: ', entryPath)
      //console.log('parentDirectory: ', parentDirectory)
      //console.log('fileName', path.basename(entryPath))
    })
    .on("end", () => {
      // close database connection when traversal is complete
      db.close();
      console.log("database closed");
    });
  /* .on('error', () => {
      console.log('error occured while traversing file tree', error)
      db.close()
    }) */
}
