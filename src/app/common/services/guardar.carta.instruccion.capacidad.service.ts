import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import {catchError} from 'rxjs/operators';
import { CartaInstruccion } from '../domain/carta.instruccion';
import { PrestamoPromotor } from 'src/app/common/domain/prestamo-promotor';

  @Injectable({
    providedIn: 'root'
  })
  export class GuardarCartaInstruccionCapacidadService extends BaseService {
  endPointURL = "/capacidad/credito"; 
  endPointURLPromotor = "/capacidad/credito/prestamo/promotor";
  endPointURLCrearCartaReinstalacion = "/capacidad/credito/reinstalacion";
    
 
   
  create( cartaInstruccion:CartaInstruccion ){
    return this.http.post<CartaInstruccion>( this.endPointURL,cartaInstruccion , this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "Guardar Carta de Libranza" )) );
  }

  crearCartaPrestamoPromotor( cartaInstruccion:CartaInstruccion ){
      //console.log(">>>dddddddd ", JSON.stringify(cartaInstruccion));
    return this.http.post<CartaInstruccion>( this.endPointURLPromotor,cartaInstruccion , this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "Guardar Carta de Libranza" )) );
  }

  crearCartaReinstalacion( cartaInstruccion:CartaInstruccion ){
    return this.http.post<CartaInstruccion>( this.endPointURLCrearCartaReinstalacion, cartaInstruccion, this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "Guardar Carta de Reinstalación" )) );
  }

}
