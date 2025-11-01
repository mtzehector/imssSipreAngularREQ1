import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectMultiComponent} from './componentes/select-multi/select-multi.component';

import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { CoincidirCadenas} from  './validadores/coincidirCadenas';
import { MenuUXComponent } from './componentes/menu-ux/menu-ux.component';
import { BreadcrumbUxComponent } from './componentes/breadcrumb-ux/breadcrumb-ux.component'; 
@NgModule({
  declarations: [
    SelectMultiComponent,
    MenuUXComponent,
    BreadcrumbUxComponent,
    
  
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule
  ], exports: [
    SelectMultiComponent,
    MenuUXComponent,
    BreadcrumbUxComponent
  ]
})
export class ComponentsUxModule { }
