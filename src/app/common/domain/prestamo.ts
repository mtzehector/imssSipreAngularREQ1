import { Oferta } from './oferta';
import { TipoCredito } from './tipo.credito';


export class Prestamo {
id?:number;
solicitud?:number;
monto?:string;
impDescNomina?:number;
impTotalPagar?:number;
altaRegistro?:string;
oferta?:Oferta = new Oferta();
idOferta?:number;
periodoNomina?:number;
promotor?:number;
tipoSimulacion?:string;
tipoCreditoEnum?:TipoCredito;
tipoCreditoId?:number;
tipoCredito?:number;
refCuentaClabe?:string;
contrasenaClabe?:string;
numPeriodoNomina?:string;
catPrestamoPromotor?:string;
primerDescuento?:string;
importeARecibir?:number;
numMesesConsecutivos?:number;
}

