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
  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.modulesImport = this.projectService.project.module_import.groupes;
    console.log('import', this.modulesImport);
  }

  folderName() {
    return this.projectService.project.informations_generales.folder;
  }
}
