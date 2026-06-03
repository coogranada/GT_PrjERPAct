import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { LlavesService } from '../../../../Services/Maestros/llaves.service';
import { AlertService } from '../../../../Services/Alert/alert.service';
import { LoadingService } from '../../../../Services/shared/loading.service';
declare var $: any;
@Component({
  selector: 'app-llaves',
  templateUrl: './llaves.component.html',
  styleUrls: ['./llaves.component.css'],
  providers : [LlavesService,ModuleValidationService],
  standalone : false
})
export class LlavesComponent implements OnInit {
  private CodModulo = 68;
  public llaveForm!: FormGroup;
  dataLlavesResult: any[] = [];
  dataListProveedores: any[] = [];
  generateBool: boolean = false;
  showForm: boolean = false;
  llavePA: string = "";
  llavePB: string = "";
  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';

  constructor(private llavesService: LlavesService, private notif: AlertService,
    private el: ElementRef, private moduleValidationService: ModuleValidationService, 
    private loading: LoadingService
  ) { 
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {
    this.InitForm();
    this.moduleValidationService.validarLocalPermisos(this.CodModulo);
    this.GetLlaves();
    this.GetProveedores();
  }
  InitForm() {
    this.llaveForm = new FormGroup({
      id: new FormControl('', []),
      proveedorId:  new FormControl('', []),
      proveedor:  new FormControl('', [Validators.required]),
      llaveTranA: new FormControl('', [Validators.required]),
      llaveTranB: new FormControl('', [Validators.required]),
      tipoLlave: new FormControl({ value: "Llave Transaccional", disabled: true }, [Validators.required]),
      observacionLlaveA: new FormControl('', [Validators.required]),
      observacionLlaveB: new FormControl('', [Validators.required]),
      hash: new FormControl('',[]),
      llavePA :  new FormControl({value : this.llavePA, disabled: true  }, [Validators.required]), 
      llavePB :  new FormControl({value : this.llavePB ,disabled: true }, [Validators.required]), 
    });
  }
  GetLlaves() {
    this.loading.show();
    this.generateBool = false;
    this.llavesService.GetLlaves().subscribe((x : any[])=> {
      console.log(x);
      this.dataLlavesResult = x[0];
      if (x.length == 2) {
        let llavesP: any[] = x[1];
        if (llavesP.length > 0) {
          this.llavePA = llavesP[0].Name;
          this.llaveForm.controls["llavePA"].setValue(this.llavePA);
        }
        if (llavesP.length > 1) {
          this.llavePB = llavesP[1].Name;
          this.llaveForm.controls["llavePB"].setValue(this.llavePB);
        }
      }
      this.loading.hide();
    }, error => {
      this.loading.hide();
      const errorMessage = <any>error;
      this.notif.onDanger('Error', errorMessage);
    });
  }
  CambiarLlaves() {
    this.loading.show();
    this.llavesService.CambiarLlavesPublicas(this.llavePA, this.llavePB).subscribe(x => {
      console.log("Actualizar", x);
      this.loading.hide();
      this.notif.onSuccess('Exitoso', "llaves públicas se actualizaron correctamente");
      this.GetLlaves();
    }, error => {
      this.loading.hide();
      this.GetLlaves();
      const errorMessage = <any>error;
      this.notif.onDanger('Error', errorMessage);
    });
  }
  GetGenerarLlaves() {
    this.loading.show();
    this.llavesService.GetGenerarLlaves().subscribe((x : any[]) => {
      console.log(x);
      if (x.length > 0) {
        this.llavePA = x[0];
        this.llaveForm.controls["llavePA"].setValue(this.llavePA);
      }
      if (x.length > 1) {
        this.llavePB = x[1];
        this.llaveForm.controls["llavePB"].setValue(this.llavePB);
      } 
      if (x.length > 0 && x.length > 1) 
        this.generateBool = true;
      this.loading.hide();
    }, error => {
      this.loading.hide();
      const errorMessage = <any>error;
      this.notif.onDanger('Error', errorMessage);
    });
  }
  GuardarLlaves() {
    this.loading.show();
    let payload: any = {
      Nit : this.llaveForm.controls["proveedor"].value,
      TipoLlave : 2,// this.llaveForm.controls["tipoLlave"].value,
      LlavePA: this.llaveForm.controls["llavePA"].value,
      LlavePB : this.llaveForm.controls["llavePB"].value,
      ObservacionA : this.llaveForm.controls["observacionLlaveA"].value,
      ObservacionB : this.llaveForm.controls["observacionLlaveB"].value,
      llaveTranA : this.llaveForm.controls["llaveTranA"].value,
      llaveTranB : this.llaveForm.controls["llaveTranB"].value
    }
    this.llavesService.GuardarLlaves(payload).subscribe(x => {
      console.log(x);
      this.loading.hide();
      this.notif.onSuccess('Exitoso', x);
      this.Clear();
      this.GetLlaves();
    }, error => {
      this.loading.hide();
      this.GetLlaves();
      const errorMessage = <any>error;
      this.notif.onDanger('Error', errorMessage);
    });
  }
  GetProveedores() {
    this.loading.show();
    this.llavesService.GetProveedores().subscribe(x => {
      console.log(x);
      this.dataListProveedores = x;
      this.loading.hide();
    }, error => {
      this.loading.hide();
      this.GetLlaves();
      const errorMessage = <any>error;
      this.notif.onDanger('Error', errorMessage);
    });
  }
  Back() {
    this.InitForm();
      setTimeout(() => {
        this.GetLlaves();
      },300);
  }
  Clear() {
    this.showForm = false;
    this.InitForm();
  }
}
