import { Persona } from '../persona';
import { EntidadFinanciera } from './entidad.financiera';
import { CapacidadCredito } from './capacidad.credito';
import { Oferta } from './oferta';
import { Prestamo } from './prestamo';

export class CapturaCondiciones {
  capacidadCredito: CapacidadCredito = new CapacidadCredito(); 
  condicionesPrestamo: Oferta = new Oferta();
  catEntidadFinanciera: number
  prestamo:Prestamo=new Prestamo();
}

 