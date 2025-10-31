import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from 'src/app/common/base.component';
import { ModalService } from 'src/app/common/modal-Services';
import { AutorizarService } from '../../common/services/autorizar.service';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { Solicitud } from '../../common/domain/solicitud';
import { CancelarSolicitudService } from '../../common/services/cancelar.solicitud.service';
import { DocumentacionAutorizar } from '../../common/domain/documentacion.autorizar';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { SolicitudEstadoRequest } from 'src/app/common/domain/solicitud.estado.request';

@Component({
  selector: 'app-autorizar-informe',
  templateUrl: './autorizar.informe.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class AutorizarInformeComponent extends BaseComponent implements OnInit {

  constructor(protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private autorizarService: AutorizarService,
    private cancelarSolicitud: CancelarSolicitudService,
    private bitacoraService: BitacoraService) {
    super(data);
  }

  tipoDocumento: TipoDocumento = TipoDocumento.CARTA_INSTRUCCION;
  model: Model;
  informeCartaInstruccion: CartaInstruccion;
  solicitud: Solicitud;
  cuentaCable;
  cuentaCableConfirmar;
  rol: string;
  documentacion: DocumentacionAutorizar = new DocumentacionAutorizar();
  ngOnInit() {
    this.rol = 'operadorEF';
    this.model = this.data.model;
    this.solicitud = this.model.informeCartaInstruccion.solicitud;
    this.informeCartaInstruccion = this.model.cartaInstruccion;
    this.cuentaCable = this.data.model.informeCartaInstruccion.prestamo.refCuentaClabe;
    this.cuentaCableConfirmar = this.data.model.informeCartaInstruccion.prestamo.contrasenaClabe;
    this.data.model.uploadDocumento = [];
    // this.cuentaCable ="1";
    //this.cuentaCableConfirmar=" 2";

  }

  cancelarAutorizar() {
    this.modalService.close('cancelarCarta');
    this.modalService.open('carga');
    this.cancelarSolicitud.getCancelar(this.solicitud.id).subscribe((solicitud: Solicitud) => this.validarCancelacion(solicitud));
  }

  async validarCancelacion(solicitud: Solicitud) {
    this.closeModal();
    if (solicitud.id != null) {
      let bitacora: Bitacora = new Bitacora();
      bitacora.curp = this.model.persona.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.GENERACION_CARTA_NO_ACEPTADA;
      bitacora.idSolicitud = solicitud.id;
      bitacora.estadoSolicitud = solicitud.cveEstadoSolicitud.id;
      await this.bitacoraService.create(bitacora).toPromise().then((bitacora: Bitacora) => console.log(''));
      this.modalService.close("carga");
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

    this.modalService.open('cancelarCarta');
  }

  closeModal() {
    this.modalService.close('cancelarCarta');
    // this.modalService.close("autorizar");    
  }

  closeModalaceptar() {
    this.modalService.close('autorizar');
  }

  openModal2() {
    //this.modalService.open("autorizar"); 
    //ERPE29072020
    if (this.data.model.uploadDocumento.length > 2) {
      this.modalService.open('autorizar');
    } else {
      //this.mensajeService.getMessage("MSG005").subscribe((mensaje: Mensaje) => this.data.model.mensaje = {...mensaje});    
      this.data.model.mensaje.mensaje = 'Debes ingresar la información obligatoria.';
      this.data.model.mensaje.level = 'danger';
    }
  }

  closeModalAvisoCarga() {
    this.modalService.close('avisoCarga');
  }


  openModal3() {
    this.modalService.close('autorizar');
    this.modalService.open("carga");
    this.setDocumentacion();
    this.autorizarService.postAutorizarCarta(this.model.informeCartaInstruccion)
      .subscribe((response: CartaInstruccion) => this.aturizarPrestamo(response));
  }

  aturizarPrestamo(response: CartaInstruccion) {
    console.log('antes de autorizar');
    this.data.model.informeCartaInstruccion = { ...response };
    this.modalService.close("carga");
    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.persona.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.AUTORIZAR_PRESTAMO;
    bitacora.idSolicitud = response.solicitud.id;
    bitacora.estadoSolicitud = EstadoSolicitud.PENDIENTE_CARGAR_COMPROBANTE;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
    this.router.navigate(['/operadorEF/home'],
      {
        queryParams:
        {
          accion: "carta",
          status: "autorizar",
        }
      });

  }

  setDocumentacion() {
    for (let doc of this.model.uploadDocumento) {
      if (doc.tipoDocumento === 3) {
        this.documentacion.idCartaInstruccion = doc.id;
        this.documentacion.refBovedaCarta = doc.refDocBoveda;
      } else if (doc.tipoDocumento === 5) {
        this.documentacion.idContrato = doc.id;
        this.documentacion.refBovedaContrato = doc.refDocBoveda;
      } else if (doc.tipoDocumento === 6) {
        this.documentacion.idAmortizacion = doc.id;
        this.documentacion.refBovedaAmortizacion = doc.refDocBoveda;
      } else if (doc.tipoDocumento === 4) {
        this.documentacion.idIdentificacionOficial = doc.id;
        this.documentacion.refIdentificacionOficial = doc.refDocBoveda;
      }

      if (this.documentacion.idCartaInstruccion != null && this.documentacion.idContrato != null &&
        this.documentacion.idIdentificacionOficial != null) {
        break;
      }
    }
    this.model.informeCartaInstruccion.documentacion = { ...this.documentacion };
  }

  openModalReinstalacion(){
    this.modalService.open('reinstalacion');
  }

  closeModalReinstalacion() {
    this.modalService.close('reinstalacion');
  }

  autorizarReinstalacion(){
    this.closeModalReinstalacion();
    this.modalService.open("carga");
    let solicitudEstado = new SolicitudEstadoRequest();
    solicitudEstado.idSolicitud = this.solicitud.id;
    solicitudEstado.idEstado = EstadoSolicitud.AUTORIZADO;
    this.autorizarService.autorizarCartaReinstalacion(solicitudEstado).subscribe(
      (response: Solicitud) => this.respuestaReinstalacion(response)
    );
  }

  respuestaReinstalacion(response: Solicitud){
    this.modalService.close("carga");
    this.data.model.informeCartaInstruccion.solicitud = { ...response };
    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.persona.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.AUTORIZAR_PRESTAMO;
    bitacora.idSolicitud = response.id;
    bitacora.estadoSolicitud = EstadoSolicitud.AUTORIZADO;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));
    this.router.navigate(['/operadorEF/home'],
      {
        queryParams:
        {
          accion: "reinstalacion",
          status: "autorizar",
        }
      });
  }
}

