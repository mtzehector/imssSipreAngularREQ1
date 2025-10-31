import { Beneficio } from './beneficio';
import { EntidadFinancieraResponse } from './entidadfinanciera.response';
import { Plazo } from './plazo';
export interface Content {
     id: number;
     entidadFinancieraResponse:EntidadFinancieraResponse;
     monto: number;
     cat: number;
     descuentoMensual: number;
     plazo:Plazo;
     importeTotal: number;
     tasaAnual: number;  
     beneficios:Beneficio[];
     
}

