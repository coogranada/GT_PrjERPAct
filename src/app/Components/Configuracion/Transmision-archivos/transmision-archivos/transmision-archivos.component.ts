import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { TransmisionArchivosService } from '../../../../Services/Configuracion/Transmision-archivos.service';
import { ParametrosTransmisionData } from '../../../../Models/Configuracion/Transmision-archivos.model';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones'





@Component({
  selector: 'app-transmision-archivos',
  templateUrl: './transmision-archivos.component.html',
  styleUrls: ['./transmision-archivos.component.css'],
  providers: [GeneralesService, TransmisionArchivosService],
  standalone: false
})
export class TransmisionArchivosComponent implements OnInit {
  selectedRow: any = null;
  initialValues: any = {};
  parametrosTransm: ParametrosTransmisionData[] = [];
  public parametrosTransmisionForm!: FormGroup;
  public showPassword: boolean = false;
  public selectedProtocolo: string = '';
  public selectedTarea: string = '';
  public historialTransm: any[] = [];
  public tiposProtocolos: any[] = [
    { value: 'SFTP', descripcion: 'SFTP' },
    { value: 'GRAPH', descripcion: 'GRAPH' }
  ];
  public tiposCifrado: any[] = [
    { value: 'GPG', descripcion: 'GPG' }
  ];

  constructor(
    private TransmisionArchivosServices: TransmisionArchivosService,
    private fb: FormBuilder,
    private generalesService: GeneralesService,
    private toastr: ToastrService
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.IrArriba()
    this.selectedProtocolo = '-';
    this.parametrosTransmisionForm = this.fb.group({
      IdParametro: [''],
      nombreSitio: ['', Validators.required],
      servidor: ['', Validators.required],
      rutaLocalEntrada: [''],
      rutaLocalSalida: ['', Validators.required],
      rutaRemotaEntrada: ['', Validators.required],
      rutaRemotaSalida: [''],
      protocolo: ['', Validators.required],
      puerto: [''],
      modoAcceso: [''],
      usuario: ['', Validators.required],
      contrasena: [''],
      cifrado: [''],
      correoResponsable: ['', Validators.email],
      frecuencia: [''],
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      gpgRecipient: [''],
      rutaLlave: [''],
      fechaCreacion: [''],
      estado: [0]
    });

    this.obtenerConfiguracion();

  }

  selectRow(parametro: any) {
    this.selectedRow = parametro;
    this.parametrosTransmisionForm.patchValue({
      IdParametro: parametro.IdParametro,
      nombreSitio: parametro.NombreSitio,
      servidor: parametro.Servidor,
      rutaLocalEntrada: parametro.RutaLocalEntrada,
      rutaLocalSalida: parametro.RutaLocalSalida,
      rutaRemotaEntrada: parametro.RutaRemotaEntrada,
      rutaRemotaSalida: parametro.RutaRemotaSalida,
      protocolo: parametro.Protocolo,
      puerto: parametro.Puerto,
      modoAcceso: parametro.ModoAcceso,
      usuario: parametro.Usuario,
      contrasena: parametro.Contrasena,
      cifrado: parametro.Cifrado,
      correoResponsable: parametro.CorreoResponsable,
      frecuencia: parametro.Frecuencia,
      horaEntrada: parametro.HoraEntrada,
      horaSalida: parametro.HoraSalida,
      gpgRecipient: parametro.GPGRecipient,
      rutaLlave: parametro.RutaLlave,
      fechaCreacion: parametro.FechaCreacion,
      estado: parametro.Estado,
    });
    this.cambiarEstado();
    this.initialValues = JSON.parse(JSON.stringify(this.parametrosTransmisionForm.value));
    this.selectedTarea = parametro.NombreSitio;
  }

  ValidarCambios(): boolean {
    const formValues = this.parametrosTransmisionForm.value;
    if(JSON.stringify(this.initialValues) !== JSON.stringify(formValues)){
      return true;
    }else{
      return false;
    }
    
  }
  

  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  obtenerConfiguracion() {
    this.TransmisionArchivosServices.GetParametrosTransmision().subscribe(
      (result: ParametrosTransmisionData[]) => {
        this.parametrosTransm = result;
      },
      error => {
        const errorMessage = <any>error;
        this.toastr.error('Error', errorMessage, ConfiguracionNotificacion.configRightTop);
        console.log(errorMessage);
      }
    );
  }

  cambiarEstado() {
    const estadoActual = this.parametrosTransmisionForm.get('estado')?.value;

    if (estadoActual === 5) {
      this.parametrosTransmisionForm.patchValue({ estado: 1 });
    } else {
      this.parametrosTransmisionForm.patchValue({ estado: 0 });
    }
  }

  limpiarFormulario(): void {
    this.parametrosTransmisionForm.reset();
    this.selectedRow = null;
  }

  onProtocoloChange(): void {
    this.selectedProtocolo = 'SFTP';
    this.parametrosTransmisionForm.controls['protocolo'].setValue(this.selectedProtocolo);
  }

  guardarParametroTransmision() {
    if (this.parametrosTransmisionForm.valid) {
      const estadoActual = this.parametrosTransmisionForm.get('estado')?.value;
      if (estadoActual == 1) {
        this.parametrosTransmisionForm.get('estado')?.patchValue(5);
      } else {
        this.parametrosTransmisionForm.get('estado')?.patchValue(20);
      }

      this.TransmisionArchivosServices.GuardarParametrosTransmision(this.parametrosTransmisionForm.value).subscribe(
        (response) => {
          this.toastr.success('Exitoso', 'Configuración guardada correctamente.', ConfiguracionNotificacion.configRightTop);
          this.obtenerConfiguracion();
          this.limpiarFormulario();
          this.IrAbajo();
        },
        (error) => {
          this.toastr.error('Error', 'Error al guardar los datos ' + error, ConfiguracionNotificacion.configRightTop);
        }
      );
    } else {
      this.toastr.warning('Advertencia', 'Error en el formulario, valide los campos', ConfiguracionNotificacion.configRightTop);
    }
  }


  actualizarParametroTransmision() {
    if (this.parametrosTransmisionForm.valid) {
      const result=this.ValidarCambios()
      const estadoActual = this.parametrosTransmisionForm.get('estado')?.value;
      if (estadoActual == 1) {
        this.parametrosTransmisionForm.get('estado')?.patchValue(5);
      } else {
        this.parametrosTransmisionForm.get('estado')?.patchValue(20);
      }

      if (result) {
        this.TransmisionArchivosServices.ActualizarParametrosTransmision(this.parametrosTransmisionForm.value).subscribe(
          (response) => {
            this.toastr.success('Exitoso', 'Configuración actualizada correctamente.', ConfiguracionNotificacion.configRightTop);
            this.obtenerConfiguracion();
            this.limpiarFormulario();
            this.IrAbajo();
          },
          (error) => {
            this.toastr.error('Error', 'Error al actualizar los datos ' + error, ConfiguracionNotificacion.configRightTop);
          }
        );
        //Actualizar hora ejecución

      } else {
        this.toastr.warning('Advertencia', 'No se han detectado cambios para actualizar.', ConfiguracionNotificacion.configRightTop);
      }
    } else {
      this.toastr.warning('Advertencia', 'Error en el formulario, valide los campos.', ConfiguracionNotificacion.configRightTop);
    }
  }

  actualizarHoraEjecucion() {
    this.TransmisionArchivosServices.ActualizarHoraEjecucion().subscribe(
      (response) => {
        this.toastr.success('Exitoso', 'Hora ejecución actualizada correctamente.', ConfiguracionNotificacion.configRightTop);
        this.obtenerConfiguracion();
        this.limpiarFormulario();
        this.IrAbajo();
      },
      (error) => {
        this.toastr.error('Error', 'Error al actualizar hora ejecución ' + error, ConfiguracionNotificacion.configRightTop);
      }
    );
  }

  onSubmit(): void {
    if (this.parametrosTransmisionForm.valid) {
      console.log(this.parametrosTransmisionForm.value);
    }
  }

  obtenerHistorial(id: number) {
    this.TransmisionArchivosServices.GetHistorialTransmision(id).subscribe(
      (result) => {
        this.historialTransm = result;
      },
      error => {
        const errorMessage = <any>error;
        this.toastr.error('Error', errorMessage, ConfiguracionNotificacion.configRightTop);
        console.log(errorMessage);
      }
    );
    this.obtenerTareas();
  }

  reintentarEjecucion(parametro1: string) {
    const parametro: ParametrosTransmisionData = JSON.parse(parametro1);

    switch (parametro.Protocolo.toUpperCase().trim()) {
      case "SFTP":
        if ((parametro.Cifrado ?? "").toUpperCase().trim() == "GPG" || (parametro.Cifrado ?? "").toUpperCase().trim() == "PGP") {
          this.ejecutarSFTPGPG(parametro);
          this.obtenerHistorial(parametro.IdParametro);
        }
        else {
          this.ejecutarSFTP(parametro);
          this.obtenerHistorial(parametro.IdParametro);
        }
        break;
      case "GRAPH":
        this.ejecutarGRAPH(parametro);
        this.obtenerHistorial(parametro.IdParametro);
        break;
      case "FTP":
        // trabajos relacionados con FTP
        break;
      default:
        // lógica para otros protocolos
        break;
    }
  }

  ejecutarSFTP(parametro: ParametrosTransmisionData) {
    this.TransmisionArchivosServices.EjecutarSFTP(parametro).subscribe(
      (response) => {
        this.toastr.success('Exitoso', response, ConfiguracionNotificacion.configRightTop);
      },
      (error) => {
        if (error.status === 400) {
          const errorMessage = error.error;
          this.toastr.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);
        } else {
          this.toastr.warning('Advertencia', error.message, ConfiguracionNotificacion.configRightTop);
        }
      }
    );
  }

  ejecutarSFTPGPG(parametro: ParametrosTransmisionData) {
    try {
      this.TransmisionArchivosServices.EjecutarSFTPGPG(parametro).subscribe(
        (response) => {
          this.toastr.success('Exitoso', response, ConfiguracionNotificacion.configRightTop);
        },
        (error) => {
          if (error.status === 400) {
            const errorMessage = error.error;
            this.toastr.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);
          } else {
            this.toastr.warning('Advertencia', error.message, ConfiguracionNotificacion.configRightTop);
          }
        }
      );
    } catch (error) {
      this.toastr.error('Error', '' + error, ConfiguracionNotificacion.configRightTop);
    }

  }

  ejecutarGRAPH(parametro: ParametrosTransmisionData) {
    this.TransmisionArchivosServices.EjecutarGRAPH(parametro).subscribe(
      (response) => {
        this.toastr.success('Exitoso', response, ConfiguracionNotificacion.configRightTop);
      },
      (error) => {
        if (error.status === 400) {
          const errorMessage = error._body ? JSON.parse(error._body) : '.';
          this.toastr.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);
        } else {
          this.toastr.warning('Error', error, ConfiguracionNotificacion.configRightTop);
        }
      }
    );
  }

  obtenerTareas() {
    try {
      this.TransmisionArchivosServices.GetTareas().subscribe(
        (response) => {
          console.log("Tareas programadas: " + response)
        });
    } catch (error) {
      console.log("Error obteniendo tareas programadas: " + error)
    }
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  IrAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }

}
