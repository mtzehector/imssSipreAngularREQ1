import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { DataService } from '../../data.service';
import { Model } from 'src/app/model';
import { ModalService } from 'src/app/common/modal-Services';
import { AutorizarService, MensajeService, RegistrarEntidadFinancieraService, RegistrarPromotorService } from 'src/app/common/services';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { Delegacion } from 'src/app/common/domain/delegacion';
import { DatePipe } from '@angular/common';
import { BlockUIDefaultName } from 'ng-block-ui/constants/block-ui-default-name.constant';
import { DelegacionRequest } from 'src/app/common/domain/delegacionRequest';


@Component({
  selector: 'app-promotor-editar-info-complementaria',
  templateUrl: './promotor-editar-info-complementaria.component.html',
  styleUrls: []
})
export class PromotorEditarInfoComplementariaComponent extends BaseComponent {

  @Input() infoForm: FormGroup;
  @Input() dominioCorreoAdmin: string;
  @Input() dominioCorreoUsuario: string;
  @Output() cambiarCorreo = new EventEmitter<boolean>(false);
  
  public model: Model;
  public catalogoDelegaciones: Delegacion[];
  public regexTelefono: string;
  public regexCorreo: string;
  public delegacionesValidas: boolean = true;
  public mapDelegaciones: any;
  public delegacionFormArray = new FormArray([]);
  items: Delegacion[];
  cambiar: boolean = false;

  constructor(
    protected data: DataService,
    private registarPromotorService: RegistrarPromotorService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private autorizarService: AutorizarService,
    private mensajeService: MensajeService,
    public location: Location,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService
  ) {
    super(data);
    this.model = this.data.model;
    this.regexTelefono = '^([0-9]{10})$';
    //this.regexCorreo = '[\\w.-]+@[.a-zA-Z_cd ]+?\\.[a-zA-Z]{2,3}$';
    this.regexCorreo = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  }


  ngOnInit() {
    this.catalogoDelegaciones = this.model.delegacionesEFCollection;
    this.mapDelegaciones = this.catalogoDelegaciones.reduce(function (map, obj) {
      map[obj.cveDelegacion] = obj.descDelegacion;
      return map;
    }, {});
    if (this.model.registrarPromotor.delegaciones === null || this.model.registrarPromotor.delegaciones === undefined) {
      this.model.registrarPromotor.delegaciones = new Array();
      let delegacion = new Delegacion();
      this.model.registrarPromotor.delegaciones.push(delegacion);
      this.delegacionFormArray.push(new FormControl(delegacion, [Validators.required, this.DelegacionUnique(false)]));

    } else {
      for (const delegacion of this.model.registrarPromotor.delegaciones) {
        //this.delegacionFormArray.push(new FormControl(delegacion, Validators.required));
        this.delegacionFormArray.push(new FormControl(delegacion, [Validators.required, this.DelegacionUnique(false)]));
        //this.delegacionFormArray.push(new FormControl(delegacion));

      }
    }
    if (!(this.model.registrarPromotor.entidadFederativa != undefined)) {
      this.model.registrarPromotor.entidadFederativa = '0';
    }
    // tslint:disable-next-line: max-line-length
    if (this.model.registrarPromotor.tipoEmpleado === '' || !(this.model.registrarPromotor.tipoEmpleado != undefined)) {
      this.model.registrarPromotor.tipoEmpleado = '0';
    }


    // tslint:disable-next-line: triple-equals
    if (!(this.model.registrarPromotor.idMotivoBaja != undefined)) {
      this.model.registrarPromotor.idMotivoBaja = 0;
    }
    // tslint:disable-next-line: triple-equals
    if (!(this.model.registrarPromotor.estadoPersonaEf != undefined)) {
      this.model.registrarPromotor.estadoPersonaEf = 0;
    }
    if ((this.model.registrarPromotor.estadoPersonaEf > 0)) {
      this.model.registrarPromotor.idMotivoBaja = (this.model.registrarPromotor.estadoPersonaEf) - 1;
    }

    this.model.registrarPromotor.registroPatronal = this.model.entidadFinanciera.registroPatronal;
    ////console.log(">>>PromotorEditarInfoComplementariaComponent registroPatronal="+this.model.registrarPromotor.registroPatronal);
    if (this.model.registrarPromotor.telefono === '' || this.model.registrarPromotor.telefono === undefined) {
      this.model.registrarPromotor.telefono = "";
      this.model.registrarPromotor.telefonoCelular = "";
      this.model.registrarPromotor.correoElectronico = "";
    }

    this.createForm();

    //console.log(">>> PromotorEditarInfoComplementariaComponent ngOnInit this.model.registrarPromotor.delegaciones=" + JSON.stringify(this.model.registrarPromotor.delegaciones));

  }

  del(response: Delegacion[]) {
  }

  createForm() {

    this.infoForm.addControl("tipoEmpleado", new FormControl('', Validators.required));
    //this.infoForm.addControl("delegacion", new FormControl('', Validators.required));
    this.infoForm.addControl("numEmpleado", new FormControl(''));
    this.infoForm.addControl("registroPatronal", new FormControl(''));

    if (this.model.enabledBajaPromotor) {
      this.infoForm.addControl("estadoPersonaEf", new FormControl('0', Validators.required));
      this.infoForm.addControl("idMotivoBaja", new FormControl('', Validators.required));
    } else {
      this.infoForm.addControl("estadoPersonaEf", new FormControl(''));
      this.infoForm.addControl("idMotivoBaja", new FormControl(''));
    }

    this.infoForm.addControl("telefono",
      new FormControl('',
        [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.regexTelefono)]));

    this.infoForm.addControl("telefonoCelular",
      new FormControl('',
        [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.regexTelefono)]));

    this.infoForm.addControl("correoElectronico", new FormControl('', [Validators.required]));

    if (this.model.enabledModificarPromotor)
      this.infoForm.get('correoElectronico').disable();

        /*
        this.infoForm.addControl("correoElectronico",
      new FormControl('',
        [Validators.required, Validators.pattern(this.regexCorreo)]));
        */
  }

  tipoEmpleadoConfig() {
    //this.model.registrarPromotor = this.infoForm.value;
    //console.log(this.model.registrarPromotor);
    let tipoEmpleado = this.infoForm.get('tipoEmpleado').value;
    if (tipoEmpleado == '1') {

      this.infoForm.get('numEmpleado').setValidators(
        [Validators.required,
        Validators.maxLength(18),
        Validators.minLength(2),
        Validators.pattern('[0-9]*$')]);
      this.infoForm.get('numEmpleado').updateValueAndValidity;

      this.infoForm.get('registroPatronal').setValidators(
        [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10)]);
      this.infoForm.get('registroPatronal').updateValueAndValidity;


      this.infoForm.get('codigoPostal').clearValidators();
      this.infoForm.get('asentamiento').clearValidators();
      this.infoForm.get('calle').clearValidators();
      this.infoForm.get('numeroExterior').clearValidators();


      this.infoForm.get('codigoPostal').updateValueAndValidity();
      this.infoForm.get('asentamiento').updateValueAndValidity();
      this.infoForm.get('calle').updateValueAndValidity();
      this.infoForm.get('numeroExterior').updateValueAndValidity();

    } else {
      this.infoForm.get('codigoPostal').setValidators(
        [Validators.required,
        Validators.pattern('[0-9]*$')]);

      this.infoForm.get('asentamiento').setValidators(
        [Validators.required]);

      this.infoForm.get('calle').setValidators(
        [Validators.required]);

      this.infoForm.get('numeroExterior').setValidators(
        [Validators.required]);


      this.infoForm.get('numEmpleado').clearValidators();
      this.infoForm.get('registroPatronal').clearValidators();

      this.infoForm.get('registroPatronal').updateValueAndValidity();
      this.infoForm.get('numEmpleado').updateValueAndValidity();
      this.infoForm.get('codigoPostal').updateValueAndValidity();
      this.infoForm.get('asentamiento').updateValueAndValidity();
      this.infoForm.get('calle').updateValueAndValidity();
      this.infoForm.get('numeroExterior').updateValueAndValidity();

    }
  }

  agregar(index) {
    let delegacionForm = new FormControl();
    delegacionForm.setValidators([Validators.required, this.DelegacionUnique(true)]);
    this.delegacionFormArray.push(delegacionForm);
    let nuevaDelegacion: Delegacion = {
      desDelegacion: null,
      numDelegacion: null,
      id: null
    };
    this.model.registrarPromotor.delegaciones.push(nuevaDelegacion);


  }

  eliminar(index) {
    if (index != 0) {
      // tslint:disable-next-line: max-line-length
      //console.log("eliminar index:" + index+'  element='+JSON.stringify(this.model.registrarPromotor.delegaciones[index]));
      //console.log("eliminar index:" + index+'  element.fecAltaRegistro='+this.model.registrarPromotor.delegaciones[index].fecAltaRegistro);
      if (index !== -1) {
        if (this.model.registrarPromotor.delegaciones[index].fecAltaRegistro === null || this.model.registrarPromotor.delegaciones[index].fecAltaRegistro === undefined) {
          //console.log(" >>>eliminar index:" + index+'  splice');
          this.model.registrarPromotor.delegaciones.splice(index, 1);
          this.delegacionFormArray.removeAt(index);
          // tslint:disable-next-line: max-line-length
        } else {
          // this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.splice(index, 1);
          this.model.registrarPromotor.delegaciones[index].bajaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
          //console.log(" >>>eliminar index:" + index+'  bajaRegistro='+JSON.stringify(this.model.registrarPromotor.delegaciones[index]));
        }
      }
    }
    this.validarDelegaciones()
  }


  listenerDelegacion(index: number) {
    console.log('>>>###listenerDelegacion index=' + index)
    let id = this.model.registrarPromotor.delegaciones[index].cveDelegacion;
    this.model.registrarPromotor.delegaciones[index].desDelegacion = this.mapDelegaciones[id];
    this.model.registrarPromotor.delegaciones[index].id = Number(id);
    //console.log('>>>===listenerDelegacion this.model.registrarPromotor.delegaciones['+index+'].cveDelegacion='+this.model.registrarPromotor.delegaciones[index].cveDelegacion)
    //console.log('>>>===listenerDelegacion this.model.registrarPromotor.delegaciones['+index+'].descDelegacion='+this.model.registrarPromotor.delegaciones[index].descDelegacion)
    this.validarDelegaciones()
  }

  validarDelegaciones() {
    let delegaciones = this.model.registrarPromotor.delegaciones;
    this.delegacionesValidas = true;
    this.model.flatPlazosModEF = true;
    let delegacionesSet = new Set();
    delegaciones.forEach(element => {

      //console.log(">>>validarDelegaciones element= ", JSON.stringify(element));
      if (this.model.registrarPromotor.delegaciones.length > 1) {
        if (element.id === undefined) {

          if (delegacionesSet.has(element.id)) {
            this.delegacionesValidas = false;
            if (this.model.enabledModificarEntidad) {
              this.model.flatPlazosModEF = false;
            }
          } else {
            delegacionesSet.add(element.id);
          }

        }
      }
    });
  }

  //null valid
  DelegacionUnique(isNew: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.validarDelegacion(control, isNew) ? null : { mustUnique: true };


  }

  validarDelegacion(control: AbstractControl, isNew: boolean) {
    console.log('control: ' , control);
    if (control.value === null || !isNew) {
      console.log('isNew: ' , isNew);
      return true;
    }
    let cveDelegacionNew = control.value;
    let i = 0;
    let registra = true;
    console.log('delegaciones: ' , this.model.registrarPromotor.delegaciones);
    console.log('cveDelegacionNew: ' , cveDelegacionNew);
    for (const delegacion of this.model.registrarPromotor.delegaciones) {
      console.log('delegacion.cveDelegacion: ' , delegacion.cveDelegacion);
      if (delegacion.cveDelegacion == cveDelegacionNew) {
        console.log('registra: ' , registra);
        registra = false;
        break;
      }
      i++;
    }
    console.log('return registra: ' , registra);

    return registra;
  }

  cambiaDominio(){
    this.infoForm.get('correoElectronico').enable();
    this.cambiar = true;
    this.cambiarCorreo.emit(true);
  }

}
