import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { NotificacionHome } from 'src/app/common/domain/notificacion.home';
import { SolicitudHome } from 'src/app/common/domain/solicitud.home';
import { NotificacionHomeService } from 'src/app/common/services/notificacion.home.service';
import { SolicitudesHomeService } from 'src/app/common/services/solicitudes.home.service';
import { DataService } from "../../data.service";
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { Mensaje } from 'src/app/common/domain/mensaje';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {
  rol: String;
  solicitudHome: SolicitudHome = new SolicitudHome();
  notificacionHome: NotificacionHome = new NotificacionHome();
  constructor(protected data: DataService,
    private solHomeService: SolicitudesHomeService,
    private router: Router,
    private route: ActivatedRoute,
    private mensajeService: MensajeService,
    private notificacionHomeService: NotificacionHomeService
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "operadorEF";
    this.data.model.rol = "operadorEF";
    this.solicitudHome.cveEntidadFinanciera = Number(this.model.personaEF.cveEntidadFinanciera);
    this.notificacionHome.cveEntidadFinanciera = Number(this.model.personaEF.cveEntidadFinanciera);
    this.solHomeService.getSolicitudesHome(this.solicitudHome).subscribe((response: SolicitudHome) => this.setResponseSolicitudes(response));
    this.notificacionHomeService.getNotificacionesHome(this.notificacionHome).subscribe(response => this.setNotificacionesHome(response));
    this.route.queryParams
      //.filter(params => params.cveSol)
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        if (params.accion == "montoLiq" && params.status == "ok") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "El monto a liquidar ha sido validado con éxito.";
        }
        if (params.accion == "Baja" && params.status == "success") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "El préstamo se ha dado de baja con éxito.";
        }
        if (params.accion == "Suspension" && params.status == "success") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "El préstamo se ha suspendido con éxito.";
        }
        if (params.accion == "Reanudar" && params.status == "success") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "El préstamo se ha sido reanudado con éxito.";
        }
        if (params.accion == "cargaCEP" && params.status == "success") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "El Préstamo fue autorizado con éxito";      
        }
        if (params.accion == "carta" && params.status == "autorizar") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "La Carta de Libranza fue autorizada con éxito. Cuentas con 72 horas para cargar el Comprobante electrónico de pago.";
        }
        if (params.accion == "reinstalacion" && params.status == "autorizar") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "Se ha autorizado exitosamente el préstamo reinstalado";
        }
        if (params.accion == "regPrestamo" && params.status == "error") {
          this.data.model.mensaje.level = "danger";
          this.data.model.mensaje.mensaje = "Error en el registro de la reinstalación, favor de intentar nuevamente.";
        }
      }

      );
    this.model.flagNotMsj = false;
    this.model.flagAtencionNot = false;
  }


  setResponseSolicitudes(response: SolicitudHome) {
    this.solicitudHome = { ...response };
  }

  setNotificacionesHome(response: NotificacionHome) {
    this.notificacionHome = new NotificacionHome();
    this.notificacionHome = { ...response };
  }

}
