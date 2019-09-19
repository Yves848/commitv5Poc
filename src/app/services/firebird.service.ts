import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebirdService {
  public _message: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private els: ElectronService) {
    /* this.els.ipcRenderer.on('message', (event, data) => {
      this.setMessage(data.message);
    }); */
  }

  setMessage(value) {
    if (value) {
      this._message.next(value);
    } else {
      this._message.next(null);
    }
  }
}
