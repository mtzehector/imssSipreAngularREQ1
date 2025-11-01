export class TipoDocumento {
  
  static RESUMEN_SIMULACION: TipoDocumento = new TipoDocumento(1, "Resumen simulación");
  static CARTA_CAPACIDAD_CREDITO: TipoDocumento = new TipoDocumento(2, "Carta capacidad crédito");
  static CARTA_INSTRUCCION: TipoDocumento = new TipoDocumento(3, "Carta de Libranza");
  static IDENTIFICACION_OFICIAL: TipoDocumento = new TipoDocumento(4, "Identificación oficial ");
  static CONTRATO: TipoDocumento = new TipoDocumento(5, "Contrato");
  static TABLA_DE_AMORTIZACION_DE_CREDITO: TipoDocumento = new TipoDocumento(6, "Tabla de amortización de crédito");
  static CEP_PENSIONADO: TipoDocumento = new TipoDocumento(7, "CEP Pensionado PDF");
  static CEP_ENTIDAD_FINANCIERA: TipoDocumento = new TipoDocumento(8, "CEP Entidad Financiera");
  static FOTOGRAFIA: TipoDocumento = new TipoDocumento(9, "Fotografía");
  static COMPROBANTE_DE_DOMICILIO: TipoDocumento = new TipoDocumento(10, "Comprobante de domicilio");
  static CARTA_RESPONSIVA: TipoDocumento = new TipoDocumento(11, "Carta responsiva");
  static CEP_PENSIONADO_XML: TipoDocumento = new TipoDocumento(12, "CEP Pensionado XML");
  static NOTIFICACION: TipoDocumento = new TipoDocumento(14, "Notificación");
  static LOGO: TipoDocumento = new TipoDocumento(15, "Logo");
  static INVALIDO: TipoDocumento = new TipoDocumento(-1, "INVALIDO");
  static CEP_ENTIDAD_FINANCIERA_XML: TipoDocumento = new TipoDocumento(13, "CEP Entidad Financiera XML");
  static NOTIFICACION_XML: TipoDocumento = new TipoDocumento(16, "Notificación XML");
  static REPORTE_CONCILIACION_XLSX: TipoDocumento = new TipoDocumento(17, "Reporte Conciliacion IMSS");
  static REPORTE_INCONSISTENCIAS_TXT: TipoDocumento = new TipoDocumento(18, "Reporte de Inconsistencias");
  static REPORTE_DESCU_EMIT_EF_XLSX: TipoDocumento = new TipoDocumento(19, "Reporte Descuentos Emitodos por EF");
  static REPORTE_DESCU_EMIT_DEL_XLSX: TipoDocumento = new TipoDocumento(20, "Reporte Descuentos Emitodos por Delegación");
  static REPORTE_INCONSISTENCIAS_PRESTAMOS_TXT: TipoDocumento = new TipoDocumento(21, "Reporte de Inconsistencias de Prestamos");
  static REPORTE_INCONSISTENCIAS_DESCUENTOS_TXT: TipoDocumento = new TipoDocumento(22, "Reporte de Inconsistencias de Descuentos");
  static REPORTE_COMPRAS_CARTERA_EF_XLSX: TipoDocumento = new TipoDocumento(23, "Reporte Compras de Cartera EF");
  static CAT_MAXIMO: TipoDocumento = new TipoDocumento(24, "CAT Máximo");
  static CON_ENT_FIN_PRESTADOR_SERV_CERT: TipoDocumento = new TipoDocumento(25, "Contrato de entidad financiera con el prestador de servicios de certificado");
  static CON_ENT_FIN_PRESTADOR_SERV_VAL_BIO: TipoDocumento = new TipoDocumento(26, "Contrato de entidad financiera con el prestador de servicios de validación biométrica");
  static DETALLE_CONCILIACION: TipoDocumento = new TipoDocumento(27, "Detalle de la conciliación");
  static CARTA_RECIBO_SIN_FIRMA: TipoDocumento = new TipoDocumento(28, "Carta recibo sin firma");
  static CARTA_RECIBO_CON_FIRMA: TipoDocumento = new TipoDocumento(29, "Carta recibo con firma");
  static RESUMEN_CONCILIACION: TipoDocumento = new TipoDocumento(30, "Resumen de conciliación");
  static SOLICITUD_TRANSFERENCIA_RECURSOS_RETENCIONES: TipoDocumento = new TipoDocumento(31, "Solicitud de transferencia de recursos por concepto de retenciones");
  static REPORTE_RETENCIONES_EF_DESGLOSADO_CUENTA_CONTABLE: TipoDocumento = new TipoDocumento(32, "Reporte de retenciones por entidad financiera desglosado por cuenta contable");
  static REPORTE_RETENCIONES_DELEGACION: TipoDocumento = new TipoDocumento(33, "Reporte de retenciones por delegación");
  static CARTA_REINSTALACION: TipoDocumento = new TipoDocumento(34, "Carta de Reinstalación");
  static CARTA_RECIBO_OPERADOR_EF: TipoDocumento = new TipoDocumento(35, "Carta Recibo con firma Operador EF");
  static CARTA_RECIBO_TITULAR_DIVISION: TipoDocumento = new TipoDocumento(36, "Carta Recibo con firma Titular de la división");


  id : number;
  descripcion : string;
  
  constructor( id: number, descripcion : string ){
    this.id = id;
    this.descripcion = descripcion;
  }
  
  static forValue( value : number ) : TipoDocumento{
    switch(value){
      case TipoDocumento.RESUMEN_SIMULACION.id : return TipoDocumento.RESUMEN_SIMULACION;
      case TipoDocumento.CARTA_CAPACIDAD_CREDITO.id : return TipoDocumento.CARTA_CAPACIDAD_CREDITO;
      case TipoDocumento.CARTA_INSTRUCCION.id : return TipoDocumento.CARTA_INSTRUCCION;
      case TipoDocumento.IDENTIFICACION_OFICIAL.id : return TipoDocumento.IDENTIFICACION_OFICIAL;
      case TipoDocumento.CONTRATO.id : return TipoDocumento.CONTRATO;
      case TipoDocumento.TABLA_DE_AMORTIZACION_DE_CREDITO.id : return TipoDocumento.TABLA_DE_AMORTIZACION_DE_CREDITO;
      case TipoDocumento.CEP_PENSIONADO.id : return TipoDocumento.CEP_PENSIONADO;
      case TipoDocumento.CEP_ENTIDAD_FINANCIERA.id : return TipoDocumento.CEP_ENTIDAD_FINANCIERA;
      case TipoDocumento.FOTOGRAFIA.id : return TipoDocumento.FOTOGRAFIA;
      case TipoDocumento.COMPROBANTE_DE_DOMICILIO.id : return TipoDocumento.COMPROBANTE_DE_DOMICILIO;
      case TipoDocumento.CARTA_RESPONSIVA.id : return TipoDocumento.CARTA_RESPONSIVA;
      case TipoDocumento.CEP_PENSIONADO_XML.id : return TipoDocumento.CEP_PENSIONADO_XML;
      case TipoDocumento.NOTIFICACION.id : return TipoDocumento.NOTIFICACION;
      case TipoDocumento.LOGO.id : return TipoDocumento.LOGO;
      case TipoDocumento.NOTIFICACION_XML.id : return TipoDocumento.NOTIFICACION_XML;

      case TipoDocumento.REPORTE_DESCU_EMIT_EF_XLSX.id : return TipoDocumento.REPORTE_DESCU_EMIT_EF_XLSX;
      case TipoDocumento.REPORTE_DESCU_EMIT_DEL_XLSX.id : return TipoDocumento.REPORTE_DESCU_EMIT_DEL_XLSX;
      case TipoDocumento.REPORTE_INCONSISTENCIAS_PRESTAMOS_TXT.id : return TipoDocumento.REPORTE_INCONSISTENCIAS_PRESTAMOS_TXT;
      case TipoDocumento.REPORTE_INCONSISTENCIAS_DESCUENTOS_TXT.id : return TipoDocumento.REPORTE_INCONSISTENCIAS_DESCUENTOS_TXT;
      case TipoDocumento.REPORTE_COMPRAS_CARTERA_EF_XLSX.id : return TipoDocumento.REPORTE_COMPRAS_CARTERA_EF_XLSX;
      case TipoDocumento.CAT_MAXIMO.id : return TipoDocumento.CAT_MAXIMO;
      case TipoDocumento.CON_ENT_FIN_PRESTADOR_SERV_CERT.id : return TipoDocumento.CON_ENT_FIN_PRESTADOR_SERV_CERT;
      case TipoDocumento.CON_ENT_FIN_PRESTADOR_SERV_VAL_BIO.id : return TipoDocumento.CON_ENT_FIN_PRESTADOR_SERV_VAL_BIO;
      case TipoDocumento.DETALLE_CONCILIACION.id : return TipoDocumento.DETALLE_CONCILIACION;
      case TipoDocumento.CARTA_RECIBO_SIN_FIRMA.id : return TipoDocumento.CARTA_RECIBO_SIN_FIRMA;
      case TipoDocumento.CARTA_RECIBO_CON_FIRMA.id : return TipoDocumento.CARTA_RECIBO_CON_FIRMA;
      case TipoDocumento.RESUMEN_CONCILIACION.id : return TipoDocumento.RESUMEN_CONCILIACION;
      case TipoDocumento.SOLICITUD_TRANSFERENCIA_RECURSOS_RETENCIONES.id : return TipoDocumento.SOLICITUD_TRANSFERENCIA_RECURSOS_RETENCIONES;
      case TipoDocumento.REPORTE_RETENCIONES_EF_DESGLOSADO_CUENTA_CONTABLE.id : return TipoDocumento.REPORTE_RETENCIONES_EF_DESGLOSADO_CUENTA_CONTABLE;
      case TipoDocumento.REPORTE_RETENCIONES_DELEGACION.id : return TipoDocumento.REPORTE_RETENCIONES_DELEGACION;
      case TipoDocumento.CARTA_REINSTALACION.id : return TipoDocumento.CARTA_REINSTALACION;
      case TipoDocumento.CARTA_RECIBO_OPERADOR_EF.id : return TipoDocumento.CARTA_RECIBO_OPERADOR_EF;
      case TipoDocumento.CARTA_RECIBO_TITULAR_DIVISION.id : return TipoDocumento.CARTA_RECIBO_TITULAR_DIVISION;

    }
    return TipoDocumento.INVALIDO;
  }

  
}

