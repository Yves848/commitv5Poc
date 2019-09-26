import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

import { Groupes } from './../../../models/IProject';
import { GroupsServiceService } from './../../services/groups-service.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  modulesImport: Groupes[];
  // traitements: string[];
  constructor(private projectService: ProjectService, private groupsService: GroupsServiceService) {}

  ngOnInit() {
    this.modulesImport = this.projectService.project.module_import.groupes;
    this.groupsService.resetGroups();
    this.projectService.project.module_import.groupes.forEach(groupe => {
      this.groupsService.addGroup(groupe.libelleGroupe);
    });
  }

  isOpen(group: string): boolean {
    const o = this.groupsService.isOpen(group);
    console.log(`app-import isOpen ${group}`, o);
    return o;
  }

  folderName() {
    return this.projectService.project.informations_generales.folder;
  }
}
