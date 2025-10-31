export class CartaReciboRequest{
    page:number;
    model:Modelo = new Modelo();
}

export class Modelo {
    periodo?:string;
    cveEntidadFinanciera?: number;
}