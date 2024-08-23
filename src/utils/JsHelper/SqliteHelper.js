import SQLite from 'react-native-sqlite-storage';

// Open or create the database
const openDatabase = () => {
  return SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
};

// Create a table if not exists
const createTable = () => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)',
        [],
        () => resolve('Table created successfully'),
        (error) => reject('Error creating table: ' + error.message)
      );
    });
  });
};

// Insert data into the table
const insertData = (name, age) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (name, age) VALUES (?, ?)',
        [name, age],
        () => resolve('Data inserted successfully'),
        (error) => reject('Error inserting data: ' + error.message)
      );
    });
  });
};

// Update data in the table
const updateData = (id, name, age) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE users SET name = ?, age = ? WHERE id = ?',
        [name, age, id],
        () => resolve('Data updated successfully'),
        (error) => reject('Error updating data: ' + error.message)
      );
    });
  });
};

// Delete data from the table
const deleteData = (id) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM users WHERE id = ?',
        [id],
        () => resolve('Data deleted successfully'),
        (error) => reject('Error deleting data: ' + error.message)
      );
    });
  });
};

// Delete the database
const deleteDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.close(() => {
      SQLite.deleteDatabase(
        { name: 'mainDatabase.db', location: 'default' },
        () => {
          resolve('Database deleted successfully');
        },
        (error) => {
          reject('Error deleting database: ' + error.message);
        }
      );
    });
  });
};

export {
  openDatabase,
  createTable,
  insertData,
  updateData,
  deleteData,
  deleteDatabase,
};
