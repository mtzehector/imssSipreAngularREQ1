import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { BaseComponent } from '../../base.component';
import { Documento } from '../../domain/documento';
import { NotificacionModel } from '../../domain/notificacion.model';
import { ModalService } from '../../modal-Services/modal.service';
import { CatalogoService } from '../../services/catalogo.service';
import { RegistrarNotificacionService } from '../../services/registrar.notificacion.service';
//variables para jQuery
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-atencion-notificacion',
  templateUrl: './atencion-notificacion.component.html',
  styleUrls: ['./atencion-notificacion.component.css', '../../../common/css/tarjetas-estilos-base.css']
})
export class AtencionNotificacionComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  documentoNotificacion: Documento[] = [];
  public catalogoEstadoNotificacion: any = [];
  tempCatalogoEstadoNot: any;
  rol: string;
  notificacionAtencion: NotificacionModel;
  estado: string;

  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private registrarNotificacionService: RegistrarNotificacionService,
    private catalogoService: CatalogoService,) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = this.model.rol;
    this.model.flagDocsNotificacion = true;
    this.buildForm();
    $(function () {
      $("#edo").hide();
      $("#showfv").hide();
    });
    if (this.rol == 'operadorIMSS' || this.rol == 'adminEFSinConvenio') {
      this.prepararFechaVencimiento();
      const validators = [Validators.required];
      this.formGroup.get('estadoNotificacion').setValidators(validators);
      this.formGroup.get('estadoNotificacion').updateValueAndValidity();
      this.catalogoService.consultarEstadoNotificacion().subscribe((response: any) => {
        this.tempCatalogoEstadoNot = response;
        this.catalogoEstadoNotificacion.length = 0;
        this.tempCatalogoEstadoNot.forEach(element => {
          if (this.model.notificacionVerDetalle.notificacion.estadoNotificacion.id == 7) {
            if (element.id == 5) {
              this.catalogoEstadoNotificacion.push(element);
            }
          } else if (this.model.notificacionVerDetalle.notificacion.estadoNotificacion.id == 3) {
            if (element.id == 4 || element.id == 6) {
              this.catalogoEstadoNotificacion.push(element);
            }
          }
        });
      });
      $(function () { $("#edo").show(); });
      if (this.model.notificacionVerDetalle.notificacion.fecVencimiento != null) {
        $(function () { $("#showfv").show(); });
        this.formGroup.get('fechaNuevoVencimiento').setValidators(validators);
        this.formGroup.get('fechaNuevoVencimiento').updateValueAndValidity();
      } else {
        $(function () { $("#showfv").hide(); });
      }
    }

  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      resolucion: ['', [Validators.required, Validators.maxLength(200)]],
      estadoNotificacion: [''],
      fechaNuevoVencimiento: ['']
    });
  }

  guardarCambios() {
    this.modalService.close("confirmarEstado");
    this.modalService.open("carga");
    const form = this.formGroup.value;
    this.recuperarNotificacion();
    this.model.notificacionModel.notificacion.resolucion = form.resolucion;
    if (this.rol == 'operadorEF' || this.rol == 'adminEFSinConvenio') {
      this.model.notificacionModel.notificacion.cveEstadoNotificacion = 3;
    } else {
      if (form.fechaNuevoVencimiento == '') {
        this.model.notificacionModel.notificacion.fecVencimiento = null;
      } else {
        this.model.notificacionModel.notificacion.fecVencimiento = form.fechaNuevoVencimiento;
      }
      this.model.notificacionModel.notificacion.cveEstadoNotificacion = form.estadoNotificacion;
    }
    this.documentoNotificacion = this.model.documentosNot;
    this.model.notificacionModel.docNotificacionList = this.documentoNotificacion;
    this.registrarNotificacionService.atenderNotificacion(this.model.notificacionModel).subscribe(response => this.setNotificacion(response));
  }


  setNotificacion(response: NotificacionModel) {
    this.modalService.close("carga");
    this.model.documentosNot = new Array();
    this.model.flagDocsNotificacion = false;
    this.model.flagAtencionNot = true;
    this.model.folioNotificacion = this.model.notificacionVerDetalle.notificacion.folioNotificacion;

    switch (this.rol) {
      case 'adminEFSinConvenio':
        this.router.navigate(['/administradorEFSinConvenio/consultarNotificacion'],
          {
            queryParams:
            {
              accion: "atencion",
              status: "success",
            }
          });
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/consultarNotificacion'],
          {
            queryParams:
            {
              accion: "atencion",
              status: "success",
            }
          });
        break;
      case 'operadorIMSS':
        this.router.navigate(['/operadorIMSS/consultarNotificacion']);
        break;
      default:
        break;
    }
  }

  recuperarNotificacion() {
    this.notificacionAtencion = new NotificacionModel();
    this.model.notificacionModel.notificacion = { ...this.model.notificacionVerDetalle.notificacion };
    this.model.notificacionModel.notificacion.cveTipoNotificacion = this.model.notificacionVerDetalle.notificacion.tipoNotificacion.id;
    this.model.notificacionModel.notificacion.cveSubTipoNotificacion = this.model.notificacionVerDetalle.notificacion.subTipoNotificacion.id;
    this.model.notificacionModel.curpUsuario = this.model.persona.curp;
    this.model.notificacionModel.notificacion.cveEntidadFinanciera = this.model.notificacionVerDetalle.notificacion.entidadFinanciera.id;
  }

  prepararFechaVencimiento() {
    var self = this;
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    const datepickerConf = {
      closeText: 'Cerrar',
      prevText: '<Ant',
      dateFormat: 'dd/mm/yy',
      nextText: 'Sig>',
      currentText: 'Hoy',
      monthNames: meses,
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      showButtonPanel: true,
      minDate: +1
    };

    $("#fv").datepicker(datepickerConf);

    $("#fv").on('change', function () {
      self.formGroup.get('fechaNuevoVencimiento').setValue($(this).val());
    });

  }


  regresar() {
    switch (this.rol) {
      case 'adminEFSinConvenio':
        this.router.navigate(['/administradorEFSinConvenio/consultarNotificacion']);
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/consultarNotificacion']);
        break;
      case 'operadorIMSS':
        this.router.navigate(['/operadorIMSS/consultarNotificacion']);
        break;
      default:
        break;
    }
  }

  closeModalEstado() {
    this.modalService.close("confirmarEstado");
  }

  openModalEstado() {
    switch (this.formGroup.get('estadoNotificacion').value) {
      case '4':
        this.estado = "rechazar";
        break;
      case '5':
        this.estado = "concluir";
        break;
      case '6':
        this.estado = "cancelar";
        break;
    }
    this.modalService.open("confirmarEstado");
  }

}
