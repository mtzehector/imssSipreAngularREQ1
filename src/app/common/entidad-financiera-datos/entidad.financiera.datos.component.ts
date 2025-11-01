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
EntidadFinanciera
@Component({
  selector: 'app-entidad-financiera-datos',
  templateUrl: './entidad.financiera.datos.component.html'
})
export class EntidadFinancieraDatosComponent implements OnInit {
  
  model : Model;
  imgEFUrl : string='';
  constructor(private data: DataService,private route: ActivatedRoute, private entidadFiancieraService: EntidadFinancieraService) { }

  ngOnInit() {
    this.model = this.data.model;
    
    let request : SeleccionFinancieraRequest = new SeleccionFinancieraRequest();
    
    request.page=1;
    request.model = new ModelRequest();
    if(this.model.ofertaDatos.imgB64 != null){
      this.imgEFUrl = 'data:image/png;base64,' + this.model.ofertaDatos.imgB64;
    }else{
      this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
    }
    
    
    //FIX: Valor en duro de la entidad financiera
    //this.entidadFiancieraService
    //  .findById( 2 )
    //  .subscribe((response: EntidadFinanciera) => this.assembleEntidadFinanciera( response ) );
  }
  
  assembleEntidadFinanciera( response : EntidadFinanciera ){
        
    this.data.model.entidadFinanciera = response;
    
    /*
    this.data.model.entidadFinanciera = {beneficios:this.data.model.entidadFinanciera.beneficios,
      razonSocial:this.data.model.entidadFinanciera.razonSocial,idEntidadFinanciera:this.data.model.entidadFinanciera.idEntidadFinanciera,
      nombreComercial:this.data.model.entidadFinanciera.nombreComercial,paginaWeb:this.data.model.entidadFinanciera.paginaWeb,tasaAnual:this.data.model.entidadFinanciera.tasaAnual,telefono:this.data.model.entidadFinanciera.telefono}; */
  }
  
}
