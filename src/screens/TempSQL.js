import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import {
  createTable,
  insertData,
  updateData,
  deleteData,
  deleteDatabase,
} from './sqliteHelper';

const TempSQL = () => {
  useEffect(() => {
    // Create table on app load
    createTable()
      .then((msg) => console.log(msg))
      .catch((err) => console.error(err));
  }, []);

  const handleInsert = () => {
    insertData('John Doe', 30)
      .then((msg) => console.log(msg))
      .catch((err) => console.error(err));
  };

  const handleUpdate = () => {
    updateData(1, 'Jane Doe', 25)
      .then((msg) => console.log(msg))
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    deleteData(1)
      .then((msg) => console.log(msg))
      .catch((err) => console.error(err));
  };

  const handleDeleteDatabase = () => {
    deleteDatabase()
      .then((msg) => console.log(msg))
      .catch((err) => console.error(err));
  };

  return (
    <View>
      <Text>SQLite Example</Text>
      <Button title="Insert Data" onPress={handleInsert} />
      <Button title="Update Data" onPress={handleUpdate} />
      <Button title="Delete Data" onPress={handleDelete} />
      <Button title="Delete Database" onPress={handleDeleteDatabase} />
    </View>
  );
};

export default TempSQL;
