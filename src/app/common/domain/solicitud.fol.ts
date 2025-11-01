import { EstadoSolicitudFol } from './estado.solicitud.fol';
import { OrigenSolicitud } from '../origen.solicitud';
export class SolicitudFol{

    id?: number;
    cveEstadoSolicitud?: EstadoSolicitudFol;
    cveOrigenSolicitud?: OrigenSolicitud;
    numFolioSolicitud?:string;
    refTrabajador?:string;
    fecVigenciaFolio?:string;
    altaRegistro?:string;
    curp?:string;
    nss?:string;
    delegacion?:string;
    subDelegacion?:string;
    grupoFamiliar?:string;
    entidadFederativa?:string;
}