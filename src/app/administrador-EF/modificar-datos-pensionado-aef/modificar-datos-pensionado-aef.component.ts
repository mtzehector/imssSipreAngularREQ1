import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';

@Component({
  selector: 'app-modificar-datos-pensionado-aef',
  templateUrl: './modificar-datos-pensionado-aef.component.html',
  styles: []
})
export class ModificarDatosPensionadoAefComponent extends BaseComponent implements OnInit {

  rol: string;

  ngOnInit() {
    this.rol = 'adminEF';
  }

}
