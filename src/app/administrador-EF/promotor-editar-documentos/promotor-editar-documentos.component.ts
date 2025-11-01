import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from "../../data.service";
import { Model } from "src/app/model";
import { Documento, TipoDocumento } from 'src/app/common/domain';


@Component({
  selector: 'app-promotor-editar-documentos',
  templateUrl: './promotor-editar-documentos.component.html',
  styleUrls: []
})
export class PromotorEditarDocumentosComponent extends BaseComponent implements OnInit {

  public model: Model;
  ife: Documento;
  cartaResponsiva: Documento;
  fotografia: Documento;
  comprobanteDomicilio: Documento;

  constructor(protected data: DataService, public location: Location) {
    super(data);
    this.model = this.data.model;
  }


  ngOnInit() {
    if (this.model.registrarPromotor.ife === null || this.model.registrarPromotor.ife === undefined) {
      this.model.registrarPromotor.ife = new Documento();
      this.model.registrarPromotor.cartaResponsiva = new Documento();
      this.model.registrarPromotor.fotografia = new Documento();
      this.model.registrarPromotor.comprobanteDomicilio = new Documento();

    }
    this.model.registrarPromotor.ife.tipoDocumentoEnum = TipoDocumento.IDENTIFICACION_OFICIAL;
    this.model.registrarPromotor.cartaResponsiva.tipoDocumentoEnum = TipoDocumento.CARTA_RESPONSIVA;
    this.model.registrarPromotor.fotografia.tipoDocumentoEnum = TipoDocumento.FOTOGRAFIA;
    this.model.registrarPromotor.fotografia.tipoDocumento = TipoDocumento.FOTOGRAFIA.id;
    if (this.model.registrarPromotor.comprobanteDomicilio != null) {
      this.model.registrarPromotor.comprobanteDomicilio.tipoDocumentoEnum = TipoDocumento.COMPROBANTE_DE_DOMICILIO;
    }

  }

}
