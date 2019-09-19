import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ElectronService } from 'ngx-electron';
import { IcreateProject } from 'src/models/IGeneral';

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

  message = '';

  constructor(public dialog: MatDialog, private els: ElectronService, private snack: MatSnackBar) {
    this.els.ipcRenderer.on('message', (event, data) => {
      this.message = data.message;
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
        const name = this.els.ipcRenderer.sendSync('create-project', res);
        console.log(name);
        this.snack.open(`${name}`, 'Projet créé', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'right' });
      }
    });
  }

  ngOnInit() {}
}
