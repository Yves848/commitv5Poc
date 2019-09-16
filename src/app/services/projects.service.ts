import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';

import { IcreateProject } from '../../models/IGeneral';
import { Project } from '../../models/IProject';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private els: ElectronService) {}

  createProject(projectName: string): Observable<Project> {
    console.log('service project - createProject');
    const result = new Observable<Project>(observer => {
      console.log('send message');
      const icreateProject: IcreateProject = {
        projectName,
        pays: 'fr',
        import: 'alliancePremium',
        transfert: 'lgpi',
      };
      const project = this.els.ipcRenderer.sendSync('create-project', icreateProject);
      observer.next(project);
    });
    return result;
  }
}
