import { BitacoraPensionado } from "./BitacoraPensionado";

export class BitacoraPensionadoRequest {

    public page: number;
    public pageSize: number;
    public model: BitacoraPensionado = new BitacoraPensionado();
    public totalElements: number;
    public totalPages: number;

}