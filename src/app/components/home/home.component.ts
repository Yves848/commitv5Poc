import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';
import { IcreateProject } from 'src/models/IGeneral';

import { InfoMainComponent } from './../snackbar/info-main/info-main.component';
import { NewDialogComponent } from './new-dialog/new-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  nom: string;
  project: IcreateProject = {
    folderName: './',
    projectName: '',
    import: '',
    pays: 'fr',
    transfert: '',
  };

  messages: string[] = [];

  constructor(public dialog: MatDialog, private els: ElectronService, private snack: MatSnackBar, private ngZone: NgZone) {
    this.els.ipcRenderer.on('message', (event, data) => {
      this.ngZone.run(() => this.messages.push(data.message));
    });

    this.els.ipcRenderer.on('popup', (event, data) => {
      console.log(data.message);
      // this.ngZone.run(() => this.snack.open(`${data.message}`, 'Info', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'left' }));
      this.ngZone.run(() =>
        this.snack.openFromComponent(InfoMainComponent, { data: { message: data.message }, duration: 5000, panelClass: 'snack' })
      );
    });
  }

  openDialog(): void {
    this.project.folderName = './';
    this.project.projectName = '';
    this.project.import = '';
    this.project.transfert = '';
    this.project.pays = 'fr';
    const dialogRef = this.dialog.open(NewDialogComponent, {
      width: '550px',
      data: this.project,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.messages = [];
        this.els.ipcRenderer.send('create-project', res);
      }
    });
    console.log('démarré');
  }

  openProject(): void {
    this.project.folderName = './';
    this.project.projectName = '';
    this.project.import = '';
    this.project.transfert = '';
    this.project.pays = 'fr';

    this.project.projectName = this.els.ipcRenderer.sendSync('browse-folder', { path: this.project.folderName });
    this.els.ipcRenderer.send('open-project', this.project);

    this.messages.push('Démarré');
    console.log('démarré');
  }

  ngOnInit() {}
}
