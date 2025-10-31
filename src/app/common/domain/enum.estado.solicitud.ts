export class enumEstadoSolicitud { 
  static INICIADO: enumEstadoSolicitud = new enumEstadoSolicitud(1, "INICIADO");
  static POR_AUTORIZAR: enumEstadoSolicitud = new enumEstadoSolicitud(2, "POR AUTORIZAR");
  static AUTORIZADO: enumEstadoSolicitud = new enumEstadoSolicitud(3, "AUTORIZADO");
  static PENDIENTE_CARGAR_COMPROBANTE: enumEstadoSolicitud = new enumEstadoSolicitud(4,"PENDIENTE CARGAR COMPROBANTE");
  static PENDIENTE_MONTO_A_LIQUIDAR: enumEstadoSolicitud = new enumEstadoSolicitud(5, "PENDIENTE MONTO A LIQUIDAR");
  static CANCELADO: enumEstadoSolicitud = new enumEstadoSolicitud( 6, "CANCELADO");
  static PRESTAMO_SUSPENDIDO: enumEstadoSolicitud = new enumEstadoSolicitud(7,"PRESTAMO SUSPENDIDO");
  static PRESTAMO_RECUPERACION: enumEstadoSolicitud = new enumEstadoSolicitud( 8, "PRESTAMO RECUPERACION");    
  static BAJA_POR_LIQUIDACION_ANTICIPADA: enumEstadoSolicitud = new enumEstadoSolicitud(9,"BAJA POR LIQUIDACION ANTICIPADA");
  static BAJA_POR_COMPRA_DE_CARTERA: enumEstadoSolicitud = new enumEstadoSolicitud(10,"BAJA POR COMPRA DE CARTERA");
  static BAJA_POR_LIQUIDACION_TOTAL: enumEstadoSolicitud = new enumEstadoSolicitud(11,"BAJA POR LIQUIDACION TOTAL");
  static BAJA_POR_DEFUNCION_IRRECUPERABLE:  enumEstadoSolicitud = new enumEstadoSolicitud(12, "BAJA POR DEFUNCION IRRECUPERABLE");
  static BAJA_POR_IMPROCEDENCIA: enumEstadoSolicitud = new enumEstadoSolicitud(13,"BAJA POR IMPROCEDENCIA");
  static INVALIDO: enumEstadoSolicitud = new enumEstadoSolicitud(13,"NO SE ENCONTRO TIPO DE ESTADO");
  static DESCUENTOS_NO_APLICADOS: enumEstadoSolicitud = new enumEstadoSolicitud(22,"DESCUENTOS NO APLICADOS");

  id:number;
  descripcion : string;

constructor( id: number, descripcion : string ){
    this.id = id;
    this.descripcion = descripcion;
  }
  

   static forValue( value : number ) : enumEstadoSolicitud{
    switch(value){
      case enumEstadoSolicitud.INICIADO.id : return enumEstadoSolicitud.INICIADO;
      case enumEstadoSolicitud.POR_AUTORIZAR.id : return enumEstadoSolicitud.POR_AUTORIZAR;
      case enumEstadoSolicitud.AUTORIZADO.id : return enumEstadoSolicitud.AUTORIZADO;
      case enumEstadoSolicitud.PENDIENTE_CARGAR_COMPROBANTE.id : return enumEstadoSolicitud.PENDIENTE_CARGAR_COMPROBANTE;
      case enumEstadoSolicitud.PENDIENTE_MONTO_A_LIQUIDAR.id : return enumEstadoSolicitud.PENDIENTE_MONTO_A_LIQUIDAR;
      case enumEstadoSolicitud.CANCELADO.id : return enumEstadoSolicitud.CANCELADO;
      case enumEstadoSolicitud.PRESTAMO_SUSPENDIDO.id : return enumEstadoSolicitud.PRESTAMO_SUSPENDIDO;
      case enumEstadoSolicitud.PRESTAMO_RECUPERACION.id : return enumEstadoSolicitud.PRESTAMO_RECUPERACION;
      case enumEstadoSolicitud.BAJA_POR_LIQUIDACION_ANTICIPADA.id : return enumEstadoSolicitud.BAJA_POR_LIQUIDACION_ANTICIPADA;
      case enumEstadoSolicitud.BAJA_POR_COMPRA_DE_CARTERA.id : return enumEstadoSolicitud.BAJA_POR_COMPRA_DE_CARTERA;
      case enumEstadoSolicitud.BAJA_POR_LIQUIDACION_TOTAL.id : return enumEstadoSolicitud.BAJA_POR_LIQUIDACION_TOTAL;
      case enumEstadoSolicitud.BAJA_POR_DEFUNCION_IRRECUPERABLE.id : return enumEstadoSolicitud.BAJA_POR_DEFUNCION_IRRECUPERABLE;
      case enumEstadoSolicitud.BAJA_POR_IMPROCEDENCIA.id : return enumEstadoSolicitud.BAJA_POR_IMPROCEDENCIA;
      case enumEstadoSolicitud.DESCUENTOS_NO_APLICADOS.id : return enumEstadoSolicitud.DESCUENTOS_NO_APLICADOS;
    }
    return enumEstadoSolicitud.INVALIDO;
  }
  
}

