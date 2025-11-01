import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from "../../data.service";
import { MensajeService } from "../services/mensaje.service";
import { Mensaje } from "../domain/mensaje";
import {BaseComponent} from 'src/app/common/base.component';

@Component({
  selector: 'app-termino-condiciones',
  templateUrl: './termino.condiciones.component.html'
})
export class TerminoCondicionesComponent extends BaseComponent  implements OnInit {
  
  mensaje1 : string;
  constructor(protected data: DataService, private route: ActivatedRoute, private mensajeService:MensajeService) {
    super(data);  
  }

  ngOnInit() {    
    this.mensajeService.getMessage("MSG307").subscribe((mensaje: Mensaje) => this.mensaje1 = mensaje.mensaje);    
  }
  
}
