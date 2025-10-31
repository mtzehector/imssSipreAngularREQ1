import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulacion-busqueda-descuento',
  templateUrl: './simulacion.busqueda.descuento.component.html',
})
export class SimulacionBusquedaDescuentoComponent implements OnInit {
rol: string;
  constructor() { }

  ngOnInit() {
    this.rol = 'pensionado'
  }

}
