import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { BaseComponent } from "src/app/common/base.component";
import { Documento, TipoDocumento } from "src/app/common/domain";
import { BitacoraCatImss } from "src/app/common/domain/bitacora.cat.imss";
import { DocumentoService, ModalService } from "src/app/common/services";
import { BitacoraCatIMSSService } from "src/app/common/services/bitacora.cat.imss.service";
import { CatMaximoService } from "src/app/common/services/cat.maximo.service";
import { DataService } from "src/app/data.service";
import { Model } from "src/app/model";

@Component({ 
    selector: 'app-cat-maximo',
    templateUrl: './cat-maximo.component.html',
    styleUrls: []
})

export class CatMaximoComponent extends BaseComponent implements OnInit {
    public rol: string;
    public CATMaximoActual : string;
    public CATNuevo:string = '';
    public regexCat: string;

    public model: Model;
    catDocument: Documento;

    uploadForm: FormGroup;
    imageChanged : EventEmitter<string> = new EventEmitter<string>();
    fileName: string;
    public laFormaSeEncuentraLlena: boolean = false;
    arregloBitacoraCatImss: BitacoraCatImss[] = [];
    public esVisibleLaBitacora: boolean = false;

    
    @ViewChild("inputC", {static:false})
    inputC: ElementRef;

    constructor(
        private router: Router,
        protected data: DataService,
        private modalService: ModalService,
        private catMaximoService: CatMaximoService,
        private bitacoraService: BitacoraCatIMSSService, 
        private formBuilder: FormBuilder,
        private documentoService: DocumentoService) 
    {
            super(data);
            this.model = this.data.model;
            this.regexCat = "[0-9]+(\.[0-9][0-9]?)?";
    }

    ngOnInit() {
        this.rol = 'administradorIMSS';
        console.log('Rol:', this.rol);
        this.catMaximoService.catActual().subscribe((response : any)=>{
            console.log('Response:', response.catAnterior);
            this.CATMaximoActual = response.catAnterior;
        } );
        console.log('CATMaximoActual:', this.CATMaximoActual);

        this.bitacoraService.obtenerBitacorasCatImss().subscribe(
            (response: BitacoraCatImss[]) => {
                this.arregloBitacoraCatImss = response;
                if (this.arregloBitacoraCatImss != null
                    && this.arregloBitacoraCatImss != undefined
                    && this.arregloBitacoraCatImss.length > 0) {
                    this.esVisibleLaBitacora = true;
                }
            }
        );

        this.catDocument = new Documento();
        this.catDocument.id = 0;
        this.catDocument.tipoDocumentoEnum = TipoDocumento.CAT_MAXIMO;

        this.CATNuevo = '';
        this.fileName = '';
        this.uploadForm = this.formBuilder.group({
            profile: ['']
        });
    }

    validaFormaLlena() {
        if(this.CATNuevo != '' && this.fileName != '' )
            this.laFormaSeEncuentraLlena = true;
        else
            this.laFormaSeEncuentraLlena = false;
    }

    regresar(): void{
        this.router.navigate(['/administradorIMSS/home', {}]);
    }

    limpiarArchivoSeleccionado() {
        this.fileName = '';
        this.inputC.nativeElement.value = '';
        this.uploadForm = this.formBuilder.group({
            profile: ['']
        });
    }

    limpiar(){
        this.CATNuevo = '';
        this.limpiarArchivoSeleccionado();
        this.validaFormaLlena();
    }

    confirmarCAT(){
        let digitos = parseFloat(this.CATNuevo);
        let round = Math.round((digitos + Number.EPSILON) * 100) / 100
        this.CATNuevo = round.toString();
        this.modalService.open("modal-confirmar");
    }
    closeModal(){
        this.modalService.close("modal-confirmar");
    }

    guardarCAT(){
        this.modalService.close("modal-confirmar");
        this.modalService.open("carga");

        const formData = new FormData();
        formData.append('archivo', this.uploadForm.get('profile').value);
        formData.append('catNuevo', '' + this.CATNuevo);
        formData.append('curp', '' + this.model.persona.curp);
        formData.append('catAnterior', '' + this.CATMaximoActual);
        formData.append('sesion', this.model.sesion == null? "0" : this.model.sesion.toString());
    
        this.catMaximoService.actualizaCatIMSS(formData).subscribe(
            (response : any) => {
                console.log('Respuesta del Servicio :', response);
                this.goHome();
            }, error => {
                console.log('Respuesta del Servicio :', error);
                this.modalService.close("carga");
            }
        );
    }

    goHome(){
        this.modalService.close("carga");
        this.router.navigate(['/administradorIMSS/home'], {
            queryParams: {
                accion: "CatMaximo",
                status: "post"
              }
         });
    }

    onFileSelect(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            console.log('file: ' + file);
            this.uploadForm.get('profile').setValue(file);
            console.log('this.uploadForm.get: ' + this.uploadForm.get('profile'));
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imageChanged.emit(reader.result as string);
            };
            this.fileName = file.name;
        } else {
            this.limpiarArchivoSeleccionado();
            this.imageChanged.emit("/suap/auth/js/assets/img/logoEF1.png");
        }
        this.validaFormaLlena();
    }

}

