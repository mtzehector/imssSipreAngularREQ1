import { Component, OnInit, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor } from 'src/app/common/domain';
import { RegistrarPromotorService, ModalService } from 'src/app/common/services';
import { Model } from 'src/app/model';
import { DataService } from '../../data.service';
import { estadosResponse } from 'src/environments/environment';
import { UploadDocumento } from 'src/app/common/domain/upload.documento';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Documento } from 'src/app/common/domain/documento';
import { Delegacion } from 'src/app/common/domain/delegacion';

@Component({
  selector: 'app-promotor-editar',
  templateUrl: './promotor-editar.component.html',
  styleUrls: []
})
export class PromotorEditarComponent extends BaseComponent implements OnInit {
  myFormFather: FormGroup;
  public model: Model;
  public renderNumEmpleadoRegPatronal: boolean;
  public estados = estadosResponse;
  public infodata: string;
  rol: string;
  public formSubmited: boolean = false;
  dominioCorreoUsuario: string;
  dominioCorreoAdmin: string;
  cambioDominio: boolean;

  constructor(
    protected data: DataService,
    private router: Router,
    private registarPromotorService: RegistrarPromotorService,
    private modalService: ModalService,
    public location: Location,
    public fb: FormBuilder
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = 'adminEF';
    //console.log(">>> PromotorEditarComponent ngOnInit this.model.registrarPromotor=" + JSON.stringify(this.model.registrarPromotor));
    if (this.model.registrarPromotor.curp === undefined || this.model.registrarPromotor.nss == undefined) {
      this.location.back();
    }
    this.data.model.uploadDocumento = [];
    this.createForm();
    if (this.model.entidadFinanciera.correoAdminEF) {
      this.dominioCorreoAdmin = this.model.entidadFinanciera.correoAdminEF.substring(
        this.model.entidadFinanciera.correoAdminEF.indexOf('@'),
        this.model.entidadFinanciera.correoAdminEF.length
      );
    }

    if(this.model.enabledModificarPromotor == true) {
      this.model.usuario = this.model.registrarPromotor.correoElectronico.substring(
        0, this.model.registrarPromotor.correoElectronico.indexOf('@')
      );
      this.dominioCorreoUsuario = this.model.registrarPromotor.correoElectronico.substring(
        this.model.registrarPromotor.correoElectronico.indexOf('@'),
        this.model.registrarPromotor.correoElectronico.length
      );
    } else {
      this.model.usuario = "";
    }
  }

  createForm() {
    this.myFormFather = this.fb.group({});

  }

  validarRegistrar() {
    //console.log('>>>validarRegistrar');
    let registra = false;
    if (this.verifyUploads()) {
      registra = true;
    } else {
      this.data.model.mensaje.mensaje = 'Debes adjuntar los archivos requeridos.';
      this.data.model.mensaje.level = 'danger';
    }
    if (registra) {
      //console.log('>>>###validarRegistrar validaDelegaciones delegaciones.length=' + this.model.registrarPromotor.delegaciones.length);
      //console.log('>>>###validarRegistrar validaDelegaciones delegacion[2]=' + JSON.stringify(this.model.registrarPromotor.delegaciones[2]));

      registra = this.validaDelegaciones();
    }
    if (registra) {
      if (this.model.enabledModificarPromotor) {
        //console.log(">>Modificacion", JSON.stringify(this.model.registrarPromotor));
        if (!this.isEmpty(this.model.registrarPromotor.tipoEmpleado)) {
          if (this.model.registrarPromotor.tipoEmpleado === 1 && this.isEmpty(this.model.registrarPromotor.numEmpleado)) {
            console.log("numEmpleado vacio");
            return;
          }
        } else {
          console.log("tipo de empleado vacio");
          return;
        }
        if (this.isEmpty(this.model.registrarPromotor.telefono) ||
          this.isEmpty(this.model.registrarPromotor.telefonoCelular) ||
          this.isEmpty(this.model.registrarPromotor.correoElectronico)) {
          console.log("algun dato vacio");
          return;
        }

        this.model.registrarPromotor.correoElectronico = (this.cambioDominio == true)? this.model.usuario + this.dominioCorreoAdmin : this.model.usuario + this.dominioCorreoUsuario;
      }
      else {
        this.model.registrarPromotor.correoElectronico = this.model.usuario + this.dominioCorreoAdmin; 
      }

      //const regexCorreo = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
      const regexCorreo = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
      const regex = new RegExp(regexCorreo);
      if (!regex.test(this.model.registrarPromotor.correoElectronico)) {
        this.data.model.mensaje.mensaje = 'Asegúrate de que tu correo electrónico este correctamente escrito.';
        this.data.model.mensaje.level = 'danger';
        return;
      }

      if (!this.model.enabledModificarPromotor || this.cambioDominio) {
        let dominioCorreoForm = this.model.registrarPromotor.correoElectronico.substring(
          this.model.registrarPromotor.correoElectronico.indexOf('@'),
          this.model.registrarPromotor.correoElectronico.length
        );
        if (this.dominioCorreoAdmin !== dominioCorreoForm) {
          this.data.model.mensaje.mensaje = 'El correo electrónico debe corresponder al dominio de la entidad financiera';
          this.data.model.mensaje.level = 'danger';
          return;
        }
      }
      this.modalService.open('autorizarRegistrarPromotor');
    }
  }

  validaDelegaciones() {
    let i = 0;
    let registra = true;
    for (const delegacion of this.model.registrarPromotor.delegaciones) {
      //console.log(' >>>[' + i + ']validaDelegaciones delegacion=' + JSON.stringify(delegacion));
      if (delegacion.id === null || delegacion.id === undefined) {
        this.data.model.mensaje.mensaje = 'Debe seleccionar la delegacion al agregarla';
        this.data.model.mensaje.level = 'danger';
        //console.log('   >>>ERROR!!![' + i + ']validaDelegaciones delegacion=' + JSON.stringify(delegacion) + '  cveDelegacion NULL');
        registra = false;
        break;
      }
    }
    i = 0;
    if (registra) {
      for (const delegacion of this.model.registrarPromotor.delegaciones) {
        if (this.existeDelegacion(delegacion, i)) {
          this.data.model.mensaje.mensaje = 'La delegacion no puede repetirse';
          this.data.model.mensaje.level = 'danger';
          //console.log('   >>>ERROR!!![' + i + ']validaDelegaciones delegacion=' + JSON.stringify(delegacion) + ' La delegacion no puede repetirse');
          registra = false;
          break;
        }
        i++;
      }
    }
    return registra;
  }

  existeDelegacion(delegacion: Delegacion, index: Number) {
    let isFirst = true;
    let exists = false;
    let cveDelegacion = delegacion.cveDelegacion;
    //console.log('   >>>######[' + index + '] existeDelegacion delegacion=' + JSON.stringify(delegacion) + ' La delegacion no puede repetirse');
    for (const delegacionLocal of this.model.registrarPromotor.delegaciones) {
      //console.log('       >>>===???[' + index + ']  ' + cveDelegacion + '==='+cveDelegacionLocal+'?='+(cveDelegacion === cveDelegacionLocal?true:false));
      if (cveDelegacion == delegacionLocal.cveDelegacion) {
        if (isFirst) {
          isFirst = false;
        } else {
          exists = true;
          break;
        }
      }
    }
    return exists;
  }

  validarFormulario() {
    //console.log("Validacion form: ");
    //console.log(this.model.registrarPromotor);
    let varO = this.myFormFather.value;
    //console.log(varO);
  }

  closeModalRegistro() {
    this.modalService.close('autorizarRegistrarPromotor');
  }

  regresar() {
    this.router.navigate(['/administradorEF/consultarPromotor', {}]);
  }

  registrar() {
    this.formSubmited = true;
    this.closeModalRegistro();
    this.infodata = this.model.registrarPromotor.estadoVital;
    this.model.registrarPromotor.cvePerfil = this.model.cvePerfil_Promotor;
    for (let i = 0; i < this.estados.length; i++) {
      if ((parseInt(this.infodata) === (parseInt(this.estados[i].clave)))) {
        this.model.registrarPromotor.entidadFederativaNacimiento = this.estados[i].nombre;
      }
      if (this.estados[i].nombre.localeCompare(this.model.registrarPromotor.entidadFederativaNacimiento) === 0) {
        this.model.registrarPromotor.estadoVital = (this.estados[i].clave);
      }
    }
    if (this.model.registrarPromotor.estadoPersonaEf === 0) {

      this.model.registrarPromotor.estadoPersonaEf = 1;
    }
    if (this.model.registrarPromotor.estadoVital === undefined) {
      this.model.registrarPromotor.estadoVital = '0';
    }
    this.modalService.open('carga');

    this.registarPromotorService.registrarPromotor(
      this.model.registrarPromotor).subscribe((response: any) => {

        this.model.registrarPromotor.estatus = this.model.registrarPromotor.estadoPersonaEf === 1 ? 'Activo' : (this.model.registrarPromotor.estadoPersonaEf === 2 ? 'Suspendido' : 'Inactivo');

        if (!this.model.enabledModificarPromotor) {
          this.model.mostrarExitoRegistro = true;
        }

        if (this.model.enabledModificarPromotor || this.model.enabledBajaPromotor) {
          this.model.mostrarExitoModificacionBaja = true;
        }

        this.formSubmited = false;
        let statusA = "";

        if (this.model.registrarPromotor.id === undefined) {
          statusA = "post";
        } else {
          if (this.model.enabledBajaPromotor) {
            statusA = "delete";
          } else {
            statusA = "put";
          }
        }

        this.registarPromotorService.consultarDetallePromotor(this.model.registrarPromotor.curp).subscribe((response: any) => {
          this.modalService.close('carga');
          this.router.navigate(['/administradorEF/consultarPromotor'],
            {
              queryParams: {
                accion: "promotor",
                status: statusA
              }
            }
          );

        });

      },
        error => {
          this.formSubmited = false;
        });

  }

  private verifyUploads() {
    if (!this.model.enabledBajaPromotor) {
      let ifeCount = this.model.registrarPromotor.ife !== null && this.model.registrarPromotor.ife.id > 0 ? true : false;
      let cartaCount = this.model.registrarPromotor.cartaResponsiva !== null && this.model.registrarPromotor.cartaResponsiva.id > 0 ? true : false;
      let fotoCount = this.model.registrarPromotor.fotografia !== null && this.model.registrarPromotor.fotografia.id > 0 ? true : false;
      let compDomiCount = this.model.registrarPromotor.comprobanteDomicilio !== null && this.model.registrarPromotor.comprobanteDomicilio.id > 0 ? true : false;
      let i = 0;
      //this.data.model.uploadDocumento.forEach(element => console.log(">>> verifyUploads. element[" + (i++) + "]=" + JSON.stringify(element)));

      //console.log(">>> verifyUploads tipo empleado: " + this.model.registrarPromotor.tipoEmpleado + " -> ifeCount=" + ifeCount + "  cartaCount=" + cartaCount + "  fotoCount=" + fotoCount + "  compDomi=" + compDomi);
      if (this.model.registrarPromotor.tipoEmpleado == 2) {
        if (ifeCount && cartaCount && fotoCount && compDomiCount) {
          return true;
        }
      } else {
        if (ifeCount && cartaCount && fotoCount) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  isEmpty(val) {
    return (typeof val === undefined) || (val === null) || (val === '');
  }

  cambiarDominio(cambiar: boolean){
    this.cambioDominio = cambiar;
  }

}
