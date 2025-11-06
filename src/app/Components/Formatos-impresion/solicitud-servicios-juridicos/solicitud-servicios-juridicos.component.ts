import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { JuridicosService } from '../../../Services/Clientes/Juridicos.service';
import {
  ServicioSolicitadoModel, InformacionPersonal, UbicacionEmpresa, InfoRepresentateLegal,
  InformacionFinanciera, InformacionAccionistas, InformacionEntrevista, InformacionReferencias
} from '../../../Models/Clientes/Juridicos/SolicitudImpresionModel';
import { formatDate } from '@angular/common';
import { ClientesGetListService } from '../../../Services/Clientes/clientesGetList.service';
import { AlertService } from '../../../Services/Alert/alert.service';
import { HtmlToService } from '../../../Services/Utilidades/html-to.service';
import { PrintService } from '../../../Services/General/print.service';
import Swal from 'sweetalert2';
import { ClientesService } from '../../../Services/Clientes/clientes.service';
import { GeneralesService } from '../../../Services/Productos/generales.service';

@Component({
  selector: 'app-solicitud-servicios-juridicos',
  templateUrl: './solicitud-servicios-juridicos.component.html',
  styleUrls: ['./solicitud-servicios-juridicos.component.css'],
  providers: [JuridicosService],
  standalone : false
})
export class SolicitudServiciosJuridicosComponent implements OnInit {
  //#region  Variables de comunicacion
  @ViewChild('openSolicitud', { static: true }) private openSolicitud!: ElementRef;
  @Input() GetData : any;
  @Input() GetServiceSolicited : any;
  @Input() dataDivisas: any;
  @Input() dataPaises: any;
  @Input() EsReImpresion : any;
  @Input() serviciosForm : any;
  @ViewChild('openModalHojaVidaJuridico', { static: true }) private openModalHojaVida!: ElementRef;
  @ViewChild('hojaVidaAfiliadoJuridico', { static: true }) private hojaVidaAfiliado!: ElementRef;
  //#endregion
  //#region Variables de carga y otras
  blobUrl = '';
  servicios: {id: number; name: string }[] = [
    { id: 1, name: 'Vinculación' },
    { id: 2, name: 'Actualización de datos' },
    { id: 3, name: 'Crédito' }
  ]
  public mostrarImporta = true;
  public mostrarExporta = true;
  public mostrarGiros = true;
  public loading = false;
  public servicioSolicitado = new ServicioSolicitadoModel();
  public infoPersonal = new InformacionPersonal();
  public ubicacionEmpresa = new UbicacionEmpresa();
  public infoRepresentate = new InfoRepresentateLegal();
  public infoFinanciera = new InformacionFinanciera();
  public LstinfoAccionista: InformacionAccionistas[] = [];
  public infoAccionista = new InformacionAccionistas();
  public entrevista = new InformacionEntrevista();
  // public referenciaComercial = new InformacionReferencias();
  // public referenciaFinanciera = new InformacionReferencias();
  public LstinfoReferenciaComercial: InformacionReferencias[] = [];
  public LstinfoReferenciaFinanciera: InformacionReferencias[] = [];

  public condicion = false;
  public dataCIIU: any;
  public Servcredito: any;
  public servVinculacion: any;
  public ServActualiza: any;
  public conceptosResul: any[] = [];
  public totalPasivos: any;
  public tiposDocumento = [
    { Value: '1', Descripcion: 'Cedula' },
    { Value: '2', Descripcion: 'Extranjería Cedula' },
    { Value: '3', Descripcion: 'Nit' },
    { Value: '4', Descripcion: 'Tarjeta De Identidad' },
    { Value: '5', Descripcion: 'Nuip' },
    { Value: '7', Descripcion: 'Registro Civil' },
    { Value: '8', Descripcion: 'Otro' },
    { Value: '9', Descripcion: 'Pasaporte' }
  ];
  public Correspondencia = [
    { Value: '3', Descripcion: 'Correo electrónico' },
    { Value: '8', Descripcion: 'Dirección' }
  ];
  esReimpresa: any;
  fechaImpresion: any;
  showLoader = false;
  currentHdvBase64 = '';

  //#endregion

  constructor(private juridicosService: JuridicosService, private notif: AlertService,
    private clientesService: ClientesService,
    private clientesGetListService: ClientesGetListService,private printService: PrintService, private generalesService: GeneralesService) { }

  ngOnInit() {
    console.log('esto se muestra desde el formato de impresion');
    $('#ModalJuridicos').on('hidden.bs.modal', () => {
      // Restaurar el padding-right y el overflow
      document.body.style.paddingRight = '';  // Quitar padding extra
      document.body.style.overflow = '';      // Restaurar el overflow
    });
  }

  AbrirSolicitud(documento : string) {
    if (this.EsReImpresion) {
      this.esReimpresa = 'Reimpresión';
    } else {
      this.esReimpresa = '';
    }
    this.fechaImpresion = new Date();
    this.LimpiarDataImpresion();
    this.condicion = true;
    this.loading = true;
    this.juridicosService.BuscarJuridicosAll(documento, '*').subscribe(
      result => {
        console.log(result);
        this.CargarServicio(this.GetServiceSolicited);
        this.CargarSecciones(result);

        const juridicoInfoAll = {
          ...this.servicioSolicitado,
          ...this.infoPersonal,
          UbicacionEmpresa: this.ubicacionEmpresa,
          Representante: this.infoRepresentate,
          Financiera: this.infoFinanciera,
          Entrevista: this.entrevista,
          EsReimpresa: this.esReimpresa,
          Accionistas: this.LstinfoAccionista,
          ReferenciasComerciales: this.LstinfoReferenciaComercial,
          ReferenciasFinancieras: this.LstinfoReferenciaFinanciera
        } as any;
        Object.keys(juridicoInfoAll).forEach(key => {
          if(juridicoInfoAll[key] === null) juridicoInfoAll[key] = "";
        });
        this.juridicosService.GenerarPDFHojaVida(juridicoInfoAll).subscribe(
          async (blob) => {
            this.blobUrl = window.URL.createObjectURL(blob);
            this.hojaVidaAfiliado.nativeElement.setAttribute('src', this.blobUrl);
            this.openModalHojaVida.nativeElement.click();
            const dataUrl = await this.clientesService.blobToBase64(blob);
            this.currentHdvBase64 = dataUrl.split(',')[1];
          },
          (err) => {
            console.error(err);
          }
        );

      },
      error => {
        this.notif.onDanger('Error', 'Los datos no se cargaron correctamente - ' + error);
      }
    );
  }

  downloadPDF() { 
    const {  Oficina, idProceso } = this.GetServiceSolicited;
    const fileNames = {
      2: `ACTUALIZACION DATOS ASOCIADO ${this.infoPersonal.Nit}`,
      3: `CREDITO DEUDOR ${Oficina.toUpperCase()}`
    };
    const fileName = fileNames[idProceso as keyof typeof fileNames];
    const a = document.createElement('a');
    a.href = this.blobUrl;
    a.download = fileName;  
    a.click();
    window.URL.revokeObjectURL(this.blobUrl);

  }

  CargarServicio(dataService : any) {    
    this.servicioSolicitado = new ServicioSolicitadoModel();
    this.servicioSolicitado.Asesor = dataService.Asesor;
    this.servicioSolicitado.Oficina = dataService.Oficina;
    this.servicioSolicitado.DocumentoDeudor = dataService.DocumentoDeudor;
    this.servicioSolicitado.NombreDeudor = dataService.NombreDeudor;
    const idServicioSeleccionado = dataService.idProceso;
    this.servicioSolicitado.ServicioSolicitado = this.servicios.find(item => item.id == idServicioSeleccionado)?.name || '';
    this.servicioSolicitado.Destino = dataService.Destino?.StrNombre || dataService.Destino || '';
    
    if (dataService.Monto !== null && dataService.Monto !== undefined &&
      dataService.Monto !== '') {
      this.servicioSolicitado.MontoSolicitado = dataService.Monto;
    }
    if (dataService.Plazo !== null && dataService.Plazo !== undefined
      && dataService.Plazo !== '') {
      this.servicioSolicitado.PlazoDeseado = dataService.Plazo;
    }
    this.servicioSolicitado.RadicadoCredito = dataService.radicado;
  }

  CargarSecciones(dataPrint : any) {
    this.loading = false;
    
    this.infoPersonal.IdRelacion = dataPrint.BasicosDto.IdRelacion;
    this.infoPersonal.IdEstado = dataPrint.BasicosDto.IdEstado;
    this.infoPersonal.FechaActualizacion = dataPrint.BasicosDto.FechaModificacion;
    this.GetData.ListRelaciones.forEach((elementRela : any) => {
      if (elementRela.Clase === dataPrint.BasicosDto.IdRelacion) {
        this.infoPersonal.tipoUsuarioRelacion = elementRela.Descripcion;
      }
    });
    const fechaSolicitudFormat = formatDate(new Date, 'MM-dd-yyyy', 'en');
    const fechaSolicitud = new Date(fechaSolicitudFormat);
    this.infoPersonal.DiaSolicitud = fechaSolicitud.getDate().toString().padStart(2, '0');
    this.infoPersonal.MesSolicitud = (fechaSolicitud.getMonth() + 1).toString().padStart(2, '0');
    this.infoPersonal.YearSolicitud = fechaSolicitud.getFullYear().toString().padStart(2, '0');

    this.GetData.ListConocioCoogra.forEach((elementConocio : any) => {
      if (dataPrint.BasicosDto.ConocioCoogranada === +elementConocio.Value) {
        this.servicioSolicitado.ConocioCoogranada = elementConocio.Descripcion;
      }
    });

    //#region Carga la zona princpal de informacion basica hasta fecha
    this.infoPersonal.RazonSocial = dataPrint.JuridicoDto.RazonSocial;
    this.infoPersonal.Nit = dataPrint.JuridicoDto.Nit;
    this.infoPersonal.IdJuridico = dataPrint.JuridicoDto.IdJuridico;

    const fechaConstitucionFormat = formatDate(dataPrint.BasicosDto.FechaConstitucion, 'MM-dd-yyyy', 'en');
    const fechaConstitucion = new Date(fechaConstitucionFormat);
    this.infoPersonal.DiaConstitucion = fechaConstitucion.getDate().toString().padStart(2, '0');
    this.infoPersonal.MesConstitucion = (fechaConstitucion.getMonth() + 1).toString().padStart(2, '0');
    this.infoPersonal.YearConstitucion = fechaConstitucion.getFullYear().toString().padStart(2, '0');

    this.GetData.ListTipoLocal.forEach((elementLocal : any) => {
      if (elementLocal.id === dataPrint.BasicosDto.IdTipoLocal) {
        this.infoPersonal.TipoLocal = elementLocal.value;
      }
    });
    this.ubicacionEmpresa.Estrato = dataPrint.BasicosDto.Estrato || '';
    if(dataPrint.BasicosDto.IdTipoLocal === 1) this.ubicacionEmpresa.TipoLocal = 'Propio';
    else if(dataPrint.BasicosDto.IdTipoLocal === 2) this.ubicacionEmpresa.TipoLocal = 'Arrendado';
    //#endregion

    //#region Carga departamento pais y ciudad de la informacion principal
    if (dataPrint.BasicosDto.IdCiudad !== null && dataPrint.BasicosDto.IdCiudad !== undefined &&
      dataPrint.BasicosDto.IdCiudad !== 0) {
      this.GetData.ListCiudad.forEach((elementCiudad : any) => {
        if (dataPrint.BasicosDto.IdCiudad === elementCiudad.IdCiudad) {
          this.infoPersonal.Ciudad = elementCiudad.Descripcion;
          this.GetData.ListDepartamento.forEach((elementDepart : any) => {
            if (elementDepart.IdDepartamento === elementCiudad.IdDepartamento) {
              this.infoPersonal.Departamento = elementDepart.Descripcion;
              this.GetData.ListPais.forEach((elementPais : any) => {
                if (elementPais.IdPais === elementDepart.IdPais) {
                  this.infoPersonal.Pais = elementPais.Descripcion;
                }
              });
            }
          });
        }
      });
    } else {
      this.GetData.ListPais.forEach((elementPais : any) => {
        if (elementPais.IdPais === dataPrint.BasicosDto.IdPais) {
          this.infoPersonal.Pais = elementPais.Descripcion;
        }
      });
    }
    //#endregion

    //#region Carga la informacion de contactos
    dataPrint.ContactoDto.forEach((elementContacto : any) => {
      if (elementContacto.ContactoPrincipal && elementContacto.IdTipoContacto === 8) { // Direcciones
        this.infoPersonal.DireccionPpal = elementContacto.Descripcion;
        this.ubicacionEmpresa.DireccionOficinaPpal = elementContacto.Descripcion;

        if (elementContacto.IdBarrio !== null && elementContacto.IdBarrio !== undefined
          && elementContacto.IdBarrio !== 0) {
            this.GetData.ListBarrios.forEach((elementBarrio : any) => {
            if (elementContacto.IdBarrio === elementBarrio.IdBarrio) {
              this.ubicacionEmpresa.Barrio = elementBarrio.Descripcion;
                this.GetData.ListCiudad.forEach((elementCiudad : any) => {
                if (elementBarrio.IdCiudad === elementCiudad.IdCiudad) {
                  this.ubicacionEmpresa.Municipio = elementCiudad.Descripcion;
                    this.GetData.ListDepartamento.forEach((elementDepart : any) => {
                    if (elementDepart.IdDepartamento === elementCiudad.IdDepartamento) {
                      this.ubicacionEmpresa.Departamento = elementDepart.Descripcion;
                        this.GetData.ListPais.forEach((elementPais : any)=> {
                        if (elementPais.IdPais === elementDepart.IdPais) {
                          this.ubicacionEmpresa.Pais = elementPais.Descripcion;
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          if (elementContacto.IdCiudad !== null && elementContacto.IdCiudad !== undefined && elementContacto.IdCiudad !== 0) {
            this.GetData.ListCiudad.forEach((elementCiudad : any) => {
              if (elementContacto.IdCiudad === elementCiudad.IdCiudad) {
                this.ubicacionEmpresa.Municipio = elementCiudad.Descripcion;
                this.GetData.ListDepartamento.forEach((elementDepart : any) => {
                  if (elementDepart.IdDepartamento === elementCiudad.IdDepartamento) {
                    this.ubicacionEmpresa.Departamento = elementDepart.Descripcion;
                    this.GetData.ListPais.forEach((elementPais : any) => {
                      if (elementPais.IdPais === elementDepart.IdPais) {
                        this.ubicacionEmpresa.Pais = elementPais.Descripcion;
                      }
                    });
                  }
                });
              }
            });
          } else {
            if (elementContacto.IdPais !== null && elementContacto.IdPais !== undefined && elementContacto.IdPais !== 0) {
              this.GetData.ListPais.forEach((elementPais : any) => {
                if (elementPais.IdPais === elementContacto.IdPais) {
                  this.ubicacionEmpresa.Pais = elementPais.Descripcion;
                }
              });
            }
          }
        }


      }
      if (elementContacto.ContactoPrincipal && elementContacto.IdTipoContacto === 6) { // Celular
        this.infoPersonal.Telefono = elementContacto.Descripcion;
        this.ubicacionEmpresa.Celular = elementContacto.Descripcion;
      }
      if (elementContacto.IdTipoContacto === 7) { // Telefono
        this.ubicacionEmpresa.Telefono = elementContacto.Descripcion;
      }
      if (elementContacto.ContactoPrincipal && elementContacto.IdTipoContacto === 3) { // Email
        this.ubicacionEmpresa.Email = elementContacto.Descripcion;
      }
      if (elementContacto.Correspondecia) {
        this.infoPersonal.DireccionCorrespondencia = this.Correspondencia.find(corr => corr.Value == elementContacto.IdTipoContacto)?.Descripcion ?? '';
      }

    });

    this.GetData.ListCIIU.forEach((elementCiiu : any) => {
      if (elementCiiu.Id === +dataPrint.BasicosDto.CIIU) {
        this.infoPersonal.CIIU = dataPrint.BasicosDto.CIIU;
        this.infoPersonal.ActividadEconomica = elementCiiu.Descripcion;
      }
    });
    //#endregion

    //#region Carga el objeto social
    this.GetData.ListObjetoSocial.forEach((elementSocial : any) => {
      if (dataPrint.BasicosDto.IdObjetoSocial === elementSocial.IdObjetoSocial) {
        this.infoPersonal.ObjetoSocial = elementSocial.Descripcion;
      }
    });

    this.GetData.ListTipoSociedad.forEach((elementSociedad : any) => {
      if (dataPrint.BasicosDto.IdTipoSociedad === elementSociedad.IdTipoSociedad) {
        this.infoPersonal.TiposSociedad = elementSociedad.Descripcion;
      }
    });
    //#endregion

    //#region Carga la informacion del representante
    if (dataPrint.RepresentanteDto !== null && dataPrint.RepresentanteDto !== undefined) {
      this.infoRepresentate.Nombre = dataPrint.RepresentanteDto.PrimerNombre +
        ' ' + dataPrint.RepresentanteDto.SegundoNombre;
      this.infoRepresentate.PrimerApellido = dataPrint.RepresentanteDto.PrimerApellido;
      this.infoRepresentate.SegundoApellido = dataPrint.RepresentanteDto.SegundoApellido;

      this.GetData.ListCargos.forEach((elementCargos : any) => {
        if (elementCargos.Clase === dataPrint.RepresentanteDto.IdCargo) {
          this.infoRepresentate.Cargo = elementCargos.Descripcion;
        }
      });

      this.infoRepresentate.Numero = dataPrint.RepresentanteDto.NumeroDocumento;

      const fechaCExpeFormat = formatDate(dataPrint.RepresentanteDto.FechaExpedicion, 'MM-dd-yyyy', 'en');
      const fechaExpedicion = new Date(fechaCExpeFormat);
      this.infoRepresentate.DiaExpedicion = fechaExpedicion.getDate().toString().padStart(2, '0');
      this.infoRepresentate.MesExpedicion = (fechaExpedicion.getMonth() + 1).toString().padStart(2, '0');
      this.infoRepresentate.YearExpedicion = fechaExpedicion.getFullYear().toString().padStart(2, '0');

      const fechaNaciFormat = formatDate(dataPrint.RepresentanteDto.FechaNacimiento, 'MM-dd-yyyy', 'en');
      const fechaNacimiento = new Date(fechaNaciFormat);
      this.infoRepresentate.DiaNacimiento = fechaNacimiento.getDate().toString().padStart(2, '0');
      this.infoRepresentate.MesNacimiento = (fechaNacimiento.getMonth() + 1).toString().padStart(2, '0');
      this.infoRepresentate.YearNacimiento = fechaNacimiento.getFullYear().toString().padStart(2, '0');

      this.GetData.ListTipoDocumento.forEach((elementDoc : any) => {
        if (elementDoc.Clase === dataPrint.RepresentanteDto.IdTipoIdentificacion) {
          this.infoRepresentate.TipoIdentificacion = elementDoc.Descripcion;
        }
      });
      this.GetData.ListProfesion.forEach((elementProfe : any) => {
        if (elementProfe.Clase === dataPrint.RepresentanteDto.IdProfesion) {
          this.infoRepresentate.Profesion = elementProfe.Descripcion;
        }
      });
      dataPrint.RepresentanteDto.ListContacto.forEach((elementContacto : any) => {
        if (elementContacto.IdTipoContacto === 1) { // direcccion
          this.infoRepresentate.Ciudad = this.GetData.ListCiudad.find((ciudad: any) => ciudad.IdCiudad === elementContacto.IdCiudad)?.Descripcion;
          this.infoRepresentate.DireccionResidencia = elementContacto.Descripcion;
        }
        if (elementContacto.IdTipoContacto === 6) { // celular
          this.infoRepresentate.Telefono = elementContacto.Descripcion;
        }
        if (elementContacto.IdTipoContacto === 3) {// Email
          this.infoRepresentate.Email = elementContacto.Descripcion;
        }
      });
    }
    if (dataPrint.RepresentanteDto !== null && dataPrint.RepresentanteDto !== undefined) {
      if (dataPrint.RepresentanteDto.Pregunta1 === 'true') {
        this.infoRepresentate.EsPeps = 'Si';
      } else {
        this.infoRepresentate.EsPeps = 'No';
      }
      if (dataPrint.RepresentanteDto.Pregunta2 === 'true') {
        this.infoRepresentate.ManejaRecursos = 'Si';
      } else {
        this.infoRepresentate.ManejaRecursos = 'No';
      }
      this.CargarCiudades(dataPrint.RepresentanteDto);
    }



    //#endregion

    //#region Carga la informacion Financiera
    if (dataPrint.FinancieroDto !== null && dataPrint.FinancieroDto !== undefined) {
      dataPrint.FinancieroDto.forEach((elementFinan : any) => {
        if (elementFinan.IdCategoria === 1) { // Ingresos
          if (elementFinan.IdJuridicoConcepto === 1) {
            this.infoFinanciera.IngresosOperativos = this.infoFinanciera.IngresosOperativos + elementFinan.Valor;
          } else if (elementFinan.IdJuridicoConcepto === 2) {
            this.infoFinanciera.Otros = this.infoFinanciera.Otros + elementFinan.Valor;
          }

          this.infoFinanciera.TotalIngresos = this.infoFinanciera.IngresosOperativos + this.infoFinanciera.Otros;

        } else { // Egresos
          if (elementFinan.IdJuridicoConcepto === 3) {
            this.infoFinanciera.CostosAdministracion = this.infoFinanciera.CostosAdministracion + elementFinan.Valor;
          } else if (elementFinan.IdJuridicoConcepto === 4) {
            this.infoFinanciera.Gastosfinancieros = this.infoFinanciera.Gastosfinancieros + elementFinan.Valor;
          } else if (elementFinan.IdJuridicoConcepto === 5) {
            this.infoFinanciera.OtrosGastos = this.infoFinanciera.OtrosGastos + elementFinan.Valor;
          }

          this.infoFinanciera.TotalEgresos = this.infoFinanciera.CostosAdministracion + this.infoFinanciera.Gastosfinancieros +
            this.infoFinanciera.OtrosGastos;
        }
      });
    }
    //#endregion

    //#region Carga la informacion de Patromonio
    if (dataPrint.PatrimonioDto !== null) {

      this.infoFinanciera.ActivoCorrientes = dataPrint.PatrimonioDto.ActivosCorrientes;
      this.infoFinanciera.ActivosNoCorrientes = dataPrint.PatrimonioDto.ActivosNoCorrientes;
      this.infoFinanciera.CuentasPorPagar = dataPrint.PatrimonioDto.CuentasPorPagar;
      this.infoFinanciera.ObligacionesFinancieras = dataPrint.PatrimonioDto.ObligacionesFinancieras;
      this.infoFinanciera.OtrosActivos = dataPrint.PatrimonioDto.OtrosActivos;
      this.infoFinanciera.OtrosPasivos = dataPrint.PatrimonioDto.OtrosPasivos;

      this.infoFinanciera.TotalActivos = this.infoFinanciera.ActivoCorrientes +
        this.infoFinanciera.ActivosNoCorrientes + this.infoFinanciera.OtrosActivos;

      this.totalPasivos = this.infoFinanciera.ObligacionesFinancieras + this.infoFinanciera.CuentasPorPagar +
        this.infoFinanciera.OtrosPasivos;
      // this.SumaPasivos = +this.patrimonioFrom.controls.ObligacionesFinancieras.value +
      // +this.patrimonioFrom.controls.CuentaPorPagar.value +
      // +this.patrimonioFrom.controls.OtrosPasivos.value;

      this.infoFinanciera.TotalPatrimonio = this.infoFinanciera.TotalActivos - this.totalPasivos;
    }
    //#endregion

    //#region Carga la informacion de Accionistas
    if (dataPrint.AccionistaDto !== null && dataPrint.AccionistaDto !== undefined) {
      dataPrint.AccionistaDto.forEach((elementAccionistas : any) => {
        let infoAccionista = new InformacionAccionistas();
        infoAccionista.Numero = elementAccionistas.NumeroDocumento;
        infoAccionista.RazonSocialNombreCompleto = elementAccionistas.RazonSocial;
        infoAccionista.VinculadoPEP = (elementAccionistas.VinculoPeps) ? 'Si' : 'No';
        this.tiposDocumento.forEach(element => {
          if (+element.Value === elementAccionistas.IdTipoIdentificacion) {
            infoAccionista.TipoIdentificacion = element.Descripcion;
          }
        });
        infoAccionista.Participacion = elementAccionistas.Participacion;
        this.LstinfoAccionista.push(infoAccionista);

      });
    }
    //#endregion

    //#region Carga la informacion de la entrevista
    if (dataPrint.EntrevistaDto !== null && dataPrint.EntrevistaDto !== undefined ) {
      dataPrint.EntrevistaDto.forEach((element : any) => {

        if (element.NumeroPregunta === 6) {
          this.entrevista.RealizaMonedaExtrangera =(element.Respuesta !== null && element.Respuesta === 'true') ? 'Si' : 'No';
        }
        if (element.NumeroPregunta === 7) {
          this.entrevista.Entidad = (element.Respuesta === null || element.Respuesta === '') ? '' : element.Respuesta;
        }
        if (element.NumeroPregunta === 8) {
          this.entrevista.Importa = (element.Respuesta !== null && element.Respuesta === 'true') ? 'Si' : 'No';
        }
        if (element.NumeroPregunta === 9) {
          this.entrevista.Exporta = (element.Respuesta !== null && element.Respuesta === 'true') ? 'Si' : 'No';
        }
        if (element.NumeroPregunta === 10) {
          this.entrevista.Giros = (element.Respuesta !== null && element.Respuesta === 'true') ? 'Si' : 'No';
        }
        if (element.NumeroPregunta === 11) {
          this.entrevista.TipoProducto = (element.Respuesta === null || element.Respuesta === '') ? '' : element.Respuesta;
        }
        if (element.NumeroPregunta === 12) {
          this.GetData.ListPais.some((elementPais : any) => {
            if (elementPais.IdPais === +element.Respuesta) { this.entrevista.Pais = elementPais.Descripcion; return true; } return false;
          });
        }
        if (element.NumeroPregunta === 25) {
          this.dataDivisas.forEach((elementDivsa : any) => {
            if (elementDivsa.Id === +element.Respuesta) { this.entrevista.Moneda = elementDivsa.Nombre; }
          });
        }
        if (element.NumeroPregunta === 13) {
          this.entrevista.Ciudad = (element.Respuesta === null || element.Respuesta === '') ? '' : element.Respuesta;
        }
        if (element.NumeroPregunta === 24) {
          this.entrevista.MontoPromedio = (element.Respuesta === null || element.Respuesta === '') ? '' : element.Respuesta;
        }

        if (element.NumeroPregunta === 14) {
          this.entrevista.InversionesMonedaExtrangera = (element.Respuesta !== null && element.Respuesta === 'true') ? 'Si' : 'No';
        }

        if (element.NumeroPregunta === 15) {
          this.GetData.ListPais.some((elementPais : any) => {
            if (elementPais.IdPais === +element.Respuesta) { this.entrevista.PaisInversion = elementPais.Descripcion; return true; } return false;
          });
        }
        if (element.NumeroPregunta === 16) {
          this.dataDivisas.forEach((elementDivsa : any) => {
            if (elementDivsa.Id === +element.Respuesta) { this.entrevista.MonedaInversion = elementDivsa.Nombre; }
          });
        }

        if (element.NumeroPregunta === 17) {
          this.entrevista.CuentaMonedaExtrangera = (element.Respuesta !== null && element.Respuesta === 'true') ? 'Si' : 'No';
        }
        if (element.NumeroPregunta === 18) {
          this.GetData.ListPais.some((elementPais : any) => {
            if (elementPais.IdPais === +element.Respuesta) { this.entrevista.PaisCuenta = elementPais.Descripcion; return true; } return false;
          });
        }

        if (element.NumeroPregunta === 19) {
          this.dataDivisas.forEach((elementDivsa : any)=> {
            if (elementDivsa.Id === +element.Respuesta) { this.entrevista.MonedaCuenta = elementDivsa.Nombre; }
          });
        }

        if (element.NumeroPregunta === 29) {
          this.entrevista.NumeroCuentaExtrangera = (element.Respuesta === null || element.Respuesta === '') ? '' : element.Respuesta;
        }

        if (element.NumeroPregunta === 28) {
          this.entrevista.NoRealizaTransacciones = (element.Respuesta !== null && element.Respuesta === 'true') ? 'Si' : 'No';
        }

      });
    }
    //#endregion

    //#region Carga la informacion de las referencias
    if (dataPrint.ReferenciasDto !== null && dataPrint.ReferenciasDto !== undefined) {
      dataPrint.ReferenciasDto.forEach((element : any) => {
        let localReferenciaComercial = new InformacionReferencias();
        let localReferenciaFinanciera = new InformacionReferencias();
        if (element.IdTipoReferencia === 1) {
          if (element.IdCiudad !== null && element.IdCiudad !== undefined && element.IdCiudad !== 0) {
            this.GetData.ListCiudad.forEach((elementCiudad : any)=> {
              if (element.IdCiudad === elementCiudad.IdCiudad) {
                localReferenciaComercial.Ciudad = elementCiudad.Descripcion;;
              }
            });
          } else {
            if (element.IdPais !== null && element.IdPais !== undefined && element.IdPais !== 0) {
              this.GetData.ListPais.forEach((elementPais : any) => {
                if (elementPais.IdPais === element.IdPais) {
                  localReferenciaComercial.Ciudad = elementPais.Descripcion;
                }
              });
            }
          }

          localReferenciaComercial.NombreEmpresa = element.Descripcion;
          localReferenciaComercial.TelefonoUno = element.Telefono;
          localReferenciaComercial.TelefonoDos = element.Telefono2;
          this.LstinfoReferenciaComercial.push(localReferenciaComercial);
        } else {
          localReferenciaFinanciera.Entidad = element.Descripcion;
          localReferenciaFinanciera.Telefono = element.Telefono;
          localReferenciaFinanciera.Oficina = element.IdOficina;
          localReferenciaFinanciera.Producto = element.Producto;
          this.LstinfoReferenciaFinanciera.push(localReferenciaFinanciera);
        }
      });

    }
    //#endregion

  }

  EnviarHojaVidaWorkManager() {
    const now = new Date();
    const targetDate = new Date(this.infoPersonal.FechaActualizacion);

    const yearDiff = now.getFullYear() - targetDate.getFullYear();
    const monthDiff = now.getMonth() - targetDate.getMonth();

    let totalMonths = yearDiff * 12 + monthDiff;

    if (now.getDate() < targetDate.getDate()) totalMonths -= 1;
    
    if(totalMonths > 6 && this.GetServiceSolicited.idProceso == 2) {
      this.notif.onWarning('Advertencia', 'Asociado no se ha actualizado en los últimos 6 meses.');
      return;
    }

    Swal.fire({
      title: 'Advertencia',
      text: '',
      html: '¿Desea enviar hoja de vida a workmanager? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
      // tslint:disable-next-line:no-shadowed-variable
    }).then(result => {
      if(result.value) {
        this.showLoader = true;
        const globalData = JSON.parse(window.atob( localStorage.getItem('Data') ?? '' ));
        
        const formInsertData = {
          base64: this.currentHdvBase64,
          documento: this.infoPersonal.Nit,
          usuario: globalData?.Usuario,
          idOficina: globalData?.NumeroOficina,
          nombreOficina: globalData?.Oficina,
          idProceso: this.GetServiceSolicited.idProceso,
          RadicadoCredito: this.GetServiceSolicited.radicado
        }; 
           
        this.clientesService.EnviarSolicitudServiciosWorkManager(formInsertData).subscribe(
          result => {
            this.showLoader = false;
            this.notif.onSuccess('Exitoso', 'Se envió al workmanager correctamente.');
            this.openModalHojaVida.nativeElement.click();
            const idServicioSeleccionado = this.GetServiceSolicited.idProceso;
            const servicioName = this.servicios.find(item => item.id == idServicioSeleccionado)?.name || '';
            this.generalesService.Guardarlog(`Se envió al workmanager por ${servicioName}`, 3, 0, +this.infoPersonal.IdJuridico, 12).subscribe(
              result => {
                
              }
            );
          },
          error => {
            this.showLoader = false;
            if(error.detalle?.includes('No existe un registro')) {
              this.notif.onWarning('Advertencia', 'Afiliado no encontrado en el workmanager.');
              return;
            }
            this.notif.onWarning('Advertencia', 'No se envió al workmanager.');
          }
        );
      }
    })
  }

  private LimpiarDataImpresion() {
    this.LstinfoReferenciaComercial = [];
    this.LstinfoReferenciaFinanciera = [];
    this.infoPersonal = new InformacionPersonal();
    this.ubicacionEmpresa = new UbicacionEmpresa();
    this.infoRepresentate = new InfoRepresentateLegal();
    this.infoFinanciera = new InformacionFinanciera();
    this.LstinfoAccionista = [] = [];
    this.infoAccionista = new InformacionAccionistas();
    this.entrevista = new InformacionEntrevista();
    this.LstinfoReferenciaComercial = [] = [];
    this.LstinfoReferenciaFinanciera = [] = [];

    // this.condicion = false;
    this.dataCIIU = '';
    this.Servcredito = '';
    this.servVinculacion = '';
    this.ServActualiza = '';
    this.conceptosResul = [] = [];

  }
  private CargarCiudades(representateInfo: any) {

    const idCiudadNacimiento = representateInfo.IdCiudadNac;
    if (idCiudadNacimiento) {
      const { Descripcion: ciudadNacimiento, IdDepartamento } = this.GetData.ListCiudad.find((ciudad: any) => ciudad.IdCiudad === idCiudadNacimiento);
      const idPais = this.GetData.ListDepartamento.find((departamento: any) => departamento.IdDepartamento === IdDepartamento)?.IdPais;
      const paisNacimiento = this.GetData.ListPais.find((pais: any) => pais.IdPais === idPais)?.Descripcion?.trim();
      this.infoRepresentate.lugarNacimiento = [ciudadNacimiento, paisNacimiento].filter(Boolean).join(', ');
    }


    const idCiudadExpedicion = representateInfo.IdCiudadExp;
    if (idCiudadExpedicion) {
      const { Descripcion: ciudadExpedicion, IdDepartamento } = this.GetData.ListCiudad.find((ciudad: any) => ciudad.IdCiudad === idCiudadExpedicion);
      const idPais = this.GetData.ListDepartamento.find((departamento: any) => departamento.IdDepartamento === IdDepartamento)?.IdPais;
      const paisExpedicion = this.GetData.ListPais.find((pais: any) => pais.IdPais === idPais)?.Descripcion?.trim();
      this.infoRepresentate.lugarExpedicion = [ciudadExpedicion, paisExpedicion].filter(Boolean).join(', ');
    }

  }

  private CargarCiudadRepresenta(result: any) {
    if (result.IdCiudad !== undefined && result.IdCiudad !== null && result.IdCiudad !== 0) {
      this.clientesGetListService.GetCiudad('B').subscribe(resultCiu => {
        resultCiu.forEach((elemenFor : any)=> {
          if (elemenFor.IdCiudad === result.IdCiudad) {
            const ciudadName = elemenFor.Nombre.split('-');
            this.infoRepresentate.Ciudad = ciudadName[0];
          } else {
            this.GetData.ListCiudad.forEach((elementCiudad : any) => {
              if (elementCiudad.IdCiudad === result.IdCiudad) {
                this.infoRepresentate.Ciudad = elementCiudad.Descripcion;;
              }
            });
          }
        });
      });
    }
  }
  print() {
    this.printService.printArea('FormatoDeServicios','height=1000,width=4436');
  }
}
