import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';
import { InformeClientesService } from '../../../../app/Services/Informes/informe-clientes.service';
import { LoginService } from '../../../Services/Login/login.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfiguracionNotificacion } from '../../../../environments/config.noticaciones';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { ClientesGetListService } from '../../../Services/Clientes/clientesGetList.service';
import { ToastrService } from 'ngx-toastr';
import { InformePersonasNaturalesComponent } from './informe-personas-naturales/informe-personas-naturales/informe-personas-naturales.component';
import { InformePersonasJuridicasComponent } from './informe-personas-juridicas/informe-personas-juridicas/informe-personas-juridicas.component';

declare var $: any;
@Component({
  selector: 'app-informe-clientes',
  templateUrl: './informe-clientes.component.html',
  styleUrls: ['./informe-clientes.component.css'],
  providers: [InformeClientesService, LoginService, ClientesGetListService, OperacionesService,ModuleValidationService],
  standalone : false
})

export class InformeClientesComponent implements OnInit {
  public valueSlect: string = "";
  public validaOperacion: Boolean = true;
  public OpcionSelected: Boolean = true;
  public Operaciones: any[] = [];
  public JuridicOrNatural: Boolean = false;
  public activefiltros: Boolean = false;
  public OperacionSelect: string = "";
  CodModulo : number = 76
  
  @ViewChild(InformePersonasNaturalesComponent) hijoNatural!: InformePersonasNaturalesComponent;
  @ViewChild(InformePersonasJuridicasComponent) hijoJuridico!: InformePersonasNaturalesComponent;

  ngAfterViewInit(){

  }

  //end valdiaciones
  constructor(private operacionesService: OperacionesService, private el: ElementRef, private moduleValidationService: ModuleValidationService, private notif: ToastrService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));

   }

  ngOnInit() {
    this.GetOperaciones();
    $('#select').focus().select();
    this.IrArriba();
  }
  GetOperaciones() {
    let datas = localStorage.getItem("Data")
    var resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    var arrayExample = [{
        IdModulo:  this.CodModulo,
        IdUsuario: resultDataStore.IdUsuario,
        IdPerfil: resultDataStore.UsuarioPerfil
      }];

    this.operacionesService.OperacionesPermitidas(JSON.stringify(arrayExample[0])).subscribe((result) =>
    {
      result.forEach((element : any) => {
        if (element.IdOperaciones == 88) // Informe naturales
          this.Operaciones.push(element);
        if (element.IdOperaciones == 89)  // Informe Juridicos
          this.Operaciones.push(element);
        });
      this.OpcionSelected = true;
    },(error) => {
      this.notif.error( "Error", error, ConfiguracionNotificacion.configRightTopNoClose );
    });
  }

  onChange(event : Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    setTimeout(() => {
      if(selectedValue === '89'){
        if(this.hijoJuridico){
          this.hijoJuridico.opcionSelected(event);
        }else{
          console.log('Comp hijo jurídico no disponible')
        }
      }else if(selectedValue === '88'){
        if(this.hijoNatural){
          this.hijoNatural.opcionSelected(event);
        }else{
          console.log('Comp hijo natural no disponible')
        }
      }
    }, 800);
  }

  operacionBlur() {
    if (this.valueSlect == "0") 
      this.validaOperacion = false;
  }
  opcionSelected1(valueSelect : string) {
    console.log(valueSelect)
    if (Number(valueSelect) == 0){
      this.validaOperacion = false;
    } else if(Number(valueSelect) == 88) {
      this.validaOperacion = true;
      this.JuridicOrNatural = true;
      this.activefiltros = false;
      $('#selectN').focus().select();
      this.OperacionSelect = "/Informe Naturales";
    } else if (Number(valueSelect) == 89) {
      this.JuridicOrNatural = false;
      this.activefiltros = false;
      this.validaOperacion = true;
      this.OperacionSelect = "/Informe Juridicos";
    }
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}


