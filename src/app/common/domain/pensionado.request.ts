import { Delegacion } from './delegacion';
import { EntidadFederativa } from './entidad.federativa';

export class Pensionadorequest {
  sexo: string;
  fechaNacimiento: string;
  entidadFederativa: EntidadFederativa;
  delegacion: Delegacion;
}

