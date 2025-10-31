import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { Documento } from '../../common/domain/documento';
import { TipoDocumento } from '../../common/domain/tipo.documento';
import { PrestamoAutorizado } from '../../common/domain/prestamo.autorizado';


@Component({
  selector: 'app-cargar-comprobante',
  templateUrl: './cargar.comprobante.component.html'
})

export class CargarComprobanteComponent extends BaseComponent implements OnInit {

  cepPensionado : Documento;
  model:Model;

  constructor(protected data: DataService, private route: ActivatedRoute ) {
    super(data);
   }

   ngOnInit() { 
    this.model = this.data.model;
    this.cepPensionado = new Documento();
    this.cepPensionado.tipoDocumentoEnum = TipoDocumento.CEP_PENSIONADO;
   }

   
  

}
