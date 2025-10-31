import { Solicitud } from './solicitud';
import { CapacidadCredito } from './capacidad.credito';
import { Documento } from './documento';
import { Persona } from '../persona';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';

export class CartaCapacidadCredito {
  solicitud: Solicitud;
  capacidadCredito: CapacidadCredito;
  documento: Documento;
  pensionado: Persona;
  prestamoRecuperacion = new PrestamoRecuperacion();
}