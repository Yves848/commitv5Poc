import { Component, OnInit } from '@angular/core';

import { FilesService } from './../../services/files.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor(private fileService: FilesService) {}
  files = [];
  sPath = 'c:\\';

  ngOnInit() {
    console.log('nginit');
  }

  sendMsg() {
    this.files = [];
    this.fileService.listfiles(this.sPath).subscribe(result => {
      this.files = result;
    });
  }

  bell() {
    //this.els.shell.beep();
  }
}
