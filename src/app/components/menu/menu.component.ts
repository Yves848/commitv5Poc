import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { ProjectService } from 'src/app/services/project.service';
import { IcreateProject } from 'src/models/IGeneral';

import { Groupes } from './../../../models/IProject';
import { GroupsServiceService } from './../../services/groups-service.service';
import { NewDialogComponent } from './../home/new-dialog/new-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  nom: string;
  createProject: IcreateProject;
  modulesImport: Groupes[];
  messages: string[] = [];

  constructor(
    public dialog: MatDialog,
    private els: ElectronService,
    private projectService: ProjectService,
    private router: Router,
    private groupsService: GroupsServiceService
  ) {}

  newProject(): void {
    const newProject: IcreateProject = this.projectService.initProject();
    const dialogRef = this.dialog.open(NewDialogComponent, {
      width: '550px',
      data: newProject,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // Sauver les infos du projet.....
        this.createProject = res;
        this.messages = [];
        this.projectService.project = this.els.ipcRenderer.sendSync('create-project', res);
      }
    });
  }

  openProject(): void {
    let projectName = '';
    projectName = this.els.ipcRenderer.sendSync('browse-folder', { path: this.createProject.folderName });
    this.projectService.project = this.els.ipcRenderer.sendSync('open-project', projectName);
    this.modulesImport = this.projectService.project.module_import.groupes;
  }

  projectLoaded(): boolean {
    return this.projectService.project && this.projectService.project.informations_generales.folder !== '';
  }

  openGroup(group: string) {
    this.groupsService.toggle(group);
  }

  isImport(): boolean {
    return this.router.url === '/import';
  }

  closeApp() {
    this.els.ipcRenderer.send('quit');
  }

  projectName(): string {
    let name = '';
    try {
      if (this.projectService.project && this.projectService.project.informations_generales.folder !== '') {
        name = `[ ${this.projectService.project.informations_generales.folder}]`;
      }
    } catch (error) {}

    return name;
  }

  ngOnInit() {
    this.createProject = this.projectService.initProject();
    if (this.projectLoaded()) {
      this.modulesImport = this.projectService.project.module_import.groupes;
    }
  }
}
