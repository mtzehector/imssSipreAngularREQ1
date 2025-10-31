import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Model } from "src/app/model";
import { AutorizarService, BitacoraService, DataService, ModalService } from 'src/app/common/services';
import { RegistroPensionadoService } from '../../common/services/registroPensionado.service';
import { ActualizarDatosPensionado } from './model/ActualizarDatosPensionado';
import { Pensionado } from './model/Pensionado';
import { BusquedaPensionado } from './model/BusquedaPensionado';
import { Page } from 'src/app/common/domain';
import { CartaInstruccionRequest } from '../domain/carta.instruccion.request';
import { BitacoraPensionadoRequest } from '../historico-datos-pensionado/model/BitacoraPensionadoRequest';
import { BitacoraPensionado } from '../historico-datos-pensionado/model/BitacoraPensionado';

@Component({
  selector: 'app-modificacion-datos-pensionado',
  templateUrl: './modificacion-datos-pensionado.component.html',
  styles: []
})
export class ModificacionDatosPensionadoComponent extends BaseComponent implements OnInit {

  public model: Model;
  @Input() rol: string;
  @Input() cveEntidadF: any;
  //flagRol: number;
  formBusqueda: FormGroup;
  formDatosPensionado: FormGroup;
  cambiosGuardado: boolean = false;
  personaResponse: Pensionado = new Pensionado();
  busquedaPensionado: BusquedaPensionado = new BusquedaPensionado();
  //regexCorreo: string = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
  regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  actualizacionDatosPensionado: ActualizarDatosPensionado = new ActualizarDatosPensionado();
  
  nssValido: boolean;
  activoBusqueda: boolean;
  nssForm: string = "";
  estadoSolicitudForm: string = "0";
  cartaInstruccionRequest: CartaInstruccionRequest = new CartaInstruccionRequest();

  existenEstados: boolean = false;

  public bitacoraPensionadoRequest: BitacoraPensionadoRequest = new BitacoraPensionadoRequest();
  public pageBitacoraPensionado: Page<BitacoraPensionado> = new Page<BitacoraPensionado>();
  public bitacoraPensionadoList: BitacoraPensionado[];

  constructor(public router: Router,
      protected data: DataService,
      private formBuilder: FormBuilder,
      private modalService: ModalService,
      private registroService: RegistroPensionadoService,
      private autorizarService: AutorizarService,
      private bitacoraService: BitacoraService
    ) {
      super(data);
      this.model = data.model;
    }
  
  ngOnInit() {
/*
    switch (this.rol) {
      case 'adminEF':
        this.flagRol = 2;
        break;
      case 'promotor':
        this.flagRol = 3;
        break;
      case 'operadorEF':
        this.flagRol = 4
        break;
      case 'administradorIMSS':
          this.flagRol = 5;
          break;
      case 'operadorIMSS':
        this.flagRol = 6;
        break;
      case 'adminEFSinConvenio':
        this.flagRol = 10;
        break;
    }
*/
      // this.rol = "operadorIMSS";
      //this.data.model.rol = "operadorIMSS";
      
      this.formBusqueda = this.formBuilder.group({
        curp: ['', [Validators.maxLength(18), Validators.minLength(18), Validators.pattern("^[a-zA-Z0-9]*$")]],
        nss: ['', [Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*$')]]
      });
      this.formDatosPensionado = this.formBuilder.group({
        numTelefono: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*$')]],
        correo: ['', [Validators.pattern(this.regexCorreo)]],
        numTelefonoMovil: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*$')]]
      });
      
      this.actualizacionDatosPensionado.pensionadoDatosAnteriores = new Pensionado();
      this.actualizacionDatosPensionado.pensionadoDatosNuevos = new Pensionado();
  }

  formBusquedaIsValid(){
    let valido = false;
    if(this.formBusqueda.invalid){
      valido = false;
    }else{
      if(this.formBusqueda.get('nss').value.length > 0 
        || this.formBusqueda.get('curp').value.length > 0)
        valido = true;
    }
    return valido;
  }

  formDatosPensionadoIsValid(){
    let valido = false;
    if(this.formDatosPensionado.invalid){
      valido = false;
    }else{
      let datosPensionado = this.actualizacionDatosPensionado.pensionadoDatosAnteriores;
      if(this.formDatosPensionado.get('correo').value.length == 0 && this.formDatosPensionado.get('numTelefono').value.length == 0
        && this.formDatosPensionado.get('numTelefonoMovil').value.length == 0)
        valido = false;
      if((this.formDatosPensionado.get('correo').value != datosPensionado.correoElectronico && this.formDatosPensionado.get('correo').value.length > 0) 
          || (this.formDatosPensionado.get('numTelefono').value != datosPensionado.telLocal && this.formDatosPensionado.get('numTelefono').value.length > 0) 
          || (this.formDatosPensionado.get('numTelefonoMovil').value != datosPensionado.telCelular && this.formDatosPensionado.get('numTelefonoMovil').value > 0))
        valido = true;
    }
    return valido;
  }

  buscarPensionado(isBuscar: boolean){
    this.existenEstados = false;
    this.modalService.open("carga");
    let registro = this.formBusqueda.value;
    if(registro.curp.length == 0) registro.curp = "NaN";
    if(registro.nss.length == 0) registro.nss = "NaN";
    this.registroService.consultarPensionado(registro.curp, registro.nss).subscribe(
      response => {
        if(!response.cvePersona){
          this.actualizacionDatosPensionado.pensionadoDatosAnteriores = new Pensionado();
          this.actualizacionDatosPensionado.pensionadoDatosNuevos = new Pensionado();
          this.personaResponse = new Pensionado();
          this.bitacoraPensionadoList = null;
          this.model.mensaje.mensaje = "<strong>Los datos ingresados</strong> no tienen registro de Pensionado. Favor de verificar.";
          this.model.mensaje.level = "danger";
        } else {
          this.personaResponse.cvePersona = response.cvePersona;
          this.personaResponse.nombre = response.nombre;
          this.personaResponse.primerApellido = response.primerApellido;
          this.personaResponse.segundoApellido = response.segundoApellido;
          this.personaResponse.cveCurp = response.cveCurp;
          this.personaResponse.numNss = response.numNss;
          this.personaResponse.correoElectronico = response.correoElectronico;
          this.personaResponse.telCelular = response.telCelular == 'null'? '' : response.telCelular;
          this.personaResponse.telLocal = response.telLocal == 'null'? '' :  response.telLocal;

          this.actualizacionDatosPensionado.pensionadoDatosAnteriores = response;
          this.actualizacionDatosPensionado.pensionadoDatosNuevos = new Pensionado();
          this.buscarBitacoraPensionado(1, false);
          if(this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telCelular == 'null') 
            this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telCelular = '';
          if(this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telLocal == 'null') 
            this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telLocal = '';
          if (this.rol == 'operadorEF')
            this.consultarExistenEstados(this.personaResponse.cveCurp, this.personaResponse.numNss);
        }
        
        if (!isBuscar) {
          this.model.mensaje.mensaje = "<strong>Los datos del Pensionado</strong> han sido modificados con éxito.";
          this.model.mensaje.level = "success";
        }

        this.modalService.close("carga");
      },
      error => {
        this.modalService.close("carga");
      }
    );
  }

  actualizarDatos(){
    this.modalService.open("carga");
    
    if(this.personaResponse.correoElectronico.length > 0 
      && this.actualizacionDatosPensionado.pensionadoDatosAnteriores.correoElectronico != this.personaResponse.correoElectronico){
        this.actualizacionDatosPensionado.pensionadoDatosNuevos.correoElectronico = this.personaResponse.correoElectronico;
    }

    if(this.personaResponse.telLocal.length > 0 
      && this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telLocal != this.personaResponse.telLocal){
        this.actualizacionDatosPensionado.pensionadoDatosNuevos.telLocal = this.personaResponse.telLocal;
      }

    if(this.personaResponse.telCelular.length > 0 
      && this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telCelular != this.personaResponse.telCelular){
        this.actualizacionDatosPensionado.pensionadoDatosNuevos.telCelular = this.personaResponse.telCelular;
    }

    this.actualizacionDatosPensionado.curp = this.data.model.persona.curp;
    this.actualizacionDatosPensionado.numSesion = this.data.model.sesion;

    this.registroService.actualizarDatosPensionado(this.actualizacionDatosPensionado).subscribe(
      response => {
        //this.limpiarVista();
        this.modalService.close("carga");
        this.buscarPensionado(false);
      },
      error => {
        this.modalService.close("carga");
      }
    );
  }

  limpiarVista(){
    this.personaResponse = new Pensionado();
    this.formBusqueda.get('curp').setValue('');
    this.formBusqueda.get('nss').setValue('');

  }

  consultarExistenEstados(curp: string, nss: string) {
    let idsEstados: number[] = [1,2,3,4,5,15];
    this.autorizarService.getExistenEstados(curp, nss, idsEstados).subscribe(( existen:boolean ) => {
        this.existenEstados = existen;
        if(this.existenEstados) {
          this.model.mensaje.mensaje = "No se pueden modificar los datos del pensionado.";
          this.model.mensaje.level = "danger";
        }
      }
    );
  }

  
//   validarEstado() {
//     console.log("Prestamo en recuperación 2:");
//     this.model.camposBusqueda = new CartaInstruccionRequest();
//     this.nssValido = true;
//     this.activoBusqueda = true;
    
//     //****************************     VALIDACIONES NSS    **************************************/
//     if (this.nssForm !== "" && this.nssForm !== undefined) {
//       const pattern = new RegExp("^[0-9]*$");
//       if (!(this.nssForm.length == 11)) {
//         this.nssValido = false;
//       }
//       if (!pattern.test(this.nssForm)) {
//         this.nssValido = false;
//       }
//     }
// /*
//     if (this.cartaInstruccionRequest.model.inicio != "" && this.cartaInstruccionRequest.model.inicio != undefined) {
//       //dia = (this.cartaInstruccionRequest.model.inicio).substring(0, 2);
//       //mes = (this.cartaInstruccionRequest.model.inicio).substring(3, 5);
//       //anio = (this.cartaInstruccionRequest.model.inicio).substring(6, 10);

//       //this.cartaInstruccionRequest.model.inicio = dia + "/" + mes + "/" + anio + " 00:00:00";
//       this.cartaInstruccionRequest.model.inicio = this.obtenerFormatoFecha(this.cartaInstruccionRequest.model.inicio);
//       this.activoBusquedafecha = false;
//     }

//     if (this.cartaInstruccionRequest.model.fin != "" && this.cartaInstruccionRequest.model.fin != undefined) {
//       //dia = (this.cartaInstruccionRequest.model.fin).substring(0, 2);
//       //mes = (this.cartaInstruccionRequest.model.fin).substring(3, 5);
//       //anio = (this.cartaInstruccionRequest.model.fin).substring(6, 10);
//       //this.cartaInstruccionRequest.model.fin = dia + "/" + mes + "/" + anio + " 00:00:00";
//       this.cartaInstruccionRequest.model.fin = this.obtenerFormatoFecha(this.cartaInstruccionRequest.model.fin);
//       this.activoBusquedafecha = false;
//     }
// */
//     // VALIDA LOS VALORES INGRESADO PARA EJECUTAR LA CONSULTA DE LOS PRESTAMOS.
//     if ( (this.nssForm !== "" && this.nssForm !== undefined && this.nssValido == true) ) {

//       this.model.mensaje.mensaje = "";
//       this.model.mensaje.level = "";
//       this.cartaInstruccionRequest.page = 1;
//       if (this.rol == 'adminEFSinConvenio'){
//         this.cartaInstruccionRequest.model.estadoSolicitud = '5';
//         this.model.camposBusqueda.model.estadoSolicitud = this.cartaInstruccionRequest.model.estadoSolicitud;
//       }else{
//         this.cartaInstruccionRequest.model.estadoSolicitud = this.estadoSolicitudForm;
//         this.model.camposBusqueda.model.estadoSolicitud = this.cartaInstruccionRequest.model.estadoSolicitud;
//       }
//       this.cartaInstruccionRequest.model.nss = this.nssForm;
//       this.model.camposBusqueda.model.nss = this.nssForm;
      
//       // this.cartaInstruccionRequest.model.folio = this.folioForm;
//       // this.model.camposBusqueda.model.folio = this.folioForm;
//       this.cartaInstruccionRequest.model.cveEntidadFinanciera = this.cveEntidadF;
//       this.model.camposBusqueda.model.cveEntidadFinanciera = this.cveEntidadF;
//       this.cartaInstruccionRequest.model.flagRol = this.flagRol;
//       this.model.camposBusqueda.model.flagRol = this.flagRol;
//       //this.cartaInstruccionRequest.model.cvePromotor = this.flagRol == 1 ? Number(this.model.personaEF.idPersonaEF) : null;
//       this.cartaInstruccionRequest.model.cvePromotor = this.flagRol == 3 ? Number(this.model.personaEF.idPersonaEF) : null;
//       this.model.camposBusqueda.model.cvePromotor = this.cartaInstruccionRequest.model.cvePromotor;
//       this.cartaInstruccionRequest.model.flagExcel = false;
//       this.model.camposBusqueda.model.flagExcel = false;
//       this.modalService.open("carga");
//       console.log("Prestamo en recuperación 2:" + JSON.stringify(this.cartaInstruccionRequest.model));
//       this.autorizarService.getBusquedaAutorizadorEF(this.cartaInstruccionRequest)
//         .subscribe(
//           (response: Page<CartaInstruccion>) => {this.busquedaSolicitudAutorizar(response);
//           console.log(response);
//           }
//         );

//       // this.cartaInstruccionRequest.model.inicio = this.fechaInicio;
//       // this.cartaInstruccionRequest.model.fin = this.fechaFin;

//     } else {
//       this.activoBusqueda = false;
//       this.activoBusquedafecha = false;
//       this.model.mensaje.mensaje = "Debes ingresar por lo menos un criterio de búsqueda sea NSS, Folio, Estado, o un rango de fechas.";
//       this.model.mensaje.level = "danger";
//       this.cartaInstruccionRequest.model.inicio = this.fechaInicio;
//       this.cartaInstruccionRequest.model.fin = this.fechaFin;
//     }
//   }

  buscarBitacoraPensionado(page: number, openCloseModal: boolean ) {
    if (openCloseModal) 
      this.modalService.open("carga");

    this.bitacoraPensionadoList = null;
    this.bitacoraPensionadoRequest.page = page;
    this.bitacoraPensionadoRequest.model.cvePersona = this.personaResponse.cvePersona;
    this.bitacoraPensionadoRequest.pageSize = 20;

    this.bitacoraService.buscarBitacoraPensionadoPorCvePersona(this.bitacoraPensionadoRequest)
      .subscribe(
        (response: Page<BitacoraPensionado>) => {
          this.setBusquedaBitacoraPensionado(response);
          if (openCloseModal)
            this.modalService.close("carga");
        }, 
        error => {
          if (openCloseModal)
            this.modalService.close("carga");
        }
      );
    this.pageBitacoraPensionado = new Page<BitacoraPensionado>();
    
    this.pageBitacoraPensionado.number = page - 1;
    this.pageBitacoraPensionado.prepare();
  }

  public setBusquedaBitacoraPensionado(response: Page<BitacoraPensionado>) {
    this.pageBitacoraPensionado.init(response);
    this.bitacoraPensionadoRequest.totalElements = response.totalElements;
    this.bitacoraPensionadoRequest.totalPages = response.totalPages;
    this.pageBitacoraPensionado.content = response.content;
    this.bitacoraPensionadoList = response.content;
  }

  navegarHome() {
    switch (this.rol) {
      case 'adminEF':
        this.model.iniciaBusquedaFolio = false;
        this.router.navigate(['/administradorEF/home', {}]);
        break;
      case 'operadorEF':
        this.model.iniciaBusquedaFolio = false;
        this.router.navigate(['/operadorEF/home', {}]);
        break;
      case 'operadorIMSS':
        this.model.iniciaBusquedaFolio = false;
        this.router.navigate(['/operadorIMSS/home', {}]);
        break;
      default:
        break;
    }
  }

}
