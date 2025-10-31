import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { ModalService } from 'src/app/common/modal-Services';
import { CartaInstruccionRequest, Modelo } from 'src/app/common/domain/carta.instruccion.request';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { Page } from 'src/app/common/domain/page';
import { BuscarFolioService, PromotorService, ResumenCartaInstruccionService, ResumenSimulacionService } from 'src/app/common/services';
import { AutorizarService } from '../../common/services/autorizar.service';
import { PersonaEF, TipoDocumento } from 'src/app/common/domain';
import { Solicitud } from '../domain/solicitud';
import { TipoCredito } from '../domain/tipo.credito';
import { PrestamoAutorizado } from '../domain/prestamo.autorizado';
import { SolicitudesExcel } from '../domain/solicitudes.excel';
import { Model } from 'src/app/model';
import { PrestamoPromotor } from '../domain/prestamo-promotor';
import { OrigenSolicitud } from '../origen.solicitud';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-busqueda-folio-detalle',
  templateUrl: './busqueda-folio-detalle.component.html',
  styleUrls: ['./busqueda-folio-detalle.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class BusquedaFolioDetalleComponent extends BaseComponent implements OnInit {

  @Input() rol: string;
  @Input() cveEntidadF: any;
  activoBusqueda: boolean = false;
  activoBusquedafecha: boolean = false;
  folioForm: string = "";
  nssForm: string = "";
  nssValido: boolean = true;
  estadoSolicitudForm: string = "0";
  cartaInstruccionRequest: CartaInstruccionRequest = new CartaInstruccionRequest();
  pageCartaInstruccion: Page<CartaInstruccion> = new Page<CartaInstruccion>();
  activarDetalle: boolean = false;
  fechaInicio: string;
  fechaFin: string;
  personaEf: PersonaEF;
  flagRol: any;
  resSimulacion: CartaInstruccion = new CartaInstruccion();
  resCartaCapacidad: CartaInstruccion = new CartaInstruccion();
  cartaInst: CartaInstruccion = new CartaInstruccion();
  activarTipoOpcion: string;
  consultaSPES: CartaInstruccion = new CartaInstruccion();
  mensajeUtil: Mensaje = new Mensaje();
  solicitudes : SolicitudesExcel = new SolicitudesExcel(); 
  model: Model;
  descuentosNoAplicados:boolean = false;
  descuentosNoAplicadosTotal: number = 0;
  reinstalacionPrestamo: any;
  continuar:boolean = false;

  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private promotorService: PromotorService,
    private autorizarService: AutorizarService,
    private buscarFolioService: BuscarFolioService,
    private resumenSimulacionService: ResumenSimulacionService,
    private resumenPrestamoAutorizadoService: ResumenCartaInstruccionService) {
    super(data);
  }

  private obtenerFormatoFecha(fecha: string) :  string {
    if (fecha != "" && fecha != undefined) {
      let anio: string;
      let mes: string;
      let dia: string;

      dia = (fecha).substring(0, 2);
      mes = (fecha).substring(3, 5);
      anio = (fecha).substring(6, 10);

      return dia + "/" + mes + "/" + anio + " 00:00:00";
    }
    else
      return null;
  }
  
  private actualizarFormularioBusquedaPrevia() {
    if(this.model.iniciaBusquedaFolio){
      this.model.camposBusqueda = new CartaInstruccionRequest();
    }
    else {
      this.fechaInicio = this.model.camposBusqueda.model.inicio;
      this.fechaFin = this.model.camposBusqueda.model.fin;

      this.nssForm = this.model.camposBusqueda.model.nss;
      this.folioForm = this.model.camposBusqueda.model.folio;
      this.cveEntidadF = this.model.camposBusqueda.model.cveEntidadFinanciera;
      this.flagRol = this.model.camposBusqueda.model.flagRol;
      this.estadoSolicitudForm = this.model.camposBusqueda.model.estadoSolicitud;

      this.cartaInstruccionRequest.page = 1;
      this.cartaInstruccionRequest.model.inicio = this.obtenerFormatoFecha(this.model.camposBusqueda.model.inicio);
      this.cartaInstruccionRequest.model.fin = this.obtenerFormatoFecha(this.model.camposBusqueda.model.fin);
      this.cartaInstruccionRequest.model.cvePromotor = this.model.camposBusqueda.model.cvePromotor;
      this.cartaInstruccionRequest.model.nss = this.model.camposBusqueda.model.nss;
      this.cartaInstruccionRequest.model.estadoSolicitud = this.model.camposBusqueda.model.estadoSolicitud;
      this.cartaInstruccionRequest.model.folio = this.model.camposBusqueda.model.folio;
      this.cartaInstruccionRequest.model.cveEntidadFinanciera = this.model.camposBusqueda.model.cveEntidadFinanciera;
      this.cartaInstruccionRequest.model.flagRol = this.model.camposBusqueda.model.flagRol;
      this.cartaInstruccionRequest.model.flagExcel = this.model.camposBusqueda.model.flagExcel;

      this.autorizarService.getBusquedaAutorizadorEF(this.cartaInstruccionRequest)
        .subscribe(
          (response: Page<CartaInstruccion>) => this.busquedaSolicitudAutorizar(response)
        );

      this.cartaInstruccionRequest.model.inicio = this.fechaInicio;
      this.cartaInstruccionRequest.model.fin = this.fechaFin;
    }
  }

  ngOnInit() {
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.activarDetalle = false;
    this.model.tipoOperacion = 0;
    this.configurarCalendarios();
    /*
    switch (this.rol) {
      case 'promotor':
        this.flagRol = 1;
        break;
      case 'operadorEF':
        this.flagRol = 2
        break;
      case 'adminEF':
        this.flagRol = 4;
        break;
      case 'operadorIMSS':
      case 'administradorIMSS':
        this.flagRol = 3;
        break;
      case 'adminEFSinConvenio':
        this.flagRol = 2;
        break;
      default:
        break;
    }
    */
    switch (this.rol) {
      case 'adminEF':
        this.flagRol = 2;
        break;
      case 'promotor':
        this.flagRol = 3;
        break;
      case 'operadorEF':
        this.flagRol = 4
        break;
      case 'administradorIMSS':
          this.flagRol = 5;
          break;
      case 'operadorIMSS':
        this.flagRol = 6;
        break;
      case 'adminEFSinConvenio':
        this.flagRol = 10;
        break;
    }

    this.route.queryParams
      //.filter(params => params.cveSol)
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        if (params.accion == "AsignarPromotor" && params.status == "success") {
          this.data.model.mensaje.level = "success";
          this.data.model.mensaje.mensaje = "Se ha realizado la asignación del personal operativo exitosamente.";
        }

        if ((params.accion == "GENERACION_CARTA_NO_ACEPTADA" || params.accion == "CARGA_CEP_CANCELADA")
        && params.status == "success") {
          this.model.mensaje.level = "success";
          this.model.mensaje.mensaje = "El préstamo se ha dado de baja con éxito.";
        }
      }
      );

      this.actualizarFormularioBusquedaPrevia();
  }

  configurarCalendarios() {
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
      from = $("#dateFolioAutorizar")
        .datepicker(datepickerConf)
        .on("change", function () {
          to.datepicker("option", "minDate", getDate(this));
        }),
      to = $("#dateFolioAutorizarA").datepicker(datepickerConf)
        .on("change", function () {
          from.datepicker("option", "maxDate", getDate(this));
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

    $("#dateFolioAutorizar").on('change', function () {
      self.cartaInstruccionRequest.model.inicio = $(this).val();
    });

    $("#dateFolioAutorizarA").on('change', function () {
      self.cartaInstruccionRequest.model.fin = $(this).val();
    });
  }

  limpiar() {
    this.cartaInstruccionRequest.model.inicio = undefined;
    this.cartaInstruccionRequest.model.fin = undefined;
    this.model.informeCartaInstruccion.solicitud.numFolioSolicitud = undefined;
    this.model.informeCartaInstruccion.solicitud.nss = undefined;
    this.activoBusqueda = false;
    this.activoBusquedafecha = false;
    this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud = '0';
    this.estadoSolicitudForm = '0';
    this.folioForm = "";
    this.nssForm = "";
    this.nssValido = true;
    this.activarDetalle = false;
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.pageCartaInstruccion = new Page<CartaInstruccion>();
    this.descuentosNoAplicados = false;

  }

  validarEstado() {
    console.log("Prestamo en recuperación 2:");
    this.model.camposBusqueda = new CartaInstruccionRequest();
    this.nssValido = true;
    this.activoBusqueda = true;
    this.activoBusquedafecha = true;

    //let anio: String;
    //let mes: String;
    //let dia: String;

    this.fechaInicio = this.cartaInstruccionRequest.model.inicio;
    this.fechaFin = this.cartaInstruccionRequest.model.fin;
    this.model.camposBusqueda.model.inicio = this.cartaInstruccionRequest.model.inicio;
    this.model.camposBusqueda.model.fin = this.cartaInstruccionRequest.model.fin

    //****************************     VALIDACIONES NSS    **************************************/
    if (this.nssForm !== "" && this.nssForm !== undefined) {
      const pattern = new RegExp("^[0-9]*$");
      if (!(this.nssForm.length == 11)) {
        this.nssValido = false;
      }
      if (!pattern.test(this.nssForm)) {
        this.nssValido = false;
      }
    }

    if (this.cartaInstruccionRequest.model.inicio != "" && this.cartaInstruccionRequest.model.inicio != undefined) {
      //dia = (this.cartaInstruccionRequest.model.inicio).substring(0, 2);
      //mes = (this.cartaInstruccionRequest.model.inicio).substring(3, 5);
      //anio = (this.cartaInstruccionRequest.model.inicio).substring(6, 10);

      //this.cartaInstruccionRequest.model.inicio = dia + "/" + mes + "/" + anio + " 00:00:00";
      this.cartaInstruccionRequest.model.inicio = this.obtenerFormatoFecha(this.cartaInstruccionRequest.model.inicio);
      this.activoBusquedafecha = false;
    }

    if (this.cartaInstruccionRequest.model.fin != "" && this.cartaInstruccionRequest.model.fin != undefined) {
      //dia = (this.cartaInstruccionRequest.model.fin).substring(0, 2);
      //mes = (this.cartaInstruccionRequest.model.fin).substring(3, 5);
      //anio = (this.cartaInstruccionRequest.model.fin).substring(6, 10);
      //this.cartaInstruccionRequest.model.fin = dia + "/" + mes + "/" + anio + " 00:00:00";
      this.cartaInstruccionRequest.model.fin = this.obtenerFormatoFecha(this.cartaInstruccionRequest.model.fin);
      this.activoBusquedafecha = false;
    }

    // VALIDA LOS VALORES INGRESADO PARA EJECUTAR LA CONSULTA DE LOS PRESTAMOS.
    if ((this.estadoSolicitudForm != undefined && this.estadoSolicitudForm != "" && this.estadoSolicitudForm != '0')
      ||
      (this.folioForm !== "" && this.folioForm !== undefined)
      ||
      (this.nssForm !== "" && this.nssForm !== undefined && this.nssValido == true)
      ||
      ((this.cartaInstruccionRequest.model.inicio !== "" && this.cartaInstruccionRequest.model.inicio !== undefined)
        && (this.cartaInstruccionRequest.model.fin !== "" && this.cartaInstruccionRequest.model.fin !== undefined))) {

      this.model.mensaje.mensaje = "";
      this.model.mensaje.level = "";
      this.cartaInstruccionRequest.page = 1;
      if (this.rol == 'adminEFSinConvenio'){
        this.cartaInstruccionRequest.model.estadoSolicitud = '5';
        this.model.camposBusqueda.model.estadoSolicitud = this.cartaInstruccionRequest.model.estadoSolicitud;
      }else{
        this.cartaInstruccionRequest.model.estadoSolicitud = this.estadoSolicitudForm;
        this.model.camposBusqueda.model.estadoSolicitud = this.cartaInstruccionRequest.model.estadoSolicitud;
      }
      this.cartaInstruccionRequest.model.nss = this.nssForm;
      this.model.camposBusqueda.model.nss = this.nssForm;
      this.cartaInstruccionRequest.model.folio = this.folioForm;
      this.model.camposBusqueda.model.folio = this.folioForm;
      this.cartaInstruccionRequest.model.cveEntidadFinanciera = this.cveEntidadF;
      this.model.camposBusqueda.model.cveEntidadFinanciera = this.cveEntidadF;
      this.cartaInstruccionRequest.model.flagRol = this.flagRol;
      this.model.camposBusqueda.model.flagRol = this.flagRol;
      //this.cartaInstruccionRequest.model.cvePromotor = this.flagRol == 1 ? Number(this.model.personaEF.idPersonaEF) : null;
      this.cartaInstruccionRequest.model.cvePromotor = this.flagRol == 3 ? Number(this.model.personaEF.idPersonaEF) : null;
      this.model.camposBusqueda.model.cvePromotor = this.cartaInstruccionRequest.model.cvePromotor;
      this.cartaInstruccionRequest.model.flagExcel = false;
      this.model.camposBusqueda.model.flagExcel = false;
      this.modalService.open("carga");
      //console.log("REQUEST:" + JSON.stringify(this.cartaInstruccionRequest.model));
      if (this.flagRol >= 4 && this.flagRol <= 6 && this.estadoSolicitudForm == "22") {
          this.autorizarService.getPrestamosDescuentosNoAplicados(this.cartaInstruccionRequest).subscribe(
            (response: Page<CartaInstruccion>) => this.busquedaSolicitudAutorizar(response)
          );
      }else{
          this.autorizarService.getBusquedaAutorizadorEF(this.cartaInstruccionRequest).subscribe(
            (response: Page<CartaInstruccion>) => this.busquedaSolicitudAutorizar(response)
          );
      }
      this.cartaInstruccionRequest.model.inicio = this.fechaInicio;
      this.cartaInstruccionRequest.model.fin = this.fechaFin;
    } else {
      this.activoBusqueda = false;
      this.activoBusquedafecha = false;
      this.model.mensaje.mensaje = "Debes ingresar por lo menos un criterio de búsqueda sea NSS, Folio, Estado, o un rango de fechas.";
      this.model.mensaje.level = "danger";
      this.cartaInstruccionRequest.model.inicio = this.fechaInicio;
      this.cartaInstruccionRequest.model.fin = this.fechaFin;
    }
  }

  generarExcelPrestamos() {
    let busqueda :CartaInstruccionRequest;
    busqueda = this.cartaInstruccionRequest;
    busqueda.page = 1;
    busqueda.model.flagExcel = true;
    /*
    this.autorizarService.getBusquedaAutorizadorEFExcel(busqueda).subscribe(
      (response: Page<CartaInstruccion>) => this.descargaExcel(response)
    );
    */
    if (this.flagRol >= 4 && this.flagRol <= 6 && this.estadoSolicitudForm == "22") {
      this.autorizarService.descargarExcelDescuentosNoAplicados(busqueda);
    }else{
      this.autorizarService.descargarExcelPrestamos(busqueda);
    }
    
  }
  /*
  descargaExcel(response: Page<CartaInstruccion>) {
    this.solicitudes.solicitudes = [];
    for (let item of response.content) {
      console.log("data: " + item.solicitud.id);
      this.solicitudes.solicitudes.push(item.solicitud.id.toString());
    }
    this.resumenSimulacionService.descargarExcelPrestamos(this.solicitudes);
  }
  */

  seleccionSolicitud(seleccion: number) {
    this.modalService.open("carga");
    this.activarDetalle = true;
    this.data.model.informeCartaInstruccion = { ...this.pageCartaInstruccion.content[seleccion] }
    this.cartaInstruccion();
  }

  onPaged(page: number) {
    this.cartaInstruccionRequest.page = page;
    this.autorizarService.getBusquedaAutorizador(this.cartaInstruccionRequest)
      .subscribe((response: Page<CartaInstruccion>) => this.busquedaSolicitudAutorizar(response));
    this.pageCartaInstruccion.number = page - 1;
    this.pageCartaInstruccion.prepare();
  }

  busquedaSolicitudAutorizar(response: Page<CartaInstruccion>) {
    console.log("Lista : ", response);
    if (response.content.length == 0) {
      this.activoBusqueda = false;
      this.activoBusquedafecha = false;
      this.model.mensaje.mensaje = "No se encontró información.";
      this.model.mensaje.level = "danger";
      this.modalService.close("carga");
      return;
    }

    if(this.cartaInstruccionRequest.model.folio == "" && this.cartaInstruccionRequest.model.nss == "" && this.cartaInstruccionRequest.model.estadoSolicitud == "22"){
        this.descuentosNoAplicados = true;
        this.descuentosNoAplicadosTotal = response.totalElements;
    }

    this.pageCartaInstruccion = new Page<CartaInstruccion>();
    this.pageCartaInstruccion.init(response);

    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.modalService.close("carga");
  }

  /*
  BUSQUEDA DEL DETALLE DE UNA SOLICITUD
  */
  buscarFolio(folio: string, idSolPrestamo: string, index: number) {

    this.modalService.open("carga");
    //console.log("Buscar folio: " + folio + " - " + idSolPrestamo);
    
    if (folio != null) {

      this.mensajeUtil.mensaje = "";
      this.mensajeUtil.level = "";
      this.continuar = false;

      this.buscarFolioService.buscarFolio(folio, null, null).subscribe(
          (solicitud: Solicitud) => this.validarFolio(solicitud, idSolPrestamo)
        );

    } else {
      console.log(" Pasa else Buscar idSolPrestamo: " + idSolPrestamo);
      if (this.cartaInstruccionRequest.model.estadoSolicitud == "22") {
          this.reinstalacionPrestamo = {...this.pageCartaInstruccion.content[index]}; 
          this.data.model.pensionado.curp =  this.reinstalacionPrestamo.pensionado.curp;
          this.data.model.pensionado.nss =  this.reinstalacionPrestamo.pensionado.nss;
          this.data.model.pensionado.grupoFamiliar =  this.reinstalacionPrestamo.pensionado.grupoFamiliar;
          this.continuar = true;
      }
      this.contruyeRqSPES(idSolPrestamo);
    }
  }

  contruyeRqSPES(idSolPrestamo: string) {

    let sol = new Solicitud();

    sol.curp = this.data.model.pensionado.curp;
    sol.nss = this.data.model.pensionado.nss;
    sol.grupoFamiliar = this.model.pensionado.grupoFamiliar;
    sol.idSolPrFinanciero = idSolPrestamo;
    this.consultaSPES.solicitud = { ...sol };

    this.consultaResumenSimulacionSPES(this.consultaSPES);
  }

  consultaResumenSimulacionSPES(resumenSimulacion: CartaInstruccion) {
    this.resumenSimulacionService.consultarConSPES(resumenSimulacion).subscribe(
      (resumenSimulacion: CartaInstruccion) => {
        if(resumenSimulacion != null)
          this.validarResumenSimulacion(resumenSimulacion);
      }
    );
  }

  asignarFolio(cveEntidadFinanciera, cveDelegacionRQ, numFolioSolicitud, id) {
    this.router.navigate(['/administradorEF/listarPromotores'],
      {
        queryParams:
        {
          cveEntidadFinanciera: cveEntidadFinanciera,
          cveDelegacion: cveDelegacionRQ,
          numFolioSolicitud: numFolioSolicitud,
          id: id
        }
      });
  }

  validarFolio(solicitud, idSolPrestamo) {
    this.resSimulacion.solicitud = { ...solicitud.solicitud };
    this.resCartaCapacidad.solicitud = { ...solicitud.solicitud };
    this.resSimulacion.solicitud.idSolPrFinanciero = idSolPrestamo;
    this.consultaResumenSimulacion(this.resSimulacion);
  }

  consultaResumenSimulacion(resumenSimulacion) {
    this.resumenSimulacionService.consultar(resumenSimulacion).subscribe(
        (resumenSimulacion: CartaInstruccion) => {
          if(resumenSimulacion != null)
            this.validarResumenSimulacion(resumenSimulacion);
        }
      );
  }

  validarResumenSimulacion(rs: CartaInstruccion) {
    this.resSimulacion.solicitud = { ...rs.solicitud };
    this.resSimulacion.prestamo = { ...rs.prestamo };
    this.resSimulacion.pensionado = { ...rs.pensionado };
    this.reinstalacionPrestamoDatosTitular();
    this.resSimulacion.oferta = { ...rs.oferta };
    this.resSimulacion.documentos = rs.documentos;
    this.resSimulacion.tablaAmort = rs.tablaAmort;
    this.resSimulacion.descuentosAplicados = rs.descuentosAplicados;
    this.resSimulacion.listPrestamoRecuperacion = rs.listPrestamoRecuperacion;
    this.resSimulacion.bitacoras = rs.bitacoras;
    this.resSimulacion.promotor = rs.promotor;
    this.resSimulacion.personaModel = rs.personaModel;
    this.resSimulacion.catPromotor = rs.catPromotor;
    this.model.cartaInstruccion = this.resSimulacion;
    this.modalService.close("carga");

    this.router.navigate(['/pensionado/ver-detalle-simulacion', {}]);
  }

  reinstalacionPrestamoDatosTitular(){
      if (this.cartaInstruccionRequest.model.estadoSolicitud == "22" && this.continuar) {
        this.resSimulacion.pensionado.nombre = this.reinstalacionPrestamo.pensionado.nombre;
        this.resSimulacion.pensionado.primerApellido = this.reinstalacionPrestamo.pensionado.primerApellido;
        this.resSimulacion.pensionado.segundoApellido = this.reinstalacionPrestamo.pensionado.segundoApellido;
        this.resSimulacion.pensionado.correoElectronico = this.reinstalacionPrestamo.pensionado.correoElectronico;
        this.resSimulacion.pensionado.telefono = this.reinstalacionPrestamo.pensionado.telefono;
        this.resSimulacion.pensionado.telefonoCelular = this.reinstalacionPrestamo.pensionado.telefonoCelular;
      }
  }

  /*
  ******BUSQUEDA ESPECIFICA DEL OPERADOR EF
  */
  cartaInstruccion() {
    console.log(">>>CARTA INSTRUCCION: ");
    this.data.model.mensaje.mensaje = "";
    this.data.model.mensaje.level = "";
    switch (this.data.model.informeCartaInstruccion.solicitud.cveEstadoSolicitud.id) {
      case 2://"POR AUTORIZAR"
        this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud = "2";
        this.autorizarService.getCartaInstruccion(this.model.informeCartaInstruccion)
          .subscribe(
            (response: CartaInstruccion) => {
              if(response != null)
                this.obtencionCartaInstruccion(response);
            }
          );
        break;
      case 4://"PENDIENTE CARGAR COMPROBANTE"
        this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud = "4";
        this.data.model.resumenCartaInstruccion = new PrestamoAutorizado();
        this.data.model.resumenCartaInstruccion.solicitud.id = this.data.model.informeCartaInstruccion.solicitud.id;
        this.resumenPrestamoAutorizadoService.postCartaInstruccion(this.data.model.resumenCartaInstruccion)
          .subscribe(
            (resumenCartaInstruccion: PrestamoAutorizado) => {
              if(resumenCartaInstruccion != null)
                this.validarResumenCartaInstruccion(resumenCartaInstruccion);
            }
          );
        break;
      case 5://"PENDIENTE MONTO A LIQUIDAR"
        this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud = "5";
        this.data.model.cartaInstruccion = new CartaInstruccion();
        this.data.model.resumenCartaInstruccion.solicitud.id = this.data.model.informeCartaInstruccion.solicitud.id;
        this.data.model.resumenCartaInstruccion.cveEFOperador = this.cveEntidadF;
        if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 1 || this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 4) {
          console.log(">>>CONSULTA OBTENER SOLICITUD: ", JSON.stringify(this.data.model.resumenCartaInstruccion));
          this.resumenPrestamoAutorizadoService.obtenerInfoSolicitud(this.data.model.resumenCartaInstruccion)
            .subscribe(
              (cartaInstruccion: CartaInstruccion) => {
                if(cartaInstruccion != null)
                  this.setResponseCartaInst(cartaInstruccion);
              }
            );
          break;
        } else if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 2) {
          this.resumenPrestamoAutorizadoService.obtenerInfoSolicitudCapacidad(this.data.model.resumenCartaInstruccion)
            .subscribe(
              (cartaInstruccion: CartaInstruccion) => {
                if(cartaInstruccion != null)
                  this.setResponseCartaInst(cartaInstruccion);
              }
            );
          break;
        }
      case 3://"AUTORIZADO"
      this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud = "8";
      case 8://"PRÉSTAMO EN RECUPERACIÓN"
      if (this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud == null) this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud = "8";
      case 17://"PRÉSTAMO OTORGADO"
      if (this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud == null) this.data.model.informeCartaInstruccion.solicitud.estadoSolicitud = "17";
        this.data.model.resumenCartaInstruccion = new PrestamoAutorizado();
        this.data.model.resumenCartaInstruccion.solicitud.id = this.data.model.informeCartaInstruccion.solicitud.id;
        this.resumenPrestamoAutorizadoService.postCartaInstruccion(this.data.model.resumenCartaInstruccion)
          .subscribe(
            (resumenCartaInstruccion: PrestamoAutorizado) => {
              if(resumenCartaInstruccion != null)
                this.validarResumenCargaDeDocumentos(resumenCartaInstruccion);
            }
          );
        break;
      default:
        break;
    }
  }

  obtencionCartaInstruccion(response: CartaInstruccion) {
    this.data.model.informeCartaInstruccion = { ...response }
    this.data.model.informeCartaInstruccion.prestamo.tipoCreditoEnum = TipoCredito.forValue(Number(this.data.model.informeCartaInstruccion.prestamo.tipoCredito));
    this.modalService.close("carga");
    if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 5) {
      this.router.navigate(['/operadorEF/autorizarInforme', {}]);  
    }else{
      this.router.navigate(['/operadorEF/prestamoAutorizar', {}]);
    }
  }

  validarResumenCartaInstruccion(resumenCartaInstruccion: PrestamoAutorizado) {
    console.log(">>>PRESTAMO AUTORIZADO: ", JSON.stringify(resumenCartaInstruccion));
    this.data.model.resumenCartaInstruccion.pensionado = { ...resumenCartaInstruccion.pensionado };
    this.data.model.resumenCartaInstruccion.prestamo = { ...resumenCartaInstruccion.prestamo };
    this.data.model.resumenCartaInstruccion.prestamo.tipoCreditoEnum = TipoCredito.forValue(resumenCartaInstruccion.prestamo.tipoCredito);
    this.data.model.resumenCartaInstruccion.oferta = { ...resumenCartaInstruccion.oferta };
    this.data.model.resumenCartaInstruccion.solicitud = { ...resumenCartaInstruccion.solicitud };
    this.data.model.resumenCartaInstruccion.personaEf = { ...resumenCartaInstruccion.personaEf };
    this.data.model.resumenCartaInstruccion.persona = { ...resumenCartaInstruccion.persona };
    this.data.model.resumenCartaInstruccion.documentos = resumenCartaInstruccion.documentos;
    this.data.model.resumenCartaInstruccion.listPrestamoRecuperacion = resumenCartaInstruccion.listPrestamoRecuperacion;
    this.data.model.resumenCartaInstruccion.promotor = resumenCartaInstruccion.promotor;
    this.data.model.resumenCartaInstruccion.catPromotor = resumenCartaInstruccion.catPromotor;
    this.data.model.prestamoAutorizado = this.data.model.resumenCartaInstruccion;

    console.log("resumenCartaInstruccion : ", resumenCartaInstruccion);
    console.log("Anexar comprobante: ", this.model.prestamoAutorizado);


    this.modalService.close("carga");
    this.router.navigate(['/operadorEF/anexarComprobante', {}]);
  }

  validarResumenCargaDeDocumentos(resumenCartaInstruccion: PrestamoAutorizado) {
    console.log(">>>PRESTAMO AUTORIZADO: ", JSON.stringify(resumenCartaInstruccion));
    this.data.model.resumenCartaInstruccion.pensionado = { ...resumenCartaInstruccion.pensionado };
    this.data.model.resumenCartaInstruccion.prestamo = { ...resumenCartaInstruccion.prestamo };
    this.data.model.resumenCartaInstruccion.prestamo.tipoCreditoEnum = TipoCredito.forValue(resumenCartaInstruccion.prestamo.tipoCredito);
    this.data.model.resumenCartaInstruccion.oferta = { ...resumenCartaInstruccion.oferta };
    this.data.model.resumenCartaInstruccion.solicitud = { ...resumenCartaInstruccion.solicitud };
    this.data.model.resumenCartaInstruccion.personaEf = { ...resumenCartaInstruccion.personaEf };
    this.data.model.resumenCartaInstruccion.persona = { ...resumenCartaInstruccion.persona };
    this.data.model.resumenCartaInstruccion.documentos = resumenCartaInstruccion.documentos;
    this.data.model.resumenCartaInstruccion.listPrestamoRecuperacion = resumenCartaInstruccion.listPrestamoRecuperacion;
    this.data.model.resumenCartaInstruccion.promotor = resumenCartaInstruccion.promotor;
    this.data.model.resumenCartaInstruccion.catPromotor = resumenCartaInstruccion.catPromotor;
    this.data.model.prestamoAutorizado = this.data.model.resumenCartaInstruccion;

    console.log("resumenCartaInstruccion : ", resumenCartaInstruccion);
    console.log("Anexar comprobante: ", this.model.prestamoAutorizado);


    this.modalService.close("carga");
    this.router.navigate(['/operadorEF/cargarDocumentacionAdicional', {}]);
  }

  setResponseCartaInst(cartaInstruccion: CartaInstruccion) {
    console.log(">>>setResponseCartaInst: ", JSON.stringify(cartaInstruccion));
    this.data.model.cartaInstruccion.pensionado = { ...cartaInstruccion.pensionado };
    this.data.model.cartaInstruccion.persona = { ...cartaInstruccion.persona };
    this.data.model.cartaInstruccion.solicitud = { ...cartaInstruccion.solicitud };
    this.data.model.cartaInstruccion.listPrestamoRecuperacion = { ...cartaInstruccion.listPrestamoRecuperacion };
    if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 1 || this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 4) {
      this.data.model.cartaInstruccion.personaEf = { ...cartaInstruccion.personaEf };
      this.data.model.cartaInstruccion.documento = { ...cartaInstruccion.documento };
      this.data.model.cartaInstruccion.oferta = { ...cartaInstruccion.oferta };
      this.data.model.cartaInstruccion.prestamo = { ...cartaInstruccion.prestamo };
      this.data.model.cartaInstruccion.prestamo.tipoCreditoEnum = TipoCredito.forValue(cartaInstruccion.prestamo.tipoCredito);
    }
    if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 2) {
      this.data.model.cartaInstruccion.capacidadCredito = { ...cartaInstruccion.capacidadCredito };
    }

    this.data.model.cartaInstruccion.personaModel = cartaInstruccion.personaModel;
    this.data.model.cartaInstruccion.oferta = cartaInstruccion.prestamo.oferta;
    this.data.model.cartaInstruccion.catPromotor = cartaInstruccion.catPromotor;

    this.modalService.close("carga");
    console.log(">>>> Rol para el redirect", this.rol);
    if(this.rol == 'adminEFSinConvenio'){
      if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 1 || this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 4) {
        console.log(">>>> Rol para el redirect dentro del if 1", this.rol);
        this.router.navigate(['../administradorEFSinConvenio/informeMontoLiquidarComponent']); 
      } else if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 2) {
        console.log(">>>> Rol para el redirect dentro del if 2", this.rol);
        this.router.navigate(['../administradorEFSinConvenio/informeMontoLiquidarCapComponent']);
      }
    }else{
      if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 1 || this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 4) {
        this.router.navigate(['../operadorEF/informeMontoLiquidarComponent']);
      } else if (this.data.model.informeCartaInstruccion.solicitud.cveOrigenSolicitud.id == 2) {
        this.router.navigate(['../operadorEF/informeMontoLiquidarCapComponent']);
      }
    }
  }

  //******FLUJO Carta de Libranza PROMOTOR********

  buscarFolioCartaInstruccion(numFolio: string) {
    this.modalService.open("carga");
    this.buscarFolioService.buscarFolio(numFolio, this.cveEntidadF, this.model.personaEF.idPersonaEF)
      .subscribe((solicitud: Solicitud) => this.validarFolioCartaInstruccion(solicitud));
  }

  validarFolioCartaInstruccion(solicitud) {
    //console.log(">>>SOLICITUD: " + JSON.stringify(solicitud));    
    this.cartaInst.solicitud = { ...solicitud.solicitud };
    this.model.cartaInstruccion.solicitud = { ...solicitud.solicitud };

    switch (this.cartaInst.solicitud.origenSolictud) {
      case 1:
        this.consultaResumenSimulacionCartaInst(this.cartaInst);
        break;
      case 2:
        this.router.navigate(['/promotor/cartaCapacidadInforme', {}]);
        break;
      default:
      //console.log( JSON.stringify(solicitud) );
    }

  }

  consultaResumenSimulacionCartaInst(cartaInstruccion: CartaInstruccion) {
    this.resumenSimulacionService.consultar(cartaInstruccion)
      .subscribe(
        (cartaInstruccion: CartaInstruccion) => {
          if(cartaInstruccion != null)
            this.validarResumenSimulacionCartaInst(cartaInstruccion);
        }
      );
  }

  validarResumenSimulacionCartaInst(rs: CartaInstruccion) {
    this.cartaInst.solicitud = { ...rs.solicitud };
    this.cartaInst.prestamo = { ...rs.prestamo };
    this.cartaInst.pensionado = { ...rs.pensionado };
    this.cartaInst.oferta = { ...rs.oferta };
    this.cartaInst.documentos = rs.documentos;
    this.cartaInst.tablaAmort = rs.tablaAmort;
    this.cartaInst.descuentosAplicados = rs.descuentosAplicados;
    this.cartaInst.listPrestamoRecuperacion = rs.listPrestamoRecuperacion;
    this.cartaInst.promotor = rs.promotor;
    this.cartaInst.personaModel = rs.personaModel;

    this.model.cartaInstruccion = this.cartaInst;
    this.modalService.close("carga");
    this.router.navigate(['/promotor/cartaInstruccionInforme', {}]);
  }

  /*
  BUSQUEDA DEL DETALLE DE UNA SOLICITUD
  */
  buscarFolioBaja(folio: string, idSolPrestamo: string) {
    this.modalService.open("carga");

    console.log("Buscar folio: " + folio + " - " + idSolPrestamo);

    if (folio != null) {

      this.mensajeUtil.mensaje = "";
      this.mensajeUtil.level = "";
      this.model.tipoOperacion = 1;

      this.buscarFolioService.buscarFolio(folio, null, null)
        .subscribe(
          (solicitud: Solicitud) => this.validarFolioBaja(solicitud, idSolPrestamo)
        );

    } else {
      console.log(" Pasa else Buscar idSolPrestamo: " + idSolPrestamo);
      this.contruyeRqSPESbaja(idSolPrestamo);
    }
  }



  /*
  BUSQUEDA DEL DETALLE DE UNA SOLICITUD
  */
  buscarFolioSuspension(folio: string, idSolPrestamo: string) {
    this.modalService.open("carga");

    console.log("Buscar folio: " + folio + " - " + idSolPrestamo);

    if (folio != null) {

      this.mensajeUtil.mensaje = "";
      this.mensajeUtil.level = "";
      this.model.tipoOperacion = 2;
      this.buscarFolioService.buscarFolio(folio, null, null)
        .subscribe(
          (solicitud: Solicitud) => this.validarFolioBaja(solicitud, idSolPrestamo)
        );

    } else {
      console.log(" Pasa else Buscar idSolPrestamo: " + idSolPrestamo);
      this.contruyeRqSPESbaja(idSolPrestamo);
    }
  }




  /*
  BUSQUEDA DEL DETALLE DE UNA SOLICITUD
  */
  buscarFolioReanudar(folio: string, idSolPrestamo: string) {
    this.modalService.open("carga");

    console.log("Buscar folio: " + folio + " - " + idSolPrestamo);

    if (folio != null) {

      this.mensajeUtil.mensaje = "";
      this.mensajeUtil.level = "";
      this.model.tipoOperacion = 3;
      this.buscarFolioService.buscarFolio(folio, null, null)
        .subscribe(
          (solicitud: Solicitud) => this.validarFolioBaja(solicitud, idSolPrestamo)
        );

    } else {
      console.log(" Pasa else Buscar idSolPrestamo: " + idSolPrestamo);
      this.contruyeRqSPESbaja(idSolPrestamo);
    }
  }


  contruyeRqSPESbaja(idSolPrestamo: string) {

    let sol = new Solicitud();

    sol.curp = this.data.model.pensionado.curp;
    sol.nss = this.data.model.pensionado.nss;
    sol.grupoFamiliar = this.model.pensionado.grupoFamiliar;
    sol.idSolPrFinanciero = idSolPrestamo;
    this.consultaSPES.solicitud = { ...sol };

    this.consultaResumenSimulacionSPESBaja(this.consultaSPES);
  }

  consultaResumenSimulacionSPESBaja(resumenSimulacion: CartaInstruccion) {
    this.resumenSimulacionService.consultarConSPES(resumenSimulacion).subscribe(
      (resumenSimulacion: CartaInstruccion) => {
        if(resumenSimulacion != null)
          this.validarResumenSimulacionBaja(resumenSimulacion);
      }
    );
  }

  validarFolioBaja(solicitud, idSolPrestamo) {
    this.resSimulacion.solicitud = { ...solicitud.solicitud };
    this.resCartaCapacidad.solicitud = { ...solicitud.solicitud };
    this.resSimulacion.solicitud.idSolPrFinanciero = idSolPrestamo;
    this.consultaResumenSimulacionBaja(this.resSimulacion);
  }

  consultaResumenSimulacionBaja(resumenSimulacion) {
    this.resumenSimulacionService.consultar(resumenSimulacion)
      .subscribe(
        (resumenSimulacion: CartaInstruccion) => {
            if(resumenSimulacion != null)
              this.validarResumenSimulacionBaja(resumenSimulacion);
        }
      );
  }

  validarResumenSimulacionBaja(rs: CartaInstruccion) {
    this.resSimulacion.solicitud = { ...rs.solicitud };
    this.resSimulacion.prestamo = { ...rs.prestamo };
    this.resSimulacion.pensionado = { ...rs.pensionado };
    this.resSimulacion.oferta = { ...rs.oferta };
    this.resSimulacion.documentos = rs.documentos;
    this.resSimulacion.tablaAmort = rs.tablaAmort;
    this.resSimulacion.descuentosAplicados = rs.descuentosAplicados;
    this.resSimulacion.listPrestamoRecuperacion = rs.listPrestamoRecuperacion;
    this.resSimulacion.promotor = rs.promotor;
    this.resSimulacion.personaModel = rs.personaModel;
    this.model.cartaInstruccion = this.resSimulacion;
    this.modalService.close("carga");

    this.router.navigate(['/operadorEF/detallePrestamo', {}]);
  }

  reinstalacion(idSolPrFinanciero: string, nss: string, curp: string, index: number) {
    this.model.buttonPrestamoPromotor = true;
    this.reinstalacionPrestamo = {...this.pageCartaInstruccion.content[index]};
    this.model.montoPension = this.reinstalacionPrestamo.pensionado.pension;
    this.model.montoPensionGarantizada = this.reinstalacionPrestamo.pensionado.pensionGarantizada;
    let pensionado = new PrestamoPromotor();
    pensionado.idSolPrestamo = idSolPrFinanciero;
    pensionado.nss = nss;
    pensionado.curp = curp;
    pensionado.sesion = this.data.model.sesion;
    this.modalService.open("carga");
    this.promotorService.validarReinstalacion(pensionado).subscribe(
        (response: PrestamoPromotor) => {
          if (response != null) 
            this.setResponseReinstalacion(response);
          else
            this.modalService.close("carga");
        }
    );
  }

  recuperaDatosPensionadoReinstalacion(prestamoPromotor: PrestamoPromotor) {
    if (this.reinstalacionPrestamo != null) {
      prestamoPromotor.prestamoVigente.numMesesConsecutivos = this.reinstalacionPrestamo.solicitud.prestamo.numMesesConsecutivos; 
    }
    if (this.reinstalacionPrestamo != null &&
      prestamoPromotor.persona != null && 
      prestamoPromotor.persona.correoElectronico != null && 
      prestamoPromotor.persona.correoElectronico == 'sinregistro') {
        prestamoPromotor.persona.nombre = this.reinstalacionPrestamo.pensionado.nombre;
        prestamoPromotor.persona.primerApellido = this.reinstalacionPrestamo.pensionado.primerApellido;
        prestamoPromotor.persona.segundoApellido = this.reinstalacionPrestamo.pensionado.segundoApellido;
        prestamoPromotor.persona.correoElectronico = this.reinstalacionPrestamo.pensionado.correoElectronico;
        prestamoPromotor.persona.telLocal = this.reinstalacionPrestamo.pensionado.telefono;
        prestamoPromotor.persona.telCelular = this.reinstalacionPrestamo.pensionado.telefonoCelular;
    }
  }

  setResponseReinstalacion(response: PrestamoPromotor) {
    this.recuperaDatosPensionadoReinstalacion(response);
    this.model.prestamoPromotor.pensionado = response.pensionado;
    this.model.prestamoPromotor.capacidad = response.capacidad;
    this.model.capacidadPensionado = response.capacidad.impCapacidadTotal;
    this.model.prestamoPromotor.persona = response.persona;
    this.model.prestamoPromotor.prestamoVigente = response.prestamoVigente;
    console.log("MODEL PREATAMO PROMOTOR: ", this.model.prestamoPromotor); 
    
    this.model.pensionado.curp = this.model.prestamoPromotor.pensionado.cveCurp;
    this.model.pensionado.nss = this.model.prestamoPromotor.pensionado.idNss;
    this.model.pensionado.grupoFamiliar = this.model.prestamoPromotor.pensionado.idGrupoFamiliar;
    this.model.buttonPrestamoPromotor = false;
    this.modalService.close("carga");
    this.router.navigate(['/operadorEF/reinstalarPrestamoEditar']);
  }

}

