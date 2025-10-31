import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Model } from "../../model";
import { PensionesResponse } from "../domain/pensiones.response";
import { DataService } from "../../data.service";
import { PersonaService } from "../../common/services/persona.service";
import { Persona } from "../../common/domain/persona";
import { PensionadoService } from '../services/pensionado.service';
import { BaseComponent } from 'src/app/common/base.component';
import { UploadDocumento } from 'src/app/common/domain/upload.documento';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../services/base.service';
import { DocumentoService } from '../services/documento.service';
import { Documento } from '../domain/documento';
import { TipoDocumento } from '../domain/tipo.documento';
import { Mensaje } from '../domain/mensaje';
import { MensajeService } from '../services/mensaje.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html'
})
export class UploadComponent extends BaseComponent implements OnInit {

  @Input()
  documento: Documento;

  @Input()
  idSolicitud: number;

  @Input()
  eFinanciera: number;

  @Input()
  cvePrestamoRecuperacion: number;

  @Output() imageChanged : EventEmitter<string> = new EventEmitter<string>();

  value: string;
  model: Model;
  mensaje: Mensaje;
  upload: Documento = new Documento;
  fileName: string;
  typeFile: string;
  loadingFile: boolean = false;

  @ViewChild('inputC', { static: false })
  inputChild: ElementRef;

  uploadForm: FormGroup;

  constructor(
    protected data: DataService,
    private router: Router,
    private personaService: PersonaService,
    private pensionadoService: PensionadoService,
    private formBuilder: FormBuilder,
    private documentoService: DocumentoService,
    private mensajeService: MensajeService,
    private element: ElementRef
  ) {
    super(data);
    this.model = this.data.model;
  }
  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  ngAfterViewInit() {
    if (this.documento.tipoDocumentoEnum === TipoDocumento.FOTOGRAFIA) {
      this.inputChild.nativeElement.setAttribute('accept', '.jpg');
    }
    if (this.documento.tipoDocumentoEnum === TipoDocumento.LOGO) {
      this.inputChild.nativeElement.setAttribute('accept', '.jpg');
    }

  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.documento.id = 0;
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
      const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageChanged.emit(reader.result as string);
      };
      this.fileName = file.name;
      if (this.model.flagDocsNotificacion) {//flujo Notificaciones
        this.typeFile = file.type;
      }
    }else{
      this.fileName = ''
      this.uploadForm.get('profile').setValue('');
      let index = this.data.model.uploadDocumento.findIndex( data =>{
        return data.id === this.documento.id;
      });
      this.data.model.uploadDocumento.splice(index,1);
      this.documento.id = 0;
      this.imageChanged.emit("/suap/auth/js/assets/img/logoEF1.png");
    }
  }

  onSubmit() {
    this.loadingFile = true;

    //console.log(">>>UploadComponent onSubmit documento="+JSON.stringify(this.documento));
    let tipo;
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);
    formData.append('nombre', this.fileName);
    if (this.model.flagDocsNotificacion) {//flujo Notificaciones     
      if (this.typeFile == "application/pdf") {
        tipo = TipoDocumento.NOTIFICACION.id;
      } else if (this.typeFile == "text/xml") {
        tipo = TipoDocumento.NOTIFICACION_XML.id;
      } else {
        tipo = this.documento.tipoDocumentoEnum.id;
      }
      formData.append('tipo', '' + tipo);
    } else {
      formData.append('tipo', '' + this.documento.tipoDocumentoEnum.id);
    }
    formData.append('idSolicitud', '' + this.idSolicitud);
    formData.append('eFinanciera',''+this.eFinanciera);
    formData.append('cvePrestamoRecuperacion', ''+this.cvePrestamoRecuperacion);
    formData.append('sesion', this.model.sesion == null? "0" : this.model.sesion.toString());

    this.documentoService.postDocumento(formData).toPromise().then(
      res => {
        this.setDocumento(res);
        this.loadingFile = false;
      },error=>{
      this.loadingFile = false;
    });
  }

  setDocumento(documento: Documento) {
    this.documento.id = documento.id;

    //console.log(">>>documento upload ", JSON.stringify(this.documento));
    this.upload = { ...documento };
    if (this.model.flagDocsNotificacion) {
      this.upload.refIndexNot = this.documento.refIndexNot;
      this.upload.nombreDocNotificacion = this.fileName;
      this.data.model.documentosNot.push(this.upload);
    } else {
      this.data.model.uploadDocumento.push(this.upload);
    }

    this.data.model.flagReinstalacion = this.upload.tipoDocumento == 34 ? false : true;
    console.log(">>>modelo", JSON.stringify(this.data.model.documentosNot));
  }
}