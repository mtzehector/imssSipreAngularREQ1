import { Component, OnInit } from '@angular/core';
import { DetalleConsultaNotificacion } from '../../common/notificaciones/model/detalle.consulta.notificacion';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from 'src/app/model';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from "../../data.service";

@Component({
  selector: 'app-consultar-notificacion-detalle',
  templateUrl: './consultar-notificacion-detalle.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css', './consultar-notificacion-detalle.component.css']
})
export class ConsultarNotificacionDetalleComponent extends BaseComponent implements OnInit {
  model: Model;
  rol: string;
  flagAtencion: boolean;
  showAtencion: boolean;
  constructor(private router: Router,
    protected data: DataService) {
    super(data);
    this.model = this.data.model;
  } 

  ngOnInit() {
    this.rol=this.data.model.rol;
    this.showAtencion = false;
    this.flagAtencion = false;
    this.validarEstadoNotificacion();
  }

  validarEstadoNotificacion(){
      switch(this.model.notificacionVerDetalle.notificacion.estadoNotificacion.id){
        case 1://Registrada
        case 4://Rechazada
          this.flagAtencion = true;
          break;
        default:
          this.flagAtencion = false;
          break;    
      }
  }

  regresar() {
    this.model.flagAtencionNot = false;
    this.model.flagNotMsj = false;
     this.router.navigate(['/operadorEF/consultarNotificacion', {}]);
  }
  
  atender(){
    this.showAtencion = true;
  }

}
