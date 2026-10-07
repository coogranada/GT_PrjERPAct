import { Component, ElementRef, ViewChild } from '@angular/core';
import { InformeClientesService } from '../../../../../Services/Informes/informe-clientes.service';
import { TablaVirtualComponent } from '../../../../Tabla-virtual/tabla-virtual/tabla-virtual.component';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Filtro } from '../../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { AlertService } from '../../../../../Services/Alert/alert.service';
import { ConfiguracionInformesService } from '../../../../../Services/Informes/configuracion-informes.service';
import { ExceljsService } from '../../../../../Services/General/exceljs.service';
import { LoadingService } from '../../../../../Services/shared/loading.service';
import { InformeLogService } from '../../../../../Services/Informes/informe-log.service';
import Swal from 'sweetalert2';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { CuentaService } from '../../../../../Services/Generics/resultado-cuenta.service';
import { StorageSecurity } from '../../../../../utils/storage-security.util';

@Component({
  selector: 'app-log-gestion-cartera',
  standalone: false,
  providers: [InformeClientesService],
  templateUrl: './log-gestion-cartera.component.html',
  styleUrl: './log-gestion-cartera.component.css'
})
export class LogGestionCarteraComponent {

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
  
  public fechaMaxima = new Date().toISOString().split('T')[0];
  public fechaMinima = '2000-01-01';
  
  constructor(
    private notif: AlertService,
    private configuracionInformesS: ConfiguracionInformesService,
    private fb: FormBuilder,
    private excelReportService: ExceljsService,
    private loading: LoadingService,
    private serviceLogs: InformeLogService,
    private informeClientesService: InformeClientesService,
    private operacionesService: OperacionesService,
    private cuentaService: CuentaService,
  ) { }

  ngOnInit(): void {
    this.getListaColumnas();
    this.getOficina();
    this.getOficinas();
    this.loadOperaciones();

    this.formulario = this.fb.group({
      '@FechaInicial': [
        null,
        [
          Validators.required,
          this.validarFecha.bind(this)
        ]
      ],
      
      '@FechaFinal': [
        null,
        [
          Validators.required,
          this.validarFecha.bind(this)
        ]
      ],
      '@IdOficina': [0],
      '@Usuario': [''],
      // '@Cuenta': [''],
      '@IdOficinaCuenta': ['', Validators.pattern(/^[0-9]*$/)],
      '@IdProductoCuenta': ['', Validators.pattern(/^[0-9]*$/)],
      '@IdConsecutivo': ['', Validators.pattern(/^[0-9]*$/)],
      '@IdDigito': ['', Validators.pattern(/^[0-9]*$/)],      '@Operacion': ['']
    },
    {
      validators: this.validarRangoFechas()
    });

    this.Filtros = this.serviceLogs.GetFiltrosGestionCreditos();
  }

  getOficina() {
    const resultDataStore = StorageSecurity.getData();
    if (!resultDataStore) {
      return;
    }
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

    const columnasSeleccionadas = this.ListfilteredColumnasInf.filter(x => x.selected);

    if (columnasSeleccionadas.length === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar al menos un campo para generar el informe.'
      );
      return;
    }

    const data: any = {};

    this.filtrosAgregado.forEach(f => { data[f.NombreParametro] = f.idValue; });

    data['@FechaInicial'] = this.formulario.value['@FechaInicial'];
    data['@FechaFinal'] = this.formulario.value['@FechaFinal'];

    this.mostrarModalProgreso();

    this.configuracionInformesS
      .EjecutarInforme('ERP_SPInfGestionCartera', '', data)
      .subscribe({
        next: (respuesta) => {

          this.ocultarModalProgreso();

          if (!respuesta || respuesta.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontraron datos para mostrar, verifique los filtros.');
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
          this.notif.onWarning('Advertencia',mensaje,);
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
        'No se encontró registro.'
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
          this.notif.onWarning('Advertencia', 'Error al cargar columnas.');
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

  seleccionarFiltro() {
    const existe = this.filtrosAgregado.some(
      x => x.idFiltro == this.filtroSelect
    );

    if (existe) {
      this.notif.onWarning('Advertencia', 'Filtro seleccionado ya existe.');
      this.filtroSelect = 0;
      this.tituloGenerico = '';
      return;
    }

    this.obtenerFiltro();
  }

  MostrarPanel() {

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

      const nombreOficina =
        this.ListOficina.find(x => x.id == idOficina)?.descri ?? '';
          
      this.AddFiltro(
        3,
        idOficina,
        'Oficina:',
        nombreOficina,
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
    
      const oficinaCuenta = this.formulario.get('@IdOficinaCuenta')?.value ?? '';
      const productoCuenta = this.formulario.get('@IdProductoCuenta')?.value ?? '';
      const consecutivoCuenta = this.formulario.get('@IdConsecutivo')?.value ?? '';
      const digitoCuenta = this.formulario.get('@IdDigito')?.value ?? '';
          
      const cuenta = `${oficinaCuenta}-${productoCuenta}-${consecutivoCuenta}-${digitoCuenta}`
        .replace(/[\r\n\t]/g, '').trim();
    
      if (!cuenta) {
        this.notif.onWarning('Advertencia', 'Debe ingresar una cuenta.');
        return;
      }
    
      const partes = cuenta.split('-');
    
      if (partes.length !== 4) {
        this.notif.onWarning(
          'Advertencia',
          'La cuenta debe tener el formato 000-000-0000000-0.'
        );
        return;
      }
    
      const formatoCuenta = /^\d+-\d+-\d+-\d+$/;
    
      if (!formatoCuenta.test(cuenta)) {
        this.notif.onWarning(
          'Advertencia',
          'La cuenta debe tener el formato 000-000-0000000-0.'
        );
        return;
      }
    
      const oficina = Number(partes[0]);
      const producto = Number(partes[1]);
      const consecutivo = Number(partes[2]);
      const digito = Number(partes[3]);
    
      this.loading.show();
    
      this.serviceLogs
        .validarCuentaGestionCredito(
          oficina,
          producto,
          consecutivo,
          digito
        )
        .subscribe({
          next: (existe) => {
          
            this.loading.hide();
          
            if (!existe) {
              this.notif.onWarning('Advertencia','No se encontró registro.');
              return;
            }
          
            const cuentaVisual =
              oficinaCuenta.toString().padStart(3, '0') + '-' +
              productoCuenta.toString().padStart(3, '0') + '-' +
              consecutivoCuenta.toString().padStart(7, '0') + '-' +
              digitoCuenta.toString();

            this.AddFiltro(
              5,
              cuenta,
              'Cuenta:',
              cuentaVisual,
              '',
              'Es Igual',
              '@Cuenta'
            );
          
            this.limpiarSelected();
          },
          error: () => {
            this.loading.hide();
            this.notif.onWarning('Advertencia','Error al validar la cuenta.');
          }
        });
      
      return;
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


  EliminarFiltro(item: any) {
    this.filtrosAgregado =
      this.filtrosAgregado.filter(f => f.idFiltro !== item.idFiltro);
  }

  loadOperaciones() {
   this.dataUser = StorageSecurity.getData();

    const arrayExample = [{
      'IdModulo': this.codModulo,
      'IdUsuario': this.dataUser.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.dataUser.idPerfilUsuario
    }];

    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {

        this.resultOperaciones = (result as any[]).filter(
          (x: any) => x.ERP_tblOperacion?.IdOperacion !== 2
        );

      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  
  mostrarBotones(): boolean {

    if (this.filtroSelect == 1) {
      return true;
    }

    return this.filtrosAgregado.length > 0;
  }

  limpiarSelected() {
    this.filtroSelect = 0;
    this.tituloGenerico = "";
    this.alertGenerico = "";

    this.formulario.reset({
      '@IdOficina': 0,
      '@Operacion': ''
    });
  }

  validarUsuario() {
    let usuario = this.formulario.get('@Usuario')?.value ?? '';
    usuario = usuario.replace(/[\r\n\t]/g, '').trim();
    this.formulario.get('@Usuario')?.setValue(usuario);
  
    if (!usuario) {
      this.notif.onWarning('Advertencia', 'Debe ingresar un usuario.');
      return;
    }

    if (!/^[A-Za-z]+$/.test(usuario)) {
      this.notif.onWarning('Advertencia', 'El usuario solo acepta letras.');
      return;
    }

    this.loading.show();
  
    this.informeClientesService.ValidatUsuario(usuario).subscribe(
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
            this.notif.onWarning(
              'Advertencia',
              'El usuario no existe en el sistema, valide el valor ingresado.'
            );
          }
          this.loading.hide();
        },
        err => {
          this.loading.hide();
          this.notif.onWarning('Advertencia','Error al validar el usuario.');
        }
      );
  }

  obtenerMinFechaFinal(): string {
    return this.formulario?.get('@FechaInicial')?.value || '';
  }

  obtenerMaxFechaInicial(): string {
    const fechaFinal = this.formulario?.get('@FechaFinal')?.value;

    return fechaFinal || this.fechaMaxima;
  }

  validarRangoFechas(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const fechaInicial = control.get('@FechaInicial')?.value;
      const fechaFinal = control.get('@FechaFinal')?.value;

      if (!fechaInicial || !fechaFinal) {
        return null;
      }

      return new Date(fechaInicial) <= new Date(fechaFinal)
        ? null
        : { rangoFechas: true };
    };
  }

  private validarFecha(control: AbstractControl): ValidationErrors | null {

    const fecha = control.value;

    if (!fecha) {
      return null;
    }

    const partes = fecha.split('-');

    const fechaIngresada = new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2])
    );

    const fechaMinima = new Date(2000, 0, 1);

    const hoy = new Date();

    const fechaActual = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );

    if (fechaIngresada > fechaActual) {
      return { fechaMayorActual: true };
    }

    if (fechaIngresada < fechaMinima) {
      return { fechaMenorPermitida: true };
    }

    return null;
  }

  onBlurCampoNumeroCuenta() {
    const oficina = this.formulario.get('@IdOficinaCuenta')?.value?.trim();
    const producto = this.formulario.get('@IdProductoCuenta')?.value?.trim();
    const consecutivo = this.formulario.get('@IdConsecutivo')?.value?.trim();
    const digito = this.formulario.get('@IdDigito')?.value?.trim();

    if (
      /^\d+$/.test(oficina) &&
      /^\d+$/.test(producto) &&
      /^\d+$/.test(consecutivo) &&
      /^\d+$/.test(digito)
    ) {

      this.serviceLogs.validarCuentaGestionCredito(
        Number(oficina),
        Number(producto),
        Number(consecutivo),
        Number(digito)
      ).subscribe({
        next: (existe) => {
          if (!existe) {
            this.notif.onWarning('Advertencia', 'No se encontró registro.');
          }
        }
      });

    }
  }

  pegarCuenta(event: ClipboardEvent) {
    const texto = (event.clipboardData?.getData('text') ?? '').trim();

    if (!texto.includes('-')) return;

    const cuenta = this.cuentaService.parsearCuenta(texto);

    if (!cuenta) {
      event.preventDefault();
      this.notif.onWarning(
        'Advertencia',
        'La cuenta debe tener el formato 000-000-0000000-0.'
      );
      return;
    }

    event.preventDefault();
    this.formulario.patchValue({
      '@IdOficinaCuenta': cuenta.oficina,
      '@IdProductoCuenta': cuenta.producto,
      '@IdConsecutivo': cuenta.consecutivo,
      '@IdDigito': cuenta.digito
    });

    setTimeout(() => { this.onBlurCampoNumeroCuenta(); });
  }

  limpiarCuenta() {
    this.formulario.patchValue({
      '@IdOficinaCuenta': '',
      '@IdProductoCuenta': '',
      '@IdConsecutivo': '',
      '@IdDigito': ''
    });
  
  }
  
  soloNumeros(event: KeyboardEvent): boolean {
    const tecla = event.key;
    if (!/^\d$/.test(tecla)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

}
