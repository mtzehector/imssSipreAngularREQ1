import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { Mensaje } from 'src/app/common/domain/mensaje';
import { MensajeService } from 'src/app/common/services/mensaje.service';
import {BaseComponent} from 'src/app/common/base.component';

@Component({
  selector: 'app-capacidad-credito',
  templateUrl: './capacidad.credito.component.html'
})
export class CapacidadCreditoComponent extends BaseComponent implements OnInit {
  
  mensaje1 : Mensaje = new Mensaje();
  mensaje2 : Mensaje = new Mensaje();

  constructor(protected data: DataService, private mensajeService: MensajeService) {
    super(data);
  }

  ngOnInit() {
    this.mensaje1.level = "info";
    this.mensaje2.level = "info";    
    this.mensajeService.getMessage("MSG304").subscribe((mensaje: Mensaje) => this.mensaje1.mensaje = mensaje.mensaje);
    this.mensajeService.getMessage("MSG302").subscribe((mensaje: Mensaje) => this.mensaje2.mensaje = mensaje.mensaje);
  }

}
