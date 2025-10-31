import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';
import { SolicitudesVigentesRequest } from 'src/app/common/domain/solicitudes.vigentes.request';
import { FolioVigente } from 'src/app/common/domain/folio.vigente';
import { Page } from 'src/app/common/domain/page';
import { AsignarPromotorRq } from '../domain/asignar.promotor.rq';


@Injectable({
  providedIn: 'root'
})
export class SolicitudesVigentesService extends BaseService {

  busquedaSolicitudesVigentes = "/solicitudes/vigentes/paginado";
  solicitudFront = "/solicitud/asigna/promotor";
  solicitudValidaDescuento ="/solicitud/valida/monto";

  getBusquedaSolicitudes(solicitudesVigentesRequest: SolicitudesVigentesRequest) {
    return this.http.post<Page<FolioVigente>>(this.busquedaSolicitudesVigentes, solicitudesVigentesRequest, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Consulta de prestamos")));
  }

  setPromotorASolicitud(request: AsignarPromotorRq) {
    return this.http.post<AsignarPromotorRq>(this.solicitudFront, request, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Error en la asignación")));
  }
  ValidaMontoDescuento(nss: string, montoSolicitud: string){
    return this.http.post<number>(this.solicitudValidaDescuento,{nss:nss,montoSolicitud:montoSolicitud},
      this.httpOptions).pipe(catchError(error => this.handleError(error, "danger", "Consulta de prestamos")));
  }


}
