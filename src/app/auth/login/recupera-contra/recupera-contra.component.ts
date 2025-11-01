import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../auth.service';
import { OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataService, ModalService, RegistrarEntidadFinancieraService, RegistrarNotificacionService, CatalogoService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { RegistroPensionado } from 'src/app/common/domain/registro-pensionado';
import { RegistroPensionadoService } from 'src/app/common/services/registroPensionado.service';


@Component({
  selector: 'app-recupera-contra',
  templateUrl: './recupera-contra.component.html',
  styleUrls: ['./recupera-contra.component.css']
})
export class RecuperaContraComponent implements OnInit {
  message: string;
  formGroup: FormGroup;
  public model: Model;
  cambiosGuardado: boolean = false;
  //regexCorreo: string = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
  regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  buttonSubmitStatus: boolean = false;


  constructor(public authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private registroService: RegistroPensionadoService) {
  }

  ngOnInit() {
    this.buildForm();
  }


  //***************  CONFIGURACION DEL FORMULARIO  ************************/

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern(this.regexCorreo)]],

    });
  }


  guardarCambios() {
    this.buttonSubmitStatus = true;
    let recuperaContrasenia = new RegistroPensionado();
    recuperaContrasenia = this.formGroup.value;
    //console.log(">>>>form: " +  JSON.stringify(recuperaContraseña));
    this.registroService.recuperarContrasena(recuperaContrasenia).subscribe(response => {
      this.cambiosGuardado = true;
      this.formGroup.reset();

      this.router.navigate(['/auth/login'],
        {
          queryParams:
          {
            accion: "pensionado",
            status: "correoRecuperarContrasenia",
          }
        });


    });
  }

  navegarRecpassword() {
    this.router.navigate(['/auth/cambioContra']);
  }

  flujoAlterno() {

    this.modalService.open("correoNoAsociado");
  }


  closeModalCorreoNoAociado() {
    this.modalService.close("correoNoAsociado");
  }



}
