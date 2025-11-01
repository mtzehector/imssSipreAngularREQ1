export class EstadoSolicitud { 

  static INICIADO: number = 1;
  static POR_AUTORIZAR: number = 2;
  static AUTORIZADO: number = 3;
  static PENDIENTE_CARGAR_COMPROBANTE: number = 4;
  static PENDIENTE_MONTO_A_LIQUIDAR: number = 5;
  static CANCELADO: number = 6;
  static PRESTAMO_SUSPENDIDO: number = 7;
  static PRESTAMO_RECUPERACION: number = 8;    
  static BAJA_POR_LIQUIDACION_ANTICIPADA: number = 9;
  static BAJA_POR_COMPRA_DE_CARTERA: number = 10;
  static BAJA_POR_LIQUIDACION_TOTAL: number = 11;
  static BAJA_POR_DEFUNCION_IRRECUPERABLE: number = 12;
  static BAJA_POR_IMPROCEDENCIA: number = 13;
  static POR_ASIGNAR_PROMOTOR: number = 15;
  static DESCUENTOS_NO_APLICADOS: number = 22;
  
}

