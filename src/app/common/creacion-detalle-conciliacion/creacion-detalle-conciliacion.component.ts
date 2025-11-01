import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Conciliacion } from '../domain/conciliacion';
import { ConciliacionService } from '../services/conciliacion.service';
import { DataService, ModalService } from '../services';
import { BaseComponent } from '../base.component';
import { Documento, TipoDocumento } from '../domain';

@Component({
  selector: 'app-creacion-detalle-conciliacion',
  templateUrl: './creacion-detalle-conciliacion.component.html',
  styleUrls: ['./creacion-detalle-conciliacion.component.css']
})
export class CreacionDetalleConciliacionComponent extends BaseComponent implements OnInit {

  public conciliacion: Conciliacion;
  formGroup: FormGroup;
  documento: Documento;

  constructor(
    protected data: DataService,
    private formBuilder: FormBuilder,
    private conciliacionService: ConciliacionService,
    private modalService: ModalService,
  ) {
    super(data);
    this.model = this.data.model;
    this.conciliacion = new Conciliacion();
   }

  ngOnInit() {
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.buildForm();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      periodo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  generarConciliacion() {
    if (this.formGroup.invalid) {
      return;
    }
    
    this.modalService.open("carga");
    this.conciliacion.curp = this.model.persona.curp;
    this.conciliacion.cveEntidadFinanciera =  (this.model.rol == "adminEF" || this.model.rol == "adminEFSinConvenio") ? parseInt(this.model.entidadFinanciera.id)  : parseInt(this.model.personaEF.entidadFinanciera.id) ;
    this.conciliacion.razonSocial = (this.model.rol == "adminEF" || this.model.rol == "adminEFSinConvenio") ? this.model.entidadFinanciera.razonSocial : this.model.personaEF.entidadFinanciera.razonSocial;
    this.conciliacion.numeroProveedor = (this.model.rol == "adminEF" || this.model.rol == "adminEFSinConvenio") ? this.model.entidadFinanciera.numProveedor : this.model.personaEF.entidadFinanciera.numProveedor;
    this.conciliacion.cveTipoDocumento = TipoDocumento.DETALLE_CONCILIACION.id;
    this.conciliacion.sesion = this.model.sesion == null? 0 : this.model.sesion;
    
    this.conciliacionService.generaConciliacion(this.conciliacion).subscribe( data => {
      this.modalService.close("carga");
      if (data) {
        this.documento = data;
      }
    });

  }

  limpiar() {
    this.conciliacion = new Conciliacion();
    this.documento = null;
    this.formGroup.reset();
  }

}
