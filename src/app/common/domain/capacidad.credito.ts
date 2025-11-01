import { TipoCredito } from './tipo.credito';

export class CapacidadCredito {
  impCapacidadFija ?: number;
  impCapacidadVariable? : number;
  impCapacidadTotal ?: number;
  cveSolicitud?:number;
  tipoCredito?:TipoCredito;
  cveCapacidad?:string;
}
