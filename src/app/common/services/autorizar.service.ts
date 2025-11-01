import { Injectable } from '@angular/core';
import { Pensionado } from '../domain/pensionado';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { Clabe } from '../domain/clabe';
import { CartaInstruccion } from '../domain/carta.instruccion';
import { Prestamo } from '../domain/prestamo';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { Page } from 'src/app/common/domain/page';
import { CartaInstruccionRequest, Modelo } from 'src/app/common/domain/carta.instruccion.request';
import { ClabeResponse } from '../domain/clabeResponse';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { SolicitudEstadoRequest } from '../domain/solicitud.estado.request';


@Injectable({
  providedIn: 'root'
})
export class AutorizarService extends BaseService {

  autorizarCarta = "/prestamo";
  postAutorizarCarta(autorizarCarta: CartaInstruccion) {
    //console.log(">>> autorizar carta ", JSON.stringify(autorizarCarta));
    return this.http.post<CartaInstruccion>(this.autorizarCarta, autorizarCarta, this.httpOptions)
      .pipe(
        catchError(error => this.handleError(error, "danger", "Autorizar Carta"))
      );
  }

  cartaInstruccion = "/carta/instruccion";
  getCartaInstruccion(instruccionCarta: CartaInstruccion) {
    return this.http.post<CartaInstruccion>(this.cartaInstruccion, instruccionCarta, this.httpOptions)
      .pipe(
        map(
          (data: CartaInstruccion) => {
            if (data.error === true) {
              this.handlePartialContent("danger", "Carta de Libranza", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handleError(error, "danger", "Carta de Libranza"))
      );
  }

  busquedaAutorizador = "/solicitud/operadoref";
  getBusquedaAutorizador(busquedaCarta: CartaInstruccionRequest) {
    return this.http.post<Page<CartaInstruccion>>(
      this.buscarPrestamos,
      //this.busquedaAutorizador,  
      busquedaCarta,
      this.httpOptions).pipe(
        catchError(error => this.handleError(error, "danger", "Consulta de prestamos"))
      );
  }

  buscarPrestamos = "/solicitud/operadoref/prestamos";
  getBusquedaAutorizadorEF(busquedaCarta: CartaInstruccionRequest) {
    return this.http.post<Page<CartaInstruccion>>(
      this.buscarPrestamos,
      //this.busquedaAutorizador, 
      busquedaCarta,
      this.httpOptions).pipe(
        catchError(error => this.handleError(error, "danger", "Consulta de prestamos"))
      );
  }

  descargarExcelPrestamos(busquedaCarta: CartaInstruccionRequest) {
    this.generaReporteExcelPrestamos(busquedaCarta).subscribe((response: any) => {
      let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      let filename = "Reporte_Busqueda_Prestamos.xlsx";
      if (filename)
        downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  reporteExcelPrestamos = "/solicitud/operadoref/reporte";
  generaReporteExcelPrestamos(busquedaCarta: CartaInstruccionRequest) {
    return this.http.post(
      this.reporteExcelPrestamos,
      busquedaCarta,
      { responseType: 'blob' as 'json' }).pipe(
        catchError(error => this.handleError(error, "danger", "Generacion de reportes."))
      );
  }

  //No existe referencia a este método
  busquedaAutorizadorML = "/solicitudFront/webresources/solicitudOperadorEF/montoLiquidar";
  getBusquedaAutorizadorML(busquedaCarta: CartaInstruccionRequest) {
    return this.http.post<Page<CartaInstruccion>>(this.busquedaAutorizadorML, busquedaCarta, this.httpOptions)
      .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", "Busqueda Autorizador")));
  }

  //No existe referencia a este método
  clabeAutorizar = "/solicitudFront/webresources/validarclabe";
  getClabeAutorizar(buscarClabe: CartaInstruccion) {
    return this.http.post<CartaInstruccion>(this.clabeAutorizar, buscarClabe, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Clabe")));
  }

  //No existe referencia a este método
  clabeAutorizarSISTRAP = "/sistrap/webresources/titularPago";
  getClabeAutorizarSISTRAP(buscarClabe: Clabe) {
    return this.http.post<ClabeResponse>(this.clabeAutorizarSISTRAP, buscarClabe, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Clabe")));
  }

  clabeValidarSISTRAP = "/pensionado/valida/clabe";
  getValidarClabe(buscarClabe: Clabe) {
    return this.http.post<ClabeResponse>(this.clabeValidarSISTRAP, buscarClabe, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "Clabe")));
  }

  existenEstados = '/solicitud/operadoref/existe/estados';
  getExistenEstados(curp: string, nss: string, idsEstados: number[]) {
    let queryParams = new HttpParams();
    if (curp != null && curp != "")
      queryParams = queryParams.append("curp", curp);
    if (nss != null && nss != "")
      queryParams = queryParams.append("nss", nss);
    if (idsEstados != null && idsEstados.length > 0) {
      idsEstados.forEach((ie) => {
        queryParams = queryParams.append("idsEstados", ie.toString());
      });
    }
    return this.http.get<any>(this.existenEstados, {
      params: queryParams, headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'my-auth-token'
      })
    }).pipe(catchError(error => this.handleError(error, "danger", "ExistenEstados")));
  }

  descuentosNoAplicados = "/solicitud/descuentos/noaplicados";
  getPrestamosDescuentosNoAplicados(busquedaCarta: CartaInstruccionRequest){
    return this.http.post<Page<CartaInstruccion>>(
      this.descuentosNoAplicados,
      busquedaCarta,
      this.httpOptions).pipe(
        catchError(error => this.handleError(error, "danger", "Descuentos no aplicados"))
      );
  }

  descargarExcelDescuentosNoAplicados(busquedaCarta: CartaInstruccionRequest) {
    this.generaExcelDescuentosNoAplicados(busquedaCarta).subscribe((response: any) => {
      let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      let filename = "Reporte_Descuentos_NoAplicados.xlsx";
      if (filename)
        downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  reporteExcelDescuentosNoAplicados = "/solicitud/descuentos/noaplicados/reporte";
  generaExcelDescuentosNoAplicados(busquedaCarta: CartaInstruccionRequest) {
    return this.http.post(
      this.reporteExcelDescuentosNoAplicados,
      busquedaCarta,
      { responseType: 'blob' as 'json' }).pipe(
        catchError(error => this.handleError(error, "danger", "Generacion de reportes."))
      );
  }

  cartaReinstalacion = "/prestamo/resintalacion/autorizar";
  autorizarCartaReinstalacion(solicitudEstado: SolicitudEstadoRequest) {
    return this.http.post<Solicitud>(
      this.cartaReinstalacion, solicitudEstado, this.httpOptions).pipe(
        catchError(error => this.handleError(error, "danger", "Autorizar Carta Reinstalación"))
      );
  }

}
