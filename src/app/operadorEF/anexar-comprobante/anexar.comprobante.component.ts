import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from "../../data.service";
import { BaseComponent } from '../../common/base.component';
import { GuardarComprobanteService } from '../../common/services/guardar.comprobante.service';
import { Documento } from '../../common/domain/documento';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { PrestamoAutorizado } from '../../common/domain/prestamo.autorizado';
import { Model } from '../../model';
import { Prestamo } from '../../common/domain/prestamo';
import { ModalService } from 'src/app/common/services';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { Bitacora } from 'src/app/common/domain/bitacora';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { EstadoSolicitud } from 'src/app/common/domain/estado.solicitud';
import { BitacoraService } from 'src/app/common/services/bitacora.service';
import { CancelarSolicitudService } from '../../common/services/cancelar.solicitud.service';
import { Solicitud } from '../../common/domain/solicitud';



@Component({
  selector: 'app-anexar-comprobante',
  templateUrl: './anexar.comprobante.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class AnexarComprobanteComponent extends BaseComponent implements OnInit {

  resumenCartaInstruccion: PrestamoAutorizado;
  cepPensionado: Documento;
  cepPensionadoXml: Documento;
  cepEntidadFinancieraLista: Documento[] = [];
  cepEntidadFinancieraListaXML: Documento[] = [];
  cartaInstruccion: Documento;
  contratoCredito: Documento;
  identificacionOficial: Documento;
  tablaAmortizacion: Documento;
  prestamoAutorizado: PrestamoAutorizado = new PrestamoAutorizado();
  model: Model;
  nuevo: Prestamo;
  documentotmp: Documento[] = [];
  index: number = 0;
  rol: string;

  informeCartaInstruccion: CartaInstruccion;

  constructor(protected data: DataService,
    private guardarAnexar: GuardarComprobanteService,
    private router: Router, private modalService: ModalService,
    private bitacoraService: BitacoraService,
    private cancelarSolicitudService: CancelarSolicitudService) {
    super(data);
  }

  ngOnInit() {

    this.rol = "operadorEF";

    this.resumenCartaInstruccion = this.model.prestamoAutorizado;
    this.resumenCartaInstruccion.solicitud.id = this.data.model.informeCartaInstruccion.solicitud.id;

    console.log("Anexar comprobante: " , this.model.prestamoAutorizado);
    this.model.informeCartaInstruccion = this.model.prestamoAutorizado;
       
    this.prestamoAutorizado = new PrestamoAutorizado();

    // tslint:disable-next-line: indent
    // tslint:disable-next-line: indent
    this.cepPensionado = new Documento();
    this.cepPensionado.tipoDocumentoEnum = TipoDocumento.CEP_PENSIONADO;

    this.cepPensionadoXml = new Documento();
    this.cepPensionadoXml.tipoDocumentoEnum = TipoDocumento.CEP_PENSIONADO_XML;


    this.obtenerDocumentos(this.resumenCartaInstruccion);
    this.obtenerCepEntidadFinancieraLista(this.resumenCartaInstruccion);
    //console.log("resumencarta .-.-.-.-.-", this.resumenCartaInstruccion);
    // tslint:disable-next-line: new-parens
    this.data.model.uploadDocumento = [];

  }

  obtenerCepEntidadFinancieraLista(resumenCartaInstruccion: PrestamoAutorizado) {
    if (resumenCartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion.length > 0) {
      for (let i = 0; i < resumenCartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion.length; i++) {
        let prestamoRecuperacion = resumenCartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion[i];
        let cepEntidadFinanciera = new Documento();
        let cepEntidadFinancieraXML = new Documento();
        cepEntidadFinanciera.cveEntidadFinanciera = prestamoRecuperacion.cveEntidadFinanciera;
        cepEntidadFinanciera.cvePrestamoRecuperacion = prestamoRecuperacion.id;
        cepEntidadFinanciera.numEntidadFinancieraSIPRE = prestamoRecuperacion.numEntidadFinanciera;
        cepEntidadFinanciera.tipoDocumentoEnum = TipoDocumento.CEP_ENTIDAD_FINANCIERA;
        cepEntidadFinanciera.tipoDocumento = TipoDocumento.CEP_ENTIDAD_FINANCIERA.id;
        cepEntidadFinanciera.folioSIPRE = prestamoRecuperacion.numSolicitudSipre;
        this.cepEntidadFinancieraLista.push(cepEntidadFinanciera);

        cepEntidadFinancieraXML.cveEntidadFinanciera = prestamoRecuperacion.cveEntidadFinanciera;
        cepEntidadFinancieraXML.cvePrestamoRecuperacion = prestamoRecuperacion.id;
        cepEntidadFinancieraXML.numEntidadFinancieraSIPRE = prestamoRecuperacion.numEntidadFinanciera;
        cepEntidadFinancieraXML.tipoDocumentoEnum = TipoDocumento.CEP_ENTIDAD_FINANCIERA_XML;
        cepEntidadFinancieraXML.tipoDocumento = TipoDocumento.CEP_ENTIDAD_FINANCIERA_XML.id;
        cepEntidadFinancieraXML.folioSIPRE = prestamoRecuperacion.numSolicitudSipre;
        this.cepEntidadFinancieraListaXML.push(cepEntidadFinancieraXML);

      }
      this.resumenCartaInstruccion.cepEntidadFinancieraLista = this.cepEntidadFinancieraLista;
      this.resumenCartaInstruccion.cepEntidadFinancieraListaXML = this.cepEntidadFinancieraListaXML;
    }


  }

  obtenerDocumentos(resumenCartaInstruccion: PrestamoAutorizado) {
    //console.log("tamaño de documentos" + resumenCartaInstruccion.documentos.length);

    if (resumenCartaInstruccion.documentos.length > 0) {
      for (let i = 0; i < resumenCartaInstruccion.documentos.length; i++) {
        //console.log("reboveda" + resumenCartaInstruccion.documentos[i].refDocBoveda);
        //console.log("id" + resumenCartaInstruccion.documentos[i].tipoDocumento);
        if (resumenCartaInstruccion.documentos[i].refDocBoveda != null) {
          this.documentotmp[this.index] = resumenCartaInstruccion.documentos[i];
          this.documentotmp[this.index].tipoDocumentoEnum = TipoDocumento.forValue(resumenCartaInstruccion.documentos[i].tipoDocumento);
          this.index++;
        }
      }
      this.resumenCartaInstruccion.documentos = this.documentotmp;

    }

  }



  guardarAnexarCEP() {

    if (this.validateDocs()) {
      this.cepsFillData();
      this.openModal('carga');
      this.resumenCartaInstruccion.docPdfPensionadoCEP = this.cepPensionado;
      this.resumenCartaInstruccion.docXmlPensionadoCEP = this.cepPensionadoXml;
      this.guardarAnexar.guardarAnexar(this.resumenCartaInstruccion).subscribe((prestamoAutorizado: PrestamoAutorizado) => this.validarGuardar(prestamoAutorizado));
    }
    else {
      this.data.model.mensaje.mensaje = "Debes ingresar la información obligatoria.";
      this.data.model.mensaje.level = "danger";

    }
  }

  cepsFillData() {
    if (this.resumenCartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion.length > 0) {
      for (let i = 0; i < this.resumenCartaInstruccion.cepEntidadFinancieraLista.length; i++) {
        for (let j = 0; j < this.model.uploadDocumento.length; j++) {
          if (this.resumenCartaInstruccion.cepEntidadFinancieraLista[i].id === this.model.uploadDocumento[j].id) {
            this.resumenCartaInstruccion.cepEntidadFinancieraLista[i].refDocBoveda = this.model.uploadDocumento[j].refDocBoveda;
            break;
          }
        }
      }

      for (let i = 0; i < this.resumenCartaInstruccion.cepEntidadFinancieraListaXML.length; i++) {
        for (let j = 0; j < this.model.uploadDocumento.length; j++) {
          if (this.resumenCartaInstruccion.cepEntidadFinancieraListaXML[i].id === this.model.uploadDocumento[j].id) {
            this.resumenCartaInstruccion.cepEntidadFinancieraListaXML[i].refDocBoveda = this.model.uploadDocumento[j].refDocBoveda;
            break;
          }
        }
      }
    }
  }

  validateDocs() {
    let valid = true;
    if (this.cepPensionado.id !== null && this.cepPensionado.id !== undefined) {
      if (this.resumenCartaInstruccion.listPrestamoRecuperacion.prestamosEnRecuperacion.length > 0) {
        for (let i = 0; i < this.resumenCartaInstruccion.cepEntidadFinancieraLista.length; i++) {
          if (this.resumenCartaInstruccion.cepEntidadFinancieraLista[i].id === null || this.resumenCartaInstruccion.cepEntidadFinancieraLista[i].id === undefined) {
            valid = false;
            break;
          }
          //if (this.resumenCartaInstruccion.cepEntidadFinancieraListaXML[i].id === null || this.resumenCartaInstruccion.cepEntidadFinancieraListaXML[i].id === undefined) {
            //valid = false;
            //break;
          //}
        }
      }
    }
    else {
      valid = false;
    }
    return valid;
  }

  validarGuardar(prestamoAutorizado: PrestamoAutorizado) {

    this.prestamoAutorizado = { ...prestamoAutorizado };

    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.persona.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.ANEXAR_COMPROBANTE;
    bitacora.idSolicitud = prestamoAutorizado.solicitud.id;
    bitacora.estadoSolicitud = EstadoSolicitud.AUTORIZADO;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log(''));

    this.closeModal('carga');

this.navegarHome();
  }

  
  navegarHome() {
    this.router.navigate(['/operadorEF/home'],
    {
      queryParams:
      {
        accion: "cargaCEP",
        status: "success",
      }
    });

  }

  openModal(tituloModal) {
    this.modalService.open(tituloModal);
  }
  closeModal(tituloModal) {
    this.modalService.close(tituloModal);
  }

  async cancelarSolicitud() {
    //console.log('>>> cancelarAutorizar');
    this.closeModal('cancelarCarta');
    this.modalService.open("carga");
    await this.cancelarSolicitudService.getCancelar(this.data.model.informeCartaInstruccion.solicitud.id)
      .toPromise().then((solicitud: Solicitud) => this.validarCancelacion(solicitud));
  }

  async validarCancelacion(solicitud: Solicitud) {
    if (solicitud.id != null) {
      let bitacora: Bitacora = new Bitacora();
      bitacora.curp = this.model.persona.curp;
      bitacora.sesion = this.data.model.sesion;
      bitacora.tipo = TipoBitacora.CARGA_CEP_CANCELADA;
      bitacora.idSolicitud = solicitud.id;
      bitacora.estadoSolicitud = solicitud.cveEstadoSolicitud.id;
      await this.bitacoraService.create(bitacora).toPromise().then((bitacora: Bitacora) => console.log(''));
      this.modalService.close("carga");
      this.data.model.mensaje.mensaje = "El folio ha sido cancelado con éxito.";
      this.data.model.mensaje.level = "success";
      this.router.navigate(['/operadorEF/buscarFolioAutorizar'],
      {
        queryParams:
        {
          accion: "CARGA_CEP_CANCELADA",
          status: "success",
        }
      });
      //this.router.navigate(['/operadorEF/buscarFolioAutorizar', {}]);
    }
  }

}
