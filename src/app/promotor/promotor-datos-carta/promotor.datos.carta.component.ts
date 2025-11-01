// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from 'src/app/common/base.component';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import { PromotorService } from 'src/app/common/services/promotor.service';



@Component({
  selector: 'app-promotor-datos-carta',
  templateUrl: './promotor.datos.carta.component.html'
})
export class PromotorDatosCartaComponent extends BaseComponent implements OnInit {

  personaEF: PersonaEF;

  constructor(protected data: DataService, private route: ActivatedRoute, private promotorService: PromotorService) {
    super(data);
  }

  ngOnInit() {
    this.model = this.data.model;
    this.personaEF = this.model.personaEF;
    if(this.personaEF.idPersonaEF ==null){
      this.personaEF = new PersonaEF();
    this.promotorService.getPromotorCurpNss(this.model.persona.curp, this.model.user.numNss.toString()).subscribe((personaEF: PersonaEF) => this.validarPromotor(personaEF));
    }
    
  }

  validarPromotor(personaEF: PersonaEF){
    this.personaEF.nombre = personaEF.nombre;
    this.personaEF.primerApellido = personaEF.primerApellido;
    this.personaEF.segundoApellido = personaEF.segundoApellido;
    this.personaEF.nss = personaEF.nss;
    this.personaEF.curp = personaEF.curp;
    this.personaEF.numEmpleado = personaEF.numEmpleado;
    this.personaEF.telefono = personaEF.telefono;
    // this.data.model.personaEF.entidadFinanciera.nombreComercial = personaEF.entidadFinanciera.nombreComercial;
    // this.data.model.personaEF.entidadFinanciera.razonSocial = personaEF.entidadFinanciera.razonSocial;
    // this.data.model.personaEF.entidadFinanciera.paginaWeb = personaEF.entidadFinanciera.paginaWeb;   
    // this.data.model.personaEF.entidadFinanciera.numTelefono = personaEF.entidadFinanciera.numTelefono;
    // this.data.model.personaEF.entidadFinanciera.id = personaEF.entidadFinanciera.id;
    // this.data.model.personaEF.entidadFinanciera.paginaWeb=personaEF.entidadFinanciera.paginaWeb;
    this.data.model.personaEF =  {...personaEF};
    //console.log("OOOOO ", JSON.stringify(this.data.model.personaEF));
   }
}


