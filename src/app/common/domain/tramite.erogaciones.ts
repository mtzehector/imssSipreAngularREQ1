export class TramiteErogaciones{
    cveEntidadFinanciera?: number;
    nombreComercial?: string;
    cveCartaRecibo?:number;
    cveTipoDocumentoCartaRecibo?:number;
    fechaDescargaCartaRecibo?:Date;
    fechaFirmaCartaRecibo?:Date;
    erogacion?:boolean;
    cveSolicitudTransferencia?:number;
    cveTipoDocumentoSolicitudTransferencia?:number;
    cveCuentaContable?:number;
    cveTipoDocumentoCuentaContable?:number;
    cveRetencionDelegacion?:number;
    cveTipoDocumentoRetencionDelegacion?:number;
}