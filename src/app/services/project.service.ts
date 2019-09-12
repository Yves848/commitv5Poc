import { Injectable } from '@angular/core';
import * as firebird from 'node-firebird';

import { Options } from '../../models/firebird.params';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  db = null;

  async attachDb() {
    return new Promise((resolve, reject) => {
      firebird.attach(Options, (err, db) => {
        if (err) {
          reject(err);
        }
        resolve(db);
      });
    });
  }

  constructor() {}

  async openDb(database: string) {
    Options.database = database;
    this.db = await this.attachDb();
    console.log(this.db);
  }
}
