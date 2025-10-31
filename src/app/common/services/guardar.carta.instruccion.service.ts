import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import {catchError} from 'rxjs/operators';
import { CartaInstruccion } from '../domain/carta.instruccion';

  @Injectable({
    providedIn: 'root'
  })
  export class GuardarCartaInstruccionService extends BaseService {
  endPointURL = "/carta/libranza";
 
   
  create( cartaInstruccion:CartaInstruccion ){
    //console.log(">>>Request Carta de Libranza ", cartaInstruccion);
    return this.http.post<CartaInstruccion>( this.endPointURL,cartaInstruccion , this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "Guardar Carta de Libranza" )) );
  }

}
