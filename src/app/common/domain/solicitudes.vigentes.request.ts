export class SolicitudesVigentesRequest {

  page:number;
  totalElements:number;
  totalPages:number;
  totalMclpeElements:number;
  pageSize:number;
  model:Modelo = new Modelo();
  }

  export class Modelo {

      nss:string;
      folio:string;
      estadoSolicitud:string;
      inicio:string;
      fin:string;
      cveEntidadFinanciera?:any;
   

  }