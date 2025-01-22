import { ScoreSimuladorService } from './../../../../Services/Productos/scoreSimulador.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '../../../../../../node_modules/@angular/forms';
import { WindowRef } from '../../../../Services/Enviroment/WindowRef.service';
import { EnvironmentService } from '../../../../Services/Enviroment/enviroment.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../../Services/Login/login.service';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-score-creditos',
  templateUrl: './score-creditos.component.html',
  styleUrls: ['./score-creditos.component.css'],
  providers: [ScoreSimuladorService, EnvironmentService, ModuleValidationService, LoginService],
  standalone : false
})
export class ScoreCreditosComponent implements OnInit {
  public ScoreForm!: FormGroup;
  public dataCodigosInfo: any;
  public dataMotivoConsulta: any;
  public dataTipoIdentificacion: any;
  public dataConsultaScore: any;
  public dataReporte: any;
  public DatosUsuario : any;
  public bOrigenDatos : boolean | null = false;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 27;
  OrigenDatos = [
    { Id: 'Automatico', Descripcion: 'Automatico' },
    { Id: 'CIFIN', Descripcion: 'CIFIN' },
    { Id: 'Coogranada', Descripcion: 'Coogranada' },
  ];

  constructor(private soreSimuladorService: ScoreSimuladorService, private winRef: WindowRef, private notif: NgxToastService,
    private envirment: EnvironmentService, private moduleValidationService: ModuleValidationService, private el: ElementRef,
    private loginService: LoginService, private router: Router) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ObtenerCodigosInformacionacion();
    this.ObtenerMotivosConsulta();
    this.ObtenerTiposIdentificacion();
    this.validateForm();
    this.ObtenerDatosUsuario();
    this.ValidarAutorizador();
    let data = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
    this.IrArriba();
  }
  // getPermisos(data) {
  //   this.moduleValidationService.ValidatePermissionsModule(this.CodModulo, data);
  // }
  ValidarAutorizador() {
    if (this.DatosUsuario.Autorizador) {
      this.bOrigenDatos = null;
    } else {
      this.bOrigenDatos = false;
      this.ScoreForm.get('IdOrigenDatos')?.setValue('Automatico');
    }
  }
  ObtenerDatosUsuario() {
    let data = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
  }
  ObtenerCodigosInformacionacion() {
    this.loading = true;
    this.soreSimuladorService.ObtenerCodigosInformacionacion().subscribe(
      result => {
        this.dataCodigosInfo = result; this.loading = false;
      },
      error => {
        this.loading = false;
        const errorParse = JSON.parse(error._body);
        this.notif.onDanger('Error', errorParse.Mensaje);
        console.error('ObtenerCodigosInformacionacion - Tipo Alerta: ' + errorParse.TipoAlerta + ' - Mensaje: ' + errorParse.Mensaje);
      }
    );
  }

  ObtenerMotivosConsulta() {
    this.loading = true;
    this.soreSimuladorService.ObtenerMotivosConsulta().subscribe(
      result => {
        this.dataMotivoConsulta = result; this.loading = false;
      },
      error => {
        this.loading = false;
        this.notif.onDanger('Error', error);
        console.error('ObtenerMotivosConsulta - ' + error);
      }
    );
  }

  ObtenerTiposIdentificacion() {
    this.loading = true;
    this.soreSimuladorService.ObtenerTiposIdentificacion().subscribe(
      result => {
        this.dataTipoIdentificacion = result; this.loading = false;
      },
      error => {
        this.loading = false;
        this.notif.onDanger('Error', error);
        console.error('ObtenerTiposIdentificacion - ' + error);
      }
    );
  }

  ConsultarScore() {
    this.loading = true;
    console.log(this.ScoreForm.value);

    this.ScoreForm.get('UsuarioOrigCons')?.setValue(this.DatosUsuario.userName);

    this.ScoreForm.get('CodigoInformacion')?.setValue(this.ScoreForm.get('IdCodigoInformacion')?.value.CodListProveedor);
    this.ScoreForm.get('IdCodigoInformacion')?.setValue(this.ScoreForm.get('IdCodigoInformacion')?.value.IdLista);

    this.ScoreForm.get('MotivoConsulta')?.setValue(this.ScoreForm.get('IdMotivoConsulta')?.value.CodListProveedor);
    this.ScoreForm.get('IdMotivoConsulta')?.setValue(this.ScoreForm.get('IdMotivoConsulta')?.value.IdLista);

    this.ScoreForm.get('OrigenDatos')?.setValue(this.ScoreForm.get('IdOrigenDatos')?.value);
    this.ScoreForm.get('IdOrigenDatos')?.setValue(this.ScoreForm.get('IdOrigenDatos')?.value);

    this.ScoreForm.get('IdTipoIdentificacion')?.setValue(this.ScoreForm.get('TipoIdentificacion')?.value.IdLista);
    this.ScoreForm.get('TipoIdentificacion')?.setValue(this.ScoreForm.get('TipoIdentificacion')?.value.CodListProveedor);

    this.ScoreForm.get('UsuariosDto')?.setValue(this.DatosUsuario);
    this.soreSimuladorService.ConsultarScore(this.ScoreForm.value).subscribe(
      result => {
        this.loading = false;
        if (result.TipoAlerta === 'Error') {
          this.notif.onDanger('Error', result.Mensaje);
        } else {
          this.dataConsultaScore = result;
          this.winRef.nativeWindow.open(this.envirment.Url + this.dataConsultaScore.RutaVista,
            '_blank', 'location=yes,height=650,width=900,scrollbars=yes,status=yes');
          this.ScoreForm.reset();
          this.ValidarAutorizador();
        }
      },
      error => {
        this.loading = false;
        this.notif.onDanger('Error', error);
        console.error('ObtenerTiposIdentificacion - ' + error);
      }
    );
  }

  validateForm() {
    const TipoIdentificacion = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const IdCodigoInformacion = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const IdMotivoConsulta = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const IdOrigenDatos = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const Identificacion = new FormControl('', [Validators.required]);
    const UsuariosDto = new FormControl('', []);
    const UsuarioOrigCons = new FormControl('', []);
    const IdTipoIdentificacion = new FormControl('', []);

    const CodigoInformacion = new FormControl('', []);
    const MotivoConsulta = new FormControl('', []);
    const OrigenDatos = new FormControl('', []);
    this.ScoreForm = new FormGroup({
      TipoIdentificacion: TipoIdentificacion,
      IdCodigoInformacion: IdCodigoInformacion,
      IdMotivoConsulta: IdMotivoConsulta,
      IdOrigenDatos: IdOrigenDatos,
      Identificacion: Identificacion,
      UsuariosDto: UsuariosDto,
      UsuarioOrigCons: UsuarioOrigCons,
      IdTipoIdentificacion,
      CodigoInformacion: CodigoInformacion,
      MotivoConsulta: MotivoConsulta,
      OrigenDatos: OrigenDatos
    });
  }

  // Valida que el campo no contenga el caracter que llega como parametro
  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

}
