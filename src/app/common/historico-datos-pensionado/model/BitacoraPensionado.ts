import { TipoModificacion } from "./TipoModificacion";


export class BitacoraPensionado {
    id: string;
    fecRegistro: string;
    bajaRegistro: string;
    actualizacionRegistro: string;
    cveCurp: string;
    cvePersona: string;
    valorAnterior: string;
    valorActual: string;
    tipoModificacion: TipoModificacion;
}