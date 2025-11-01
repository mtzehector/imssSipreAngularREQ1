import { BaseService } from '.';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ValidarCandidatoOperadorRq } from '../domain/validar.candidato.operador.rq';
import { ValidarCandidatoOperadorRs } from '../domain/validar.candidato.operador.rs';
import { Operador } from 'src/app/common/domain/operador'

@Injectable({
  providedIn: 'root'
})
export class OperadorService extends BaseService {

  endPointURL = "/persona/operador/actualiza";

  updateOperador(operador: Operador) {

    return this.http.put<Operador>(this.endPointURL, operador,this.httpOptions);
  }

}