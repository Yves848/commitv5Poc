import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  public _file: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private els: ElectronService) {}

  setFile(value) {
    if (value) {
      this._file.next(value);
    }
  }

  listfiles(path: string): Observable<string[]> {
    const result = new Observable<string[]>(observer => {
      const files = this.els.ipcRenderer.sendSync('listfiles', { path });
      observer.next(files);
    });
    return result;
  }

  getFiles(path: string) {
    this.els.ipcRenderer.send('get-files', path);
  }
}
