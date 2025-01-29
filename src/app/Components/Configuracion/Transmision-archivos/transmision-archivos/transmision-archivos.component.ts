import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { NgxToastService } from 'ngx-toast-notifier';
import { TransmisionArchivosService } from '../../../../Services/Configuracion/Transmision-archivos.service';
import { ParametrosTransmisionData } from '../../../../Models/Configuracion/Transmision-archivos.model';



@Component({
  selector: 'app-transmision-archivos',
  templateUrl: './transmision-archivos.component.html',
  styleUrls: ['./transmision-archivos.component.css'],
  providers: [GeneralesService, TransmisionArchivosService],
  standalone: false
})
export class TransmisionArchivosComponent implements OnInit {
  selectedRow: any = null;
  parametrosTransm: ParametrosTransmisionData[] = [];
  public parametrosTransmisionForm!: FormGroup;
  public showPassword: boolean = false;
  public selectedProtocolo: string = '';
  public tiposProtocolos: any[] = [
    { value: 'SFTP', descripcion: 'SFTP' },
    { value: 'GRAPH', descripcion: 'GRAPH' }
  ];

  constructor(
    private TransmisionArchivosServices: TransmisionArchivosService,
    private fb: FormBuilder,
    private notificacion: NgxToastService,
    private generalesService: GeneralesService
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.selectedProtocolo = '-';
    this.parametrosTransmisionForm = this.fb.group({
      IdParametro: [''],
      nombreSitio: ['', Validators.required],
      servidor: ['', Validators.required],
      rutaLocalEntrada: ['', Validators.required],
      rutaLocalSalida: ['', Validators.required],
      rutaRemotaEntrada: ['', Validators.required],
      rutaRemotaSalida: ['', Validators.required],
      protocolo: ['', Validators.required],
      puerto: [''],
      modoAcceso: [''],
      usuario: [''],
      contraseña: [''],
      cifrado: [''],
      responsable: [''],
      frecuencia: [''],
      horaEntrada: [''],
      horaSalida: [''],
      gpgRecipient: [''],
      rutaLlave: [''],
      FechaCreacion: ['']
    });

    this.TransmisionArchivosServices.GetParametrosTransmision().subscribe(
      (result: ParametrosTransmisionData[]) => {  
        this.parametrosTransm = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notificacion.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );

  }

  selectRow(item: any) {
    this.selectedRow = item;
  }

  ValidarCampo(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  onProtocoloChange(): void {
    this.selectedProtocolo = 'SFTP';
    this.parametrosTransmisionForm.controls['protocolo'].setValue(this.selectedProtocolo);
  }

  onSubmit(): void {
    if (this.parametrosTransmisionForm.valid) {
      console.log(this.parametrosTransmisionForm.value);
    }
  }
}
