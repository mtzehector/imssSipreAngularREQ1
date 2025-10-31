import { Component, OnInit } from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/base.component';
import { PersonaEF, FechaPrimerDescuento, Bitacora, Oferta } from "src/app/common/domain";
import { ModalService, PlazoCondicionesService, PromotorService, PrestamoService, BitacoraService } from 'src/app/common/services';
import { Model } from "src/app/model";
import { DataService } from "../../data.service";
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { PlazoCondiciones } from 'src/app/common/domain/plazo.condiciones';
import { PersonaRequest } from '../../common/domain/persona-request';
import { CondicionesPrestamo } from '../../common/domain/condicion.prestamo';
import { TipoBitacora } from 'src/app/common/domain/tipo.bitacora';
import { SolicitudesVigentesService } from 'src/app/common/services/solicitudes.vigentes.service';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { Plazo } from 'src/app/common/domain/plazo';
import { PrestamoPromotor } from 'src/app/common/domain/prestamo-promotor';
import { Prestamo } from 'src/app/common/domain/prestamo';


@Component({
  selector: 'app-reinstalar-prestamo-editar',
  templateUrl: './reinstalar-prestamo-editar.component.html',
  styleUrls: ['./reinstalar-prestamo-editar.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class ReinstalarPrestamoEditarComponent extends BaseComponent implements OnInit {
  public model: Model;
  public regexNumeroDecimal: string = '[0-9]+(\.[0-9][0-9]?)?';
  public regexCat: string = '[0-9]+(\.[0-9]{1,10}?)?';
  formGroup: FormGroup;
  rol: string;
  plazosCondiciones: PlazoCondiciones[] = [];
  condiciones: CondicionesPrestamo = new CondicionesPrestamo();
  personaEF: PersonaEF = new PersonaEF();
  primerdescuento: string;
  fecha: string;
  fechaNom: string;
  montoTotal: string = "";
  descuentoMensual: string = "";
  capacidadOriginal: number;
  catSeleccionado: number = null;
  plazoSeleccionado: Plazo = null;
  validacionesPersonalizadasExitosas: boolean = false;
  idOfertaSeleccionada: number;
  pension: number;
  pensionGarantizada: number;
  descMensual: number;

  constructor(protected data: DataService,
    private router: Router,
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
    this.rol = 'operadorEF';
    this.validacionesPersonalizadasExitosas = false;
  }

  private crearFormulario() {
    this.formGroup = this.formBuilder.group(
      {
        montoSolicitado: ['', [Validators.required, Validators.pattern(this.regexNumeroDecimal)]],
        descuentoMensual: ['', [Validators.required]],
        montoPagar: ['', [Validators.required]],
        fechaNominal: ['', [Validators.required]],
        plazoCondicion: ['', [Validators.required]]
      }
    );
  }

  private generaRespaldoCapacidadCredito() {
    this.capacidadOriginal = this.model.capacidadPensionado;
  }

  private obtienePrestamoRecuperacion() {
    let p = this.model.prestamoPromotor.prestamoVigente;

    let pr = new PrestamoRecuperacion();
    pr.numSolicitudSipre = p.idSolicitud;
    pr.canCatPrestamo = Number(p.cat);
    pr.canDescuentoMensual = Number(p.descuentoMensual);
    pr.canMontoSol = Number(p.montoSolicitado);
    pr.numPlazoPrestamo = Number(p.descripcionPlazo);
    pr.numMesRecuperado = Number(p.mensualidadesSinDescuento);
    pr.numEntidadFinanciera = p.descripcionEntidadFinanciera;
    pr.nombreComercial = p.nombreComercialEF;
    pr.saldoCapital = Number(p.saldoCapital);
    pr.numFolioSolicitud = p.numFolioSolicitud;

    this.model.prestamoRecuperacion = pr;
    this.model.prestamosRecuperacionArreglo = [];
    this.model.prestamosRecuperacionArreglo.push(this.model.prestamoRecuperacion);
  }

  private ajustaCapacidadCredito() {
    this.model.capacidadPensionado = this.capacidadOriginal + 
      this.model.prestamoRecuperacion.canDescuentoMensual;
  }

  private limpiaMensaje() {
    this.data.model.mensaje.mensaje = "";
    this.data.model.mensaje.level = "";
  }

  private asignaFechaPrimerDescuento(primerDescuentoResponse: FechaPrimerDescuento) {
    this.primerdescuento = primerDescuentoResponse.nominaPrimerDescuento;
    this.fecha = (primerDescuentoResponse.fecDescNomina).substring(0, 10);
    this.formGroup.patchValue({
      fechaNominal: this.fecha
    });
  }

  private obtieneFechaPrimerDescuento() {
    let formatoDeFecha = formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'en');
    let diaActual: string = '{\"fecInicio\"' + ':' + '"' + formatoDeFecha + '"}';
    this.prestamoService.getlistaPrestamo(diaActual)
      .subscribe((primerDescuentoResponse: FechaPrimerDescuento) => this.asignaFechaPrimerDescuento(primerDescuentoResponse));
  }

  private insertaPlazosCondiciones(response: PlazoCondiciones[]) {
    this.plazosCondiciones = [];
    response.forEach(element => {
      if (element.cat > 0.0) 
        this.plazosCondiciones.push(element);
    });
  }

  private obtienePlazosEntidadFinanciera() {
    this.plazoCondicionesService.getPlazo(this.model.personaEF.entidadFinanciera.id).subscribe(
      (response: PlazoCondiciones[]) => this.insertaPlazosCondiciones(response));
  }

  private generaBitacora() {
    let bitacora: Bitacora = new Bitacora();
    bitacora.curp = this.data.model.persona.curp;
    bitacora.sesion = this.data.model.sesion;
    bitacora.tipo = TipoBitacora.CONSULTA_DATOS_PENSIONADO;
    bitacora.sesion = this.data.model.sesion;
    this.bitacoraService.create(bitacora).subscribe((bitacora: Bitacora) => {});
  }

  ngOnInit() {
    this.crearFormulario();
    this.generaRespaldoCapacidadCredito();
    this.obtienePrestamoRecuperacion();
    this.ajustaCapacidadCredito();
    this.limpiaMensaje();
    this.obtieneFechaPrimerDescuento();
    this.obtienePlazosEntidadFinanciera();
    this.generaBitacora();
  }

  private validarMontoTotalAPagar() : boolean {
    if (Number(this.montoTotal) <= Number(this.model.prestamoPromotor.prestamoVigente.saldoCapital))
      return true;
    
    this.data.model.mensaje.mensaje = "El monto total a pagar debe ser menor o igual al saldo capital del préstamo a reinstalar. Favor de verificar.";
    this.data.model.mensaje.level = "danger";
    this.modalService.close("carga");
    return false;
  }

  private obtenerCATSeleccionado() {    
    let plazoCondicion: PlazoCondiciones = this.formGroup.get('plazoCondicion').value;
    this.catSeleccionado = plazoCondicion.cat;
    this.plazoSeleccionado = plazoCondicion.plazo;
    this.idOfertaSeleccionada = plazoCondicion.id;
  }

  private validaCATSeleccionado(): boolean {
    this.obtenerCATSeleccionado();

    if (!(this.catSeleccionado <= Number(Number(this.model.prestamoPromotor.prestamoVigente.cat).toFixed(2)))) {
      this.data.model.mensaje.mensaje = "El CAT ofrecido debe ser menor al CAT del préstamo a reinstalar. Favor de verificar.";
      this.data.model.mensaje.level = "danger";
      this.modalService.close("carga");
      return false;
    }
    
    return true;
  }

  private validarPensionGarantizada() : boolean {
    if (this.pension - this.descMensual >= this.pensionGarantizada)
      return true;
    
    this.data.model.mensaje.mensaje = "Por las condiciones del préstamo solicitado no es posible realizar la reinstalación. Favor de validar";
    this.data.model.mensaje.level = "danger";
    return false;
  }

  validarCondiciones() {
    this.validacionesPersonalizadasExitosas = false;

    if (
      this.formGroup.get('montoSolicitado').invalid || 
      this.formGroup.get('plazoCondicion').invalid) {
      return;
    }

    this.modalService.open("carga");

    if (!this.validaCATSeleccionado())
      return;
    
    this.formGroup.patchValue({ montoPagar: "" });
    this.formGroup.patchValue({ descuentoMensual: "" });

    let condiciones = this.formGroup.value;
    condiciones.plazo = this.plazoSeleccionado;
    condiciones.cat = this.catSeleccionado.toString();

    let persona = new PersonaRequest();
    persona.plazo = this.plazoSeleccionado;
    persona.cat = this.catSeleccionado.toString();
    persona.prestamo = condiciones;
    persona.prestamo.plazo = persona.plazo;
    persona.prestamo.cat = persona.cat;
    
    this.model.prestamoPromotor.personaRequest = persona;
    this.personaEF = this.model.personaEF;
    this.model.prestamoPromotor.personaEF = this.personaEF;

    this.model.prestamoPromotor.prestamosRecuperacionArreglo = this.model.prestamosRecuperacionArreglo;
    this.model.prestamoPromotor.capacidad.impCapacidadTotal = this.model.capacidadPensionado;

    this.promotorService.validarCondiciones(this.model.prestamoPromotor).subscribe(
      response => {
        this.montoTotal = (Math.round((Number.parseFloat(response.montoPagar) + Number.EPSILON) * 100) / 100).toString();
        this.descMensual = (Math.round((Number.parseFloat(response.descuentoMensual) + Number.EPSILON) * 100) / 100);
        this.descuentoMensual = (Math.round((Number.parseFloat(response.descuentoMensual) + Number.EPSILON) * 100) / 100).toString();
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        });

        this.formGroup.patchValue({ montoPagar: formatter.format(Math.round((Number.parseFloat(response.montoPagar) + Number.EPSILON) * 100) / 100) });
        this.formGroup.patchValue({ descuentoMensual: formatter.format(Math.round((Number.parseFloat(response.descuentoMensual) + Number.EPSILON) * 100) / 100) });

        this.pension = (Math.round((Number.parseFloat(this.model.montoPension) + Number.EPSILON) * 100) / 100);
        this.pensionGarantizada = (Math.round((Number.parseFloat(this.model.montoPensionGarantizada) + Number.EPSILON) * 100) / 100);        

        if (this.validarMontoTotalAPagar() && this.validarPensionGarantizada()) 
          this.validacionesPersonalizadasExitosas = true;

        this.modalService.close("carga");
      }
    );
  }

  continuarNo() {
    this.modalService.close("preguntaRegistroMonto");
  }

  confirmarMonto() {
    this.modalService.open("carga");
    this.solicitudesVigentesService.ValidaMontoDescuento(this.model.pensionado.nss, this.descuentoMensual)
      .subscribe((valido: number) => {
        this.modalService.close("carga");
        if (valido == 1) {
          this.data.model.mensaje.mensaje = "No es posible continuar con el préstamo debido a que existe otro préstamo con el mismo importe mensual, favor de intentar nuevamente solicitando un importe de préstamo distinto.";
          this.data.model.mensaje.level = "warning";
        } else 
          this.modalService.open("preguntaRegistroMonto");
      });
  }

  private validarDescuentoMensual(): boolean {
    if (this.model.capacidadPensionado < this.descuentoMensual) {
      this.data.model.mensaje.mensaje = "No se cuenta con capacidad suficiente para realizar la reinstalación del préstamo, favor de revisar.";
      this.data.model.mensaje.level = "danger";
      this.modalService.close("carga");
      return false;
    }
    return true;
  }

  actualizaInformacionCartaReinstalacion(response: PrestamoPromotor) {
    this.model.capacidadPensionado = this.capacidadOriginal;
    this.model.prestamoPromotor.persona = response.persona;
    this.model.prestamoPromotor.capacidad = response.capacidad;
    this.model.prestamoPromotor.solicitud = response.solicitud;
    this.model.prestamoPromotor.personaEF = response.personaEF;
    this.model.prestamoPromotor.prestamo = response.prestamo;
    this.model.prestamoPromotor.personaRequest = response.personaRequest;
    this.model.prestamoPromotor.personaRequest.telLocal = response.persona.telLocal;
    this.model.prestamoPromotor.personaRequest.telCelular = response.persona.telCelular;
    this.model.prestamoPromotor.personaRequest.correoElectronico = response.persona.correoElectronico;
    //this.model.prestamoPromotor.condicionOfertaCrud = response.condicionOfertaCrud;
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
  }

  async registrarPrestamo() {
    this.modalService.close("preguntaRegistroMonto");
    this.limpiaMensaje();
    this.modalService.open("carga");

    let persona = new PersonaRequest();
    persona = this.formGroup.value;
    persona.plazo = this.plazoSeleccionado;
    persona.cat = this.catSeleccionado.toString();

    if (this.validarDescuentoMensual()) {
      this.condiciones.cat = persona.cat;
      this.condiciones.descuentoMensual = this.descuentoMensual;
      this.condiciones.montoPagar = this.montoTotal;
      this.condiciones.montoSolicitado = persona.montoSolicitado;
      this.condiciones.plazo = persona.plazo;
      this.model.prestamoPromotor.personaRequest = persona;
      this.model.prestamoPromotor.personaRequest.prestamo = this.condiciones;
      this.personaEF = this.model.personaEF;
      this.model.prestamoPromotor.personaEF = this.personaEF;
      this.model.prestamoPromotor.oferta = new Oferta();
      this.model.prestamoPromotor.oferta.id = this.idOfertaSeleccionada;


      this.promotorService.registrarReinstalacionPrestamo(this.model.prestamoPromotor).subscribe(
        response => {
          this.actualizaInformacionCartaReinstalacion(response);
          this.modalService.close("carga");
          this.router.navigate(['/operadorEF/reinstalarPrestamoInforme']);
        },
        error => {
          this.router.navigate(['/operadorEF/home'],
            {
              queryParams:
              {
                accion: "regPrestamo",
                status: "error",
              }
            });
        }
      );
    } else
      this.modalService.close("carga");
  }

  regresar() {
    this.router.navigate(['/operadorEF/buscarFolioAutorizar']);
  }

}
