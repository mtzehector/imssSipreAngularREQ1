import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';

import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ModalService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { CoincidirCadenas } from 'src/app/components-ux/validadores/coincidirCadenas';
import { RegistroPensionado } from 'src/app/common/domain/registro-pensionado';
import { RegistroPensionadoService } from 'src/app/common/services/registroPensionado.service';
import { DataService } from 'src/app/common/services';

@Component({
  selector: 'app-cambio-contra',
  templateUrl: './cambio-contra.component.html',
  styleUrls: ['./cambio-contra.component.css']
})
export class CambioContraComponent extends BaseComponent {
  message: string;
  formGroup: FormGroup;
  public model: Model;
  id: string;
  curpEc: string;
  curpDes: string;
  flat: any = false;

  contraPattern = "^(?=.*[A-Z])(?=.*[!@#$&*\\.+%_/,;]).{8,99}$";

  //regexCorreo: string = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';

  // Variables para el Boton Submit del formulario
  esDeshabilitadoBotonGuardar: boolean = true;

  constructor(
    protected data: DataService,
    public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private registroService: RegistroPensionadoService) {
    super(data);
  }

  ngOnInit() {
    this.buildForm();

  }

  //***************  CONFIGURACION DEL FORMULARIO  ************************/

  private buildForm() {

    this.formGroup = this.formBuilder.group({
      token: ['', [, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.contraPattern)]],
      nuevoPassword: ['', [Validators.required, Validators.pattern(this.contraPattern)]]
    }, {
      validator: CoincidirCadenas('password', 'nuevoPassword')
    });

  }

  async guardarCambios() {
    this.openModalActualizaCredenciales();
    let confirmacion = new RegistroPensionado();
    confirmacion = this.formGroup.value;

    if (confirmacion.token.length > 38) 
      this.flat = true;
    else
      this.flat = false;
    
    try {
      await this.registroService.confirmarContrasena(confirmacion, this.flat).then(response => {
        this.formGroup.reset();

        this.validaInputs();
        this.closeModalActualizaCredenciales();

        this.router.navigate(['/auth/login'],
          {
            queryParams:
            {
              accion: "pensionado",
              status: "cambioContra",
            }
          });

      });
    } catch (e) {
      this.validaInputs();
      this.closeModalActualizaCredenciales();
    } 
  }

  navegarLoggin() {
    this.router.navigate(['/auth/login']);
  }

  validaInputs() {
    this.esDeshabilitadoBotonGuardar = this.formGroup.invalid;
  }

  openModalActualizaCredenciales() {
    this.esDeshabilitadoBotonGuardar = true;
    this.modalService.open("actualizandoCredenciales");
  }

  closeModalActualizaCredenciales() {
    this.modalService.close("actualizandoCredenciales");
    this.validaInputs();
  }

}
