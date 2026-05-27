import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PermisosService } from '../../../../../../Services/Maestros/permiso.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacionesModulosService } from '../../../../../../Services/Maestros/operaciones-modulos.service';
import { ConfiguracionNotificacion } from '../../../../../../../environments/config.noticaciones';
import { ConfiguracionInformesService } from '../../../../../../Services/Informes/configuracion-informes.service';
import { InformePerfilService } from '../../../../../../Services/Maestros/informes-perfiles';
import swal from 'sweetalert2';
import { LoadingService } from '../../../../../../Services/shared/loading.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-permisos-informes',
  templateUrl: './permisos-informes.component.html',
  styleUrl: './permisos-informes.component.css',
  standalone: false,
  providers: [PermisosService, OperacionesModulosService, InformePerfilService]
})

export class PermisosInformesComponent implements OnInit {
  @ViewChild('ModalMasivoC', { static: true }) private modalMasivoC!: ElementRef;
  @ViewChild('ModalMasivoCerrar', { static: true }) private modalMasivoCerrar!: ElementRef
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  public dataPerfil: any[] = [];
  public dataModulo: any[] = [];
  public dataInformes: any[] = [];
  public denegadosResult: any[] = [];
  public permitidosResult: any[] = [];
  public ListfilteredPerfiles: any[] = [];

  public selectedRow: any = null;
  public selectedPerfil: any = null;
  public filtro: string = '';
  public selectedPerfilTex: string = '';
  public accion: number = 0;
  public allSelected: boolean = false;

  public permisosForm!: FormGroup;

  constructor(private permisosService: PermisosService, private notif: ToastrService, 
    private operacionesModulosService: OperacionesModulosService,
    private configuracionInformesS: ConfiguracionInformesService, 
    private InformePerfilS: InformePerfilService,
    private loading: LoadingService
  ) { }

  ngOnInit(): void {
    this.validateForm();
    //this.obtenerModulos();
    this.obtenerPerfiles();
  }

  obtenerPerfiles() {
    this.permisosService.getPerfiles().subscribe((result: any) => {
      this.dataPerfil = result.map((item: any) => ({
        ...item,
        selected: false
      }));
      this.ListfilteredPerfiles = [...this.dataPerfil]
    }, (error: any) => {
      const errorMessage = <any>error;
      this.notif.warning('Error', errorMessage);
      console.log(errorMessage);
    });
  }

  obtenerModulos() {
    this.operacionesModulosService.ObtenerOperacionesPermitidas(82).subscribe((result) => {
      result.forEach((element: any) => {
        this.dataModulo.push(element);
      });
    }, (error) => {
      this.notif.error("Error", error, ConfiguracionNotificacion.configRightTopNoClose);
    });
  }

  validateForm() {
    const selectPerfil = new FormControl('', [Validators.required]);
    const itemSelect = new FormControl('', [Validators.required]);
    const selectedItems = new FormControl('', [Validators.required]);

    this.permisosForm = new FormGroup({
      selectPerfil: selectPerfil,
      itemSelect: itemSelect,
      selectedItems: selectedItems
    });
  }

  obtenerInformesPermitidos() {
    this.InformePerfilS.ObtenerInformesPermitidosP(this.selectedPerfil).subscribe({
      next: (respuesta) => {
        this.permitidosResult = respuesta;
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
      }
    });
  }

  obtenerInformesDenegados() {
    this.InformePerfilS.ObtenerInformesDenegadosP(this.selectedPerfil).subscribe({
      next: (respuesta) => {
        this.denegadosResult = respuesta;
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
      }
    });
  }

  onPerfilChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;

    this.selectedPerfilTex = selectedText.toLowerCase();
    this.selectedPerfil = + selectElement.value;
    setTimeout(() => {
      this.obtenerInformesDenegados();
      this.obtenerInformesPermitidos();
    }, 100);
  }

  selectRow(parametro: any, accion: number) {
    this.accion = accion;
    this.selectedRow = parametro;
  }

  AdicionarInfInd() {
    if (this.accion !== 1) {
      this.notif.warning('Advertencia', 'Debe seleccionar un informe válido.', ConfiguracionNotificacion.configRightTopNoClose);
      return;
    }
    this.InformePerfilS.AdicionarAccesoInfo(this.selectedRow).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion = 0;
        this.notif.success('Exitoso', 'Permiso adicionado correctamente', ConfiguracionNotificacion.configRightTopNoClose);
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


  AdicionarInfMas() {
    this.InformePerfilS.AdicionarAccesoInfoMas(this.denegadosResult).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion = 0;
        this.notif.success('Exitoso', 'Permisos adicionados correctamente', ConfiguracionNotificacion.configRightTopNoClose);
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

  EliminarInfMas() {
    this.InformePerfilS.EliminarAccesoInfoMas(this.permitidosResult).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion = 0;
        this.notif.success('Exitoso', 'Permisos eliminados correctamente', ConfiguracionNotificacion.configRightTopNoClose);
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

  EliminarInfInd() {
    if (this.accion !== 2) {
      this.notif.warning('Advertencia', 'Debe seleccionar un informe válido.', ConfiguracionNotificacion.configRightTopNoClose);
      return;
    }
    this.InformePerfilS.EliminarAccesoInfo(this.selectedRow).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion = 0;
        this.notif.success('Exitoso', 'Permiso eliminado correctamente', ConfiguracionNotificacion.configRightTopNoClose);
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

  modificarMasivo(opcion: string) {
    if ((opcion === 'adicionar' && this.accion !== 1) || (opcion === 'eliminar' && this.accion !== 2)) {
      this.notif.warning('Advertencia', 'Debe seleccionar un informe válido.', ConfiguracionNotificacion.configRightTopNoClose);
      return;
    }
    swal.fire({
      title: '<strong>Advertencia</strong>',
      text: '¿Desea ' + opcion + ' todos los informes al perfil seleccionado?',
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
        if (opcion === 'adicionar') {
          this.AdicionarInfMas();
        } else if (opcion === 'eliminar') {
          this.EliminarInfMas();
        }
      }
    });
  }

  CopiarInfInd() {
    if(!(this.selectedPerfil > 0)){
      this.notif.warning('Advertencia', 'Debe seleccionar un perfil para obtener la configuración actual.', ConfiguracionNotificacion.configRightTop);
    }else{
      this.modalMasivoC.nativeElement.click();
    }
  }

  toggleAllCheckboxes() {
    this.ListfilteredPerfiles.forEach(p => p.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.dataPerfil.every(p => p.selected);
    this.filtrarLista();
  }

  filtrarLista() {
    const filtroLower = this.filtro.toLowerCase();
    this.ListfilteredPerfiles = this.dataPerfil.filter(item =>
      item.selected || item.Nombre.toLowerCase().includes(filtroLower)
    );
  }

  actualizarPerfiles(){
        // Obtener columnas seleccionadas por el usuario
        const columnasSeleccionadas = this.ListfilteredPerfiles
        .filter(col => col.selected)
        .map(col => col.IdPerfil);
        console.log(columnasSeleccionadas);

      if (columnasSeleccionadas.length === 0) {
        this.notif.warning('Advertencia', 'Debe seleccionar al menos un perfil para aplicar la configuración.', ConfiguracionNotificacion.configRightTop);
        this.loading.hide();
        return;
      }

      swal.fire({
        title: '<strong> Advertencia </strong>',
        text: 'Esta opción eliminará los permisos actuales de los perfiles seleccionados y aplicará la configuración del perfil '+ this.selectedPerfilTex+'. ¿Desea continuar?',
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
          this.copiarPermisoInformes(columnasSeleccionadas);
          this.allSelected = false;
          this.modalMasivoCerrar.nativeElement.click();
        }
      });

  }

  copiarPermisoInformes(columnasSeleccionadas: any){
    this.loading.show();
    this.InformePerfilS.CopiarPermisosInformes(columnasSeleccionadas, this.selectedPerfil).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion = 0;
        this.loading.hide();
        this.notif.success('Exitoso', 'Permisos actualizados correctamente', ConfiguracionNotificacion.configRightTopNoClose);
      },
      error => {
        this.loading.hide();
        let mensaje = 'Ha ocurrido un error inesperado.';
        try {
          if (error && error.Mensaje) {
            mensaje = error.Mensaje;
          }
        } catch (e) {
        this.loading.hide();
          console.error('Error al parsear el mensaje del backend:', e);
        }
        this.notif.warning("Advertencia", mensaje, ConfiguracionNotificacion.configRightTop);

      });
  }

}
