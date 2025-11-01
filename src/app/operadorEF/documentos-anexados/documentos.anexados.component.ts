import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { TipoDocumento } from '../../common/domain/tipo.documento';
import { Documento } from '../../common/domain/documento';


@Component({
  selector: 'app-documentos-anexados',
  templateUrl: './documentos.anexados.component.html'
})

export class DocumentosAnexadosComponent extends BaseComponent implements OnInit {

  
  cartaInstruccion : Documento;
  contratoCredito : Documento;
  identificacionOficial : Documento;
  tablaAmortizacion : Documento;
  model:Model;
  rol:string;

  constructor(protected data: DataService, private route: ActivatedRoute ) {
    super(data);
   }

   ngOnInit() { 
    
   
    this.model = this.data.model;
    this.cartaInstruccion = new Documento();
    this.cartaInstruccion.tipoDocumentoEnum = TipoDocumento.CARTA_INSTRUCCION;

    this.identificacionOficial = new Documento();
    this.identificacionOficial.tipoDocumentoEnum = TipoDocumento.IDENTIFICACION_OFICIAL;

    this.contratoCredito = new Documento();
    this.contratoCredito.tipoDocumentoEnum = TipoDocumento.CONTRATO;

    this.tablaAmortizacion = new Documento();
    this.tablaAmortizacion.tipoDocumentoEnum = TipoDocumento.TABLA_DE_AMORTIZACION_DE_CREDITO;
    

   }

   
  

}
