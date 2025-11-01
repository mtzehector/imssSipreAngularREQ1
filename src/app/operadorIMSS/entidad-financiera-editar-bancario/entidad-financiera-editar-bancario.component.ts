import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { String } from 'typescript-string-operations';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { CatalogoService, DataService } from 'src/app/common/services';
import { Bancos } from 'src/app/common/domain/catalogos/bancos';

@Component({
  selector: 'app-entidad-financiera-editar-bancario',
  templateUrl: './entidad-financiera-editar-bancario.component.html',
  styleUrls: ['../entidad-financiera-registrar/entidad-financiera-registrar.component.css', '../entidad-financiera-detalle/entidad-financiera-detalle.component.css']
})
export class EntidadFinancieraEditarBancarioComponent extends BaseComponent implements OnInit {

  public model: Model;
  @Input()
  public registrarForm: any;
  @Output()
  public validClabe = new EventEmitter<boolean>();
  public msjErrorClabe: string;
  public catalogoBancos: Bancos;
  public nombreInstitucionValidacion: any;

  digito: any;
  multimplos: string = "37137137137137137";
  multimplo: any;
  sumatoria: any = 0;
  operacion: any;
  digitoVerificador: any;
  digControl: any;

  constructor(
    protected data: DataService,
    private catalogoService: CatalogoService) {
    super(data);
    this.model = this.data.model;
  }

  ngOnInit() {

    this.catalogoService.consultarBancos().subscribe((response: Bancos) => {
      console.log("Bancos: ", response);
      this.catalogoBancos = response;
    })

  }

  validarClabe1() {
    let result: boolean = false;
    this.msjErrorClabe = null;

    //Coincidencia de la CLABE
    if (!String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.clabe) && !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.confClabe)) {

      if (this.model.registrarEntidadFinanciera.clabe == this.model.registrarEntidadFinanciera.confClabe) {
        result = true;
      } else {
        this.msjErrorClabe = "La cuenta CLABE ingresada y la cuenta CLABE de confirmación no coinciden";
      }
    }
    this.validClabe.next(result);
  }





  validarClabe() {

    let result: boolean = false;
    this.msjErrorClabe = null;

    //Coincidencia de la CLABE
    if (!String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.clabe) && !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.confClabe)) {

      if (this.model.registrarEntidadFinanciera.clabe == this.model.registrarEntidadFinanciera.confClabe) {
        result = true;
      } else {
        this.msjErrorClabe = "La cuenta CLABE ingresada y la cuenta CLABE de confirmación no coinciden";
        this.model.clabeOK = true;
      }
    }
    //Validar primeros 3 digitos de la cadena correspondan a la EF
    if (result && !String.IsNullOrWhiteSpace(this.model.registrarEntidadFinanciera.instBancaria)) {

      let testClabe = this.model.registrarEntidadFinanciera.clabe.substring(0, 3);
      let testConfClabe = this.model.registrarEntidadFinanciera.confClabe.substring(0, 3);
      //console.log(">>>PRUEBA ", this.model.registrarEntidadFinanciera.instBancaria);
      if (testClabe == testConfClabe && testClabe == this.model.registrarEntidadFinanciera.instBancaria) {
        if (this.validarEstructuraClabe(this.model.registrarEntidadFinanciera.clabe)) {
          result = false;
        } else {
          //console.log("ERROR ESTRUCTURE CLABE UD>>>>>: ");
          this.msjErrorClabe = 'La cuenta CLABE es incorrecta.';
          result = true;

        }
      } else {
        //console.log("ERROR ESTRUCTURE CLABE 3D>>>>>: ");
        this.msjErrorClabe = 'La cuenta CLABE no corresponde con la institución bancaria.';
        result = true;

      }
    }
    this.validClabe.next(result);
    this.model.clabeOK = result;
  }

  getDigitosClabe(nombreInstitucion: string) {
    let clabe;
    for (let x of this.catalogoBancos.catalogoBancos) {
      if (x.descripcion == nombreInstitucion) {
        clabe = x.clave;
      }
    }
    return clabe;
  }

  validarEstructuraClabe(clabe: string) {

    //console.log("ESTRUCTURE CLABE>>>>>: ",  clabe);
    this.digito = null;
    this.multimplo = null;
    this.operacion = null;
    this.sumatoria = null;
    this.digitoVerificador = null;

    for (let cont = 0; cont < (clabe.length - 1); cont++) {
      this.digito = clabe[cont];
      //console.log("VALOR DIGITO>>>>>: ",  this.digito);
      this.multimplo = this.multimplos[cont];
      //console.log("VALOR MULTIPLO>>>>>: ",  this.multimplo);
      this.operacion = this.digito * this.multimplo;
      //console.log("VALOR OPERACION>>>>>: ",  this.operacion);
      this.sumatoria += this.operacion < 10 ? parseInt(this.operacion) : parseInt(this.operacion.toString()[1]);
      //console.log("VALOR SUMATORIA>>>>>: ",  this.sumatoria);
    }
    if (this.sumatoria > 99) {
      this.digitoVerificador = this.sumatoria.toString()[2];
      //console.log("IF SUMATORIA>>>>>: ",  this.digitoVerificador);
    } else if (this.sumatoria > 9) {
      this.digitoVerificador = this.sumatoria.toString()[1];
      //console.log("IF ELSE SUMATORIA>>>>>: ",  this.digitoVerificador); 
    } else {
      this.digitoVerificador = this.sumatoria;
      //console.log("ELSE SUMATORIA>>>>>: ",  this.digitoVerificador);
    }
    this.digitoVerificador = 10 - this.digitoVerificador;
    //console.log("valor DIGITOVERIFICADOR>>>>>: ",  this.digitoVerificador);
    this.digitoVerificador = this.digitoVerificador == 10 ? 0 : this.digitoVerificador;
    //console.log("valor final DIGITOVERIFICADOR>>>>>: ",  this.digitoVerificador);

    return this.digitoVerificador == clabe[17];

  }


}
