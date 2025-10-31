import { Injectable } from '@angular/core';
import { CapacidadCredito } from '../domain/capacidad.credito';
import { Pensionado } from '../domain/pensionado';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CapacidadCreditoService extends BaseService {
  endPointURL = "/pensionado/capacidad/credito";
  solicitudVigente = "/solicitud/vigente";

  getCapacidadCredito(pensionado: Pensionado) {
    return this.http.post<CapacidadCredito>(this.endPointURL, pensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "capacidad de crédito")));
  }


  getSolicitudVigente(pensionado: Pensionado) {
    //console.log("Enviando POST" + this.solicitudVigente);
    //console.log("Enviando POST " + JSON.stringify(pensionado));
  return this.http.post<any>(this.solicitudVigente, pensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Solicitud Vigente")));

  }
}
