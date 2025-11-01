import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyCommonModule } from '../common/my.common.module';


import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';

import { OperadorEFRoutingModule } from './operadorEF-routing.module';
import { BuscarFolioAutorizarComponent } from './buscar-folio-autorizar/buscar.folio.autorizar.component';
import { ElegirCartaAutorizarComponent } from './elegir-carta-autorizar/elegir.carta.autorizar.component';
import { PrestamoAutorizarComponent } from './prestamo-autorizar/prestamo.autorizar.component';
import { AutorizarInformeComponent } from './autorizar-informe/autorizar.informe.component';
import { AutorizarDocumentoComponent } from './autorizar-documento/autorizar.documento.component';
import { AnexarComprobanteComponent } from './anexar-comprobante/anexar.comprobante.component';
import { DocumentosAnexadosComponent } from './documentos-anexados/documentos.anexados.component';
import { CargarComprobanteComponent } from './cargar-comprobante/cargar.comprobante.component';
import { FinalizarCargaComponent } from './finalizar-carga/finalizar.carga.component';
import { DatosSimulacionAutorizadorComponent } from '../common/datos-simulacion-autorizador/datos.simulacion.autorizador.component';
// tslint:disable-next-line: max-line-length
import { EntidadFinancieraAutorizarDatosComponent } from '../common/entidad-financiera-datos-autorizar/entidad.financiera.datos.autorizar.component';
import { PensionadoDatosAutorizarComponent } from '../common/pensionado-datos-autorizador/pensionado.datos.autorizador.component';
import { PromotorDatosAutorizadorComponent } from '../common/promotor-datos-autorizador/promotor.datos.autorizador.component';

import { OperacionesPrestamoComponent } from './operaciones-prestamo/operaciones-prestamo.component';

// tslint:disable-next-line: max-line-length

import { CondicionEFComponent } from './condicion-ef/condicion-ef.component';
import { HomeComponent } from './home/home.component';
import { ComponentsUxModule } from '../components-ux/components-ux.module';
import { ReactiveFormsModule }    from '@angular/forms';
import { InformeMontoLiquidarComponent } from './informe-monto-liquidar/informe-monto-liquidar.component';
import { AutorizarCartaRecuperacionComponent } from './autorizar-carta-recuperacion/autorizar-carta-recuperacion.component';
import { CartaInstruccionAutorizadaComponent } from './carta-instruccion-autorizada/carta-instruccion-autorizada.component';
import { InformeMontoLiquidarCapComponent } from './informe-monto-liquidar-cap/informe-monto-liquidar-cap.component';
import { ConsultarNotificacionComponent } from './consultar-notificacion/consultar-notificacion.component';
import { RegistrarComunicadoComponent } from './registrar-comunicado/registrar-comunicado.component';
import { ConsultarNotificacionDetalleComponent } from './consultar-notificacion-detalle/consultar-notificacion-detalle.component';
import { TwoDigitDecimaNumberDirective } from './informe-monto-liquidar/dosdecimales.directive';
import { ReportesOperadorEFComponent } from './reportes/reportes.operador.ef.component';
import { prestamosrecuperaciondatosautorizador } from '../common/prestamos-recuperacion-datos-autorizador/prestamos.recuperacion.datos.autorizador.component';
import { CargarDocumentacionAdicionalComponent } from './cargar-documentacion-adicional/cargar.documentacion.adicional.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';
import { ModificarDatosPensionadoEfComponent } from './modificar-datos-pensionado-ef/modificar-datos-pensionado-ef.component';
import { ReinstalarPrestamoEditarComponent } from './reinstalar-prestamo-editar/reinstalar-prestamo-editar.component';
import { ReinstalarPrestamoInformeComponent } from './reinstalar-prestamo-informe/reinstalar-prestamo-informe.component';
import { ReinstalarPrestamoCartaComponent } from './reinstalar-prestamo-carta/reinstalar-prestamo-carta.component';


@NgModule({
  imports: [
    MyCommonModule,
    CommonModule,
    FormsModule,
    KeyFilterModule,
    InputMaskModule,
    OperadorEFRoutingModule,
    ComponentsUxModule,
    ReactiveFormsModule
  ],
  declarations: [
    BuscarFolioAutorizarComponent,
    ElegirCartaAutorizarComponent,
    PrestamoAutorizarComponent,
    AutorizarInformeComponent,
    AutorizarDocumentoComponent,
    AnexarComprobanteComponent,
    DocumentosAnexadosComponent,
    CargarComprobanteComponent,
    FinalizarCargaComponent,
    DatosSimulacionAutorizadorComponent,
    EntidadFinancieraAutorizarDatosComponent,
    PensionadoDatosAutorizarComponent,
    PromotorDatosAutorizadorComponent,
    OperacionesPrestamoComponent,
    CondicionEFComponent,
    HomeComponent,
    InformeMontoLiquidarComponent,
    AutorizarCartaRecuperacionComponent,
    CartaInstruccionAutorizadaComponent,
    InformeMontoLiquidarCapComponent,
    ConsultarNotificacionComponent,
    RegistrarComunicadoComponent,
    ConsultarNotificacionDetalleComponent,
    TwoDigitDecimaNumberDirective,
    ReportesOperadorEFComponent,
    prestamosrecuperaciondatosautorizador,
    CargarDocumentacionAdicionalComponent,
    CartaReciboComponent,
    DetalleConciliacionComponent,
    ModificarDatosPensionadoEfComponent,
    ReinstalarPrestamoEditarComponent,
    ReinstalarPrestamoInformeComponent,
    ReinstalarPrestamoCartaComponent,
  ]
})
export class OperadorEFModule { }
