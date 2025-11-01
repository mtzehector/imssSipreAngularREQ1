import { Documento } from 'src/app/common/domain/documento';
import { Delegacion } from 'src/app/common/domain/delegacion';

export class PromotorRequest {
  id?: any;
  estadoPersonaEf?: number;
  cveSexo?: number;
  cveEntidadFinanciera?: number;
  cvePersonalEf?: number;
  cveBitacoraPersona?: any;
  cveEstadoVital?: number;
  cveTipoEmpleado?: number;
  cveEntidadFederativa?: number;
  cveRefDomicilio?: string;
  domicilio?: any;
  cveCurp?: any;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  numEmpleado?: string;
  numNss?: string;
  usuario?: string;
  passwordUsu?: string;
  fecNacimiento?: any;
  registroPatronal?: string;
  telLocal?: string;
  telCelular?: string;
  indPassword?: string;
  correoElectronico?: string;
  baja ?: number;
  entidadFederativaNacimiento ?:any;
  cvePerfil?: number;
  ife?: Documento;
  cartaResponsiva?: Documento;
  fotografia?: Documento;
  comprobanteDomicilio?: Documento;
  delegaciones?:Delegacion[];
}


