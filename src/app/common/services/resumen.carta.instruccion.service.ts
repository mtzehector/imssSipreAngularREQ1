import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { PrestamoAutorizado } from '../domain/prestamo.autorizado';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';

@Injectable({
  providedIn: 'root'
})
export class ResumenCartaInstruccionService extends BaseService {
  endPointURL = "/carta/instruccion";
  endPointURLMonto = "/carta/instruccion/consulta";
  endPointURLMontoCapacidad = "/carta/instruccion/consulta/capacidad";

  postCartaInstruccion(instruccionCarta: PrestamoAutorizado) {
    return this.http.post<PrestamoAutorizado>(this.endPointURL, instruccionCarta, this.httpOptions)
      .pipe(
        map(
          (data: PrestamoAutorizado) => {
            if (data.error === true) {
              this.handlePartialContent("danger", "Carta instrucción", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handleError(error, "danger", "Carta instrucción"))
      );
  }

  obtenerInfoSolicitud(cartaInstrccion: CartaInstruccion) {
    return this.http.post<CartaInstruccion>(this.endPointURLMonto, cartaInstrccion, this.httpOptions)
      .pipe(
        map(
          (data: CartaInstruccion) => {
            if (data.error === true) {
              this.handlePartialContent("danger", "Consulta carta instrucción", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handleError(error, "danger", "Consulta carta instrucción"))
      );
  }

  obtenerInfoSolicitudCapacidad(cartaInstrccion: CartaInstruccion) {
    return this.http.post<CartaInstruccion>(this.endPointURLMontoCapacidad, cartaInstrccion, this.httpOptions)
      .pipe(
        map(
          (data: CartaInstruccion) => {
            if (data.error === true) {
              this.handlePartialContent("danger", "Consulta capacidad carta instrucción", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handleError(error, "danger", "Consulta capacidad carta instrucción"))
      );
  }

}
