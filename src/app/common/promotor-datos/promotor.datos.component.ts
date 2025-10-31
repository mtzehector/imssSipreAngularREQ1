// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { PromotorService } from '../services/promotor.service';
import { PersonaEF } from '../domain/persona.ef';
import { BaseComponent } from '../base.component';
import { Persona } from '../persona';
import { EntidadFinanciera } from '../domain/entidad.financiera';


@Component({
  selector: 'app-promotor-datos',
  templateUrl: './promotor.datos.component.html'
})
export class PromotorDatosComponent extends BaseComponent implements OnInit {

  personaEF: PersonaEF;

  // @Input
  // personaEFInput: PersonaEF;

  constructor(protected data: DataService, private route: ActivatedRoute, private promotorService: PromotorService) {
    super(data);
  }

  ngOnInit() {
    this.model = this.data.model;
    this.personaEF = this.model.personaEF;
    // if(this.personaEF.id ==null){
    //   this.personaEF = new PersonaEF();
    // // this.promotorService.getPromotor(this.model.persona.curp).subscribe((personaEF: PersonaEF) => this.validarPromotor(personaEF));
    // }
    
  }

  // validarPromotor(personaEF: PersonaEF){

  //   //console.log(".-.-.-.-..-.-.-",personaEF);
  //   this.personaEF.nombre = personaEF.nombre;
  //   this.personaEF.primerApellido = personaEF.primerApellido;
  //   this.personaEF.segundoApellido = personaEF.segundoApellido;
  //   this.personaEF.nss = personaEF.nss;
  //   this.personaEF.curp = personaEF.curp;
  //   this.personaEF.numEmpleado = personaEF.numEmpleado;
  //   this.personaEF.entidadFinanciera = new EntidadFinanciera();
  //   this.personaEF.entidadFinanciera.nombreComercial = personaEF.entidadFinanciera.nombreComercial;
  //   this.personaEF.entidadFinanciera.id = personaEF.entidadFinanciera.id;
    
    
  //   this.personaEF.entidadFinanciera.nombreComercial = personaEF.entidadFinanciera.nombreComercial;
  //   this.personaEF.entidadFinanciera.razonSocial = personaEF.entidadFinanciera.razonSocial;
  //   //console.log(personaEF.entidadFinanciera.razonSocial);
  //   this.personaEF.entidadFinanciera.paginaWeb = personaEF.entidadFinanciera.paginaWeb;   
  //   this.personaEF.entidadFinanciera.numTelefono = personaEF.entidadFinanciera.numTelefono;
  //   this.personaEF.entidadFinanciera.id = personaEF.entidadFinanciera.id;
   
  //   this.personaEF.entidadFinanciera.paginaWeb=personaEF.entidadFinanciera.paginaWeb;
  //   this.model.personaEF = { ...this.personaEF };
  //   //console.log("modelo.-.-.-.--.");
  //   //console.log(this.data.model);

  
  //  }
}


