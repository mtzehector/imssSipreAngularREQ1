import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { DatePipe } from '@angular/common';
import { Model } from "src/app/model";
import { CatalogoService, DataService, ModalService } from 'src/app/common/services';
import { RegistroPatronal } from 'src/app/common/domain/registro-patronal';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
    selector: 'app-entidad-financiera-registro-patronal',
    templateUrl: './entidad-financiera-registro-patronal.component.html',
    styleUrls: [],
    providers: [DatePipe]
  })
  export class EntidadFinancieraRegistroPatronalComponent extends BaseComponent implements OnInit {

    public model: Model;
    @Input()
    public registrarForm: any;
    public regexCat: string;
    public regexDecimal: string;
    public mapPlazos: any;
    public rpValidos: boolean = true;
    public rpVacio: boolean = true;

    constructor(
        protected data: DataService,
        private modalService: ModalService,
        private datePipe: DatePipe,
        protected catalogoService: CatalogoService,
    ) {
        super(data);
        this.model = this.data.model;
        this.regexCat = "[0-9]+(\.[0-9][0-9]?)?";
    }
    ngOnInit(){
        console.log("MODIFICAR? ", this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection)
        if(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection == null 
            || this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.length == 0){
            this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection = new Array();
            let nuevoRegistro : RegistroPatronal = {
                idEntidadFinanciera:this.model.registrarEntidadFinanciera.id,
                registroPatronal:null,
                fecRegistroAlta:null
            };
            this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.push(nuevoRegistro);
        }else{
            for(let regpat of this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection){
                regpat.idEntidadFinanciera = this.model.registrarEntidadFinanciera.id;
            }
        }
    }

    agregar(index) {
        this.model.flagRegPAtModEF = false; 
        this.rpVacio = true;
        for(let i =0; i < this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.length; i++){
            console.log("AGREGAR VALIDAR", this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[index].registroPatronal);
            if(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[index].registroPatronal == null ||
                this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[index].registroPatronal == ""){
                this.rpVacio = false;
                return;
            }
        }
        console.log("AGREGAR ", this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection);
        //if(this.model.registrosPatronalesCrud.registrosPatronales == nu
        let nuevoRegistro : RegistroPatronal = {
            idEntidadFinanciera:this.model.registrarEntidadFinanciera.id,
            registroPatronal:null,
            fecRegistroAlta:null
        };
        this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.push(nuevoRegistro);
    }
    
    eliminar(index) {
        //console.log("ELIMINAR ");
        if (this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[index].id == null) {
            //console.log("EL ID ES NULO ELIMINAR");
            this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.splice(index, 1);
        } else {
          this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[index].bajaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
        }
        if (this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.length == 0) {
            this.rpValidos = true; 
            this.rpVacio = true;
            this.model.flagRegPAtModEF = true;
        }
        this.validarRPEliminar();
        //console.log("ELIMINAR ", this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection);
    }

    listenerRegistro(index: number){

    }
    //rpValidos
    validarRP(index: number){
        this.rpValidos = true; 
        this.rpVacio = true;
        this.model.flagRegPAtModEF = true;
        //console.log("VALIDAR ", index);
        if(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[index].registroPatronal == 
            this.model.registrarEntidadFinanciera.registroPatronal){
                this.rpValidos = false; 
                this.model.flagRegPAtModEF = false;
        }
        for(let i =0; i < this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.length; i++){
            console.log("I ", i);
            if(index != i){
                if(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[index].registroPatronal == 
                    this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[i].registroPatronal){
                        this.rpValidos = false; 
                        this.model.flagRegPAtModEF = false;
                        console.log("RPVALIDOR  ",  this.rpValidos);
                }

            }
        }//console.log("RPVALIDOR  ",  this.rpValidos);

    }
    validarRPEliminar(){
        this.rpValidos = true; 
        this.rpVacio = true;
        this.model.flagRegPAtModEF = true;
        //console.log("VALIDAR ", index);
        for(let i =0; i < this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.length; i++){
            console.log("I ", i);
            if(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[i].registroPatronal == null ||
                this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[i].registroPatronal == ""){
                    this.rpVacio = false;
                    this.model.flagRegPAtModEF = false;
                    return;
            }
            if(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[i].registroPatronal == 
                this.model.registrarEntidadFinanciera.registroPatronal){
                    this.rpValidos = false; 
                    this.model.flagRegPAtModEF = false;
                    return;
            }
            for(let j =0; j < this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection.length; j++){
                if(j != i){
                    if(this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[j].registroPatronal == 
                        this.model.registrarEntidadFinanciera.mcltRegistrosPatronalesCollection[i].registroPatronal){
                        this.rpValidos = false; 
                        this.model.flagRegPAtModEF = false; 
                        console.log("RPVALIDOR  ",  this.rpValidos);
                    }
                }

                
            }
                

            

        }

        
        
            
        //console.log("RPVALIDOR  ",  this.rpValidos);

    }

  }