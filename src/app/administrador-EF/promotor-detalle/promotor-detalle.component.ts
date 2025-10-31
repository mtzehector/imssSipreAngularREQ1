import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from '../../data.service';
import { Model } from 'src/app/model';
import { Mensaje } from 'src/app/common/domain/mensaje';
import { estadosResponse } from 'src/environments/environment';
import { ModalService, RegistrarEntidadFinancieraService, } from 'src/app/common/services';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrarPromotorService } from 'src/app/common/services';
import { BajaPromotorRQ } from 'src/app/common/domain/bajaPromotorRq';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Delegacion } from 'src/app/common/domain';



@Component({
  selector: 'app-promotor-detalle',
  templateUrl: './promotor-detalle.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class PromotorDetalleComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;

  public model: Model;
  public catalogoDelegaciones: Delegacion[];
  public fecha: string;
  public fecdate: Date;
  public estados = estadosResponse;
  public infodata: string;
  public entidadPromotor: string;
  public mapDelegaciones: any;
  public delegaciones: string = "";
  public bajaPromotor: boolean = false;
  public promotorBajaRq: BajaPromotorRQ = new BajaPromotorRQ();
  imgPromotorUrl: string = '';

  rol: string;

  constructor(
    protected data: DataService,
    private router: Router,
    private modalService: ModalService,
    public location: Location,
    private route: ActivatedRoute,
    private registarPromotorService: RegistrarPromotorService,
    private formBuilder: FormBuilder,
    public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService

  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.buildForm();
    this.rol = 'adminEF';
    this.registrarEntidadFinancieraService.consultarEstadosEF(this.model.entidadFinanciera.id).subscribe((response: Delegacion[]) => {

      this.catalogoDelegaciones = response;
      for (let dp of this.model.registrarPromotor.delegaciones) {
        for (let d of this.catalogoDelegaciones) {
          if (d.cveDelegacion == dp.cveDelegacion) {
            dp.desDelegacion = d.descDelegacion;
            break;
          }
        }
      }
      this.model.registrarPromotor.delegaciones.forEach(element => {
        this.delegaciones = this.delegaciones + element.desDelegacion + ",";
        console.log(element.desDelegacion);
      });
      this.delegaciones = this.delegaciones.substring(0, this.delegaciones.length - 1);


      this.fecha = this.model.registrarPromotor.fechaNacimiento;
      this.fecdate = new Date();
      this.fecdate.setDate(parseInt((this.fecha.split('/'))[0]));
      this.fecdate.setMonth((parseInt((this.fecha.split('/'))[1]) - 1));
      this.fecdate.setFullYear(parseInt((this.fecha.split('/'))[2]));
      if (this.model.registrarPromotor.estatus === undefined || this.model.registrarPromotor === '') {
        this.model.registrarPromotor.estatus = 'Activo';
      }
      if (this.model.registrarPromotor.curp === undefined) {
        this.cerrar();
      }
      this.infodata = this.model.registrarPromotor.estadoVital;
      for (let i = 0; i < this.estados.length; i++) {
        if ((parseInt(this.infodata) === (parseInt(this.estados[i].clave)))) {
          this.model.registrarPromotor.entidadFederativaNacimiento = this.estados[i].nombre;
        }
      }

      for (let i = 0; i < this.estados.length; i++) {
        if ((parseInt(this.model.registrarPromotor.entidadFederativa) === (parseInt(this.estados[i].clave)))) {
          this.entidadPromotor = this.estados[i].nombre;
        }
      }
      if (this.model.registrarPromotor.imgB64 == null) {
        this.imgPromotorUrl = '/mclpe/auth/js/assets/img/Vector.png';
      } else {
        this.imgPromotorUrl = 'data:image/png;base64,' + this.model.registrarPromotor.imgB64;
      }

    });
  }

  private buildForm() {

    this.formGroup = this.formBuilder.group({
      cveEstadoPersonaEf: ['', [Validators.required]],
      baja: ['', [Validators.required]]
    }, {
      // Validadores
    });

  }

  habilitarMotivo() {
    console.log("Estatus : ", this.promotorBajaRq);
    if (this.promotorBajaRq.cveEstadoPersonaEf == 1) {
      this.formGroup.get('baja').clearValidators();
    } else {
      this.formGroup.get('baja').setValidators(
        [Validators.required]
      );
    }

    this.formGroup.controls['baja'].updateValueAndValidity()
  }

  closeModal() {
    this.modalService.close('suspendido');
  }
  openModal() {
    this.modalService.open('suspendido');
  }

  regresar() {
    this.model.mostrarExitoRegistro = false;
    this.model.mostrarExitoModificacionBaja = false;
    this.router.navigate(['/administradorEF/consultarPromotor', {}]);
  }

  cerrar() {
    this.model.mostrarExitoRegistro = false;
    this.model.mostrarExitoModificacionBaja = false;
    this.router.navigate(['/administradorEF/home', {}]);
  }

  modificar() {
    if (this.model.registrarPromotor.estadoPersonaEf === 2 || this.model.registrarPromotor.estadoPersonaEf === 3) {
      this.openModal();
    } else {
      this.model.mostrarExitoRegistro = false;
      this.model.mostrarExitoModificacionBaja = false;
      this.model.enabledBajaPromotor = false;
      this.router.navigate(['/administradorEF/editarPromotor', {}]);
    }
  }

  baja() {
    if ((this.model.registrarPromotor.estadoPersonaEf === 2 || this.model.registrarPromotor.estadoPersonaEf === 3) && this.model.registrarPromotor.idMotivoBaja === 2) {
      this.openModal();
    } else {
      this.model.mostrarExitoRegistro = false;
      this.model.mostrarExitoModificacionBaja = false;
      this.model.enabledBajaPromotor = true;
      this.bajaPromotor = true;
    }
  }

  regresarBaja() {
    this.bajaPromotor = false;
  }

  bajaExec() {
    this.modalService.close('confirmacionBajaModal');
    this.modalService.open('carga');

    this.promotorBajaRq.id = Number(this.model.registrarPromotor.id);
    this.promotorBajaRq.cveEntidadFinanciera = Number(this.data.model.entidadFinanciera.id);
    this.promotorBajaRq.cvePersonalEf = this.model.registrarPromotor.cvePersonalEf;
    this.promotorBajaRq.email = this.model.registrarPromotor.correoElectronico;

    if (this.promotorBajaRq.cveEstadoPersonaEf == 1) {
      this.promotorBajaRq.baja = 0;
    }

    console.log("baja promotor: ", this.promotorBajaRq);
    this.registarPromotorService.bajaPromotor(
      this.promotorBajaRq
    ).subscribe((response: any) => {
      this.modalService.close('carga');
      // TODO: success
      let statusVar = 'baja';
      if (this.promotorBajaRq.cveEstadoPersonaEf == 1) {
        statusVar = 'reactivar';
      }
      this.router.navigate(['/administradorEF/consultarPromotor'],
        {
          queryParams:
          {
            accion: "promotor",
            status: statusVar,
          }
        });


    },
      error => {
        // TODO: ERROR
      });

    console.log("Promotor : ", this.model.registrarPromotor);
  }

  closeModalConfirmacion() {
    this.modalService.close('confirmacionBajaModal');

  }

  bajaConfirmacionModal() {
    this.modalService.open('confirmacionBajaModal');

  }


}
