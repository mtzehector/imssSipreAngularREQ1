import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import {catchError} from 'rxjs/operators';
import { Solicitud } from '../domain/solicitud';
import { CartaInstruccion } from '../domain/carta.instruccion';
  
  @Injectable({
    providedIn: 'root'
  })
  export class ResumenCartaCapacidadService extends BaseService {
  endPointURL = "/carta/instruccion/capacidad/credito/resumen";   

 
    getCartaCapacidadInforme(solicitud:Solicitud){
      //console.log(">>>Entro al getCartaCapacidadInforme service>>>>>");
      return this.http.post<CartaInstruccion>( this.endPointURL,{"solicitud":solicitud}, this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "Carta capacidad credito" )) );
    }

}
