import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { BuscarFolioService, ModalService } from 'src/app/common/services';
import { ResumenSimulacionService } from 'src/app/common/services/resumen.simulacion.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { CartaCapacidadCredito } from 'src/app/common/domain/carta.capacidad.credito';
import { ResumenCartaCapacidadService } from 'src/app/common/services/resumen.carta.capacidad.service';
import { Mensaje } from 'src/app/common/domain/mensaje';


@Component({
  selector: 'app-buscar-folio-cancelar',
  templateUrl: './buscar.folio.cancelar.component.html'
})
export class BuscarFolioCancelarComponent extends BaseComponent implements OnInit {
  numFolioSolicitud: string;
  origen: number;
  resumenSimulacion: CartaInstruccion;
  resumenCartaCapacidad: CartaInstruccion;
  disabled: boolean = false;


  constructor(
    protected data: DataService, 
    private route: ActivatedRoute, 
    private modalService: ModalService,
     private router: Router, 
    private buscarFolioService: BuscarFolioService,
     private resumenSimulacionService: ResumenSimulacionService,
    private resumenCartaCapacidadService: ResumenCartaCapacidadService) {
    super(data);
  }

  ngOnInit() {
    this.resumenSimulacion = new CartaInstruccion();
    //this.resumenCapacidad = new CartaInstruccion();
    this.resumenCartaCapacidad = new CartaInstruccion();
    this.model.mensaje.mensaje = "";

  }


  closeModal() {
    this.modalService.close("carga");
    this.disabled = false;
  }

  openModal() {
    this.modalService.open("carga");
    this.disabled = true;
  }

  activarBoton() {
    if (!(this.numFolioSolicitud === undefined) && this.numFolioSolicitud.length === 13) {
      this.disabled = true;
    } else { this.disabled = false; }
  }
  buscarFolio() {
    if (this.numFolioSolicitud === undefined) {
      this.model.mensaje.mensaje = "Debes ingresar por lo menos un criterio de búsqueda.";
      this.model.mensaje.level = "danger";
      return;
    } else {
      this.model.mensaje.mensaje = "";
      this.model.mensaje.level = "";
      this.openModal();
      this.buscarFolioService.buscarFolio(this.numFolioSolicitud, null, null).subscribe((solicitud: Solicitud) => this.validarFolio(solicitud));
    }
  }

  validarFolio(solicitud) {
    this.closeModal();
    this.resumenSimulacion.solicitud = { ...solicitud.solicitud };
    this.resumenCartaCapacidad.solicitud = { ...solicitud.solicitud };
    switch (solicitud.solicitud.origenSolictud) {
      case 1:
        this.consultaResumenSimulacion(this.resumenSimulacion);
        break;
      case 2:
        this.consultaResumenCapacidad(this.resumenCartaCapacidad);
        break;
    }

  }

  consultaResumenSimulacion(resumenSimulacion) {
    this.resumenSimulacionService.consultar(resumenSimulacion).subscribe(
      (resumenSimulacion: CartaInstruccion) => {
        if(resumenSimulacion != null)
          this.validarResumenSimulacion(resumenSimulacion);
        
        this.closeModal();
      }
    );
  }

  validarResumenSimulacion(resumenSimulacion: CartaInstruccion) {
    this.resumenSimulacion.solicitud = { ...resumenSimulacion.solicitud };
    this.resumenSimulacion.prestamo = { ...resumenSimulacion.prestamo };
    this.resumenSimulacion.pensionado = { ...resumenSimulacion.pensionado };
    this.resumenSimulacion.oferta = { ...resumenSimulacion.oferta };
    this.model.cartaInstruccion = this.resumenSimulacion;
    this.router.navigate(['/pensionado/simulacionCancelar', {}]);
  }

  consultaResumenCapacidad(resumenCartaCapacidad: CartaInstruccion) {
    this.resumenCartaCapacidadService.getCartaCapacidadInforme(resumenCartaCapacidad.solicitud).subscribe((resumenCartaCapacidad: CartaInstruccion) => this.validarResumenCapacidad(resumenCartaCapacidad));

  }
  validarResumenCapacidad(resumenCartaCapacidad) {
    this.resumenCartaCapacidad.solicitud = { ...resumenCartaCapacidad.solicitud };
    this.resumenCartaCapacidad.pensionado = { ...resumenCartaCapacidad.pensionado };
    this.resumenCartaCapacidad.persona = { ...resumenCartaCapacidad.persona };
    this.resumenCartaCapacidad.capacidadCredito = { ...resumenCartaCapacidad.capacidadCredito };
    this.model.cartaInstruccion = this.resumenCartaCapacidad;
    this.router.navigate(['/pensionado/capacidadCancelar', {}]);
  }

}
