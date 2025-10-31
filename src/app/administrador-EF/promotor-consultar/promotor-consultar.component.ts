import { Component, OnInit, Input } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor } from 'src/app/common/domain';
import { ModalService, RegistrarPromotorService } from 'src/app/common/services';
import { Model } from 'src/app/model';
import { DataService } from '../../data.service';
import { PromotorConsultaDetalleComponent } from 'src/app/administrador-EF/promotor-consulta-detalle/promotor-consulta-detalle.component';

@Component({
  selector: 'app-promotor-consultar',
  templateUrl: './promotor-consultar.component.html',
  styleUrls: []
})


export class PromotorConsultarComponent extends BaseComponent implements OnInit {
  public model: Model;
  @Input() curp: string;
  public promotor: Promotor;
  public regexCurp: string;
  public detalle: PromotorConsultaDetalleComponent;
  public detalleExiste: boolean;
  public rol: string;

  constructor(protected data: DataService, private router: Router, private route: ActivatedRoute, private registrarPromotorService: RegistrarPromotorService, private modalService: ModalService, public location: Location) {
    super(data);
    this.model = this.data.model;
    
    this.regexCurp = '^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeioux]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([Aa0-9]{2})$';
    this.detalle = new PromotorConsultaDetalleComponent(data, router, route, registrarPromotorService, modalService, location);
    this.detalle.promotor = null;
    this.promotor = new Promotor();
    this.detalleExiste = false;
  }


  ngOnInit() {
    //console.log(">>> ngOnInit this.model.entidadFinanciera.id=" + this.model.entidadFinanciera.id)
    this.rol = 'adminEF';
    this.limpiar();
    this.route.queryParams.subscribe(params => {
      console.log(params); // { order: "popular" }
      if (params.accion == "promotor" && params.status == "baja") {
        this.data.model.mensaje.level = "success";
        this.data.model.mensaje.mensaje = "El personal operativo ha sido dado de baja con éxito.";
      }
      if (params.accion == "promotor" && params.status == "reactivar") {
        this.data.model.mensaje.level = "success";
        this.data.model.mensaje.mensaje = "El personal operativo fue activado con éxito.";
      }
      if (params.accion == "promotor" && params.status == "post") {
        this.data.model.mensaje.level = "success";
        this.data.model.mensaje.mensaje = "El personal operativo ha sido registrado con éxito." +
          " Se ha enviado un correo electrónico al personal operativo para activar su usuario con una vigencia de 3 días.";
      }
      if (params.accion == "promotor" && params.status == "put") {
        this.data.model.mensaje.level = "success";
        this.data.model.mensaje.mensaje = "Se ha realizado la actualización del personal operativo exitosamente.";
      }
      if (params.accion == "promotor" && params.status == "delete") {
        this.data.model.mensaje.level = "success";
        this.data.model.mensaje.mensaje = "Se a realizado la baja del personal operativo exitosamente.";
      }
    }
    );
  }

  limpiar() {
    this.curp = '';
    this.promotor = new Promotor();
    this.model.registrarPromotor = this.promotor;
    this.detalleExiste = false;
  }


  buscar() {
    this.detalleExiste = false;
    
    this.modalService.open('carga');
    this.registrarPromotorService.consultarPromotorBdtuEF(this.promotor.curp.toLocaleUpperCase(), this.model.entidadFinanciera.id)
      .subscribe((response: any) => {
        this.modalService.close('carga');
        if (this.model.registrarPromotor.curp == null) {
          this.model.mensaje.level = "info";
          this.model.mensaje.mensaje = "No se encontró registro de personal operativo con el CURP ingresado.";
        }
        this.detalleExiste = true;
        this.promotor = new Promotor();
      });
  }

  continuar() {
    this.router.navigate(['/administradorEF/registrarPromotor', {}]);
  }
  regresar() {
    this.router.navigate(['/administradorEF/home', {}]);
  }
}

