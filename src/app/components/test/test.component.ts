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
    this.fileService._file.subscribe(file => {
      if (file) {
        this.files.push(file);
      }
    });

    this.els.ipcRenderer.on('new-file', (event, file) => {
      console.log(file);
      this.ngZone.run(() => this.fileService.setFile(file));
    });
  }

  sendMsg() {
    console.log('sendMsg');
    this.files = [];
    /* this.fileService.listfiles(this.sPath).subscribe(result => {
      this.files = result;
    }); */
    this.fileService.getFiles(this.sPath);
  }

  newProject() {
    console.log('newProject');
    this.projectService.createProject('test.pj4').subscribe(result => {
      console.log(result);
    });
  }
}
