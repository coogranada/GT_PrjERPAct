import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { TransmisionArchivosService } from '../../../../Services/Configuracion/Transmision-archivos.service';
import { ParametrosTransmisionData } from '../../../../Models/Configuracion/Transmision-archivos.model';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones'
import swal from 'sweetalert2';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';



@Component({
  selector: 'app-transmision-archivos',
  templateUrl: './transmision-archivos.component.html',
  styleUrls: ['./transmision-archivos.component.css'],
  providers: [GeneralesService, TransmisionArchivosService],
  standalone: false
})
export class TransmisionArchivosComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('gpgRecipientInput') gpgRecipientInput: ElementRef | undefined;

  selectedRow: any = null;
  initialValues: any = {};
  parametrosTransm: ParametrosTransmisionData[] = [];
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public parametrosTransmisionForm!: FormGroup;
  public showPassword: boolean = false;
  public vbleBtnactualizar: boolean = false;
  public vbleCifrado: boolean = false;
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
    this.initForm();

    this.obtenerConfiguracion();

  }

  initForm() {
    this.parametrosTransmisionForm = this.fb.group({
      IdParametro: [''],
      nombreSitio: ['', Validators.required],
      servidor: ['', Validators.required],
      rutaLocalEntrada: [''],
      rutaLocalSalida: [''],
      rutaRemotaEntrada: [''],
      rutaRemotaSalida: [''],
      protocolo: ['', Validators.required],
      puerto: [''],
      modoAcceso: [''],
      usuario: ['', Validators.required],
      contrasena: [''],
      cifrado: [''],
      correoResponsable: ['', Validators.email],
      frecuencia: [1],
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      gpgRecipient: [''],
      rutaLlave: [''],
      fechaCreacion: [''],
      estado: [1]
    });
  }

  selectRow(parametro: any) {
    this.vbleBtnactualizar = true;
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
    this.onChangeProtocol(2);
    this.initialValues = JSON.parse(JSON.stringify(this.parametrosTransmisionForm.value));
    this.selectedTarea = parametro.NombreSitio;
  }

  ValidarCambios(): boolean {
    const formValues = this.parametrosTransmisionForm.value;
    if (JSON.stringify(this.initialValues) !== JSON.stringify(formValues)) {
      return true;
    } else {
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

    this.initForm();
    this.selectedRow = null;
    this.vbleBtnactualizar = false;

  }

  onProtocoloChange(): void {
    this.selectedProtocolo = 'SFTP';
    this.parametrosTransmisionForm.controls['protocolo'].setValue(this.selectedProtocolo);
  }

  onChangeProtocol(op: number): void {
    if (this.parametrosTransmisionForm.get('protocolo')?.value == 'SFTP') {
      this.vbleCifrado = true;
    } else {
      this.vbleCifrado = false;
    }

    if (op == 1) {
      if (this.parametrosTransmisionForm.get('protocolo')?.value == 'SFTP') {
        this.parametrosTransmisionForm.controls['cifrado'].setValue('');
        this.parametrosTransmisionForm.controls['gpgRecipient'].setValue('');
      } else {
        this.parametrosTransmisionForm.controls['cifrado'].setValue('');
        this.parametrosTransmisionForm.controls['gpgRecipient'].setValue('');
      }
    }

  }

  onChangeCifrado(): void {
    if (this.parametrosTransmisionForm.get('cifrado')?.value !== 'GPG') {
      this.parametrosTransmisionForm.controls['gpgRecipient'].setValue('');
    }
  }

  borrarSiEspacios(controlName: string): void {
    const control = this.parametrosTransmisionForm.controls[controlName];

    if (control.value.trim() === '') {
      control.setValue('');
    }
  }

  guardarParametroTransmision() {
    if (!this.parametrosTransmisionForm.valid) {
      this.toastr.warning('Advertencia', 'Error en el formulario, valide los campos', ConfiguracionNotificacion.configRightTop);
    } else if (this.parametrosTransmisionForm.get('horaEntrada')?.value.startsWith('00:00') && this.parametrosTransmisionForm.get('horaSalida')?.value.startsWith('00:00')) {
      this.toastr.warning('Advertencia', 'La hora de entrada y salida no puede ser ambas 12:00 a.m.', ConfiguracionNotificacion.configRightTop);
    } else if (!this.parametrosTransmisionForm.get('horaEntrada')?.value.startsWith('00:00') && (this.parametrosTransmisionForm.get('rutaLocalEntrada')?.value.trim() == '' || this.parametrosTransmisionForm.get('rutaRemotaSalida')?.value.trim() == '')) {
      this.toastr.warning('Advertencia', 'La ruta local entrada y ruta remota salida son obligatorias.', ConfiguracionNotificacion.configRightTop);
    } else if (!this.parametrosTransmisionForm.get('horaSalida')?.value.startsWith('00:00') && (this.parametrosTransmisionForm.get('rutaLocalSalida')?.value.trim() == '' || this.parametrosTransmisionForm.get('rutaRemotaEntrada')?.value.trim() == '')) {
      this.toastr.warning('Advertencia', 'La ruta local salida y ruta remota entrada son obligatorias.', ConfiguracionNotificacion.configRightTop);
    }else if (this.vbleCifrado && this.parametrosTransmisionForm.get('cifrado')?.value == 'GPG' && this.parametrosTransmisionForm.get('gpgRecipient')?.value.trim() == '') {
      this.toastr.warning('Advertencia', 'GPG recipient es obligatorio cuando el cifrado elegido es GPG.', ConfiguracionNotificacion.configRightTop);
      this.gpgRecipientInput?.nativeElement.focus();
    } else {
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
          this.toastr.warning('Advertencia', error.message, ConfiguracionNotificacion.configRightTop);
        }
      );
    }
  }


  actualizarParametroTransmision() {
    if (!this.parametrosTransmisionForm.valid) {
      this.toastr.warning('Advertencia', 'Error en el formulario, valide los campos', ConfiguracionNotificacion.configRightTop);
    } else if (this.parametrosTransmisionForm.get('horaEntrada')?.value.startsWith('00:00') && this.parametrosTransmisionForm.get('horaSalida')?.value.startsWith('00:00')) {
      this.toastr.warning('Advertencia', 'La hora de entrada y salida no puede ser ambas 12:00 a.m.', ConfiguracionNotificacion.configRightTop);
    } else if (!this.parametrosTransmisionForm.get('horaEntrada')?.value.startsWith('00:00') && (this.parametrosTransmisionForm.get('rutaLocalEntrada')?.value.trim() == '' || this.parametrosTransmisionForm.get('rutaRemotaSalida')?.value.trim() == '')) {
      this.toastr.warning('Advertencia', 'La ruta local entrada y ruta remota salida son obligatorias.', ConfiguracionNotificacion.configRightTop);
    } else if (!this.parametrosTransmisionForm.get('horaSalida')?.value.startsWith('00:00') && (this.parametrosTransmisionForm.get('rutaLocalSalida')?.value.trim() == '' || this.parametrosTransmisionForm.get('rutaRemotaEntrada')?.value.trim() == '')) {
      this.toastr.warning('Advertencia', 'La ruta local salida y ruta remota entrada son obligatorias.', ConfiguracionNotificacion.configRightTop);
    } else if (this.vbleCifrado && this.parametrosTransmisionForm.get('cifrado')?.value == 'GPG' && this.parametrosTransmisionForm.get('gpgRecipient')?.value.trim() == '') {
      this.toastr.warning('Advertencia', 'GPG recipient es obligatorio cuando el cifrado elegido es GPG.', ConfiguracionNotificacion.configRightTop);
      this.gpgRecipientInput?.nativeElement.focus();
    }
    else {
      const result = this.ValidarCambios()
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
        swal.fire({
          title: '<strong> ¿Desea que se programen nuevamente las tareas? </strong>',
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
            this.actualizarHoraEjecucion();
          }
        });
      } else {
        this.limpiarFormulario();
        this.IrAbajo();
        this.toastr.warning('Advertencia', 'No se han detectado cambios para actualizar.', ConfiguracionNotificacion.configRightTop);
      }
    }
  }

  actualizarHoraEjecucion() {
    this.TransmisionArchivosServices.ActualizarHoraEjecucion().subscribe(
      (response) => {
        swal.fire({
          icon: "success",
          title: "Tareas reprogramadas correctamente.",
          showConfirmButton: false,
          timer: 3000
        });
      },
      (error) => {
        swal.fire({
          icon: "warning",
          title: "No se pudo reprogramar tareas.",
          showConfirmButton: false,
          timer: 3000
        });
        console.log(error);
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
    try {
      this.loading = true;
      this.TransmisionArchivosServices.EjecutarSFTP(parametro).subscribe(
        (response) => {
          this.loading = false;
          this.toastr.success('Exitoso', response, ConfiguracionNotificacion.configRightTop);
        },
        (error) => {
          if (error.status === 400) {
            this.loading = false;
            const errorMessage = error.error;
            this.toastr.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);
          } else {
            this.loading = false;
            this.toastr.warning('Advertencia', error.message, ConfiguracionNotificacion.configRightTop);
          }
        }
      );
    } catch (error) {
      this.loading = false;
      this.toastr.error('Error', '' + error, ConfiguracionNotificacion.configRightTop);
    }
  }

  ejecutarSFTPGPG(parametro: ParametrosTransmisionData) {
    try {
      this.loading = true;
      this.TransmisionArchivosServices.EjecutarSFTPGPG(parametro).subscribe(
        (response) => {
          this.loading = false;
          this.toastr.success('Exitoso', response, ConfiguracionNotificacion.configRightTop);
        },
        (error) => {
          if (error.status === 400) {
            this.loading = false;
            const errorMessage = error.error;
            this.toastr.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);
          } else {
            this.loading = false;
            this.toastr.warning('Advertencia', error.message, ConfiguracionNotificacion.configRightTop);
          }
        }
      );
    } catch (error) {
      this.loading = false;
      this.toastr.error('Error', '' + error, ConfiguracionNotificacion.configRightTop);
    }

  }

  ejecutarGRAPH(parametro: ParametrosTransmisionData) {
    try {
      this.loading = true;
      this.TransmisionArchivosServices.EjecutarGRAPH(parametro).subscribe(
        (response) => {
          this.loading = false;
          this.toastr.success('Exitoso', response, ConfiguracionNotificacion.configRightTop);
        },
        (error) => {
          if (error.status === 400) {
            this.loading = false;
            const errorMessage = error._body ? JSON.parse(error._body) : '.';
            this.toastr.warning('Advertencia', errorMessage, ConfiguracionNotificacion.configRightTop);
          } else {
            this.loading = false;
            this.toastr.warning('Error', error, ConfiguracionNotificacion.configRightTop);
          }
        }
      );
    } catch (error) {
      this.loading = false;
      this.toastr.error('Error', '' + error, ConfiguracionNotificacion.configRightTop);
    }
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

  estaEnUltimos5Dias(fechaEjecucion: string): boolean {
    const fecha = new Date(fechaEjecucion);
    const fechaActual = new Date();
    const diferenciaDias = (fechaActual.getTime() - fecha.getTime()) / (1000 * 3600 * 24);
    return diferenciaDias <= 5;
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
