import { Component, ElementRef, ViewChild } from '@angular/core';
import { InformeClientesService } from '../../../../Services/Informes/informe-clientes.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionInformesService } from '../../../../Services/Informes/configuracion-informes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from "sweetalert2";
import { TablaVirtualComponent } from '../../../Tabla-virtual/tabla-virtual/tabla-virtual.component';
import { ShareComponentModule } from '../../../../Modules/share-component.module';
import { ExceljsService } from '../../../../Services/General/exceljs.service';
import { LoadingService } from '../../../../Services/shared/loading.service';
import { AlertService } from '../../../../Services/Alert/alert.service';
import { Filtro } from '../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { InformeLogService } from '../../../../Services/Informes/informe-log.service';

@Component({
  selector: 'app-log-recaudo-olivos',
  templateUrl: './log-recaudo-olivos.component.html',
  styleUrl: './log-recaudo-olivos.component.css',
  providers: [InformeClientesService, ShareComponentModule],
  standalone: false
})
export class LogRecaudoOlivosComponent {

  @ViewChild(TablaVirtualComponent) tablaVirtual!: TablaVirtualComponent;
  @ViewChild('ShowModalList', { static: true }) private ShowModalList!: ElementRef;

  public nombreOficina: string = "";
  public tituloGenerico: string = "";
  public alertGenerico: string = "";
  public strInput: string = "";
  public SelectedNombre: string = "";
  public formulario!: FormGroup;
  public progreso: number = 0;
  public idOficina: number = 0;
  public filtroSelect: number = 0;
  public intervaloProgreso: any;
  public ListGenerico: any[] = [];
  public ListOficina: any[] = [];
  public ListColumnasInf: any[] = [];
  public ListfilteredColumnasInf: any[] = [];
  public ListOficinas: any[] = [];
  public resultadoInforme: any[] = [];
  public encabezados: any[] = [];
  public filtrosAgregado: any[] = [];
  Filtros: Filtro[] = [];
  public btnMore: boolean = false;
  public selectedAll: boolean = false;

  constructor(private notif: AlertService, private configuracionInformesS: ConfiguracionInformesService, private fb: FormBuilder, private excelReportService: ExceljsService, private loading: LoadingService, private serviceLogs: InformeLogService, private informeClientesService: InformeClientesService) { }

  ngOnInit(): void {

    this.getListaColumnas();
    this.getOficina(); //Captura oficina actual
    this.getOficinas(); // Obtiene listado de oficinas

    this.formulario = this.fb.group({
      '@FechaInicial': [null, Validators.required],
      '@FechaFinal': [null, Validators.required],
      '@IdOficina': [0],
      '@Usuario': ['']
    });

    this.InitFiltros();

  }

  getOficina() {
    let datas = localStorage.getItem("Data");
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    this.idOficina = Number(resultDataStore.NumeroOficina);
    this.nombreOficina = resultDataStore.Oficina;
  }

  SeleccionaTodoCampos(index: number): void {
    if (index === -1) {
      this.selectedAll = !this.selectedAll;

      this.ListfilteredColumnasInf.forEach(campo => {
        campo.selected = this.selectedAll;
      });

      return;
    }

    const todosSeleccionados = this.ListfilteredColumnasInf
      .every(campo => campo.selected === true);

    this.selectedAll = todosSeleccionados;
  }

  getListaColumnas() {
    this.configuracionInformesS.ListarColumnas('ERP_SPInfRecaudoOlivos').subscribe({
      next: (respuesta) => {
        this.ListColumnasInf = respuesta.map((item: any) => ({
          ...item,
          selected: false,
          displayName: item.name?.replace(/_M$/, '')
        }));
        this.ListfilteredColumnasInf = [...this.ListColumnasInf]
      },
      error: (err) => {
        this.notif.onWarning('Advertencia', 'Error al cargar las columnas del informe:');
        console.error('Error al cargar las columnas del informe:', err);
      }
    });
  }

  ejecutarSP(origen: boolean): void {
    if (this.formulario.invalid) {
      this.notif.onWarning('Advertencia', 'Debe diligenciar los campos obligatorios.');
      return;
    }
    const columnasSeleccionadas = this.ListfilteredColumnasInf
      .filter(col => col.selected)
      .map(col => col.name);
    if (columnasSeleccionadas.length === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar al menos un campo para generar el informe.');
      return;
    }

    if (this.idOficina != 3) {
      const existeFiltroOficina = this.filtrosAgregado.some(
        f => f.NombreParametro === '@IdOficina'
      );

      if (!existeFiltroOficina) {
        this.AddFiltro(
          3,
          this.idOficina,
          'Oficina:',
          this.getDescripcionOficina(this.idOficina),
          '',
          'Es Igual',
          '@IdOficina'
        )
      }

    }

    const data: any = {};

    this.filtrosAgregado.forEach(f => {
      data[f.NombreParametro] = f.idValue;
    });

    data['@FechaInicial'] = this.formulario.get('@FechaInicial')?.value;
    data['@FechaFinal'] = this.formulario.get('@FechaFinal')?.value;

    this.mostrarModalProgreso();
    try {
      this.configuracionInformesS
        .EjecutarInforme('ERP_SPInfRecaudoOlivos', '', data)
        .subscribe(respuesta => {
          this.ocultarModalProgreso();
          if (respuesta.length <= 0) {
            this.notif.onWarning('Advertencia', 'No se encontraron datos para mostrar, verifique los filtros.');
            return;
          }
          if (respuesta && respuesta.length > 0) {


            this.resultadoInforme = respuesta.map((fila: any) => {
              const filaFiltrada: any = {};

              columnasSeleccionadas.forEach(col => {
                if (fila.hasOwnProperty(col)) {
                  filaFiltrada[col] = fila[col];
                }
              });

              return filaFiltrada;
            });

            this.encabezados = columnasSeleccionadas;

            this.ModalCantidadRegistros(respuesta.length, origen);
          }
          return;
        },
          error => {
            this.ocultarModalProgreso();
            let mensaje = 'Ha ocurrido un error inesperado.';
            try {
              if (error && error.Mensaje) {
                mensaje = error.Mensaje;
              }
            } catch (e) {
              console.error('Error al parsear el mensaje del backend:', e);
            }
            this.notif.onWarning("Advertencia", mensaje);
          }
        );
    } catch (error) {
      console.log("error obtener datos: " + error)
      this.notif.onWarning('Advertencia', 'Ha ocurrido un problema en la ejecución: ' + error);
    }
  }

  mostrarModalProgreso() {
    this.progreso = 0;
    ($('#ModalProgressBar') as any).modal('show');

    this.intervaloProgreso = setInterval(() => {
      if (this.progreso < 95) {
        this.progreso += 1;
      }
    }, 100)
  }

  ocultarModalProgreso() {
    clearInterval(this.intervaloProgreso);
    this.progreso = 100;

    setTimeout(() => {
      ($('#ModalProgressBar') as any).modal('hide');
    }, 500);

  }

  ModalCantidadRegistros(Cant: number, idDowload: boolean) {
    if (Cant == 0) {
      this.notif.onWarning('Advertencia', 'No se encuentran registros');
      return;
    }
    Swal.fire({
      imageUrl: 'https://www.pgro.org/images/shop/more/493x500_700_121fd5db7d62d33519e2e6bf96d156a3_1618820954excel.png',
      imageWidth: 50,
      imageHeight: 50,
      imageAlt: 'Custom image',
      title: 'El número de registros es: ' + Cant,
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      cancelButtonColor: "#852662",
      confirmButtonColor: "#269051",
      cancelButtonText: "Cerrar",
      confirmButtonText: idDowload == true ? "Descargar" : "Ver Lista"
    }).then((result) => {
      if (result.value) {

        setTimeout(() => {
          if (idDowload) {
            this.exportarExcel2()
          } else {
            this.ShowModalList.nativeElement.click();
          }
        }, 300);
      }
    });
  }

  onModalCerrar() {
    this.resultadoInforme = [];
  }

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    if (nearBottom) {
      this.tablaVirtual.loadMore();
    }
  }

  formatearValor = (valor: any, columna?: string): string => {

    if (columna && columna.endsWith('_M')) {
      const numero = Number(valor);
      if (!isNaN(numero)) {
        return numero.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      return valor;
    }


    if (typeof valor === 'string' && this.esFechaISO(valor)) {
      const fecha = new Date(valor);
      return `${fecha.getFullYear()}/${this.pad(fecha.getMonth() + 1)}/${this.pad(fecha.getDate())} ${this.pad(fecha.getHours())}:${this.pad(fecha.getMinutes())}:${this.pad(fecha.getSeconds())}`;
    }

    return valor !== null && valor !== undefined ? String(valor) : '';
  }

  esFechaISO(valor: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(valor);
  }

  pad(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }

  exportarExcel2() {
    // this.loading.show();


    var data = null;
    if (!this.resultadoInforme || this.resultadoInforme.length === 0) {
      //this.loading.hide(); ;
      this.notif.onWarning('Advertencia', 'No hay información para exportar.');
    } else {
      data = this.resultadoInforme.map(row => {
        return Object.keys(row)
          .reduce((obj, key) => {
            const newkey = key.replace('_M', '');

            const valor = row[key];
            if (typeof valor === 'string' && valor.includes('T') && !isNaN(Date.parse(valor))) {
              (obj as { [key: string]: unknown })[newkey] = this.formatearValor(valor);
            } else {
              (obj as { [key: string]: unknown })[newkey] = valor;
            }

            return obj;
          }, {});


      });
      this.excelReportService.exportAsExcelFile(data, 'Recaudo olivos')
      //this.loading.hide(); ;
    }
  }

  InitFiltros() {
    this.Filtros = this.serviceLogs.GetFiltrosRecaudoOlivos();
    if (this.idOficina != 3)
      this.Filtros = this.Filtros.filter(x => x.idFiltro != 3);
  }

  obtenerFiltro() {
    switch (this.filtroSelect.toString()) {
      case "1":
        break;
      case "3":
        this.tituloGenerico = "Oficina: ";
        this.alertGenerico = "La oficina es obligatoria."
        break;
      case "4":
        this.tituloGenerico = "Usuario: ";
        this.alertGenerico = "El usuario es obligatorio."
        break;
    }
  }

  getOficinas() {
    this.loading.show();
    this.informeClientesService.getOficinas().subscribe(x => {
      this.ListOficinas = x;
      this.ListOficinas.forEach(x => x.descri = x.Descripcion);
      this.ListOficinas.forEach(x => x.id = Number(x.Valor));
      this.ListOficina = this.ListOficinas;
      this.loading.hide();
    }, err => {
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.onDanger("Error al consultar", errorMessage);
      console.log(err)
    })
  }

  MostrarPanel() {
    let temp: any = this.filtrosAgregado.filter(x => x.idFiltro == this.filtroSelect)[0];
    if (temp) {
      this.notif.onWarning('Advertencia', 'Filtro seleccionado ya existe');
      this.limpiarSelected();
      return;
    }
    let s: number = this.filtroSelect;
    if (s == 4) {
      this.validar();
      this.limpiarSelected();
    } else if (s == 3) {
      const idOficina = this.formulario.get('@IdOficina')?.value;
      if (!idOficina || idOficina == 0) return;
      this.AddFiltro(this.filtroSelect, idOficina, this.tituloGenerico, this.getDescripcionOficina(idOficina), "", "Es Igual", "@IdOficina");
      this.limpiarSelected();
    }
  }

  private getDescripcionOficina(id: number): string {
    return this.ListOficina.find(x => x.id == id)?.descri ?? '';
  }

  AddFiltro(
    id: number,
    value: any,
    nombreF: string,
    valorInicial: string,
    valorFinal: string,
    validacion: string,
    nombreParametro: string
  ) {
    const newRegistro = {
      idFiltro: id,
      idValue: value,
      NombreFiltro: nombreF,
      ValorInicial: valorInicial,
      ValorFinal: valorFinal,
      Validacion: validacion,
      NombreParametro: nombreParametro
    };

    this.filtrosAgregado.push(newRegistro);
    this.strInput = "";
  }

  EliminarFiltro(item: any) {
    this.filtrosAgregado = this.filtrosAgregado.filter(
      f => f.idFiltro !== item.idFiltro
    );
  }

  limpiarSelected() {
    this.btnMore = false;
    this.filtroSelect = 0;
    this.ListGenerico = [];
    this.tituloGenerico = "";
    this.alertGenerico = "";
    this.formulario.get('@IdOficina')?.reset();
    this.formulario.get('@Usuario')?.reset();

  }

  validar() {
    this.loading.show();
    let temp: any = null;
    const usuario = this.formulario.get('@Usuario')?.value;
    this.informeClientesService.ValidatUsuario(usuario).subscribe(x => {
      temp = x;
      if (x.dataBool) {
        this.SelectedNombre = x.data;
        this.AddFiltro(4, this.SelectedNombre, "Usuario:", this.SelectedNombre, "", "Es Igual", "@Usuario");
        this.limpiarSelected();
      }
      else {
        this.notif.onWarning("Advertencia", "El usuario no existe en el sistema, valide el valor ingresado.");
        this.strInput = "";
        this.btnMore = false;
      }
      this.loading.hide();
    }, err => {
      this.loading.hide();
      const errorMessage = <any>err;
      this.notif.onDanger("Error al consultar", errorMessage);
      console.log(err)
    })
  }




}
