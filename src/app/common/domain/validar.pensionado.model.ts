import { PensionadoPrestamo } from './pensionado-prestamo';
import { PersonaPrestamo } from './persona-prestamo';

export class ValidarPensionadoModel{
    curp: string;
    nss: string;
    pensionado: PensionadoPrestamo;
    persona: PersonaPrestamo;
    sesion?: number;
    idGrupoFamiliar: string;
}