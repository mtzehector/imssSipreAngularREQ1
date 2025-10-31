import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Documento } from '../domain/documento';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';
import { DocumentoRequest } from '../domain';



  @Injectable({
    providedIn: 'root'
  })
  export class DocumentoService extends BaseService {
    endPointURL = "";
    
    //No hay referencia a este método
    getDocumento( documento:Documento ){
      return this.http.post<Documento>( this.endPointURL,documento , this.httpOptions )
      .pipe( catchError(error => this.handleError( error, "danger", "documentos" )) );
    }
    
    postDocumento( formData : FormData ){
       return this.http.post<Documento>("/documento", formData)
       .pipe( catchError(error => this.handleError( error, "danger", "documentos" )) );
    }
    
    //No hay referencia a este método
    bajaDocumento( documento : DocumentoRequest ){
      return this.http.post<Documento>("/documentoFront/webresources/bajaDocumento", documento)
      .pipe( catchError(error => this.handleError( error, "danger", "documentos" )) );
   }

   postDocumentoAdicional( formData : FormData ){
    return this.http.post<Documento>("/documento/adicional", formData)
    .pipe( catchError(error => this.handleError( error, "danger", "documentos" )) );
   }
}
