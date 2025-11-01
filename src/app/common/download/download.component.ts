import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { Documento } from '../domain/documento';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { DescargaImprimeService } from 'src/app/common/descarga-imprime/descarga.imprime.service';


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html'
})
export class DownloadComponent extends BaseComponent implements OnInit {

  @Input()documento : Documento;
  fileName:string;
  @Output() terminaDescarga : EventEmitter<boolean> = new EventEmitter<boolean>(false);
  
  
  constructor(
    protected data: DataService,private descargaImprimeService:  DescargaImprimeService,
    ) {
    super(data);    
    this.model = this.data.model;
  }
    
  
  descargar(){
    //$event.preventDefault();
    console.log(">>>DownloadComponent: ", this.documento );
    this.fileName=this.documento.tipoDocumentoEnum.descripcion;
    let fileType = ".pdf";
    if(this.documento.tipoDocumentoEnum.id === TipoDocumento.CEP_PENSIONADO_XML.id){
      fileType=".xml";
    }
    if(this.documento.tipoDocumentoEnum === TipoDocumento.LOGO){
      fileType=".jpg";
    }
    if(this.documento.tipoDocumentoEnum === TipoDocumento.FOTOGRAFIA){
      fileType=".jpg";
    }
    if(this.documento.tipoDocumentoEnum.id === TipoDocumento.NOTIFICACION_XML.id){
      fileType=".xml";
    }
    if(this.documento.tipoDocumentoEnum === TipoDocumento.REPORTE_CONCILIACION_XLSX){
      fileType = ".xlsx"
    }
    if(this.documento.tipoDocumentoEnum === TipoDocumento.REPORTE_INCONSISTENCIAS_TXT){
      fileType = ".txt"
    }

    if(this.documento.tipoDocumentoEnum === TipoDocumento.REPORTE_DESCU_EMIT_DEL_XLSX){
      fileType = ".xlsx"
    }
    if(this.documento.tipoDocumentoEnum === TipoDocumento.REPORTE_DESCU_EMIT_EF_XLSX){
      fileType = ".xlsx"
    }

    if(this.documento.tipoDocumentoEnum === TipoDocumento.REPORTE_INCONSISTENCIAS_DESCUENTOS_TXT){
      fileType = ".txt"
    }

    if(this.documento.tipoDocumentoEnum === TipoDocumento.REPORTE_INCONSISTENCIAS_PRESTAMOS_TXT){
      fileType = ".txt"
    }
    if(this.documento.tipoDocumentoEnum === TipoDocumento.REPORTE_COMPRAS_CARTERA_EF_XLSX){
      fileType = ".xlsx"
    }

    let url = "/documento/obtener/"+this.documento.id;
    if(this.documento.tipoDocumentoEnum.id === 14 || this.documento.tipoDocumentoEnum.id === 16){
      this.descargaImprimeService.downloadFileNotificacion(url);
    }else{
      this.descargaImprimeService.downloadFile(url,this.fileName+fileType);
    }
    this.terminaDescarga.emit(true);
    
  }

}
