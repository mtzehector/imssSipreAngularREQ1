import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Model } from 'src/app/model';
import { BaseComponent } from '../base.component';
import { Mensaje } from '../domain/mensaje';
import { NotificacionConsulta } from '../domain/notificacion.consulta';
import { NotificacionConsultaResponse } from '../domain/notificacion.consulta.response';
import { Page } from '../domain/page';
import { ModalService } from '../modal-Services';
import { CatalogoService } from '../services/catalogo.service';
import { NotificacionService } from '../services/notificacion.service';
import { NotificacionVerDetalleService } from '../services/notificacion.ver.detalle.service';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-busqueda-notificacion',
  templateUrl: './busqueda-notificacion.component.html',
  styleUrls: ['./busqueda-notificacion.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class BusquedaNotificacionComponent extends BaseComponent implements OnInit {

  @Input() rol: string;
  @Input() cveEntidadF: any;
  formGroup: FormGroup;
  public model: Model;
  buscarDisable: boolean = false;
  showResult: boolean;
  flujo: boolean = false;
  validadorFechas: boolean = false;
  mensajeExito: Mensaje = new Mensaje();
  public catalogoEntidadFinanciera: any[];
  public catalogoTipoNotificacion: any;
  public catalogoSubTipoNotificacion: any;
  public catalogoEstadoNotificacion: any;
  public tempSubTipoNotificacion: any[];
  tempEntidadFinanciera: any;
  consultaNotifRequest: NotificacionConsulta;
  pageConsultaNotificacion: Page<NotificacionConsultaResponse>;
  regexNSS: string = "^(15|90|91|92|93|94|95|96|97|68|01|06|07|10|11|17|66|20|27|28|29|70|30|36|37|38|39|40|69|42|44|45|46|51|21|25|22|81|32|52|71|53|15|55|03|43|47|33|35|31|12|72|13|04|54|56|16|23|26|24|57|83|09|49|08|78|02|62|48|14|82|41|61|65|58|05|67|59|84|85|34   )([0-9]{2})([0-9]{2})([0-9]{4})([0-9]{1})$";
  regexFolio: string = "^[0-9]*$";
  regexFolioPrestamo: string = '^[0-9]{11}-[0-9]{1}$';

  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private catalogoService: CatalogoService,
    private notificacionService: NotificacionService,
    private notificacionVerDetalleService: NotificacionVerDetalleService) {
    super(data);
    this.model = this.data.model;
  }


  ngOnInit() {
    this.buildForm();
    this.prepararFechas();
    this.consultarCatalogos();
    this.onChanges();
    this.showResult = false;
    this.route.queryParams
      .subscribe(params => {
        if (params.accion == "atencion" && params.status == "success") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "El folio " + this.model.folioNotificacion + " ha sido actualizado con éxito.";
        }
        if (params.accion == "comunicado" && params.status == "success") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "La notificación se ha guardado con éxito, con el folio " + this.model.folioNotificacion;
        }
      });
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      estadoNotificacion: [''],
      entidadFinanciera: [''],
      tipoNotificacion: [''],
      tipoSecundario: [''],
      numeroSocial: ['', [Validators.minLength(11), Validators.pattern(this.regexNSS)]],
      folioNotificacion: ['', [Validators.minLength(7), Validators.pattern(this.regexFolio)]],
      folioPrestamo: ['', [Validators.minLength(13), Validators.pattern(this.regexFolioPrestamo)]],
      fechaIncioRegistro: [''],
      fechaFinRegistro: [''],
      fechaInicioVencimiento: [''],
      fechaFinVencimiento: ['']
    });
    this.formGroup.get('fechaFinRegistro').valueChanges.subscribe(value => {
      var fehcaInicio = this.formGroup.get('fechaIncioRegistro').value;
      if (fehcaInicio == " " || fehcaInicio == "") {
        this.formGroup.get('fechaFinRegistro').setErrors({ 'fechaInicioSinValor': true });
      }
    });
    this.formGroup.get('fechaFinVencimiento').valueChanges.subscribe(value => {
      var fehcaInicio = this.formGroup.get('fechaInicioVencimiento').value;
      if (fehcaInicio == " " || fehcaInicio == "") {
        this.formGroup.get('fechaFinVencimiento').setErrors({ 'fechaInicioSinValor': true });
      }
    });
  }

  private consultarCatalogos() {
    this.catalogoService.consultarEntidadFinanciera().subscribe((response: any) => {
      this.tempEntidadFinanciera = response;
      if (this.rol == 'adminEFSinConvenio' || this.rol == "operadorEF") {
        this.catalogoEntidadFinanciera = new Array();
        this.tempEntidadFinanciera.forEach(element => {
          if (element.id == this.cveEntidadF) {
            this.catalogoEntidadFinanciera.push(element);
          }
        });
      } else {
        this.catalogoEntidadFinanciera = this.tempEntidadFinanciera;
      }
    });

    this.catalogoService.consultarTipoNotificacion().subscribe((response: any) => {
      this.catalogoTipoNotificacion = response;
    });

    this.catalogoService.consultarSubTipoNotificacion().subscribe((response: any) => {
      this.catalogoSubTipoNotificacion = response;
    });

    this.catalogoService.consultarEstadoNotificacion().subscribe((response: any) => {
      this.catalogoEstadoNotificacion = response;
    });

    this.tempSubTipoNotificacion = new Array();
  }

  onChanges(): void {
    this.formGroup.get('tipoNotificacion').valueChanges.subscribe((val: string) => {

      this.formGroup.get('tipoSecundario').setValue("-1");
      this.formGroup.get('tipoSecundario').clearValidators();
      this.formGroup.get('tipoSecundario').updateValueAndValidity();

      this.tempSubTipoNotificacion.length = 0;
      this.catalogoSubTipoNotificacion.forEach(element => {
        if (element.cveTipoNotificacion == val) {
          this.tempSubTipoNotificacion.push(element);
        }
      });
    });
  }

  prepararFechas() {
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
      showButtonPanel: true
    };
    var dateFormat = 'dd/mm/yy',
      from = $("#fechaIncioRegistro")
        .datepicker(datepickerConf)
        .on("change", function () {
          to.datepicker("option", "minDate", getDate(this));
        }),
      to = $("#fechaFinRegistro").datepicker(datepickerConf)
        .on("change", function () {
          from.datepicker("option", "maxDate", getDate(this));
        });

    var de = $("#fechaInicioVencimiento")
      .datepicker(datepickerConf)
      .on("change", function () {
        a.datepicker("option", "minDate", getDate(this));
      }),
      a = $("#fechaFinVencimiento").datepicker(datepickerConf)
        .on("change", function () {
          de.datepicker("option", "maxDate", getDate(this));
        });

    function getDate(element) {
      var date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value);
      } catch (error) {
        date = null;
      }
      return date;
    }
    $("#fechaIncioRegistro").on('change', function () {
      self.formGroup.get('fechaIncioRegistro').setValue($(this).val());
    });
    $("#fechaFinRegistro").on('change', function () {
      self.formGroup.get('fechaFinRegistro').setValue($(this).val());
    });
    $("#fechaInicioVencimiento").on('change', function () {
      self.formGroup.get('fechaInicioVencimiento').setValue($(this).val());
    });
    $("#fechaFinVencimiento").on('change', function () {
      self.formGroup.get('fechaFinVencimiento').setValue($(this).val());
    });

  }

  buscarNotificacion() {
    let flag = false;
    Object.keys(this.formGroup.controls).forEach(key => {
      if (this.formGroup.get(key).value != '' && this.formGroup.get(key).value != null) {
        flag = true;
      }
    });
    if (flag) {
      this.modalService.open("carga");
      let form = this.formGroup.value;
      this.consultaNotifRequest = new NotificacionConsulta();
      this.consultaNotifRequest.page = 1;
      if (this.rol == 'adminEFSinConvenio' || this.rol == 'operadorEF') {
        this.consultaNotifRequest.model.cveEntidadFinanciera = this.cveEntidadF;
      } else {
        this.consultaNotifRequest.model.cveEntidadFinanciera = form.entidadFinanciera;
      }
      this.consultaNotifRequest.model.cveTipoNotificacion = form.tipoNotificacion;
      this.consultaNotifRequest.model.cveSubTipoNotificacion = form.tipoSecundario != -1 ? form.tipoSecundario : '';
      this.consultaNotifRequest.model.cveEstadoNotificacion = form.estadoNotificacion;
      this.consultaNotifRequest.model.nss = form.numeroSocial;
      this.consultaNotifRequest.model.folioNotificacion = form.folioNotificacion;
      this.consultaNotifRequest.model.folioPrestamo = form.folioPrestamo;
      if (form.fechaIncioRegistro != null && form.fechaIncioRegistro != "") {
        this.consultaNotifRequest.model.fechaRegistroInicio = form.fechaIncioRegistro;
        this.consultaNotifRequest.model.fechaRegistroFin = form.fechaFinRegistro;
      }
      if (form.fechaInicioVencimiento != null && form.fechaInicioVencimiento != "") {
        this.consultaNotifRequest.model.fechaVencimientoInicio = form.fechaInicioVencimiento;
        this.consultaNotifRequest.model.fechaVencimientoFin = form.fechaFinVencimiento;
      }
      this.notificacionService.getNotificaciones(this.consultaNotifRequest).subscribe((response: Page<NotificacionConsultaResponse>) => this.setBusquedaNotificacion(response));
    } else {
      this.model.mensaje.mensaje = "Captura alguno de los campos de búsqueda.";
      this.model.mensaje.level = "danger";
      return;
    }
  }

  setBusquedaNotificacion(response: Page<NotificacionConsultaResponse>) {
    this.pageConsultaNotificacion = new Page<NotificacionConsultaResponse>();
    this.pageConsultaNotificacion.init(response);
    this.showResult = true;
    this.modalService.close("carga");
  }

  limpiar() {
    this.formGroup.reset();
    this.showResult = false;
  }

  onPaged(page: number) {
    this.consultaNotifRequest.page = page;
    this.notificacionService.getNotificaciones(this.consultaNotifRequest)
      .subscribe((response: Page<NotificacionConsultaResponse>) => this.setBusquedaNotificacion(response));
    this.pageConsultaNotificacion.number = page - 1;
    this.pageConsultaNotificacion.prepare();
  }

  closeModalNoExistenDatos() {
    this.modalService.close("noExistenDatos");
  }

  openModalPrestamo() {
    this.modalService.open("noExistenDatos");
  }

  openModalFechas() {
    this.modalService.open("noExistenFechas");
  }

  closeModalNoExistenFechas() {
    this.modalService.close("noExistenFechas");
  }

  registrarNotificacion() {
    this.router.navigate(['/operadorIMSS/registrarNotificacion']);
  }

  registrarComunicado() {
    switch (this.rol) {
      case 'adminEFSinConvenio':
        this.router.navigate(['/administradorEFSinConvenio/registrarComunicado']);
        break;
      case 'operadorEF':
        this.router.navigate(['/operadorEF/registrarComunicado']);
        break;
      default:
        break;
    }
  }

  irDetalle(cveNotificacion: number) {
    switch (this.rol) {
      case 'adminEFSinConvenio':
        this.notificacionVerDetalleService.getNotificacionPorIdNotificacionYIdEF(cveNotificacion, this.cveEntidadF).subscribe(data => {
          this.model.notificacionVerDetalle = data;
          this.router.navigate(['/administradorEFSinConvenio/consultarNotificacionDetalle', {}]);
        });
        break;
      case 'operadorEF':
        this.notificacionVerDetalleService.getNotificacionOpEF(cveNotificacion, this.cveEntidadF).subscribe(data => {
          this.model.notificacionVerDetalle = data;
          this.router.navigate(['/operadorEF/consultarNotificacionDetalle', {}]);

        });
        break;
      case 'operadorIMSS':
        this.notificacionVerDetalleService.getNotificacionOpIMSS(cveNotificacion).subscribe(data => {
          this.model.notificacionVerDetalle = data;
          this.router.navigate(['/operadorIMSS/consultarNotificacionDetalle', {}]);
        });
        break;
      default:
        break;
    }

  }
}
