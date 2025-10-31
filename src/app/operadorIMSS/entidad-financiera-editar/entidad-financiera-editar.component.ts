import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { String } from 'typescript-string-operations';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { CatalogoService, DataService, ModalService, RegistrarEntidadFinancieraService } from 'src/app/common/services';
import { EntidadFinancieraSIPRE } from 'src/app/common/domain/entidadFinancieraSIPRE';
import { AltModEntFinancierasRequest } from 'src/app/common/domain/altModEntFinancierasRequest';
import { EntidadFinancieraCrud } from 'src/app/common/domain/entidad.financiera.crud';
import { EntidadFinancieraSIPREResponse } from 'src/app/common/domain/entidadFinancieraSIPREResponse';
import { CondicionOfertaCrud, PlazoCrud, EstadoEfCrud, Mensaje, Documento, Delegacion } from "src/app/common/domain";
import { Bancos } from 'src/app/common/domain/catalogos/bancos';
import { RegistroPatronal } from 'src/app/common/domain/registro-patronal';
import { CatMaximoService } from 'src/app/common/services/cat.maximo.service';
import { BitacoraEstatusEF } from 'src/app/common/domain/bitacora.estatus.ef';
import { PrestadorServiciosEF } from 'src/app/common/domain/prestador.servicios.ef';
import { CondicionJson } from 'src/app/operadorEF/condicion-ef/model/condicionJson';
import { CondicionesForm } from 'src/app/operadorEF/condicion-ef/model/condicionesForm';
import { PlazoBeneficio } from 'src/app/operadorEF/condicion-ef/model/plazoBeneficio';
import { NgForm } from '@angular/forms';
import { csLocale } from 'ngx-bootstrap';


@Component({
  selector: 'app-entidad-financiera-editar',
  templateUrl: './entidad-financiera-editar.component.html',
  styleUrls: ['../../common/css/tarjetas-estilos-base.css']
})
export class EntidadFinancieraEditarComponent extends BaseComponent implements OnInit {

  public model: Model;
  rol: String;
  registrarForm: any;
  entidadFinancieraSIPRE: EntidadFinancieraSIPRE = new EntidadFinancieraSIPRE();
  altModEntFinancierasRequest: AltModEntFinancierasRequest = new AltModEntFinancierasRequest();
  date: Date = new Date();
  datepipe: DatePipe = new DatePipe('en-US');;
  baja: boolean = false;
  public msjbaja: Mensaje = new Mensaje();
  public CATMaximoActual: string;

  @Output()
  public validClabe = new EventEmitter<boolean>();
  digito: any;
  multimplos: string = "37137137137137137";
  multimplo: any;
  sumatoria: any = 0;
  operacion: any;
  digitoVerificador: any;
  digControl: any;
  //entidadResponse : EntidadFinancieraCrud = new EntidadFinancieraCrud();
  idEstadoEntidad: number = 1;

  private archivoPSCertificacion: File;
  private archivoPSValidacionBiometrica: File;
  esFormaPSCertificacionValida: boolean = false;
  esFormaPSValidacionBiometrica: boolean = false;

  condicionesArray: CondicionJson[];
  condicionesForm: CondicionesForm = new CondicionesForm();
  patronales: RegistroPatronal[];
  plazos: PlazoBeneficio[];
  plazo: PlazoBeneficio;
  items: Delegacion[];

  constructor(
    protected data: DataService,
    private router: Router,
    private modalService: ModalService,
    private registrarEntidadFinancieraService: RegistrarEntidadFinancieraService,
    public location: Location,
    private activatedRoute: ActivatedRoute,
    private catalogoService: CatalogoService,
    private catMaximoService: CatMaximoService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {
    this.rol = "operadorIMSS";
    //console.log(">>>prueba2 04/09");
    this.model.idInstFinanciera = 0;
    this.model.mostrarExitoRegistro = false;
    this.activatedRoute.queryParams.subscribe(
      params => {
        console.log(params)
        if (params['idEntidad'] != null) {
          // this.registrarEntidadFinancieraService.datosSesionMock();
          this.model.enabledModificarEntidad = true;
          this.model.personaEF.entidadFinanciera.id = params['idEntidad'];
          this.registrarEntidadFinancieraService.consultarEntidad(this.model.personaEF.entidadFinanciera.id)
            .subscribe((response: any) => {
              //console.log("Consultar entidad: " + JSON.stringify(response, null, 2));
            });
        }
      });
    this.msjbaja.level = "Danger";
    this.msjbaja.mensaje = "No es posible modificar esta Entidad Financiera debido a que ha sido dada de Baja.";
    if (this.model.registrarEntidadFinanciera.mclcEstadoEf !== undefined) {
      if (Number(this.model.registrarEntidadFinanciera.mclcEstadoEf.id) === 3) {
        this.baja = true;
      }

    }
    this.catMaximoService.catActual().subscribe((response: any) => {
      console.log('Response:', response.catAnterior);
      this.CATMaximoActual = response.catAnterior;
    });

    this.idEstadoEntidad = (this.model.registrarEntidadFinanciera.id === undefined) ? 1 : Number(this.model.registrarEntidadFinanciera.mclcEstadoEf.id);

    if (this.model.esNuevoRegistroEntidadFinanciera) {
      this.limpiarPrestadoresDeServicios();
    }
  }

  limpiar(registrarForm) {
    //console.log("Limpiar");
    this.model.registrarEntidadFinanciera = {
      id: this.model.registrarEntidadFinanciera.id,
      rfc: this.model.registrarEntidadFinanciera.rfc,
      razonSocial: this.model.registrarEntidadFinanciera.razonSocial,
      nombreComercial: this.model.registrarEntidadFinanciera.nombreComercial,
      registroPatronal: this.model.registrarEntidadFinanciera.registroPatronal,
      curpRepresentanteLegal: this.model.registrarEntidadFinanciera.curpRepresentanteLegal,
      mclcEstadoEf: {}
    };
    registrarForm.reset();
    this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection = new Array();
    this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.push(new CondicionOfertaCrud());
    this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[0].mclcPlazo = new PlazoCrud();
    this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection = new Array();
    this.model.plazosConsulta = new Array();
    this.limpiarPrestadoresDeServicios();
  }

  abrirModalConfirmar() {
    if (this.validarFormulario()) {
      this.modalService.open("autorizarRegistrarEntidadFinanciera");
    }

  }
  closeModalRegistro() {
    this.modalService.close("autorizarRegistrarEntidadFinanciera");
  }
  parseDate(fecha: string) {
    let fechaArray: Array<String>;
    fechaArray = fecha.split('/');
    fecha = fechaArray[2] + '-' + fechaArray[1] + '-' + fechaArray[0];
    return fecha;
  }

  setEntidadFinancieraSIPRE(entidadResponse: EntidadFinancieraCrud) {
    console.log("JFBA setEntidadFinancieraSIPRE");
    this.date = new Date();
    let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.entidadFinancieraSIPRE.idMovimiento = 'A';//M para bajas y suspensiones
    if (this.model.enabledModificarEntidad)
      this.entidadFinancieraSIPRE.idMovimiento = 'M';//M para bajas y suspensiones
    this.entidadFinancieraSIPRE.entidadPago = entidadResponse.instBancaria;
    this.entidadFinancieraSIPRE.cveRfc = entidadResponse.rfc;
    this.entidadFinancieraSIPRE.desRazonSocialInst = entidadResponse.razonSocial.substring(0, 99);
    this.entidadFinancieraSIPRE.nomComercial = entidadResponse.nombreComercial.substring(0, 49);
    this.entidadFinancieraSIPRE.numProveedor = entidadResponse.numeroProveedor;//oficio
    this.entidadFinancieraSIPRE.catPromedio = '';//oficio
    this.entidadFinancieraSIPRE.desRegistroPatronal = entidadResponse.registroPatronal;
    let dirStr: string = entidadResponse.direccion;
    this.entidadFinancieraSIPRE.domFiscal = dirStr.substring(0, 49)
    if (entidadResponse.sinConvenio == 0) {
      this.entidadFinancieraSIPRE.fecFirmaConvenio = '';
      this.entidadFinancieraSIPRE.fecInicioConvenio = '';
    } else {
      this.entidadFinancieraSIPRE.fecFirmaConvenio = entidadResponse.fecFirmaContra.substring(0, 10).split('/')[2] + '-' + entidadResponse.fecFirmaContra.substring(0, 10).split('/')[1] + '-' + entidadResponse.fecFirmaContra.substring(0, 10).split('/')[0];
      this.entidadFinancieraSIPRE.fecInicioConvenio = entidadResponse.fecIniFirmaContra.substring(0, 10).split('/')[2] + '-' + entidadResponse.fecIniFirmaContra.substring(0, 10).split('/')[1] + '-' + entidadResponse.fecIniFirmaContra.substring(0, 10).split('/')[0];
    }
    this.entidadFinancieraSIPRE.numClabe = entidadResponse.clabe;
    this.entidadFinancieraSIPRE.numCuenta = '';//oficio
    this.entidadFinancieraSIPRE.nomEmail = entidadResponse.correoAdmin;
    let nombreStr: string = entidadResponse.nombreAdmin + ' ' + entidadResponse.primerApAdmin + ' ' + entidadResponse.segundoApeAdmin;
    this.entidadFinancieraSIPRE.nomRepLegal = nombreStr.substring(0, 99);
    this.entidadFinancieraSIPRE.adminRFC = entidadResponse.adminRFC;
    this.entidadFinancieraSIPRE.fecAltaInst = latest_date;
    this.entidadFinancieraSIPRE.estatusLog = 'A'; //B, S  
    if (entidadResponse.mclcEstadoEf !== undefined && Number(entidadResponse.mclcEstadoEf.id) === 2) {
      this.entidadFinancieraSIPRE.estatusLog = 'S'; //B, S  
    }
    if (entidadResponse.mclcEstadoEf !== undefined && Number(entidadResponse.mclcEstadoEf.id) === 3) {
      this.entidadFinancieraSIPRE.estatusLog = 'B'; //B, S 
      this.entidadFinancieraSIPRE.fecFinConvenio = latest_date;//Para realizar baja logica comenta Fabio Ivan que revisa com funcionara baja y suspendida
    }
    this.entidadFinancieraSIPRE.idLogin = '';//No requerido
    this.entidadFinancieraSIPRE.fecModificacion = latest_date;
    this.entidadFinancieraSIPRE.razonSocial = entidadResponse.razonSocial;
    this.entidadFinancieraSIPRE.numTel = entidadResponse.numeroTelefono;
    this.entidadFinancieraSIPRE.desUrlContacto = entidadResponse.paginaWeb.substring(0, 49);
    this.altModEntFinancierasRequest.altModEntFinancierasRequest = this.entidadFinancieraSIPRE;
    console.log("JFBA FIN setEntidadFinancieraSIPRE");
  }

  generarBitacoraEstatusEF() {

    let debeRegistrarCambioEstatus: boolean = false;
    let bitacoraEstatusEF: BitacoraEstatusEF = new BitacoraEstatusEF();

    if (this.model.registrarEntidadFinanciera.id === undefined) {
      debeRegistrarCambioEstatus = true;
      bitacoraEstatusEF.idEstadoEFAnterior = this.idEstadoEntidad;
      bitacoraEstatusEF.idEstadoEFNuevo = this.idEstadoEntidad;
    } else {
      bitacoraEstatusEF.idEntidadFinanciera = this.model.registrarEntidadFinanciera.id;
      bitacoraEstatusEF.idEstadoEFAnterior = this.idEstadoEntidad;
      bitacoraEstatusEF.idEstadoEFNuevo = Number(this.model.registrarEntidadFinanciera.mclcEstadoEf.id);
    }

    if (!debeRegistrarCambioEstatus && bitacoraEstatusEF.idEstadoEFAnterior != bitacoraEstatusEF.idEstadoEFNuevo)
      debeRegistrarCambioEstatus = true;

    if (debeRegistrarCambioEstatus) {
      switch (bitacoraEstatusEF.idEstadoEFNuevo) {
        case 1:
          bitacoraEstatusEF.idTipoEvento = 40;
          break;
        case 2:
          bitacoraEstatusEF.idTipoEvento = 41;
          break;
        case 3:
          bitacoraEstatusEF.idTipoEvento = 42;
          break;
      }
      bitacoraEstatusEF.curp = this.model.persona.curp;
      this.model.registrarEntidadFinanciera.bitacoraEstatusEF = bitacoraEstatusEF;
    }
  }

  registrar(registrarForm: NgForm) {

    this.closeModalRegistro();

    //console.log(">>>EntidadFinanciera ", JSON.stringify(this.model.registrarEntidadFinanciera));
    
    if (this.validarFormulario()) {
      this.modalService.open("carga");
      this.generarBitacoraEstatusEF();
      this.setEntidadFinancieraSIPRE(this.model.registrarEntidadFinanciera);
      //console.log("JGV EF REGISTRO");
      //console.log("altModEntFinancierasRequest: ", this.altModEntFinancierasRequest);

      this.registrarEntidadFinancieraService.registrarModificarEntidadesSIPRE(
        this.altModEntFinancierasRequest
      ).subscribe((responseRegistrarModificarEntidadesSIPRE: any) => {
          //console.log(response);
          if (this.model.idInstFinanciera != 0)
            this.model.registrarEntidadFinanciera.idInstFinanciera = this.model.idInstFinanciera;

          this.model.registrarEntidadFinanciera.enableModificar = this.model.enabledModificarEntidad;
          //ERPE
          //console.log(this.model.registrarEntidadFinanciera.sinConvenio);
          if (this.model.registrarEntidadFinanciera.sinConvenio == undefined) {
            this.model.registrarEntidadFinanciera.sinConvenio = 1;
          }

          if (this.model.registrarEntidadFinanciera.sinConvenio == 0) {
            this.model.registrarEntidadFinanciera.fecFirmaContra = null;
            this.model.registrarEntidadFinanciera.fecIniFirmaContra = null;
          }//console.log(JSON.stringify(this.model.registrarEntidadFinanciera, null, 2));

          let regPats = new Array();
          for (let regPat of this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection) {
            if (regPat.id == undefined) {
              if (regPat.registroPatronal != undefined && regPat.registroPatronal.length != 0) {
                regPats.push(regPat);
              }
            } else {
              regPats.push(regPat);
            }
          }
          this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection = regPats;
          //console.log("this.model.registrarEntidadFinanciera: ", this.model.registrarEntidadFinanciera);
          this.registrarEntidadFinancieraService.registrarEntidad(
            this.model.registrarEntidadFinanciera
          ).subscribe((responseRegistrarEntidad: any) => {

            if (this.model.esNuevoRegistroEntidadFinanciera && responseRegistrarEntidad != null && responseRegistrarEntidad.body != null && 
              responseRegistrarEntidad.body.entidadFinanciera != null && responseRegistrarEntidad.body.entidadFinanciera.id != null) {
              this.model.registrarEntidadFinanciera.id = responseRegistrarEntidad.body.entidadFinanciera.id;
            }

            //console.log("RESPONSE EN EDITAR",JSON.stringify(response, null, 2));
            if (this.model.registrarEntidadFinanciera.mclcEstadoEf === undefined) {
              this.data.model.informacionEF.estado = 'VIGENTE';
            } else {
              this.data.model.informacionEF.estado = (Number(this.data.model.registrarEntidadFinanciera.mclcEstadoEf.id) === 1 ? 'VIGENTE' : (Number(this.data.model.registrarEntidadFinanciera.mclcEstadoEf.id) === 2 ? 'SUSPENDIDA' : 'BAJA'));
            }
            console.log("THIS.DATA.MODEL.REGISTRAR.REGPAT ", JSON.stringify(this.data.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection, null, 2));
            this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection = this.data.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection;
            console.log("THIS.MODEL.REGISTRAR.REGPAT ", JSON.stringify(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection, null, 2));
            let patronales = new Array();
            for (let registroPatronal of this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection) {
              let rp = new RegistroPatronal();
              rp.id = registroPatronal.id;
              rp.idEntidadFinanciera = this.model.registrarEntidadFinanciera.id;
              rp.registroPatronal = registroPatronal.registroPatronal;
              rp.fecRegistroAlta = registroPatronal.fecRegistroAlta;
              rp.bajaRegistro = registroPatronal.bajaRegistro;

              patronales.push(rp);
            }
            this.model.registrosPatronalesArray = patronales;
            //this.modalService.close("carga");
            //this.model.mostrarExitoRegistro = true;

            // Se inicializa el logo como null para no tener problemas al ver el detalle, ya que requiere ver el archivo y daría UNDEFINED
            let logo = new Documento();
            logo.archivo = null;
            this.model.registrarEntidadFinanciera.logo = logo;

            console.log("this.model.registrarEntidadFinanciera: ", this.model.registrarEntidadFinanciera);

            let eefc = new EstadoEfCrud();
            eefc.id = 1;
            eefc.descripcion = 'VIGENTE';
            this.model.registrarEntidadFinanciera.mclcEstadoEf = eefc;

            this.cargaPrestadoresDeServicios();
          }, errorRegistrarEntidad => {
            this.modalService.close("carga");
          }
          );
        },errorRegistrarModificarEntidadesSIPRE => {
            this.modalService.close("carga");
        });
    }
  }

  validarFormulario() {
    let result: boolean = false;

    if (
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.clabe) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.curpRepresentanteLegal) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.numeroTelefono) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.telefonoAtencionClientes) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.paginaWeb) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.correoElectronico) &&
      // this.model.registrarEntidadFinanciera.fecFirmaContraDate != null &&
      //this.model.registrarEntidadFinanciera.fecIniFirmaContraDate != null &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.numeroProveedor) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.clabe) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.confClabe) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.instBancaria) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.curpAdmin) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.correoAdmin) &&
      !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.adminRFC) 
    ) {
      result = true;
    }
    /*
    let invalidoRfc = this.validarRFC(
      this.model.registrarEntidadFinanciera.curpAdmin,
      this.model.registrarEntidadFinanciera.adminRFC
    );

    if (invalidoRfc) {
      return false;
    }
    */
    //    //console.log("Resultado Validación 1: ", result);
    result = this.validarPlazos(result);
    //result =this.validarClabe();
    //    //console.log("Resultado Validación 2: ", result);
    return result;
  }

  validarPlazos(plazosValidos: boolean) {
    for (let condicion of this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection) {
      if (condicion.id == undefined || condicion.id == null || condicion.porTasaAnual == null) {
        condicion.porTasaAnual = parseFloat(this.CATMaximoActual);
      }

    }
    let plazos = this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection;
    //console.log("ERPE 10-09-2020");

    let plazosSet = new Set();
    plazos.forEach(element => {

      //console.log("plazo : ", element.mclcPlazo.id);
      if (element.mclcPlazo.id == undefined || element.porTasaAnual.toString().trim() == "") {
        plazosValidos = false;
      }
      if (this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.length > 1) {
        if (element.bajaRegistro === undefined || element.bajaRegistro === null) {

          if (plazosSet.has(element.mclcPlazo.id)) {
            plazosValidos = false;
          } else {
            plazosSet.add(element.mclcPlazo.id);
          }

        }
      }
    });

    return plazosValidos;
  }

  validarClabe() {

    let result: boolean = false;

    //Coincidencia de la CLABE
    if (!String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.clabe) && !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.confClabe)) {

      if (this.model.registrarEntidadFinanciera.clabe == this.model.registrarEntidadFinanciera.confClabe) {
        result = true;
      } else {
      }
    }
    //Validar primeros 3 digitos de la cadena correspondan a la EF
    if (result && !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.instBancaria)) {

      let testClabe = this.model.registrarEntidadFinanciera.clabe.substring(0, 3);
      let testConfClabe = this.model.registrarEntidadFinanciera.confClabe.substring(0, 3);
      //console.log(">>>PRUEBA ", this.model.registrarEntidadFinanciera.instBancaria);
      if (testClabe == testConfClabe && testClabe == this.model.registrarEntidadFinanciera.instBancaria) {
        if (this.validarEstructuraClabe(this.model.registrarEntidadFinanciera.clabe)) {
          result = true;
        } else {
          //console.log("ERROR ESTRUCTURE CLABE UD>>>>>: ");
        }
      } else {
        //console.log("ERROR ESTRUCTURE CLABE 3D>>>>>: ");
      }
    }
    this.validClabe.next(result);
    this.model.clabeOK = result;
  }

  validarEstructuraClabe(clabe: string) {

    //console.log("ESTRUCTURE CLABE>>>>>: ",  clabe);
    this.digito = null;
    this.multimplo = null;
    this.operacion = null;
    this.sumatoria = null;
    this.digitoVerificador = null;

    for (let cont = 0; cont < (clabe.length - 1); cont++) {
      this.digito = clabe[cont];
      //console.log("VALOR DIGITO>>>>>: ",  this.digito);
      this.multimplo = this.multimplos[cont];
      //console.log("VALOR MULTIPLO>>>>>: ",  this.multimplo);
      this.operacion = this.digito * this.multimplo;
      //console.log("VALOR OPERACION>>>>>: ",  this.operacion);
      this.sumatoria += this.operacion < 10 ? parseInt(this.operacion) : parseInt(this.operacion.toString()[1]);
      //console.log("VALOR SUMATORIA>>>>>: ",  this.sumatoria);
    }
    if (this.sumatoria > 99) {
      this.digitoVerificador = this.sumatoria.toString()[2];
      //console.log("IF SUMATORIA>>>>>: ",  this.digitoVerificador);
    } else if (this.sumatoria > 9) {
      this.digitoVerificador = this.sumatoria.toString()[1];
      //console.log("IF ELSE SUMATORIA>>>>>: ",  this.digitoVerificador); 
    } else {
      this.digitoVerificador = this.sumatoria;
      //console.log("ELSE SUMATORIA>>>>>: ",  this.digitoVerificador);
    }
    this.digitoVerificador = 10 - this.digitoVerificador;
    //console.log("valor DIGITOVERIFICADOR>>>>>: ",  this.digitoVerificador);
    this.digitoVerificador = this.digitoVerificador == 10 ? 0 : this.digitoVerificador;
    //console.log("valor final DIGITOVERIFICADOR>>>>>: ",  this.digitoVerificador);

    return this.digitoVerificador == clabe[17];

  }

  /*
  validarRFC(curp: string, rfc: string){
    if ( (curp != null && curp != "") && (rfc != null && rfc != "") ) {
      let curp10 = curp.slice(0,10);
      let rfc10 = rfc.slice(0,10);
      this.model.flatRfcAdminEF = curp10 === rfc10? false : true;
      return this.model.flatRfcAdminEF;
    }
  }
  */

  regresar() {
    this.router.navigate(['/operadorIMSS/consultarEntidad']);
  }

  procesaCargaArchivoPSCertificacion(archivoPSCertificacion) {
    this.archivoPSCertificacion = archivoPSCertificacion;
  }

  procesaEsFormaPSCertificacionValida(esFormaPSCertificacionValida) {
    this.esFormaPSCertificacionValida = esFormaPSCertificacionValida;
  }

  procesaCargaArchivoPSValidacionBiometrica(archivoPSValidacionBiometrica) {
    this.archivoPSValidacionBiometrica = archivoPSValidacionBiometrica;
  }

  procesaEsFormaPSValidacionBiometrica(esFormaPSValidacionBiometrica) {
    this.esFormaPSValidacionBiometrica = esFormaPSValidacionBiometrica;
  }

  private generarFormDataPrestadoresDeServicios(): FormData {
    let formData = new FormData();

    formData.append('cveEntidadFinanciera', this.model.registrarEntidadFinanciera.id.toString());
    formData.append('curp', this.model.persona.curp);

    if (this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveEntidadFinanciera == null)
      this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveEntidadFinanciera = this.model.registrarEntidadFinanciera.id;
    formData.append('psCertificacionAlta', JSON.stringify(this.model.registrarEntidadFinanciera.prestadorServicioCertificado));
    if (!this.model.esNuevoRegistroEntidadFinanciera &&
      this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt != null &&
      this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt.id != null &&
      this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt.bajaRegistro != null
    ) {
      formData.append('psCertificacionBaja', JSON.stringify(this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt));
    }
    if (this.archivoPSCertificacion != null)
      formData.append('archivoPSCertificacion', this.archivoPSCertificacion, this.archivoPSCertificacion.name);
      
    if (this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveEntidadFinanciera == null)
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveEntidadFinanciera = this.model.registrarEntidadFinanciera.id;
    formData.append('psValidacionBiometricaAlta', JSON.stringify(this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica));
    if (!this.model.esNuevoRegistroEntidadFinanciera &&
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt != null &&
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt.id != null &&
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt.bajaRegistro != null
    ) {
      formData.append('psValidacionBiometricaBaja', JSON.stringify(this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt));
    }
    if (this.archivoPSValidacionBiometrica != null)
      formData.append('archivoPSValidacionBiometrica', this.archivoPSValidacionBiometrica, this.archivoPSValidacionBiometrica.name);
      
    formData.append('sesion', this.model.sesion == null? "0" : this.model.sesion.toString());
    return formData;
  }

  private buscarEntidad(cveDelegacion: number) {
    for (var d of this.items) {
      if (cveDelegacion == d.id) {
        return d.desDelegacion;
      }
    }
    return "";
  }

  private ordenarArrayEntidad() {
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

  private cargaPrestadoresDeServicios() {
    let formaCargaPrestadoresServicios: FormData = this.generarFormDataPrestadoresDeServicios();
    this.registrarEntidadFinancieraService.actualizaPrestadoresServicios(
      formaCargaPrestadoresServicios
    ).subscribe((responseActualizaPrestadoresServicios: any) => {
        this.consultaDatosDeTransicion();
      }, errorActualizaPrestadoresServicios => {
        this.modalService.close("carga");
      }
    );
  }

  private consultaDatosDeTransicion() {
    this.catalogoService.consultarDelegaciones().subscribe((response: Delegacion[]) => {
      this.items = response;
      this.consultarInformacionEntidadFinanciera();
    },
      error => {
        this.modalService.close("carga");
        this.router.navigate(['/operadorIMSS/consultarEntidad', {}]);
      }
    );
  }

  private consultarInformacionEntidadFinanciera() {
    this.registrarEntidadFinancieraService.consultarEntidad(
      (this.model.registrarEntidadFinanciera.id) + ""
    ).subscribe((response: any) => {
        this.model.enabledModificarEntidad = true;

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
          if (condicionEntidadFed.cveDelegacion != null) {
            let condicion = new CondicionJson();
            condicion.edadJ = (condicionEntidadFed.numEdadLimite != null ? condicionEntidadFed.numEdadLimite.toString() : null);
            condicion.mMinimoJ = condicionEntidadFed.monMinimo;
            condicion.mMaxJ = condicionEntidadFed.monMaximo;
            condicion.sexoJ = condicionEntidadFed.mclcSexo.desSexo;
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

        this.model.mostrarExitoRegistro = true;
        this.modalService.close("carga");
        this.router.navigate(['/operadorIMSS/detalleEntidad'], {
          queryParams:
          {
            accion: "entidadFinanciera",
            status: "updated",
          }
        });
      },
        error => {
          this.router.navigate(['/operadorIMSS/consultarEntidad', {}]);
        }
      );
  }

  private limpiarPSCertificado() {
    if(!this.model.esNuevoRegistroEntidadFinanciera &&
      this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt != null &&
      this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt.id != null
      ) {
      this.model.registrarEntidadFinanciera.prestadorServicioCertificadoAnt.bajaRegistro = this.datepipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
    }

    this.model.registrarEntidadFinanciera.prestadorServicioCertificado = new PrestadorServiciosEF();
    this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveTipoPrestadorServicios = 1;
    this.model.registrarEntidadFinanciera.prestadorServicioCertificado.cveEntidadFinanciera = this.model.registrarEntidadFinanciera.id;

    this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSCertificacion = false;
    this.model.registrarEntidadFinanciera.existeDocPSCertificado = false;
    this.archivoPSCertificacion = null;
    this.esFormaPSCertificacionValida = false;
  }

  private limpiarPSValidacionBiometrica() {
    if(!this.model.esNuevoRegistroEntidadFinanciera &&
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt != null &&
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt.id != null
      ) {
      this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometricaAnt.bajaRegistro = this.datepipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
    }

    this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica = new PrestadorServiciosEF();
    this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveTipoPrestadorServicios = 2;
    this.model.registrarEntidadFinanciera.prestadorServicioValidacionBiometrica.cveEntidadFinanciera = this.model.registrarEntidadFinanciera.id;

    this.model.registrarEntidadFinanciera.mostrarComponentesEdicionPSValidacionBiometrica = false;
    this.model.registrarEntidadFinanciera.existeDocPSValidacionBiometrica = false;
    this.archivoPSValidacionBiometrica = null;
    this.esFormaPSValidacionBiometrica = false;
  }

  private limpiarPrestadoresDeServicios() {
    this.limpiarPSCertificado();
    this.limpiarPSValidacionBiometrica();
  }

}
