import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Prestamo } from '../domain/prestamo';
import { FechaPrimerDescuento } from '../domain/fecha.primer.descuento';
import { BaseService } from './base.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json',
      'Authorization': 'my-auth-token'
  })};
  

@Injectable({
  providedIn: 'root'
})
export class PrestamoService extends BaseService {
 
 
 calendarioNomindaURL ="/solicitud/vigente/nomina";


  getlistaPrestamo( fecha: string ){
    return this.http.post<FechaPrimerDescuento>( this.calendarioNomindaURL, fecha, httpOptions );
  }

  endPointRegMonto = "/prestamo/registro/monto";
  registroMonto(cartaInstruccion: CartaInstruccion){
    return this.http.post<CartaInstruccion>( this.endPointRegMonto, cartaInstruccion , this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "Clabe" )) );
  }

  endPointRegMontoCapacidad = "/prestamo/registromonto/capacidad";
  registroMontoCapacidad(cartaInstruccion: CartaInstruccion){
    //console.log(">>>Request registroMontoCapacidad: ", JSON.stringify(cartaInstruccion));
    return this.http.post<CartaInstruccion>( this.endPointRegMontoCapacidad, cartaInstruccion , this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "Clabe" )) );
  }

  endPointRegMontoRenovacion = "/prestamo/registromonto/renovacion";
  registroMontoRenovacion(cartaInstruccion: CartaInstruccion){
    return this.http.post<CartaInstruccion>( this.endPointRegMontoRenovacion, cartaInstruccion , this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "Clabe" )) );
  }


}
