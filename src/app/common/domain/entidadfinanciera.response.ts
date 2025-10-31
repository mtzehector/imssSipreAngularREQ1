import { Oferta } from './oferta';

export class EntidadFinancieraResponse {  
  id:number;
  nombreComercial:string;
  razonSocial:string;
  numTelefono:string;
  paginaWeb:string;
  oferta:Oferta;
}

