import { BaseService } from '.';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ValidarCandidatoOperadorRq } from '../domain/validar.candidato.operador.rq';
import { ValidarCandidatoOperadorRs } from '../domain/validar.candidato.operador.rs';

@Injectable({
  providedIn: 'root'
})
export class ValidarCandidatoOperadorService extends BaseService {

   endPointOpImssURL = "/trabajador/imss";

  async validarOpImss(rq: ValidarCandidatoOperadorRq) {

    return await this.http.post<ValidarCandidatoOperadorRs>(this.endPointOpImssURL, rq, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Validar Candidato Operador"))).toPromise();
  }

}