import * as childprocess from 'child_process';
import * as fs from 'fs-extra';
import * as firebird from 'node-firebird';
import * as path from 'path';

import { asyncForEach } from '../src/utils/hof';
import { chalk, LogBase } from '../src/utils/output';
import { Module } from './../src/app/modules/BaseModule';
import { Groupes, ProjectGroup, Traitement } from './../src/models/IProject';
import { OptionsPHA } from './PHAInterfaces';

export class Project {
  C_CHEMIN_BASE: string;
  C_CHEMIN_BASE_SCRIPT_SQL: string;
  C_OPTIONS_PHA: OptionsPHA;
  log: LogBase;
  m: Module;

  constructor(private event: Electron.IpcMainEvent) {
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
      this.event.reply('message', { message: sql });
      await this.execFile(`${this.C_CHEMIN_BASE}\\fb3\\isql.exe`, p);
      this.log.info(`Execution du script ${sql}`);
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
      const chemindb = pha.database;
      await this.executeDirectoryScripts(chemindb, pha.user, pha.password, this.C_CHEMIN_BASE_SCRIPT_SQL);
      resolve();
    });
  }

  async createDatabase(pha: OptionsPHA) {
    return new Promise(async (resolve, reject) => {
      this.log.info('Creation DB');
      firebird.create(pha, (err: any, db: firebird.Database) => {
        this.log.info('Database Created', pha.database, chalk.greenBright.bold('OK'));
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
        // console.log('groupe', p);
        traitements = JSON.parse(fs.readFileSync(`${this.C_CHEMIN_BASE}/modules/${type}/${module}/${p.traitements}`).toString());
        m2.push({
          libelleGroupe: p.libelleGroupe,
          procedureSuppression: p.procedureSuppression,
          traitements,
        });
      });
      resolve(m2);
    });
  }

  async loadModule(type: string, module: string) {
    this.log.log('loadModule', type, module);
    if (module && module.length !== 0) {
      try {
        import(`../modules/${type}/${module}/${module}`).then(m => {
          const _module = { ...m };
          this.log.info(module);
          return _module;
        });
      } catch (error) {
        return error;
      }
    }
  }

  async create(directory: string) {
    return new Promise<OptionsPHA>(async (resolve, reject) => {
      const pha: OptionsPHA = { ...this.C_OPTIONS_PHA };
      try {
        pha.database = `${directory}${pha.database}`;
        pha.commit = JSON.parse(fs.readFileSync(`${directory}\\commit.pj4`).toString());
        pha.commit.module_import.groupes = await this.getTreatments('import', pha.commit.module_import.nom);
        pha.commit.module_transfert.groupes = await this.getTreatments('transfert', pha.commit.module_transfert.nom);
        pha.commit.informations_generales.folder = directory;
        await this.createDatabase(pha);
        await this.executeScripts(pha);
        this.event.reply('popup', { message: `Projet ${pha.commit.informations_generales.folder} créé` });
        resolve(pha);
      } catch (error) {
        reject(error);
      }
    });
  }

  async open(directory: string) {
    return new Promise<OptionsPHA>(async (resolve, reject) => {
      const pha: OptionsPHA = { ...this.C_OPTIONS_PHA };
      try {
        pha.database = `${directory}${pha.database}`;
        pha.commit = JSON.parse(fs.readFileSync(`${directory}\\commit.pj4`).toString());
        this.log.info('Pha Created');
        pha.commit.module_import.groupes = await this.getTreatments('import', pha.commit.module_import.nom);
        pha.commit.module_transfert.groupes = await this.getTreatments('transfert', pha.commit.module_transfert.nom);
        pha.commit.informations_generales.folder = directory;
        this.log.info('Pha Loaded');
        resolve(pha);
      } catch (error) {
        reject(error);
      }
    });
  }

  async execute(directory, type = 'import', id?) {
    let prj: OptionsPHA;
    this.log.info('execute', directory);
    this.open(directory).then(async pha => {
      prj = { ...pha };
      this.log.info('Before loadModule', prj);
      // Attention => faire la gestion de l'exception
      if (prj) {
        const m = await this.loadModule(type, prj.commit.module_import.nom);
        this.log.info('module', m);
      }
    });
  }
}
