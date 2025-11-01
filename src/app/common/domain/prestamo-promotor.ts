import { PensionadoPrestamo } from './pensionado-prestamo';
import { CapacidadCredito } from './capacidad.credito';
import { PersonaPrestamo } from './persona-prestamo';
import { PersonaRequest } from './persona-request';
import { Solicitud } from './solicitud';
import { PersonaEF } from './persona.ef';
import { Prestamo } from 'src/app/common/domain/prestamo';
import { CondicionOfertaCrud } from './condicion.oferta.crud';
import { PrestamoRecuperacion } from './prestamo-recuperacion.component';
import { EntidadFinanciera } from './entidad.financiera';
import { Oferta } from './oferta';
import { Promotor } from '.';
import { ErrorEnRespuestaParcial } from './error.respuesta.parcial';
import { PrestamosVigentes } from './prestamos.vigentes';

export class PrestamoPromotor extends ErrorEnRespuestaParcial {
    curp: string;
    nss: string;
    pensionado: PensionadoPrestamo;
    capacidad: CapacidadCredito;
    persona: PersonaPrestamo;
    personaRequest: PersonaRequest;
    solicitud: Solicitud;
    personaEF: PersonaEF;
    prestamo: Prestamo;
    condicionOfertaCrud: CondicionOfertaCrud;
    prestamosRecuperacionArreglo: PrestamoRecuperacion[] = [];
    entidadFinanciera: EntidadFinanciera = new EntidadFinanciera();
    oferta: Oferta;
    promotor: Promotor;
    sesion?: number;
    idSolPrestamo?: string;
    prestamoVigente: PrestamosVigentes;
}