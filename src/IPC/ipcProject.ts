import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

import { IcreateProject } from '../models/IGeneral';
import { ProjectFile } from '../models/IProject';
import { Modules, modulespays } from '../models/ITypesModules';
import * as output from '../utils/output';
import { Project } from './../../srv/project';
import { _console } from './../utils/output';

export class IPCProjects {
  modules: Modules = modulespays;
  projectFile: ProjectFile;
  project: Project;

  start() {
    _console(output.chalk.greenBright.bold('IPCProjects - Start'), output.chalk.bgWhiteBright.green('Ok'));

    // Définition des évènements
    ipcMain.on('create-project', (event, data: IcreateProject) => {
      this.createProjectFile(event, data);
    });
  }

  // Méthodes ....
  createProjectFile(event: Electron.IpcMainEvent, data: IcreateProject) {
    output._console(output.chalk.redBright('create-project'), data);
    const module = modulespays.modulesPays.filter(m => {
      return m.pays === data.pays;
    });

    const moduleImport = module[0].import.filter(imp => {
      return imp.nom === data.import;
    });

    const moduleTransfert = module[0].transfert.filter(trans => {
      return trans.nom === data.transfert;
    });
    this.projectFile = {
      informations_generales: {
        pays: data.pays,
        folder: path.join(`${data.projectName}`),
        module_en_cours: 0,
        date_conversion: null,
        date_creation: new Date(),
        page_en_cours: 0,
      },
      module_import: { ...moduleImport[0], date: null, mode: 0, resultats: [], groupes: [] },
      module_transfert: {
        ...moduleTransfert[0],
        date: null,
        mode: 0,
        resultats: [],
        groupes: [],
      },
    };

    fs.writeFileSync(path.join(`${data.projectName}\\commit.pj4`), JSON.stringify(this.projectFile));
    this.createProject(data.projectName);
    event.returnValue = path.join(`${data.projectName}`);
  }

  createProject(directory: string) {
    this.project = new Project();
    this.project.open(directory);
  }
}
