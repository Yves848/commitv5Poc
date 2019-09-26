import { EventEmitter, Injectable, Output } from '@angular/core';

import { Groups } from './../../models/IGroups';

@Injectable({
  providedIn: 'root',
})
export class GroupsServiceService {
  groups: Groups[];

  @Output() changeOpen: EventEmitter<Groups[]> = new EventEmitter();

  toggle(groupName) {
    console.log('toggle', groupName);
    this.groups.filter(g => {
      if (g.libelle === groupName) {
        g.isOpen = !g.isOpen;
      }
    });
    this.changeOpen.emit(this.groups);
  }

  constructor() {
    this.resetGroups();
  }

  isOpen(group: string): boolean {
    let o: boolean;

    this.groups.filter(g => {
      if (g.libelle === group) {
        o = g.isOpen;
      }
    });

    return o;
  }

  addGroup(group: string) {
    this.groups.push({
      libelle: group,
      isOpen: false,
    });
  }

  resetGroups() {
    this.groups = [];
  }
}
