import { Component, OnInit } from '@angular/core';

import { ProjectsService } from '../../services/projects.service';
import { FilesService } from './../../services/files.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor(private fileService: FilesService, private projectService: ProjectsService) {}
  files = [];
  sPath = 'c:\\';

  ngOnInit() {
    console.log('nginit');
  }

  sendMsg() {
    console.log('sendMsg');
    this.files = [];
    this.fileService.listfiles(this.sPath).subscribe(result => {
      this.files = result;
    });
  }

  newProject() {
    console.log('newProject');
    this.projectService.createProject('test.pj4').subscribe(result => {
      console.log(result);
    });
  }
}
