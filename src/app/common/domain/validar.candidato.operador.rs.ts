import { RegistroPatronalCrud } from "./registro-patronal-crud";

export class ValidarCandidatoOperadorRs {
    curp: string;
    nss: string;
    renapoRequest: RenapoRequest;
    bdtuResponse: BdtuResponse;    
    numTelefono?: string;
    correo?: string;
    correoConfirmar?: string;
    vigenciaToken?: string;
    token?: string;
    relacionLaboral: RelacionLaboral;
    datosCurp: RenapoCurpOut;
    delegacion?: string;
    matricula?: string;
    estatus?: string;
    registroPatronalValido: string;
    registrosPatronalesOut : RegistroPatronalCrud;
}
export class lstInfoRelacionesLaboralesReg{
    regPatron?:string;
    fecFinRelLab?:string;
  lstInfoRelacionesLaborales: lstInfoRelacionesLaboralesReg;
    //                    "fecFinRelLab": "9999-12-31"

}

export class testRegistro{
    lstInfoRelacionesLaborales?:lstInfoRelacionesLaboralesReg=new lstInfoRelacionesLaboralesReg();
  
    //                    "fecFinRelLab": "9999-12-31"

}
export class RelacionLaboral {
    registroPatronalActual?: string;
    listInfoRelacionesLaborales?:lstInfoRelacionesLaboralesReg[]=new Array();    
}
export class BdtuResponse {
    cveIdPersona: number;
    curp: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    fechaNacimiento: string;
    nss: string;
    sexo: Sexo;
}

export class Sexo {
    descripcion: string;
    idSexo: number;
}

export class LugarNacimiento {
    clase: string;
    nombre: string;
}

export class RenapoRequest {
    renapoCurpIn: RenapoCurpIn;
    renapoCurpOut: RenapoCurpOut;
}

export class RenapoCurpIn {
    curp: string;
}
export class RenapoCurpOut {
    anioReg: number;
    apellido1: string;
    apellido2: string;
    codigoError: string;
    crip: 0
    curp: string;
    cveEntidadEmisora: string;
    cveMunicipio: 10
    desEntidadNac: string;
    desEntidadRegistro: string;
    desEstatusCURP: string;
    desMunicipio: string;
    docProbatorio: string;
    estatusCURP: string;
    fechNac: string;
    foja: number;
    folioCarta: number;
    libro: number;
    message: string;
    nacionalidad: string;
    nombres: string;
    numActa: number;
    numEntidadReg: number;
    numRegExtranjeros: number;
    sexo: string;
    statusOper: string;
    tipoError: string;
    tomo: number;
}


