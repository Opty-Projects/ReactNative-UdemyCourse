import { SQLResultSet } from 'expo-sqlite';

import db from './index';

export default function selectAllPlaces() {
  return new Promise<SQLResultSet>((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        'SELECT * FROM places;',
        [],
        (_, resultSet) => {
          resolve(resultSet);
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}
