import { BaseService } from '.';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { RegistroPensionado } from '../domain/registro-pensionado';
import { Loggin } from '../domain/loggin';

@Injectable({
    providedIn: 'root'
  })
  export class LogginService extends BaseService {
  
  logginEndPointURL = "/registroPensionadoFront/webresources/loggin";


  //No existen referencias a este método
  loggeo( loggeo: Loggin ){
//loggeo.password = 'ertertert';
    return this.http.post<Loggin>( this.logginEndPointURL,loggeo, this.httpOptions )
      .pipe( catchError(error => this.handleError( error, "danger", "loggeo" )) );
    }
   
  }