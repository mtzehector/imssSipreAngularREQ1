import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { Model } from 'src/app/model';
import { BaseComponent } from 'src/app/common/base.component';
import { PensionadoService } from 'src/app/common/services/pensionado.service';
import { CapacidadCreditoService } from 'src/app/common/services/capacidad.credito.service';
import { CapacidadCredito } from 'src/app/common/domain/capacidad.credito';
import { Router, ActivatedRoute } from '@angular/router';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { FolioVigente } from 'src/app/common/domain/folio.vigente';

import { BitacoraService, BuscarFolioService, CancelarSolicitudService, ModalService } from 'src/app/common/services';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { ResumenCartaCapacidadService } from 'src/app/common/services/resumen.carta.capacidad.service';
import { ResumenSimulacionService } from 'src/app/common/services/resumen.simulacion.service';
import { Page } from 'src/app/common/domain/page';
import { SolicitudesVigentesRequest, Modelo } from 'src/app/common/domain/solicitudes.vigentes.request';
import { SolicitudesVigentesService } from 'src/app/common/services/solicitudes.vigentes.service';
import { CancelarSolicitud } from '../../common/domain/cancelar.solicitud';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { pageSize } from 'src/environments/environment';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css', './home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

  model: Model;
  boton: number;
  rol: String;

  numFolioSolicitud: string;
  origen: number;
  resumenSimulacion: CartaInstruccion;
  resumenCartaCapacidad: CartaInstruccion;
  disabled: boolean = false;
  activarOpciones: boolean = false;
  pageFolioVigente: Page<FolioVigente> = new Page<FolioVigente>();
  solicitudesVigentesRequest: SolicitudesVigentesRequest = new SolicitudesVigentesRequest();
  idSolicitud: number;
  consultaSPES: CartaInstruccion;

  constructor(private route: ActivatedRoute,
    protected data: DataService,
    private router: Router,
    private pensionadoService: PensionadoService,
    private capacidadCreditoService: CapacidadCreditoService,
    private buscarFolioService: BuscarFolioService,
    private modalService: ModalService,
    private resumenCartaCapacidadService: ResumenCartaCapacidadService,
    private resumenSimulacionService: ResumenSimulacionService,
    private solicitudesVigentesService: SolicitudesVigentesService,
    private cancelarSolicitud: CancelarSolicitudService,
    private bitacoraService: BitacoraService
  ) {

    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "pensionado";
    this.model.prestamosVigentesArreglo = [];
    this.data.model.rol = "pensionado";
    this.data.model.simulacion.prestamo.tipoSimulacion = "";
    this.data.model.simulacion.prestamo.monto = "";
    // this.data.model.simulacion.prestamo.oferta.plazo={id:"", numPlazo:"", descripcion:""};   
    //console.log(this.data.model);
    //this.pensionadoService.getSesion().subscribe(sesion => this.data.model.sesion = sesion);
    this.model.pensionado.nss
    this.solicitudesVigentesRequest.model.nss = this.model.pensionado.nss;
    this.onPaged(1);
    this.resumenSimulacion = new CartaInstruccion();
    this.resumenCartaCapacidad = new CartaInstruccion();
    this.model.mensaje.mensaje = "";
    this.consultaSPES = new CartaInstruccion();
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        if (params.accion == "regPrestamo" && params.status == "error") {
          this.data.model.mensaje.level = "danger";
          this.data.model.mensaje.mensaje = "Servicio no disponible, favor de intentar nuevamente.";
        }
        else if (params.accion == "capacidadDeCredito" && params.status == "error") {
          this.data.model.mensaje.level = "danger";
          this.data.model.mensaje.mensaje = "El descuento mensual excede la capacidad de crédito.";
        }
        else if (params.accion == "tablaAmortizacion" && params.status == "error") {
          this.data.model.mensaje.level = "danger";
          this.data.model.mensaje.mensaje = "Ha ocurrido un error con la generación de la simulación, favor de internar nuevamente";
        }
      }
      );
  }

  solicitudVigente(seleccion: number) {
    //console.log("Incia validacion de solicitudes vigentes");
    this.boton = seleccion;
    
    this.capacidadCreditoService.getSolicitudVigente(this.model.pensionado)
      .subscribe(() => this.capacidadCredito());
  }

  capacidadCredito() {
    this.model.pensionado.sesion = this.data.model.sesion;

    this.capacidadCreditoService.getCapacidadCredito(this.model.pensionado)
      .subscribe((capacidadCredito: CapacidadCredito) => this.validarCapacidadCredito(capacidadCredito));

  }

  validarCapacidadCredito(capacidadCredito: CapacidadCredito) {

    switch (this.boton) {
      case 1:
        this.model.capacidadCredito = { ...capacidadCredito };
        //if (this.model.capacidadCredito != null && this.model.capacidadCredito.impCapacidadTotal > 0) {
          this.router.navigate(['/pensionado/simulacionBusqueda', {}]);
        //} else {
        //  this.data.model.mensaje.mensaje = "No cuentas con capacidad de crédito, no podrás realizar una simulación.";
        //  this.data.model.mensaje.level = "danger";
        //}
        break;

      case 2:
        this.model.capacidadCredito = { ...capacidadCredito };
        if (this.model.capacidadCredito != null) {
          this.router.navigate(['/pensionado/capacidadCredito', {}]);
        }
        break;
      case 3:
        this.model.capacidadCredito = { ...capacidadCredito };
        if (this.model.capacidadCredito != null) {

          this.router.navigate(['../../pensionado/buscarFolioCancelar', {}]);
        }
        break;
    }

  }


  /**
   * 
   * @param folio 
   * @param idSolPrestamo 
   * @param numFolioSolicitud 
   * 
   * El parametro folio y el numFolioSolicitud pertenecen a folios creados en MCLPEm unicamente que 
   * numFolioSolicitud ya vendría de la consulta de estados una vez sincronizados los prestamos
   * con SIPRE.
   * 
   */

  buscarFolio(folio: string, idSolPrestamo: string) {
    this.openModal();
    console.log("Buscar folio: " + folio + " - " + idSolPrestamo);

    if (folio != null) {

      this.model.mensaje.mensaje = "";
      this.model.mensaje.level = "";

      this.buscarFolioService.buscarFolio(folio, null, null)
        .subscribe(
          (solicitud: Solicitud) => this.validarFolio(solicitud, idSolPrestamo)
        );

    } else {
      console.log(" Pasa else Buscar idSolPrestamo: " + idSolPrestamo);
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

  validarFolio(solicitud, idSolPrestamo) {
    this.resumenSimulacion.solicitud = { ...solicitud.solicitud };
    this.resumenCartaCapacidad.solicitud = { ...solicitud.solicitud };
    this.resumenSimulacion.solicitud.idSolPrFinanciero = idSolPrestamo;
    this.consultaResumenSimulacion(this.resumenSimulacion);
  }


  closeModal() {
    this.modalService.close("carga");
    this.disabled = false;
  }

  openModal() {
    this.modalService.open("carga");
    this.disabled = true;
  }

  consultaResumenSimulacion(resumenSimulacion) {
    this.resumenSimulacionService.consultar(resumenSimulacion)
      .subscribe(
        (resumenSimulacion: CartaInstruccion) => {
          if(resumenSimulacion != null)
            this.validarResumenSimulacion(resumenSimulacion);
          else
            this.closeModal();
        }
      );
  }

  consultaResumenSimulacionSPES(resumenSimulacion: CartaInstruccion) {
    this.resumenSimulacionService.consultarConSPES(resumenSimulacion).subscribe(
      (resumenSimulacion: CartaInstruccion) => {
        if(resumenSimulacion != null)
          this.validarResumenSimulacion(resumenSimulacion);
        else
          this.closeModal();
      }
    );
  }

  validarResumenSimulacion(rs: CartaInstruccion) {
    this.resumenSimulacion.solicitud = { ...rs.solicitud };
    this.resumenSimulacion.prestamo = { ...rs.prestamo };
    this.resumenSimulacion.pensionado = { ...rs.pensionado };
    this.resumenSimulacion.oferta = { ...rs.oferta };
    this.resumenSimulacion.documentos = rs.documentos;
    this.resumenSimulacion.tablaAmort = rs.tablaAmort;
    this.resumenSimulacion.descuentosAplicados = rs.descuentosAplicados;
    this.resumenSimulacion.listPrestamoRecuperacion = rs.listPrestamoRecuperacion;
    this.resumenSimulacion.bitacoras =rs.bitacoras;
    this.resumenSimulacion.promotor = rs.promotor;
    this.resumenSimulacion.personaModel = rs.personaModel;
    this.model.cartaInstruccion = this.resumenSimulacion;
    this.closeModal();

    this.router.navigate(['/pensionado/ver-detalle-simulacion', {}]);
  }

  irAyuda() {
    window.open('http://www.imss.gob.mx/derechoH/prestamo-pensionados', '_blank');
  }

  cancelarSimulacion() {
    this.closeModalCancelar();
    this.openModal();
    console.log(">>>CANCELAR, idSolicitud ", this.idSolicitud);
    this.cancelarSolicitud.getCancelar(this.idSolicitud).subscribe((solicitud: Solicitud) => this.validarCancelacion(solicitud));

  }

  validarCancelacion(solicitud) {
    if (solicitud.id != null) {
      let bitacora: Bitacora = new Bitacora();
      bitacora.curp = solicitud.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.CANCELAR_FOLIO_NEGOCIO;
      bitacora.idSolicitud = solicitud.id;
      bitacora.estadoSolicitud = EstadoSolicitud.CANCELADO;
      this.bitacoraService.create(bitacora).subscribe();
      this.closeModal();
      //this.modalService.open("exitoCancelar");
      this.model.mensajeAux.mensaje = "El folio ha sido cancelado con éxito.";
      this.model.mensajeAux.level = "success";
      this.onPaged(1);

    }
  }

  validarEstadoFolio(idSolicitud: number, idEstadoSolicitud: number) {
    this.idSolicitud = idSolicitud;
    switch (idEstadoSolicitud) {
      case 1:
        console.log(">>>Cancelar, Estado VALIDO");
        this.modalService.open("cancelarFolio");
        break;
      case 2:
        console.log(">>>Cancelar, Estado VALIDO");
        this.modalService.open("cancelarFolio");
        break;
      //case 3:
      // console.log(">>>Cancelar, Estado VALIDO");
      //this.modalService.open("cancelarFolio");
      //break;
      case 5:
        console.log(">>>Cancelar, Estado VALIDO");
        this.modalService.open("cancelarFolio");
        break;
      case 15:
        console.log(">>>Cancelar, Estado VALIDO");
        this.modalService.open("cancelarFolio");
        break;
      default:
        console.log(">>>Cancelar, Estado INVALIDO");
        this.model.mensaje.mensaje = "El folio debe estar en estado Iniciado, Documentación Entregada  o En trámite para poder realizar la cancelación. Favor de verificar.";
        this.model.mensaje.level = "danger";
        break;
    }

  }

  closeModalCancelar() {
    this.modalService.close("cancelarFolio");
  }



  closeModalExitoCancelar() {
    this.activarOpciones = false;
    this.onPaged(1);
    this.modalService.close("exitoCancelar");
  }

  seleccionSolicitud(seleccion: number) {
    this.activarOpciones = true;
    this.data.model.folioVigente = { ...this.pageFolioVigente.content[seleccion] }
    //console.log("seleccionSolicitud folio:" + this.data.model.folioVigente);
  }

  onPaged(page: number) {

    //console.log("onPaged:" + page);
    this.solicitudesVigentesRequest.model.nss = this.model.pensionado.nss;
    this.solicitudesVigentesRequest.page = page;
    this.solicitudesVigentesRequest.pageSize = pageSize;
    this.solicitudesVigentesService.getBusquedaSolicitudes(this.solicitudesVigentesRequest)
      .subscribe((response: Page<FolioVigente>) => this.setBusquedaSolicitudes(response));
    this.pageFolioVigente.number = page - 1;
    this.pageFolioVigente.prepare();
  }

  setBusquedaSolicitudes(response: Page<FolioVigente>) {
    if (response.totalElements == 0) {
      //this.activoBusqueda = false;
      //this.activoBusquedafecha = false;
      //this.mensajeEstado.mensaje = "No se encontró información.";
      //this.mensajeEstado.level = "danger";
      this.modalService.close("carga");
      return;
    }
    //console.log("busquedaSolicitudAutorizar(response)", response);
    //for (let i = 0; response.content.length > i; i++) {
    ////console.log("responseERPE-.-.-", response.content[i].solicitud.estadoSolicitud);

    //this.estadoSolicitud = enumEstadoSolicitud.forValue(Number(this.estado));

    //response.content[i].solicitud.estadoSolicitud = this.estadoSolicitud.descripcion;
    //response.content[i].solicitud.estadoSolicitud = response.content[i].solicitud.cveEstadoSolicitud.desEstadoSolicitud;

    //}
    this.pageFolioVigente = new Page<FolioVigente>();
    this.pageFolioVigente.init(response);
    this.solicitudesVigentesRequest.totalElements = response.totalElements;
    this.solicitudesVigentesRequest.totalMclpeElements = response.totalMclpeElements;
    this.solicitudesVigentesRequest.totalPages = response.totalPages;


    //this.mensajeEstado.mensaje = "";
    //this.mensajeEstado.level = "";
    //this.modalService.close("carga");
  }
}
