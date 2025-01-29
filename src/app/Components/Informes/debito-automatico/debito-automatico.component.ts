import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgxLoadingComponent } from 'ngx-loading';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { DebitosAutomaticosService } from '../../../Services/Informes/debito-automatico.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../Services/Login/login.service';
import { NgxToastService } from 'ngx-toast-notifier';


@Component({
  selector: 'app-debito-automatico',
  templateUrl: './debito-automatico.component.html',
  styleUrls: ['./debito-automatico.component.css'],
  providers: [DebitosAutomaticosService, ModuleValidationService, LoginService],
  standalone : false
})
export class DebitosAutomaticosComponent implements OnInit {

  public debitoAutomaticoForm!: FormGroup;
  public resultDebitos : any;
  public resultCuentas : any;

  dataObjet: any[] = [];
  dataObjetActual: any[] = [];
  dataObjetRetiro: any[] = [];


  public Undefined = undefined;
  public BloquearCuenta : boolean | null = false;
  public BloquearBotonConsultar : boolean | null = null;


  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('ModalImpresionDebitoAutomatico', { static: true }) private ModalImpresionDebitoAutomatico!: ElementRef;



  private CodModulo = 51;
  public Modulo = this.CodModulo;
  public DatosUsuario : any;
  constructor(private debitosautomaticosService: DebitosAutomaticosService,
    private notif: NgxToastService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService,
    private router: Router) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }


  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.ValidarFormulario();
    this.IrArriba();
    $('#selectDocumento').focus().select();
    let data = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );
  }

  ObtenerDebitos() {
    this.resultDebitos = undefined;
    let IdCuenta = '*';
    if (this.debitoAutomaticoForm.get('NumeroCuentas')?.value !== null
      && this.debitoAutomaticoForm.get('NumeroCuentas')?.value !== undefined
      && this.debitoAutomaticoForm.get('NumeroCuentas')?.value !== ''
    ) {
      IdCuenta = this.debitoAutomaticoForm.get('NumeroCuentas')?.value;
      this.debitosautomaticosService.ObtenerDebitos(IdCuenta).subscribe(
        result => {
          this.debitoAutomaticoForm.get('NumeroDocumento')?.reset();
          this.debitoAutomaticoForm.get('NumeroCuentas')?.reset();
          this.BloquearBotonConsultar = false;

          this.resultDebitos = result;
          this.dataObjet.push({
            'CuentaOrigen': this.resultDebitos[0].CuentaOrigen,
            'DocumentoOrigen': this.resultDebitos[0].DocumentoOrigen,
            'NombreOrigen': this.resultDebitos[0].NombreOrigen,
          });

          this.resultDebitos.forEach((elementFiltro : any) => {
            if (elementFiltro.FechaRetiro === ' ') {
              this.dataObjetActual.push({
                'CuentaDestino': elementFiltro.CuentaDestino,
                'DocumentoDestino': elementFiltro.DocumentoDestino,
                'NombreDestino': elementFiltro.NombreDestino,
                'DescripcionPeriocidad': elementFiltro.DescripcionPeriocidad,
                'CuotaMes': elementFiltro.CuotaMes,
                'FechaMatricula': elementFiltro.FechaMatricula,
                'FechaVencimiento': elementFiltro.FechaVencimiento,
              });
            } else {
              this.dataObjetRetiro.push({
                'CuentaDestino': elementFiltro.CuentaDestino,
                'DocumentoDestino': elementFiltro.DocumentoDestino,
                'NombreDestino': elementFiltro.NombreDestino,
                'DescripcionPeriocidad': elementFiltro.DescripcionPeriocidad,
                'CuotaMes': elementFiltro.CuotaMes,
                'FechaRetiro': elementFiltro.FechaRetiro,
              });
            }
          });
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  ObtenerCuentas() {
    this.debitoAutomaticoForm.get('NumeroCuentas')?.reset();
    this.resultDebitos = undefined;
    this.dataObjet = [];
    this.dataObjetActual = [];
    this.dataObjetRetiro = [];
    let Documento = '*';
    if (this.debitoAutomaticoForm.get('NumeroDocumento')?.value !== null
      && this.debitoAutomaticoForm.get('NumeroDocumento')?.value !== undefined
      && this.debitoAutomaticoForm.get('NumeroDocumento')?.value !== ''
    ) {
      Documento = this.debitoAutomaticoForm.get('NumeroDocumento')?.value;
      this.debitosautomaticosService.ObtenerCuentas(Documento).subscribe(
        result => {
          if (result.length !== 0) {
            this.resultCuentas = result;
            this.BloquearCuenta = null;
            this.BloquearBotonConsultar = null;
          } else {
            this.notif.onWarning('Alerta', 'No se encontró cuenta con débito');
            this.BloquearCuenta = false;
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  CambioCuenta() {
    this.resultDebitos = undefined;
    this.dataObjet = [];
    this.dataObjetActual = [];
    this.dataObjetRetiro = [];
  }

  limpiarForm() {
    this.debitoAutomaticoForm.reset();
    this.resultCuentas = undefined;
    this.resultDebitos = undefined;
    this.dataObjet = [];
    this.dataObjetActual = [];
    this.dataObjetRetiro = [];
  }
  ImprimirFormato() {
    this.ModalImpresionDebitoAutomatico.nativeElement.click();
  }



  ValidarFormulario() {
    const NumeroDocumento = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const NumeroCuentas = new FormControl('', []);

    this.debitoAutomaticoForm = new FormGroup({
      NumeroDocumento: NumeroDocumento,
      NumeroCuentas: NumeroCuentas

    });
  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

}
