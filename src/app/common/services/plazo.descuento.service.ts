import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Plazo } from '../domain/plazo';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json',
    'Authorization': 'my-auth-token'
  })};
  

@Injectable({
  providedIn: 'root'
})
export class PlazoDescuentoService {
  endPointURL = "/financiera/oferta";
  
  constructor(private http: HttpClient) { }

  //No existe referencia a este método
  getMonto( monto: string ){
    return this.http.post<Plazo>( this.endPointURL, monto, httpOptions );
  }

}
