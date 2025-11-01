export const environment = {
  production: false,
  ajustePorcentualCAT: 0.5,
  recaptcha: {
    siteKey: '6LfxNnMrAAAAAKS1xlLetikSqk4wvluxHRZlKKFV'
  },
  widgetFirmaElectronica: 'http://firmadigitalqa.imss.gob.mx/firmaElectronicaWeb/widget/chfecyn',
};

export const sessionTimeout = 1800;
// tslint:disable-next-line: max-line-length
export const estadosResponse = [{ clave: '1', claveRenapo: null, idRenapo: 0, nombre: 'AGUASCALIENTES' }, { clave: '2', claveRenapo: null, idRenapo: 0, nombre: 'BAJA CALIFORNIA' }, { clave: '3', claveRenapo: null, idRenapo: 0, nombre: 'BAJA CALIFORNIA SUR' }, { clave: '4', claveRenapo: null, idRenapo: 0, nombre: 'CAMPECHE' }, { clave: '5', claveRenapo: null, idRenapo: 0, nombre: 'COAHUILA DE ZARAGOZA' }, { clave: '6', claveRenapo: null, idRenapo: 0, nombre: 'COLIMA' }, { clave: '7', claveRenapo: null, idRenapo: 0, nombre: 'CHIAPAS' }, { clave: '8', claveRenapo: null, idRenapo: 0, nombre: 'CHIHUAHUA' }, { clave: '9', claveRenapo: null, idRenapo: 0, nombre: 'CIUDAD DE MÉXICO' }, { clave: '10', claveRenapo: null, idRenapo: 0, nombre: 'DURANGO' }, { clave: '11', claveRenapo: null, idRenapo: 0, nombre: 'GUANAJUATO' }, { clave: '12', claveRenapo: null, idRenapo: 0, nombre: 'GUERRERO' }, { clave: '13', claveRenapo: null, idRenapo: 0, nombre: 'HIDALGO' }, { clave: '14', claveRenapo: null, idRenapo: 0, nombre: 'JALISCO' }, { clave: '15', claveRenapo: null, idRenapo: 0, nombre: 'MÉXICO' }, { clave: '16', claveRenapo: null, idRenapo: 0, nombre: 'MICHOACÁN DE OCAMPO' }, { clave: '17', claveRenapo: null, idRenapo: 0, nombre: 'MORELOS' }, { clave: '18', claveRenapo: null, idRenapo: 0, nombre: 'NAYARIT' }, { clave: '19', claveRenapo: null, idRenapo: 0, nombre: 'NUEVO LEÓN' }, { clave: '20', claveRenapo: null, idRenapo: 0, nombre: 'OAXACA' }, { clave: '21', claveRenapo: null, idRenapo: 0, nombre: 'PUEBLA' }, { clave: '22', claveRenapo: null, idRenapo: 0, nombre: 'QUERÉTARO' }, { clave: '23', claveRenapo: null, idRenapo: 0, nombre: 'QUINTANA ROO' }, { clave: '24', claveRenapo: null, idRenapo: 0, nombre: 'SAN LUIS POTOSÍ' }, { clave: '25', claveRenapo: null, idRenapo: 0, nombre: 'SINALOA' }, { clave: '26', claveRenapo: null, idRenapo: 0, nombre: 'SONORA' }, { clave: '27', claveRenapo: null, idRenapo: 0, nombre: 'TABASCO' }, { clave: '28', claveRenapo: null, idRenapo: 0, nombre: 'TAMAULIPAS' }, { clave: '29', claveRenapo: null, idRenapo: 0, nombre: 'TLAXCALA' }, { clave: '30', claveRenapo: null, idRenapo: 0, nombre: 'VERACRUZ DE IGNACIO DE LA LLAVE' }, { clave: '31', claveRenapo: null, idRenapo: 0, nombre: 'YUCATÁN' }, { clave: '32', claveRenapo: null, idRenapo: 0, nombre: 'ZACATECAS' }];

let fechaActual = new Date();

let inicio = new Date();
inicio.setTime(fechaActual.getTime());
inicio.setHours(6,0,0,0);

let termino = new Date();
termino.setTime(fechaActual.getTime());
termino.setHours(23,59,59,999);

export const horarioInicia = inicio;
export const horarioTermina = termino;

export const sessionAlertAt=300;
export const isLocal=false;
export const pageSize=3;
export const cvePerfil_Promotor={
  
}
