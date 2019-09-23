import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { ProjectService } from 'src/app/services/project.service';
import { IcreateProject } from 'src/models/IGeneral';

import { InfosGen } from './../../../models/IProject';
import { InfoMainComponent } from './../snackbar/info-main/info-main.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  nom: string;
  createproject: IcreateProject;
  project: InfosGen;
  messages: string[] = [];
  progress = false;
  background: any = require('../../../assets/pharmagest.png');

  constructor(
    public dialog: MatDialog,
    private els: ElectronService,
    private snack: MatSnackBar,
    private ngZone: NgZone,
    private projectService: ProjectService,
    private router: Router
  ) {
    if (this.els.isElectronApp) {
      this.els.ipcRenderer.on('progress', (event, data) => {
        this.progress = !this.progress;
      });

      this.els.ipcRenderer.on('message', (event, data) => {
        this.ngZone.run(() => this.messages.push(data.message));
      });

      this.els.ipcRenderer.on('popup', (event, data) => {
        console.log(data.message);
        this.progress = false;
        // this.ngZone.run(() => this.snack.open(`${data.message}`, 'Info', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'left' }));
        this.ngZone.run(() => {
          this.snack.openFromComponent(InfoMainComponent, { data: { message: data.message }, duration: 5000, panelClass: 'snack' });
          this.router.navigateByUrl('/configuration');
        });
      });
    }
  }

  ngOnInit() {
    this.project = this.projectService.project;
  }
}
