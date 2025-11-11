import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { DataService, ModalService, RegistrarEntidadFinancieraService, PromotorService } from 'src/app/common/services';
import { RegistroPensionado } from 'src/app/common/domain/registro-pensionado';
import { NgControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-entidad-financiera-editar-admin',
  templateUrl: './entidad-financiera-editar-admin.component.html',
  styleUrls: []
})
export class EntidadFinancieraEditarAdminComponent extends BaseComponent implements OnInit {

  public model: Model;
  @Input()
  public registrarForm: NgForm;
  public regexCurp: string;
  public regexCorreo: string;
  public regexRfc: string;
  flat: any;
  flat1: any;
  invalidoRfcYCurp: boolean;

  constructor(protected data: DataService, private promotorService: PromotorService, private router: Router, private modalService: ModalService, private registrarEntidadFinancieraService: RegistrarEntidadFinancieraService, public location: Location) {
    super(data);
    this.model = this.data.model;
    //this.regexCorreo = '\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$';
    //this.regexCorreo = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    this.regexCorreo = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
    this.regexCurp = '^([A-Z&]|[a-z&]{1})([AEIOU]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$';
    this.regexRfc = '[A-Z]{4}[0-9]{6}[A-Z0-9]{3}';
  }

  ngOnInit() {
    if(this.model.enabledModificarEntidad){
      this.model.registrarEntidadFinanciera.valueCorreModAdmin = this.model.registrarEntidadFinanciera.correoAdmin;
      this.model.registrarEntidadFinanciera.valueCurpModAdmin = this.model.registrarEntidadFinanciera.curpAdmin;
      this.model.registrarEntidadFinanciera.valueRfcModAdmin = this.model.registrarEntidadFinanciera.adminRFC;
      this.model.flatCorreoAdminEF = true;
      this.model.flatCurpAdminEF = true;
    }else{
      this.model.flatCorreoAdminEF = false;
      this.model.flatCurpAdminEF = false;
    }
  }

  consultarRenapo() {
    
    this.data.model.registrarEntidadFinanciera.nombreAdmin = "";
    this.data.model.registrarEntidadFinanciera.primerApAdmin = "";
    this.data.model.registrarEntidadFinanciera.segundoApeAdmin = "";
    this.data.model.mensaje.mensaje = null;
    this.data.model.mensaje.level = null;

    if (this.model.registrarEntidadFinanciera.curpAdmin != null && this.model.registrarEntidadFinanciera.curpAdmin.length < 18) {

      this.data.model.registrarEntidadFinanciera.nombreAdmin = "";
      this.data.model.registrarEntidadFinanciera.primerApAdmin = "";
      this.data.model.registrarEntidadFinanciera.segundoApeAdmin = "";
    
    } else {
    
      this.modalService.open("carga");
      this.flat = true;
      if(this.model.enabledModificarEntidad){
        this.model.flatCurpAdminEF = false;
      }
      //this.registrarEntidadFinancieraService.consultarRenapo(this.model.registrarEntidadFinanciera.curpAdmin)
      this.registrarEntidadFinancieraService.consultarRenapo(this.model.registrarEntidadFinanciera.curpAdmin, this.data.model.sesion)
        .subscribe((response: any) => {
          this.flat = false;
          this.data.model.registrarEntidadFinanciera.nombreAdmin = response.body.nombres;
          this.data.model.registrarEntidadFinanciera.primerApAdmin = response.body.apellido1;
          this.data.model.registrarEntidadFinanciera.segundoApeAdmin = response.body.apellido2;
          this.validarCurpAdminEF(response.body.nombres, response.body.apellido1, response.body.apellido2);
        });

    }

  }

  validarCurpAdminEF(nom: string, ap1: string, ap2: string){
    let pensionado = new RegistroPensionado();
    pensionado.curp = this.model.registrarEntidadFinanciera.curpAdmin;
    this.data.model.mensaje.mensaje = null;
    this.data.model.mensaje.level = null;
    this.data.model.registrarEntidadFinanciera.nombreAdmin = "";
    this.data.model.registrarEntidadFinanciera.primerApAdmin = "";
    this.data.model.registrarEntidadFinanciera.segundoApeAdmin = "";
    this.flat = true;
    this.model.flatCurpAdminEF = false;
    if(this.model.enabledModificarEntidad){
      if(this.model.registrarEntidadFinanciera.valueCurpModAdmin === this.model.registrarEntidadFinanciera.curpAdmin){
        this.flat = false;
        this.model.flatCurpAdminEF = true;
        this.model.registrarEntidadFinanciera.curpAdmin = pensionado.curp;
        this.data.model.registrarEntidadFinanciera.nombreAdmin = nom;
        this.data.model.registrarEntidadFinanciera.primerApAdmin = ap1;
        this.data.model.registrarEntidadFinanciera.segundoApeAdmin = ap2;
        this.modalService.close("carga");
      }else{
        this.promotorService.validarCorreoAdminEF(pensionado).subscribe(response => {
          this.model.registrarEntidadFinanciera.curpAdmin = pensionado.curp;
          this.data.model.registrarEntidadFinanciera.nombreAdmin = nom;
          this.data.model.registrarEntidadFinanciera.primerApAdmin = ap1;
          this.data.model.registrarEntidadFinanciera.segundoApeAdmin = ap2;
          this.flat = false;
          this.model.flatCurpAdminEF = true;
          this.modalService.close("carga");
        } );
      }
    }else{
      this.promotorService.validarCorreoAdminEF(pensionado).subscribe(response => {
        this.model.registrarEntidadFinanciera.curpAdmin = pensionado.curp;
        this.data.model.registrarEntidadFinanciera.nombreAdmin = nom;
        this.data.model.registrarEntidadFinanciera.primerApAdmin = ap1;
        this.data.model.registrarEntidadFinanciera.segundoApeAdmin = ap2;
        this.flat = false;
        this.model.flatCurpAdminEF = true;
        this.modalService.close("carga");
    });
  }
   
  }

  validarCorreoAdminEF(){
    let pensionado = new RegistroPensionado();
    pensionado.correo = this.model.registrarEntidadFinanciera.correoAdmin;
    this.data.model.mensaje.mensaje = null;
    this.data.model.mensaje.level = null;
    this.flat1 = true;
    this.model.flatCorreoAdminEF = false;
    if(this.model.enabledModificarEntidad){
      if(this.model.registrarEntidadFinanciera.valueCorreModAdmin === this.model.registrarEntidadFinanciera.correoAdmin){
        this.flat1 = false;
        this.model.flatCorreoAdminEF = true;
      }else{
        this.promotorService.validarCorreoAdminEF(pensionado).subscribe(response => {
          this.flat1 = false;
          this.model.flatCorreoAdminEF = true;
        } );
      }
    }else{
      this.promotorService.validarCorreoAdminEF(pensionado).subscribe(response => {
        this.flat1 = false;
        this.model.flatCorreoAdminEF = true;
      } );
    }
   
  }

  /*
  validarRFCAdminEF(curpAdmin:NgControl, rfcAdmin:NgControl){
    
    this.model.flatRfcAdminEF = rfcAdmin.invalid;
    if (this.model.flatRfcAdminEF) {
      return;
    }
    if (curpAdmin.value != "" && rfcAdmin.value != "") {
      let curp10 = String(curpAdmin.value).slice(0,10);
      let rfc10 = String(rfcAdmin.value).slice(0,10);
      this.model.flatRfcAdminEF = curp10 === rfc10? false : true;
    }

    console.log("flatRfcAdminEF: ", this.model.flatRfcAdminEF);
    
  }
  */

}
