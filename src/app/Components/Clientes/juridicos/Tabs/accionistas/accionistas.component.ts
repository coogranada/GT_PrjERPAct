import { Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccionistaModel } from '../../../../../Models/Clientes/Juridicos/AccionistaModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
@Component({
  selector: 'app-accionistas',
  templateUrl: './accionistas.component.html',
  styleUrls: ['./accionistas.component.css'],
  providers: [ClientesGetListService, GeneralesService],
  standalone : false
})
export class AccionistasComponent implements OnInit {
  //#region  carga variables comunicacion
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Input() infoTabAllAccionista: any;
  @Input() OperacionActual: any;
  //#endregion
  //#region carga variables
  public siguiente = false;
  public positionTab = 8;
  public dataTipoDocumento : any[] = [];
  public itemAccionistas: any[] = [];
  public mostrarNumero = false;
  public mostrarLetras = false;
  public EnableUpdateAccionistas = false;
  public clienteSeleccionado: any;
  public JuridicoEdit: any;
  public bloquearFormAcc : any = null;
  public validar = true;
  public ColorAnterior: any;
  //#endregion
  //#region From
  // public accionistasFrom: FormGroup;
  public accionistasFrom: any;
  //#endregion
  //#region  Carga variables de bloqueo
  @Input() bloquearForm: boolean | null = false;
  @Input() mostrarActualizar: boolean = false;
  @Input() mostrarAgregar: boolean = false;
  @Input() mostrarLimpiar: boolean = false;
  @Input() mostrarSiguiente: boolean = false;
  @Input() activarBtnOpciones: boolean = false;
  //#endregion
  //#region Variables funcionales
  public indexAccionistas = null;
  public obligatoriCliente = false;
  public tipoDocumentoCargado: any;
  public esOld = false;
  public esNew = false;
  //#endregion
  public accionistaModel = new AccionistaModel();
  public accionistaModelLst: AccionistaModel[] = [];
  constructor(private clientesGetListService: ClientesGetListService, private notif: NgxToastService,
    private juridicoService: JuridicosService, private generalesService: GeneralesService) { }

  ngOnInit() {
    this.IrArriba();
    this.RazonNombreCapitalice();
    this.itemAccionistas = [];
    this.GetTipoDocumentoAccionista();
    this.validarAccionistas();
  }
  

  //#region  Metodos de carga
  GetTipoDocumentoAccionista() {
    const dataDoc : any[] = [];
    this.clientesGetListService.GetTipoDocumento().subscribe((result : any) => {
        result.forEach((element : any) => {
          if (element.Clase !== 4 && element.Clase !== 5 && element.Clase !== 7 && element.Clase !== 8) {
            dataDoc.push(element);
          }
        });
        this.dataTipoDocumento = dataDoc;
      },
      (error : any) => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  //#endregion

  //#region Metodos funcionales

  validarTipoDocumento() {
    const tipoDoc = this.accionistasFrom.controls.TipoDocumento.value;
    if (+tipoDoc.Clase === 9) {
      this.accionistasFrom.get('NumeroDocumento').reset();
      this.accionistasFrom.controls['NumeroDocumento'].setErrors(null);
      this.accionistasFrom.controls['NumeroDocumento'].clearValidators();
      this.accionistasFrom.controls['NumeroDocumento'].setValidators(null);

      this.accionistasFrom.controls['NumeroDocumento'].setValidators([Validators.required,
      Validators.pattern('[A-Za-zñÑ0-9]{4,15}')]);
      this.accionistasFrom.controls['NumeroDocumento'].setErrors({ 'incorrect': true });
      this.mostrarLetras = true;
      this.mostrarNumero = false;
    } else {
      this.accionistasFrom.controls['NumeroDocumento'].setValidators([Validators.required,
      Validators.pattern('[0-9]{4,15}')]);
      this.mostrarLetras = false;
      this.mostrarNumero = true;
    }
  }

  validarParticipacion() {
    const valorParticipa = +this.accionistasFrom.get('Participacion').value;
    if (valorParticipa > 100) {
      this.notif.onWarning('Advertencia', 'El porcentaje de participación no puede superar el 100%.');
      this.accionistasFrom.get('Participacion').reset();
    } else if (valorParticipa === 0 || valorParticipa < 5) {
      this.notif.onWarning('Advertencia', 'El porcentaje de participación no puede ser menor que el 5%.');
      this.accionistasFrom.get('Participacion').reset();
    }
  }


  GetAccionista() {
    if (this.accionistasFrom.get('NumeroDocumento').value !== null
    && this.accionistasFrom.get('NumeroDocumento').value !== undefined
    && this.accionistasFrom.get('NumeroDocumento').value !== '') {

    if (this.itemAccionistas.length === 0) {
          const documentoConsulta = this.accionistasFrom.get('NumeroDocumento').value;
          this.clientesGetListService.GetAccionistas(documentoConsulta).subscribe(
            result => {
              if (result === null) {
                this.notif.onWarning('Advertencia', 'No se encontró el accionista.');
            
              } else {
                this.esOld = true;
                this.esNew = false;
                this.bloquearFormAcc = true;
                this.accionistasFrom.get('IdPersonaAccionista').setValue(result.IdPersonas);
                this.accionistasFrom.get('NumeroDocumento').setValue(result.NumeroDocumento);
                this.dataTipoDocumento.forEach(elementTipo => {
                  if (elementTipo.Clase === result.IdTipoDocumento) {
                    this.tipoDocumentoCargado = elementTipo;
                    this.accionistasFrom.get('TipoDocumento').setValue(elementTipo);
                  } 
                });
                if (result.PrimerNombre == null || result.PrimerNombre == undefined) {
                  result.PrimerNombre = '';
                }
                if (result.SegundoNombre == null || result.SegundoNombre == undefined) {
                  result.SegundoNombre = '';
                }
                if (result.PrimerApellido == null || result.PrimerApellido == undefined) {
                  result.PrimerApellido = '';
                }
                if (result.SegundoApellido == null || result.SegundoApellido == undefined) {
                  result.SegundoApellido = '';
                }
                this.accionistasFrom.get('RazonNombre').setValue(result.PrimerNombre + ' ' + result.SegundoNombre + ' '
                  + result.PrimerApellido + ' ' + result.SegundoApellido);
              } 
            },
            error => {
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
    } else {
      this.validar = false;
      const documentoConsulta = this.accionistasFrom.get('NumeroDocumento').value;
      this.itemAccionistas.forEach(elementAcc => {
        if (elementAcc.NumeroDocumento === documentoConsulta) {
          this.validar = true;
        }
      });
      if (this.validar) {
          this.notif.onWarning('Advertencia', 'El accionista ya fue ingresado.');
          
          } else {
            // this.loading = true;
            const documentoConsulta = this.accionistasFrom.get('NumeroDocumento').value;
            this.clientesGetListService.GetAccionistas(documentoConsulta).subscribe(
              result => {
                // this.loading = false;
                if (result === null) {
                  this.notif.onWarning('Advertencia', 'No se encontró el accionista.');
                } else  {
                  this.esOld = true;
                  this.esNew = false;
                  this.bloquearFormAcc = true;
                  this.accionistasFrom.get('IdPersonaAccionista').setValue(result.IdPersonas);
                  this.accionistasFrom.get('NumeroDocumento').setValue(result.NumeroDocumento);
                  this.dataTipoDocumento.forEach(elementTipo => {
                    if (elementTipo.Clase === result.IdTipoDocumento) {
                      this.tipoDocumentoCargado = elementTipo;
                      this.accionistasFrom.get('TipoDocumento').setValue(elementTipo);
                    } 
                  });
                  if (result.PrimerNombre == null || result.PrimerNombre == undefined) {
                    result.PrimerNombre = '';
                  }
                  if (result.SegundoNombre == null || result.SegundoNombre == undefined) {
                    result.SegundoNombre = '';
                  }
                  if (result.PrimerApellido == null || result.PrimerApellido == undefined) {
                    result.PrimerApellido = '';
                  }
                  if (result.SegundoApellido == null || result.SegundoApellido == undefined) {
                    result.SegundoApellido = '';
                  }
                  this.accionistasFrom.get('RazonNombre').setValue(result.PrimerNombre + ' ' + result.SegundoNombre + ' '
                    + result.PrimerApellido + ' ' + result.SegundoApellido);
                }
              },
              error => {
                // this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
    }
      // }  else {
      //   this.notif.onWarning('Advertencia', 'Los autorizados deben ser diferentes al titular de la cuenta.',
      //     ConfiguracionNotificacion.configRightTop);
      //   this.clearTitulares();
      // }
    }
  }

 

  limpiarInputs() {
    const tipoDoc = this.accionistasFrom.get('TipoDocumento').value;
    if (tipoDoc !== null && tipoDoc !== undefined) {
      if (+tipoDoc.Clase !== 9) {
        this.accionistasFrom.get('TipoDocumento').reset();
      }
    }
    this.accionistasFrom.get('RazonNombre').reset();
  }

  AgregarAccionistas() {
    let ArrayPrueba : any[] = [];
    let totalParticipacion = 0;
    if (this.esOld === true && this.esNew === false) {
      if (this.tipoDocumentoCargado !== undefined && this.tipoDocumentoCargado !== null && this.tipoDocumentoCargado !== 0) {
        if (this.accionistasFrom.valid) {

          if (this.indexAccionistas === null) {
            this.itemAccionistas.forEach(elementAccion => {
              totalParticipacion = totalParticipacion + +elementAccion.Participacion;
            });

            totalParticipacion = totalParticipacion + +this.accionistasFrom.value.Participacion;
            if (this.itemAccionistas.length !== 6) {
             
              if (totalParticipacion <= 100) {
                if (this.accionistasFrom.value.RazonNombre !== null && this.accionistasFrom.value.RazonNombre) {
                  this.accionistasFrom.value.RazonNombre = this.accionistasFrom.value.RazonNombre.substr(0, 1).toUpperCase() +
                  this.accionistasFrom.value.RazonNombre.substr(1).toLowerCase();
                }
                if (this.accionistasFrom.value.NumeroDocumento !== null) {
                this.itemAccionistas.push(this.accionistasFrom.value);
                this.accionistasFrom.reset();
                this.indexAccionistas = null;
                this.EnableUpdateAccionistas = true;
                this.bloquearFormAcc = null;
                }
              } else {
                this.accionistasFrom.get('Participacion').reset();
                this.notif.onWarning('Advertencia', 'La suma del porcentaje de participación no puede superar el 100%.');
              }
          
            } else {
              this.notif.onWarning('Advertencia', 'Solo puede agregar 6 Accionistas.');
            }
          } else {
            ArrayPrueba = Object.assign(ArrayPrueba, this.itemAccionistas);

            ArrayPrueba.splice(this.indexAccionistas, 1);

            ArrayPrueba.forEach(elementAccion => {
              totalParticipacion = totalParticipacion + +elementAccion.Participacion;
            });

            totalParticipacion = totalParticipacion + +this.accionistasFrom.value.Participacion;

            if (totalParticipacion <= 100) {
              if (this.accionistasFrom.value.RazonNombre !== null && this.accionistasFrom.value.RazonNombre) {
                this.accionistasFrom.value.RazonNombre = this.accionistasFrom.value.RazonNombre.substr(0, 1).toUpperCase() +
                this.accionistasFrom.value.RazonNombre.substr(1).toLowerCase();
              }
              if (this.accionistasFrom.value.NumeroDocumento !== null) {
              this.itemAccionistas.push(this.accionistasFrom.value);
              this.accionistasFrom.reset();
              this.indexAccionistas = null;
              this.EnableUpdateAccionistas = true;
              this.bloquearFormAcc = null;
              }
            } else {
              this.accionistasFrom.get('Participacion').reset();
              this.notif.onWarning('Advertencia', 'La suma del porcentaje de participación no puede superar el 100%.');
            }
          }
        } else {
          this.ValidarErrorForm(this.accionistasFrom);
        }
      } else {
        this.notif.onWarning('Advertencia', 'El asociado consultado debe ser revisado en naturales , no tiene tipo de documento.');
      }
    } else if (this.esOld === false && this.esNew === true) {
      if (this.accionistasFrom.valid) {

        if (this.indexAccionistas === null) {
          this.itemAccionistas.forEach(elementAccion => {
            totalParticipacion = totalParticipacion + +elementAccion.Participacion;
          });

          totalParticipacion = totalParticipacion + +this.accionistasFrom.value.Participacion;
          if (this.itemAccionistas.length !== 6) {
            if (totalParticipacion <= 100) {
              if (this.accionistasFrom.value.RazonNombre !== null && this.accionistasFrom.value.RazonNombre) {
                this.accionistasFrom.value.RazonNombre = this.accionistasFrom.value.RazonNombre.substr(0, 1).toUpperCase() +
                  this.accionistasFrom.value.RazonNombre.substr(1).toLowerCase();
              }
              if (this.accionistasFrom.value.NumeroDocumento !== null) {
                this.itemAccionistas.push(this.accionistasFrom.value);
                this.accionistasFrom.reset();
                this.indexAccionistas = null;
                this.EnableUpdateAccionistas = true;
                this.bloquearFormAcc = null;
                }
            } else {
              this.accionistasFrom.get('Participacion').reset();
              this.notif.onWarning('Advertencia', 'La suma del porcentaje de participación no puede superar el 100%.');
            }
          } else {
            this.notif.onWarning('Advertencia', 'Solo puede agregar 6 Accionistas.');
          }
        } else {
          ArrayPrueba = Object.assign(ArrayPrueba, this.itemAccionistas);

          ArrayPrueba.splice(this.indexAccionistas, 1);

          ArrayPrueba.forEach(elementAccion => {
            totalParticipacion = totalParticipacion + +elementAccion.Participacion;
          });

          totalParticipacion = totalParticipacion + +this.accionistasFrom.value.Participacion;
          if (totalParticipacion <= 100) {
            this.itemAccionistas.splice(this.indexAccionistas, 1);
            if (this.accionistasFrom.value.RazonNombre !== null && this.accionistasFrom.value.RazonNombre !== undefined) {
              this.accionistasFrom.value.RazonNombre = this.accionistasFrom.value.RazonNombre.substr(0, 1).toUpperCase() +
                this.accionistasFrom.value.RazonNombre.substr(1).toLowerCase();
            }
            if (this.accionistasFrom.value.NumeroDocumento !== null) {
              this.itemAccionistas.push(this.accionistasFrom.value);
              this.accionistasFrom.reset();
              this.indexAccionistas = null;
              this.EnableUpdateAccionistas = true;
              this.bloquearFormAcc = null;
              }
          } else {
            this.accionistasFrom.get('Participacion').reset();
            this.notif.onWarning('Advertencia', 'La suma del porcentaje de participación no puede superar el 100%.');
          }
        }

      } else {
        this.ValidarErrorForm(this.accionistasFrom);
      }
    } else if (this.esOld === false && this.esNew === false) {
      if (this.accionistasFrom.valid) {

        if (this.indexAccionistas === null) {
          this.itemAccionistas.forEach(elementAccion => {
            totalParticipacion = totalParticipacion + +elementAccion.Participacion;
          });

          totalParticipacion = totalParticipacion + +this.accionistasFrom.value.Participacion;
          if (this.itemAccionistas.length !== 6) {
            if (totalParticipacion <= 100) {
              if (this.accionistasFrom.value.RazonNombre !== null && this.accionistasFrom.value.RazonNombre) {
                this.accionistasFrom.value.RazonNombre = this.accionistasFrom.value.RazonNombre.substr(0, 1).toUpperCase() +
                  this.accionistasFrom.value.RazonNombre.substr(1).toLowerCase();
              }
              if (this.accionistasFrom.value.NumeroDocumento !== null) {
                this.itemAccionistas.push(this.accionistasFrom.value);
                this.accionistasFrom.reset();
                this.indexAccionistas = null;
                this.EnableUpdateAccionistas = true;
                this.bloquearFormAcc = null;
                }
            } else {
              this.accionistasFrom.get('Participacion').reset();
              this.notif.onWarning('Advertencia', 'La suma del porcentaje de participación no puede superar el 100%.');
            }
          } else {
            this.notif.onWarning('Advertencia', 'Solo puede agregar 6 Accionistas.');
          }
        } else {
          ArrayPrueba = Object.assign(ArrayPrueba, this.itemAccionistas);

          ArrayPrueba.splice(this.indexAccionistas, 1);

          ArrayPrueba.forEach(elementAccion => {
            totalParticipacion = totalParticipacion + +elementAccion.Participacion;
          });

          totalParticipacion = totalParticipacion + +this.accionistasFrom.value.Participacion;
          if (totalParticipacion <= 100) {
            this.itemAccionistas.splice(this.indexAccionistas, 1);
            if (this.accionistasFrom.value.RazonNombre !== null && this.accionistasFrom.value.RazonNombre !== undefined) {
              this.accionistasFrom.value.RazonNombre = this.accionistasFrom.value.RazonNombre.substr(0, 1).toUpperCase() +
                this.accionistasFrom.value.RazonNombre.substr(1).toLowerCase();
            }
            if (this.accionistasFrom.value.NumeroDocumento !== null) {
              this.itemAccionistas.push(this.accionistasFrom.value);
              this.accionistasFrom.reset();
              this.indexAccionistas = null;
              this.EnableUpdateAccionistas = true;
              this.bloquearFormAcc = null;
              }
          } else {
            this.accionistasFrom.get('Participacion').reset();
            this.notif.onWarning('Advertencia', 'La suma del porcentaje de participación no puede superar el 100%.');
          }
        }

      } else {
        this.ValidarErrorForm(this.accionistasFrom);
      }
    }
  }

  MapperAccionista(index : any, data : any) {
    if (data.IdPersonaAccionista !== 0) {
      this.bloquearFormAcc = true;
    } else {
      this.bloquearFormAcc = null;
    }
    this.indexAccionistas = index;
    this.accionistasFrom.get('IdJuridicoAccionista').setValue(data.IdJuridicoAccionista);
    this.accionistasFrom.get('IdJuridico').setValue(data.IdJuridico);
    this.accionistasFrom.get('IdPersonaAccionista').setValue(data.IdPersonaAccionista);
    this.accionistasFrom.get('TipoDocumento').setValue(data.TipoDocumento);
    this.accionistasFrom.get('NumeroDocumento').setValue(data.NumeroDocumento);
    this.accionistasFrom.get('RazonNombre').setValue(data.RazonNombre);
    this.accionistasFrom.get('EsPeps').setValue(data.EsPeps);
    this.accionistasFrom.get('Participacion').setValue(data.Participacion);
    this.esOld = false;
    this.esNew = false;
    this.IrArriba();
  }

  LimpiarFormulario() {
    this.accionistasFrom.reset();
  }

  EliminarAccionista(index : number) {
    this.itemAccionistas.splice(index, 1);
    this.EnableUpdateAccionistas = true;
  }

  GuardarAccionistas() {
    this.infoTabAllAccionista.AccionistaDto = {};
    if (this.infoTabAllAccionista.BasicosDto.IdRelacion === '15' && this.itemAccionistas.length === 0) {
      this.siguiente = true;
      this.emitEvent.emit(this.positionTab);
      this.infoTabAllAccionista.AccionistaDto = {};
      console.log(this.infoTabAllAccionista);
      this.IrArriba();
    } else {
      if (this.itemAccionistas.length > 0) {
        this.siguiente = true;
        this.emitEvent.emit(this.positionTab);
        this.SetModelAccionistas();
        this.infoTabAllAccionista.AccionistaDto = this.accionistaModelLst;
        console.log(this.infoTabAllAccionista);
        this.IrArriba();
      } else {
        this.notif.onWarning('Advertencia', 'Debe registrar al menos un accionista.');
      }
    }
  }

  private SetModelAccionistas() {
    this.accionistaModelLst = [];
    this.itemAccionistas.forEach(elementAccio => {
      this.accionistaModel = new AccionistaModel();
      this.accionistaModel.IdTercero = 0;
      this.accionistaModel.IdTipoIdentificacion = elementAccio.TipoDocumento.Clase;
      this.accionistaModel.NumeroDocumento = elementAccio.NumeroDocumento;
      this.accionistaModel.Participacion = +elementAccio.Participacion;
      this.accionistaModel.RazonSocial = elementAccio.RazonNombre;
      this.accionistaModel.VinculoPeps = (+elementAccio.EsPeps === 1) ? true : false;
      this.accionistaModel.IdPersonaAccionista = elementAccio.IdPersonaAccionista;
      this.accionistaModelLst.push(this.accionistaModel);
    });
  }

  ActualizarAccionistas() {

    if (this.itemAccionistas.length <= 0) {
      this.notif.onWarning('Advertencia', 'No hay registros relacionados para actualizar.');
      this.EnableUpdateAccionistas = false;
    } else {

      this.itemAccionistas.forEach(elementAccio => {
        this.accionistaModel = new AccionistaModel();
        if (elementAccio.IdJuridico !== null && elementAccio.IdJuridico !== undefined) {
          this.accionistaModel.IdTercero = elementAccio.IdJuridico;
          this.JuridicoEdit = elementAccio.IdJuridico;
        } else {
          this.accionistaModel.IdTercero = this.JuridicoEdit;
        }
        this.accionistaModel.IdPersonaAccionista = elementAccio.IdPersonaAccionista;
        this.accionistaModel.IdJuridicoAccionista = elementAccio.IdJuridicoAccionista;
        this.accionistaModel.IdTipoIdentificacion = elementAccio.TipoDocumento.Clase;
        this.accionistaModel.NumeroDocumento = elementAccio.NumeroDocumento;
        this.accionistaModel.Participacion = +elementAccio.Participacion;
        this.accionistaModel.RazonSocial = elementAccio.RazonNombre;
        this.accionistaModel.VinculoPeps = (+elementAccio.EsPeps === 1) ? true : false;

        this.accionistaModelLst.push(this.accionistaModel);

      });
      this.GuardarLog(this.accionistaModelLst, this.OperacionActual, 0, this.JuridicoEdit, 12);
      this.juridicoService.EditAccionistas(this.accionistaModelLst).subscribe(
        result => {
          if (result) {
            this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
            this.accionistaModelLst = [];
            this.EnableUpdateAccionistas = false;
            this.IrArriba();
          }
        },
        error => {
          console.error('Error al realizar la actualizacion - juridicos: ' + error);
          this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
        });

    }
  }
  //#endregion

  //#region Metodos Inicializacion y generales
  validarAccionistas() {
    const IdJuridicoAccionista = new FormControl('', []);
    const IdJuridico = new FormControl('', []);
    const IdPersonaAccionista = new FormControl('', []);
    const TipoDocumento = new FormControl('', [Validators.required]);
    const NumeroDocumento = new FormControl('', [Validators.required, Validators.pattern('[0-9]{4,15}')]);
    const RazonNombre = new FormControl('', [Validators.required, Validators.pattern('[A-Za-zñÑ. 0-9]+')]);
    const EsPeps = new FormControl('', [Validators.required]);
    const Participacion = new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]);

    this.accionistasFrom = new FormGroup({
      IdJuridicoAccionista: IdJuridicoAccionista,
      IdJuridico: IdJuridico,
      TipoDocumento: TipoDocumento,
      NumeroDocumento: NumeroDocumento,
      RazonNombre: RazonNombre,
      EsPeps: EsPeps,
      Participacion: Participacion,
      IdPersonaAccionista: IdPersonaAccionista
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

  RazonNombreCapitalice() {
    let self = this;
    $('#razonNombre').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  GuardarLog(formulario : any , operacion : number, cuenta : number, tercero : number, modulo : number) {
    this.generalesService.Guardarlog(formulario, operacion, cuenta, tercero, modulo).subscribe(
      result => {
        // console.log(new Date, result);
      }
    );
  }

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filAcci_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filAcci_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil
    }

  }
  //#endregion

}
