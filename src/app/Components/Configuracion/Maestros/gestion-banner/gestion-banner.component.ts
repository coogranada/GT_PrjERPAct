import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ImagenesBannerServices } from '../../../../Services/Maestros/imagenes-banner.service';
import { BannerArrayModel, BannerModel, LogBannerModel } from '../../../../Models/Maestros/banner.model';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;

@Component({
  selector: 'app-gestion-banner',
  templateUrl: './gestion-banner.component.html',
  styleUrls: ['./gestion-banner.component.css'],
  providers: [ImagenesBannerServices],
  standalone : false
})
export class GestionBannerComponent implements OnInit {
  public DatosUsuario : any = {};
  public bannerFrom!: FormGroup;
  public bannerArray = new BannerModel();
  public bannerArrayList: BannerModel[] = [];
  public bannerArrayGuardadas: any[] = [];
  public bannerArrayModel = new BannerArrayModel();
  public bannerArrayModelList: BannerArrayModel[] = [];
  public logBannerModel= new  LogBannerModel();
  public habilitarBtn : boolean | null = true;
  public bloqueoBtnAgregar :boolean | null = true;
  public base64textString: String = "";
  constructor(private ImagenesBannerServices: ImagenesBannerServices, private notif: NgxToastService) { }

  ngOnInit() {
    this.ValidateForm();
    this.IrArriba();
    this.ConsultarImagenesBanner();
  }
  handleFileSelect(evt : any) {
    var files = evt.target.files;
    if (files !== null) {
      if (files[0].type === "image/jpeg" || files[0].type === "image/jpg"
        || files[0].type === "image/png" || files[0].type === "image/gif") {
        var file = files[0];
        var fileSize = files[0].size;
        if (fileSize < 200000) {
          this.base64textString = '';
          this.notif.onWarning('Advertencia', 'El tamaño de la imagen es muy pequeña.');
          this.bannerFrom.get('Base64String')?.reset();
        } else if (fileSize > 5000000) {
          this.base64textString = '';
          this.notif.onWarning('Advertencia', 'El tamaño de la imagen es muy grande.');
          this.bannerFrom.get('Base64String')?.reset();
        } else {
          if (files && file) {
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
            this.bloqueoBtnAgregar = null;
          }
        }
      } else {
        this.base64textString = '';
        this.notif.onWarning('Advertencia', 'Este tipo de archivo no esta permitido.');
        this.bannerFrom.get('Base64String')?.reset();
      }
    }
  }
  _handleReaderLoaded(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }
  AddImagenBanner() {
    this.habilitarBtn = null;
    const urlBase = this.base64textString;
    this.bannerArray = new BannerModel();
    if (urlBase !== '' && urlBase !== null && urlBase !== undefined) {
      if (this.bannerArrayList.length <= 3) {
        this.bannerArray.Base64String = urlBase;
        this.bannerArray.urlImg = this.bannerFrom.get('urlImagen')?.value;
        this.bannerArrayList.push(this.bannerArray);
        this.base64textString = '';
        this.bannerFrom.reset();
        this.bloqueoBtnAgregar = true;
      } else {
        this.base64textString = '';
        this.habilitarBtn = true;
        this.bannerFrom.get('Base64String')?.reset();
        this.bannerFrom.get('urlImagen')?.reset();
        this.notif.onWarning('Advertencia', 'Solo puede ingresar 4 Imagenes.');
        if (this.bannerArrayList.length == 4) {
          this.habilitarBtn = null;
          this.bloqueoBtnAgregar = true;
        }
      }
    } else {
      this.bannerFrom.get('Base64String')?.reset();
      this.bannerFrom.get('urlImagen')?.reset();
        this.base64textString = '';
        this.notif.onWarning('Advertencia', 'Debe seleccionar una imagen.');
    }
  }
  ConsultarImagenesBanner() {
    this.ImagenesBannerServices.getImagenesBanner().subscribe((result : any[]) => {
          result.forEach((element : any) => {
            this.bannerArrayList.push(element);
          });
      })
  }
  GuardarImagenBanner() {
    if (this.bannerArrayList.length == 4) {
      this.bannerArrayList.forEach(element => {
        let data : string | null = localStorage.getItem('Data');
        const dataUser = JSON.parse(window.atob(data == null ? "" : data));
        this.bannerArrayModel = new BannerArrayModel();
        this.bannerArrayModel.IdImagenBanner = 0;
        this.bannerArrayModel.Base64String = element.Base64String;
        this.bannerArrayModel.UsuarioModifico = dataUser.Usuario;
        this.bannerArrayModel.FechaCreacion = new Date();
        this.bannerArrayModel.FechaModificacion = this.bannerArrayModel.FechaCreacion;
        this.bannerArrayModel.urlImg = element.urlImg;
        this.bannerArrayModelList.push(this.bannerArrayModel);
      });
      this.ImagenesBannerServices.setImagenBanner(this.bannerArrayModelList).subscribe(
        result => {
          this.GuardarLogBanner(Date.now);
          this.bannerArrayModelList = [];
          this.bloqueoBtnAgregar = null;
          this.notif.onSuccess('Exitoso', 'Las imagenes se guardaron correctamente.');
          this.habilitarBtn = true;

        }, error => {
          console.error('Error al realizar el registro: ' + error);
          this.notif.onDanger('Error', 'No se pudo realizar el registro - Verifique el tamaño y peso de la imagen');
          this.bannerArrayModelList = [];
      });
    } else {
      this.base64textString = '';
      this.habilitarBtn = true;
      this.notif.onWarning('Advertencia', 'Debe agregar 4 Imagenes para realizar esta operación.');
    }
  }
  GuardarLogBanner(fecha : any) {
    let data : string | null = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
    this.logBannerModel.IdLogBanner = 0;
    this.logBannerModel.IdTercero = this.DatosUsuario.lngTercero;
    this.logBannerModel.FechaModificacion = fecha;
    this.ImagenesBannerServices.setLogImagenBanner(this.logBannerModel).subscribe(
      result => {
        console.log('Log guardado con exito.');
        this.logBannerModel = new LogBannerModel();
      }, error => {
        console.error('Error al realizar el registro: ' + error);
        this.notif.onDanger('Error', 'No se pudo realizar el registro - Error: ' + error);
        this.logBannerModel = new LogBannerModel();
      });
  }
  EliminarImagenBanner(index : number) {
    this.bannerArrayList.splice(index, 1);
    this.habilitarBtn = null;
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  ValidateForm() {
    const IdImagenBanner = new FormControl('', []);
    const Base64String = new FormControl('', [Validators.required]);
    const UsuarioModifico = new FormControl('', [Validators.required]);
    const FechaCreacion = new FormControl('', [Validators.required]);
    const FechaModificacion = new FormControl('', [Validators.required]);
    const urlImagen = new FormControl('', []);
    this.bannerFrom = new FormGroup({
      IdImagenBanner: IdImagenBanner,
      Base64String: Base64String,
      UsuarioModifico: UsuarioModifico,
      FechaCreacion: FechaCreacion,
      FechaModificacion: FechaModificacion,
      urlImagen: urlImagen
    });
  }
}
