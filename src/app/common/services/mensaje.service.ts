import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Mensaje } from '../domain/mensaje';
import {BaseService} from './base.service';
import {catchError} from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class MensajeService extends BaseService{
  endPointURL = "/mensaje/";
 
  getMessage( id: string ){
    this.data.model.mensaje.mensaje = "";
    return this.http.get<Mensaje>( this.endPointURL+id, this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "warning", "mensajes" )) );
  }

}
