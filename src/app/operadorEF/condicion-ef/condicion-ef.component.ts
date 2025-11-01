import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { String } from 'typescript-string-operations';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { Delegacion, EntidadFinancieraCrud, Mensaje } from "src/app/common/domain";
import { DataService, ModalService, RegistrarEntidadFinancieraService } from 'src/app/common/services';
import { InformacionEF } from './model/informacionEF';
import { CondicionesForm } from './model/condicionesForm';
import { CondicionJson } from './model/condicionJson';
import { PlazoBeneficio } from './model/plazoBeneficio';

@Component({
  selector: 'app-condicion-ef',
  templateUrl: './condicion-ef.component.html',
  styleUrls: ['./condicion-ef.component.css']
})
export class CondicionEFComponent extends BaseComponent implements OnInit {

  public model: Model;


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
  condicionV: CondicionJson;
  public idborrar: any;
  items: Delegacion[];
  rol: string;

  itemsNum = [{}];
  resultErrorEditar: boolean;
  mensajeErrorCondicionesE: string;
  constructor(protected data: DataService, private router: Router, private modalService: ModalService, public registrarEntidadFinancieraService: RegistrarEntidadFinancieraService, private activatedRoute: ActivatedRoute, public location: Location) {
    super(data);
    this.model = this.data.model;
    this.regexTelefono = '^([0-9]{10})$';
    //this.regexCorreo = '\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$';
    this.plazos = null;
    this.plazosMock();
    this.model.mostrarExitoRegistro = false;
  }

  ngOnInit() {
    this.rol = "operadorEF" 
    this.registrarEntidadFinancieraService.consultarEstadosEF(this.model.entidadFinanciera.id).subscribe((response: Delegacion[]) => {
      this.items = response;
    });

    for (var i = 0; i < 100; i++) {
      //n += i;
      this.itemsNum.push({ id: i, valor: i });
    }
    this.model.mensaje.level = '';
    this.model.mensaje.mensaje = '';
    // tslint:disable-next-line: max-line-length
    this.numeroMax = "";
    this.condicionesForm.mMinimo = null;
    this.condicionesForm.mMax = null;
    this.condicionesForm.entidadFederativa = 1;
    this.condicionesArray = new Array();
    this.result = true;
    this.registrarEntidadFinancieraService.datosSesionMock();

    this.activatedRoute.queryParams.subscribe(
      params => {
        if (params['idEntidad'] != null) {
          this.model.personaEF.entidadFinanciera.id = params['idEntidad'];
        }
      });

    /*this.registrarEntidadFinancieraService.consultarExistePromotorEf(this.model.personaEF.entidadFinanciera.id)
      .subscribe((responseValidacion: any) => {

        if (responseValidacion.body.totalPromotores > 0) {
*/
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
          condicion.edadJ = (condicionEntidadFed.numEdadLimite != null ? condicionEntidadFed.numEdadLimite.toString() : null);
          condicion.mMinimoJ = condicionEntidadFed.monMinimo;
          condicion.mMaxJ = condicionEntidadFed.monMaximo;
          condicion.sexoJ = condicionEntidadFed.mclcSexo.desSexo;
          //---condicion.nombreEF = this.buscarEntidad(condicionEntidadFed.cveEntidadFederativa);
          condicion.nombreEF = this.buscarEntidad(condicionEntidadFed.cveDelegacion);
          this.condicionesArray.push(condicion);
        }

      });

    /*      } else {
            this.model.mensaje.level = "danger";
            this.model.mensaje.mensaje = "La entidad financiera no cuenta con promotores.";
          }
          
  
        });*/



  }

  agregar() {
    this.resultErrorEditar = false;
    this.mensajeErrorCondicionesE = "";

    this.result = true;
    this.condicionJ = new CondicionJson()
    this.condicionJ.edadJ = this.condicionesForm.edad;
    this.condicionJ.entidadFederativaJ = this.condicionesForm.entidadFederativa;
    this.condicionJ.nombreEF = this.buscarEntidad(this.condicionesForm.entidadFederativa);
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
      // this.validarCamposVaciosCondicion(this.condicionJ);
    }
    if (this.result) {
      this.validarMontoMinimoMaximo(this.condicionJ);
    }

    if (this.result) {
      this.condicionesArray.push(this.condicionJ);
    } else {
      this.openModal('condicionDuplicada');
    }
    //ORDENAMOS LA LISTA 
    this.ordenarArrayEntidad();
    //this.condicionesArray.sort(this.ordenarArrayEntidad("entidadFederativaJ"));
    //console.log(JSON.stringify(this.condicionesArray) );
  }

  buscarEntidad(entidad: number) {
    //---const found = this.items.find(x => x.id == entidad);
    const found = this.items.find(x => x.id == entidad);
    //---return found.name;
    return found.desDelegacion;
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
    //console.log("EL ID ES EDITAR " + id);
    //console.log(JSON.stringify(this.condicionesArray));
    const index = this.condicionesArray.findIndex(x => x.id === id);
    this.condicionV = new CondicionJson();
    this.condicionV = this.condicionesArray[index];
    this.condicionesArray[index].entidadFederativaE = this.condicionesArray[index].entidadFederativaJ;
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
    this.condicionV.entidadFederativaJ = this.condicionV.entidadFederativaE;
    this.condicionV.sexoJ = this.condicionV.sexoJ;
    this.condicionV.edadJ = this.condicionV.edadE;
    this.condicionV.mMaxJ = this.condicionV.mMaxE;
    this.condicionV.mMinimoJ = this.condicionV.mMinimoE;
    this.condicionV.nombreEF = this.buscarEntidad(this.condicionV.entidadFederativaE);
    //***  BORRAMOS ENTIDAD Y DEPUES GUARDAMOS LA MODIFICACIONES */
    //***** VALIDAMOS MONTO DE LA ENTIDAD  ****************/
    if (this.validarEntidadModificada(this.condicionV)) {
      if (index !== undefined) {
        this.condicionesArray.splice(index, 1);
      }

      this.condicionesArray.push(this.condicionV);
    } else {
      this.condicionV.editar = false;
      this.resultErrorEditar = true;
      this.mensajeErrorCondicionesE = "El monto mínimo debe ser menor al monto máximo.";

    }

    this.ordenarArrayEntidad();
  }

  validarEntidadModificada(entidad: CondicionJson) {

    var validado = true;

    if (entidad.mMinimoJ > entidad.mMaxJ) {
      validado = false;
    }
    return validado;

  }


  validarEntidadFederativa(condicion: CondicionJson) {
    var i;
    this.result = true;
    this.condicionV = new CondicionJson();
    for (i = 0; i < this.condicionesArray.length; i++) {
      this.condicionV = this.condicionesArray[i];

      if (this.condicionV.edadJ == condicion.edadJ &&
        this.condicionV.entidadFederativaJ == condicion.entidadFederativaJ &&
        this.condicionV.mMaxJ == condicion.mMaxJ &&
        this.condicionV.mMinimoJ == condicion.mMinimoJ) {
        this.result = false;
        this.mensajeErrorCondiciones = "Esta condición ya esta registrada";
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

    if (condicion.mMaxJ == null || condicion.mMinimoJ == null || condicion.edadJ === "undefined" || condicion.sexoJ === "undefined") {
      this.result = false;
      this.mensajeErrorCondiciones = "Existe campos vacios";

    }


    if (typeof (condicion.mMinimoJ) != 'number') {

      this.result = false;
      this.mensajeErrorCondiciones = "El monto mínimo no es valido.";
      return null;
    }

    if (typeof (condicion.mMaxJ) != 'number') {

      this.result = false;
      this.mensajeErrorCondiciones = "El monto máximo no es valido.";
      return null;
    }
    if (condicion.mMinimoJ > condicion.mMaxJ) {
      this.result = false;
      this.mensajeErrorCondiciones = "El monto mínimo debe ser menor al monto máximo.";
      return null;
    }





  }

  validarCamposVaciosCondicion(condicion: CondicionJson) {
    //console.log("LA EDAD "+condicion.edadJ);
    //console.log("LA entidadFederativaJ:. "+condicion.entidadFederativaJ );
    //console.log("EL MONTO MINIMO :. "+condicion.mMinimoJ );
    //console.log("EL MONTO MAXICMO:. "+condicion.mMaxJ );

    if (condicion.mMaxJ == null || condicion.mMinimoJ == null || condicion.edadJ === "undefined" || condicion.sexoJ === "undefined") {
      this.result = false;
      this.mensajeErrorCondiciones = "Existe campos vacios";
    }
  }
  // validarCondiciones(condicion: CondicionJson) {
  //   var i;
  //   this.result = true;
  //   this.condicionV = new CondicionJson();
  //   for (i = 0; i < this.condicionesArray.length; i++) {
  //     this.condicionV = this.condicionesArray[i];
  //     if (condicion.edadJ != null && condicion.entidadFederativaJ != null && condicion.mMaxJ != null && condicion.mMinimoJ != null) {
  //       this.result = false;
  //       this.mensajeErrorCondiciones = "Esta condicion ya esta registrada";
  //     }

  //   }
  // }

  validarCamposVacios(condicion: CondicionJson) {
    var i;
    this.result = true;
    this.condicionV = new CondicionJson();
    for (i = 0; i < this.condicionesArray.length; i++) {
      this.condicionV = this.condicionesArray[i];
      if (condicion.edadJ != null && condicion.entidadFederativaJ != null && condicion.mMaxJ != null && condicion.mMinimoJ != null) {
        this.result = false;
      }
      if (this.condicionV.edadJ == condicion.edadJ && this.condicionV.entidadFederativaJ == condicion.entidadFederativaJ && this.condicionV.mMaxJ == condicion.mMaxJ && this.condicionV.mMinimoJ == condicion.mMinimoJ) {
        this.result = false;
      }

    }
  }

  // ordenarArrayEntidad(valor) {
  //   var sortOrder = 1;

  //   if (valor[0] === "-") {
  //     sortOrder = -1;
  //     valor = valor.substr(1);
  //   }

  //   return function (a, b) {
  //     if (sortOrder == -1) {
  //       return b[valor].localeCompare(a[valor]);
  //     } else {
  //       return a[valor].localeCompare(b[valor]);
  //     }
  //   }
  // }

  ordenarArrayEntidad() {
    //alert("ENTRA A ORDENAR ");
    this.condicionesArray.sort(function (a, b) {
      if (a.nombreEF > b.nombreEF) {
        return 1;
      }
      if (a.nombreEF < b.nombreEF) {
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
      this.plazos[index].mensajeError = "El CAT capturado no es valido ";
      return null;

    }






    if (this.plazo.catForm > this.plazo.cat) {
      this.plazos[index].error = true;
      this.plazos[index].mensajeError = "El CAT capturado excede el CAT registrado ante el IMSS. Por favor verifica.";
    }
    if (this.plazo.catForm != null && !/^[0-9]+([.][0-9]+)?$/.test(this.plazo.catForm.toString())) {
      this.plazos[index].error = true;
      this.plazos[index].mensajeError = "El campo solo acepta caracteres numéricos";
    }

  }



  continuar() {
    //******* VALIDAMOS CONTINUAR   */

    let valorValidacion = this.validarFormulario();
    // alert(valorValidacion);


    this.closeModal("RegistrarEF");

    if (valorValidacion) {

      this.openModal("carga");

      let payload = { condicionFederativa: [], mclcBeneficioCollection: [] };

      for (let condiciones of this.condicionesArray) {
        payload.condicionFederativa.push({
          cveEntidadFederativa: condiciones.entidadFederativaJ,
          numEdadLimite: condiciones.edadJ,
          monMinimo: condiciones.mMinimoJ,
          monMaximo: condiciones.mMaxJ,
          mclcEntidadFinanciera: {
            id: this.model.registrarEntidadFinanciera.id,
          },
          mclcSexo: {
            id: (condiciones.sexoJ == "Masculino" ? 1 : 2),
          }
        });
      }

      for (let beneficios of this.plazos) {
        payload.mclcBeneficioCollection.push({
          //id: beneficios.idBeneficioA,
          desBeneficio: beneficios.valorBeneficioA,
          mclcCondicionOferta: {
            id: beneficios.id,
            porCat: beneficios.catForm
          }
        });

        payload.mclcBeneficioCollection.push({
          //id: beneficios.idBeneficioB,
          desBeneficio: beneficios.valorBeneficioB,
          mclcCondicionOferta: {
            id: beneficios.id,
            porCat: beneficios.catForm
          }
        });

        payload.mclcBeneficioCollection.push({
          //id: beneficios.idBeneficioC,
          desBeneficio: beneficios.valorBeneficioC,
          mclcCondicionOferta: {
            id: beneficios.id,
            porCat: beneficios.catForm
          }
        });
      }

      this.registrarEntidadFinancieraService.registrarCondiciones(payload)
        .subscribe((response: any) => {
          //console.log("payloaresponsed:" + JSON.stringify(response, null, 2));
          this.model.mostrarExitoRegistro = true;
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
      if (beneficios.catForm == null ||
        String.IsNullOrWhiteSpace(beneficios.valorBeneficioA) ||
        String.IsNullOrWhiteSpace(beneficios.valorBeneficioB) ||
        String.IsNullOrWhiteSpace(beneficios.valorBeneficioC)) {
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
      this.mensajeErrorCondicionesE = "Hay campos vacios";

      validarPlazos = false;

    } else {

      this.resultErrorEditar = false;
      this.mensajeErrorCondicionesE = " ";
    }

    return validarPlazos;
  }

}

