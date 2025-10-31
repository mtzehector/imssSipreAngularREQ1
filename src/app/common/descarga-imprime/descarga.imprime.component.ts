// TODO: Feature Componetized like CrisisCenter
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { Documento } from '../domain/documento';
import { DocumentoService } from '../services/documento.service';
import { BaseComponent } from '../base.component';
import { Router, NavigationExtras } from '@angular/router';
import { DescargaImprimeService } from 'src/app/common/descarga-imprime/descarga.imprime.service';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-descarga-imprime',
  templateUrl: './descarga.imprime.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})

export class DescargaImprimeComponent extends BaseComponent implements OnInit {


  documento: Documento;
  model: Model;

  @Input() tipo: string;

//  ruta: string;
  fileName: string;

  @Input() idSolicitud: number;
  @Input() verDetalle: number;

  constructor(protected data: DataService, private route: ActivatedRoute, private documentoService: DocumentoService, private descargaImprimeService: DescargaImprimeService) {
    super(data);
  }

  ngOnInit() {
    //this.ruta = basehref;
    this.model = this.data.model;
    this.documento = this.model.documento;

    switch (this.tipo) {
      case "capacidad-credito": {
//        this.ruta = "capacidadCredito";
        this.fileName = "ReporteCapacidadCredito.pdf";
        break;
      }
      case "resumen-simulacion": {
//        this.ruta = "simulacionFront";
        this.fileName = "ReporteResumenSimulacion.pdf";
        break;
      }
      case "carta-instruccion": {
//        this.ruta = "cartaInstruccionFront";
        this.fileName = "ReporteResumenCartaInstruccion.pdf";
      }
      case "carta-reinstalacion": {
//        this.ruta = "cartaInstruccionFront";
        this.fileName = "ReporteCartaReinstalacion.pdf";
      }
      default: {
        break;
      }

    }



    // this.documentoService.getDocumento(this.model.documento).subscribe((documento : Documento) => this.data.model.documento = {...documento} );

    //this.data.model.documento = {numFolioSolicitud: this.data.model.documento.numFolioSolicitud,cveSolicitud:this.data.model.documento.cveSolicitud, refDocumento:this.data.model.documento.refDocumento, id:this.data.model.documento.id};

  }

  descargaImprimi(documento: Documento) {

  }



  downloadFile() {
    //let url = '/' + this.ruta + '/webresources/' + this.tipo + '/' + this.idSolicitud;
    //let url = '/' + this.ruta + '/webresources/' + this.tipo + '/' + this.idSolicitud;
    let url = '/reporte/' + this.tipo + '/' + this.idSolicitud;
    this.descargaImprimeService.downloadFile(url, this.fileName);
  }

}
