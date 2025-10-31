import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Documento, Mensaje, Notificacion, NotificacionPrestamo } from 'src/app/common/domain';
import { NotificacionModel } from 'src/app/common/domain/notificacion.model';
import { Prestamo } from 'src/app/common/domain/prestamo.not';
import { Persona } from 'src/app/common/persona';
import { DataService, ModalService, RegistrarNotificacionService } from 'src/app/common/services';
import { Model } from 'src/app/model';

@Component({
  selector: 'app-registro-comunicado-common',
  templateUrl: './registro-comunicado-common.component.html',
  styleUrls: ['./registro-comunicado-common.component.css', '../css/tarjetas-estilos-base.css']
})
export class RegistroComunicadoCommonComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  verPrestamo: boolean = false;
  notificaionPrestamo: NotificacionPrestamo;
  regexFolio: string = '^[0-9]{11}-[0-9]{1}$';
  public idborrarPrestamo: any;
  public model: Model;
  public catalogoEntidadFinanciera: any;
  public catalogoTipoNotificacion: any;
  public catalogoSubTipoNotificacion: any;
  public tempSubTipoNotificacion: any[];
  public tempTipoNotificacion: any[];
  public tempEntidadFinanciera: any[];
  public validateFechaVencimiento: boolean;
  public fechaActal: string;
  public fecVencimiento: string;
  public rol: string;
  notificacion: Notificacion = new Notificacion();
  NotificacionBusqueda = new Notificacion();
  mensajeExito: Mensaje = new Mensaje();
  folioRequerido: boolean;
  documentoNotificacion: Documento[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    protected data: DataService,
    private registrarNotificacionService: RegistrarNotificacionService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = this.model.rol;
    this.notificaionPrestamo = new NotificacionPrestamo();
    this.actualizaMensaje("", "");
    this.buildForm();
    this.model.flagDocsNotificacion = true;
  }

  actualizaMensaje(mensaje: string, level: string) {
    this.mensajeExito.mensaje = mensaje;
    this.mensajeExito.level = level;
  }

  private obtenerEntidadFinancieraId() {
    switch (this.rol) {
      case 'adminEFSinConvenio':
        return this.model.entidadFinanciera.id;
      case 'operadorEF':
        return this.model.personaEF.cveEntidadFinanciera;
      default:
        return null;
    }
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      entidadFinanciera: [this.obtenerEntidadFinancieraId(), [Validators.required]],
      tipoNotificacion: [6, [Validators.required]],
      tipoSecundario: [16, [Validators.required]],
      desc: ['', [Validators.required]],
      folio: ['', [Validators.minLength(13), Validators.pattern(this.regexFolio)]]
    });
  }

  guardarCambios() {
    this.modalService.open("carga");
    const form = this.formGroup.value;
    this.notificacion.cveEntidadFinanciera = form.entidadFinanciera;
    this.notificacion.cveTipoNotificacion = form.tipoNotificacion;
    this.notificacion.cveSubTipoNotificacion = form.tipoSecundario;
    this.notificacion.descNotificacion = form.desc;
    this.notificacion.cveEstadoNotificacion = 7;
    this.model.notificacionModel.notificacion = this.notificacion;
    this.model.notificacionModel.notificacion.notPrestamo = { ...this.notificaionPrestamo };
    this.documentoNotificacion = this.model.documentosNot;
    this.model.notificacionModel.docNotificacionList = this.documentoNotificacion;
    this.model.notificacionModel.curpUsuario = this.model.persona.curp;
    this.registrarNotificacionService.registrarNotificacion(this.model.notificacionModel).
      subscribe(respuestaRegistrarNotificacion => this.setNotificacion(respuestaRegistrarNotificacion));
  }

  setNotificacion(respuestaRegistrarNotificacion: NotificacionModel) {
    this.modalService.close("carga");
    this.model.flagNotMsj = true;
    this.model.documentosNot = new Array();
    this.model.flagDocsNotificacion = false;
    this.model.folioNotificacion = respuestaRegistrarNotificacion.notificacion.folioNotificacion;


    switch (this.rol) {
      case 'adminEFSinConvenio':
        this.router.navigate(['/administradorEFSinConvenio/consultarNotificacion'],
        {
          queryParams:
          {
            accion: "comunicado",
            status: "success",
          }
        });
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/consultarNotificacion'],  
        {
          queryParams:
          {
            accion: "comunicado",
            status: "success",
          }
        });
        break;
      default:
        break;
    }
  }

  buscarPrestamo() {
    if (this.formGroup.get('folio').value != null && this.formGroup.get('folio').value != "") {
      this.modalService.open("carga");
      this.folioRequerido = false;
      this.verPrestamo = false;
      this.registrarNotificacionService.
        consultarFolioPrestamo(this.formGroup.get('folio').value,
          this.formGroup.get('entidadFinanciera').value).
        subscribe(respuestaConsultaFolioPrestamo => this.setResponseBusqueda(respuestaConsultaFolioPrestamo));
    } else {
      this.folioRequerido = true;
    }
  }

  setResponseBusqueda(respuestaConsultaFolioPrestamo: Prestamo) {
    let prestamo: Prestamo = new Prestamo();
    prestamo.curp = respuestaConsultaFolioPrestamo.curp;
    prestamo.desPlazo = respuestaConsultaFolioPrestamo.desPlazo;
    prestamo.desTipoCredito = respuestaConsultaFolioPrestamo.desTipoCredito;
    prestamo.fechaAlta = respuestaConsultaFolioPrestamo.fechaAlta;
    prestamo.impMontoSol = respuestaConsultaFolioPrestamo.impMontoSol;
    prestamo.cat = respuestaConsultaFolioPrestamo.cat;
    prestamo.nss = respuestaConsultaFolioPrestamo.nss;
    prestamo.id = respuestaConsultaFolioPrestamo.id;
    prestamo.cveSolicitud = respuestaConsultaFolioPrestamo.cveSolicitud;
    prestamo.fechaVencimiento = respuestaConsultaFolioPrestamo.fechaVencimiento;
    prestamo.numSolicitud = respuestaConsultaFolioPrestamo.numSolicitud;
    prestamo.desEstadoPrestamo = respuestaConsultaFolioPrestamo.desEstadoPrestamo;
    let pensionado: Persona = new Persona();
    pensionado.nombre = respuestaConsultaFolioPrestamo.pensionado.nombre;
    pensionado.primerApellido = respuestaConsultaFolioPrestamo.pensionado.primerApellido;
    pensionado.segundoApellido = respuestaConsultaFolioPrestamo.pensionado.segundoApellido;
    prestamo.pensionado = pensionado;
    let notPrestamo: NotificacionPrestamo = new NotificacionPrestamo();
    notPrestamo.prestamoResponse = prestamo;
    let notificacion: Notificacion = new Notificacion();
    notificacion.notPrestamo = notPrestamo;
    this.model.notificacionModel.notificacion = notificacion;
    this.verPrestamo = true;
    this.modalService.close("carga");
  }

  limpiarPrestamo() {
    this.verPrestamo = false;
    this.formGroup.get('folio').setValue(null);
  }

  agregarPrestamo() {
    let prestamo: Prestamo = new Prestamo();
    prestamo.numSolicitud = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.numSolicitud;
    prestamo.desPlazo = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.desPlazo;
    prestamo.id = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.id;
    prestamo.cveSolicitud = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.cveSolicitud;
    let pensionado: Persona = new Persona();
    pensionado.nombre = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.pensionado.nombre
    pensionado.primerApellido = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.pensionado.primerApellido;
    pensionado.segundoApellido = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.pensionado.segundoApellido;
    prestamo.pensionado = pensionado;
    this.notificaionPrestamo.prestamoList.push(prestamo);
    this.limpiarPrestamo();
  }

  openModalPrestamo(id: number) {
    this.idborrarPrestamo = id;
    this.modalService.open("eliminarPrestamo");
  }

  closeModalPrestamo() {
    this.idborrarPrestamo = '';
    this.modalService.close("eliminarPrestamo");
  }

  borrarPrestamo(id: number) {
    const index = this.notificaionPrestamo.prestamoList.findIndex(x => x.id === id);
    if (index !== undefined) {
      this.notificaionPrestamo.prestamoList.splice(index, 1);
    }
    this.actualizaMensaje("El préstamo ha sido eliminado con éxito.", "success");
    this.closeModalPrestamo();
  }

  regresarANotificaciones() {
    switch (this.rol) {
      case 'adminEFSinConvenio':
        this.router.navigate(['/administradorEFSinConvenio/consultarNotificacion']);
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/consultarNotificacion']);
        break;
      default:
        break;
    }
  }
}
