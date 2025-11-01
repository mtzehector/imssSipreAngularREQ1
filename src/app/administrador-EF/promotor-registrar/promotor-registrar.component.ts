import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor } from "src/app/common/domain";
import { RegistrarPromotorService, ModalService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { DataService } from "../../data.service";


@Component({
  selector: 'app-promotor-registrar',
  templateUrl: './promotor-registrar.component.html',
  styleUrls: []
})
export class PromotorRegistrarComponent extends BaseComponent implements OnInit {

  public model: Model;
  public regexCurp: string;
  public regexNSS: string;
  rol : string;


  constructor(protected data: DataService, private router: Router, private registarPromotorService: RegistrarPromotorService, private modalService: ModalService, public location: Location) {
    super(data);
    this.model = this.data.model;
    this.regexCurp = '^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeioux]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([Aa0-9]{2})$';
    this.regexNSS = '^[0-9]{11}$';
  }

  ngOnInit() {
    this.rol = 'adminEF';
    this.limpiar();
  }

  limpiar() {
    this.model.registrarPromotor = new Promotor();
    this.model.enabledBajaPromotor = false;
  }
  regresar() {
    this.router.navigate(['/administradorEF/consultarPromotor', {}]);
  }

  continuar() {
    this.modalService.open("carga");
    this.model.enabledModificarPromotor = false;
    this.registarPromotorService.consultarPersonaRenapoBdtu(this.model.registrarPromotor.curp, this.model.registrarPromotor.nss)
      .subscribe((response: any) => {
        this.modalService.close("carga");
        this.router.navigate(['/administradorEF/editarPromotor', {}]);
      });
  }
}
