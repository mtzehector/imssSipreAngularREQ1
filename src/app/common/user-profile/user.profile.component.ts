// TODO: Feature Componetized like CrisisCenter
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from "../../model";
import { DataService } from "../../data.service";
import { Router, NavigationExtras } from '@angular/router';
import { BaseComponent } from '../base.component';
import { timer, Subscription } from "rxjs";
import { Pipe, PipeTransform } from '@angular/core';
import { sessionTimeout,sessionAlertAt,isLocal } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalService } from 'src/app/common/services';
import { Mensaje } from '../domain/mensaje';




@Component({
  selector: 'app-user-profile',
  templateUrl: './user.profile.component.html' 
})
export class UserProfileComponent extends BaseComponent implements OnInit {
  countDown: Subscription;
  counter = sessionTimeout;
  sessionDuration = sessionTimeout;
  startedAt='startedAt';

  sessionAlert=sessionAlertAt;
  tick = 1000;
  //@Input() public rol  : string;

  rol: string;
  model : Model;
  value:string;

  constructor(protected data: DataService, private route: ActivatedRoute, 
    private router: Router,private authenticationService: AuthService,private modalService: ModalService,
    ) {
      super(data);
    }

  ngOnInit() {
    this.model = this.data.model;
    this.value=this.value;
    // ESTA SOLUCIÓN DE LA ALERTA DE FINALIZACIÓN DE SESIÓN ALTERA LA FUNCIONALIDAD DE LAS ALERTAS EN LA APLICACIÓN EN GENERAL YA QUE ES 
    // UN COMPONENTE GLOBAL LOS DATOS DEL USUARIO.
    this.model.mensajeTiempoSesion.mensaje="";
    this.model.mensajeTiempoSesion.level="";
    //this.data.currentMessage.subscribe(model => this.model = model)   
    this.rol = this.model.rol;
    
    ///////////////////////////////
    //console.log('UserProfileComponent.ngOnInit this.counter='+this.counter+' this.sessionDuration='+this.sessionDuration); 
    if (!sessionStorage.getItem(this.startedAt)) {
      sessionStorage.setItem(this.startedAt,Date.now().toString());
    }
    this.countDown = timer(0, this.tick).subscribe(() => (this.setCounter()));
    ///////////////////////////////

  }
  ngOnDestroy() {
    this.countDown.unsubscribe();
 }

  setCounter(){
    //console.log('UserProfileComponent.setCounter this.counter='+this.counter+' sessionStorage.getItem(this.counterStr)='+sessionStorage.getItem(this.counterStr)); 
    //if(!sessionStorage.getItem(this.startedAt) || this.counter<=0){
      //return;
    //}
    this.counter= this.sessionDuration - Math.floor((Date.now() - parseInt(sessionStorage.getItem(this.startedAt)))/1000);
    if(this.counter<=0 && !isLocal){
      this.authenticationService.setExpiredToken(1);
      this.router.navigate(['/auth/login'],{
        queryParams:
        {
          accion: "token",
          status: "vencido",
        }
      });
      this.counter = 0;
    }
    if(this.counter==this.sessionAlert && !isLocal){
     this.model.mensajeTiempoSesion.mensaje="La sesión está a punto de expirar. Será necesario iniciar sesión nuevamente.";
     this.model.mensajeTiempoSesion.level="warning";
    }
  }

  toLoginOT1(){
    this.router.navigate(['/loginOT1', {  }]); 
  }

  //Unicamente flujo pensionado
  salir(){
    this.router.navigate(
      ['/auth/login'],
      {
        queryParams:
        {
          accion: "sesion",
          status: "cerrada"
        }
      }
    );
  }

  closeAlertModal() {
    //console.log(">>> ===>login closeModalAtencion()");
    this.modalService.close("alert");
    this.data.model.mensajeTiempoSesion.mensaje = "";
  }

  openAlertModal() {
    this.modalService.open("alert");
  }

  
}

@Pipe({
  name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ("00" + minutes).slice(-2) +
      " min, " +
      ("00" + Math.floor(value - minutes * 60)).slice(-2)+' s'
    );
  }
}
