import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

import { ProjectFile } from './../../../models/IProject';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  openState = false;
  project: ProjectFile;

  constructor(private projectService: ProjectService) {
    this.project = this.projectService.project;
  }

  ngOnInit() {}
}
