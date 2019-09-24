import { Component, Input, OnInit } from '@angular/core';
import { asyncForEach } from 'src/utils/hof';

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
  constructor() {}

  async ngOnInit() {
    await asyncForEach(this.groupe.traitements, traitement => {
      this.traitements.push(traitement);
    });
  }
}
