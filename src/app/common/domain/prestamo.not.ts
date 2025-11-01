import { Persona } from "../persona";


export class Prestamo{
  id?: number;
  numSolicitud?: string;
  nss?: string;
  curp?: string;
  desTipoCredito?: string;
  impMontoSol?: number;
  desPlazo?: string;
  fechaAlta?: Date;
  desEstadoPrestamo?: string;
  cat?: string;
  fechaVencimiento?: Date;
  cveSolicitud?: any;
  pensionado?: Persona;
}