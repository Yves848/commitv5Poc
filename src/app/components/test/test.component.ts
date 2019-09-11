import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor(private els: ElectronService) {}

  ngOnInit() {
    console.log('nginit');
    this.els.ipcRenderer.send('init-fichier');
    this.els.ipcRenderer.on('listfiles-reply', (event, data) => {
      console.log(data);
    });
  }

  sendMsg() {
    this.els.ipcRenderer.send('listfiles', { data: 'test' });
  }

  bell() {
    this.els.shell.beep();
  }
}
