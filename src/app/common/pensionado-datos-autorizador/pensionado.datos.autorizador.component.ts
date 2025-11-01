// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from '../base.component';
import { Persona } from '../persona';
import { Pensionado } from '../domain/pensionado';


@Component({
  selector: 'app-pensionado-datos-autorizador',
  templateUrl: './pensionado.datos.autorizador.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class PensionadoDatosAutorizarComponent extends BaseComponent implements OnInit {

  persona: Persona;
  pensionado: Pensionado;
  model: Model;

  constructor(protected data: DataService, private route: ActivatedRoute) {
    super(data);
    
  }

  ngOnInit() {

  }

}
