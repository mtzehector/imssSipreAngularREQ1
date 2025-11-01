import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Plazo } from '../domain/plazo';

import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { Simulacion } from '../domain/simulacion';
import { EntidadFinanciera } from '../domain';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json',
    'Authorization': 'my-auth-token'
  })};
  

@Injectable({
  providedIn: 'root'
})
export class GuardadoSimulacion extends BaseService {

endPointURL = "/simulacion";
  getGuardado( datosSimulacion:Simulacion ){
//console.log(">>>DATOS SIMULACION: " , JSON.stringify(datosSimulacion));
    return this.http.post<Simulacion>( this.endPointURL,datosSimulacion, httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "simulación" )) );
  }

  endPointValidarEF = '/simulacion/valida/entidad/financiera'
  async validarEF(cveEntidadFinSIPRE: string){
      return await this.http.post<EntidadFinanciera>(this.endPointValidarEF, {cveEntidadFinSIPRE:cveEntidadFinSIPRE}, httpOptions).pipe( catchError(error => this.handleError( error, "danger", "simulación" )) ).toPromise();
  }
 
}