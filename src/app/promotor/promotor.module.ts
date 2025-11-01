import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyCommonModule } from '../common/my.common.module';
import { PromotorRoutingModule } from './promotor-routing.module';
import { BuscarFolioComponent } from './buscar-folio/buscar.folio.component';
import { CartaInstruccionInformeComponent } from './carta-instruccion-informe/carta.instruccion.informe.component';
import { CondicionesPrestamoComponent } from './condiciones-prestamo/condiciones.prestamo.component';
import { FolioComponent } from './folio/folio.component';
import { CartaFinalizarComponent } from './carta-finalizar/carta.finalizar.component';
import { CartaCapInformeComponent } from './carta-cap-informe/carta.cap.informe.component';
import { CartaCapacidadInformeComponent } from './carta-capacidad-informe/carta.capacidad.informe.component';
import { ProPensionadoDatosComponent } from './pro-pensionado-datos/pro.pensionado.datos.component';
import { ProEntidadFinancieraComponent } from './pro-entidad-financiera/pro.entidad.financiera.component';
import { ProDatosSimulacionComponent } from './pro-datos-simulacion/pro.datos.simulacion.component';
import { ResumenSimulacionComponent } from './resumen-simulacion/resumen.simulacion.component';
import { PromotorDatosCartaComponent } from './promotor-datos-carta/promotor.datos.carta.component';
import { DescargaImprimePromotorComponent } from './descarga-imprime-promotor/descarga.imprime.promotor.component';
import { HomeComponent } from './home/home.component';
import { ComponentsUxModule } from '../components-ux/components-ux.module';
import { TerminoCondicionesComponent } from './termino-condiciones/termino-condiciones.component';
import { TerminoCondicionesCapacidadComponent } from './terminos-condiciones-capacidad/terminos-condiciones-capacidad.component';
import { RegistrarPrestamoComponent } from './registrar-prestamo/registrar-prestamo.component';
import { ReactiveFormsModule }    from '@angular/forms';
import { RegistrarPrestamoEditarComponent } from './registrar-prestamo-editar/registrar-prestamo-editar.component';
import { RegistrarPrestamoInformeComponent } from './registrar-prestamo-informe/registrar-prestamo-informe.component';
import { RegistrarPrestamoCartaComponent } from './registrar-prestamo-carta/registrar-prestamo-carta.component';
import { RegistrarPrestamoInformeDetalleComponent } from './registrar-prestamo-informe-detalle/registrar-prestamo-infome-detalle.component';

import { NumberDirective } from './registrar-prestamo-editar/numbers-only.directive';
import { BuscarFolioDetalleComponent } from './buscar-folio-detalle/buscar-folio-detalle.component';
//import { PrestamosVigentesComponent } from '../common/prestamos-vigentes/prestamos.vigentes.component';

@NgModule({
  imports: [
    MyCommonModule,
    CommonModule,
    FormsModule,
    PromotorRoutingModule,
    ComponentsUxModule,
    ReactiveFormsModule
    
  ],
  declarations: [
    BuscarFolioComponent,
    CartaInstruccionInformeComponent,
    //PromotorDatosComponent,
    CondicionesPrestamoComponent,
    FolioComponent,
    CartaFinalizarComponent,
    CartaCapInformeComponent,
    CartaCapacidadInformeComponent,
    ProPensionadoDatosComponent,
    ProEntidadFinancieraComponent,
    ProDatosSimulacionComponent,
    ResumenSimulacionComponent,
    PromotorDatosCartaComponent,
    DescargaImprimePromotorComponent,
    HomeComponent,
    TerminoCondicionesComponent,
    TerminoCondicionesCapacidadComponent,
    RegistrarPrestamoComponent,
    RegistrarPrestamoEditarComponent,
    RegistrarPrestamoInformeComponent,
    RegistrarPrestamoCartaComponent,
    RegistrarPrestamoInformeDetalleComponent,
    NumberDirective,
    BuscarFolioDetalleComponent,
    //PrestamosVigentesComponent
    
  ]
})
export class PromotorModule { }
