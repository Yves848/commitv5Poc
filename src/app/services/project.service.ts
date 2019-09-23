import { Injectable } from '@angular/core';

import { IcreateProject } from './../../models/IGeneral';
import { ProjectFile } from './../../models/IProject';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  createProject: IcreateProject;
  project: ProjectFile;

  constructor() {}

  initProject() {
    const newProject: IcreateProject = {
      folderName: './',
      projectName: '',
      import: '',
      pays: 'fr',
      transfert: '',
    };
    return { ...newProject };
  }

  getProjectInfoGen() {
    console.log('getProject', this.project);
    return this.project.informations_generales;
  }
}
