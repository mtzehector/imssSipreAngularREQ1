import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor, CartaInstruccion, TipoDocumento } from "src/app/common/domain";
import { RegistrarPromotorService, ModalService, GuardarCartaInstruccionCapacidadService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { DataService } from "../../data.service";
import { FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { Prestamo } from 'src/app/common/domain/prestamo';

@Component({
  selector: 'app-registrar-prestamo-informe-Aviso',
  templateUrl: './registrar-prestamo-informe-Aviso.component.html',
  styleUrls: ['./registrar-prestamo-informe.component-Aviso.css','../../common/css/tarjetas-estilos-base.css']
})
export class RegistrarPrestamoInformeAvisoComponent extends BaseComponent implements OnInit {
  public model: Model;
  avisoCheck: number;
  estadoTermino:boolean=false;
  idx:number;
  rol:String;
  fecha: string;
  prestamo: Prestamo = new Prestamo();
  cartaInstruccion: CartaInstruccion = new CartaInstruccion();
  buttonSubmitStatus: boolean = false;

  constructor(protected data: DataService, private router: Router, 
    private registarPromotorService: RegistrarPromotorService,
     private modalService: ModalService,
      public location: Location,
      private formBuilder: FormBuilder,
      private cartaInstruccionCapacidadService: GuardarCartaInstruccionCapacidadService,) {
        super(data);
        this.model = this.data.model;

      }

  ngOnInit() {
    this.rol="promotor";
    this.fecha = this.model.prestamoPromotor.prestamo.primerDescuento.substring(0,10);
  }

  cheked() {
    this.avisoCheck = this.avisoCheck !==1?1:0;

     
     if(this.avisoCheck == 1){
       this.estadoTermino=true;
     }
  }

  guardarCartaInstruccion() {
    this.buttonSubmitStatus = true;
    this.cartaInstruccion.flatPrestamoPromotor = 1;
    this.prestamo.solicitud = this.model.prestamoPromotor.solicitud.id;
    this.prestamo.promotor = this.model.prestamoPromotor.personaEF.idPersonaEF;
    this.prestamo.catPrestamoPromotor = this.model.prestamoPromotor.personaRequest.prestamo.cat;
    this.cartaInstruccion.prestamo = this.prestamo;
    this.cartaInstruccion.personaEf.entidadFinanciera = this.model.personaEF.entidadFinanciera;
    this.cartaInstruccion.personaEf.nss = this.data.model.user.numNss.toString();
    this.cartaInstruccion.pensionado.correoElectronico = this.model.prestamoPromotor.personaRequest.correoElectronico;
    this.cartaInstruccion.pensionado.telefono = this.model.prestamoPromotor.personaRequest.telCelular != null ? 
    this.model.prestamoPromotor.personaRequest.telCelular : this.model.prestamoPromotor.personaRequest.telLocal;
    this.cartaInstruccion.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo;
    this.cartaInstruccionCapacidadService.crearCartaPrestamoPromotor(this.cartaInstruccion)
    .subscribe((cartaInstruccion: CartaInstruccion) => this.validarCartaInstruccion(cartaInstruccion));
    //this.modalService.open("carga");
  }

  validarCartaInstruccion(cartaInstruccion) {
    //this.modalService.close("carga");
    if (cartaInstruccion.prestamo.id = ! null) {
      this.model.cartaInstruccion.prestamo = { ...cartaInstruccion.prestamo };
      this.model.documento.tipoDocumentoEnum = TipoDocumento.CARTA_INSTRUCCION;
      this.model.documento.numFolioSolicitud = this.model.prestamoPromotor.solicitud.numFolioSolicitud;
      this.model.documento.cveSolicitud = this.model.prestamoPromotor.solicitud.id.toString();
      this.model.buttonPrestamoPromotor = false;
      this.router.navigate(['/promotor/registroPrestamoCarta']);


    }
  }

}
