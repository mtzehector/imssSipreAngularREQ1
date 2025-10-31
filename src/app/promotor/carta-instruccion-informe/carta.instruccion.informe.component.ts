import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { GuardarCartaInstruccionService } from 'src/app/common/services/guardar.carta.instruccion.service';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { Prestamo } from '../../common/domain/prestamo';
import { TipoCredito } from '../../common/domain/tipo.credito';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { PrestamoEnRecuperacionRs } from '../../common/domain/prestamo.recuperacionrs';
import { PrestamoService } from 'src/app/common/services';

@Component({
  selector: 'app-carta-instruccion-informe',
  templateUrl: './carta.instruccion.informe.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class CartaInstruccionInformeComponent extends BaseComponent implements OnInit {

  solicitud: Solicitud;
  cartaInstruccion: CartaInstruccion;
  promotor: PersonaEF;
  estado: string;
  avisoCheck: number;
  aceptoAviso: string;
  errorAviso;
  nuevo: Prestamo;
  fecha: string;
  rol: String;
  idx: number;
  prestamoRecuperacion?: PrestamoRecuperacion = new PrestamoRecuperacion();
  listPrestamoRecuperacion: PrestamoEnRecuperacionRs = new PrestamoEnRecuperacionRs();
  resumenSimulacion: CartaInstruccion;
  imgPromotorUrl: string = '';
  imgEFUrl: string = '';
  flagConPrestamos: number = 0;
  flagErrorMonto: boolean;
  flagMontoVacio: boolean;
  solicitado : any;
  suma : number;


  constructor(protected data: DataService, private route: ActivatedRoute,
    private mensajeService: MensajeService, private router: Router,
    private guardarCartaInstruccionService: GuardarCartaInstruccionService,
    private modalService: ModalService,
    private prestamosService: PrestamoService)
    /*,
    private resumenSimulacionService: ResumenSimulacionService) */ {
    super(data);
  }

  ngOnInit() {
    this.model = this.data.model;
    this.estado = "";
    this.rol = "promotor";
    this.cartaInstruccion = this.model.cartaInstruccion;
    this.promotor = this.model.personaEF;
    this.prestamoRecuperacion = this.model.cartaInstruccion.prestamoRecuperacion;
    this.listPrestamoRecuperacion = this.model.cartaInstruccion.listPrestamoRecuperacion;
    
    this.nuevo = new Prestamo();
    this.nuevo.tipoCreditoEnum = this.cartaInstruccion.prestamo.tipoCreditoEnum = this.model.cartaInstruccion.prestamo.tipoCredito === 1 ? TipoCredito.NUEVO : (this.model.cartaInstruccion.prestamo.tipoCredito === 2 ? TipoCredito.RENOVACION : TipoCredito.COMPRA_CARTERA);

    this.fecha = this.data.model.cartaInstruccion.prestamo.primerDescuento.substring(0,10);

    this.resumenSimulacion = this.model.cartaInstruccion;
    if (this.resumenSimulacion.solicitud.altaRegistro != null) {
      this.resumenSimulacion.solicitud.altaRegistro = (this.resumenSimulacion.solicitud.altaRegistro).substring(0, 10);
      this.resumenSimulacion.solicitud.fecVigenciaFolio = (this.resumenSimulacion.solicitud.fecVigenciaFolio).substring(0, 10);
    }
    if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion == null) {
      var pres = new Array();
      this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion = pres;
    } else {
      if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.length != 0) {
        this.flagConPrestamos = 1;
        this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p =>{
          if(p.numEntidadFinanciera == this.model.personaEF.entidadFinanciera.cveEntidadFinancieraSipre){
            p.flagEditMont = true;
            p.saldoCapitalOriginal = p.saldoCapital;
            p.saldoCapital = Number(p.saldoCapital.toFixed(2));
          }else{
            p.flagEditMont = false;
          }
        }); 
      }
    }
    this.flagErrorMonto = false;
    this.flagMontoVacio = false;
    console.log(">>>resumenSimulacion JFBA: ", JSON.stringify(this.resumenSimulacion));
    if (this.resumenSimulacion.promotor.imgB64 == null) {
      this.imgPromotorUrl = '/mclpe/auth/js/assets/img/Vector.png';
    } else {
      this.imgPromotorUrl = 'data:image/png;base64,' + this.resumenSimulacion.promotor.imgB64;
    }

    if (this.resumenSimulacion.oferta.entidadFinanciera.imgB64 == null) {
      this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
    } else {
      this.imgEFUrl = 'data:image/png;base64,' + this.resumenSimulacion.oferta.entidadFinanciera.imgB64;
    }

  }
  cheked() {
    this.avisoCheck = this.avisoCheck !== 1 ? 1 : 0;
  }


  guardarCartaInstruccion() {
    this.cartaInstruccion.prestamo.promotor = this.promotor.idPersonaEF;
    this.cartaInstruccion.personaEf = { ...this.promotor };
    this.closeModal();
    this.modalService.open("carga");
    this.guardarCartaInstruccionService.create(this.cartaInstruccion)
      .subscribe((cartaInstruccion: CartaInstruccion) => this.validarCartaInstruccion(cartaInstruccion));

  }

  validarCartaInstruccion(cartaInstruccion) {
    //console.log(">>><<<<Carta de Libranza: " + JSON.stringify(cartaInstruccion));
    this.modalService.close("carga");
    //console.log(cartaInstruccion.solicitud.id);
    this.model.cartaInstruccion = { ...cartaInstruccion };
    this.model.documento.tipoDocumentoEnum = TipoDocumento.CARTA_INSTRUCCION;
    this.model.documento.numFolioSolicitud = cartaInstruccion.solicitud.numFolioSolicitud;
    this.router.navigate(['/promotor/cartaFinalizar', {}]);
  }
  openModal() {
    if (this.avisoCheck !== 1) {

      this.estado = "true";
      this.errorAviso;

    }

    else {

      this.modalService.open("confirmarCarta");
    }
  }

  closeModal() {
    this.modalService.close("confirmarCarta");
  }

  navegarTerminosCondiciones() {
    this.modalService.close("preguntaRegistroMonto");
    this.router.navigate(['/promotor/terminoCondiciones', {}]);
  }

  validarMonto(){
    console.log("VALIDA MONTO");
    let flag = false;
    this.flagErrorMonto = false;
    this.flagMontoVacio = false;
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p =>{
      if(p.flagEditMont){
        console.log("Se puede editar");
        if(flag){
          return;
        }
        else{
          if (p.saldoCapital == null || p.saldoCapital.toString() == "") {
            flag = true;
            this.flagMontoVacio = true; 
          }else{
            let suma = Number(Number(p.saldoCapitalOriginal.toFixed(2)) + Number(p.canDescuentoMensual.toFixed(2))+ Number(p.canDescuentoMensual.toFixed(2)));
            suma = Number(suma.toFixed(2));
            console.log("SUMA ", suma);
            console.log("SALDO CAPITAL ", p.saldoCapital);
            if(!(p.saldoCapital < suma)){
              this.flagErrorMonto = true;
              flag = true;
              this.solicitado = p.numSolicitudSipre;
              console.log("dentro del if ", this.flagErrorMonto, flag, this.solicitado);
            }else{
              this.flagErrorMonto = false;
            }
          }
        }

      }
    });
  }

  continuarNo() {
    this.modalService.close("preguntaRegistroMonto");
  }

  confirmarMonto() {
    this.suma = 0;
    let flag : boolean  = false;
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach( p =>{
      if(p.flagEditMont){
        this.suma = Number(p.saldoCapital)+ Number(this.suma);
        flag = true;
      }
    });
    if(flag){
      this.modalService.open("preguntaRegistroMonto");
    }else{
      this.navegarTerminosCondiciones();
    }
  }

  guardarSaldos(){
    console.log(">>>RESUMEN SIMULACION JFBA: ", JSON.stringify(this.resumenSimulacion));
    let cartaInstruccion: CartaInstruccion = new CartaInstruccion();
    let lpr : PrestamoEnRecuperacionRs = new PrestamoEnRecuperacionRs();
    let prs : PrestamoRecuperacion[] = new Array();
    lpr.prestamosEnRecuperacion = prs;
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p =>{
      if(p.flagEditMont){
        let pr : PrestamoRecuperacion = p;
        pr.canMontoSol = pr.saldoCapital;
        pr.montoActualizado =1;
        lpr.prestamosEnRecuperacion.push(pr);
      }
    });
    cartaInstruccion.listPrestamoRecuperacion = lpr;
    cartaInstruccion.solicitud = this.resumenSimulacion.solicitud;
    cartaInstruccion.persona.nombre = this.resumenSimulacion.personaModel.nombre;
    cartaInstruccion.persona.primerApellido = this.resumenSimulacion.personaModel.primerApellido;
    cartaInstruccion.persona.segundoApellido = this.resumenSimulacion.personaModel.segundoApellido;
    cartaInstruccion.persona.correoElectronico = this.resumenSimulacion.personaModel.correoElectronico;

    console.log(">>>CARTA INSTRUCCION JFBA: ", JSON.stringify(cartaInstruccion));
    this.prestamosService.registroMontoRenovacion(cartaInstruccion).subscribe((cartaInstruccion: CartaInstruccion) => this.navegarTerminosCondiciones());
  }
}
