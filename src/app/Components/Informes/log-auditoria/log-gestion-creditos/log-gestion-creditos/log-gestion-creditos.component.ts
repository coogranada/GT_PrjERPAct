import { Component, ElementRef, ViewChild } from '@angular/core';
import { InformeClientesService } from '../../../../../Services/Informes/informe-clientes.service';
import { TablaVirtualComponent } from '../../../../Tabla-virtual/tabla-virtual/tabla-virtual.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filtro } from '../../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { AlertService } from '../../../../../Services/Alert/alert.service';
import { ConfiguracionInformesService } from '../../../../../Services/Informes/configuracion-informes.service';
import { ExceljsService } from '../../../../../Services/General/exceljs.service';
import { LoadingService } from '../../../../../Services/shared/loading.service';
import { InformeLogService } from '../../../../../Services/Informes/informe-log.service';
import Swal from 'sweetalert2';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';

@Component({
  selector: 'app-log-gestion-creditos',
  standalone: false,
  providers: [InformeClientesService],
  templateUrl: './log-gestion-creditos.component.html',
  styleUrl: './log-gestion-creditos.component.css'
})
export class LogGestionCreditosComponent {

  @ViewChild(TablaVirtualComponent) tablaVirtual!: TablaVirtualComponent;
  @ViewChild('ShowModalList', { static: true }) private ShowModalList!: ElementRef;

  public ListColumnasInf: any[] = [];
  public ListfilteredColumnasInf: any[] = [];
  public selectedAll: boolean = false;
  public btnMore: boolean = false;

  public resultOperaciones: any[] = [];
  private dataUser: any;
  public codModulo: number = 45;

  public formulario!: FormGroup;
  public progreso: number = 0;
  public intervaloProgreso: any;

  public resultadoInforme: any[] = [];
  public encabezados: any[] = [];

  public filtrosAgregado: any[] = [];
  public Filtros: Filtro[] = [];

  public ListOficina: any[] = [];
  public ListOficinas: any[] = [];

  public nombreOficina: string = "";
  public idOficina: number = 0;

  public filtroSelect: number = 0;

  public tituloGenerico: string = "";
  public alertGenerico: string = "";
  public SelectedNombre: string = "";

  constructor(
    private notif: AlertService,
    private configuracionInformesS: ConfiguracionInformesService,
    private fb: FormBuilder,
    private excelReportService: ExceljsService,
    private loading: LoadingService,
    private serviceLogs: InformeLogService,
    private informeClientesService: InformeClientesService,
    private operacionesService: OperacionesService,
  ) { }

  ngOnInit(): void {
    this.getListaColumnas();
    this.getOficina();
    this.getOficinas();
    this.loadOperaciones();

    this.formulario = this.fb.group({
      '@FechaInicial': [null, Validators.required],
      '@FechaFinal': [null, Validators.required],
      '@IdOficina': [0],
      '@Usuario': [''],
      '@Cuenta': [''],
      '@Operacion': ['']
    });

    this.Filtros = this.serviceLogs.GetFiltrosGestionCreditos();
  }

  getOficina() {
    let datas = localStorage.getItem("Data");
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    this.idOficina = Number(resultDataStore.NumeroOficina);
    this.nombreOficina = resultDataStore.Oficina;
  }

  getOficinas() {
    this.loading.show();
    this.informeClientesService.getOficinas().subscribe(x => {
      this.ListOficinas = x;
      this.ListOficinas.forEach(x => x.descri = x.Descripcion);
      this.ListOficinas.forEach(x => x.id = Number(x.Valor));
      this.ListOficina = this.ListOficinas;
      this.loading.hide();
    });
  }

  ejecutarSP(origen: boolean) {

    if (this.formulario.invalid) {
      this.notif.onWarning('Advertencia', 'Debe diligenciar los campos obligatorios.');
      return;
    }


    const columnasSeleccionadas =
      this.ListfilteredColumnasInf.filter(x => x.selected);

    if (columnasSeleccionadas.length === 0) {
      this.notif.onWarning(
        'Advertencia',
        'Debe seleccionar al menos un campo para generar el informe.'
      );
      return;
    }

    const data: any = {};

    this.filtrosAgregado.forEach(f => { data[f.NombreParametro] = f.idValue; });

    data['@FechaInicial'] = this.formulario.value['@FechaInicial'];
    data['@FechaFinal'] = this.formulario.value['@FechaFinal'];

    this.mostrarModalProgreso();

    this.configuracionInformesS
      .EjecutarInforme('ERP_SPInfGestionCreditos', '', data)
      .subscribe({
        next: (respuesta) => {

          this.ocultarModalProgreso();

          if (!respuesta || respuesta.length === 0) {
            this.notif.onWarning(
              'Advertencia', 'No se encontraron datos para mostrar, verifique los filtros.'
            );
            return;
          }

          const columnasSeleccionadas = this.ListfilteredColumnasInf
            .filter(col => col.selected)
            .map(col => col.name);

          this.resultadoInforme = respuesta.map((fila: any) => {

            const filaFiltrada: any = {};

            columnasSeleccionadas.forEach(col => {

              if (fila.hasOwnProperty(col)) {

                filaFiltrada[col] =
                  col === 'JSON'
                    ? this.formatearJson(fila[col])
                    : fila[col];
              }

            });

            return filaFiltrada;
          });

          this.encabezados = columnasSeleccionadas;

          this.ModalCantidadRegistros(
            this.resultadoInforme.length,
            origen
          );
        },

        error: (error) => {

          this.ocultarModalProgreso();

          let mensaje = 'Ha ocurrido un error inesperado.';

          try {
            if (error && error.Mensaje) {
              mensaje = error.Mensaje;
            }
          } catch (e) {
            console.error('Error al obtener el mensaje:', e);
          }

          this.notif.onWarning(
            'Advertencia',
            mensaje
          );
        }
      });
  }

  formatearJson(valor: any): string {
    try {
      return JSON.stringify(JSON.parse(valor), null, 2);
    } catch {
      return valor;
    }
  }

  mostrarModalProgreso() {
    this.progreso = 0;
    ($('#ModalProgressBar') as any).modal('show');

    this.intervaloProgreso = setInterval(() => {
      if (this.progreso < 95) this.progreso += 1;
    }, 100);
  }

  ocultarModalProgreso() {
    clearInterval(this.intervaloProgreso);
    this.progreso = 100;
    setTimeout(() => ($('#ModalProgressBar') as any).modal('hide'), 500);
  }

  ModalCantidadRegistros(Cant: number, idDownload: boolean) {

    if (Cant === 0) {
      this.notif.onWarning(
        'Advertencia',
        'No se encuentran registros'
      );
      return;
    }

    Swal.fire({
      imageUrl: 'https://www.pgro.org/images/shop/more/493x500_700_121fd5db7d62d33519e2e6bf96d156a3_1618820954excel.png',
      imageWidth: 50,
      imageHeight: 50,
      imageAlt: 'Excel',
      title: 'El número de registros es: ' + Cant,
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      cancelButtonColor: '#852662',
      confirmButtonColor: '#269051',
      cancelButtonText: 'Cerrar',
      confirmButtonText: idDownload ? 'Descargar' : 'Ver Lista'
    }).then((result) => {

      if (result.value) {

        setTimeout(() => {

          if (idDownload) {
            this.exportarExcel2();
          } else {
            this.ShowModalList.nativeElement.click();
          }

        }, 300);

      }

    });
  }

  exportarExcel2() {
    this.excelReportService.exportAsExcelFile(this.resultadoInforme, 'GestionCreditos');
  }

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 10) {
      this.tablaVirtual.loadMore();
    }
  }

  onModalCerrar() {
    this.resultadoInforme = [];
  }

  getListaColumnas() {
    this.configuracionInformesS.ListarColumnas('ERP_SPInfGestionCreditos')
      .subscribe({
        next: (respuesta) => {
          this.ListColumnasInf = respuesta.map((item: any) => ({
            ...item,
            selected: false,
            displayName: item.name?.replace(/_M$/, '')
          }));
          this.ListfilteredColumnasInf = [...this.ListColumnasInf];
        },
        error: () => {
          this.notif.onWarning('Advertencia', 'Error al cargar columnas');
        }
      });
  }

  SeleccionaTodoCampos(index: number): void {
    if (index === -1) {
      this.selectedAll = !this.selectedAll;

      this.ListfilteredColumnasInf.forEach(c => {
        c.selected = this.selectedAll;
      });

      return;
    }

    const todos = this.ListfilteredColumnasInf.every(c => c.selected);
    this.selectedAll = todos;
  }

  obtenerFiltro() {
    switch (this.filtroSelect.toString()) {
      case "1":
        this.tituloGenerico = "Fecha:";
        break;
      case "2":
        this.tituloGenerico = "Operación:";
        break;
      case "3":
        this.tituloGenerico = "Oficina:";
        break;
      case "4":
        this.tituloGenerico = "Usuario:";
        break;
      case "5":
        this.tituloGenerico = "Cuenta:";
        break;
    }
  }

  MostrarPanel() {

    let temp = this.filtrosAgregado.find(
      x => x.idFiltro == this.filtroSelect
    );

    if (temp) {
      this.notif.onWarning('Advertencia', 'Filtro ya existe.');
      this.limpiarSelected();
      return;
    }

    // OPERACIÓN
    if (this.filtroSelect == 2) {

      const operacion = this.formulario.get('@Operacion')?.value;

      if (!operacion) return;

      const descripcion =
        this.resultOperaciones.find(
          x => x.ERP_tblOperacion.IdOperacion == operacion
        )?.ERP_tblOperacion.Descripcion ?? operacion;

      this.AddFiltro(
        2,
        operacion,
        'Operación:',
        descripcion,
        '',
        'Es Igual',
        '@Operacion'
      );

      this.limpiarSelected();
    }

    // OFICINA
    if (this.filtroSelect == 3) {
      const idOficina = this.formulario.get('@IdOficina')?.value;
      if (!idOficina) return;

      this.AddFiltro(
        3,
        idOficina,
        'Oficina:',
        idOficina,
        '',
        'Es Igual',
        '@IdOficina'
      );

      this.limpiarSelected();
    }

    // USUARIO
    if (this.filtroSelect == 4) {
      const usuario = this.formulario.get('@Usuario')?.value;
      if (!usuario) return;
      this.validarUsuario();
      return;
    }

    // CUENTA
    if (this.filtroSelect == 5) {
      const cuenta = this.formulario.get('@Cuenta')?.value;
      if (!cuenta) return;
      const partes = cuenta.split('-');

      if (partes.length !== 4) {
        this.notif.onWarning('Advertencia', 'Debe ingresar la cuenta en su formato.');
        return;
      }

      this.AddFiltro(
        5,
        cuenta,
        'Cuenta:',
        cuenta,
        '',
        'Es Igual',
        '@Cuenta'
      );

      this.limpiarSelected();
    }
  }

  AddFiltro(id: number, value: any, nombre: string,
    valorIni: string, valorFin: string,
    val: string, param: string) {

    this.filtrosAgregado.push({
      idFiltro: id,
      idValue: value,
      NombreFiltro: nombre,
      ValorInicial: valorIni,
      ValorFinal: valorFin,
      Validacion: val,
      NombreParametro: param
    });
  }

  formatearValor = (valor: any, columna?: string): string => {

    if (columna === 'JSON') {
      try {
        return JSON.stringify(JSON.parse(valor), null, 2);
      } catch {
        return valor;
      }
    }

    if (typeof valor === 'string' && valor.includes('T')) {
      const fecha = new Date(valor);
      return fecha.toLocaleString();
    }

    return valor ?? '';
  }

  EliminarFiltro(item: any) {
    this.filtrosAgregado =
      this.filtrosAgregado.filter(f => f.idFiltro !== item.idFiltro);
  }

  loadOperaciones() {
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    const arrayExample = [{
      'IdModulo': this.codModulo,
      'IdUsuario': this.dataUser.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.dataUser.idPerfilUsuario
    }];
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {
        this.resultOperaciones = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  mostrarBotones(): boolean {
    if (
      this.filtroSelect == 1 &&
      this.formulario.controls['@FechaInicial'].valid &&
      this.formulario.controls['@FechaFinal'].valid
    ) {
      return true;
    }
    return this.filtrosAgregado.length > 0;
  }

  limpiarSelected() {
    this.filtroSelect = 0;
    this.tituloGenerico = "";
    this.alertGenerico = "";

    this.formulario.get('@IdOficina')?.setValue(0);
    this.formulario.get('@Usuario')?.reset();
    this.formulario.get('@Cuenta')?.reset();
    this.formulario.get('@Operacion')?.reset();
  }

  validarUsuario() {
    this.loading.show();
    const usuario = this.formulario.get('@Usuario')?.value;
    this.informeClientesService.ValidatUsuario(usuario)
      .subscribe(
        x => {
          if (x.dataBool) {
            this.SelectedNombre = x.data;
            this.AddFiltro(
              4,
              this.SelectedNombre,
              'Usuario:',
              this.SelectedNombre,
              '',
              'Es Igual',
              '@Usuario'
            );
            this.limpiarSelected();
          } else {
            this.notif.onWarning('Advertencia', 'El usuario no existe en el sistema, valide el valor ingresado.');
          }
          this.loading.hide();

        },
        err => {
          this.loading.hide();
          this.notif.onWarning('Advertencia', 'Error al validar el usuario.');
        }
      );
  }
}
