import { CartaInstruccion } from './carta.instruccion';
import { Documento } from './documento';

export class PrestamoAutorizado extends CartaInstruccion {
    docCartaInstruccion?: Documento;
    docContratoCredito?:Documento; 
    docTablaAmorizacion?:Documento; 
    docIdentificacionOficial?: Documento;
    docPdfPensionadoCEP?: Documento;
    docXmlPensionadoCEP?: Documento;
    documentos?: Documento[];
    cepEntidadFinancieraLista?: Documento[];
    cepEntidadFinancieraListaXML?: Documento[];



}