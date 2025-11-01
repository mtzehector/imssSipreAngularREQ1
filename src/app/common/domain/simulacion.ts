import { Solicitud } from './solicitud';
import { Prestamo } from './prestamo';
import { Pensionado } from './pensionado';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';
import { DatosOferta } from './datos.oferta';
import { EntidadFinanciera } from './entidad.financiera';
import { CapacidadCredito } from './capacidad.credito';


export class Simulacion{
  
  solicitud:Solicitud = new Solicitud();
  prestamo:Prestamo = new Prestamo();
  pensionado:Pensionado = new Pensionado();
  prestamoRecuperacion = new PrestamoRecuperacion();
  ofertaDatos: DatosOferta = new DatosOferta();
  lstPrestamoRecuperacion : PrestamoRecuperacion[] = [];
  entidadFinanciera: EntidadFinanciera = new EntidadFinanciera();
  capacidadCredito : CapacidadCredito = new CapacidadCredito();
}  
