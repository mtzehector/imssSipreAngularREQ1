import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';

import { UserProfileComponent, FormatTimePipe } from './user-profile/user.profile.component';
import { AlertasComponent } from './alertas/alertas.component';
import { PensionadoDatosComponent } from './pensionado-datos/pensionado.datos.component';
import { DescargaImprimeComponent } from './descarga-imprime/descarga.imprime.component';
import { AvisoPrivacidadComponent } from './aviso-privacidad/aviso.privacidad.component';
import { CapacidadCreditComponent } from './capacidad-credito/capacidad.credit.component';
import { DigitOnlyDirective } from './digit-only.directive';
import { DatosSimulacionComponent } from './datos-simulacion/datos.simulacion.component';
import { EntidadFinancieraDatosComponent } from './entidad-financiera-datos/entidad.financiera.datos.component';
import { GestionDomicilioComponent } from './gestion-domicilio/gestion-domicilio.component';
import { BaseComponent } from './base.component';
import { PagerComponent } from './pager/pager.component';
import { PromotorDatosComponent } from './promotor-datos/promotor.datos.component';
import { UploadComponent } from './upload/upload.component';
import { DownloadComponent } from './download/download.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { ModalComponent } from 'src/app/common/modeal-component';
import { TerminoCondicionesComponent } from './termino-condiciones/termino.condiciones.component';
import { UploadXmlComponent } from './upload.xml/upload.xml.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { ComponentsUxModule } from '../components-ux/components-ux.module';
import { PrestamosVigentesComponent } from '../common/prestamos-vigentes/prestamos.vigentes.component';
import { BusquedaFolioDetalleComponent } from './busqueda-folio-detalle/busqueda-folio-detalle.component';
import { SeccionAyudaComponent } from './seccion-ayuda/seccion-ayuda.component';
import { HeaderComponent } from './header/header.component';
import { BusquedaNotificacionComponent } from './busqueda-notificacion/busqueda-notificacion.component';
import { AppNotificacionDetalle } from './notificaciones/app-notificacion-detalle.component'
import { AtencionNotificacionComponent } from './notificaciones/atencion-notificacion/atencion-notificacion.component';
import { AppNotificacionSeguimiento } from './notificaciones/seguimiento/app-notificacion-seguimiento.component';
import { ArchivosAdjuntosComponent } from './notificaciones/atencion-notificacion/archivos-adjuntos/archivos-adjuntos.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { ConsultarCepCompraComponent } from './busqueda-cep-compra/busqueda-cep-compra.component';
import { RegistroComunicadoCommonComponent } from './registro-comunicado/registro-comunicado-common.component';
import { PrestamoRegistroComunicadoCommonComponent } from './registro-comunicado/prestamo-registro-communicado-common/prestamo-registro-communicado-common.component';
import { ArchivosAdjuntosRegistroComunicadoCommonComponent } from './registro-comunicado/archivos-adjuntos-registro-communicado-common/archivos-adjuntos-registro-communicado-common.component';
import { CreacionCartaReciboComponent } from './creacion-carta-recibo/creacion-carta-recibo.component';
import { CreacionDetalleConciliacionComponent } from './creacion-detalle-conciliacion/creacion-detalle-conciliacion.component';
import { ModificacionDatosPensionadoComponent } from './modificacion-datos-pensionado/modificacion-datos-pensionado.component';
import { HistoricoDatosPensionadoComponent } from './historico-datos-pensionado/historico-datos-pensionado.component';
import { PrevieneDobleClickDirective } from './previene-doble-click/previene.doble.click.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KeyFilterModule,
    InputMaskModule,
    ComponentsUxModule
  ],
  exports: [
    AlertasComponent,
    PensionadoDatosComponent,
    UserProfileComponent,
    DescargaImprimeComponent,
    AvisoPrivacidadComponent,
    CapacidadCreditComponent,
    DigitOnlyDirective,
    EntidadFinancieraDatosComponent,
    DatosSimulacionComponent,
    PagerComponent,
    PromotorDatosComponent,
    BaseComponent,
    EscapeHtmlPipe,
    UploadComponent,
    UploadXmlComponent,
    DownloadComponent,
    ModalComponent,
    TerminoCondicionesComponent,
    GestionDomicilioComponent,
    PrestamosVigentesComponent,
    BusquedaFolioDetalleComponent,
    SeccionAyudaComponent,
    HeaderComponent,
    FormatTimePipe,
    AppNotificacionDetalle,
    BusquedaNotificacionComponent,
    AppNotificacionSeguimiento,
    AtencionNotificacionComponent,
    ArchivosAdjuntosComponent,
    LoaderComponent,
    ConsultarCepCompraComponent,
    RegistroComunicadoCommonComponent,
    PrestamoRegistroComunicadoCommonComponent,
    ArchivosAdjuntosRegistroComunicadoCommonComponent,
    CreacionCartaReciboComponent,
    CreacionDetalleConciliacionComponent,
    ModificacionDatosPensionadoComponent,
    HistoricoDatosPensionadoComponent,
    PrevieneDobleClickDirective
  ],
  declarations: [
    UserProfileComponent,
    AlertasComponent,
    PensionadoDatosComponent,
    DescargaImprimeComponent,
    AvisoPrivacidadComponent,
    CapacidadCreditComponent,
    DigitOnlyDirective,
    EntidadFinancieraDatosComponent,
    DatosSimulacionComponent,
    PagerComponent,
    PromotorDatosComponent,
    BaseComponent,
    EscapeHtmlPipe,
    UploadComponent,
    UploadXmlComponent,
    DownloadComponent,
    ModalComponent,
    TerminoCondicionesComponent,
    GestionDomicilioComponent,
    MenuAdminComponent,
    PrestamosVigentesComponent,
    BusquedaFolioDetalleComponent,
    SeccionAyudaComponent,
    HeaderComponent,
    FormatTimePipe,
    AppNotificacionDetalle,
    BusquedaNotificacionComponent,
    AtencionNotificacionComponent,
    AppNotificacionSeguimiento,
    ArchivosAdjuntosComponent,
    LoaderComponent,
    ConsultarCepCompraComponent,
    RegistroComunicadoCommonComponent,
    PrestamoRegistroComunicadoCommonComponent,
    ArchivosAdjuntosRegistroComunicadoCommonComponent,
    CreacionCartaReciboComponent,
    CreacionDetalleConciliacionComponent,
    ModificacionDatosPensionadoComponent,
    HistoricoDatosPensionadoComponent,
    PrevieneDobleClickDirective
  ], providers: [
    DatePipe,
  ]

})
export class MyCommonModule { }
