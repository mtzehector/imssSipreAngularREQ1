// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from 'src/app/common/base.component';

@Component({
  selector: 'app-pro-datos-simulacion',
  templateUrl: './pro.datos.simulacion.component.html'
})
export class ProDatosSimulacionComponent extends BaseComponent implements OnInit {
  
  constructor(protected data: DataService,private route: ActivatedRoute) { 
    super(data);
  }

  ngOnInit() {

  }
  
}
