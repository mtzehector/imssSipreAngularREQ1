export class Conciliacion{
    numeroProveedor?: number;
    razonSocial?: string;
    cveEntidadFinanciera?: number;
    rfc?: string;
    periodo?: string;
    curp?: string;
    cveTipoDocumento?: number;
    firma?: string;
    cveEntidadFinancieraSipre?: string;
    arregloIdEntidadFinanciera?:number[] = [];
    cvePerfil?: number;
    firmaTitular?:string;
    titularImss?:string;
    operadorEF?:string;
    firmaOperadorEF?:string;
    firmaAdministradorEF?:string;
    nombreEntidad?: string;
    sesion?:number;
}