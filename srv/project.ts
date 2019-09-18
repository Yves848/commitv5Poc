import * as fs from 'fs-extra';
import * as firebird from 'node-firebird';
import * as path from 'path';

import * as output from '../src/utils/output';
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

  constructor() {
    this.C_CHEMIN_BASE = path.resolve(`${__dirname}\\..`);
    this.C_CHEMIN_BASE_SCRIPT_SQL = `${this.C_CHEMIN_BASE}\\sql`;
    this.C_OPTIONS_PHA = {
      host: '127.0.0.1',
      port: 3050,
      database: '/PHA3.FDB',
      user: 'SYSDBA',
      password: 'masterkey',
      lowercase_keys: false,
      role: null,
      pageSize: 4096,
      commit: null,
    };
    output._console(output.chalk.blueBright('Project Object créé'), this.C_OPTIONS_PHA);
  }

  async createDatabase(pha: OptionsPHA) {
    return new Promise(async (resolve, reject) => {
      output._console(output.chalk.blueBright('Creation DB'));
      firebird.create(pha, (err: any, db: firebird.Database) => {
        output._console(output.chalk.blueBright('database created'), output.chalk.redBright.bold.underline(pha.database));
      });
      resolve();
    });
  }

  async getTreatments(type: string, module: string) {
    return new Promise<Groupes[]>(async (resolve, reject) => {
      const m: ProjectGroup[] = JSON.parse(fs.readFileSync(`${this.C_CHEMIN_BASE}/modules/${type}/${module}/${module}.json`).toString());
      const m2: Groupes[] = [];
      await asyncForEach(m, (p: ProjectGroup) => {
        output._console(output.chalk.redBright('p'), p);
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
        pha.database = `${directory}/${pha.database}`;
        pha.commit = JSON.parse(fs.readFileSync(`${directory}\\commit.pj4`).toString());
        output._console(output.chalk.blueBright('Pha created'), pha);
        pha.commit.module_import.groupes = await this.getTreatments('import', pha.commit.module_import.nom);
        pha.commit.module_transfert.groupes = await this.getTreatments('transfert', pha.commit.module_transfert.nom);
        pha.commit.informations_generales.folder = directory;
        output._console(output.chalk.redBright('Pha loaded'), pha);
        await this.createDatabase(pha);
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
    await this.createDatabase(prj);
  }
}
