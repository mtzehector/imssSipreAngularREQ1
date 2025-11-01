import { Persona } from '../persona';
import { Solicitud } from './solicitud';
import { TipoDocumento } from './tipo.documento';

export class Documento {
  id?: number;
  cveSolicitud?: string;
  cveEntidadFinanciera?: number;
  cvePrestamoRecuperacion?: number;
  numEntidadFinancieraSIPRE?:string
  folioSIPRE?:string
  tipoDocumento?: number;
  tipoDocumentoEnum?: TipoDocumento;
  refDocBoveda?: string;
  //TODO: validar quitar este campo
  numFolioSolicitud?: string;
  // "descTipoDocumento": "Contrato"
  // "tipoDocumento": 5,
  refSello?: string;
  refDocumento?: string;
  altaRegistro?: string;
  bajaRegistro?: string;
  actualizacionRegistro?: string;
  cadenaOriginal?: string;
  sello?: string;
  noSerie?: string;
  idSello?: string;
  archivo?: string;
  refIndexNot?: number;
  referenciaBoveda?: string;
  cveDocumento?: number;
  nombreDocNotificacion?: string;
}


export class CargaDocumento {
  persona?: Persona;
  //CURP
  documento?: Documento;
  //claveTipoDocumento
  solicitud?: Solicitud;
  //numFolioSolicitud
  contenido?: string;
  nombreArchivo?: NombreArchivo;



}

export class NombreArchivo {
  nombre?: string;
  archivo?: File;
}