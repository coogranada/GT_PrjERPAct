import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generacion-archivos',
  templateUrl: './generacion-archivos.component.html',
  styleUrl: './generacion-archivos.component.css',
  standalone : false
})
export class GeneracionArchivosComponent implements OnInit  {
  vbleBtnactualizar : boolean = false;
  constructor(private fb: FormBuilder){}
  ngOnInit(): void {
    this.initForm();
  }
  public GeneracionAForm!: FormGroup;
  initForm() {
    this.GeneracionAForm = this.fb.group({
      IdParametrosArchivos: [''],
      ParametrosArchivos : ['', Validators.required],
      NombreSP: ['', Validators.required],
      Estado : [0],
      Frecuencia: [1],

      DiaInicial: ['', Validators.required],
      DiaFinal: ['', Validators.required],

      NombreSalida: ['', Validators.required],

      Separador: ['', Validators.required],
      FormatoFecha :  ['', Validators.required],
      TipoDeArchivo : ['', Validators.required],
      DiaGenera : ['', Validators.required],
      HoraGenera : ['', Validators.required],
      RutaLocalSalida : ['', Validators.required],
      fechaCreacion: [''],
      //eliminaArchivo: [0]
    });
  }
  borrarSiEspacios(controlName: string): void {
    const control = this.GeneracionAForm.controls[controlName];

    if (control.value.trim() === '') {
      control.setValue('');
    }
  }
  limpiarFormulario(): void {
    this.initForm();
    this.vbleBtnactualizar = false;
  }
  onChangeProtocol(op: number): void {
    // if (this.parametrosTransmisionForm.get('protocolo')?.value == 'SFTP') {
    //   this.vbleCifrado = true;
    // } else {
    //   this.vbleCifrado = false;
    // }

    // if (op == 1) {
    //   if (this.parametrosTransmisionForm.get('protocolo')?.value == 'SFTP') {
    //     this.parametrosTransmisionForm.controls['cifrado'].setValue('');
    //     this.parametrosTransmisionForm.controls['gpgRecipient'].setValue('');
    //   } else {
    //     this.parametrosTransmisionForm.controls['cifrado'].setValue('');
    //     this.parametrosTransmisionForm.controls['gpgRecipient'].setValue('');
    //   }
    // }

  }
}
