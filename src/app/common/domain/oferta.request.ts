
import { Pensionadorequest } from './pensionado.request';
import { PrestamoRecuperacion } from 'src/app/common/domain/prestamo-recuperacion.component';

export class OfertaRequest {
  plazo: string;
  tipoSimulacion: string;
  monto:string;
  descuentoMensual:string;
  pensionado: Pensionadorequest = new Pensionadorequest();
  email:string;
  prestamoRecuperacion: PrestamoRecuperacion;
}