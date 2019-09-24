import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

import { Groupes } from './../../../models/IProject';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  modulesImport: Groupes[];
  traitements: string[];
  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.modulesImport = this.projectService.project.module_import.groupes;
    this.projectService.project.module_import.groupes.forEach(groupe => {
      console.log('groupe - libelle', groupe.libelleGroupe);
      groupe.traitements.forEach(traitement => {
        console.log('   traitements', traitement.libelle);
      });
    });
  }

  folderName() {
    return this.projectService.project.informations_generales.folder;
  }
}
