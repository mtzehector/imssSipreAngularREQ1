export class CartaInstruccionRequest {

page:number;
model:Modelo = new Modelo();
  }

  export class Modelo {

      nss:string;
      folio:string;
      estadoSolicitud:string;
      inicio:string;
      fin:string;
      cveEntidadFinanciera?:any;
      flagRol: number;
      cvePromotor: number;
      flagExcel: boolean;

  }