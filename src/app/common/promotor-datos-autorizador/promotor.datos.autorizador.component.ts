// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { PromotorService } from '../services/promotor.service';
import { PersonaEF } from '../domain/persona.ef';
import { BaseComponent } from '../base.component';
import { Persona } from '../persona';
import { EntidadFinanciera } from '../domain/entidad.financiera';


@Component({
  selector: 'app-promotor-datos-autorizador',
  templateUrl: './promotor.datos.autorizador.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class PromotorDatosAutorizadorComponent extends BaseComponent implements OnInit {

  personaEF: PersonaEF;
  model: Model;
  imgPromotorUrl: string = '';

  constructor(protected data: DataService, private route: ActivatedRoute, private promotorService: PromotorService) {
    super(data);
  }

  ngOnInit() {

    if (this.model.informeCartaInstruccion.promotor.imgB64 == null) {
      this.imgPromotorUrl = '/mclpe/auth/js/assets/img/Vector.png';
    } else {
      this.imgPromotorUrl = 'data:image/png;base64,' + this.model.informeCartaInstruccion.promotor.imgB64;
    }


  }


}


