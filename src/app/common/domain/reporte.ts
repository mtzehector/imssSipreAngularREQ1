import { Documento } from "./documento";

export class Reporte {
    tipoReporte: number;
    anioNominal: string;
    mesNominal: string;
    docConciliacion: Documento;
    docInconsistencias: Documento;
    inconsistencias: Documento;
    docComprasCarteraEF: Documento;
    curpUsuario: string;
    reporteRs: ReporteRs;
    cveEntidadFinanciera: string;
    subTipoReporte: number;
    archivoXLSX: any;
    fechaDesde: string;
    fechaHasta: string;
    sesion: number;
}

export class ReporteRs {
    reporte: Reporte2;
    reporteDocumentos: ReporteDocumento[]; 
}

export class ReporteDocumento {
    "id": number;
    "cveReporte": number;
    "documento": Documento;
}

export class Reporte2 {
    id: number;
    periodoNomina: string;
    tipoReporte: TipoReporte;
    subTipoReporte: SubTipoReporte;
    estadoReporte: EstadoReporte;
}

export class TipoReporte {
    id: number;
    desTipoReporte: string;
}

export class SubTipoReporte {
    id: number;
    desSubTipoReporte: string;
}

export class EstadoReporte {
    id: number;
    desEstadoReporte: string;
}
