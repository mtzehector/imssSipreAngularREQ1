import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { CartaInstruccion } from '../../common/domain/carta.instruccion';
import { Solicitud } from '../../common/domain/solicitud';
import { CancelarSolicitudService } from '../../common/services/cancelar.solicitud.service';
import { AutorizarService } from '../../common/services/autorizar.service';
import { Clabe } from 'src/app/common/domain/clabe';
import { ClabeResponse } from 'src/app/common/domain/clabeResponse';

import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { Bitacora } from 'src/app/common/domain/bitacora';



@Component({
  selector: 'app-prestamo-autorizar',
  templateUrl: './prestamo.autorizar.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class PrestamoAutorizarComponent extends BaseComponent implements OnInit {

  model: Model;

  informeCartaInstruccion: CartaInstruccion;
  solicitud: Solicitud;
  clabe: Clabe = new Clabe();
  rol: string;

  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private autorizarService: AutorizarService,
    private bitacoraService: BitacoraService,
    private cancelarSolicitud: CancelarSolicitudService) {
    super(data);
  }

  ngOnInit() {
    this.rol = "operadorEF";
    this.data.model.rol = "operadorEF";
    this.model = this.data.model;
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";

    this.solicitud = this.data.model.informeCartaInstruccion.solicitud;
    this.informeCartaInstruccion = this.data.model.cartaInstruccion;
    this.model.informeCartaInstruccion.prestamo.refCuentaClabe = '';
    this.model.informeCartaInstruccion.prestamo.contrasenaClabe = '';

  }

  async cancelarAutorizar() {
    //console.log('>>> cancelarAutorizar');
    this.closeModal();
    this.modalService.open("carga");
    await this.cancelarSolicitud.getCancelar(this.solicitud.id)
      .toPromise().then((solicitud: Solicitud) => this.validarCancelacion(solicitud));



  }

  async validarCancelacion(solicitud) {
    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.model.persona.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.GENERACION_CARTA_NO_ACEPTADA;
    bitacora.idSolicitud = this.solicitud.id;
    bitacora.estadoSolicitud = EstadoSolicitud.CANCELADO;
    await this.bitacoraService.create(bitacora).toPromise().then((bitacora: Bitacora) => console.log(''));
    this.modalService.close("carga");
    if (solicitud.id != null) {
      this.router.navigate(['/operadorEF/buscarFolioAutorizar'],
      {
        queryParams:
        {
          accion: "GENERACION_CARTA_NO_ACEPTADA",
          status: "success",
        }
      });
    }
  }

  openModal() {

    this.modalService.open("cancelarCarta");
  }

  closeModal() {
    this.modalService.close("cancelarCarta");
  }

  proceder() {

    if ((this.data.model.informeCartaInstruccion.prestamo.refCuentaClabe === undefined || this.data.model.informeCartaInstruccion.prestamo.refCuentaClabe.length < 17)) {
      this.model.mensaje.mensaje = "Falta agregar la CLABE";
      this.model.mensaje.level = "danger";
      return;
      // }else if(this.data.model.informeCartaInstruccion.prestamo.refCuentaClabe !== this.data.model.informeCartaInstruccion.prestamo.contrasenaClabe)
      // {
      //     this.mesanjeUtil.mensaje="La cuenta CLABE ingresada y la cuenta CLABE de confirmación no coinciden.";
      //     this.mesanjeUtil.level="danger";
      //     return;
    } else {
      //ERPE29072020
      /*  this.autorizarService.getClabeAutorizar(this.data.model.informeCartaInstruccion)
      .subscribe((response: CartaInstruccion) => this.validarClabe(response));
      this.router.navigate(['./operadorEF/autorizarInforme', {}]);*/

      this.clabe.idNss = this.data.model.informeCartaInstruccion.pensionado.nss;
      this.clabe.idGrupoFamiliar = this.data.model.informeCartaInstruccion.pensionado.grupoFamiliar;
      this.clabe.clabe = this.model.informeCartaInstruccion.prestamo.refCuentaClabe;

      this.autorizarService.getValidarClabe(this.clabe)
        .subscribe(

          /*(response: ClabeResponse) => {
          this.router.navigate(['./operadorEF/autorizarInforme', {}]);
        }
        */
          {
            next: (response: ClabeResponse) => {
              this.router.navigate(['./operadorEF/autorizarInforme', {}]);
            },
            error: error => {
              this.model.mensaje.mensaje = "La cuenta CLABE ingresada no coincide con la cuenta CLABE registrada para el Pensionado.";
              this.model.mensaje.level = "danger";
            }
          }

        );
      //this.router.navigate(['./operadorEF/autorizarInforme', {}]);

    }

  }

  validarClabe(response: ClabeResponse) {

    if (this.model.informeCartaInstruccion.prestamo.refCuentaClabe === response.numClabe) {
      this.router.navigate(['./operadorEF/autorizarInforme', {}]);
    } else {
      this.model.mensaje.mensaje = "La cuenta CLABE ingresada no coincide con la cuenta CLABE registrada para el Pensionado.";
      this.model.mensaje.level = "danger";
      //console.log(">>>>CLABE " + response.numClabe);
      return;
    }
  }



}
