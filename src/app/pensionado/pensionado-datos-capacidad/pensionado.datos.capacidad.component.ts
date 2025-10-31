// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from 'src/app/common/base.component';
import { Persona } from 'src/app/common/persona';
import { Pensionado } from 'src/app/common/domain/pensionado';


@Component({
  selector: 'app-pensionado-datos-capacidad',
  templateUrl: './pensionado.datos.capacidad.component.html'
})
export class PensionadoDatosCapacidadComponent extends BaseComponent implements OnInit {
  
  persona : Persona;
  pensionado : Pensionado;

  constructor(protected data: DataService, private route: ActivatedRoute) {
    super(data);
   }

  ngOnInit() {
    this.persona =this.model.persona;
    this.pensionado = this.model.pensionado;  
  }
  
}
