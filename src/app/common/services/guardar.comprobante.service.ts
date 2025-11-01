import { Injectable } from '@angular/core';

import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { Solicitud } from '../domain/solicitud';
import { PrestamoAutorizado } from '../domain/prestamo.autorizado';
import { Prestamo } from '../domain/prestamo';

@Injectable({
  providedIn: 'root'
})
export class GuardarComprobanteService extends BaseService {

  endPointURL = "/prestamo/autorizar";
  guardarAnexar(prestamoAutorizado: PrestamoAutorizado) {
    return this.http.post<PrestamoAutorizado>(this.endPointURL, prestamoAutorizado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "guardar comprobante")));
  }

  endPointURLOperaciones = "/prestamo/operaciones";

  guardarOperaciones(prestamoAutorizado: PrestamoAutorizado) {

    return this.http.post<PrestamoAutorizado>(this.endPointURLOperaciones, prestamoAutorizado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "guardar comprobante")));

  }

}