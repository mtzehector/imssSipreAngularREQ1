import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from 'src/app/common/base.component';
import { DescargaImprimeService } from 'src/app/common/descarga-imprime/descarga.imprime.service';
import { Documento } from 'src/app/common/domain/documento';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { TipoDocumento } from 'src/app/common/domain/tipo.documento';
import { ModalService } from 'src/app/common/modal-Services/modal.service';
import { DocumentoService } from 'src/app/common/services/documento.service';
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { DataService } from 'src/app/data.service';
import { Model } from 'src/app/model';


@Component({
  selector: 'app-atencion-archivos-adjuntos',
  templateUrl: './archivos-adjuntos.component.html',
  styleUrls: ['./archivos-adjuntos.component.css']
})
export class ArchivosAdjuntosComponent extends BaseComponent implements OnInit {

  public documentos: Documento[] = new Array();
  model: Model;
  index: number;
  uploadForm: FormGroup;
  flagDownload: boolean;
  idborrarAdjunto: any;
  mensajeExito: Mensaje = new Mensaje();

  constructor(
    protected data: DataService,
    private formBuilder: FormBuilder,
    private modalService: ModalService) {
      super(data);
  }

  ngOnInit() {
    this.mensajeExito.mensaje = "";
    this.mensajeExito.level = "";
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.agregar(0, "init");
    this.flagDownload = false;
  }

  agregar(index, init) {
    console.log("agregar index:" + index);
    let documento: Documento = {
      tipoDocumentoEnum: TipoDocumento.NOTIFICACION,
      refIndexNot: init == "init"?index:index+1
    };
    this.documentos.push(documento);
    console.log(">>>DOC-AGREGAR", JSON.stringify(this.documentos));
  }

  eliminar(index) {
    console.log("eliminar index:" + index);
    if (index != 0) {
      this.documentos.splice(index, 1);
      const i = this.model.documentosNot.findIndex(x => x.refIndexNot === index);
      console.log(">>>i", i);
       if (i !== undefined) {
         this.model.documentosNot.splice(i, 1);
       }
    }
    this.closeModalAdjunto();
    this.model.mensaje.mensaje = "El archivo ha sido eliminado con éxito.";
    this.model.mensaje.level = "success";
    // console.log(">>>DOC-MODEL", JSON.stringify(this.model.documentosNot));
    // console.log(">>>DOC-ELIMINAR", JSON.stringify(this.documentos));
  }

  closeModalAdjunto() {
    this.modalService.close("eliminarAdjunto");
    this.idborrarAdjunto = '';
  }

  openModalAdjunto(id: number) {
    this.idborrarAdjunto = id;
    this.modalService.open("eliminarAdjunto");
  }

}
