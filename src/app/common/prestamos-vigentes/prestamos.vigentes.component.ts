// TODO: Feature Componetized like CrisisCenter
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { PrestamosVigentesService } from '../services/prestamos.vigentes.service';
import { PrestamosVigentes } from '../domain/prestamos.vigentes';
import { PlazoService } from 'src/app/common/services/plazo.service';
import { PensionRequestPlazo, PlazoRequest } from 'src/app/common/domain/plazo.request';
import { Plazo } from '../../common/domain/plazo';
import { ModalService } from 'src/app/common/modal-Services';
import { Oferta, OfertaRequest, Page, PageRequest } from 'src/app/common/domain';
import { EntidadFinancieraService } from 'src/app/common/services/entidad.financiera.service';
import { BaseComponent } from 'src/app/common/base.component';
import { Mensaje } from '../domain/mensaje';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { SaldoCapitalResponse } from 'src/app/common/domain/saldoCapital-Response';
declare var $: any;

@Component({
  selector: 'app-prestamos-vigentes',
  templateUrl: './prestamos.vigentes.component.html',
  styleUrls: ['../css/tarjetas-estilos-base.css']
})
export class PrestamosVigentesComponent extends BaseComponent implements OnInit {

  @Output() prestamoVigenteSeleccionado = new EventEmitter<string>();
  @Input() rol: any;
  model: Model;
  mensajePrestamosVigentes: Mensaje;
  prestamoVigenteIdSolicitud = "app sellect";
  requestSeleccionFinanciera: PageRequest<OfertaRequest>;
  pageOfertas: Page<Oferta> = new Page<Oferta>();
  capacidadOriginal: any;
  saldoCapitalResponsel: number;
  plazoRequest: PlazoRequest = new PlazoRequest();
  pensionRequestPlazo: PensionRequestPlazo = new PensionRequestPlazo();
  sumaDescMensual: number;
  flagError: boolean;
  flagErrorMonto: boolean;
  solicitado: any;

  constructor(protected data: DataService,
    private plazoService: PlazoService,
    private entidadFinancieraService: EntidadFinancieraService,
    private modalService: ModalService,
    private prestamosVigentesService: PrestamosVigentesService) { super(data) }

  ngOnInit() {
    this.model = this.data.model;
    this.requestSeleccionFinanciera = new PageRequest<OfertaRequest>();
    this.model.prestamosRecuperacionArreglo = [];
    this.model.saldoCapitalTotal = 0;
    this.capacidadOriginal = this.data.model.capacidadCredito.impCapacidadTotal;
    this.model.sumaDescuentoTotal = this.capacidadOriginal;
    this.model.prestamoRecuperacion = null;
    this.flagError = false;
    this.flagErrorMonto = false;
    this.prestamosVigentesService.getListPrestamosVigentes(this.model.pensionado)
      .subscribe((response: [PrestamosVigentes]) => this.validarPrestamosVigentes(response));
  }

  async validarPrestamosVigentes(response: [PrestamosVigentes]) {

    this.model.prestamosVigentesArreglo = [];
    if (response.length > 0) {
      this.mensajePrestamosVigentes = { id: "", mensaje: "", level: "" };
      for (var i = 0; i < response.length; i++) {
        this.model.prestamosVigentesArreglo[i] = { ...response[i] };
        this.model.prestamosVigentesArreglo[i].saldoCapital = 0;
        this.model.prestamosVigentesArreglo[i].flagEditRen = false;
        this.model.SaldoCapitalRequest.folioSipre = this.model.prestamosVigentesArreglo[i].idSolicitud;
        this.model.SaldoCapitalRequest.numMensualidad = Number(this.model.prestamosVigentesArreglo[i].mensualidadesDescontadas);
        this.model.SaldoCapitalRequest.numFolioSolicitud = this.model.prestamosVigentesArreglo[i].numFolioSolicitud;
        await this.prestamosVigentesService.getSaldoCapital(this.model.SaldoCapitalRequest)
          .then((response2: SaldoCapitalResponse) => this.model.SaldoCapitalResponse = { ...response2 });
        ;
        setTimeout(function () {

        }, 3000);
        this.model.prestamosVigentesArreglo[i].saldoCapital = (Number(this.model.SaldoCapitalResponse.saldoCapital)).toFixed(2);
      }
    } else {
      this.mensajePrestamosVigentes = { id: "No hay préstamos vigentes.", mensaje: "No hay préstamos vigentes.", level: "info" };
      return;
    }
  }


  calculcarMontoMaximo(capacidad: string) {
    this.model.montoMaximoPrestar = 0;
    this.plazoRequest.sesion = this.data.model.sesion;
    this.plazoRequest.tipoSimulacion = '1';
    this.plazoRequest.monto = capacidad;
    this.pensionRequestPlazo.fechaNacimiento = this.model.pensionado.fechaNacimiento;
    this.pensionRequestPlazo.sexo = this.data.model.pensionado.sexo;
    this.pensionRequestPlazo.entidadFederativa = this.model.pensionado.entidadFederativa;
    this.pensionRequestPlazo.delegacion = this.model.pensionado.delegacion;
    this.plazoRequest.pensionado = this.pensionRequestPlazo;
    this.plazoRequest.capacidadCredito = Number(capacidad);
    this.plazoService.getPlazo(this.plazoRequest).subscribe((response: Plazo[]) => this.validarPlazoMontoMaximo(response));
  }

  validarPlazoMontoMaximo(response: Plazo[]) {
    let plazoMaximo: Plazo[] = [];
    if (response != null) {
      const distinctPlazos = response.filter(
        (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
      );
      for (var i = 0; i < distinctPlazos.length; i++) {
        plazoMaximo[i] = { ...distinctPlazos[i] };
      }

    }
    let uniqueSet = new Set(plazoMaximo);
    plazoMaximo = [...uniqueSet];
    if (plazoMaximo.length <= 0) {
      this.modalService.close("cargaMontoMaximoPV");
    } else {
      let ofertaRequest: OfertaRequest = new OfertaRequest();
      ofertaRequest.plazo = plazoMaximo[plazoMaximo.length - 1].id;
      ofertaRequest.tipoSimulacion = '2';
      ofertaRequest.monto = ofertaRequest.tipoSimulacion === "1" ? this.model.simulacion.prestamo.monto : "";
      ofertaRequest.descuentoMensual = (this.data.model.sumaDescuentoTotal).toString();
      ofertaRequest.pensionado.sexo = String(this.model.pensionado.sexo);
      ofertaRequest.pensionado.fechaNacimiento = this.model.pensionado.fechaNacimiento;
      ofertaRequest.pensionado.entidadFederativa = this.model.pensionado.entidadFederativa;
      ofertaRequest.pensionado.delegacion = this.model.pensionado.delegacion;
      this.requestSeleccionFinanciera.page = 1;
      this.requestSeleccionFinanciera.model = ofertaRequest;
      this.entidadFinancieraService
        .fetchOfertas(this.requestSeleccionFinanciera)
        .subscribe(
          (response: Page<Oferta>) => {
            if(response === null)
              this.modalService.close("cargaMontoMaximoPV");
            else
              this.validarEntidadFinanciera(response);
          }
        );
    }
  }

  validarEntidadFinanciera(response: Page<Oferta>) {
    this.pageOfertas = new Page<Oferta>();
    this.pageOfertas.init(response);
    this.model.montoMaximoPrestar = Number(this.pageOfertas.content[0].monto);
    this.modalService.close("cargaMontoMaximoPV");
  }

  seleccionPrestamo(id: string) {
    if (this.rol === 'pensionado') {
      this.modalService.open("cargaMontoMaximoPV");
      let indice = $('input[id="' + id + '"]:checked').length;
      for (let p of this.model.prestamosVigentesArreglo) {
        if (p.idSolicitud == id) {
          let pr = new PrestamoRecuperacion();
          pr.numSolicitudSipre = p.idSolicitud;
          pr.canCatPrestamo = Number(p.cat);
          pr.canDescuentoMensual = Number(p.descuentoMensual);
          pr.canMontoSol = Number(p.montoSolicitado);
          pr.numSolicitudSipre = p.idSolicitud;
          pr.numPlazoPrestamo = Number(p.descripcionPlazo);
          pr.numMesRecuperado = Number(p.mensualidadesDescontadas);
          pr.numEntidadFinanciera = p.descripcionEntidadFinanciera;
          pr.nombreComercial = p.nombreComercialEF;
          pr.clabe = p.clabe;
          pr.saldoCapital = Number(p.saldoCapital);
          pr.correoAdminEF = p.correoAdminEF;
          pr.montoActualizado = 0;
          pr.numFolioSolicitud = p.numFolioSolicitud;
          if (indice > 0) {
            this.model.saldoCapitalTotal = Number(this.model.saldoCapitalTotal) + Number(p.saldoCapital) + Number(Number(p.descuentoMensual).toFixed(2)) + Number(Number(p.descuentoMensual).toFixed(2));
            if (Number(this.model.simulacion.prestamo.tipoSimulacion) > 0) {
              this.model.pendientePagarRecuperacion = Number(pr.canDescuentoMensual);
              this.model.sumaPrestamoRecuperacion = (Number(pr.canDescuentoMensual)).toFixed(2);
              this.model.sumaDescuentoTotal = (Number(this.model.sumaDescuentoTotal) + Number(this.model.sumaPrestamoRecuperacion)).toFixed(2);
              if (this.model.simulacion.prestamo.tipoSimulacion === undefined || Number(this.model.simulacion.prestamo.tipoSimulacion) === 1) {
                this.calculcarMontoMaximo(this.model.sumaDescuentoTotal);
              } else {
                this.modalService.close("cargaMontoMaximoPV");
              }
            }
            this.model.prestamoRecuperacion = pr;
            this.model.prestamosRecuperacionArreglo.push(this.model.prestamoRecuperacion);
            break;
          } else {
            this.model.saldoCapitalTotal = this.model.saldoCapitalTotal - p.saldoCapital - Number(Number(p.descuentoMensual).toFixed(2)) - Number(Number(p.descuentoMensual).toFixed(2));
            this.model.pendientePagarRecuperacion = Number(pr.canDescuentoMensual);
            this.model.sumaPrestamoRecuperacion = (Number(pr.canDescuentoMensual)).toFixed(2);
            this.model.sumaDescuentoTotal = (Number(this.model.sumaDescuentoTotal) - Number(this.model.sumaPrestamoRecuperacion)).toFixed(2);
            if (this.model.simulacion.prestamo.tipoSimulacion === undefined || Number(this.model.simulacion.prestamo.tipoSimulacion) === 1) {
              this.calculcarMontoMaximo(this.model.sumaDescuentoTotal);
            } else {
              this.modalService.close("cargaMontoMaximoPV");
            }
            this.model.prestamoRecuperacion = pr;
            this.model.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo.filter(p => Number(p.numSolicitudSipre) !== Number(id));
            break;
          }
        }
      }
    } else if (this.rol === 'promotor') {
      let indice = $('input[id="' + id + '"]:checked').length;
      for (let p of this.model.prestamosVigentesArreglo) {
        let salCapOr: number;
        if (p.idSolicitud == id) {
          salCapOr = p.saldoCapitalOriginal;
          let pr = new PrestamoRecuperacion();
          pr.numSolicitudSipre = p.idSolicitud;
          pr.canCatPrestamo = Number(p.cat);
          pr.canDescuentoMensual = Number(p.descuentoMensual);
          pr.canMontoSol = Number(p.montoSolicitado);
          pr.numSolicitudSipre = p.idSolicitud;
          pr.numPlazoPrestamo = Number(p.descripcionPlazo);
          pr.numMesRecuperado = Number(p.mensualidadesDescontadas);
          pr.numEntidadFinanciera = p.descripcionEntidadFinanciera;
          pr.nombreComercial = p.nombreComercialEF;
          pr.clabe = p.clabe;
          pr.saldoCapital = Number(p.saldoCapital);
          pr.correoAdminEF = p.correoAdminEF;
          p.saldoCapitalOriginal = p.saldoCapital;
          pr.saldoCapitalOriginal = Number(p.saldoCapitalOriginal);
          pr.montoActualizado = 0;
          pr.numFolioSolicitud = p.numFolioSolicitud;
          if (indice > 0) {
            if (this.model.personaEF.entidadFinanciera.cveEntidadFinancieraSipre == p.descripcionEntidadFinanciera) {
              p.flagEditRen = true;
            }
            this.model.prestamoRecuperacion = pr;
            this.model.prestamosRecuperacionArreglo.push(this.model.prestamoRecuperacion);
            this.model.capacidadPensionado += pr.canDescuentoMensual;
            break;
          } else {
            if (this.model.personaEF.entidadFinanciera.cveEntidadFinancieraSipre == p.descripcionEntidadFinanciera) {
              p.flagEditRen = false;
              console.log("Saldo Capital y SaldoCapitalOriginal ", p.saldoCapital, p.saldoCapitalOriginal);
              p.saldoCapital = salCapOr;
            }
            this.model.prestamoRecuperacion = pr;
            this.model.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo.filter(p => Number(p.numSolicitudSipre) !== Number(id));
            this.model.capacidadPensionado -= pr.canDescuentoMensual;
            this.validarMonto(1, 1);
            break;
          }
        }
      }
    }
    this.prestamoVigenteSeleccionado.emit(id);
  }

  validarMonto(solicitud: any, descuento: any) {
    let flag = false;
    this.model.flagMontoRenovacion = false;
    this.model.prestamosVigentesArreglo.forEach(p => {
      if (p.flagEditRen) {
        if (flag) {
          return;
        } else {
          if (p.saldoCapital == null || p.saldoCapital.toString() == "") {
            this.flagError = true;
            this.model.flagMontoRenovacion = true;
            flag = true;
          } else {
            this.flagError = false;
            let suma = Number(Number(p.saldoCapitalOriginal) + Number(p.descuentoMensual) + Number(p.descuentoMensual));
            suma = Number(suma.toFixed(2));
            if (!(p.saldoCapital < suma)) {
              this.flagErrorMonto = true;
              flag = true;
              this.solicitado = p.idSolicitud;
              this.model.flagMontoRenovacion = true;
            } else {
              this.flagErrorMonto = false;
            }
          }
        }
        if (!flag && !this.flagErrorMonto) {
          this.modificaRecuperacion(p.idSolicitud);
        }
      }
    });

  }
  modificaRecuperacion(solicitud: string) {
    this.model.prestamosRecuperacionArreglo.forEach(p => {
      if (p.numSolicitudSipre == solicitud) {
        this.model.prestamosVigentesArreglo.forEach(q => {
          if (q.idSolicitud == solicitud) {
            p.saldoCapital = Number(q.saldoCapital);
            p.montoActualizado = 1;
          }
        });
      }
    });
  }
}
