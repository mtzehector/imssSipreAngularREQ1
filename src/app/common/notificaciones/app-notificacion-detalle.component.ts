import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Model } from 'src/app/model';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from "../../data.service";
import { DetalleConsultaNotificacion } from './model/detalle.consulta.notificacion';
import { Documento } from '../domain';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';

@Component({
  selector: 'app-notificacion-detalle',
  templateUrl: './app-notificacion-detalle.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class AppNotificacionDetalle extends BaseComponent implements OnInit {
  notificacionDetalle: DetalleConsultaNotificacion;
  model: Model;
  rol: string;
  documentotmp: Documento[] = [];
  index: number = 0;
  flagConDocumentos: number = 0;

  constructor(protected data: DataService,
    private router: Router
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = this.data.model.rol;
    this.cargaDatos();
    this.obtenerDocumentos(this.notificacionDetalle);
  }

  cargaDatos() {
    this.notificacionDetalle = this.model.notificacionVerDetalle;

    if (this.notificacionDetalle.notificacion.altaRegistro != null) {
      this.notificacionDetalle.notificacion.altaRegistro =
        (this.model.notificacionVerDetalle.notificacion.altaRegistro).substring(0, 10);

    }
    if (this.notificacionDetalle.notificacion.fecVencimiento != null) {
      this.notificacionDetalle.notificacion.fecVencimiento =
        (this.model.notificacionVerDetalle.notificacion.fecVencimiento).substring(0, 10);
    }
  }

  regresar() {
    this.router.navigate(['/operadorIMSS/consultarNotificacion', {}]);
  }

  obtenerDocumentos(notificacionDetalle: DetalleConsultaNotificacion) {
    if (notificacionDetalle.notificacion.mcltNotificacionDocumento != null) {
      if (notificacionDetalle.notificacion.mcltNotificacionDocumento.length > 0) {
        for (let i = 0; i < notificacionDetalle.notificacion.mcltNotificacionDocumento.length; i++) {
          if (notificacionDetalle.notificacion.mcltNotificacionDocumento[i].referenciaBoveda != null) {
            this.documentotmp[this.index] = notificacionDetalle.notificacion.mcltNotificacionDocumento[i];
            this.documentotmp[this.index].tipoDocumentoEnum = TipoDocumento.forValue(notificacionDetalle.notificacion.mcltNotificacionDocumento[i].cveTipoDocumento);
            this.documentotmp[this.index].id = notificacionDetalle.notificacion.mcltNotificacionDocumento[i].cveDocumento;
            this.index++;
            this.flagConDocumentos = 1;
          }
        }
        let documentotmp1: Documento[] = [];
        if (this.documentotmp.length > 0) {

          const distinctDocs = this.documentotmp.filter(
            (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
          );
          for (var i = 0; i < distinctDocs.length; i++) {
            documentotmp1[i] = { ...distinctDocs[i] };
          }

        }
        let uniqueSet = new Set(documentotmp1);
        documentotmp1 = [...uniqueSet];
        this.notificacionDetalle.notificacion.documentos = documentotmp1;

      }
    } else {
      this.flagConDocumentos = 0;
    }
  }
}
