import { Documento } from "./documento";

export class BitacoraCatImss {
    id: string;
    idTipoEvento: string;
    desTipoEvento: string;
    cveDocumento: string;
    curp: string;
    cat: string;
    documento?: Documento;
}