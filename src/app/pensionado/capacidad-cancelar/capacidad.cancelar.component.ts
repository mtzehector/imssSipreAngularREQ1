// TODO: Feature Componetized like CrisisCenter
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from "../../data.service";
import { Solicitud } from 'src/app/common/domain/solicitud';
import { BaseComponent } from 'src/app/common/base.component';
import { CancelarSolicitudService } from 'src/app/common/services/cancelar.solicitud.service';
import { ModalService } from 'src/app/common/modal-Services';
import { CartaCapacidadCredito } from 'src/app/common/domain/carta.capacidad.credito';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { Prestamo } from '../../common/domain/prestamo';
import { TipoCredito } from '../../common/domain/tipo.credito';
import { formatDate } from '@angular/common';
import { Persona } from 'src/app/common/persona';
import { Pensionado } from 'src/app/common/domain/pensionado';
import { PersonaEF } from 'src/app/common/domain';
@Component({
  selector: 'app-capacidad-cancelar',
  templateUrl: './capacidad.cancelar.component.html'
})
export class CapacidadCancelarComponent extends BaseComponent implements OnInit {

  id: number;
  solicitud: Solicitud;
  resumenCartaCapacidad: CartaInstruccion;
  nuevo:Prestamo;
  diaActual:string;
  persona : Persona;
  pensionado : PersonaEF;


  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cancelarSolicitud: CancelarSolicitudService,
    private modalService: ModalService) {
    super(data);
  }

  ngOnInit() {
    this.resumenCartaCapacidad = this.model.cartaInstruccion;
    this.solicitud = this.model.cartaInstruccion.solicitud;
    this.model.mensaje.mensaje = "";
    this.nuevo = new Prestamo();
    this.nuevo.tipoCreditoEnum = TipoCredito.NUEVO;
    this.diaActual = formatDate(new Date(), 'dd/MM/yyyy', 'en');
    this.persona =this.resumenCartaCapacidad.persona;
    this.pensionado = this.resumenCartaCapacidad.personaEf; 
  }
  cancelarCapacidad() {
    this.closeModal();
    this.cancelarSolicitud.getCancelar(this.resumenCartaCapacidad.solicitud.id).subscribe((solicitud: Solicitud) => this.validarCancelacion(solicitud));
  }

  validarCancelacion(solicitud) {
    if (solicitud.id != null) {
      this.closeModal();
      //CAMBIO VICTOR  
      //this.router.navigate(['/pensionado/home', {}]);
      this.router.navigate(['/pensionado/capacidadCancelarResumen', {}]);
    }
  }
  openModal() {

    this.modalService.open("cancelarFolio");

  }

  closeModal() {
    this.modalService.close("cancelarFolio");
  }

  folioCancelar(solicitud) {
    if (solicitud.estadoSolicitud === 6) {
      //console.log("El folio ya esta cancelado");
      this.model.mensaje.mensaje = "El folio ya se encuentra cancelado.";
      this.model.mensaje.level = "danger";
    } else {

      this.openModal();
    }
  }

}
