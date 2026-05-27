import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { ParametrosTransmisionData } from '../../../../Models/Configuracion/Transmision-archivos.model';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones'
import swal from 'sweetalert2';
import { ParametrosArchivosData } from '../../../../Models/Configuracion/Generacion-archivos.model';
import { GeneracionArchivosService } from '../../../../Services/Configuracion/Generacion-archivos.service';
import { TransmisionArchivosService } from '../../../../Services/Configuracion/Transmision-archivos.service';
import { LoadingService } from '../../../../Services/shared/loading.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-generacion-archivos',
  templateUrl: './generacion-archivos.component.html',
  styleUrl: './generacion-archivos.component.css',
  providers: [GeneralesService, GeneracionArchivosService, TransmisionArchivosService],
  standalone: false
})
export class GeneracionArchivosComponent implements OnInit {


  @ViewChild('ModalMasivoC', { static: true }) private modalMasivoC!: ElementRef;
  @ViewChild('diaInicial1') diaInicial1!: ElementRef;
  @ViewChild('diaFinal1') diaFinal1!: ElementRef;

  selectedRow: any = null;
  selectedRow1: any = null;
  selectedRow2: any = null;
  campoSelected: any = '0';
  initialValues: any = {};
  parametrosArchivos: ParametrosArchivosData[] = [];
  parametrosArchivosF: ParametrosArchivosData[] = [];
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public parametrosArchivosForm!: FormGroup;
  public vbleBtnactualizar: boolean = false;
  public vbleBtnactualizarMasivo: boolean = false;
  public selectedTarea: string = '';
  public historialArchivos: any[] = [];
  allSelected = false;



  constructor(
    private fb: FormBuilder,
    private TransmisionArchivosServices: TransmisionArchivosService,
    private GeneracionArchivosServices: GeneracionArchivosService,
    private toastr: ToastrService,
    private loading: LoadingService
  ) { }


  ngOnInit(): void {
    this.IrArriba();
    this.initForm();
    this.obtenerConfiguracion();

  }

  initForm() {
    this.parametrosArchivosForm = this.fb.group({
      idParametrosArchivos: [0],
      nombreTarea: ['', Validators.required],
      nombreSP: ['', Validators.required],
      diaInicial: ['', Validators.required],
      diaFinal: ['', Validators.required],
      nombreSalida: ['', Validators.required],
      formatoFecha: ['', Validators.required],
      tipoDeArchivo: ['', Validators.required],
      separador: ['', Validators.required],
      frecuencia: [0, Validators.required],
      horaGenera: ['', Validators.required],
      rutaLocalSalida: ['', Validators.required],
      ultFechaGeneración: [''],
      estado: [1],
      fechaMatricula: [''],
      fechaRetiro: [''],
      correoResponsable: ['', Validators.email],
      selected: false
    });
  }

  selectRow(parametro: any) {
    this.vbleBtnactualizar = true;
    const estado1 = false;
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
      correoResponsable: parametro.CorreoResponsable,
      estado: parametro.Estado,
      estado1: parametro.Estado,
      selected: false
    });;
    this.initialValues = JSON.parse(JSON.stringify(this.parametrosArchivosForm.value));
  }

  selectRow1(parametro: any) {
    this.selectedRow1 = parametro;
  }

  selectRow2(parametro: any) {
    this.selectedRow2 = parametro;
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
    this.allSelected = false;
    this.vbleBtnactualizarMasivo = false
    this.toggleAllCheckboxes();
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
    } else if (this.parametrosArchivosForm.get('nombreTarea')?.value.trim() == '' || this.parametrosArchivosForm.get('nombreSP')?.value.trim() == '' || this.parametrosArchivosForm.get('nombreSalida')?.value.trim() == '' || this.parametrosArchivosForm.get('formatoFecha')?.value.trim() == '' || this.parametrosArchivosForm.get('tipoDeArchivo')?.value.trim() == '' || this.parametrosArchivosForm.get('separador')?.value.trim() == '' || this.parametrosArchivosForm.get('frecuencia')?.value.trim() == '' || this.parametrosArchivosForm.get('rutaLocalSalida')?.value.trim() == '') {
      this.toastr.warning('Advertencia', 'Debe diligenciar los campos marcados como obligatorios.', ConfiguracionNotificacion.configRightTop);
    } else {
      const estadoActual = this.parametrosArchivosForm.get('estado')?.value;
      if (estadoActual == 1) {
        this.parametrosArchivosForm.get('estado')?.patchValue(1);
      } else {
        this.parametrosArchivosForm.get('estado')?.patchValue(0);
      }
      this.loading.show();
      this.GeneracionArchivosServices.GuardarParametrosArchivos(this.parametrosArchivosForm.value).subscribe(
        (response) => {
          this.toastr.success('Exitoso', 'Configuración guardada correctamente.', ConfiguracionNotificacion.configRightTop);
          this.obtenerConfiguracion();
          this.limpiarFormulario();
          this.IrAbajo();
          this.loading.hide();
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
          this.loading.hide();
        }
      );
    }
  }


  actualizarParametroTransmision() {
    if (!this.parametrosArchivosForm.valid) {
      this.toastr.warning('Advertencia', 'Error en el formulario, valide los campos', ConfiguracionNotificacion.configRightTop);
    } else if (this.parametrosArchivosForm.get('nombreTarea')?.value.trim() == '' || this.parametrosArchivosForm.get('nombreSP')?.value.trim() == '' || this.parametrosArchivosForm.get('nombreSalida')?.value.trim() == '' || this.parametrosArchivosForm.get('formatoFecha')?.value.trim() == '' || this.parametrosArchivosForm.get('tipoDeArchivo')?.value.trim() == '' || this.parametrosArchivosForm.get('separador')?.value.trim() == '' || this.parametrosArchivosForm.get('frecuencia')?.value.trim() == '' || this.parametrosArchivosForm.get('rutaLocalSalida')?.value.trim() == '') {
      this.toastr.warning('Advertencia', 'Debe diligenciar los campos marcados como obligatorios.', ConfiguracionNotificacion.configRightTop);
    } else {
      const result = this.ValidarCambios()
      const estadoActual = this.parametrosArchivosForm.get('estado')?.value;
      if (estadoActual == 1) {
        this.parametrosArchivosForm.get('estado')?.patchValue(1);
      } else {
        this.parametrosArchivosForm.get('estado')?.patchValue(0);
      }

      this.loading.show();
      if (result) {
        this.GeneracionArchivosServices.ActualizarParametrosArchivos(this.parametrosArchivosForm.value).subscribe(
          (response) => {
            this.toastr.success('Exitoso', 'Configuración actualizada correctamente.', ConfiguracionNotificacion.configRightTop);
            this.obtenerConfiguracion();
            this.limpiarFormulario();
            this.IrAbajo();
            this.loading.hide();
          },
          (error) => {
            this.toastr.error('Error', 'Error al actualizar los datos ' + error, ConfiguracionNotificacion.configRightTop);
            this.loading.hide();
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
            this.loading.hide();
          }
        });
      } else {
        this.limpiarFormulario();
        this.IrAbajo();
        this.toastr.warning('Advertencia', 'No se han detectado cambios para actualizar.', ConfiguracionNotificacion.configRightTop);
        this.loading.hide();
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
    this.selectedTarea = tarea;
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
    this.loading.show();
    const parametro: ParametrosArchivosData = JSON.parse(parametro1);
    try {
      this.GeneracionArchivosServices.GenerarArchivos(parametro).subscribe(
        (response) => {
          this.loading.hide();
          this.toastr.success('Exitoso', 'Ejecución realizada, valide el resultado del proceso.', ConfiguracionNotificacion.configRightTop);
        });
    } catch (error) {
      this.loading.hide();
      this.toastr.error('Error', 'Error ejecutando la tarea: '+error, ConfiguracionNotificacion.configRightTop);
    }


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

  toggleAllCheckboxes() {
    this.parametrosArchivos.forEach(p => p.selected = this.allSelected);
    this.cambiarVisibilidadBtnMasivo();
  }

  checkIfAllSelected() {
    this.allSelected = this.parametrosArchivos.every(p => p.selected);
    this.cambiarVisibilidadBtnMasivo();
  }

  cambiarVisibilidadBtnMasivo() {
    const seleccionados = this.parametrosArchivos.filter(p => p.selected).length;
    this.vbleBtnactualizarMasivo = seleccionados >= 2;
  }

  getIdsSeleccionados() {
    this.parametrosArchivosF = this.parametrosArchivos.filter(p => p.selected); //.map(p => p.IdParametrosArchivos);
  }

  changeCampoActualiza(event: Event) {
    this.campoSelected = (event.target as HTMLSelectElement).value
  }

  actualizarMasivo() {
    switch (this.campoSelected) {
      case "1": //Hora genera
        const timeInput1 = document.getElementById('time1') as HTMLInputElement;

        timeInput1.addEventListener('change', () => { });

        if (timeInput1.value == " " || timeInput1.value == "" || timeInput1.value == undefined) {
          this.toastr.warning('Advertencia', 'Debe ingresar una hora válida.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.parametrosArchivosF.forEach(parametro => {
            parametro.HoraGenera = timeInput1.value;
          });
          this.actualizarMasivo1();
        }
        break;
      case "2": //frecuencia
        const frecuencia1 = document.getElementById('frecuencia1') as HTMLInputElement;

        frecuencia1.addEventListener('change', () => { });

        if (frecuencia1.value == " " || frecuencia1.value == "" || frecuencia1.value == undefined) {
          this.toastr.warning('Advertencia', 'Debe seleccionar una frecuencia válida.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.parametrosArchivosF.forEach(parametro => {
            parametro.Frecuencia = frecuencia1.value;
          });
          this.actualizarMasivo1();
        }
        break;
      case "3": //día inicial

        this.diaInicial1.nativeElement.addEventListener('change', () => {
          console.log('Fecha seleccionada:', this.diaInicial1.nativeElement.value);
        });

        let fechaIni: any = null;
        fechaIni = new Date(this.diaInicial1.nativeElement.value);

        if (this.diaInicial1.nativeElement.value == " " || this.diaInicial1.nativeElement.value == "" || this.diaInicial1.nativeElement.value == undefined) {
          this.toastr.warning('Advertencia', 'Debe seleccionar una fecha inicial válida.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.parametrosArchivosF.forEach(parametro => {
            parametro.DiaInicial = fechaIni;
            parametro.DiaFinal = fechaIni;
          });
          this.actualizarMasivo1();
        }
        break;
      case "4": //día final
        this.diaFinal1.nativeElement.addEventListener('change', () => {
          console.log('Fecha seleccionada:', this.diaFinal1.nativeElement.value);
        });

        let fechaFin: any = null;
        fechaFin = new Date(this.diaFinal1.nativeElement.value);

        if (this.diaFinal1.nativeElement.value == " " || this.diaFinal1.nativeElement.value == "" || this.diaFinal1.nativeElement.value == undefined) {
          this.toastr.warning('Advertencia', 'Debe seleccionar una fecha final válida.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.parametrosArchivosF.forEach(parametro => {
            parametro.DiaFinal = fechaFin;
            parametro.DiaInicial = fechaFin;
          });
          this.actualizarMasivo1();
        }
        break;
      case "5": //estado
        const checkEstado1 = document.getElementById('checkEstado1') as HTMLInputElement;

        checkEstado1.addEventListener('change', () => { });

        this.parametrosArchivosF.forEach(parametro => {
          parametro.Estado = checkEstado1.checked;
        });
        this.actualizarMasivo1();

        break;
      case "6": //separador
        const separador1 = document.getElementById('separador1') as HTMLInputElement;

        separador1.addEventListener('change', () => { });

        if (separador1.value == " " || separador1.value == "" || separador1.value == undefined) {
          this.toastr.warning('Advertencia', 'Debe seleccionar un separador válido.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.parametrosArchivosF.forEach(parametro => {
            parametro.Separador = separador1.value;
          });
          this.actualizarMasivo1();
        }

        break;
      case "7": //Ruta local salida
        const rutalocalSalidaMasivo = document.getElementById('rutaLocalSalidaMasivo') as HTMLInputElement;

        if (rutalocalSalidaMasivo.value.trim() == "" || rutalocalSalidaMasivo.value.trim() == undefined) {
          this.toastr.warning('Advertencia', 'Debe ingresar una ruta válida.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.parametrosArchivosF.forEach(parametro => {
            parametro.RutaLocalSalida = rutalocalSalidaMasivo.value.trim();
          });
          this.actualizarMasivo1();
        }

        break;
        case "8": //Formato fecha masivo
        const formatoFechaMasivo = document.getElementById('formatoFechaMasivo') as HTMLInputElement;

        if (formatoFechaMasivo.value.trim() == "" || formatoFechaMasivo.value.trim() == undefined) {
          this.toastr.warning('Advertencia', 'Debe ingresar una formato de fecha válido.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.parametrosArchivosF.forEach(parametro => {
            parametro.FormatoFecha = formatoFechaMasivo.value.trim();
          });
          this.actualizarMasivo1();
        }

        break;
      }
  }

  actualizarMasivo1() {
    try {
      this.loading.show();
      this.GeneracionArchivosServices.ActualizarParametrosArchivosMasivo(this.parametrosArchivosF)
        .subscribe(
          (response) => {
            this.toastr.success('Exitoso', 'Actualización masiva realizada correctamente.', ConfiguracionNotificacion.configRightTop);
            this.obtenerConfiguracion();
            this.cerrarModalMasivo();
            this.allSelected = false;
            this.vbleBtnactualizarMasivo = false;
            this.loading.hide();
          });

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
          this.loading.hide();
        }
      });
      this.loading.hide();
    } catch (error) {
      this.toastr.success('Error', 'Error al actualizar registros masivamente: ' + error, ConfiguracionNotificacion.configRightTop);
      this.loading.hide();
    }
  }

  cerrarModalMasivo() {
    $(this.modalMasivoC.nativeElement).click();
  }
}
