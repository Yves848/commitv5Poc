import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';

import { IcreateProject } from './../../../../models/IGeneral';
import { modulespays } from './../../../../models/ITypesModules';

@Component({
  selector: 'app-new-dialog',
  templateUrl: './new-dialog.component.html',
  styleUrls: ['./new-dialog.component.scss'],
})
export class NewDialogComponent implements OnInit {
  pays = modulespays.modulesPays.map(module => {
    return module.pays;
  });

  nomsModulesImport = [];
  nomsModulesTransfert = [];

  getModulesPays(pays: string = 'fr'): void {
    const module = modulespays.modulesPays.filter(module => {
      return module.pays === pays;
    });

    console.log(module[0]);
    this.nomsModulesImport = module[0].import.map(imp => {
      return imp.nom;
    });

    this.nomsModulesTransfert = module[0].transfert.map(imp => {
      return imp.nom;
    });
  }
  constructor(
    public dialogRef: MatDialogRef<NewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IcreateProject,
    private els: ElectronService
  ) {}

  ngOnInit() {
    this.getModulesPays();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPaysChange() {
    this.getModulesPays(this.data.pays);
    if (this.nomsModulesImport.length === 1) {
      this.data.import = this.nomsModulesImport[0];
    }
    if (this.nomsModulesTransfert.length === 1) {
      this.data.transfert = this.nomsModulesTransfert[0];
    }
  }

  browseFolder() {
    const folder = this.els.ipcRenderer.sendSync('browse-folder', { path: this.data.folderName });
    this.data.projectName = folder;
  }
}
