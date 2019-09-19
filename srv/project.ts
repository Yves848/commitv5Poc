import * as childprocess from 'child_process';
import { ipcMain } from 'electron';
import * as fs from 'fs-extra';
import * as firebird from 'node-firebird';
import * as path from 'path';

import { chalk, LogBase } from '../src/utils/output';
import { Groupes, ProjectGroup, Traitement } from './../src/models/IProject';
import { OptionsPHA } from './PHAInterfaces';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export class Project {
  C_CHEMIN_BASE: string;
  C_CHEMIN_BASE_SCRIPT_SQL: string;
  C_OPTIONS_PHA: OptionsPHA;
  log: LogBase;

  constructor() {
    this.C_CHEMIN_BASE = path.resolve(`${__dirname}\\..`);
    this.C_CHEMIN_BASE_SCRIPT_SQL = `${this.C_CHEMIN_BASE}\\sql`;
    this.C_OPTIONS_PHA = {
      host: '127.0.0.1',
      port: 3050,
      database: '\\PHA3.FDB',
      user: 'SYSDBA',
      password: 'masterkey',
      lowercase_keys: false,
      role: null,
      pageSize: 4096,
      commit: null,
    };
    this.log = new LogBase();
    this.log.info('Project Object créé', this.C_OPTIONS_PHA);
  }

  async execFile(fichier: string, params: string[]) {
    return new Promise<childprocess.ChildProcess>(async (resolve, reject) => {
      childprocess.execFile(`${fichier}`, params, (error: Error, stdout: string, stderr: string) => {
        this.log.log(`execFile ${fichier} : ${stdout}`);
        resolve();
      });
    });
  }

  async executeScript(username: string, password: string, sql: string, db: string) {
    return new Promise(async (resolve, reject) => {
      const p: string[] = ['-u', username, '-p', password];
      if (db) {
        p.push(db);
      }
      Array.prototype.push.apply(p, ['-i', sql]);
      ipcMain.emit('message', { message: sql });
      await this.execFile(`${this.C_CHEMIN_BASE}\\fb3\\isql.exe`, p);
      this.log.info(`Execution du script ${sql}`);
      //output._console(output.chalk.blueBright(new Date().toISOString()), `Execution du script ${sql}`);
      resolve();
    });
  }

  async executeDirectoryScripts(db: string, username: string, password: string, directory: string) {
    return new Promise(async (resolve, reject) => {
      if (directory && fs.pathExistsSync(directory)) {
        const files: string[] = fs.readdirSync(directory);
        await asyncForEach(files, async file => {
          const sql = directory + '\\' + file;
          if (!fs.statSync(sql).isDirectory()) {
            await this.executeScript(username, password, sql, db);
          }
        });
      }
      resolve();
    });
  }

  async executeScripts(pha: OptionsPHA) {
    return new Promise(async (resolve, reject) => {
      this.log.log('executeScripts');
      //output._console(output.chalk.whiteBright('executeScripts'));
      const chemindb = pha.database;
      await this.executeDirectoryScripts(chemindb, pha.user, pha.password, this.C_CHEMIN_BASE_SCRIPT_SQL);
      resolve();
    });
  }

  async createDatabase(pha: OptionsPHA) {
    return new Promise(async (resolve, reject) => {
      this.log.info('Creation DB');
      //output._console(output.chalk.blueBright('Creation DB'));
      firebird.create(pha, (err: any, db: firebird.Database) => {
        this.log.info('Database Created', pha.database, chalk.greenBright.bold('OK'));
        /* output._console(
          output.chalk.blueBright('database created'),
          output.chalk.redBright.bold.underline(pha.database),
          output.chalk.greenBright.blue('OK')
        ); */
        resolve();
      });
    });
  }

  async getTreatments(type: string, module: string) {
    return new Promise<Groupes[]>(async (resolve, reject) => {
      const m: ProjectGroup[] = JSON.parse(fs.readFileSync(`${this.C_CHEMIN_BASE}/modules/${type}/${module}/${module}.json`).toString());
      const m2: Groupes[] = [];
      await asyncForEach(m, (p: ProjectGroup) => {
        let traitements: Traitement[];
        traitements = JSON.parse(fs.readFileSync(`${this.C_CHEMIN_BASE}/modules/${type}/${module}/${p.traitements}`).toString());
        m2.push({
          libelle: p.libelle,
          Suppression: p.Suppression,
          traitements,
        });
      });
      resolve(m2);
    });
  }

  async open(directory: string) {
    return new Promise<OptionsPHA>(async (resolve, reject) => {
      const pha: OptionsPHA = { ...this.C_OPTIONS_PHA };
      try {
        pha.database = `${directory}${pha.database}`;
        pha.commit = JSON.parse(fs.readFileSync(`${directory}\\commit.pj4`).toString());
        this.log.info('Pha Created');
        //output._console(output.chalk.blueBright('Pha created'));
        pha.commit.module_import.groupes = await this.getTreatments('import', pha.commit.module_import.nom);
        pha.commit.module_transfert.groupes = await this.getTreatments('transfert', pha.commit.module_transfert.nom);
        pha.commit.informations_generales.folder = directory;
        this.log.info('Pha Loaded');
        //output._console(output.chalk.redBright('Pha loaded'));
        await this.createDatabase(pha);
        await this.executeScripts(pha);
        resolve(pha);
      } catch (error) {
        reject(error);
      }
    });
  }

  async execute(directory, type, id) {
    let prj: OptionsPHA;
    this.open(directory).then(pha => (prj = pha));
    // Attention => faire la gestion de l'exception
  }
}
