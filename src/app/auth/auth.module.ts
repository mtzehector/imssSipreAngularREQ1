import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { LoginComponent }    from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule }    from '@angular/forms';
import { MyCommonModule } from '../common/my.common.module';
import { RecuperaContraComponent } from './login/recupera-contra/recupera-contra.component';
import { CambioContraComponent } from './login/cambio-contra/cambio-contra.component';
import { RegistroUsuarioPensionadoComponent } from './login/registro-usuario-pensionado/registro-usuario-pensionado.component';
import { BlockCopyPasteDirective } from './login/block-copy-paste.directive';

import { RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MyCommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  declarations: [
    LoginComponent,
    RecuperaContraComponent,
    CambioContraComponent,
    RegistroUsuarioPensionadoComponent,
    BlockCopyPasteDirective
  ], 
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],
})
export class AuthModule {}
