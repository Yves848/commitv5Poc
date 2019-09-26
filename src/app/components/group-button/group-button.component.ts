import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-button',
  templateUrl: './group-button.component.html',
  styleUrls: ['./group-button.component.scss'],
})
export class GroupButtonComponent implements OnInit {
  @Input()
  name: string;
  constructor() {}

  ngOnInit() {}
}
