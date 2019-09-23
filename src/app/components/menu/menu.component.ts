import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';
import { ProjectService } from 'src/app/services/project.service';
import { IcreateProject } from 'src/models/IGeneral';

import { NewDialogComponent } from './../home/new-dialog/new-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  nom: string;
  project: IcreateProject;

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
        this.project = res;
        this.messages = [];
        this.els.ipcRenderer.send('create-project', res);
      }
    });
    console.log('démarré');
  }

  openProject(): void {
    let projectName = '';
    projectName = this.els.ipcRenderer.sendSync('browse-folder', { path: this.project.folderName });
    console.log('openProject - projectName ', projectName);
    this.project = this.els.ipcRenderer.sendSync('open-project', projectName);
    // this.projectService.project = this.project;

    console.log('project opened : ', this.project);
  }

  projectLoaded(): boolean {
    return this.project.projectName !== '';
  }

  projectName(): string {
    let name = '';
    if (this.project.projectName !== '') {
      name = `[ ${this.project.projectName}]`;
    }

    return name;
  }

  ngOnInit() {
    this.project = this.projectService.initProject();
  }
}
