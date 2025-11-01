import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { SolicitudHome } from '../domain/solicitud.home';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
  })
  export class SolicitudesHomeService extends BaseService {
    endPointSolHome = "/solicitud/lista";

    
    getSolicitudesHome(solHome: SolicitudHome) {
        return this.http.post<SolicitudHome>(this.endPointSolHome, solHome, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "personal operativo")));

    }
  }