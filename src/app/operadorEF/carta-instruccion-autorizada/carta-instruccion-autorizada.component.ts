import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carta-instruccion-autorizada',
  templateUrl: './carta-instruccion-autorizada.component.html',
  styleUrls: ['./carta-instruccion-autorizada.component.css']
})
export class CartaInstruccionAutorizadaComponent implements OnInit {
  rol: string;
  constructor() { }

  ngOnInit() {
    this.rol = "operadorEF";
  }

}
