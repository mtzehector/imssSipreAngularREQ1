import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from 'src/app/common/base.component';
import { Mensaje } from 'src/app/common/domain';
import { DataService } from "../../data.service";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {
  rol: string;

  constructor(protected data: DataService,
    private route: ActivatedRoute) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "administradorIMSS";
    this.data.model.rol = "administradorIMSS";
    this.model.folioNotificacion = "";
    this.model.flagNotMsj = false;
    this.model.flagAtencionNot = false;

    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        if (params.accion == "operadorImss" && params.status == "post") {
          this.model.mensaje.level = "success";
          this.model.mensaje.mensaje = "El Operador ha sido registrado con éxito. Se ha enviado un correo " +
            "electrónico al Operador para activar su usuario con una vigencia de 3 días.";
        }else if (params.accion == "CatMaximo" && params.status == "post") {
          this.model.mensaje.level = "success";
          this.model.mensaje.mensaje = "El CAT máximo fue registrado con éxito.";
        } else {
          this.model.mensaje.level = "";
          this.model.mensaje.mensaje = "";
        }

      }
      );




  }

}
