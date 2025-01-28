import { TarjetaHabientesService } from '../../../../../Services/Productos/tarjetaHabientes.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '../../../../../../../node_modules/@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { PassEncriptJs } from '../../../../../Models/Generales/PasswordEncript.model';
import * as CryptoJS from 'crypto-js';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-tarjeta-habientes',
  templateUrl: './tarjeta-habientes.component.html',
  styleUrls: ['./tarjeta-habientes.component.css'],
  providers: [TarjetaHabientesService, ModuleValidationService],
  standalone : false
})
export class TarjetaHabientesComponent implements OnInit {

  @ViewChild('modalOpenCuenta', { static: true }) private openModalCuenta!: ElementRef;
  @ViewChild('modalOpenTarjeta', { static: true }) private openModalTarjeta!: ElementRef;
  @ViewChild('modalOpenTarjetaCuenta', { static: true }) private openModalCuentaTarjeta!: ElementRef;
  @ViewChild('modalOpenCanal', { static: true }) private openModalCanal!: ElementRef;
  private PassJs = new PassEncriptJs();
  public dataTarjetasHabiente: any;
  public dataCuenta: any;
  public dataTarjeta: any;
  public dataTarjetaCuentas: any;
  public dataCanales: any;
  panelOculto = true;
  public BDesbloqueaTarjeta = false;
  public DatosUsuario : any;
  public PermisosUsuario : any;
  public TarjetaHabientesForm!: FormGroup;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 22;
  constructor(private tarjetaHabientesService: TarjetaHabientesService, private notificacion: NgxToastService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );

    obs.subscribe((resulr) => console.log(resulr));
    }

  ngOnInit() {

    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerDatosUsuario();
    this.validateForm();
    this.IrArriba();
  }

  ObtenerDatosUsuario() {
    let data = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
    let permi = localStorage.getItem('Permisos');
    this.PermisosUsuario = JSON.parse(CryptoJS.AES.decrypt((permi == null ? "" : permi), this.PassJs.pass).toString(CryptoJS.enc.Utf8));
      // JSON.parse(window.atob(localStorage.getItem('Permisos')));
  }

  ConsultarAsociado() {
    this.loading = true;
    if (this.TarjetaHabientesForm.valid) {
      this.tarjetaHabientesService.ConsultarAsociado(this.TarjetaHabientesForm.value).subscribe(
        result => {
          this.panelOculto = false;
          this.dataTarjetasHabiente = result;
          this.MapearDatos();
        },
        error => {
          const errorJson = error
          console.log(error);
          this.loading = false;
          if (errorJson === 'Cliente no existe') {
            this.notificacion.onWarning('Advetencia', 'El' + errorJson);
            this.TarjetaHabientesForm.reset();
            this.panelOculto = true;
            this.dataTarjetasHabiente = null;
          } else {
            this.notificacion.onDanger('Error', errorJson);
            console.log(error);
          }
        }
      );
    } else {
      this.loading = false;
    }
  }

  MapearDatos() {
    this.TarjetaHabientesForm.get('numeroIdentificacion')?.setValue(this.dataTarjetasHabiente.NumeroDocumento);
    this.TarjetaHabientesForm.get('NombreTipoDocumento')?.setValue(this.dataTarjetasHabiente.NombreTipoDocumento);
    this.TarjetaHabientesForm.get('TipoDocumento')?.setValue(this.dataTarjetasHabiente.TipoDocumento);
    this.TarjetaHabientesForm.get('FechaExpedicion')?.setValue(this.dataTarjetasHabiente.FechaExpedicion);
    this.TarjetaHabientesForm.get('Nombre')?.setValue(this.dataTarjetasHabiente.PrimerNombre);
    this.TarjetaHabientesForm.get('FechaNacimiento')?.setValue(this.dataTarjetasHabiente.FechaNacimiento);
    this.TarjetaHabientesForm.get('Direccion')?.setValue(this.dataTarjetasHabiente.DireccionResidencia);
    this.TarjetaHabientesForm.get('Telefono')?.setValue(this.dataTarjetasHabiente.TelefonoResidencia);
    this.TarjetaHabientesForm.get('Celuar')?.setValue(this.dataTarjetasHabiente.Celular);
    this.TarjetaHabientesForm.get('Email')?.setValue(this.dataTarjetasHabiente.Email);
    this.TarjetaHabientesForm.get('EnvioSMS')?.setValue(this.dataTarjetasHabiente.ActivarSMS);
    this.TarjetaHabientesForm.get('ValidacionOTP')?.setValue(this.dataTarjetasHabiente.ActivarOTP);
    this.loading = false;

  }

  ConsultarCuentas() {
    if (this.TarjetaHabientesForm.get('numeroIdentificacion')?.value !== null
      && this.TarjetaHabientesForm.get('numeroIdentificacion')?.value !== undefined
      && this.TarjetaHabientesForm.get('numeroIdentificacion')?.value !== ''
      && this.TarjetaHabientesForm.get('NombreTipoDocumento')?.value !== null
      && this.TarjetaHabientesForm.get('NombreTipoDocumento')?.value !== undefined
      && this.TarjetaHabientesForm.get('NombreTipoDocumento')?.value !== ''
      && this.TarjetaHabientesForm.get('Nombre')?.value !== null
      && this.TarjetaHabientesForm.get('Nombre')?.value !== undefined
      && this.TarjetaHabientesForm.get('Nombre')?.value !== ''
    ) {
      this.loading = true;
      this.tarjetaHabientesService.ConsultarCuentas(this.TarjetaHabientesForm.value).subscribe(
        result => {
          this.loading = false;
          this.dataCuenta = result;
          this.openModalCuenta.nativeElement.click();
        },
        error => {
          this.loading = false;
          const errorJson = JSON.parse(error._body);
          this.notificacion.onDanger('Error', errorJson);
          console.log(error);
        }
      );
    }
  }

  ConsultarTarjetas() {
    this.loading = true;
    this.PermisosUsuario.forEach((element : any)=> {
      // Perfiles que tienen acceso a tarjeta habientes pero que no deben desbloquear la tarjeta (SOLO OPERACIONES DEBE TENER ACCESO)
      if (element.IdPerfil === 59 || element.IdPerfil === 60 || element.IdPerfil === 61) {
        this.BDesbloqueaTarjeta = true;
      }
    });

    this.tarjetaHabientesService.ConsultarTarjetas(this.TarjetaHabientesForm.value).subscribe(
      result => {
        this.loading = false;
        this.dataTarjeta = result;
        this.openModalTarjeta.nativeElement.click();
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  ConsultarTarjetasCuentas() {
    this.loading = true;
    this.tarjetaHabientesService.ConsultarTarjetasCuentas(this.TarjetaHabientesForm.value).subscribe(
      result => {
        this.loading = false;
        this.dataTarjetaCuentas = result;
        this.openModalCuentaTarjeta.nativeElement.click();
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  ConsultarCanales() {
    this.loading = true;
    this.tarjetaHabientesService.ConsultarCanales(this.TarjetaHabientesForm.value).subscribe(
      result => {
        this.loading = false;
        this.dataCanales = result;
        this.openModalCanal.nativeElement.click();
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  DesbloquearTarjeta(data : any) {
    this.loading = true;
    this.TarjetaHabientesForm.get('ObjTarjetas')?.setValue(data);
    this.tarjetaHabientesService.DesbloquerarTarjeta(this.TarjetaHabientesForm.value).subscribe(
      result => {
        this.loading = false;
        if (result.indexOf('Proceso exitoso') > -1) {
          this.ConsultarTarjetas();
          this.notificacion.onSuccess('Exitoso', 'La tarjeta fue desbloqueada correctamente.');
        } else {
          this.loading = false;
          this.notificacion.onWarning('Advertencia', 'La tarjeta no pudo desbloquearse debido a'
            + result);
        }
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
    console.log(data);
  }

  ResetForm() {
    this.TarjetaHabientesForm.reset();
  }

  validateForm() {
    const NumeroDocumento = new FormControl('', [Validators.required]);
    const numeroIdentificacion = new FormControl('', []);
    const TipoDocumento = new FormControl('', []);
    const NombreTipoDocumento = new FormControl('', []);
    const FechaExpedicion = new FormControl('', []);
    const Nombre = new FormControl('', []);
    const FechaNacimiento = new FormControl('', []);
    const Direccion = new FormControl('', []);
    const Telefono = new FormControl('', []);
    const Celuar = new FormControl('', []);
    const Email = new FormControl('', []);
    const EnvioSMS = new FormControl('', []);
    const ValidacionOTP = new FormControl('', []);
    const ObjTarjetas = new FormControl('', []);

    this.TarjetaHabientesForm = new FormGroup({
      NumeroDocumento: NumeroDocumento,
      numeroIdentificacion: numeroIdentificacion,
      TipoDocumento: TipoDocumento,
      NombreTipoDocumento: NombreTipoDocumento,
      FechaExpedicion: FechaExpedicion,
      Nombre: Nombre,
      FechaNacimiento: FechaNacimiento,
      Direccion: Direccion,
      Telefono: Telefono,
      Celuar: Celuar,
      Email: Email,
      EnvioSMS: EnvioSMS,
      ValidacionOTP: ValidacionOTP,
      ObjTarjetas: ObjTarjetas
    });
  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
