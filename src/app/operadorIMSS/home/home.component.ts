import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { NotificacionHomeService } from 'src/app/common/services/notificacion.home.service';
import { NotificacionHome } from '../../common/domain/notificacion.home';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {
  rol: String;
  notificacionHome: NotificacionHome = new NotificacionHome();
  constructor(
    protected data: DataService,
    private notificacionHomeService: NotificacionHomeService,
    private route: ActivatedRoute,
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {

    this.rol = "operadorIMSS";
    this.data.model.rol = "operadorIMSS";

    this.notificacionHomeService.getNotificacionesHome(this.notificacionHome).subscribe(response => this.setNotificacionesHome(response));

    this.model.flagNotMsj = false;
    this.model.flagAtencionNot = false;    
  }

  setNotificacionesHome(response: NotificacionHome) {
    this.notificacionHome = new NotificacionHome();
    this.notificacionHome = { ...response };

    this.route.queryParams
      //.filter(params => params.cveSol)
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        if (params.accion == "reporte" && params.status == "autorizado") {
          this.model.mensaje.level = "success";
          this.model.mensaje.mensaje = "El reporte ha sido autorizado con éxito.";
        }
        if (params.accion == "Suspension" && params.status == "success") {
          this.model.mensaje.level = "success";
          this.model.mensaje.mensaje = "El prestamo ha sido suspendido.";
        }
        if (params.accion == "Reanudar" && params.status == "success") {
          this.model.mensaje.level = "success";
          this.model.mensaje.mensaje = "El prestamo ha sido Reanudado.";
        }
      }
      );
  }



}
