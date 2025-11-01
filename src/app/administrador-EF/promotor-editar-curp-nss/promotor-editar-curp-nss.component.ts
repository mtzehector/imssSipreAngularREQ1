import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor } from "src/app/common/domain";
import { DataService } from "../../data.service";
import { AutorizarService, MensajeService, RegistrarPromotorService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { ModalService } from 'src/app/common/modal-Services';


@Component({
  selector: 'app-promotor-editar-curp-nss',
  templateUrl: './promotor-editar-curp-nss.component.html',
  styleUrls: []
})
export class PromotorEditarCurpNssComponent extends BaseComponent implements OnInit {

  public model: Model;

  @Output()
  public continuarRegistro = new EventEmitter<boolean>();


  constructor(protected data: DataService, private registarPromotorService: RegistrarPromotorService, private router: Router, private route: ActivatedRoute, private modalService: ModalService, private autorizarService: AutorizarService, private mensajeService: MensajeService, public location: Location) {
    super(data);
    this.model = this.data.model;
  }
  ngOnInit() {
    this.limpiar();
    //this.model.registrarPromotor.curp = "MOMA810310HDFNRL02";
    //this.model.registrarPromotor.nss = "30068104683";
  }

  limpiar() {
    this.model.registrarPromotor = new Promotor();
  }

  continuar() {
  
    this.registarPromotorService.consultarPersonaRenapoBdtu(this.model.registrarPromotor.curp, this.model.registrarPromotor.nss)
      .subscribe((response: any) => {
        //console.log(JSON.stringify(response, null, 2));
        this.model.registrarPromotor.nombre = response.body.nombre;
        this.model.registrarPromotor.primerApellido = response.body.primerApellido;
        this.model.registrarPromotor.segundoApellido = response.body.segundoApellido;
        this.model.registrarPromotor.fechaNacimiento = new Date(response.body.fechaNacimiento) ;
        this.model.registrarPromotor.estadoVital = "1";
        this.model.registrarPromotor.entidadFederativaNacimiento = response.body.lugarNacimiento.nombre;
        this.model.registrarPromotor.sexo = response.body.sexo.idSexo;
        this.model.registrarPromotor.sexoDescripcion = response.body.sexo.descripcion;
        this.model.registrarPromotor.segundoApellido = response.body.segundoApellido;
        this.continuarRegistro.next(true);
      });
  
     /*
     this.model.registrarPromotor = {
       curp: "PESJ820801HQRCTV01",
       nss: "0123456789",
       nombre: "Javier Eduardo",
       primerApellido: "Uicab",
       segundoApellido: "Cetina",
       fechaNacimiento: new Date("1982-08-01T00:00:00"),
       estadoVital: "1",
       sexo: "1",
       entidadFederativaNacimiento: "Quintana Roo",
       tipoEmpleado: {},
       entidadFederativa: {},
       domicilio: {},
       numEmpleado: "",
       registroPatronal: "",
       telefono: "",
       telefonoCelular: "",
       correoElectronico: "",
     };
     this.continuarRegistro.next(true);
     */
     
  }

}
