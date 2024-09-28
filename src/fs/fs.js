// Importing the Dexie library for simplified IndexedDB interactions
import Dexie from "dexie";

// Creating a new Dexie instance named 'fs' for file system with the database name 'fsDB'
const fs = new Dexie("fsDB");

// Defining the database schema with a single store named 'files'
// The store includes indexes on 'parent+name', 'parent', 'name', and 'type'
fs.version(1).stores({
  files: "[parent+name], parent, name, type",
});

// Opening the Dexie database for use
fs.open();

// Exporting the Dexie instance to make it available for use in other parts of the application
export default fs;
