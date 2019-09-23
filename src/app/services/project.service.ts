import { Injectable } from '@angular/core';

import { IcreateProject } from './../../models/IGeneral';
import { InfosGen } from './../../models/IProject';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  createProject: IcreateProject;
  project: InfosGen;

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

  getProject() {
    console.log('getProject', this.project);
    return this.project;
  }
}
