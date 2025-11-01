import { Component, OnInit, Input } from '@angular/core';
import { Documento } from '../../common/domain/documento';
import { Model } from 'src/app/model';
import { DataService } from "../../data.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoService } from '../../common/services/documento.service';
import { BaseComponent } from 'src/app/common/base.component';
import { DescargaImprimeService } from 'src/app/common/descarga-imprime/descarga.imprime.service';


@Component({
  selector: 'app-reinstalar-prestamo-carta',
  templateUrl: './reinstalar-prestamo-carta.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class ReinstalarPrestamoCartaComponent extends BaseComponent implements OnInit {
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
    this.rol = 'operadorEF';
    this.documento = this.model.documento;
//    this.ruta = "cartaInstruccionFront";
//    this.tipo = "reporteCartaReinstalacion";  
    this.idSolicitud = this.model.documento.cveSolicitud;
    this.fileName = "ReporteCartaReinstalacion";  
    this.model.mensajeAux.level="success";
    this.model.mensajeAux.mensaje="La Carta de Reinstalación ha sido generada con éxito.";
  }

  finalizar(){
    this.router.navigate(['/operadorEF/home']);
  }

  downloadFile(){
    //let url = '/'+this.ruta+'/webresources/'+this.tipo+'/'+this.idSolicitud;
    //let url = '/cartaInstruccionFront/webresources/reporteCartaReinstalacion/'+this.idSolicitud;
    let url = '/reporte/carta-reinstalacion/'+this.idSolicitud;
    this.descargaImprimeService.downloadFile(url,this.fileName+'.pdf');
  }
  
}
