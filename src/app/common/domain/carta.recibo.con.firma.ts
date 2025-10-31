import { Documento } from "./documento";
import { EntidadFinanciera } from "./entidad.financiera";

export class CartaReciboConFirma {
    cveEntidadFinanciera?: number;
    nombreComercial?: string;
    estadoEntidadFinanciera?: boolean;
    cveDocumentoConciliacion?: number;
    documento?: Documento;
    periodo?: string;
    fechaDescarga?: Date;
    fechaFirma?: Date;
    erogacion?: boolean;
}