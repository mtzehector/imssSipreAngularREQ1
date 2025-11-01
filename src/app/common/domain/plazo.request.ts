import { Delegacion } from './delegacion';
import { EntidadFederativa } from './entidad.federativa';

export class PlazoRequest{           

     monto:string;
     capacidadCredito: number;  
     pensionado: PensionRequestPlazo;  
     tipoSimulacion: string;
     sesion: number;
}

export class  PensionRequestPlazo{
     sexo:string;
     fechaNacimiento:string;
     entidadFederativa: EntidadFederativa;
     delegacion: Delegacion;
}
