import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-seccion-ayuda',
  templateUrl: './seccion-ayuda.component.html'
})
export class SeccionAyudaComponent extends BaseComponent implements OnInit {

  constructor(protected data: DataService) {
    super(data);
   }

  ngOnInit() {
  }

  irAyuda() {
    window.open('http://www.imss.gob.mx/derechoH/prestamo-pensionados', '_blank');
  }

}
