// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { EntidadFinancieraService } from 'src/app/common/services/entidad.financiera.service';
import { EntidadFinanciera } from 'src/app/common/domain/entidad.financiera';
@Component({
  selector: 'app-pro-entidad-financiera',
  templateUrl: './pro.entidad.financiera.component.html'
})
export class ProEntidadFinancieraComponent implements OnInit {
  
  model : Model;

  constructor(private data: DataService,private route: ActivatedRoute, private entidadFiancieraService: EntidadFinancieraService) { }

  ngOnInit() {
    this.model = this.data.model;
  }
  
  assembleEntidadFinanciera( response : EntidadFinanciera ){
        
    this.data.model.entidadFinanciera = response;
    
    /*
    this.data.model.entidadFinanciera = {beneficios:this.data.model.entidadFinanciera.beneficios,
      razonSocial:this.data.model.entidadFinanciera.razonSocial,idEntidadFinanciera:this.data.model.entidadFinanciera.idEntidadFinanciera,
      nombreComercial:this.data.model.entidadFinanciera.nombreComercial,paginaWeb:this.data.model.entidadFinanciera.paginaWeb,tasaAnual:this.data.model.entidadFinanciera.tasaAnual,telefono:this.data.model.entidadFinanciera.telefono}; */
  }
  
}
