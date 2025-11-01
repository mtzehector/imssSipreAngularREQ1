import { FormGroup } from '@angular/forms';
import { Documento } from '../../../common/domain/documento';

export class DocumentoAdicional {
    uploadForm: FormGroup;
    fileName: string;
    documentoResponse: Documento;
    documentoRequest: Documento;
    loadingFile: boolean = false;
    typeFile: string;
}