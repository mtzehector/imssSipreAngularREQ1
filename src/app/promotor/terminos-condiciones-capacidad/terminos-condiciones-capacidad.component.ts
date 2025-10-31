import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../../data.service";
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { BaseComponent } from 'src/app/common/base.component';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { CapturaCondiciones } from 'src/app/common/domain/captura.condiciones';
import { GuardarCartaInstruccionCapacidadService } from 'src/app/common/services/guardar.carta.instruccion.capacidad.service';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import { Model } from 'src/app/model';
import { ModalService } from 'src/app/common/modal-Services';
import { Oferta } from 'src/app/common/domain/oferta';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { Prestamo } from '../../common/domain/prestamo';
import { TipoCredito } from '../../common/domain/tipo.credito';
import { FechaPrimerDescuento } from 'src/app/common/domain/fecha.primer.descuento';
import { PrestamoService } from 'src/app/common/services/prestamo.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-termino-condiciones-capacidad',
  templateUrl: './termino-condiciones-capacidad.component.html',
  styleUrls: ['./termino-condiciones-capacidad.component.css']
})
export class TerminoCondicionesCapacidadComponent extends BaseComponent implements OnInit {
    capturaCondiciones: CapturaCondiciones = new CapturaCondiciones();
    solicitud: Solicitud;
    cartaInstruccion: CartaInstruccion;
    estado: string;
    avisoCheck: number;
    aceptoAviso: string;
    oferta: Oferta;
    errorAviso;
    idx: number;
    personaEF: PersonaEF;
    nuevo: Prestamo;
    fechaPrimerDescuento: FechaPrimerDescuento;
    model : Model;  
    diaActual:string;
    primerdescuento: string;
    prestamo:Prestamo= new Prestamo();
    Titulo: String;
    fecha:string;
    rol:String;
    
    constructor (protected data: DataService,
      private route: ActivatedRoute,
      private mensajeService: MensajeService,
      private router: Router,
      private modalService: ModalService,
      private cartaInstruccionCapacidadService: GuardarCartaInstruccionCapacidadService,
      private prestamoService: PrestamoService
    ) {
      super(data);
  
    }
  
    ngOnInit() {
      this.rol="promotor";
      let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
      this.diaActual = '{\"fecInicio\"' +':'+'"'+dia+ '"}';
      this.prestamoService.getlistaPrestamo(this.diaActual)
      .subscribe((primerDescuentoResponse: FechaPrimerDescuento) =>this.obtenerValor(primerDescuentoResponse));
      this.cartaInstruccion = this.model.cartaInstruccion;
      this.personaEF = this.model.personaEF;
  
  //    this.nuevo = new Prestamo();
      this.cartaInstruccion.prestamo.tipoCreditoEnum = TipoCredito.NUEVO;
  //    this.nuevo.tipoCreditoEnum = TipoCredito.NUEVO;
  
    //console.log(this.cartaInstruccion)
  
    }
  
  
    cheked() {
      this.avisoCheck = this.avisoCheck !== 1 ? 1 : 0;
    }
  
    guardarCartaInstruccion() {
      this.cartaInstruccion.prestamo.solicitud = this.cartaInstruccion.solicitud.id;
      this.cartaInstruccion.prestamo.promotor = this.personaEF.idPersonaEF;
      this.cartaInstruccion.personaEf ={...this.personaEF};
      this.cartaInstruccion.personaEf.nss = this.model.user.numNss.toString();
      this.cartaInstruccion.pensionado.correoElectronico = this.cartaInstruccion.persona.correoElectronico;
      this.closeModal();
  
      this.cartaInstruccionCapacidadService.create(this.cartaInstruccion)
      .subscribe((cartaInstruccion: CartaInstruccion) => this.validarCartaInstruccion(cartaInstruccion));
      this.modalService.open("carga");
    }
  
    validarCartaInstruccion(cartaInstruccion) {
      this.modalService.close("carga");
      if (cartaInstruccion.prestamo.id = ! null) {
        this.model.cartaInstruccion.prestamo = { ...cartaInstruccion.prestamo };
        this.model.documento.tipoDocumentoEnum = TipoDocumento.CARTA_INSTRUCCION;
        this.model.documento.numFolioSolicitud = this.cartaInstruccion.solicitud.numFolioSolicitud;
        this.router.navigate(['/promotor/cartaFinalizar', {}]);
  
  
      }
    }
    openModal() {
      if (this.avisoCheck !== 1) {
  
        this.estado = "true";
        this.errorAviso;
  
      }
  
      else {
  
        this.modalService.open("confirmarCartaCap");
      }
    }
  
    closeModal() {
      this.modalService.close("confirmarCartaCap");
    }
  
    obtenerValor(primerDescuentoResponse: FechaPrimerDescuento){
      this.primerdescuento = primerDescuentoResponse.nominaPrimerDescuento;
      this.model.cartaInstruccion.prestamo.primerDescuento = primerDescuentoResponse.fecDescNomina;
      this.fecha=(this.model.cartaInstruccion.prestamo.primerDescuento).substring(0,10);}


}
