import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { OfertaRequest } from '../domain/oferta.request';
import { PageRequest } from '../domain/page.request';
import { Page } from 'src/app/common/domain/page';
import { Oferta } from 'src/app/common/domain/oferta';
import { EntidadFinanciera } from 'src/app/common/domain/entidad.financiera';
import { Documento } from 'src/app/common/domain/documento';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({ providedIn: 'root'})
export class EntidadFinancieraService extends BaseService{
  fetchOfertasURL = "/financiera/oferta";
  
  fetchOfertas( request: PageRequest<OfertaRequest> ){
    //console.log(">>>Calculos: ", JSON.stringify(request));
    return this.http.post<Page<Oferta>>( this.fetchOfertasURL, request, this.httpOptions).
      pipe(
        map(
          (data: Page<Oferta>) => {
            if (data.error === true) {
              this.handlePartialContentWithoutServiceName("danger", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handleError(error, "danger", "Oferta"))
      );
  }

  findLogoURL = "/financiera/logo/";
  fetchLogo( id : number ): Observable<Documento>{
    return this.http.get<Documento>( this.findLogoURL+id, this.httpOptions );
  }
  
  //No hay referencia a este método
  findOneURL = "/entidadFinancieraFront/webresources/entidadFinanciera";
  findById( id : number ){
    return this.http.post<EntidadFinanciera>( this.findOneURL, {id:id}, this.httpOptions );
  }
  
  envioCorreo ="/notificacion/ofertas/enviar";
   sendEmail( request : PageRequest<OfertaRequest> ){
    return this.http.post<any>( this.envioCorreo,request , this.httpOptions );
  }

}
