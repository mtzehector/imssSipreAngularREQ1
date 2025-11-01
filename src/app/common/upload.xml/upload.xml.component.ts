import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Model } from "../../model";
import { PensionesResponse } from "../domain/pensiones.response";
import { DataService } from "../../data.service";
import { PersonaService } from "../services/persona.service";
import { Persona } from "../domain/persona";
import { PensionadoService } from '../services/pensionado.service';
import { BaseComponent } from 'src/app/common/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../services/base.service';
import { DocumentoService } from '../services/documento.service';
import { Documento } from '../domain/documento';
import { TipoDocumento } from '../domain/tipo.documento';
import { MensajeService } from '../services/mensaje.service';
import { Mensaje } from '../domain/mensaje';

@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload.xml.component.html'
})
export class UploadXmlComponent extends BaseComponent implements OnInit {

  @Input()
  documento: Documento;

  @Input()
  idSolicitud: number;

  value: string;
  model: Model;
  mensaje: Mensaje;
  fileName: string;
  upload: Documento = new Documento;

  uploadForm: FormGroup;
  flagUpload: number = 0;

  constructor(
    protected data: DataService,
    private router: Router,
    private personaService: PersonaService,
    private pensionadoService: PensionadoService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,
    private documentoService: DocumentoService
  ) {
    super(data);

  }
  ngOnInit() {
    this.flagUpload = 0;

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
      this.fileName = file.name;
    }
  }

  onSubmit() {
    if (this.flagUpload == 0) {
      this.flagUpload = 1;
      //console.log("Enviando el documento");
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('profile').value);
      formData.append('nombre', this.fileName);
      formData.append('tipo', '' + this.documento.tipoDocumentoEnum.id);
      formData.append('idSolicitud', '' + this.idSolicitud);
      formData.append('sesion', this.model.sesion == null? "0" : this.model.sesion.toString());
      
      this.documentoService.postDocumento(formData).subscribe(
        res => {
          this.setDocumento(res);
           this.flagUpload = 0;
        },
        error => {
          this.flagUpload = 0;
        }
      );
    }
  }

  setDocumento(documento: Documento) {
    //console.log("Respuesta upload: " + JSON.stringify(documento));
    this.documento.id = documento.id;

    //console.log("documento upload ", this.documento.tipoDocumentoEnum);

    this.upload = { ...documento };
    this.data.model.uploadDocumento.push(this.upload);

    //console.log("modelo.-.-", this.data.model)
  }




}
