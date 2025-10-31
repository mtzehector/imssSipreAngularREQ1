import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carta-recibo',
  templateUrl: './carta-recibo.component.html',
  styleUrls: ['./carta-recibo.component.css']
})
export class CartaReciboComponent implements OnInit {
  public rol: string;
  constructor() { }

  ngOnInit() {
    this.rol = 'adminEFSinConvenio';
  }

}
