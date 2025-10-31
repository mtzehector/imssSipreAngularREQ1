import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { DataService } from 'src/app/common/services';

@Component({
  selector: 'app-buscar-folio-detalle',
  templateUrl: './buscar-folio-detalle.component.html',
  styleUrls: ['./buscar-folio-detalle.component.css']
})
export class BuscarFolioDetalleComponent extends BaseComponent implements OnInit {

  mensajeEstado: Mensaje = new Mensaje();
  rol: string;
  
  constructor(protected data: DataService) {
              super(data);
   }

   ngOnInit() {
    this.mensajeEstado.mensaje = "";
    this.mensajeEstado.level = "";
    this.rol = "operadorIMSS";
   }


}
