import { Injectable } from '@angular/core';

import { Plazo } from '../domain/plazo';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';
import { PlazoCondiciones } from '../domain/plazo.condiciones';


  @Injectable({
    providedIn: 'root'
  })
  export class PlazoCondicionesService extends BaseService{
    endPointURL = "/entidad/financiera/condiciones";
    
    
  
    getPlazo( id: string ){
      //console.log(">>>>ID: " + id);
      return this.http.post<PlazoCondiciones[]>( this.endPointURL,{id},this.httpOptions)
      .pipe( catchError(error => this.handleError( error, "danger", " Plazo condiciones " )) );
    }

}

