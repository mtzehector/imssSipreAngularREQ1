// TODO: Feature Componetized like CrisisCenter
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { BaseComponent } from 'src/app/common/base.component';
import { Prestamo } from 'src/app/common/domain/prestamo';
import { CapturaCondicionesService } from 'src/app/common/services/captura.condiciones.service';
import { CapturaCondiciones } from 'src/app/common/domain/captura.condiciones';
import { Oferta } from 'src/app/common/domain/oferta';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { CapacidadCredito } from 'src/app/common/domain/capacidad.credito';
import { PromotorService } from 'src/app/common/services/promotor.service';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import { EntidadFinanciera } from 'src/app/common/domain/entidad.financiera';
import { Plazo } from 'src/app/common/domain/plazo';
import { Model } from 'src/app/model';
import { PlazoCondiciones } from 'src/app/common/domain/plazo.condiciones';
import { PlazoCondicionesService } from 'src/app/common/services/plazo.condiciones.service';
import { Router } from '@angular/router';
import { CapacidadCreditComponent } from 'src/app/common/capacidad-credito/capacidad.credit.component';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { ModalService } from 'src/app/common/modal-Services';



@Component({
  selector: 'app-condiciones-prestamo',
  templateUrl: './condiciones.prestamo.component.html'
})
export class CondicionesPrestamoComponent  extends BaseComponent implements OnInit {
 
  cartaInstruccion:CartaInstruccion;
  capturaCondiciones:CapturaCondiciones;
  resumenSimulacion: CartaInstruccion;
  personaEF:PersonaEF;
  plazosCondiciones:PlazoCondiciones [] = [];
  seleccionPlazo:PlazoCondiciones= new PlazoCondiciones();
  model: Model;
  capacidadCredito: CapacidadCredito = new CapacidadCredito();
  mesanjeUtil: Mensaje=new Mensaje();
  avisoCheck: number;
  idx:number;
  rol:string;


  constructor(protected data: DataService,
    private promotorService: PromotorService,
    private router: Router,
    private plazoCondicionesService: PlazoCondicionesService,
    private modalService: ModalService,
    private capturaCondicionesService:CapturaCondicionesService) {
    super(data);   
   }
   
   ngOnInit() {
    this.cartaInstruccion=this.model.cartaInstruccion;
    this.capturaCondiciones = new CapturaCondiciones();
    this.capturaCondiciones.condicionesPrestamo=  this.model.prestamo.oferta;
    this.capturaCondiciones.capacidadCredito={...this.cartaInstruccion.capacidadCredito};

    this.plazoCondicionesService.getPlazo(this.model.personaEF.entidadFinanciera.id).subscribe((response : PlazoCondiciones[])=>this.plazoCondicionSelect(response));
     this.rol="promotor";
   }

   plazoCondicionSelect(response : PlazoCondiciones [])
   {
     this.plazosCondiciones = [];
    for(var i=0;i<response.length;i++){
      this.plazosCondiciones[i] = {...response[i]}; 
      //console.log(">>> " , i);     
    }    
    
   }


    enviaCapturaCondiciones(){
     /*   if(this.model.simulacion.prestamo.oferta.plazo.descripcion.length === 0  ){
           this.mesanjeUtil.mensaje = "Debe seleccionar un plazo";
           this.mesanjeUtil.level = "danger";
           
           return;
         }else{*/

            this.modalService.close("custom-modal-captura");
    this.capturaCondiciones.condicionesPrestamo.plazo.numPlazo = this.seleccionPlazo.plazo.numPlazo;
    this.capturaCondiciones.catEntidadFinanciera = this.seleccionPlazo.cat;
    this.capacidadCredito.impCapacidadFija = this.capturaCondiciones.capacidadCredito.impCapacidadFija;
    this.capacidadCredito.impCapacidadVariable = this.capturaCondiciones.capacidadCredito.impCapacidadVariable;
    this.capacidadCredito.impCapacidadTotal = this.capturaCondiciones.capacidadCredito.impCapacidadTotal;
    this.capturaCondiciones.capacidadCredito = this.capacidadCredito;
    this.modalService.open("carga");
    //console.log(">>>>enviaCapturaCondiciones " , JSON.stringify(this.capturaCondiciones));
    this.capturaCondicionesService.getCapturaCondiciones(this.capturaCondiciones)
     .subscribe((capturaCondiciones:CapturaCondiciones)=> this.validarCapturaCondiciones () );
         //}
   

  }

  validarCapturaCondiciones(){
    this.modalService.close("carga");
    this.cartaInstruccion.oferta = new Oferta();
    this.cartaInstruccion.oferta.id = this.seleccionPlazo.id;
    this.cartaInstruccion.oferta.cat = this.capturaCondiciones.condicionesPrestamo.cat;
    this.cartaInstruccion.oferta.plazo = {...this.seleccionPlazo.plazo};
    this.cartaInstruccion.oferta.tasaAnual = String(this.seleccionPlazo.tasaAnual);
    this.cartaInstruccion.prestamo = new Prestamo();
    this.cartaInstruccion.prestamo.idOferta = this.cartaInstruccion.oferta.id;
    this.cartaInstruccion.prestamo.impTotalPagar = Number(this.capturaCondiciones.condicionesPrestamo.importeTotal);
    this.cartaInstruccion.prestamo.monto = this.capturaCondiciones.condicionesPrestamo.monto;
    this.cartaInstruccion.prestamo.impDescNomina =Number (this.capturaCondiciones.condicionesPrestamo.descuentoMensual);   
    this.model.cartaInstruccion=this.cartaInstruccion;
    //console.log(">>>>validarCapturaCondiciones " , JSON.stringify(this.model.cartaInstruccion));
    this.router.navigate(['/promotor/cartaCapInforme', {}]);
   
  } 


  cambio()
  {
     this.mesanjeUtil.mensaje = "";
      this.mesanjeUtil.level = "";
  }

     openModal() {
        //console.log("Plazo >>>", JSON.stringify(this.seleccionPlazo.plazo));
        //console.log("Plazos >>>", JSON.stringify(this.capturaCondiciones.condicionesPrestamo.descuentoMensual));
        
        if(this.seleccionPlazo.plazo.descripcion != "" && this.seleccionPlazo.plazo.descripcion != undefined )
        {
            this.modalService.open("custom-modal-captura");
        }
        else 
        {
          this.data.model.mensaje.mensaje= "Seleccione un plazo";
          this.data.model.mensaje.level= "danger";

        }
        
    
    }

 closeModal() {
        this.modalService.close("custom-modal-captura");
    }

}

