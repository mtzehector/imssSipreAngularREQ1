import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { Solicitud } from 'src/app/common/domain/solicitud';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { CancelarSolicitudService } from 'src/app/common/services/cancelar.solicitud.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { Pensionado } from 'src/app/common/domain/pensionado';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { Prestamo } from '../../common/domain/prestamo';
import { TipoCredito } from '../../common/domain/tipo.credito';
import { PrestamoService } from 'src/app/common/services/prestamo.service';
import { FechaPrimerDescuento } from 'src/app/common/domain/fecha.primer.descuento';
import { formatDate } from '@angular/common';
import { Model } from "src/app/model";
// Declaramos las variables para jQuery
declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-simulacion-cancelar',
  templateUrl: './simulacion.cancelar.component.html',
})
export class SimulacionCancelarComponent extends BaseComponent implements OnInit {
  public model: Model;

  id: number;
  solicitud: Solicitud;
  resumenSimulacion: CartaInstruccion;
  pensionado: Pensionado;
  nuevo:Prestamo;
  fechaPrimerDescuento: FechaPrimerDescuento;
  diaActual:string;
  primerdescuento: string;
  prestamo:Prestamo= new Prestamo();
  Titulo: String;
  fecha:string;


  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private prestamoService: PrestamoService,
    private cancelarSolicitud: CancelarSolicitudService,
    private modalService: ModalService) {
    super(data);
  }

  ngOnInit() {
    let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
    this.diaActual = '{\"fecInicio\"' +':'+'"'+dia+ '"}';
    this.prestamoService.getlistaPrestamo(this.diaActual)
    .subscribe((primerDescuentoResponse: FechaPrimerDescuento) =>this.obtenerValor(primerDescuentoResponse));

    this.resumenSimulacion = this.model.cartaInstruccion;
    this.solicitud = this.model.cartaInstruccion.solicitud;
    this.pensionado = this.model.pensionado;
    this.model.mensaje.mensaje = "";
    this.nuevo = new Prestamo();
    this.nuevo.tipoCreditoEnum = TipoCredito.NUEVO;
    this.resumenSimulacion.solicitud.altaRegistro =( this.resumenSimulacion.solicitud.altaRegistro).substring(0,10);
    this.resumenSimulacion.solicitud.fecVigenciaFolio = ( this.resumenSimulacion.solicitud.fecVigenciaFolio).substring(0,10);

  }

  cancelarSimulacion() {
    this.closeModal();
    this.cancelarSolicitud.getCancelar(this.resumenSimulacion.solicitud.id).subscribe((solicitud: Solicitud) => this.validarCancelacion(solicitud));

  }

  validarCancelacion(solicitud) {
    if (solicitud.id != null) {
      this.closeModal();
      this.router.navigate(['../../pensionado/simulacionCancelacionFolioCom', {}]);
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
  obtenerValor(primerDescuentoResponse: FechaPrimerDescuento){
    this.primerdescuento = primerDescuentoResponse.nominaPrimerDescuento;
    this.model.prestamo.primerDescuento = primerDescuentoResponse.fecDescNomina;
    this.fecha=(this.model.prestamo.primerDescuento).substring(0,10);}
}



