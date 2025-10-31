import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { AutorizarService } from '../../common/services/autorizar.service';
import { Documento } from '../../common/domain/documento';
import { TipoDocumento } from '../../common/domain/tipo.documento';
import { Solicitud } from 'src/app/common/domain/solicitud';


@Component({
  selector: 'app-autorizar-documento',
  templateUrl: './autorizar.documento.component.html'
})

export class AutorizarDocumentoComponent extends BaseComponent implements OnInit {


  cartaInstruccion: Documento;
  contratoCredito: Documento;
  identificacionOficial: Documento;
  tablaAmortizacion: Documento;
  model: Model;
  rol: string;
  solicitud: Solicitud;


  constructor(protected data: DataService, private route: ActivatedRoute) {
    super(data);
  }

  ngOnInit() {
    this.rol = "operadorEF";

    this.model = this.data.model;
    this.solicitud = this.data.model.informeCartaInstruccion.solicitud;
    this.cartaInstruccion = new Documento();
    this.cartaInstruccion.tipoDocumentoEnum = (this.solicitud.cveOrigenSolicitud.id == 5)? TipoDocumento.CARTA_REINSTALACION : TipoDocumento.CARTA_INSTRUCCION;
    //this.cartaInstruccion.tipoDocumentoEnum = TipoDocumento.CARTA_INSTRUCCION;

    this.identificacionOficial = new Documento();
    this.identificacionOficial.tipoDocumentoEnum = TipoDocumento.IDENTIFICACION_OFICIAL;

    this.contratoCredito = new Documento();
    this.contratoCredito.tipoDocumentoEnum = TipoDocumento.CONTRATO;

    this.tablaAmortizacion = new Documento();
    this.tablaAmortizacion.tipoDocumentoEnum = TipoDocumento.TABLA_DE_AMORTIZACION_DE_CREDITO;

    //console.log(this.model.informeCartaInstruccion.solicitud.id)

    // Validar si ya existen los doctos
    //this.cartaInstruccion.id = 673;
    /* if(this.model.informeCartaInstruccion.solicitud.id!== undefined 
     && this.model.informeCartaInstruccion.solicitud.id !== 0 )
     {
      this.cartaInstruccion.id=this.model.informeCartaInstruccion.solicitud.id;
     }*/


  }




}
