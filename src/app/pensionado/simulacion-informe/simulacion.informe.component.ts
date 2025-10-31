import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { GuardadoSimulacion } from 'src/app/common/services/gaurdado.simulacion.service';
import { Simulacion } from 'src/app/common/domain/simulacion';
import { PensionRequest } from 'src/app/common/domain/pension.request';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';
import { CapacidadCredito, EntidadFinanciera, Mensaje } from 'src/app/common/domain';
import { SolicitudesVigentesService } from 'src/app/common/services/solicitudes.vigentes.service';
import { CapacidadCreditoService } from 'src/app/common/services/capacidad.credito.service';

@Component({
  selector: 'app-simulacion-informe',
  templateUrl: './simulacion.informe.component.html',
})
export class SimulacionInformeComponent extends BaseComponent implements OnInit {

  avisoCheck: number;
  estado: string;
  idx: number;
  creditoRenovacion: boolean  = false;
  creditoCompraCartera: boolean = false;
  creditoNuevo: boolean = false;
  flatMejorCondicion: boolean = false;
  flatNombreComercialEF: boolean = false;
  flagBitacora: boolean = false;
  entidadFinanciera: EntidadFinanciera =  new EntidadFinanciera();

  static readonly errorRegPrestamo = 'regPrestamo';
  static readonly errorCapacidadDeCredito = 'capacidadDeCredito';
  static readonly errorTablaAmortizacion = 'tablaAmortizacion';

  constructor(protected data: DataService,
    private router: Router,
    private guardadoSimulacion: GuardadoSimulacion,
    private modalService: ModalService,
    private bitacoraService: BitacoraService,
    private solicitudesVigentesService: SolicitudesVigentesService,
    private capacidadCreditoService: CapacidadCreditoService) {
    super(data);
  }

  ngOnInit() {
    this.model = this.data.model;
  }

  armarPensionado(pension: PensionRequest) {

  }

  cheked() {
    this.avisoCheck = this.avisoCheck !== 1 ? 1 : 0;
  }

  asignarCapacidadCreditoEnSimulacion(capacidadCredito: CapacidadCredito) {
    this.model.capacidadCredito = { ...capacidadCredito };
    this.model.simulacion.capacidadCredito.impCapacidadFija = this.model.capacidadCredito.impCapacidadFija;
    this.model.simulacion.capacidadCredito.impCapacidadTotal = this.model.capacidadCredito.impCapacidadTotal;
    this.model.simulacion.capacidadCredito.impCapacidadVariable = this.model.capacidadCredito.impCapacidadVariable;
  }
  
  sumaConPrecision = (a, b, positions) => {
    const factor = Math.pow(10, positions)
    return (a.toFixed(positions) * factor + b.toFixed(positions) * factor) / factor
  }

  obtenerTotalDescuentoDePrestamosRecuperacion() {
    let totalDescuento = 0.0;

    if(this.model != undefined 
      && this.model.prestamosRecuperacionArreglo != undefined
      && this.model.prestamosRecuperacionArreglo.length > 0) {
        for (let prestamosRecuperacion of this.model.prestamosRecuperacionArreglo) {
          totalDescuento = this.sumaConPrecision(totalDescuento, prestamosRecuperacion.canDescuentoMensual, 2);
        }
      }

    return totalDescuento;
  }

  esValidoElMontoMensualDeDescuento() {
    if(this.model != undefined 
      && this.model.ofertaDatos != undefined
      && this.model.ofertaDatos.descuentoMensual != undefined
      && this.model.capacidadCredito != undefined
      && this.model.capacidadCredito.impCapacidadTotal != undefined
      && Number(this.model.ofertaDatos.descuentoMensual) <= 
        this.sumaConPrecision(this.model.capacidadCredito.impCapacidadTotal, this.obtenerTotalDescuentoDePrestamosRecuperacion(), 2)) {
        return true;
    }
    return false;
  }

  irHomePensionado(accionError: string) {
    this.router.navigate(
      ['/pensionado/home'],
      {
        queryParams:
        {
          accion: accionError,
          status: 'error',
        }
      }
    );
  }

  async validaCapacidadDeCredito () {
    return await new Promise<boolean>((resolve) => {

      this.model.pensionado.sesion = this.data.model.sesion;

      this.capacidadCreditoService.getCapacidadCredito(this.model.pensionado)
      .subscribe(
        (capacidadCredito: CapacidadCredito) => {
          this.asignarCapacidadCreditoEnSimulacion(capacidadCredito);
          if (this.esValidoElMontoMensualDeDescuento()) {
            resolve(true);
          }
          else {
            this.irHomePensionado(SimulacionInformeComponent.errorCapacidadDeCredito);
            resolve(false);
          }
        },
        error => {
          console.log(error);
          this.irHomePensionado(SimulacionInformeComponent.errorRegPrestamo);
          resolve(false);
        }
      );
      
    });
  }

  async guardarSimulacion() {
    this.closeModal();
    
    if(await this.validaCapacidadDeCredito()) {
      this.modalService.open("carga");
      this.data.model.simulacion.prestamo.primerDescuento = this.model.prestamo.primerDescuento;
      this.data.model.simulacion.prestamoRecuperacion = this.model.prestamoRecuperacion;
      this.data.model.simulacion.ofertaDatos = this.model.ofertaDatos;
      await this.validarMejorOfertaEF();
      this.model.simulacion.ofertaDatos.imgB64='';
      console.log(">>>SIMULACION ", JSON.stringify(this.model.simulacion));
      this.guardadoSimulacion.getGuardado(this.model.simulacion).subscribe(
        (responseSimulacion: Simulacion) => this.finalizarGuarado(responseSimulacion),
        error => {
          console.log(error);
          if (this.model.mensaje.mensaje && this.model.mensaje.mensaje.includes("tabla de amortizacion")) {
            this.irHomePensionado(SimulacionInformeComponent.errorTablaAmortizacion);
          }else{
            this.irHomePensionado(SimulacionInformeComponent.errorRegPrestamo);
          }
        }
      );
    }
  }

  finalizarGuarado(responseSimulacion: Simulacion) {
    this.modalService.close("carga");
    this.model.prestamosRecuperacionArreglo= [];

    if (responseSimulacion.solicitud.id != null) {

      this.model.simulacion = { ...responseSimulacion };
      this.model.documento.tipoDocumentoEnum = TipoDocumento.RESUMEN_SIMULACION;
      this.model.documento.numFolioSolicitud = this.model.simulacion.solicitud.numFolioSolicitud;

      let bitacora: Bitacora = new Bitacora();
      bitacora.curp = this.data.model.pensionado.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.GENERAR_RESUMEN_SIMULACION;
      bitacora.idSolicitud = this.model.simulacion.solicitud.id;
      if(this.flagBitacora){
        bitacora.estadoSolicitud = EstadoSolicitud.PENDIENTE_MONTO_A_LIQUIDAR;
      }else{
        bitacora.estadoSolicitud = EstadoSolicitud.POR_ASIGNAR_PROMOTOR;
      }
      this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));

      this.router.navigate(['/pensionado/simulacionFinalizar', {}]);
    }
  }

  openModal() {
    if (this.avisoCheck !== 1) {
      this.estado = "true";
    }else{
      this.solicitudesVigentesService.ValidaMontoDescuento(this.model.pensionado.nss,this.model.ofertaDatos.descuentoMensual)
    .subscribe((valido: number) => {
      if(valido == 1){
        let m = new Mensaje();
        m.level = "warning";
        m.mensaje = "No es posible continuar con el préstamo debido a que existe otro préstamo con el mismo importe mensual, favor de intentar nuevamente solicitando un importe de préstamo distinto.";
        this.model.mensaje = m;
      }else{
        if (this.avisoCheck !== 1) {
          this.estado = "true";
        } else {
          this.modalService.open("custom-modal-2");
        }
      }
    });
    }
    
    
    
  }

  closeModal() {
    this.modalService.close("custom-modal-2");
  }

  async validarMejorOfertaEF(){
    if(this.model.prestamosRecuperacionArreglo != null && this.model.prestamosRecuperacionArreglo.length > 0 ){
      //console.log(">>>validarMejorOpcionEF ", JSON.stringify(this.model.prestamosRecuperacionArreglo));
      for(var i of this.model.prestamosRecuperacionArreglo){
          if(this.data.model.simulacion.ofertaDatos.idSipre === i.numEntidadFinanciera){
               this.creditoRenovacion = true;
          }else{ 
             this.creditoCompraCartera = true;
             if(Number(this.model.simulacion.ofertaDatos.cat) <= i.canCatPrestamo ){
               //this.flatMejorCondicion = true;
               //this.creditoCompraCartera = false;
             }else{
              await this.guardadoSimulacion.validarEF(i.numEntidadFinanciera).then((response: EntidadFinanciera) => { 
              console.log(">>>ENTIDADFIN ", JSON.stringify(response));  
              if(Number(response.cveEntidadFinancieraSipre) > 0){
                  this.entidadFinanciera = {...response};
                  i.mejorOferta = 1;
                  for(let x of this.model.prestamosRecuperacionArreglo){
                    if(i.numSolicitudSipre != x.numSolicitudSipre){
                     if(x.mejorOferta == 1){
                       if(x.canCatPrestamo <= i.canCatPrestamo){
                         i.mejorOferta = 0;
                       }else{
                         x.mejorOferta = 0
                       }
                     }
                    }
                  } 
                } 
              });             
             }
              
          }
      }
    }else{
     this.creditoNuevo = true;
    }
    
    //SE VALIDA EL TIPO DE CREDITO 
    if(this.creditoNuevo){
      this.model.simulacion.prestamo.tipoCredito = TipoCredito.NUEVO.id;
      this.model.simulacion.prestamo.tipoCreditoId = 1;
    }else{
      if(this.creditoRenovacion && this.creditoCompraCartera){
        this.model.simulacion.prestamo.tipoCredito = TipoCredito.MIXTO.id;
        this.model.simulacion.prestamo.tipoCreditoId = 6;
        this.flagBitacora = true;
      }else if(this.creditoRenovacion){
        this.model.simulacion.prestamo.tipoCredito = TipoCredito.RENOVACION.id;
        this.model.simulacion.prestamo.tipoCreditoId = 2;
      }else if(this.creditoCompraCartera){
        this.model.simulacion.prestamo.tipoCredito = TipoCredito.COMPRA_CARTERA.id;
        this.model.simulacion.prestamo.tipoCreditoId = 3;
        this.flagBitacora = true;
      }else{
        this.model.simulacion.prestamo.tipoCredito = TipoCredito.NUEVO.id;
        this.model.simulacion.prestamo.tipoCreditoId = 1;
      }
    }
    this.model.simulacion.lstPrestamoRecuperacion = this.model.prestamosRecuperacionArreglo;
    for(let i of this.model.simulacion.lstPrestamoRecuperacion){
      if(i.mejorOferta === 1){
        this.model.simulacion.entidadFinanciera = {...this.entidadFinanciera};
      }
    }
  }

}
