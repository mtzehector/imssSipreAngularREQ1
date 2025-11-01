import { Component, OnInit } from '@angular/core';
import { Model } from "../../model";
import { DataService } from "../../data.service";
//import { extend } from 'webdriver-js-extender';
import { BaseComponent } from 'src/app/common/base.component';
import { AutorizarService } from '../../common/services/autorizar.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { ActivatedRoute, Router } from '@angular/router';
//import { Solicitud } from 'src/app/common/domain/solicitud';
import { ModalService } from 'src/app/common/modal-Services';



@Component({
  selector: 'app-elegir-carta-autorizar',
  templateUrl: './elegir.carta.autorizar.component.html'
})
export class ElegirCartaAutorizarComponent extends BaseComponent implements OnInit {

  model: Model;
  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private autorizarService: AutorizarService,
    private modalService: ModalService) {
    super(data);
  }

  ngOnInit() {
    this.model = this.data.model;
  }


  cartaInstruccion() {
    this.modalService.open("carga");
    this.autorizarService.getCartaInstruccion(this.model.informeCartaInstruccion)
      .subscribe(
        (response: CartaInstruccion) => {
          if (response != null)
            this.obtencionCartaInstruccion(response);
        }
      );
  }

  obtencionCartaInstruccion(response: CartaInstruccion) {
    this.data.model.informeCartaInstruccion = { ...response }
    //console.log("Carta de Libranza ", response);
    //console.log(".-.-.-.-.-.-.", this.data.model);
    this.modalService.close("carga");
    this.router.navigate(['/operadorEF/prestamoAutorizar', {}]);
  }

}