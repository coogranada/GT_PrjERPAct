import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionInformesService } from '../../../../../Services/Informes/configuracion-informes.service';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, lastValueFrom, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { OperacionesModulosService } from '../../../../../Services/Maestros/operaciones-modulos.service';
import { NgxLoadingComponent } from 'ngx-loading';
import swal from 'sweetalert2';
import { PermisosInformesComponent } from '../permisos-informes/permisos-informes/permisos-informes.component';


@Component({
  selector: 'app-configuracion-informes',
  templateUrl: './configuracion-informes.component.html',
  styleUrl: './configuracion-informes.component.css',
  providers: [ModuleValidationService, OperacionesModulosService],
  standalone: false
})
export class ConfiguracionInformesComponent implements OnInit {
  @ViewChild('ShowModalList', { static: true }) private ShowModalList!: ElementRef;
  @ViewChild('filtroCodigo') private filtroCodigoInput!: ElementRef;
  @ViewChild(PermisosInformesComponent) permisosInformes!: PermisosInformesComponent;

  ngxLoadingComponent!: NgxLoadingComponent;

  CodModulo: number = 83
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';

  CodModuloAdmitidos = [82] //Aqui se debe adicionar los nuevos módulos asignados a los informes 
  public filtroBusqueda = '';
  public selectedId: number = 0;
  public selectedIdConfig: number = 0;
  public valEditar: number = 0; //0- agregar 1- editar
  public valueInfSelected = 0;
  public selectedSpConfig: string = "";
  public selectedInfConfig: string = "";
  public OperacionSelect: string = "";
  public TipoDatoSelect: string = "";
  public OpcionSelected: boolean = true;
  public VbleCodigoFiltro: boolean = false;
  public loading: boolean = false;
  public mostrarModal: boolean = false;
  public configuracionInfomesForm!: FormGroup;
  public parametroConfiguracionInfForm!: FormGroup;
  public configuracionInformesDina: any = [];
  public configuracionInformesPred: any = [];
  public configuracionParametrosInformes: any = [];
  public configuracionParametrosInformesNoCoi: any = [];
  public configuracionParametrosInformesTbl: any = [];
  public listasCodigos: any[] = [];
  public listasCodigosFiltrados: any[] = [];
  public unicosPorIdClase: any[] = [];
  public Operaciones: any[] = [];
  tipos: any = [];
  parametros: any = [];
  modulos: any = [];
  selectedRow: any = null;


  constructor(private configuracionInformesS: ConfiguracionInformesService, private notif: ToastrService, private el: ElementRef, private moduleValidationService: ModuleValidationService, private fb: FormBuilder, private operacionesModulosService: OperacionesModulosService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  ngOnInit() {
    this.IrArriba();
    this.getOperaciones();
    this.initForm();
    this.obtenerConfiguracionInformes();
    this.getListas();
    this.listasCodigosFiltrados = [...this.listasCodigos];
  }

  initForm() {
    this.configuracionInfomesForm = this.fb.group({
      idConfiguracion: [{ value: '', disabled: true }],
      nombreInforme: ['', Validators.required],
      nombreSP: ['', Validators.required],
      accionEjecuta: [''],
      idModulo: [0, Validators.required],
      idTipo: [0]
    });

    this.parametroConfiguracionInfForm = this.fb.group({
      nombreParametro: [{ value: '', disabled: true }],
      orden: [0, Validators.required],
      nombreCampo: ['', Validators.required],
      tipoDato: ['', Validators.required],
      tamanoCampo: ['', Validators.required],
      requerido: [false],
      idTipo: [null],
      nombreFiltro: [''],
    })
  }


  selectRow(parametro: any) {
    this.selectedRow = parametro;
    this.configuracionInfomesForm.patchValue({
      idConfiguracion: parametro.IdConfiguracion,
      nombreInforme: parametro.NombreInforme,
      nombreSP: parametro.NombreSP,
      accionEjecuta: parametro.AccionEjecuta,
      idModulo: parametro.IdModulo
    });
  }

  selectRowParam(parametro: any) {
    this.valEditar = 0;

    this.parametroConfiguracionInfForm.patchValue({
      nombreParametro: parametro.NombreParametro,
      tipoDato: parametro.TipoDato,
      tamanoCampo: parametro.TamanoCampo,
      orden: this.calcularOrdenMaximo() + 1
    });

    if (parametro.NombreParametro.trim().toLowerCase().includes('@accion')) {
      this.parametroConfiguracionInfForm.patchValue({
        nombreCampo: 'Reservado'
      });
    }

  }

  calcularOrdenMaximo(): number {
    const ordenes = this.configuracionParametrosInformesTbl.map((item: any) => item.Orden);
    let maximo = Math.max(...ordenes);
    if (ordenes.length <= 0) {
      maximo = -1;
    }
    return maximo;
  }


  selectRowParamTbl(parametro: any) {
    this.valEditar = 1;
    this.parametroConfiguracionInfForm.patchValue({
      nombreParametro: parametro.NombreParametro,
      nombreCampo: parametro.AliasCampo,
      tipoDato: parametro.TipoDato,
      tamanoCampo: parametro.TamanoCampo,
      orden: parametro.Orden,
      requerido: parametro.Requerido,
      idTipo: parametro.IdTipo,
      nombreFiltro: parametro.NombreFiltro
    });

    setTimeout(() => {
      if (parametro.TipoDato.trim().toLowerCase() === 'selectn') {
        this.VbleCodigoFiltro = true;
      } else {
        this.VbleCodigoFiltro = false;
      }
    }, 100);
  }

  deleteRowParamTbl(parametro: any) {
    const parametroDel = parametro.NombreParametro;

    const index = this.configuracionParametrosInformesTbl.findIndex((param: any) => param.NombreParametro === parametroDel);
    if (index !== -1) {
      this.configuracionParametrosInformesTbl.splice(index, 1);
    }

    this.limpiarFormModal(1)

    setTimeout(() => {
      this.configuracionParametrosInformesNoCoi = this.configuracionParametrosInformes.filter((parametro: any) =>
        !this.configuracionParametrosInformesTbl.some((tbl: any) => tbl.NombreParametro == parametro.NombreParametro)
      );
    }, 500);

  }

  configurarParametros(parametro: any) {
    this.selectRow(parametro);
    this.limpiarFormModal(1);
    this.selectedIdConfig = parametro.IdConfiguracion;
    this.selectedSpConfig = parametro.NombreSP;
    this.selectedInfConfig = parametro.NombreInforme;

    this.ShowModalList.nativeElement.click();
    this.obtenerParametrosConfiguracionInformes(parametro.NombreSP);
    this.obtenerParametrosConfiguracionInformesTbl(parametro.IdConfiguracion);

    this.validarExistenciaSP(parametro.NombreSP).subscribe({
      next: (existe) => {
        if (!existe) {
          this.alertaSPInexistente();
        }
      }
    })

    setTimeout(() => {
      this.configuracionParametrosInformesNoCoi = this.configuracionParametrosInformes.filter((parametro: any) =>
        !this.configuracionParametrosInformesTbl.some((tbl: any) => tbl.NombreParametro == parametro.NombreParametro)
      );
    }, 500);

  }

  agregarParametro() {

    if (this.parametroConfiguracionInfForm.valid) {

      const formValue = this.parametroConfiguracionInfForm.getRawValue();

      if (formValue.requerido) {
        formValue.requerido = true;
      } else {
        formValue.requerido = false;
      }

      if (formValue.nombreParametro.trim().toLowerCase().includes('@accion')) {
        formValue.requerido = false;
        formValue.nombreCampo = 'Reservado';
      }

      const mappedValues = {
        NombreParametro: formValue.nombreParametro,
        Orden: formValue.orden,
        AliasCampo: formValue.nombreCampo,
        TipoDato: formValue.tipoDato,
        TamanoCampo: formValue.tamanoCampo,
        Requerido: formValue.requerido,
        IdTipo: formValue.idTipo,
        NombreFiltro: formValue.nombreFiltro
      }

      //Evitar que en el arreglo se puedan duplicar el orden de campos
      const parametroAdd = this.configuracionParametrosInformesTbl.find((op: any) => op.Orden === formValue.orden);

      if (!parametroAdd) {
        if (this.valEditar === 0) {
          const index = this.configuracionParametrosInformesNoCoi.findIndex(
            (param: any) => param.NombreParametro === formValue.nombreParametro
          );

          if (index !== -1) {
            this.configuracionParametrosInformesNoCoi.splice(index, 1);
          }
        }

        this.configuracionParametrosInformesTbl.push(mappedValues);
        this.limpiarFormModal(2);
        this.valEditar = 0;
      } else {
        if (this.valEditar === 0) {
          this.notif.warning(
            "Advertencia", "No se agregó el parámetro, el orden " + formValue.orden + " ya está utilizado.",
            ConfiguracionNotificacion.configRightTop
          );
        } else {
          // Si valEditar es 1, no mostrar advertencia y permitir agregar
          const index = this.configuracionParametrosInformesTbl.findIndex((item: any) => item.NombreParametro === formValue.nombreParametro);

          if (index !== -1) {
            // Si el elemento existe, lo actualizo
            this.configuracionParametrosInformesTbl[index] = mappedValues;
          } else {
            // Si no existe, lo agrego
            this.configuracionParametrosInformesTbl.push(mappedValues);
          }
          this.limpiarFormModal(2);
          this.valEditar = 0;
        }

      }


    } else {
      this.notif.warning("Advertencia", "No se agregó el parámetro, hay campos obligatorios vacíos.", ConfiguracionNotificacion.configRightTop);
    }


  }


  obtenerParametrosConfiguracionInformes(nombreSP: string) {
    this.configuracionInformesS.ObtenerParametrosConfiguracionInformesSP(nombreSP).subscribe({
      next: (respuesta) => {
        this.configuracionParametrosInformes = respuesta;
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
        this.notif.warning("Advertencia", "No se cargó información del procedimiento", ConfiguracionNotificacion.configRightTop);
      }
    });
  }

  obtenerParametrosConfiguracionInformesTbl(idParametro: number) {
    this.configuracionInformesS.ObtenerParametrosConfiguracionInfTbl(idParametro).subscribe({
      next: (respuesta) => {
        this.configuracionParametrosInformesTbl = respuesta;
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
        this.notif.warning("Advertencia", "No se cargó información del procedimiento", ConfiguracionNotificacion.configRightTop);
      }
    });
  }


  obtenerConfiguracionInformes() {
    this.configuracionInformesS.ObtenerConfiguracionInformes().subscribe({
      next: (respuesta) => {

        setTimeout(() => {
          this.configuracionInformesPred = respuesta.filter((config: any) => config.IdTipo === false)
            .map((config: any) => {
              const operacion = this.Operaciones.find(op => op.IdOperacion === config.IdModulo);
              return {
                ...config,
                DescripcionOperacion: operacion ? operacion.Descripcion : 'No encontrada'
              };
            });

          this.configuracionInformesDina = respuesta.filter((config: any) => config.IdTipo === true)
            .map((config: any) => {
              const operacion = this.Operaciones.find(op => op.IdOperacion === config.IdModulo);
              return {
                ...config,
                DescripcionOperacion: operacion ? operacion.Descripcion : 'No encontrada'
              };
            });
        }, 500);
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
      }
    });
  }


  guardarConfiguracionInformes() {
    if (this.valueInfSelected === 1) {
      this.configuracionInfomesForm.patchValue({ idTipo: true });
    } else {
      this.configuracionInfomesForm.patchValue({ idTipo: false });
    }

    this.configuracionInformesS.GuardarConfiguracion(this.configuracionInfomesForm.value).subscribe(
      (respuesta) => {
        this.configuracionInfomesForm.reset();
        this.notif.success('Exitoso', 'Información guardada correctamente', ConfiguracionNotificacion.configRightTopNoClose);
        this.obtenerConfiguracionInformes();
        this.IrAbajo();
      },
      error => {
        let mensaje = 'Ha ocurrido un error inesperado.';
        try {
          if (error && error.Mensaje) {
            mensaje = error.Mensaje;
          }
        } catch (e) {
          console.error('Error al parsear el mensaje del backend:', e);
        }
        this.notif.warning("Advertencia", mensaje, ConfiguracionNotificacion.configRightTop);

      });
  }

  actualizarConfiguracionInformes() {
    if (this.valueInfSelected === 1) {
      this.configuracionInfomesForm.patchValue({ idTipo: true });
    } else {
      this.configuracionInfomesForm.patchValue({ idTipo: false });
    }

    this.configuracionInformesS.ActualizarConfiguracion(this.configuracionInfomesForm.getRawValue()).subscribe(
      (respuesta) => {
        this.notif.success('Exitoso', 'Información actualizada correctamente', ConfiguracionNotificacion.configRightTopNoClose);
        this.configuracionInfomesForm.reset();
        this.obtenerConfiguracionInformes();
        this.IrAbajo();
      },
      error => {
        let mensaje = 'Ha ocurrido un error inesperado.';
        try {
          if (error && error.Mensaje) {
            mensaje = error.Mensaje;
          }
        } catch (e) {
          console.error('Error al parsear el mensaje del backend:', e);
        }
        this.notif.warning("Advertencia", mensaje, ConfiguracionNotificacion.configRightTop);

      });
  }

  getOperaciones() {
    this.operacionesModulosService.ObtenerOperacionesPermitidas(82).subscribe((result) => {
      result.forEach((element: any) => {
        this.Operaciones.push(element);
      });
      this.OpcionSelected = true;
    }, (error) => {
      this.notif.error("Error", error, ConfiguracionNotificacion.configRightTopNoClose);
    });
  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  IrAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }

  selectTipoDato(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.TipoDatoSelect = selectElement.options[selectElement.selectedIndex].text;

    if (this.TipoDatoSelect.trim().toLowerCase() === "selectn") {
      this.VbleCodigoFiltro = true;
    } else {
      this.VbleCodigoFiltro = false;
    }
  }

  limpiarFormModal(i: number) {
    switch (i) {
      case 1:
        this.parametroConfiguracionInfForm.reset();
        this.VbleCodigoFiltro = false;
        break;
      case 2:
        this.parametroConfiguracionInfForm.reset();
        this.valEditar = 0;
        this.VbleCodigoFiltro = false;
        break;
    }
  }


  guardarParametrosConfiguracion() {
    this.configuracionInformesS.GuardarParametrosConfiguracion(this.selectedIdConfig, this.configuracionParametrosInformesTbl).subscribe(
      (respuesta) => {
        this.notif.success('Exitoso', 'Parámetros guardados correctamente', ConfiguracionNotificacion.configRightTopNoClose);
      },
      error => {
        let mensaje = 'Ha ocurrido un error inesperado.';
        try {
          if (error && error.Mensaje) {
            mensaje = error.Mensaje;
          }
        } catch (e) {
          console.error('Error al parsear el mensaje del backend:', e);
        }
        this.notif.warning("Advertencia", mensaje, ConfiguracionNotificacion.configRightTop);

      });
  }

  mostrarListas() {
    this.mostrarModal = true;
  }

  get listasFiltradas() {
    if (!this.filtroBusqueda) {
      return this.listasCodigos;
    }
    //return this.listasCodigos.filter(item =>
    //  Object.values(item).some((value : any) =>
    //    value.toString().toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    //  )
    //);

    return this.listasCodigos.filter(item =>
      item.IdTipo?.toString().toLowerCase() === this.filtroBusqueda.toLowerCase()
    );

  }

  cerrarListas() {
    this.mostrarModal = false;
  }

  getListas() {
    this.loading = true;
    this.configuracionInformesS.ObtenerListas().subscribe({
      next: (respuesta) => {
        this.listasCodigos = respuesta
        this.unicosPorIdClase = Array.from(
          new Map(respuesta.map((item: any) => [item.IdTipo, item])).values()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar parámetros de informes:', err);
        this.loading = false;
      }
    });
  }

  filtrarPorIdTipo() {
    const valor = this.filtroCodigoInput.nativeElement.value;
    const filtro = valor.trim();
    if (filtro) {
      this.listasCodigosFiltrados = this.listasCodigos.filter(item =>
        item.IdTipo.toString().includes(filtro)
      );
    } else {
      this.listasCodigosFiltrados = [...this.listasCodigos];
    }
  }

  opcionInfSelected(e: Event): void {
    const selectElement = e.target as HTMLSelectElement;
    this.valueInfSelected = + selectElement.value;
    this.configuracionInfomesForm.reset();
    this.actualizarValidacionNombreFiltro();
  }

  actualizarValidacionNombreFiltro() {
    const nombreFiltroControl = this.parametroConfiguracionInfForm.get('nombreFiltro');

    if (this.valueInfSelected === 1) {
      nombreFiltroControl?.setValidators([Validators.required]);
    } else {
      nombreFiltroControl?.clearValidators();
    }

    nombreFiltroControl?.updateValueAndValidity();
  }


  deleteConfig(parametro: any) {
    swal.fire({
      title: '<strong> Advertencia </strong>',
      text: '¿Desea eliminar esta configuración y los permisos asociados a este?',
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
        this.eliminarConfiguracionInformes(parametro);
      }
    });
  }



  eliminarConfiguracionInformes(parametro: any) {
    this.selectRow(parametro);
    this.configuracionInformesS.EliminarConfiguracion(this.configuracionInfomesForm.getRawValue()).subscribe(
      (respuesta) => {
        this.notif.success('Exitoso', 'Configuración eliminada correctamente.', ConfiguracionNotificacion.configRightTopNoClose);
        this.obtenerConfiguracionInformes();
      },
      error => {
        let mensaje = 'Ha ocurrido un error inesperado.';
        try {
          if (error && error.Mensaje) {
            mensaje = error.Mensaje;
          }
        } catch (e) {
          console.error('Error al parsear el mensaje del backend:', e);
        }
        this.notif.warning("Advertencia", mensaje, ConfiguracionNotificacion.configRightTop);

      });
  }

  get configuracionInformesFiltrado() {
    return this.valueInfSelected === 0 ? this.configuracionInformesPred : this.configuracionInformesDina;
  }

  validarExistenciaSP(nombreSP: string): Observable<boolean> {
    return this.configuracionInformesS.ValidarExistenciaSP(nombreSP);
  }

  alertaSPInexistente() {
    swal.fire({
      title: '<strong> Adverencia </strong>',
      text: 'El procedimiento almacenado ya no existe en la base de datos, gestione la corrección.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'ok',
      confirmButtonColor: 'rgb(13,165,80)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
    });
  }

}
