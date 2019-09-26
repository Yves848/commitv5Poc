import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { Groups } from './../../../../models/IGroups';
import { Groupes, Traitement } from './../../../../models/IProject';
import { GroupsServiceService } from './../../../services/groups-service.service';

@Component({
  selector: 'app-import-group',
  templateUrl: './import-group.component.html',
  styleUrls: ['./import-group.component.scss'],
})
export class ImportGroupComponent implements OnInit {
  @Input()
  groupe: Groupes;

  isOpen = false;

  traitements: Traitement[] = [];
  displayedColumns: string[] = ['action', 'id', 'libelle', 'succes', 'avertissements', 'erreurs'];
  constructor(private els: ElectronService, private groupsService: GroupsServiceService, private ngZone: NgZone) {}

  async ngOnInit() {
    this.traitements = this.groupe.traitements;
    this.groupsService.changeOpen.subscribe(async (groups: Groups[]) => {
      groups.forEach(g => {
        if (g.libelle === this.groupe.libelleGroupe) {
          this.isOpen = this.groupsService.isOpen(g.libelle);
          console.log('changeOpen', this.groupe.libelleGroupe, this.isOpen);
        }
      });
    });
    console.log('app-import-group isOpen', this.isOpen);
  }
}
