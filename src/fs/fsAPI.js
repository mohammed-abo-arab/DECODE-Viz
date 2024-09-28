// Importing the Dexie database instance named 'fs' from './fs'
import fs from "./fs";

// List all files and folders within the given directory
export function fsAPIgetItemByPath(path) {
  // Splitting the path into components based on '/'
  let components = path.split("/");

  // Extracting the name of the item from the last component
  const name = components.pop();

  // Joining the remaining components to get the parent directory
  const parent = components.join("/");

  // Querying the 'files' store in the Dexie database
  fs.files.where({ parent: parent, name: name }).first((item) => {
    // The following line doesn't actually return anything from the function
    // This callback function returns the item, but the outer function does not
    return item;
  });
}
