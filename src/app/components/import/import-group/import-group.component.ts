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
  displayedColumns: string[] = ['id', 'libelle', 'succes', 'avertissements', 'erreurs'];
  constructor(private els: ElectronService, private groupsService: GroupsServiceService, private ngZone: NgZone) {}

  async ngOnInit() {
    this.traitements = this.groupe.traitements;
    this.groupsService.changeOpen.subscribe(async (groups: Groups[]) => {
      console.log('changeOpen', this.groupe.libelleGroupe);
      groups.forEach(g => {
        if (g.libelle === this.groupe.libelleGroupe) {
          this.isOpen = this.groupsService.isOpen(g.libelle);
        }
      });
      /* await asyncForEach(groups, (group: Groups) => {
        if (group.libelle === this.groupe.libelleGroupe) {
          console.log('group', group.libelle, group.isOpen);
          this.ngZone.run(() => {
            this.isOpen = group.isOpen;
          });
        } else {
          this.ngZone.run(() => {
            this.isOpen = false;
          });
        }
      }); */
    });
    console.log('app-import-group isOpen', this.isOpen);
  }
}
