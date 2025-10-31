import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import {catchError} from 'rxjs/operators';
import { Solicitud } from '../domain/solicitud';
import { CartaCapacidadCredito } from '../domain/carta.capacidad.credito';

  @Injectable({
    providedIn: 'root'
  })
  export class GuardarCartaCapacidadService extends BaseService {
  endPointURL = "/capacidad/credito/inserta";
 
   
  async create( cartaCapacidadCredito:CartaCapacidadCredito ){
    return await this.http.post<CartaCapacidadCredito>( this.endPointURL,cartaCapacidadCredito , this.httpOptions )
  .pipe( catchError(error => this.handleError( error, "danger", "Guardar carta de capacidad" )) ).toPromise();
  }

}
