export class TipoCredito {

  static NUEVO: TipoCredito = new TipoCredito(1, "Nuevo");
  static RENOVACION: TipoCredito = new TipoCredito(2, "Renovación");
  static COMPRA_CARTERA: TipoCredito = new TipoCredito(3, "Compra de cartera");  
  static INVALIDO: TipoCredito = new TipoCredito(4,"NO SE ENCONTRO TIPO DE CREDITO");
  static MONTO_PENDIENTE_CAPTURAR: TipoCredito = new TipoCredito(5, "Monto pendiente de capturar");
  static MIXTO: TipoCredito = new TipoCredito(6, "Mixto");

  id:number;
  descripcion : string;

constructor( id: number, descripcion : string ){
    this.id = id;
    this.descripcion = descripcion;
  }
  

   static forValue( value : number ) : TipoCredito{
    switch(value){
      case TipoCredito.NUEVO.id : return TipoCredito.NUEVO;
      case TipoCredito.RENOVACION.id : return TipoCredito.RENOVACION;
      case TipoCredito.COMPRA_CARTERA.id : return TipoCredito.COMPRA_CARTERA;
      case TipoCredito.MONTO_PENDIENTE_CAPTURAR.id : return TipoCredito.MONTO_PENDIENTE_CAPTURAR;   
      case TipoCredito.MIXTO.id: return TipoCredito.MIXTO;  
    }
    return TipoCredito.INVALIDO;
  }
}

