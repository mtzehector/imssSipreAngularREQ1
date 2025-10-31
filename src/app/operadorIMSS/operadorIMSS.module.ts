import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

import { OperadorIMSSRoutingModule } from './operadorIMSS-routing.module';
import { BuscarFolioImssComponent } from './buscar-folio-imss/buscar.folio.imss.component';
import { MyCommonModule } from '../common/my.common.module';
import { EntidadFinancieraRegistrarComponent } from './entidad-financiera-registrar/entidad-financiera-registrar.component';
import { ConsultarEntidadFinancieraComponent } from './consultar-entidad-financiera/consultar-entidad-financiera.component';
import { EntidadFinancieraEditarComponent } from './entidad-financiera-editar/entidad-financiera-editar.component';
import { EntidadFinancieraEditarAdminComponent } from './entidad-financiera-editar-admin/entidad-financiera-editar-admin.component';
import { EntidadFinancieraEditarBancarioComponent } from './entidad-financiera-editar-bancario/entidad-financiera-editar-bancario.component';
import { EntidadFinancieraEditarCatComponent } from './entidad-financiera-editar-cat/entidad-financiera-editar-cat.component';
import { EntidadFinancieraEditarConvenioComponent } from './entidad-financiera-editar-convenio/entidad-financiera-editar-convenio.component';
import { EntidadFinancieraEditarPatronComponent } from './entidad-financiera-editar-patron/entidad-financiera-editar-patron.component';
import { EntidadFinancieraDetalleComponent } from './entidad-financiera-detalle/entidad-financiera-detalle.component';
import { RegistraNotificacionComponent } from './registra-notificacion/registra-notificacion.component';
import { PrestamosComponent } from './registra-notificacion/prestamos/prestamos.component';
import { ArchivosAdjuntosComponent } from './registra-notificacion/archivos-adjuntos/archivos-adjuntos.component';
import { CalendarioDirective } from './registra-notificacion/directivas/calendario.directive';
import { ConsultarNotificacionComponent } from './consultar-notificacion/consultar-notificacion.component';
import { ResultadoBusquedaComponent } from './consultar-notificacion/resultado-busqueda/resultado-busqueda.component';
import {ComponentsUxModule } from '../components-ux/components-ux.module';
import { ConsultarNotificacionDetalleComponent } from './consultar-notificacion-detalle/consultar-notificacion-detalle.component';
import { HomeComponent } from './home/home.component';
import { BlockCopyPasteDirective } from './entidad-financiera-editar-bancario/block-copy-paste.directive';
import { NumberDirective } from './entidad-financiera-editar-patron/numbers-only.directive';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
import { ReportesComponent } from './reportes/reportes.component';
import { EntidadFinancieraRegistroPatronalComponent } from './entidad-financiera-registro-patronal/entidad-financiera-registro-patronal.component';
import { ModificarDatosPensionado } from './modificar-datos-pensionado/modificar.datos.pensionado.component';
import { EntidadFinancieraEditarPSCertificacionComponent } from './entidad-financiera-editar-ps-certificacion/entidad-financiera-editar-ps-certificacion.component';
import { EntidadFinancieraEditarPSValidacionBiometricaComponent } from './entidad-financiera-editar-ps-validacion-biometrica/entidad-financiera-editar-ps-validacion-biometrica.component';
import { CartaReciboComponent } from './carta-recibo/carta-recibo.component';

@NgModule({
  imports: [
    MyCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OperadorIMSSRoutingModule,
    InputTextModule,
    KeyFilterModule,
    InputMaskModule,
    CalendarModule,
    DropdownModule,
    ComponentsUxModule
  ],
  declarations: [
    BuscarFolioImssComponent,
    EntidadFinancieraRegistrarComponent,
    ConsultarEntidadFinancieraComponent,
    EntidadFinancieraEditarComponent,
    EntidadFinancieraEditarAdminComponent,
    EntidadFinancieraEditarBancarioComponent,
    EntidadFinancieraEditarCatComponent,
    EntidadFinancieraEditarConvenioComponent,
    EntidadFinancieraEditarPatronComponent,
    EntidadFinancieraDetalleComponent,
    RegistraNotificacionComponent,
    PrestamosComponent,
    ArchivosAdjuntosComponent,
    CalendarioDirective,
    ConsultarNotificacionComponent,
    ResultadoBusquedaComponent,
    ConsultarNotificacionDetalleComponent,
    HomeComponent,
    BlockCopyPasteDirective,
    NumberDirective,
    BuscarFolioDetalleComponent,
    ReportesComponent,
    EntidadFinancieraRegistroPatronalComponent,
    ModificarDatosPensionado,
    EntidadFinancieraEditarPSCertificacionComponent,
    EntidadFinancieraEditarPSValidacionBiometricaComponent,
    CartaReciboComponent
  ],providers: [
    DatePipe,
  ]
})
export class OperadorIMSSModule { }
