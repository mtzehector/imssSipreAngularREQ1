import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Simulacion } from '../domain/simulacion';
import { BaseService } from './base.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json',
      'Authorization': 'my-auth-token'
  })};
  

@Injectable({
  providedIn: 'root'
})
export class SimulacionService extends BaseService{
 endPointURL = "http://www.mocky.io/v2/5dc0c18f33000051001a4d0c";
 //  endPointURL = "http://www.mocky.io/v2/5dc0c43f33000051001a4d11";
  

  //No existen referencias a este método
  getSimulacion( id: string ){
    return this.http.post<Simulacion>( this.endPointURL, id, httpOptions );
  }

}
