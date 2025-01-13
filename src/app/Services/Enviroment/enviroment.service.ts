import { Injectable } from '@angular/core';
@Injectable()
export class EnvironmentService {
  public Url: string = ""; //Url de back .net framework
  public UrlCore: string = "";//Url de back .net core
  public UrlFront : string = "";// Url front
  public UrlBaseOlivos : string = ""; 
  UrlBackEnvironmentInt: number = 1;// variable de entorno
  //UrlBackEnvironmentInt == 1 == Desarrollo
  //UrlBackEnvironmentInt == 2 == Pruebas
  //UrlBackEnvironmentInt == 3 == Pruebas produccion
  //UrlBackEnvironmentInt == 4 == Produccion
  constructor() {
    this.GetUrls(this.UrlBackEnvironmentInt);
    this.getUrlEnvironment();
  }  
  GetUrls(UrlBackEnvironmentInt : number) {
    switch (UrlBackEnvironmentInt) {
      case 1:
        this.Url = 'http://localhost:64486';//http://localhost:64486/
        //this.UrlCore =  "https://localhost:7154" 
        this.UrlCore = "https://PruebasERPBCore.coogranada.com.co";
        this.UrlFront = 'http://localhost:4200/';
        this.UrlBaseOlivos = 'https://losolivosmedellin.co/KaringPrueba/Api/';
        break;
      case 2:
        this.Url = 'https://pruebaserpb.coogranada.com.co';
        this.UrlCore = "https://PruebasERPBCore.coogranada.com.co";
        this.UrlFront = "https://PruebasERPAct.coogranada.com.co"//'https://pruebaserp.coogranada.com.co';
        this.UrlBaseOlivos = 'https://losolivosmedellin.co/KaringPrueba/Api/';
        break;
      case 3:
        this.Url = 'https://produccionerpb.coogranada.com.co';
        this.UrlCore = "https://ProERPBCore.coogranada.com.co";
        this.UrlFront = 'https://produccionerp.coogranada.com.co';
        this.UrlBaseOlivos = 'https://losolivosmedellin.co/KaringPrueba/Api/';
        break;
      case 4:
        this.Url = 'https://proerpb.coogranada.com.co/';
        this.UrlCore = "TODO";
        this.UrlFront = 'https://erp.coogranada.com.co/';
        this.UrlBaseOlivos = 'https://losolivosmedellin.co/KaringPrevision/Api/';
        break;
      default:
        break;
    }
  }
private getUrlEnvironment() {
    // Cambiar el valor a true cuando se publique
    // NOTA: Enviar correo cada vez que se realice una publicación final
    // environment.production = true;
      this.Url = this.Url;
  }
}
