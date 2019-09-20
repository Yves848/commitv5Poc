import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { ProjectsService } from '../../services/projects.service';
import { FilesService } from './../../services/files.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor(private fileService: FilesService, private projectService: ProjectsService, private els: ElectronService, private ngZone: NgZone) {}

  files = [];
  sPath = 'c:\\';

  ngOnInit() {
    this.els.ipcRenderer.on('new-file', (event, file) => {
      console.log(file);
      this.ngZone.run(() => this.files.push(file));
    });
  }

  sendMsg() {
    console.log('sendMsg');
    this.files = [];
    this.fileService.getFiles(this.sPath);
  }

  newProject() {
    console.log('newProject');
    this.projectService.createProject('test.pj4').subscribe(result => {
      console.log(result);
    });
  }
}
