import { CondicionesPrestamo } from './condicion.prestamo';
import { Plazo } from 'src/app/common/domain/plazo';
import { Oferta } from './oferta';

export class PersonaRequest {
    
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  telLocal: string;
  correoElectronico: string;
  telCelular: string;
  montoSolicitado: string;
  plazo: Plazo;
  cat: string;
  descuentoMensual: string;
  montoPagar: string;
  flat: string;
  fechaNominal: string;
  prestamo: CondicionesPrestamo;
  oferta: Oferta;
}