import { GMFAuditoriaService } from '../../../Services/Auditoria/GmfAuditoria.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GMFAuditoriaModel } from '../../../Models/Auditoria/GMFAuditoria.model';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../Services/Login/login.service';
import { Router } from '@angular/router';
import { StorageSecurity } from '../../../utils/storage-security.util';

@Component({
  selector: 'app-gmf',
  templateUrl: './gmf.component.html',
  styleUrls: ['./gmf.component.css'],
  providers: [GMFAuditoriaService, ModuleValidationService, LoginService],
  standalone : false
})
export class GMFComponent implements OnInit {
  public GFMFrom!: FormGroup;
  public dataGFMAuditoria : any;
  public dataGMFReport : any | null = null;
  public dataGMF : any;
  public GMFModel = new GMFAuditoriaModel();
  ocultarData = false;
  private CodModulo = 36;
  public DatosUsuario : any;
  constructor(private gmfService: GMFAuditoriaService, private notificacion: ToastrService,
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
    //this.GFMFrom.get('FechaInicial')?.setValue(moment(_fechaAyer).format('YYYY-MM-DD'));
    //this.GFMFrom.get('FechaFinal')?.setValue(moment(_fechaAhora).format('YYYY-MM-DD'));
    this.DatosUsuario = StorageSecurity.getData();

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

  // getPermisos(data) {
  //   this.moduleValidationService.ValidatePermissionsModule(this.CodModulo, data);
  // }
  ConsultarGMFAuditoria() {
    console.log(this.GFMFrom.value);
    this.gmfService.ConsultarGMFAuditoria(this.GFMFrom.value).subscribe(
      result => {
        if (result === null || result.length === 0) {
          this.dataGFMAuditoria = null;
          this.notificacion.warning('Advertencia', 'No se encontró información.', ConfiguracionNotificacion.configRightTop);
        } else {
          this.dataGFMAuditoria = result;
        }
      },
      error => {
        const errorJson = JSON.parse(error._body);
        this.notificacion.error('Error', errorJson, ConfiguracionNotificacion.configRightTop);
        console.log(error);
      }
    );
  }

  ConsultarReporte(data : any) {
    this.gmfService.ConsultarReporteGMF(data).subscribe(
      result => {
        console.log(result);
        this.dataGMFReport = result;
        this.ocultarData = true;
        console.log(this.dataGMFReport);
      },
      error => {
        console.log('ConsultarGMFAuditoria' + error);
      }
    );
  }

  print() {
    window.print();
  }

  validateForm() {
    const FechaInicial = new FormControl('', [Validators.required]);
    const FechaFinal = new FormControl('', [Validators.required]);
    const Usuario = new FormControl('', []);
    const hiddenIdReporte = new FormControl('', []);
    const Asociado = new FormControl('', []);

    this.GFMFrom = new FormGroup({
      FechaInicial: FechaInicial,
      FechaFinal: FechaFinal,
      Usuario: Usuario,
      hiddenIdReporte: hiddenIdReporte,
      Asociado: Asociado
    });

  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
