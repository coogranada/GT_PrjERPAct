import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { EnvioMotivoModel } from '../../../Models/Clientes/motivoRetiro.model';
import { ClientesService } from '../../../Services/Clientes/clientes.service';
import { ClientesGetListService } from '../../../Services/Clientes/clientesGetList.service';
import { JuridicosService } from '../../../Services/Clientes/Juridicos.service';
declare var $: any;
@Component({
  selector: 'app-solicitud-retiro',
  templateUrl: './solicitud-retiro.component.html',
  styleUrls: ['./solicitud-retiro.component.css'],
  providers: [ ClientesService, ClientesGetListService, JuridicosService],
  standalone : false
})

export class SolicitudRetiroComponent implements OnInit {
  @ViewChild('abrirSolicituRetiro', { static: true }) private abirFormatoRetiro!: ElementRef;
  @Input() informacionRetiro: any;
  @Input() infoRetiroReimprimir: any;
  @Input() motivosData: any;

  public _informacionRetiro: any;
  public _infoRetiroReimprimir: any;
  public dataMotivos: any;
  public objInfoRetiro = new EnvioMotivoModel();
  public dataRetiro: any[] = [];
  public dataCiudad: any;
  public reimpresionActiva = false;

  constructor(
    private clientesService: ClientesService,
    private clientesGetListService: ClientesGetListService,
    private juridicosService: JuridicosService,
  ) { }

  ngOnInit() {
 
  }

  reimprimir(idTercero : string, idSolicitud : string) {
    this.reimpresionActiva = true;
    this.clientesService.GetRetirosLogXId(idTercero, idSolicitud).subscribe(
      result => {
        this.dataRetiro = result;
        this._informacionRetiro = this.dataRetiro;
        console.log(this._informacionRetiro);
        this.objInfoRetiro.Nombre = this._informacionRetiro.NameTercero;
        this.objInfoRetiro.NombreAsesor = this._informacionRetiro.IdAsesor;
        this.objInfoRetiro.Documento = this._informacionRetiro.Documento;
        this.objInfoRetiro.Direccion = this._informacionRetiro.Direccion;
        this.objInfoRetiro.Empresa = this._informacionRetiro.Empresa;

        this.objInfoRetiro.Motivo = result.MotivoRetiro;
        this.objInfoRetiro.Otro = result.DescripcionOtro;
        this.clientesGetListService.GetCiudad('C').subscribe(
          resultCiu => {
            resultCiu.forEach((element : any) => {
              if (element.IdCiudad === this._informacionRetiro.Ciudad) {
                this.objInfoRetiro.CiudadExpedicion = element.Nombre;
              }
            });
          });

        if (this._informacionRetiro.Celular !== undefined) {
          this.objInfoRetiro.Celular = this._informacionRetiro.Celular;
        } else {
          this.objInfoRetiro.Celular = 'N/A';
        }

        if (this._informacionRetiro.Email !== undefined) {
          this.objInfoRetiro.Email = this._informacionRetiro.Email;
        } else {
          this.objInfoRetiro.Email = 'N/A';
        }
        if (this._informacionRetiro.Telefono !== undefined) {
          this.objInfoRetiro.Telefono = this._informacionRetiro.Telefono;
        } else {
          this.objInfoRetiro.Telefono = 'N/A';
        }
        if (this._informacionRetiro.TelefonoEmpresa !== undefined) {
          this.objInfoRetiro.TelefonoEmpresa = this._informacionRetiro.TelefonoEmpresa;
        } else {
          this.objInfoRetiro.TelefonoEmpresa = 'N/A';
        }

        this.abirFormatoRetiro.nativeElement.click();
      });
  }

  reimprimirJuridico(idjuridico : string, idSolicitud : string) {
    this.reimpresionActiva = true;
    this.juridicosService.GetRetirosJuridicoLogxId(idjuridico, idSolicitud).subscribe(
      result => {
        this.dataRetiro = result;
        this._informacionRetiro = this.dataRetiro;

        this.objInfoRetiro.Nombre = this._informacionRetiro.NameTercero;
        this.objInfoRetiro.NombreAsesor = this._informacionRetiro.IdAsesor;
        this.objInfoRetiro.Documento = this._informacionRetiro.Documento;
        this.objInfoRetiro.Direccion = this._informacionRetiro.Direccion;
        this.objInfoRetiro.Empresa = this._informacionRetiro.Empresa;

        this.objInfoRetiro.Motivo = result.MotivoRetiro;
        this.objInfoRetiro.Otro = result.DescripcionOtro;
        this.clientesGetListService.GetCiudad('C').subscribe(
          resultCiu => {
            resultCiu.forEach((element : any) => {
              if (element.IdCiudad === this._informacionRetiro.Ciudad) {
                this.objInfoRetiro.CiudadExpedicion = element.Nombre;
              }
            });
          });

        if (this._informacionRetiro.Celular !== undefined) {
          this.objInfoRetiro.Celular = this._informacionRetiro.Celular;
        } else {
          this.objInfoRetiro.Celular = 'N/A';
        }

        if (this._informacionRetiro.Email !== undefined) {
          this.objInfoRetiro.Email = this._informacionRetiro.Email;
        } else {
          this.objInfoRetiro.Email = 'N/A';
        }
        if (this._informacionRetiro.Telefono !== undefined) {
          this.objInfoRetiro.Telefono = this._informacionRetiro.Telefono;
        } else {
          this.objInfoRetiro.Telefono = 'N/A';
        }
        if (this._informacionRetiro.TelefonoEmpresa !== undefined) {
          this.objInfoRetiro.TelefonoEmpresa = this._informacionRetiro.TelefonoEmpresa;
        } else {
          this.objInfoRetiro.TelefonoEmpresa = 'N/A';
        }

        this.abirFormatoRetiro.nativeElement.click();
      });
  }

  abrirRetiro() {
    this.reimpresionActiva = false;
    this._informacionRetiro = JSON.parse(this.informacionRetiro);
    console.log(this._informacionRetiro);
    this.objInfoRetiro.Nombre = this._informacionRetiro.Nombre;
    this.objInfoRetiro.NombreAsesor = this._informacionRetiro.NombreAsesor;
    this.objInfoRetiro.Documento = this._informacionRetiro.Documento;
    if (this._informacionRetiro.Celular !== undefined) {
      this.objInfoRetiro.Celular = this._informacionRetiro.Celular;
    } else {
      this.objInfoRetiro.Celular = 'N/A';
    }
    this.objInfoRetiro.Direccion = this._informacionRetiro.Direccion;
    if (this._informacionRetiro.Email !== undefined) {
      this.objInfoRetiro.Email = this._informacionRetiro.Email;
    } else {
      this.objInfoRetiro.Email = 'N/A';
    }
    if (this._informacionRetiro.Telefono !== undefined) {
      this.objInfoRetiro.Telefono = this._informacionRetiro.Telefono;
    } else {
      this.objInfoRetiro.Telefono = 'N/A';
    }
    if (this._informacionRetiro.TelefonoEmpresa !== undefined) {
      this.objInfoRetiro.TelefonoEmpresa = this._informacionRetiro.TelefonoEmpresa;
    } else {
      this.objInfoRetiro.TelefonoEmpresa = 'N/A';
    }
    this.objInfoRetiro.Empresa = this._informacionRetiro.Empresa;
    if (this._informacionRetiro.CiudadExpedicion !== undefined) {
      this.objInfoRetiro.CiudadExpedicion = this._informacionRetiro.CiudadExpedicion;
    } else {
      this.objInfoRetiro.CiudadExpedicion = 'N/A';
    }
    
    this.objInfoRetiro.IdMotivo = this._informacionRetiro.Motivo;
    this.objInfoRetiro.Otro = this._informacionRetiro.Otro;
    this.motivosData.forEach((element : any) => {
      if (element.IdRazonRetiro === +this.objInfoRetiro.IdMotivo) {
        this.objInfoRetiro.Motivo = element.Descripcion;
      }
    });
    this.abirFormatoRetiro.nativeElement.click();
  }
  print() {
    $('#printSolicitudRetiro').printArea();
  }
}
