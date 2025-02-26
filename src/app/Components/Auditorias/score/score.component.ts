import { ScoreAuditoriaService } from '../../../Services/Auditoria/ScoreAuditoria.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../Services/Login/login.service';
@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css'],
  providers: [ScoreAuditoriaService, ModuleValidationService, LoginService],
  standalone : false
})
export class ScoreComponent implements OnInit {
  public ScoreForm!: FormGroup;
  public dataScoreAuditoria : any;
  private CodModulo = 35;
  public DatosUsuario : any;
  constructor(private scoreService: ScoreAuditoriaService, private notificacion: ToastrService,
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
    this.ScoreForm.get('FechaInicial')?.setValue(moment(_fechaAyer).format('YYYY-MM-DD'));
    this.ScoreForm.get('FechaFinal')?.setValue(moment(_fechaAhora).format('YYYY-MM-DD'));
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


  ConsultarGMFAuditoria() {
    console.log(this.ScoreForm.value);
    this.scoreService.ConsultarScoreAuditoria(this.ScoreForm.value).subscribe(
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
    const Asociado = new FormControl('', []);

    this.ScoreForm = new FormGroup({
      FechaInicial: FechaInicial,
      FechaFinal: FechaFinal,
      Usuario: Usuario,
      Asociado: Asociado,
    });
  }


  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

}
