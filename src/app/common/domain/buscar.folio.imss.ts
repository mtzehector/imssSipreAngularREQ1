import { Solicitud } from './solicitud';
import { Prestamo } from './prestamo';
import { Pensionado } from './pensionado';
import { CartaInstruccion } from './carta.instruccion';

export class BuscarFolioImss {
  
 cartaInstruccion:CartaInstruccion;
 origenSolictud:number;
 cveSoliciutd:number;
 folio:string;
 razonSocialEntidadFinanciera:string;
 nss:string;
 nombrePensionado:string;
 estadoPrestamo:string;
 fechaInicio:string
}
/*

  {
    "content": [
        {
            "origenSolictud": 1,
            "cveSoliciutd": 939,
            "folio": "11190100078-6",
            "razonSocialEntidadFinanciera": "ADEX",
            "nss": "12345678203",
            "nombrePensionado": "Gerardo Buendia Bojorges",
            "estadoPrestamo": "Cancelado",
            "fechaInicio": "28/11/2019 01:15:31",
            "resumenSimulacion": {
                "ciudad": "México CDMX",
                "fecha": "28 de noviembre de 2019",
                "folio": "11190100078-6",
                "nombre": "Gerardo",
                "primerApe": "Buendia",
                "segundoApe": "Bojorges",
                "nss": "12345678203",
                "curp": "ASDFGHJKLN12345203",
                "delegacion": "01",
                "telefono": "4928216238",
                "email": "jose.varela@softtek.com",
                "tipoCredito": "Nuevo",
                "tipoPension": "",
                "tipoTrabajador": "pensionado",
                "nombreComercial": "ADEX",
                "razonSocial": "Adelanto Express S.A. de C.V., SOFOM E.N.R.",
                "telefonoBanco": "01-800-841-77-10",
                "webBanco": "www.adelantoexpress.com",
                "tasaAnual": "41.0",
                "cat": "45.78",
                "montoSolicitado": "13534.11",
                "importeDescNomina": "1000.0",
                "totalDescAplicar": "18 meses",
                "plazo": "18 meses",
                "totalCredPagarInt": "18000.0",
                "nominaPrimerDesc": "26/11/2019",
                "fechaVigFolio": "26/11/2019",
                "selloDigital": "vb4hH/WSn83rgiIJMRmOA/ocY7GbUzQbfcl1fGuwXb3xj3TWP23H0muGPQeQEmRknqBgVRgQ9afl5ZPPNHynuK6rE8nMqtAZuZMoTCCnjxA25weMLXeH2s2QaHzshfYi6hhircanvFBcSFI0zh5Q1H2qbiA4bQTbkNZQ1/B+6o7j23Y48PaWmaNFJ7PVrClYal481N4fgucIkmfRPtepblIgPXxUUwOMhNDqlOkoFz+Wvsx2jtPXV7q+lY9+cPyq1Cj5woPPL4KbLzeXYYJmhYurno006davZ4u8Q1Z5c8EEr2XZ4chhzaqI322H9f5ul39GCa4B3vmUtyOoIQ9uIQ==",
                "codigoQR": "11190100078-6",
                "cadenaOriginal": "||NSS:12345678203|FOLIOPRESTAMO:11190100078-6|FECSOLICITUDPRESTAMO:28/11/2019|TIPOCREDITO:Nuevo||"
            },
            "cartaCapacidadCredito": {
                "ciudad": null,
                "fecha": null,
                "folio": null,
                "curp": null,
                "nss": null,
                "nombre": null,
                "primerApe": null,
                "segundoApe": null,
                "telefono": null,
                "email": null,
                "delegacion": null,
                "tipoCredito": null,
                "tipoPension": null,
                "tipoTrabajador": null,
                "impCapacidadFija": null,
                "impCapacidadVariable": null,
                "impCapacidadTotal": null,
                "selloDigital": null,
                "codigoQR": null,
                "cadenaOriginal": null
            }
        },*/