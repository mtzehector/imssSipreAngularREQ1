import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from "../../../data.service";
import { Model } from "src/app/model";
import { Documento, TipoDocumento } from '../../../common/domain';

@Component({
  selector: 'app-carga-documento',
  templateUrl: './carga-documento.component.html',
  styleUrls: []
})
export class CargaDocumentoComponent  extends BaseComponent implements OnInit {
  
  public model: Model;
  ife : Documento;

  constructor(protected data: DataService, public location: Location) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    if ( this.model.operador.documentoIdentOficial === undefined) {
      this.model.operador.documentoIdentOficial = new Documento();
      this.model.operador.documentoIdentOficial.tipoDocumentoEnum = TipoDocumento.IDENTIFICACION_OFICIAL;  
    }
  }

}
