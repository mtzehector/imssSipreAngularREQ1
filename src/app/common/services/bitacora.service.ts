import { Injectable } from '@angular/core';
import { Bitacora } from '../domain/bitacora';
import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { BitacoraPensionado } from '../historico-datos-pensionado/model/BitacoraPensionado';
import { BitacoraPensionadoRequest } from '../historico-datos-pensionado/model/BitacoraPensionadoRequest';
import { Page } from '../domain';


@Injectable({
  providedIn: 'root'
})
export class BitacoraService extends BaseService {

createEndPointURL = "/bitacora";
  create( bitacora:Bitacora ){
    
    //console.log("Creando Bitacora: " + JSON.stringify(bitacora) );
    
    return this.http.post<Bitacora>( this.createEndPointURL,bitacora, this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "bitacora" )) );
  }

  buscarBitacoraPensionadoPorCvePersonaEndpointURL = "/bitacora/pensionado";
  buscarBitacoraPensionadoPorCvePersona(bitacoraPensionadoRequest: BitacoraPensionadoRequest) {
    return this.http.post<Page<BitacoraPensionado>>( this.buscarBitacoraPensionadoPorCvePersonaEndpointURL, bitacoraPensionadoRequest, this.httpOptions).pipe( catchError(error => this.handleError( error, "danger", "bitacora" )) );
  }
 
}