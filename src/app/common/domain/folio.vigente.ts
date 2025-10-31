import { PrestamoPensionado } from 'src/app/common/domain/prestamo.pensionado';

import { Solicitud } from './solicitud';

export class FolioVigente {

    solicitud ?: Solicitud = new Solicitud();
    prestamo ?:PrestamoPensionado = new PrestamoPensionado();
    
  }