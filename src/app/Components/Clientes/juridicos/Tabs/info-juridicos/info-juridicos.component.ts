import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { RecursosGeneralesService } from '../../../../../Services/Utilidades/recursosGenerales.service';
import { RequiredData } from '../../../../../Models/Generales/RequiredData.model';
import { BasicosModel } from '../../../../../Models/Clientes/Juridicos/BasicosModel';
import { JuridicoModel } from '../../../../../Models/Clientes/Juridicos/JuridicoModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import swal from 'sweetalert2';
import { AsesorModel, AsesorModelPpal } from '../../../../../Models/Generales/Asesor.model';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { ClientesService } from '../../../../../Services/Clientes/clientes.service';
import { OperacionesModel } from '../../../../../Models/Maestros/operaciones.model';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
@Component({
  selector: 'app-info-juridicos',
  templateUrl: './info-juridicos.component.html',
  styleUrls: ['./info-juridicos.component.css'],
  providers: [ClientesGetListService, RecursosGeneralesService, JuridicosService, GeneralesService,
    ClientesService, OperacionesService],
    standalone : false
})
export class InfoJuridicosComponent implements OnInit, AfterViewInit {

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  //#region carga de variables de comunicacion
  @Input() bloquearForm : boolean | null = true;
  @Input() bloquearRelacion : boolean | null = true;
  @Input() bloquearEstado : boolean | null = true;
  @Input() bloquearNit: boolean | null = true;
  @Input() bloquearRazonSocial : boolean | null = true;
  @Input() bloquearAsesor : boolean | null = true;
  @Input() bloquearAsesorExt : boolean | null = true;
  @Input() AsessorNecesario: boolean | null = true;
  @Input() disableAsesorPpal : boolean | null = true;
  @Input() disableAsesorExt : boolean | null = true;
  @Input() dataPais: any;
  @Input() dataEstados: any;
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Output() emitTipoCliente = new EventEmitter();
  @Input() infoTabAllInfo: any;
  @Input() mostrarSiguiente = false;
  @Input() mostrarActualizar =  false;
  @Input() mostrarCambiar = false;
  @Input() mostrarNuevoInfo: any;
  @Input() DataInfoJuridico!: JuridicoModel;
  @Input() DataBasico!: BasicosModel;
  @Input() OficinaChanged: any;
  @Output() bloquearOficinaComponent: any;
  @Input() OperacionActual: any;
  @Output() emitEventOficina: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() emitEventResetOperacion: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clienteSeleccionado: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('BuscarAsesoresExt', { static: true }) private BuscarAsesoresExt!: ElementRef;
  @ViewChild('BuscarAsesoresPpal', { static: true }) private BuscarAsesoresPpal!: ElementRef;
  @ViewChild('CerrarDescripcion', { static: true }) private CerrarDescripcion!: ElementRef;
  @ViewChild('AbrirDescripcion', { static: true }) private AbrirDescripcion!: ElementRef;
 

  public dataDepartamentos : any[] = [];
  public dataCiudades : any[] = [];
  public dataRelacion: any[] = [];
  public metodosConocio = [
    { Value: '1', Descripcion: 'Radio' },
    { Value: '2', Descripcion: 'Televisión' },
    { Value: '3', Descripcion: 'Volante' },
    { Value: '4', Descripcion: 'Referido' },
    { Value: '5', Descripcion: 'Web' },
    { Value: '6', Descripcion: 'Por' },
    { Value: '7', Descripcion: 'Otro' },
  ];
  protected actividadesNoPermitidas = [
    { id: 10 }, { id: 81 }, { id: 82 }, { id: 90 }
  ]
  public infoTabAll = {
    JuridicoDto: {},
    BasicoDto: {}
  };
  private DataRequired = new RequiredData();
  public CiudadMapper: any;
  public CiudadMapperUpda: any;
  public DepartMapper: any;
  public DepartMapperUpd: any;
  public ActividadMapper: any;
  public CiiuMapper: any;
  public OficinaMapper: any;
  public JuridicoEdit: any;
  public relacionAnt: any;
  public PaisMapper: any;
  public RazonSocialMapper: any;
  private operacionesModel!: OperacionesModel;
  public relacionAnterior: any;
  //#endregion
  //#region  variables de bloqueo
  public bloqDeparta : boolean | null = true;
  public bloqCiudad : boolean | null = true;
  public userConect : any;
  public OficinaSeleccionada: any;
  public PreguntaAsesorExt = false;
  public MostrarOtroPor = false;
  protected EditarFrom = false;
  protected EditAsesor = false;
  protected EditAsesorExt = false;
  protected CodEditAsesorExt = false;
  protected cambioRelacionEdit = false;
  public NitConsultado: any;
  public mostrarSpanAlertaNegacion = false;
  public MostrarConvenio = false;
  public AsesorConsultado: any;
  public AsesorExtConsultado: any;
  public validarNit = false;
  //#endregion
  //#region From
  public infoJuridicoFrom !: FormGroup;
  public DescripcionNegacionForm!: FormGroup;
  public vetadosFrom!: FormGroup;
  //#endregion
  //#region carga variables
  public EsProveedor: boolean = false;
  public siguiente = false;
  public positionTab = 2;
  public dataObjetoSocial: any;
  public dataTiposociedad: any;
  public dataListCiiu: any[] = [];
  public dataActividadEconomica: any;
  public basicosModel = new BasicosModel();
  public juridicoModel = new JuridicoModel();
  public dataAsesorExterno: any;
  public dataAsesorPpal: any;
  public estadoSeleccion: any;
  public AnteriorEstadoSeleccion: any;
  public emitEventComunicacion: EventEmitter<any> = new EventEmitter<any>();
  //#endregion
  //#region Variables marcar Obliatorio
  public obliConocio = false;
  public obliFecha = false;
  public obliEstrato = false;
  public obliPais = false;
  public obliDepart = false;
  public obliCiudad = false;
  public obliLocal = false;
  public obliObjeto = false;

  
  private CodModulo = 12;
  //#endregion
  constructor(private clientesGetListService: ClientesGetListService, private notif: NgxToastService,
    private recursosGeneralesService: RecursosGeneralesService, private juridicoService: JuridicosService,
    private generalesService: GeneralesService, private formBuilder: FormBuilder, private clientesService: ClientesService,
    private operacionesService: OperacionesService) { }

  ngOnInit() {
    let data = localStorage.getItem('Data');
    this.userConect = JSON.parse(window.atob(data == null ? "" : data));
    this.IrArriba();
    this.bloquearRelacion = true;
    this.RazonSocialCapitalice();
    this.NegacionCapitalice();
    this.OtroPorCapitalice();
    this.validarInfoJuridico();
    this.GetRelacion();
    this.GetTipoSociedad();
    this.GetObjetoSocial();
    this.GetCiiuList();
    localStorage.setItem('IdModuloActivo', window.btoa(JSON.stringify(this.CodModulo)));
    
   

    this.onChanges();
  }

  onChanges(): void {
    this.ValidarCamposCambiantes();
  };

  ngAfterViewInit() {
    this.emitEventComunicacion.subscribe(resu => {
      this.generalesService.Autofocus(resu.nameInput);
    })
  }

  //#region Metodos de carga
  private ValidarCamposCambiantes() {
    this.infoJuridicoFrom.get('Conocio')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('FechaConstitucion')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('Estrato')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('OtroPor')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('Ciiu')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('Pais')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('TipoLocal')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('ObjetoSocial')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('TipoSociedad')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
    this.infoJuridicoFrom.get('CodigoAsesor')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 26) {
        if (val !== null) {
          this.EditAsesorExt = true;
        }
        else {
          this.EditAsesorExt = false;
        }
      }
    });
    this.infoJuridicoFrom.get('NombreAsesor')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 26) {
        if (val !== null) {
          this.EditAsesorExt = true;
        }
        else {
          this.EditAsesorExt = false;
        }
      }
    })
    this.infoJuridicoFrom.get('CodigoAsesorExt')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 19) {
        if (val !== null) {
          this.CodEditAsesorExt = true;
        }
        else {
          this.CodEditAsesorExt = false;
        }
      }
    });

    this.infoJuridicoFrom.get('Relacion')?.valueChanges.subscribe(val => {
      if (this.OperacionActual === 4) {
        if (val !== null) {
          this.cambioRelacionEdit = true;
        }
        else {
          this.cambioRelacionEdit = false;
        }
      }
    });
  }
  
  GetRelacion() {
    const relacion = this.DataRequired.RelacionData;
    relacion.splice(1, 1);
    this.dataRelacion = relacion;
  }

  GetDepartamentosList(form : any) {
  //  this.bloqDbloqDepartaeparta = null;
    if (form.Pais !== null && form.Pais !== undefined && form.Pais !== '') {
      if (this.PaisMapper !== undefined && this.PaisMapper.Descripcion !== null) {
        if (this.PaisMapper.Descripcion !== form.Pais) {
          if (form.Pais !== undefined && form.Pais !== null) {
            if (+form.Pais === 42) {
              this.recursosGeneralesService.GetDepartamentosList(+form.Pais).subscribe(
                result => {
                  if (result.length > 0) {
                    //aqui se agregan los validadores de depa y ciu
                    this.AgregarValidadoresDepaCiu();
                    this.bloqDeparta = null;
                    this.dataDepartamentos = result;
                  } else {
                    this.infoJuridicoFrom.get('Departamento')?.reset();
                    this.infoJuridicoFrom.get('Ciudad')?.reset();
                    this.EliminarValidadoresDepaCiu();
                    this.bloqDeparta = true;
                  }
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.error(errorMessage);
                }
              );
            } else {
              this.infoJuridicoFrom.get('Departamento')?.reset();
              this.infoJuridicoFrom.get('Ciudad')?.reset();
              this.EliminarValidadoresDepaCiu();
              this.bloqDeparta = true;
              this.bloqCiudad = true;
            }
          } else {
        
            this.dataDepartamentos = [];
            this.EliminarValidadoresDepaCiu();
            this.infoJuridicoFrom.get('Departamento')?.reset();
            this.infoJuridicoFrom.get('Ciudad')?.reset();
            this.bloqDeparta = true;
            this.bloqCiudad = true;
      
          
          }
        } else {
          this.recursosGeneralesService.GetDepartamentosList(this.PaisMapper.IdPais).subscribe(
            result => {
              if (result.length > 0) {
                //aqui se agregan los validadores de depa y ciu
                this.AgregarValidadoresDepaCiu();
                this.bloqDeparta = null;
                this.dataDepartamentos = result;
              } else {
                this.infoJuridicoFrom.get('Departamento')?.reset();
                this.infoJuridicoFrom.get('Ciudad')?.reset();
                this.EliminarValidadoresDepaCiu();
                this.bloqDeparta = true;
              }
            },
            error => {
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.error(errorMessage);
            }
          );
        }
      } else {
        if (form.Pais !== undefined && form.Pais !== null) {
          if (+form.Pais === 42) {
            this.recursosGeneralesService.GetDepartamentosList(+form.Pais).subscribe(
              result => {
                if (result.length > 0) {
                  //aqui se agregan los validadores de depa y ciu
                  this.AgregarValidadoresDepaCiu();
                  this.bloqDeparta = null;
                  this.dataDepartamentos = result;
                } else {
                  this.infoJuridicoFrom.get('Departamento')?.reset();
                  this.infoJuridicoFrom.get('Ciudad')?.reset();
                  this.EliminarValidadoresDepaCiu();
                  this.bloqDeparta = true;
                }
              },
              error => {
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.error(errorMessage);
              }
            );
          } else {
            this.infoJuridicoFrom.get('Departamento')?.reset();
            this.infoJuridicoFrom.get('Ciudad')?.reset();
            this.EliminarValidadoresDepaCiu();
            this.bloqDeparta = true;
            this.bloqCiudad = true;
          }
        } else {

          this.dataDepartamentos = [];
          // this.infoJuridicoFrom.get('Pais')?.reset();
          // aqui se elimna los validadores de depa y ciu
          this.EliminarValidadoresDepaCiu();

          this.infoJuridicoFrom.get('Departamento')?.reset();
          this.infoJuridicoFrom.get('Ciudad')?.reset();
          this.bloqDeparta = true;
          this.bloqCiudad = true;


        }
      }
    } else {
      this.dataDepartamentos = [];
      // this.infoJuridicoFrom.get('Pais')?.reset();
      this.EliminarValidadoresDepaCiu();
      this.infoJuridicoFrom.get('Departamento')?.reset();
      this.infoJuridicoFrom.get('Ciudad')?.reset();
      this.bloqDeparta = true;
      this.bloqCiudad = true;
    }
  }

  public EliminarValidadoresDepaCiu() {
    this.infoJuridicoFrom.controls['Departamento'].setErrors(null);
    this.infoJuridicoFrom.controls['Departamento'].clearValidators();
    this.infoJuridicoFrom.controls['Departamento'].setValidators(null);

    this.infoJuridicoFrom.controls['Ciudad'].setErrors(null);
    this.infoJuridicoFrom.controls['Ciudad'].clearValidators();
    this.infoJuridicoFrom.controls['Ciudad'].setValidators(null);
  }

  public AgregarValidadoresDepaCiu() {
    this.infoJuridicoFrom.controls['Departamento'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Departamento'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Departamento'].updateValueAndValidity();

    this.infoJuridicoFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Ciudad'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Ciudad'].updateValueAndValidity();
  }

  GetCiudadList(form : any) {
   
    if (form.Departamento !== null && form.Departamento !== undefined && form.Departamento !== '') {
      if(this.DepartMapperUpd != undefined) {
        if (this.DepartMapperUpd !== form.Departamento ) {
            this.recursosGeneralesService.GetCiudadList(+form.Departamento).subscribe(
              result => {
                this.bloqCiudad = null;
                this.dataCiudades = result;
                this.CiudadMapper = result;
                this.DepartMapper = form.Departamento;
              },
              error => {
                this.infoJuridicoFrom.get('Ciudad')?.reset();
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.error(errorMessage);
              }
            );
        } else {
          this.recursosGeneralesService.GetCiudadList(this.DepartMapperUpd.IdDepartamento).subscribe(
            result => {
              this.bloqCiudad = null;
              this.dataCiudades = result;
              this.CiudadMapper = result;
              this.DepartMapper = form.Departamento;
            },
            error => {
              this.infoJuridicoFrom.get('Ciudad')?.reset();
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.error(errorMessage);
            }
          );
        }
      } else {
        this.recursosGeneralesService.GetCiudadList(+form.Departamento).subscribe(
          result => {
            this.bloqCiudad = null;
            this.dataCiudades = result;
            this.CiudadMapper = result;
            this.DepartMapper = form.Departamento;
          },
          error => {
            this.infoJuridicoFrom.get('Ciudad')?.reset();
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.error(errorMessage);
          }
        );
      }
    } else {
      this.infoJuridicoFrom.get('Departamento')?.reset();
      this.infoJuridicoFrom.get('Ciudad')?.reset();
      this.bloqCiudad = true;
    }
  }

  LimpiarCiudad() {
    this.infoJuridicoFrom.get('Ciudad')?.reset();
  }

  GetTipoSociedad() {
    this.clientesGetListService.GetTipoSociedad().subscribe(
      result => {
        this.dataTiposociedad = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetObjetoSocial() {
    this.clientesGetListService.GetObjetoSocial().subscribe(
      result => {
        this.dataObjetoSocial = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetCiiuList() {
    this.clientesGetListService.GetListCiiu().subscribe(
      result => {
          result.forEach((element : any) => {
            if (element.Id !== 10 && element.Id !== 81 && element.Id !== 82 && element.Id !== 90 ) {
              this.dataListCiiu.push(element);
            }
          });
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  //#endregion

  //#region Metodos funcionales

  ValidarTipoCliente() {
    this.operacionesModel = new OperacionesModel();
    const tipoClienteSelect = Number(this.infoJuridicoFrom.get('Relacion')?.value);
    let data = localStorage.getItem('Data');
    const resultPerfil = JSON.parse(window.atob(data == null ? ""  : data));
    this.operacionesModel.idOperacion = this.OperacionActual;
    this.operacionesModel.idPerfil = resultPerfil.idPerfilUsuario;
    this.operacionesModel.idModulo = this.CodModulo;
    if (tipoClienteSelect === 15) { // Tercero
      let state = localStorage.getItem('state');
      this.dataEstados = JSON.parse(window.atob(state == null ? "" : state));;
      this.dataEstados.forEach((elementEsta : any) => {
          if (elementEsta.IdEstado === 5) {
            this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
          }
        });
      let data = localStorage.getItem('Data');
      const DataUserLog = JSON.parse(window.atob(data == null ? "" : data));
      // se quito restriccion de oficina de administracion
      this.PreguntaAsesorExt = false;
      let perfi = localStorage.getItem('profiles');
      const resultProfiles = JSON.parse(window.atob(perfi == null ? "" : perfi));
      resultProfiles.forEach((element : any) => {
          if (element.IdPerfil === 68) {
             swal.fire({
              title: 'Advertencia',
              text: '',
              html: '¿ El tercero a crear es para convenios ? ',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No',
              confirmButtonColor: 'rgb(13,165,80)',
              cancelButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((results) => {

              if (results.value) {
                this.infoJuridicoFrom.get('Proveedor')?.setValue('1')
                this.ocultarObligatoriosTerceroProvedor();
                this.clienteSeleccionado.emit({ 'tipoClienteSelect': tipoClienteSelect, 'isProveedor': true });
                

              } else {
                this.PreguntaAsesorExt = false;
                this.infoJuridicoFrom.get('Proveedor')?.setValue('0')
                this.AsignarObligatoriosTercero();
                this.AgregarValidacionesTercero();
                this.clienteSeleccionado.emit({ 'tipoClienteSelect': tipoClienteSelect, 'isProveedor': false });

              }
            });
          } else {
            //la oficina adiministracion puede crear terceros
          }
      });
      
      
    } else if (tipoClienteSelect === 5) { // Asociado
      this.AgregarValidacionesAsociado();
      if (this.infoJuridicoFrom.get('ObjetoSocial')?.value === 2 || this.infoJuridicoFrom.get('ObjetoSocial')?.value === '2') {
        let state = localStorage.getItem('state');
        this.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
        this.dataEstados.forEach((elementEsta : any ) =>  {
            if (elementEsta.IdEstado === 5) {
              this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
            }
          }); 
      } else {
        let state = localStorage.getItem('state');
        this.dataEstados = JSON.parse(window.atob(state == null ? "" : state));
        this.dataEstados.forEach((elementEsta : any ) =>  {
            if (elementEsta.IdEstado === 47) {
              this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
            }
          }); 
      }
      let data = localStorage.getItem('Data');
      const DataUserLog = JSON.parse(window.atob(data == null ? "" : data));
      if (DataUserLog.NumeroOficina !== '3') {
      if (this.OperacionActual === 5) {
        this.clientesGetListService.GetEstado().subscribe(
          result => {
            this.dataEstados = result;
          
            result.forEach((elementEsta : any ) =>  {
              if (elementEsta.IdEstado === 47) {
                this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
              }
            });
          
          });
      }
        this.MostrarObligatorios();
      this.clienteSeleccionado.emit({ 'tipoClienteSelect': tipoClienteSelect, 'isProveedor': false });
      } else {
        this.notif.onWarning('Advertencia', 'No se puede crear asociados en la oficina administración.');
        this.infoJuridicoFrom.get('Relacion')?.reset();
        // validar si es necesario bloquear
      }
    } 
  }

  validarCiudadList(form : any) {
    if (this.CiudadMapperUpda !== undefined && this.CiudadMapperUpda != null) {
      if (this.CiudadMapperUpda.Descripcion !== form.Ciudad) {
        if (this.infoJuridicoFrom.get('Ciudad')?.value === '' || this.infoJuridicoFrom.get('Ciudad')?.value === null
          || this.infoJuridicoFrom.get('Ciudad')?.value === undefined) {
          this.infoJuridicoFrom.get('Ciudad')?.reset();
        } else {
          if (form.Ciudad === null || form.Ciudad === undefined || form.Ciudad === '') {
            this.infoJuridicoFrom.get('Ciudad')?.reset();
          } else if (form.Ciudad === undefined || form.Ciudad === null) {
            this.infoJuridicoFrom.get('Ciudad')?.reset();
          }
        }
      }
    }
  }

  validarCiiuList(form : any) {
    let validarMensaje = true;
    if (this.infoJuridicoFrom.get('Ciiu')?.value === '' || this.infoJuridicoFrom.get('Ciiu')?.value === null
      || this.infoJuridicoFrom.get('Ciiu')?.value === undefined) {
      this.infoJuridicoFrom.get('Ciiu')?.reset();
      this.infoJuridicoFrom.get('ActividadEconomica')?.reset();
    } else {
      this.dataListCiiu.forEach(elementCiiu => {
        if (!isNaN(+form.Ciiu)) {
            if (elementCiiu.Id === +form.Ciiu) {
              this.infoJuridicoFrom.get('ActividadEconomica')?.setValue(elementCiiu.Descripcion);
              validarMensaje = false;
            }
          } else {
            this.infoJuridicoFrom.get('Ciiu')?.reset();
            this.infoJuridicoFrom.get('ActividadEconomica')?.reset();
          }
        });

      if (validarMensaje) {
        validarMensaje = true;
        this.infoJuridicoFrom.get('Ciiu')?.reset();
        this.infoJuridicoFrom.get('ActividadEconomica')?.reset();
        this.notif.onWarning('Advertencia', 'No se econtró la actividad economica.');
      }
      

      // }
    }
  }

  limpiarActividad() {
    this.infoJuridicoFrom.get('ActividadEconomica')?.reset();
  }

  cargarCiiu() {
    if (this.infoJuridicoFrom.controls["Ciiu"].value === '' || this.infoJuridicoFrom.controls["Ciiu"].value === undefined || 
      this.infoJuridicoFrom.controls["Ciiu"].value === null) {
      this.infoJuridicoFrom.get('Ciiu')?.reset();
      this.infoJuridicoFrom.get('Ciiu')?.setValue(this.infoJuridicoFrom.controls["ActividadEconomica"].value.Id);
    } else {
      if (this.infoJuridicoFrom.controls["ActividadEconomica"].value.Id === undefined || this.infoJuridicoFrom.controls["ActividadEconomica"].value.Id === null) {
        this.infoJuridicoFrom.get('Ciiu')?.setValue(this.infoJuridicoFrom.controls["Ciiu"].value);
      } else {
        this.infoJuridicoFrom.get('Ciiu')?.setValue(this.infoJuridicoFrom.controls["ActividadEconomica"].value.Id);
      }
      // this.infoJuridicoFrom.get('ActividadEconomica')?.setValue(this.infoJuridicoFrom.controls.ActividadEconomica.value);
    }
   
  }

  validarDescripcion() {
    const observa = this.DescripcionNegacionForm.get('DescripcionNegacion')?.value;
    if (observa !== null && observa !== undefined && observa !== '') {
      this.mostrarSpanAlertaNegacion = false;
    } else {
      this.mostrarSpanAlertaNegacion = true;
    }
  }

  SetActvidadInputs(data : any) {
    this.infoJuridicoFrom.get('Ciiu')?.setValue(data.Id);
    this.infoJuridicoFrom.get('ActividadEconomica')?.reset(data.Descripcion);
  }

  desbloquearDepart() {
    // if (this.infoJuridicoFrom.get('Pais')?.value === '' || this.infoJuridicoFrom.get('Pais')?.value === null
    //   || this.infoJuridicoFrom.get('Pais')?.value === undefined) {
    //   this.infoJuridicoFrom.get('Departamento')?.reset();
    //   this.infoJuridicoFrom.get('Ciudad')?.reset();
    // }
    this.bloqDeparta = null;
  }

  desbloquearCiudad() {
    if (this.infoJuridicoFrom.get('Departamento')?.value === '' || this.infoJuridicoFrom.get('Departamento')?.value === null
      || this.infoJuridicoFrom.get('Departamento')?.value === undefined) {
      this.infoJuridicoFrom.get('Ciudad')?.reset();
      this.bloqCiudad = true;
    } else {
      this.bloqCiudad = null;
    }
  }

  limpiarFormulario() {
    const estado = this.infoJuridicoFrom.get('Estado')?.value;
    this.infoJuridicoFrom.reset();
    this.infoJuridicoFrom.get('Estado')?.setValue(estado);
    let data = localStorage.getItem('Data');
    const resultPerfil = JSON.parse(window.atob(data == null ? "" : data));
    this.infoJuridicoFrom.get('CodigoAsesor')?.setValue(resultPerfil.IdAsesor);
    this.infoJuridicoFrom.get('NombreAsesor')?.setValue(resultPerfil.Nombre);
    this.PreguntaAsesorExt = false;
    this.disableAsesorExt = true;
    this.bloquearAsesorExt = true;
    this.AsessorNecesario = true;
    this.AgregarValidacionesTercero();

    this.MostrarObligatorios();
  }

  GuardarInfoJurico() {
    if (this.infoJuridicoFrom.valid) { // valido que el formulario este bien
      if (this.validarNit) {
        if (!this.PreguntaAsesorExt) { // valida si ya pregunto por el asesor
          
          this.PreguntaAsesorExt = true;
          swal.fire({ // Se pregunta si necesita asesor externo
            title: 'Advertencia',
            text: '',
            html: '¿ el registro requiere un asesor externo ? ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            confirmButtonColor: 'rgb(13,165,80)',
            cancelButtonColor: 'rgb(160,0,87)',
            allowOutsideClick: false,
            allowEscapeKey: false
            // tslint:disable-next-line:no-shadowed-variable
          }).then((results) => {
            if (results.value) {
              this.bloquearAsesorExt = null;
              // aqui poner las validaciones a los campos de obligacio
              this.PreguntaAsesorExt = true;
              this.disableAsesorExt = null;
            } else {
              // aqui quitar las validaciones de obligacion
              this.PreguntaAsesorExt = true;
              this.AsessorNecesario = null;
              this.SetDataInfoBasico();
            }
          });
        } else {
          this.bloquearAsesorExt = true;
          this.AsessorNecesario = null;
          this.SetDataInfoBasico();
        }
      } else {
        this.infoJuridicoFrom.get('Nit')?.reset();
        // this.notif.onWarning('Advertencia', 'El asociado ya fue ingresado.');
      }
    
    } else {
      this.ValidarErrorForm(this.infoJuridicoFrom);
    }

  }

  SetDataInfoBasico() {
    this.basicosModel = new BasicosModel();
    this.siguiente = true;
    this.emitEvent.emit(this.positionTab);
    console.log(this.infoJuridicoFrom.value);
    this.juridicoModel.Nit = this.infoJuridicoFrom.value.Nit;
    localStorage.setItem('trasabilidad-juridico', window.btoa(JSON.stringify(this.juridicoModel.Nit)));
    this.juridicoModel.RazonSocial = this.infoJuridicoFrom.value.RazonSocial.substr(0, 1).toUpperCase() + this.infoJuridicoFrom.value.RazonSocial.substr(1).toLowerCase();

    this.juridicoModel.FechaMatricula = new Date();
    this.basicosModel.CIIU = this.infoJuridicoFrom.value.Ciiu;
    this.basicosModel.ConocioCoogranada = this.infoJuridicoFrom.value.Conocio;
    this.basicosModel.Estrato = this.infoJuridicoFrom.value.Estrato;
    this.basicosModel.FechaConstitucion = this.infoJuridicoFrom.value.FechaConstitucion;
    this.basicosModel.IdActividadEconomica = this.infoJuridicoFrom.value.Ciiu;
    // aqui realizar la prueba para guardar el Pais
    if (this.infoJuridicoFrom.value.Ciudad !== null && this.infoJuridicoFrom.value.Ciudad !== undefined) {
      this.basicosModel.IdCiudad = +this.infoJuridicoFrom.value.Ciudad;
    } else {
      this.basicosModel.IdCiudad = null;
    }
    if (this.infoJuridicoFrom.value.Pais !== null && this.infoJuridicoFrom.value.Pais !== undefined) {
      this.basicosModel.IdPais = +this.infoJuridicoFrom.value.Pais;
    } else {
      this.basicosModel.IdPais = null;
    }
    this.basicosModel.IdEstado = this.infoJuridicoFrom.value.Estado.IdEstado;
    this.basicosModel.IdJuridico = 0;
    this.basicosModel.IdJuridicoInfo = 0;
    this.basicosModel.IdObjetoSocial = this.infoJuridicoFrom.value.ObjetoSocial;
    this.basicosModel.IdOficina = +this.OficinaSeleccionada.Valor;
    this.basicosModel.IdRelacion = this.infoJuridicoFrom.value.Relacion;
    this.basicosModel.IdTipoLocal = this.infoJuridicoFrom.value.TipoLocal;
    this.basicosModel.IdTipoSociedad = this.infoJuridicoFrom.value.TipoSociedad;
    this.basicosModel.Proveedor = this.infoJuridicoFrom.value.Proveedor;
    if (this.infoJuridicoFrom.value.OtroPor !== null && this.infoJuridicoFrom.value.OtroPor !== undefined) {
      this.basicosModel.OtroPor =  this.infoJuridicoFrom.value.OtroPor.substr(0, 1).toUpperCase() + this.infoJuridicoFrom.value.OtroPor.substr(1).toLowerCase();
    }
    this.basicosModel.IdAsesorMatriculo = this.infoJuridicoFrom.value.CodigoAsesor;
    this.basicosModel.FechaMatricula = new Date().toJSON();
    this.basicosModel.IdAsesorExterno = this.infoJuridicoFrom.value.CodigoAsesorExt;
    this.basicosModel.IdAsesorRetira = this.infoJuridicoFrom.value.CodigoAsesorRetira;
    this.basicosModel.FechaRetiro = null;
    this.basicosModel.FechaModificacion = null;
    this.basicosModel.IdRepresentante = 0;
    this.infoTabAllInfo.JuridicoDto = this.juridicoModel;
    this.infoTabAllInfo.BasicosDto = this.basicosModel;
    console.log(this.infoTabAllInfo);
     this.IrArriba();
  }

  ActualizarInfoJuridico() {
    if (this.infoJuridicoFrom.valid && this.EditarFrom) {
      this.siguiente = true;
      console.log(this.infoJuridicoFrom.value);

      this.juridicoModel.IdJuridico = this.infoJuridicoFrom.value.IdJuridico;
      this.juridicoModel.Nit = this.infoJuridicoFrom.value.Nit;
      this.juridicoModel.RazonSocial = this.infoJuridicoFrom.value.RazonSocial;
      this.juridicoModel.FechaMatricula = this.infoJuridicoFrom.value.FechaConstitucion;

      if (this.infoJuridicoFrom.value.Ciiu !== undefined
        && this.infoJuridicoFrom.value.Ciiu !== null) {
        this.basicosModel.CIIU = this.infoJuridicoFrom.value.Ciiu;
        this.basicosModel.IdActividadEconomica = this.infoJuridicoFrom.value.Ciiu;
      } else {
        this.basicosModel.IdActividadEconomica = this.CiiuMapper.Id;
        this.basicosModel.CIIU = this.CiiuMapper.Id;
      }

      this.basicosModel.ConocioCoogranada = this.infoJuridicoFrom.value.Conocio;
      this.basicosModel.Estrato = this.infoJuridicoFrom.value.Estrato;
      this.basicosModel.FechaConstitucion = this.infoJuridicoFrom.value.FechaConstitucion;

      if (this.infoJuridicoFrom.value.Ciudad !== null && this.infoJuridicoFrom.value.Ciudad !== undefined) {
        if (this.infoJuridicoFrom.value.Ciudad !== undefined && this.infoJuridicoFrom.value.Ciudad !== null) {
          this.basicosModel.IdCiudad = +this.infoJuridicoFrom.value.Ciudad;
          this.basicosModel.IdPais = +this.infoJuridicoFrom.value.Pais;
        } else {
          this.basicosModel.IdCiudad = this.CiudadMapper.IdCiudad;
          this.basicosModel.IdPais = this.PaisMapper.IdPais
        }
      } else {
        if (this.infoJuridicoFrom.value.Pais !== undefined && this.infoJuridicoFrom.value.Pais !== null) {
          if (this.infoJuridicoFrom.value.Pais !== undefined && this.infoJuridicoFrom.value.Pais !== null) {
            this.basicosModel.IdPais = +this.infoJuridicoFrom.value.Pais;
            this.basicosModel.IdCiudad = null;
          } else {
            this.basicosModel.IdPais = this.PaisMapper.IdPais;
            this.basicosModel.IdCiudad = null;
          }
        } else {
          this.basicosModel.IdPais = this.PaisMapper.IdPais;
          this.basicosModel.IdCiudad = null;
        }
      }
      
      this.basicosModel.IdEstado = this.infoJuridicoFrom.value.Estado.IdEstado;
      this.basicosModel.IdJuridico = this.infoJuridicoFrom.value.IdJuridico;
      this.basicosModel.IdJuridicoInfo = this.infoJuridicoFrom.value.IdJuridicoInfo;
      this.basicosModel.IdObjetoSocial = this.infoJuridicoFrom.value.ObjetoSocial;
      this.basicosModel.IdOficina = this.OficinaSeleccionada.IdLista;
      this.basicosModel.IdRelacion = this.infoJuridicoFrom.value.Relacion;
      this.basicosModel.IdTipoLocal = this.infoJuridicoFrom.value.TipoLocal;
      this.basicosModel.IdTipoSociedad = this.infoJuridicoFrom.value.TipoSociedad;
      this.basicosModel.OtroPor = this.infoJuridicoFrom.value.OtroPor;
      this.infoTabAll.JuridicoDto = this.juridicoModel;
      this.infoTabAll.BasicoDto = this.basicosModel;
      this.GuardarLog(this.infoTabAll, this.OperacionActual, 0, this.juridicoModel.IdJuridico,12);
      this.juridicoService.EditarInfoJuridico(this.infoTabAll).subscribe(
        result => {
          if (result) {
            this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente');
            this.EditarFrom = false;
            this.IrArriba();
          }
        },
        error => {
          console.error('Error al realizar la actualizacion - juridicos: ' + error);
          this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
        });
    } else {
      if (!this.EditarFrom) {
        this.notif.onWarning('Advertencia', 'Se debe realizar un cambio para esta operación.');
      }
      this.ValidarErrorForm(this.infoJuridicoFrom);
    }
  }

  GestionarOperaciones() {    
    if (this.OperacionActual === 20) {
      this.juridicoService.TieneCuentas(this.JuridicoEdit).subscribe(
        resultCuenta => {
          if (!resultCuenta) {
            this.notif.onWarning('Advertencia', 'El asociado tiene cuentas activas, no se puede realizar el cambio de oficina.');
            this.emitEventResetOperacion.emit(true);
            this.mostrarSiguiente = false;
            this.mostrarActualizar = false;
            this.mostrarCambiar = false;
            this.mostrarNuevoInfo = false;
            this.IrArriba();
            this.emitEventOficina.emit(true);
          } else {
            this.CambiarOficina();
          }
        });
 
    } else if (this.OperacionActual === 29) {
      this.CambiarNit();
    } else if (this.OperacionActual === 30) {
      this.CambiarRazonSocial();
    } else if (this.OperacionActual === 26) {
      this.CambiarAsesor();
    } else if (this.OperacionActual === 19) {
      this.CambiarAsesorExterno();
    } else if (this.OperacionActual === 6) {
      this.CambiarFechaActualizacion();
    } else if (this.OperacionActual === 31) {
      this.CambiarEstado();
    } else if (this.OperacionActual === 4) {// aqui validar si pasa de tercero a asociado dejar sin problema
      const tipo = this.infoJuridicoFrom.get('Relacion')?.value;
      if (+this.relacionAnterior === 15 && +tipo !== 15) {
        this.CambiarRelacion();
      } else {
        this.clientesService.TieneCuentas(+this.infoJuridicoFrom.value.IdJuridico).subscribe(
          resultCuenta => {
            if (!resultCuenta) {
             
              this.notif.onWarning('Advertencia', 'No se puede realizar el cambio de relación, el asociado tiene cuentas activas.');
              this.mostrarSiguiente = false;
              this.mostrarActualizar = false;
              this.mostrarCambiar = false;
              this.mostrarNuevoInfo = false;
              this.bloquearRelacion = true;
              this.emitEventResetOperacion.emit(true);
              this.IrArriba();
            } else {
              this.CambiarRelacion();
            }
          });
      }
      
    }

  }

  CambiarOficina() {
    const juridico = this.infoJuridicoFrom.value.IdJuridico;
    if (this.OficinaChanged !== null && this.OficinaChanged !== undefined) {
      const info = +this.OficinaChanged.Valor;
      // if (info !== null && info !== undefined && !isNaN(info)) {
     if (this.OficinaMapper.Descripcion != this.OficinaChanged) {
       if (!isNaN(info)) {
         this.GuardarLog('Cambio de oficina: ' + info + ' juridico : ' + juridico, this.OperacionActual, 0, juridico,12);
         this.juridicoService.CambiarOficina(juridico, info, this.userConect.lngTercero).subscribe(
           result => {
             if (result) {
               this.mostrarSiguiente = false;
               this.mostrarActualizar = false;
               this.mostrarCambiar = false;
               this.mostrarNuevoInfo = false;
               this.emitEventOficina.emit(true);

               this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
               this.IrArriba();
               $('#OperacionMarcada').val(1);
               $('#ProDescripcionOpe').val(1);
             }
           },
           error => {
             console.error('Error al realizar la actualizacion - juridicos: ' + error);
             this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
           });
       } else {
         this.notif.onWarning('Advertencia', 'Debe seleccionar una oficina valida.');
       }
      } else {
       this.notif.onWarning('Advertencia', 'Debe seleccionar una oficina diferente.');
      }
    } else {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una oficina valida.');
    }
  }

  CambiarNit() {
    this.loading = true;
    const info = this.infoJuridicoFrom.get('Nit')?.value;
    if (info === this.NitConsultado) {
      this.notif.onWarning('Advertencia', 'Debe ingresar un nit diferente.');
    } else {
      const juridico = this.infoJuridicoFrom.value.IdJuridico;
      if (info !== null && info !== undefined && info !== '') {
        if (info.trim() !== "") {
          this.GuardarLog('Cambio de Nit: ' + info + ' juridico : ' + juridico, this.OperacionActual, 0, juridico,12);
          this.juridicoService.CambiarNit(juridico, info, this.userConect.Usuario).subscribe(
            result => {
              this.loading = false;
              if (result) {
                this.mostrarSiguiente = false;
                this.mostrarActualizar = false;
                this.mostrarCambiar = false;
                this.mostrarNuevoInfo = false;
                this.bloquearNit = true;
                this.emitEventResetOperacion.emit(true);
                this.notif.onSuccess('Exitoso', 'El cambio de nit se realizó correctamente.');
                this.IrArriba();
                $('#OperacionMarcada').val(1);
                $('#ProDescripcionOpe').val(1);
              }
            },
            error => {
              console.error('Error al realizar la actualizacion - juridicos: ' + error);
              // this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error,
              //   ConfiguracionNotificacion.configRightTopNoClose);
            });
        } else {
          this.loading = false;
          this.IrArriba();
          this.infoJuridicoFrom.get('Nit')?.reset();
          this.notif.onWarning('Advertencia', 'Debe ingresar un valor valido.');
        }
      } else {
        this.loading = false;
        this.IrArriba();
        this.notif.onWarning('Advertencia', 'El campo Nit es obligatorio.');
      }
    }
  }

  CambiarRazonSocial() {
    this.loading = true;
    const juridico = this.infoJuridicoFrom.value.IdJuridico;
    var info = this.infoJuridicoFrom.get('RazonSocial')?.value;
    var docu = this.infoJuridicoFrom.get('Nit')?.value;
    info = info.substr(0, 1).toUpperCase() + info.substr(1).toLowerCase();
    if (info !== null && info !== undefined && info !== '') {
      if (info.trim() !== "") {
        if (info != this.RazonSocialMapper ) {
          // if (this.infoJuridicoFrom.valid) {
            this.GuardarLog('Cambio de razon social: ' + info + ' juridico : ' + juridico,
              this.OperacionActual, 0, juridico,12);
          this.juridicoService.CambiarRazonSocial(juridico, info, docu, this.userConect.Usuario).subscribe(
            result => {
              this.loading = false;
                if (result) {
                  this.mostrarSiguiente = false;
                  this.mostrarActualizar = false;
                  this.mostrarCambiar = false;
                  this.mostrarNuevoInfo = false;
                  this.bloquearRazonSocial = true;
                  this.emitEventResetOperacion.emit(true);
                  this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
                  this.IrArriba();
                  $('#OperacionMarcada').val(1);
                  $('#ProDescripcionOpe').val(1);
                 
                }
              },
            error => {
              this.loading = false;
                console.error('Error al realizar la actualizacion - juridicos: ' + error);
                this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
              });         
        } else {
          this.loading = false;
          this.IrArriba();
          this.infoJuridicoFrom.get('RazonSocial')?.reset();
          this.notif.onWarning('Advertencia', 'Debe ingresar una razón social diferente.');
        }
      } else {
        this.loading = false;
        this.IrArriba();
        this.infoJuridicoFrom.get('RazonSocial')?.reset();
        this.notif.onWarning('Advertencia', 'Debe ingresar un valor valido.');
      }
    } else {
      this.loading = false;
      this.IrArriba();
      this.notif.onWarning('Advertencia', 'Debe ingresar la razón social.');
    }
  }

  CambiarEstado() {
    this.loading = true;
    const juridico = this.infoJuridicoFrom.value.IdJuridico;
    this.estadoSeleccion = this.infoJuridicoFrom.get('Estado')?.value;
    if (this.estadoSeleccion !== null && this.estadoSeleccion !== undefined) {
        if (this.AnteriorEstadoSeleccion.IdEstado !== this.estadoSeleccion.IdEstado) {
          this.GuardarLog('Cambio de estado: ' + this.estadoSeleccion.IdEstado + ' juridico : ' + juridico, this.OperacionActual, 0, juridico,12);
          this.juridicoService.CambiarEstado(juridico, this.estadoSeleccion.IdEstado, this.userConect.lngTercero, '').subscribe(
            result => {
              this.loading = false;
              if (result) {
                this.bloquearEstado = true;
                  if (this.estadoSeleccion.IdEstado !== 42) {
                      this.mostrarSiguiente = false;
                      this.mostrarActualizar = false;
                      this.mostrarCambiar = false;
                      this.mostrarNuevoInfo = false;
                      this.bloquearEstado = true;           
                      this.emitEventResetOperacion.emit(true);
                    this.notif.onSuccess('Exitoso', 'El cambio de estado se realizó correctamente.');
                      this.IrArriba();
                    this.generalesService.AgregarDisabled('estadoJur');
                    $('#OperacionMarcada').val(1);
                    $('#ProDescripcionOpe').val(1);
                  } else {
                    this.mostrarSiguiente = false;
                    this.mostrarActualizar = false;
                    this.mostrarCambiar = false;
                    this.mostrarNuevoInfo = false;
                    this.bloquearEstado = true;
                    this.emitEventResetOperacion.emit(true);
                    this.notif.onSuccess('Exitoso', 'El cambio de estado se realizó correctamente.');
                    this.IrArriba();
                    this.AbrirDescripcion.nativeElement.click();
                    this.generalesService.AgregarDisabled('estadoJur');
                    $('#OperacionMarcada').val(1);
                    $('#ProDescripcionOpe').val(1);
                  }
                }
              },
            error => {
              this.loading = false;
                console.error('Error al realizar la actualización - juridicos: ' + error);
                this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
              });
        } else {
          this.loading = false;
        this.notif.onWarning('Advertencia', 'Debe seleccionar un estado para esta operación.');
        }
    } else {
      this.loading = false;
      this.notif.onWarning('Advertencia', 'Debe seleccionar un estado valido.');
    }
  }

  CambiarAsesor() {
    this.loading = true;
    const juridico = this.infoJuridicoFrom.value.IdJuridico;
    const info = this.infoJuridicoFrom.get('CodigoAsesor')?.value;
    const infoName = this.infoJuridicoFrom.get('NombreAsesor')?.value;
    if (this.EditAsesorExt) {
      if (info !== null && info !== undefined && info !== ''
        && infoName !== null && infoName !== undefined && infoName !== '') {
        this.GuardarLog('Cambio de asesor: ' + info + ' juridico : ' + juridico, this.OperacionActual, 0, juridico,12);
        this.juridicoService.CambiarAsesor(juridico, info, this.userConect.lngTercero).subscribe(
          result => {
            this.loading = false;
            if (result) {
              this.mostrarSiguiente = false;
              this.mostrarActualizar = false;
              this.mostrarCambiar = false;
              this.mostrarNuevoInfo = false;
              this.bloquearEstado = true;
              this.bloquearAsesor = true;
              this.EditAsesorExt = false;
              this.emitEventResetOperacion.emit(true);
              this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
              this.IrArriba();
              $('#OperacionMarcada').val(1);
              $('#ProDescripcionOpe').val(1);
            }
          },
          error => {
            this.loading = false;
            console.error('Error al realizar la actualizacion - juridicos: ' + error);
            this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
          });
      } else {
        this.loading = false;
        this.notif.onWarning('Advertencia', 'Debe seleccionar un asesor valido.');
      }
    } else {
      this.loading = false;
      this.notif.onWarning('Advertencia', 'Debe seleccionar un asesor diferente.');
    }
  }

  CambiarAsesorExterno() {
    this.loading = true;
    if (this.CodEditAsesorExt) {
      const juridico = this.infoJuridicoFrom.value.IdJuridico;
      const info = this.infoJuridicoFrom.get('CodigoAsesorExt')?.value;
      const infoName = this.infoJuridicoFrom.get('NombreAsesorExt')?.value;      
        this.GuardarLog('Cambio de asesor externo: ' + info + ' juridico : ' + juridico, this.OperacionActual, 0, juridico,12);
        this.juridicoService.CambiarAsesorExterno(juridico, info, this.userConect.lngTercero).subscribe(
          result => {
            this.loading = false;
            if (result) {
              this.mostrarSiguiente = false;
              this.mostrarActualizar = false;
              this.mostrarCambiar = false;
              this.mostrarNuevoInfo = false;
              this.bloquearEstado = true;
              this.bloquearAsesorExt = true;
              this.disableAsesorExt = true;
              this.CodEditAsesorExt = false;
              this.emitEventResetOperacion.emit(true);
              this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
              this.IrArriba();
              $('#OperacionMarcada').val(1);
              $('#ProDescripcionOpe').val(1);
            }
          },
          error => {
            this.loading = false;
            console.error('Error al realizar la actualizacion - juridicos: ' + error);
            this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
          });
      
     } else {
      this.notif.onWarning('Advertencia', 'Debe seleccionar un asesor diferente.');
    }
  }

  CambiarFechaActualizacion() {
    const juridico = this.infoJuridicoFrom.value.IdJuridico;
    this.GuardarLog('Cambio de fecha actualizacion - juridico : ' + juridico, this.OperacionActual, 0, juridico,12);
    this.juridicoService.CambiarFechaJuridico(juridico).subscribe(
      result => {
        if (result) {
          this.mostrarSiguiente = false;
          this.mostrarActualizar = false;
          this.mostrarCambiar = false;
          this.mostrarNuevoInfo = false;
          this.bloquearEstado = true;
          this.bloquearAsesorExt = true;
          this.emitEventResetOperacion.emit(true);
          this.notif.onSuccess('Exitoso', 'La fecha de actualización se cambió correctamente.');
          this.IrArriba();
          $('#OperacionMarcada').val(1);
          $('#ProDescripcionOpe').val(1);
        }
      },
      error => {
        console.error('Error al realizar la actualizacion - juridicos: ' + error);
        this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
      });
  }

  CambiarRelacion() {
    if (this.cambioRelacionEdit) {
      if (this.relacionAnterior !== this.infoJuridicoFrom.value.Relacion ) {
        const juridico = this.infoJuridicoFrom.value.IdJuridico;
        const relacion = this.infoJuridicoFrom.value.Relacion;
        const docum = this.infoJuridicoFrom.value.Nit;
        const asesor = this.userConect.Usuario;
        const objeto = this.infoJuridicoFrom.get('ObjetoSocial')?.value;
        this.GuardarLog('Cambio de relacion: ' + relacion + ' juridico : ' + juridico, this.OperacionActual, 0, juridico,12);
        this.juridicoService.CambiarRelacion(juridico, relacion, docum, asesor, objeto).subscribe(
          result => {
            if (result) {
              this.mostrarSiguiente = false;
              this.mostrarActualizar = false;
              this.mostrarCambiar = false;
              this.mostrarNuevoInfo = false;
              this.bloquearRelacion = true;
              this.emitEventResetOperacion.emit(true);
              this.notif.onSuccess('Exitoso', 'El cambio de relación se realizó correctamente.');
              this.IrArriba();
              $('#OperacionMarcada').val(1);
              $('#ProDescripcionOpe').val(1);
            }
          },
          error => {
            console.error('Error al realizar la actualizacion - juridicos: ' + error);
            this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
          });
      } else {
        this.notif.onWarning('Advertencia', 'Debe seleccionar una relación diferente.');
        
      }
    } else {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una relación diferente.');
    }
  }

  ValidarFechaConstitucion() {
    const fechaConstitucion = this.infoJuridicoFrom.get('FechaConstitucion')?.value;
    const fechaActual = new Date();
    const constitucionFormat = new Date(fechaConstitucion);
    const fechaAntigua = new Date('01-01-1899');
    if (fechaConstitucion !== null && fechaConstitucion !== undefined && fechaConstitucion !== '') {
       if (constitucionFormat > fechaActual) {
          this.notif.onWarning('Advertencia',
            'La fecha de constitución no puede ser mayor a la fecha actual.');
        this.infoJuridicoFrom.get('FechaConstitucion')?.reset();
      }
      if (constitucionFormat < fechaAntigua) {
        this.notif.onWarning('Advertencia',
          'La fecha de constitución no es valida, selecione una fecha valida.');
        this.infoJuridicoFrom.get('FechaConstitucion')?.reset();
      }
    }
  }

  ValidarMetodoConocio() {
    const conocio = this.infoJuridicoFrom.get('Conocio')?.value;
    if (+conocio === 7  || +conocio === 6) {
      this.MostrarOtroPor = true;
      this.AddValidaciones();
    } else {
      this.RemoveValidatociones();
      this.MostrarOtroPor = false;
      this.infoJuridicoFrom.get('OtroPor')?.reset();

    }
  }

  GuardarDescripcionNegado() {
    var observa = this.DescripcionNegacionForm.get('DescripcionNegacion')?.value;
    observa = observa.substr(0, 1).toUpperCase() + observa.substr(1).toLowerCase();
    if (observa !== null && observa !== undefined && observa !== '') {
      this.mostrarSpanAlertaNegacion = false;
      const juridico = this.infoJuridicoFrom.value.IdJuridico;
      this.juridicoService.CambiarEstado(juridico, this.estadoSeleccion.IdEstado, this.userConect.lngTercero, observa).subscribe(
            result => {
              if (result) {
                this.bloquearEstado = true;
                if (this.estadoSeleccion.IdEstado !== 42) {
                  this.emitEventResetOperacion.emit(true);
                  this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
                  this.CerrarDescripcion.nativeElement.click();
                  $('#OperacionMarcada').val(1);
                  $('#ProDescripcionOpe').val(1);

                } else {
                  this.emitEventResetOperacion.emit(true);
                  this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
                  this.CerrarDescripcion.nativeElement.click();
                  $('#OperacionMarcada').val(1);
                  $('#ProDescripcionOpe').val(1);
                }
              }
            },
            error => {
              console.error('Error al realizar la actualización - juridicos: ' + error);
              this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
            });
    } else {
      this.mostrarSpanAlertaNegacion = true;
    }
  }

  //#region Consulta para asesor Externo
      GetAsesorExternoCodigo() {
        // if (this.infoJuridicoFrom.valid) {
          if (this.infoJuridicoFrom.value.CodigoAsesorExt !== null && this.infoJuridicoFrom.value.CodigoAsesorExt !== '') {
            const modelAsesor = new AsesorModel();
            modelAsesor.strCodigo = this.infoJuridicoFrom.value.CodigoAsesorExt;
            modelAsesor.strNombre = '';
            modelAsesor.strTipo = '';
            this.clientesGetListService.GetAsesorExterno(modelAsesor).subscribe(
              result => {
                if (result.length > 1) {
                  this.dataAsesorExterno = result;
                  this.BuscarAsesoresExt.nativeElement.click();
                } else {
                  if (result.length !== 0) {
                    result.forEach((elementex : any) => {
                      this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue(elementex.Nombre);
                      this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(elementex.intIdAsesor);
                      // this.infoJuridicoFrom.get('IdAsesorExterno')?.setValue(elementex.lngTercero);
                    });
                  } else {
                    this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue('');
                    this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue('');
                    // this.terceroSave.get('IdAsesorExterno')?.reset();
                      this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');   
                  }
                }
              },
              error => {
                this.notif.onDanger('Error', error);
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          } else {
            this.notif.onWarning('Advertencia', 'Los datos ingresados no son validos.');
            this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue('');
            this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue('');
          }
        // } else {
          
        // }
      }

      GetAsesorExternoCodigoFirst(codigo : any) {
        const modelAsesor = new AsesorModel();
        modelAsesor.strCodigo = codigo;
        modelAsesor.strNombre = '';
        modelAsesor.strTipo = '';
        this.clientesGetListService.GetAsesorExterno(modelAsesor).subscribe(
          result => {
            if (result.length > 1) {
              this.dataAsesorExterno = result;
              this.BuscarAsesoresExt.nativeElement.click();
            } else {
              if (result.length !== 0) {
                result.forEach((elements : any) => {
                  this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue(elements.Nombre);
                  this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(elements.intIdAsesor);
                  // this.terceroSave.get('IdAsesorExterno')?.setValue(elements.intIdAsesor);
                });
              } else {
                this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue('');
                this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue('');
                // this.terceroSave.get('IdAsesorExterno')?.reset();
                  this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
              }
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }

      GetAsesorExternoNombre() {
        this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue('');
        const modelAsesor = new AsesorModel();
        modelAsesor.strCodigo = '';
        modelAsesor.strNombre = this.infoJuridicoFrom.value.NombreAsesorExt;
        modelAsesor.strTipo = '';
        this.clientesGetListService.GetAsesorExterno(modelAsesor).subscribe(
          result => {
            if (result.length > 1) {
              this.dataAsesorExterno = result;
              this.BuscarAsesoresExt.nativeElement.click();
            } else {
              if (result.length !== 0) {
                result.forEach((elemento : any) => {
                  this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue(elemento.Nombre);
                  this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(elemento.intIdAsesor);
                  // this.terceroSave.get('IdAsesorExterno')?.setValue(elemento.lngTercero);
                });
              } else {
                this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue('');
                this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue('');
                // this.terceroSave.get('IdAsesorExterno')?.reset();
                  this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
              }
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }

      GetAsesorExternoAll() {
        const modelAsesor = new AsesorModel();
        modelAsesor.strTipo = '';
        if (this.infoJuridicoFrom.value.NombreAsesorExt !== '' && this.infoJuridicoFrom.value.NombreAsesorExt !== null) {
          modelAsesor.strNombre = this.infoJuridicoFrom.value.NombreAsesorExt;
        } else if (this.infoJuridicoFrom.value.CodigoAsesorExt !== '' && this.infoJuridicoFrom.value.CodigoAsesorExt !== null) {
          modelAsesor.strNombre = '';
        } else {
          modelAsesor.strCodigo = '';
          modelAsesor.strNombre = '';
        }
        this.clientesGetListService.GetAsesorExterno(modelAsesor).subscribe(
          result => {
            if (result.length > 1) {
              this.dataAsesorExterno = result;
              this.BuscarAsesoresExt.nativeElement.click();
            } else {
              if (result.length !== 0) {
                this.infoJuridicoFrom.get('NombreAsesorExt')?.reset();
                this.infoJuridicoFrom.get('CodigoAsesorExt')?.reset();
                result.forEach((elementt : any)=> {
                  this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue(elementt.Nombre);
                  this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue(elementt.intIdAsesor);
                  // this.terceroSave.get('IdAsesorExterno')?.setValue(elementt.lngTercero);
                });
              } else {
                this.infoJuridicoFrom.get('NombreAsesorExt')?.setValue('');
                this.infoJuridicoFrom.get('CodigoAsesorExt')?.setValue('');
                // this.terceroSave.get('IdAsesorExterno')?.reset();
                  this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
              }
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }
  //#endregion Fin consultas asesor Externo

  //#region Consultar para asesor

      GetAsesorCodigo() {
        // if (this.infoJuridicoFrom.valid) {
          if (this.infoJuridicoFrom.value.CodigoAsesor !== null && this.infoJuridicoFrom.value.CodigoAsesor !== '') {
            const modelAsesor = new AsesorModelPpal();
            modelAsesor.strCodigoAse = this.infoJuridicoFrom.value.CodigoAsesor;
            modelAsesor.strNombreAse = '';
            modelAsesor.strTipoAse = '';
            this.clientesGetListService.GetAsesor(modelAsesor).subscribe(
              result => {
                if (result.length > 1) {
                  this.dataAsesorPpal = result;
                  this.BuscarAsesoresPpal.nativeElement.click();
                } else {
                  if (result.length !== 0) {
                    result.forEach((elementex : any) => {
                      this.infoJuridicoFrom.get('NombreAsesor')?.setValue(elementex.Nombre);
                      this.infoJuridicoFrom.get('CodigoAsesor')?.setValue(elementex.IdAsesor);
                      // this.terceroSave.get('IdAsesorExterno')?.setValue(elementex.lngTercero);
                    });
                  } else {
                    if (this.infoJuridicoFrom.value.CodigoAsesor === 2) {
                      this.infoJuridicoFrom.get('NombreAsesor')?.setValue('Coogranada');
                      this.infoJuridicoFrom.get('CodigoAsesor')?.setValue(2);
                    } else {
                      this.infoJuridicoFrom.get('NombreAsesor')?.setValue('');
                      this.infoJuridicoFrom.get('CodigoAsesor')?.setValue('');
                      // this.terceroSave.get('IdAsesorExterno')?.reset();
                      this.notif.onWarning('Advertencia', 'No se encontró el asesor.');

                    }                   
                  }
                }
              },
              error => {
                this.notif.onDanger('Error', error);
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          } else {
            this.notif.onWarning('Advertencia', 'Los datos ingresados no son validos.');
            this.infoJuridicoFrom.get('NombreAsesor')?.setValue('');
            this.infoJuridicoFrom.get('CodigoAsesor')?.setValue('');
          }
       
      }

      GetAsesorCodigoFirst(codigo : any) {
        const modelAsesor = new AsesorModelPpal();
        modelAsesor.strCodigoAse = codigo;
        modelAsesor.strNombreAse = '';
        modelAsesor.strTipoAse = '';
        this.clientesGetListService.GetAsesor(modelAsesor).subscribe(
          result => {
            if (result.length > 1) {
              this.dataAsesorPpal = result;
              this.BuscarAsesoresPpal.nativeElement.click();
            } else {
              if (result.length !== 0) {
                result.forEach((elements : any) => {
                  this.infoJuridicoFrom.get('NombreAsesor')?.setValue(elements.Nombre);
                  this.infoJuridicoFrom.get('CodigoAsesor')?.setValue(elements.IdAsesor);
                  // this.terceroSave.get('IdAsesorExterno')?.setValue(elements.intIdAsesor);
                });
              } else {
                this.infoJuridicoFrom.get('NombreAsesor')?.setValue('');
                this.infoJuridicoFrom.get('CodigoAsesor')?.setValue('');
                // this.terceroSave.get('IdAsesorExterno')?.reset();
                this.notif.onWarning('Advertencia', 'No se encontró el asesor.');
              }
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }

      GetAsesorNombre() {
        const modelAsesor = new AsesorModelPpal();
        modelAsesor.strCodigoAse = '';
        modelAsesor.strNombreAse = this.infoJuridicoFrom.value.NombreAsesor;
        modelAsesor.strTipoAse = '';
        this.clientesGetListService.GetAsesor(modelAsesor).subscribe(
          result => {
            if (result.length > 1) {
              this.dataAsesorPpal = result;
              this.BuscarAsesoresPpal.nativeElement.click();
            } else {
              if (result.length !== 0) {
                result.forEach((elemento : any) => {
                  this.infoJuridicoFrom.get('NombreAsesor')?.setValue(elemento.Nombre);
                  this.infoJuridicoFrom.get('CodigoAsesor')?.setValue(elemento.IdAsesor);
                  // this.terceroSave.get('IdAsesorExterno')?.setValue(elemento.lngTercero);
                });
              } else {
                this.infoJuridicoFrom.get('NombreAsesor')?.setValue('');
                this.infoJuridicoFrom.get('CodigoAsesor')?.setValue('');
                // this.terceroSave.get('IdAsesorExterno')?.reset();
                this.notif.onWarning('Advertencia', 'No se encontró el asesor.');
              }
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }

      GetAsesorAll() {
        const modelAsesor = new AsesorModelPpal();
        modelAsesor.strTipoAse = '';
        if (this.infoJuridicoFrom.value.NombreAsesor !== '' && this.infoJuridicoFrom.value.NombreAsesor !== null) {
          modelAsesor.strCodigoAse = '';
          modelAsesor.strNombreAse = this.infoJuridicoFrom.value.NombreAsesor;
        } else if (this.infoJuridicoFrom.value.CodigoAsesor !== '' && this.infoJuridicoFrom.value.CodigoAsesor !== null) {
          modelAsesor.strNombreAse = '';
          modelAsesor.strCodigoAse = this.infoJuridicoFrom.value.CodigoAsesor;
        } else {
          modelAsesor.strCodigoAse = '';
          modelAsesor.strNombreAse = '';
        }

        this.clientesGetListService.GetAsesor(modelAsesor).subscribe(
          result => {
            if (result.length > 1) {
              this.dataAsesorPpal = result;
              this.BuscarAsesoresPpal.nativeElement.click();
            } else {
              if (result.length !== 0) {
                this.infoJuridicoFrom.get('NombreAsesor')?.reset();
                this.infoJuridicoFrom.get('CodigoAsesor')?.reset();
                result.forEach((elementt : any) => {
                  this.infoJuridicoFrom.get('NombreAsesor')?.setValue(elementt.Nombre);
                  this.infoJuridicoFrom.get('CodigoAsesor')?.setValue(elementt.IdAsesor);
                  // this.terceroSave.get('IdAsesorExterno')?.setValue(elementt.lngTercero);
                });
              } else {
                this.infoJuridicoFrom.get('NombreAsesor')?.setValue('');
                this.infoJuridicoFrom.get('CodigoAsesor')?.setValue('');
                // this.terceroSave.get('IdAsesorExterno')?.reset();
                this.notif.onWarning('Advertencia', 'No se encontró el asesor.');
              }
            }
          },
          error => {
            this.notif.onDanger('Error', error);
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }

  //#endregion Fin consulta para asesor

  LimpiarIdAsesorExternoNombre() {
    // this.terceroSave.value.IdAsesorExterno = '';
    this.infoJuridicoFrom.get('NombreAsesorExt')?.reset();
  }

  LimpiarIdAsesorExternoCodigo() {
    this.infoJuridicoFrom.get('CodigoAsesorExt')?.reset();
    // const asesorValue = this.asesorForm.get('strCodigo')?.value;

    // this.terceroSave.value.IdAsesorExterno = '';
  }

  LimpiarIdAsesorCodigo() {
    this.infoJuridicoFrom.get('CodigoAsesor')?.reset();
  }

  LimpiarIdAsesorNombre() {
    this.infoJuridicoFrom.get('NombreAsesor')?.reset();
  }

  DesbloquearAsesorExterno() {
    this.disableAsesorExt = null;
    this.bloquearAsesorExt = null;
  }

  ValidarJuridicosRegistrados() {
    this.validarNit = false;
    const nit = this.infoJuridicoFrom.get('Nit')?.value;
    if (nit !== this.NitConsultado) {
      if (nit.trim() !== "") {
      this.ValidarVetadosDocumentoBusqueda();
      this.juridicoService.BuscarJuridicosAll(nit, '*').subscribe(
        result => {
          if (result !== null && result !== undefined) {
            if (result.JuridicoDto !== undefined || result.JuridicoDto !== null) {
              this.infoJuridicoFrom.get('Nit')?.reset();
              this.notif.onWarning('Advertencia', 'El asociado ya fue ingresado.');
              this.validarNit = false;
            } else {
              this.validarNit = true;
            }
          } else {
            this.validarNit = true;
          }
        },
        error => {
          console.error('Error -' + error);
        })
      } else {
        this.IrArriba();
        this.infoJuridicoFrom.get('Nit')?.reset();
        this.notif.onWarning('Advertencia', 'Debe ingresar un valor valido.');
      }
    }
  }

  ValidarVetadosDocumento() {
    let mensaje = '';
    this.vetadosFrom.get('documeto')?.setValue(this.infoJuridicoFrom.get('Nit')?.value);
    this.vetadosFrom.get('strNombreCompleto')?.setValue('');
    this.clientesService.ValidarVetados(this.vetadosFrom.value).subscribe(
      result => {
        if (result.length > 0) {
          if (result[0].blnExterno) {
            mensaje = ' comuniquese con el Oficial de cumplimiento';
          } else {
            mensaje = ' comuniquese con Gerencia de desarrollo';
          }
          this.infoJuridicoFrom.get('Nit')?.reset();
          swal.fire({
            icon: 'error',
            title: '<strong>! Advertencia ¡</strong>',
            html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b>, por favor ' + mensaje,
            animation: false,
            //customClass: 'animated tada',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: 'rgb(160, 0, 87)'
          });
        }
      },
      error => {
        this.notif.onDanger('Error', error);
        console.log('ValidarVetados - ' + error);
      });
  }

  ValidarVetadosDocumentoBusqueda() {
    let mensaje = '';
    this.vetadosFrom.get('documeto')?.setValue(this.infoJuridicoFrom.get('Nit')?.value);
    this.vetadosFrom.get('strNombreCompleto')?.setValue('');
    this.clientesService.ValidarVetados(this.vetadosFrom.value).subscribe(
      result => {
        if (result.length > 0) {
          if (result[0].blnExterno) {
            mensaje = ' comuniquese con el Oficial de cumplimiento';
          } else {
            mensaje = ' comuniquese con Gerencia de desarrollo';
          }
          this.infoJuridicoFrom.get('Nit')?.reset();
          swal.fire({
            icon: 'error',
            title: '<strong>! Advertencia ¡</strong>',
            html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b>, por favor ' + mensaje,
            animation: false,
            //customClass: 'animated tada',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: 'rgb(160, 0, 87)'
          });
        }
      },
      error => {
        this.notif.onDanger('Error', error);
        console.log('ValidarVetados - ' + error);
      });

  }

//#endregion

  //#region Metodos Inicializacion y generales
  ValidarErrorForm(formulario: any) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      const control = formulario.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }

  validarInfoJuridico() {
    const IdJuridico = new FormControl('', []);
    const IdJuridicoInfo = new FormControl('', []);

    const Relacion = new FormControl('', [Validators.required]);
    const Pais = new FormControl('', []);
    const Departamento = new FormControl('', []);
    const Ciudad = new FormControl('', []);
    const Conocio = new FormControl('', []);
    const Estado = new FormControl('', []);
    const Estrato = new FormControl('', []);
    const ObjetoSocial = new FormControl('', []);
    const TipoSociedad = new FormControl('', [Validators.required]);
    const Nit = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*')]);
    const RazonSocial = new FormControl('', [Validators.required, Validators.pattern('[A-Za-zñÑ0-9&+ .]+')]);
    const FechaConstitucion = new FormControl('', []);
    const Ciiu = new FormControl('', [Validators.required]);
    const ActividadEconomica = new FormControl('', [Validators.required]);
    const TipoLocal = new FormControl('', []);
    const OtroPor = new FormControl('', []);

    const CodigoAsesor = new FormControl('', [Validators.pattern('^[0-9]*')]);
    const NombreAsesor = new FormControl('', [Validators.pattern('[A-Za-zñÑ0-9& ]+')]);

    const CodigoAsesorExt = new FormControl('', [Validators.pattern('^[0-9]*')]);
    const NombreAsesorExt = new FormControl('', [Validators.pattern('[A-Za-zñÑ0-9& ]+')]);

    const CodigoAsesorMod = new FormControl('', []);
    const CodigoAsesorRetira = new FormControl('', []);

    const FechaMatricula = new FormControl('', []);
    const FechaModificacion = new FormControl('', []);
    const FechaRetira = new FormControl('', []);

    const DescripcionNegacion = new FormControl('', []);
    const nomina = new FormControl('', []);
    const nro = new FormControl('', []);

    const documeto = new FormControl('', []);
    const strNombreCompleto = new FormControl('', []);
    const Proveedor = new FormControl('', []);

    this.infoJuridicoFrom = this.formBuilder.group({
      IdJuridico: IdJuridico,
      IdJuridicoInfo: IdJuridicoInfo,
      Relacion: Relacion,
      Proveedor: Proveedor,
      Pais: Pais,
      Departamento: Departamento,
      Ciudad: Ciudad,
      Conocio: Conocio,
      Estado: Estado,
      Estrato: Estrato,
      ObjetoSocial: ObjetoSocial,
      TipoSociedad: TipoSociedad,
      Nit: Nit,
      RazonSocial: RazonSocial,
      FechaConstitucion: FechaConstitucion,
      Ciiu: Ciiu,
      ActividadEconomica: ActividadEconomica,
      TipoLocal: TipoLocal,
      OtroPor: OtroPor,
      CodigoAsesor: CodigoAsesor,
      NombreAsesor: NombreAsesor,
      CodigoAsesorExt: CodigoAsesorExt,
      NombreAsesorExt: NombreAsesorExt,
      CodigoAsesorMod: CodigoAsesorMod,
      CodigoAsesorRetira: CodigoAsesorRetira,
      FechaMatricula: FechaMatricula,
      FechaModificacion: FechaModificacion,
      FechaRetira: FechaRetira,
      nomina: nomina,
      nro
    });

    this.DescripcionNegacionForm = this.formBuilder.group({
      DescripcionNegacion: DescripcionNegacion
    });
    
   

    this.vetadosFrom = new FormGroup({
      documeto: documeto,
      strNombreCompleto: strNombreCompleto
    });
  
  }

  GenericoSelect(input : string, form : any) {
    if (+form.get('' + input + '')?.value === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una opción valida.');
      form.get('' + input + '')?.reset();
    }
  }

  validarTipoSociedad() {
    if (this.OperacionActual === 1) {
      if (this.infoJuridicoFrom.get('Relacion')?.value === 15) {
        this.clientesGetListService.GetEstado().subscribe(
          result => {
            this.dataEstados = result;
            result.forEach((elementEsta : any ) =>  {
              if (elementEsta.IdEstado === 5) {
                this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
              }
            });
          })
      } else if (this.infoJuridicoFrom.get('Relacion')?.value === 5) {
        if (+this.infoJuridicoFrom.get('ObjetoSocial')?.value === 2) {
          this.clientesGetListService.GetEstado().subscribe(
            result => {
              this.dataEstados = result;
              result.forEach((elementEsta : any ) =>  {
                if (elementEsta.IdEstado === 5) {
                  this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
                }
              });
            })
        } else {
          this.clientesGetListService.GetEstado().subscribe(
            result => {
              this.dataEstados = result;
              result.forEach((elementEsta : any ) =>  {
                if (elementEsta.IdEstado === 47) {
                  this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
                }
              });
            })
        }
      }
    } else if (this.OperacionActual === 5) {
      if (this.infoJuridicoFrom.get('Relacion')?.value === '15') {
        this.clientesGetListService.GetEstado().subscribe(
          result => {
            this.dataEstados = result;
            result.forEach((elementEsta : any ) =>  {
              if (elementEsta.IdEstado === 5) {
                this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
              }
            });
          })
      } else if (this.infoJuridicoFrom.get('Relacion')?.value === '5') {
        if (+this.infoJuridicoFrom.get('ObjetoSocial')?.value === 2) {
          this.clientesGetListService.GetEstado().subscribe(
            result => {
              this.dataEstados = result;
              result.forEach((elementEsta : any ) =>  {
                if (elementEsta.IdEstado === 5) {
                  this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
                }
              });
            })
        } else {
          this.clientesGetListService.GetEstado().subscribe(
            result => {
              this.dataEstados = result;
              result.forEach((elementEsta : any ) =>  {
                if (elementEsta.IdEstado === 47) {
                  this.infoJuridicoFrom.get('Estado')?.setValue(elementEsta);
                }
              });
            })
        }
      }
    }
  }

  RazonSocialCapitalice() {
    let self = this;
    $('#razonSocial').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  OtroPorCapitalice() {
    let self = this;
    $('#idOtroPor').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  NegacionCapitalice() {
    let self = this;
    $('#txtObservacion').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  AddValidaciones() {
    this.RemoveValidatociones();
    this.infoJuridicoFrom.controls['OtroPor'].setValidators([Validators.required,
    Validators.pattern('[A-Za-zñÑ0-9 ]+')]);
    this.infoJuridicoFrom.controls['OtroPor'].setErrors({ 'incorrect': true });
  }

  RemoveValidatociones() {
    this.infoJuridicoFrom.controls['OtroPor'].setErrors(null);
    this.infoJuridicoFrom.controls['OtroPor'].clearValidators();
    this.infoJuridicoFrom.controls['OtroPor'].setValidators(null);
  }

  RemoverValidacionesTerceroProveedor() {
    this.infoJuridicoFrom.controls['Conocio'].setErrors(null);
    this.infoJuridicoFrom.controls['Conocio'].clearValidators();
    this.infoJuridicoFrom.controls['Conocio'].setValidators(null);

    this.infoJuridicoFrom.controls['FechaConstitucion'].setErrors(null);
    this.infoJuridicoFrom.controls['FechaConstitucion'].clearValidators();
    this.infoJuridicoFrom.controls['FechaConstitucion'].setValidators(null);

    this.infoJuridicoFrom.controls['Estrato'].setErrors(null);
    this.infoJuridicoFrom.controls['Estrato'].clearValidators();
    this.infoJuridicoFrom.controls['Estrato'].setValidators(null);

    this.infoJuridicoFrom.controls['Pais'].setErrors(null);
    this.infoJuridicoFrom.controls['Pais'].clearValidators();
    this.infoJuridicoFrom.controls['Pais'].setValidators(null);

    this.infoJuridicoFrom.controls['Departamento'].setErrors(null);
    this.infoJuridicoFrom.controls['Departamento'].clearValidators();
    this.infoJuridicoFrom.controls['Departamento'].setValidators(null);

    this.infoJuridicoFrom.controls['Ciudad'].setErrors(null);
    this.infoJuridicoFrom.controls['Ciudad'].clearValidators();
    this.infoJuridicoFrom.controls['Ciudad'].setValidators(null);

    this.infoJuridicoFrom.controls['TipoLocal'].setErrors(null);
    this.infoJuridicoFrom.controls['TipoLocal'].clearValidators();
    this.infoJuridicoFrom.controls['TipoLocal'].setValidators(null);

    this.infoJuridicoFrom.controls['ObjetoSocial'].setErrors(null);
    this.infoJuridicoFrom.controls['ObjetoSocial'].clearValidators();
    this.infoJuridicoFrom.controls['ObjetoSocial'].setValidators(null);

  }

  RemoverValidacionesTercero() {
    this.infoJuridicoFrom.controls['Conocio'].setErrors(null);
    this.infoJuridicoFrom.controls['Conocio'].clearValidators();
    this.infoJuridicoFrom.controls['Conocio'].setValidators(null);

    this.infoJuridicoFrom.controls['TipoLocal'].setErrors(null);
    this.infoJuridicoFrom.controls['TipoLocal'].clearValidators();
    this.infoJuridicoFrom.controls['TipoLocal'].setValidators(null);

    this.infoJuridicoFrom.controls['ObjetoSocial'].setErrors(null);
    this.infoJuridicoFrom.controls['ObjetoSocial'].clearValidators();
    this.infoJuridicoFrom.controls['ObjetoSocial'].setValidators(null);
  }

  AgregarValidacionesAsociado() {
    this.infoJuridicoFrom.controls['FechaConstitucion'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['FechaConstitucion'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['FechaConstitucion'].updateValueAndValidity();
   
    this.infoJuridicoFrom.controls['Estrato'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Estrato'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Estrato'].updateValueAndValidity();
    
    this.infoJuridicoFrom.controls['Pais'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Pais'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Pais'].updateValueAndValidity();
  
    this.infoJuridicoFrom.controls['Departamento'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Departamento'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Departamento'].updateValueAndValidity();

    this.infoJuridicoFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Ciudad'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Ciudad'].updateValueAndValidity();

    this.infoJuridicoFrom.controls['Conocio'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Conocio'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Conocio'].updateValueAndValidity();

    this.infoJuridicoFrom.controls['TipoLocal'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['TipoLocal'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['TipoLocal'].updateValueAndValidity();

    this.infoJuridicoFrom.controls['ObjetoSocial'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['ObjetoSocial'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['ObjetoSocial'].updateValueAndValidity();
    
  }
  AgregarValidacionesTercero() {
    this.infoJuridicoFrom.controls['FechaConstitucion'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['FechaConstitucion'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['FechaConstitucion'].updateValueAndValidity();
   
    this.infoJuridicoFrom.controls['Estrato'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Estrato'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Estrato'].updateValueAndValidity();
    
    this.infoJuridicoFrom.controls['Pais'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Pais'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Pais'].updateValueAndValidity();
  
    this.infoJuridicoFrom.controls['Departamento'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Departamento'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Departamento'].updateValueAndValidity();

    this.infoJuridicoFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.infoJuridicoFrom.controls['Ciudad'].setErrors({ 'incorrect': true });
    this.infoJuridicoFrom.controls['Ciudad'].updateValueAndValidity();
    
  }

  ocultarObligatoriosTerceroProvedor(){
    this.obliConocio = false;
    this.obliFecha = false;
    this.obliEstrato = false;
    this.obliPais = false;
    this.obliDepart = false;
    this.obliCiudad = false;
    this.obliLocal = false;
    this.obliObjeto = false;
  }

  AsignarObligatoriosTercero() {
    this.obliConocio = false;
    this.obliFecha = true;
    this.obliEstrato = true;
    this.obliPais = true;
    this.obliDepart = true;
    this.obliCiudad = true;
    this.obliLocal = false;
    this.obliObjeto = false;
  }

  MostrarObligatorios() {
    this.obliConocio = true;
    this.obliFecha = true;
    this.obliEstrato = true;
    this.obliPais = true;
    this.obliDepart = true;
    this.obliCiudad = true;
    this.obliLocal = true;
    this.obliObjeto = true;
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number,modulo : number) {
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero,modulo).subscribe(
      result => {
        // console.log(new Date, result);
      }
    );
  }
value : any ;
  SoloNumerosInput(campoName : string) {
    let self = this;
    $('#' + campoName +'').on('input', function () {
      self.value = self.value.replace(/[^0-9]/g, '');
    });
  }
  
  //#endregion
}
