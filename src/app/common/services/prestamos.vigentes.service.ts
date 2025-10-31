import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { PrestamosVigentes } from '../domain/prestamos.vigentes';
import { Pensionado } from '../domain/pensionado';
import { PrestamoVigenteResponse } from '../domain/prestamovigente.response';
import { BaseService } from './base.service';
import { catchError, retry } from 'rxjs/operators';
import { SaldoCapitalRequest } from '../domain/saldoCapital-Request';
import {SaldoCapitalResponse} from '../domain/saldoCapital-Response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json',
    'Authorization': 'my-auth-token'
  })};
  

@Injectable({
  providedIn: 'root'
})
export class PrestamosVigentesService extends BaseService{
endPointURL = "/prestamos/vigentes"; 
endPointURLSaldo = "/prestamo/capital/insoluto"; 

 //Falta ver que se envia en dominop de Pensionado  

  getListPrestamosVigentes( pensionado: Pensionado){
  return this.http.post<any>( this.endPointURL,pensionado, httpOptions)
   .pipe( catchError(error => this.handleError( error, "danger", "Prestamos Vigentes" )) );;
  }

  async  getSaldoCapital(prestamoVigente:SaldoCapitalRequest){

 return await this.http.post<SaldoCapitalResponse>( this.endPointURLSaldo,prestamoVigente, httpOptions)
   .pipe( catchError(error => this.handleError( error, "danger", "Prestamos Vigentes" )) ).toPromise();;

  }
}
