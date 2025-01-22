import SQLite from 'react-native-sqlite-storage';

// Open or create the database
const openDatabase = () => {
  return SQLite.openDatabase({ name: 'learnerApp.db', location: 'default' });
};

// Create a table if not exists
const createTable = ({ tableName, columns }) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    // Generate the column definitions string from the columns array
    const columnDefinitions = columns.join(', ');

    db.transaction((tx) => {
      const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;
      tx.executeSql(
        query,
        [],
        () => resolve('Table created successfully'),
        (error) => reject('Error creating table: ' + error.message)
      );
    });
  });
};

//  alterTable if new column need to be added.

const alterTable = ({ tableName, newColumns }) => {
  // console.log('tableName', tableName);
  // console.log('newColumns', newColumns);
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.transaction((tx) => {
      newColumns.forEach((column) => {
        const query = `ALTER TABLE ${tableName} ADD COLUMN ${column}`;
        tx.executeSql(
          query,
          [],
          () => {
            console.log(`Column ${column} added successfully`);
          },
          (error) => {
            if (error.message.includes('duplicate column name')) {
              console.log(`Column ${column} already exists`);
            } else {
              reject('Error adding column: ' + error.message);
            }
          }
        );
      });
      resolve('Table altered successfully');
    });
  });
};

// Get data from the table

const getData = ({ tableName, where }) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    // Generate the WHERE clause from the where object if provided
    let whereClause = '';
    let whereValues = [];

    if (where) {
      whereClause =
        'WHERE ' +
        Object.keys(where)
          .map((key) => `${key} = ?`)
          .join(' AND ');
      whereValues = Object.values(where);
    }

    db.transaction((tx) => {
      const query = `SELECT * FROM ${tableName} ${whereClause}`;
      tx.executeSql(
        query,
        whereValues,
        (tx, results) => {
          // Extract data from results.rows
          const rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }
          resolve(rows);
        },
        (error) => reject('Error fetching data: ' + error.message)
      );
    });
  });
};

// Insert data into the table
const insertData = ({ tableName, data }) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    // Get the column names and values from the data object
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.values(data);

    db.transaction((tx) => {
      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      tx.executeSql(
        query,
        values,
        () => resolve('Data inserted successfully'),
        (error) => reject('Error inserting data: ' + error.message)
      );
    });
  });
};

const updateData = ({ tableName, data, where }) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    // Generate the SET clause from the data object
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ');

    // Extract the values from the data object
    const values = Object.values(data);

    // Add the values for the WHERE clause
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(' AND ');
    const whereValues = Object.values(where);

    db.transaction((tx) => {
      const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
      tx.executeSql(
        query,
        [...values, ...whereValues], // Combine data and where clause values
        () => resolve('Data updated successfully'),
        (error) => reject('Error updating data: ' + error.message)
      );
    });
  });
};

const deleteData = ({ tableName, where }) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    // Generate the WHERE clause from the where object
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(' AND ');
    const whereValues = Object.values(where);

    db.transaction((tx) => {
      const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
      tx.executeSql(
        query,
        whereValues,
        () => resolve('Data deleted successfully'),
        (error) => reject('Error deleting data: ' + error.message)
      );
    });
  });
};

export {
  openDatabase,
  createTable,
  getData,
  insertData,
  updateData,
  deleteData,
  // deleteDatabase,
  alterTable,
};
