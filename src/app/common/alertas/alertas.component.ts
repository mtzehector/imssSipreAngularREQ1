// TODO: Feature Componetized like CrisisCenter
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { MensajeService } from "../services/mensaje.service";
import { Mensaje } from "../domain/mensaje";



@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent  {
  

  
  @Input()
  mensaje : Mensaje;  



  
}
