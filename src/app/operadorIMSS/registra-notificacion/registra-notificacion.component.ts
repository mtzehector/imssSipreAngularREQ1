import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { Documento, Mensaje, Notificacion, TipoNotificacion } from "src/app/common/domain";
import { NotificacionPrestamo } from '../../common/domain/notificacion.prestamo';
import { PrestamoAdjunto } from '../../common/domain/prestamo.adjunto';
import { DataService, ModalService, RegistrarEntidadFinancieraService, RegistrarNotificacionService, CatalogoService } from 'src/app/common/services';
import { validadorFechaActual } from './validadores/ValidadorUxFechas';
import { NotificacionModel } from 'src/app/common/domain/notificacion.model';
import { Prestamo } from 'src/app/common/domain/prestamo.not';
import { Persona } from 'src/app/common/persona';
//variables para jQuery
declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-registra-notificacion',
  templateUrl: './registra-notificacion.component.html',
  styleUrls: ['./registra-notificacion.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class RegistraNotificacionComponent extends BaseComponent implements OnInit {

  formGroupNot: FormGroup;
  verPrestamo: boolean = false;
  notificaionPrestamo: NotificacionPrestamo;
  regexFolio: string = '^[0-9]{11}-[0-9]{1}$';
  public idborrarPrestamo: any;
  public model: Model;
  public catalogoEntidadFinanciera: any;
  public catalogoTipoNotificacion: any;
  public catalogoSubTipoNotificacion: any;
  public tempSubTipoNotificacion: any[];
  public renderRequerimiento: boolean;
  public validateFechaVencimiento: boolean;
  public fechaActal:string;
  public fecVencimiento: string;
  public rol: string;
  public renderDesc: boolean;
  notificacion: Notificacion = new Notificacion();
  NotificacionBusqueda = new Notificacion();
  mensajeExito: Mensaje = new Mensaje();
  folioRequerido: boolean;
  documentoNotificacion: Documento[] = [];
  
  constructor(private formBuilder: FormBuilder, private router: Router, public location: Location, private modalService: ModalService, protected data: DataService, private registrarEntidadFinancieraService: RegistrarEntidadFinancieraService, private registrarNotificacionService: RegistrarNotificacionService, private catalogoService: CatalogoService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.mensajeExito.mensaje = "";
    this.mensajeExito.level = "";
    this.rol = "operadorIMSS";
    this.model.flagDocsNotificacion = true;
    this.buildForm(); 
    this.notificaionPrestamo = new NotificacionPrestamo();
    this.consultarCatalogos();
    this.onChanges();
    this.prepararFechaVencimiento();
    this.renderRequerimiento = true;
    this.renderDesc = true;
  }

  private buildForm() {
    this.formGroupNot = this.formBuilder.group({
      entidadFinanciera: ['', [Validators.required]],
      tipoNotificacion: ['', [Validators.required]],
      tipoSecundario: ['', [Validators.required]],
      fechaVencimiento: [''],
      desc: ['', [Validators.required]],
      req: ['', [Validators.required]],
      folio: ['', [Validators.minLength(13), Validators.pattern(this.regexFolio)]]
    });
  }

  private consultarCatalogos() {
    this.catalogoService.consultarEntidadFinanciera().subscribe((response: any) => {
        this.catalogoEntidadFinanciera = response;
      });

    this.catalogoService.consultarTipoNotificacion().subscribe((response: any) => {
        this.catalogoTipoNotificacion = response;
        this.catalogoTipoNotificacion.splice(1, 1);
      });

    this.catalogoService.consultarSubTipoNotificacion().subscribe((response: any) => {
        this.catalogoSubTipoNotificacion = response;
      });

    this.tempSubTipoNotificacion = new Array();
  }

  onChanges(): void {
    this.formGroupNot.get('tipoNotificacion').valueChanges.subscribe((val: string) => {

      this.formGroupNot.get('tipoSecundario').setValue("-1");
      this.formGroupNot.get('tipoSecundario').clearValidators();
      this.formGroupNot.get('tipoSecundario').updateValueAndValidity();
      const validators = [Validators.required];

      switch (Number(val)) {
        case TipoNotificacion.SANCION.id:
        case TipoNotificacion.CONCILIACION.id:
          this.formGroupNot.get('req').setValue("");
          this.formGroupNot.get('req').clearValidators();
          this.formGroupNot.get('req').updateValueAndValidity();

          this.formGroupNot.get('fechaVencimiento').setValue("");
          this.formGroupNot.get('fechaVencimiento').clearValidators();
          this.formGroupNot.get('fechaVencimiento').updateValueAndValidity();

          this.formGroupNot.get('desc').setValue("");
          this.formGroupNot.get('desc').updateValueAndValidity();
          $(function(){
            $("#fv").hide();
          });
          this.renderRequerimiento = false;
          this.renderDesc = false;
          break;

        case TipoNotificacion.AVISO.id:
          this.formGroupNot.get('req').setValue("");
          this.formGroupNot.get('req').clearValidators();
          this.formGroupNot.get('req').updateValueAndValidity();

          this.formGroupNot.get('fechaVencimiento').setValue("");
          this.formGroupNot.get('fechaVencimiento').clearValidators();
          this.formGroupNot.get('fechaVencimiento').updateValueAndValidity();
          
          this.formGroupNot.get('desc').setValue("");
          this.formGroupNot.get('desc').updateValueAndValidity();
          $(function(){
            $("#fv").show();
          });
          this.renderRequerimiento = false;
          this.renderDesc = true;
          break;

        case TipoNotificacion.QUEJA.id:
        case TipoNotificacion.REQUERIMIENTO.id:
          this.formGroupNot.get('req').setValue("");
          this.formGroupNot.get('req').setValidators(validators);
          this.formGroupNot.get('req').updateValueAndValidity();
          
          //this.formGroupNot.get('fechaVencimiento').setValue("");
          this.formGroupNot.get('fechaVencimiento').setValidators(validators);
          this.formGroupNot.get('fechaVencimiento').updateValueAndValidity();
          
          this.formGroupNot.get('desc').setValue("");        
          this.formGroupNot.get('desc').updateValueAndValidity();
          $(function(){
            $("#fv").show();
          });
          this.renderRequerimiento = true;
          this.renderDesc = true;
          break;

        default:   
          break;

      }
      this.tempSubTipoNotificacion.length = 0;
      this.catalogoSubTipoNotificacion.forEach(element => {
        if (element.cveTipoNotificacion == val) {
          this.tempSubTipoNotificacion.push(element);
        }
      });
    });
  }

  guardarCambios() {
    this.modalService.open("carga");
    const form = this.formGroupNot.value;
    this.notificacion.cveEntidadFinanciera = form.entidadFinanciera;
    this.notificacion.cveTipoNotificacion = form.tipoNotificacion;
    this.notificacion.cveSubTipoNotificacion = form.tipoSecundario;
    this.notificacion.descNotificacion = form.desc;
    this.notificacion.fecVencimiento = this.fecVencimiento;
    this.notificacion.reqNotificacion = form.req;
    this.model.notificacionModel.notificacion = this.notificacion;
    this.model.notificacionModel.notificacion.notPrestamo = {...this.notificaionPrestamo};
    this.documentoNotificacion = this.model.documentosNot;
    this.model.notificacionModel.docNotificacionList = this.documentoNotificacion;
    this.model.notificacionModel.curpUsuario = this.model.persona.curp;
    console.log(">>>GUARDAR", JSON.stringify(this.model.notificacionModel));
    this.registrarNotificacionService.registrarNotificacion(this.model.notificacionModel).subscribe(response => this.setNotificacion(response));
  }

  setNotificacion(response: NotificacionModel){
    console.log(">>>RESPONSE NOT", JSON.stringify(response));
    this.modalService.close("carga");
    this.model.flagNotMsj = true;
    this.model.documentosNot = new Array();
    this.model.flagDocsNotificacion = false;
    this.model.folioNotificacion = response.notificacion.folioNotificacion;
    this.router.navigate(['/operadorIMSS/consultarNotificacion']);
  }

  buscarPrestamo() {
    if(this.formGroupNot.get('folio').value != null && this.formGroupNot.get('folio').value != ""){
      this.folioRequerido = false;
      this.verPrestamo = false;  
      this.modalService.open("carga");
      this.registrarNotificacionService.consultarFolioPrestamo(this.formGroupNot.get('folio').value, this.formGroupNot.get('entidadFinanciera').value)
      .subscribe(response => this.setResponseBusqueda(response)); 
    }else{
      this.folioRequerido = true;
    }
  }

  setResponseBusqueda(response: Prestamo){
    console.log(">>>BUSUEDA ", JSON.stringify(response));
    let prestamo: Prestamo = new Prestamo();
    let pensionado: Persona = new Persona();
    let notPrestamo: NotificacionPrestamo =  new NotificacionPrestamo();
    let notificacion: Notificacion = new Notificacion();
    prestamo.curp = response.curp;
    prestamo.desPlazo = response.desPlazo;
    prestamo.desTipoCredito = response.desTipoCredito;
    prestamo.fechaAlta = response.fechaAlta;
    prestamo.impMontoSol = response.impMontoSol;
    prestamo.cat = response.cat;
    prestamo.nss = response.nss;
    prestamo.id = response.id;
    prestamo.cveSolicitud = response.cveSolicitud;
    prestamo.fechaVencimiento = response.fechaVencimiento;
    prestamo.numSolicitud = response.numSolicitud;
    prestamo.desEstadoPrestamo = response.desEstadoPrestamo;
    pensionado.nombre = response.pensionado.nombre;
    pensionado.primerApellido = response.pensionado.primerApellido;
    pensionado.segundoApellido = response.pensionado.segundoApellido;
    prestamo.pensionado = pensionado;
    notPrestamo.prestamoResponse = prestamo;
    notificacion.notPrestamo = notPrestamo;
    this.model.notificacionModel.notificacion = notificacion;
    console.log(">>>BUSUEDA ", JSON.stringify(this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse));
    this.modalService.close("carga");
    this.verPrestamo = true;
  }

  limpiarPrestamo() {
    this.verPrestamo = false;
    this.formGroupNot.get('folio').setValue(null);
  }

  agregarPrestamo() {
    let prestamo: Prestamo = new Prestamo();
    let pensionado: Persona = new Persona();
    prestamo.numSolicitud = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.numSolicitud;
    pensionado.nombre = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.pensionado.nombre
    pensionado.primerApellido = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.pensionado.primerApellido;
    pensionado.segundoApellido = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.pensionado.segundoApellido;
    prestamo.pensionado = pensionado;
    prestamo.desPlazo = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.desPlazo;
    prestamo.id = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.id;
    prestamo.cveSolicitud = this.model.notificacionModel.notificacion.notPrestamo.prestamoResponse.cveSolicitud;
    this.notificaionPrestamo.prestamoList.push(prestamo);
    console.log(">>>PRESTAMO AGREGADOS ", JSON.stringify(this.notificaionPrestamo.prestamoList));
    this.limpiarPrestamo(); 
  }

  openModalPrestamo(id: number) {
    this.idborrarPrestamo = id;
    this.modalService.open("eliminarPrestamo");
  }

  closeModalPrestamo() {
    this.modalService.close("eliminarPrestamo");
    this.idborrarPrestamo = '';
  }

  closeModalNoExistenDatos(){
    this.modalService.close("noExistenDatos");
  }

  borrarPrestamo(id: number) {
    const index = this.notificaionPrestamo.prestamoList.findIndex(x => x.id === id);
    if (index !== undefined) {
      this.notificaionPrestamo.prestamoList.splice(index, 1);
    }
    console.log(">>>PRESTAMO AGREGADOS ", JSON.stringify(this.notificaionPrestamo.prestamoList));
    //this.notificaionPrestamo.prestamos.sort(this.ordenarArrayEntidad("entidadFederativaJ"));
    //this.closeModal('eliminarCondicion');
    this.closeModalPrestamo();
    this.model.mensaje.mensaje = "El préstamo ha sido eliminado con éxito.";
    this.model.mensaje.level = "success";

  }
  formatFechaActual(){
    var fechaActual = new Date();

    var day = fechaActual.getDate();
    var month = fechaActual.getMonth()+1;
    var year = fechaActual.getFullYear();
    var mesString="";
    if(month < 9){
      mesString='0'+month.toString();
    }else{
      mesString=month.toString();
    }
    
    this.fechaActal  = day + '-' + mesString + '-' + year;    

  }

  prepararFechaVencimiento(){
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
      minDate: +1
    };
    
    $( "#fechaVencimiento" ).datepicker(datepickerConf);
   
    $("#fechaVencimiento").on('change', function () {
      self.fecVencimiento = $(this).val();
    });

    $("#fechaVencimiento").on('change', function () {
      self.formGroupNot.get('fechaVencimiento').setValue($(this).val()); 
    });
    
  }

  onChangesFechaVen(): void {
    this.formGroupNot.get('fechaVencimiento').valueChanges.subscribe((val: string) => {
      
     console.log(">>>>>>fecha", val);
      this.formGroupNot.get('fechaVencimiento').clearValidators();
      this.formGroupNot.get('fechaVencimiento').updateValueAndValidity();
    });
  }

}
