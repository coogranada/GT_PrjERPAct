import { Component, ElementRef, ViewChild } from '@angular/core';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { ModuleValidationService } from '../../../../../Services/Enviroment/moduleValidation.service';
import { InformePerfilService } from '../../../../../Services/Maestros/informes-perfiles';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { TablaVirtualComponent } from '../../../../Tabla-virtual/tabla-virtual/tabla-virtual.component';
import { NgxLoadingComponent } from 'ngx-loading';
import { SPParametros } from '../../../../../Models/Informes/configuracion-informes/parametros-informes.model';
import { Filtro } from '../../../../../Models/Informes/informe-clientes/informe-clientes.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExceljsService } from '../../../../../Services/General/exceljs.service';
import { ConfiguracionInformesService } from '../../../../../Services/Informes/configuracion-informes.service';
import { InformeAhorrosService } from '../../../../../Services/Informes/informe-ahorros.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, map } from 'rxjs';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-personas-juridicas',
  templateUrl: './informe-personas-juridicas.component.html',
  styleUrl: './informe-personas-juridicas.component.css',
  providers: [OperacionesService, ModuleValidationService, InformePerfilService, GeneralesService],
  standalone : false
})
export class InformePersonasJuridicasComponent {
  @ViewChild('ShowModalList', { static: true }) private ShowModalList!: ElementRef;
  @ViewChild('ModalProgressBar', { static: true }) private ModalProgressBar!: ElementRef;
  @ViewChild(TablaVirtualComponent) tablaVirtual!: TablaVirtualComponent;
  @ViewChild('selectInformeL') selectElementRef!: ElementRef<HTMLSelectElement>;

  ngxLoadingComponent!: NgxLoadingComponent;

  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  selectedTab: string = '';
  columnaOrden: string = '';
  ordenAscendente: boolean = true;
  listasPorParametro: { [nombreParametro: string]: any[] } = {};

  public progreso: number = 0;
  public intervaloProgreso: any;
  public selectedId: number = 0;
  public idOficina: number = 0;
  public idPerfil: number = 0;
  public idFiltroOcupa: number = 0;
  public idPaisSelected: number = 0;
  public idDeptoSelected: number = 0;
  public idCiudadSelected: number = 0;
  public OpcionSelected: Boolean = true;
  public validaOperacion: Boolean = true;
  public deshabilitarOficina: boolean = true;
  public loading: boolean = false;
  public allSelected: boolean = false;
  public OperacionSelect: string = "";
  public valueSlect: string = "";
  public nombreOficina: string = "";
  public nombreSP: string = "";
  public accionEjecuta: string = "";
  public nombreInformeSelect: string = '';
  public nombreInforme: string = '';
  public filtro: string = '';
  public filtroSeleccionado: string | null = null;
  public fechaMax: any = null;
  public fechaMinima: any = null;
  public filtrosAgregado: any = [];
  public filtrosAgregadoWhere: any = [];
  public configuracionInformes: any[] = [];
  public configuracionInformesFiltro: any[] = [];
  public configuracionInformesFiltroDina: any[] = [];
  public parametrosConfiguracionInf: SPParametros[] = [];
  public parametrosConfiguracionInfDina: SPParametros[] = [];
  public filtrosAgrupados: { [nombreFiltro: string]: any[] } = {};
  public resultadoInforme: any[] = [];
  public encabezados: any[] = [];
  public Operaciones: any[] = [];
  public Filtros: Filtro[] = [];
  public ListGenerico: any[] = [];
  public ListGenericoFiltro: any[] = [];
  public ListColumnasInf: any[] = [];
  public ListfilteredColumnasInf: any[] = [];
  public permitidosResult: any [] = [];
  public formulario: FormGroup;
  public formularioD: FormGroup;

  CodModulo: number = 76

  constructor(private excelReportService: ExceljsService, private fb: FormBuilder, private configuracionInformesS: ConfiguracionInformesService, private informeAhorrosService: InformeAhorrosService, private operacionesService: OperacionesService, 
              private el: ElementRef, private moduleValidationService: ModuleValidationService, private notif: ToastrService, private InformePerfilS:InformePerfilService, private generalesService: GeneralesService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
    this.formulario = this.fb.group({});
    this.formularioD = this.fb.group({});

  }

  ngOnInit() {
    this.IrArriba();
    this.getOperaciones();
    $('#select').focus().select();
    this.getOficina();
    this.obtenerInformesPermitidos();
    this.obtenerConfiguracionInformes();
    this.InitVariables()
    this.InitFiltros(this.idOficina);
    this.getListas();
  }

  obtenerInformesPermitidos() {

    this.InformePerfilS.ObtenerInformesPermitidosP(this.idPerfil).subscribe({
      next: (respuesta) => {
        this.permitidosResult = respuesta;
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
      }
    });
  }


  getOperaciones() {
    let datas = localStorage.getItem("Data")
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    var arrayExample = [{
      IdModulo: this.CodModulo,
      IdUsuario: resultDataStore.IdUsuario,
      IdPerfil: resultDataStore.UsuarioPerfil
    }];

    this.operacionesService.OperacionesPermitidas(JSON.stringify(arrayExample[0])).subscribe((result) => {
      result.forEach((element: any) => {
        this.Operaciones.push(element);
      });
      this.OpcionSelected = true;
    }, (error) => {
      this.notif.error("Error", error, ConfiguracionNotificacion.configRightTopNoClose);
    });
  }

  obtenerConfiguracionInformes() {
    this.configuracionInformesS.ObtenerConfiguracionInformes().subscribe({
      next: (respuesta) => {
        this.configuracionInformes = respuesta;
      },
      error: (err) => {
        console.error('Error al cargar configuración informes:', err);
      }
    });
  }

  InitFiltros(oficinaOrAdmin: number) {
    this.Filtros = this.informeAhorrosService.GetFiltros(oficinaOrAdmin, false);
    this.Filtros.sort((a, b) => a.NombreFiltro.localeCompare(b.NombreFiltro));
  }

  getOficina() {
    let datas = localStorage.getItem("Data");
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    this.idOficina = Number(resultDataStore.NumeroOficina);
    this.nombreOficina = resultDataStore.Oficina;
    this.idPerfil = Number(resultDataStore.idPerfilUsuario);
  }

  operacionBlur() {
    if (this.valueSlect == "0")
      this.validaOperacion = false;
  }

  opcionSelected(event: Event) {
    this.selectedId = +(event.target as HTMLSelectElement).value;
    const operacion = this.Operaciones.find(
      item => item.ERP_tblOperacion.IdOperacion === this.selectedId
    );

    this.OperacionSelect = operacion?.ERP_tblOperacion.Descripcion.toLowerCase();

    this.configuracionInformesFiltro = this.configuracionInformes.filter((informe: any) =>{
      return informe.IdModulo === this.selectedId && informe.IdTipo === false &&
      this.permitidosResult.some((permiso) => permiso.IdInforme === informe.IdConfiguracion);
    });

    this.configuracionInformesFiltroDina = this.configuracionInformes.filter((informe: any) => {
      return informe.IdModulo === this.selectedId && informe.IdTipo === true &&
      this.permitidosResult.some((permiso) => permiso.IdInforme === informe.IdConfiguracion);
    });
    this.filtrosAgregado = [];
    this.filtrosAgregadoWhere = [];
    this.allSelected = false;
    if(this.configuracionInformesFiltro.length >= 1){
      setTimeout(() => {
        if (this.selectElementRef) {
          const selectElement = this.selectElementRef.nativeElement;
          selectElement.value = '0';
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          this.formulario = this.fb.group({});
        }
      }, 200);
    }
    if(this.configuracionInformesFiltroDina.length >= 1){
      this.getListaFiltros();
    }
    
  }

  informeSelected(event: Event) {
    this.loading = true;
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = +selectElement.value;
    this.nombreInformeSelect = selectElement.options[selectElement.selectedIndex].text;

    const informeSel = this.configuracionInformesFiltro.find(
      item => item.IdConfiguracion === selectedId
    );

    this.nombreSP = informeSel?.NombreSP || '';
    this.accionEjecuta = informeSel?.AccionEjecuta || '';

    this.configuracionInformesS.ObtenerParametrosConfiguracionInfTbl(selectedId).subscribe({
      next: (respuesta: SPParametros[]) => {
        this.parametrosConfiguracionInf = respuesta.filter(
          (param) => param.AliasCampo.toLowerCase() !== 'reservado'
        );

        this.crearFormularioDinamico();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar parámetros de informes:', err);
        this.loading = false;
      }
    });
  }

  ordenarPor(col: string): void {
    if (this.columnaOrden === col) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrden = col;
      this.ordenAscendente = true;
    }

    this.resultadoInforme.sort((a, b) => {
      const valorA = a[col] ?? '';
      const valorB = b[col] ?? '';

      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return this.ordenAscendente ? valorA - valorB : valorB - valorA;
      }

      return this.ordenAscendente
        ? String(valorA).localeCompare(String(valorB))
        : String(valorB).localeCompare(String(valorA));
    });
  }

  crearFormularioDinamico(): void {

    this.formulario = new FormGroup({});

    for (let param of this.parametrosConfiguracionInf) {
      const validators = [];

      if (param.Requerido) {
        validators.push(Validators.required);
      }

      if (param.TamanoCampo && param.TipoDato === 'varchar') {
        validators.push(Validators.maxLength(Number(param.TamanoCampo)));
      }

      this.formulario.addControl(param.NombreParametro, new FormControl('', validators));

      if (param.TipoDato === 'selectn' && param.IdTipo === 999) {
        this.filtrarListasOficinas(param.IdTipo, param.NombreParametro);
      } else {
        this.filtrarListas(param.IdTipo, param.NombreParametro);
      }

    }

    for (const [key, control] of Object.entries(this.formulario.controls)) {
      if (key.toLowerCase().includes('oficina')) {
        control.setValue(this.idOficina);
        if (this.idOficina !== 3) {
          control.disable();
        } else {
          control.enable();
        }
      }
    }

  }

  ejecutarSP(): void {
    if (this.formulario.invalid) {
      this.notif.warning('Advertencia', 'Debe diligenciar los campos obligatorios.', ConfiguracionNotificacion.configRightTop);
      return;
    }
    const parametros = this.formulario.getRawValue();
    this.mostrarModalProgreso();
    try {
      this.configuracionInformesS
        .EjecutarInforme(this.nombreSP, this.accionEjecuta, parametros)
        .subscribe(respuesta => {
          this.ocultarModalProgreso();
          if (respuesta.length <= 0) {
            this.notif.warning('Advertencia', 'No se encontraron datos para mostrar, verifique los filtros.', ConfiguracionNotificacion.configRightTop);
            return;
          }
          if (respuesta && respuesta.length > 0) {
            this.resultadoInforme = respuesta;
            if (respuesta.length > 1 && respuesta[1]) {
              this.encabezados = Object.keys(respuesta[1]).slice(1);
            } else {
              this.encabezados = Object.keys(respuesta[0]).slice(1);
            }
            const LogData ={
              NombreInforme: this.nombreInformeSelect
            }
            this.ModalCantidadRegistros(respuesta.length, false);
            this.GuardarLog(LogData, this.selectedId, 0, 0, this.CodModulo);
          }
          this.loading = false;
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
            this.notif.warning("Advertencia", mensaje, ConfiguracionNotificacion.configRightTop);
          }
        );
    } catch (error) {
      console.log("error obtener datos: " + error)
      this.notif.warning('Advertencia', 'Ha ocurrido un problema en la ejecución: ' + error, ConfiguracionNotificacion.configRightTop);
    }
  }

  exportarExcel2() {
    this.loading = true;


    var data = null;
    if (!this.resultadoInforme || this.resultadoInforme.length === 0) {
    this.loading = false ;
      this.notif.warning('Advertencia', 'No hay información para exportar.', ConfiguracionNotificacion.configRightTop);
    } else {
      data = this.resultadoInforme.map(row => {
        if(this.selectedTab == 'dinamicos'){
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
        }else{
          return Object.keys(row).slice(1) //Predeterminados se les retira la primera fila
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
        }
       

      });
      this.excelReportService.exportAsExcelFile(data, this.nombreInforme)
      this.loading = false ;
    }
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    if (tab == 'dinamicos') {
      this.getListaFiltros();
      this.allSelected = false;
    }

    if (tab == 'predeterminados') {
      setTimeout(() => {
        if (this.selectElementRef) {
          const selectElement = this.selectElementRef.nativeElement;
          selectElement.value = '0';
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          this.formulario = this.fb.group({});
        }
      }, 200);


    }

  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  formatearValor = (valor: any, columna?: string): string => {

    if (columna && columna.endsWith('_M')) {
      const numero = Number(valor);
      if (!isNaN(numero)) {
        return numero.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
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
  };




  esFechaISO(valor: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(valor);
  }

  pad(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }

  getListas() {
    this.configuracionInformesS.ObtenerListas().subscribe({
      next: (respuesta) => {
        this.ListGenerico = respuesta
      },
      error: (err) => {
        console.error('Error al cargar parámetros de informes:', err);
        this.loading = false;
      }
    });
  }

  filtrarListas(i: number, nombreParametro: string): void {
    this.listasPorParametro[nombreParametro] = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i
    );
  }

  filtrarListasOficinas(i: number, nombreParametro: string) {
    this.listasPorParametro[nombreParametro] = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i
    );
  }

  filtrarListasOcupacion(i: number, nombreParametro: string) {
    this.listasPorParametro[nombreParametro] = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i && listGen.IdFiltro === this.idFiltroOcupa
    );
  }

  filtrarListasDepartamento(i: number, nombreParametro: string) {
    this.listasPorParametro[nombreParametro] = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i && listGen.IdFiltro === this.idPaisSelected
    );
  }

  filtrarListasCiudad(i: number, nombreParametro: string) {
    this.listasPorParametro[nombreParametro] = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i && listGen.IdFiltro === this.idDeptoSelected
    );
  }

  filtrarListasBarrio(i: number, nombreParametro: string) {
    this.listasPorParametro[nombreParametro] = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i && listGen.IdFiltro === this.idCiudadSelected
    );
  }

  InitVariables() {
    const hoy = new Date();
    this.fechaMax = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  ModalCantidadRegistros(Cant: number, idDowload: boolean) {
    if (Cant == 0) {
      this.notif.warning('Advertencia', 'No se encuentran registros', ConfiguracionNotificacion.configRightTop);
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
            
            if(this.selectedTab == 'dinamicos'){
              this.nombreInforme = this.OperacionSelect.toUpperCase();
            }else{
              this.nombreInforme = this.nombreInformeSelect.toUpperCase();
            }

            this.ShowModalList.nativeElement.click();
          }
        }, 300);
      }
    });
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

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    if (nearBottom) {
      this.tablaVirtual.loadMore();
    }
  }

  //DINAMICO

  getListaColumnas(nombreSp: string) {
    this.configuracionInformesS.ListarColumnas(nombreSp).subscribe({
      next: (respuesta) => {
        this.ListColumnasInf = respuesta.map((item: any) => ({
          ...item,
          selected: false
        }));
        this.ListfilteredColumnasInf = [...this.ListColumnasInf]
      },
      error: (err) => {
        this.notif.warning('Advertencia', 'Error al cargar las columnas del informe:', ConfiguracionNotificacion.configRightTop);
        console.error('Error al cargar las columnas del informe:', err);
        this.loading = false;
      }
    });
  }

  getListaFiltros() {
    //obtiene el id y nombre del SP según el módulo elegido
    const selectedId = this.configuracionInformesFiltroDina[0].IdConfiguracion;
    const selectedNomSP = this.configuracionInformesFiltroDina[0].NombreSP;

    this.configuracionInformesS.ObtenerParametrosConfiguracionInfTbl(selectedId).subscribe({
      next: (respuesta: SPParametros[]) => {
        this.parametrosConfiguracionInfDina = respuesta.filter(
          (param) => param.AliasCampo.toLowerCase() !== 'reservado'
        );

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar parámetros de informes dinámicos: ', err);
        this.loading = false;
      }
    });

    setTimeout(() => {
      this.agruparFiltros();
    }, 500);


    this.getListaColumnas(selectedNomSP);

  }

  agruparFiltros() {
    const agrupados = this.parametrosConfiguracionInfDina.reduce((acc: any, param) => {
      if (!acc[param.NombreFiltro]) {
        acc[param.NombreFiltro] = [];
      }
      acc[param.NombreFiltro].push(param);
      return acc;
    }, {});

    this.filtrosAgrupados = Object.keys(agrupados)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc: any, key) => {
      acc[key] = agrupados[key];
      return acc;
    }, {});

  }

  obtenerFiltros() {
    return Object.keys(this.filtrosAgrupados);
  }

  filtroChange() {
    if (this.filtroSeleccionado) {
      this.crearFormularioParaFiltro(this.filtroSeleccionado);
    }
  }

  crearFormularioParaFiltro(filtro: string) {
    const grupo: any = {};
    this.filtrosAgrupados[filtro].forEach(param => {
      const valorInicial = (param.TipoDato === 'money') ? 0 : '';
      grupo[param.NombreParametro] = new FormControl(valorInicial);
    });

    this.formularioD = new FormGroup(grupo);

    for (let param of this.parametrosConfiguracionInfDina) {
      const validators = [];

      if (param.Requerido) {
        validators.push(Validators.required);
      }

      if (param.TamanoCampo && param.TipoDato === 'varchar') {
        validators.push(Validators.maxLength(Number(param.TamanoCampo)));
      }

      const valorInicial = (param.TipoDato === 'money') ? 0 : '';

      this.formularioD.addControl(param.NombreParametro, new FormControl(valorInicial, validators));

      if (param.TipoDato === 'selectn' && param.IdTipo === 999) {
        this.filtrarListasOficinas(param.IdTipo, param.NombreParametro);
      } else if(param.TipoDato === 'selectn' && param.IdTipo === 979) {
          this.filtrarListasOcupacion(param.IdTipo, param.NombreParametro);
      }else if(param.TipoDato === 'selectn' && param.IdTipo === 988) {
        this.filtrarListasDepartamento(param.IdTipo, param.NombreParametro);
      }else if(param.TipoDato === 'selectn' && param.IdTipo === 987) {
        this.filtrarListasCiudad(param.IdTipo, param.NombreParametro);
      }else if(param.TipoDato === 'selectn' && param.IdTipo === 986) {
        this.filtrarListasBarrio(param.IdTipo, param.NombreParametro);
      }else{
          this.filtrarListas(param.IdTipo, param.NombreParametro);
      }

    }

    for (const [key, control] of Object.entries(this.formularioD.controls)) {
      if (key.toLowerCase().includes('oficina')) {
        control.setValue(this.idOficina);
        if (this.idOficina !== 3) {
          control.disable();
        } else {
          control.enable();
        }
      }
    }

    if(filtro.toLowerCase().includes('tipo ocupacion') || filtro.toLowerCase().includes('tipo ocupación') ){
      if(this.idFiltroOcupa === 0 ){
        this.alertaListaVacia('tipo empleo');
      }
    }

    if(filtro.toLowerCase().includes('departamento') ){
      if(this.idPaisSelected === 0 ){
        this.alertaListaVacia('país');
      }
    }

    if(filtro.toLowerCase().includes('ciudad') ){
      if(this.idDeptoSelected === 0 ){
        this.alertaListaVacia('departamento');
      }
    }

    if(filtro.toLowerCase().includes('barrio') ){
      if(this.idCiudadSelected === 0 ){
        this.alertaListaVacia('ciudad');
      }
    }


  }

  agregarCriterio() {
    if (!this.validarCriterio()) {
      return;
    }

    if (!this.filtroSeleccionado) return;

    const nuevoFiltro = {
      NombreFiltro: this.filtroSeleccionado
    }

    const existe = this.filtrosAgregado.some((f: any) => f.NombreFiltro === nuevoFiltro.NombreFiltro);

    if (existe) {
      this.notif.warning('Advertencia', `El filtro  ${nuevoFiltro.NombreFiltro?.toLowerCase()} ya fue agregado. `, ConfiguracionNotificacion.configRightTopNoClose);
      return;
    }

      const campos = this.filtrosAgrupados[this.filtroSeleccionado];
      const valores = campos.map(campo => {
      const valor = this.formularioD.get(campo.NombreParametro)?.value;

      let descripcion = valor;
      if (campo.TipoDato === 'selectn') {
        const lista = this.listasPorParametro[campo.NombreParametro];
        const item = lista?.find(opt => opt.IdClase == valor);
        descripcion = item ? item.Descripcion : valor;
        
        if(campo.IdTipo === 980){
          this.idFiltroOcupa = item ? item.IdClase : valor;
        }

        if(campo.IdTipo === 989){
          this.idPaisSelected = item ? item.IdClase : valor;
        }

        if(campo.IdTipo === 988){
          this.idDeptoSelected = item ? item.IdClase : valor;
        }

        if(campo.IdTipo === 987){
          this.idCiudadSelected = item ? item.IdClase : valor;
        }

      }

      return { NombreParametro: campo.NombreParametro, alias: campo.AliasCampo, Valor: valor, Descripcion: descripcion };
    });

    // Construir texto del valor inicial
    let valorInicial = '';
    let validacion = 'Es Igual';
    if (valores.length === 1) {
      valorInicial = valores[0].Valor;
      valorInicial = valores.map(v => valorInicial + ` - ${v.Descripcion}`).join('- ');
    } else {
      valorInicial = valores.map(v => v.Valor).join(' y ');
      validacion = 'Entre';
    }

    this.agregarParametroOficinaA();

    this.filtrosAgregado.push({
      NombreFiltro: this.filtroSeleccionado,
      Validacion: validacion,
      ValorInicial: valorInicial,
      Campos: valores
    });

    this.generarFiltrosWhere();

    this.formularioD.reset();
    this.filtroSeleccionado = '';

  }

  agregarParametroOficinaA(){
    if (this.validarParametroOficina() && this.idOficina !== 3 && !this.filtroSeleccionado?.toLowerCase().includes('oficina')) {
      const existe = this.filtrosAgregado.some((f: any) => f.NombreFiltro.toLowerCase().includes('oficina'));

      if (!existe) {

        //Busca en el arreglo si contiene la palara oficina para hallar el nombre del parámetro que espera el SP
        let nombreParametrosOficina: string="";
        let aliasCamposOficina: string = "";
        let nombreFiltro;
        for (const clave in this.filtrosAgrupados) {
          const grupo = this.filtrosAgrupados[clave];
          if (Array.isArray(grupo)) {
            grupo.forEach(item => {
              if (item.NombreFiltro && item.NombreFiltro.toLowerCase().includes('oficina')) {
                nombreFiltro = (item.NombreFiltro);
                nombreParametrosOficina=(item.NombreParametro);
                aliasCamposOficina=(item.AliasCampo);
              }
            });
          }
        }

        // se crea filtro de oficina para que el usuario no visualice otras oficinas
        this.filtrosAgregado.push({
          NombreFiltro: nombreFiltro,
          Validacion: 'Es igual',
          ValorInicial: this.idOficina + " - " + this.nombreOficina,
          Campos: [{ NombreParametro: nombreParametrosOficina, alias: aliasCamposOficina , Valor: this.idOficina, Descripcion: this.nombreOficina }]
        });
      }
    }
  }

  validarParametroOficina() {
    for (let filtro of this.obtenerFiltros()) {
      if (filtro.toLowerCase().includes('oficina')) {
        return true;
      }
    }
    return false;
  }

  validarParametroPais() {
    for (let filtro of this.obtenerFiltrosAgregados()) {
      if (filtro.NombreFiltro.toLowerCase().includes('país')) {
        return true;
      }
    }
    return false;
  }

  validarParametroDpto() {
    for (let filtro of this.obtenerFiltrosAgregados()) {
      if (filtro.NombreFiltro.toLowerCase().includes('departamento')) {
        return true;
      }
    }
    return false;
  }

  validarParametroCiudad() {
    for (let filtro of this.obtenerFiltrosAgregados()) {
      if (filtro.NombreFiltro.toLowerCase().includes('ciudad')) {
        return true;
      }
    }
    return false;
  }

  validarParametroBarrio() {
    for (let filtro of this.obtenerFiltrosAgregados()) {
      if (filtro.NombreFiltro.toLowerCase().includes('barrio')) {
        return true;
      }
    }
    return false;
  }

  validarParametroOcupacion() {
    for (let filtro of this.obtenerFiltrosAgregados()) {
      if (filtro.NombreFiltro.toLowerCase().includes('tipo ocupación')) {
        return true;
      }
    }
    return false;
  }

  eliminarCriterio(item: any) {

    if (this.validarParametroOficina() && this.idOficina !== 3 && item.NombreFiltro?.toLowerCase().includes('oficina')) {
      this.notif.warning('Advertencia', 'El filtro '+item.NombreFiltro.toLowerCase()+' es obligatorio.', ConfiguracionNotificacion.configRightTop);
      return;
    }

    if(item.NombreFiltro?.toLowerCase().includes('tipo empleo')){
      if(this.validarParametroOcupacion()){
        this.notif.warning('Advertencia', 'Debe eliminar primero el filtro por tipo ocupación.', ConfiguracionNotificacion.configRightTop);
        return;
      }else{
        this.idFiltroOcupa = 0;
      }
    }

    if(item.NombreFiltro?.toLowerCase().includes('país')){
      if(this.validarParametroDpto()){
        this.notif.warning('Advertencia', 'Debe eliminar primero el filtro por departamento.', ConfiguracionNotificacion.configRightTop);
        return;
      }else{
        this.idPaisSelected = 0;
      }
    }

    if(item.NombreFiltro?.toLowerCase().includes('departamento')){
      if(this.validarParametroCiudad()){
        this.notif.warning('Advertencia', 'Debe eliminar primero el filtro por ciudad.', ConfiguracionNotificacion.configRightTop);
        return;
      }else{
        this.idDeptoSelected = 0;
      }
    }

    if(item.NombreFiltro?.toLowerCase().includes('ciudad')){
      if(this.validarParametroBarrio()){
        this.notif.warning('Advertencia', 'Debe eliminar primero el filtro por barrio.', ConfiguracionNotificacion.configRightTop);
        return;
      }else{
        this.idCiudadSelected = 0;
      }
    }

    // 1. Eliminar el item de filtrosAgregado
    const index = this.filtrosAgregado.findIndex((f: any) =>
      f.NombreFiltro === item.NombreFiltro &&
      f.ValorInicial === item.ValorInicial

    );

    if (index !== -1) {

      this.filtrosAgregado.splice(index, 1);

    }

    // 2. Eliminar sus campos relacionados de filtrosAgregadoWhere para consulta sql

    if (Array.isArray(item.Campos)) {
      item.Campos.forEach((campo: any) => {
        this.filtrosAgregadoWhere = this.filtrosAgregadoWhere.filter((fw: any) =>
          !(fw.NombreParametro === campo.NombreParametro && fw.Valor === campo.Valor)
        );
      });

    }

    this.generarFiltrosWhere();

  }

  obtenerFiltrosAgregados() {
    return this.filtrosAgregado;
  }


  generarFiltrosWhere() {
    this.filtrosAgregadoWhere = [];

    this.filtrosAgregado.forEach((filtro: any) => {
      if (Array.isArray(filtro.Campos)) {
        filtro.Campos.forEach((campo: any) => {
          this.filtrosAgregadoWhere.push({
            NombreParametro: campo.NombreParametro,
            Valor: campo.Valor
          });
        });
      }
    });

  }

  ejecutarSPDinamico() {
  //Si el usuario no ha ingresado filtros, y oficina <>3 se crea el criterio obligatorio para filtrar por oficina
    if(this.filtrosAgregado.length == 0){
      this.agregarParametroOficinaA();
      this.generarFiltrosWhere();
    }

    const selectedNomSP = this.configuracionInformesFiltroDina[0].NombreSP;
    const selectedNomInf = this.configuracionInformesFiltroDina[0].NombreInforme;
    const resultado: { [key: string]: any } = {};
    // Construir el objeto con los parámetros
    this.filtrosAgregadoWhere.forEach((param: any) => {
      resultado[param.NombreParametro] = param.Valor;
    });

    const LogData ={
      NombreInforme: selectedNomInf
    }

    // Obtener columnas seleccionadas por el usuario
    const columnasSeleccionadas = this.ListfilteredColumnasInf
      .filter(col => col.selected)
      .map(col => col.name);
    if (columnasSeleccionadas.length === 0) {
      this.notif.warning('Advertencia', 'Debe seleccionar al menos un campo para generar el informe.', ConfiguracionNotificacion.configRightTop);
      this.loading = false;
      return;
    }

    this.mostrarModalProgreso();
    try {
      this.configuracionInformesS
        .EjecutarInforme(selectedNomSP, '', resultado)
        .subscribe(
          respuesta => {
            this.ocultarModalProgreso();
            if (!respuesta || respuesta.length === 0) {
              this.notif.warning('Advertencia', 'No se encontraron datos para mostrar, verifique los filtros.', ConfiguracionNotificacion.configRightTop);
              this.loading = false;
              return;
            }
            // Tomar referencia de encabezado
            const referencia = respuesta.length > 1 && respuesta[1] ? respuesta[1] : respuesta[0];
            // Filtrar encabezados
            this.encabezados = Object.keys(referencia).filter(key => columnasSeleccionadas.includes(key));
            // Filtrar los datos del informe
            this.resultadoInforme = respuesta.map((item: any) => {
              const nuevoItem: any = {};
              columnasSeleccionadas.forEach(col => {
                if (col in item) {
                  nuevoItem[col] = item[col];
                }
              });
              return nuevoItem;
            });
            // Mostrar cantidad de registros
            this.ModalCantidadRegistros(this.resultadoInforme.length, false);
            this.GuardarLog(LogData, this.selectedId, 0, 0, this.CodModulo);
            this.loading = false;
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
            this.notif.warning('Advertencia', mensaje, ConfiguracionNotificacion.configRightTop);
            this.loading = false;
          }
        );
    } catch (error) {
      console.error("Error al ejecutar el SP dinámico:", error);
      this.notif.warning('Advertencia', 'Ha ocurrido un problema en la ejecución: ' + error, ConfiguracionNotificacion.configRightTop);
      this.loading = false;
    }
  }

  onModalCerrar() {
    this.resultadoInforme = [];
  }

  toggleAllCheckboxes() {
    this.ListColumnasInf.forEach(p => p.selected = this.allSelected);
    this.filtrarLista();
  }

  checkIfAllSelected() {
    this.allSelected = this.ListColumnasInf.every(p => p.selected);
  }

  filtrarLista() {
    const filtroLower = this.filtro.toLowerCase();
    this.ListfilteredColumnasInf = this.ListColumnasInf.filter(item =>
      item.selected || item.name.toLowerCase().includes(filtroLower)
    );
  }

  validarCriterio(): boolean {
    let esValido = true;
    if (this.filtroSeleccionado) {
      const filtrosVisibles = this.filtrosAgrupados[this.filtroSeleccionado].map(p => p.NombreParametro);
      for (const [key, control] of Object.entries(this.formularioD.controls)) {
        const esVisible = filtrosVisibles.includes(key);
        if (esVisible) {
          const valor = control.value;
          const vacio = valor === null || valor === '' || (typeof valor === 'string' && valor.trim() === '');
          if (vacio) {
            control.setErrors({ required: true });
            control.markAsTouched();
            esValido = false;
            this.notif.warning('Advertencia', `Debe diligenciar la información para agregar el criterio de filtro.`, ConfiguracionNotificacion.configRightTopNoClose);
          } else {
            control.setErrors(null);
          }

          if (typeof valor === 'number') {
            const minVal = 0;  
            const maxVal = 200;
            if (valor < minVal) {
              control.setErrors({ min: true });
              esValido = false;
              this.notif.warning('Advertencia', `Debe ingresar un valor válido para agregar el criterio de filtro.`, ConfiguracionNotificacion.configRightTopNoClose);
            } else if (valor > maxVal) {
              control.setErrors({ max: true });
              esValido = false;
              this.notif.warning('Advertencia', `Debe ingresar un valor válido para agregar el criterio de filtro.`, ConfiguracionNotificacion.configRightTopNoClose);
            }
          }
        }
      }
    }
    return esValido;
  }

  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.loading = true;
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        this.loading = false;
        console.log(result);
      });
  }

  alertaListaVacia(val: string) {
    Swal.fire({
      title: '<strong> Adverencia </strong>',
      text: 'La lista se encuentra vacía, asegúrese de haber ingresado el filtro por ' + val +' antes de usar este filtro.',
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
