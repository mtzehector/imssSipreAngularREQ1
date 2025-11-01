import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/common/services';

@Component({
  selector: 'app-modificar-datos-pensionado-ef',
  templateUrl: './modificar-datos-pensionado-ef.component.html',
  styles: []
})
export class ModificarDatosPensionadoEfComponent extends BaseComponent implements OnInit {

  rol: string;

  constructor(public router: Router,
    protected data: DataService
  ) {
    super(data);
    this.model = data.model;
  }

  ngOnInit() {
    this.rol = "operadorEF";
   }

}
