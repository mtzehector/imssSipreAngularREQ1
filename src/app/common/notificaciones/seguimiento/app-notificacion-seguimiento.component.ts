import { Component, OnInit } from '@angular/core';
import { Model } from 'src/app/model';
import { BaseComponent } from 'src/app/common/base.component';
import { DetalleConsultaNotificacion } from '../model/detalle.consulta.notificacion';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-notificacion-seguimiento',
  templateUrl: './app-notificacion-seguimiento.component.html',
  styleUrls: ['../../../common/css/tarjetas-estilos-base.css']
})
export class AppNotificacionSeguimiento extends BaseComponent implements OnInit {
  notificacionDetalle: DetalleConsultaNotificacion;
  model: Model;
  rol: string;

  constructor(protected data: DataService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = this.data.model.rol;
    this.cargaDatos();
  }

  cargaDatos() {
    this.notificacionDetalle = this.model.notificacionVerDetalle;
    this.notificacionDetalle.notificacion.setBitacora.sort((a, b) => a.id - b.id);
  }

}
