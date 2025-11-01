
export interface PrestamosVigentes {
  idSolicitud: string; 
  folio: string; 
  descripcionEntidadFinanciera:string;
  cat:string
  montoSolicitado:string;
  descuentoMensual:string;
  mensualidadesDescontadas:string;
  mensualidadesSinDescuento:string;
  descripcionPlazo:string;
  condicionOferta:number;
  NumPlazos:any;
  nombreComercialEF:string;
  saldoCapital?:any;
  clabe?:string;
  correoAdminEF?: string;
  flagEditRen : boolean;
  saldoCapitalOriginal : number;
  numFolioSolicitud : string;
  numMesesConsecutivos?: number;
}
