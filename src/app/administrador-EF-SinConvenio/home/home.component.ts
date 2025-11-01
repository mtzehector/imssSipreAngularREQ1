import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Documento, TipoDocumento } from 'src/app/common/domain';
import { SolicitudHome } from 'src/app/common/domain/solicitud.home';
import { SolicitudesHomeService } from 'src/app/common/services/solicitudes.home.service';
import { DataService } from "../../data.service";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {
  rol: string;
  solicitudHome: SolicitudHome = new SolicitudHome();
  constructor(protected data: DataService,
    private solHomeService: SolicitudesHomeService,
    private route: ActivatedRoute
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "adminEFSinConvenio";
    this.data.model.rol = "adminEFSinConvenio";
    this.solicitudHome.cveEntidadFinanciera = Number(this.model.entidadFinanciera.id);
    this.solHomeService.getSolicitudesHome(this.solicitudHome).subscribe((response: SolicitudHome) => this.setResponseSolicitudes(response));
    console.log(">>>SolicitudHome: ", JSON.stringify(this.solicitudHome));
    this.model.registrarEntidadFinanciera.logo = new Documento();
    this.model.registrarEntidadFinanciera.logo.tipoDocumentoEnum = TipoDocumento.LOGO;

    this.route.queryParams
      //.filter(params => params.cveSol)
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        if (params.accion == "montoLiq" && params.status == "ok") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "El monto a liquidar ha sido validado con éxito.";
        }
      }
      );

  }

  setResponseSolicitudes(response: SolicitudHome) {
    this.solicitudHome = { ...response };
  }

}
