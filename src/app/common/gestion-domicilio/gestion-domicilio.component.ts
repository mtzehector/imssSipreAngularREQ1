import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../data.service";
import { Model } from "src/app/model";
import { BaseComponent } from 'src/app/common/base.component';
import { RegistrarPromotorService } from 'src/app/common/services';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-domicilio',
  templateUrl: './gestion-domicilio.component.html',   
  styleUrls: []
})
export class GestionDomicilioComponent extends BaseComponent implements OnInit {

  @Input() domicilioForm: FormGroup;

  public model: Model;
  public domicilioResponse: any;
  public disabledCP: boolean = true;
  public codigoPostal: string;

  constructor(
    protected data: DataService,
    private registarPromotorService: RegistrarPromotorService,
    private fb: FormBuilder) {
    super(data);
    this.model = this.data.model;

  }

  async ngOnInit() {
    this.createForm();

    //console.log(">>> GestionDomicilioComponent ngOnInit this.model.registrarPromotor.domicilio=", this.model.registrarPromotor.domicilio);

    if (this.model.registrarPromotor.domicilio === undefined || this.model.registrarPromotor.domicilio === null) {
      this.codigoPostal = "";
      this.disabledCP = false;
      this.model.registrarPromotor.domicilio = {
        codigoPostal: "",
        selectedAsentamiento: {},
        calle: "",
        numeroExterior: "",
        numeroInterior: ""
      };
    } else {
      //this.disabledCP = true;
      this.domicilioResponse = this.model.registrarPromotor.domicilio;
      this.model.registrarPromotor.domicilio.numeroExterior = this.model.registrarPromotor.domicilio.numExteriorAlf;
      this.model.registrarPromotor.domicilio.numeroInterior = this.model.registrarPromotor.domicilio.numInteriorAlf;
      //console.log("colonia : ", this.model.registrarPromotor.domicilio);
      await this.registarPromotorService.consultarCodigoPostal(this.model.registrarPromotor.domicilio.codigoPostal)
        .then((response: any) => {
          this.codigoPostal = this.model.registrarPromotor.domicilio.codigoPostal;
          this.domicilioResponse = response.body;


          //console.log("Despues de la consulta de colonias : ", this.domicilioResponse);

          //console.log("selectedAsentamiento : ", this.model.registrarPromotor.domicilio.selectedAsentamiento);

          //console.log("domicilio.asentamiento.clave : ", this.model.registrarPromotor.domicilio.asentamiento.clave);

          let claveAux = this.model.registrarPromotor.domicilio.asentamiento.clave;
          let asentamientoSelected = this.model.registrarPromotor.domicilio.selectedAsentamiento;

          this.domicilioResponse.asentamientos.forEach(function (value) {
            //console.log(value);
            //console.log(value.clave);
            if (value.clave == claveAux) {
              asentamientoSelected = value;
            }
          });
          this.model.registrarPromotor.domicilio.selectedAsentamiento = asentamientoSelected;

          //console.log("selectedAsentamiento : ", this.model.registrarPromotor.domicilio.selectedAsentamiento);
          //console.log("domicilio.asentamiento : ", this.model.registrarPromotor.domicilio.asentamiento);

        });

      //this.model.registrarPromotor.domicilio.selectedAsentamiento = this.model.registrarPromotor.domicilio.asentamiento;
    }
  }

  createForm() {
    this.domicilioForm.addControl("codigoPostal", new FormControl('', Validators.required));
    this.domicilioForm.addControl("asentamiento", new FormControl('', Validators.required));
    this.domicilioForm.addControl("calle", new FormControl('', Validators.required));
    this.domicilioForm.addControl("numeroExterior", new FormControl('', Validators.required));
    this.domicilioForm.addControl("numeroInterior", new FormControl(''));


    let tipoEmpleado = this.domicilioForm.get('tipoEmpleado').value;
    if (tipoEmpleado == '1') {

      this.domicilioForm.get('numEmpleado').setValidators(
        [Validators.required,
        Validators.maxLength(18),
        Validators.minLength(2),
        Validators.pattern('[0-9]*$')]);
      this.domicilioForm.get('numEmpleado').updateValueAndValidity;


      this.domicilioForm.get('codigoPostal').clearValidators();
      this.domicilioForm.get('asentamiento').clearValidators();
      this.domicilioForm.get('calle').clearValidators();
      this.domicilioForm.get('numeroExterior').clearValidators();


      this.domicilioForm.get('codigoPostal').updateValueAndValidity();
      this.domicilioForm.get('asentamiento').updateValueAndValidity();
      this.domicilioForm.get('calle').updateValueAndValidity();
      this.domicilioForm.get('numeroExterior').updateValueAndValidity();

    } else {

      this.domicilioForm.get('codigoPostal').setValidators(
        [Validators.required,
        Validators.pattern('[0-9]*$')]);

      this.domicilioForm.get('asentamiento').setValidators(
        [Validators.required]);

      this.domicilioForm.get('calle').setValidators(
        [Validators.required]);

      this.domicilioForm.get('numeroExterior').setValidators(
        [Validators.required]);


      this.domicilioForm.get('numEmpleado').clearValidators();

      this.domicilioForm.get('numEmpleado').updateValueAndValidity();
      this.domicilioForm.get('codigoPostal').updateValueAndValidity();
      this.domicilioForm.get('asentamiento').updateValueAndValidity();
      this.domicilioForm.get('calle').updateValueAndValidity();
      this.domicilioForm.get('numeroExterior').updateValueAndValidity();

    }


  }


  limpiar($event) {
    $event.preventDefault();
    this.model.registrarPromotor.domicilio.codigoPostal = '';
    this.domicilioResponse.asentamientos[0].localidad.municipio.entidadFederativa.nombre = '';
    this.domicilioResponse.asentamientos[0].localidad.municipio.nombre = '';
    this.model.registrarPromotor.domicilio.selectedAsentamiento = '';
    this.model.registrarPromotor.domicilio.calle = '';
    this.model.registrarPromotor.domicilio.numeroExterior = '';
    this.model.registrarPromotor.domicilio.numeroInterior = '';
    this.disabledCP = false;
    this.codigoPostal = "";
  }

  async consultarCodigoPostal($event) {
    $event.preventDefault();
    //console.log("codigo postal a consultar : " + this.model.registrarPromotor.domicilio.codigoPostal);
    this.codigoPostal = this.model.registrarPromotor.domicilio.codigoPostal;
    await this.registarPromotorService.consultarCodigoPostal(this.model.registrarPromotor.domicilio.codigoPostal)
      .then((response: any) => {
        this.model.registrarPromotor.domicilio.selectedAsentamiento = undefined;
        this.domicilioResponse = response.body;
      });
    //this.disabledCP = true;
  }

}
