import { Component, OnInit } from '@angular/core';
import { GestionesService } from '../../../Services/Gestiones/gestiones.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ExcelService } from '../../../Services/General/excel.service';
import { Estados } from '../../../../environments/Estados';
import { ExportExcelModel } from '../../../Models/Clientes/Juridicos/ExportExcel.Model';
import moment from 'moment';
import { Router } from '@angular/router';
import { LoginService } from '../../../Services/Login/login.service';
import { ModulosService } from '../../../Services/Maestros/modulos.service';
import { NgxToastService } from 'ngx-toast-notifier';
// import moment = require('moment');

@Component({
  selector: 'app-info-gestion-operaciones',
  templateUrl: './info-gestion-operaciones.component.html',
  styleUrls: ['./info-gestion-operaciones.component.css'],
  providers: [GestionesService, ExcelService,
    LoginService, ModulosService],
    standalone : false
})
export class InfoGestionOperacionesComponent implements OnInit {
  //#region Declaracion de variables
  public loading = false;
  public ListaGestiones : any[] = [];
  public Gestiones : any;
  public GestionesPendientes = [] = [];
  public GestionesGestionadas = [] = [];
  public GestionesEnviadasPendientes = [] = [];
  public GestionesEnviadasGestionadas = [] = [];
  public ListaFiltrada = [] = [];
  public ListaCompleta = [] = [];
  public ListaFechas = [] = [];
  public ListaEstados = [] = [];
  public ListaUsuarios : any[] = [];
  public EstadosGestion : any[] = [];
  public UsuariosAutorizados = [] = [];
  public UsuariosRemitentes : any[] = [];
  public UsuariosDestinatarios : any[] = [];
  public UsuariosRemitentesArray : any[] = [];
  public UsuariosDestinatariosArray : any[] = [];
  public InfoGestionesOperacionesForm!: FormGroup;
  public dataModulos = [] = [];
  public DatosUsuario : any;
  public dataTrasabilidad : any[] = [];
  //#endregion fin
  constructor(private gestionesService: GestionesService, private notificacion: NgxToastService,
    private excelService: ExcelService, private loginService: LoginService, private router: Router, private modulosService: ModulosService) {
      let data = localStorage.getItem('Data');
      this.DatosUsuario = JSON.parse(window.atob(data == null ? "" : data));
   }

  ngOnInit() {
    this.CargarEstados();
    this.ValidarFormulario();
    this.Obtener();
    this.ObtenerUsuariosAutorizadosAll();
    this.GetModulo();
    this.IrArriba();
  }

  //#region  de carga
  Obtener() {
    this.CargarEstados();
    this.ListaGestiones = [];
    // this.GestionesPendientes = [];
    // this.GestionesGestionadas = [];
    // this.GestionesEnviadasPendientes = [];
    // this.GestionesEnviadasGestionadas = [];
    this.loading = true;

    this.gestionesService.ObtenerAll().subscribe(
      result => {
        this.loading = false;

        this.ListaGestiones = result;
        if (this.ListaGestiones === null || this.ListaGestiones === undefined) {
          this.notificacion.onWarning('Advertencia', 'No se encontró información.');
        }
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );

    this.loginService.GetSesionXUsuario(this.DatosUsuario.IdUsuario).subscribe(
      result => {
        if (!result.Estado) {
          this.router.navigateByUrl('/Login');
          localStorage.clear();
        }
      }
    );
  }

  ObtenerUsuariosAutorizadosAll() {
    this.gestionesService.ObtenerAll().subscribe(
      result => {
        this.loading = false;
        this.ListaGestiones = result;
        this.loading = true;
        this.gestionesService.ObtenerUsuariosAutorizadosAll().subscribe(
          resultUsuarios => {
            this.loading = false;
            this.UsuariosAutorizados = resultUsuarios;
            resultUsuarios.forEach((elementUser : any) => {
              this.ListaGestiones.forEach(elementGestion => {
                if (elementGestion.IdUsuarioSolicita === elementUser.IdUsuario) {
                  // if (this.UsuariosAutorizados !== null && this.UsuariosAutorizados !== undefined) {
                  this.UsuariosRemitentesArray.push(elementUser);
                  // }
                }
                if (elementGestion.IdUsuarioRecibe === elementUser.IdUsuario) {
                  // if (this.UsuariosAutorizados !== null && this.UsuariosAutorizados !== undefined) {
                  this.UsuariosDestinatariosArray.push(elementUser);
                  // }
                }
              });
            });

            this.UsuariosRemitentes = Array.from(new Set(this.UsuariosRemitentesArray.map(r => r.IdUsuario)))
              .map(IdUsuario => {
                return {
                  IdUsuarioRemite: IdUsuario,
                  Nombre: this.UsuariosRemitentesArray.find(s => s.IdUsuario === IdUsuario).Nombre.replace(/,/g, ' ')
                };
              });

            console.log(this.UsuariosRemitentes );

            this.UsuariosDestinatarios = Array.from(new Set(this.UsuariosDestinatariosArray.map(r => r.IdUsuario)))
              .map(IdUsuario => {
                return {
                  IdUsuarioDestino: IdUsuario,
                  Nombre: this.UsuariosDestinatariosArray.find(s => s.IdUsuario === IdUsuario).Nombre.replace(/,/g, ' ')
                };
              });

            console.log(this.UsuariosDestinatarios);

          },
          error => {
            this.loading = false;
            const errorJson = JSON.parse(error._body);
            this.notificacion.onDanger('Error', errorJson);
            console.log(error);
          });
      });
  }
  //#endregion fin

  //#region  Metodos Filtros
  FiltrarResultados() {
    // this.Obtener();
    // this.ListaCompleta = this.ListaGestiones;
    this.ListaGestiones = [];

    const remite = this.InfoGestionesOperacionesForm.controls["UsuarioRemite"].value;
    const destino = this.InfoGestionesOperacionesForm.controls["UsuarioDestino"].value;
    const estado = this.InfoGestionesOperacionesForm.controls["Estado"].value;
    const incial = this.InfoGestionesOperacionesForm.controls["FechaInicial"].value;
    const final = this.InfoGestionesOperacionesForm.controls["FechaFinal"].value;

    this.gestionesService.ObtenerAll().subscribe((result : any)=> {
        this.loading = false;
        this.ListaGestiones = result;
        if (this.ListaGestiones === null || this.ListaGestiones === undefined) {
          this.notificacion.onWarning('Advertencia', 'No se encontró información.');
        } else {
          if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite === '' || remite === null || remite === undefined)
            && (destino === '' || destino === null || destino === undefined)
            && (estado === '' || estado === null || estado === undefined)) {
            const usuariosLst = this.FiltrarPorFechas(incial, final);
            this.ListaGestiones = usuariosLst;
          } else if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite === '' || remite === null || remite === undefined)
            && (destino === '' || destino === null || destino === undefined)
            && (estado !== '' && estado !== null && estado !== undefined)) {
            const usuariosLst = this.FiltrarFechasPorEstado(incial, final, estado);
            this.ListaGestiones = usuariosLst;
          } else if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite !== '' && remite !== null && remite !== undefined)
            && (destino === '' || destino === null || destino === undefined)
            && (estado === '' || estado === null || estado === undefined)) {
            const usuariosLst = this.FiltrarFechasPorUsuarioReimte(incial, final, remite);
            this.ListaGestiones = usuariosLst;
          } else if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite === '' || remite === null || remite === undefined)
            && (destino !== '' && destino !== null && destino !== undefined)
            && (estado === '' || estado === null || estado === undefined)) {
            const usuariosLst = this.FiltrarFechasPorUsuarioDestino(incial, final, destino);
            this.ListaGestiones = usuariosLst;
          } else if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite !== '' && remite !== null && remite !== undefined)
            && (destino !== '' && destino !== null && destino !== undefined)
            && (estado === '' || estado === null || estado === undefined)) {
            const usuariosLst = this.FiltrarFechasPorUsuarioDestinoRemite(incial, final, remite, destino);
            this.ListaGestiones = usuariosLst;
          } else if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite !== '' && remite !== null && remite !== undefined)
            && (destino === '' || destino === null || destino === undefined)
            && (estado !== '' && estado !== null && estado !== undefined)) {
            const usuariosLst = this.FiltrarFechasPorEstadoUsuarioRemite(incial, final, estado, remite);
            this.ListaGestiones = usuariosLst;
          } else if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite === '' || remite === null || remite === undefined)
            && (destino !== '' && destino !== null && destino !== undefined)
            && (estado !== '' && estado !== null && estado !== undefined)) {
            const usuariosLst = this.FiltrarFechasPorEstadoUsuarioDestino(incial, final, estado, destino);
            this.ListaGestiones = usuariosLst;
          } else if ((incial !== '' && incial !== null && incial !== undefined)
            && (final !== '' && final !== null && final !== undefined)
            && (remite !== '' && remite !== null && remite !== undefined)
            && (destino !== '' && destino !== null && destino !== undefined)
            && (estado !== '' && estado !== null && estado !== undefined)) {
            const usuariosLst = this.FiltrarFechasPorEstadoPorUsuarios(incial, final, estado, remite, destino);
            this.ListaGestiones = usuariosLst;
          } else if ((incial === '' || incial === null || incial === undefined)
            && (final === '' || final === null || final === undefined)
            && (remite !== '' && remite !== null && remite !== undefined)
            && (destino !== '' && destino !== null && destino !== undefined)
            && (estado === '' || estado === null || estado === undefined)) {
            const usuariosLst = this.FiltrarPorUsuarios(remite, destino);
            this.ListaGestiones = usuariosLst;
          } else if ((incial === '' || incial === null || incial === undefined)
            && (final === '' || final === null || final === undefined)
            && (remite !== '' && remite !== null && remite !== undefined)
            && (destino === '' || destino === null || destino === undefined)
            && (estado === '' || estado === null || estado === undefined)) {
            const usuariosLst = this.FiltrarPorUsuarioRemite(remite);
            this.ListaGestiones = usuariosLst;
          } else if ((incial === '' || incial === null || incial === undefined)
            && (final === '' || final === null || final === undefined)
            && (remite === '' || remite === null || remite === undefined)
            && (destino !== '' && destino !== null && destino !== undefined)
            && (estado === '' || estado === null || estado === undefined)) {
            const usuariosLst = this.FiltrarPorUsuarioDestino(destino);
            this.ListaGestiones = usuariosLst;
          } else if ((incial === '' || incial === null || incial === undefined)
            && (final === '' || final === null || final === undefined)
            && (remite !== '' && remite !== null && remite !== undefined)
            && (destino === '' || destino === null || destino === undefined)
            && (estado !== '' && estado !== null && estado !== undefined)) {
            const usuariosLst = this.FiltrarPorUsuarioRemiteEstado(remite, estado);
            this.ListaGestiones = usuariosLst;
          } else if ((incial === '' || incial === null || incial === undefined)
            && (final === '' || final === null || final === undefined)
            && (remite === '' || remite === null || remite === undefined)
            && (destino !== '' && destino !== null && destino !== undefined)
            && (estado !== '' && estado !== null && estado !== undefined)) {
            const usuariosLst = this.FiltrarPorUsuarioDestinoEstado(destino, estado);
            this.ListaGestiones = usuariosLst;
          } else if ((incial === '' || incial === null || incial === undefined)
            && (final === '' || final === null || final === undefined)
            && (remite === '' || remite === null || remite === undefined)
            && (destino === '' || destino === null || destino === undefined)
            && (estado !== '' && estado !== null && estado !== undefined)) {
            const usuariosLst = this.FiltrarPorEstado(estado);
            this.ListaGestiones = usuariosLst;
          }
          return this.ListaGestiones;
        }
        return null;
      },
      error => {
        this.loading = false;
        const errorJson = JSON.parse(error._body);
        this.notificacion.onDanger('Error', errorJson);
        console.log(error);
      }
    );
  }

  FiltrarPorUsuarios(usuarioRemite : any, usuarioDestino : any) {
    this.ListaUsuarios = [];
    this.ListaGestiones.forEach(elementLista => {

      if ((elementLista.IdUsuarioSolicita === usuarioRemite.IdUsuarioRemite)
        && (elementLista.IdUsuarioRecibe === usuarioDestino.IdUsuarioDestino)) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarPorUsuarioRemite(usuarioRemite : any) {
    this.ListaUsuarios = [];
    this.ListaGestiones.forEach(elementLista => {
      if (elementLista.IdUsuarioSolicita === usuarioRemite.IdUsuarioRemite) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarPorUsuarioDestino(usuarioDestino : any) {
    this.ListaUsuarios = [];
    this.ListaGestiones.forEach(elementLista => {
      if (elementLista.IdUsuarioRecibe === usuarioDestino.IdUsuarioDestino) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarPorUsuarioRemiteEstado(usuarioRemite : any, estado : number) {
    this.ListaUsuarios = [];
    this.ListaGestiones.forEach(elementLista => {
      if ((elementLista.IdUsuarioSolicita === usuarioRemite.IdUsuarioRemite)
        && elementLista.IdEstado === +estado) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarPorUsuarioDestinoEstado(usuarioDestino : any, estado : any) {
    this.ListaUsuarios = [];
    this.ListaGestiones.forEach(elementLista => {
      if ((elementLista.IdUsuarioRecibe === usuarioDestino.IdUsuarioDestino)
        && elementLista.IdEstado === +estado) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }

  FiltrarPorEstado(estado : number) {
    this.ListaUsuarios = [];
    this.ListaGestiones.forEach(elementLista => {
      if (elementLista.IdEstado === +estado) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }

  FiltrarPorFechas(incial : any, final : any) {
    this.ListaUsuarios = [];
    const IniDate = new Date(moment(new Date(`${incial} 00: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    const EndDate = new Date(moment(new Date(`${final} 24: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate ) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarFechasPorEstado(incial : any, final : any, estado : number) {
    this.ListaUsuarios = [];
    const IniDate = new Date(moment(new Date(`${incial} 00: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    const EndDate = new Date(moment(new Date(`${final} 24: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate && elementLista.IdEstado === +estado) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarFechasPorUsuarioReimte(incial : any, final : any, usuarioRemite : any) {
    this.ListaUsuarios = [];
    const IniDate = new Date(moment(new Date(`${incial} 00: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    const EndDate = new Date(moment(new Date(`${final} 24: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate &&
        (elementLista.IdUsuarioSolicita === usuarioRemite.IdUsuarioRemite)) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarFechasPorUsuarioDestino(incial : any, final : any, usuarioDestino : any) {
    this.ListaUsuarios = [];
    const IniDate = new Date(moment(new Date(`${incial} 00: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    const EndDate = new Date(moment(new Date(`${final} 24: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate &&
        (elementLista.IdUsuarioRecibe === usuarioDestino.IdUsuarioDestino)) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarFechasPorUsuarioDestinoRemite(incial : any, final : any, usuarioRemite : any, usuarioDestino : any) {
    this.ListaUsuarios = [];
    const IniDate = new Date(incial);
    const EndDate = new Date(final);
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate
        && (elementLista.IdUsuarioRecibe === usuarioDestino.IdUsuarioDestino)
        && (elementLista.IdUsuarioSolicita === usuarioRemite.IdUsuarioRemite)) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarFechasPorEstadoUsuarioRemite(incial : any, final : any, estado : number, usuarioRemite : any) {
    this.ListaUsuarios = [];
    const IniDate = new Date(moment(new Date(`${incial} 00: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    const EndDate = new Date(moment(new Date(`${final} 24: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate
        && elementLista.IdEstado === +estado
        && (elementLista.IdUsuarioSolicita === usuarioRemite.IdUsuarioRemite)) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarFechasPorEstadoUsuarioDestino(incial : any, final : any, estado : number, usuarioDestino : any) {
    this.ListaUsuarios = [];
    const IniDate = new Date(incial);
    const EndDate = new Date(final);
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate
        && elementLista.IdEstado === +estado
        && (elementLista.IdUsuarioRecibe === usuarioDestino.IdUsuarioDestino)) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }
  FiltrarFechasPorEstadoPorUsuarios(incial : any, final : any, estado : number, usuarioRemite : any, usuarioDestino : any) {
    this.ListaUsuarios = [];
    const IniDate = new Date(moment(new Date(`${incial} 00: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    const EndDate = new Date(moment(new Date(`${final} 24: 00: 00`)).format('YYYY-MM-DD HH:mm:ss'));
    this.ListaGestiones.forEach(elementLista => {
      const LstDate = new Date(elementLista.FechaSolicitud);
      if (LstDate >= IniDate && LstDate <= EndDate
          && elementLista.IdEstado === +estado
          && (elementLista.IdUsuarioSolicita === usuarioRemite.IdUsuarioRemite)
          && (elementLista.IdUsuarioRecibe === usuarioDestino.IdUsuarioDestino)) {
        this.ListaUsuarios.push(elementLista);
      }
    });
    return this.ListaUsuarios;
  }

  limpiarFiltros() {
    this.InfoGestionesOperacionesForm.reset();
    this.Obtener();
  }
  //#endregion Fin
  
  //#region  Metodos funcionales
  exportAsXLSX(): void {
    // aqui organizar un modelo para el Excel

    const objExcelArry: ExportExcelModel[] = [];
    this.ListaGestiones.forEach(element => {
      const objExcel = new ExportExcelModel();
      objExcel.Codigo = element.IdGestionOperacion;
      objExcel.Documento = element.Documento;
      objExcel.Cuenta = element.Cuenta;

      this.dataModulos.forEach((elementModulo : any) => {
        if (elementModulo.IdModulo === element.IdModulo ) {
          objExcel.Modulo = elementModulo.Nombre;
        }
      });

      objExcel.Operacion = element.NombreOperacion;
      if (element.IdEstado === 5546) {
        objExcel.Estado = 'Rechazada';
      } else if (element.IdEstado === 5544) {
        objExcel.Estado = 'Cancelada';
      } else if (element.IdEstado === 5543) {
        objExcel.Estado = 'Gestionada';
      } else if (element.IdEstado === 5542) {
        objExcel.Estado = 'Pendiente';
      }
      
      objExcel.Remitente = element.NombreUsuarioSolicita;
      objExcel.FechaSolicitud = element.FechaSolicitud;
      objExcel.Destinatario = element.NombreUsuarioRecibe;
      objExcel.FechaActualizacion = element.FechaActualizacion;
   
      objExcel.Observacion = element.Observacion;
      objExcel.ObservacionGestion = element.ObservacionGestion;
     

      

      objExcelArry.push(objExcel);
    });
    this.excelService.exportAsExcelFile(objExcelArry, 'gestion-operaciones');
  }

  CargarEstados() {
    this.EstadosGestion = [];
    this.EstadosGestion.push(+Estados.GO_Cancelada);
    this.EstadosGestion.push(+Estados.GO_Gestionada);
    this.EstadosGestion.push(+Estados.GO_Pendiente);
    this.EstadosGestion.push(+Estados.GO_Rechazada);

  }

  ValidarFormulario() {
    const IdUsuario = new FormControl('', []);
    const filtrarTabla = new FormControl('', []);
    const FechaFinal = new FormControl('', []);
    const FechaInicial = new FormControl('', []);
    const Estado = new FormControl('', []);
    const Usuario = new FormControl('', []);
    const UsuarioRemite =  new FormControl('', []);
    const UsuarioDestino =  new FormControl('', []);


    this.InfoGestionesOperacionesForm = new FormGroup({
      IdUsuario: IdUsuario,
      filtrarTabla: filtrarTabla,
      FechaInicial: FechaInicial,
      Estado: Estado,
      Usuario: Usuario,
      FechaFinal: FechaFinal,
      UsuarioRemite: UsuarioRemite,
      UsuarioDestino: UsuarioDestino,
    });
  }

  GetModulo() {
    this.loading = true;
    this.modulosService.getModulos().subscribe(
      result => {
        this.loading = false;
        this.dataModulos = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.error(errorMessage);
      }
    );
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  AbrirTrazabilidad(opera : string) {
    this.loading = true;
    this.gestionesService.GetTrazabilidad(opera).subscribe(
      result => {
        this.loading = false;
        this.dataTrasabilidad = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.error(errorMessage);
      }
    )

  }

  ResetTrasabilidad() {
    this.dataTrasabilidad = [];
  }
   //#endregion Fin
}
