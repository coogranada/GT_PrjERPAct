import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequiredData } from '../../../../../Models/Generales/RequiredData.model';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { RecursosGeneralesService } from '../../../../../Services/Utilidades/recursosGenerales.service';
import { ReferenciaModel } from '../../../../../Models/Clientes/Juridicos/ReferenciaModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
@Component({
  selector: 'app-referencias',
  templateUrl: './referencias.component.html',
  styleUrls: ['./referencias.component.css'],
  providers: [ClientesGetListService, RecursosGeneralesService, GeneralesService],
  standalone : false
})
export class ReferenciasComponent implements OnInit {
  //#region  carga variables comunicacion
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Input() infoTabAllReferencias: any;
  @Input() OperacionActual: any;
  @Output() PrecargarPais: EventEmitter<any> = new EventEmitter<any>();
  //#endregion
  //#region carga variables
  public dataDepartamentos : any;
  public dataCiudades : any;
  public siguiente = false;
  public positionTab = 9;
  public DataRequired = new RequiredData();
  public dataReferencias: any[] = [];
  public itemsReferencias: any[] = [];
  public indexReferencia : any = null;
  public PaisMapper: any;
  public DepartMapper: any;
  public CiudadMapper: any;
  public clienteSeleccionado: any;
  public JuridicoEdit: any;
  public ColorAnterior1: any;
  public ColorAnterior2: any;
  //#endregion
  //#region From
  public referenciasFrom!: FormGroup;
  //#endregion
  //#region  variables de bloqueo Input()
  public bloqDeparta : boolean | null = true;
  public bloqCiudad : boolean | null = true;
  public ocultarComerciales : boolean | null = true;
  public ocultarFinancieras : boolean | null = true;
  public EnableUpdateReferencias : boolean | null = false;
  @Input() bloquearForm: boolean | null = false;
  @Input() mostrarActualizar: boolean | null = false;
  @Input() mostrarAgregar: boolean | null = false;
  @Input() mostrarLimpiar: boolean | null = false;
  @Input() mostrarSiguiente: boolean | null = false;
  @Input() dataPais: any;
  @Input() activarBtnOpciones: boolean | null = false;

  public obligatoriCliente : any;
  //#endregion
  public referenciaModel = new ReferenciaModel();
  public referenciaModelLst: ReferenciaModel[] = [];
  constructor(private notif: NgxToastService,
    private recursosGeneralesService: RecursosGeneralesService, private juridicoService: JuridicosService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.IrArriba();
    this.NombreEmpresaCapitalice();
    this.EntidadCapitalice();
    this.OficinaCapitalice();
    this.ProductoCapitalice();
    this.validarReferencias();
    this.DataRequired.ReferenciaData.forEach(elementRef => {
      if (elementRef.Id !== 2 && elementRef.Id !== 4) {
        this.dataReferencias.push(elementRef);
      }
    });
  }

  //#region  Metodos de carga
  GetDepartamentosList(form : any) {
    this.bloqDeparta = null;
    if (form.Pais !== null && form.Pais !== undefined && form.Pais !== '') {
      if (+form.Pais === 42) {
        this.AgregarValidacionesReferencias();
          if (form.Pais.IdPais === undefined || form.Pais.IdPais === null) {
            this.recursosGeneralesService.GetDepartamentosList(+form.Pais).subscribe(
              result => {
                if (result.length > 0) {
                  this.dataDepartamentos = result;
                } else {
                  this.dataDepartamentos = [];
                  this.referenciasFrom.get('Departamento')?.reset();
                  this.referenciasFrom.get('Ciudad')?.reset();
                  this.bloqDeparta = true;
                  this.bloqCiudad = true;
                }
              },
              error => {
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.error(errorMessage);
              }
            );
          } else {
            this.dataDepartamentos = [];
            this.referenciasFrom.get('Pais')?.reset();
            this.referenciasFrom.get('Departamento')?.reset();
            this.referenciasFrom.get('Ciudad')?.reset();
            this.bloqDeparta = true;
            this.bloqCiudad = true;
          }
        
      } else {
        this.EliminarValidacionesReferencias();
        this.dataDepartamentos = [];
        this.referenciasFrom.get('Departamento')?.reset();
        this.referenciasFrom.get('Ciudad')?.reset();
        this.bloqDeparta = true;
        this.bloqCiudad = true;
      }
    } else {
      this.dataDepartamentos = [];
      this.referenciasFrom.get('Pais')?.reset();
      this.referenciasFrom.get('Departamento')?.reset();
      this.referenciasFrom.get('Ciudad')?.reset();
      this.bloqDeparta = true;
      this.bloqCiudad = true;
    }
  }

  LimpiarCiudad() {
    this.referenciasFrom.get('Ciudad')?.reset();
  }

  GetCiudadList(form : any) {
    // this.referenciasFrom.get('Ciudad')?.reset();
    if (form.Departamento !== null && form.Departamento !== undefined && form.Departamento !== '') {
      // if (form.Departamento.IdDepartamento !== undefined && form.Departamento.IdDepartamento !== null) {
        this.recursosGeneralesService.GetCiudadList(+form.Departamento).subscribe(
          result => {
            this.bloqCiudad = null;
            this.dataCiudades = result;
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.error(errorMessage);
          }
        );
      // } else {
      //   this.referenciasFrom.get('Departamento')?.reset();
      //   this.referenciasFrom.get('Ciudad')?.reset();
      //   this.bloqCiudad = true;
      // }
    } else {
      this.referenciasFrom.get('Departamento')?.reset();
      this.referenciasFrom.get('Ciudad')?.reset();
      this.bloqCiudad = true;
    }
  }
  //#endregion

  //#region Metodos funcionales
  validarTipoReferencia(form : any) {
   
    if (form.TipoReferencia.Id === 1) {
      this.ocultarComerciales = null;
      this.ocultarFinancieras = true;
      this.LimpiarSoloCampos();
      this.AddValidatorComercial();
    } else {
      this.ocultarComerciales = true;
      this.ocultarFinancieras = null;
      this.LimpiarSoloCampos();
      this.AddValidatorFinanciera();
    }
    this.PrecargarPais.emit(true);
  }

  AddValidatorComercial() {
    this.RemoveValidatorFinanciera();
    this.referenciasFrom.controls['NombreEmpresa'].setValidators([Validators.required,
      Validators.pattern('[A-Za-zñÑ 0-9]+')]);
    this.referenciasFrom.controls['NombreEmpresa'].setErrors({ 'incorrect': true });

    this.referenciasFrom.controls['TelefonoUno'].setValidators([Validators.required,
      Validators.minLength(7), Validators.pattern('[0-9]{7,10}')]);
    this.referenciasFrom.controls['TelefonoUno'].setErrors({ 'incorrect': true });

    this.referenciasFrom.controls['TelefonoDos'].setValidators([
    Validators.pattern('[0-9]{7,10}')]);


    this.referenciasFrom.controls['Pais'].setValidators([Validators.required]);
    this.referenciasFrom.controls['Pais'].setErrors({ 'incorrect': true });

    this.referenciasFrom.controls['Departamento'].setValidators([Validators.required]);
    this.referenciasFrom.controls['Departamento'].setErrors({ 'incorrect': true });

    this.referenciasFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.referenciasFrom.controls['Ciudad'].setErrors({ 'incorrect': true });

  }

  RemoveValidatorComercial() {
    this.referenciasFrom.controls['NombreEmpresa'].setErrors(null);
    this.referenciasFrom.controls['NombreEmpresa'].clearValidators();
    this.referenciasFrom.controls['NombreEmpresa'].setValidators(null);

    this.referenciasFrom.controls['TelefonoUno'].setErrors(null);
    this.referenciasFrom.controls['TelefonoUno'].clearValidators();
    this.referenciasFrom.controls['TelefonoUno'].setValidators(null);

    this.referenciasFrom.controls['TelefonoDos'].setErrors(null);
    this.referenciasFrom.controls['TelefonoDos'].clearValidators();
    this.referenciasFrom.controls['TelefonoDos'].setValidators(null);

    this.referenciasFrom.controls['Pais'].setErrors(null);
    this.referenciasFrom.controls['Pais'].clearValidators();
    this.referenciasFrom.controls['Pais'].setValidators(null);

    this.referenciasFrom.controls['Departamento'].setErrors(null);
    this.referenciasFrom.controls['Departamento'].clearValidators();
    this.referenciasFrom.controls['Departamento'].setValidators(null);

    this.referenciasFrom.controls['Ciudad'].setErrors(null);
    this.referenciasFrom.controls['Ciudad'].clearValidators();
    this.referenciasFrom.controls['Ciudad'].setValidators(null);
  }

  AddValidatorFinanciera() {
    this.RemoveValidatorComercial();
    this.referenciasFrom.controls['Entidad'].setValidators([Validators.required,
      Validators.pattern('[A-Za-zñÑ 0-9]+')]);
    this.referenciasFrom.controls['Entidad'].setErrors({ 'incorrect': true });

    this.referenciasFrom.controls['Telefono'].setValidators([Validators.required,
      Validators.minLength(7), Validators.pattern('[0-9]{7,10}')]);
    this.referenciasFrom.controls['Telefono'].setErrors({ 'incorrect': true });

    this.referenciasFrom.controls['Oficina'].setValidators([Validators.required, Validators.pattern('[A-Za-zñÑ 0-9]+')]);
    this.referenciasFrom.controls['Oficina'].setErrors({ 'incorrect': true });

    this.referenciasFrom.controls['Producto'].setValidators([Validators.required, Validators.pattern('[A-Za-zñÑ 0-9]+')]);
    this.referenciasFrom.controls['Producto'].setErrors({ 'incorrect': true });
  }

  RemoveValidatorFinanciera() {
    this.referenciasFrom.controls['Entidad'].setErrors(null);
    this.referenciasFrom.controls['Entidad'].clearValidators();
    this.referenciasFrom.controls['Entidad'].setValidators(null);

    this.referenciasFrom.controls['Telefono'].setErrors(null);
    this.referenciasFrom.controls['Telefono'].clearValidators();
    this.referenciasFrom.controls['Telefono'].setValidators(null);

    this.referenciasFrom.controls['Oficina'].setErrors(null);
    this.referenciasFrom.controls['Oficina'].clearValidators();
    this.referenciasFrom.controls['Oficina'].setValidators(null);

    this.referenciasFrom.controls['Producto'].setErrors(null);
    this.referenciasFrom.controls['Producto'].clearValidators();
    this.referenciasFrom.controls['Producto'].setValidators(null);
  }

  validarCiudadList(form : any) {
    if (this.referenciasFrom.get('Ciudad')?.value === '' || this.referenciasFrom.get('Ciudad')?.value === null
      || this.referenciasFrom.get('Ciudad')?.value === undefined) {
      this.referenciasFrom.get('Ciudad')?.reset();
    } else {
      if (form.Ciudad === null || form.Ciudad === undefined || form.Ciudad === '') {
        this.referenciasFrom.get('Ciudad')?.reset();
      }
    }
  }

  desbloquearDepart() {
    // if (this.referenciasFrom.get('Pais')?.value === '' || this.referenciasFrom.get('Pais')?.value === null
    //   || this.referenciasFrom.get('Pais')?.value === undefined) {
    //   this.referenciasFrom.get('Departamento')?.reset();
    //   this.referenciasFrom.get('Ciudad')?.reset();
    // }
    this.bloqDeparta = null;
  }

  desbloquearCiudad() {
    if (this.referenciasFrom.get('Departamento')?.value === '' || this.referenciasFrom.get('Departamento')?.value === null
      || this.referenciasFrom.get('Departamento')?.value === undefined) {
      this.referenciasFrom.get('Ciudad')?.reset();
      this.bloqCiudad = true;
    } else {
      this.bloqCiudad = null;
    }
  }

  Limpiarformulario() {
    this.bloqDeparta = true;
    this.bloqCiudad = true;
    this.indexReferencia = null;
    this.referenciasFrom.reset();
  }

  LimpiarSoloCampos() {
    this.bloqDeparta = true;
    this.bloqCiudad = true;
    this.referenciasFrom.get('NombreEmpresa')?.reset();
    this.referenciasFrom.get('TelefonoUno')?.reset();
    this.referenciasFrom.get('TelefonoDos')?.reset();
    this.referenciasFrom.get('Pais')?.reset();
    this.referenciasFrom.get('Departamento')?.reset();
    this.referenciasFrom.get('Ciudad')?.reset();
    this.referenciasFrom.get('Entidad')?.reset();
    this.referenciasFrom.get('Telefono')?.reset();
    this.referenciasFrom.get('Oficina')?.reset();
    this.referenciasFrom.get('Producto')?.reset();
  }

  MapearReferencia(index : any, data : any) {
    this.LimpiarSoloCampos();
    this.indexReferencia = index;
    if (data.TipoReferencia.Id === 1) {
      this.ocultarComerciales = null;
      this.ocultarFinancieras = true;
      this.AddValidatorComercial();
      this.referenciasFrom.get('IdJuridicoReferencia')?.setValue(data.IdJuridicoReferencia);
      this.referenciasFrom.get('IdJuridico')?.setValue(data.IdJuridico);
      this.referenciasFrom.get('TipoReferencia')?.setValue(data.TipoReferencia);
      this.referenciasFrom.get('NombreEmpresa')?.setValue(data.NombreEmpresa);
      this.referenciasFrom.get('TelefonoUno')?.setValue(data.TelefonoUno);
      this.referenciasFrom.get('TelefonoDos')?.setValue(data.TelefonoDos);
      if (data.Pais !== null) {
        this.referenciasFrom.get('Pais')?.setValue(data.Pais.Descripcion);
        if (data.Pais !== null && data.Pais !== undefined && data.Pais !== ''
        && data.Ciudad !== null && data.Ciudad !== undefined && data.Ciudad !== '') {
        this.AgregarValidacionesReferencias();
        this.dataCiudades.forEach((elementCiu : any) => {
          if (elementCiu.IdCiudad === +data.Ciudad.IdCiudad) {
            this.bloqCiudad = null;
            this.referenciasFrom.get('Ciudad')?.setValue(elementCiu.IdCiudad);
            this.CiudadMapper = elementCiu;
            this.dataDepartamentos.forEach((elementDep : any) => {
              this.bloqDeparta = null;
              if (elementDep.IdDepartamento === +data.Departamento.IdDepartamento) {
                this.referenciasFrom.get('Departamento')?.setValue(elementDep.IdDepartamento);
                this.DepartMapper = elementDep;
                this.dataPais.forEach((elementPais : any) => {
                  if (elementPais.IdPais === +data.Pais.IdPais) {
                    this.referenciasFrom.get('Pais')?.setValue(elementPais.IdPais);
                    this.PaisMapper = elementPais;
                  }
                });
              }
            });
          }
        });
      } else {
        this.EliminarValidacionesReferencias();
        this.dataPais.forEach((elementPais : any) => {
          if (elementPais.IdPais === +data.Pais.IdPais) {
            this.referenciasFrom.get('Pais')?.setValue(elementPais.IdPais);
            this.PaisMapper = elementPais;
          }
        });
      }
      }
     
      

    } else if (data.TipoReferencia.Id === 3) {
      this.ocultarComerciales = true;
      this.ocultarFinancieras = null;
      this.AddValidatorFinanciera();
      this.referenciasFrom.get('IdJuridicoReferencia')?.setValue(data.IdJuridicoReferencia);
      this.referenciasFrom.get('IdJuridico')?.setValue(data.IdJuridico);
      this.referenciasFrom.get('TipoReferencia')?.setValue(data.TipoReferencia);
      this.referenciasFrom.get('Entidad')?.setValue(data.Entidad);
      this.referenciasFrom.get('Telefono')?.setValue(data.Telefono);
      this.referenciasFrom.get('Oficina')?.setValue(data.Oficina);
      this.referenciasFrom.get('Producto')?.setValue(data.Producto);
    }
    this.IrArriba();
  }

  AgregarReferencias(form : any) {
    let countComer = 0;
    let countFina = 0;
    if (this.referenciasFrom.valid) {
      if (this.indexReferencia === null) {
        this.itemsReferencias.forEach(elementRefe => {
          if (elementRefe.TipoReferencia.Id === 1) {
            countComer = countComer + 1;
          } else {
            countFina = countFina + 1;
          }
        });
        if (countFina >= 2 && countComer >= 2) {
          this.notif.onWarning('Advertencia', 'Solo puede relacionar dos referencias comerciales y dos referencias financieras.',);
        } else {
          if (form.TipoReferencia !== '' && form.TipoReferencia !== undefined && form.TipoReferencia !== null) {
            if (form.TipoReferencia.Id === 1) {
              if (+this.referenciasFrom.value.Ciudad !== null && +this.referenciasFrom.value.Ciudad !== undefined &&
                +this.referenciasFrom.value.Ciudad !== 0 && this.referenciasFrom.value.Ciudad !== '') {
                this.dataCiudades.forEach((elementCiu : any)=> {
                  if (elementCiu.IdCiudad === +this.referenciasFrom.value.Ciudad) {
                    this.referenciasFrom.get('Ciudad')?.setValue(elementCiu);
                    this.dataDepartamentos.forEach((elementDep : any) => {
                      if (elementDep.IdDepartamento === +this.referenciasFrom.value.Departamento) {
                        this.referenciasFrom.get('Departamento')?.setValue(elementDep);
                        this.dataPais.forEach((elementPais : any) => {
                          if (elementPais.IdPais === +this.referenciasFrom.value.Pais) {
                            this.referenciasFrom.get('Pais')?.setValue(elementPais);
                            if (this.referenciasFrom.value.NombreEmpresa !== null && this.referenciasFrom.value.NombreEmpresa !== undefined) {
                              this.referenciasFrom.value.NombreEmpresa = this.referenciasFrom.value.NombreEmpresa.substr(0, 1).toUpperCase() +
                                this.referenciasFrom.value.NombreEmpresa.substr(1).toLowerCase();
                            }
                            this.itemsReferencias.push(this.referenciasFrom.value);
                            this.bloqDeparta = true;
                            this.bloqCiudad = true;
                            this.referenciasFrom.reset();
                            this.indexReferencia = null;
                            this.EnableUpdateReferencias = true;
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                this.dataPais.forEach((elementPais : any) => {
                  if (elementPais.IdPais === +this.referenciasFrom.value.Pais) {
                    this.referenciasFrom.get('Pais')?.setValue(elementPais);
                    if (this.referenciasFrom.value.NombreEmpresa !== null && this.referenciasFrom.value.NombreEmpresa !== undefined) {
                      this.referenciasFrom.value.NombreEmpresa = this.referenciasFrom.value.NombreEmpresa.substr(0, 1).toUpperCase() +
                        this.referenciasFrom.value.NombreEmpresa.substr(1).toLowerCase();
                    }
                    this.itemsReferencias.push(this.referenciasFrom.value);
                    this.bloqDeparta = true;
                    this.bloqCiudad = true;
                    this.referenciasFrom.reset();
                    this.indexReferencia = null;
                    this.EnableUpdateReferencias = true;
                  }
                });
              }
            } else {
              if (this.referenciasFrom.value.Entidad !== null && this.referenciasFrom.value.Entidad !== undefined) {
                this.referenciasFrom.value.Entidad = this.referenciasFrom.value.Entidad.substr(0, 1).toUpperCase() +
                  this.referenciasFrom.value.Entidad.substr(1).toLowerCase();
              }
              if (this.referenciasFrom.value.Oficina !== null && this.referenciasFrom.value.Oficina !== undefined) {
                this.referenciasFrom.value.Oficina = this.referenciasFrom.value.Oficina.substr(0, 1).toUpperCase() +
                  this.referenciasFrom.value.Oficina.substr(1).toLowerCase();
              }
              if (this.referenciasFrom.value.Producto !== null && this.referenciasFrom.value.Producto !== undefined) {
                this.referenciasFrom.value.Producto = this.referenciasFrom.value.Producto.substr(0, 1).toUpperCase() +
                  this.referenciasFrom.value.Producto.substr(1).toLowerCase();
              }
              this.itemsReferencias.push(form);
              this.referenciasFrom.reset();
              this.indexReferencia = null;
              this.EnableUpdateReferencias = true;
            }
          } else {
            this.notif.onWarning('Advertencia', 'Debe seleccionar un tipo de referencia válido.');
          }
        }
      } else {
        if (countFina >= 2 && countComer >= 2) {
          this.notif.onWarning('Advertencia', 'Solo puede relacionar dos referencias comerciales y dos referencias financieras.');
        } else {
          if (form.TipoReferencia !== '' && form.TipoReferencia !== undefined && form.TipoReferencia !== null) {
            if (form.TipoReferencia.Id === 1) {
              if (+this.referenciasFrom.value.Ciudad !== null && +this.referenciasFrom.value.Ciudad !== undefined &&
                +this.referenciasFrom.value.Ciudad !== 0 && this.referenciasFrom.value.Ciudad !== '') {
                this.dataCiudades.forEach((elementCiu : any) => {
                  if (elementCiu.IdCiudad === +this.referenciasFrom.value.Ciudad) {
                    this.referenciasFrom.get('Ciudad')?.setValue(elementCiu);
                    this.dataDepartamentos.forEach((elementDep : any) => {
                      if (elementDep.IdDepartamento === +this.referenciasFrom.value.Departamento) {
                        this.referenciasFrom.get('Departamento')?.setValue(elementDep);
                        this.dataPais.forEach((elementPais : any) => {
                          if (elementPais.IdPais === +this.referenciasFrom.value.Pais) {
                            this.referenciasFrom.get('Pais')?.setValue(elementPais);
                            this.itemsReferencias.splice(this.indexReferencia, 1);
                            this.itemsReferencias.push(this.referenciasFrom.value);
                            this.bloqDeparta = true;
                            this.bloqCiudad = true;
                            this.referenciasFrom.reset();
                            this.indexReferencia = null;
                            this.EnableUpdateReferencias = true;
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                this.dataPais.forEach((elementPais : any) => {
                  if (elementPais.IdPais === +this.referenciasFrom.value.Pais) {
                    this.referenciasFrom.get('Pais')?.setValue(elementPais);
                    this.itemsReferencias.splice(this.indexReferencia, 1);
                    this.itemsReferencias.push(this.referenciasFrom.value);
                    this.bloqDeparta = true;
                    this.bloqCiudad = true;
                    this.referenciasFrom.reset();
                    this.indexReferencia = null;
                    this.EnableUpdateReferencias = true;
                  }
                });
              }
            } else {

              this.itemsReferencias.splice(this.indexReferencia, 1);
              this.itemsReferencias.push(form);
              this.referenciasFrom.reset();
              this.indexReferencia = null;
              this.EnableUpdateReferencias = true;
            }
          } else {
            this.notif.onWarning('Advertencia', 'Debe seleccionar un tipo de referencia válido.');
          }
        }
      }
    } else {
      this.notif.onWarning('Advertencia', 'Debe completar los campos marcados como obligatorios.');
    }
  }

  EliminarReferencia(index : number) {
    this.itemsReferencias.splice(index, 1);
    this.EnableUpdateReferencias = true;
  }

  GuardarReferencias() {
    let countComer = 0;
    let countFina = 0;
    this.referenciaModelLst = [];
    if (this.infoTabAllReferencias.BasicosDto.IdRelacion === '15' && this.itemsReferencias.length === 0) {
      this.siguiente = true;
      this.emitEvent.emit(this.positionTab);
      this.infoTabAllReferencias.ReferenciasDto = {};
      this.IrArriba();
    } else {
      if (this.itemsReferencias.length > 0) {
        this.itemsReferencias.forEach(elementRefe => {
          if (elementRefe.TipoReferencia.Id === 1) {
            countComer = countComer + 1;
          } else {
            countFina = countFina + 1;
          }
        });
        if ((countComer === 1 || countComer === 2)) {
          this.siguiente = true;
          this.emitEvent.emit(this.positionTab);

          this.itemsReferencias.forEach(elementRefe => {
            this.referenciaModel = new ReferenciaModel();
            if (elementRefe.TipoReferencia.Id === 1) {
              if (elementRefe.Ciudad !== null && elementRefe.Ciudad !== undefined) {
                this.referenciaModel.IdCiudad = elementRefe.Ciudad.IdCiudad;
              } else {
                this.referenciaModel.IdPais = elementRefe.Pais.IdPais;
              }
              

              this.referenciaModel.Descripcion = elementRefe.NombreEmpresa;
            } else {

              this.referenciaModel.IdCiudad = elementRefe.Ciudad;

              this.referenciaModel.Descripcion = elementRefe.Entidad;
            }
            if (elementRefe.TelefonoUno !== null && elementRefe.TelefonoUno !== undefined && elementRefe.TelefonoUno !== '') {
              this.referenciaModel.Telefono = elementRefe.TelefonoUno;
            } else {
              this.referenciaModel.Telefono = elementRefe.Telefono;
            }

            this.referenciaModel.Producto = elementRefe.Producto;
            this.referenciaModel.IdOficina = elementRefe.Oficina;

            this.referenciaModel.Telefono2 = elementRefe.TelefonoDos;
            this.referenciaModel.IdJuridicoReferencia = 0;
            this.referenciaModel.IdTercero = 0;
            this.referenciaModel.IdTipoReferencia = elementRefe.TipoReferencia.Id;

            this.referenciaModelLst.push(this.referenciaModel);
          });
          this.infoTabAllReferencias.ReferenciasDto = this.referenciaModelLst;
          console.log(this.infoTabAllReferencias);
          this.IrArriba();
        } else {
          if (countFina > 2 || countComer > 2) {
            this.notif.onWarning('Advertencia', 'Solo puede relacionar dos referencias comerciales y dos referencias financieras.');
          } else {
            this.notif.onWarning('Advertencia', 'Debe agregar una referencia comercial y una financiera.');
          }
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe agregar una referencia comercial y una financiera.');
      }
    }
  }

  ActualizarReferencias() {
    let countComer = 0;
    let countFina = 0;
    this.referenciaModelLst = [];
    if (countFina >= 2 || countComer >= 2) {
      this.notif.onWarning('Advertencia', 'Solo puede relacionar dos referencias comerciales y dos referencias financieras.');
    } else {
      if (this.itemsReferencias.length > 0) {
        this.itemsReferencias.forEach(elementRefe => {
          this.referenciaModel = new ReferenciaModel();
          if (elementRefe.TipoReferencia.Id === 1) {
            if (elementRefe.Ciudad !== null && elementRefe.Ciudad !== undefined && elementRefe.Ciudad !== 0) {
              this.referenciaModel.IdCiudad = elementRefe.Ciudad.IdCiudad;
            } else {
              if (elementRefe.Pais !== null) {
                this.referenciaModel.IdPais = elementRefe.Pais.IdPais;
              }             
            }
            

            this.referenciaModel.Descripcion = elementRefe.NombreEmpresa;
          } else {

            this.referenciaModel.IdCiudad = elementRefe.Ciudad;
            this.referenciaModel.Descripcion = elementRefe.Entidad;
          }
          if (elementRefe.TelefonoUno !== null && elementRefe.TelefonoUno !== undefined && elementRefe.TelefonoUno !== '') {
            this.referenciaModel.Telefono = elementRefe.TelefonoUno;
          } else {
            this.referenciaModel.Telefono = elementRefe.Telefono;
          }

          this.referenciaModel.Producto = elementRefe.Producto;
          this.referenciaModel.IdOficina = elementRefe.Oficina;

          this.referenciaModel.Telefono2 = elementRefe.TelefonoDos;
          this.referenciaModel.IdJuridicoReferencia = elementRefe.IdJuridicoReferencia;
          if (elementRefe.IdJuridico !== null && elementRefe.IdJuridico !== undefined) {
            this.referenciaModel.IdTercero = elementRefe.IdJuridico;
          } else {
            this.referenciaModel.IdTercero = this.JuridicoEdit;
          }
      
          this.referenciaModel.IdTipoReferencia = elementRefe.TipoReferencia.Id;

          this.referenciaModelLst.push(this.referenciaModel);
        });

        console.log(this.infoTabAllReferencias);
        this.infoTabAllReferencias.ReferenciasDto = this.referenciaModelLst;
        this.GuardarLog(this.infoTabAllReferencias.ReferenciasDto, this.OperacionActual, 0, 0,12); //NOTERCERO
        this.juridicoService.EditReferencias(this.infoTabAllReferencias.ReferenciasDto).subscribe(
          result => {
            if (result) {
              this.notif.onSuccess('Exitoso', 'El registro se actualizo correctamente.');
              this.infoTabAllReferencias.ReferenciasDto = {};
              this.EnableUpdateReferencias = false;
              this.IrArriba();
            }
          },
          error => {
            console.error('Error al realizar la actualizacion - juridicos: ' + error);
            this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
          });
      } else {
        this.notif.onWarning('Advertencia', 'Debe ingresar una referencia comercial y una financiera.');
      }
    }
  }


  //#endregion

  //#region Metodos Inicializacion y generales
  validarReferencias() {
    const IdJuridicoReferencia = new FormControl('', []);
    const IdJuridico = new FormControl('', []);
    const TipoReferencia = new FormControl('', []);
    // Comercial
    const NombreEmpresa = new FormControl('', []);
    const TelefonoUno = new FormControl('', [Validators.pattern('[0-9]{7,10}')]);
    const TelefonoDos = new FormControl('', [Validators.pattern('[0-9]{7,10}')]);
    const Pais = new FormControl('', []);
    const Departamento = new FormControl('', []);
    const Ciudad = new FormControl('', []);

    // Financiera
    const Entidad = new FormControl('', []);
    const Telefono = new FormControl('', [Validators.pattern('[0-9]{7,10}')]);
    const Oficina = new FormControl('', []);
    const Producto = new FormControl('', []);

    this.referenciasFrom = new FormGroup({
      IdJuridicoReferencia: IdJuridicoReferencia,
      IdJuridico: IdJuridico,
      TipoReferencia: TipoReferencia,
      NombreEmpresa: NombreEmpresa,
      TelefonoUno : TelefonoUno,
      TelefonoDos: TelefonoDos,
      Pais: Pais,
      Departamento: Departamento,
      Ciudad: Ciudad,
      Entidad : Entidad ,
      Telefono: Telefono,
      Oficina: Oficina,
      Producto: Producto
    });
  }

  ValidarErrorForm(formulario: FormGroup) {
    Object.keys(formulario.controls).forEach(field => { // {1}
      // const control = formulario.get(field);            // {2}
      formulario.controls[field].markAsTouched({ onlySelf: true });       // {3}
      // formulario.controls[field].markAsDirty({ onlySelf: true }); // {4}
    });
  }

  GenericoSelect(input : string, form : any) {
    if (+form.get('' + input + '')?.value === 0) {
      this.notif.onWarning('Advertencia', 'Debe seleccionar una opción valida.');
      form.get('' + input + '')?.reset();
    }
  }

  NombreEmpresaCapitalice() {
    let self = this;
    $('#nombreEmpresa').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  EntidadCapitalice() {
    let self = this;
    $('#entidad').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  OficinaCapitalice() {
    let self = this;
    $('#oficina').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  ProductoCapitalice() {
    let self = this;
   $('#producto').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }

  GuardarLog(formulario : any, operacion : number, cuenta : number, tercero : number,modulo : number) {
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

  AgregarValidacionesReferencias() {
    this.referenciasFrom.controls['Departamento'].setValidators([Validators.required]);
    this.referenciasFrom.controls['Departamento'].setErrors({ 'incorrect': true });
    this.referenciasFrom.get('Departamento')?.updateValueAndValidity();
    this.referenciasFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.referenciasFrom.controls['Ciudad'].setErrors({ 'incorrect': true });
    this.referenciasFrom.get('Ciudad')?.updateValueAndValidity();
    this.bloqDeparta = null;
    this.bloqCiudad = null;
  }

  EliminarValidacionesReferencias() {
    this.referenciasFrom.controls['Departamento'].setErrors(null);
    this.referenciasFrom.controls['Departamento'].clearValidators();
    this.referenciasFrom.controls['Departamento'].setValidators(null);

    this.referenciasFrom.controls['Ciudad'].setErrors(null);
    this.referenciasFrom.controls['Ciudad'].clearValidators();
    this.referenciasFrom.controls['Ciudad'].setValidators(null);

    this.referenciasFrom.get('Departamento')?.reset();
    this.referenciasFrom.get('Ciudad')?.reset();
    this.bloqDeparta = true;
    this.bloqCiudad = true;
  }

  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filrefcom_" + this.ColorAnterior1).css("background", "#FFFFFF");
      $(".filrefcom_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior1 = fil;
    }
    if (producto === 2) {

      $(".filReffin_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".filReffin_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior2 = fil;

    }
  }
  //#endregion
}
