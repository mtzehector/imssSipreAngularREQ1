import { Persona } from '../persona';
import { EntidadFinanciera } from './entidad.financiera';
import { Delegacion } from '../domain/delegacion';

export class PersonaEF extends Persona {
  idPersonaEF?: number;
  delegacion?: string;
  estadoPersonaEF?: string;
  tipoPersonaEF?: number;
  entidadFinanciera?: EntidadFinanciera = new EntidadFinanciera();
  nss?: string;
  numEmpleado?: string;
  cveEntidadFinanciera?: any;

  lstDelegaciones?: Delegacion[];
}

