import { openDatabase } from 'expo-sqlite';
import { SQLResultSet } from 'expo-sqlite/src/SQLite.types';

const db = openDatabase('places.sqlite');
export default db;

export function init() {
  return new Promise<SQLResultSet>((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `CREATE TABLE IF NOT EXISTS places
                 (
                     id           INTEGER NOT NULL PRIMARY KEY,
                     title        TEXT    NOT NULL,
                     thumbnailUri TEXT    NOT NULL,
                     address      TEXT    NOT NULL,
                     latitude     REAL    NOT NULL,
                     longitude    REAL    NOT NULL
                 );`,
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
