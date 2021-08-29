import { SQLResultSet } from 'expo-sqlite';

import { PlacePayload } from '../models/Place';
import db from './index';

export default function insertPlace(payload: PlacePayload) {
  return new Promise<SQLResultSet>((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `INSERT INTO places (title, thumbnailUri, address, latitude, longitude)
                 VALUES (?, ?, ?, ?, ?);`,
        [payload.title, payload.thumbnailUri, payload.address, payload.latitude, payload.longitude],
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
