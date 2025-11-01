import { Injectable } from '@angular/core';
import { CapacidadCredito } from '../domain/capacidad.credito';
import { Pensionado } from '../domain/pensionado';
import { BaseService } from './base.service';
import {catchError} from 'rxjs/operators';
import { Prestamo } from '../domain/prestamo';
import { CartaInstruccion } from '../domain/carta.instruccion';
  
  @Injectable({
    providedIn: 'root'
  })
  export class CartaCapacidadInformeService extends BaseService {
  endPointURL = "/pensionado/capacidad/credito";
 
    //No existe referencia a este método
    getCartaCapacidadInforme(prestamo:Prestamo){
      return this.http.post<CartaInstruccion>( this.endPointURL,prestamo, this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "Carta capacidad informe" )) );
    }

}
