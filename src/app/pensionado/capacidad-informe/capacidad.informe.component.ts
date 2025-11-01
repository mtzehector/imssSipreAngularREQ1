// TODO: Feature Componetized like CrisisCenter
import { Observable, from } from 'rxjs';
import { ModalService } from 'src/app/common/services';
import { switchMap, timeout } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { CapacidadCreditoService } from 'src/app/common/services/capacidad.credito.service';
import { GuardarCartaCapacidadService } from 'src/app/common/services/guardar.carta.capacidad.service';
import { CartaCapacidadCredito } from 'src/app/common/domain/carta.capacidad.credito';
import { CapacidadCredito } from 'src/app/common/domain/capacidad.credito';
import { Documento } from 'src/app/common/domain/documento';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { BaseComponent } from 'src/app/common/base.component';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';

@Component({
  selector: 'app-capacidad-informe',
  templateUrl: './capacidad.informe.component.html'
})
export class CapacidadInformeComponent extends BaseComponent implements OnInit {
  solicitud: Solicitud;
  cartaCapacidadCredito: CartaCapacidadCredito;
  capacidadCredito: CapacidadCredito;
  mensaje1: Mensaje;
  aceptoAviso: boolean;
  errorAviso;
  estado: string;
  avisoCheck: number;
  idx: number;

  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private guardarCapacidad: GuardarCartaCapacidadService,
    private bitacoraService: BitacoraService,
    private modalService: ModalService) {
    super(data);
  }

  ngOnInit() {
    this.solicitud = new Solicitud();
    this.capacidadCredito = new CapacidadCredito();
    this.cartaCapacidadCredito = new CartaCapacidadCredito();
    this.estado = '';
    const bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.pensionado.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.GENERAR_INFORME_CAPACIDAD;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
  }

  cheked() {
    this.avisoCheck = this.avisoCheck !== 1 ? 1 : 0;
  }

  async guardarCartaCapacidad() {

    if (this.avisoCheck !== 1) {
      this.estado = 'true';
      this.errorAviso;
    } else {
      this.solicitud.curp = this.model.persona.curp;
      this.solicitud.nss = this.model.pensionado.nss;
      this.solicitud.grupoFamiliar = this.model.pensionado.grupoFamiliar;
      this.solicitud.delegacion = this.model.pensionado.delegacion.numDelegacion;
      this.solicitud.subDelegacion = this.model.pensionado.subDelegacion;
      this.solicitud.entidadFederativa = this.model.pensionado.entidadFederativa.cveEntidadFederativa;
      this.solicitud.origenSolictud = 2;

      // this.solicitud.entidadFederativa.cveEntidadFederativa = this.model.pensionado.entidadFederativa;
      // this.solicitud.delegacion = "08";
      // this.solicitud.subDelegacion = "06";
      // this.solicitud.entidadFederativa = 23;

      this.capacidadCredito.impCapacidadFija = this.model.capacidadCredito.impCapacidadFija;
      this.capacidadCredito.impCapacidadTotal = this.model.capacidadCredito.impCapacidadTotal;
      this.capacidadCredito.impCapacidadVariable = this.model.capacidadCredito.impCapacidadVariable;

      this.cartaCapacidadCredito.capacidadCredito = this.model.capacidadCredito;
      this.cartaCapacidadCredito.solicitud = this.solicitud;

      this.openModal('carga');
      /*  this.guardarCapacidad.create(this.cartaCapacidadCredito).subscribe(
          (cartaCapacidadCredito: CartaCapacidadCredito) => {this.validarCartaCapacidad(cartaCapacidadCredito);
                                                             this.closeModal('carga');

          });*/
      // tslint:disable-next-line: max-line-length
      this.cartaCapacidadCredito.prestamoRecuperacion = this.model.prestamoRecuperacion;
      await this.guardarCapacidad.create(this.cartaCapacidadCredito).then((cartaCapacidadCredito: CartaCapacidadCredito) => {
        setTimeout(() => {
          this.validarCartaCapacidad(cartaCapacidadCredito);
        }, 10000);


      });

      setTimeout(() => {

      }, 12000);


    }

  }

  validarCartaCapacidad(cartaCapacidadCredito: CartaCapacidadCredito) {


    this.closeModal('carga');

    if (cartaCapacidadCredito.solicitud.id != null) {

      this.model.cartaCapacidadCredito = { ...cartaCapacidadCredito };
      this.model.documento.tipoDocumentoEnum = TipoDocumento.CARTA_CAPACIDAD_CREDITO;
      this.model.documento.numFolioSolicitud = this.model.cartaCapacidadCredito.solicitud.numFolioSolicitud;
      this.router.navigate(['/pensionado/capacidadResumen', {}]);
    }
  }
  closeModal(tituloModal) {
    this.modalService.close(tituloModal);
  }

  openModal(tituloModal) {
    this.modalService.open(tituloModal);
  }


}
