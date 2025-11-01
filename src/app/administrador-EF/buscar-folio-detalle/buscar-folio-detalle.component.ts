import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from '../../data.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { EntidadFinanciera, PersonaEF } from 'src/app/common/domain';

@Component({
  templateUrl: './buscar-folio-detalle.component.html'
})
export class BuscarFolioDetalleComponent extends BaseComponent implements OnInit {

  mensajeEstado: Mensaje = new Mensaje();
  rol: string;
  entidadFinanciera: EntidadFinanciera;

  constructor(protected data: DataService) {
    super(data);
    this.model = this.data.model;
}

  ngOnInit() {
    this.mensajeEstado.mensaje = "";
    this.mensajeEstado.level = "";
    this.rol = "adminEF";
    this.data.model.rol = "adminEF";
    this.entidadFinanciera = this.model.entidadFinanciera;
   }

}
