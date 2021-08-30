import { SQLResultSet } from 'expo-sqlite';

import db from './index';

export default function deletePlace(placeId: string) {
  return new Promise<SQLResultSet>((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        'DELETE FROM places WHERE id = ?;',
        [placeId],
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
