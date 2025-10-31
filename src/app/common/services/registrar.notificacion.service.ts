import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { String } from 'typescript-string-operations';
import { NotificacionPrestamo } from 'src/app/common/domain';
import { catchError } from 'rxjs/internal/operators/catchError';
import { BaseService } from './base.service';
import { Notificacion } from '../domain/notificacion';
import { NotificacionModel } from '../domain/notificacion.model';
import { Prestamo } from '../domain/prestamo.not';


const httpOptions: any = {};
httpOptions.headers = {
  'Content-Type': 'application/json',
  Authorization: ''
};
httpOptions.observe = 'response';


@Injectable({
  providedIn: 'root'
})
export class RegistrarNotificacionService extends BaseService {

  consultarFolioPrestamoEndPointURL = "/prestamo/obtener";
  registrarNotificacionEndPointURL = "/solicitud/notificacion"
  atenderNotificacionEndPointURL = "/notificacion/atender"


  consultarFolioPrestamo(folioPrestamo: string, idEntidadFinanciera: number) {
    //console.log("RegistrarNotificacionService.consultarFolioPrestamo, folioPrestamo:" + folioPrestamo + ", idEntidadFinanciera: " + idEntidadFinanciera);
    let payload = {
      folio: folioPrestamo,
      entidadFinanciera: idEntidadFinanciera
    };
    return this.http.post<Prestamo>( this.consultarFolioPrestamoEndPointURL, payload, this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "consultarFolioPrestamo" )) );
  }

  registrarNotificacion(notificacion: NotificacionModel){
    return this.http.post<NotificacionModel>( this.registrarNotificacionEndPointURL, notificacion, this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "registrarNotificacion" )) );

  }


  atenderNotificacion(notificacion: NotificacionModel){
    return this.http.post<NotificacionModel>( this.atenderNotificacionEndPointURL, notificacion, this.httpOptions )      
    .pipe( catchError(error => this.handleError( error, "danger", "atenderNotificacion" )) );

  }

  // datosSesionMock() {

  //   this.data.model.persona = {
  //     id: "",
  //     curp: "CECA900331MDFRHN03",
  //     nombre: "JUAN",
  //     primerApellido: "PEÑA",
  //     segundoApellido: "NIETO",
  //     correoElectronico: "",
  //     telefono: "",
  //   }

  //   this.data.model.personaEF = {
  //     idPersonaEF: 1,
  //     delegacion: "1",
  //     estadoPersonaEF: "1",
  //     tipoPersonaEF: 1,
  //     entidadFinanciera: {
  //       nombreComercial: "",
  //       razonSocial: "",
  //       paginaWeb: "",
  //       numTelefono: 5544332211,
  //       tasaAnual: "1",
  //       beneficios: "1",
  //       id: "3",
  //       monto: 9999,
  //       descuentoMensual: 9999,
  //       importeTotal: 9999
  //     },
  //     nss: "",
  //     numEmpleado: ""
  //   };
  // }
}
