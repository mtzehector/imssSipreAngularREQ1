import { Solicitud } from './solicitud';
import { Prestamo } from './prestamo';
import { Pensionado } from './pensionado';
import { Model } from 'src/app/model';

export class BuscarFolioImssRequest {
  
  page:number;
  model:Modelo = new Modelo();

  }


  export class Modelo {
    nss:string ="";
    folio:string="";
  }
 