import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable, Subject } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Solicitud } from '../domain/solicitud';

  @Injectable({
    providedIn: 'root'
  })
  export class BuscarFolioService extends BaseService {
  endPointURL = "/solicitud/folio/buscar";    
   
  buscarFolio( numFolioSolicitud :string , claveEntidadFinanciera : string, cvePromotor: number): Observable<Solicitud> {
    return this.http.post<Solicitud>( this.endPointURL,{solicitud:{numFolioSolicitud:numFolioSolicitud}, cveEntidadFinanciera: claveEntidadFinanciera, cvePromotor: cvePromotor}  , this.httpOptions )
  .pipe( catchError(error => this.handlerPersonalizedError( error, "danger", error.error.message )) );
  }

  
}
