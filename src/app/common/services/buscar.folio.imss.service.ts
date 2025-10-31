import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import {catchError} from 'rxjs/operators';
import { Solicitud } from '../domain/solicitud';
import { BuscarFolioImss } from '../domain/buscar.folio.imss';
import {Page} from 'src/app/common/domain/page';

  @Injectable({
    providedIn: 'root'
  })
  export class BuscarFolioImssService extends BaseService {
  endPointURL = "/solicitud/operador/imss";
   
   
  getbuscarFolio( BuscarFolioImssRequest){
    return this.http.post< Page<BuscarFolioImss>>( this.endPointURL,BuscarFolioImssRequest  , this.httpOptions )
  .pipe( catchError(error => this.handleError( error, "danger", "Buscar folio IMSS" )) );
  }

  
}
