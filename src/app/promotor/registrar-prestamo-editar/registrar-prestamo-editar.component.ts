import { Component, OnInit } from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { Promotor, PersonaEF, FechaPrimerDescuento, EntidadFinanciera, Bitacora } from "src/app/common/domain";
import { RegistrarPromotorService, ModalService, PlazoCondicionesService, PromotorService, PrestamoService, BitacoraService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { DataService } from "../../data.service";
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { PersonaPrestamo } from 'src/app/common/domain/persona-prestamo';
import { PlazoCondiciones } from 'src/app/common/domain/plazo.condiciones';
import { PrestamoPromotor } from 'src/app/common/domain/prestamo-promotor';
import { PersonaRequest } from '../../common/domain/persona-request';
import { CondicionesPrestamo } from '../../common/domain/condicion.prestamo';
import { RegistroPensionado } from '../../common/domain/registro-pensionado';
import { TipoCredito } from 'src/app/common/domain/tipo.credito';
import { Prestamo } from 'src/app/common/domain/prestamo';
import { observable, Observable } from 'rxjs';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { SolicitudesVigentesService } from 'src/app/common/services/solicitudes.vigentes.service';
import { Mensaje } from 'src/app/common/domain';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-registrar-prestamo-editar',
  templateUrl: './registrar-prestamo-editar.component.html',
  styleUrls: ['./registrar-prestamo-editar.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class RegistrarPrestamoEditarComponent extends BaseComponent implements OnInit {
  public model: Model;
  //public regexCorreo: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  public regexCorreo: string = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
  public regexTelefono: string;
  public regexNumeroDecimal: string = '[0-9]+(\.[0-9][0-9]?)?';
  public regexCat: string = '[0-9]+(\.[0-9]{1,10}?)?';
  formGroup: FormGroup;
  rol: string;
  mensajeError: string;
  flat: string;
  plazosCondiciones: PlazoCondiciones[] = [];
  seleccionPlazo: PlazoCondiciones = new PlazoCondiciones();
  prestamoPromotor: PrestamoPromotor = new PrestamoPromotor();
  condiciones: CondicionesPrestamo = new CondicionesPrestamo();
  personaEF: PersonaEF = new PersonaEF();
  catMock: number;
  diaActual: string;
  primerdescuento: string;
  fecha: string;
  fechaNom: string;
  flatCorreo: any = true;
  buttonSubmitStatus: boolean = false;
  mostrarErrorSaldoCapital: boolean = false;
  flatMejorCondicion: boolean = false;
  flatNombreComercialEF: boolean = false;
  creditoRenovacion: boolean = false;
  creditoCompraCartera: boolean = false;
  creditoNuevo: boolean = false;
  prestamo: Prestamo = new Prestamo();
  sumaSaldoCapital: number = 0;
  sumaDescMensual: number = 0;
  entidadFinanciera: EntidadFinanciera = new EntidadFinanciera();
  flagBitacora: boolean = false;
  montoTotal: string = "";
  descuentoMensual: string = "";
  capacidadOriginal: number;
  catMinimo: number = 0;
  montonuevo: number;
  tipoCredito: TipoCredito;

  constructor(protected data: DataService,
    private router: Router,
    private registarPromotorService: RegistrarPromotorService,
    private modalService: ModalService,
    private plazoCondicionesService: PlazoCondicionesService,
    public location: Location,
    private formBuilder: FormBuilder,
    private promotorService: PromotorService,
    private prestamoService: PrestamoService,
    private bitacoraService: BitacoraService,
    private solicitudesVigentesService: SolicitudesVigentesService) {
    super(data);
    this.model = this.data.model;
    this.regexTelefono = "^[0-9]+$";

  }

  ngOnInit() {
    this.buildForm();
    this.onChangesTelefonos();
    this.capacidadOriginal = this.model.prestamoPromotor.capacidad.impCapacidadTotal;
    this.model.capacidadPensionado = this.model.prestamoPromotor.capacidad.impCapacidadTotal;
    this.data.model.mensaje.mensaje = "";
    this.data.model.mensaje.level = "";
    this.flat = this.model.prestamoPromotor.persona.correoElectronico;
    if (this.flat != 'sinregistro') {
      this.setFormInit(this.model.prestamoPromotor.persona);
    }
    let dia = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
    this.diaActual = '{\"fecInicio\"' + ':' + '"' + dia + '"}';
    this.prestamoService.getlistaPrestamo(this.diaActual)
      .subscribe((primerDescuentoResponse: FechaPrimerDescuento) => this.obtenerValor(primerDescuentoResponse));
    this.rol = "promotor";
    this.plazoCondicionesService.getPlazo(this.model.personaEF.entidadFinanciera.id).subscribe((response: PlazoCondiciones[]) => this.plazoCondicionSelect(response));
    this.model.buttonPrestamoPromotorEdit = false;
    this.montonuevo = 0;
    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.persona.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.CONSULTA_DATOS_PENSIONADO;
    bitacora.sesion = this.data.model.sesion;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => console.log("Bitacora: ", bitacora));
  }

  onChangesTelefonos() {
    this.formGroup.get('telLocal').valueChanges.subscribe(value => {
      if (value != "") {
        if (this.formGroup.get('telLocal').valid) {
          this.formGroup.get('telCelular').clearValidators();
          this.formGroup.get('telCelular').updateValueAndValidity();
        }
      }
    });

    this.formGroup.get('telCelular').valueChanges.subscribe(value => {
      if (value != "") {
        if (this.formGroup.get('telCelular').valid) {
          this.formGroup.get('telLocal').clearValidators();
          this.formGroup.get('telLocal').updateValueAndValidity();
        }
      }
    });
  }

  onMontoBlur() {
    this.buttonSubmitStatus = false;
    if (this.model.prestamoRecuperacion !== null) {
      let persona = new PersonaRequest();
      persona = this.formGroup.value;
      this.model.sumaDescuentoTotal = (this.model.prestamoRecuperacion.canDescuentoMensual + this.data.model.capacidadCredito.impCapacidadTotal).toFixed(2);
      if (Number(persona.montoSolicitado) < this.model.saldoCapitalTotal) {
        this.mostrarErrorSaldoCapital = true;
        this.buttonSubmitStatus = true;
        this.modalService.open("saldoCapital");
        return false;
      }
    }
  }

  plazoCondicionSelect(response: PlazoCondiciones[]) {
    this.plazosCondiciones = [];
    response.forEach(element => {
      if (element.cat > 0.0) {
        this.plazosCondiciones.push(element);
      }
    });
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      telLocal: ['', [Validators.required, Validators.pattern(this.regexTelefono)]],
      telCelular: ['', [Validators.required, Validators.pattern(this.regexTelefono)]],
      correoElectronico: ['', [Validators.required, Validators.pattern(this.regexCorreo)]],
      montoSolicitado: ['', [Validators.required, Validators.pattern(this.regexNumeroDecimal)]],
      plazo: ['', [Validators.required]],
      cat: ['', [Validators.required, Validators.pattern(this.regexCat)]],
      descuentoMensual: ['', [Validators.required]],
      montoPagar: ['', [Validators.required]],
      fechaNominal: ['', [Validators.required]]
    });
  }

  setFormInit(response: PersonaPrestamo) {
    this.formGroup.patchValue({
      telLocal: response.telLocal,
      telCelular: response.telCelular,
      correoElectronico: response.correoElectronico,
    });
  }

  async registrarPrestamo() {
    this.modalService.close("preguntaRegistroMonto");
    this.data.model.mensaje.mensaje = "";
    this.data.model.mensaje.level = "";
    let persona = new PersonaRequest();
    this.model.buttonPrestamoPromotorEdit = true;
    persona = this.formGroup.value;
    persona.flat = this.flat;
    if (this.validarMontoSolicitado(persona.montoSolicitado) && this.validarDescuentoMensual(this.descuentoMensual)) {
      this.condiciones.cat = persona.cat;
      this.condiciones.descuentoMensual = this.descuentoMensual;
      this.condiciones.montoPagar = this.montoTotal;
      this.condiciones.montoSolicitado = persona.montoSolicitado;
      this.condiciones.plazo = persona.plazo;
      this.model.prestamoPromotor.personaRequest = persona;
      this.model.prestamoPromotor.personaRequest.prestamo = this.condiciones;
      this.personaEF = this.model.personaEF;
      this.model.prestamoPromotor.personaEF = this.personaEF;
      await this.validarMejorOpcionEF();
      console.log(">>>>Registrar prestamo ", JSON.stringify(this.model.prestamoPromotor));
      this.promotorService.registrarPrestamo(this.model.prestamoPromotor).subscribe(
        response => this.validarRegistroPrestamo(response),
        error => {
          this.router.navigate(['/promotor/home'],
            {
              queryParams:
              {
                accion: "regPrestamo",
                status: "error",
              }
            });
        }
      );
    }
  }

  closeModal() {
    this.modalService.close("saldoCapital");
  }

  validarRegistroPrestamo(response: PrestamoPromotor) {
    this.model.capacidadPensionado = this.capacidadOriginal;
    this.model.prestamoPromotor.persona = response.persona;
    this.model.prestamoPromotor.capacidad = response.capacidad;
    this.model.prestamoPromotor.solicitud = response.solicitud;
    this.model.prestamoPromotor.personaEF = response.personaEF;
    this.model.prestamoPromotor.prestamo = response.prestamo;
    this.model.prestamoPromotor.personaRequest = response.personaRequest;
    this.model.prestamoPromotor.condicionOfertaCrud = response.condicionOfertaCrud;
    this.model.resumenCartaInstruccion.pensionado = this.model.prestamoPromotor.pensionado;
    this.model.resumenCartaInstruccion.persona = this.model.prestamoPromotor.persona;
    this.model.resumenCartaInstruccion.capacidadCredito = this.model.prestamoPromotor.capacidad;
    this.model.resumenCartaInstruccion.solicitud = this.model.prestamoPromotor.solicitud;
    this.model.resumenCartaInstruccion.personaEf = this.model.prestamoPromotor.personaEF;
    let prestamonew: Prestamo = new Prestamo();
    prestamonew.oferta.cat = this.model.prestamoPromotor.personaRequest.prestamo.cat;
    prestamonew.oferta.plazo = this.model.prestamoPromotor.personaRequest.prestamo.plazo;
    prestamonew.oferta.descuentoMensual = this.model.prestamoPromotor.personaRequest.prestamo.descuentoMensual;
    prestamonew.oferta.importeTotal = this.model.prestamoPromotor.personaRequest.prestamo.montoPagar;
    prestamonew.oferta.monto = this.model.prestamoPromotor.personaRequest.prestamo.montoSolicitado;
    prestamonew.monto = this.model.prestamoPromotor.personaRequest.prestamo.montoSolicitado;
    prestamonew.impDescNomina = Number(this.model.prestamoPromotor.personaRequest.prestamo.descuentoMensual);
    prestamonew.impTotalPagar = Number(this.model.prestamoPromotor.personaRequest.prestamo.montoPagar);
    prestamonew.primerDescuento = this.model.prestamoPromotor.prestamo.primerDescuento;
    prestamonew.oferta.entidadFinanciera = response.oferta.entidadFinanciera;

    this.model.resumenCartaInstruccion.prestamo = prestamonew;
    this.model.resumenCartaInstruccion.oferta = prestamonew.oferta;
    this.model.resumenCartaInstruccion.pensionado.curp = this.model.prestamoPromotor.solicitud.curp;
    this.model.resumenCartaInstruccion.pensionado.nss = this.model.prestamoPromotor.solicitud.nss;
    this.model.resumenCartaInstruccion.pensionado.tipoPension = this.model.prestamoPromotor.pensionado.descTipoPension;
    this.model.resumenCartaInstruccion.pensionado.descDelegacion = this.model.prestamoPromotor.pensionado.descDelegacion;
    this.model.resumenCartaInstruccion.solicitud.numFolioSolicitud = this.model.prestamoPromotor.solicitud.numFolioSolicitud
    this.model.resumenCartaInstruccion.pensionado.correoElectronico = this.model.prestamoPromotor.personaRequest.correoElectronico;
    this.model.resumenCartaInstruccion.pensionado.telefono = this.model.prestamoPromotor.personaRequest.telCelular;
    this.model.resumenCartaInstruccion.prestamosRecuperacionArreglo = response.prestamosRecuperacionArreglo;
    this.model.resumenCartaInstruccion.promotor = response.promotor;
    this.router.navigate(['/promotor/registroPrestamoInforme']);
  }

  obtenerValor(primerDescuentoResponse: FechaPrimerDescuento) {
    this.primerdescuento = primerDescuentoResponse.nominaPrimerDescuento;
    this.fecha = (primerDescuentoResponse.fecDescNomina).substring(0, 10);
    this.formGroup.patchValue({
      fechaNominal: this.fecha
    });
  }

  validarCorreo(correo: any) {
    let pensionado = new RegistroPensionado();
    pensionado.curp = this.model.prestamoPromotor.pensionado.cveCurp;
    pensionado.nss = this.model.prestamoPromotor.pensionado.idNss;
    pensionado.correo = correo;
    this.flatCorreo = false;
    this.promotorService.validarCorreo(pensionado).subscribe(response => {
      this.flatCorreo = true;
    });
  }

  async validarMejorOpcionEF() {
    if (this.model.prestamosRecuperacionArreglo != null && this.model.prestamosRecuperacionArreglo.length > 0) {
      for (var i of this.model.prestamosRecuperacionArreglo) {
        if (this.model.prestamoPromotor.personaEF.entidadFinanciera.cveEntidadFinancieraSipre === i.numEntidadFinanciera) {
          this.creditoRenovacion = true;
        } else {
          this.creditoCompraCartera = true;
          if (Number(this.model.prestamoPromotor.personaRequest.prestamo.cat) <= i.canCatPrestamo) {
            //this.flatMejorCondicion = true;
            //this.creditoCompraCartera = false;
          } else {
            await this.promotorService.validarEF(i.numEntidadFinanciera).then((response: EntidadFinanciera) => {
              if (Number(response.cveEntidadFinancieraSipre) > 0) {
                this.entidadFinanciera = { ...response };
                i.mejorOferta = 1;
                for (let x of this.model.prestamosRecuperacionArreglo) {
                  if (i.numSolicitudSipre != x.numSolicitudSipre) {
                    if (x.mejorOferta == 1) {
                      if (x.canCatPrestamo <= i.canCatPrestamo) {
                        i.mejorOferta = 0;
                      } else {
                        x.mejorOferta = 0
                      }
                    }
                  }
                }
              }
            });
          }
        }
      }
    } else {
      this.creditoNuevo = true;
    }

    if (this.creditoNuevo) {
      this.prestamo.tipoCredito = TipoCredito.NUEVO.id;
      this.model.prestamoPromotor.prestamo = { ...this.prestamo };
    } else {
      if (this.creditoRenovacion && this.creditoCompraCartera) {
        this.prestamo.tipoCredito = TipoCredito.MIXTO.id;
        this.model.prestamoPromotor.prestamo = { ...this.prestamo };
      } else if (this.creditoRenovacion) {
        this.prestamo.tipoCredito = TipoCredito.RENOVACION.id;
        this.model.prestamoPromotor.prestamo = { ...this.prestamo };
      } else if (this.creditoCompraCartera) {
        this.prestamo.tipoCredito = TipoCredito.COMPRA_CARTERA.id;
        this.model.prestamoPromotor.prestamo = { ...this.prestamo };
      } else {
        this.prestamo.tipoCredito = TipoCredito.NUEVO.id;
        this.model.prestamoPromotor.prestamo = { ...this.prestamo };
      }
    }
    this.model.prestamoPromotor.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo;
    for (let i of this.model.prestamoPromotor.prestamosRecuperacionArreglo) {
      if (i.mejorOferta === 1) {
        this.flagBitacora = true;
        this.model.prestamoPromotor.entidadFinanciera = { ...this.entidadFinanciera };
      }
    }
  }

  validarMontoSolicitado(monto: any): boolean {
    if (this.model.prestamosRecuperacionArreglo != null && this.model.prestamosRecuperacionArreglo.length > 0) {
      this.sumaSaldoCapital = 0;
      for (let p of this.model.prestamosRecuperacionArreglo) {
        this.sumaSaldoCapital += p.saldoCapital;
        this.sumaSaldoCapital += p.canDescuentoMensual;
        this.sumaSaldoCapital += p.canDescuentoMensual;
      }
      if (Number(monto) <= Number(this.sumaSaldoCapital.toFixed(2))) {
        this.data.model.mensaje.mensaje = "El monto solicitado debe ser mayor a la suma del saldo capital más dos mensualidades de los préstamos a liquidar seleccionados. Favor de verificar.";
        this.data.model.mensaje.level = "danger";
        this.model.buttonPrestamoPromotorEdit = false;
        this.modalService.close("carga");
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  validarDescuentoMensual(descuento: any): boolean {
    if (this.model.capacidadPensionado < descuento) {
      this.data.model.mensaje.mensaje = "El descuento mensual supera la capacidad de crédito. Favor de revisar.";
      this.data.model.mensaje.level = "danger";
      this.model.buttonPrestamoPromotorEdit = false;
      this.modalService.close("carga");
      return false;
    }
    return true;
  }

  validarCondiciones() {
    if (this.formGroup.get('cat').invalid || this.formGroup.get('montoSolicitado').invalid || this.formGroup.get('plazo').invalid) {
      return;
    }
    this.modalService.open("carga");
    this.formGroup.patchValue({ montoPagar: "" });
    this.formGroup.patchValue({ descuentoMensual: "" });
    let condiciones = this.formGroup.value;
    let persona = new PersonaRequest();
    persona.prestamo = condiciones;
    if (this.validarMontoSolicitado(persona.prestamo.montoSolicitado)) {
      let continuarProceso = true;
      this.obtenerTipoDeCredito();
      if (this.tipoCredito === TipoCredito.COMPRA_CARTERA) {
        continuarProceso = this.elCATOfrecidoEsMenor(persona.prestamo.cat);
      }
      if (continuarProceso) {
        this.model.prestamoPromotor.personaRequest = persona;
        this.personaEF = this.model.personaEF;
        this.model.prestamoPromotor.personaEF = this.personaEF;
        this.model.prestamoPromotor.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo;
        this.model.prestamoPromotor.capacidad.impCapacidadTotal = this.model.capacidadPensionado;
        this.promotorService.validarCondiciones(this.model.prestamoPromotor).subscribe(response => {
          this.montoTotal = (Math.round((Number.parseFloat(response.montoPagar) + Number.EPSILON) * 100) / 100).toString();
          this.descuentoMensual = (Math.round((Number.parseFloat(response.descuentoMensual) + Number.EPSILON) * 100) / 100).toString();
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          })
          this.formGroup.patchValue({ montoPagar: formatter.format(Math.round((Number.parseFloat(response.montoPagar) + Number.EPSILON) * 100) / 100) });
          this.formGroup.patchValue({ descuentoMensual: formatter.format(Math.round((Number.parseFloat(response.descuentoMensual) + Number.EPSILON) * 100) / 100) });
          this.modalService.close("carga");
        });
      }
    }
  }

  obtenerTipoDeCredito() {
    if (this.data.model.prestamosRecuperacionArreglo.length == 0) {
      this.tipoCredito = TipoCredito.NUEVO;
      return;
    }
    let sonIguales = false;
    let idEntidadFinanciera = "";
    if (this.data.model.prestamosRecuperacionArreglo.length > 0) {
      let listPrestamosSeleccionados = this.data.model.prestamosRecuperacionArreglo;
      idEntidadFinanciera = listPrestamosSeleccionados[0].numEntidadFinanciera;
      sonIguales = listPrestamosSeleccionados.every(item => item.numEntidadFinanciera == idEntidadFinanciera);
    }
    if (sonIguales && (idEntidadFinanciera === this.model.personaEF.entidadFinanciera.cveEntidadFinancieraSipre)) {
      this.tipoCredito = TipoCredito.RENOVACION;
    } else {
      this.tipoCredito = TipoCredito.COMPRA_CARTERA;
    }
  }

  elCATOfrecidoEsMenor(cat: any): boolean {
    let catNumerico = Number(Number(cat).toFixed(2));
    for (let pr of this.model.prestamosRecuperacionArreglo) {
      if (!(catNumerico <= Number(Number(pr.canCatPrestamo - environment.ajustePorcentualCAT).toFixed(2)))) {
        this.data.model.mensaje.mensaje = "El CAT ofrecido debe ser menor al CAT mínino de los préstamos a liquidar seleccionados. Favor de verificar.";
        this.data.model.mensaje.level = "danger";
        this.model.buttonPrestamoPromotorEdit = false;
        this.modalService.close("carga");
        return false;
      }
    }
    return true;
  }

  abrirModal() {
    this.flatCorreo = true;
    this.modalService.close("correoInvalido");
  }

  cerrarModal() {
    this.modalService.close("correoInvalido");
  }

  regresar() {
    this.router.navigate(['/promotor/registroPrestamo']);
  }
  continuarNo() {
    this.modalService.close("preguntaRegistroMonto");
  }

  confirmarMonto() {
    this.solicitudesVigentesService.ValidaMontoDescuento(this.model.pensionado.nss, this.descuentoMensual)
      .subscribe((valido: number) => {
        if (valido == 1) {
          let m = new Mensaje();
          m.level = "warning";
          m.mensaje = "No es posible continuar con el préstamo debido a que existe otro préstamo con el mismo importe mensual, favor de intentar nuevamente solicitando un importe de préstamo distinto.";
          this.model.mensaje = m;
        }
        else {
          let flag = false;
          this.montonuevo = 0;
          this.model.prestamosRecuperacionArreglo.forEach(p => {
            if (p.numEntidadFinanciera == this.model.personaEF.entidadFinanciera.cveEntidadFinancieraSipre) {
              this.montonuevo = Number(p.saldoCapital) + this.montonuevo;
              flag = true;
            }
          });
          if (flag) {
            this.modalService.open("preguntaRegistroMonto");
          } else {
            this.registrarPrestamo();
          }
        }
      });
  }

  onPrestamoVigenteSeleccionado(idPrestamoVigente: string) {
    this.validarCondiciones();
  }

}
