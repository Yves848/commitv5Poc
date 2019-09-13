import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { NewDialogComponent } from './new-dialog/new-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  nom: string;
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NewDialogComponent, {
      width: '250px',
      data: { nom: this.nom },
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }

  ngOnInit() {}
}
