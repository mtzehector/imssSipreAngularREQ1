import { Persona } from '../persona';
import { Documento } from 'src/app/common/domain/documento';
import { RenapoCurpOut, ValidarCandidatoOperadorRs } from 'src/app/common/domain/validar.candidato.operador.rs';
import { EstadoPersonaEF } from './estadoPersonaEF';

export class Operador extends Persona {
  correoElectronico?: string;
  cveCurp?: string;
  cveEntidadFinanciera?: number;
  cvePersonalEf?: number;
  estadoPersonaEf?: number;
  fecNacimiento?: string;
  documentoIdentOficial?: Documento;
  numEmpleado?: string;
  numNss?: string;
  desEstadoPersonaEf?: string;
  otrosDatosJson?: string;
  registroPatronal?: string;
  telCelular?: string;
  tipoEmpleado?: any;
  candidatoRs? : ValidarCandidatoOperadorRs;
  idDocumentoIdentOfic?: number;
  sexo?: string;
  desEntidadNac? : string;
  rfc?: string;
  renapoOut? : RenapoCurpOut;
  operacionRegistro?: string = "new";
  idEstadoPersonaEF?: number;
  baja?:number;
  sexoDescripcion : string;
  cveSexo :number;
  estadoVital :string;
  entidadFederativaNacimiento: string; 
  cveEstadoVital?:number;
  cveEstadoPersonaEf?: EstadoPersonaEF;
  firmaCartaRecibo?: number;
}


