import { Component, OnInit, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/services';
import { Model } from 'src/app/model';
import { DataService } from '../../data.service';
import { UploadDocumento } from 'src/app/common/domain/upload.documento';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Documento } from 'src/app/common/domain/documento';
import { RegistroPensionado } from '../../common/domain/registro-pensionado';
import { RegistroPensionadoService } from 'src/app/common/services/registroPensionado.service';
import { OperadorService } from 'src/app/common/services/operador.service';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { EstadoPersonaEF } from 'src/app/common/domain/estadoPersonaEF';


@Component({
  selector: 'app-operador-editar',
  templateUrl: './operador-editar.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class OperadorEditarComponent extends BaseComponent implements OnInit {
  myFormFather: FormGroup;
  public model: Model;
  public infodata: string;
  rol: string;
  public formGroup2: FormGroup;
  //public regexCorreo: string = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
  public regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  public regexTelefono: string = '^([0-9]{10})$';
  public regexRfc: string = '[A-Z]{4}[0-9]{6}[A-Z0-9]{3}';
  public labelSubmit: string = "Registrar";
  public labelModal: string;
  public title: string;
  public fecha: string;
  public fecdate: Date;
  registro: string;
  dominioCorreoUsuario: string;
  dominioCorreoAdmin: string;
  cambioDominio: boolean = false;
  firmaDocumentoPermiso: boolean = false;


  constructor(
    protected data: DataService,
    private router: Router,
    private modalService: ModalService,
    public location: Location,
    public formBuilder: FormBuilder,
    private registroService: RegistroPensionadoService,
    private operadorService: OperadorService,
    private bitacoraService: BitacoraService,
    private route: ActivatedRoute
  ) {
    super(data);
    this.model = this.data.model;
  }

  firmaDocumentoValidacion(){
    if(this.model.operador.firmaCartaRecibo > 0){
      this.firmaDocumentoPermiso = true;
    } else {
      this.firmaDocumentoPermiso = false;
    }
  }

  cambioFirma(check: boolean) {
    if(check) {
      this.firmaDocumentoPermiso = false;
      this.model.operador.firmaCartaRecibo = 0;
    } else {
      this.firmaDocumentoPermiso = true;
      this.model.operador.firmaCartaRecibo = 1;
    }
  }
  ngOnInit() {
    this.firmaDocumentoPermiso = false;
    
    this.fecha = this.model.operador.fecNacimiento;
    this.fecdate = new Date();
    this.fecdate.setDate(parseInt((this.fecha.split('/'))[0]));
    this.fecdate.setMonth((parseInt((this.fecha.split('/'))[1]) - 1));
    this.fecdate.setFullYear(parseInt((this.fecha.split('/'))[2]));

    this.buildForm();
    this.rol = 'adminEF';

    if (this.model.operador.operacionRegistro != 'new') {
      this.labelSubmit = "Guardar";
      this.formGroup2.patchValue({
        rfc: this.model.operador.rfc,
        numEmpleado: this.model.operador.numEmpleado,
        telefono: this.model.operador.telCelular,
        correoElectronico: this.model.operador.correoElectronico
      });
      this.formGroup2.get('rfc').updateValueAndValidity();
      this.formGroup2.get('numEmpleado').updateValueAndValidity();
      this.formGroup2.get('telefono').updateValueAndValidity();
      this.formGroup2.get('correoElectronico').updateValueAndValidity();

      this.formGroup2.get('rfc').markAsTouched();
      this.formGroup2.get('numEmpleado').markAsTouched();
      this.formGroup2.get('telefono').markAsTouched();
      this.formGroup2.get('correoElectronico').markAsTouched();
    }

    this.route.queryParams
      //.filter(params => params.cveSol)
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        if (this.model.entidadFinanciera.correoAdminEF) {
          this.dominioCorreoAdmin = this.model.entidadFinanciera.correoAdminEF.substring(
            this.model.entidadFinanciera.correoAdminEF.indexOf('@'),
            this.model.entidadFinanciera.correoAdminEF.length
          );
        }

        if (params.accion == "operador" && params.status == "update") {
          this.registro = "update";
          this.title = "Modificar Operador de Entidad Financiera";
          this.firmaDocumentoValidacion();
          this.model.usuario = this.model.operador.correoElectronico.substring(
            0, this.model.operador.correoElectronico.indexOf('@')
          );
          this.dominioCorreoUsuario = this.model.operador.correoElectronico.substring(
            this.model.operador.correoElectronico.indexOf('@'),
            this.model.operador.correoElectronico.length
          );
        }

        if (params.accion == "operador" && params.status == "create") {
          this.registro = "create";
          this.title = "Agregar Operador de Entidad Financiera";
          this.model.usuario = "";
        }

        if (this.registro=='update')
          this.formGroup2.get('correoElectronico').disable();
        
      });
  }

  private buildForm() {

    this.formGroup2 = this.formBuilder.group({
      rfc: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern(this.regexRfc)]],
      numEmpleado: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(20)]],
      telefono: ['', [Validators.required, Validators.pattern(this.regexTelefono)]],
      //correoElectronico: ['', [Validators.required, Validators.pattern(this.regexCorreo)]],
      correoElectronico: ['', [Validators.required]],
    });

  }

  cancelar() {
    this.closeModal("autorizarRegistrarOperador");
  }
  confirmar() {

    if (this.model.operador.operacionRegistro == 'new') {
      this.labelModal = "¿Estás seguro de registrar la información de " + this.model.operador.nombre + " " + this.model.operador.primerApellido + " " + this.model.operador.segundoApellido + "?";
    } else {
      this.labelModal = "¿Estás seguro de modificar la información de " + this.model.operador.nombre + " " + this.model.operador.primerApellido + " " + this.model.operador.segundoApellido + "?";
    }

    this.openModal("autorizarRegistrarOperador");
  }

  registrarCandidato() {
    this.closeModal("autorizarRegistrarOperador");
    if (this.verifyUploads()) {
      this.openModal("carga");

      let registro = new RegistroPensionado();
      //registro = this.formGroup.value;
      //registro.correo = this.formGroup2.controls['correoElectronico'].value;
      registro.numTelefono = this.formGroup2.controls['telefono'].value;
      registro.curp = this.model.operador.candidatoRs.curp;
      registro.nss = this.model.operador.candidatoRs.nss;
      registro.rfc = this.formGroup2.controls['rfc'].value;
      registro.numEmpleado = this.formGroup2.controls['numEmpleado'].value;
      registro.registroPatronal = this.model.entidadFinanciera.registroPatronal;
      registro.cvePerfil = 4;
      registro.cveEntidadFinanciera = Number(this.model.entidadFinanciera.id);

      registro.otrosDatosJson = '{"documentIdentificacionOficialId":' + this.data.model.uploadDocumento[(this.data.model.uploadDocumento.length - 1)].id + '}';

      console.log("Registrar Operador : ", registro);
      //this.buttonSubmitStatus2 = false;
      let correoElectronico = null;
      if (this.model.operador.operacionRegistro == 'new') {
        correoElectronico = this.model.usuario + this.dominioCorreoAdmin;
        if(!this.validaCorreo(correoElectronico)){
          return;
        }
        registro.correo = correoElectronico;
        let correoForm = correoElectronico.substring(
          correoElectronico.indexOf('@'),
          correoElectronico.length
        );
        if (!this.validaDominio(correoForm)) {
          return;
        }

        if(this.model.operador.firmaCartaRecibo === undefined) {
          registro.firmaCartaRecibo = 0;
        } else {
          registro.firmaCartaRecibo = this.model.operador.firmaCartaRecibo;
        }

        this.registroService.registrarUsuario(registro).subscribe(response => {
          let bitacora: Bitacora = new Bitacora();
          bitacora.curp = this.data.model.persona.curp;
          bitacora.sesion = this.data.model.sesion;
          bitacora.tipo = TipoBitacora.REGISTRO_OPERADOR_EF;
          this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log("Registro"));

          this.closeModal("carga");
          this.router.navigate(['/administradorEF/home'],
            {
              queryParams:
              {
                accion: "operador",
                status: "added",
              }
            });
        });
      } else {
        let statusAux = "updated";
        if (this.registro == "update" && this.cambioDominio) {
          correoElectronico = this.model.usuario + this.dominioCorreoAdmin;
          let correoForm = correoElectronico.substring(
            correoElectronico.indexOf('@'),
            correoElectronico.length
          );
          if (!this.validaDominio(correoForm)) {
            return;
          }
        }else if(this.registro == "update" && !this.cambioDominio){
          correoElectronico = this.model.usuario + this.dominioCorreoUsuario;
        }
        if(!this.validaCorreo(correoElectronico)){
          return;
        }
        //if (this.model.operador.correoElectronico != this.formGroup2.controls['correoElectronico'].value) {
        if (this.model.operador.correoElectronico != correoElectronico) {
          statusAux = "updatedMail";
        }
        this.model.operador.correoElectronico = correoElectronico;
        //this.model.operador.correoElectronico = this.formGroup2.controls['correoElectronico'].value;
        this.model.operador.telCelular = this.formGroup2.controls['telefono'].value;
        this.model.operador.registroPatronal = this.model.entidadFinanciera.registroPatronal;
        this.model.operador.rfc = this.formGroup2.controls['rfc'].value;
        this.model.operador.numEmpleado = this.formGroup2.controls['numEmpleado'].value;
        this.model.operador.documentoIdentOficial.id = this.data.model.uploadDocumento[0].id;
        this.model.operador.cveEstadoPersonaEf = new EstadoPersonaEF();
        this.model.operador.cveEstadoPersonaEf.id = this.model.operador.idEstadoPersonaEF;
        this.model.operador.cveEstadoPersonaEf.desEstadoPersonaEf = this.model.operador.desEstadoPersonaEf;

        console.log("Actualizar Operador : ", this.model.operador);

        this.operadorService.updateOperador(this.model.operador).subscribe(response => {
          this.closeModal("carga");

          this.router.navigate(['/administradorEF/home'],
            {
              queryParams:
              {
                accion: "operador",
                status: statusAux,
              }
            });

        }, error => {
          console.log("Error", error);
          this.closeModal("carga");
          this.data.model.mensaje.mensaje = error.error.message;
          this.data.model.mensaje.level = "danger";
        });
      }

    } else {
      this.data.model.mensaje.mensaje = 'Debes adjuntar los archivos requeridos.';
      this.data.model.mensaje.level = 'danger';
    }
  }

  private verifyUploads() {

    let ifeCount = 0;
    let i = 0;
    this.data.model.uploadDocumento.forEach(element => console.log(''));
    this.data.model.uploadDocumento.forEach(element => {
      switch (element.tipoDocumento) {
        case (4): ifeCount++; break;
        default: break;
      }
    });
    //  console.log(">>> verifyUploads -> ifeCount=" + ifeCount);
    if (ifeCount > 0) {
      //this.setUniqueUploadDocuments();
      return true;
    }

    return false;

  }

  closeModal(tituloModal) {
    this.modalService.close(tituloModal);
  }

  openModal(tituloModal) {
    this.modalService.open(tituloModal);
  }

  regresar() {
    this.router.navigate(['/administradorEF/registrarOperador']);
  }

  validaCorreo(correo: string) {
    const regex = new RegExp(this.regexCorreo);
    if (!regex.test(correo)) {
      this.data.model.mensaje.mensaje = 'Asegúrate de que tu correo electrónico este correctamente escrito.';
      this.data.model.mensaje.level = 'danger';
      return false;
    }
    return true;
  }

  validaDominio(dominioCorreoForm: string){
    if (this.dominioCorreoAdmin !== dominioCorreoForm) {
      this.data.model.mensaje.mensaje = 'El correo electrónico debe corresponder al dominio de la entidad financiera';
      this.data.model.mensaje.level = 'danger';
      return false;
    }
    return true;
  }

  cambiaDominio(){
    this.cambioDominio = true;
    this.formGroup2.get('correoElectronico').enable();
  }

}
