import { Documento } from "./documento";
import { EntidadFinanciera } from "./entidad.financiera";

export class CartaReciboPerfilImss {
    id?: number;
    cveDocumento?: number;
    curp?: string;
    periodo?: string;
    fechaAlta?: Date;
    erogacion?: boolean;
    documento?: Documento;
    entidadFinanciera?: EntidadFinanciera;
}