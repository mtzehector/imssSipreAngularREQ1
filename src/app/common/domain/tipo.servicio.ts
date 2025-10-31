export class TipoServicio { 
  static NO_VALIDO: TipoServicio = new TipoServicio(0, "NO VALIDO");
  static SISTRAP: TipoServicio = new TipoServicio(1, "SISTRAP");
  static RENAPO: TipoServicio = new TipoServicio(2, "RENAPO");
  static SIAP: TipoServicio = new TipoServicio(3, "SIAP");
  static SINDO: TipoServicio = new TipoServicio(4,"SINDO");
  static BOVEDA: TipoServicio = new TipoServicio(5, "BOVEDA");
  static NOTARIA: TipoServicio = new TipoServicio( 6, "NOTARIA");
  static SELLO_DIGITAL: TipoServicio = new TipoServicio(7, "SELLO DIGITAL");
  static DOMICILIO: TipoServicio = new TipoServicio( 8, "DOMICILIO");
  static OTRO: TipoServicio = new TipoServicio(9,"OTRO");
  static NET_IQ: TipoServicio = new TipoServicio(10,"NET IQ");
  static BOVEDA_IPICYT: TipoServicio = new TipoServicio(11,"BOVEDA IPICYT");
  static SIPRE2: TipoServicio = new TipoServicio(12,"SIPRE2.0");

  id:number;
  descripcion : string;

  constructor( id: number, descripcion: string ) {
    this.id = id;
    this.descripcion = descripcion;
  }
  

   static forValue( value: number ) : TipoServicio {
    switch(value) {
      case TipoServicio.SISTRAP.id : return TipoServicio.SISTRAP;
      case TipoServicio.RENAPO.id : return TipoServicio.RENAPO;
      case TipoServicio.SIAP.id : return TipoServicio.SIAP;
      case TipoServicio.SINDO.id : return TipoServicio.SINDO;
      case TipoServicio.BOVEDA.id : return TipoServicio.BOVEDA;
      case TipoServicio.NOTARIA.id : return TipoServicio.NOTARIA;
      case TipoServicio.SELLO_DIGITAL.id : return TipoServicio.SELLO_DIGITAL;
      case TipoServicio.DOMICILIO.id : return TipoServicio.DOMICILIO;
      case TipoServicio.OTRO.id : return TipoServicio.OTRO;
      case TipoServicio.NET_IQ.id : return TipoServicio.NET_IQ;
      case TipoServicio.BOVEDA_IPICYT.id : return TipoServicio.BOVEDA_IPICYT;
      case TipoServicio.SIPRE2.id : return TipoServicio.SIPRE2;
      
    }
    return TipoServicio.NO_VALIDO;
  }
  
}

