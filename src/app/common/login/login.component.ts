import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Model } from "../../model";
import { PensionesResponse } from "../domain/pensiones.response";
import { Pension } from "../domain/pension";
import { DataService } from "../../data.service";
import { PersonaService } from "../../common/services/persona.service";
import { PromotorService } from '../services/promotor.service';
import { Persona } from "../../common/domain/persona";
import { PensionadoService } from '../services/pensionado.service';
import { BaseComponent } from 'src/app/common/base.component';
import { EntidadFederativa } from '../domain/entidad.federativa';
import { PensionadoResponse } from '../domain/pensionado.response';
import { Delegacion } from '../domain/delegacion';
import { PersonaEF } from '../domain/persona.ef';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  value: string;
  model: Model;

  constructor(public authService: AuthService,
    protected data: DataService,
    private router: Router,
    private personaService: PersonaService,
    private pensionadoService: PensionadoService,
    private promotorService: PromotorService) {
    super(data);
  }
  ngOnInit() {
this.model.persona.curp='';

  }
  login() {    
    this.personaService.getPersona(this.model.persona.curp).subscribe((persona: Persona) => this.validarLogin(persona));
  }

  validarLogin(persona: Persona) {

    this.model.persona = { ...persona };

    if (this.model.persona.nombre !== null) {
      switch (this.value) {

        case 'pensionado':
          this.pensionadoService.getPensiones(this.model.persona.curp)
            .subscribe((response: PensionesResponse) => this.validarPensiones(response));
          //console.log(this.value);
          break;
        case 'promotor':
          //console.log(">>>>>Persona: " + this.value);
          //console.log(">>>>>Datos Persona: " + JSON.stringify(this.model.persona));
          //console.log(">>>>> this.model.user.numNss: " + JSON.stringify(this.model.user.numNss));
          this.promotorService.getPromotor(this.model.persona.curp)
            .subscribe((personaEF: PersonaEF) => this.validarPersonaEF(personaEF));
          break;
          case 'adminEF':
            //console.log(">>>>>Persona: " + this.value);
            //console.log(">>>>>Datos Persona: " + JSON.stringify(this.model.persona));
            this.promotorService.getPromotor(this.model.persona.curp)
              .subscribe((personaEF: PersonaEF) => this.validarPersonaEF(personaEF));
            break;
        case 'operadorEF':
          this.router.navigate(['/operadorEF/home', {}]);
          break;
        case 'operadorIMSS':
          this.router.navigate(['/operadorIMSS/home', {}]);
          break;
      }
    }
  }

  validarPensiones(response: PensionesResponse) {
    //console.log(this.model.pensionado);
    this.model.pensiones = [];
    for (var i = 0; i < response.pensiones.length; i++) {
      this.model.pensiones[i] = { ...response.pensiones[i] };
    }

    switch (response.pensiones.length) {
      case 0:
        this.model.mensaje = { level: "warning", mensaje: "No existen Pensiones para está CURP", id: "0" };
        break;
      case 1:
       this.establecePensionado(response.pensiones[0] );
        this.router.navigate(['/pensionado/home', {}]);
        break;
      default:
        this.router.navigate(['/pensionado/seleccionarGrupoFamiliar', {}]);
    }
  }
  
  validarPensionado(response:PensionadoResponse){
    
    this.model.pensionado.cuentaClabe= response.numClabe;
    this.model.pensionado.curp= response.cveCurp;
    this.model.pensionado.claveDelegacion = response.cveDelegacion;
    this.model.pensionado.delegacion= new Delegacion();
    this.model.pensionado.delegacion.id = parseInt(response.cveDelegacion);
    this.model.pensionado.delegacion.desDelegacion =  response.descDelegacion;
    this.model.pensionado.subDelegacion=response.cveSudelegacion;  
    this.model.pensionado.entidadFederativa = new EntidadFederativa();
    this.model.pensionado.entidadFederativa.cveEntidadFederativa = response.cveEntidadFederativa;
    this.model.pensionado.entidadFederativa.descEntidadFederativa = response.descEntidadFederativa;    
    this.model.pensionado.fechaNacimiento = response.fecNacimiento;    
    this.model.pensionado.sexo = response.sexo;
    
  }

  establecePensionado(pension:Pension){
    this.model.pensionado.nss = pension.idNss;
    this.model.pensionado.grupoFamiliar= pension.idGrupoFamiliar;
    this.pensionadoService.readPensionado(this.model.pensionado.nss, this.model.pensionado.grupoFamiliar)
    .subscribe((response: PensionadoResponse) => this.validarPensionado(response));
    
    
    
  }

  validarPersonaEF(personaEF: PersonaEF){
    //console.log(">>>>>Datos PersonaEF: " + JSON.stringify(personaEF));
    this.model.personaEF.nombre = personaEF.nombre;
    this.model.personaEF.primerApellido = personaEF.primerApellido;
    this.model.personaEF.segundoApellido = personaEF.segundoApellido;
    this.model.personaEF.nss = personaEF.nss;
    this.model.personaEF.curp = personaEF.curp;
    this.model.personaEF.numEmpleado = personaEF.numEmpleado;
    this.model.personaEF.idPersonaEF = personaEF.idPersonaEF;
    this.model.personaEF.entidadFinanciera = {...personaEF.entidadFinanciera};
  
    //console.log(">>>>>Datos PersonaEF: " + JSON.stringify(this.model.personaEF.entidadFinanciera));
    this.router.navigate(['/promotor/home', {}]);
   }

   login1(){
     
   
    this.router.navigate(['/promotor/home', {}]);
   }

  
}
