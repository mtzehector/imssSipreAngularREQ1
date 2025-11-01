import { Component, OnInit } from '@angular/core';
import { Model } from 'src/app/model';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute } from '@angular/router';
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { BaseComponent } from 'src/app/common/base.component';
import {BitacoraService} from 'src/app/common/services/bitacora.service';
import {Bitacora} from 'src/app/common/domain/bitacora';
import {TipoBitacora} from 'src/app/common/domain/tipo.bitacora';
import {EstadoSolicitud} from 'src/app/common/domain/estado.solicitud';

@Component({
  selector: 'app-capacidad-resumen',
  templateUrl: './capacidad-resumen.component.html',
})
export class CapacidadResumenComponent extends BaseComponent implements  OnInit {


  model: Model;

  constructor(protected data: DataService, 
    private route: ActivatedRoute,
    private  mensajeService : MensajeService,
    private bitacoraService:BitacoraService ) { 
    super(data);
  }

   ngOnInit() { 
    this.model = this.data.model;
    this.model.mensaje.level = "success";
    let bitacora : Bitacora = new Bitacora();
    bitacora.curp = this.data.model.pensionado.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.GENERAR_CARTA_CAPACIDAD_CREDITO;
    bitacora.idSolicitud = this.data.model.cartaCapacidadCredito.solicitud.id;
    bitacora.estadoSolicitud = EstadoSolicitud.INICIADO;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log('') );

    this.mensajeService.getMessage("MSG301").subscribe((mensaje : Mensaje) => this.model.mensaje.mensaje = mensaje.mensaje );
     
     this.data.model.mensaje = {mensaje:this.data.model.mensaje.mensaje, id:"", level:""};
   }
  

}
