import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':  'application/json',
    'Authorization': 'my-auth-token'
  })};
  

 
@Injectable({
  providedIn: 'root',
})
export class CargaDocumentoService extends BaseService {
  endPointURL = "http://localhost/boveda/webresources/boveda";


  //No existen referencias a este método
  public postFileDocumento(documentoParaSubir: File){

		const formData = new FormData(); 
		formData.append('documentoPropia', documentoParaSubir, documentoParaSubir.name); 
		return this.http.post(this.endPointURL, formData);

	}
}
