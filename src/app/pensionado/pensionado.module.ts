import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { MyCommonModule }    from '../common/my.common.module';

import { HomeComponent }    from './home/home.component';
import { CapacidadCreditoComponent }    from './capacidad-credito/capacidad.credito.component';
//import { PrestamosVigentesComponent } from '../common/prestamos-vigentes/prestamos.vigentes.component';
import { CapacidadInformeComponent }    from './capacidad-informe/capacidad.informe.component';
import { CapacidadResumenComponent } from './capacidad-resumen/capacidad-resumen.component';

import { SimulacionBusquedaComponent } from './simulacion-busqueda/simulacion.busqueda.component';
import { SimulacionSelecionarComponent } from './simulacion-seleccionar/simulacion.selecionar.component';
import { PrestamosCondicionesComponent } from '../common/prestamos-condiciones/prestamos.condiciones.component';
import { SimulacionInformeComponent } from './simulacion-informe/simulacion.informe.component';
import { SimulacionFinalizarComponent } from './simulacion-finalizar/simulacion.finalizar.component';
import {SeleccionarGrupoFamiliarComponent} from './seleccionar-grupo-familiar/seleccionar.grupo.familiar.component';
import {SimulacionBusquedaDescuentoComponent} from './simulacion-busqueda-descuento/simulacion.busqueda.descuento.component';

import { UserProfileComponent }    from '../common/user-profile/user.profile.component';
import { PensionadoDatosComponent } from '../common/pensionado-datos/pensionado.datos.component';
import { DescargaImprimeComponent } from '../common/descarga-imprime/descarga.imprime.component';
import { AvisoPrivacidadComponent } from '../common/aviso-privacidad/aviso.privacidad.component';
import { AlertasComponent } from '../common/alertas/alertas.component';

import { PensionadoRoutingModule } from './pensionado-routing.module';
import { PensionadoDatosCapacidadComponent } from './pensionado-datos-capacidad/pensionado.datos.capacidad.component';
import { SimulacionCancelarComponent } from './simulacion-cancelar/simulacion.cancelar.component';
import { from } from 'rxjs';
import { BuscarFolioCancelarComponent } from './buscar-folio-cancelar/buscar.folio.cancelar.component';
import { CapacidadCancelarComponent } from './capacidad-cancelar/capacidad.cancelar.component';
import { MenuComponent } from './menu/menu.component';
//import { CapacidadCreditComponent } from '../common/capacidad-credito/capacidad.credit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimulacionCancelacionFolioComponent } from './simulacion-cancelacion-folio/simulacion-cancelacion-folio.component';
import {ComponentsUxModule} from '../components-ux/components-ux.module';
import { CapacidadCancelarResumenComponent } from './capacidad-cancelar-resumen/capacidad-cancelar-resumen.component';

import { SimulacionVerDetalleComponent } from './simulacion-ver-detalle/simulacion.ver.detalle.component';

@NgModule({
  imports: [
    MyCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PensionadoRoutingModule,
    NgbModule,
    ComponentsUxModule
  ],
  declarations: [
    HomeComponent,
    CapacidadCreditoComponent,
    //UserProfileComponent,
    CapacidadCreditoComponent,
    CapacidadInformeComponent,
    CapacidadResumenComponent,
    SimulacionBusquedaComponent,
   // PrestamosVigentesComponent,
    PrestamosCondicionesComponent,
    SeleccionarGrupoFamiliarComponent,
    SimulacionSelecionarComponent,
    SimulacionInformeComponent,
    SimulacionFinalizarComponent,
    SimulacionBusquedaDescuentoComponent,
    //DescargaImprimeComponent,
    //AvisoPrivacidadComponent,
    //CapacidadCreditComponent,
    //AlertasComponent,
    PensionadoDatosCapacidadComponent,
    SimulacionCancelarComponent,
    BuscarFolioCancelarComponent,
    CapacidadCancelarComponent,
    MenuComponent,
    SimulacionCancelacionFolioComponent,
    CapacidadCancelarResumenComponent,
    SimulacionVerDetalleComponent
  ]
})
export class PensionadoModule {}
