import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, ViewChild } from '@angular/core';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecursosGeneralesService } from '../../../../../Services/Utilidades/recursosGenerales.service';
import { RepresentanteModel } from '../../../../../Models/Clientes/Juridicos/RepresentanteModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import moment from 'moment';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import swal from 'sweetalert2';
import { NgxToastService } from 'ngx-toast-notifier';
import { EnvironmentService } from '../../../../../Services/Enviroment/enviroment.service';
declare var $: any;
@Component({
  selector: 'app-representante-legal',
  templateUrl: './representante-legal.component.html',
  styleUrls: ['./representante-legal.component.css'],
  providers: [ClientesGetListService, GeneralesService],
  standalone : false
})
export class RepresentanteLegalComponent implements OnInit {
  //#region  carga variables comunicacion Input()
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Input() dataPaisExpedicion: any;
  @Input() dataPaisNacimiento: any;
  @Input() infoTabAllRepresentante: any;
  @Input() bloquearForm: boolean | null = false;
  @Input() mostrarActualizar: boolean = false;
  @Input() mostrarLimpiar: boolean = false;
  @Input() mostrarSiguiente: boolean = false;
  @Input() OperacionActual: any;
  //#endregion
  //#region carga variables
  public obligatoriCliente : any;
  public siguiente = false;
  public loading = false;
  public positionTab = 7;
  public dataCargos : any;
  public dataProfesion : any;
  public dataTipoDocumento : any;
  public dataCiudades : any;
  public dataCiudadesNaci : any;
  public modelProfesion: any;
  public modelCargo: any;

  public ciudExp: string = "";
  public ciudNac: string = "";

  public CiudadMapperExp: any;
  public CiudadMapperNac: any;

  public MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

  public dataBarriosAll: any;
  public dataCiudadesAll: any;
  public dataDepartamentosAll: any;

  public datatableRepresenta: any[] = [];
  public dataTipoContacto: any;
  public clienteSeleccionado: any;
  public juridicoEdit: any;
  public tipoDocumentoCargado: any;
  public ColorAnterior: any;
  //#endregion
  //#region variables de bloqueo
  public bloqDeparta = true;
  public bloqCiudad = true;
  public bloqDepartaNaci = true;
  public bloqCiudadNaci = true;
  public mostrarNumero = false;
  public mostrarLetras = false;
  public bloquearFormRep = true;
  protected EditarFrom = false;
  //#endregion
  //#region From
  // public representanteFrom: FormGroup;
  public representanteFrom: any;
  //#endregion
  public representanteModel = new RepresentanteModel();
  constructor(private clientesGetListService: ClientesGetListService, private notif: NgxToastService,
    private juridicoService: JuridicosService, private generalesService: GeneralesService,private urlEnvironmentService : EnvironmentService) { }

  ngOnInit() {
    this.IrArriba();
    this.GetTipoContacto();
    this.bloquearFormRep = true;
    this.PrimerNombreCapitalice();
    this.SegundoNombreCapitalice();
    this.PrimerApellidoCapitalice();
    this.SegundoApellidoCapitalice();
    this.validarRepresentante();
    this.GetTipoDocumentoConyugue();
    this.GetProfesion();
    this.GetCargos();
    this.onChanges();
  }

  onChanges(): void {
    this.ValidarCamposCambiantes();
  };

  private ValidarCamposCambiantes() {
    this.representanteFrom.get('NumeroDocumento').valueChanges.subscribe((val : any) => {
      if (this.OperacionActual === 1) {
        if (val !== null) {
          this.EditarFrom = true;
        }
        else {
          this.EditarFrom = false;
        }
      }
    });
  }
  //#region  Metodos de carga
  GetProfesion() {
    this.clientesGetListService.GetProfesion().subscribe(
      resultProfe => {
        this.dataProfesion = resultProfe;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetCargos() {
    this.clientesGetListService.GetCargos().subscribe(
      resultCargos => {
        this.dataCargos = resultCargos;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetTipoDocumentoConyugue() {
    const dataDoc : any[] = [];
    this.clientesGetListService.GetTipoDocumento().subscribe(
      result => {
        result.forEach((element : any) => {
          // if (element.Clase !== 3 && element.Clase !== 8 && element.Clase !== 4 && element.Clase !== 7) {
            dataDoc.push(element);
          // }
        });
        this.dataTipoDocumento = dataDoc;
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
  GuardarRepresentante() {
    if (this.infoTabAllRepresentante.BasicosDto.IdRelacion === '15' && this.infoTabAllRepresentante.BasicosDto.Proveedor === '1' && this.representanteFrom.value.IdTercero === null
      || this.representanteFrom.value.IdTercero === undefined || this.representanteFrom.value.IdTercero === 0) {
      this.siguiente = true;
      this.emitEvent.emit(this.positionTab);
      this.infoTabAllRepresentante.Representa = 0;
      console.log(this.infoTabAllRepresentante);
      this.IrArriba();
    } else {
      if (this.representanteFrom.valid) {
        if (this.tipoDocumentoCargado === undefined || this.tipoDocumentoCargado === null || this.tipoDocumentoCargado === 0) {
          this.notif.onWarning('Advertencia', 'El asociado consultado debe ser revisado en naturales , no tiene tipo de documento.');
        } else {
          this.siguiente = true;
          this.emitEvent.emit(this.positionTab);
          this.infoTabAllRepresentante.Representa = this.representanteFrom.get('IdTercero').value;
          console.log(this.infoTabAllRepresentante);
          this.IrArriba();
        }
      } else {
        this.ValidarErrorForm(this.representanteFrom);
      }
    }
  }

  limpiarFormulario() {
    this.representanteFrom.reset();
  }

  limpiarFormularioKey() {
    // this.representanteFrom.get('NumeroDocumento').reset();
    this.representanteFrom.get('TipoDocumento').reset();
    this.representanteFrom.get('PrimerNombre').reset();
    this.representanteFrom.get('SegundoNombre').reset();
    this.representanteFrom.get('PrimerApellido').reset();
    this.representanteFrom.get('SegundoApellido').reset();
    this.representanteFrom.get('Profesion').reset();
    this.representanteFrom.get('Cargo').reset();
    this.representanteFrom.get('CiudadNaci').reset();
    this.representanteFrom.get('FechaNacimiento').reset();
    this.representanteFrom.get('CiudadExpe').reset();
    this.representanteFrom.get('FechaExpedicion').reset();
    this.representanteFrom.get('Representante1Si').reset();
    this.representanteFrom.get('Representante1No').reset();
    this.representanteFrom.get('Representante2Si').reset();
    this.representanteFrom.get('Representante2No').reset();
    this.datatableRepresenta = [];
  }

  ActualizarRepresentante() {
    if (this.EditarFrom) {
      if (this.tipoDocumentoCargado !== undefined && this.tipoDocumentoCargado !== null && this.tipoDocumentoCargado !== 0) {
        this.representanteModel.IdTercero = this.juridicoEdit;
        this.representanteModel.IdRepresenta = this.representanteFrom.get('IdTercero').value;
        this.representanteModel.ManejaRecursos = false;
        this.representanteModel.PersonaPeps = false;
        this.GuardarLog(this.representanteModel, this.OperacionActual, 0, this.representanteModel.IdTercero,12);
        this.juridicoService.EditRepresentanteJuridico(this.representanteModel).subscribe(
          result => {
            if (result) {
              this.notif.onSuccess('Exitoso', 'El registro se actualizo correctamente.');
              this.EditarFrom = false;
              this.IrArriba();
            }
          },
          error => {
            console.error('Error al realizar la actualizacion - juridicos: ' + error);
            this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
          });
      } else {
        this.notif.onWarning('Advertencia', 'El asociado consultado debe ser revisado en naturales , no tiene tipo de documento.');
      }
    } else {
      if (!this.EditarFrom) {
        this.notif.onWarning('Advertencia', 'Debe realizar algún cambio en el formulario.');
      }
      this.ValidarErrorForm(this.representanteFrom);
    }
  }

  ValidacionFechasExpdi(expedi : any, ingresado : any) {
    const diaExpedi = new Date(expedi);
    const diaExpediF = diaExpedi.getDate();
    const mesExpedi = new Date(expedi);
    const mesExpediF = mesExpedi.getMonth() + 1;
    const anoExpedi = new Date(expedi).getFullYear();
    const diaIngresado = new Date(ingresado);
    const diaIngresadoF = diaIngresado.getDate();
    const mesIngresado = new Date(ingresado);
    const mesIngresadoF = mesIngresado.getMonth() + 1;
    const anoIngresado = new Date(ingresado).getFullYear();

    if ((anoExpedi - anoIngresado) === 18) { // valida que los años sean iguales a 18
      if (mesExpediF === mesIngresadoF) { // valida que el mes actual sea igual al mes ingresado
        if (diaIngresadoF === diaExpediF) { // valido que el dia sea igual que el actual
          return true; // mayor
        } else if (diaIngresadoF > diaExpediF) { // valida que el dia ingresado sea mayor al actual
          return false; // menor
        } else {
          return true; // mayor
        }

      } else if (mesIngresadoF > mesExpediF) { // valida que el mes ingresado sea menor que el actual
        return false; // menor
      } else {
        return true; // mayor
      }

    } else if ((anoExpedi - anoIngresado) > 18) { // valida si el año ingresado es mayor que 18 muestre el ensaje y si no deje seguir
      return true; // mayor
    } else {
      return false; // menor
    }
  }

  GetRepresentante() {
    this.datatableRepresenta = [];
    const documentoConsulta = this.representanteFrom.get('NumeroDocumento').value;
    this.representanteFrom.reset();
    if (documentoConsulta !== '' && documentoConsulta !== undefined && documentoConsulta !== null) {
      this.clientesGetListService.GetRepresentate(documentoConsulta).subscribe(
        result => {
          if (result !== null) {
            if (result.IdCiudadExp !== null
            && result.IdCiudadNac !== null) {
                this.representanteFrom.get('IdRepresenta').setValue(result.IdTercero);
                this.representanteFrom.get('IdTercero').setValue(result.IdTercero);
                this.CargarTipoDocumento(result);
                this.CargarInfoProfesion(result);
                this.CargarInfoCargos(result);
                this.MapearInformacion(result);
                this.CargarInfoCiudad(result);
                this.CargarCiudades(result);
                this.CargarEntrevista(result);
            } else {
              this.IrArriba();
              swal.fire({ // Se pregunta si necesita asesor externo
                title: 'Advertencia',
                text: '',
                html: 'Datos incompletos. ¿Desea actualizar?',
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
                  //Desarrollo
                  let url =  this.urlEnvironmentService.UrlFront + "/Clientes/Naturales";
                 window.open(url, '_blank');
                 this.representanteFrom.get('NumeroDocumento').reset();
                } else {
                }
                this.IrArriba();
              });
            }


            
          } else {
            this.notif.onWarning('Advertencia', 'No se encontraron datos para el documento ingresado.');
            this.representanteFrom.get('NumeroDocumento').reset();
          }
        }, error => {
          // this.notif.onWarning('Advertencia', 'No se encontraron datos para el documento ingresado',
          //   ConfiguracionNotificacion.configRightTopNoClose);
          this.representanteFrom.reset();
        }
      );
    }
  }

  private CargarCiudades(result: any) {
    let CiudadConcatenadaExp = '';
    let CiudadConcatenadaNac= '';
    if (result.IdCiudadExp !== undefined && result.IdCiudadExp !== null && result.IdCiudadExp !== 0) {
        this.dataCiudadesAll.forEach((elementNue : any) => {
          if (elementNue.IdCiudad === result.IdCiudadExp) {
            CiudadConcatenadaExp = elementNue.Descripcion;
              // this.representanteFrom.get('CiudadExpe').setValue(elementNue.Descripcion);
              this.CiudadMapperExp = elementNue.IdCiudad;
              this.dataDepartamentosAll.forEach((elementDep : any) => {
                if (elementDep.IdDepartamento === elementNue.IdDepartamento) {
                  CiudadConcatenadaExp = CiudadConcatenadaExp + ' - ' + elementDep.Descripcion;
                  this.representanteFrom.get('CiudadExpe').setValue(CiudadConcatenadaExp);
                }
              });
            } else {
              // resultCiu.forEach(elemenFor => {
              //   this.representanteFrom.get('CiudadExpe').setValue(elemenFor.Nombre);
              //   this.CiudadMapperExp = elemenFor.IdCiudad;
              // });
            }
        });
    }
    else {
      this.representanteFrom.get('CiudadExpe').setValue('');
    }
    if (result.IdCiudadNac !== undefined && result.IdCiudadNac !== null && result.IdCiudadNac !== 0) {
      // this.clientesGetListService.GetCiudad('B').subscribe(resultCiu => {
      //   resultCiu.forEach(elemenFor => {
          // if (elemenFor.IdCiudad === result.IdCiudadNac) {
            // this.representanteFrom.get('CiudadNaci').setValue(elemenFor.Nombre);
            // this.CiudadMapperNac = elemenFor.IdCiudad;
          // } else {
            // this.dataCiudadesAll.forEach(elementNue => {
            //   if (elementNue.IdCiudad === result.IdCiudadNac) {
            //     this.representanteFrom.get('CiudadNaci').setValue(elementNue.Descripcion);
            //     this.CiudadMapperExp = elementNue.IdCiudad;
            //   }
            // });
            this.dataCiudadesAll.forEach((elementNue : any) => {
              if (elementNue.IdCiudad === result.IdCiudadNac) {
                CiudadConcatenadaNac = elementNue.Descripcion;
                // this.representanteFrom.get('CiudadExpe').setValue(elementNue.Descripcion);
                this.CiudadMapperExp = elementNue.IdCiudad;
                this.dataDepartamentosAll.forEach((elementDep : any) => {
                  if (elementDep.IdDepartamento === elementNue.IdDepartamento) {
                    CiudadConcatenadaNac = CiudadConcatenadaNac + ' - ' + elementDep.Descripcion;
                    this.representanteFrom.get('CiudadNaci').setValue(CiudadConcatenadaNac);
                  }
                });
              } else {
                // resultCiu.forEach(elemenFor => {
                //   this.representanteFrom.get('CiudadExpe').setValue(elemenFor.Nombre);
                //   this.CiudadMapperExp = elemenFor.IdCiudad;
                // });
              }
            });
          // }
        // });
      // });
    }
    else {
      this.representanteFrom.get('CiudadNaci').setValue('');
    }
  }

  private MapearInformacion(result: any) {
    this.representanteFrom.get('NumeroDocumento').setValue(result.NumeroDocumento);
    this.representanteFrom.get('PrimerNombre').setValue(result.PrimerNombre);
    this.representanteFrom.get('SegundoNombre').setValue(result.SegundoNombre);
    this.representanteFrom.get('PrimerApellido').setValue(result.PrimerApellido);
    this.representanteFrom.get('SegundoApellido').setValue(result.SegundoApellido);
    const dateStringExp = result.FechaExpedicion;
    const newDateExp = new Date(dateStringExp);
    newDateExp.setMinutes(newDateExp.getMinutes() + newDateExp.getTimezoneOffset());
    const fechaStringNewExp = moment(newDateExp).format('YYYY-MM-DD');
    this.representanteFrom.get('FechaExpedicion').setValue(fechaStringNewExp);

    const dateStringNac = result.FechaNacimiento;
    const newDateNac = new Date(dateStringNac);
    newDateNac.setMinutes(newDateNac.getMinutes() + newDateNac.getTimezoneOffset());
    const fechaStringNewNac = moment(newDateNac).format('YYYY-MM-DD');
    this.representanteFrom.get('FechaNacimiento').setValue(fechaStringNewNac);
  }

  private CargarInfoCiudad(result: any) {
    let CiudadContatctos = '';
    this.dataTipoContacto.forEach((elementDataContacto : any) => {
      
        result.ListContacto.forEach((elementCont : any) => {
          if (elementCont.ContactoPrincipal) {
            if (elementDataContacto.Id === elementCont.IdTipoContacto) {
              if (elementCont.IdCiudad !== undefined && elementCont.IdCiudad !== null && elementCont.IdCiudad !== 0) {
                this.dataBarriosAll.forEach((elementBarrio : any) => {
                  if (elementBarrio.IdBarrio === elementCont.IdBarrio) {
                    CiudadContatctos = elementBarrio.Descripcion;
                  }
                });
                this.dataCiudadesAll.forEach((elementNue : any) => {
                  if (elementNue.IdCiudad === elementCont.IdCiudad) {
                    CiudadContatctos = CiudadContatctos + ' ' + elementNue.Descripcion;
                    this.dataDepartamentosAll.forEach((elementDep : any) => {
                      if (elementDep.IdDepartamento === elementNue.IdDepartamento) {
                        CiudadContatctos = CiudadContatctos + ' - ' + elementDep.Descripcion;
                        elementCont.IdCiudad = CiudadContatctos;
                        elementCont.IdTipoContacto = elementDataContacto.Nombre;
                        this.datatableRepresenta.push(elementCont);
                      }
                    })
                  }
                });
              }
              else {
                elementCont.IdTipoContacto = elementDataContacto.Nombre;
                this.datatableRepresenta.push(elementCont);
              }
            }
          }
          // else {
          //   this.clientesGetListService.GetCiudad('B').subscribe(resultCiu => {
          //     resultCiu.forEach(elemenFor => {
          //       if (elemenFor.IdCiudad === elementCont.IdCiudad) {
          //         elementCont.IdCiudad = elemenFor.Nombre;
          //         console.log(elementCont.IdCiudad);
          //         elementCont.IdTipoContacto = elementDataContacto.Nombre;
          //         this.datatableRepresenta.push(elementCont);
          //       } else {
          //       }
          //     });
          //   });
          // }
        });
      
    });
  }

  private CargarInfoCargos(result: any) {
    if (result.IdCargo !== 0) {
        this.dataCargos.forEach((elementCarg : any) => {
      if (elementCarg.Clase === result.IdCargo) {
        this.representanteFrom.get('Cargo').setValue(elementCarg.Descripcion);
        this.modelCargo = elementCarg;
      }
    });
    }
  
  }

  private CargarInfoProfesion(result: any) {
    this.dataProfesion.forEach((elementProfe : any) => {
      if (elementProfe.Clase === result.IdProfesion) {
        this.representanteFrom.get('Profesion').setValue(elementProfe.Descripcion);
        this.modelProfesion = elementProfe;
      }
    });
  }

  private CargarTipoDocumento(result: any) {
    this.dataTipoDocumento.forEach((elementTipoDoc : any) => {
      if (elementTipoDoc.Clase === result.IdTipoIdentificacion) {
        this.tipoDocumentoCargado = elementTipoDoc;
        this.representanteFrom.get('TipoDocumento').setValue(elementTipoDoc);
      }
    });
  }

  private CargarEntrevista(result: any) {
    if (result.Pregunta1 === 'true') {
      this.representanteFrom.get('Representante1Si').setValue(true);
      this.representanteFrom.get('Representante1No').setValue(false);
    } else {
      this.representanteFrom.get('Representante1Si').setValue(false);
      this.representanteFrom.get('Representante1No').setValue(true);
    }
    if (result.Pregunta2 === 'true') {
      this.representanteFrom.get('Representante2Si').setValue(true);
      this.representanteFrom.get('Representante2No').setValue(false);
    } else {
      this.representanteFrom.get('Representante2Si').setValue(false);
      this.representanteFrom.get('Representante2No').setValue(true);
    }
  }

  GetTipoContacto() {
    this.clientesGetListService.GetTipoContacto().subscribe(
      result => {
        this.dataTipoContacto = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      });
  }
  //#endregion

  //#region Metodos Inicializacion y generales
  validarRepresentante() {
    const IdJuridico = new FormControl('', []);
    const TipoDocumento = new FormControl('', []);
    const NumeroDocumento = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(4)]);
    const PrimerNombre = new FormControl('', []);
    const SegundoNombre = new FormControl('', []);
    const PrimerApellido = new FormControl('', []);
    const SegundoApellido = new FormControl('', []);
    const Profesion = new FormControl('', []);
    const Cargo = new FormControl('', []);
    const FechaExpedicion = new FormControl('', []);
    const FechaNacimiento = new FormControl('', []);
    const CiudadExpe = new FormControl('', []);
    const CiudadNaci = new FormControl('', []);

    const IdTercero = new FormControl('', []);
    const IdRepresenta = new FormControl('', []);

    const Representante1Si = new FormControl('', []);
    const Representante1No = new FormControl('', []);
    const Representante2Si = new FormControl('', []);
    const Representante2No = new FormControl('', []);


    this.representanteFrom = new FormGroup({
      IdJuridico: IdJuridico,
      TipoDocumento: TipoDocumento,
      NumeroDocumento: NumeroDocumento,
      PrimerNombre: PrimerNombre,
      SegundoNombre: SegundoNombre,
      PrimerApellido: PrimerApellido,
      SegundoApellido: SegundoApellido,
      Profesion: Profesion,
      Cargo: Cargo,
      FechaExpedicion: FechaExpedicion,
      FechaNacimiento: FechaNacimiento,
      CiudadNaci: CiudadNaci,
      CiudadExpe: CiudadExpe,
      IdTercero: IdTercero,
      IdRepresenta: IdRepresenta,
      Representante1Si: Representante1Si,
      Representante1No: Representante1No,
      Representante2Si: Representante2Si,
      Representante2No: Representante2No
    });


  }

  ValidarErrorForm(formulario: any) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      const control = formulario.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }

  GenericoSelect(input : string, form : any) {
    if (+form.get('' + input + '').value === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una opción valida.');
      form.get('' + input + '').reset();
    }
  }

  PrimerNombreCapitalice() {
    let self = this;
    $('#PrimerNom').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

   SegundoNombreCapitalice() {
    let self = this;
    $('#SegundoNom').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  PrimerApellidoCapitalice() {
     let self = this;
    $('#PrimerApe').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  SegundoApellidoCapitalice() {
    let self = this;
    $('#SegundoApe').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        // console.log(new Date, result);
      }
    );
  }
  IrPagina() {
    //Desarrollo
    let url =  this.urlEnvironmentService.UrlFront + "/Clientes/Naturales";
    window.open(url, '_blank');
    this.representanteFrom.get('NumeroDocumento').reset();
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filRepre_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filRepre_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
      // limpia sombreado anterior
    }
    
  }
  //#endregion
}
