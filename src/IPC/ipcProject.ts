import { BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

import { IcreateProject } from '../models/IGeneral';
import { ProjectFile } from '../models/IProject';
import { Modules, modulespays } from '../models/ITypesModules';
import { chalk, LogBase } from '../utils/output';
import { Project } from './../../srv/project';

export class IPCProjects {
  modules: Modules = modulespays;
  projectFile: ProjectFile;
  project: Project;
  log: LogBase;

  constructor(private mainWindow: BrowserWindow) {
    this.log = new LogBase();
  }
  start() {
    this.log.info('IPCProjects - Start', chalk.bgWhiteBright.green('Ok'));

    // Définition des évènements
    ipcMain.on('create-project', async (event, data: IcreateProject) => {
      this.log.info('create-project - senderId', event.sender.id);
      this.createProjectFile(event, data);
    });

    ipcMain.on('open-project', async (event: Electron.IpcMainEvent, data: string) => {
      this.log.info('open-project - senderId', event.sender.id);
      await this.openProject(event, data);
    });
  }

  async openProject(event: Electron.IpcMainEvent, data: string) {
    this.log.info('openProject', data);
    this.project = new Project(event);
    event.reply('popup', { message: `Projet ${data} ouvert` });
    const pha = await this.project.open(data);
    this.log.info('openProject', pha.commit.informations_generales);
    event.returnValue = pha.commit;
  }

  // Méthodes ....
  createProjectFile(event: Electron.IpcMainEvent, data: IcreateProject) {
    this.log.info('createProjectFile', data);
    event.reply('progress');
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
    this.createProject(event, data.projectName);
    event.returnValue = path.join(`${data.projectName}`);
  }

  async createProject(event: Electron.IpcMainEvent, directory: string) {
    this.project = new Project(event);
    const pha = await this.project.create(directory);
    event.returnValue = pha.commit;
  }
}
