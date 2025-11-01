import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { TitularService } from '../../common/services/titular.service';
import { Pensionado } from '../../common/domain/pensionado';
import { Pension } from '../../common/domain/pension';
import { TitularGrupoRequest } from 'src/app/common/domain/titular.grupo.request';
import { ModalService } from 'src/app/common/modal-Services';
import { BaseComponent } from 'src/app/common/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PensionadoService } from 'src/app/common/services';
import { PensionadoResponse } from 'src/app/common/domain/pensionado.response';
import { Delegacion } from 'src/app/common/domain/delegacion';
import { EntidadFederativa } from 'src/app/common/domain/entidad.federativa';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-seleccionar-grupo-familiar',
  templateUrl: './seleccionar.grupo.familiar.component.html',
  styleUrls: ['./seleccionar.grupo.familiar.component.css']
})
export class SeleccionarGrupoFamiliarComponent extends BaseComponent implements OnInit {
  
  model : Model;    
  pensiones : Pension[];
  formGroup: FormGroup;
  rol: string;
  

  constructor(
    protected data: DataService, 
    private router: Router, 
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private pensionadoService: PensionadoService,
    public authService: AuthService) {
      super(data);
      this.model = this.data.model;
  }
 
  ngOnInit() {
    this.rol = 'pensionado';
    this.model.rol = this.rol;
    this.pensiones = this.model.pensiones;
    this.crearFormulario();
  }

  crearFormulario(){
    this.formGroup = this.formBuilder.group({
      checkNss:['', [Validators.required]]
    });
  }

  consultarPensionado(){
    this.modalService.open("carga");
    let formValue = this.formGroup.value;
    console.log(">>>>NSS",  JSON.stringify(formValue.checkNss));
    let nss = formValue.checkNss;
    let grupoFamiliar = "";
    this.pensiones.forEach(e => {
      if (e.idNss == nss) {
        grupoFamiliar = e.idGrupoFamiliar;
      }
    });
    this.pensionadoService.readPensionado(nss, grupoFamiliar)
      .subscribe((response: PensionadoResponse) => this.setPensionado(response));
  }

  setPensionado(response: PensionadoResponse){
    this.model.pensionado.cuentaClabe = response.numClabe;
    this.model.pensionado.curp = response.cveCurp;
    this.model.pensionado.nss = response.idNss;
    this.model.pensionado.grupoFamiliar = response.idGrupoFamiliar;
    this.model.pensionado.claveDelegacion = response.cveDelegacion;
    this.model.pensionado.delegacion = new Delegacion();
    this.model.pensionado.delegacion.id = parseInt(response.cveDelegacion);
    this.model.pensionado.delegacion.numDelegacion = response.cveDelegacion;
    this.model.pensionado.delegacion.cveDelegacion = response.cveDelegacion;
    this.model.pensionado.delegacion.desDelegacion = response.descDelegacion;
    this.model.pensionado.delegacion.descDelegacion = response.descDelegacion;
    this.model.pensionado.subDelegacion = response.cveSudelegacion;
    this.model.pensionado.entidadFederativa = new EntidadFederativa();
    this.model.pensionado.entidadFederativa.cveEntidadFederativa = response.cveEntidadFederativa;
    this.model.pensionado.entidadFederativa.descEntidadFederativa = response.descEntidadFederativa;
    if(response.fecNacimiento != null && response.fecNacimiento != ''){
      this.model.pensionado.fechaNacimiento = response.fecNacimiento;
    }else{
      this.model.pensionado.fechaNacimiento = this.authService.getUser().fecNacimiento;
    }
    this.model.pensionado.sexo = response.sexo;
    this.modalService.close("carga");
    this.router.navigate(['/pensionado/home']);
  }
  
}
