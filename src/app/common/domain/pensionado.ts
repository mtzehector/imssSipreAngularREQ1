import { EntidadFederativa } from './entidad.federativa';
import { Persona } from '../persona';
import { Delegacion } from './delegacion';

export class Pensionado extends Persona
{
  nss?: string;
  grupoFamiliar?: string;
  claveDelegacion?: string;
  delegacion?: Delegacion;
  subDelegacion?: string;
  entidadFederativa?:EntidadFederativa;
  curp?: string;
  sexo?: string;
  fechaNacimiento?: string;
  cuentaClabe?:string;
  tipoPension?:string;
  descDelegacion?: string;
  pension?: string;
  pensionGarantizada?: string;
  sesion?: number;
}
