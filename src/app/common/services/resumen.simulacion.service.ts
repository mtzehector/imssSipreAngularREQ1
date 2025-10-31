import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { CartaInstruccion } from '../domain/carta.instruccion';
import { SolicitudesExcel } from '../domain/solicitudes.excel';
import { NullTemplateVisitor } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ResumenSimulacionService extends BaseService {

  endPointURL = "/simulacion/resumen";
  endPointURLConSpes = "/simulacion/sipre";
  endPointURLGeneraExcel = "/simulacionFront/webresources/reporteExcel";


  consultar(cartaInstruccion: CartaInstruccion) {
    return this.http.post<CartaInstruccion>(this.endPointURL, { "solicitud": cartaInstruccion.solicitud }, this.httpOptions)
      .pipe(
        map(
          (data: CartaInstruccion) => {
            if (data.error === true) {
              this.handlePartialContent("danger", "Obtener resumen de simulacion", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(
          error => this.handleError(error, "danger", "Obtener resumen de simulacion")
        )
      );
  }

  consultarConSPES(cartaInstruccion: CartaInstruccion) {
    return this.http.post<CartaInstruccion>(this.endPointURLConSpes, { "solicitud": cartaInstruccion.solicitud }, this.httpOptions)
      .pipe(
        map(
          (data: CartaInstruccion) => {
            if (data.error === true) {
              this.handlePartialContent("danger", "Obtener resumen de simulación sipre", data.message);
              return null;
            }
            else
              return data;
          }
        ),
        catchError(error => this.handleError(error, "danger", "Obtener resumen de simulación sipre"))
      );
  }

  //Este método no se utiliza
  // funcion para invocar la  generacion del excel
  generaExcelBusqueda(solicitudes: SolicitudesExcel) {
    console.log("Endpoint: " + this.endPointURLGeneraExcel);
    return this.http.post(this.endPointURLGeneraExcel, solicitudes, { responseType: 'blob' as 'json' })
      .pipe(catchError(error => this.handleError(error, "danger", "Generacion de reportes.")));
  }

  //Este método no se utiliza
  descargarExcelPrestamos(solicitudes: SolicitudesExcel) {
    console.log("se debe descargar el archivo" + solicitudes);
    this.generaExcelBusqueda(solicitudes).subscribe(
      (response: any) => {
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

}
