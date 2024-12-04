import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpLoaderFactory } from './modules/shared/services/http-loader.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { SharedModule } from './modules/shared/shared.module';
import { CollectionModule } from './modules/collection/collection.module';
import { tokenInterceptorProviders } from './modules/shared/services/token-interceptor.service';
import { HomeModule } from './modules/home/home.module';
import { ConferenceModule } from './modules/conference/conference.module';
import { AccountsReceivableModule } from './modules/accounts-receivable/accounts-receivable.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AccountsPayableModule } from './modules/accounts-payable/accounts-payable.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthenticationModule,
    SharedModule,
    HomeModule,
    CollectionModule,
    ConferenceModule,
    AccountsReceivableModule,
    AccountsPayableModule,
    SettingsModule,
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpBackend]
        }
    }),
    NgbModule
  ],
  providers: [tokenInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
