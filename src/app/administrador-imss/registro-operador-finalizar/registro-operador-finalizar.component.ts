import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataService, ModalService, RegistrarEntidadFinancieraService, RegistrarNotificacionService, CatalogoService } from 'src/app/common/services';
import { Router, NavigationExtras } from '@angular/router';
import { Model } from "src/app/model";
import { BaseComponent } from 'src/app/common/base.component';

@Component({
  selector: 'app-registro-operador-finalizar',
  templateUrl: './registro-operador-finalizar.component.html',
  styleUrls: ['./registro-operador-finalizar.component.css']
})
export class RegistroOperadorFinalizarComponent extends BaseComponent implements OnInit {
  rol: string;
  
  constructor(protected data: DataService,
    public router: Router,
    private formBuilder: FormBuilder,
    private modalService: ModalService,

  ) {
    super(data);
    this.model = this.data.model;
   }

  ngOnInit() {
    //console.log("init del componente");
    this.rol = "adminEF";

  }

  finalizar() {
    this.router.navigate(['/administradorIMSS/home', {}]);
  }
  ngAfterViewInit() {
    this.openModalAtencion();
  }


  closeModalAtencion() {
    this.modalService.close("atencion");
  }

  openModalAtencion() {
    this.modalService.open("atencion");
  }
}
