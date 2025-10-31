import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Model } from 'src/app/model';
import { BaseComponent } from 'src/app/common/base.component';
import { PensionadoService } from 'src/app/common/services/pensionado.service';
import { CapacidadCreditoService } from 'src/app/common/services/capacidad.credito.service';
import { CapacidadCredito } from 'src/app/common/domain/capacidad.credito';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends BaseComponent implements OnInit {
  model: Model;
  boton: number;

  constructor (
    protected data: DataService,
    private router: Router,
    private pensionadoService: PensionadoService,
    private capacidadCreditoService: CapacidadCreditoService ) {
      super(data);
      this.model = this.data.model;
    }

  ngOnInit() {
    this.model.persona.nombre = this.data.model.persona.nombre;
    this.model.persona.primerApellido = this.data.model.persona.primerApellido;
    this.model.persona.segundoApellido = this.data.model.persona.segundoApellido;
    this.model.persona.curp=this.data.model.persona.curp;
    this.model.pensionado.nss=this.data.model.pensionado.nss;
    this.model.pensionado.delegacion=this.data.model.pensionado.delegacion;
    this.model.pensionado.correoElectronico=this.data.model.persona.correoElectronico;
    this.model.pensionado.telefono=this.model.persona.telefono;
    
  }



  solicitudVigente(seleccion: number){
    //console.log("Incia validacion de solicitudes vigentes");
    this.boton = seleccion;
    
    this.capacidadCreditoService.getSolicitudVigente( this.model.pensionado )
        .subscribe(()=>this.capacidadCredito());        
  }
  
  capacidadCredito(){
    this.capacidadCreditoService.getCapacidadCredito( this.model.pensionado )
    .subscribe((capacidadCredito: CapacidadCredito) => this.validarCapacidadCredito(capacidadCredito)  );    
    
  }
  
  validarCapacidadCredito( capacidadCredito: CapacidadCredito){

     switch(this.boton)
        {
            case 1:  this.model.capacidadCredito = {...capacidadCredito};
                     if( this.model.capacidadCredito != null ) {
                       
                        this.router.navigate(['/pensionado/simulacionBusqueda', {  }]); 
                      } else {
                        this.data.model.mensaje.mensaje="No cuentas con capacidad de crédito, no podrás realizar una simulación.";
                        this.data.model.mensaje.level="danger";
                      }           
                break;

            case 2:  this.model.capacidadCredito = {...capacidadCredito};
                     if( this.model.capacidadCredito != null ) {
                        this.router.navigate(['/pensionado/capacidadCredito', {  }]); 
                      } else {
                        this.data.model.mensaje.mensaje="No cuentas con capacidad de crédito, no podrás realizar este proceso.";
                        this.data.model.mensaje.level="danger";
                      }      
                break;
                case 3:  this.model.capacidadCredito = {...capacidadCredito};
                if( this.model.capacidadCredito != null){
                  
                   this.router.navigate(['../../pensionado/buscarFolioCancelar', {  }]); 
                 }
           break;
        }
   
  }

}
