import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Plazo } from '../../common/domain/plazo';
import { Model } from "../../model";
import { PlazoRequest } from 'src/app/common/domain/plazo.request';
import { PrestamoService } from 'src/app/common/services/prestamo.service';
import { Prestamo } from 'src/app/common/domain/prestamo';
import { CapacidadCredito } from 'src/app/common/domain/capacidad.credito';
import { Pensionado } from 'src/app/common/domain/pensionado';
import { PlazosResponse } from 'src/app/common/domain/plazos.response';
import { PlazoService } from 'src/app/common/services/plazo.service';
import { Simulacion } from 'src/app/common/domain/simulacion';
import { PensionRequestPlazo } from 'src/app/common/domain/plazo.request';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { CapacidadCreditoService } from 'src/app/common/services/capacidad.credito.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { ModalService } from 'src/app/common/modal-Services';
import { Oferta, OfertaRequest, Page, PageRequest } from 'src/app/common/domain';
import { EntidadFinancieraService } from 'src/app/common/services/entidad.financiera.service';
import { PrestamosVigentes } from 'src/app/common/domain/prestamos.vigentes';
declare var $: any;

@Component({
  selector: 'app-simulacion-busqueda',
  templateUrl: './simulacion.busqueda.component.html',
})
export class SimulacionBusquedaComponent extends BaseComponent implements OnInit {


  requestSeleccionFinanciera: PageRequest<OfertaRequest>;
  pageOfertas: Page<Oferta> = new Page<Oferta>();
  servicio: number = 0;
  model: Model;
  plazoRequest: PlazoRequest = new PlazoRequest();
  pensionRequestPlazo: PensionRequestPlazo = new PensionRequestPlazo();
  regexDecimal: string = '^\\d{1,100}\\.{0,1}\\d{1,2}$';
  capacidadSpanTotal: number;
  disabledSimular: boolean = true;
  rol: string;
  montoMaximoOriginal:any=0;
  capacidadCredito: CapacidadCredito = new CapacidadCredito();
  listPrestamosSeleccionados: PrestamosVigentes[] = [];

  constructor(protected data: DataService,
    private router: Router,
    private prestamoService: PrestamoService,
    private capacidadCreditoService: CapacidadCreditoService,
    private plazoService: PlazoService,
    private modalService: ModalService,
    private entidadFinancieraService: EntidadFinancieraService,
    private bitacoraService: BitacoraService) {
    super(data);
  }

  ngOnInit() {
    this.rol = 'pensionado';
    this.model.montoMaximoPrestar = 0;
    this.model.saldoCapitalTotal = 0;
    this.disabledSimular = true;
    this.requestSeleccionFinanciera = new PageRequest<OfertaRequest>();
    this.model.prestamosRecuperacionArreglo = [];



    if (this.model.simulacion.prestamo.tipoSimulacion === "") {
      this.model.simulacion.prestamo.tipoSimulacion = "1";
    }
    this.model.simulacion.prestamo.monto = '';
    this.model.simulacion.prestamo.oferta = new Oferta();
    this.data.model.pensionado.curp = this.model.persona.curp;
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.model.plazos = undefined;
    
    //console.log("--.-.-.-.-capacidad", this.data.model.capacidadCredito);
    this.model.sumaDescuentoTotal = this.data.model.capacidadCredito.impCapacidadTotal;
    this.calculcarMontoMaximo(this.model.sumaDescuentoTotal);
    this.capacidadSpanTotal = this.data.model.capacidadCredito.impCapacidadTotal;
    if (this.data.model.simulacion.prestamo.tipoSimulacion !== undefined && this.data.model.simulacion.prestamo.tipoSimulacion === '2') {
      this.model.simulacion.prestamo.monto = this.data.model.capacidadCredito.impCapacidadTotal.toString();
    }
    //this.calculcarMontoMaximo((this.data.model.capacidadCredito.impCapacidadTotal).toString());
    if (this.model.prestamosVigentesArreglo.length < 1) {
      this.model.mensaje.mensaje = "No cuentas con préstamos vigentes.";
      this.model.mensaje.level = "info";
    }
  }

  calculcarMontoMaximo(capacidad: string) {
    this.plazoRequest.tipoSimulacion = '2';
    this.plazoRequest.monto = (Number(capacidad) - 0.0001).toString();
    this.pensionRequestPlazo.fechaNacimiento = this.model.pensionado.fechaNacimiento;
    this.pensionRequestPlazo.sexo = this.data.model.pensionado.sexo;
    this.pensionRequestPlazo.entidadFederativa = this.model.pensionado.entidadFederativa;
    this.pensionRequestPlazo.delegacion = this.model.pensionado.delegacion;
    this.plazoRequest.pensionado = this.pensionRequestPlazo;
    this.plazoRequest.capacidadCredito = Number(capacidad);
    this.plazoRequest.sesion = this.data.model.sesion;

    this.plazoService.getPlazo(this.plazoRequest).subscribe((response: Plazo[]) => this.validarPlazoMontoMaximo(response), 
    error => {this.model.plazos = [];});

  }
  tipoSeleccion(valorTipo: number) {
    $('input[type="checkbox"]').prop("checked", false);
    this.model.plazos = undefined;
    this.model.prestamosRecuperacionArreglo = [];

    let indexCheck:any  = $('input[type="checkbox"]:checked').length;
if(indexCheck<=0 && valorTipo===1){
  this.model.saldoCapitalTotal=0;
}
    this.cambio();
    this.disabledSimular = true;
    this.servicio = 0;
    this.model.simulacion.prestamo.oferta.plazo.descripcion = "";

    if (valorTipo === 2) {
      this.data.model.simulacion.prestamo.tipoSimulacion =valorTipo.toString();
      this.model.montoMaximoPrestar =this.montoMaximoOriginal;
      this.model.simulacion.prestamo.monto = String(this.data.model.capacidadCredito.impCapacidadTotal)
      this.model.sumaDescuentoTotal = this.data.model.capacidadCredito.impCapacidadTotal;
      if(this.model.simulacion.prestamo.tipoSimulacion != '2')
        this.onMontoBlur();
    }
    else {
      this.model.simulacion.prestamo.monto = "";
    }
  }
  deshabilitarPlazoYBotonContinuarOferta() {
    this.disabledSimular = true;
    this.model.simulacion.prestamo.oferta.plazo = new Plazo();
    this.servicio = 0;
    this.model.plazos = [];
  }
  onMontoFocus() {
    this.deshabilitarPlazoYBotonContinuarOferta();
  }
  onPrestamoVigenteSeleccionado(idPrestamoVigente: string) {

    this.deshabilitarPlazoYBotonContinuarOferta();
  }
  onMontoBlur() {
    this.data.model.mensaje.mensaje = "";
    this.data.model.mensaje.level = "";
    //if (this.model.simulacion.prestamo.monto.indexOf(".") === -1) {
    //this.model.simulacion.prestamo.monto = this.model.simulacion.prestamo.monto + ".00";
    //}
    if (this.model.simulacion.prestamo.monto.length < 4) {
      this.model.simulacion.prestamo.oferta.plazo.descripcion = "";
    }



    this.plazoRequest.tipoSimulacion = this.data.model.simulacion.prestamo.tipoSimulacion;
    this.plazoRequest.capacidadCredito = this.data.model.capacidadCredito.impCapacidadTotal;
    //this.plazoRequest.capacidadCredito=20000;
    this.pensionRequestPlazo.fechaNacimiento = this.model.pensionado.fechaNacimiento;
    this.pensionRequestPlazo.sexo = this.data.model.pensionado.sexo;
    this.pensionRequestPlazo.entidadFederativa = this.model.pensionado.entidadFederativa;
    this.pensionRequestPlazo.delegacion = this.model.pensionado.delegacion;

    this.plazoRequest.pensionado = this.pensionRequestPlazo;
    this.plazoRequest.monto = this.model.simulacion.prestamo.monto;
    if (this.model.prestamoRecuperacion === null || this.model.prestamosRecuperacionArreglo.length < 1) {
      this.model.sumaDescuentoTotal = this.data.model.capacidadCredito.impCapacidadTotal;

    } else {

      //this.model.sumaDescuentoTotal = (this.model.prestamoRecuperacion.canDescuentoMensual +this.data.model.capacidadCredito.impCapacidadTotal).toFixed(2);
      this.plazoRequest.capacidadCredito = this.model.sumaDescuentoTotal;
      let indexCheck:any  = $('input[type="checkbox"]:checked').length;

      if (this.plazoRequest.tipoSimulacion === '1' && indexCheck>0) {
        if (Number(this.model.simulacion.prestamo.monto) <= this.model.saldoCapitalTotal) {
          this.model.mensaje.mensaje = "El monto solicitado debe ser mayor a la suma del saldo capital más dos mensualidades de los préstamos a liquidar seleccionados. Favor de verificar.";
          this.model.mensaje.level = "danger";
          //  this.modalService.open("saldoCapital");

          return false;
        }
      }
    }

    if (this.plazoRequest.tipoSimulacion === '2') {
      let importe = Math.round(parseFloat(this.model.simulacion.prestamo.monto) * 100) / 100;
      this.model.simulacion.prestamo.monto = importe.toString();
      if (!(this.model.prestamoRecuperacion === null) && this.model.prestamosRecuperacionArreglo.length > 0) {
        this.plazoRequest.capacidadCredito = this.model.saldoCapitalTotal;
       

      }
      this.plazoRequest.monto = (Number(this.plazoRequest.monto) - 0.01).toString();
    }

    if (
      (
        this.plazoRequest.tipoSimulacion === '1'
        &&
        Number(this.model.simulacion.prestamo.monto) <= this.model.montoMaximoPrestar
      )
      ||
      (
        this.plazoRequest.tipoSimulacion === '2'
        &&
        Number(this.model.simulacion.prestamo.monto) <= this.model.sumaDescuentoTotal
      )
    ) {
      this.plazoRequest.sesion = this.data.model.sesion;

      this.modalService.open("carga");
      this.plazoService.getPlazo(this.plazoRequest).subscribe((response: Plazo[]) => this.validarPlazo(response),
      error => {this.model.plazos = []; this.modalService.close("carga");});

    } else {
      this.model.plazos = [];

    }


    //console.log('>>>Bitacora onMontoBlur='+this.data.model.simulacion.prestamo.tipoSimulacion);
    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.pensionado.curp;
    bitacora.sesion = this.data.model.sesion;
    switch (this.data.model.simulacion.prestamo.tipoSimulacion) {

      case "1":
        bitacora.tipo = TipoBitacora.INGRESA_MONTO_SOLICITADO_POR_MONTO;
        this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
        break;
      case "2":
        bitacora.tipo = TipoBitacora.INGRESA_MONTO_SOLICITADO_POR_DESCUENTO;
        this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
        break
      default:
        //console.log(this.data.model.simulacion.prestamo.tipoSimulacion);
        break;

    }

    this.model.plazos = [];

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
    } else {
      let ofertaRequest: OfertaRequest = new OfertaRequest();

      ofertaRequest.plazo = plazoMaximo[plazoMaximo.length - 1].id;
      ofertaRequest.tipoSimulacion = '2';
      ofertaRequest.monto = ofertaRequest.tipoSimulacion === "1" ? this.model.simulacion.prestamo.monto : "";
      ofertaRequest.descuentoMensual = (this.data.model.capacidadCredito.impCapacidadTotal).toString();
      ofertaRequest.pensionado.sexo = String(this.model.pensionado.sexo);
      ofertaRequest.pensionado.fechaNacimiento = this.model.pensionado.fechaNacimiento;
      ofertaRequest.pensionado.entidadFederativa = this.model.pensionado.entidadFederativa;
      ofertaRequest.pensionado.delegacion = this.model.pensionado.delegacion;
      this.requestSeleccionFinanciera.page = 1;
      this.requestSeleccionFinanciera.model = ofertaRequest;

      //this.model = this.data.model;
      this.entidadFinancieraService
        .fetchOfertas(this.requestSeleccionFinanciera)
        .subscribe(
          (response: Page<Oferta>) => {
            if (response != null) 
              this.validarEntidadFinanciera(response);
          }
        );
    }
  }

  validarEntidadFinanciera(response: Page<Oferta>) {
    //console.log(".-.-.-.-.-.");
    //console.log(response);
    this.pageOfertas = new Page<Oferta>();
    this.pageOfertas.init(response);
 

    this.model.montoMaximoPrestar = Number(this.pageOfertas.content[0].monto);
    if(this.montoMaximoOriginal===0){
      this.montoMaximoOriginal=this.model.montoMaximoPrestar;
    }

  }


  validarPlazo(response: Plazo[]) {

    this.model.plazos = [];
    if (response != null) {
      const distinctPlazos = response.filter(
        (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
      );
      for (var i = 0; i < distinctPlazos.length; i++) {
        this.model.plazos[i] = { ...distinctPlazos[i] };
      }

    }
    let uniqueSet = new Set(this.model.plazos);
    this.model.plazos = [...uniqueSet];

    this.servicio = 1;
    this.modalService.close("carga");
    //console.log(response);

  }
  closeModal() {
    this.modalService.close("saldoCapital");
  }
  cambio() {
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    if (this.model.simulacion.prestamo.oferta.plazo.descripcion !== undefined && this.model.simulacion.prestamo.oferta.plazo.descripcion.length === 0) {
      this.disabledSimular = true;
    }
    else {
      this.disabledSimular = false;
    }
  }

  continuarOferta() {

    if (this.model.simulacion.prestamo.monto == '' || this.model.simulacion.prestamo.monto == null || this.model.simulacion.prestamo.monto == undefined) {
      this.model.mensaje.mensaje = "No es posible continuar, debes ingresar una cantidad en el monto solicitado";
      this.model.mensaje.level = "danger";
      return;
    }
    else if (this.model.simulacion.prestamo.oferta.plazo.descripcion !== undefined && this.model.simulacion.prestamo.oferta.plazo.descripcion.length === 0) {
      this.model.mensaje.mensaje = "Debe seleccionar un plazo";
      this.model.mensaje.level = "danger";

      return;
    }
    if(!this.validamonto()){
      return;
    }
    if(!this.esValidoElMontoMensualDeDescuento()){
      this.data.model.mensaje.mensaje = "No cuentas con capacidad de crédito, no podrás realizar una simulación.";
      this.data.model.mensaje.level = "danger";
      return;
    }

    if (this.data.model.simulacion.prestamo.tipoSimulacion !== undefined) {
      let bitacora: Bitacora = new Bitacora();
      bitacora.curp = this.data.model.pensionado.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.SELECCIONA_PLAZO;
      this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
      //this.simulacion.prestamo.tipoSimulacion = this.tipoSimulacion; 
      //  this.router.navigate(['/pensionado/capacidadResumen', {}]);
      this.router.navigate(['./simulacionSelecionar', {}]);

    } else {
      this.model.mensaje.mensaje = "Falta tipo simulacion";
      this.model.mensaje.level = "danger";
      return;
    }
  }

  validamonto(){
    let indexCheck:any  = $('input[type="checkbox"]:checked').length;
    if (this.plazoRequest.tipoSimulacion === '1' && indexCheck>0) {
      if (Number(this.model.simulacion.prestamo.monto) <= this.model.saldoCapitalTotal) {
        this.model.mensaje.mensaje = "El monto solicitado debe ser mayor a la suma del saldo capital más dos mensualidades de los préstamos a liquidar seleccionados. Favor de verificar.";
        this.model.mensaje.level = "danger";
        //  this.modalService.open("saldoCapital");

        return false;
      }
    }
    return true;
  }


  
  esValidoElMontoMensualDeDescuento() {

    if (this.model == undefined || this.model.capacidadCredito == undefined || this.model.capacidadCredito.impCapacidadTotal == undefined) 
      return false;

    let capacidadCredito: number = 0;
    let prestamosSeleccionados: boolean = this.model.prestamosRecuperacionArreglo != undefined && this.model.prestamosRecuperacionArreglo.length > 0 ? true : false;
    
    if (prestamosSeleccionados) 
      capacidadCredito = this.sumaConPrecision(
        this.model.capacidadCredito.impCapacidadTotal, 
        this.obtenerTotalDescuentoDePrestamosRecuperacion(), 
        2);
    else
      capacidadCredito = this.model.capacidadCredito.impCapacidadTotal;
    
    
    if (capacidadCredito > 0) 
      return true;
    
    return false;
  }

  obtenerTotalDescuentoDePrestamosRecuperacion() {
    let totalDescuento = 0.0;
    if(this.model != undefined && 
      this.model.prestamosRecuperacionArreglo != undefined && 
      this.model.prestamosRecuperacionArreglo.length > 0
    ) {
        for (let prestamosRecuperacion of this.model.prestamosRecuperacionArreglo) {
          totalDescuento = this.sumaConPrecision(
            totalDescuento, 
            prestamosRecuperacion.canDescuentoMensual, 
            2
          );
        }
      }
    return totalDescuento;
  }

  sumaConPrecision = (a, b, positions) => {
    const factor = Math.pow(10, positions);
    return (a.toFixed(positions) * factor + b.toFixed(positions) * factor) / factor;
  }

}
