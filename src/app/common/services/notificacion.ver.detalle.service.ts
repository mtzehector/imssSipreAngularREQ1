import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { DetalleConsultaNotificacion } from "../notificaciones/model/detalle.consulta.notificacion";
import { BaseService } from "./base.service";
import { String } from 'typescript-string-operations';


const httpOptions: any = {};
httpOptions.headers = {
  'Content-Type': 'application/json',
  Authorization: ''
};
httpOptions.observe = 'response';


@Injectable({
  providedIn: 'root'
})
export class NotificacionVerDetalleService extends BaseService {
  [x: string]: any;
  private endPointOperadorIMSS = "/notificaciones/{0}";
  private endPointObtenerNotificacionPorIdNotificacionYIdEF = "/notificaciones/{0}/{1}";


  getNotificacionOpIMSS(cveNotificacion: number) {
    return this.http.get<DetalleConsultaNotificacion>(String.Format( this.endPointOperadorIMSS , cveNotificacion.toString()));
  }

  getNotificacionOpEF(cveNotificacion: number, cveEF: number) {
    return this.http.get<DetalleConsultaNotificacion>(String.Format( this.endPointOperadorIMSS , cveNotificacion.toString(), cveEF.toString()));
  }

  getNotificacionPorIdNotificacionYIdEF(cveNotificacion: number, cveEF: number) {
    return this.http.get<DetalleConsultaNotificacion>(String.Format( this.endPointObtenerNotificacionPorIdNotificacionYIdEF , cveNotificacion.toString(), cveEF.toString()));
  }
}