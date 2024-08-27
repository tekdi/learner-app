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
    const fetchData = async () => {
      const tableName = 'APIResponses';
      const columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id INTEGER',
        'api_url TEXT',
        'api_type TEXT',
        'payload TEXT',
        'response TEXT',
      ];
      const query = await createTable({ tableName, columns });
    };
    fetchData();
  }, []);

  const handleInsert = async () => {
    const data = {
      user_id: 32,
      api_url: `https://tracking.prathamdigital.org/v1/tracking/assessment/list`,
      api_type: `POST`,
      payload: `{
        filters: {
          userId: params?.user_id,
        },
        sort: {
          field: 'userId',
          order: 'asc',
        },
      }`,
      response: 'Test Test',
    };
    const result = await insertData({
      tableName: 'APIResponses',
      data,
    });
    console.log({ result });
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
