import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { DiferenciasSaldosService } from '../../../Services/Utilidades/diferencias-saldos.service';
import swal from 'sweetalert2';
import { Router} from '@angular/router';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../Services/Login/login.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
@Component({
  selector: 'app-diferencias-saldos',
  templateUrl: './diferencias-saldos.component.html',
  styleUrls: ['./diferencias-saldos.component.css'],
  providers: [DiferenciasSaldosService, ModuleValidationService, LoginService],
  standalone : false
})

export class DiferenciasSaldosComponent implements OnInit {

  public diferenciasSaldosFrom!: FormGroup;
  public bPanelDatos : any;
  public ListadoDiferencias : any | any[] = [];
  public DiferenciasNotificacion = [];
  public DatosUsuario : any;
  public File : any;
  public btnBotonesIniciales : any;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  private CodModulo = 41;
  constructor(private diferenciasSaldosService: DiferenciasSaldosService,
    private notificacion: ToastrService, private router: Router,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.btnBotonesIniciales = false;
    this.bPanelDatos = false;
    this.validarFormulario();
    this.ObtenerDatosUsuario();
    let datas = localStorage.getItem('Data')
    this.DatosUsuario = JSON.parse(window.atob(datas == null ? "" : datas));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );
    this.IrArriba();
  }

  ObtenerDatosUsuario() {
    let datas = localStorage.getItem('Data')
    this.DatosUsuario = JSON.parse(window.atob(datas == null ? "" : datas));
  }

  OnChange(event : any) {
    this.loading = true;
    const _nombreArchivo = event.target.files;
    if (event.target.files && event.target.files.length > 0 && _nombreArchivo[0].name.includes('.AMO')) {
      const archivo = new FileReader();
      archivo.readAsDataURL(event.target.files[0]);
      setTimeout(() => {
        this.btnBotonesIniciales = true;
        this.loading = false;
        this.diferenciasSaldosFrom.get('Archivo')?.setValue(archivo.result);
        this.diferenciasSaldosFrom.get('NombreArchivo')?.setValue(_nombreArchivo[0].name);
      }, 1000);
    } else {
      this.loading = false;
      this.notificacion.warning('Advertencia', 'Debe seleccionar un archivo con extensión .AMO', ConfiguracionNotificacion.configRightTop);
    }
  }

  ConsultarDiferencias() {
    this.loading = true;
    this.btnBotonesIniciales = false;
    this.diferenciasSaldosFrom.get('Usuario')?.setValue(this.DatosUsuario.Usuario);
    this.diferenciasSaldosService.ConsultarDiferencias(this.diferenciasSaldosFrom.value).subscribe(
      result => {
        this.btnBotonesIniciales = true;
        this.ListadoDiferencias = result;
        if (this.ListadoDiferencias === null && this.ListadoDiferencias.length === 0) {
          this.Limpiar();
          this.notificacion.warning('Advertencia', 'No se encontraron diferencias.', ConfiguracionNotificacion.configRightTop);
        } else {
          if (this.ListadoDiferencias.length === 1
            && this.ListadoDiferencias[0].Error.Mensaje !== null
            && this.ListadoDiferencias[0].Error.Mensaje !== undefined
            && this.ListadoDiferencias[0].Error.Mensaje !== '') {
            this.notificacion.error('Error', this.ListadoDiferencias[0].Error.Mensaje, ConfiguracionNotificacion.configRightTop);
            this.Limpiar();
          } else {
            let numeroDiferencias = 0;
            let totalSaldoCoogranada = 0;
            this.ListadoDiferencias.forEach((element : any) => {
              numeroDiferencias = numeroDiferencias + 1;
              if (element.SaldoCoogranada !== '') {
                console.log(element.SaldoCoogranada.replace(/,/g, '.'));
                totalSaldoCoogranada = totalSaldoCoogranada + Number.parseFloat(element.SaldoCoogranada.replace(/,/g, ''));
              }
            });

            this.diferenciasSaldosFrom.get('Notificaciones')?.setValue(this.ListadoDiferencias);
            this.diferenciasSaldosFrom.get('NumDiferencias')?.setValue(numeroDiferencias);
            this.diferenciasSaldosFrom.get('TotSaldCoogranada')?.setValue(totalSaldoCoogranada);
            this.bPanelDatos = true;
            this.loading = false;
          }
        }
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
        console.log(error);
      }
    );
  }

  Limpiar() {
    this.ListadoDiferencias = null;
    this.bPanelDatos = false;
    this.btnBotonesIniciales = false;
    this.diferenciasSaldosFrom.reset();
  }

  EliminarRegistro(index : number) {
    swal.fire({
      title: '¿Desea eliminar el registro?',
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
        this.loading = true;
        let numeroDiferencias = this.diferenciasSaldosFrom.get('NumDiferencias')?.value;
        let totalSaldoCoogranada = this.diferenciasSaldosFrom.get('TotSaldCoogranada')?.value;
        if (this.ListadoDiferencias[index].SaldoCoogranada !== '') {
          totalSaldoCoogranada = totalSaldoCoogranada - Number.parseFloat(this.ListadoDiferencias[index].SaldoCoogranada.replace(/,/g, ''));
        }
        numeroDiferencias = numeroDiferencias - 1;
        this.diferenciasSaldosFrom.get('NumDiferencias')?.setValue(numeroDiferencias);
        this.diferenciasSaldosFrom.get('TotSaldCoogranada')?.setValue(totalSaldoCoogranada);
        this.ListadoDiferencias.splice(index, 1);
        if (this.ListadoDiferencias.length === 0) {
          this.ListadoDiferencias = null;
          this.bPanelDatos = false;
        }
        this.loading = false;
        swal.fire({
          title: 'Registro eliminado',
          text: '',
          icon: 'success',
          confirmButtonColor: 'rgb(160,0,87)',
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }
    });
  }

  CrearNotificaciones() {
    this.loading = true;
    this.btnBotonesIniciales = false;
    this.diferenciasSaldosService.CrearNotificaciones(this.diferenciasSaldosFrom.get('Notificaciones')?.value).subscribe(
        result => {
          this.loading = false;
          this.btnBotonesIniciales = true;
          if (result) {
            this.Limpiar();
            this.notificacion.success('Exitoso', 'Las notificaciones se crearon correctamente.', ConfiguracionNotificacion.configRightTop);
          }
        },
        error => {
          this.loading = false;
          const errorJson = JSON.parse(error._body);
          this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
          console.log(error);
        }
      );
  }

  validarFormulario() {
    const Archivo = new FormControl('', []);
    const Notificaciones = new FormControl('', []);
    const Usuario = new FormControl('', []);
    const NombreArchivo = new FormControl('', []);
    const NumDiferencias = new FormControl('', []);
    const TotSaldCoogranada = new FormControl('', []);
    const CampoArchivo = new FormControl('', [Validators.required]);

    this.diferenciasSaldosFrom = new FormGroup({
      Archivo: Archivo,
      Notificaciones: Notificaciones,
      Usuario: Usuario,
      NombreArchivo: NombreArchivo,
      CampoArchivo: CampoArchivo,
      NumDiferencias: NumDiferencias,
      TotSaldCoogranada: TotSaldCoogranada
    });
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
