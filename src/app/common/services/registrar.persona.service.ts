import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Promotor, PromotorRequest, PromotorResponse } from 'src/app/common/domain';
import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';


const httpOptions: any = {};
httpOptions.headers = {
  'Content-Type': 'application/json',
  Authorization: ''
};
httpOptions.observe = 'response';


@Injectable({
  providedIn: 'root'
})
export class RegistrarPersonaService extends BaseService {

  private registrarPersonaEndPointURL = '/persona';


  registrarPromotor(personaRq: Promotor) {

    const payload: any = {
      persona: personaRq,
      cvePerfil: personaRq.cvePerfil
    };

    return this.http.post<PromotorResponse>(this.registrarPersonaEndPointURL, payload, httpOptions)
      .pipe(map((response: any) => {
        catchError(error => this.handlerPersonalizedError(error, 'success',
         'El registro del Usuario <strong>' + personaRq.nombre + ' ' + personaRq.primerApellido + ' ' + personaRq.segundoApellido + '</strong> se realizó con éxito'));
      }))
      .pipe(catchError(error => this.handleError(error, 'danger', 'registrarPersona')));  
      
  }


}
