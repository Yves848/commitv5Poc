import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectFile } from 'src/models/IProject';

@Component({
  selector: 'app-requeteur',
  templateUrl: './requeteur.component.html',
  styleUrls: ['./requeteur.component.scss'],
})
export class RequeteurComponent implements OnInit {
  content: string;
  projectFile: ProjectFile;

  tables: string[];
  constructor(private projectService: ProjectService, private els: ElectronService) {}

  execQuery() {
    console.log(this.content);
  }
  async ngOnInit() {
    if (this.projectService.project) {
      this.tables = this.els.ipcRenderer.sendSync('table-list');
      console.log(this.tables);
    }
  }
}
