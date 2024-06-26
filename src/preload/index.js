import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer

// api for pinia store
// ピニアストアのAPI
const storageApi = {
  selectDirectory: () => ipcRenderer.invoke("selectDirectory"),
  readLibraryFolders: () => ipcRenderer.invoke("readLibraryFolders"),
  readLibraryFiles: (selectedFolderPath) =>
    ipcRenderer.invoke("readLibraryFiles", selectedFolderPath),
  deleteLibraryFile: () => ipcRenderer.invoke("deleteLibraryFile"),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("storageApi", storageApi);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
