import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Model } from 'src/app/model';
import { InformacionEF } from 'src/app/common/domain/informacionEF';
import { CatalogoService, DataService, ModalService, RegistrarEntidadFinancieraService } from 'src/app/common/services';
import { BaseComponent } from 'src/app/common/base.component';
import { PlazoBeneficio } from 'src/app/operadorEF/condicion-ef/model/plazoBeneficio';
import { CondicionesForm } from 'src/app/operadorEF/condicion-ef/model/condicionesForm';
import { CondicionJson } from 'src/app/operadorEF/condicion-ef/model/condicionJson';
import { async } from '@angular/core/testing';
import { Delegacion, EntidadFinancieraCrud, Mensaje } from 'src/app/common/domain';
import { RegistroPatronal } from 'src/app/common/domain/registro-patronal';
import { PrestadorServiciosEF } from 'src/app/common/domain/prestador.servicios.ef';


@Component({
  selector: 'app-consultar-entidad-financiera',
  templateUrl: './consultar-entidad-financiera.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class ConsultarEntidadFinancieraComponent extends BaseComponent implements OnInit {
  public model: Model;
  formGroupV2: FormGroup;
  registro: FormControl;
  mostrar: boolean;
  mostarFlujo: boolean = false;
  public informacionEF: InformacionEF;
  regPatronal = false;
  mclestado: any;
  condicionesArray: CondicionJson[];
  plazos: PlazoBeneficio[];
  plazo: PlazoBeneficio;
  condicionesForm: CondicionesForm = new CondicionesForm();
  rol: String;
  estadoEF: string;
  items: Delegacion[];
  patronales: RegistroPatronal[];

  constructor(protected data: DataService,
    private modalService: ModalService,
    protected catalogoService: CatalogoService,
    protected registrarEntidadFinancieraService: RegistrarEntidadFinancieraService,
    private formBuilder: FormBuilder,
    private router: Router,
    public location: Location) {
    super(data);
    this.model = this.data.model;
    this.informacionEF = new InformacionEF();
    this.plazos = null;

  }

  ngOnInit() {
    //this.registrarEntidadFinancieraService.datosSesionMock();

    this.catalogoService.consultarDelegaciones().subscribe((response: Delegacion[]) => {
      console.log("Delegaciones: ", response);
      this.items = response;
    });

    this.buildForm();
    this.mostrar = false;
    this.model.enabledModificarEntidad = false;
    this.rol = "operadorIMSS";
    //console.log("ERPE 10-09-2020");
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";

  }

  limpiar() {
    this.mostrar = false;
    this.mostarFlujo = false;
    this.formGroupV2.setValue({ ['registro']: '' });
    this.model.enabledModificarEntidad = false;
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";

  }
  private buildForm() {
    const dateLength = 10;
    this.formGroupV2 = this.formBuilder.group({
      registro: ['', [
        Validators.required,
        Validators.minLength,
        Validators.maxLength
      ]]

    });
  }

  guardarCambios() {
    this.mostrar = true;
    //console.log(this.formGroupV2.value);
  }

  flujoAlterna() {
    this.mostrar = false;
  }

  buscarEntidad(cveDelegacion: number) {
    //---const found = this.items.find(x => x.id == entidad);
    //const found = this.items.catalogoDelegaciones.find(x => x.id == cveDelegacion);
    for (var d of this.items) {
      if (cveDelegacion == d.id) {
        return d.desDelegacion;
      }
    }
    //---return found.name;
    return "";
  }

  verDetalle() {
    this.modalService.open("carga");
    this.registrarEntidadFinancieraService.consultarEntidad(
      (this.model.registrarEntidadFinanciera.id) + ""
    ).subscribe((response: any) => {
        //console.log("Consultar entidad: " + JSON.stringify(response, null, 2));
        this.model.enabledModificarEntidad = true;
        //this.router.navigate(['/operadorIMSS/detalleEntidad', {}]);
        //this.modalService.close('carga');
        if (this.model.registrarEntidadFinanciera.mclcEstadoEf === null) {
          this.model.registrarEntidadFinanciera.mclcEstadoEf = this.mclestado;
        }
        // Se llena modelo de font para sección Plazos y Beneficios
        this.plazos = new Array();
        let i = 1;

        for (let condicionOferta of response.mclcCondicionOfertaCollection) {
          let plazo = new PlazoBeneficio();
          plazo.id = condicionOferta.id;
          plazo.indice = i++;
          if (condicionOferta.mclcPlazo != null) {
            plazo.plazo = condicionOferta.mclcPlazo.descripcion;
          }
          plazo.cat = condicionOferta.porTasaAnual;
          plazo.catForm = condicionOferta.porCat;
          if (condicionOferta.mclcBeneficioCollection != null) {
            plazo.idBeneficioA = (condicionOferta.mclcBeneficioCollection.length > 0 ? condicionOferta.mclcBeneficioCollection[0].id : null);
            plazo.valorBeneficioA = (condicionOferta.mclcBeneficioCollection.length > 0 ? condicionOferta.mclcBeneficioCollection[0].desBeneficio : null);
            plazo.idBeneficioB = (condicionOferta.mclcBeneficioCollection.length > 1 ? condicionOferta.mclcBeneficioCollection[1].id : null);
            plazo.valorBeneficioB = (condicionOferta.mclcBeneficioCollection.length > 1 ? condicionOferta.mclcBeneficioCollection[1].desBeneficio : null);
            plazo.idBeneficioC = (condicionOferta.mclcBeneficioCollection.length > 2 ? condicionOferta.mclcBeneficioCollection[2].id : null);
            plazo.valorBeneficioC = (condicionOferta.mclcBeneficioCollection.length > 2 ? condicionOferta.mclcBeneficioCollection[2].desBeneficio : null);
          }

          this.plazos.push(plazo);
        }

        // Se llena modelo de font para sección de Condiciones por entidad federativa

        this.condicionesArray = new Array();
        for (let condicionEntidadFed of response.mclcCondicionEntfedCollection) {
          //---if(condicionEntidadFed.cveEntidadFederativa!=null){
          if (condicionEntidadFed.cveDelegacion != null) {
            let condicion = new CondicionJson();
            condicion.edadJ = (condicionEntidadFed.numEdadLimite != null ? condicionEntidadFed.numEdadLimite.toString() : null);
            condicion.mMinimoJ = condicionEntidadFed.monMinimo;
            condicion.mMaxJ = condicionEntidadFed.monMaximo;
            condicion.sexoJ = condicionEntidadFed.mclcSexo.desSexo;
            //---condicion.nombreEF = this.buscarEntidad(condicionEntidadFed.cveEntidadFederativa);
            condicion.nombreEF = this.buscarEntidad(condicionEntidadFed.cveDelegacion);
            this.condicionesArray.push(condicion);
          }
        }

        this.patronales = new Array();
        for (let registroPatronal of response.mcltRegistrosPatronalesCollection) {
          let rp = new RegistroPatronal();
          rp.id = registroPatronal.id;
          rp.idEntidadFinanciera = registroPatronal.idEntidadFinanciera;
          rp.registroPatronal = registroPatronal.registroPatronal;
          rp.fecRegistroAlta = registroPatronal.fecRegistroAlta;
          rp.bajaRegistro = registroPatronal.bajaRegistro;

          this.patronales.push(rp);
        }

        this.ordenarArrayEntidad();
        this.model.plazosConsulta = this.plazos;
        this.model.condicionesFormConsulta = this.condicionesForm;
        this.model.condicionesArray = this.condicionesArray;
        this.model.registrosPatronalesArray = this.patronales;

        this.updateInformacioPrestadoresDeServicios();

        this.router.navigate(['/operadorIMSS/detalleEntidad', {}]);
        this.modalService.close('carga');
      });
  }

  ordenarArrayEntidad() {
    //alert("ENTRA A ORDENAR ");
    this.condicionesArray.sort(function (a, b) {
      if (a.nombreEF > b.nombreEF) {
        return 1;
      }
      if (a.nombreEF < b.nombreEF) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  resultadoMock() {
    this.model.mensaje.mensaje = "";
    this.model.mensaje.level = "";
    this.modalService.open("carga");
    this.flujoAlterna();
    this.registrarEntidadFinancieraService.consultarEntidadFinancieraRegPatronal((this.formGroupV2.value['registro']))
      .subscribe((response: any) => {
        this.mostrar = true;
        switch (this.data.model.informacionEF.idEntidad) {
          case 1:
            this.estadoEF = "VIGENTE";
            break;
          case 2:
            this.estadoEF = "SUSPENDIDA";
            break;
          case 3:
            this.estadoEF = "BAJA";
            break;
          default:
            break;
        }
        this.modalService.close('carga');
        this.mclestado = this.model.registrarEntidadFinanciera.mclcEstadoEf;
        this.mostarFlujo = true;
      });
  }

  continuar() {
    this.router.navigate(['/operadorIMSS/registrarEntidad', {}]);
  }
  regresar() {
    this.router.navigate(['/operadorIMSS/home', {}]);
  }

  private updateInformacioPrestadoresDeServicios() {
    if (this.model.registrarEntidadFinanciera == null) return;

    if (this.model.registrarEntidadFinanciera.prestadorServicioCertificado == null) {
      this.model.registrarEntidadFinanciera.prestadorServicioCertificado = new PrestadorServiciosEF();
      this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveEntidadFinanciera =
        this.model.registrarEntidadFinanciera.id;
      this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveTipoPrestadorServicios = 1;
    }
    else {
      this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSCertificacion = true;
      this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt =
        this.model.registrarEntidadFinanciera.prestadorServicioCertificado;
    }

    if (this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica == null) {
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica = new PrestadorServiciosEF();
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveEntidadFinanciera =
        this.model.registrarEntidadFinanciera.id;
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveTipoPrestadorServicios = 2;
    }
    else {
      this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSValidacionBiometrica = true;
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt =
        this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica;
    }
  }
}

