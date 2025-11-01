import { Documento, TipoDocumento } from "../../domain";

export class DetalleConsultaNotificacion {
  notificacion: Notificacion;
  prestamo: Prestamo[];
  request: Request;
}
export interface McltNotificacionDocumento {
  id: number;
  altaRegistro: string;
  bajaRegistro?: any;
  actualizacionRegistro?: any;
  cveNotificacion: number;
  cveDocumento: number;
  cveTipoDocumento: number;
  referenciaBoveda: string;
  tipoDocumentoEnum?: TipoDocumento;
  tipoDocumento?: number;
}

export interface TipoNotificacion {
  id: number;
  desTipoNotificacion: string;
}

export interface SubTipoNotificacion {
  id: number;
  desSubTipoNotificacion: string;
  cveTipoNotificacion: number;
}

export interface EstadoNotificacion {
  id: number;
  desEstadoNotificacion: string;
}

export interface EntidadFinanciera {
  id: number;
  nombreComercial: string;
  razonSocial: string;
  numTelefono?: any;
  paginaWeb: string;
  correoElectronico: string;
  correoAdminEF?: any;
  catPromedio?: any;
  idSipre: string;
  telefonoAtencionClientes: string;
  imgB64?: any;
  cveEntidadFinancieraSipre?: any;
}

export interface Notificacion {
  id: number;
  cveEntidadFinanciera?: any;
  cveTipoNotificacion?: any;
  cveSubTipoNotificacion?: any;
  fecVencimiento?: any;
  descNotificacion: string;
  reqNotificacion?: any;
  folioNotificacion: string;
  cveEstadoNotificacion?: any;
  notPrestamo?: any;
  mcltNotificacionDocumento: McltNotificacionDocumento[];
  tipoNotificacion: TipoNotificacion;
  subTipoNotificacion: SubTipoNotificacion;
  altaRegistro: string;
  estadoNotificacion: EstadoNotificacion;
  entidadFinanciera: EntidadFinanciera;
  documentos: Documento[];
  setBitacora: SetBitacora[];
  resolucion?: string;
}

export interface CveEstadoSolicitud {
  id: number;
  desEstadoSolicitud: string;
  desPensionadoEstadoSolicitud?: any;
}

export interface CveOrigenSolicitud {
  id: number;
  desOrigenSolicitud: string;
}

export interface Persona {
  id: number;
  cveIdPersona?: any;
  curp?: any;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  telefono?: any;
  nss?: any;
  fechaNacimiento?: any;
  sexo?: any;
}

export interface EntidadFinanciera2 {
  id: number;
  nombreComercial: string;
  razonSocial: string;
  numTelefono?: any;
  paginaWeb: string;
  correoElectronico: string;
  correoAdminEF?: any;
  catPromedio?: any;
  idSipre: string;
  telefonoAtencionClientes: string;
  imgB64?: any;
  cveEntidadFinancieraSipre?: any;
}

export interface SetBitacora {
  id: number;
  cveNotificacion: number;
  curp: string;
  estadoNotificacion: EstadoNotificacion;
  altaRegistro: string;
  fecNuevoVencimiento: string;
}

export interface CveSolicitud {
  id: number;
  origenSolictud?: any;
  estadoSolicitud?: any;
  numFolioSolicitud: string;
  refTrabajador: string;
  fecVigenciaFolio: string;
  fecSIPREModifica?: any;
  consecutivo?: any;
  numAnio?: any;
  altaRegistro: string;
  curp?: any;
  nss: string;
  delegacion: string;
  subDelegacion?: any;
  grupoFamiliar: string;
  entidadFederativa?: any;
  cveEstadoSolicitud: CveEstadoSolicitud;
  cveOrigenSolicitud: CveOrigenSolicitud;
  cveEntidadFinanciera?: any;
  idSolPrestamo?: any;
  isSPES: number;
  idSolPrFinanciero?: any;
  cvePromotor: number;
  mejorOferta: number;
  indSIPREStatus: number;
  cveEntidadFinMejorOferta?: any;
  maxHoursFechaVigencia: number;
  persona: Persona;
  entidadFinanciera: EntidadFinanciera2;
}

export interface CvePlazo {
  id: number;
  desPlazo: string;
  numMeses: number;
}

export interface CveCondicionOferta {
  id: number;
  cveEntidadFinanciera: number;
  porTasaAnual: number;
  porCat: number;
  cvePlazo: CvePlazo;
}

export interface CveTipoCredito {
  id: number;
  desTipoCredito: string;
}

export interface CveTipoSimulacion {
  id: number;
  desTipoSimulacion: string;
}

export interface Prestamo {
  desEstadoPrestamo?: any;
  desTipoCredito?: any;
  fechaAlta?: any;
  numSolicitud?: any;
  id: number;
  nss?: any;
  curp?: any;
  fechaVencimiento?: any;
  cat?: any;
  desPlazo?: any;
  pensionado?: any;
  cveSolicitud: CveSolicitud;
  impMontoSol: number;
  impDescuentoNomina: number;
  impTotalPagar: number;
  fecPrimerDescuento: string;
  numPeriodoNomina?: any;
  refCuentaClabe?: any;
  cveCondicionOferta: CveCondicionOferta;
  cveTipoCredito: CveTipoCredito;
  cveTipoSimulacion: CveTipoSimulacion;
}

export interface Request {
  cveNotificacion: number;
  cveEntidadFinanciera: number;
}
