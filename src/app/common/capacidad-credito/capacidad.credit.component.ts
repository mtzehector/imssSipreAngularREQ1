// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { CapacidadCredito } from '../domain/capacidad.credito';
import { CapacidadCreditoService } from '../services/capacidad.credito.service';
import { BaseComponent } from '../base.component';
// Declaramos las variables para jQuery
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-capacidad-credit',
  templateUrl: './capacidad.credit.component.html'
})
export class CapacidadCreditComponent extends BaseComponent implements OnInit {

  model: Model;

  constructor(protected data: DataService, private route: ActivatedRoute, private capacidadCreditoService: CapacidadCreditoService) {
    super(data);
  }
  ngOnInit() {

    $('[data-toggle="tooltip"]').tooltip();
/*
    this.capacidadCreditoService.getCapacidadCredito(this.model.pensionado).subscribe((capacidadCredito: CapacidadCredito) => this.data.model.capacidadCredito = { ...capacidadCredito });
    this.data.model.capacidadCredito = {
      impCapacidadFija: this.data.model.capacidadCredito.impCapacidadFija, impCapacidadVariable: this.data.model.capacidadCredito.impCapacidadVariable, impCapacidadTotal: this.data.model.capacidadCredito.impCapacidadTotal,
      cveSolicitud: this.data.model.capacidadCredito.cveSolicitud, tipoCredito:this.model.capacidadCredito.tipoCredito
    };
    */
  }

}
