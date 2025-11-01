import { Persona } from './common/persona';
import { Pensionado } from './common/domain/pensionado';
import { PrestamosVigentes } from './common/domain/prestamos.vigentes';
import { Plazo } from './common/domain/plazo';
import { Pension } from './common/domain/pension';
import { Mensaje } from './common/domain/mensaje';
import { CapacidadCredito } from './common/domain/capacidad.credito';
import { EntidadFinanciera } from './common/domain/entidad.financiera';
import { Prestamo } from './common/domain/prestamo';
import { Documento } from 'src/app/common/domain/documento';
import { CartaCapacidadCredito } from './common/domain/carta.capacidad.credito';
import { Solicitud } from './common/domain/solicitud';
import { DatosOferta} from 'src/app/common/domain/datos.oferta';
import { CartaInstruccion } from './common/domain/carta.instruccion';
import { Clabe } from './common/domain/clabe';
import { ClabeResponse } from './common/domain/clabeResponse';


import { Simulacion } from './common/domain/simulacion';
import { PersonaEF } from './common/domain/persona.ef';
import { CancelarSolicitud } from './common/domain/cancelar.solicitud';
import { PrestamoAutorizado } from './common/domain/prestamo.autorizado';
import { UploadDocumento } from './common/domain/upload.documento';
import { Promotor, EntidadFinancieraCrud, Notificacion} from './common/domain';
import { InformacionEF} from './common/domain/informacionEF';
import { PlazoBeneficio} from 'src/app/operadorEF/condicion-ef/model/plazoBeneficio';
import { CondicionesForm} from 'src/app/operadorEF/condicion-ef/model/condicionesForm';
import { PrestamoPromotor } from 'src/app/common/domain/prestamo-promotor';
import { User } from 'src/app/common/domain/user';
import { EntidadFinancieraSIPRE } from 'src/app/common/domain/entidadFinancieraSIPRE';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { EntidadFinancieraSIPREResponse } from './common/domain/entidadFinancieraSIPREResponse';
import { AltModEntFinancierasRequest } from './common/domain/altModEntFinancierasRequest';

import { SaldoCapitalRequest } from './common/domain/saldoCapital-Request';
import { SaldoCapitalResponse } from './common/domain/saldoCapital-Response';
import { FolioVigente } from './common/domain/folio.vigente';
import { Delegacion } from 'src/app/common/domain/delegacion';
import { NotificacionModel } from './common/domain/notificacion.model';
import { Operador } from './common/domain/operador';
import { DetalleConsultaNotificacion } from './common/notificaciones/model/detalle.consulta.notificacion';
import { Reporte } from './common/domain/reporte';
import { RegistroPatronal } from './common/domain/registro-patronal';
import { CartasRecibo } from './common/domain/CartasRecibo';
import { CartaInstruccionRequest } from './common/domain/carta.instruccion.request';



export class Model {
  //Comunes
  sumaPrestamoRecuperacion : any = 0;
  pendientePagarRecuperacion : any =0;
  sesion : number = 0;
  persona: Persona = new Persona(); 
  user: User = new User(); 
  name: string;
  error: string;
  mensaje: Mensaje = new Mensaje();
  mensajeTiempoSesion: Mensaje = new Mensaje();
  mensajeAux: Mensaje = new Mensaje();
  documento : Documento = new Documento();
  entidadFinanciera: EntidadFinanciera;
  uploadDocumento: Documento[] = [];
  cvePerfil_Pensionado=1;
  cvePerfil_Administrador_EF=2;
  cvePerfil_Promotor=3;
  cvePerfil_Operador_EF=4;
  cvePerfil_Administrador_IMSS=5;
  cvePerfil_Operador_IMSS=6;
  rol: string;
  flatCorreoAdminEF: any;
  flatCurpAdminEF: any;
  flatRfcAdminEF: boolean;
  flatPlazosModEF: boolean = true;
  flagRegPAtModEF: boolean = true;
  flagMontoRenovacion: boolean = false;
  // Modelo Pensionado
  prestamo: Prestamo = new Prestamo();
  plazoSel: Plazo[] = [];
  plazoResponse: Plazo;
  plazo: Plazo;
  plazos: Plazo[] = [];
  monto: string;
  pensionado: Pensionado = new Pensionado();
  prestamosVigentes: PrestamosVigentes;
  capacidadCredito : CapacidadCredito = new CapacidadCredito();
  pensiones : Pension[] = [];
  prestamosRecuperacionArreglo: PrestamoRecuperacion[] = [];
  montoMaximoPrestar:Number=0;
  prestamosVigentesArreglo: PrestamosVigentes[] = [];
  cartaCapacidadCredito: CartaCapacidadCredito = new CartaCapacidadCredito();
  solicitud : Solicitud;
  ofertaDatos: DatosOferta = new DatosOferta();
  simulacion : Simulacion = new Simulacion();
  sumaDescuentoTotal : any = 0.00;
  saldoCapitalTotal : any = 0.00;
  prestamoRecuperacion : PrestamoRecuperacion = new PrestamoRecuperacion(); // Para la consulta de prestamos en recuperacion.
  //Modelo Promotor 
  personaEF: PersonaEF = new PersonaEF();
  cartaInstruccion: CartaInstruccion = new CartaInstruccion();
  prestamoPromotor: PrestamoPromotor = new PrestamoPromotor();
  registrarPromotor = new Promotor();
  //Modelo de OperadorEF
  solicitudSeleccionada: Solicitud;
  informeCartaInstruccion: CartaInstruccion = new CartaInstruccion();
  folioVigente: FolioVigente = new FolioVigente();
  cancelarSolicitud: CancelarSolicitud = new CancelarSolicitud();
  prestamoAutorizado: PrestamoAutorizado = new PrestamoAutorizado();
  resumenCartaInstruccion: PrestamoAutorizado = new PrestamoAutorizado();
  enabledModificarPromotor: boolean = false;
  enabledBajaPromotor: boolean = false;
  mostrarExitoRegistro: boolean = false;
  mostrarExitoModificacionBaja: boolean = false;
  //Modelo de OperadorIMSS
  registrarEntidadFinanciera: EntidadFinancieraCrud = {mclcEstadoEf: {}};
  enabledModificarEntidad: boolean = false;
  esNuevoRegistroEntidadFinanciera: boolean = false;
  //Consulta
  informacionEF: InformacionEF = new InformacionEF();
  plazosConsulta: PlazoBeneficio[];
  condicionesFormConsulta: CondicionesForm = new CondicionesForm();
  condicionesArray= new Array();
  cvePerfil: number =4;
  clabe :Clabe;
  clabeOK:boolean=false;
  clabeResponse :ClabeResponse;
  EntidadFinancieraSIPRE : EntidadFinancieraSIPRE;
  EntidadFinancieraSIPREResponse :EntidadFinancieraSIPREResponse;
  AltModEntFinancierasRequest : AltModEntFinancierasRequest;
  idInstFinanciera: number=0;
  SaldoCapitalRequest:SaldoCapitalRequest = new SaldoCapitalRequest();
  SaldoCapitalResponse :SaldoCapitalResponse = new SaldoCapitalResponse();
  registrosPatronalesArray: RegistroPatronal[];
  // Login
  buttonSubmitStatus: boolean = false;
  userLoginValid: boolean = false;
  //Promotor
  buttonBusqFolioPromotor: boolean = false;
  buttonPrestamoPromotor: boolean = false;
  buttonPrestamoPromotorEdit: boolean = false;
  capacidadPensionado: any;
  //global reucperacion
  mclcDelegacionesCollection?: Delegacion[];
  delegacionesEFCollection?: Delegacion[];
  //notificaciones
  notificacionModel: NotificacionModel = new NotificacionModel();
  flagNotMsj: boolean;
  flagAtencionNot:boolean;
  flagDocsNotificacion: boolean;
  flagReinstalacion: boolean = true;
  documentosNot: Documento[] = [];
  folioNotificacion: string;
  notificacionVerDetalle: DetalleConsultaNotificacion = new DetalleConsultaNotificacion();

  // CRUD Operador EF
  operador?:Operador = new Operador();

  //Reportes
  reporte: Reporte = new Reporte();

  //Operaciones Prestamos
  //1- BAJA
  //2- SUSPENSION
  //3- REANUDACION
  tipoOperacion?: number=0;

  cartasRecibo? : CartasRecibo;
  
  iniciaBusquedaFolio?: boolean = true;
  camposBusqueda?: CartaInstruccionRequest;
  usuario?:string;
  montoPension: string;
  montoPensionGarantizada: string;

  public limpiarModel() {
    this.sumaPrestamoRecuperacion = 0;
    this.pendientePagarRecuperacion = 0;
    this.sesion = 0;
    this.persona = new Persona(); 
    this.user = new User(); 
    this.name = null;
    this.error = null;
    this.documento = new Documento();
    this.entidadFinanciera = null;
    this.uploadDocumento = [];
    this.rol = null;
    this.flatCorreoAdminEF = null;
    this.flatCurpAdminEF = null;
    this.flatRfcAdminEF = null;
    this.flatPlazosModEF = true;
    this.flagRegPAtModEF = true;
    this.flagMontoRenovacion = false;
    // Modelo Pensionado
    this.prestamo = new Prestamo();
    this.plazoSel = [];
    this.plazoResponse = null;
    this.plazo = null;
    this.plazos = [];
    this.monto = null;
    this.pensionado = new Pensionado();
    this.prestamosVigentes = null;
    this.capacidadCredito = new CapacidadCredito();
    this.pensiones = [];
    this.prestamosRecuperacionArreglo = [];
    this.montoMaximoPrestar = 0;
    this.prestamosVigentesArreglo = [];
    this.cartaCapacidadCredito = new CartaCapacidadCredito();
    this.solicitud = null;
    this.ofertaDatos = new DatosOferta();
    this.simulacion = new Simulacion();
    this.sumaDescuentoTotal = 0.00;
    this.saldoCapitalTotal = 0.00;
    this.prestamoRecuperacion = new PrestamoRecuperacion(); // Para la consulta de prestamos en recuperacion.
    //Modelo Promotor 
    this.personaEF = new PersonaEF();
    this.cartaInstruccion = new CartaInstruccion();
    this.prestamoPromotor = new PrestamoPromotor();
    this.registrarPromotor = new Promotor();
    //Modelo de OperadorEF
    this.solicitudSeleccionada = null;;
    this.informeCartaInstruccion = new CartaInstruccion();
    this.folioVigente = new FolioVigente();
    this.cancelarSolicitud = new CancelarSolicitud();
    this.prestamoAutorizado = new PrestamoAutorizado();
    this.resumenCartaInstruccion = new PrestamoAutorizado();
    this.enabledModificarPromotor = false;
    this.enabledBajaPromotor = false;
    this.mostrarExitoRegistro = false;
    this.mostrarExitoModificacionBaja = false;
    //Modelo de OperadorIMSS
    this.registrarEntidadFinanciera = {mclcEstadoEf: {}};
    this.enabledModificarEntidad = false;
    this.esNuevoRegistroEntidadFinanciera = false;
    //Consulta
    this.informacionEF = new InformacionEF();
    this.plazosConsulta = null;
    this.condicionesFormConsulta = new CondicionesForm();
    this.condicionesArray = new Array();
    this.cvePerfil = 4;
    this.clabe = null;;
    this.clabeOK = false;
    this.clabeResponse = null;;
    this.EntidadFinancieraSIPRE = null;;
    this.EntidadFinancieraSIPREResponse = null;;
    this.AltModEntFinancierasRequest = null;;
    this.idInstFinanciera = 0;
    this.SaldoCapitalRequest = new SaldoCapitalRequest();
    this.SaldoCapitalResponse = new SaldoCapitalResponse();
    this.registrosPatronalesArray = null;
    // Login
    this.buttonSubmitStatus = false;
    this.userLoginValid = false;
    //Promotor
    this.buttonBusqFolioPromotor = false;
    this.buttonPrestamoPromotor = false;
    this.buttonPrestamoPromotorEdit = false;
    this.capacidadPensionado = null;;
    //global reucperacion
    this.mclcDelegacionesCollection = null;
    this.delegacionesEFCollection = null;
    //notificaciones
    this.notificacionModel = new NotificacionModel();
    this.flagNotMsj = null;
    this.flagAtencionNot = null;
    this.flagDocsNotificacion = null;
    this.flagReinstalacion = true;
    this.documentosNot = [];
    this.folioNotificacion = null;
    this.notificacionVerDetalle = new DetalleConsultaNotificacion();
  
    // CRUD Operador EF
    this.operador = new Operador();
  
    //Reportes
    this.reporte = new Reporte();
  
    //Operaciones Prestamos
    //1- BAJA
    //2- SUSPENSION
    //3- REANUDACION
    this.tipoOperacion = 0;
  
    this.cartasRecibo = null;
    
    this.iniciaBusquedaFolio = true;
    this.camposBusqueda = null;
    this.usuario = null;
    this.montoPension = null;
    this.montoPensionGarantizada = null;
  }
}

