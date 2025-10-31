import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CatalogoService, DataService, ModalService } from 'src/app/common/services';
import { NavigationExtras } from '@angular/router';
import { ValidarCandidatoOperadorService } from '../../common/services/validar.candidato.operador.service';
import { RegistrarPersonaService } from '../../common/services/registrar.persona.service';
import { ValidarCandidatoOperadorRq } from 'src/app/common/domain/validar.candidato.operador.rq';
import { ValidarCandidatoOperadorRs } from 'src/app/common/domain/validar.candidato.operador.rs';
import { RegistroPensionadoService } from '../../common/services/registroPensionado.service';
import { RegistroPensionado } from '../../common/domain/registro-pensionado';

import { Model } from "src/app/model";
import { Delegacion } from 'src/app/common/domain';
@Component({
  selector: 'app-registro-operador',
  templateUrl: './registro-operador.component.html',
  styleUrls: ['./registro-operador.component.css','../../common/css/tarjetas-estilos-base.css']
})
export class RegistroOperadorComponent extends BaseComponent implements OnInit {
  message: string;
  formGroup: FormGroup;
  formGroupValidar: FormGroup;
  public model: Model;
  public rol: string;
  regexTelefono: string = '^([0-9]{10})$';
  regexCorreo: string = '[\\w.-]+@imss.gob.mx$';
  //public regexCorreo: string = '[\\w.]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';

  public candidatoRs = new ValidarCandidatoOperadorRs();
  public formulario_1: boolean = true;
  public formulario_2: boolean = false;
  buttonSubmitStatus1: boolean = false;
  buttonSubmitStatus2: boolean = false;
  items: Delegacion[];
  delegacionStr: string = "";
  constructor(
    protected data: DataService,
    public router: Router,
    private formBuilder: FormBuilder,
    private validarService: ValidarCandidatoOperadorService,
    private modalService: ModalService,
    private registroService: RegistroPensionadoService,
    protected catalogoService: CatalogoService
  ) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "administradorIMSS";
    this.buildForm();
    this.catalogoService.consultarDelegaciones().subscribe((response: Delegacion[]) => {
      console.log("Delegaciones: ", response);
      this.items = response;
    });
  }

  private buildForm() {
    this.formGroupValidar = this.formBuilder.group({
      curp: ['', [Validators.required, Validators.maxLength(18), Validators.minLength(18), Validators.pattern("^[a-zA-Z0-9]*$")]],
      nss: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*$')]],
      delegacion: ['', [Validators.required]],
      matricula: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(1), Validators.pattern('[0-9]*$')]]
    });

    this.formGroup = this.formBuilder.group({
      numTelefono: ['', [Validators.required, Validators.pattern(this.regexTelefono)]],
      correo: ['@imss.gob.mx', [Validators.required, Validators.pattern(this.regexCorreo)]]
    });

  }

  async validarCandidato() {
    this.buttonSubmitStatus1 = true;
    console.log("Validar Delegacion.");
    
    for(var del of this.items){
      if(del.numDelegacion==this.formGroupValidar.controls['delegacion'].value){
        this.delegacionStr = del.desDelegacion;
        break;
      }
    }

    let candidatoRq = new ValidarCandidatoOperadorRq();
    candidatoRq = this.formGroupValidar.value;
    try {
      await this.validarService.validarOpImss(candidatoRq).then(response => {
        this.candidatoRs = response;
        this.formulario_1 = false;
        this.formulario_2 = true;
      });
    } catch (error) {
      this.buttonSubmitStatus1 = false;
    }
  }

  async registrarCandidato() {
    this.buttonSubmitStatus2 = true;
    let registro = new RegistroPensionado();
    registro = this.formGroup.value;

    registro.correo = this.formGroup.controls['correo'].value;
    registro.numTelefono = this.formGroup.controls['numTelefono'].value;

    registro.curp = this.formGroupValidar.controls['curp'].value;
    registro.nss = this.formGroupValidar.controls['nss'].value;
    registro.delegacionTrabajadorImss = this.formGroupValidar.controls['delegacion'].value;
    registro.matriculaTrabajadorImss = this.formGroupValidar.controls['matricula'].value;


    registro.cvePerfil = 6;
    registro.firmaCartaRecibo = 0;
    //console.log("datosRQ : ");
    //console.log(registro);

    try {
      this.registroService.registrarUsuario(registro).subscribe(response => {

        this.router.navigate(['/administradorIMSS/home'],
        {
          queryParams: {
            accion: "operadorImss",
            status: "post"
          }
        }
      );
        this.formulario_1 = false;
        this.formulario_2 = true;
        window.scroll(0, 0);

      });

    } catch (error) {
      this.buttonSubmitStatus2 = false;
    } 
  }

}
