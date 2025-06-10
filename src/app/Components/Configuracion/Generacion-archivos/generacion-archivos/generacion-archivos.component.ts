import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { ParametrosTransmisionData } from '../../../../Models/Configuracion/Transmision-archivos.model';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones'
import swal from 'sweetalert2';
import { ParametrosArchivosData } from '../../../../Models/Configuracion/Generacion-archivos.model';
import { GeneracionArchivosService } from '../../../../Services/Configuracion/Generacion-archivos.service';
import { TransmisionArchivosService } from '../../../../Services/Configuracion/Transmision-archivos.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-generacion-archivos',
  templateUrl: './generacion-archivos.component.html',
  styleUrl: './generacion-archivos.component.css',
  providers: [GeneralesService, GeneracionArchivosService, TransmisionArchivosService ],
  standalone: false
})
export class GeneracionArchivosComponent implements OnInit {

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;

  selectedRow: any = null;
  selectedRow1: any = null;
  initialValues: any = {};
  parametrosArchivos: ParametrosArchivosData[] = [];
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public parametrosArchivosForm!: FormGroup;
  public showPassword: boolean = false;
  public vbleBtnactualizar: boolean = false;
  public vbleCifrado: boolean = false;
  public selectedProtocolo: string = '';
  public selectedTarea: string = '';
  public historialArchivos: any[] = [];
  public tiposCifrado: any[] = [
    { value: 'GPG', descripcion: 'GPG' }
  ];

  constructor(
    private fb: FormBuilder,
    private TransmisionArchivosServices: TransmisionArchivosService,
    private GeneracionArchivosServices: GeneracionArchivosService,
    private toastr: ToastrService
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.IrArriba();
    this.initForm();
    this.obtenerConfiguracion();

  }

  initForm() {
    this.parametrosArchivosForm = this.fb.group({
      idParametrosArchivos: [0],
      nombreTarea: ['',  Validators.required],
      nombreSP: ['', Validators.required],
      diaInicial: ['', Validators.required],
      diaFinal: ['', Validators.required],
      nombreSalida: ['', Validators.required],
      formatoFecha: ['', Validators.required],
      tipoDeArchivo: ['', Validators.required],
      separador: ['', Validators.required],
      frecuencia: [0,Validators.required],
      horaGenera: ['', Validators.required],
      rutaLocalSalida: ['',Validators.required],
      ultFechaGeneración: [''],
      estado: [1],
      fechaMatricula: [''],
      fechaRetiro: ['']
    });
  }

  selectRow(parametro: any) {
    this.vbleBtnactualizar = true;
    const estado1=false;
    this.selectedRow = parametro;
    this.parametrosArchivosForm.patchValue({
      idParametrosArchivos: parametro.IdParametrosArchivos,
      nombreTarea: parametro.NombreTarea,
      nombreSP: parametro.NombreSP,
      diaInicial: parametro.DiaInicial.split("T")[0],
      diaFinal: parametro.DiaFinal.split("T")[0],
      nombreSalida: parametro.NombreSalida,
      formatoFecha: parametro.FormatoFecha,
      tipoDeArchivo: parametro.TipoDeArchivo,
      separador: parametro.Separador,
      frecuencia: parametro.Frecuencia,
      horaGenera: parametro.HoraGenera,
      rutaLocalSalida: parametro.RutaLocalSalida,
      estado: parametro.Estado,
      estado1:  parametro.Estado,
    });;
    this.initialValues = JSON.parse(JSON.stringify(this.parametrosArchivosForm.value));
  }

  selectRow1(parametro: any) {
    this.selectedRow1 = parametro;
  }

  ValidarCambios(): boolean {
    const formValues = this.parametrosArchivosForm.value;
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
    this.GeneracionArchivosServices.GetParametrosArchivos().subscribe(
      (result: ParametrosArchivosData[]) => {
        this.parametrosArchivos = result;
      },
      error => {
        const errorMessage = <any>error;
        this.toastr.error('Error', errorMessage, ConfiguracionNotificacion.configRightTop);
        console.log(errorMessage);
      }
    );
  }


  limpiarFormulario(): void {

    this.initForm();
    this.selectedRow = null;
    this.selectedRow1 = null;
    this.vbleBtnactualizar = false;

  }

  borrarSiEspacios(controlName: string): void {
    const control = this.parametrosArchivosForm.get(controlName);
    const value = control?.value;
  
    if (typeof value === 'string') {
      control?.setValue(value.trim());
    }
  }
  
  

  guardarParametroArchivos() {
    if (!this.parametrosArchivosForm.valid) {
      this.toastr.warning('Advertencia', 'Error en el formulario, valide los campos', ConfiguracionNotificacion.configRightTop);
    } else if (this.parametrosArchivosForm.get('nombreTarea')?.value.trim() == '' ||this.parametrosArchivosForm.get('nombreSP')?.value.trim() == '' ||this.parametrosArchivosForm.get('nombreSalida')?.value.trim() == '' ||this.parametrosArchivosForm.get('formatoFecha')?.value.trim() == '' ||this.parametrosArchivosForm.get('tipoDeArchivo')?.value.trim() == '' ||this.parametrosArchivosForm.get('separador')?.value.trim() == '' ||this.parametrosArchivosForm.get('frecuencia')?.value.trim() == '' ||this.parametrosArchivosForm.get('rutaLocalSalida')?.value.trim() == '' ) {
      this.toastr.warning('Advertencia', 'Debe diligenciar los campos marcados como obligatorios.', ConfiguracionNotificacion.configRightTop);
    } else {
      const estadoActual = this.parametrosArchivosForm.get('estado')?.value;
      if (estadoActual == 1) {
        this.parametrosArchivosForm.get('estado')?.patchValue(1);
      } else {
        this.parametrosArchivosForm.get('estado')?.patchValue(0);
      }
      this.loading = true;
      this.GeneracionArchivosServices.GuardarParametrosArchivos(this.parametrosArchivosForm.value).subscribe(
        (response) => {
          this.toastr.success('Exitoso', 'Configuración guardada correctamente.', ConfiguracionNotificacion.configRightTop);
          this.obtenerConfiguracion();
          this.limpiarFormulario();
          this.IrAbajo();
          this.loading = false;
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
        },        
        (error) => {
          this.toastr.warning('Advertencia', error.message, ConfiguracionNotificacion.configRightTop);
          this.loading = false;
        }
      );
    }
  }


  actualizarParametroTransmision() {
    if (!this.parametrosArchivosForm.valid) {
      this.toastr.warning('Advertencia', 'Error en el formulario, valide los campos', ConfiguracionNotificacion.configRightTop);
    } else if (this.parametrosArchivosForm.get('nombreTarea')?.value.trim() == '' ||this.parametrosArchivosForm.get('nombreSP')?.value.trim() == '' ||this.parametrosArchivosForm.get('nombreSalida')?.value.trim() == '' ||this.parametrosArchivosForm.get('formatoFecha')?.value.trim() == '' ||this.parametrosArchivosForm.get('tipoDeArchivo')?.value.trim() == '' ||this.parametrosArchivosForm.get('separador')?.value.trim() == '' ||this.parametrosArchivosForm.get('frecuencia')?.value.trim() == '' ||this.parametrosArchivosForm.get('rutaLocalSalida')?.value.trim() == '' ) {
      this.toastr.warning('Advertencia', 'Debe diligenciar los campos marcados como obligatorios.', ConfiguracionNotificacion.configRightTop);
    } else {
      const result = this.ValidarCambios()
      const estadoActual = this.parametrosArchivosForm.get('estado')?.value;
      if (estadoActual == 1) {
        this.parametrosArchivosForm.get('estado')?.patchValue(5);
      } else {
        this.parametrosArchivosForm.get('estado')?.patchValue(20);
      }

      this.loading = true;
      if (result) {
        this.GeneracionArchivosServices.ActualizarParametrosArchivos(this.parametrosArchivosForm.value).subscribe(
          (response) => {
            this.toastr.success('Exitoso', 'Configuración actualizada correctamente.', ConfiguracionNotificacion.configRightTop);
            this.obtenerConfiguracion();
            this.limpiarFormulario();
            this.IrAbajo();
            this.loading = false;
          },
          (error) => {
            this.toastr.error('Error', 'Error al actualizar los datos ' + error, ConfiguracionNotificacion.configRightTop);
            this.loading = false;
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
            this.loading = false;
          }
        });
      } else {
        this.limpiarFormulario();
        this.IrAbajo();
        this.toastr.warning('Advertencia', 'No se han detectado cambios para actualizar.', ConfiguracionNotificacion.configRightTop);
        this.loading = false;
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
    if (this.parametrosArchivosForm.valid) {
      console.log(this.parametrosArchivosForm.value);
    }
  }

  obtenerHistorial(id: number, tarea: string) {
    this.selectedTarea= tarea;
    this.GeneracionArchivosServices.GetHistorialArchivos(id).subscribe(
      (result) => {
        this.historialArchivos = result;
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
    const parametro: ParametrosArchivosData = JSON.parse(parametro1);


  }


 obtenerTareas() {
    try {
      this.GeneracionArchivosServices.GetTareas().subscribe(
        (response) => {
          // console.log("Tareas programadas: " + response)
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
