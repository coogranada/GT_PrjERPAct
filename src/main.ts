import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(localeEsCo);

// Si estás en producción, habilitar el modo de producción
// if (environment.production) {
//   enableProdMode();
// }
platformBrowserDynamic().bootstrapModule(AppModule, {
   ngZoneEventCoalescing : false
  }).catch(err => console.log(err));;