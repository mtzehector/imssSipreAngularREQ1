import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import { SolicitudHome } from 'src/app/common/domain/solicitud.home';
import { SolicitudesHomeService } from 'src/app/common/services/solicitudes.home.service';
import { DataService } from "../../data.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

  rol: String;
  solicitudHome: SolicitudHome = new SolicitudHome();
  constructor(protected data: DataService,
    private solHomeService: SolicitudesHomeService,
    private route: ActivatedRoute) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "promotor";
    this.data.model.rol = "promotor";
    this.solicitudHome.cvePromotor = Number(this.model.personaEF.idPersonaEF);
    this.solHomeService.getSolicitudesHome(this.solicitudHome).subscribe((response: SolicitudHome) => this.setResponseSolicitudes(response));
    this.route.queryParams
      //.filter(params => params.cveSol)
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        if (params.accion == "regPrestamo" && params.status == "error") {
          this.data.model.mensaje.level = "danger";
          this.data.model.mensaje.mensaje = "Servicio no disponible, favor de intentar nuevamente.";
        }
      }
      );
  }

  setResponseSolicitudes(response: SolicitudHome) {
    this.solicitudHome = { ...response };
  }

  irAyuda() {
    window.open('http://www.imss.gob.mx/derechoH/prestamo-pensionados', '_blank');
  }

}
