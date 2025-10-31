import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Plazo } from '../domain/plazo';

import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { PlazoRequest } from '../domain/plazo.request';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json',
    'Authorization': 'my-auth-token'
  })};
  

@Injectable({
  providedIn: 'root'
})
export class PlazoService extends BaseService {
endPointURL = "/entidad/financiera/plazos";
  

  getPlazo( plazos:PlazoRequest ){
    return this.http.post<Plazo[]>( this.endPointURL,plazos, httpOptions )
    .pipe( catchError(error => this.handlerPersonalizedError( error, "danger", "No es posible generar la solicitud de préstamo al no cumplirse con las condiciones de la Entidad Financiera. Favor de verificar." )) );
  }
 
}