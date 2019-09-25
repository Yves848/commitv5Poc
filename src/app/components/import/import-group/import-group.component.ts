import { Component, Input, OnInit } from '@angular/core';

import { Groupes, Traitement } from './../../../../models/IProject';

@Component({
  selector: 'app-import-group',
  templateUrl: './import-group.component.html',
  styleUrls: ['./import-group.component.scss'],
})
export class ImportGroupComponent implements OnInit {
  @Input()
  groupe: Groupes;

  traitements: Traitement[] = [];
  displayedColumns: string[] = ['id', 'libelle', 'succes', 'avertissements', 'erreurs'];
  constructor() {}

  async ngOnInit() {
    this.traitements = this.groupe.traitements;
  }
}
