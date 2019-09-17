import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  constructor(public dialogRef: MatDialogRef<NewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IcreateProject) {}

  ngOnInit() {
    this.getModulesPays();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPaysChange() {
    console.log(this.data.pays);
    this.getModulesPays(this.data.pays);
  }
}
