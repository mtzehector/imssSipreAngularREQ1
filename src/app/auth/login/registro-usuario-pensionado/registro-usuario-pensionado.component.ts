import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from 'src/app/common/base.component';
//import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataService, ModalService/*, RegistrarEntidadFinancieraService, RegistrarNotificacionService, CatalogoService*/ } from 'src/app/common/services';
import { Model } from "src/app/model";
//import {CoincidirCadenas} from '../../../components-ux/validadores/CoincidirCadenas';
import { RegistroPensionado } from '../../../common/domain/registro-pensionado';
import { RegistroPensionadoService } from '../../../common/services/registroPensionado.service';
import { CoincidirCadenas } from 'src/app/components-ux/validadores/coincidirCadenas';
import { RecaptchaComponent } from 'ng-recaptcha';

// Dependencias para generar el Captcha.
//import { GenerarCaptchaService } from '../../../common/services/generar.captcha.service';
//import { CaptchaGenerarRq } from 'src/app/common/domain/captcha.generar.rq';
//import { ValidarCaptchaService } from '../../../common/services/validar.captcha.service';
//import { CaptchaValidarRq } from 'src/app/common/domain/captcha.validar';

@Component({
  selector: 'app-registro-usuario-pensionado',
  templateUrl: './registro-usuario-pensionado.component.html',
  styleUrls: ['./registro-usuario-pensionado.component.css']
})
export class RegistroUsuarioPensionadoComponent extends BaseComponent {
  message: string;
  formGroup: FormGroup;
  public model: Model;
  cambiosGuardado: boolean = false;
  //regexCorreo: string = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
  regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  regexTelefono: string = '^([0-9]{10})$';
  // Variables para el Captcha.
  //captchaImageInBase64: string = "";
  //captchaValueEncrypted: string = "";
  //captchaIsValid: boolean = false;
  //captchaValueTyped: string = "";
  //captchaValueVerificado: boolean = false;
  //captchaValidando: boolean = false;
  //captchaCapturadoErroneo: boolean = false;
  // Variables para el Boton Submit del formulario
  //buttonSubmitStatus: boolean = false;
  captchaResponse: string = null;

  constructor(public router: Router,
    protected data: DataService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private registroService: RegistroPensionadoService,
    // Inicializa servicios para el Captcha
    //private generarCaptchaService: GenerarCaptchaService,
    //private validarCaptchaService: ValidarCaptchaService,
  ) {
    super(data);
  }

  ngOnInit() {
    this.buildForm();
    //this.consultarServicioGenerarCaptcha();
    this.cambiosGuardado = false;
    RecaptchaComponent.prototype.ngOnDestroy = function() {};
  }
  //***************  CONFIGURACION DEL FORMULARIO  ************************/

  private buildForm() {

    this.formGroup = this.formBuilder.group({
      curp: ['', [Validators.required, Validators.maxLength(18), Validators.minLength(18), Validators.pattern("^[a-zA-Z0-9]*$")]],
      nss: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*$')]],
      numTelefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*$')]],
      correo: ['', [Validators.required, Validators.pattern(this.regexCorreo)]],
      correoConfirmar: ['', [Validators.required, Validators.pattern(this.regexCorreo)]]//,
      //captchaTyped: ['', [Validators.required, Validators.pattern('[A-Za-z0-9!?-]{7}')]]
    }, {
      validator: CoincidirCadenas('correo', 'correoConfirmar')
    });

  }

  async guardarCambios() {

    this.modalRegistroPensionadoOpen();
    //this.buttonSubmitStatus = true;

    //await this.validarCaptcha();

    if (this.captchaResponse != null) {

      let registro = new RegistroPensionado();
      registro = this.formGroup.value;
      registro.cvePerfil = 1;
      registro.firmaCartaRecibo = 0;
      //console.log(">>>>form: " + JSON.stringify(registro));
      this.registroService.registrarPensionado(registro).subscribe(response => {
        this.cambiosGuardado = true;
        this.router.navigate(['/auth/login'],
          {
            queryParams:
            {
              accion: "pensionado",
              status: "nuevoPensionado",
            }
          });

      });
    } 
    //else {
    //  this.buttonSubmitStatus = false;
    //}
    this.modalRegistroPensionadoClose();

  }

  limpiarForm() {
    //this.consultarServicioGenerarCaptcha();

    //this.captchaIsValid = false;
    this.formGroup.controls['curp'].enable();
    this.formGroup.controls['nss'].enable();
    this.formGroup.controls['numTelefono'].enable();
    this.formGroup.controls['correo'].enable();
    this.formGroup.controls['correoConfirmar'].enable();
    //this.formGroup.controls['captchaTyped'].enable();
    this.cambiosGuardado = false;

    this.formGroup.reset();
    //this.formGroup.controls['captchaTyped'].setValue("");
    this.formGroup.controls['curp'].setValue("");
    this.formGroup.controls['nss'].setValue("");
    this.formGroup.controls['numTelefono'].setValue("");
    this.formGroup.controls['correo'].setValue("");
    this.formGroup.controls['correoConfirmar'].setValue("");

    this.captchaResponse = null;
    grecaptcha.reset();
  }

  navegarRegPassword() {
    this.router.navigate(['/auth/cambioContra']);
  }

  modalRegistroPensionadoOpen() {

    this.modalService.open("modalRegistroPensionado");
  }

  modalRegistroPensionadoClose() {
    this.modalService.close("modalRegistroPensionado");
  }

/*
  consultarServicioGenerarCaptcha() {
    this.generarCaptchaService.generarCaptcha(new CaptchaGenerarRq).subscribe(response => {
      this.captchaImageInBase64 = 'data:image/png;base64,' + response.captcha.captchaImageInBase64;
      this.captchaValueEncrypted = response.captcha.captchaValueEncrypted;
    });
    this.captchaIsValid = false;
    this.formGroup.controls['curp'].enable();
    this.formGroup.controls['nss'].enable();
    this.formGroup.controls['numTelefono'].enable();
    this.formGroup.controls['correo'].enable();
    this.formGroup.controls['correoConfirmar'].enable();
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
          //this.consultarServicioGenerarCaptcha();
        } else {
          this.formGroup.controls['captchaTyped'].disable();
          this.captchaCapturadoErroneo = false;

        }
        this.captchaValidando = false;
      });
    } else {
      //console.log(this.captchaIsValid + " - " + this.captchaValidando + " - " + this.captchaValueVerificado);

      //console.log("captcha invalido");
      this.captchaValidando = false;
    }
    //console.log(this.captchaIsValid + " - " + this.captchaValidando + " - " + this.captchaValueVerificado);
  }

  resetVerificarCaptcha() {
    this.captchaValueVerificado = false;
    this.buttonSubmitStatus = false;
    //console.log(this.captchaIsValid + " - " + this.captchaValidando + " - " + this.captchaValueVerificado);
  }
*/

  onCaptchaResolved(response: string) {
    this.captchaResponse = response;
  }

  resetVerificarCaptcha(): void {
    this.captchaResponse = null;
  }

}
