import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatacreditoService } from '../../../../../Services/Productos/datacredito.service';
import { EnvironmentService } from '../../../../../Services/Enviroment/enviroment.service';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { LoginService } from '../../../../../Services/Login/login.service';
import { AlertService } from '../../../../../Services/Alert/alert.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../../Services/shared/loading.service';

const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-datacredito',
  templateUrl: './datacredito.component.html',
  styleUrl: './datacredito.component.css',
  providers: [DatacreditoService, EnvironmentService, ModuleValidationService, LoginService],
  standalone: false,

})
export class DatacreditoComponent implements OnInit {

  @ViewChild('ModalImpresion', { static: true }) private ModalImpresion!: ElementRef;

  DataForm!: FormGroup;
  bOrigenDatos: boolean = false;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public dataMotivoConsulta: any;
  public dataTipoIdentificacion: any;
  public vbleIngreso: boolean = false;
  public DatosUsuario: any;

  private CodModulo = 84;
  OrigenDatos = [
    { Id: 'Automatico', Descripcion: 'Automatico' },
    { Id: 'Datacredito', Descripcion: 'Datacredito' },
    { Id: 'Coogranada', Descripcion: 'Coogranada' },
  ];


  constructor(private fb: FormBuilder, private datacreditoService: DatacreditoService, 
    private notif: AlertService, private envirment: EnvironmentService, 
    private moduleValidationService: ModuleValidationService, private loginService: LoginService, 
    private router: Router, private loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.IrArriba();
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.CrearFormulario();
    this.ObtenerTiposIdentificacion();
    this.ObtenerMotivosConsulta();
    //evita que al cerrar la modal se modifique el body
    $('#ModalImpresion').on('hidden.bs.modal', function () {
      $('body').css('padding-right', '0');
      $('body').removeClass('modal-open');
    });

    //Esto es para cargar el reporte vacío y evitar la demora al cargar la ventana modal
    const url =
      this.envirment.Url +
      '/ReporteDatacredito_/Datacredito.aspx?Reporte=Consulta%20DataCr%C3%A9dito&Id=0&Independiente=False&OrigenDatos=INI&UsuarioGenera=INI';

    const iframe: any = document.getElementById('iframeReporte');
    iframe.src = url;

    let data = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      });
  }

  CrearFormulario() {
    this.DataForm = this.fb.group({
      NumeroDocumento: ['', Validators.required],
      PrimerApellido: ['', Validators.required],
      TipoDocumento: [null, Validators.required],
      TipoPersona: [null, Validators.required],
      IngresoValidar: [null],
      IdMotivoConsulta: [null, Validators.required],
      IdOrigenDatos: ['Automatico', Validators.required],
      UsuarioConsulta: [''],
      IdUsuario: [null],
      IdOficina: [null],
    });

    this.ObtenerDatos();

  }

  ObtenerDatos() {
    let data = localStorage.getItem('Data');
    if (!data) return;

    const DataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.DataForm.patchValue({
      UsuarioConsulta: DataUser.Nombre,
      IdUsuario: + DataUser.IdUsuarioSGF,
      IdOficina: + DataUser.NumeroOficina
    });
  }

  ConsultarReporteData() {

    if (this.DataForm.invalid) {
      this.DataForm.markAllAsTouched();
      return;
    }

    swal.fire({

      title: '',
      text: '',
      html: '¿Los datos para realizar la consulta en la central de riesgos son correctos? <br> <strong>¿Desea continuar?</strong>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
      if (results.value) {
        this.ConsultarReporteDatacredito();
      }
    });
  }

  ConsultarReporteDatacredito() {
    this.loading.show();
    const data = this.DataForm.getRawValue();
    data.TipoDocumento = +data.TipoDocumento;
    data.TipoPersona = +data.TipoPersona;

    this.datacreditoService.ObtenerInformacionDataCredito(data).subscribe(
      result => {
        this.loading.hide();
        if (result.TipoAlerta !== 'Correcto') {
          this.notif.onDanger('Error', result.Mensaje);
        } else {
          const url = this.envirment.Url + result.Mensaje;
          this.ModalImpresion.nativeElement.click();

          const iframe: any = document.getElementById('iframeReporte');
          iframe.src = '';

          setTimeout(() => {
            iframe.src = url;
          }, 300);

        }
      },
      error => {
        this.loading.hide();
        let mensaje = error.Mensaje;

        const startIndex = mensaje.indexOf("{");
        const endIndex = mensaje.lastIndexOf("}");

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const jsonString = mensaje.substring(startIndex, endIndex + 1);

          try {
            const json = JSON.parse(jsonString);
            mensaje = json.mensaje || mensaje;
          } catch (e) {
            console.log(e);
          }
        }

        this.notif.onDanger("Error", mensaje);

      }
    );
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  ObtenerMotivosConsulta() {
    this.loading.show();
    this.datacreditoService.ObtenerMotivosConsulta().subscribe(
      result => {
        this.dataMotivoConsulta = result; this.loading.hide();
      },
      error => {
        this.loading.hide();
        console.error('ObtenerMotivosConsulta - ' + error);
      }
    );
  }

  ObtenerTiposIdentificacion() {
    this.loading.show();
    this.datacreditoService.ObtenerTipoIdentificacionDataC().subscribe(
      result => {
        this.dataTipoIdentificacion = result; this.loading.hide();
      },
      error => {
        this.loading.hide();
        console.error('ObtenerTiposIdentificacion - ' + error);
      }
    );
  }

  ObtenerInformacionPersona() {
    this.DataForm.get('IdMotivoConsulta')?.reset('');

    const numeroDocumento = (this.DataForm.get('NumeroDocumento')?.value ?? '').toString().trim();
    this.DataForm.get('NumeroDocumento')?.setValue(numeroDocumento);
    if (numeroDocumento === "" || numeroDocumento === undefined) {
      return;
    }

    this.loading.show();
    this.datacreditoService.ObtenerInformacionxDocumento(numeroDocumento).subscribe(
      result => {
        if (result === null) {
          this.LimpiarBusqueda();
          this.notif.onWarning('Advertencia', "No se encontró el documento, diligencie los campos faltantes manualmente.");

          this.loading.hide();

        } else {
          this.DataForm.get('PrimerApellido')?.setValue(result.PrimerApellido.trim());
          this.DataForm.get('TipoDocumento')?.setValue(result.TipoDocumento.toString());
          this.DataForm.get('IngresoValidar')?.setValue(result.IngresoValidar);
          this.DataForm.get('TipoPersona')?.setValue(result.TipoPersona.toString());
          this.onChangeTipoocupa();
          this.loading.hide();
        }
      },
      error => {
        this.loading.hide();
        this.LimpiarBusqueda();
        console.error('ObtenerTiposIdentificacion - ' + error);
      }
    );
    this.loading.hide();
  }

  LimpiarBusqueda() {
    this.DataForm.get('PrimerApellido')?.setValue("");
    this.DataForm.get('TipoDocumento')?.setValue(null);
    this.DataForm.get('IngresoValidar')?.setValue("");
    this.DataForm.get('TipoPersona')?.setValue(null);
  }

  onChangeTipoocupa(): void {
    if (this.DataForm.get('TipoPersona')?.value == '0') {
      this.vbleIngreso = true;
    } else {
      this.vbleIngreso = false;
    }
  }


}
