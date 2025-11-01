import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { String } from 'typescript-string-operations';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { EntidadFinancieraService } from 'src/app/common/services/entidad.financiera.service';
import { Delegacion, EntidadFinancieraCrud, Mensaje } from "src/app/common/domain";
import { CatalogoService, DataService, ModalService, RegistrarEntidadFinancieraService } from 'src/app/common/services';
import { InformacionEF } from './model/informacionEF';
import { CondicionesForm } from './model/condicionesForm';
import { CondicionJson } from './model/condicionJson';
import { PlazoBeneficio } from './model/plazoBeneficio';
import { Documento, TipoDocumento } from 'src/app/common/domain';



@Component({
  selector: 'app-condicion-ef',
  templateUrl: './condicion-ef.component.html',
  styleUrls: ['./condicion-ef.component.css', '../../common/css/tarjetas-estilos-base.css']
})
export class CondicionEFComponent extends BaseComponent implements OnInit {

  public model: Model;
  logo: Documento;

  informacionEF: InformacionEF = new InformacionEF();
  regexTelefono: string;
  //regexCorreo: string;
  condicionesForm: CondicionesForm = new CondicionesForm();
  condicionJ: CondicionJson;
  numeroMax: string;
  condicionesArray: CondicionJson[];
  result: boolean;
  mensajeErrorCondiciones: string;
  plazos: PlazoBeneficio[];
  plazo: PlazoBeneficio;
  mensajeError: string;
  rol: string;
  condicionV: CondicionJson;
  public idborrar: any;

  items: Delegacion[];
  bloquearGuardar: boolean = false;
  itemsNum = [{}];
  resultErrorEditar: boolean;
  mensajeErrorCondicionesE: string;
  imgEFUrl: string = "/mclpe/auth/js/assets/img/logoEF1.png";
  constructor(protected catalogoService: CatalogoService,
    protected data: DataService,
    private entidadFinancieraService: EntidadFinancieraService,
    private router: Router,
    private modalService: ModalService,
    public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService,
    private activatedRoute: ActivatedRoute,
    public location: Location) {
    super(data);
    this.model = this.data.model;
    this.regexTelefono = '^([0-9]{10})$';
    //this.regexCorreo = '\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$';
    //this.regexCorreo = "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])";
    this.plazos = null;
    this.plazosMock();
  }

  ngOnInit() {
    this.rol = 'adminEF';
    this.catalogoService.consultarDelegaciones().subscribe((response: Delegacion[]) => {
      console.log("Delegaciones: ", response);
      this.items = response;



      var i = 15;
      this.bloquearGuardar = false;

      this.entidadFinancieraService.fetchLogo(Number(this.model.entidadFinanciera.id))
        .subscribe(
          {
            next: (response: Documento) => {
              console.log('Entidad Financiera CON imagen.', response);
              this.model.registrarEntidadFinanciera.logo.archivo = response.archivo
              this.imgEFUrl = 'data:image/png;base64,' + response.archivo;
            },
            error: error => {
              console.log('Entidad Financiera SIN imagen.', error);
              this.imgEFUrl = '/mclpe/auth/js/assets/img/logoEF1.png';
            }
          }
        );

      do {
        ++i;
        this.itemsNum.push({ id: i, valor: i });

      } while (i < 111)

      this.model.mensaje.level = '';
      this.model.mensaje.mensaje = '';

      this.numeroMax = "";
      this.condicionesForm.mMinimo = null;
      this.condicionesForm.mMax = null;
      this.condicionesForm.delegacion = 1;
      this.condicionesArray = new Array();
      this.result = true;

      this.model.personaEF.entidadFinanciera.id = this.model.entidadFinanciera.id;


      this.registrarEntidadFinancieraService.consultarExistePromotorEf(this.model.personaEF.entidadFinanciera.id)
        .subscribe((responseValidacion: any) => {

          this.registrarEntidadFinancieraService.consultarEntidad(this.model.personaEF.entidadFinanciera.id)
            .subscribe((response: EntidadFinancieraCrud) => {

              // Se llena modelo de font para sección Plazos y Beneficios
              this.plazos = new Array();
              let i = 1;

              for (let condicionOferta of response.mclcCondicionOfertaCollection) {
                let plazo = new PlazoBeneficio();
                plazo.id = condicionOferta.id;
                plazo.indice = i++;
                if (condicionOferta.mclcPlazo != null) {
                  plazo.plazo = condicionOferta.mclcPlazo.descripcion;
                }
                plazo.cat = condicionOferta.porCat;
                plazo.catForm = condicionOferta.porTasaAnual;
                if (condicionOferta.mclcBeneficioCollection != null) {
                  plazo.idBeneficioA = (condicionOferta.mclcBeneficioCollection.length > 0 ? condicionOferta.mclcBeneficioCollection[0].id : null);
                  plazo.valorBeneficioA = (condicionOferta.mclcBeneficioCollection.length > 0 ? condicionOferta.mclcBeneficioCollection[0].desBeneficio : null);
                  plazo.idBeneficioB = (condicionOferta.mclcBeneficioCollection.length > 1 ? condicionOferta.mclcBeneficioCollection[1].id : null);
                  plazo.valorBeneficioB = (condicionOferta.mclcBeneficioCollection.length > 1 ? condicionOferta.mclcBeneficioCollection[1].desBeneficio : null);
                  plazo.idBeneficioC = (condicionOferta.mclcBeneficioCollection.length > 2 ? condicionOferta.mclcBeneficioCollection[2].id : null);
                  plazo.valorBeneficioC = (condicionOferta.mclcBeneficioCollection.length > 2 ? condicionOferta.mclcBeneficioCollection[2].desBeneficio : null);
                }

                this.plazos.push(plazo);
              }

              // Se llena modelo de font para sección de Condiciones por entidad federativa

              this.condicionesArray = new Array();
              for (let condicionEntidadFed of response.mclcCondicionEntfedCollection) {
                let condicion = new CondicionJson();
                condicion.id = condicionEntidadFed.id;
                condicion.edadJ = (condicionEntidadFed.numEdadLimite != null ? condicionEntidadFed.numEdadLimite.toString() : null);
                condicion.mMinimoJ = condicionEntidadFed.monMinimo;
                condicion.mMaxJ = condicionEntidadFed.monMaximo;
                condicion.sexoJ = condicionEntidadFed.mclcSexo.desSexo;
                //--- condicion.nombreEF = this.buscarEntidad(condicionEntidadFed.cveEntidadFederativa);
                condicion.nombreDelegacion = this.buscarEntidad(condicionEntidadFed.cveDelegacion);
                condicion.delegacionJ = condicionEntidadFed.cveDelegacion;
                this.condicionesArray.push(condicion);
              }
              this.ordenarArrayEntidad();
              if (response.logo === null || response.logo === undefined) {
                this.model.registrarEntidadFinanciera.logo = new Documento();
              }
              else {
                this.model.registrarEntidadFinanciera.logo = response.logo;
                this.data.model.uploadDocumento.push(this.model.registrarEntidadFinanciera.logo);
              }
              //console.log('>>>ngOnInit. logo='+JSON.stringify(this.model.registrarEntidadFinanciera.logo));
              this.model.registrarEntidadFinanciera.logo.tipoDocumentoEnum = TipoDocumento.LOGO;

            });

        });

    });

  }

  changeImage(newImage: string){
    this.imgEFUrl  = newImage;
  }

  agregar() {
    console.log("Agregar!!");
    this.resultErrorEditar = false;
    this.mensajeErrorCondicionesE = "";

    this.result = true;

    this.model.mensaje.level="";
    this.model.mensaje.mensaje="";

    this.condicionJ = new CondicionJson()
    this.condicionJ.edadJ = this.condicionesForm.edad;
    //---this.condicionJ.entidadFederativaJ = this.condicionesForm.entidadFederativa;
    this.condicionJ.delegacionJ = this.condicionesForm.delegacion;
    //---this.condicionJ.nombreEF = this.buscarEntidad(this.condicionesForm.entidadFederativa);
    console.log("formulario: ", this.condicionesForm);
    this.condicionJ.nombreDelegacion = this.buscarEntidad(this.condicionesForm.delegacion);
    this.condicionJ.mMaxJ = this.condicionesForm.mMax;
    this.condicionJ.mMinimoJ = this.condicionesForm.mMinimo;
    this.condicionJ.sexoJ = this.buscarSexo(this.condicionesForm.sexo);



    if (this.condicionesArray.length > 0) {

      this.validarEntidadFederativa(this.condicionJ);
      this.condicionJ.id = this.condicionesArray.length + 1;
    } else {

      this.condicionJ.id = 1;

    }

    if (this.result) {
      this.validarCamposVaciosCondicion(this.condicionJ);
    }
    if (this.result) {
      this.validarMontoMinimoMaximo(this.condicionJ);
    }

    if (this.result) {
      this.validarEntidadFederativaVsSexo(this.condicionJ);
    }

    if (this.result) {
      this.condicionesArray.push(this.condicionJ);
      this.condicionesForm.mMinimo = null;
      this.condicionesForm.mMax = null;
      //---this.condicionesForm.entidadFederativa=1;
      this.condicionesForm.delegacion = 1;
      this.condicionesForm.edad = null;
      this.condicionesForm.sexo = null;

    }
    //ORDENAMOS LA LISTA 
    this.ordenarArrayEntidad();
  }

  buscarEntidad(cveDelegacion: number) {
    //---const found = this.items.find(x => x.id == entidad);
    //const found = this.items.catalogoDelegaciones.find(x => x.id == cveDelegacion);
    for (var d of this.items) {
      if (cveDelegacion == d.id) {
        return d.desDelegacion;
      }
    }
    //---return found.name;
    return "";
  }


  buscarEntidadName(nombreEF: String) {
    //---const found = this.items.find(x => x.id == entidad);
    //const found = this.items.catalogoDelegaciones.find(x => x.id == cveDelegacion);
    for (var d of this.items) {
      if (nombreEF == d.desDelegacion) {
        return d.id;
      }
    }
    //---return found.name;
    return 0;
  }

  borrarEntidad(id) {
    //console.log("Borrar Entidad - EL ID ES " + id);
    const index = this.condicionesArray.findIndex(x => x.id === id);
    if (index !== undefined) this.condicionesArray.splice(index, 1);
    // this.condicionesArray.sort(this.ordenarArrayEntidad("entidadFederativaJ"));
    this.ordenarArrayEntidad();
    this.closeModal('eliminarCondicion');
  }

  editarEntidad(id) {
    this.bloquearGuardar = true;
    //console.log("EL ID ES EDITAR " + id);
    //console.log(JSON.stringify(this.condicionesArray));
    const index = this.condicionesArray.findIndex(x => x.id === id);
    this.condicionV = new CondicionJson();
    this.condicionV = this.condicionesArray[index];
    this.condicionesArray[index].delegacionE = this.buscarEntidadName(this.condicionesArray[index].nombreDelegacion);
    this.condicionesArray[index].delegacionJ = this.buscarEntidadName(this.condicionesArray[index].nombreDelegacion);

    this.condicionesArray[index].edadE = this.condicionesArray[index].edadJ;
    this.condicionesArray[index].sexoE = this.buscarIdSexo(this.condicionesArray[index].sexoJ);
    this.condicionesArray[index].mMinimoE = this.condicionesArray[index].mMinimoJ;
    this.condicionesArray[index].mMaxE = this.condicionesArray[index].mMaxJ;
    this.condicionesArray[index].editar = false;

    this.ordenarArrayEntidad();
    this.closeModal('editarCondicion');

  }

  buscarIdSexo(sexo: string) {
    if (sexo == "Femenino") {
      sexo = "F";
    }
    if (sexo == "Masculino") {
      sexo = "M";
    }
    return sexo;
  }

  salvarEntidadModificada(id) {
    const index = this.condicionesArray.findIndex(x => x.id === id);
    this.condicionV = new CondicionJson();
    this.condicionV = this.condicionesArray[index];
    this.condicionV.editar = true;
    this.resultErrorEditar = false;
    this.condicionV.delegacionJ = this.condicionV.delegacionE;
    this.condicionV.sexoJ = this.condicionV.sexoJ;
    this.condicionV.edadJ = this.condicionV.edadE;
    this.condicionV.mMaxJ = this.condicionV.mMaxE;
    this.condicionV.mMinimoJ = this.condicionV.mMinimoE;
    this.condicionV.nombreDelegacion = this.buscarEntidad(this.condicionV.delegacionE);
    //***  BORRAMOS ENTIDAD Y DEPUES GUARDAMOS LA MODIFICACIONES */
    //***** VALIDAMOS MONTO DE LA ENTIDAD  ****************/
    if (this.validarEntidadModificada(this.condicionV)) {
      if (index !== undefined) {
        this.condicionesArray.splice(index, 1);
      }

      this.condicionesArray.push(this.condicionV);
      this.bloquearGuardar = false;

    } else {
      this.condicionV.editar = false;
      this.resultErrorEditar = true;
      this.mensajeErrorCondicionesE = "El monto mínimo debe ser menor al monto máximo.";

      if (this.condicionV.edadE === undefined || this.condicionV.edadE === null || this.condicionV.edadE === "undefined") {
        this.mensajeErrorCondicionesE = "La edad es un dato obligatorio.";
      }


    }
    //this.ordenarArrayEntidad();
  }


  validarEntidadFederativaE(condicion: CondicionJson) {
    var i;
    var retorno = true;
    // this.resultErrorEditar = true;
    this.condicionV = new CondicionJson();
    for (i = 0; i < this.condicionesArray.length; i++) {
      this.condicionV = this.condicionesArray[i];

      if (this.condicionV.edadJ == condicion.edadJ &&
        this.condicionV.delegacionJ == condicion.delegacionJ &&
        this.condicionV.mMaxJ == condicion.mMaxJ &&
        this.condicionV.mMinimoJ == condicion.mMinimoJ &&
        this.condicionV.sexoJ == condicion.sexoJ) {
        retorno = false;
      }
      return retorno;

    }
  }



  validarEntidadModificada(entidad: CondicionJson) {

    var validado = true;

    if (entidad.mMinimoJ > entidad.mMaxJ) {
      validado = false;
    }
    if (entidad.edadJ === undefined || entidad.edadJ === null || entidad.edadJ === "undefined") {
      validado = false;
    }
    //validado =this.validarEntidadFederativaE(entidad);
    return validado;

  }

  validarEntidadFederativaVsSexo(condicion: CondicionJson) {
    for (let condicionV of this.condicionesArray) {
      if (condicionV.delegacionJ == condicion.delegacionJ &&
        condicionV.sexoJ == condicion.sexoJ) {
        this.result = false;
        this.model.mensaje.level="danger";
        this.model.mensaje.mensaje="Ya existe un registro de condición con el sexo y delegación seleccionados. Favor de verificar.";
        //this.mensajeErrorCondiciones = "Ya existe un registro de condición con el sexo y delegación seleccionados. Favor de verificar.";
      }
    }
  }

  validarEntidadFederativa(condicion: CondicionJson) {
    var i;
    this.result = true;
    this.condicionV = new CondicionJson();
    for (let i = 0; i < this.condicionesArray.length; i++) {
      this.condicionV = this.condicionesArray[i];
      if (this.condicionV.edadJ == condicion.edadJ &&
        this.condicionV.delegacionJ == condicion.delegacionJ &&
        this.condicionV.mMaxJ == condicion.mMaxJ &&
        this.condicionV.mMinimoJ == condicion.mMinimoJ &&
        this.condicionV.sexoJ == condicion.sexoJ) {
        this.result = false;
        //this.mensajeErrorCondiciones = "Esta condición ya esta registrada";
        this.model.mensaje.level="danger";
        this.model.mensaje.mensaje="Esta condición ya esta registrada";
      }
    }
  }

  validarMontoMinimoMaximo(condicion: CondicionJson) {
    //console.log("LA EDAD "+condicion.edadJ);
    //console.log("LA entidadFederativaJ:. "+condicion.entidadFederativaJ );
    //console.log("EL MONTO MINIMO :. "+condicion.mMinimoJ );
    //console.log("EL MONTO MAXICMO:. "+condicion.mMaxJ );
    var i;
    this.result = true;

    if (condicion.mMaxJ == null || condicion.mMinimoJ == null || condicion.edadJ === undefined || condicion.sexoJ === undefined) {
      this.result = false;
      //this.mensajeErrorCondiciones = "Se deben ingresar todos los campos. Por favor valídalos.";
      this.model.mensaje.level="danger";
      this.model.mensaje.mensaje="Se deben ingresar todos los campos. Por favor valídalos.";      
    }

    if (typeof (condicion.mMinimoJ) != 'number') {
      this.result = false;
      //this.mensajeErrorCondiciones = "El monto mínimo no es válido.";
      this.model.mensaje.level="danger";
      this.model.mensaje.mensaje="El monto mínimo no es válido.";
      return null;
    }

    if (typeof (condicion.mMaxJ) != 'number') {

      this.result = false;
      //this.mensajeErrorCondiciones = "El monto máximo no es válido.";
      this.model.mensaje.level="danger";
      this.model.mensaje.mensaje="El monto máximo no es válido.";
      return null;
    }
    if (condicion.mMinimoJ > condicion.mMaxJ) {
      this.result = false;
      //this.mensajeErrorCondiciones = "El monto mínimo debe ser menor al monto máximo.";
      this.model.mensaje.level="danger";
      this.model.mensaje.mensaje="El monto mínimo debe ser menor al monto máximo.";
      return null;
    }

    if (condicion.edadJ === undefined || condicion.edadJ === "undefined") {
      this.result = false;
      //this.mensajeErrorCondiciones = "La edad es un campo requerido.";
      this.model.mensaje.level="danger";
      this.model.mensaje.mensaje="La edad es un campo requerido.";
      return null;
    }

    if (condicion.sexoJ === undefined || condicion.sexoJ === "undefined") {
      this.result = false;
      //this.mensajeErrorCondiciones = "El sexo es un campo requerido.";
      this.model.mensaje.level="danger";
      this.model.mensaje.mensaje="El sexo es un campo requerido.";
      return null;
    }

  }

  validarCamposVaciosCondicion(condicion: CondicionJson) {

    if (condicion.mMaxJ == null || condicion.mMinimoJ == null || condicion.edadJ === "undefined" || condicion.sexoJ === "undefined") {
      this.result = false;
      //this.mensajeErrorCondiciones = "Se deben ingresar todos los campos. Por favor valídalos.";
      this.model.mensaje.level="danger";
      this.model.mensaje.mensaje="Se deben ingresar todos los campos. Por favor valídalos.";
    }
  }

  validarCamposVacios(condicion: CondicionJson) {
    var i;
    this.result = true;
    this.condicionV = new CondicionJson();
    for (i = 0; i < this.condicionesArray.length; i++) {
      this.condicionV = this.condicionesArray[i];
      if (condicion.edadJ != null && condicion.delegacionJ != null && condicion.mMaxJ != null && condicion.mMinimoJ != null) {
        this.result = false;
      }
      if (this.condicionV.edadJ == condicion.edadJ && this.condicionV.delegacionJ == condicion.delegacionJ && this.condicionV.mMaxJ == condicion.mMaxJ && this.condicionV.mMinimoJ == condicion.mMinimoJ) {
        this.result = false;
      }

    }
  }

  ordenarArrayEntidad() {
    //alert("ENTRA A ORDENAR ");
    this.condicionesArray.sort(function (a, b) {
      if (a.nombreDelegacion > b.nombreDelegacion) {
        return 1;
      }
      if (a.nombreDelegacion < b.nombreDelegacion) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  buscarSexo(sexo: string) {
    if (sexo == "F") {
      sexo = "Femenino";
    }
    if (sexo == "M") {
      sexo = "Masculino";
    }
    return sexo;
  }

  plazosMock() {

    this.plazo = new PlazoBeneficio();
    this.plazo.indice = 1;
    this.plazo.plazo = "6";
    this.plazo.cat = 5.0;
    this.plazos = [this.plazo];

    this.plazo = new PlazoBeneficio();
    this.plazo.indice = 2;
    this.plazo.plazo = "12";
    this.plazo.cat = 5.0;
    this.plazos.push(this.plazo);

    this.plazo = new PlazoBeneficio();
    this.plazo.indice = 3;
    this.plazo.plazo = "18";
    this.plazo.cat = 5.0;
    this.plazos.push(this.plazo);

  }

  closeModal(tituloModal) {
    this.modalService.close(tituloModal);
    this.idborrar = '';
  }

  openModal(tituloModal) {
    this.modalService.open(tituloModal);
  }
  openModal2(tituloModal, id) {
    this.idborrar = id;
    this.modalService.open(tituloModal);
  }

  validateNum(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
  }
  validarBeneficio(id) {

    const index = id;
    this.plazo = new PlazoBeneficio();
    this.plazo = this.plazos[index];
    this.plazos[index].error = false;

    if (this.plazo.catForm == null) {
      this.plazos[index].error = true;
      this.plazos[index].mensajeError = "Debe de capturar el CAT";

    }

    if (typeof (this.plazo.catForm) != 'number') {

      this.plazos[index].error = true;
      this.plazos[index].mensajeError = "El CAT capturado no es válido ";
      return null;

    }

    if (this.plazo.cat > this.plazo.catForm) {
      this.plazos[index].error = true;
      this.plazos[index].mensajeError = "El CAT capturado excede el CAT registrado ante el IMSS. Por favor verifica.";
    }
    if (this.plazo.cat != null && !/^[0-9]+([.][0-9]+)?$/.test(this.plazo.cat.toString())) {
      this.plazos[index].error = true;
      this.plazos[index].mensajeError = "El campo solo acepta caracteres numéricos";
    }

  }



  continuar() {
    //******* VALIDAMOS CONTINUAR   */
    let valorValidacion = this.validarFormulario();
    this.closeModal("RegistrarEF");

    if (valorValidacion) {

      this.openModal("carga");

      let payload = { logo: new Documento(), mclcCondicionEntfedCollection: [], mclcBeneficioCollection: [], curp: this.model.persona.curp };
      payload.logo = this.model.registrarEntidadFinanciera.logo;
      for (let condiciones of this.condicionesArray) {
        payload.mclcCondicionEntfedCollection.push({
          //---cveEntidadFederativa: condiciones.delegacionJ,
          cveDelegacion: condiciones.delegacionJ,
          numEdadLimite: condiciones.edadJ,
          monMinimo: condiciones.mMinimoJ,
          monMaximo: condiciones.mMaxJ,
          mclcEntidadFinanciera: this.model.registrarEntidadFinanciera.id,
          mclcSexo: {
            id: (condiciones.sexoJ == "Masculino" ? 1 : 2),
          }
        });
      }

      for (let beneficios of this.plazos) {

        payload.mclcBeneficioCollection.push({
          id: beneficios.idBeneficioA,
          desBeneficio: beneficios.valorBeneficioA,
          mclcCondicionOferta: {
            id: beneficios.id,
            porCat: beneficios.cat
          }
        });

        payload.mclcBeneficioCollection.push({
          id: beneficios.idBeneficioB,
          desBeneficio: beneficios.valorBeneficioB,
          mclcCondicionOferta: {
            id: beneficios.id,
            porCat: beneficios.cat
          }
        });


        payload.mclcBeneficioCollection.push({
          id: beneficios.idBeneficioC,
          desBeneficio: beneficios.valorBeneficioC,
          mclcCondicionOferta: {
            id: beneficios.id,
            porCat: beneficios.cat
          }
        });
      }

      this.registrarEntidadFinancieraService.registrarCondiciones(payload)
        .subscribe((response: any) => {
          //console.log("payloaresponsed:" + JSON.stringify(response, null, 2));
          this.condicionesForm.condiciones = JSON.stringify(this.condicionesArray);
          this.condicionesForm.plazosBeneficios = JSON.stringify(this.plazos);
          this.model.mensaje.level = 'success';
          this.model.mensaje.mensaje = 'El registro  de las condiciones para la Entidad Financiera ' + this.model.registrarEntidadFinanciera.nombreComercial + ' se ha realizado con éxito.';
          this.closeModal('carga');

        });

    }

  }

  validarFormulario() {

    let result: boolean = true;
    if (this.condicionesArray.length > 0) {
      result = this.validarFormularioPlazos();
    } else {
      result = false;
      this.resultErrorEditar = true;
      this.mensajeErrorCondicionesE = "Tiene que agregar por lo menos una condición";
    }

    return result;
  }

  validarFormularioPlazos() {

    let validarPlazos: boolean = true
    let i: number = 0;
    let campoVacio: boolean = false;
    for (let beneficios of this.plazos) {
      this.validarBeneficio(i);
      if (beneficios.catForm == null) {
        campoVacio = true;
        validarPlazos = false;
      }

      if (beneficios.error) {
        campoVacio = true;
      }

      i++;
    }
    if (campoVacio) {
      this.resultErrorEditar = true;
      this.mensajeErrorCondicionesE = "Se deben ingresar todos los campos. Por favor valídalos.";

      validarPlazos = false;

    } else {

      this.resultErrorEditar = false;
      this.mensajeErrorCondicionesE = " ";
    }

    return validarPlazos;
  }

}


