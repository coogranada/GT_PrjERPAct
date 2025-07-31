import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { NgxLoadingComponent } from 'ngx-loading';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { ToastrService } from 'ngx-toastr';
import { Filtro } from '../../../../Models/Informes/informe-ahorros/informe-ahorros.model';
import { InformeAhorrosService } from '../../../../Services/Informes/informe-ahorros.service';
import { SPParametros } from '../../../../Models/Informes/configuracion-informes/parametros-informes.model';
import { ExcelService } from '../../../../Services/General/excel.service';

@Component({
  selector: 'app-informe-ahorros',
  templateUrl: './informe-ahorros.component.html',
  styleUrl: './informe-ahorros.component.css',
  providers: [OperacionesService, ModuleValidationService],
  standalone: false
})

export class InformeAhorrosComponent implements OnInit {
  @ViewChild('ShowModalList', { static: true }) private ShowModalList!: ElementRef;
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  loading: boolean = false;
  selectedTab: string = 'predeterminados';
  columnaOrden: string = '';
  ordenAscendente: boolean = true;

  public selectedId: number = 0;
  public idOficina: number = 0;
  public OpcionSelected: Boolean = true;
  public validaOperacion: Boolean = true;
  public deshabilitarOficina: boolean = true;
  public OperacionSelect: string = "";
  public valueSlect: string = "";
  public nombreOficina: string = "";
  public nombreSP: string = "";
  public accionEjecuta: string = "";

  public configuracionInformes: any[] = [];
  public configuracionInformesFiltro: any[] = [];
  public parametrosConfiguracionInf: SPParametros[] = [];
  public resultadoInforme: any[] = [];
  public encabezados: any[] = [];
  public Operaciones: any[] = [];
  public Filtros: Filtro[] = [];
  public ListGenerico: any[] = [];
  public ListGenericoFiltro: any[] = [];
  public ListGenericoFiltroOficina: any[] = [];
  public formulario: FormGroup;

  CodModulo: number = 82

  constructor(private excelReportService: ExcelService,  private fb: FormBuilder, private informeAhorrosService: InformeAhorrosService, private operacionesService: OperacionesService, private el: ElementRef, private moduleValidationService: ModuleValidationService, private notif: ToastrService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
    this.formulario = this.fb.group({});

  }

  ngOnInit() {
    this.IrArriba();
    this.getOperaciones();
    $('#select').focus().select();
    this.getOficina();
    this.obtenerConfiguracionInformes();
    this.InitFiltros(this.idOficina);
    this.getListas();
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
    this.informeAhorrosService.ObtenerConfiguracionInformes().subscribe({
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

    this.configuracionInformesFiltro = this.configuracionInformes.filter(
      (informe: any) => informe.IdModulo === this.selectedId
    );
  }

  informeSelected(event: Event) {
    this.loading = true;
    const selectedId = +(event.target as HTMLSelectElement).value;

    const informeSel = this.configuracionInformesFiltro.find(
      item => item.IdConfiguracion === selectedId
    );

    this.nombreSP = informeSel?.NombreSP || '';
    this.accionEjecuta = informeSel?.AccionEjecuta || '';

    this.informeAhorrosService.ObtenerParametrosConfiguracionInfTbl(selectedId).subscribe({
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

    for (let param of this.parametrosConfiguracionInf) {
      const validators = [];

      if (param.Requerido) {
        validators.push(Validators.required);
      }

      if (param.TamanoCampo && param.TipoDato === 'varchar') {
        validators.push(Validators.maxLength(Number(param.TamanoCampo)));
      }

      this.formulario.addControl(param.NombreParametro, new FormControl('', validators));

     if(param.TipoDato === 'selectn' && param.IdTipo === 999){
        this.filtrarListasOficinas(param.IdTipo);
      }else{
        this.filtrarListas(param.IdTipo);
      }
      
    }

    for(const [key, control] of Object.entries(this.formulario.controls)){
      if(key.toLowerCase().includes('oficina')){
        control.setValue(this.idOficina);
        if(this.idOficina !== 3){
          control.disable();
        }else{
          control.enable();
        }
      }
    }
  
  }

  ejecutarSP(): void {
    if (this.formulario.invalid) {
      this.notif.warning('Advertencia', 'Debe diligenciar los campos obligatorios.', ConfiguracionNotificacion.configRightTop);
      console.log('Formulario inválido:', this.formulario.value);
      return;
    }
    this.loading = true;
    const parametros = this.formulario.getRawValue();
    try {
      this.informeAhorrosService
        .EjecutarInforme(this.nombreSP, this.accionEjecuta, parametros)
        .subscribe(respuesta => {
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
            this.ShowModalList.nativeElement.click();
          }
          this.loading = false;
          return;
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
          this.loading = false;
        }
      );
    } catch (error) {
      console.log("error obtener datos: " + error)
      this.notif.warning('Advertencia', 'Ha ocurrido un problema en la ejecución: ' + error, ConfiguracionNotificacion.configRightTop);
    } finally {
      this.loading = false;
    }

  }

  exportarExcel2() {
    var data = null;
        if (!this.resultadoInforme || this.resultadoInforme.length === 0) {
          this.notif.warning('Advertencia', 'No hay información para exportar.', ConfiguracionNotificacion.configRightTop);
        } else {
          data = this.resultadoInforme.map(row => {
            return Object.keys(row).slice(1)
              .reduce((obj, key) => {
                const valor= row[key];
                if(typeof valor === 'string' && valor.includes('T')&& !isNaN(Date.parse(valor))){
                  (obj as { [key: string]: unknown })[key] = this.formatearValor(valor);
                }else{
                  (obj as { [key: string]: unknown })[key] = valor;
                }

                return obj;
              }, {});
          });
          this.excelReportService.exportAsExcelFile(data, 'INFORME ACIVACIÓN DE CUENTAS')
        }
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  formatearValor(valor: any): string {
    if (typeof valor === 'string' && this.esFechaISO(valor)) {
      const fecha = new Date(valor);
      return `${fecha.getFullYear()}/${this.pad(fecha.getMonth() + 1)}/${this.pad(fecha.getDate())} ${this.pad(fecha.getHours())}:${this.pad(fecha.getMinutes())}:${this.pad(fecha.getSeconds())}`;
    }
    return valor;
  }
  
  esFechaISO(valor: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(valor);
  }
  
  pad(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }

  getListas() {
    this.informeAhorrosService.ObtenerListas().subscribe({
      next: (respuesta) => {
        this.ListGenerico = respuesta
      },
      error: (err) => {
        console.error('Error al cargar parámetros de informes:', err);
        this.loading = false;
      }
    }); 
  }

  filtrarListas(i : number) {
    this.ListGenericoFiltro = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i
    );
  }

  filtrarListasOficinas(i : number) {
    this.ListGenericoFiltroOficina = this.ListGenerico.filter(
      (listGen: any) => listGen.IdTipo === i
    );
  }
}
