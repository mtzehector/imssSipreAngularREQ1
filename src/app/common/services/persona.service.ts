import {Injectable} from '@angular/core';

import {Persona} from '../domain/persona';
import {catchError} from 'rxjs/operators';
import {BaseService} from './base.service';

  

@Injectable({providedIn: 'root'})
export class PersonaService extends BaseService{
  endPointURL = "/personaFrontOT1/webresources/persona";  
  getPersona( curp: string ){
    this.data.model.mensaje.mensaje = "";
    return this.http.post<Persona>( this.endPointURL, { curp: curp}, this.httpOptions )
    .pipe( catchError(error => this.handleError( error, "danger", "consulta de personas" )) );
  }  
}
