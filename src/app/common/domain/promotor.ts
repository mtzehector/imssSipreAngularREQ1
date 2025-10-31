import { Persona } from '../persona';
import { Documento } from 'src/app/common/domain/documento';
import { Delegacion } from 'src/app/common/domain/delegacion';

export class Promotor extends Persona {
  nss?: string;
  fechaNacimiento?: any;
  estadoVital?: string;
  sexo?: string;
  sexoDescripcion?: string;
  entidadFederativaNacimiento?: string;
  tipoEmpleado?: any;
  entidadFederativa?: any;
  domicilio?: any;
  numEmpleado?: string;
  numNss?:string;
  registroPatronal?: string;
  telefonoCelular?: string;
  ife?: Documento;
  cartaResponsiva?: Documento;
  fotografia?: Documento;
  comprobanteDomicilio?: Documento;
  estatus?: string;
  estadoPersonaEf?:number;
  idMotivoBaja?:number;
  cveEntidadFinanciera?:number;
  cvePersonalEf?:number;
  cveEstadoVital?:number;
  cveTipoEmpleado?:number;
  cveCurp?:string;
  fecNacimiento?:string;
  telLocal?:string;
  telCelular?:string;
  correoElectronico?:string;
  cveSexo?:number;
  cvePerfil?: number;
  delegaciones?: Delegacion[];
  imgB64?: string;
}


