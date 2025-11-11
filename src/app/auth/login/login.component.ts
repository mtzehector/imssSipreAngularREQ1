import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, ModalService, RegistrarEntidadFinancieraService, PensionadoService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { Loggin } from 'src/app/common/domain/loggin';
//import { Persona } from 'src/app/common/domain/persona';
import { PensionesResponse } from 'src/app/common/domain/pensiones.response';
import { Pension } from 'src/app/common/domain/pension';
import { PensionadoResponse } from 'src/app/common/domain/pensionado.response';
import { Delegacion } from 'src/app/common/domain/delegacion';
import { EntidadFederativa } from 'src/app/common/domain/entidad.federativa';
import { BaseComponent } from 'src/app/common/base.component';
import { PromotorService } from 'src/app/common/services/promotor.service';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import 'rxjs/add/operator/toPromise';
import { fromEvent, Subscription } from "rxjs";
// Dependencias para generar el Captcha.
//import { GenerarCaptchaService } from '../../common/services/generar.captcha.service';
//import { CaptchaGenerarRq } from 'src/app/common/domain/captcha.generar.rq';
//import { ValidarCaptchaService } from '../../common/services/validar.captcha.service';
//import { CaptchaValidarRq } from 'src/app/common/domain/captcha.validar';
import { EntidadFinanciera, Mensaje } from 'src/app/common/domain';
import { ValidarPensionadoModel } from 'src/app/common/domain/validar.pensionado.model';
import { horarioInicia, horarioTermina } from 'src/environments/environment';
import { RecaptchaComponent } from 'ng-recaptcha';
//import { BitacoraInterfaz } from 'src/app/common/domain/bitacora.interfaz';
//import { BitacoraInterfazService } from 'src/app/common/services/bitacora.interfaz.service';
//import { TipoServicio } from 'src/app/common/domain/tipo.servicio';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {
  formGroup: FormGroup;
  public model: Model;
  regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  correoPensionado: string = '';
  // Variables para el Captcha.
  //captchaImageInBase64: string = "";
  //captchaValueEncrypted: string = "";
  //captchaIsValid: boolean = false;
  //captchaValueTyped: string = "";
  //captchaValueVerificado: boolean = false;
  //captchaValidando: boolean = false;
  //captchaCapturadoErroneo: boolean = false;
  // Variables para el Boton Submit del formulario
  mySubscription: any;
  backEvent: Subscription;
  // ACTUALIZAR CADA VERSIÓN A QA O PRODUCCIÓN V.[AÑO].[MES].[DIA].[HORA].[MINUTO]
  version: string = "2025.10.30.19.00";
  captchaResponse: string = null;

  constructor(public authService: AuthService,
    protected data: DataService,
    public router: Router,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private pensionadoService: PensionadoService,
    //private bitacoraInterfazService: BitacoraInterfazService,
    private promotorService: PromotorService,
    private registrarEntidadFinancieraService: RegistrarEntidadFinancieraService,
    // Inicializa servicios para el Captcha
    //private generarCaptchaService: GenerarCaptchaService,
    //private location: PlatformLocation,
    //private validarCaptchaService: ValidarCaptchaService,
    private route: ActivatedRoute,

  ) {
    super(data);

    this.authService.logout();

    this.authService.setPressedBack(0);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
    this.model = this.data.model;
  }

  ngOnInit() {
    this.buildForm();
    this.correoPensionado = '';
//    this.consultarServicioGenerarCaptcha();
    this.backEvent = fromEvent(window, 'popstate').subscribe(() => {
      this.authService.setPressedBack(1);
      //this.pensionadoService.getCaptcha().subscribe(sesion => console.log());
    });
    this.route.queryParams
      .subscribe(
        params => {
          if (params.accion == "pensionado" && params.status == "cambioContra") {
            this.model.mensaje = { level: "success", mensaje: "Cambio de contraseña realizado con éxito.", id: "0" };
          }
          if (params.accion == "pensionado" && params.status == "nuevoPensionado") {
            this.model.mensaje = { level: "success", 
              mensaje: "Registro de usuario realizado con éxito. Se te ha enviado un correo" +
                " electrónico con instrucciones para activar tu contraseña.", id: "0" };
          }
          if (params.accion == "pensionado" && params.status == "correoRecuperarContrasenia") {
            this.model.mensaje = { level: "success", 
              mensaje: "Recuperación de contraseña se ha realizado con éxito. Se te ha enviado un correo" +
                " electrónico con instrucciones para reactivar tu contraseña.", id: "0" };
          }
          if (params.accion == "token" && params.status == "vencido") {
            this.model.mensajeTiempoSesion = { level: "danger", mensaje: "Tu sesión ha expirado", id: "0" };
          }
          if (params.accion == "sesion" && params.status == "cerrada") {
            this.model.mensaje = { level: "success", mensaje: "Se ha cerrado la sesión.", id: "0" };
          }
        }
      );
      RecaptchaComponent.prototype.ngOnDestroy = function() {};
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
    if (this.backEvent) {
      this.backEvent.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      nomUsuario: ['', [Validators.required, Validators.pattern(this.regexCorreo)]],
      password: ['', [, Validators.required, Validators.minLength(8)]]//,
      //captchaTyped: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7), Validators.pattern('[A-Za-z0-9!?-]{7}')]]
    });
  }

  async validarCredenciales() {
    let tiempoActual = new Date().getTime();

    if (!(tiempoActual >= horarioInicia.getTime() && tiempoActual <= horarioTermina.getTime())) {
      this.model.mensaje = { level: "danger", 
        mensaje: "Servicio no disponible. <br> El horario de atención es de 6:00 a 24:00 hrs. de lunes a domingo.", id: "0" };
      return;
    }  

    this.openModalLogin();
    this.model.buttonSubmitStatus = true;
    //if (!this.captchaIsValid) {
    //  await this.validarCaptcha();
    //}
    //if (this.captchaIsValid) {
          let loggeo = new Loggin();
          loggeo = this.formGroup.value;
          this.correoPensionado = loggeo.nomUsuario;

          this.authService.obtainToken(loggeo.nomUsuario, loggeo.password).subscribe(data => {
            this.data.model.sesion = data.session;

            this.authService.saveToken(data);
            this.authService.isLoggedIn = true;
            this.model.userLoginValid = true;

            this.authService.obtainUser(loggeo.nomUsuario, this.data.model.sesion).subscribe(res => {
              this.authService.saveUser(res);
              this.model.user.numNss = this.authService.getUser().numNss;
              this.model.user.desDelegacionTrabIMSS = this.authService.getUser().desDelegacionTrabIMSS;
              this.model.user.matriculaTrabIMSS = this.authService.getUser().matriculaTrabIMSS;
              this.validarPerfil();
            }, error => {
              this.closeModalLogin();
              this.model.mensaje = { level: "danger", mensaje: error.error.message, id: "0" };
            });
          }, error => {
            this.resetVerificarCaptcha();
//            this.consultarServicioGenerarCaptcha();
            this.closeModalLogin();
            
            //this.model.mensaje = { level: "danger", mensaje: "Contraseña o usuario no válido, favor de verificar.", id: "0" };
            this.model.mensaje = { level: "danger", mensaje: error.error.message, id: "0" };
          });
    //} else {
    //  this.model.buttonSubmitStatus = false;
    //}
  }

  validarPerfil() {
    this.model.persona.curp = this.authService.getUser().cveCurp;
    this.model.persona.nombre = this.authService.getUser().nombre;
    this.model.persona.primerApellido = this.authService.getUser().primerApellido;
    this.model.persona.segundoApellido = this.authService.getUser().segundoApellido;
    this.model.persona.correoElectronico = this.authService.getUser().nomUsuario;
    this.model.persona.telefono = this.authService.getUser().telefonoCelular;
    this.model.persona.rfc = this.authService.getUser().rfc;
    this.model.persona.firmaCartaRecibo = this.authService.getUser().firmaCartaRecibo;

    switch (this.authService.getUser().cvePerfil) {
      case 1: //Pensionado
        this.pensionadoService.getPensiones(this.authService.getUser().cveCurp)
          .subscribe(
            (response: PensionesResponse) => { this.validarPensiones(response); },
            error => { this.closeModalLogin(); }
          );
        break;
      case 2: //AdministradorEF
        this.registrarEntidadFinancieraService.ObtenInfoEF(this.authService.getUser().nomUsuario, 
          this.authService.getUser().cveCurp)
          .subscribe(
            (entidadFin: EntidadFinanciera) => {
              if (entidadFin.sinConvenio == 1) {
                this.setEntidadFinanciera(entidadFin); 
                this.closeModalLogin();
              }
              else {
                this.setEntidadFinancieraSinConvenio(entidadFin);
                this.closeModalLogin();
              }
            }
          );
        break;
      case 3: //Promotor EF
        this.promotorService.getPromotorCurpNss(this.authService.getUser().cveCurp, this.authService.getUser().numNss)
          .subscribe(
            (personaEF: PersonaEF) => { this.validarPersonaEF(personaEF); },
            error => { this.closeModalLogin(); }
          );
        break;
      case 4: //OperadorEF
        this.promotorService.getOperador(this.authService.getUser().cveCurp)
          .subscribe(
            (personaEF: PersonaEF) => {
              this.validarOPEF(personaEF); 
              this.closeModalLogin(); 
            },
            error => { this.closeModalLogin(); }
          );
        break;
      case 5: //AdministradorIMSS
        this.closeModalLogin();
        this.router.navigate(['/administradorIMSS/home', {}]);
        break;
      case 6: //OperadorIMSS
        this.model.folioNotificacion = "";
        this.model.flagNotMsj = false;
        this.closeModalLogin();
        this.router.navigate(['/operadorIMSS/home', {}]);
        break;
      //case 7: //OperadorFinanciero
      //  this.closeModalLogin();
      //  this.router.navigate(['/operadorFinanciero/home', {}]);
      //  break;
      default:
        this.closeModalLogin();
        break;
    }
  }

  validarPensiones(response: PensionesResponse) {
    this.model.pensiones = [];
    for (var i = 0; i < response.pensiones.length; i++) {
      this.model.pensiones[i] = { ...response.pensiones[i] };
    }
    switch (response.pensiones.length) {
      case 0:
        this.closeModalLogin();
        this.model.mensaje = { level: "warning", mensaje: "No existen Pensiones para está CURP", id: "0" };
        break;
      case 1:
        this.establecePensionado(response.pensiones[0]);
        break;
      default:
        this.closeModalLogin();
        this.router.navigate(['/pensionado/seleccionarGrupoFamiliar', {}]);
    }
  }

  establecePensionado(pension: Pension) {
    this.model.pensionado.nss = pension.idNss;
    this.model.pensionado.grupoFamiliar = pension.idGrupoFamiliar;
    //Validar RENAPO, SISTRAP y SIPRE
    let pensionado = new ValidarPensionadoModel();
    pensionado.nss = this.model.pensionado.nss;
    pensionado.curp = this.model.persona.curp.toUpperCase();
    pensionado.idGrupoFamiliar = pension.idGrupoFamiliar;
    pensionado.sesion = this.data.model.sesion;
    this.pensionadoService.validarPensionado(pensionado)
      .subscribe(
          (response: ValidarPensionadoModel) => {
            this.model.persona.nombre = response.persona.nombre;
            this.model.persona.primerApellido = response.persona.primerApellido;
            this.model.persona.segundoApellido = response.persona.segundoApellido;
            this.leerPensionado();
          },
          error => { this.closeModalLogin(); }
      );
  }

  leerPensionado() {
    this.pensionadoService.readPensionado(this.model.pensionado.nss, this.model.pensionado.grupoFamiliar)
      .subscribe(
        (response: PensionadoResponse) => { this.validarPensionado(response); },
        error => { this.closeModalLogin(); }
      );
  }

  validarPensionado(response: PensionadoResponse) {
    this.model.pensionado.cuentaClabe = response.numClabe;
    this.model.pensionado.curp = response.cveCurp;
    this.model.pensionado.claveDelegacion = response.cveDelegacion;
    this.model.pensionado.delegacion = new Delegacion();
    this.model.pensionado.delegacion.id = parseInt(response.cveDelegacion);
    this.model.pensionado.delegacion.numDelegacion = response.cveDelegacion;
    this.model.pensionado.delegacion.cveDelegacion = response.cveDelegacion;
    this.model.pensionado.delegacion.desDelegacion = response.descDelegacion;
    this.model.pensionado.delegacion.descDelegacion = response.descDelegacion;
    this.model.pensionado.subDelegacion = response.cveSudelegacion;
    this.model.pensionado.entidadFederativa = new EntidadFederativa();
    this.model.pensionado.entidadFederativa.cveEntidadFederativa = response.cveEntidadFederativa;
    this.model.pensionado.entidadFederativa.descEntidadFederativa = response.descEntidadFederativa;
    if (response.fecNacimiento != null && response.fecNacimiento != '') {
      this.model.pensionado.fechaNacimiento = response.fecNacimiento;
    } else {
      this.model.pensionado.fechaNacimiento = this.authService.getUser().fecNacimiento;
    }
    this.model.pensionado.sexo = response.sexo;
    this.closeModalLogin();
    this.navegar();
  }
/*
  consultarServicioGenerarCaptcha() {
    this.formGroup.controls['captchaTyped'].disable();
    this.generarCaptchaService.generarCaptcha(new CaptchaGenerarRq).subscribe(
      response => {
        this.captchaImageInBase64 = 'data:image/png;base64,' + response.captcha.captchaImageInBase64;
        this.captchaValueEncrypted = response.captcha.captchaValueEncrypted;
        this.formGroup.controls['captchaTyped'].enable();
      }
    );
    this.captchaIsValid = false;
    this.formGroup.controls['nomUsuario'].enable();
    this.formGroup.controls['password'].enable();
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
      await this.validarCaptchaService.validarCaptcha(captcha).then(
        response => {
          this.captchaIsValid = response.isValid;
          if (response.isValid == false) {
            this.captchaCapturadoErroneo = true;
            this.formGroup.controls['captchaTyped'].setValue("");
            this.consultarServicioGenerarCaptcha();
            this.closeModalLogin();
          } else {
            this.formGroup.controls['captchaTyped'].disable();
            this.captchaCapturadoErroneo = false;
          }
          this.captchaValidando = false;
        },
        error => { this.closeModalLogin(); }
      );
    } else {
      this.captchaValidando = false;
      this.closeModalLogin();
    }
  }

  resetVerificarCaptcha() {
    this.captchaValueVerificado = false;
    this.model.buttonSubmitStatus = false;
  }

  limpiarForm() {
    this.consultarServicioGenerarCaptcha();
    this.captchaIsValid = false;
    this.formGroup.controls['nomUsuario'].enable();
    this.formGroup.controls['password'].enable();
    this.formGroup.controls['captchaTyped'].enable();
    this.formGroup.reset();
    this.formGroup.controls['captchaTyped'].setValue("");
  }
*/

  setEntidadFinanciera(entidadFin: EntidadFinanciera) {
    this.model.entidadFinanciera = { ...entidadFin };
    this.registrarEntidadFinancieraService.consultarEstadosEF(this.model.entidadFinanciera.id).
      subscribe(
        (response: Delegacion[]) => { 
          this.model.delegacionesEFCollection = response;
        },
        error => { this.closeModalLogin(); }
      );
    this.router.navigate(['/administradorEF/home', {}]);
  }

  setEntidadFinancieraSinConvenio(entidadFin: EntidadFinanciera) {
    this.model.entidadFinanciera = { ...entidadFin };
    this.registrarEntidadFinancieraService.consultarEstadosEF(this.model.entidadFinanciera.id).
      subscribe(
        (response: Delegacion[]) => { 
          this.model.delegacionesEFCollection = response;
        },
        error => { this.closeModalLogin(); }
      );
    this.router.navigate(['/administradorEFSinConvenio/home', {}]);
  }

/*
  validarLoginOT1(persona: Persona) {
    this.model.persona = { ...persona };
    this.model.persona.correoElectronico = this.correoPensionado;
    if (this.model.persona.nombre !== null) {
      switch (this.authService.getUser().cvePerfil) {
        case this.model.cvePerfil_Pensionado:
          this.pensionadoService.getPensiones(this.model.persona.curp)
            .subscribe((response: PensionesResponse) => this.validarPensiones(response));
          break;
        case this.model.cvePerfil_Administrador_EF:
          this.promotorService.getPromotor(this.model.persona.curp)
            .subscribe((personaEF: PersonaEF) => this.validarPersonaEF(personaEF));
          break;
        case this.model.cvePerfil_Promotor:
          this.model.user.numNss = this.authService.getUser().numNSS;
          this.promotorService.getPromotor(this.model.persona.curp)
            .subscribe((personaEF: PersonaEF) => this.validarPersonaEF(personaEF));
          break;
        case this.model.cvePerfil_Operador_EF: //OperadorEF
          this.router.navigate(['/operadorEF/home', {}]);
          break;
        case this.model.cvePerfil_Operador_IMSS: //OperadorIMSS
          this.router.navigate(['/operadorIMSS/home', {}]);
          break;
      }
    }
  }

  validarLoginOT1Void() {
    if (this.model.persona.nombre !== null) {
      switch (this.authService.getUser().cvePerfil) {
        case this.model.cvePerfil_Pensionado: //Pensionado
          this.pensionadoService.getPensiones(this.model.persona.curp)
            .subscribe((response: PensionesResponse) => this.validarPensiones(response));
          break;
        case this.model.cvePerfil_Administrador_EF:
          this.promotorService.getPromotor(this.model.persona.curp)
            .subscribe((personaEF: PersonaEF) => this.validarPersonaEF(personaEF));
          break;
        case this.model.cvePerfil_Promotor:
          this.model.user.numNss = this.authService.getUser().numNSS;
          this.promotorService.getPromotor(this.authService.getUser().cveCurp)
            .subscribe((personaEF: PersonaEF) => this.validarPersonaEF(personaEF));
          break;
        case this.model.cvePerfil_Operador_EF: //OperadorEF
          this.router.navigate(['/operadorEF/home', {}]);
          break;
        case this.model.cvePerfil_Operador_IMSS: //OperadorIMSS
          this.router.navigate(['/operadorIMSS/home', {}]);
          break;
      }
    }
  }
*/

  validarPersonaEF(personaEF: PersonaEF) {
    this.model.personaEF.nombre = this.authService.getUser().nombre;
    this.model.personaEF.primerApellido = this.authService.getUser().primerApellido;
    this.model.personaEF.segundoApellido = this.authService.getUser().segundoApellido;
    this.model.personaEF.nss = this.authService.getUser().numNss;
    this.model.personaEF.curp = personaEF.curp;
    this.model.personaEF.numEmpleado = personaEF.numEmpleado;
    this.model.personaEF.idPersonaEF = personaEF.idPersonaEF;
    this.model.personaEF.entidadFinanciera = { ...personaEF.entidadFinanciera };
    this.promotorService.validaRelacionLaboral(this.model.personaEF.entidadFinanciera.id, this.model.personaEF.nss, 
      this.model.personaEF.curp, this.model.personaEF.idPersonaEF)
      .subscribe(
        (validacion: any) => {
          if (validacion == 1) {
            this.resetVerificarCaptcha();
//            this.consultarServicioGenerarCaptcha();
            this.closeModalLogin();
            this.model.mensaje = { level: "danger", mensaje: "El usuario se encuentra inactivo, favor de verificar", id: "0" };
          }
          else if (validacion == 3) {
            this.closeModalLogin();
            this.router.navigate(['/promotor/home', {}]);
          }
        }, 
        error => { this.closeModalLogin(); }
      );
  }

  validarOPEF(personaEF: PersonaEF) {
    this.model.personaEF.nombre = this.authService.getUser().nombre;
    this.model.personaEF.primerApellido = this.authService.getUser().primerApellido;
    this.model.personaEF.segundoApellido = this.authService.getUser().segundoApellido;
    this.model.personaEF.nss = this.authService.getUser().numNss;
    this.model.personaEF.curp = personaEF.curp;
    this.model.personaEF.numEmpleado = personaEF.numEmpleado;
    this.model.personaEF.idPersonaEF = personaEF.idPersonaEF;
    this.model.personaEF.cveEntidadFinanciera = personaEF.cveEntidadFinanciera;
    //this.model.entidadFinanciera = new EntidadFinanciera();
    //this.model.entidadFinanciera.id = personaEF.cveEntidadFinanciera;
    this.model.personaEF.entidadFinanciera = { ...personaEF.entidadFinanciera };
    this.model.folioNotificacion = "";
    this.model.flagNotMsj = false;
    this.model.flagAtencionNot = false;
    this.router.navigate(['/operadorEF/home', {}]);
  }

  navegar() {
    this.router.navigate(['/pensionado/home']);
  }

  openModalLogin() {
    this.modalService.open("validandoCredenciales");
  }

  closeModalLogin() {
    this.modalService.close("validandoCredenciales");
  }

  onCaptchaResolved(response: string) {
    this.captchaResponse = response;
  }

  resetVerificarCaptcha(): void {
    this.captchaResponse = null;
  }

}
