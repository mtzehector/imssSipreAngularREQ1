import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { ResumenSimulacionService } from 'src/app/common/services/resumen.simulacion.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { DataService } from 'src/app/data.service';
import { Model } from 'src/app/model';
import { BuscarFolioImssService } from 'src/app/common/services/buscar.folio.imss.service';
import { Page } from 'src/app/common/domain/page';
import { Oferta } from 'src/app/common/domain/oferta';
import { PageRequest } from 'src/app/common/domain/page.request';
import { OfertaRequest } from 'src/app/common/domain/oferta.request';
import { BuscarFolioImss } from 'src/app/common/domain/buscar.folio.imss';
import { BuscarFolioImssRequest } from 'src/app/common/domain/buscar.folio.imss.request';
import { ModalService } from 'src/app/common/modal-Services';

@Component({
  selector: 'app-buscar-folio-imss',
  templateUrl: './buscar.folio.imss.component.html'
})
export class BuscarFolioImssComponent extends BaseComponent implements OnInit {
  model:Model; 
  pageOfertas : Page<BuscarFolioImss> = new Page<BuscarFolioImss>();
  buscarFolioImssRequest : BuscarFolioImssRequest = new BuscarFolioImssRequest();
  buscarFolioImss:BuscarFolioImss=new BuscarFolioImss();
  nss : string ="";
  folio:string="";
  idOferta :number = 0;
  rol :string;

  buscarFolioImssRequestt = new BuscarFolioImssRequest();

  constructor(protected data: DataService, 
              private route: ActivatedRoute, 
              private router:Router, 
              private buscarFolioImssService : BuscarFolioImssService,
              private modalService: ModalService) {
    super(data);
   }

   ngOnInit() {     
    this.buscarFolioImssRequest.page = 1;
    this.rol="operadorIMSS";

   }

  
  onPaged( page : number){
    
    //console.log("Cambiando a pagina:" + page);
    this.buscarFolioImssRequest.page = page;
    this.modalService.open("carga");
    this.buscarFolioImssService.getbuscarFolio(this.buscarFolioImssRequest)
    .subscribe((response:Page<BuscarFolioImss>) => this.validarFolio(response));   
    this.pageOfertas.number = page-1;
    this.pageOfertas.prepare();
  }
   buscarFolio(){
 
      this.pageOfertas  = new Page<BuscarFolioImss>();
      //console.log("nss.-.-.-",this.nss);
      this.modalService.open("carga");
      this.buscarFolioImssRequest.model.nss=this.nss;
      this.buscarFolioImssRequest.model.folio=this.folio;
      this.buscarFolioImssService.getbuscarFolio(this.buscarFolioImssRequest)
      .subscribe((response:Page<BuscarFolioImss>) => this.validarFolio(response));       
    //console.log("buscarFolio",this.buscarFolioImssRequest)
   }

   validarFolio(response:Page<BuscarFolioImss>){
    this.modalService.close("carga");
    this.data.model.mensaje.mensaje="";
    this.data.model.mensaje.level="";
    this.pageOfertas = new Page<BuscarFolioImss>();
    this.pageOfertas.init(response);   
   }
   regresar(){
    this.router.navigate(['/operadorIMSS/home', {}]);
  }




   

}

