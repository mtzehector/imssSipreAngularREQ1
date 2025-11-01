export class TipoNotificacion {
  
  static QUEJA: TipoNotificacion = new TipoNotificacion(1, "Queja");
  static REQUERIMIENTO: TipoNotificacion = new TipoNotificacion(2, "Requerimiento");
  static SANCION: TipoNotificacion = new TipoNotificacion(3, "Sanción");
  static CONCILIACION: TipoNotificacion = new TipoNotificacion(4, "Conciliación");
  static AVISO: TipoNotificacion = new TipoNotificacion(5, "Aviso");
  static COMUNICADO: TipoNotificacion = new TipoNotificacion(6, "Comunicado");
  static INVALIDO: TipoNotificacion = new TipoNotificacion(-1, "Inválido");

  id : number;
  descripcion : string;
  
  constructor( id: number, descripcion : string ){
    this.id = id;
    this.descripcion = descripcion;
  }
  
  static forValue( value : number ) : TipoNotificacion{
    switch(value){
      case TipoNotificacion.QUEJA.id : return TipoNotificacion.QUEJA;
      case TipoNotificacion.REQUERIMIENTO.id : return TipoNotificacion.REQUERIMIENTO;
      case TipoNotificacion.SANCION.id : return TipoNotificacion.SANCION;
      case TipoNotificacion.CONCILIACION.id : return TipoNotificacion.CONCILIACION;
      case TipoNotificacion.AVISO.id : return TipoNotificacion.AVISO;
      case TipoNotificacion.COMUNICADO.id : return TipoNotificacion.COMUNICADO;
    }
    return TipoNotificacion.INVALIDO;
  }
}

