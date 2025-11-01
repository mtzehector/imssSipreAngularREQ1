import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService, ModalService } from 'src/app/common/services';
import { ReporteService } from 'src/app/common/services/reporte.service';
import { Subscription } from 'rxjs';
import { Documento } from 'src/app/common/domain/documento';
import { TipoDocumento } from 'src/app/common/domain';
import { Reporte } from 'src/app/common/domain/reporte';
import { Router } from '@angular/router';

// Declaramos las variables para jQuery
declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class ReportesComponent extends BaseComponent implements OnInit {

  rol: string;
  formGroup: FormGroup;
  anioNominalArray: string[];
  mesNominalArray: any;
  docConciliacion: Documento;
  docInconsistencias: Documento;
  doc19: Documento;
  doc20: Documento;
  doc21: Documento;
  doc22: Documento;
  flagDescarga: boolean;
  idTipoReporte: number;
  subReportesArray: any;
  flagFechas: boolean;
  tituloReporte: string;
  nombreReporte: string;
  flagTemp: boolean;//Eliminar cuando se desarrollen los subreportes con id > 8
 


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
    this.flagFechas = false;
    this.flagTemp = false;
    this.buildForm();
    this.obtenerAniosNominal();
    this.obtenerMesesNominal();
    this.onChanges();
    this.onChangesSubReporte();
    this.prepararFechas();
    $(function(){
      $("#fechas").hide();
    });
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      tipoReporte: ['', [Validators.required]],
      anioNominal: ['', [Validators.required]],
      mesNominal: ['', [Validators.required]],
      subTipoReporte: [''],
      fechaDesde: [''],
      fechaHasta: ['']
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

      const validators = [Validators.required];

      switch(val){
        case '1':
        case '3':
          this.formGroup.get('anioNominal').setValue("");
          this.formGroup.get('anioNominal').updateValueAndValidity();
    
          this.formGroup.get('mesNominal').setValue("");
          this.formGroup.get('mesNominal').updateValueAndValidity();

          this.formGroup.get('subTipoReporte').setValue("");
          this.formGroup.get('subTipoReporte').clearValidators();
          this.formGroup.get('subTipoReporte').updateValueAndValidity();

          this.formGroup.get('fechaDesde').setValue(null);
          this.formGroup.get('fechaDesde').clearValidators();
          this.formGroup.get('fechaDesde').updateValueAndValidity();

          this.formGroup.get('fechaHasta').setValue(null);
          this.formGroup.get('fechaHasta').clearValidators();
          this.formGroup.get('fechaHasta').updateValueAndValidity();
          $(function(){
            $("#fechas").hide();
          });
          break;
        case '5':
        case '6':
          this.prepararFechas();
          this.formGroup.get('subTipoReporte').setValidators(validators);
          this.formGroup.get('subTipoReporte').updateValueAndValidity();

          this.formGroup.get('anioNominal').setValue("");
          this.formGroup.get('anioNominal').clearValidators();
          this.formGroup.get('anioNominal').updateValueAndValidity();
    
          this.formGroup.get('mesNominal').setValue("");
          this.formGroup.get('mesNominal').clearValidators();
          this.formGroup.get('mesNominal').updateValueAndValidity();

          if(val == '5'){
            this.subReportesArray = new Array();
            this.subReportesArray = [{ id: 5, desc: 'Préstamos autorizados por entidad financiera' }, 
                                            { id: 6, desc: 'Préstamos por entidad financiera' },
                                            { id: 7, desc: 'Préstamos por delegación' }, 
                                            { id: 8, desc: 'Monitor pensionados' },
                                            { id: 9, desc: 'Monitor personal operativo' },
                                            { id: 10, desc: 'Monitor entidades financieras' },
                                            { id: 11, desc: 'Reporte de quejas' }];
          }else if(val == '6'){
            this.subReportesArray = new Array();
            this.subReportesArray = [{ id: 12, desc: 'Top 100 pensionados con más de un préstamo' }, 
                                              { id: 13, desc: 'Top 100 Personal operativo con más Trámites' },
                                              { id: 14, desc: '100 Lugares con más Trámites por Adscripción del Pensionado' }, 
                                              { id: 15, desc: 'Detalle de préstamo' }];
          }
          this.idTipoReporte = Number(val);
          this.flagDescarga = false;
          break;
        default:
          break;    
      }     
    });
  }

  onChangesSubReporte(){
    this.formGroup.get('subTipoReporte').valueChanges.subscribe((val: string) => {
      this.tituloReporte = "";
      const validators = [Validators.required];

      this.formGroup.get('fechaDesde').setValidators(validators);
      this.formGroup.get('fechaDesde').updateValueAndValidity();

      this.formGroup.get('fechaHasta').setValidators(validators);
      this.formGroup.get('fechaHasta').updateValueAndValidity();
      
      this.asignarNombreReporte(val);

      $(function(){
        $("#fechas").show();
      });
    });
  }

  generarReporte() {
    if(this.flagTemp){
      return;
    }
    this.modalService.open("carga");
    let form = this.formGroup.value;
    this.model.reporte = form;
    this.model.reporte.curpUsuario = this.model.persona.curp;
    this.model.reporte.sesion = this.model.sesion == null? 0 : this.model.sesion;
    if(this.model.reporte.tipoReporte == 5){
      this.model.reporte.tipoReporte = this.model.reporte.subTipoReporte;
    }
    console.log(">>>formValue", JSON.stringify(this.model.reporte));
    this.reporteService.generarReporte(this.model.reporte).subscribe(response => this.setDocumento(response));
  }

  setDocumento(response: Reporte) {
    console.log("Reporte Response: ", response);
    if(response.archivoXLSX != null){
      let size;
      this.base64ToBlob(response.archivoXLSX, size);
    }else{
      this.model.reporte.reporteRs = response.reporteRs;
      this.flagDescarga = true;
      this.docConciliacion = new Documento();
      this.docConciliacion = { ...response.docConciliacion };
      this.docConciliacion.tipoDocumentoEnum = TipoDocumento.REPORTE_CONCILIACION_XLSX;
      this.docInconsistencias = new Documento();
      this.docInconsistencias = { ...response.docInconsistencias };
      this.docInconsistencias.tipoDocumentoEnum = TipoDocumento.REPORTE_INCONSISTENCIAS_TXT;
      this.idTipoReporte = response.reporteRs.reporte.tipoReporte.id;
      if (this.idTipoReporte == 3) {
        console.log("Documentos",response.reporteRs.reporteDocumentos);
        for (var value of response.reporteRs.reporteDocumentos) {
          if (value.documento.tipoDocumento == 19) {
            this.doc19 = value.documento;
            this.doc19.tipoDocumentoEnum = TipoDocumento.REPORTE_DESCU_EMIT_EF_XLSX;
          }
          if (value.documento.tipoDocumento == 20) {
            this.doc20 = value.documento;
            this.doc20.tipoDocumentoEnum = TipoDocumento.REPORTE_DESCU_EMIT_DEL_XLSX;
          }
          if (value.documento.tipoDocumento == 21) {
            this.doc21 = value.documento;
            this.doc21.tipoDocumentoEnum = TipoDocumento.REPORTE_INCONSISTENCIAS_PRESTAMOS_TXT;
          }
          if (value.documento.tipoDocumento == 22) {
            this.doc22 = value.documento;
            this.doc22.tipoDocumentoEnum = TipoDocumento.REPORTE_INCONSISTENCIAS_DESCUENTOS_TXT;
          }
        }
  
      }
    }
    this.formGroup.reset();
    $(function(){
      $("#fechas").hide();
    });
    window.scroll(0, 0);
    this.modalService.close("carga");
  }

  confirmarAutorizar() {
    this.modalService.open("autorizar");
  }

  cancelarAutorizar() {
    this.modalService.close("autorizar");
  }

  autorizar() {
    this.modalService.close("autorizar");

    this.modalService.open("carga");

    console.log("Authorizar Reporte", this.model.reporte.reporteRs);
    this.model.reporte.reporteRs.reporte.estadoReporte.id = 2;
    this.reporteService.autorizarReporteConciliacion(this.model.reporte).subscribe(response => {
      this.modalService.close("carga");

      this.router.navigate(['/operadorIMSS/home'],
        {
          queryParams:
          {
            accion: "reporte",
            status: "autorizado",
          }

        });
    });
  }

  prepararFechas(){
    var self = this;
    const meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
      const datepickerConf = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        dateFormat: 'dd/mm/yy',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: meses,
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        showButtonPanel: true,
        maxDate: "0"
      };
      var dateFormat = 'dd/mm/yy',
      from = $("#fechaDesde")
        .datepicker(datepickerConf)
        .on("change", function () {
          to.datepicker("option", "minDate", getDate(this));
        }),
      to = $("#fechaHasta").datepicker(datepickerConf)
        .on("change", function () {
          from.datepicker("option", "maxDate", getDate(this));
        });
    
    function getDate(element) {
      var date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value);
      } catch (error) {
        date = null;
      }
      return date;
    }
   
    $("#fechaDesde").on('change', function(){
      self.formGroup.get('fechaDesde').setValue($(this).val());
    });
   
    $("#fechaHasta").on('change', function(){
      self.formGroup.get('fechaHasta').setValue($(this).val());
    });  
  }

  base64ToBlob(b64Data, sliceSize=512) {
    let byteCharacters = atob(b64Data); //data.file there
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
    
        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    let downloadLink = document.createElement('a');
    let nombreArchivo = 
    downloadLink.href = window.URL.createObjectURL(new Blob(byteArrays, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
    downloadLink.setAttribute('download', this.nombreReporte);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    }

    asignarNombreReporte(tipoReporte: string){
      this.flagTemp = false;
      switch(tipoReporte){
        case '5':
          this.tituloReporte = "Préstamos autorizados por entidad financiera";
          this.nombreReporte = "PrestamosAutorizadosPorEF";
          break;
        case '6':
          this.tituloReporte = "Préstamos por entidad financiera";
          this.nombreReporte = "PrestamosPorEF";
          break;
        case '7':
          this.tituloReporte = "Préstamos por delegación";
          this.nombreReporte = "PrestamosPorDelegacion";
          break;
        case '8':
          this.tituloReporte = "Monitor pensionados";
          this.nombreReporte = "MonitorPensionados";
          this.flagTemp = true;
          break;
        case '9':
          this.tituloReporte = "Monitor personal operativo";
          this.nombreReporte = "MonitorPersonalOperativo";
          this.flagTemp = true;
          break;
        case '10':
          this.tituloReporte = "Monitor entidades financieras";
          this.nombreReporte = "MonitorEntidadesFin";
          this.flagTemp = true;
          break;
        case '11':
          this.tituloReporte = "Reporte de quejas";
          this.nombreReporte = "Quejas";
          this.flagTemp = true;
          break;
        case '12':
          this.tituloReporte = "Top 100 pensionados con más de un préstamo";
          this.nombreReporte = "Top100Pensionados";
          this.flagTemp = true;
          break;
        case '13':
          this.tituloReporte = "Top 100 Personal operativo con más Trámites";
          this.nombreReporte = "Top100PersonalOperativo";
          this.flagTemp = true;
          break;
        case '14':
          this.tituloReporte = "100 Lugares con más Trámites por Adscripción del Pensionado";
          this.nombreReporte = "100TramitesAdscripcion";
          this.flagTemp = true;
          break;
        case '15':
          this.tituloReporte = "Detalle de préstamo";
          this.nombreReporte = "DetallePrestamo";
          this.flagTemp = true;
          break;
        default:
          this.tituloReporte = "Reporte";
          break;
      }
    }

}
