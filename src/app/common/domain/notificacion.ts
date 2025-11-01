
import { Documento } from "./documento";
import { NotificacionPrestamo } from "./notificacion.prestamo";

export class Notificacion {
  id?: number;
  cveEntidadFinanciera?: number;
  cveTipoNotificacion?: number;
  cveSubTipoNotificacion?: number;

  fecVencimiento?: string;
  descNotificacion?: string;
  reqNotificacion?: string;
  resolucion?: string;
  cveEstadoNotificacion ?: number;
  folioNotificacion?: string;
  notPrestamo?: NotificacionPrestamo = new NotificacionPrestamo();
  

  mcltNotificacionDocumento?: Documento[];
}
