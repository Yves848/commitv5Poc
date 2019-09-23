import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { IcreateProject } from 'src/models/IGeneral';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  openState = false;
  project: IcreateProject;

  constructor(private projectService: ProjectService) {
    this.project = this.projectService.getProject();
  }

  ngOnInit() {}
}
