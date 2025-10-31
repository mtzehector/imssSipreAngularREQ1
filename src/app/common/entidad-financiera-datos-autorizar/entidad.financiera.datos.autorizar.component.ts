// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { EntidadFinancieraService } from '../services/entidad.financiera.service';
import { EntidadFinanciera } from '../domain/entidad.financiera';
import { SeleccionFinancieraRequest } from 'src/app/common/domain/seleccionfinanciera.request';
import { ModelRequest } from 'src/app/common/domain/model.request';
import {EntidadFinancieraResponse} from '../domain/entidadfinanciera.response';
import { CartaInstruccion } from '../domain';

EntidadFinanciera
@Component({
  selector: 'app-entidad-financiera-datos-autorizar',
  templateUrl: './entidad.financiera.datos.autorizar.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class EntidadFinancieraAutorizarDatosComponent implements OnInit {
  
  model : Model;
  imgEFUrl: string ='';
  resumenSimulacion: CartaInstruccion;

  constructor(private data: DataService,private route: ActivatedRoute, private entidadFiancieraService: EntidadFinancieraService) { }

  ngOnInit() {
    this.model = this.data.model;
    this.resumenSimulacion = this.model.cartaInstruccion;

    let request : SeleccionFinancieraRequest = new SeleccionFinancieraRequest();
    
    request.page=1;
    request.model = new ModelRequest();
    
    //FIX : Dato en duro
    //this.entidadFiancieraService
    //  .findById( 2 )
    //  .subscribe((response: EntidadFinanciera) => this.assembleEntidadFinanciera( response ) );
    if (this.resumenSimulacion.oferta.entidadFinanciera.imgB64 == null) {
      this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
    }else{
      this.imgEFUrl = 'data:image/png;base64,' + this.model.informeCartaInstruccion.personaEf.entidadFinanciera.imgB64;
    }
    

  }
  
  assembleEntidadFinanciera( response : EntidadFinanciera ){
        
    this.data.model.entidadFinanciera = response;
    
    /*
    this.data.model.entidadFinanciera = {beneficios:this.data.model.entidadFinanciera.beneficios,
      razonSocial:this.data.model.entidadFinanciera.razonSocial,idEntidadFinanciera:this.data.model.entidadFinanciera.idEntidadFinanciera,
      nombreComercial:this.data.model.entidadFinanciera.nombreComercial,paginaWeb:this.data.model.entidadFinanciera.paginaWeb,tasaAnual:this.data.model.entidadFinanciera.tasaAnual,telefono:this.data.model.entidadFinanciera.telefono}; */
  }
}
