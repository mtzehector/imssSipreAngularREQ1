import { Component, OnInit, Input } from '@angular/core';
import { Documento } from '../../common/domain/documento';
import { Model } from 'src/app/model';
import { DataService } from "../../data.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoService } from '../../common/services/documento.service';
import { BaseComponent } from 'src/app/common/base.component';
import { DescargaImprimeService } from 'src/app/common/descarga-imprime/descarga.imprime.service';


@Component({
  selector: 'app-registrar-prestamo-carta',
  templateUrl: './registrar-prestamo-carta.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class RegistrarPrestamoCartaComponent extends BaseComponent implements OnInit {
  rol: String;
  documento: Documento;
  model: Model;
//  ruta : string;
  idSolicitud : string;
//  tipo: string;
  fileName: string

  constructor(protected data: DataService, 
              private route: ActivatedRoute, 
              private documentoService: DocumentoService,
              private descargaImprimeService:  DescargaImprimeService,
              private router: Router) { 
                super(data);
                this.model = this.data.model;
              }

  ngOnInit() {
    this.rol="promotor";
    this.documento = this.model.documento;
//    this.ruta = "cartaInstruccionFront";
//    this.tipo = "reporteResumenCartaInstruccion";  
    this.idSolicitud = this.model.documento.cveSolicitud;
    this.fileName = "ReporteResumenCartaLibranza";  
    this.model.mensajeAux.level="success";
    this.model.mensajeAux.mensaje="La Carta de Libranza ha sido generada con éxito.";
    //console.log(">>>Documento: ", JSON.stringify(this.documento));
    //console.log(">>>Solicitud: ", this.idSolicitud);
  }

  finalizar(){
    this.router.navigate(['/promotor/home']);
  }

  downloadFile(){
    //let url = '/'+this.ruta+'/webresources/'+this.tipo+'/'+this.idSolicitud;
    //let url = '/cartaInstruccionFront/webresources/reporteResumenCartaInstruccion/'+this.idSolicitud;
    let url = '/reporte/carta-instruccion/' + this.idSolicitud;
    this.descargaImprimeService.downloadFile(url,this.fileName+'.pdf');
  }
  
}
