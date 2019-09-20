import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-info-main',
  templateUrl: './info-main.component.html',
  styleUrls: ['./info-main.component.scss'],
})
export class InfoMainComponent implements OnInit {
  message = '';
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {
    this.message = this.data.message;
  }
}
