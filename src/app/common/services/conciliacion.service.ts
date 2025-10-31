import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { DetalleConciliacion } from '../domain/detalleConciliacion';
import { Conciliacion } from '../domain/conciliacion';
import { Documento, EntidadFinanciera, Page } from '../domain';
import { catchError } from 'rxjs/operators';
import { CartaReciboConFirma } from '../domain/carta.recibo.con.firma';
import { CartaReciboRequest } from '../domain/carta.recibo.request';
import { TramiteErogaciones } from '../domain/tramite.erogaciones';
import { EntidadFinancieraResponse } from '../domain/entidadfinanciera.response';
import { CartaReciboPerfilImss } from '../domain/carta.recibo.perfil.imss';
import { CartaReciboPerfilImssRequest } from '../domain/carta.recibo.perfil.imss.request';

@Injectable({
  providedIn: 'root'
})
export class ConciliacionService extends BaseService {

  conciliacionURL = "/conciliacion";
  catalogoURL = "/entidades/financieras";

  obtenerListEFActivas(){
    return this.http.get<[EntidadFinancieraResponse]>(
      this.catalogoURL.concat("/1"),
      this.httpOptions
    ).pipe(catchError(error => this.handleError(error, "danger", "Catalogo Entidades Financieras")));
  }

  buscarPeriodo(periodo: string){
    return this.http.get<DetalleConciliacion>(
      this.conciliacionURL.concat("/estatus") + `/${periodo}`, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Detalle conciliación" )));
  }

  activarDesactivarPeriodo(estatusConciliacion: DetalleConciliacion){
    return this.http.post<DetalleConciliacion>(
      this.conciliacionURL.concat("/estatus"), 
      estatusConciliacion, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Detalle conciliación" )));
  }

  generaConciliacion(conciliacion: Conciliacion){
    return this.http.post<Documento>(
      this.conciliacionURL.concat("/detalle"), 
      conciliacion, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Detalle conciliación" )));
  }

  existeCartaRecibo(conciliacion: Conciliacion){
    return this.http.post<Documento>(
      this.conciliacionURL.concat("/carta/recibo/existe"),
      conciliacion, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Carta Recibo" )));
  }

  existeCartaReciboPerfilesImss(cartaReciboRequest: CartaReciboPerfilImssRequest){
    return this.http.post<Page<CartaReciboPerfilImss>>(
      this.conciliacionURL.concat("/carta/recibo/imss/existe"), 
      cartaReciboRequest, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Carta Recibo" )));
  }

  generaCartaRecibo(conciliacion: Conciliacion){
    return this.http.post<Documento>(
      this.conciliacionURL.concat("/carta/recibo/inicial"),
      conciliacion, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Carta Recibo" )));
  }

  generaCartaReciboInicial(conciliacion: Conciliacion){
    return this.http.post<Documento>(
      this.conciliacionURL.concat("/carta/recibo/inicial"),
      conciliacion, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Carta Recibo" )));
  }

  obtenerListCartaReciboConFirma(request: CartaReciboRequest){

    return this.http.post<Page<CartaReciboConFirma>>(
      this.conciliacionURL.concat("/carta/recibo/firmada"),
      request,
      this.httpOptions
    ).pipe(
      catchError(error => this.handleError( error, "danger", "Carta Recibo" ))
    );

  }

  guardarFechaDescarga(id: number){
    return this.http.post<CartaReciboConFirma>(
      this.conciliacionURL.concat("/fecha/descarga"),
      {"id": id},
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Fecha Descarga" )));
  }

  obtenerResumenConciliacion(conciliacion: Conciliacion){
    return this.http.post<Documento>(
      this.conciliacionURL.concat("/resumen"), 
      conciliacion, 
      this.httpOptions
    ).pipe(catchError(error => this.handleError( error, "danger", "Resumen Concilación" )));
  }

  obtenerListTramiteErogaciones(request: CartaReciboRequest){

    return this.http.post<Page<TramiteErogaciones>>(
      this.conciliacionURL.concat("/tramite/erogaciones/lista"),
      request,
      this.httpOptions
    ).pipe(
      catchError(error => this.handleError( error, "danger", "Carta Recibo" ))
    );
  }

  generarTramiteErogaciones(conciliacion: Conciliacion){
    return this.http.post<any>(
      this.conciliacionURL.concat("/tramite/erogaciones"),
      conciliacion,
      this.httpOptions
    ).pipe(
      catchError(error => this.handleError( error, "danger", "Trámite Erogaciones" ))
    );
  }

  
}
