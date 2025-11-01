import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../common/base.component';
import { PrestamoAutorizado } from '../../common/domain/prestamo.autorizado';
import { Documento } from '../../common/domain/documento';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { DataService } from "../../data.service";
import { Router } from '@angular/router';
import { ModalService } from 'src/app/common/services';
import { DocumentoService } from 'src/app/common/services/documento.service';
import { FormBuilder} from '@angular/forms';
import { DocumentoAdicional } from './model/DocumentoAdicional';

@Component({
    selector: 'app-cargar-documentacion',
    templateUrl: './cargar.documentacion.adicional.component.html',
    styleUrls: ['../../common/css/tarjetas-estilos-base.css']
  })
  export class CargarDocumentacionAdicionalComponent extends BaseComponent implements OnInit {
    rol: string;
    resumenCartaInstruccion: PrestamoAutorizado;
    prestamoAutorizado: PrestamoAutorizado = new PrestamoAutorizado();
    documentoAdicional: DocumentoAdicional[] = new Array();//Modelo para la carga de documentación adicional
    documentacion: Documento[] = Array();//Contrato, Carta Libranza e Identificación oficial
    comprobantesPago: Documento[] = Array();//CEP y CEPXML
    documentacionAdicional: Documento[] = Array();//La documentación adicional cargada.
    indexCartaLibranza: number = 0;
    indexIdentificacionOficial: number = 0;
    indexContrato: number = 0;
    indexCEP: number = 0;
    indexCEPXML: number = 0;
    indexAdjunto: number;
    totalDocumentos: number = 0;
    @Output() imageChanged : EventEmitter<string> = new EventEmitter<string>();
     
    constructor(protected data: DataService, private router: Router, 
      private modalService: ModalService, private documentoService: DocumentoService,
      private formBuilder: FormBuilder) {
        super(data);
        this.model = this.data.model;
      }

    ngOnInit() {
        this.rol = "operadorEF";
        this.resumenCartaInstruccion = this.model.prestamoAutorizado;
        this.resumenCartaInstruccion.solicitud.id = this.data.model.informeCartaInstruccion.solicitud.id;
        this.model.informeCartaInstruccion = this.model.prestamoAutorizado;
        this.prestamoAutorizado = new PrestamoAutorizado();
        const documentosDesordenados = this.obtenerDocumentos(this.resumenCartaInstruccion);
        const documentosOrdenados = this.ordenarDocumentoPorId(documentosDesordenados);
        this.clasificarDocumentos(documentosOrdenados);
        this.data.model.uploadDocumento = [];
        this.addFila(true);
        this.totalDocumentos = this.totalDocumentos + this.getTotalDocumentosCargados();
    }

    obtenerDocumentos(resumenCartaInstruccion: PrestamoAutorizado){
      const documentos: Documento[] = new Array();
      if (resumenCartaInstruccion.documentos.length > 0) {
        for (let documento of resumenCartaInstruccion.documentos) {
          if(documento.refDocBoveda != null) documentos.push(documento);
        }
      }
      return documentos;
    }

    ordenarDocumentoPorId(listaDocumentos: Documento[]){
      let auxiliar: Documento;
      let listaOrdenada: Documento[];
      for(let i = 2; i < listaDocumentos.length; i++){
        for(let j = 0; j < listaDocumentos.length-i ;j++){
          if(listaDocumentos[j].id > listaDocumentos[j+1].id){
            auxiliar = listaDocumentos[j];
            listaDocumentos[j] = listaDocumentos[j+1];
            listaDocumentos[j+1] = auxiliar;
          }   
        }
      }
      listaOrdenada = listaDocumentos;
      return listaOrdenada;
    }

    clasificarDocumentos(listaDocumentos: Documento[]){
      const documentosOrdenados: Documento[] = this.ordenarDocumentoPorId(listaDocumentos);
      for(let i = 0; i < documentosOrdenados.length; i++){
        this.addDocumento(documentosOrdenados[i]);
      }
    }
    
    assignDocumentosValidos(resumenCartaInstruccion: PrestamoAutorizado){
      if (resumenCartaInstruccion.documentos.length > 0) {
        for (let documento of resumenCartaInstruccion.documentos) {
          if(documento.refDocBoveda != null) this.addDocumento(documento);
        }
      }
    }

    addDocumento(documento: Documento){
      const tipoDocumento = TipoDocumento.forValue(documento.tipoDocumento);
      documento.tipoDocumentoEnum = tipoDocumento;
      switch(tipoDocumento){
        case TipoDocumento.CARTA_INSTRUCCION:
          if(this.indexCartaLibranza < 1) this.documentacion.push(documento);
          if(this.indexCartaLibranza >= 1) this.documentacionAdicional.push(documento);
          this.indexCartaLibranza++;
          break;
        case TipoDocumento.IDENTIFICACION_OFICIAL:
          if(this.indexIdentificacionOficial < 1) this.documentacion.push(documento);
          if(this.indexIdentificacionOficial >= 1) this.documentacionAdicional.push(documento);
          this.indexIdentificacionOficial++;
          break;
        case TipoDocumento.CONTRATO:
          if(this.indexContrato < 1) this.documentacion.push(documento);
          if(this.indexContrato >= 1) this.documentacionAdicional.push(documento);
          this.indexContrato++;
          break;
        case TipoDocumento.CEP_PENSIONADO:
          if(this.indexCEP < 1) this.comprobantesPago.push(documento);
          if(this.indexCEP >= 1) this.documentacionAdicional.push(documento);
          this.indexCEP++;
          break;
        case TipoDocumento.CEP_PENSIONADO_XML:
          if(this.indexCEPXML < 1) this.comprobantesPago.push(documento);
          if(this.indexCEPXML >= 1) this.documentacionAdicional.push(documento);
          this.indexCEPXML++;
          break;
        case TipoDocumento.CEP_ENTIDAD_FINANCIERA:
        case TipoDocumento.CEP_ENTIDAD_FINANCIERA_XML:
          this.comprobantesPago.push(documento);
          break;
        default:
          break;
      }
    }

    addFila(init: boolean) {
      if(init){
        this.crearDocumentoAdicional();
        this.totalDocumentos++;
      }else{
        if((this.totalDocumentos < 5 && !this.documentoAdicional[0].documentoResponse) 
        ||(this.totalDocumentos <= 5 && this.documentoAdicional[0].documentoResponse)){
          this.crearDocumentoAdicional(); 
          this.totalDocumentos++;
        }
      }
    }

    crearDocumentoAdicional(){
      const documentoAdicional: DocumentoAdicional = new DocumentoAdicional();
        const documento: Documento = {
          tipoDocumento: -1
        };
        documentoAdicional.documentoRequest = documento;
        documentoAdicional.uploadForm = this.formBuilder.group({
          profile: ['']
        });
        this.documentoAdicional.push(documentoAdicional);
    }

    getTotalDocumentosCargados(){
      return this.documentacionAdicional.length;
    }

    onFileSelect(event, documentoAdicional: DocumentoAdicional) { 
      if (event.target.files.length > 0) {
        documentoAdicional.documentoRequest.id = 0;
        documentoAdicional.documentoRequest.tipoDocumento = Number(documentoAdicional.documentoRequest.tipoDocumento);
        documentoAdicional.documentoRequest.tipoDocumentoEnum = TipoDocumento.forValue(documentoAdicional.documentoRequest.tipoDocumento);
        const file = event.target.files[0];
        documentoAdicional.uploadForm.get('profile').setValue(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageChanged.emit(reader.result as string);
        };
        documentoAdicional.fileName = file.name;
        documentoAdicional.typeFile = file.type;
      }else{
        documentoAdicional.fileName = '';
        documentoAdicional.typeFile = '';
        documentoAdicional.uploadForm.get('profile').setValue('');
        let index = this.data.model.uploadDocumento.findIndex( data =>{
          return data.id === documentoAdicional.documentoRequest.id;
        });
        this.data.model.uploadDocumento.splice(index,1);
        documentoAdicional.documentoRequest.id = 0;
        this.imageChanged.emit("/suap/auth/js/assets/img/logoEF1.png");
      }
    }

    onSubmit(documentoAdicional: DocumentoAdicional) {
      const documento = documentoAdicional.documentoRequest;
      if(!this.validarDocumentosCompletos(documento)){
        if(this.validarTipoDocumento(documentoAdicional)){
          documentoAdicional.loadingFile = true;
          const formData = new FormData();
          formData.append('file', documentoAdicional.uploadForm.get('profile').value);
          formData.append('nombre', documentoAdicional.fileName);
          formData.append('tipo', '' + documento.tipoDocumentoEnum.id);
          formData.append('idSolicitud', '' + this.resumenCartaInstruccion.solicitud.id);
          formData.append('sesion', this.model.sesion == null? "0" : this.model.sesion.toString());
          
          this.documentoService.postDocumentoAdicional(formData).toPromise().then(
          res => {
            this.setDocumento(res);
            documentoAdicional.documentoResponse = res;
            documentoAdicional.loadingFile = false;
            this.totalDocumentos++;
          },error=>{
            documentoAdicional.loadingFile = false;
          });
        }
      }
    }

    setDocumento(documento: Documento) {
      this.addDocumento(documento);
      const documentoCargado = { ...documento };
      this.data.model.uploadDocumento.push(documentoCargado);
      this.showMessage("Se ha cargado con éxito el documento adicional.","success");
    }

    validarDocumentosCompletos(documento: Documento){
      let documentosCompletos: boolean = false;
      if(this.indexCartaLibranza == 2 && this.indexIdentificacionOficial == 2 && 
        this.indexContrato == 2 && this.indexCEP == 2 && this.indexCEPXML == 2){
        this.showMessage("No se pueden anexar más documentos, se ha cargado toda la documentación adicional permitida."
        ,"danger");
        documentosCompletos = true;
      }else{
        switch(documento.tipoDocumento){
          case 3:
            if(this.indexCartaLibranza == 2) documentosCompletos = true;
            break;
          case 4:
            if(this.indexIdentificacionOficial == 2) documentosCompletos = true;
            break;
          case 5:
            if(this.indexContrato == 2) documentosCompletos = true;
            break;
          case 7:
            if(this.indexCEP == 2) documentosCompletos = true;
            break;
          case 12:
            if(this.indexCEPXML == 2) documentosCompletos = true;
            break;
        }
        this.showMessage("No se pueden anexar más documentos de tipo " 
        + TipoDocumento.forValue(documento.tipoDocumento).descripcion 
        + ", se ha cargado toda la documentación adicional permitida."
        ,"warning");
      }
      return documentosCompletos;
    }

    validarTipoDocumento(documentoAdicional: DocumentoAdicional){
      let tipoDocumentoValido = false;
      if(documentoAdicional.documentoRequest.tipoDocumento == 3 
        || documentoAdicional.documentoRequest.tipoDocumento == 4
        || documentoAdicional.documentoRequest.tipoDocumento == 5
        || documentoAdicional.documentoRequest.tipoDocumento == 7
        || documentoAdicional.documentoRequest.tipoDocumento == 12){
          if(documentoAdicional.documentoRequest.tipoDocumento == 12 
            && documentoAdicional.typeFile == "text/xml"){
              tipoDocumentoValido = true;
          }else if(documentoAdicional.documentoRequest.tipoDocumento != 12
            && documentoAdicional.typeFile == "application/pdf"){
              tipoDocumentoValido = true;
          }else{
            this.showMessage("El tipo de archivo no es válido para este documento.","danger");
            tipoDocumentoValido = false;
          }
      }else{
        this.showMessage("No se ha seleccionado un tipo de documento válido.","warning");
        tipoDocumentoValido = false;
      }
      return tipoDocumentoValido;
    }

    openModal(tituloModal: string) {
      this.modalService.open(tituloModal);
    }
    closeModal(tituloModal: string) {
      this.modalService.close(tituloModal);
    }

    showMessage(mensaje: string, level: string){
      this.data.model.mensaje.mensaje = mensaje;
      this.data.model.mensaje.level = level;
    }

    eliminar() {
      if (this.documentoAdicional.length > 1) {
        this.documentoAdicional.splice(this.indexAdjunto, 1);
        const i = this.model.documentosNot.findIndex(x => x.refIndexNot === this.indexAdjunto);
         if (i !== undefined) {
           this.model.documentosNot.splice(i, 1);
         }
         this.modalService.close("eliminarAdjunto");
         this.indexAdjunto = 0;
         this.model.mensaje.mensaje = "El archivo ha sido eliminado con éxito.";
         this.model.mensaje.level = "success";
         this.totalDocumentos--; 
      }else{
        const documentoAdicional: DocumentoAdicional = new DocumentoAdicional();
        const documento: Documento = {
          tipoDocumento: -1
        };
        documentoAdicional.documentoRequest = documento;
        documentoAdicional.uploadForm = this.formBuilder.group({
          profile: ['']
        });
        this.documentoAdicional[this.indexAdjunto] = documentoAdicional;
        this.modalService.close("eliminarAdjunto");
        this.indexAdjunto = 0;
        this.model.mensaje.mensaje = "El archivo ha sido eliminado con éxito.";
        this.model.mensaje.level = "success";
      }
    }

    limpiarFormulario(documentoActual:DocumentoAdicional){
      const tipoDocumento:number = documentoActual.documentoRequest.tipoDocumento;
      const documentoAdicional: DocumentoAdicional = new DocumentoAdicional();
        const documento: Documento = {
          tipoDocumento: tipoDocumento
        };
        documentoAdicional.documentoRequest = documento;
        documentoAdicional.uploadForm = this.formBuilder.group({
          profile: ['']
        });
        documentoActual = documentoAdicional;
    }
  
    openModalAdjunto(id: number) {
      this.indexAdjunto = id;
      this.modalService.open("eliminarAdjunto");
    }

    /*baja lógica de documentos
        this.documentoService.bajaDocumento(new DocumentoRequest).toPromise().then(
          res => {
            this.closeModal('cancelar-carga');
            this.router.navigate(['/operadorEF/buscarFolioAutorizar']);
          },error=>{
            this.closeModal('cancelar-carga');
          });
    */
  }