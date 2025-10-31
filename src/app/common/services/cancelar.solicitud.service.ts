import { Injectable } from '@angular/core';

import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { Solicitud } from '../domain/solicitud';

@Injectable({
  providedIn: 'root'
})
export class CancelarSolicitudService extends BaseService {

endPointURL = "/solicitud/cancela";
  getCancelar( id:number ){
    return this.http.post<Solicitud>( this.endPointURL,{id: id}, this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "cancelar solicitud" )) );
  }
 
}