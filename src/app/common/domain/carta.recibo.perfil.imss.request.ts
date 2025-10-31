export class CartaReciboPerfilImssRequest{
    page:number;
    model: ModeloCartaRecibo = new ModeloCartaRecibo();
}

export class ModeloCartaRecibo {
    cvePerfil?: number;
    periodo?: string;
    cveEntidadFinanciera?: number;
    cveTipoDocumento?: number;
    curp?:string;
    firmaAdminEF?:string;
    firmaTitular?:string;
}