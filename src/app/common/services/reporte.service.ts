import { Injectable } from "@angular/core";
import { catchError } from "rxjs/internal/operators/catchError";
import { Reporte } from "../domain/reporte";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root',
})
export class ReporteService extends BaseService {
  endPointAutorizarReporte = "/reporte/autorizar/conciliacion";
  endPointReporteComprasDeCarteraEF = "/reporte/compra/cartera";

  generarReporte(reporte: Reporte){
    let endPointReporte = "";
    if(reporte.tipoReporte == 1 || reporte.tipoReporte == 3 ){
      endPointReporte = "/reporte/conciliacion";
    }else if( reporte.subTipoReporte >= 5 && reporte.subTipoReporte <= 11 ){
      endPointReporte = "/reporte/estadistico";
    }else if( reporte.subTipoReporte >= 12 && reporte.subTipoReporte <= 15 ){
      endPointReporte = "/reporte/operativo";
    }
   
    return this.http.post<Reporte>(endPointReporte, reporte, this.httpOptions)
    .pipe(catchError(error => this.handleError(error, "danger", "generar reporte")));
  }

  // generarReporteConciliacion(reporte: Reporte) {
  //   return this.http.post<Reporte>(this.endPointReporte, reporte, this.httpOptions)
  //     .pipe(catchError(error => this.handleError(error, "danger", "generar reporte")));
  // }

  autorizarReporteConciliacion(reporte: Reporte) {
    return this.http.post<Reporte>(this.endPointAutorizarReporte, reporte, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "generar reporte")));
  }

  generarReporteComprasCarteraEF(reporte: Reporte) {
    return this.http.post<Reporte>(this.endPointReporteComprasDeCarteraEF, reporte, this.httpOptions)
      .pipe(catchError(error => this.handleError(error, "danger", "generar reporte")));
  }

}



