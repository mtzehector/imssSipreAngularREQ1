export class NotificacionConsulta{

    page:number;
    model:Modelo = new Modelo();
  }

  export class Modelo {

     nss: string;
     folioNotificacion: string;
     folioPrestamo: string;
     cveEstadoNotificacion: number;
     cveEntidadFinanciera: number;
     cveTipoNotificacion: number;
     cveSubTipoNotificacion: number;
     fechaRegistroInicio: string;
     fechaRegistroFin: string;
     fechaVencimientoInicio: string;
     fechaVencimientoFin: string;

}
