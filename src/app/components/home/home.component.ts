import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';
import { IcreateProject } from 'src/models/IGeneral';

import { FirebirdService } from './../../services/firebird.service';
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

  constructor(public dialog: MatDialog, private els: ElectronService, private snack: MatSnackBar, private firebird: FirebirdService) {
    this.els.ipcRenderer.on('message', (event, data) => {
      this.firebird.setMessage(data.message);
    });

    this.els.ipcRenderer.on('popup', (event, data) => {
      console.log(data.message);
      this.snack.open(`${data.message}`, 'Info', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'left' });
    });

    this.firebird._message.subscribe(message => {
      if (message) {
        console.log(message);
        this.messages.push(message);
      }
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
    this.messages.push('Démarré');
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
