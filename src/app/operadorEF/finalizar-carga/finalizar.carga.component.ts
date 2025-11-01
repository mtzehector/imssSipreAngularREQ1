import { Component, OnInit, Inject } from '@angular/core';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute } from '@angular/router';
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { BaseComponent } from 'src/app/common/base.component';

@Component({
  selector: 'app-finalizar-carga',
  templateUrl: './finalizar.carga.component.html',
})
export class FinalizarCargaComponent extends BaseComponent implements OnInit {


  constructor(protected data: DataService, private route: ActivatedRoute,
    private mensajeService: MensajeService) {
    super(data);
  }

  ngOnInit() {
    this.model = this.data.model;
    this.model.mensaje.level = "success";


    this.mensajeService.getMessage("MSG020").subscribe((mensaje: Mensaje) => 
    this.model.mensaje.mensaje = mensaje.mensaje);
this.model.mensaje.level="success";
    this.data.model.mensaje = { mensaje: this.data.model.mensaje.mensaje, id: "", level: "" };
  }


}
