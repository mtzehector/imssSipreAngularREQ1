import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Bitacora, Promotor } from "src/app/common/domain";

import { ModalService } from 'src/app/common/modal-Services';
import { Model } from "src/app/model";
import { DataService } from "../../data.service";
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { BitacoraService, PromotorService } from 'src/app/common/services';
import { PrestamoPromotor } from 'src/app/common/domain/prestamo-promotor';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { GenerarCaptchaService } from 'src/app/common/services/generar.captcha.service';
import { ValidarCaptchaService } from 'src/app/common/services/validar.captcha.service';
import { CaptchaGenerarRq } from 'src/app/common/domain/captcha.generar.rq';
import { CaptchaValidarRq } from 'src/app/common/domain/captcha.validar';

@Component({
  selector: 'app-registrar-prestamo',
  templateUrl: './registrar-prestamo.component.html',
  styleUrls: ['./registrar-prestamo.component.css']
})
export class RegistrarPrestamoComponent extends BaseComponent implements OnInit {
  public model: Model;
  public regexCurp: string;
  public regexNSS: string;
  formGroup: FormGroup;
  rol: String;
  mensajeBusqueda: String;
  buttonSubmitStatus: boolean = false;
  // Variables para el Captcha.
  captchaImageInBase64: string = "";
  captchaValueEncrypted: string = "";
  captchaIsValid: boolean = false;
  captchaValueTyped: string = "";
  captchaValueVerificado: boolean = false;
  captchaValidando: boolean = false;
  captchaCapturadoErroneo: boolean = false;

  constructor(protected data: DataService,
              private router: Router,
              private modalService: ModalService,
              public location: Location,
              private formBuilder: FormBuilder,
              private promotorService: PromotorService,
              private generarCaptchaService: GenerarCaptchaService,
              private validarCaptchaService: ValidarCaptchaService
  ) {

    super(data);
    this.model = this.data.model;
    this.regexCurp = '^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeioux]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([Aa0-9]{2})$';
    this.regexNSS = '^[0-9]{11}$';
  }

  ngOnInit() {
    this.buildForm();
    this.rol = "promotor";
    this.model.buttonPrestamoPromotor = false;
    this.consultarServicioGenerarCaptcha();
  }

  private buildForm() {

    this.formGroup = this.formBuilder.group({
      nss: ['', [Validators.required, Validators.pattern(this.regexNSS)]],
      curp: ['', [Validators.required, Validators.pattern(this.regexCurp)]],
      captchaTyped: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7), Validators.pattern('[A-Za-z0-9!?-]{7}')]]
    });


  }

  async validarPensionado() {
    if (!this.captchaIsValid) {
      await this.validarCaptcha();
    }
    if (this.captchaIsValid) {
      let pensionado = new PrestamoPromotor();
      this.model.buttonPrestamoPromotor = true;
      pensionado = this.formGroup.value;
      let curp =  pensionado.curp.toUpperCase();
      pensionado.curp = curp;
      pensionado.sesion=this.data.model.sesion;
      this.promotorService.validarPensionado(pensionado).subscribe((response: PrestamoPromotor) => this.setResponse(response));
    }
  }

  setResponse(response: PrestamoPromotor) {
    this.model.prestamoPromotor.pensionado = response.pensionado;
    this.model.prestamoPromotor.capacidad = response.capacidad;
    this.model.prestamoPromotor.persona = response.persona;
    this.model.pensionado.curp = this.model.prestamoPromotor.pensionado.cveCurp;
    this.model.pensionado.nss = this.model.prestamoPromotor.pensionado.idNss;
    this.model.pensionado.grupoFamiliar = this.model.prestamoPromotor.pensionado.idGrupoFamiliar;
    this.model.buttonPrestamoPromotor = false;



    console.log(">>>>PrestamoPromotorResponse ", JSON.stringify(this.model.prestamoPromotor));
    this.router.navigate(['/promotor/registroPrestamoEditar']);
  }

  regresar(){
    this.router.navigate(['/promotor/home']);
  }

  resetVerificarCaptcha() {
    this.captchaValueVerificado = false;
    this.model.buttonSubmitStatus = false;
  }

  consultarServicioGenerarCaptcha() {
    this.formGroup.controls['captchaTyped'].disable();
    this.generarCaptchaService.generarCaptcha(new CaptchaGenerarRq).subscribe(response => {
      this.captchaImageInBase64 = 'data:image/png;base64,' + response.captcha.captchaImageInBase64;
      this.captchaValueEncrypted = response.captcha.captchaValueEncrypted;
      this.formGroup.controls['captchaTyped'].enable();
    });
    this.captchaIsValid = false;
    this.formGroup.controls['captchaTyped'].enable();
    this.formGroup.controls['captchaTyped'].setValue("");
  }

  async validarCaptcha() {
    this.captchaValidando = true;
    this.captchaValueVerificado = true;
    let captcha = new CaptchaValidarRq();
    captcha.captchaValueEncrypted = this.captchaValueEncrypted;
    captcha.captchaValueTyped = this.captchaValueTyped;
    if (captcha.captchaValueTyped.length == 7) {
      await this.validarCaptchaService.validarCaptcha(captcha).then(response => {
        this.captchaIsValid = response.isValid;
        if (response.isValid == false) {
          this.captchaCapturadoErroneo = true;
          this.formGroup.controls['captchaTyped'].setValue("");
          this.consultarServicioGenerarCaptcha();
        } else {
          this.formGroup.controls['captchaTyped'].disable();
          this.captchaCapturadoErroneo = false;
        }
        this.captchaValidando = false;
      });
    } else {
      this.captchaValidando = false;
    }
  }


}