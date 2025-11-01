import { EntidadFederativa } from './entidad.federativa';
import { Delegacion } from './delegacion';

export interface Pension {
  idNss: string;  
  idGrupoFamiliar: string;
  claveDelegacion: string;
  delegacion: Delegacion;
  subDelegacion: string;
  entidadFederativa:EntidadFederativa;
  curp:string;
  sexo:number;
  fechaNacimiento: string;
  cuentaClabe:string;
  desTipoPension:string;
}

