import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { NotificacionHome } from "../domain/notificacion.home";
import { BaseService } from "./base.service";
import { NotificacionConsulta } from '../domain/notificacion.consulta';
import { Page } from "../domain/page";
import { NotificacionConsultaResponse } from "../domain/notificacion.consulta.response";

@Injectable({
    providedIn: 'root',
  })
export class NotificacionService extends BaseService {
    endPointNotificacionConsulta = "/notificacion/consulta";

    getNotificaciones(busquedaNotificacion:NotificacionConsulta){
        return this.http.post<Page<NotificacionConsultaResponse>>( this.endPointNotificacionConsulta, busquedaNotificacion , this.httpOptions )      
      .pipe( catchError(error => this.handleError( error, "danger", "Consulta de notificacions" )) );
    }
}