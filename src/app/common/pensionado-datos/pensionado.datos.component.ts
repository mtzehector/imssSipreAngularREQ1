// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../model';
import { DataService } from '../../data.service';
import { BaseComponent } from '../base.component';
import { Persona } from '../persona';
import { Pensionado } from '../domain/pensionado';


@Component({
  selector: 'app-pensionado-datos',
  templateUrl: './pensionado.datos.component.html'
})
export class PensionadoDatosComponent extends BaseComponent implements OnInit {
  
  persona : Persona;
  pensionado : Pensionado;
  tipoCredito : string = "NUEVO";
  creditoRenovacion : boolean =false;
  creditoCompraCartera : boolean = false;
  creditoNuevo : boolean =false;
  constructor(protected data: DataService, private route: ActivatedRoute) {
    super(data);
   }

  ngOnInit() {
    this.persona =this.model.persona;
    this.pensionado = this.model.pensionado;  
    this.pensionado.tipoPension=this.model.pensiones[0].desTipoPension;
    this.validarMejorOfertaEF();
  }


  async validarMejorOfertaEF(){
    if(this.model.prestamosRecuperacionArreglo != null && this.model.prestamosRecuperacionArreglo.length > 0 ){
      //console.log(">>>validarMejorOpcionEF ", JSON.stringify(this.model.prestamosRecuperacionArreglo));
      for(var i of this.model.prestamosRecuperacionArreglo){
          if(this.data.model.ofertaDatos.idSipre === i.numEntidadFinanciera){
               this.creditoRenovacion = true;
          }else{ 
             this.creditoCompraCartera = true;
                    
             }
              
          }
      
    }else{
     this.creditoNuevo = true;
    }
    
    //SE VALIDA EL TIPO DE CREDITO 
    if(this.creditoNuevo){
      this.tipoCredito = "NUEVO";
    }else{
      if(this.creditoRenovacion && this.creditoCompraCartera){
              this.tipoCredito = "MIXTO";

      }else if(this.creditoRenovacion){
                     this.tipoCredito = "RENOVACIÓN";

      }else if(this.creditoCompraCartera){
                     this.tipoCredito = "COMPRA CARTERA";

      }else{
                     this.tipoCredito = "NUEVO";

      }
    }
    
  }

}
