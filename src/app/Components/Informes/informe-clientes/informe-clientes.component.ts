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
  operacionBlur() {
    if (this.valueSlect == "0") 
      this.validaOperacion = false;
  }
  opcionSelected(valueSelect : string) {
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
}


