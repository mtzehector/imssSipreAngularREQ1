import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { BusquedaCepCompraRequest } from "src/app/common/domain/busqueda.cep.compra.request";
import { CepCompras } from "src/app/common/domain/CepCompras";
import { Page } from "src/app/common/domain/page";
import { ConsultarCepCompraService } from "src/app/common/services/consultar.cep.compra.service";
import { DataService } from "src/app/data.service";
import { ModalService } from 'src/app/common/modal-Services';
import { isNullOrUndefined } from "util";

declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-busqueda-cep-compra',
  templateUrl: './busqueda-cep-compra.component.html',
  styleUrls: ['../css/tarjetas-estilos-base.css']
})
export class ConsultarCepCompraComponent extends BaseComponent implements OnInit {

  busquedaCepCompraRequest: BusquedaCepCompraRequest = new BusquedaCepCompraRequest();
  rol: string;
  pageCepCompras: Page<CepCompras> = new Page<CepCompras>();
  fechaInicioConsulta: string;
  fechaFinConsulta: string;


  constructor(
    protected data: DataService,
    private consultarCepCompraService: ConsultarCepCompraService,
    private modalService: ModalService,) {
    super(data);
    this.model = this.data.model;
    this.limpiar();
  }

  ngOnInit() {
    this.rol = this.model.rol;
    this.configurarCalendarios();
  }

  limpiar() {
    this.fechaInicioConsulta = undefined;
    this.fechaFinConsulta = undefined;
    this.busquedaCepCompraRequest.model.inicio = undefined;
    this.busquedaCepCompraRequest.model.fin = undefined;
    this.pageCepCompras = new Page<CepCompras>();
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
  }

  configurarCalendarios() {
    let self = this;
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

    const dateFormat = 'dd/mm/yy',
      from = $("#dateCargaCep")
        .datepicker(datepickerConf)
        .on("change", function () {
          to.datepicker("option", "minDate", getDate(this));
        }),
      to = $("#dateCargaCepA").datepicker(datepickerConf)
        .on("change", function () {
          from.datepicker("option", "maxDate", getDate(this));
        });

    function getDate(element) {
      let date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value);
      } catch (error) {
        date = null;
      }
      return date;
    }

    $("#dateCargaCep").on('change', function () {
      self.fechaInicioConsulta = $(this).val();
    });

    $("#dateCargaCepA").on('change', function () {
      self.fechaFinConsulta = $(this).val();
    });
  }

  cargaCepCompra(response: Page<CepCompras>) {
    if (response.content.length == 0) {
      this.model.mensaje.mensaje = "No se encontró información.";
      this.model.mensaje.level = "danger";
      this.modalService.close("carga");
      return;
    }

    this.pageCepCompras = new Page<CepCompras>();
    this.pageCepCompras.init(response);
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.modalService.close("carga");
  }

  esFechaValida(fecha: string): boolean {
    if(!(!isNullOrUndefined(fecha) && fecha.trim().length > 0))
      return false;

    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (fecha.match(regex) === null)
      return false;

    const [dia, mes, anio] = fecha.split('/');

    let timestamp = new Date(`${anio}-${mes}-${dia}`).getTime();
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp))
      return false;
    
    return true;
  }

  obtieneCadenaFechaConHoraInicioDia(fecha: string): string {
    return fecha + " 00:00:00";
  }

  obtieneCadenaFechaConHoraFinDia(fecha: string): string {
    return fecha + " 23:59:59";
  }

  validaRangosDeFechas(fechaInicioRango:string, fechaFinRango: string): boolean {
    if(!this.esFechaValida(fechaInicioRango) || !this.esFechaValida(fechaFinRango)) {
      this.model.mensaje.mensaje = "Por favor seleccione ambas fechas para hacer la búsqueda. ";
      this.model.mensaje.level = "warning";
      return false;
    }

    return true;
  }

  actualizaSolicitudConsultaCEPCompra() {
    this.busquedaCepCompraRequest.page = 1;
    this.busquedaCepCompraRequest.model.entFinanciera = this.model.entidadFinanciera.cveEntidadFinancieraSipre;
    this.busquedaCepCompraRequest.model.inicio = this.obtieneCadenaFechaConHoraInicioDia(this.fechaInicioConsulta);
    this.busquedaCepCompraRequest.model.fin = this.obtieneCadenaFechaConHoraFinDia(this.fechaFinConsulta);
  }

  ejecutaLlamadaServicioConsultaCEPCompra() {
    this.consultarCepCompraService.postConsultarCepCompra(this.busquedaCepCompraRequest).subscribe(
      (response: Page<CepCompras>) => this.cargaCepCompra(response),
      error => {
        console.log(error)
        this.model.mensaje.mensaje = "Error con el servicio.";
        this.model.mensaje.level = "danger";
        this.modalService.close("carga");
      }
    );
  }

  busquedaCep() {
    if(!this.validaRangosDeFechas(this.fechaInicioConsulta, this.fechaFinConsulta))
      return;

    this.modalService.open("carga");
    this.actualizaSolicitudConsultaCEPCompra();
    this.ejecutaLlamadaServicioConsultaCEPCompra();
  }

  onPaged(page: number) {
    this.busquedaCepCompraRequest.page = page;
    this.ejecutaLlamadaServicioConsultaCEPCompra();
    this.pageCepCompras.number = page - 1;
    this.pageCepCompras.prepare();
  }

}