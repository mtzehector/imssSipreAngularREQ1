import { EntidadFederativa } from './entidad.federativa';
import { EstadoSolicitudFol } from './estado.solicitud.fol';
import { OrigenSolicitud } from '../origen.solicitud';
import { Persona } from '../persona';

export class Solicitud {
  
  id?: number;
  origenSolictud?: number;
  estadoSolicitud?: string;
  numFolioSolicitud?:string;
  refTrabajador?:string;
  fecVigenciaFolio?:string;
  altaRegistro?:string;
  curp?:string;
  nss?:string;
  delegacion?:string;
  subDelegacion?:string;
  grupoFamiliar?:string;
  entidadFederativa?:string;
  cveEstadoSolicitud?: EstadoSolicitudFol;
  cveOrigenSolicitud?: OrigenSolicitud;
  idSolPrFinanciero?: string;
  motivoBaja?: any;
  motivoBajaSolicitud?:any;
  mejorOferta:number=1;
  cveEntidadFinMejorOferta: number;
  persona?:Persona =new Persona();
  }