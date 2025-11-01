import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { DataService } from "src/app/data.service";

@Component({
  selector: 'app-consulta-cep-compra',
  templateUrl: './consulta-cep-compra.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class ConsultarCepCompraComponent extends BaseComponent implements OnInit {

  rol: string;

  constructor(protected data: DataService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = this.model.rol;
  }
    
}