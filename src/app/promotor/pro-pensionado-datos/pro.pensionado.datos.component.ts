// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from 'src/app/common/base.component';
import { Pensionado } from 'src/app/common/domain/pensionado';
import { Persona } from 'src/app/common/persona';


@Component({
  selector: 'app-pro-pensionado-datos',
  templateUrl: './pro.pensionado.datos.component.html'
})
export class ProPensionadoDatosComponent extends BaseComponent implements OnInit {
  
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
