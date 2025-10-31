import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-conciliacion',
  templateUrl: './detalle-conciliacion.component.html',
  styleUrls: ['./detalle-conciliacion.component.css']
})
export class DetalleConciliacionComponent implements OnInit {
  
  public rol: string;

  ngOnInit() {
    this.rol = 'adminEFSinConvenio';
  }

}
