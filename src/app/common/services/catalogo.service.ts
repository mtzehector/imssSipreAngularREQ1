import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Delegacion } from '../domain';
import { Bancos } from '../domain/catalogos/bancos';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class CatalogoService extends BaseService {

  catalogoEntidadFinancieraEndPointURL = "/entidad/financiera";
  catalogoTipoNotificacionEndPointURL = "/catalogo/notificacion";
  catalogoSubTipoNotificacionEndPointURL = "/notificacion/subtipo";
  catalogoEstadNotificacionEndPointURL = "/notificacion/estado";
  catalagoMotivosBajaPrestamoEndPointURL ="/prestamo/motivos/baja";
  catalagoMotivosSuspensionPrestamoEndPointURL ="/prestamo/motivos/suspender";
  catalagoMotivosReanudarPrestamoEndPointURL ="/prestamo/motivos/reanudar";
  catalagoBancosEndPointURL ="/bancos";
  catalagoDelegacionesEndPointURL ="/delegaciones";


  consultarEntidadFinanciera() {
    return this.http.get<any>(this.catalogoEntidadFinancieraEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "cosultarEntidadFinanciera")));
  }

  consultarTipoNotificacion() {
    return this.http.get<any>(this.catalogoTipoNotificacionEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "consultarTipoNotificacion")));
  }

  consultarSubTipoNotificacion() {
    return this.http.get<any>(this.catalogoSubTipoNotificacionEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "consultarSubTipoNotificacion")));
  }

  consultarEstadoNotificacion() {
    return this.http.get<any>(this.catalogoEstadNotificacionEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "consultarEstadoNotificacion")));
  }

  consultarMotivosBajaPrestamo() {
    return this.http.get<any>(this.catalagoMotivosBajaPrestamoEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "consultarMotivosBajaPrestamo")));
  }

  consultarMotivosSuspensionPrestamo() {
    return this.http.get<any>(this.catalagoMotivosSuspensionPrestamoEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "consultarMotivosSuspensionPrestamo")));
  }

  consultarMotivosReanudarPrestamo() {
    return this.http.get<any>(this.catalagoMotivosReanudarPrestamoEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "consultarMotivosSuspensionPrestamo")));
  }

  consultarBancos() {
    return this.http.get<Bancos>(this.catalagoBancosEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Catalgo de Bancos")));
  }

  consultarDelegaciones() {
    return this.http.get<Delegacion[]>(this.catalagoDelegacionesEndPointURL, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Catalgo de Delegaciones")));
  }
}