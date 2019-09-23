import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';
import { ProjectService } from 'src/app/services/project.service';
import { IcreateProject } from 'src/models/IGeneral';

import { InfosGen } from './../../../models/IProject';
import { NewDialogComponent } from './../home/new-dialog/new-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  nom: string;
  createProject: IcreateProject;
  project: InfosGen;

  messages: string[] = [];

  constructor(
    public dialog: MatDialog,
    private els: ElectronService,
    private snack: MatSnackBar,
    private ngZone: NgZone,
    private projectService: ProjectService
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
    console.log('openProject - projectName ', projectName);
    this.projectService.project = this.els.ipcRenderer.sendSync('open-project', projectName);
    console.log('openProject - this.project', this.projectService.project);
  }

  projectLoaded(): boolean {
    return this.projectService.project && this.projectService.project.folder !== '';
  }

  projectName(): string {
    let name = '';
    if (this.projectService.project && this.projectService.project.folder !== '') {
      name = `[ ${this.projectService.project.folder}]`;
    }

    return name;
  }

  ngOnInit() {
    this.createProject = this.projectService.initProject();
    this.project = this.projectService.project;
  }
}
