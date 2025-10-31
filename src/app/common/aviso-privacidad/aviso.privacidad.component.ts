import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from "../../data.service";
import { MensajeService } from "../services/mensaje.service";
import { Mensaje } from "../domain/mensaje";
import {BaseComponent} from 'src/app/common/base.component';

@Component({
  selector: 'app-aviso-privacidad',
  templateUrl: './aviso.privacidad.component.html'
})
export class AvisoPrivacidadComponent extends BaseComponent  implements OnInit {
  
  mensaje1 : string;
  constructor(protected data: DataService, private route: ActivatedRoute, private mensajeService:MensajeService) {
    super(data);  
  }

  ngOnInit() {    
    //this.mensajeService.getMessage("MSG300").subscribe((mensaje: Mensaje) => this.mensaje1 = mensaje.mensaje);    
  }
  
}
