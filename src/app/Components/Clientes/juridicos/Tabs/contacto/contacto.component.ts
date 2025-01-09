import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecursosGeneralesService } from '../../../../../Services/Utilidades/recursosGenerales.service';
import { ContactoModel } from '../../../../../Models/Clientes/Juridicos/ContactoModel';
import { JuridicosService } from '../../../../../Services/Clientes/Juridicos.service';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  providers: [ClientesGetListService, RecursosGeneralesService, GeneralesService],
  standalone : false
})
export class ContactoComponent implements OnInit {
  //#region carga variables
  public dataContacto : any;
  public dataDepartamentos : any[] = [];
  public dataCiudades : any[] = [];
  public dataBarrios : any[] = [];
  public direccionSeleccionada: string = "";
  //#endregion
  //#region  variables de bloqueo
  public bloqDeparta : boolean | null = true;
  public bloqCiudad : boolean | null = true;
  public bloqBarrio : boolean | null = true;
  public bloquearContPpal : boolean | null = true;
  public ocultarDireccion : boolean | null = true;
  public ocultarTelefonos : boolean | null = true;
  public ocultarEmail : boolean | null  = true;
  public ocultarCelular : boolean | null = true;
  public ocultarUbicacion : boolean | null = null;
  public ocultarDireccionSeleccionada : boolean | null = true;
  public descripcionNumero : boolean | null = true;
  public bloquearCampoDir : boolean | null = null;
  public EnableUpdateContacto : boolean | null = false;
  //#endregion
  //#region From
  // public contactoFrom: FormGroup;
  public contactoFrom: any;
  public ColorAnterior: any;
  //#endregion
  //#region  carga variables comunicacion
  @Input() bloquearForm: boolean | null = false;
  @Output() emitEvent = new EventEmitter(); // variable que emite para dar siguiente
  @Output() emitEventContacto: EventEmitter<any> = new EventEmitter<any>();
  @Input() infoTabAllContacto: any;
  @Input() dataPais: any;
  @Input() dataVias: any;
  @Input() dataLetras: any;
  @Input() dataCardinal: any;
  @Input() dataImuebles: any;
  @Input() mostrarActualizar: boolean = false;
  @Input() mostrarAgregar: boolean = false;
  @Input() mostrarLimpiar: boolean = false;
  @Input() mostrarSiguiente: boolean = false;
  @Input() activarBtnOpciones: boolean = false;
  @Input() OperacionActual: any;
  @Input() tipoCliente: any;
  @Output() PrecargarPais: EventEmitter<any> = new EventEmitter<any>();
  //#endregion
  //#region carga variables
  public siguiente = false;
  public positionTab = 3;
  public DireccionSeleccionada : any;
  public Via : string = "";
  public Numero : string = "";
  public Letra : string = "";
  public NumeroDos : string = "";
  public LetraDos : string = "";
  public Cardinal : string = "";
  public CardinalDos : string = "";
  public NumeroTres : string = "";
  public inmueble : string = "";
  public NumeroCuatro : string = "";
  public Observacion : string = "";
  public IdVia : string = "";
  public IdLetra : string = "";
  public IdLetraDos : string = "";
  public IdCardinal : string = "";
  public IdCardinalDos : string = "";
  public Idinmueble : string = "";

  public obligatoriCliente : string | null | boolean = "";
  
  public dataTable: any[] = [];
  public DescripcionDireccion : string = "";
  public DescripcionDireccionIds : string = "";
  public contactoModel = new ContactoModel();
  public contactoModelList: ContactoModel[] = [];
  public indexItemContacto : any = null;

  public DireccionsSeleccionada: any;
  public PaisMapper: any;
  public DepartMapper: any;
  public CiudadMapper: any;
  public BarrioMapper: any;
  public JuridicoEdit: any;

  public infoTabAll = {
    ContactoDto: {},
  };
  //#endregion
  constructor(private clientesGetListService: ClientesGetListService, private notif: NgxToastService,
    private recursosGeneralesService: RecursosGeneralesService, private juridicoService: JuridicosService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.IrArriba();
    this.OservacionCapitalice();
    this.dataTable = [];
    this.validarContacto();
    this.GetTipoContacto();
    

  }
  //#region  Metodos de carga
  GetTipoContacto() {
    this.clientesGetListService.GetTipoContacto().subscribe(
      result => {
        result.splice(0, 1);
        result.splice(2, 1);
        result.splice(0, 1);
        result.splice(1, 1);
        this.dataContacto = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }

  GetDepartamentosList(form : any) {
    this.bloqDeparta = null;
    if (form.Pais !== null && form.Pais !== undefined && form.Pais !== '') {
      if (+form.Pais === 42) {
        this.AgregarValidacionesContacto();
        if (this.PaisMapper.Descripcion != form.Pais) {
          this.recursosGeneralesService.GetDepartamentosList(+form.Pais).subscribe(
            result => {
              if (result.length > 0) {
                this.dataDepartamentos = result;
              } else {
                this.dataDepartamentos = [];
                this.contactoFrom.get('Departamento').reset();
                this.contactoFrom.get('Ciudad').reset();
                this.contactoFrom.get('Barrio').reset();
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
          this.recursosGeneralesService.GetDepartamentosList(this.PaisMapper.IdPais).subscribe(
            result => {
              if (result.length > 0) {
                this.dataDepartamentos = result;
              } else {
                this.dataDepartamentos = [];
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
        }
      } else {
        this.EliminarValidacionesContacto();
        this.dataDepartamentos = [];
        this.contactoFrom.get('Departamento').reset();
        this.contactoFrom.get('Ciudad').reset();
        this.contactoFrom.get('Barrio').reset();
        this.bloqDeparta = true;
        this.bloqCiudad = true;
      }
    } else {
      this.dataDepartamentos = [];
      this.contactoFrom.get('Pais').reset();
      this.contactoFrom.get('Departamento').reset();
      this.contactoFrom.get('Ciudad').reset();
      this.contactoFrom.get('Barrio').reset();
      this.bloqDeparta = true;
      this.bloqCiudad = true;
    }
  }

  GetCiudadList(form : any) {
    // this.contactoFrom.get('Ciudad').reset();
    if (form.Departamento !== null && form.Departamento !== undefined && form.Departamento !== '') {
      // if (form.Departamento.IdDepartamento !== undefined && form.Departamento.IdDepartamento !== null) {
        this.recursosGeneralesService.GetCiudadList(+form.Departamento).subscribe(
          result => {
            this.bloqCiudad = null;
            this.dataCiudades = result;
            this.contactoFrom.get('Barrio').reset();
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.error(errorMessage);
          }
        );
      // } else {
      //   this.contactoFrom.get('Departamento').reset();
      //   this.contactoFrom.get('Ciudad').reset();
      //   this.contactoFrom.get('Barrio').reset();
      //   this.bloqCiudad = true;
      // }
    } else {
      this.contactoFrom.get('Departamento').reset();
      this.contactoFrom.get('Ciudad').reset();
      this.contactoFrom.get('Barrio').reset();
      this.bloqCiudad = true;
    }
  }

  LimpiarCiudad() {
    this.contactoFrom.get('Ciudad').reset();
  }

  GetBarrioList(form : any) {

    if (form.Ciudad !== null && form.Ciudad !== undefined && form.Ciudad !== '') {
      // if (form.Ciudad.IdCiudad !== undefined && form.Ciudad.IdCiudad !== null) {
        this.recursosGeneralesService.GetBarrioList(+form.Ciudad).subscribe(
          result => {
            if (result.length > 0) {
              this.bloqBarrio = null;
              this.dataBarrios = result;
              this.contactoFrom.get('Barrio').reset();
            } else {
              this.bloqBarrio = true;
              this.contactoFrom.get('Barrio').reset();
            }
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.error(errorMessage);
          }
        );
      // } else {
      //   this.contactoFrom.get('Ciudad').reset();
      //   this.contactoFrom.get('Barrio').reset();
      //   this.bloqBarrio = true;
      // }
    } else {
      this.contactoFrom.get('Ciudad').reset();
      this.contactoFrom.get('Barrio').reset();
      this.bloqBarrio = true;
    }
  }

  //#endregion

  //#region Metodos funcionales
  AgregarContacto() {
    let ppalDir = false;
    let ppalEmail = false;
    let ppalcel = false;
    this.contactoFrom.get('DescripcionAdress').setValue(this.DescripcionDireccion);
    this.contactoFrom.get('DescripcionAdressIds').setValue(this.DescripcionDireccionIds);
    if (this.contactoFrom.valid) {
      if (this.indexItemContacto === null) {
        this.dataTable.forEach(elementCont => {
          if (elementCont.contactoPpal === true && (elementCont.TipoContacto.Id === 1 || elementCont.TipoContacto.Id === 2)) {
            if (this.contactoFrom.value.TipoContacto.Id === 1 || this.contactoFrom.value.TipoContacto.Id === 2) {
              ppalDir = true;
            }
          }
          if (elementCont.contactoPpal === true && elementCont.TipoContacto.Id === 3) {
            if (this.contactoFrom.value.TipoContacto.Id === 3) {
              ppalEmail = true;
            }
          }
          if (elementCont.contactoPpal === true && elementCont.TipoContacto.Id === 6) {
            if (this.contactoFrom.value.TipoContacto.Id === 6) {
              ppalcel = true;
            }
          }
        });
        if (ppalDir && this.contactoFrom.value.contactoPpal &&
          (this.contactoFrom.value.TipoContacto.Id !== 5 && this.contactoFrom.value.TipoContacto.Id !== 4)) { // Direccion
          this.notif.onWarning('Advertencia', 'Solo puede tener un contacto principal para dirección.');

        } else if (ppalEmail && this.contactoFrom.value.contactoPpal &&
          (this.contactoFrom.value.TipoContacto.Id !== 5 && this.contactoFrom.value.TipoContacto.Id !== 4)) { // Email
          this.notif.onWarning('Advertencia', 'Solo puede tener un contacto principal para email.');

        } else if (ppalcel && this.contactoFrom.value.contactoPpal &&
          (this.contactoFrom.value.TipoContacto.Id !== 5 && this.contactoFrom.value.TipoContacto.Id !== 4)) { // Celular
          this.notif.onWarning('Advertencia', 'Solo puede tener un contacto principal para celular.');

        } else {
          if ((this.contactoFrom.value.Barrio === undefined || this.contactoFrom.value.Barrio === null)) {  
              if (this.contactoFrom.value.TipoContacto.Id === 7 ||
                this.contactoFrom.value.TipoContacto.Id === 3 || this.contactoFrom.value.TipoContacto.Id === 6) {
                this.pushTable(this.contactoFrom.value);
                this.EnableUpdateContacto = true;
              } else {
                if (+this.contactoFrom.value.Ciudad !== null && +this.contactoFrom.value.Ciudad !== undefined && 
                  +this.contactoFrom.value.Ciudad !== 0 && this.contactoFrom.value.Ciudad !== '') {
                  this.dataCiudades.forEach(elementCiu => {
                    if (elementCiu.IdCiudad === +this.contactoFrom.value.Ciudad) {
                      this.contactoFrom.get('Ciudad').setValue(elementCiu);
                      this.dataDepartamentos.forEach(elementDep => {
                        if (elementDep.IdDepartamento === +this.contactoFrom.value.Departamento) {
                          this.contactoFrom.get('Departamento').setValue(elementDep);
                          this.dataPais.forEach((elementPais : any) => {
                            if (elementPais.IdPais === +this.contactoFrom.value.Pais) {
                              this.contactoFrom.get('Pais').setValue(elementPais);
                              this.pushTable(this.contactoFrom.value);
                              this.EnableUpdateContacto = true;
                            }
                          });
                        }
                      });
                    }
                  });
                } else {
                  this.dataPais.forEach((elementPais : any) => {
                    if (elementPais.IdPais === +this.contactoFrom.value.Pais) {
                      this.contactoFrom.get('Pais').setValue(elementPais);
                      this.pushTable(this.contactoFrom.value);
                      this.EnableUpdateContacto = true;
                    }
                  });
                }
              }
          } else {
            if (this.contactoFrom.value.TipoContacto.Id === 7 ||
              this.contactoFrom.value.TipoContacto.Id === 3 || this.contactoFrom.value.TipoContacto.Id === 6) {
              this.pushTable(this.contactoFrom.value);
              this.EnableUpdateContacto = true;
            } else {
              this.dataBarrios.forEach(elementBarrio => {
                if (elementBarrio.IdBarrio === +this.contactoFrom.value.Barrio) {
                  this.contactoFrom.get('Barrio').setValue(elementBarrio);
                  this.dataCiudades.forEach(elementCiu => {
                    if (elementCiu.IdCiudad === +this.contactoFrom.value.Ciudad) {
                      this.contactoFrom.get('Ciudad').setValue(elementCiu);
                      this.dataDepartamentos.forEach(elementDep => {
                        if (elementDep.IdDepartamento === +this.contactoFrom.value.Departamento) {
                          this.contactoFrom.get('Departamento').setValue(elementDep);
                          this.dataPais.forEach((elementPais : any) => {
                            if (elementPais.IdPais === +this.contactoFrom.value.Pais) {
                              this.contactoFrom.get('Pais').setValue(elementPais);
                              this.pushTable(this.contactoFrom.value);
                              this.EnableUpdateContacto = true;
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        }
      } else {

        this.dataTable.forEach((x, y) => {
          if (x.contactoPpal === true && (x.TipoContacto.Id === 1 || x.TipoContacto.Id === 2)) {
            if (this.contactoFrom.value.TipoContacto.Id === 1 || this.contactoFrom.value.TipoContacto.Id === 2) {
              if (this.indexItemContacto !== y && this.contactoFrom.value.contactoPpal === true)  {
                 ppalDir = true;
              }
            }
          }
          if (x.contactoPpal === true && x.TipoContacto.Id === 3) {
            if (this.contactoFrom.value.TipoContacto.Id === 3) {
              if (this.indexItemContacto !== y && this.contactoFrom.value.contactoPpal === true) {
                ppalEmail = true;
              }
            }
          }
          if (x.contactoPpal === true && x.TipoContacto.Id === 6) {
            if (this.contactoFrom.value.TipoContacto.Id === 6) {
              if (this.indexItemContacto !== y && this.contactoFrom.value.contactoPpal === true) {
                ppalcel = true;
              }
            }
          }
        });
        if (this.indexItemContacto !== null && this.indexItemContacto !== undefined && ppalDir && this.contactoFrom.value.contactoPpal &&
          (this.contactoFrom.value.TipoContacto.Id !== 5 && this.contactoFrom.value.TipoContacto.Id !== 4)) { // Direccion
          this.notif.onWarning('Advertencia', 'Solo puede tener un contacto principal para dirección.');
        } else if (this.indexItemContacto !== null && this.indexItemContacto !== undefined && ppalEmail && this.contactoFrom.value.contactoPpal &&
          (this.contactoFrom.value.TipoContacto.Id !== 5 && this.contactoFrom.value.TipoContacto.Id !== 4)) { // Email
          this.notif.onWarning('Advertencia', 'Solo puede tener un contacto principal para email.');
        } else if (this.indexItemContacto !== null && this.indexItemContacto !== undefined && ppalcel && this.contactoFrom.value.contactoPpal &&
          (this.contactoFrom.value.TipoContacto.Id !== 5 && this.contactoFrom.value.TipoContacto.Id !== 4)) { // Celular
          this.notif.onWarning('Advertencia', 'Solo puede tener un contacto principal para celular.');
        } else {
            if ((this.contactoFrom.value.Barrio === undefined || this.contactoFrom.value.Barrio === null)) {
              if (this.contactoFrom.value.TipoContacto.Id === 7 ||
                this.contactoFrom.value.TipoContacto.Id === 3 || this.contactoFrom.value.TipoContacto.Id === 6) {
                this.dataTable.splice(this.indexItemContacto, 1);
                this.pushTable(this.contactoFrom.value);
                this.indexItemContacto = null;
                this.EnableUpdateContacto = true;
              } else {
                if (+this.contactoFrom.value.Ciudad !== null && +this.contactoFrom.value.Ciudad !== undefined &&
                  +this.contactoFrom.value.Ciudad !== 0 && this.contactoFrom.value.Ciudad !== '') {
                  this.dataCiudades.forEach(elementCiu => {
                    if (elementCiu.IdCiudad === +this.contactoFrom.value.Ciudad) {
                      this.contactoFrom.get('Ciudad').setValue(elementCiu);
                      this.dataDepartamentos.forEach(elementDep => {
                        if (elementDep.IdDepartamento === +this.contactoFrom.value.Departamento) {
                          this.contactoFrom.get('Departamento').setValue(elementDep);
                          this.dataPais.forEach((elementPais : any) => {
                            if (elementPais.IdPais === +this.contactoFrom.value.Pais) {
                              this.contactoFrom.get('Pais').setValue(elementPais);
                              this.dataTable.splice(this.indexItemContacto, 1);
                              this.pushTable(this.contactoFrom.value);
                              this.indexItemContacto = null;
                              this.EnableUpdateContacto = true;
                            }
                          });
                        }
                      });
                    }
                  });
                } else {
                  this.dataPais.forEach((elementPais : any) => {
                    if (elementPais.IdPais === +this.contactoFrom.value.Pais) {
                      this.contactoFrom.get('Pais').setValue(elementPais);
                      this.dataTable.splice(this.indexItemContacto, 1);
                      this.pushTable(this.contactoFrom.value);
                      this.indexItemContacto = null;
                      this.EnableUpdateContacto = true;
                    }
                  });
                }
              }
            } else {
              if (this.contactoFrom.value.TipoContacto.Id === 7 ||
                this.contactoFrom.value.TipoContacto.Id === 3 || this.contactoFrom.value.TipoContacto.Id === 6) {
                this.dataTable.splice(this.indexItemContacto, 1);
                this.pushTable(this.contactoFrom.value);
                this.indexItemContacto = null;
                this.EnableUpdateContacto = true;
              } else {
                this.dataBarrios.forEach(elementBarrio => {
                  if (elementBarrio.IdBarrio === +this.contactoFrom.value.Barrio) {
                    this.contactoFrom.get('Barrio').setValue(elementBarrio);
                    this.dataCiudades.forEach(elementCiu => {
                      if (elementCiu.IdCiudad === +this.contactoFrom.value.Ciudad) {
                        this.contactoFrom.get('Ciudad').setValue(elementCiu);
                        this.dataDepartamentos.forEach(elementDep => {
                          if (elementDep.IdDepartamento === +this.contactoFrom.value.Departamento) {
                            this.contactoFrom.get('Departamento').setValue(elementDep);
                            this.dataPais.forEach((elementPais : any) => {
                              if (elementPais.IdPais === +this.contactoFrom.value.Pais) {
                                this.contactoFrom.get('Pais').setValue(elementPais);
                                this.dataTable.splice(this.indexItemContacto, 1);
                                this.pushTable(this.contactoFrom.value);
                                this.indexItemContacto = null;
                                this.EnableUpdateContacto = true;
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
        }
      }
    } else {
      this.ValidarErrorForm(this.contactoFrom);
    }
  }

  pushTable(data : any) {
    this.dataTable.push(data);
    this.DescripcionDireccion = '';
    this.LimpiarFormulario();
  }

  EliminarContacto(index : number, data : any) {
    this.dataTable.splice(index, 1);

    // this.itemsContacto.splice(index, 1);
    // this.via = '';
    // this.letra = '';
    // this.numero = '';
    // this.numeroDos = '';
    // this.numeroTres = '';
    // this.numeroCuatro = '';
    // this.letraDos = '';
    // this.cardi = '';
    // this.imuebles = '';
    // this.ocultarDireccion = true;

    // if (data.Principal) {
    //   this.contactoForm.get('Principal').setValue(false);
    //   this.contactoForm.value.Principal = false;
    // }
    this.EnableUpdateContacto = true;
  }

  MapearContacto(data : any, index : number) {
    this.contactoFrom.reset();
    this.IdVia = '';
    this.IdLetra = '';
    this.IdLetraDos = '';
    this.IdCardinal = '';
    this.IdCardinalDos = '';
    this.Idinmueble = '';
    this.DescripcionDireccionIds = '';
    this.LimpiarDireccionId();
    this.LimpiarDireccion();
    this.indexItemContacto = index;
    let arrayDir: any[] = [];
    if (data.TipoContacto.Id === 8) { // Mapea Direccion
      if (data.IdJuridico !== null && data.IdJuridicoContacto !== null ) {
        this.contactoFrom.get('IdJuridico').setValue(data.IdJuridico);
        this.contactoFrom.get('IdJuridicoContacto').setValue(data.IdJuridicoContacto);
      }
      this.bloquearContPpal = null;
      this.ocultarDireccion = null;
      this.ocultarUbicacion = null;
      this.ocultarEmail = true;
      this.ocultarTelefonos = true;
      this.ocultarCelular = true;
      this.ocultarDireccionSeleccionada = null;
      this.AgregarValidacionesDireccion();
      this.EliminarValidacionesEmail();
      this.EliminarValidacionesTelefonos();
      this.ElimnarValidacionesCelular();
      this.contactoFrom.get('TipoContacto').setValue(data.TipoContacto);
      this.bloqDeparta = null;
      this.bloqCiudad = null;
      this.bloquearForm = null;
      if (data.Pais !== null && data.Pais !== undefined && data.Pais !== ''
        && data.Ciudad !== null && data.Ciudad !== undefined && data.Ciudad !== '') {
        this.AgregarValidacionesContacto();
        if (data.Barrio !== null && data.Barrio !== undefined && data.Barrio !== '') {
          this.bloqBarrio = null;
          this.recursosGeneralesService.GetBarrioList(+data.Ciudad.IdCiudad).subscribe(
            result => {
              if (result.length > 0) { // carga el barrio 
                this.dataBarrios = result;
                this.dataBarrios.forEach(elementBarrio => {
                  if (elementBarrio.IdBarrio === +data.Barrio.IdBarrio) {
                    this.contactoFrom.get('Barrio').setValue(elementBarrio.IdBarrio);
                    this.BarrioMapper = elementBarrio;
                    this.dataCiudades.forEach(elementCiu => {
                      if (elementCiu.IdCiudad === +data.Ciudad.IdCiudad) {
                        this.contactoFrom.get('Ciudad').setValue(elementCiu.IdCiudad);
                        this.CiudadMapper = elementCiu;
                        this.dataDepartamentos.forEach(elementDep => {
                          if (elementDep.IdDepartamento === +data.Departamento.IdDepartamento) {
                            this.contactoFrom.get('Departamento').setValue(elementDep.IdDepartamento);
                            this.DepartMapper = elementDep;
                            this.dataPais.forEach((elementPais : any) => {
                              if (elementPais.IdPais === +data.Pais.IdPais) {
                                this.contactoFrom.get('Pais').setValue(elementPais.IdPais);
                                this.PaisMapper = elementPais;
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              } else { // carga la ciudad que tiene barrio y desbloquea el campo barrio
                this.bloqBarrio = null;
                this.dataCiudades.forEach(elementCiu => {
                  if (elementCiu.IdCiudad === +data.Ciudad.IdCiudad) {
                    this.contactoFrom.get('Ciudad').setValue(elementCiu.IdCiudad);
                    this.CiudadMapper = elementCiu;
                    this.dataDepartamentos.forEach(elementDep => {
                      if (elementDep.IdDepartamento === +data.Departamento.IdDepartamento) {
                        this.contactoFrom.get('Departamento').setValue(elementDep.IdDepartamento);
                        this.DepartMapper = elementDep;
                        this.dataPais.forEach((elementPais : any) => {
                          if (elementPais.IdPais === +data.Pais.IdPais) {
                            this.contactoFrom.get('Pais').setValue(elementPais.IdPais);
                            this.PaisMapper = elementPais;
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
        } else {
          this.recursosGeneralesService.GetBarrioList(+data.Ciudad.IdCiudad).subscribe(
            result => {
              if (result.length > 0) { // carga el barrio
                this.bloqBarrio = null;
              } else {
                this.bloqBarrio = true;
              }
            });
          this.dataCiudades.forEach(elementCiu => {
            if (elementCiu.IdCiudad === +data.Ciudad.IdCiudad) {
              this.contactoFrom.get('Ciudad').setValue(elementCiu.IdCiudad);
              this.CiudadMapper = elementCiu;
              this.dataDepartamentos.forEach(elementDep => {
                if (elementDep.IdDepartamento === +data.Departamento.IdDepartamento) {
                  this.contactoFrom.get('Departamento').setValue(elementDep.IdDepartamento);
                  this.DepartMapper = elementDep;
                  this.dataPais.forEach((elementPais : any) => {
                    if (elementPais.IdPais === +data.Pais.IdPais) {
                      this.contactoFrom.get('Pais').setValue(elementPais.IdPais);
                      this.PaisMapper = elementPais;
                    }
                  });
                }
              });
            }
          });
        }
      } else {
        this.EliminarValidacionesContacto();
        this.dataPais.forEach((elementPais : any) => {
          if (elementPais.IdPais === +data.Pais.IdPais) {
            this.contactoFrom.get('Pais').setValue(elementPais.IdPais);
            this.PaisMapper = elementPais;
          }
        });
      }
      this.contactoFrom.get('contactoPpal').setValue(data.contactoPpal);
      this.DireccionSeleccionada = data.DescripcionAdress;

      if (data.DescripcionAdressIds !== null) {
        arrayDir = data.DescripcionAdressIds.split('|');
      }


      arrayDir.forEach((x, y) => {
        if (y === 0) {
          if (x !== '' && x !== null && x !== undefined) {
            this.dataVias.forEach((elementVia : any) => {
              if (+x === elementVia.Id) {
                this.contactoFrom.get('Vias').setValue(elementVia);
                this.Via = elementVia.Abreviatura;
                this.IdVia = elementVia.Id;
              }
            });
          }
        } else if (y === 2) {
          if (x !== '' && x !== null && x !== undefined) {
            this.dataLetras.forEach((elementLetra : any) => {
              if (+x === elementLetra.Id) {
                this.contactoFrom.get('Letra').setValue(elementLetra);
                this.Letra = elementLetra.Descripcion;
                this.IdLetra = elementLetra.Id;
              }
            });
          }
        } else if (y === 3) {
          if (x !== '' && x !== null && x !== undefined) {
            this.dataCardinal.forEach((elementCardinal : any) => {
              if (+x === elementCardinal.Id) {
                this.contactoFrom.get('CardiDos').setValue(elementCardinal);
                this.CardinalDos = elementCardinal.Descripcion;
                this.IdCardinalDos = elementCardinal.Id;
              }
            });
          }
        } else if (y === 5) {
          if (x !== '' && x !== null && x !== undefined) {
            this.dataLetras.forEach((elementLetrados : any) => {
              if (+x === elementLetrados.Id) {
                this.contactoFrom.get('LetraDos').setValue(elementLetrados);
                this.LetraDos = elementLetrados.Descripcion;
                this.IdLetraDos = elementLetrados.Id;
              }
            });
          }
        } else if (y === 6) {
          if (x !== '' && x !== null && x !== undefined) {
            this.dataCardinal.forEach((elementCardinal : any) => {
              if (+x === elementCardinal.Id) {
                this.contactoFrom.get('Cardi').setValue(elementCardinal);
                this.Cardinal = elementCardinal.Descripcion;
                this.IdCardinal = elementCardinal.Id;
              }
            });
          }
        } else if (y === 8) {
          if (x !== '' && x !== null && x !== undefined) {
            this.dataImuebles.forEach((elementInmueble : any) => {
              if (+x === elementInmueble.Id) {
                this.contactoFrom.get('Imuebles').setValue(elementInmueble);
                this.inmueble = elementInmueble.Descripcion;
                this.Idinmueble = elementInmueble.Id;
              }
            });
          }
        }  else if (y === 1) {
          this.contactoFrom.get('NumeroUno').setValue(x);
          this.Numero = x;
        } else if (y === 4) {
          this.contactoFrom.get('NumeroDos').setValue(x);
          this.NumeroDos = x;
        } else if (y === 7) {
          this.contactoFrom.get('NumeroTres').setValue(x);
          this.NumeroTres = x;
        } else if (y === 9) {
          this.contactoFrom.get('NumeroCuatro').setValue(x);
          this.NumeroCuatro = x;
        } else if (y === 10) {
          this.contactoFrom.get('Observacion').setValue(x);
          this.Observacion = x;
        }
        this.DescripcionDireccion = this.Via + ' ' + this.Numero + ' ' + this.Letra + ' ' +
          this.CardinalDos + ' ' + this.NumeroDos + ' ' + this.LetraDos + ' ' + this.Cardinal + ' ' +
          this.NumeroTres + ' ' + this.inmueble + ' ' + this.NumeroCuatro + ' ' + this.Observacion;

        this.DescripcionDireccionIds = this.IdVia + '|' + this.Numero + '|' + this.IdLetra + '|' +
          this.IdCardinalDos + '|' + this.NumeroDos + '|' + this.IdLetraDos + '|' + this.IdCardinal + '|' + 
          this.NumeroTres + '|' + this.Idinmueble + '|' + this.NumeroCuatro + '|' + this.Observacion;
      });



    } else if (data.TipoContacto.Id === 3) { // Mapea email
      this.bloquearContPpal = null;
      this.ocultarUbicacion = true;
      this.ocultarDireccion = true;
      this.ocultarEmail = null;
      this.ocultarTelefonos = true;
      this.ocultarCelular = true;
      this.AgregarValidacionesEmail();
      this.EliminarValidacionesDireccion();
      this.EliminarValidacionesTelefonos();
      this.ElimnarValidacionesCelular();
      this.contactoFrom.get('TipoContacto').setValue(data.TipoContacto);
      this.contactoFrom.get('Email').setValue(data.Email);
      this.contactoFrom.get('contactoPpal').setValue(data.contactoPpal);

    } else if (data.TipoContacto.Id === 7) { // Mapea Telefono
      this.bloquearContPpal = true;
      this.ocultarUbicacion = true;
      this.ocultarDireccion = true;
      this.ocultarEmail = true;
      this.ocultarTelefonos = null;
      this.ocultarCelular = true;
      this.AgregarValidacionesTelefonos();
      this.EliminarValidacionesDireccion();
      this.EliminarValidacionesEmail();
      this.ElimnarValidacionesCelular();
      this.contactoFrom.get('TipoContacto').setValue(data.TipoContacto);
      this.contactoFrom.get('Telefonos').setValue(data.Telefonos);
      this.contactoFrom.get('contactoPpal').setValue(false);

    } else if (data.TipoContacto.Id === 6) { // Mapea Celular
      this.bloquearContPpal = null;
      this.ocultarUbicacion = true;
      this.ocultarDireccion = true;
      this.ocultarEmail = true;
      this.ocultarTelefonos = true;
      this.ocultarCelular = null;
      this.AgregarValidacionesCelular();
      this.EliminarValidacionesDireccion();
      this.EliminarValidacionesEmail();
      this.EliminarValidacionesTelefonos();
      this.contactoFrom.get('TipoContacto').setValue(data.TipoContacto);
      this.contactoFrom.get('Celular').setValue(data.Celular);
      this.contactoFrom.get('contactoPpal').setValue(data.contactoPpal);
    }
    this.IrArriba();
  }

  GuardarContactos() {
    let ppalDir = false;
    let ppalcel = false;
    let tieneDir = null;
    let tieneOtro = null;
    let tieneCelTel = null;
    this.contactoModelList = [];
    if (this.dataTable.length <= 0) {
      this.notif.onWarning('Advertencia', 'No hay registros relacionados para continuar.');
    } else {
      this.dataTable.forEach(element => {
        if (element.TipoContacto.Id === 8) {
          tieneDir = 1;
        }
  
        if (element.TipoContacto.Id === 6 && (this.tipoCliente !== 15)) {
          tieneOtro = 1;
        }
        if (element.TipoContacto.Id === 6 || element.TipoContacto.Id === 7 && (this.tipoCliente === 15)) {
          tieneCelTel = 1;
        } else if (element.TipoContacto.Id === 6 || element.TipoContacto.Id === 7 && (this.tipoCliente === 5)) {
          tieneCelTel = 1;
        }
      });
      this.dataTable.forEach(elementCont => {
        if (elementCont.contactoPpal === true && elementCont.TipoContacto.Id === 8) {
            ppalDir = true;
        }
        if (elementCont.contactoPpal === true && elementCont.TipoContacto.Id === 6 && (this.tipoCliente !== 15)) { 
            ppalcel = true;
        }
      });
      if (!ppalDir){ // Direccion
        this.notif.onWarning('Advertencia', 'Debe tener un contacto principal para dirección.');
      } else if (!ppalcel && (this.tipoCliente !== 15)) {  // Celular
        this.notif.onWarning('Advertencia', 'Debe ingresar un número de celular principal.');
      } else if (tieneCelTel === null && (this.tipoCliente === 15)) {
        this.notif.onWarning('Advertencia', 'Debe ingresar un número de celular pincipal o un numero de telfono.');
      } else {
        if (this.dataTable.length >= 2 && tieneDir != null && tieneOtro != null && this.tipoCliente !== 15) {
          this.siguiente = true;
          this.emitEvent.emit(this.positionTab);

          this.dataTable.forEach(elementContacto => {
            this.contactoModel = new ContactoModel();
            this.contactoModel.IdTipoContacto = elementContacto.TipoContacto.Id;
            console.log(elementContacto.TipoContacto.Id);
            if (elementContacto.TipoContacto.Id === 8) {
              this.contactoModel.Descripcion = elementContacto.DescripcionAdress;
              this.contactoModel.DescripcionIds = elementContacto.DescripcionAdressIds;
              if (elementContacto.Ciudad == null || elementContacto.Ciudad == undefined || elementContacto.Ciudad === 0 ) {
                this.contactoModel.IdPais = elementContacto.Pais.IdPais;
              } else {
                this.contactoModel.IdCiudad = elementContacto.Ciudad.IdCiudad;
              }
              if (elementContacto.Barrio !== null && elementContacto.Barrio !== undefined) {
                this.contactoModel.IdBarrio = elementContacto.Barrio.IdBarrio;
              } else {
                this.contactoModel.IdBarrio = 0;
              }
            } else if (elementContacto.TipoContacto.Id === 3) {
              this.contactoModel.Descripcion = elementContacto.Email;
              this.contactoModel.IdCiudad = elementContacto.Ciudad;
              this.contactoModel.IdBarrio = 0;
            } else if (elementContacto.TipoContacto.Id === 7) {
              this.contactoModel.Descripcion = elementContacto.Telefonos;
              this.contactoModel.IdCiudad = elementContacto.Ciudad;
              this.contactoModel.IdBarrio = 0;
            } else {
              this.contactoModel.Descripcion = elementContacto.Celular;
              this.contactoModel.IdCiudad = elementContacto.Ciudad;
              this.contactoModel.IdBarrio = 0;
            }
            this.contactoModel.ContactoPrincipal = elementContacto.contactoPpal;

            this.contactoModelList.push(this.contactoModel);
          });

          this.infoTabAllContacto.ContactoDto = this.contactoModelList;

          console.log(this.infoTabAllContacto);
          this.IrArriba();
        } else if (this.dataTable.length >= 1 && tieneDir != null && this.tipoCliente === 15) {
          this.siguiente = true;
          this.emitEvent.emit(this.positionTab);

          this.dataTable.forEach(elementContacto => {
            this.contactoModel = new ContactoModel();
            console.log('IdContacto' + elementContacto.TipoContacto.Id);
            this.contactoModel.IdTipoContacto = elementContacto.TipoContacto.Id;

            if (elementContacto.TipoContacto.Id === 8) {
              this.contactoModel.Descripcion = elementContacto.DescripcionAdress;
              this.contactoModel.DescripcionIds = elementContacto.DescripcionAdressIds;
              if (elementContacto.Ciudad == null || elementContacto.Ciudad == undefined || elementContacto.Ciudad === 0) {
                this.contactoModel.IdPais = elementContacto.Pais.IdPais;
              } else {
                this.contactoModel.IdCiudad = elementContacto.Ciudad.IdCiudad;
              }
              if (elementContacto.Barrio !== null && elementContacto.Barrio !== undefined) {
                this.contactoModel.IdBarrio = elementContacto.Barrio.IdBarrio;
              } else {
                this.contactoModel.IdBarrio = 0;
              }
            } else if (elementContacto.TipoContacto.Id === 3) {
              this.contactoModel.Descripcion = elementContacto.Email;
              this.contactoModel.IdCiudad = elementContacto.Ciudad;
              this.contactoModel.IdBarrio = 0;
            } else if (elementContacto.TipoContacto.Id === 7) {
              this.contactoModel.Descripcion = elementContacto.Telefonos;
              this.contactoModel.IdCiudad = elementContacto.Ciudad;
              this.contactoModel.IdBarrio = 0;
            } else {
              this.contactoModel.Descripcion = elementContacto.Celular;
              this.contactoModel.IdCiudad = elementContacto.Ciudad;
              this.contactoModel.IdBarrio = 0;
            }
            this.contactoModel.ContactoPrincipal = elementContacto.contactoPpal;

            this.contactoModelList.push(this.contactoModel);
          });

          this.infoTabAllContacto.ContactoDto = this.contactoModelList;

          console.log(this.infoTabAllContacto);
          this.IrArriba();
        } else {
          this.notif.onWarning('Advertencia', 'Debe tener un registro para dirección y otro para celular.');
        }
      }

    }
  }

  Actualizarcontactos() {
    let tieneDir = null;
    let tieneOtro = null;
    this.contactoModelList = [];
    if (this.dataTable.length <= 0) {
      this.notif.onWarning('Advertencia', 'No hay registros relacionados para actualizar.');
    } else {
      this.dataTable.forEach(element => {
        if (element.TipoContacto.Id === 8) {
          if (element.contactoPpal) {
            tieneDir = 1;
          }
        }
        // element.TipoContacto.Id === 3 || element.TipoContacto.Id === 4 || element.TipoContacto.Id === 5||
        if (element.TipoContacto.Id === 6) {
          if (element.contactoPpal) {
            tieneOtro = 1;
          }
        }
      });
      if (this.dataTable.length >= 2 && tieneDir != null && tieneOtro != null) {
        this.dataTable.forEach(elementContacto => {
          this.contactoModel = new ContactoModel();
          this.contactoModel.IdTipoContacto = elementContacto.TipoContacto.Id;

          if (elementContacto.TipoContacto.Id === 8) {
            this.contactoModel.Descripcion = elementContacto.DescripcionAdress;
            if (elementContacto.Ciudad !== null && elementContacto.Ciudad !== undefined && elementContacto.Ciudad !== 0) {
              this.contactoModel.IdCiudad = elementContacto.Ciudad.IdCiudad;
            } else {
              this.contactoModel.IdPais = elementContacto.Pais.IdPais;
            }
            if (elementContacto.Barrio !== null && elementContacto.Barrio !== undefined) {
              this.contactoModel.IdBarrio = elementContacto.Barrio.IdBarrio;
            } else {
              this.contactoModel.IdBarrio = 0;
            }
            this.contactoModel.DescripcionIds = elementContacto.DescripcionAdressIds;
          } else if (elementContacto.TipoContacto.Id === 3) {
            this.contactoModel.Descripcion = elementContacto.Email;
            this.contactoModel.IdCiudad = elementContacto.Ciudad;
            this.contactoModel.IdBarrio = 0;
          } else if (elementContacto.TipoContacto.Id === 7) {
            this.contactoModel.Descripcion = elementContacto.Telefonos;
            this.contactoModel.IdCiudad = elementContacto.Ciudad;
             this.contactoModel.IdBarrio = 0;
          } else {
            this.contactoModel.Descripcion = elementContacto.Celular;
            this.contactoModel.IdCiudad = elementContacto.Ciudad;
            this.contactoModel.IdBarrio = 0;
          }

          // this.contactoModel.IdBarrio = 0;
          this.contactoModel.ContactoPrincipal = elementContacto.contactoPpal;
          this.contactoModel.IdJuridicoContacto = elementContacto.IdJuridicoContacto;
          this.contactoModel.IdTercero = this.JuridicoEdit;

          this.contactoModelList.push(this.contactoModel);
        });

        this.infoTabAll.ContactoDto = this.contactoModelList;
        this.GuardarLog(this.infoTabAll.ContactoDto, this.OperacionActual, 0, this.JuridicoEdit,12);
        this.juridicoService.EditContactoJuridico(this.infoTabAll.ContactoDto).subscribe(
          result => {
            if (result) {
              this.notif.onSuccess('Exitoso', 'El registro se actualizó correctamente.');
              this.emitEventContacto.emit({ tercero: this.JuridicoEdit });
              this.EnableUpdateContacto = false;
            }
          },
          error => {
            console.error('Error al realizar la actualizacion - juridicos: ' + error);
            this.notif.onDanger('Error', 'No se pudo realizar la actualizacion - Error: ' + error);
          });
      } else {
        if (tieneDir === null || tieneDir === undefined) {
          this.notif.onWarning('Advertencia', 'Debe tener un contacto principal para dirección.');
          this.EnableUpdateContacto = false;
        }
        if (tieneOtro === null || tieneOtro === undefined) {
          this.notif.onWarning('Advertencia', 'Debe ingresar un número de celular principal.');
          this.EnableUpdateContacto = false;
        }
      }
    }
  }

  validarTipoContacto(form : any) {
    console.log(form.TipoContacto.Id);
    this.indexItemContacto = null;
    if (form.TipoContacto.Id === 8) { // direccion 
      console.log(form.TipoContacto.Id);
      this.bloquearContPpal = null;
      this.ocultarDireccion = null;
      this.ocultarUbicacion = null;
      this.ocultarEmail = true;
      this.ocultarTelefonos = true;
      this.ocultarCelular = true;
      this.AgregarValidacionesDireccion();
      this.EliminarValidacionesEmail();
      this.EliminarValidacionesTelefonos();
      this.ElimnarValidacionesCelular();
      this.LimpiarCamposForm();
      this.PrecargarPais.emit(true);
    } else if (form.TipoContacto.Id === 3) { // Email
      this.bloquearContPpal = null;
      this.ocultarUbicacion = true;
      this.ocultarDireccion = true;
      this.ocultarEmail = null;
      this.ocultarTelefonos = true;
      this.ocultarCelular = true;
      this.AgregarValidacionesEmail();
      this.EliminarValidacionesDireccion();
      this.EliminarValidacionesTelefonos();
      this.ElimnarValidacionesCelular();
      this.LimpiarCamposForm();
    } else if (form.TipoContacto.Id === 7) { // Telefono 
      this.bloquearContPpal = true;
      this.ocultarUbicacion = true;
      this.ocultarDireccion = true;
      this.ocultarEmail = true;
      this.ocultarTelefonos = null;
      this.ocultarCelular = true;
      this.AgregarValidacionesTelefonos();
      this.EliminarValidacionesDireccion();
      this.EliminarValidacionesEmail();
      this.ElimnarValidacionesCelular();
      this.LimpiarCamposForm();
    } else if (form.TipoContacto.Id === 6) { // Celular
      this.bloquearContPpal = null;
      this.ocultarUbicacion = true;
      this.ocultarDireccion = true;
      this.ocultarEmail = true;
      this.ocultarTelefonos = true;
      this.ocultarCelular = null;
      this.AgregarValidacionesCelular();
      this.EliminarValidacionesDireccion();
      this.EliminarValidacionesEmail();
      this.EliminarValidacionesTelefonos();
      this.LimpiarCamposForm();
    } else {
      this.ocultarDireccion = true;
      this.ocultarEmail = true;
      this.ocultarTelefonos = true;
      this.ocultarCelular = true;
      this.ocultarUbicacion = null;
      this.LimpiarCamposForm();
    }
  }

  validarCiudadList(form : any) {
    if (this.contactoFrom.get('Ciudad').value === '' || this.contactoFrom.get('Ciudad').value === null
      || this.contactoFrom.get('Ciudad').value === undefined) {
      this.contactoFrom.get('Ciudad').reset();
      this.bloqBarrio = true;
    } else {
      if (form.Ciudad === null || form.Ciudad === undefined || form.Ciudad === '') {
        this.contactoFrom.get('Ciudad').reset();
        this.bloqBarrio = true;
      } 
    }
  }

  validarBarrioList(form : any) {
    if (this.contactoFrom.get('Barrio').value === '' || this.contactoFrom.get('Barrio').value === null
      || this.contactoFrom.get('Barrio').value === undefined) {
      this.contactoFrom.get('Barrio').reset();
    } else {
      if (form.Barrio === null || form.Barrio === undefined || form.Barrio === '') {
        this.contactoFrom.get('Barrio').reset();
      }
    }
  }

  desbloquearDepart() {
    // if (this.contactoFrom.get('Pais').value === '' || this.contactoFrom.get('Pais').value === null
    //   || this.contactoFrom.get('Pais').value === undefined) {
    //   this.contactoFrom.get('Departamento').reset();
    //   this.contactoFrom.get('Ciudad').reset();
    //   this.contactoFrom.get('Barrio').reset();
    // }
    this.bloqDeparta = null;
  }

  desbloquearCiudad() {
    // if (this.contactoFrom.get('Departamento').value === '' || this.contactoFrom.get('Departamento').value === null
    //   || this.contactoFrom.get('Departamento').value === undefined) {
    //   this.contactoFrom.get('Ciudad').reset();
    //   this.contactoFrom.get('Barrio').reset();    
    //   this.bloqCiudad = true;
    // } else {
     
    // }
    this.bloqCiudad = null;
  }

  desbloquearBarrio() {
    // if (this.contactoFrom.get('Ciudad').value === '' || this.contactoFrom.get('Ciudad').value === null
    //   || this.contactoFrom.get('Ciudad').value === undefined) {
    //   this.contactoFrom.get('Barrio').reset();
    //   this.bloqBarrio = true;
    // } else {
     
    // }
     this.bloqBarrio = null;
  }

  ConcatenarDireccion(campo : string, formCampo : any) {
    if (campo === 'via') {
      if (formCampo.Descripcion === 'Vereda') {
        this.descripcionNumero = false;
        this.bloquearCampoDir = true;
      } else {
        this.descripcionNumero = true;
        this.bloquearCampoDir = null;
      }
      this.Via = formCampo.Abreviatura;
      this.IdVia = formCampo.Id;
    } else if (campo === 'num') {
      if (formCampo.Descripcion !== undefined && formCampo.Descripcion !== null) {
        if (formCampo.Descripcion !== 'Vereda') {
          this.Numero = this.funcionConvert(formCampo);
        } else {
          this.Numero = formCampo;
        }
      } else {
        this.Numero = formCampo;
      }
    } else if (campo === 'letra') {
      if (formCampo.Descripcion !== undefined && formCampo.Descripcion !== null) {
        this.Letra = formCampo.Descripcion;
      } else {
        this.Letra = '';
      }
       this.IdLetra = formCampo.Id;
    } else if (campo === 'numDos') { //
      if (formCampo !== null && formCampo !== undefined) {
        this.NumeroDos = this.funcionConvert(formCampo);
      } else {
        this.NumeroDos = '';
      }
    
    } else if (campo === 'letraDos') {
      if (formCampo.Descripcion !== undefined && formCampo.Descripcion !== null) {
        this.LetraDos = formCampo.Descripcion;
      } else {
        this.LetraDos = '';
      }
      
      this.IdLetraDos = formCampo.Id;

    } else if (campo === 'card') {
      if (formCampo.Descripcion !== undefined && formCampo.Descripcion !== null) {
        this.Cardinal = formCampo.Descripcion;
      } else {
        this.Cardinal = '';
      }

      this.IdCardinal = formCampo.Id;

    } else if (campo === 'cardDos') {
      if (formCampo.Descripcion !== undefined && formCampo.Descripcion !== null) {
        this.CardinalDos = formCampo.Descripcion;
      } else {
        this.CardinalDos = '';
      }

      this.IdCardinalDos = formCampo.Id;

    } else if (campo === 'numTres') { //
      if (formCampo !== null && formCampo !== undefined) {
        this.NumeroTres = this.funcionConvert(formCampo);
      } else {
        this.NumeroTres = '';
      }
    } else if (campo === 'inmu') {
      if (formCampo.Descripcion !== undefined && formCampo.Descripcion !== null) {
        this.inmueble = formCampo.Descripcion;
      } else {
        this.inmueble = '';
      }

      this.Idinmueble = formCampo.Id;

    } else if (campo === 'numCuatro') {
      if (formCampo !== null && formCampo !== undefined) {
        this.NumeroCuatro = this.funcionConvert(formCampo);
      } else {
        this.NumeroCuatro = '';
      }
    } else if (campo === 'observa') {
      if (formCampo !== null && formCampo !== undefined) {
        this.Observacion = formCampo.substr(0, 1).toUpperCase() + formCampo.substr(1).toLowerCase();
      } else {
        this.Observacion = '';
      }
    }
    this.DescripcionDireccion = this.Via + ' ' + this.Numero + ' ' + this.Letra + ' ' +
      this.CardinalDos + ' ' + this.NumeroDos + ' ' + this.LetraDos + ' ' + this.Cardinal + ' ' +   
      this.NumeroTres + ' ' + this.inmueble + ' ' + this.NumeroCuatro + ' ' + this.Observacion;

    this.DescripcionDireccionIds = this.IdVia + '|' + this.Numero + '|' + this.IdLetra + '|' +
      this.IdCardinalDos + '|' + this.NumeroDos + '|' + this.IdLetraDos + '|' + this.IdCardinal + '|' + 
      this.NumeroTres + '|' + this.Idinmueble + '|' + this.NumeroCuatro + '|' + this.Observacion;
  }

  funcionConvert(campo : string): string {
    const patt = new RegExp('/^[ 0-9áéíóúüñ]*$/');
    const pattReplace = new RegExp('[^ 0-9áéíóúüñ]+');
    if (!patt.test(campo)) {
      campo = campo.replace(pattReplace, '');
      return campo;
    }
    return "";
  }

  LimpiarDireccion() {
    this.Via = '';
    this.Numero = '';
    this.Letra = '';
    this.NumeroDos = '';
    this.LetraDos = '';
    this.Cardinal = '';
    this.CardinalDos = '';
    this.NumeroTres = '';
    this.inmueble = '';
    this.NumeroCuatro = '';
    this.Observacion = '';
    this.contactoFrom.get('Letra').reset();
    this.contactoFrom.get('CardiDos').reset();
    this.contactoFrom.get('LetraDos').reset();
    this.contactoFrom.get('Cardi').reset();
    this.contactoFrom.get('Imuebles').reset();
  }

  LimpiarDireccionId() {
    this.IdVia = '';
    this.IdLetra = '';
    this.IdLetraDos = '';
    this.IdCardinal = '';
    this.IdCardinalDos = '';
    this.Idinmueble = '';
    this.DescripcionDireccionIds = '';
  }

  LimpiarFormulario() {
    this.contactoFrom.reset();
    this.Via = '';
    this.Numero = '';
    this.Letra = '';
    this.NumeroDos = '';
    this.LetraDos = '';
    this.CardinalDos = '';
    this.Cardinal = '';
    this.NumeroTres = '';
    this.inmueble = '';
    this.NumeroCuatro = '';
    this.Observacion = '';
    this.IdVia = '';
    this.IdLetra = '';
    this.IdLetraDos = '';
    this.IdCardinal = '';
    this.IdCardinalDos = '';
    this.Idinmueble = '';
    this.EliminarValidacionesDireccion();
    this.EliminarValidacionesEmail();
    this.EliminarValidacionesTelefonos();
    this.ElimnarValidacionesCelular();
    this.DireccionSeleccionada = '';
    this.bloqBarrio = true;
    this.bloqCiudad = true;
    this.bloqDeparta = true;
  }

  LimpiarCamposForm() {
    this.contactoFrom.get('Email').reset();
    this.contactoFrom.get('Telefonos').reset();
    this.contactoFrom.get('Celular').reset();
    this.contactoFrom.get('CardiDos').reset();
    this.contactoFrom.get('Departamento').reset();
    this.contactoFrom.get('Ciudad').reset();
    this.contactoFrom.get('contactoPpal').reset();
    this.contactoFrom.get('Vias').reset();
    this.contactoFrom.get('NumeroUno').reset();
    this.contactoFrom.get('Letra').reset();
    this.contactoFrom.get('NumeroDos').reset();
    this.contactoFrom.get('LetraDos').reset();
    this.contactoFrom.get('Cardi').reset();
    this.contactoFrom.get('NumeroTres').reset();
    this.contactoFrom.get('Imuebles').reset();
    this.contactoFrom.get('NumeroCuatro').reset();
    this.contactoFrom.get('Observacion').reset();
    this.Via = '';
    this.Numero = '';
    this.Letra = '';
    this.NumeroDos = '';
    this.LetraDos = '';
    this.Cardinal = '';
    this.CardinalDos = '';
    this.NumeroTres = '';
    this.inmueble = '';
    this.NumeroCuatro = '';
    this.Observacion = '';
    this.IdVia = '';
    this.IdLetra = '';
    this.IdLetraDos = '';
    this.IdCardinal = '';
    this.IdCardinalDos = '';
    this.Idinmueble = '';
  }

  // consultarCorrespondenciaPpal(tercero) {
  //   this.clientesService.ObtenerContactosPrincpales(tercero).subscribe(
  //     result => {
  //       this.dataCorrespondencia = result;
  //     },
  //     error => {
  //       console.error('Error consultar deudor - ' + error);
  //     });
  // }
  //#endregion

  //#region Metodos de validacion
  AgregarValidacionesDireccion() {
    // this.contactoFrom.controls['Pais'].setValidators([Validators.required]);
    // this.contactoFrom.controls['Pais'].setErrors({ 'incorrect': true });

    this.contactoFrom.controls['Departamento'].setValidators([Validators.required]);
    this.contactoFrom.controls['Departamento'].setErrors({ 'incorrect': true });

    this.contactoFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.contactoFrom.controls['Ciudad'].setErrors({ 'incorrect': true });

    this.contactoFrom.controls['Vias'].setValidators([Validators.required]);
    this.contactoFrom.controls['Vias'].setErrors({ 'incorrect': true });

    this.contactoFrom.controls['NumeroUno'].setValidators([Validators.required]);
    this.contactoFrom.controls['NumeroUno'].setErrors({ 'incorrect': true });
  }
  AgregarValidacionesEmail() {
    this.contactoFrom.controls['Email'].setValidators([Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]);
    this.contactoFrom.controls['Email'].setErrors({ 'incorrect': true });
  }
  AgregarValidacionesTelefonos() {
    this.contactoFrom.controls['Telefonos'].setValidators([Validators.required,
    Validators.minLength(7), Validators.pattern('^[0-9]+')]);
    this.contactoFrom.controls['Telefonos'].setErrors({ 'incorrect': true });
  }
  AgregarValidacionesCelular() {
    this.contactoFrom.controls['Celular'].setValidators([Validators.required,
    Validators.minLength(10), Validators.pattern('^[0-9]+')]);
    this.contactoFrom.controls['Celular'].setErrors({ 'incorrect': true });
  }

  EliminarValidacionesDireccion() {
    this.contactoFrom.controls['Pais'].setErrors(null);
    this.contactoFrom.controls['Pais'].clearValidators();
    this.contactoFrom.controls['Pais'].setValidators(null);

    this.contactoFrom.controls['Departamento'].setErrors(null);
    this.contactoFrom.controls['Departamento'].clearValidators();
    this.contactoFrom.controls['Departamento'].setValidators(null);

    this.contactoFrom.controls['Ciudad'].setErrors(null);
    this.contactoFrom.controls['Ciudad'].clearValidators();
    this.contactoFrom.controls['Ciudad'].setValidators(null);

    this.contactoFrom.controls['Vias'].setErrors(null);
    this.contactoFrom.controls['Vias'].clearValidators();
    this.contactoFrom.controls['Vias'].setValidators(null);

    this.contactoFrom.controls['NumeroUno'].setErrors(null);
    this.contactoFrom.controls['NumeroUno'].clearValidators();
    this.contactoFrom.controls['NumeroUno'].setValidators(null);
  }
  EliminarValidacionesEmail() {
    this.contactoFrom.controls['Email'].setErrors(null);
    this.contactoFrom.controls['Email'].clearValidators();
    this.contactoFrom.controls['Email'].setValidators(null);
  }
  EliminarValidacionesTelefonos() {
    this.contactoFrom.controls['Telefonos'].setErrors(null);
    this.contactoFrom.controls['Telefonos'].clearValidators();
    this.contactoFrom.controls['Telefonos'].setValidators(null);
  }
  ElimnarValidacionesCelular() {
    this.contactoFrom.controls['Celular'].setErrors(null);
    this.contactoFrom.controls['Celular'].clearValidators();
    this.contactoFrom.controls['Celular'].setValidators(null);
  }
value : any;
  validarNumeros() {
    const patt = new RegExp('/^[ 0-9áéíóúüñ]*$/');
    const pattReplace = new RegExp('[^ 0-9áéíóúüñ]+');
    let self = this;
    $('#NumeroUno').on('input', function (e : any) {
      if (!patt.test(self.value)) {
        self.value = self.value.replace(pattReplace, '');
        self.Numero = self.value;
      }
    });
  }
  validarNumeroDos() {
    const patt = new RegExp('/^[ 0-9áéíóúüñ]*$/');
    const pattReplace = new RegExp('[^ 0-9áéíóúüñ]+');
    let self = this;
    $('#NumeroDos').on('input', function (e : any) {
      if (!patt.test(self.value)) {
        self.value = self.value.replace(pattReplace, '');
      }
    });
  }
  validarNumeroTres() {
    const patt = new RegExp('/^[ 0-9áéíóúüñ]*$/');
    const pattReplace = new RegExp('[^ 0-9áéíóúüñ]+');
    let self = this;
    $('#NumeroTres').on('input', function (e : any) {
      if (!patt.test(self.value)) {
        self.value = self.value.replace(pattReplace, '');
      }
    });
  }
  validarNumeroCuatro() {
    const patt = new RegExp('/^[ 0-9áéíóúüñ]*$/');
    const pattReplace = new RegExp('[^ 0-9áéíóúüñ]+');
    let self = this;
    $('#NumeroCuatro').on('input', function (e : any) {
      if (!patt.test(self.value)) {
        self.value = self.value.replace(pattReplace, '');
      }
    });
  }
  validarDescrip() {
    let self = this;
    $('#DescripcionVereda').on('input', function (e : any) {
      if (!/^[ a-z0-9áéíóúüñ]*$/i.test(self.value)) {
        self.value = self.value.replace(/[^ a-z0-9áéíóúüñ]+/ig, '');
      }
    });
  }

//#endregion

  //#region Metodos Inicializacion y generales
  LimpiarCamposDireccion() {
    this.contactoFrom.get('Vias').reset();
    this.contactoFrom.get('NumeroUno').reset();
    this.contactoFrom.get('Letra').reset();
    this.contactoFrom.get('NumeroDos').reset();
    this.contactoFrom.get('LetraDos').reset();
    this.contactoFrom.get('CardiDos').reset();
    this.contactoFrom.get('Cardi').reset();
    this.contactoFrom.get('NumeroTres').reset();
    this.contactoFrom.get('Imuebles').reset();
    this.contactoFrom.get('NumeroCuatro').reset();
    this.contactoFrom.get('Observacion').reset();
    this.Via = '';
    this.Numero = '';
    this.Letra = '';
    this.NumeroDos = '';
    this.LetraDos = '';
    this.Cardinal = '';
    this.NumeroTres = '';
    this.inmueble = '';
    this.NumeroCuatro = '';
    this.Observacion = '';
    this.IdVia = '';
    this.IdLetra = '';
    this.IdLetraDos = '';
    this.IdCardinal = '';
    this.Idinmueble = '';
  }

  validarContacto() {
    const IdJuridicoContacto = new FormControl('', []);
    const IdJuridico = new FormControl('', []);
    const TipoContacto = new FormControl('', [Validators.required]);
    const contactoPpal = new FormControl('', []);
    const Vias = new FormControl('', []);
    const NumeroUno = new FormControl('', []);
    const Letra = new FormControl('', []);
    const NumeroDos = new FormControl('', []);
    const LetraDos = new FormControl('', []);
    const Cardi = new FormControl('', []);
    const CardiDos = new FormControl('', []);
    const NumeroTres = new FormControl('', []);
    const Imuebles = new FormControl('', []);
    const NumeroCuatro = new FormControl('', []);
    const Observacion = new FormControl('', []);
    const Email = new FormControl('', []);
    const Telefonos = new FormControl('', [Validators.pattern('^[0-9]*'), Validators.maxLength(7), Validators.minLength(7)]);
    const Celular = new FormControl('', [Validators.pattern('^[0-9]*'), Validators.maxLength(10), Validators.minLength(10)]);

    const Pais = new FormControl('', []);
    const Departamento = new FormControl('', []);
    const Ciudad = new FormControl('', []);
    const Barrio = new FormControl('', []);

    const DescripcionVereda = new FormControl('', []);
    const DescripcionAdress = new FormControl('', []);

    const DescripcionAdressIds = new FormControl('', []);

    this.contactoFrom = new FormGroup({
      IdJuridicoContacto: IdJuridicoContacto,
      IdJuridico: IdJuridico,
      TipoContacto: TipoContacto,
      contactoPpal: contactoPpal,
      Vias: Vias,
      NumeroUno: NumeroUno,
      Letra: Letra,
      NumeroDos: NumeroDos,
      LetraDos: LetraDos,
      Cardi: Cardi,
      CardiDos: CardiDos,
      NumeroTres: NumeroTres,
      Imuebles: Imuebles,
      NumeroCuatro: NumeroCuatro,
      Observacion: Observacion,
      Pais: Pais,
      Departamento: Departamento,
      Ciudad: Ciudad,
      Barrio: Barrio,
      Email: Email,
      Telefonos: Telefonos,
      Celular: Celular,
      DescripcionVereda: DescripcionVereda,
      DescripcionAdress: DescripcionAdress,
      DescripcionAdressIds: DescripcionAdressIds
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

  OservacionCapitalice() {
    let self = this;
    $('#observacion').keyup(function () {
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

  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  AgregarValidacionesContacto() {
    this.contactoFrom.controls['Departamento'].setValidators([Validators.required]);
    this.contactoFrom.controls['Departamento'].setErrors({ 'incorrect': true });
    this.contactoFrom.get('Departamento').updateValueAndValidity();
    this.contactoFrom.controls['Ciudad'].setValidators([Validators.required]);
    this.contactoFrom.controls['Ciudad'].setErrors({ 'incorrect': true });
    this.contactoFrom.get('Ciudad').updateValueAndValidity();
    this.bloqDeparta = null;
    this.bloqCiudad = null;
  }

  EliminarValidacionesContacto() {
    this.contactoFrom.controls['Departamento'].setErrors(null);
    this.contactoFrom.controls['Departamento'].clearValidators();
    this.contactoFrom.controls['Departamento'].setValidators(null);

    this.contactoFrom.controls['Ciudad'].setErrors(null);
    this.contactoFrom.controls['Ciudad'].clearValidators();
    this.contactoFrom.controls['Ciudad'].setValidators(null);

    this.contactoFrom.get('Departamento').reset();
    this.contactoFrom.get('Ciudad').reset();
    this.bloqDeparta = true;
    this.bloqCiudad = true;
  }

  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filContacto_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filContacto_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
    }
  }
//#endregion

}
