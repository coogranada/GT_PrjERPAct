import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginComponent } from './Components/login/login.component';
import { APP_ROUTING, AppRoutingModule, routes } from './app.routes';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginService } from './Services/Login/login.service';
import { EnvironmentService } from './Services/Enviroment/enviroment.service';
import { AuthService } from './Services/General/Auth.service';
import { WindowRef } from './Services/Enviroment/WindowRef.service';
import { ExcelService } from './Services/General/excel.service';
import { AuthHttpClientInterceptorService } from './Services/Auth/auth-http-client-interceptor.service';
import { NgIdleModule } from '@ng-idle/core';
import { LayoutComponent } from './Components/layout/layout.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { UserIdleModule } from 'angular-user-idle';
import { BannerImagenesComponent } from './Components/Maestros/banner-imagenes/banner-imagenes.component';
import { BannerImagenModalComponent } from './Components/Maestros/banner-imagenes/banner-imagenes-modal/banner-imagen-modal/banner-imagen-modal.component';
import { PerfilComponent } from './Components/Perfil/perfil.component';
import { AcercaDeComponent } from './Components/acerca-de/acerca-de.component';
import { AplicacionesColaborativasComponent } from './Components/Aplicaciones-colaborativas/aplicaciones-colaborativas.component';
import { LibretaDireccionesComponent } from './Components/libreta-direcciones/libreta-direcciones.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { NgxCurrencyDirective , NgxCurrencyInputMode , provideEnvironmentNgxCurrency } from 'ngx-currency';

const customCurrencyMaskConfig = { 
  align : "right" , 
  allowNegative : false , 
  allowZero : false , 
  decimal : "," , 
  precision : 2 , 
  prefix : "$" , 
  suffix : "" , 
  miles : "." , 
  thousands: '.',
  nullable : false , 
  min : null , 
  max : null , 
  inputMode : NgxCurrencyInputMode.Natural
 }; 
@NgModule({
  declarations: [
    LoginComponent,AppComponent,LayoutComponent,BannerImagenModalComponent,BannerImagenesComponent,
    PerfilComponent,AcercaDeComponent,AplicacionesColaborativasComponent,LibretaDireccionesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NguiAutoCompleteModule,
    BrowserAnimationsModule,
    NoopAnimationsModule ,
    NgxCurrencyDirective,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(255,255,255,0.8)'
    }),
    UserIdleModule.forRoot({ idle: 300, timeout: 10, ping: 120 }),
    NgIdleModule.forRoot(),
    ToastrModule.forRoot()
    
  ],providers: [
    LoginService,
    EnvironmentService,
    AuthService,
    WindowRef,
    provideEnvironmentNgxCurrency (customCurrencyMaskConfig) ,
    //NotificationsService,
    // { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    // { provide: LOCALE_ID, useValue: 'es-CO' },
    // { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
     { provide: HTTP_INTERCEPTORS, useClass: AuthHttpClientInterceptorService,multi : true},
     { provide: LocationStrategy, useClass: HashLocationStrategy },
    ExcelService,
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
