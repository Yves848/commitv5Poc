import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

import { IcreateProject } from '../models/IGeneral';
import { Modules, modulespays } from '../models/ITypesModules';
import { Project } from './../models/IProject';

//import * as fs from 'fs';

const _console = console.log;

export class IPCProjects {
  modules: Modules = modulespays;
  project: Project;
  start() {
    _console('IPCProjects Start');

    ipcMain.on('create-project', (event, data: IcreateProject) => {
      _console('create-project', data);
      const module = modulespays.modulesPays.filter(m => {
        return m.pays === data.pays;
      });

      const moduleImport = module[0].import.filter(imp => {
        return imp.nom === data.import;
      });

      const moduleTransfert = module[0].transfert.filter(trans => {
        return trans.nom === data.transfert;
      });

      this.project = {
        informations_generales: {
          pays: data.pays,
          folder: path.join(`${data.folderName}`, `${data.projectName}`),
          module_en_cours: 0,
          date_conversion: null,
          date_creation: new Date(),
          page_en_cours: 0,
        },
        module_import: { ...moduleImport[0], date: null, mode: 0, resultats: [] },
        module_transfert: {
          ...moduleTransfert[0],
          date: null,
          mode: 0,
          resultats: [],
        },
      };

      _console('module', module);
      _console('project', this.project);
      fs.writeFileSync(path.join(data.folderName, `${data.projectName}.pj4`), JSON.stringify(this.project));
      event.returnValue = path.join(data.folderName, `${data.projectName}.pj4`);
    });
  }
}
