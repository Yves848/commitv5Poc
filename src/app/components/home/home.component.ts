import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
    projectName: '',
    import: '',
    pays: 'fr',
    transfert: '',
  };

  constructor(public dialog: MatDialog, private els: ElectronService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NewDialogComponent, {
      width: '550px',
      data: this.project,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.els.ipcRenderer.sendSync('create-project', res);
      }
      console.log('clicked ok', res);
    });
  }

  ngOnInit() {}
}
