import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from '../../data.service';
import { ModalService, } from 'src/app/common/services';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrarPromotorService } from 'src/app/common/services';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BajaOperadorRQ } from 'src/app/common/domain/bajaOperadorRq';
import { ValidarCandidatoOperadorRs } from 'src/app/common/domain/validar.candidato.operador.rs';



@Component({
  selector: 'app-operador-detalle',
  templateUrl: './operador-detalle.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class OperadorDetalleComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  bajaOperador: boolean = false;
  operadorBajaRQ: BajaOperadorRQ;

  rol: string;

  constructor(
    protected data: DataService,
    private router: Router,
    private modalService: ModalService,
    public location: Location,
    private route: ActivatedRoute,
    private registarPromotorService: RegistrarPromotorService,
    private formBuilder: FormBuilder
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.buildForm();
    this.rol = 'adminEF';
    console.log("Operador model: ", this.model.operador);
    let candidatoRs = new ValidarCandidatoOperadorRs();
    candidatoRs.registroPatronalValido = this.model.operador.registroPatronal;
    this.model.operador.candidatoRs = candidatoRs;
    
    this.operadorBajaRQ = new BajaOperadorRQ();
    this.operadorBajaRQ.cveEstadoPersonaEf = this.model.operador.estadoPersonaEf;
    this.operadorBajaRQ.id = Number(this.model.operador.id);

  }


  private buildForm() {

    this.formGroup = this.formBuilder.group({
      cveEstadoPersonaEf: ['', [Validators.required]],
      baja: ['', [Validators.required]]
    }, {
      // Validadores
    });

  }



  regresar() {
    this.model.mostrarExitoRegistro = false;
    this.model.mostrarExitoModificacionBaja = false;
    this.router.navigate(['/administradorEF/consultarOperador', {}]);
  }

  cerrar() {
    this.model.mostrarExitoRegistro = false;
    this.model.mostrarExitoModificacionBaja = false;
    this.router.navigate(['/administradorEF/home', {}]);
  }

  modificar() {
    if (this.model.operador.estadoPersonaEf === 2 || this.model.operador.estadoPersonaEf === 3) {
      this.modalService.open('suspendido');
    } else {
      this.model.operador.operacionRegistro = "update";
      this .router.navigate(['/administradorEF/editarOperador'],
      {
        queryParams:
        {
          accion: "operador",
          status: "update"
        }
      });
    }
  }

  baja() {
    if(this.model.operador.idEstadoPersonaEF && this.model.operador.baja){
      if ( this.model.operador.baja === 2) {
        this.modalService.open('suspendido');
      }else{
        this.bajaOperador = true;
      }
    }else{
      this.bajaOperador = true;
    }
  }

  regresarBaja() {
    this.bajaOperador = false;
  }

  habilitarMotivo() {
    console.log("Estatus : ", this.model.operador);
    if (this.model.operador.estadoPersonaEf == 2 || this.model.operador.estadoPersonaEf == 3) {
      this.formGroup.get('baja').clearValidators();
    } else {
      this.formGroup.get('baja').setValidators(
        [Validators.required]
      );
    }

    this.formGroup.controls['baja'].updateValueAndValidity();
  }

  closeModalConfirmacion() {
    this.modalService.close('confirmacionBajaModal');

  }

  bajaConfirmacionModal() {
    this.modalService.open('confirmacionBajaModal');

  }

  bajaExec() {
    
    this.modalService.close('confirmacionBajaModal');
    this.modalService.open('carga');

    this.operadorBajaRQ.id = Number(this.model.operador.id);
    this.operadorBajaRQ.cveEntidadFinanciera = Number(this.data.model.entidadFinanciera.id);
    this.operadorBajaRQ.cvePersonalEf = this.model.operador.cvePersonalEf;
    this.operadorBajaRQ.email = this.model.operador.correoElectronico;
    this.operadorBajaRQ.adminCurp = this.model.persona.curp;
    this.operadorBajaRQ.sesion = this.model.sesion;
    this.operadorBajaRQ.cveCurp = this.model.operador.cveCurp;

    if (this.operadorBajaRQ.cveEstadoPersonaEf == 1) {
      this.operadorBajaRQ.baja = 0;
    }

    this.registarPromotorService.bajaOperador(
      this.operadorBajaRQ
    ).subscribe((response: any) => {
      this.modalService.close('carga');
      // TODO: success
      let statusVar = 'baja';
      if (this.operadorBajaRQ.cveEstadoPersonaEf == 1) {
        statusVar = "reactivar";
      }
      this.router.navigate(['/administradorEF/consultarOperador'],
      {
        queryParams:
        {
          accion: statusVar + "Operador",
          status: "success",
        }
      });
    });
  }

  closeModal() {
    this.modalService.close('suspendido');
  }


}
