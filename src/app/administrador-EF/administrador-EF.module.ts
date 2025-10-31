import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorEFRoutingModule } from './administrador-EF-routing.module';

import { HomeComponent } from './home/home.component';
import { ComponentsUxModule } from '../components-ux/components-ux.module';
import { MyCommonModule } from '../common/my.common.module';

import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CondicionEFComponent } from './condicion-ef/condicion-ef.component';
import { OperadorRegistrarComponent } from './operador-registrar/operador-registrar.component';
import { CargaDocumentoComponent } from './operador-editar/carga-documento/carga-documento.component';
import { OperadorExitoComponent } from './operador-exito/operador-exito.component';
import { PromotorRegistrarComponent } from './promotor-registrar/promotor-registrar.component';
import { PromotorConsultarComponent } from './promotor-consultar/promotor-consultar.component';
import { PromotorEditarComponent } from './promotor-editar/promotor-editar.component';
import { PromotorDetalleComponent } from './promotor-detalle/promotor-detalle.component';
import { PromotorConsultaDetalleComponent } from './promotor-consulta-detalle/promotor-consulta-detalle.component';
import { PromotorEditarCurpNssComponent } from './promotor-editar-curp-nss/promotor-editar-curp-nss.component';
import { PromotorDatosRenapoComponent } from './promotor-datos-renapo/promotor-datos-renapo.component';
// tslint:disable-next-line: max-line-length
import { PromotorEditarInfoComplementariaComponent } from './promotor-editar-info-complementaria/promotor-editar-info-complementaria.component';
import { PromotorEditarDocumentosComponent } from './promotor-editar-documentos/promotor-editar-documentos.component';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { ListarPromotoresComponent } from './asignar-promotor/listar-promotores.component';
import { OperadorConsultarComponent } from './operador-consultar/operador-consultar.component';
import { OperadorConsultaDetalleComponent } from './operador-consulta-detalle/operador-consulta-detalle.component';
import { OperadorDetalleComponent } from './operador-detalle/operador-detalle.component';
import { OperadorEditarComponent } from './operador-editar/operador-editar.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';
import { ConsultarCepCompraComponent } from './consulta-cep-compra/consulta-cep-compra.component';
import { ModificarDatosPensionadoAefComponent } from './modificar-datos-pensionado-aef/modificar-datos-pensionado-aef.component';



@NgModule({
  declarations: [
    PromotorRegistrarComponent,
    PromotorEditarComponent,
    PromotorConsultarComponent,
    PromotorDetalleComponent,
    PromotorConsultaDetalleComponent,
    HomeComponent,
    CondicionEFComponent,
    OperadorExitoComponent,
    OperadorRegistrarComponent,
    PromotorEditarCurpNssComponent,
    PromotorDatosRenapoComponent,
    PromotorEditarInfoComplementariaComponent,
    PromotorEditarDocumentosComponent,
    CargaDocumentoComponent,
    BuscarFolioDetalleComponent,
    ListarPromotoresComponent,
    OperadorConsultarComponent,
    OperadorConsultaDetalleComponent,
    OperadorDetalleComponent,
    OperadorEditarComponent,
    CartaReciboComponent,
    DetalleConciliacionComponent,
    ConsultarCepCompraComponent,
    ModificarDatosPensionadoAefComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdministradorEFRoutingModule,
    ComponentsUxModule,
    MyCommonModule,
    KeyFilterModule,
    InputMaskModule,
    ReactiveFormsModule
  ]
})
export class AdministradorEFModule { }
