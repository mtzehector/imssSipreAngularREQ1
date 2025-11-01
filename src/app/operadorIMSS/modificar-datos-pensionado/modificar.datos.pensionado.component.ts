import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Model } from "src/app/model";
import { DataService, ModalService } from 'src/app/common/services';
import { RegistroPensionadoService } from '../../common/services/registroPensionado.service';
import { ActualizarDatosPensionado } from './model/ActualizarDatosPensionado';
import { Pensionado } from './model/Pensionado';
import { BusquedaPensionado } from './model/BusquedaPensionado';
import { PensionadoResponse } from 'src/app/common/domain';

@Component({
    selector: 'app-modificar-datos-pensionado',
    templateUrl: './modificar.datos.pensionado.component.html',
    styleUrls: ['../../common/css/tarjetas-estilos-base.css']
  })
export class ModificarDatosPensionado extends BaseComponent implements OnInit {
    //public model: Model;
    rol: String;
    // formBusqueda: FormGroup;
    // formDatosPensionado: FormGroup;
    // cambiosGuardado: boolean = false;
    // personaResponse: Pensionado = new Pensionado();
    // busquedaPensionado: BusquedaPensionado = new BusquedaPensionado();
    //regexCorreo: string = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
    // regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
    // actualizacionDatosPensionado: ActualizarDatosPensionado = new ActualizarDatosPensionado();

    constructor(
        // public router: Router,
        protected data: DataService,
        // private formBuilder: FormBuilder,
        // private modalService: ModalService,
        // private registroService: RegistroPensionadoService
      ) {
        super(data);
        // this.model = data.model;
      }
    
    ngOnInit() {
        this.rol = "operadorIMSS";
        this.data.model.rol = "operadorIMSS";
        // this.formBusqueda = this.formBuilder.group({
        //   curp: ['', [Validators.maxLength(18), Validators.minLength(18), Validators.pattern("^[a-zA-Z0-9]*$")]],
        //   nss: ['', [Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*$')]]
        // });
        // this.formDatosPensionado = this.formBuilder.group({
        //   numTelefono: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*$')]],
        //   correo: ['', [Validators.pattern(this.regexCorreo)]],
        //   numTelefonoMovil: ['', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*$')]]
        // });
        
        // this.actualizacionDatosPensionado.pensionadoDatosAnteriores = new Pensionado();
        // this.actualizacionDatosPensionado.pensionadoDatosNuevos = new Pensionado();
    }

    // formBusquedaIsValid(){
    //   let valido = false;
    //   if(this.formBusqueda.invalid){
    //     valido = false;
    //   }else{
    //     if(this.formBusqueda.get('nss').value.length > 0 
    //       || this.formBusqueda.get('curp').value.length > 0)
    //       valido = true;
    //   }
    //   return valido;
    // }

    // formDatosPensionadoIsValid(){
    //   let valido = false;
    //   if(this.formDatosPensionado.invalid){
    //     valido = false;
    //   }else{
    //     let datosPensionado = this.actualizacionDatosPensionado.pensionadoDatosAnteriores;
    //     if(this.formDatosPensionado.get('correo').value.length == 0 && this.formDatosPensionado.get('numTelefono').value.length == 0
    //       && this.formDatosPensionado.get('numTelefonoMovil').value.length == 0)
    //       valido = false;
    //     if((this.formDatosPensionado.get('correo').value != datosPensionado.correoElectronico && this.formDatosPensionado.get('correo').value.length > 0) 
    //         || (this.formDatosPensionado.get('numTelefono').value != datosPensionado.telLocal && this.formDatosPensionado.get('numTelefono').value.length > 0) 
    //         || (this.formDatosPensionado.get('numTelefonoMovil').value != datosPensionado.telCelular && this.formDatosPensionado.get('numTelefonoMovil').value > 0))
    //       valido = true;
    //   }
    //   return valido;
    // }

    // buscarPensionado(){
    //   this.modalService.open("carga");
    //   let registro = this.formBusqueda.value;
    //   console.log(registro);
    //   if(registro.curp.length == 0) registro.curp = "NaN";
    //   if(registro.nss.length == 0) registro.nss = "NaN";
    //   this.registroService.consultarPensionado(registro.curp, registro.nss).subscribe(response => {
    //     if(!response.cvePersona){
    //       this.model.mensaje.mensaje = "<strong>Los datos ingresados</strong> no tienen registro de Pensionado. Favor de verificar.";
    //       this.model.mensaje.level = "danger";
    //     }else{
    //       this.personaResponse.cvePersona = response.cvePersona;
    //       this.personaResponse.nombre = response.nombre;
    //       this.personaResponse.primerApellido = response.primerApellido;
    //       this.personaResponse.segundoApellido = response.segundoApellido;
    //       this.personaResponse.cveCurp = response.cveCurp;
    //       this.personaResponse.numNss = response.numNss;
    //       this.personaResponse.correoElectronico = response.correoElectronico;
    //       this.personaResponse.telCelular = response.telCelular == 'null'? '' : response.telCelular;
    //       this.personaResponse.telLocal = response.telLocal == 'null'? '' :  response.telLocal;

    //       this.actualizacionDatosPensionado.pensionadoDatosAnteriores = response;
    //       if(this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telCelular == 'null') 
    //         this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telCelular = '';
    //         if(this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telLocal == 'null') 
    //         this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telLocal = '';
    //     }
    //     this.modalService.close("carga");
    //   });
      
    // }

    // actualizarDatos(){
    //   this.modalService.open("carga");
      
    //   if(this.personaResponse.correoElectronico.length > 0 
    //     && this.actualizacionDatosPensionado.pensionadoDatosAnteriores.correoElectronico != this.personaResponse.correoElectronico){
    //       this.actualizacionDatosPensionado.pensionadoDatosNuevos.correoElectronico = this.personaResponse.correoElectronico;
    //   }

    //   if(this.personaResponse.telLocal.length > 0 
    //     && this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telLocal != this.personaResponse.telLocal){
    //       this.actualizacionDatosPensionado.pensionadoDatosNuevos.telLocal = this.personaResponse.telLocal;
    //     }

    //   if(this.personaResponse.telCelular.length > 0 
    //     && this.actualizacionDatosPensionado.pensionadoDatosAnteriores.telCelular != this.personaResponse.telCelular){
    //       this.actualizacionDatosPensionado.pensionadoDatosNuevos.telCelular = this.personaResponse.telCelular;
    //   }

    //   this.actualizacionDatosPensionado.curp = this.data.model.persona.curp;
    //   this.actualizacionDatosPensionado.numSesion = this.data.model.sesion;
    //   console.log(this.actualizacionDatosPensionado);

    //   this.registroService.actualizarDatosPensionado(this.actualizacionDatosPensionado).subscribe(response => {
    //     console.log(response);
    //     this.limpiarVista();
    //     this.modalService.close("carga");
    //     this.model.mensaje.mensaje = "<strong>Los datos del Pensionado</strong> han sido modificados con éxito.";
    //     this.model.mensaje.level = "success";
    //   });
    // }

    // limpiarVista(){
    //   this.personaResponse = new Pensionado();
    //   this.formBusqueda.get('curp').setValue('');
    //   this.formBusqueda.get('nss').setValue('');
    // }
}