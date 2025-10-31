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
import {PensionesResponse} from '../domain/pensiones.response';
import {PensionadoResponse} from '../domain/pensionado.response';
import { ValidarPensionadoModel } from '../domain/validar.pensionado.model';

@Injectable({ providedIn: 'root' })
export class PensionadoService extends BaseService{
  pensionesEndPoint = "/pensionado/pension";
  endPointURL = "/sistrap/webresources/titularPago";
  obtenerSesionEndPoint = "/sesion";
  obtenerCaptchaEndPoint = "/captcha";
  pensionadoURL = "/pensionado";
  validarPensionadoURL = "/pensionado/validar";
  
  //No existe referencia a este método
  getTitularPago(titularGrupoRequest: TitularGrupoRequest ){
    return this.http.post<Pensionado>( this.endPointURL, { titularGrupoRequest}, this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "SISTRAP titular de pago" )) );
  }  
  
  getPensiones( curp: string ){
    return this.http.post<PensionesResponse>(this.pensionesEndPoint, { curp: curp}, this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "SISTRAP pensiones" )) );
  }
  
  readPensionado( nss: string, grupoFamiliar: string ){
    return this.http.post<PensionadoResponse>(this.pensionadoURL, {idNss: nss, idGrupoFamiliar: grupoFamiliar }, this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "SISTRAP pensionado" )) );
  }

  validarPensionado(pensionado: ValidarPensionadoModel){
    return this.http.post<ValidarPensionadoModel>(this.validarPensionadoURL, pensionado, this.httpOptions)
      .pipe(catchError(error => this.handlerLoginError(error, "danger", error.error.message)));
  }
  
  getSesion(){
    return this.http.get<number>(this.obtenerSesionEndPoint, this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "sesion" )) );
  }

  getCaptcha(){
    return this.http.post<number>(this.obtenerCaptchaEndPoint, this.httpOptions)
    .pipe( catchError(error => this.handleError( error, "danger", "captcha" )) );
  }
}
