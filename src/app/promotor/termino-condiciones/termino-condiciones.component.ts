import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { GuardarCartaInstruccionService } from 'src/app/common/services/guardar.carta.instruccion.service';
import { ModalService } from 'src/app/common/modal-Services';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { Prestamo } from 'src/app/common/domain/prestamo';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { Bitacora } from 'src/app/common/domain/bitacora';

@Component({
  selector: 'app-termino-condiciones',
  templateUrl: './termino-condiciones.component.html',
  styleUrls: ['./termino-condiciones.component.css']
})
export class TerminoCondicionesComponent extends BaseComponent implements OnInit {
   rol: string;
   estado: string;
   avisoCheck: number;
   aceptoAviso: string;
   errorAviso;
   idx: number;

  solicitud: Solicitud;
  cartaInstruccion: CartaInstruccion;
  promotor: PersonaEF;

  nuevo: Prestamo;
  fechaPrimerDescuetno: string;
  buttonSubmitStatus: boolean = false;

  constructor(protected data: DataService, 
              private route: ActivatedRoute,
              private mensajeService: MensajeService, private router: Router,
              private guardarCartaInstruccionService: GuardarCartaInstruccionService,
              private bitacoraService: BitacoraService,
              private modalService: ModalService) { 
                super(data);
              }

  ngOnInit() {
    this.model = this.data.model;
    this.estado = "";
    this.cartaInstruccion =this.model.cartaInstruccion;
    this.promotor = this.model.personaEF;
    this.nuevo = new Prestamo();
    this.nuevo.tipoCreditoEnum = TipoCredito.NUEVO;
    this.fechaPrimerDescuetno = this.data.model.cartaInstruccion.prestamo.primerDescuento;
    this.fechaPrimerDescuetno = ( this.fechaPrimerDescuetno).substring(0,10);
    this.rol="promotor";
  }

   guardarCartaInstruccion() {
    this.buttonSubmitStatus = true;
    this.cartaInstruccion.prestamo.promotor= this.promotor.idPersonaEF;
    this.cartaInstruccion.personaEf ={...this.promotor};
    this.cartaInstruccion.pensionado.correoElectronico = this.cartaInstruccion.personaModel.correoElectronico;
    this.cartaInstruccion.pensionado.telefono = this.cartaInstruccion.personaModel.telCelular;
    this.closeModal();
    this.modalService.open("carga");
    //this.guardarCartaInstruccionService.create(this.cartaInstruccion).subscribe((cartaInstruccion: CartaInstruccion)=> this.validarCartaInstruccion(cartaInstruccion));
    this.guardarCartaInstruccionService.create(this.cartaInstruccion)
     .toPromise().then((cartaInstruccion: CartaInstruccion)=> {
      this.validarCartaInstruccion(cartaInstruccion);
      this.buttonSubmitStatus = false;
     },error =>{
      this.buttonSubmitStatus = false;
     });
  }

   validarCartaInstruccion(cartaInstruccion) {
    //console.log(">>><<<<Carta de Libranza: " + JSON.stringify(cartaInstruccion));
      //console.log(cartaInstruccion.solicitud.id);
      this.model.cartaInstruccion = { ...cartaInstruccion };
      this.model.documento.tipoDocumentoEnum = TipoDocumento.CARTA_INSTRUCCION;
      this.model.documento.numFolioSolicitud = cartaInstruccion.solicitud.numFolioSolicitud;
      this.data.model.buttonBusqFolioPromotor = false; 

    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.promotor.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.GENERAR_CARTA_INSTRUCCION;
    bitacora.idSolicitud = this.cartaInstruccion.solicitud.id;
    bitacora.estadoSolicitud = EstadoSolicitud.POR_AUTORIZAR;
    this.bitacoraService.create(bitacora).toPromise().then((bitacora: Bitacora) => {
      console.log(''); 
    });
    this.modalService.close("carga");
    this.router.navigate(['/promotor/cartaFinalizar', {}]);
  }

  cheked() {
    this.avisoCheck = this.avisoCheck !==1?1:0;
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


}
