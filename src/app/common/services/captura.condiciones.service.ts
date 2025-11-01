import { Injectable } from '@angular/core';
import { CapacidadCredito } from '../domain/capacidad.credito';
import { Pensionado } from '../domain/pensionado';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { CapturaCondiciones } from '../domain/captura.condiciones';
import { CartaInstruccion } from '../domain/carta.instruccion';


@Injectable({
  providedIn: 'root'
})
export class CapturaCondicionesService extends BaseService {
  endPointURL = "/condiciones/captura";

  getCapturaCondiciones(capturaCondiciones: CapturaCondiciones) {
    //console.log("Capturar condiciones service: " + JSON.stringify(capturaCondiciones));

    return this.http.post<CapturaCondiciones>(this.endPointURL, capturaCondiciones, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Captura de condiciones")));
  }


  //No existen referencias a este método
  resumenSimulacion = "/simulacion/resumen";
  getresumenSimulacion(cartaInstruccion: CartaInstruccion) {
    return this.http.post<CartaInstruccion>(this.resumenSimulacion, cartaInstruccion, this.httpOptions)
      .pipe(
        map(
          (data: CartaInstruccion) => {
            if (data.error === true) {
              this.handlePartialContent("danger", "Captura de condiciones", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handleError(error, "danger", "Captura de condiciones"))
      );
  }

}
