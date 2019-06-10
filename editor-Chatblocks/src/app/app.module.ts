import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Componentes
import { MenuHerramientasComponent } from './general/menu-herramientas/menu-herramientas.component';

//Material-> Configurar animaciones 
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Importar los modulos de componentes
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';


//Modulo de formularios y bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { FromBlockInfoComponent } from './general/bloques/from-block-info/from-block-info.component';
import { FromBlockInputComponent } from './general/bloques/from-block-input/from-block-input.component';
import { MenuHDComponent } from './general/menu-hd/menu-hd.component';
import { FromBlockQRComponent } from './general/bloques/from-block-qr/from-block-qr.component';
import { FromBlockSlideComponent } from './general/bloques/from-block-slide/from-block-slide.component';
import { FromBlockTicketComponent } from './general/bloques/from-block-ticket/from-block-ticket.component';

import { Globals } from './general/bloques/interfaces/Globals';
import { ConstruccionCBComponent } from './general/lienzo-Graf/construccion-cb/construccion-cb.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FromSaveCBComponent } from './general/bloques/from-save-cb/from-save-cb.component';

import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';

//Login
import { SocialLoginModule } from 'angularx-social-login';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider  } from 'angularx-social-login';
import { MenuLoginComponent } from './general/menu-login/menu-login.component';
import { MenuChatbotsComponent } from './general/menu-chatbots/menu-chatbots.component';
import { ElementosComponent } from './general/bloques/componentes/elementos/elementos.component';
import { FromBlockInfoDComponent } from './general/bloques/from-block-info-d/from-block-info-d.component';
import { FromBlockSlideDComponent } from './general/bloques/from-block-slide-d/from-block-slide-d.component';
import { FromBlockInputDComponent } from './general/bloques/from-block-input-d/from-block-input-d.component';
import { FromBlockQRDComponent } from './general/bloques/from-block-qrd/from-block-qrd.component';


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('561602290896109')
  },
  {
    id: LinkedInLoginProvider.PROVIDER_ID,
    provider: new LinkedInLoginProvider('78iqy5cu2e1fgr')
  }
]);

export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    MenuHerramientasComponent,
    FromBlockInfoComponent,
    FromBlockInputComponent,
    MenuHDComponent,
    FromBlockQRComponent,
    FromBlockSlideComponent,
    FromBlockTicketComponent,
    ConstruccionCBComponent,
    FromSaveCBComponent,
    MenuLoginComponent,
    MenuChatbotsComponent,
    ElementosComponent,
    FromBlockInfoDComponent,
    FromBlockSlideDComponent,
    FromBlockInputDComponent,
    FromBlockQRDComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    FormsModule,
    SocialLoginModule,
    MatCardModule
  ],
  exports: [
    MatIconModule,
    MatToolbarModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
    Globals
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FromBlockInfoComponent,
    FromBlockInputComponent,
    FromBlockQRComponent,
    FromBlockSlideComponent,
    FromSaveCBComponent,
    ElementosComponent,
    FromBlockInfoDComponent,
    FromBlockSlideDComponent,
    FromBlockInputDComponent,
    FromBlockQRDComponent
  ]
})
export class AppModule { }
