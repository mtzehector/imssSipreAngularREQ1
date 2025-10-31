import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from 'src/app/common/services';

@Component({
  selector: 'app-registrar-comunicado',
  templateUrl: './registrar-comunicado.component.html',
  styleUrls: ['./registrar-comunicado.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class RegistrarComunicadoComponent extends BaseComponent implements OnInit {

  rol: string;

  constructor(protected data: DataService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = this.model.rol;
  }

}
