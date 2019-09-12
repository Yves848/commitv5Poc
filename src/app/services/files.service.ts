import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private els: ElectronService) {}

  listfiles(path: string): Observable<string[]> {
    const result = new Observable<string[]>(observer => {
      const files = this.els.ipcRenderer.sendSync('listfiles', { path });
      observer.next(files);
    });
    return result;
  }
}
