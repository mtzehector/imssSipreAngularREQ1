import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {  ModalService, RegistrarEntidadFinancieraService, RegistrarNotificacionService, CatalogoService, DataService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Item} from '../../components-ux/modelo/item';
import { Mensaje } from 'src/app/common/domain';
import { BaseComponent } from 'src/app/common/base.component';

@Component({
  selector: 'app-consultar-notificacion',
  templateUrl: './consultar-notificacion.component.html',
  styleUrls: ['./consultar-notificacion.component.css']
})
export class ConsultarNotificacionComponent extends BaseComponent implements OnInit {

  rol: string;
  mensajeExito: Mensaje = new Mensaje();

  constructor(protected data: DataService, private route: ActivatedRoute,) { 
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
     if(this.model.flagNotMsj){
       this.mensajeExito.mensaje = "La notificación se ha guardado con éxito, con el folio "+ this.model.folioNotificacion;
       this.mensajeExito.level = "success";
     }else if(this.model.flagAtencionNot){
       this.mensajeExito.mensaje = "El folio " + this.model.folioNotificacion + " ha sido actualizado con éxito.";
       this.mensajeExito.level = "success";
     }else{
       this.mensajeExito.mensaje = "";
       this.mensajeExito.mensaje = "";
     }
    // this.route.queryParams.subscribe(params => {
    //   console.log(">>>>>>>>>>>>>><", params.accion, params.status); // { order: "popular" }
    //   if (params.accion == "montoLiquidar" && params.status == "success") {
    //     this.data.model.mensaje.level = "success";
    //     this.data.model.mensaje.mensaje = "El monto a liquidar ha sido validado con éxito.";
    //   }
    // }
    // );
     this.rol = "operadorIMSS" 
  }

}