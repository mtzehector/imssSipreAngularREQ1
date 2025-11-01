import { EntidadFinanciera } from './entidad.financiera';
import { Plazo } from './plazo';
import { Beneficio } from './beneficio';
import { EntidadFinancieraResponse } from './entidadfinanciera.response';

export class Oferta {
  id?: number;
  entidadFinanciera?: EntidadFinanciera = new EntidadFinanciera();
  beneficios?:Beneficio; 
  plazo?: Plazo = new Plazo();
  tasaAnual?:string;
  cat?: string;
  monto?:string;
  descuentoMensual?:string;
  importeTotal?:string;
  
}

