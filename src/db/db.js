// Import Dexie library for IndexedDB abstraction
import Dexie from "dexie";

// Create a new Dexie database instance named 'udvDB'
const db = new Dexie("udvDB");

// Define the schema of the database with a single store 'measurement'
db.version(1).stores({
  measurement: "++id, sopinstanceuid, tool",
});

// Open the database
db.open();

// Export the created database instance for use in other modules
export default db;
