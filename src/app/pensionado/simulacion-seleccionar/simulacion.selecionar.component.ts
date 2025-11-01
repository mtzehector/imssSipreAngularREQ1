import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Model } from 'src/app/model';
import { Page } from 'src/app/common/domain/page';
import { EntidadFinancieraService } from 'src/app/common/services/entidad.financiera.service';
import { Ofertaresponse } from 'src/app/common/domain/oferta.response';
import { SeleccionFinancieraRequest } from 'src/app/common/domain/seleccionfinanciera.request';
import { ModelRequest } from 'src/app/common/domain/model.request';
import { Pensionadorequest } from 'src/app/common/domain/pensionado.request';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PageRequest } from 'src/app/common/domain/page.request';
import { OfertaRequest } from 'src/app/common/domain/oferta.request';
import { Oferta } from 'src/app/common/domain/oferta';
import { DatosOferta } from 'src/app/common/domain/datos.oferta';
import { EntidadFinancieraResponse } from 'src/app/common/domain/entidadfinanciera.response';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { Documento } from 'src/app/common/domain/documento';
import { ReporteDocumento } from 'src/app/common/domain/reporte';
import { SolicitudesVigentesService } from 'src/app/common/services/solicitudes.vigentes.service';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { environment } from 'src/environments/environment';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';


@Component({
  selector: 'app-simulacion-selecionar',
  templateUrl: './simulacion.selecionar.component.html',
})
export class SimulacionSelecionarComponent extends BaseComponent implements OnInit {

  requestSeleccionFinanciera: PageRequest<OfertaRequest>;
  pageOfertas: Page<Oferta> = new Page<Oferta>();
  datosoferta: DatosOferta = new DatosOferta();
  modelaOferta: boolean = false;
  oferta: number;
  botonDesabilitado: boolean = true;
  idOferta: number = 0;
  ofertaSeleccionada: string;
  disabled: boolean = false;
  tipoCredito: TipoCredito;

  constructor(protected data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private entidadFinancieraService: EntidadFinancieraService,
    private bitacoraService: BitacoraService,
    private solicitudesVigentesService: SolicitudesVigentesService
  ) { super(data) }

  ngOnInit() {
    this.model = this.data.model;
    this.model.mensaje.mensaje = "";
    this.modelaOferta = false;
    this.botonDesabilitado = true;
    this.requestSeleccionFinanciera = new PageRequest<OfertaRequest>();

    let ofertaRequest: OfertaRequest = new OfertaRequest();

    ofertaRequest.plazo = this.model.simulacion.prestamo.oferta.plazo.id;
    ofertaRequest.tipoSimulacion = this.model.simulacion.prestamo.tipoSimulacion;
    ofertaRequest.monto = ofertaRequest.tipoSimulacion === "1" ? this.model.simulacion.prestamo.monto : "";
    ofertaRequest.descuentoMensual = ofertaRequest.tipoSimulacion === "2" ? this.model.simulacion.prestamo.monto : "";
    ofertaRequest.pensionado.sexo = String(this.model.pensionado.sexo);
    ofertaRequest.pensionado.fechaNacimiento = this.model.pensionado.fechaNacimiento;
    ofertaRequest.pensionado.entidadFederativa = this.model.pensionado.entidadFederativa;
    ofertaRequest.pensionado.delegacion = this.model.pensionado.delegacion;
    ofertaRequest.prestamoRecuperacion = this.model.prestamoRecuperacion;
    this.requestSeleccionFinanciera.page = 1;
    this.requestSeleccionFinanciera.model = ofertaRequest;
    this.entidadFinancieraService
      .fetchOfertas(this.requestSeleccionFinanciera)
      .subscribe(
        (response: Page<Oferta>) => {
          if(response != null)
            this.validarEntidadFinanciera(response);
        }
      );

  }


  validarEntidadFinanciera(response: Page<Oferta>) {
    let respuesta: Page<Oferta> = new Page<Oferta>();
    let cotenido: Oferta[] = response.content;

    respuesta = response;
    respuesta.content = new Array();
    let total: number = respuesta.numberOfElements;
    for (let i = 0; i < total; i++) {
      if (cotenido[i].descuentoMensual <= this.model.sumaDescuentoTotal) {
        respuesta.content.push(cotenido[i]);
      }
    }

    if(respuesta.content.length == 0) {
      this.model.mensaje.mensaje = "No existen entidades financieras que otorguen prestamos bajo las condiciones registradas";
      this.model.mensaje.level = "danger";
    }

    this.pageOfertas = new Page<Oferta>();
    this.pageOfertas.init(respuesta);
  }

  onPaged(page: number) {
    this.idOferta = (page - 1) * 10;
    this.requestSeleccionFinanciera.page = page;
    this.entidadFinancieraService
      .fetchOfertas(this.requestSeleccionFinanciera)
      .subscribe(
        (response: Page<Oferta>) => {
          if(response != null)
            this.validarEntidadFinanciera(response);
        }
      );
    this.pageOfertas.number = page - 1;
    this.pageOfertas.prepare();
  }

  handleChange(evt: number) {
    this.botonDesabilitado = true;
    let continuarProceso = true;
    this.obtenerTipoDeCredito(this.pageOfertas.content[evt]);
    if (this.tipoCredito === TipoCredito.COMPRA_CARTERA) {
      continuarProceso = this.elCATSeleccionadoEsMenor(this.pageOfertas.content[evt].cat);
    }
    if (continuarProceso) {
      this.oferta = evt;
      this.model = this.data.model;
      this.model.mensaje.mensaje = "";
      this.botonDesabilitado = false;
      this.model.simulacion.prestamo.idOferta = Number(this.pageOfertas.content[evt].id);
      this.model.simulacion.pensionado = this.model.pensionado;

      this.datosoferta.id = Number(this.pageOfertas.content[evt].id);
      this.datosoferta.nombreComercial = this.pageOfertas.content[evt].entidadFinanciera.nombreComercial;
      this.datosoferta.numTelefono = String(this.pageOfertas.content[evt].entidadFinanciera.numTelefono);
      this.datosoferta.paginaWeb = this.pageOfertas.content[evt].entidadFinanciera.paginaWeb;
      this.datosoferta.razonSocial = this.pageOfertas.content[evt].entidadFinanciera.razonSocial;
      this.datosoferta.cveEntidadFinanciera = Number(this.pageOfertas.content[evt].entidadFinanciera.id);
      this.datosoferta.idSipre = this.pageOfertas.content[evt].entidadFinanciera.idSipre;

      this.datosoferta.monto = this.pageOfertas.content[evt].monto;
      this.datosoferta.cat = this.pageOfertas.content[evt].cat;
      this.datosoferta.descuentoMensual = this.pageOfertas.content[evt].descuentoMensual;
      this.datosoferta.descripcionNumPlazo = this.pageOfertas.content[evt].plazo.descripcion;
      this.datosoferta.importeTotal = this.pageOfertas.content[evt].importeTotal;
      this.datosoferta.tasaAnual = this.pageOfertas.content[evt].tasaAnual;

      this.data.model.ofertaDatos = this.datosoferta;
      this.ofertaSeleccionada = "1";

      if ((evt != 0 || this.pageOfertas.currentPage != 1)) {
        this.modelaOferta = true;
        this.modalService.open("mejorOferta");
        this.oferta = undefined;
      }
    }
    else {
      let m = new Mensaje();
      m.level = "warning";
      m.mensaje = "El CAT de la oferta seleccionada debe ser menor al CAT mínimo de los préstamos por liquidar. Favor de verificar.";
      this.model.mensaje = m;
    }
  }

  obtenerTipoDeCredito(entidadFinanciera: Oferta) {
    if (this.data.model.prestamosRecuperacionArreglo.length == 0) {
      this.tipoCredito = TipoCredito.NUEVO;
      return;
    }
    let sonIguales = false;
    let idEntidadFinanciera = "";
    if (this.data.model.prestamosRecuperacionArreglo.length > 0) {
      let listPrestamosSeleccionados = this.data.model.prestamosRecuperacionArreglo;
      idEntidadFinanciera = listPrestamosSeleccionados[0].numEntidadFinanciera;
      sonIguales = listPrestamosSeleccionados.every(item => item.numEntidadFinanciera == idEntidadFinanciera);
    }
    if (sonIguales && (idEntidadFinanciera === entidadFinanciera.entidadFinanciera.idSipre)) {
      this.tipoCredito = TipoCredito.RENOVACION;
    } else {
      this.tipoCredito = TipoCredito.COMPRA_CARTERA;
    }
  }

  elCATSeleccionadoEsMenor(cat: string) {
      let catNumerico = Number(Number(cat).toFixed(2));
      for (let pr of this.model.prestamosRecuperacionArreglo) {
        if (!(catNumerico <= Number(Number(pr.canCatPrestamo - environment.ajustePorcentualCAT).toFixed(2)))) {
          return false;
        }
      }
    return true;
  }

  continuarInforme() {
    this.modalService.close("mejorOferta");
    this.solicitudesVigentesService.ValidaMontoDescuento(this.model.pensionado.nss, this.model.ofertaDatos.descuentoMensual)
      .subscribe((valido: number) => {
        if (valido == 1) {
          let m = new Mensaje();
          m.level = "warning";
          m.mensaje = "No es posible continuar con el préstamo debido a que existe otro préstamo con el mismo importe mensual, favor de intentar nuevamente solicitando un importe de préstamo distinto.";
          this.model.mensaje = m;
        } else {
          if (this.datosoferta.id !== undefined) {
            this.modalService.open("carga");
            this.entidadFinancieraService.fetchLogo(this.datosoferta.cveEntidadFinanciera)
              .subscribe((response: Documento) => this.goToSimulacionInforme(response));
            let bitacora: Bitacora = new Bitacora();
            bitacora.curp = this.data.model.pensionado.curp;
            bitacora.sesion = this.data.model.sesion;
            bitacora.tipo = TipoBitacora.SELECCIONA_PROPUESTA_SIMULACION;
            this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
          }
          else {
            this.modelaOferta = true;
            this.model.mensaje.mensaje = "Debes elegir una propuesta para continuar con el proceso.";
            this.model.mensaje.level = "danger";
            return;
          }
        }
      });
  }

  goToSimulacionInforme(response: Documento) {
    
    this.model.ofertaDatos.imgB64 = response.archivo;

    this.modalService.close("carga");

    this.router.navigate(['/simulacionInforme', {}]);
  }

  getLogo<Documento>(cveEntidadFinanciera: number) {
    let promise = new Promise<Documento>((resolve, reject) => {
      this.entidadFinancieraService
        .fetchLogo(cveEntidadFinanciera)
        .toPromise()
        .then(
          res => { 
            this.model.ofertaDatos.imgB64 = res.archivo;
            return;
          }
        );
    });
    return promise;
  }

  enviarCorreo() {
    if (this.requestSeleccionFinanciera.model.tipoSimulacion === "1") {
      this.requestSeleccionFinanciera.model.descuentoMensual = "0";
    }
    else {
      this.requestSeleccionFinanciera.model.monto = "0";
    }
    this.requestSeleccionFinanciera.model.email = this.data.model.persona.correoElectronico;

    this.modalService.open("carga");
    this.entidadFinancieraService
      .sendEmail(this.requestSeleccionFinanciera)
      .subscribe((response: any) => this.correoEnviado());

  }

  correoEnviado() {
    this.modalService.close("carga");
  }

  cerrarOferta() {
    this.modalService.close("mejorOferta");
  }

  acptarOferta() {
    this.modalService.close("mejorOferta");
  }

  openModal() {
    this.modalService.open("carga");
    this.disabled = true;
  }


}
