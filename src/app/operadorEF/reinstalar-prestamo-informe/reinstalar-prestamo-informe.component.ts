import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { BitacoraService, GuardarCartaInstruccionCapacidadService, PrestamoService, PromotorService } from 'src/app/common/services';
import { Router } from '@angular/router';
import { PrestamoPromotor } from 'src/app/common/domain/prestamo-promotor';
import { Prestamo } from 'src/app/common/domain/prestamo';
import { Bitacora, CartaInstruccion, EstadoSolicitud, FechaPrimerDescuento, TipoDocumento } from 'src/app/common/domain';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-reinstalar-prestamo-informe',
  templateUrl: './reinstalar-prestamo-informe.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class ReinstalarPrestamoInformeComponent extends BaseComponent implements OnInit {
  rol: string;
  avisoCheck: boolean = false;
  isChecked: boolean = false;
  prestamo: Prestamo = new Prestamo();
  cartaInstruccion: CartaInstruccion = new CartaInstruccion();
  imgEFUrl: string = '';
  primerdescuento: string;
  fecha: string;

  constructor(
    protected data: DataService,
    private router: Router,
    private modalService: ModalService,
    private promotorService: PromotorService,
    private cartaInstruccionCapacidadService: GuardarCartaInstruccionCapacidadService,
    private bitacoraService: BitacoraService,
    private prestamoService: PrestamoService,
  ) {
    super(data);
    this.rol = 'operadorEF';
  }

  obtenerValor(primerDescuentoResponse: FechaPrimerDescuento) {
      this.primerdescuento = primerDescuentoResponse.nominaPrimerDescuento;
      this.model.prestamo.primerDescuento = primerDescuentoResponse.fecDescNomina;
      if (this.model.resumenCartaInstruccion.prestamo.primerDescuento !== undefined) {
          this.fecha = (this.model.prestamo.primerDescuento).substring(0, 10);
      }
  }

  ngOnInit() {
    this.model = this.data.model;

    let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
    let diaActual = '{\"fecInicio\"' + ':' + '"' + dia + '"}';

    this.prestamoService.getlistaPrestamo(diaActual)
            .subscribe((primerDescuentoResponse: FechaPrimerDescuento) => this.obtenerValor(primerDescuentoResponse));

    if (this.model.resumenCartaInstruccion.oferta.entidadFinanciera.imgB64 == null) {
      this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
    } else {
        this.imgEFUrl = 'data:image/png;base64,' + this.model.resumenCartaInstruccion.oferta.entidadFinanciera.imgB64;
    }

  }

  validarCartaInstruccion(cartaInstruccion:CartaInstruccion) {
    if (cartaInstruccion.prestamo.solicitud) {
      this.model.cartaInstruccion.prestamo = { ...cartaInstruccion.prestamo };
      this.model.documento.tipoDocumentoEnum = TipoDocumento.CARTA_REINSTALACION;
      this.model.documento.numFolioSolicitud = this.model.prestamoPromotor.solicitud.numFolioSolicitud;
      this.model.documento.cveSolicitud = this.model.prestamoPromotor.solicitud.id.toString();
      
      let bitacora: Bitacora = new Bitacora();
      bitacora.curp = this.data.model.persona.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.GENERAR_CARTA_REINSTALACION;
      bitacora.idSolicitud = this.model.prestamoPromotor.solicitud.id;
      bitacora.estadoSolicitud = EstadoSolicitud.POR_AUTORIZAR;

      this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log('TODO OK'));
      this.modalService.close("carga");
      this.router.navigate(['/operadorEF/reinstalarPrestamoCarta']);
    }  
  }

  guardarCartaInstruccion() {
    this.cartaInstruccion.flatPrestamoPromotor = 1;
    this.prestamo.solicitud = this.model.prestamoPromotor.solicitud.id;
    this.prestamo.promotor = this.model.prestamoPromotor.personaEF.idPersonaEF;
    this.prestamo.catPrestamoPromotor = this.model.prestamoPromotor.personaRequest.prestamo.cat;
    this.prestamo.tipoCreditoId = this.model.prestamoPromotor.prestamo.tipoCredito;
    this.cartaInstruccion.prestamo = this.prestamo;
    this.cartaInstruccion.personaEf.entidadFinanciera = this.model.personaEF.entidadFinanciera;
    this.cartaInstruccion.personaEf.nss = this.data.model.user.numNss.toString();
    this.cartaInstruccion.personaEf.correoElectronico = this.model.persona.correoElectronico;
    this.cartaInstruccion.pensionado.nombre = this.model.prestamoPromotor.persona.nombre;
    this.cartaInstruccion.pensionado.primerApellido = this.model.prestamoPromotor.persona.primerApellido;
    this.cartaInstruccion.pensionado.segundoApellido = this.model.prestamoPromotor.persona.segundoApellido;
    this.cartaInstruccion.pensionado.correoElectronico = this.model.prestamoPromotor.personaRequest.correoElectronico;
    this.cartaInstruccion.pensionado.telefono = this.model.prestamoPromotor.personaRequest.telCelular != null ? 
    this.model.prestamoPromotor.personaRequest.telCelular : this.model.prestamoPromotor.personaRequest.telLocal;
    this.cartaInstruccion.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo;
    this.cartaInstruccion.prestamo.numMesesConsecutivos = this.model.prestamoPromotor.prestamoVigente.numMesesConsecutivos;

    this.cartaInstruccionCapacidadService.crearCartaReinstalacion(this.cartaInstruccion)
      .subscribe((cartaInstruccion: CartaInstruccion) => this.validarCartaInstruccion(cartaInstruccion));

  }

  confirmarCondiciones() {
    if (this.isChecked) {
      this.avisoCheck = false;
      this.modalService.open("carga");

      this.promotorService.confirmarCondicionesReinstalacion(this.model.prestamoPromotor).then(
        prestamoPromotor => {
          if(prestamoPromotor != null)
            this.guardarCartaInstruccion();
          else
            this.modalService.close("carga");
        },
        error => {
          this.router.navigate(
              ['/operadorEF/home'], {
              queryParams: {
                accion: "regPrestamo",
                status: "error",
              }
            }
          );
        }
      );

    }
    else
      this.avisoCheck = true;
  }
}
