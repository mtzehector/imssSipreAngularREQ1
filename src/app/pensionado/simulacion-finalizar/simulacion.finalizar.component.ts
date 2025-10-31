import { Component, OnInit, Inject } from '@angular/core';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { DataService } from 'src/app/data.service';
import { Router, NavigationEnd } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { Model } from 'src/app/model';
import { HttpClient } from '@angular/common/http';
import {BitacoraService} from 'src/app/common/services/bitacora.service';
import {TipoBitacora} from 'src/app/common/domain/tipo.bitacora';
import {Bitacora} from 'src/app/common/domain/bitacora';
// Declaramos las variables para jQuery
declare var jQuery: any;

declare var $: any;

@Component({
  selector: 'app-simulacion-finalizar',
  templateUrl: './simulacion.finalizar.component.html',
  styleUrls: ['./simulacion.finalizar.component.css']
})
export class SimulacionFinalizarComponent implements OnInit {

  model : Model;

  constructor(
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private  mensajeService : MensajeService,
    private bitacoraService: BitacoraService ) {
      // override the route reuse strategy
     // tslint:disable-next-line: only-arrow-functions

    }

   ngOnInit() {

   this.model = this.data.model;






    this.mensajeService.getMessage('MSG303').subscribe((mensaje : Mensaje) => this.setMensaje(mensaje));
   }

   setMensaje(mensaje: Mensaje)
   {
      this.model.mensaje.mensaje = 'Has finalizado con éxito la simulación para solicitar un Préstamo a una Entidad Financiera.';
      this.model.mensaje.level = 'success';
   }
   

}
