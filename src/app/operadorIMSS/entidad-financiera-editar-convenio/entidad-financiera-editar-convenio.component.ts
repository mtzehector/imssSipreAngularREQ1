import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { DataService } from 'src/app/common/services';
// Declaramos las variables para jQuery
declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-entidad-financiera-editar-convenio',
  templateUrl: './entidad-financiera-editar-convenio.component.html',
  styleUrls: []
})
export class EntidadFinancieraEditarConvenioComponent extends BaseComponent implements OnInit {

  public model: Model;
  @Input()
  public registrarForm: any;
  public es: any
  flat: any;
  sinConvenio: number;
  flagChecked: boolean;
//  checkInicio: boolean;
  modifica: boolean = false;

  constructor(protected data: DataService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    
    this.sinConvenio = this.model.registrarEntidadFinanciera.sinConvenio == null? 1: this.model.registrarEntidadFinanciera.sinConvenio;
//    if(this.model.registrarEntidadFinanciera.sinConvenio == null){
//      this.modifica = false;
//    }else{
//      this.modifica = true;
//    }
    if(this.sinConvenio == 1){
      this.flagChecked = false; 
//      this.checkInicio = false;
    }else{
      this.flagChecked = true;
//      this.flagChecked = true;
    }
    
  if(this.model.enabledModificarEntidad){
    this.flat = true; 
  }

    if (this.model.registrarEntidadFinanciera.fecFirmaContra !== undefined && 
      this.model.registrarEntidadFinanciera.fecFirmaContra!==null ){
        this.model.registrarEntidadFinanciera.fecFirmaContra=this.model.registrarEntidadFinanciera.fecFirmaContra.substring(0,10);
        this.model.registrarEntidadFinanciera.fecIniFirmaContra=this.model.registrarEntidadFinanciera.fecIniFirmaContra.substring(0,10);

      }
    
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
      from = $("#fecFirmaContra")
        .datepicker(datepickerConf)
        .on("change", function () {
          to.datepicker("option", "minDate", getDate(this));
        }),
      to = $("#fecIniFirmaContra").datepicker(datepickerConf)
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

    $("#fecFirmaContra").on('change', function () {
      self.model.registrarEntidadFinanciera.fecFirmaContra = $(this).val();
    });

    $("#fecIniFirmaContra").on('change', function () {
      self.model.registrarEntidadFinanciera.fecIniFirmaContra = $(this).val();
});




  }
  cheked() {
    console.log("inicio funcion cheked", this.sinConvenio);
    this.sinConvenio = this.sinConvenio !== 1 ? 1 : 0;
    this.flagChecked = this.flagChecked == false ? true: false; 
    this.model.registrarEntidadFinanciera.sinConvenio = this.sinConvenio;
    if(this.flagChecked){
      this.model.registrarEntidadFinanciera.fecFirmaContra = '';
      this.model.registrarEntidadFinanciera.fecIniFirmaContra='';
    }
    console.log("fin funcion cheked", this.sinConvenio, this.model.registrarEntidadFinanciera.sinConvenio);
  }

}
