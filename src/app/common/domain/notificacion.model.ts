import { Documento } from "./documento";
import { Notificacion } from "./notificacion";
import { NotificacionPrestamo } from "./notificacion.prestamo";

export class NotificacionModel {
    notificacion: Notificacion;
    docNotificacionList: Documento[] = new Array();
    curpUsuario: string;
}