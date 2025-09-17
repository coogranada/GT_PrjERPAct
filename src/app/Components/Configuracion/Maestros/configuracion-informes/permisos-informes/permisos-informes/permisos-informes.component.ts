import { Component, OnInit, ViewChild } from '@angular/core';
import { PermisosService } from '../../../../../../Services/Maestros/permiso.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { OperacionesModulosService } from '../../../../../../Services/Maestros/operaciones-modulos.service';
import { ConfiguracionNotificacion } from '../../../../../../../environments/config.noticaciones';
import { ConfiguracionInformesService } from '../../../../../../Services/Informes/configuracion-informes.service';
import { InformePerfilService } from '../../../../../../Services/Maestros/informes-perfiles';
import swal from 'sweetalert2';
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
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;

  public dataPerfil : any[] = [];
  public dataModulo : any[] = [];
  public dataInformes : any[] = [];
  public denegadosResult : any[] = [];
  public permitidosResult : any[] = [];

  public selectedRow: any = null;
  public selectedPerfil: any = null;
  public accion: number = 0;


  public permisosForm!: FormGroup;

  constructor(private permisosService: PermisosService, private notif: ToastrService, private operacionesModulosService: OperacionesModulosService,
              private configuracionInformesS: ConfiguracionInformesService, private InformePerfilS : InformePerfilService
  ){}

  ngOnInit(): void {
    this.validateForm();
    //this.obtenerModulos();
    this.obtenerPerfiles();
  }

  obtenerPerfiles() {
    this.permisosService.getPerfiles().subscribe((result :any) => {
        this.dataPerfil = result;
      },(error : any) => {
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
    const itemSelect = new FormControl('', [ Validators.required ]);
    const selectedItems = new FormControl('', [ Validators.required ]);

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

  onPerfilChange(event: Event){
    this.selectedPerfil = + (event.target as HTMLSelectElement).value;
    setTimeout(() => {
      this.obtenerInformesDenegados();
      this.obtenerInformesPermitidos();
    }, 100);
  }

  selectRow(parametro: any, accion: number) {
    this.accion = accion;
    this.selectedRow = parametro;
  }

  AdicionarInfInd(){
    if(this.accion !== 1){
      this.notif.warning('Advertencia', 'Debe seleccionar un informe válido.', ConfiguracionNotificacion.configRightTopNoClose);
      return;
    }
    this.InformePerfilS.AdicionarAccesoInfo(this.selectedRow).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion=0;
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


  AdicionarInfMas(){
    this.InformePerfilS.AdicionarAccesoInfoMas(this.denegadosResult).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion=0;
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

  EliminarInfMas(){
    this.InformePerfilS.EliminarAccesoInfoMas(this.permitidosResult).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion=0;
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

  EliminarInfInd(){
    if(this.accion !== 2){
      this.notif.warning('Advertencia', 'Debe seleccionar un informe válido.', ConfiguracionNotificacion.configRightTopNoClose);
      return;
    }
    this.InformePerfilS.EliminarAccesoInfo(this.selectedRow).subscribe(
      (respuesta) => {
        this.obtenerInformesDenegados();
        this.obtenerInformesPermitidos();
        this.accion=0;
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

modificarMasivo(opcion: string ){
  if((opcion === 'adicionar' && this.accion !== 1) || (opcion === 'eliminar' && this.accion !== 2)){
    this.notif.warning('Advertencia', 'Debe seleccionar un informe válido.', ConfiguracionNotificacion.configRightTopNoClose);
    return;
  }
  swal.fire({
    title: '<strong> ¿Desea '+ opcion +' todos los informes al perfil seleccionado? </strong>',
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
      if(opcion === 'adicionar'){
        this.AdicionarInfMas();
      }else if (opcion === 'eliminar'){
        this.EliminarInfMas();
      }
    }
  });
}


}
