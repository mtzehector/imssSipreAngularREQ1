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
import { ErrorEnRespuestaParcial } from './error.respuesta.parcial';


export class CartaInstruccion extends ErrorEnRespuestaParcial {

  solicitud?: Solicitud = new Solicitud();
  pensionado?: Pensionado = new Pensionado();
  prestamo?: Prestamo = new Prestamo();
  documento?: Documento = new Documento();
  oferta?: Oferta = new Oferta();
  personaEf?: PersonaEF = new PersonaEF();
  capacidadCredito?: CapacidadCredito = new CapacidadCredito();
  persona?: PersonaPrestamo = new PersonaPrestamo();
  prestamoRecuperacion?: PrestamoRecuperacion = new PrestamoRecuperacion();
  listPrestamoRecuperacion?: PrestamoEnRecuperacionRs = new PrestamoEnRecuperacionRs();
  personaModel?: PersonaPrestamo = new PersonaPrestamo();
  montoLiquidar: string;
  flatMonto: number;
  flatFecha: number;
  solicitudFol: SolicitudFol = new SolicitudFol();
  flatPrestamoPromotor: number = 0;
  documentacion: DocumentacionAutorizar;
  documentos?: Documento[];
  tablaAmort?: PeriodoAmort[];
  descuentosAplicados? : DescuentoAplicado[];
  prestamosRecuperacionArreglo: PrestamoRecuperacion[] = [];
  promotor: Promotor;
  cveEFOperador: number;
  catPromotor?: number;
  bitacoras ?: Bitacora[];
  bitacora? = new Bitacora();
  
}