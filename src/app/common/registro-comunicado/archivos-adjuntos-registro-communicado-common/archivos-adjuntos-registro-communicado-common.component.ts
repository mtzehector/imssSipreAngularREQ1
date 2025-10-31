import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from 'src/app/common/base.component';
import { Documento, TipoDocumento } from 'src/app/common/domain';
import { DataService } from 'src/app/common/services';
import { Model } from 'src/app/model';

@Component({
  selector: 'app-archivos-adjuntos-registro-communicado-common',
  templateUrl: './archivos-adjuntos-registro-communicado-common.component.html',
  styleUrls: ['./archivos-adjuntos-registro-communicado-common.component.css']
})
export class ArchivosAdjuntosRegistroComunicadoCommonComponent extends BaseComponent implements OnInit {

  public documentos: Documento[] = new Array();
  model: Model;
  index: number;
  uploadForm: FormGroup;
  flagDownload: boolean;

  constructor(
    protected data: DataService,
    private formBuilder: FormBuilder) {
    super(data);
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.agregar(0, "init");
    this.flagDownload = false;
  }

  agregar(index, init) {
    let documento: Documento = {
      tipoDocumentoEnum: TipoDocumento.NOTIFICACION,
      refIndexNot: init == "init" ? index : index + 1
    };
    this.documentos.push(documento);
  }

  eliminar(index) {
    if (index != 0) {
      this.documentos.splice(index, 1);
      const i = this.model.documentosNot.findIndex(x => x.refIndexNot === index);
      if (i !== undefined) {
        this.model.documentosNot.splice(i, 1);
      }
    }
  }

}
