import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { ModalService, DataService, PrestamoService } from 'src/app/common/services';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';
import { MontoLiquidar } from 'src/app/common/domain/monto.liquidar';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { BitacoraService } from 'src/app/common/services/bitacora.service';


@Component({
  selector: 'app-informe-monto-liquidar',
  templateUrl: './informe-monto-liquidar.component.html',
  styleUrls: ['./informe-monto-liquidar.component.css','../../common/css/tarjetas-estilos-base.css']
})
export class InformeMontoLiquidarComponent extends BaseComponent implements OnInit {
  public model: Model;
  public regexCurp: string = '^([A-Z&]|[a-z&]{1})([AEIOU]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$';
  public regexNSS: string = '^(15|90|91|92|93|94|95|96|97|68|01|06|07|10|11|17|66|20|27|28|29|70|30|36|37|38|39|40|69|42|44|45|46|51|21|25|22|81|32|52|71|53|15|55|03|43|47|33|35|31|12|72|13|04|54|56|16|23|26|24|57|83|09|49|08|78|02|62|48|14|82|41|61|65|58|05|67|59|84|85|34   )([0-9]{2})([0-9]{2})([0-9]{4})([0-9]{1})$';
  public regexNumerico: string = '^[0-9]+([.][0-9]+)?$';
  public formGroup: FormGroup;
  public rol: string;
  fechaPrimerDescuento: string;
  imgEFUrl: string = '';
  resumenSimulacion: CartaInstruccion;
  flagConPrestamos: number = 0;
  fecha: string;
  flagErrorMonto: boolean;
  flagError: boolean;
  saldoCapital: MontoLiquidar[] = new Array();
  suma : Number;
  montonuevo : number;
  solicitado : any;
  flagErrorReferencia : boolean;
  flagErrorReferenciaCaracter :boolean;
  prereferencia:string;

  constructor(protected data: DataService,
    private router: Router,
    public location: Location,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private prestamosService: PrestamoService,
    private bitacoraService: BitacoraService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    //this.buildForm();
    console.log("Init del informe monto liquidar");
    this.flagErrorMonto = false;
    this.flagError = false;
    this.fechaPrimerDescuento = this.model.cartaInstruccion.prestamo.primerDescuento;
    this.fechaPrimerDescuento = (this.fechaPrimerDescuento).substring(0, 10);
    this.rol = "adminEFSinConvenio";
    this.flagErrorReferencia = false;
    this.flagErrorReferenciaCaracter = false;

    //this.model.cartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion;

    this.resumenSimulacion = this.model.cartaInstruccion;
    console.log(this.resumenSimulacion);
    if (this.resumenSimulacion.solicitud.altaRegistro != null) {
      this.resumenSimulacion.solicitud.altaRegistro = (this.resumenSimulacion.solicitud.altaRegistro).substring(0, 10);
      this.resumenSimulacion.solicitud.fecVigenciaFolio = (this.resumenSimulacion.solicitud.fecVigenciaFolio).substring(0, 10);
  }

  this.prereferencia = this.resumenSimulacion.pensionado.nss+"-"+this.resumenSimulacion.pensionado.nombre +"-"+this.resumenSimulacion.pensionado.primerApellido+"-"+ this.resumenSimulacion.pensionado.segundoApellido;
    if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion == null) {
      var pres = new Array();
      this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion = pres;
    } else {
      if (this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.length != 0) {
        this.flagConPrestamos = 1;
        this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(e => { 
          e.referencia = this.prereferencia;
          let round = e.saldoCapital.toFixed(2);
          e.saldoCapital = Number(round);
          let saveSaldos: MontoLiquidar = new MontoLiquidar();
          saveSaldos.saldoCapital = e.saldoCapital;
          saveSaldos.solicitudSipre = e.numSolicitudSipre;
          this.saldoCapital.push(saveSaldos); 
          this.montonuevo += e.saldoCapital;
        });
        
      }
    }

    
    if (this.resumenSimulacion.prestamo.oferta.entidadFinanciera.imgB64 == null) {
      this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
    } else {
      this.imgEFUrl = 'data:image/png;base64,' + this.resumenSimulacion.prestamo.oferta.entidadFinanciera.imgB64;
    }
    this.fecha = (this.resumenSimulacion.prestamo.primerDescuento).substring(0, 10);

    console.log(this.resumenSimulacion);

  }

  private buildForm() {

    this.formGroup = this.formBuilder.group({
      monto: ['', [Validators.required]]
    });

  }

  validarMonto(solicitud: any, descuento: any){
    let flag = false;
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p => {
      if(flag == true){
        return;
      }else{  
        if (p.saldoCapital == null || p.saldoCapital.toString() == "") {
          this.flagError = true;
          flag = true;       
        }else{
          this.flagError = false;
          this.saldoCapital.forEach( i =>{
            if((i.solicitudSipre == p.numSolicitudSipre)){
              this.suma =0;
              this.suma = i.saldoCapital + p.canDescuentoMensual +p.canDescuentoMensual;
              console.log(">>>saldo capital < suma", p.saldoCapital, this.suma);
              if(!(p.saldoCapital < this.suma)){
                this.flagErrorMonto = true;
                flag = true;
                this.solicitado = i.solicitudSipre;
              }
              else {
                this.flagErrorMonto = false;
                this.montonuevo =p.saldoCapital;
              }
            }
          });
        }
      }
    });
  }

  guardarMontos(){
    this.modalService.open("carga");
    console.log(">>>PRESTAMOS", JSON.stringify(this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion));
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p => {
      p.canMontoSol = p.saldoCapital;
    });
    this.model.cartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion = this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion;
    console.log(">>>PRESTAMOS CON NUEVOS SALDOS",  this.model.cartaInstruccion);
    this.prestamosService.registroMonto(this.model.cartaInstruccion).subscribe((cartaInstruccion: CartaInstruccion) => this.registroExitoso(cartaInstruccion));
       
  }

  //validarMonto(saldoCapital: any, solicitud: any){
    // let form = this.formGroup.value;
    // let agregado = false;
    // console.log(">>>validarMonto", Number(saldoCapital.toFixed(2)), " - ", solicitud, " - ", form.monto);
    // if(form.monto <= saldoCapital){
    //   console.log("entro");
    //   this.flagErrorMonto = true;
    //   return;
    // }
    // if(this.saldoCapital != null && this.saldoCapital.length > 0){
    //   this.saldoCapital.forEach(e => {
    //     if (e.solicitudSipre == solicitud) {
    //       e.nuevoSaldoCapital = form.monto;
    //       agregado = true;
    //     }
    //   });
    // }
    
    // if(!agregado){
    //   let montoLiq: MontoLiquidar = new MontoLiquidar();
    //   montoLiq.nuevoSaldoCapital = form.monto;
    //   montoLiq.solicitudSipre = solicitud;
    //   this.saldoCapital.push(montoLiq);   
    // }
    // console.log(JSON.stringify(this.saldoCapital));
    // this.flagErrorMonto = false;
    // return;
    //console.log(">>>>>>>>>>>>>>", saldoCapital, " + ", solicitud);
  //}

  // guardarMontos(){
  //   this.modalService.open("carga");
  //   console.log(">>>PRESTAMOS", JSON.stringify(this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion));
  //   console.log(">>>NUEVOS SALDOS", JSON.stringify(this.saldoCapital));
  //   this.saldoCapital.forEach(e => {
  //     this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p => {
  //       if (p.numSolicitudSipre == e.solicitudSipre) {
  //        p.canMontoSol = Number(e.nuevoSaldoCapital);
  //       }
  //     });
  //   });
  //   this.model.cartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion = this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion;
  //   console.log(">>>PRESTAMOS CON NUEVOS SALDOS",  this.model.cartaInstruccion);
  //   this.prestamosService.registroMonto(this.model.cartaInstruccion)
  //   .subscribe((cartaInstruccion: CartaInstruccion) => this.registroExitoso());
       
  // }

  registroExitoso(cartaInstruccion: CartaInstruccion) {
    let bitacora: Bitacora = new Bitacora();
      bitacora.curp = this.data.model.persona.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.CONFIRMA_MONTO_LIQUIDAR;
      bitacora.idSolicitud = cartaInstruccion.solicitud.id;
      bitacora.estadoSolicitud = cartaInstruccion.solicitud.cveEstadoSolicitud.id;
      this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log('Registro exitoso en bitacora'));
      this.modalService.close("carga");
      this.router.navigate(['/administradorEFSinConvenio/home'],  
    {
      queryParams:
      {
        accion: "montoLiq",
        status: "ok",
      }
    });
  }

  confirmarMonto() {
    let flag = false;
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p => {
      if(flag == true){
        return;
      }else{  
        if (p.saldoCapital == null || p.saldoCapital.toString() == "") {
          this.flagError = true;
          flag = true;       
        }else{ 
          this.flagError = false;
          console.log(">>>this.saldoCapital", this.saldoCapital);
          this.saldoCapital.forEach( i =>{
            if((i.solicitudSipre == p.numSolicitudSipre)){
              this.suma =0;
              this.suma = i.saldoCapital + p.canDescuentoMensual + p.canDescuentoMensual;
              console.log(">>>saldo capital < suma", p.saldoCapital, this.suma);
              if(!(p.saldoCapital < this.suma)){
                this.flagErrorMonto = true;
                flag = true;
                this.solicitado = i.solicitudSipre;
              }
              else {
                this.flagErrorMonto = false;
                this.montonuevo =p.saldoCapital;
              }
            }
          });
        }
      }
    });
    if (this.flagErrorMonto){
      return;
    }
    this.montonuevo = 0;
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p => {
        if(typeof p.saldoCapital === "number"){
          this.montonuevo = this.montonuevo+p.saldoCapital;
        }else{
          this.montonuevo = this.montonuevo+parseFloat(p.saldoCapital);
        }
      
    });
    this.modalService.open("preguntaRegistroMonto");
  }

  continuarNo() {
    this.modalService.close("preguntaRegistroMonto");
  }
  validarReferencia(){
    console.log(">>>INICIA VALIDA REFERENCIA");
    this.flagErrorReferencia = false;
    this.flagErrorReferenciaCaracter = false;
    let flag = false;
    this.resumenSimulacion.listPrestamoRecuperacion.prestamosEnRecuperacion.forEach(p => {
      if(flag == true){
        return;
      }else{  
        console.log(">>>REFERENCIA Y SOLICITUD", p.referencia, p.numSolicitudSipre);
        if (p.referencia == null || p.referencia.toString() == "") {
          //this.flagError = true;
          flag = true;
          this.flagErrorReferencia = true;
          this.solicitado = p.numSolicitudSipre
          }else{
            if(p.referencia.indexOf('!') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('"') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('#') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('$') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('%') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('&') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('/') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('(') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf(')') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('=') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('\'') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('?') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('\\') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('¿') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('¡') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('+') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('*') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('~') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('´') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('¨') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('{') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('[') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('^') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('}') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf(']') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('`') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('_') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf(':') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf('.') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf(',') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf(';') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
            if(p.referencia.indexOf(' ') != -1) {flag = true;this.flagErrorReferenciaCaracter = true;this.solicitado = p.numSolicitudSipre}
          }
      }
    });
    console.log(">>>FLAG REFERENCIA", this.flagErrorReferencia);
  }

}
