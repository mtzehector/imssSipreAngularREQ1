import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService, ModalService } from 'src/app/common/services';
import { ReporteService } from 'src/app/common/services/reporte.service';
import { Subscription } from 'rxjs';
import { Documento } from 'src/app/common/domain/documento';
import { TipoDocumento } from 'src/app/common/domain';
import { Reporte } from 'src/app/common/domain/reporte';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.operador.ef.component.html',
  styleUrls: ['./reportes.operador.ef.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class ReportesOperadorEFComponent extends BaseComponent implements OnInit {

  rol: string;
  formGroup: FormGroup;
  anioNominalArray: string[];
  mesNominalArray: any;
  doc23: Documento;
  flagDescarga: boolean;
  idTipoReporte: number;


  constructor(protected data: DataService,
    private formBuilder: FormBuilder,
    private reporteService: ReporteService,
    private router: Router,
    private modalService: ModalService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = this.model.rol;
    this.flagDescarga = false;
    this.buildForm();
    this.obtenerAniosNominal();
    this.obtenerMesesNominal();
    this.onChanges();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      tipoReporte: ['', [Validators.required]],
      anioNominal: ['', [Validators.required]],
      mesNominal: ['', [Validators.required]]
    });
  }

  obtenerAniosNominal() {
    this.anioNominalArray = new Array();
    let fechaActual = new Date();
    let anio = fechaActual.getFullYear();
    this.anioNominalArray.push(anio.toString());
    for (var i = 1; i < 6;) {
      anio -= 1;
      this.anioNominalArray.push(anio.toString());
      i++;
    }
  }

  obtenerMesesNominal() {
    this.mesNominalArray = new Array();
    this.mesNominalArray = [{ id: '01', desc: 'Enero' }, { id: '02', desc: 'Febrero' }, { id: '03', desc: 'Marzo' },
    { id: '04', desc: 'Abril' }, { id: '05', desc: 'Mayo' }, { id: '06', desc: 'Junio' },
    { id: '07', desc: 'Julio' }, { id: '08', desc: 'Agosto' }, { id: '09', desc: 'Septiembre' },
    { id: '10', desc: 'Octubre' }, { id: '11', desc: 'Noviembre' }, { id: '12', desc: 'Diciembre' }];
  }

  onChanges() {
    this.formGroup.get('tipoReporte').valueChanges.subscribe((val: string) => {

      this.formGroup.get('anioNominal').setValue("");
      this.formGroup.get('anioNominal').updateValueAndValidity();

      this.formGroup.get('mesNominal').setValue("");
      this.formGroup.get('mesNominal').updateValueAndValidity();
    });
  }

  generarReporte() {
    this.modalService.open("carga");
    let form = this.formGroup.value;
    this.model.reporte = form;
    this.model.reporte.curpUsuario = this.model.persona.curp;
    console.log("Model:",this.model);
    //this.model.reporte.cveEntidadFinanciera = this.model.entidadFinanciera.id;
    this.model.reporte.cveEntidadFinanciera = this.model.personaEF.entidadFinanciera.id;
    this.model.reporte.sesion = this.model.sesion == null? 0 : this.model.sesion;
    //console.log(">>>formValue", JSON.stringify(this.model.reporte));
    this.reporteService.generarReporteComprasCarteraEF(this.model.reporte).subscribe(response => this.setDocumento(response));
  }

  setDocumento(response: Reporte) {

    console.log("Reporte Response: ", response.reporteRs);
    this.model.reporte.reporteRs = response.reporteRs;
    this.flagDescarga = true;
    this.doc23 = new Documento();
    this.doc23 = { ...response.docComprasCarteraEF };
    this.doc23.tipoDocumentoEnum = TipoDocumento.REPORTE_COMPRAS_CARTERA_EF_XLSX;
    this.idTipoReporte = response.reporteRs.reporte.tipoReporte.id;
    if (this.idTipoReporte == 4) {
      console.log("Documentos", response.reporteRs.reporteDocumentos);
      for (var value of response.reporteRs.reporteDocumentos) {
        if (value.documento.tipoDocumento == 23) {
          this.doc23 = value.documento;
          this.doc23.tipoDocumentoEnum = TipoDocumento.REPORTE_COMPRAS_CARTERA_EF_XLSX;
        }
      }
    }
    this.formGroup.reset();
    this.modalService.close("carga");
  }


  
}
