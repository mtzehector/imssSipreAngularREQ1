// TODO: Feature Componetized like CrisisCenter
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { Documento } from '../../common/domain/documento';
import { DocumentoService } from '../../common/services/documento.service';
import { BaseComponent } from '../../common/base.component';
import { DescargaImprimeService } from 'src/app/common/descarga-imprime/descarga.imprime.service';


@Component({
  selector: 'app-descarga-imprime-promotor',
  templateUrl: './descarga.imprime.promotor.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class DescargaImprimePromotorComponent extends BaseComponent implements OnInit {
  
  documento:Documento;
  model: Model;

  @Input() tipo : string;

  //ruta : string;

  fileName : string;
  
  @Input() idSolicitud : number;

  constructor(protected data: DataService, private route: ActivatedRoute, private documentoService:DocumentoService, private descargaImprimeService: DescargaImprimeService) {
    super(data);
   }

  ngOnInit() {
    this.model = this.data.model;
    this.documento = this.model.documento;

    switch(this.tipo){
      case "reporteResumenCartaInstruccion":{
        //this.ruta = "cartaInstruccionFront";
        this.fileName = "ReporteResumenCartaDeLibranza"
        break;
      }
      default:{
        break;
      }
      
    }
  

        
  // this.documentoService.getDocumento(this.model.documento).subscribe((documento : Documento) => this.data.model.documento = {...documento} );
     
   //this.data.model.documento = {numFolioSolicitud: this.data.model.documento.numFolioSolicitud,cveSolicitud:this.data.model.documento.cveSolicitud, refDocumento:this.data.model.documento.refDocumento, id:this.data.model.documento.id};
   
  }


  
  downloadFile(){
    //let url = '/'+this.ruta+'/webresources/'+this.tipo+'/'+this.idSolicitud;
    //let url = '/cartaInstruccionFront/webresources/'+this.tipo+'/'+this.idSolicitud;
    let url = '/reporte/'+this.tipo+'/'+this.idSolicitud;
    this.descargaImprimeService.downloadFile(url,this.fileName+'.pdf');
  }

  downloadFileXML(){
    //let url = '/'+this.ruta+'/webresources/'+this.tipo+'/xml/'+this.idSolicitud;
    let url = '/reporte/'+this.tipo+'/xml/'+this.idSolicitud;
    this.descargaImprimeService.downloadFile(url,this.fileName+'.xml');
  }

  descargaImprimi(documento:Documento){
    
  }
   
}
