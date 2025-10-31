import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard }            from './auth.guard';
import { AuthService }          from './auth.service';
import { LoginComponent }       from './login/login.component';
import { RecuperaContraComponent } from './login/recupera-contra/recupera-contra.component';
import { CambioContraComponent } from './login/cambio-contra/cambio-contra.component';
import { RegistroUsuarioPensionadoComponent } from './login/registro-usuario-pensionado/registro-usuario-pensionado.component';
const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recuperaContra', component:RecuperaContraComponent},
  { path: 'cambioContra', component:CambioContraComponent},
  { path: 'registroUsuario', component:RegistroUsuarioPensionadoComponent}
];
  

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}
