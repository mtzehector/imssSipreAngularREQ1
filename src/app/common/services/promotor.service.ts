import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { PersonaEF } from '../domain/persona.ef';
import { PrestamoPromotor } from '../domain/prestamo-promotor';
import { Pensionado } from 'src/app/common/domain/pensionado';
import { RegistroPensionado } from '../domain/registro-pensionado';
import { CartaInstruccionRequest } from '../domain/carta.instruccion.request';
import { Page } from '../domain/page';
import { CartaInstruccion } from '../domain/carta.instruccion';
import { PersonasEfRs } from '../domain/personas.ef.RS';
import { EntidadFinanciera } from '../domain/entidad.financiera';
import { CondicionesPrestamo } from '../domain/condicion.prestamo';

@Injectable({
  providedIn: 'root',
})
export class PromotorService extends BaseService {
  endPointURL = "/promotor";
  endPointURLOP = "/promotor/operador";

  endPointURLValidarPensionado = "/promotor/pensionado/validar";
  endPointURLPrestamo = "/prestamo/registrar"
  endPointURLValidarCorreo = "/persona/pensionado/valida"
  endPointURLValidarCorreoAdminEF = "/persona/adminef/valida"
  endPointURLBusquedaDetalle = "/promotorFront/webresources/promotor/buscarFolioDetalle"
  endPointURLPersonaFront = "/persona/promotores/validos";
  endPointValidarEF = '/entidad/financiera/validar';
  endPointURLCondiciones = '/condiciones/validar';
  endPointURLConfirmarCondiciones = '/condiciones/confirmar';
  endPointURLConfirmarCondicionesReinstalacion = '/reinstalacion/confirmar';
  endPointURLValidaPromotor = "/entidad/promotor/validar";
  endPointURLValidarReinstalacion = "/reinstalacion/validar";
  endPointURLPrestamoRegistrarReinstalacion = "/reinstalacion/registrar";

  getPromotorValido(cveEntidadFinanciera: number, cveDelegacion: number) {
    return this.http.post<PersonasEfRs>(this.endPointURLPersonaFront,
      {
        cveEntidadFinanciera: cveEntidadFinanciera,
        cveDelegacion: cveDelegacion
      }
      , this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "personal operativo")));

  }

  getPromotorCurpNss(curp: string, nss: string) {
    return this.http.post<PersonaEF>(this.endPointURL, { curp: curp, nss: nss }, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "personal operativo")));

  }

  getOperador(curp: string) {
    return this.http.post<PersonaEF>(this.endPointURLOP, { curp: curp }, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "personal operativo")));

  }
  getPromotor(curp: string) {
    return this.http.post<PersonaEF>(this.endPointURL, { curp: curp }, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "personal operativo")));

  }

  validarPensionado(pensionado: PrestamoPromotor) {
    return this.http.post<PrestamoPromotor>(this.endPointURLValidarPensionado, pensionado, this.httpOptions)
      .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", error.error.message)));
  }

  registrarPrestamo(prestamo: PrestamoPromotor) {
    return this.http.post<PrestamoPromotor>(this.endPointURLPrestamo, prestamo, this.httpOptions)
      .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", error.error.message)));
  }

  validarCondiciones(prestamo: PrestamoPromotor){
    return this.http.post<CondicionesPrestamo>(this.endPointURLCondiciones, prestamo, this.httpOptions)
      .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", error.error.message)));
  }

  validarCorreo(pensionado: RegistroPensionado) {
    return this.http.post<any>(this.endPointURLValidarCorreo, pensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "personal operativo")));
  }

  validarCorreoAdminEF(pensionado: RegistroPensionado) {
    return this.http.post<any>(this.endPointURLValidarCorreoAdminEF, pensionado, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "personal operativo")));
  }

  //No existen referencias a este método
  getBusquedaFolioDetalle(busquedaCarta: CartaInstruccionRequest) {
    return this.http.post<Page<CartaInstruccion>>(this.endPointURLBusquedaDetalle, busquedaCarta, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Consulta de prestamos")));
  }
 
  async validarEF(cveEntidadFinSIPRE: string){
      return await this.http.post<EntidadFinanciera>(this.endPointValidarEF, {cveEntidadFinSIPRE:cveEntidadFinSIPRE}, this.httpOptions).pipe( catchError(error => this.handleError( error, "danger", "simulación" )) ).toPromise();
  }

  async confirmarCondiciones(prestamo: PrestamoPromotor){
    return await this.http.post<any>(this.endPointURLConfirmarCondiciones, prestamo, this.httpOptions)
    .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", error.error.message))).toPromise();
  }
  
  validaRelacionLaboral(idEf: string, nss: string, curp: string, idPerEf: number) {
    return this.http.post<Page<CartaInstruccion>>(this.endPointURLValidaPromotor,  { nss: nss, cveEntidadFinanciera: idEf, curp: curp, idPersonaEF:idPerEf }, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Consulta de prestamos")));
  }

  validarReinstalacion(pensionado: PrestamoPromotor) {
    return this.http.post<PrestamoPromotor>(this.endPointURLValidarReinstalacion, pensionado, this.httpOptions).
      pipe (
        map (
          (data: PrestamoPromotor) => {
            if (data.error === true) {
              this.handlePartialContentWithoutServiceName("danger", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handlerPersonalizedError(error, "danger", error.error.message))
      );
  }

  registrarReinstalacionPrestamo(prestamo: PrestamoPromotor) {
    return this.http.post<PrestamoPromotor>(this.endPointURLPrestamoRegistrarReinstalacion, prestamo, this.httpOptions)
      .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", error.error.message)));
  }

  async confirmarCondicionesReinstalacion(prestamo: PrestamoPromotor){
    return this.http.post<any>(this.endPointURLConfirmarCondicionesReinstalacion, prestamo, this.httpOptions).
      pipe (
        map (
          (data: any) => {
            if (data.error === true) {
              this.handlePartialContentWithoutServiceName("danger", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handlerPersonalizedError(error, "danger", error.error.message))
      );
  }
}
