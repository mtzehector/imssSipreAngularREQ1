import { Plazo } from './plazo';
import { Oferta } from './oferta';

export class PlazoCondiciones {
    id:number;
    cat:number;
    tasaAnual:number;
    plazo:Plazo= new Plazo();
}