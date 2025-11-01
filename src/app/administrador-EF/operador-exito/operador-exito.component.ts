import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../../app/auth/auth.service';
import { OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService, ModalService} from 'src/app/common/services';
import { BaseComponent } from 'src/app/common/base.component';

@Component({
  selector: 'app-operador-exito',
  templateUrl: './operador-exito.component.html',
  styleUrls: ['./operador-exito.component.css']
})
export class OperadorExitoComponent extends BaseComponent implements OnInit {
  rol: String;

  constructor(public authService: AuthService,
    protected data: DataService,
    public router: Router,
    private modalService: ModalService) {
    super(data);

  }
  ngAfterViewInit() {
    this.openModalAtencion();
  }
  ngOnInit() {
    //console.log("init del componente");
    this.rol = "adminEF";
    this.data.model.mensaje.mensaje = 'El registro se ha realizado con éxito.';
    this.data.model.mensaje.level = 'success';
  }

  closeModalAtencion() {
    this.modalService.close("atencion");
  }

  openModalAtencion() {
    this.modalService.open("atencion");
  }

}
