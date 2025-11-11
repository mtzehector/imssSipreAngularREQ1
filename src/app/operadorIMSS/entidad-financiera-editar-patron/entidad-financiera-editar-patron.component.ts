import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { DataService, ModalService, RegistrarEntidadFinancieraService } from 'src/app/common/services';


@Component({
  selector: 'app-entidad-financiera-editar-patron',
  templateUrl: './entidad-financiera-editar-patron.component.html',
  styleUrls: ['../entidad-financiera-registrar/entidad-financiera-registrar.component.css', '../entidad-financiera-detalle/entidad-financiera-detalle.component.css']
})
export class EntidadFinancieraEditarPatronComponent extends BaseComponent implements OnInit {

  public model: Model;
  @Input()
  public registrarForm: any;
  public catalogoEstado: any;
  public regexCorreo: string;
  public regexCurp: string;
  public regexURL: string;
  public regexTel: string;
  flatRenapoError: any = false;
  flat: any;
  imgEFUrl: string = '';

  constructor(protected data: DataService, private router: Router, private modalService: ModalService, private registrarEntidadFinancieraService: RegistrarEntidadFinancieraService, public location: Location) {
    super(data);
    this.model = this.data.model;
    //this.regexCorreo = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    this.regexCorreo = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
    // tslint:disable-next-line: max-line-length
    this.regexCurp = '^([A-Z&]|[a-z&]{1})([AEIOU]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$';
    // tslint:disable-next-line: max-line-length
    this.regexURL = '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(\\/(.)*)?(\\?(.)*)?';
    this.regexTel = "^[0-9]+$";
  }

  ngOnInit() {
    if (this.model.registrarEntidadFinanciera.logo != undefined) {
      if (this.model.registrarEntidadFinanciera.logo.archivo == null) {
        this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
      } else {
        this.imgEFUrl = 'data:image/png;base64,' + this.model.registrarEntidadFinanciera.logo.archivo;
      }
    } else {
      this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
    }

    this.catalogoEstado = [{ id: '1', descripcion: 'VIGENTE' }, { id: '2', descripcion: 'SUSPENDIDA' }, { id: '3', descripcion: 'BAJA' },];
  }

  consultarRenapo() {

    this.data.model.registrarEntidadFinanciera.nombreLegal = "";
    this.data.model.registrarEntidadFinanciera.primerApeLegal = "";
    this.data.model.registrarEntidadFinanciera.segundoApeLegal = "";
    this.data.model.mensaje.mensaje = null;
    this.data.model.mensaje.level = null;
    if (this.model.registrarEntidadFinanciera.curpRepresentanteLegal != null && this.model.registrarEntidadFinanciera.curpRepresentanteLegal.length < 18) {

      this.data.model.registrarEntidadFinanciera.nombreLegal = "";
      this.data.model.registrarEntidadFinanciera.primerApeLegal = "";
      this.data.model.registrarEntidadFinanciera.segundoApeLegal = "";

    } else {

      this.modalService.open("carga");
      this.flat = true;
      //this.registrarEntidadFinancieraService.consultarRenapo(this.model.registrarEntidadFinanciera.curpRepresentanteLegal)
      this.registrarEntidadFinancieraService.consultarRenapo(this.model.registrarEntidadFinanciera.curpRepresentanteLegal, this.data.model.sesion)
        .subscribe((response: any) => {
          this.flat = false;
          this.data.model.registrarEntidadFinanciera.nombreLegal = response.body.nombres;
          this.data.model.registrarEntidadFinanciera.primerApeLegal = response.body.apellido1;
          this.data.model.registrarEntidadFinanciera.segundoApeLegal = response.body.apellido2;
          this.modalService.close("carga");
        });

    }

  }

  validarEstadoEntidad() {
    this.model.registrarEntidadFinanciera.mclcEstadoEf.descripcion =
      Number(this.model.registrarEntidadFinanciera.mclcEstadoEf.id) === 1 ? 'VIGENTE' : Number(this.model.registrarEntidadFinanciera.mclcEstadoEf.id) === 2 ? 'SUSPENDIDA' : 'BAJA';

  }



}
