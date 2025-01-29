import { GmfDisponibleService } from '../../../../../Services/Productos/gmfDisponible.service';
import { formatDate, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxToastService } from 'ngx-toast-notifier';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-gmf',
  templateUrl: './gmf.component.html',
  styleUrls: ['./gmf.component.css'],
  providers: [GmfDisponibleService, DatePipe, ModuleValidationService],
  standalone: false
})
export class GMFDisponibleComponent implements OnInit {

  @ViewChild('openModalInfoCuenta', { static: true }) private InfoCuenta!: ElementRef;
  @ViewChild('marcarCheck', { static: true }) private checkMarcar!: ElementRef;
  @ViewChild('DesmarcarCheck', { static: true }) private checkDesmarcar!: ElementRef;
  @ViewChild('openModelReport', { static: true }) private ReportModal!: ElementRef;

  public dataTipoIdentificacion : any;
  public GMFForm!: FormGroup;
  public marcarDesmarcar = true;
  public Marcar = true;
  public Desmarcar = true;
  public panelDatos = true;
  public AlertaCuenta = false;
  public dataUserGMF: any;
  dataMarcarDesmarcar: any[] = [];
  dataConsultaGMF: any;
  dataTipoCuenta: any;
  dataEstadosCuenta: any;
  dataDepartamentos: any;
  dataciudades: any;
  dataSucursal: any;
  disableBusquedaForm : boolean | null = null;
  dataGMFReport: any;
  public DatosUsuario: any;


  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 23;
  constructor(private gmfDisponibleService: GmfDisponibleService, private notificacion: NgxToastService,
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
    this.ObtenerTipoIdentificacion();
    this.ObtenerDatosUsuario();
    this.ObtenerEstadosCuenta();
    this.ObtenerTipoCuentas();
    this.ObtenerTipoIdentificacion();
    this.ObtenerCiudades();
    this.ObtenerDepartamentos();
    this.ObtenerSucursales();
    this.validateForm();
    this.IrArriba();
  }
  // getPermisos(data) {
  //   this.moduleValidationService.ValidatePermissionsModule(this.CodModulo, data);
  // }

  ObtenerDatosUsuario() {
    let data = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
  }

  ObtenerTipoIdentificacion() {
    this.loading = true;
    this.gmfDisponibleService.ObtenerTipoIdentificacion().subscribe(
      result => {
        this.dataTipoIdentificacion = result;
        this.loading = false;
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  ObtenerTipoCuentas() {
    this.loading = true;
    this.gmfDisponibleService.ObtenerTipoCuentas().subscribe(
      result => {
        this.dataTipoCuenta = result; this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }

  ObtenerEstadosCuenta() {
    this.loading = true;
    this.gmfDisponibleService.ObtenerEstadosCuenta().subscribe(
      result => {
        this.dataEstadosCuenta = result; 
        this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }
  ObtenerDepartamentos() {
    this.loading = true;
    this.gmfDisponibleService.ObtenerDepartamentos().subscribe(
      result => {
        this.dataDepartamentos = result; 
        this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }

  ObtenerCiudades() {
    this.loading = true;
    this.gmfDisponibleService.ObtenerCiudades().subscribe(
      result => {
        this.dataciudades = result; 
        this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }

  ObtenerSucursales() {
    this.loading = true;
    this.gmfDisponibleService.ObtenerSucursales().subscribe(
      result => {
        this.dataSucursal = result; this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }


  ConsultarGMF() {
    this.loading = true;
    const datosTipoDocumento = this.GMFForm.get('IdTipoDocumento')?.value;
    this.GMFForm.get('strValor')?.setValue(datosTipoDocumento.Valor);

    this.Limpiar();
    this.disableBusquedaForm = true;
    let userName = localStorage.getItem('userName');
    this.GMFForm.get('userName')?.setValue(JSON.parse(window.atob(userName == null ? "" : userName)));
      // localStorage.getItem('userName'));
    this.gmfDisponibleService.ConsultarInfoAsociado(JSON.stringify(this.GMFForm.value)).subscribe(
      result => {
        this.ValidarDatos(result); this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }

  ValidarDatos(PDatos : any) {
    this.loading = true;
    let _existeMarcada = false;
    let _numeroCuenta = '';
    this.panelDatos = false;
    this.marcarDesmarcar = false;

    if (PDatos != null) {
      if (PDatos[0].Error === null) {
        for (let i = 0; i < PDatos.length; i++) {
          if (PDatos[i].blnExoneradaGMF === true) {
            _existeMarcada = true;
            _numeroCuenta = PDatos[i].strNumeroCuenta;
          }
        }

        if (_existeMarcada !== true) {
          this.checkMarcar.nativeElement.checked = true;
          this.checkDesmarcar.nativeElement.checked = false;

          this.GMFForm.get('marcarForm')?.setValue('true');
          this.GMFForm.get('desmarcarForm')?.setValue(null);


          const date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          PDatos.strFechIniExonera = date;
          PDatos.strFechaCorte = date;
          PDatos.forEach((element : any) => {
            localStorage.setItem('DataUserGMF', JSON.stringify(element));
          });
          this.dataMarcarDesmarcar = PDatos;
          if (PDatos.length > 1) {
            this.AlertaCuenta = true;
          } else {
            this.AlertaCuenta = false;
            this.MapearDatos(this.dataMarcarDesmarcar);
          }

        } else {
          this.checkDesmarcar.nativeElement.checked = true;
          this.checkMarcar.nativeElement.checked = false;
          this.GMFForm.get('desmarcarForm')?.setValue('true');
          this.GMFForm.get('marcarForm')?.setValue(null);
          PDatos.forEach((element : any) => {
            if (_numeroCuenta === element.strNumeroCuenta) {
              const date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
              element.strFechFinExonera = date;
              localStorage.setItem('DataUserGMF', JSON.stringify(element));
              this.dataMarcarDesmarcar.push(element);
              this.MapearDatos(this.dataMarcarDesmarcar);
              this.AlertaCuenta = false;
            }
          });
        }
      } else {
        this.panelDatos = true;
        this.marcarDesmarcar = true;
        this.disableBusquedaForm = null;
        this.notificacion.onWarning('Advertencia', PDatos[0].Error.Mensaje);
      }
    }
    this.loading = false;
  }

  Limpiar() {
    this.GMFForm.get('strNumeroCuenta')?.setValue(null);
    this.dataMarcarDesmarcar = [];
  }

  DesmarcarCuentaCheck() {
    this.loading = true;
    if (!this.GMFForm.get('desmarcarForm')?.value) {
      this.dataMarcarDesmarcar = [];
      localStorage.removeItem('DataUserGMF');
      this.GMFForm.get('strAccion')?.setValue('Desmarcar');
      let userName = localStorage.getItem('userName');
      this.GMFForm.get('userName')?.setValue(JSON.parse(window.atob(userName == null ? "" : userName)));
        // localStorage.getItem('userName'));
      this.gmfDisponibleService.ConsultarInfoAsociado(JSON.stringify(this.GMFForm.value)).subscribe(
        result => {
          result.forEach((element : any) => {
            if (this.dataConsultaGMF.strNumeroCuenta === element.strNumeroCuenta) {
              const date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
              element.strFechFinExonera = date;
              localStorage.setItem('DataUserGMF', JSON.stringify(element));
              this.dataMarcarDesmarcar.push(element);
              this.MapearDatos(this.dataMarcarDesmarcar);
              this.AlertaCuenta = false;
            }
          }); this.loading = false;
        },
        error => {
          this.loading = false;
          const errorJson = JSON.parse(error._body);
          this.notificacion.onDanger('Error', errorJson);
          console.log(error);
        }
      );
    } else {
      this.dataMarcarDesmarcar = [];
      this.disableBusquedaForm = null;
    }
  }

  MarcarCuentaCheck() {
    this.loading = true;
    if (!this.GMFForm.get('marcarForm')?.value) {
      this.dataMarcarDesmarcar = [];
      localStorage.removeItem('DataUserGMF');
      this.GMFForm.get('strAccion')?.setValue('Marcar');
      let userName = localStorage.getItem('userName');
      this.GMFForm.get('userName')?.setValue(JSON.parse(window.atob(userName == null ? "" : userName)));
        // localStorage.getItem('userName'));
      this.gmfDisponibleService.ConsultarInfoAsociado(JSON.stringify(this.GMFForm.value)).subscribe(
        result => {
          const date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          result.strFechIniExonera = date;
          result.strFechaCorte = date;
          result.forEach((element : any) => {
            localStorage.setItem('DataUserGMF', JSON.stringify(element));
          });
          this.dataMarcarDesmarcar = result;
          if (result.length > 1) {
            this.AlertaCuenta = true;
          } else {
            this.AlertaCuenta = false;
            this.MapearDatos(this.dataMarcarDesmarcar);
          }
          console.log(result); this.loading = false;
        },
        error => {
          const errorJson = JSON.parse(error._body);
          this.notificacion.onDanger('Error', errorJson);
          console.log(error); this.loading = false;
        }
      );
    } else {
      this.dataMarcarDesmarcar = [];
      this.disableBusquedaForm = null;
    }
  }

  selectCuentaMarcar() {
    this.MapearDatos(this.dataMarcarDesmarcar);
  }

  EnviarGMF() {
    let data = localStorage.getItem('Data');
    const dataLocal = JSON.parse(window.atob(data == null ? "" : data));
      // JSON.parse(localStorage.getItem('Data'));
    dataLocal.Mensaje = '';
    dataLocal.Perfiles = '';
    dataLocal.SW = '';

    this.GMFForm.get('UsuariosDto')?.setValue(dataLocal);
    if (this.GMFForm.get('marcarForm')?.value) {
      swal.fire({
        title: '¿Desea marcar la cuenta?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        confirmButtonColor: 'rgb(13,165,80)',
        cancelButtonColor: 'rgb(160,0,87)',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((results : any) => {
        if (results.value) {
          this.MarcarGMF();
        }
      });

    } else if (this.GMFForm.get('desmarcarForm')?.value) {
      swal.fire({
        title: '¿Desea desmarcar la cuenta?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        confirmButtonColor: 'rgb(13,165,80)',
        cancelButtonColor: 'rgb(160,0,87)',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((results) => {
        if (results.value) {
          const date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          this.GMFForm.get('strFechFinExonera')?.setValue(date);
          this.DesmacarGMF();
        }
      });
    } else {
      console.error('Se ha presentado un problema al marcar o desmarcar la cuenta.');
      this.loading = false;
    }
  }

  MarcarGMF() {
    this.loading = true;
    const datosTipoDocumento = this.GMFForm.get('IdTipoDocumento')?.value;
    let _nit;
    if (datosTipoDocumento.CodListProveedor === '2') {
      _nit = this.GMFForm.get('strNumeroDocumento')?.value;
      _nit = _nit.substr(0, (_nit.length - 1));
      this.GMFForm.get('strNit')?.setValue(_nit);
    }
    this.GMFForm.get('strValor')?.setValue(datosTipoDocumento.CodListProveedor);
    this.gmfDisponibleService.MarcacionGMF(JSON.stringify(this.GMFForm.value)).subscribe(
      result => {
        this.dataConsultaGMF = result;
        if (result.strCodigoExencion === '04' || result.strCodigoExencion === '07') {
          let dataUserG = localStorage.getItem('DataUserGMF');
          this.dataUserGMF = JSON.parse(dataUserG == null ? "" : dataUserG);
          this.dataGMFReport = result;
          this.notificacion.onSuccess('Exitoso', result.strMensajeExencion);
          this.ReportModal.nativeElement.click();
        } else {
          this.InfoCuenta.nativeElement.click();
          this.notificacion.onDanger('Advertencia',
            'No se puedo marcar la cuenta. Por favor reportar por GLPI al área de operaciones.');
        }
        this.marcarDesmarcar = false;
        this.panelDatos = false;
        this.disableBusquedaForm = false;
        this.limpiarForm(); this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }

  DesmacarGMF() {
    this.loading = true;
    const datosTipoDocumento = this.GMFForm.get('IdTipoDocumento')?.value;
    let _nit;
    if (datosTipoDocumento.CodListProveedor === '2') {
      _nit = this.GMFForm.get('strNumeroDocumento')?.value;
      _nit = _nit.substr(0, (_nit.length - 1));
      this.GMFForm.get('strNit')?.setValue(_nit);
    }
    this.GMFForm.get('strValor')?.setValue(datosTipoDocumento.CodListProveedor);
    this.gmfDisponibleService.DesmarcacionGMF(JSON.stringify(this.GMFForm.value)).subscribe(
      result => {
        this.dataConsultaGMF = result;
        if (result.strCodigoExencion === '04' || result.strCodigoExencion === '07') {
          let dataUserG = localStorage.getItem('DataUserGMF');
          this.dataUserGMF = JSON.parse(dataUserG == null ? "" : dataUserG);
          this.dataGMFReport = result;
          this.notificacion.onSuccess('Exitoso', result.strMensajeExencion);
          this.ReportModal.nativeElement.click();
        } else if (result.strCodigoExencion === '02') {
          this.notificacion.onDanger('Advertencia','El asociado no tiene ninguna cuenta exonerada en CIFIN. Por favor reportar por GLPI al área de operaciones.');
        } else {
          this.InfoCuenta.nativeElement.click();
          this.notificacion.onDanger('Advertencia', 'No se puedo desmarcar la cuenta. Por favor reportar por GLPI al área de operaciones.');
        }
        this.marcarDesmarcar = false;
        this.panelDatos = false;
        this.disableBusquedaForm = false;
        this.limpiarForm(); this.loading = false;
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error); this.loading = false;
      }
    );
  }

  MapearDatos(data : any) {
    this.loading = true;
    data.forEach((x : any, y : number) => {
      console.log(y, x);
      if (x.strNumeroCuenta === this.GMFForm.get('strNumeroCuenta')?.value) {
        this.GMFForm.get('strNumeroCuenta')?.setValue(data[y].strNumeroCuenta);
        this.GMFForm.get('strNombreAsociado')?.setValue(data[y].strNombreAsociado);
        this.GMFForm.get('strSucursal')?.setValue(data[y].strSucursal);
        this.GMFForm.get('strFechaApertura')?.setValue(data[y].strFechaApertura);
        this.GMFForm.get('strFechaCorte')?.setValue(data[y].strFechaCorte);
        this.GMFForm.get('strTipoCuenta')?.setValue(data[y].strTipoCuenta);
        this.GMFForm.get('strEstadoCuenta')?.setValue(data[y].strEstadoCuenta);
        this.GMFForm.get('strFechIniExonera')?.setValue(data[y].strFechIniExonera);
        this.GMFForm.get('strFechFinExonera')?.setValue(data[y].strFechFinExonera);
        this.GMFForm.get('strFechTerminacion')?.setValue(data[y].strFechTerminacion);
        this.GMFForm.get('strDirResidencia')?.setValue(data[y].strDirResidencia);
        this.GMFForm.get('strTelResidencia')?.setValue(data[y].strTelResidencia);
        this.GMFForm.get('strDptoResidencia')?.setValue(data[y].strDptoResidencia);
        this.GMFForm.get('strCiudadResidencia')?.setValue(data[y].strCiudadResidencia);
        this.GMFForm.get('strEmpresa')?.setValue(data[y].strEmpresa);
        this.GMFForm.get('strDptoLabora')?.setValue(data[y].strDptoLabora);
        this.GMFForm.get('strCiudadLabora')?.setValue(data[y].strCiudadLabora);
      } else if (data.length <= 1) {
        this.GMFForm.get('strNumeroCuenta')?.setValue(data[y].strNumeroCuenta);
        this.GMFForm.get('strNombreAsociado')?.setValue(data[y].strNombreAsociado);
        this.GMFForm.get('strSucursal')?.setValue(data[y].strSucursal);
        this.GMFForm.get('strFechaApertura')?.setValue(data[y].strFechaApertura);
        this.GMFForm.get('strFechaCorte')?.setValue(data[y].strFechaCorte);
        this.GMFForm.get('strTipoCuenta')?.setValue(data[y].strTipoCuenta);
        this.GMFForm.get('strEstadoCuenta')?.setValue(data[y].strEstadoCuenta);
        this.GMFForm.get('strFechIniExonera')?.setValue(data[y].strFechIniExonera);
        this.GMFForm.get('strFechFinExonera')?.setValue(data[y].strFechFinExonera);
        this.GMFForm.get('strFechTerminacion')?.setValue(data[y].strFechTerminacion);
        this.GMFForm.get('strDirResidencia')?.setValue(data[y].strDirResidencia);
        this.GMFForm.get('strTelResidencia')?.setValue(data[y].strTelResidencia);
        this.GMFForm.get('strDptoResidencia')?.setValue(data[y].strDptoResidencia);
        this.GMFForm.get('strCiudadResidencia')?.setValue(data[y].strCiudadResidencia);
        this.GMFForm.get('strEmpresa')?.setValue(data[y].strEmpresa);
        this.GMFForm.get('strDptoLabora')?.setValue(data[y].strDptoLabora);
        this.GMFForm.get('strCiudadLabora')?.setValue(data[y].strCiudadLabora);

      }
    }); this.loading = false;
  }

  print() {
    window.print();
  }

  private validarCodigoEntidad(dataCodigo : any, dataEntidad : any) {
    this.marcarDesmarcar = false;
    this.panelDatos = false;
  }

  limpiarForm() {
    this.GMFForm.reset();
    this.panelDatos = true;
    this.marcarDesmarcar = true;
    this.disableBusquedaForm = null;
    this.checkMarcar.nativeElement.value = 'off';
    this.checkDesmarcar.nativeElement.value = 'off';
    this.dataMarcarDesmarcar = [];
  }

  // Valida que el campo no contenga el caracter que llega como parametro
  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

  validateForm() {
    const strAccion = new FormControl('', []);
    const IdTipoDocumento = new FormControl('', [Validators.required, this.ValidarCampo(/-/i)]);
    const strNumeroDocumento = new FormControl('', [Validators.required]);
    const strNumeroCuenta = new FormControl('', [this.ValidarCampo(/-/i)]);
    const userName = new FormControl('', []);

    const strNombreAsociado = new FormControl('', []);
    const strSucursal = new FormControl('', []);
    const strFechaApertura = new FormControl('', []);
    const strFechaCorte = new FormControl('', []);
    const strTipoCuenta = new FormControl('', []);
    const strEstadoCuenta = new FormControl('', []);
    const strFechIniExonera = new FormControl('', []);
    const strFechFinExonera = new FormControl('', []);
    const strFechTerminacion = new FormControl('', []);
    const strDirResidencia = new FormControl('', []);
    const strTelResidencia = new FormControl('', []);
    const strDptoResidencia = new FormControl('', []);
    const strCiudadResidencia = new FormControl('', []);
    const strEmpresa = new FormControl('', []);
    const strDptoLabora = new FormControl('', []);
    const strCiudadLabora = new FormControl('', []);
    const strValor = new FormControl('', []);
    const marcarForm = new FormControl('', []);
    const desmarcarForm = new FormControl('', []);
    const Desmarcar = new FormControl('', []);
    const strNit = new FormControl('', []);
    const UsuariosDto = new FormControl('', []);

    this.GMFForm = new FormGroup({
      strAccion: strAccion,
      IdTipoDocumento: IdTipoDocumento,
      strNumeroDocumento: strNumeroDocumento,
      strNumeroCuenta: strNumeroCuenta,
      userName: userName,
      strNombreAsociado,
      strSucursal: strSucursal,
      strFechaApertura: strFechaApertura,
      strFechaCorte: strFechaCorte,
      strTipoCuenta: strTipoCuenta,
      strEstadoCuenta: strEstadoCuenta,
      strFechIniExonera: strFechIniExonera,
      strFechFinExonera: strFechFinExonera,
      strFechTerminacion: strFechTerminacion,
      strDirResidencia: strDirResidencia,
      strTelResidencia: strTelResidencia,
      strDptoResidencia: strDptoResidencia,
      strCiudadResidencia: strCiudadResidencia,
      strEmpresa: strEmpresa,
      strDptoLabora: strDptoLabora,
      strCiudadLabora: strCiudadLabora,
      marcarForm: marcarForm,
      desmarcarForm: desmarcarForm,
      UsuariosDto: UsuariosDto,
      strValor: strValor,
      Desmarcar: Desmarcar,
      strNit: strNit
    });
  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
