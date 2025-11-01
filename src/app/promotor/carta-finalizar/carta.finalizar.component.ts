import { Component, OnInit, Inject } from '@angular/core';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute } from '@angular/router';
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from 'src/app/model';

@Component({
  selector: 'app-carta-finalizar',
  templateUrl: './carta.finalizar.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class CartaFinalizarComponent extends BaseComponent implements OnInit {

  rol: string;
  model: Model;

  constructor(protected data: DataService, private route: ActivatedRoute,
    private mensajeService: MensajeService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "promotor";
    this.model.mensaje.level = 'success';
    this.model.mensaje.mensaje = 'Se ha enviado exitosamente la Carta de Libranza al correo del pensionado y la Entidad Financiera.';
  }


}
