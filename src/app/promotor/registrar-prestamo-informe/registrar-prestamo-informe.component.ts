import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor, CartaInstruccion, TipoDocumento } from "src/app/common/domain";
import { RegistrarPromotorService, ModalService, GuardarCartaInstruccionCapacidadService, PromotorService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { DataService } from "../../data.service";
import { FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { Prestamo } from 'src/app/common/domain/prestamo';
import { PrestamoEnRecuperacionRs } from 'src/app/common/domain/prestamo.recuperacionrs';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { PrestamoPromotor } from 'src/app/common/domain/prestamo-promotor';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';

@Component({
  selector: 'app-registrar-prestamo-informe',
  templateUrl: './registrar-prestamo-informe.component.html',
  styleUrls: ['./registrar-prestamo-informe.component.css','../../common/css/tarjetas-estilos-base.css']
})
export class RegistrarPrestamoInformeComponent extends BaseComponent implements OnInit {
  public model: Model;
  avisoCheck: number;
  estadoTermino:boolean=false;
  idx:number;
  rol:String;
  fecha: string;
  prestamo: Prestamo = new Prestamo();
  cartaInstruccion: CartaInstruccion = new CartaInstruccion();
  buttonSubmitStatus: boolean = false;
  flagConPrestamos: number = 0;

  constructor(protected data: DataService, private router: Router, 
    private registarPromotorService: RegistrarPromotorService,
     private modalService: ModalService,
      public location: Location,
      private formBuilder: FormBuilder,
      private cartaInstruccionCapacidadService: GuardarCartaInstruccionCapacidadService,
      private promotorService: PromotorService,
      private bitacoraService: BitacoraService) {
        super(data);
        this.model = this.data.model;

      }

  ngOnInit() {
    this.rol="promotor";
    this.fecha = this.model.prestamoPromotor.prestamo.primerDescuento.substring(0,10);
    console.log(">>>REGISTRO PRESTAMO INFORME: " + JSON.stringify(this.model.prestamosRecuperacionArreglo));
    if(this.model.prestamosRecuperacionArreglo != null && 
      this.model.prestamosRecuperacionArreglo.length != 0){
    this.flagConPrestamos =1;
}else{
  var pres = new Array();
  this.model.prestamosRecuperacionArreglo = pres;
}
    
  }

  cheked() {
    this.avisoCheck = this.avisoCheck !==1?1:0;

     
     if(this.avisoCheck == 1){
       this.estadoTermino=true;
     }
  }

//  async guardarCartaInstruccion() {
//     this.buttonSubmitStatus = true;
//    await this.confirmarCondicionesPrestamo();
//     this.cartaInstruccion.flatPrestamoPromotor = 1;
//     this.prestamo.solicitud = this.model.prestamoPromotor.solicitud.id;
//     this.prestamo.promotor = this.model.prestamoPromotor.personaEF.idPersonaEF;
//     this.prestamo.catPrestamoPromotor = this.model.prestamoPromotor.personaRequest.prestamo.cat;
//     this.cartaInstruccion.prestamo = this.prestamo;
//     this.cartaInstruccion.personaEf.entidadFinanciera = this.model.personaEF.entidadFinanciera;
//     this.cartaInstruccion.personaEf.nss = this.data.model.user.numNss.toString();
//     this.cartaInstruccion.pensionado.nombre = this.model.prestamoPromotor.persona.nombre;
//     this.cartaInstruccion.pensionado.primerApellido = this.model.prestamoPromotor.persona.primerApellido;
//     this.cartaInstruccion.pensionado.segundoApellido = this.model.prestamoPromotor.persona.segundoApellido;
//     this.cartaInstruccion.pensionado.correoElectronico = this.model.prestamoPromotor.personaRequest.correoElectronico;
//     this.cartaInstruccion.pensionado.telefono = this.model.prestamoPromotor.personaRequest.telCelular != null ? 
//     this.model.prestamoPromotor.personaRequest.telCelular : this.model.prestamoPromotor.personaRequest.telLocal;
//     this.cartaInstruccion.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo;
//     this.cartaInstruccionCapacidadService.crearCartaPrestamoPromotor(this.cartaInstruccion)
//     .subscribe((cartaInstruccion: CartaInstruccion) => this.validarCartaInstruccion(cartaInstruccion));
//     //this.modalService.open("carga");
//   }

  validarCartaInstruccion(cartaInstruccion:CartaInstruccion) {
    //this.modalService.close("carga");
    if (cartaInstruccion.prestamo.solicitud) {
      this.model.cartaInstruccion.prestamo = { ...cartaInstruccion.prestamo };
      this.model.documento.tipoDocumentoEnum = TipoDocumento.CARTA_INSTRUCCION;
      this.model.documento.numFolioSolicitud = this.model.prestamoPromotor.solicitud.numFolioSolicitud;
      this.model.documento.cveSolicitud = this.model.prestamoPromotor.solicitud.id.toString();
      this.model.buttonPrestamoPromotor = false;
      
      let bitacora: Bitacora = new Bitacora();
      bitacora.curp = this.data.model.persona.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.GENERAR_CARTA_INSTRUCCION;
      bitacora.idSolicitud = this.model.prestamoPromotor.solicitud.id;

      if(cartaInstruccion.prestamo.tipoCreditoId == TipoCredito.NUEVO.id 
        || cartaInstruccion.prestamo.tipoCreditoId == TipoCredito.RENOVACION.id){
        bitacora.estadoSolicitud = EstadoSolicitud.POR_AUTORIZAR;
      }else if(cartaInstruccion.prestamo.tipoCreditoId == TipoCredito.COMPRA_CARTERA.id 
        || cartaInstruccion.prestamo.tipoCreditoId == TipoCredito.MIXTO.id){
        bitacora.estadoSolicitud = EstadoSolicitud.PENDIENTE_MONTO_A_LIQUIDAR;
      }

      this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
      this.router.navigate(['/promotor/registroPrestamoCarta']);
    }  
  }

  // async confirmarCondicionesPrestamo(){
  //   await this.promotorService.confirmarCondiciones(this.model.prestamoPromotor).then(
  //     response => console.log("OK"),
  //     error => {
  //       console.log(error);
  //       this.router.navigate(['/promotor/home'],
  //         {
  //           queryParams:
  //           {
  //             accion: "regPrestamo",
  //             status: "error",
  //           }
  //         });

  //     }

  //   );


  // }

  guardarCartaInstruccion() {
    //this.buttonSubmitStatus = true;
    this.cartaInstruccion.flatPrestamoPromotor = 1;
    this.prestamo.solicitud = this.model.prestamoPromotor.solicitud.id;
    this.prestamo.promotor = this.model.prestamoPromotor.personaEF.idPersonaEF;
    this.prestamo.catPrestamoPromotor = this.model.prestamoPromotor.personaRequest.prestamo.cat;
    this.prestamo.tipoCreditoId = this.model.prestamoPromotor.prestamo.tipoCredito;
    this.cartaInstruccion.prestamo = this.prestamo;
    this.cartaInstruccion.personaEf.entidadFinanciera = this.model.personaEF.entidadFinanciera;
    this.cartaInstruccion.personaEf.nss = this.data.model.user.numNss.toString();
    this.cartaInstruccion.pensionado.nombre = this.model.prestamoPromotor.persona.nombre;
    this.cartaInstruccion.pensionado.primerApellido = this.model.prestamoPromotor.persona.primerApellido;
    this.cartaInstruccion.pensionado.segundoApellido = this.model.prestamoPromotor.persona.segundoApellido;
    this.cartaInstruccion.pensionado.correoElectronico = this.model.prestamoPromotor.personaRequest.correoElectronico;
    this.cartaInstruccion.pensionado.telefono = this.model.prestamoPromotor.personaRequest.telCelular != null ? 
    this.model.prestamoPromotor.personaRequest.telCelular : this.model.prestamoPromotor.personaRequest.telLocal;
    this.cartaInstruccion.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo;
    this.cartaInstruccionCapacidadService.crearCartaPrestamoPromotor(this.cartaInstruccion)
    .subscribe((cartaInstruccion: CartaInstruccion) => this.validarCartaInstruccion(cartaInstruccion));

    //this.modalService.open("carga");
  }

  confirmarCondiciones(){
    this.buttonSubmitStatus = true;
    this.promotorService.confirmarCondiciones(this.model.prestamoPromotor).then(
      prestamoPromotor => {this.guardarCartaInstruccion();},
      error => {
        //console.log(error);
        this.router.navigate(['/promotor/home'],
          {
            queryParams:
            {
              accion: "regPrestamo",
              status: "error",
            }
          });
      }
    );
  }

}
