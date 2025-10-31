import { Solicitud } from '../domain/solicitud';

export class AsignarPromotorRq {
    request : AsignarPromotorRequest;
    response : AsignarPromotorResponse;
  }

export class AsignarPromotorRequest {
    id: number;
    cvePromotor: number;
}

export class AsignarPromotorResponse {
    response : Solicitud;
}
  