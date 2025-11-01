export class PrestamoRecuperacion{

    id: number;
    prestamo: number;
    solicitud: number;
    numSolicitudSipre: string;
    canMontoSol: number;
    canDescuentoMensual: number;
    impRealPrestamo: number;
    canCatPrestamo: number;
    numPlazoPrestamo: number;
    numMesRecuperado: number;
    numEntidadFinanciera: string;
    impSumaDescMensual: number;
    nombreComercial: string;
    saldoCapital:number;
    mejorOferta: number = 0;
    cveEntidadFinanciera: number = 0;
    clabe: string;
    correoAdminEF: string;
    montoActualizado : number;
    referencia : string;
    saldoCapitalOriginal: number;
    flagEditMont: boolean = false;
    numFolioSolicitud : string;
    numMesesConsecutivos: number;
}