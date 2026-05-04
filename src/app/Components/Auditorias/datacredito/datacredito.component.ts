import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { LoginService } from '../../../Services/Login/login.service';
import { Router } from '@angular/router';
import { fromEvent, map } from 'rxjs';
import moment from 'moment';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { DatacreditoAuditoriaService } from '../../../Services/Auditoria/DatacreditoAuditoria.service';
import { NgxLoadingComponent } from 'ngx-loading';
import { ExceljsService } from '../../../Services/General/exceljs.service';
import { TablaVirtualComponent } from '../../Tabla-virtual/tabla-virtual/tabla-virtual.component';

@Component({
  selector: 'app-datacredito',
  templateUrl: './datacredito.component.html',
  styleUrl: './datacredito.component.css',
  providers: [DatacreditoAuditoriaService, ModuleValidationService, LoginService],
  standalone: false
})
export class DatacreditoComponent implements OnInit {
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';

  public DataForm!: FormGroup;
  public dataScoreAuditoria: any;
  private CodModulo = 85;
  public DatosUsuario: any;
  public selectedRow: any = null;
  public resultadoInforme: any[] = [];
  public encabezados: any[] = [];
  public loading: boolean = false;


  @ViewChild('ShowModalList', { static: true }) private ShowModalList!: ElementRef;
  @ViewChild(TablaVirtualComponent) tablaVirtual!: TablaVirtualComponent;
  

  ngxLoadingComponent!: NgxLoadingComponent;



  constructor(private excelReportService: ExceljsService, private datacreditoAuditoriaService: DatacreditoAuditoriaService, private notificacion: ToastrService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef, private loginService: LoginService,
    private router: Router) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.validateForm();
    const _fechaAhora = new Date();
    const _fechaAyer = new Date();
    _fechaAyer.setDate(_fechaAyer.getDate() - 1);
    //DFRAMIREZ: Se comentan lienas DAILY 23/01/2026
    //this.DataForm.get('FechaInicial')?.setValue(moment(_fechaAyer).format('YYYY-MM-DD'));
    //this.DataForm.get('FechaFinal')?.setValue(moment(_fechaAhora).format('YYYY-MM-DD'));
    let datas = localStorage.getItem('Data');
    this.DatosUsuario = JSON.parse(window.atob(datas == null ? "" : datas));

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );

    this.IrArriba();
  }


  ConsultarDataAuditoria() {
    console.log(this.DataForm.value);
    this.datacreditoAuditoriaService.ConsultarAuditoriaDatacredito(this.DataForm.value).subscribe(
      result => {
        if (result === null || result.length === 0) {
          this.dataScoreAuditoria = null;
          this.notificacion.warning('Advertencia', 'No se encontró información.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.dataScoreAuditoria = result;
        }
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
        console.log(error);
      }
    );
  }

  validateForm() {
    const FechaInicial = new FormControl('', [Validators.required]);
    const FechaFinal = new FormControl('', [Validators.required]);
    const Usuario = new FormControl('', []);
    const Identificacion = new FormControl('', []);

    this.DataForm = new FormGroup({
      FechaInicial: FechaInicial,
      FechaFinal: FechaFinal,
      Usuario: Usuario,
      Identificacion: Identificacion,
    });
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  selectRow(parametro: any) {
    this.selectedRow = parametro;
  }

  ConsultarDataFactura() {
    this.datacreditoAuditoriaService.ConsultarAuditoriaFacturaDatacredito(this.DataForm.value).subscribe(
      respuesta => {
        if (respuesta === null || respuesta.length === 0) {
          this.resultadoInforme = [];
          this.notificacion.warning('Advertencia', 'No se encontró información.', ConfiguracionNotificacion.configRightTop);
        } else {
          if (respuesta && respuesta.length > 0) {
             const respuestaTransformada =respuesta.map((item:any) => ({
              'Oficina / Ciudad': item.Oficina,
              'Historia de crédito': item.HistoriaCredito,
              'Advance 1.1': item.Advance1_1,
              'Advance Inclusion': item.AdvanceInclusion,
              'Advance Income': item.AdvanceIncome,
              'Valor Ingreso': item.ValorIngreso,
              'Total': item.TotalOficina
            }));

            this.resultadoInforme = respuestaTransformada;

            this.encabezados = Object.keys(respuestaTransformada[0]);

            this.ShowModalList.nativeElement.click();

          }
        }
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
        console.log(error);
      }
    );
  }

  onModalCerrar() {
    this.resultadoInforme = [];
  }

  exportarExcel2() {
    this.loading = true;
    var data = null;
    if (!this.resultadoInforme || this.resultadoInforme.length === 0) {
      this.loading = false;
      this.notificacion.warning('Advertencia', 'No hay información para exportar.', ConfiguracionNotificacion.configRightTop);
    } else {
      data = this.resultadoInforme.map(row => {
        return Object.keys(row)//.slice(1)
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
      this.excelReportService.exportAsExcelFile(data, "Resumen consultas")
      this.loading = false;
    }
  }

  formatearValor = (valor: any, columna?: string): string => {
    return valor !== null && valor !== undefined ? String(valor) : '';
  };

  esFechaISO(valor: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(valor);
  }

  pad(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }

}
