import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-consultar-notificacion',
  templateUrl: './consultar-notificacion.component.html',
  styleUrls: ['./consultar-notificacion.component.css']
})
export class ConsultarNotificacionComponent extends BaseComponent implements OnInit {

  rol: string;
  mensajeExito: Mensaje = new Mensaje();
  idEntidadFinanciera: string;

  constructor(protected data: DataService, private route: ActivatedRoute,) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {

    this.rol = this.model.rol
    this.idEntidadFinanciera = this.model.entidadFinanciera.id;

  }

}
