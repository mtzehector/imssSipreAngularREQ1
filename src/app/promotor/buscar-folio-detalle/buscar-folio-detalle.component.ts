import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from '../../data.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { PersonaEF } from 'src/app/common/domain';

@Component({
    templateUrl: './buscar-folio-detalle.component.html'
  })
export class BuscarFolioDetalleComponent extends BaseComponent implements OnInit {


  mensajeEstado: Mensaje = new Mensaje();
  rol: string;
  personaEf: PersonaEF;

  constructor(protected data: DataService) {
              super(data);
   }

   ngOnInit() {
    this.mensajeEstado.mensaje = "";
    this.mensajeEstado.level = "";
    this.rol = "promotor";
    this.personaEf = this.model.personaEF;
   }

}