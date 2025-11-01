import { PlazoCrud } from './plazo.crud';
import { BeneficioCrud } from './beneficio.crud';

export class CondicionOfertaCrud {
  id?: number;
  porTasaAnual?: number;
  porCat?: number;
  fecRegistroAlta?: Date;
  bajaRegistro?: any;
  mclcEntidadFinanciera?: any;
  mclcPlazo?: PlazoCrud;
  mclcBeneficioCollection?: BeneficioCrud[];

}
