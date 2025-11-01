import { Pensionado } from './pensionado';
import { Prestamo } from './prestamo';

import { Solicitud } from './solicitud';
import { Documento } from './documento';
import { PersonaEF } from './persona.ef';
import { CapacidadCredito } from './capacidad.credito';
import { Oferta } from './oferta';
import { PersonaPrestamo } from './persona-prestamo';
import { PrestamoRecuperacion } from './prestamo-recuperacion.component';
import { SolicitudFol } from './solicitud.fol';
import { DocumentacionAutorizar } from './documentacion.autorizar';
import { PeriodoAmort } from './periodoAmort';
import { DescuentoAplicado } from './descuento.aplicado';
import { PrestamoEnRecuperacionRs } from './prestamo.recuperacionrs';
import { Promotor } from './promotor';
import { Bitacora } from './bitacora';


export class ErrorEnRespuestaParcial {
  error?: boolean;
  message?: string;
}