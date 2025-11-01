// TODO: Feature Componetized like CrisisCenter
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../../data.service";
import { MensajeService } from 'src/app/common/services/mensaje.service';
import { PromotorService } from 'src/app/common/services/promotor.service';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { BaseComponent } from 'src/app/common/base.component';
import { ResumenCartaCapacidadService } from 'src/app/common/services/resumen.carta.capacidad.service';
import { Solicitud } from 'src/app/common/domain/solicitud';
import { CartaInstruccion } from 'src/app/common/domain/carta.instruccion';
import { PersonaEF } from 'src/app/common/domain/persona.ef';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';
import { Prestamo } from '../../common/domain/prestamo';
import { ModalService } from 'src/app/common/modal-Services';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';

@Component({
  selector: 'app-carta-capacidad-informe',
  templateUrl: './carta.capacidad.informe.component.html'
})
export class CartaCapacidadInformeComponent extends BaseComponent implements OnInit {
  solicitud: Solicitud;
  cartaInstruccion: CartaInstruccion;
  promotor: PersonaEF;
  nuevo: Prestamo;
  rol:String;
  prestamoRecuperacion?: PrestamoRecuperacion = new PrestamoRecuperacion();


  constructor(protected data: DataService, private route: ActivatedRoute, 
    private mensajeService:MensajeService,
    private router: Router,
    private modalService:ModalService,
    private resumenCartaCapacidadService:ResumenCartaCapacidadService,
    private promotorService: PromotorService
    ) { 
      super(data);
    }

  ngOnInit() {
    //console.log(">>>Entro al ngoninit>>>>>");
    this.promotor = new PersonaEF();
    this.cartaInstruccion =this.model.cartaInstruccion;
   /* this.mensajeService.getMessage("").subscribe((mensaje : Mensaje) => this.data.model.mensaje = {...mensaje} );  
    this.mensajeService.getMessage(this.data.model.mensaje.id).subscribe((mensaje : Mensaje) => this.data.model.mensaje = {...mensaje} );  */
    this.data.model.mensaje = { mensaje: this.data.model.mensaje.mensaje,id:"" ,level:""};
    //this.modalService.open("carga");
    this.resumenCartaCapacidadService.getCartaCapacidadInforme(this.cartaInstruccion.solicitud)
    .subscribe((cartaInstruccion:CartaInstruccion)=> this.validarResumenCapacidad (cartaInstruccion) );
    
    this.nuevo = new Prestamo();
    this.nuevo.tipoCreditoEnum = TipoCredito.NUEVO;

    this.rol="promotor";
}

 validarResumenCapacidad(cartaInstruccion){
  //console.log(">>>validarResumenCapacidadantes() " + JSON.stringify(cartaInstruccion));
   this.modalService.close("carga");
  this.cartaInstruccion.solicitud = {...cartaInstruccion.solicitud};
  this.cartaInstruccion.pensionado ={...cartaInstruccion.pensionado};
  this.cartaInstruccion.prestamoRecuperacion = {...cartaInstruccion.prestamoRecuperacion};
  this.cartaInstruccion.capacidadCredito ={...cartaInstruccion.capacidadCredito};
  this.cartaInstruccion.capacidadCredito.tipoCredito=TipoCredito.NUEVO;
  this.cartaInstruccion.persona = {...cartaInstruccion.persona};
  this.model.cartaInstruccion = this.cartaInstruccion; 
  this.prestamoRecuperacion=this.cartaInstruccion.prestamoRecuperacion;

  //console.log(">>>validarResumenCapacidad() " + JSON.stringify(this.model.cartaInstruccion));
 }

continuarCaptura(){
  this.modalService.open("carga");
  this.promotorService.getPromotorCurpNss(this.model.persona.curp, this.model.user.numNss.toString())
  .subscribe((personaEF:PersonaEF )=> this.validaPromotor(personaEF));
}

validaPromotor(personaEF:PersonaEF){
  this.modalService.close("carga");
  this.promotor ={...personaEF};
  this.model.personaEF = this.promotor;
  //console.log(">>>validaPromotor " + JSON.stringify(this.model.personaEF));
   this.router.navigate(['/promotor/condicionesPrestamos', {}]);  
}

}
