import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { DataService, } from "../../data.service";
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ValidarCandidatoOperadorRq } from 'src/app/common/domain/validar.candidato.operador.rq';
import { ValidarCandidatoOperadorRs } from 'src/app/common/domain/validar.candidato.operador.rs';
import { RegistroPensionadoService } from '../../common/services/registroPensionado.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalService } from 'src/app/common/services';
import { Operador } from 'src/app/common/domain/operador';
import { RegistroPatronal } from 'src/app/common/domain/registro-patronal';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-operador-registrar',
  templateUrl: './operador-registrar.component.html',
  styleUrls: ['./operador-registrar.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class OperadorRegistrarComponent extends BaseComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  public model: Model;
  public regexCurp: string = '^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeioux]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([Aa0-9]{2})$';
  public regexNSS: string = '^[0-9]{11}$';
  public formGroup: FormGroup;
  public formGroup2: FormGroup;
  public rol: string;
  //public regexCorreo: string = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
  public regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  public regexTelefono: string = '^([0-9]{10})$';
  public regexRfc: string = '[A-Z]{4}[0-9]{6}[A-Z0-9]{3}';
  public candidatoRs = new ValidarCandidatoOperadorRs();
  public formulario_1: boolean = true;
  public formulario_2: boolean = false;

  constructor(
    protected data: DataService,
    private router: Router,
    public location: Location,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private registroService: RegistroPensionadoService
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.buildForm();
    this.rol = "adminEF";
    this.model.operador = new Operador();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      curp: ['', [Validators.required, Validators.maxLength(18), Validators.minLength(18), Validators.pattern("^[a-zA-Z0-9]*$")]],
      nss: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*$')]],
    });
  }

  obtieneSolicitudValidaCandidatoOperador() : ValidarCandidatoOperadorRq {
    let solicitudValidaCandidatoOperador: ValidarCandidatoOperadorRq = new ValidarCandidatoOperadorRq();
    solicitudValidaCandidatoOperador.curp = this.formGroup.get("curp").value;
    solicitudValidaCandidatoOperador.nss = this.formGroup.get("nss").value;
    solicitudValidaCandidatoOperador.cveEntidadFinanciera = +this.model.entidadFinanciera.id;
    return solicitudValidaCandidatoOperador;
  }

  obtieneListaRegistrosPatronalesDelOperador(respuestaValidaCandidatoOperador: any): string[] {
    let listaRegistrosPatronalesDelOperador : string[] = [];
    let fechaFin: string = "9999-12-31";
    if(
      !isNullOrUndefined(respuestaValidaCandidatoOperador) && 
      !isNullOrUndefined(respuestaValidaCandidatoOperador.relacionLaboral) &&
      !isNullOrUndefined(respuestaValidaCandidatoOperador.relacionLaboral.listInfoRelacionesLaborales)
    ) {
      for (const eRelacionLaboral of respuestaValidaCandidatoOperador.relacionLaboral.listInfoRelacionesLaborales) {
        if (eRelacionLaboral.lstInfoRelacionesLaborales.fecFinRelLab == fechaFin)
          listaRegistrosPatronalesDelOperador.push(eRelacionLaboral.lstInfoRelacionesLaborales.regPatron);
      }
    }
    return listaRegistrosPatronalesDelOperador;
  }

  obtieneListaRegistrosPatronalesDeEntidadFinanciera(respuestaValidaCandidatoOperador: any): RegistroPatronal[] {
    if(
      !isNullOrUndefined(respuestaValidaCandidatoOperador) && 
      !isNullOrUndefined(respuestaValidaCandidatoOperador.registrosPatronalesOut) &&
      !isNullOrUndefined(respuestaValidaCandidatoOperador.registrosPatronalesOut.registrosPatronales)
    ) {
      return respuestaValidaCandidatoOperador.registrosPatronalesOut.registrosPatronales;
    }
    return [];
  }

  existeRegistroPatronalAdminEFEnInfoOperador(listaRegistrosPatronalesDelOperador: string[]): boolean {
    if(!isNullOrUndefined(listaRegistrosPatronalesDelOperador))
      for (const eRelacionLaboralActiva of listaRegistrosPatronalesDelOperador) {
        if (eRelacionLaboralActiva == this.model.entidadFinanciera.registroPatronal)
          return true;
      }
    return false;
  }

  existeRegistroPatronalEFEnInfoOperador(listaRegistrosPatronalesDelOperador: string[], 
    listaRegistrosPatronalesDeEntidadFinanciera: RegistroPatronal[]): boolean {
    if(
      !isNullOrUndefined(listaRegistrosPatronalesDelOperador) &&
      !isNullOrUndefined(listaRegistrosPatronalesDeEntidadFinanciera) &&
      listaRegistrosPatronalesDelOperador.length > 0 &&
      listaRegistrosPatronalesDeEntidadFinanciera.length > 0
    ) {
      for (const eRegistroPatronalOperador of listaRegistrosPatronalesDelOperador) {
        for (const eRegistroPatronalEF of listaRegistrosPatronalesDeEntidadFinanciera) {
          if (eRegistroPatronalOperador == eRegistroPatronalEF.registroPatronal) {
            return true;
          }
        }
      }
    }
    return false;
  }

  llenarInformacionDelOperador(response: any) {
    this.model.operador.candidatoRs = response;
    this.model.operador.candidatoRs.registroPatronalValido = response.relacionLaboral.registroPatronalActual;
    this.model.operador.nombre = response.renapoRequest.renapoCurpOut.nombres;
    this.model.operador.primerApellido = response.renapoRequest.renapoCurpOut.apellido1;
    this.model.operador.segundoApellido = response.renapoRequest.renapoCurpOut.apellido2;
    this.model.operador.fecNacimiento = response.renapoRequest.renapoCurpOut.fechNac;
    this.model.operador.sexo = response.renapoRequest.renapoCurpOut.sexo;
    this.model.operador.desEntidadNac = response.renapoRequest.renapoCurpOut.desEntidadNac;
    this.model.operador.renapoOut = response.renapoRequest.renapoCurpOut;
  }

  continuaEdicionOperador() {
    this.router.navigate(
      ['/administradorEF/editarOperador'],
      {queryParams: {accion: "operador",status: "create"}}
    );
  }

  closeModal(tituloModal: string) {
    this.modalService.close(tituloModal);
  }

  existeRegistroPatronalEFEnRespuestaValidaCandidatoOperador(respuestaValidaCandidatoOperador: any): boolean {
    let listaRegistrosPatronalesDelOperador: string[] = 
      this.obtieneListaRegistrosPatronalesDelOperador(respuestaValidaCandidatoOperador);

    if(listaRegistrosPatronalesDelOperador.length > 0) {
      if(this.existeRegistroPatronalAdminEFEnInfoOperador(listaRegistrosPatronalesDelOperador))
        return true;

      if(this.existeRegistroPatronalEFEnInfoOperador(listaRegistrosPatronalesDelOperador,
        this.obtieneListaRegistrosPatronalesDeEntidadFinanciera(respuestaValidaCandidatoOperador)))
        return true;
    }

    return false;
  }

  ejecutaProcesoCandidatoValido(respuestaValidaCandidatoOperador: any) {
    this.llenarInformacionDelOperador(respuestaValidaCandidatoOperador);
    this.closeModal("carga");
    this.continuaEdicionOperador();
  }

  ejecutaProcesoCandidatoNoValido(mensajeDeError: string) {
    this.model.mensaje.level = "danger";
    this.model.mensaje.mensaje = mensajeDeError;
    this.closeModal("carga");
  }

  openModal(tituloModal: string) {
    this.modalService.open(tituloModal);
  }

  validarCandidato() {
    this.openModal("carga");
    this.registroService.validar(this.obtieneSolicitudValidaCandidatoOperador()).subscribe(
      {
        next: respuestaValidaCandidatoOperador => {
          if(this.existeRegistroPatronalEFEnRespuestaValidaCandidatoOperador(respuestaValidaCandidatoOperador))
              this.ejecutaProcesoCandidatoValido(respuestaValidaCandidatoOperador);
          else
            this.ejecutaProcesoCandidatoNoValido(
              "La persona que estas intentando registrar NO pertenece a la Entidad Financiera.");
        },
        error: error => {
          this.ejecutaProcesoCandidatoNoValido(
            "Los datos estadisticos no coinciden entre RENAPO y BDTU.");
        }
      }
    );
  }

  regresar() {
    this.router.navigate(['/administradorEF/home', {}]);
  }
}
