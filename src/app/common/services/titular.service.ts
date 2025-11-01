import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Pensionado } from '../domain/pensionado';
import {TitularGrupoRequest} from'../domain/titular.grupo.request';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DataService } from "../../data.service";
import { Model } from '../../model';
import {BaseService} from './base.service';

@Injectable({ providedIn: 'root' })
export class TitularService extends BaseService{
  endPointURL = "/pensionadoFront/webresources/pensionado";
  
  //No se utiliza este método
  getTitularPago(titularGrupoRequest: TitularGrupoRequest ){
    return this.http.post<Pensionado>(this.endPointURL, {nss: titularGrupoRequest.idNss, grupoFamiliar: titularGrupoRequest.idGrupoFamiliar}, this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "SISTRAP pensionado" )) );
  }  

}
