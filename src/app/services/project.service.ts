import { Injectable } from '@angular/core';

import { IcreateProject } from './../../models/IGeneral';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  project: IcreateProject;

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
    return this.project;
  }
}
