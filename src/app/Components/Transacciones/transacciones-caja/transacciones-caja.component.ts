import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../Services/Alert/alert.service';
import { TransaccionesCajaService } from '../../../Services/Transacciones/TransaccionesCaja.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingService } from '../../../Services/shared/loading.service';
import { ValidadoraService } from '../../../Services/Transacciones/Validadora/Validadora.service';
import { DisponiblesService } from '../../../Services/Productos/disponible.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoginService } from '../../../Services/Login/login.service';
import { lastValueFrom } from 'rxjs';
import { ShareComponentModule } from '../../../Modules/share-component.module';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';

const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: 'app-transacciones-caja',
  templateUrl: './transacciones-caja.component.html',
  styleUrls: ['./transacciones-caja.component.css'],
  standalone: false,
  providers: [DisponiblesService, LoginService, ShareComponentModule, ModuleValidationService]
})
export class TransaccionesCajaComponent implements OnInit {

  public Modulo = 87;

  @ViewChild('ModalCondiciones', { static: true }) private ModalCondiciones!: ElementRef;
  @ViewChild('ModalOtrasTransacciones', { static: true }) private ModalOtrasTransacciones!: ElementRef;
  @ViewChild('ModalImagenRegistroFirmas', { static: true }) private ModalImagenRegistroFirmas!: ElementRef;
  @ViewChild('ModalOtrasTransaccionesNombres', { static: true }) private ModalOtrasTransaccionesNombres!: ElementRef;
  @ViewChild('ModalBuscarNombres', { static: true }) private ModalBuscarNombres!: ElementRef;

  @ViewChild('pdfViewer') pdfViewer!: ElementRef;
  @ViewChild('tesoreriaTab', { static: true }) private tesoreriaTab!: ElementRef;
  @ViewChild('cuotasTab', { static: true }) private cuotasTab!: ElementRef;
  @ViewChild('carteraTab', { static: true }) private carteraTab!: ElementRef;
  @ViewChild('sarlaftTab', { static: true }) private sarlaftTab!: ElementRef;
  @ViewChild('chequesTab', { static: true }) private chequesTab!: ElementRef;
  @ViewChild('convenioTab', { static: true }) private convenioTab!: ElementRef;
  @ViewChild('transaTab', { static: true }) private transaTab!: ElementRef;



  //#region "Definición variables"
  formBusqueda!: FormGroup;
  formTransaccion!: FormGroup;

  public UsuarioActual: string = "";
  public OficinaActual: string = "";
  public ListCatProducto: any;
  public ListProducto: any;
  public ListCarteraConvenio: any;
  public ListTransaccionxPerfil: any;
  public ListOtrasTransaccionxPerfil: any;
  public ListOtrasTransaccionxPerfilFiltrado: any;
  public ListOtrasTransaccionxPerfilBase: any;
  public ListTransaccionxPerfilFiltrado: any;
  public ListAutorizados: any;
  public ListDocumentosBusqueda: any;
  public OtraTransaccionCodigo: any = "";
  public OtraTransaccionIdTercero: any = "";
  public OtraTransaccionDocumento: any = "";
  public base64Data: any;

  public TipoProductoSelected: number = 0;
  public TipoTransaccionSelected: number = 0;
  public IdCuentaSelected: number = 0;
  public TerceroSelected: number = 0;
  public TotalSaldo: number = 0;
  public TotalEfectivo: number = 0;
  public TotalCheque: number = 0;
  public IdOficinaActual: number = 0;
  public IdUsuarioActual: number = 0;
  public NaturalezaTransa: number | null = null;
  public TabPorDefecto: number | null = null;
  public ProductoSeleccionado: number | null = null;
  public CodigoTransa: number | null = null;

  public TipoTransaccionStrSelected: string = "";
  public DocumentoSelected: string = "";
  public DocumentoBusqueda: string = "";
  public NombreSelected: string = "";
  public OficinaCliselected: string = "";
  public NombOficinaCliselected: string = "";
  public CuentaSelected: string = "";
  public ProductoSelected: string = "";
  public OperacionPSelected: string = "";
  public linkPdf: SafeResourceUrl | null = null;
  public rawPdfUrl: string | null = null;
  public linkPdfFirma: string | undefined;
  public pdfTransBase64: string = "";
  public NombreBusqueda: string = "";
  public OtraTransaccionDescripcion: string = "";
  public OtraTransaccionNombre: string = "";
  public OtraTransaccionComentario: string = "";
  public converted_image: string = "";
  public ValidadoraStr: string = "";


  public pdfUrl!: SafeResourceUrl;

  public SelectAll: boolean = false;
  public HabilitaDetalle: boolean = false;
  public HabilitaEfectivo: boolean = false;
  public HabilitaCheque: boolean = false;
  public vbleDocCuenta: boolean = false;
  public ActivaMovtoSelected: boolean = false;
  public showRegistroFirma: boolean = false;
  public isPdf: boolean = false;
  public isPrinterServiceUp: boolean = false;
  public loading2: boolean = false;


  public tabsHabilitados: number[] = [];

  activaTesoreria = false;
  activaCuotas = false;
  activaCartera = false;
  activaSiplaft = false;
  activaCheque = false;
  activaTransa = false;
  activaConvenio = false;

  //#endregion

  constructor(private fb: FormBuilder, private transaccionesCajaService: TransaccionesCajaService, private notif: AlertService, private router: Router, private loading: LoadingService, private validadoraService: ValidadoraService, private DisponiblesServices: DisponiblesService, private sanitizer: DomSanitizer, private loginService: LoginService, private moduleValidationService: ModuleValidationService) { }

  //#region "Inicialización"
  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.Modulo);
    
    let data = localStorage.getItem('Data');
    let DataUser = JSON.parse(window.atob(data == null ? "" : data));
    if (DataUser != null) {
      this.UsuarioActual = DataUser.Usuario;
      this.OficinaActual = DataUser.Oficina;
      this.IdUsuarioActual = Number(DataUser.IdUsuarioSGF);
      this.IdOficinaActual = Number(DataUser.NumeroOficina);
    } else {
      this.UsuarioActual = "";
      this.OficinaActual = "";
      this.IdUsuarioActual = 0;
      this.IdOficinaActual = 0;
    }

    this.validarEstadoTaquilla();
    this.VolverArriba();
    this.vbleDocCuenta = false;

    this.formBusqueda = this.fb.group({
      documento: [''],
      cuenta1: [''],
      cuenta2: [''],
      cuenta3: [''],
      cuenta4: [''],
      idTipoProducto: [null],
    });

    this.formTransaccion = this.fb.group({
      idTransaccion: [null],
    });


    $('#ModalCondiciones').on('hidden.bs.modal', function () {
      $('body').css('padding-right', '0');
      $('body').removeClass('modal-open');
    });

    this.obtenerListaCatProductos();
    this.obtenerTransaccionxPerfil();
    this.ObtenerOtrasTransaccionesxPerfil();
    this.obtenerValidadora();
    this.validarServicioImpresion();
  }

  validarEstadoTaquilla() {
    this.transaccionesCajaService
      .ValidarEstadoTaquilla(this.IdOficinaActual, this.IdUsuarioActual)
      .subscribe({
        next: (resultado: any) => {
          this.loading.hide();
          if (resultado?.TipoAlerta !== 'Correcto') {
            this.notif.onWarning('Advertencia', resultado?.Mensaje);
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.loading.hide();
          console.error('Error:', err);
          this.notif.onWarning('Error', 'Ocurrió un error en la petición');
        }
      });
  }


  obtenerValidadora() {
    this.transaccionesCajaService
      .ObtenerValidadora(this.IdUsuarioActual)
      .subscribe({
        next: (resultado: any) => {
          this.ValidadoraStr = resultado;
        },
        error: (err) => {
          this.loading.hide();
          console.error('Error capturando validadora:', err);
        }
      });
  }

  validarServicioImpresion() {
    this.validadoraService.checkService()
      .then(isUp => {
        this.isPrinterServiceUp = isUp;
        if (!isUp) {
          swal.fire({
            title: 'Falla en servicio de impresión.',
            text: '',
            html: 'Por favor inicie el programa de impresión para hacer uso de la <strong>validadora</strong>.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'ok',
            confirmButtonColor: 'rgb(13,165,80)',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((results) => {
            if (results.value) {

            }
          });
        }
      });
  }
  //#endregion

  //#region "Obtener información general"
  obtenerListaCatProductos() {
    this.ListCatProducto = [];
    this.transaccionesCajaService.ObtenerListaCatProductos().subscribe(
      result => {
        this.ListCatProducto = result;
      },
      error => {
        this.notif.onDanger('Error', error);
        console.error('ObtenerMotivosConsulta - ' + error);
      }
    )
  }

  obtenerTransaccionxPerfil() {
    this.ListTransaccionxPerfil = [];
    let perfiles: string | null = localStorage.getItem('profiles');
    const resultProfiles = JSON.parse(window.atob(perfiles == null ? "" : perfiles));
    const idresultProfiles = resultProfiles.map((x: any) => x.IdPerfil);
    this.transaccionesCajaService.ObtenerTransaccionxPerfil(idresultProfiles)
      .subscribe({
        next: (result: any) => {
          this.ListTransaccionxPerfil = result;
        },
        error: (err) => {
          this.notif.onDanger('Error', err);
          console.error('ObtenerTransaccionesxPerfil - ' + err);
        }
      });
  }

  ObtenerOtrasTransaccionesxPerfil() {
    let perfiles: string | null = localStorage.getItem('profiles');
    const resultProfiles = JSON.parse(window.atob(perfiles == null ? "" : perfiles));
    const idresultProfiles = resultProfiles.map((x: any) => x.IdPerfil);

    this.transaccionesCajaService.ObtenerOtrasTransacciones(idresultProfiles)
      .subscribe({
        next: (resultado: any) => {
          this.ListOtrasTransaccionxPerfil = resultado;
        },
        error: (err) => {
          this.notif.onDanger('Error', err);
          console.error('ObtenerOtrasTransaccionesxPerfil - ' + err);
        }
      });
  }
  //#endregion

  //#region "Captura de datos"
  capturarTipoProducto(event: Event) {
    this.limpiarFormulario(1);
    const selectElement = event.target as HTMLSelectElement;
    const codProductoSeleccionado = Number(selectElement.value);

    this.TipoProductoSelected = codProductoSeleccionado;

    const productoSeleccionado = this.ListCatProducto.find(
      (p: any) => p.CodProducto === codProductoSeleccionado
    );

    this.HabilitaDetalle = productoSeleccionado?.HabilitaDetalle ?? false;
    //Limpiar la transacción
    this.formTransaccion.get('idTransaccion')?.reset('');
    this.ListTransaccionxPerfilFiltrado = [];
  }

  capturarTipoTransaccion(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.TipoTransaccionSelected = Number(selectElement.value);

    if (this.CuentaSelected === undefined || this.CuentaSelected === "") {
      this.formTransaccion.get('idTransaccion')?.reset('');
      this.notif.onWarning("Advertencia", "Debe seleccionar una cuenta válida.");
      return;
    }
    this.TipoTransaccionStrSelected = selectElement.options[selectElement.selectedIndex].text;

    const itemSeleccionado = this.ListTransaccionxPerfilFiltrado.find(
      (x: any) => Number(x.id) === this.TipoTransaccionSelected
    );

    const itemSeleccionadoA = this.ListTransaccionxPerfilFiltrado.find(
      (x: any) => x.IdConfiguracion === this.TipoTransaccionSelected
    );

    const tabString = this.ListTransaccionxPerfilFiltrado[0].TabHabilita;

    this.tabsHabilitados = JSON.parse(tabString);
    this.TabPorDefecto = this.tabsHabilitados[0];

    if (itemSeleccionado?.TabHabilita) {
      try {
        this.tabsHabilitados = JSON.parse(itemSeleccionado.TabHabilita);
        this.TabPorDefecto = this.tabsHabilitados.length > 0
          ? this.tabsHabilitados[0]
          : null;
      } catch (error) {
        console.error('Error parseando TabHabilita', error);
        this.tabsHabilitados = [];
        this.TabPorDefecto = null;
      }
    }

    this.HabilitaEfectivo = itemSeleccionadoA?.HabilitaEfectivo ?? false;
    this.HabilitaCheque = itemSeleccionadoA?.HabilitaCheque ?? false;
    this.NaturalezaTransa = itemSeleccionadoA?.Naturaleza ?? null;
    this.CodigoTransa = itemSeleccionadoA?.Transaccion ?? null;

    this.activarTab(this.TabPorDefecto);

    this.ListOtrasTransaccionxPerfilFiltrado = this.ListOtrasTransaccionxPerfil.filter(
      (p: any) => p.intNaturaleza === this.NaturalezaTransa
    );

    this.ListOtrasTransaccionxPerfilBase = [... this.ListOtrasTransaccionxPerfilFiltrado];


  }

  capturarDocumento(input: HTMLInputElement) {
    this.DocumentoBusqueda = input.value;
    if (this.DocumentoBusqueda.toString().trim() !== "") {
      if (this.TipoProductoSelected <= 0) {
        this.notif.onWarning('Advertencia', 'Seleccione un tipo de producto válido.');
        this.limpiarFormulario(1);
        return;
      } else {
        this.buscarEncabezado(0);
        this.buscarProductosTransa();
      }
    }

  }

  //#endregion

  //#region "Gestión de tabs"
  activarTab(tab: number | null) {
    switch (tab) {
      case 1:
        this.activarTesoreriaTab();
        break;
      case 2:
        this.activarCuotasTab();
        break;
      case 3:
        this.activarCarteraTab();
        break;
      case 4:
        this.activarSarlaftTab();
        break;
      case 5:
        this.activarChequesTab();
        break;
      case 6:
        this.activarConvenioTab();
        break;
      case 7:
        this.activarTransaTab();
        break;
    }
  }


  activarConvenioTab() {
    this.devolverTab(6);
    this.convenioTab.nativeElement.click();
  }

  activarTransaTab() {
    this.devolverTab(7);
    this.transaTab.nativeElement.click();
  }

  activarChequesTab() {
    this.devolverTab(5);
    this.chequesTab.nativeElement.click();
  }

  activarSarlaftTab() {
    this.devolverTab(4);
    this.sarlaftTab.nativeElement.click();
  }

  activarCarteraTab() {
    this.devolverTab(3);
    this.carteraTab.nativeElement.click();
  }

  activarCuotasTab() {
    this.devolverTab(2);
    this.cuotasTab.nativeElement.click();
  }

  activarTesoreriaTab() {
    this.devolverTab(1);
    this.tesoreriaTab.nativeElement.click();
  }


  VolverArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  VolverAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }

  devolverTab(tab: number) {
    switch (tab) {
      case 0:
        this.activaTesoreria = false;
        this.activaCuotas = false;
        this.activaCartera = false;
        this.activaSiplaft = false;
        this.activaCheque = false;
        this.activaTransa = false;
        this.activaConvenio = false;
        break;
      case 1:
        this.activaTesoreria = true;
        this.activaCuotas = false;
        this.activaCartera = false;
        this.activaSiplaft = false;
        this.activaCheque = false;
        this.activaTransa = false;
        this.activaConvenio = false;
        break;
      case 2:
        this.activaTesoreria = false;
        this.activaCuotas = true;
        this.activaCartera = false;
        this.activaSiplaft = false;
        this.activaCheque = false;
        this.activaTransa = false;
        this.activaConvenio = false;
        break;
      case 3:
        this.activaTesoreria = false;
        this.activaCuotas = false;
        this.activaCartera = true;
        this.activaSiplaft = false;
        this.activaCheque = false;
        this.activaTransa = false;
        this.activaConvenio = false;
        break;
      case 4:
        this.activaTesoreria = false;
        this.activaCuotas = false;
        this.activaCartera = false;
        this.activaSiplaft = true;
        this.activaCheque = false;
        this.activaTransa = false;
        this.activaConvenio = false;
        break;
      case 5:
        this.activaTesoreria = false;
        this.activaCuotas = false;
        this.activaCartera = false;
        this.activaSiplaft = false;
        this.activaCheque = true;
        this.activaTransa = false;
        this.activaConvenio = false;
        break;
      case 6:
        this.activaTesoreria = false;
        this.activaCuotas = false;
        this.activaCartera = false;
        this.activaSiplaft = false;
        this.activaCheque = false;
        this.activaConvenio = true;
        this.activaTransa = false;
        break;
      case 7:
        this.activaTesoreria = false;
        this.activaCuotas = false;
        this.activaCartera = false;
        this.activaSiplaft = false;
        this.activaCheque = false;
        this.activaConvenio = false;
        this.activaTransa = true;
        break;
    }
  }

  esTabHabilitado(tab: number): boolean {
    return this.tabsHabilitados.includes(tab);
  }

  //#endregion

  //#region "Búsquedas"
  buscarProductosTransa() {
    this.loading.show();
    this.transaccionesCajaService.BuscarProductosTransa(this.TipoProductoSelected, this.DocumentoBusqueda, this.TipoProductoSelected)
      .subscribe({
        next: (response: any) => {

          const result = Array.isArray(response?.Result) ? response.Result : [];

          //Productos Olivos
          if (this.TipoProductoSelected == 11) {
            if (result.length === 0) {
              this.notif.onWarning('Advertencia', 'No se encontró producto.');
              this.limpiarFormulario(0);
              this.loading.hide();
              return;
            }
          }

          //Productos Olivos
          if (this.TipoProductoSelected == 11) {
            this.ListProducto = result.map((contrato: any) => ({
              strCuenta: contrato.Contrato,
              DescripcionProducto: contrato.NombreProducto,
              Efectivo: contrato.SaldoTotal,
              DescripcionEstado: this.mapEstado(contrato.Estado),
              DescripcionOperacion: 'Consignar',
              intProducto: 11,
              raw: contrato
            }));
            this.loading.hide();
          } else {
            this.ListProducto = response;
            this.loading.hide();
          }

        }, error: (err) => {
          this.loading.hide();
          console.log('Error:', err);
          this.notif.onWarning('Advertencia', 'No se encontró la cuenta.');
        }
      })
  }

  buscarProductosCuentaTransa() {
    const Codigo = this.formBusqueda.get('cuenta1')?.value;
    const Producto = this.formBusqueda.get('cuenta2')?.value;
    const Consecutivo = this.formBusqueda.get('cuenta3')?.value;
    const Digito = this.formBusqueda.get('cuenta4')?.value;
    const ProductoN = Number(Producto);

    if (
      Codigo?.toString().trim() &&
      Producto?.toString().trim() &&
      Consecutivo?.toString().trim() &&
      Digito?.toString().trim()
    ) {
      this.loading.show();
      this.transaccionesCajaService.ObtenerProductoCuentaTransa(Codigo, Producto, Consecutivo, Digito, this.IdOficinaActual.toString())
        .subscribe({
          next: (response: any) => {

            if (!response || response === 'null' || (Array.isArray(response) && response.length === 0)) {
              this.limpiarFormulario(0);
              this.notif.onWarning('Advertencia', 'No se encontró la cuenta.');
              this.loading.hide();
              return;
            }

            const encabezado = response?.Encabezado ?? response?.encabezado ?? null;
            this.buscarEncabezado(1, encabezado);

            if (ProductoN >= 100 && ProductoN <= 399) {
              const ahorro = response?.Ahorro ?? response?.ahorro ?? null;
              this.ListProducto = Array.isArray(ahorro) ? ahorro : (ahorro ? [ahorro] : []);
            } else if (ProductoN >= 400 && ProductoN <= 499) {
              const aporte = response?.Aporte ?? response?.aporte ?? null;
              this.ListProducto = Array.isArray(aporte) ? aporte : (aporte ? [aporte] : []);
            } else if (ProductoN >= 900 && ProductoN <= 999) {
              const seguro = response?.Seguro ?? response?.seguro ?? null;
              this.ListProducto = Array.isArray(seguro) ? seguro : (seguro ? [seguro] : []);
            } else if (ProductoN >= 1 && ProductoN <= 7) {
              const credito = response?.Credito ?? response?.credito ?? null;
              this.ListProducto = Array.isArray(credito) ? credito : (credito ? [credito] : []);
            } else if (ProductoN == 700) {
              const tesoreria = response?.Tesoreria ?? response?.tesoreria ?? null;
              this.ListProducto = Array.isArray(tesoreria) ? tesoreria : (tesoreria ? [tesoreria] : []);
            } else {
              console.log('Fuera de rango');
            }

            this.loading.hide();

          }, error: (err) => {
            this.loading.hide();
            this.limpiarFormulario(0);

            if (err?.TipoAlerta == 'Error') {
              this.notif.onWarning('Advertencia', err?.Mensaje);
            }
            console.log('Error:', err);
          }
        });
    }

  }

  buscarEncabezado(i: number, datos?: any) {
    if (i == 0) {
      this.transaccionesCajaService.ObtenerEncabezadoTransa(this.DocumentoBusqueda)
        .subscribe({
          next: (response: any) => {
            if (!response || response === 'null' || (Array.isArray(response) && response.length === 0)) {
              this.DocumentoSelected = "";
              this.NombreSelected = "";
              this.TerceroSelected = 0;
              this.OficinaCliselected = ""
              this.NombOficinaCliselected = "";
              this.notif.onWarning('Advertencia', 'No se encontró documento.')
              return;
            } else {
              this.DocumentoSelected = response.Documento;
              this.NombreSelected = response.Nombre;
              this.TerceroSelected = response.IdTercero;
              this.OficinaCliselected = response.IdOficina;
              this.NombOficinaCliselected = response.NombreOficina;
            }
          }, error: (err) => {
            console.log(err);
            this.notif.onWarning('Advertencia', 'No se encontró documento.')
          }
        })
    }

    if (i == 1) {
      this.DocumentoSelected = datos.Documento;
      this.NombreSelected = datos.Nombre;
      this.TerceroSelected = datos.IdTercero;
      this.OficinaCliselected = datos.IdOficina;
      this.NombOficinaCliselected = datos.NombreOficina;
    }

  }

  mapEstado(estado: string): string {
    switch (estado) {
      case 'R': return 'Renovación';
      case 'I': return 'Renovación';
      default: return estado;
    }
  }

  busquedaNombres() {
    this.loading2 = true;
    const nombre = this.NombreBusqueda;
    this.transaccionesCajaService.ObtenerEncabezadoNombreTransa(nombre)
      .subscribe({
        next: (result: any) => {
          if (result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró información.');
            this.loading.hide(); 
            return;
          }

          this.ListDocumentosBusqueda = result;
          this.loading.hide(); 
        }, error: (err) => {
          this.loading.hide(); 
          console.log('error búsqueda nombre personas: ' + err);
          this.ListDocumentosBusqueda = [];
          this.notif.onWarning('Advertencia', 'No se encontró información.');

        }
      });
  }

  mapDocumento(documento: string) {
    if (documento) {
      this.formBusqueda.get('documento')?.setValue(documento);
    } else {
      this.formBusqueda.get('documento')?.reset();
    }
    setTimeout(() => {
      this.NombreBusqueda = "";
      this.ListDocumentosBusqueda = [];
    }, 500);

  }
  //#endregion

  //#region "selección del producto"
  seleccionarProducto(i: any) {
    var productoSelectedC = i.intProducto;
    var productoSelected = i.IdProducto;
    if (productoSelectedC === null || productoSelectedC === undefined || productoSelectedC === 'undefined') {
      this.ProductoSeleccionado = productoSelected;
      productoSelected = productoSelected;
    } else {
      this.ProductoSeleccionado = productoSelectedC;
      productoSelected = productoSelectedC;
    }


    this.filtrarTransaccion(productoSelected);

    this.CuentaSelected = i.strCuenta;
    this.ProductoSelected = i.DescripcionProducto;
    this.OperacionPSelected = i.DescripcionOperacion;
    this.ActivaMovtoSelected = i.ActivaMovimiento;
    this.IdCuentaSelected = i.IdCuenta;

    //Cargue opciones para búsqueda por documento
    //Productos Olivos
    if (this.TipoProductoSelected === 11) {
      this.ListCarteraConvenio = i.raw?.Saldos ?? [];
      this.ListCarteraConvenio = this.ListCarteraConvenio.map((x: any) => ({
        ...x,
        selected: false
      }));
    }
    //Cargue opciones para búsqueda por cuenta


  }

  filtrarTransaccion(producto: number) {
    if (producto >= 100 && producto <= 199) {
      this.ListTransaccionxPerfilFiltrado = this.ListTransaccionxPerfil.filter(
        (p: any) => p.CodigoProducto === 1
      );
    } else if (producto >= 200 && producto <= 299) {
      this.ListTransaccionxPerfilFiltrado = this.ListTransaccionxPerfil.filter(
        (p: any) => p.CodigoProducto === 0
      );
    } else if (producto >= 300 && producto <= 399) {
      this.ListTransaccionxPerfilFiltrado = this.ListTransaccionxPerfil.filter(
        (p: any) => p.CodigoProducto === 0
      );
    } else if (producto >= 400 && producto <= 499) {
      this.ListTransaccionxPerfilFiltrado = this.ListTransaccionxPerfil.filter(
        (p: any) => p.CodigoProducto === 4
      );
    } else if (producto == 700) {
      this.ListTransaccionxPerfilFiltrado = this.ListTransaccionxPerfil.filter(
        (p: any) => p.CodigoProducto === 13
      );
    } else if (producto == 11) {
      this.ListTransaccionxPerfilFiltrado = this.ListTransaccionxPerfil.filter(
        (p: any) => p.CodigoProducto === 11
      );
    } else {
      console.log('Fuera de rango');
    }

  }
  //#endregion

  //#region "Limpieza campos y formularios"
  preguntarLimpiarFormulario() {
    swal.fire({
      title: '',
      text: '',
      html: '¿Desea cancelar la transacción? <br>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
      if (results.value) {
        this.limpiarFormulario(0)
      }
    });
  }

  SeleccionBusqueda(i: boolean) {
    this.vbleDocCuenta = i;
    this.limpiarFormulario(0);
    this.ListTransaccionxPerfilFiltrado = [];
  }

  limpiarFormulario(i: number) {
    switch (i) {
      case 0:
        this.VolverArriba();
        this.activarTransaTab();

        //formularios
        this.formBusqueda.reset();
        this.formBusqueda.get('idTipoProducto')?.reset('');
        this.formTransaccion.get('idTransaccion')?.reset('');

        //arreglos
        this.ListProducto = [];
        this.ListCarteraConvenio = [];
        this.tabsHabilitados = [];
        this.ListAutorizados = [];
        this.ListTransaccionxPerfilFiltrado = [];

        //variables globales
        this.TotalSaldo = 0;
        this.TotalEfectivo = 0;
        this.TotalCheque = 0;
        this.TipoProductoSelected = 0;
        this.TerceroSelected = 0;
        this.TipoTransaccionSelected = 0;
        this.IdCuentaSelected = 0;
        this.ProductoSeleccionado = 0;
        this.SelectAll = false;
        this.ActivaMovtoSelected = false;
        this.HabilitaCheque = false;
        this.HabilitaEfectivo = false;
        this.DocumentoBusqueda = "";
        this.DocumentoSelected = "";
        this.NombreSelected = "";
        this.OficinaCliselected = "";
        this.NombOficinaCliselected = "";
        this.CuentaSelected = "";
        this.ProductoSelected = "";
        this.OperacionPSelected = "";
        this.TipoTransaccionStrSelected = "";
        this.TabPorDefecto = null;
        this.NaturalezaTransa = null;
        this.CodigoTransa = null;

        //tab Tesorería
        this.limpiarcamposOtraTransaDocNom(0);
        break;
      case 1:
        this.activarTransaTab();

        //formularios
        this.formTransaccion.get('idTransaccion')?.reset('');

        //arreglos
        this.ListProducto = [];
        this.ListCarteraConvenio = [];
        this.tabsHabilitados = [];
        this.ListAutorizados = [];

        //variables globales
        this.TotalSaldo = 0;
        this.TotalEfectivo = 0;
        this.TotalCheque = 0;
        this.TerceroSelected = 0;
        this.TipoTransaccionSelected = 0;
        this.IdCuentaSelected = 0;
        this.ProductoSeleccionado = 0;
        this.SelectAll = false;
        this.ActivaMovtoSelected = false;
        this.HabilitaCheque = false;
        this.HabilitaEfectivo = false;
        this.DocumentoBusqueda = "";
        this.DocumentoSelected = "";
        this.NombreSelected = "";
        this.OficinaCliselected = "";
        this.NombOficinaCliselected = "";
        this.CuentaSelected = "";
        this.ProductoSelected = "";
        this.OperacionPSelected = "";
        this.TipoTransaccionStrSelected = "";
        this.TabPorDefecto = null;
        this.NaturalezaTransa = null;
        this.CodigoTransa = null;
        break;
    }
  }

  limpiarBusquedaNombre() {
    this.ListDocumentosBusqueda = [];
  }
  //#endregion

  //#region "Funciones especiales Olivos"
  toggleAll() {
    this.ListCarteraConvenio.forEach((item: any) => {
      item.selected = this.SelectAll;
    });
    this.recalcularTotal();
  }

  validarSeleccionConsecutiva(): boolean {
    const seleccionados = this.ListCarteraConvenio.map((x: any) => x.selected);

    const first = seleccionados.indexOf(true);
    const last = seleccionados.lastIndexOf(true);

    // no seleccionó ninguno
    if (first === -1) return true;

    // regla 1: debe comenzar desde el primero
    if (first !== 0) return false;

    // regla 2: no puede haber huecos
    for (let i = first; i <= last; i++) {
      if (!seleccionados[i]) {
        return false;
      }
    }

    return true;
  }

  //#endregion

  //#region "Funciones especiales Tesorería"
  setCuentaTesoreria() {
    this.transaccionesCajaService.ObtenerCuentaTesoreria(this.IdOficinaActual)
      .subscribe({
        next: (result: any) => {

          if (result) {
            const Codigo = result.Codigo;
            const Producto = result.Producto;
            const Consecutivo = result.Consecutivo;
            const Digito = result.Digito;

            this.formBusqueda.patchValue({
              cuenta1: Codigo,
              cuenta2: Producto,
              cuenta3: Consecutivo,
              cuenta4: Digito,
            });

            setTimeout(() => {
              this.buscarProductosCuentaTransa();
            }, 200);

          }
        }, error: (err) => {
          this.loading.hide();
          console.error('Error:', err);
          this.notif.onWarning('Error', 'Ocurrió un error en la petición');
        }
      });

  }

  //#endregion

  //#region "Operaciones Total"
  recalcularTotal() {
    this.TotalEfectivo = this.ListCarteraConvenio
      .filter((i: any) => i.selected)
      .reduce((acc: any, i: any) => acc + i.Saldo, 0);

    this.SelectAll = this.ListCarteraConvenio.every((i: any) => i.selected);
    this.recalcularSaldoTotal();
  }

  recalcularSaldoTotal() {
    const efectivo = this.toNumber(this.TotalEfectivo);
    const cheque = this.toNumber(this.TotalCheque);


    this.TotalSaldo = efectivo + cheque;
  }

  private toNumber(valor: any): number {
    if (valor === null || valor === undefined) return 0;
    const limpio = String(valor).replace(/[^0-9.]/g, '');
    return Number(limpio) || 0;
  }

  //#endregion

  //#region "Gestión Modales"
  abrirModalcondiciones() {
    const CuentaSelected = this.IdCuentaSelected;

    if (CuentaSelected == undefined || CuentaSelected == 0) {
      return;
    }

    this.ListAutorizados = [];
    this.transaccionesCajaService.ObtenerAutorizadosTransa(CuentaSelected).subscribe(
      result => {
        this.ListAutorizados = result;
      }, error => {
        this.notif.onDanger('Error', 'Ha ocurrido un error inesperado.');
        console.error('ObtenerAutorizados- ' + error);
        this.loading.hide();
      }
    )

    this.ModalCondiciones.nativeElement.click();
    setTimeout(() => {
      this.showPdf1();
    }, 100);
  }

  abrirModalNombres() {
    this.ModalBuscarNombres.nativeElement.click();
  }

  //#endregion

  //#region "Visor registro de firmas"
  loadTiffScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Tiff) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/tiff@latest/tiff.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject('No se pudo cargar tiff.min.js');
      document.body.appendChild(script);
    });
  }

  showPdf() {
    let NumeroDocumento = this.DocumentoSelected;
    let NumeroCuenta: string = this.CuentaSelected;

    if (!NumeroDocumento || !NumeroCuenta) {
      return;
    }

    this.loading.show();

    NumeroCuenta = NumeroCuenta.replace(/-/g, "");
    this.showRegistroFirma = false;
    this.converted_image = "";

    if (this.rawPdfUrl) {
      URL.revokeObjectURL(this.rawPdfUrl);
      this.rawPdfUrl = null;
    }

    this.DisponiblesServices
      .DescargarRegistroFirmas(NumeroDocumento, NumeroCuenta)
      .subscribe(
        result => {
          this.loading.hide();
          let base64: string[] = result.split("$$//");

          if (base64.length !== 2) {
            this.notif.onWarning('Advertencia', result + ".");
            return;
          }

          this.base64Data = base64[1];
          let extension = base64[0].replace(".", "").toLowerCase();

          // =========================
          // TIFF
          // =========================
          if (extension === "tif" || extension === "tiff") {
            this.ImagenTiff = base64;
            this.showRegistroFirma = true;

            const binaryData = Uint8Array.from(
              atob(this.base64Data),
              (x: any) => x.charCodeAt(0)
            );

            this.loadTiffScript()
              .then(() => {
                const Tiff = (window as any).Tiff;
                const tiff = new Tiff({ buffer: binaryData });
                const canvas = tiff.toCanvas();

                let jpgBase64 = canvas
                  .toDataURL("image/jpeg")
                  .replace(/^data:image\/jpeg;base64,/, "");

                this.converted_image = "";

                setTimeout(() => {
                  this.converted_image = "data:image/jpeg;base64," + jpgBase64;
                }, 10);

                this.ModalImagenRegistroFirmas.nativeElement.click();
              })
              .catch(error => {
                console.error("Error cargando Tiff.js:", error);
              });
          }

          // =========================
          // PDF
          // =========================
          else if (extension === "pdf") {
            this.showRegistroFirma = false;

            const byteArray = new Uint8Array(
              atob(this.base64Data)
                .split("")
                .map(char => char.charCodeAt(0))
            );

            const blob = new Blob([byteArray], { type: "application/pdf" });
            const url = URL.createObjectURL(blob) + "#t=" + new Date().getTime();
            this.linkPdf = null;

            setTimeout(() => {
              this.linkPdf = this.sanitizer.bypassSecurityTrustResourceUrl(url);;
            }, 50);

            this.ModalImagenRegistroFirmas.nativeElement.click();
          }
          // =========================
          // OTRAS IMÁGENES
          // =========================
          else {
            this.showRegistroFirma = true;
            this.converted_image = "data:image/*;base64," + this.base64Data;
            this.ModalImagenRegistroFirmas.nativeElement.click();
          }
        }, error => {
          this.loading.hide();
          const errorMessage = <any>error;
          this.notif.onDanger('Error', 'Ha ocurrido un error inesperado.');
          console.log(errorMessage);
        });
  }

  ImagenTiff: string[] = [];
  DescargarTiff() {
    let NumeroCuenta: string = this.CuentaSelected;
    const linkSource = "data:image/" + this.ImagenTiff[0] + ";base64," + this.ImagenTiff[1];
    const downloadLink = document.createElement("a");
    const fileName = "RegistroFirmas_" + NumeroCuenta + "." + this.ImagenTiff[0];
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }


  //#endregion

  //#region "Visor foto"
  loadTiffScript1(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Tiff) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/tiff@latest/tiff.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject('No se pudo cargar tiff.min.js');
      document.body.appendChild(script);
    });
  }

  showPdf1() {
    let NumeroDocumento = this.DocumentoSelected;

    if (NumeroDocumento == undefined || NumeroDocumento == "") {
      return;
    }

    this.loading.show();

    //Reset de estado
    this.isPdf = false;
    this.pdfUrl = "";
    this.converted_image = "";
    this.ImagenTiff1 = [];

    this.DisponiblesServices.DescargarFoto(NumeroDocumento).subscribe(
      result => {
        this.loading.hide();

        let base64: string[] = result.split("$$//");

        if (base64.length == 2) {
          this.base64Data = base64[1];
          let tipoArchivo = base64[0].replace(".", "").toLowerCase();

          // =========================
          // TIFF
          // =========================
          if (tipoArchivo === "tif" || tipoArchivo === "tiff") {

            this.ImagenTiff1 = base64;
            this.isPdf = false;

            const binaryData = Uint8Array.from(
              atob(this.base64Data),
              (x: any) => x.charCodeAt(0)
            );

            this.loadTiffScript1()
              .then(() => {
                const Tiff = (window as any).Tiff;
                const tiff = new Tiff({ buffer: binaryData });
                const canvas = tiff.toCanvas();

                let jpgBase64Data = canvas
                  .toDataURL("image/jpeg")
                  .replace(/^data:image\/jpeg;base64,/, "");

                this.converted_image = "data:image/jpeg;base64," + jpgBase64Data;
              })
              .catch((error) => {
                console.error("Error cargando Tiff.js:", error);
              });

          }

          // =========================
          //  PDF
          // =========================
          else if (tipoArchivo === "pdf") {

            this.isPdf = true;

            const byteArray = new Uint8Array(
              atob(this.base64Data)
                .split("")
                .map((char) => char.charCodeAt(0))
            );

            const newBlob = new Blob([byteArray], { type: "application/pdf" });

            // evitar cache
            const unsafeUrl = URL.createObjectURL(newBlob);
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              unsafeUrl + "#t=" + new Date().getTime()
            );
          }

          // =========================
          // OTRAS IMÁGENES
          // =========================
          else {
            this.isPdf = false;
            this.converted_image = "data:image/*;base64," + this.base64Data;
          }

        } else {
          this.notif.onWarning('Advertencia', result + ".");
        }

      },
      error => {
        this.loading.hide();
        this.notif.onDanger('Error', error);
        console.log(error);
      }
    );
  }

  ImagenTiff1: string[] = [];

  DescargarTiff1() {
    const linkSource = "data:image/" + this.ImagenTiff1[0] + ";base64," + this.ImagenTiff1[1];
    const downloadLink = document.createElement("a");
    const fileName = "Foto." + this.ImagenTiff1[0];
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  //#endregion

  //#region "Impresión Comprobantes"
  generarImpresion() {
    if (!this.pdfTransBase64) {
      return;
    }

    const cleanBase64 = this.pdfTransBase64
      .replace(/^data:application\/pdf;base64,/, '')
      .replace(/\s/g, '');

    const pdfUrl = `data:application/pdf;base64,${cleanBase64}`;

    const iframe = document.getElementById("ImpresionTransaccion") as HTMLIFrameElement;

    if (iframe) {
      iframe.src = pdfUrl;
    }
  }
  //#endregion

  //#region "Impresión Validadora"
  async imprimirValidadoraTransa(data: any) {
    let contador = 0;
    let continuar = true;

    while (continuar) {
      const result = await swal.fire({
        title: '',
        text: '',
        html: 'Inserte el documento en la validadora, seleccione <strong>aceptar</strong>.<br>',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'rgb(13,165,80)',
        cancelButtonColor: 'rgb(160,0,87)',
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      if (!result.isConfirmed) {
        continuar = false;
        break;
      }
      contador++;

      if (contador > 2) {
        const autorizado = await this.validarAutorizacion();

        if (!autorizado) {
          continuar = false;
          break;
        }
      }
      this.imprimirValidadora(data);
    }
  }

  imprimirValidadora(data: any) {
    this.validadoraService.printData(data, this.ValidadoraStr);
  }

  async validarAutorizacion(): Promise<boolean> {
    const result = await swal.fire({
      title: 'Autorización requerida',
      html: `
            <form autocomplete="off">
            <input type="text" id="usuarioAut" class="swal2-input" placeholder="Usuario" autocomplete="off">
            <input type="password" id="claveAut" class="swal2-input" placeholder="Clave" autocomplete="new-password">
            </form>
            `,
      confirmButtonText: 'Validar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: async () => {
        const usuario = (document.getElementById('usuarioAut') as HTMLInputElement).value;
        const clave = (document.getElementById('claveAut') as HTMLInputElement).value;

        try {
          this.loading.show();
          const response: any = await lastValueFrom(
            this.loginService.userAuthentication({
              Usuario: usuario,
              clave: clave
            })
          );

          if (response?.ObjAlertasDto?.TipoAlerta === 'Error') {
            this.loading.hide();
            swal.showValidationMessage(response.ObjAlertasDto.Mensaje);
            return false;
          }

          const response1: any = await lastValueFrom(
            this.transaccionesCajaService.ValidarAutorizaNovedad(usuario, 260)
          );

          this.loading.hide();
          if (response1?.ObjAlertasDto?.TipoAlerta === 'Error') {
            swal.showValidationMessage("Usuario no está autorizado para reimprimir.");
            return false;
          } else if (response1 === false) {
            swal.showValidationMessage("Usuario no está autorizado para reimprimir.");
            return false;
          }

          this.loading.hide();
          return true;

        } catch (err: any) {
          this.loading.hide();
          swal.showValidationMessage(err?.Mensaje || 'Error de autenticación.');
          return false;
        }
      }
    });

    return result.isConfirmed && result.value == true;
  }

  validarClave() {

  }

  imprimirValidadora1() { //Solo para pruebas
    this.validadoraService.printData({
      Fecha: "2026/03/09 10:39:05",
      Cajero: "DFRAMIREZ",
      Cuenta: "004-700-0000001-0",
      Efectivo: 13250,
      Cheque: 0,
      Transaccion: 1123123,
      NombreTrans: "Convenio Vivir Olivos",
      DescripcionTrans: "Otras Transacciones"
    }, this.ValidadoraStr);
  }
  //#endregion

  //#region "Tab Tesorería"

  seleccionarOtraTransaccion(item: any) {
    this.OtraTransaccionCodigo = item.intCodigo;
    this.OtraTransaccionDescripcion = item.strDescripcion;
  }

  seleccionarOtraTransaccionNombres(item: any) {
    this.OtraTransaccionDocumento = item.Documento;
    this.OtraTransaccionNombre = item.Nombre;
    this.OtraTransaccionIdTercero = item.IdTercero;

    setTimeout(() => {
      this.limpiarBusquedaNombre();
    }, 300);
  }

  limpiarcamposOtraTransa(tipo: string) {
    if (tipo === 'codigo') {
      this.OtraTransaccionDescripcion = '';
    } else {
      this.OtraTransaccionCodigo = '';
    }
  }

  limpiarcamposOtraTransaDoc(tipo: string) {
    if (tipo === 'documento') {
      this.OtraTransaccionNombre = "";
      this.OtraTransaccionIdTercero = "";
    } else {
      this.OtraTransaccionDocumento = "";
      this.OtraTransaccionIdTercero = "";
    }
  }

  limpiarcamposOtraTransaDocNom(i: number) {
    switch (i) {
      case 0:
        this.OtraTransaccionDocumento = "";
        this.OtraTransaccionNombre = "";
        this.OtraTransaccionIdTercero = "";
        this.OtraTransaccionComentario = "";
        this.OtraTransaccionCodigo = "";
        this.OtraTransaccionDescripcion = "";
        break;
      case 1:
        this.OtraTransaccionDocumento = "";
        this.OtraTransaccionNombre = "";
        this.OtraTransaccionIdTercero = "";
        break;

    }

  }

  limpiarcamposOtraTransaCodDes() {
    this.OtraTransaccionCodigo = "";
    this.OtraTransaccionDescripcion = "";
  }

  buscarCodigoOtraTransaccion() {

    if (!this.OtraTransaccionCodigo) return;

    this.OtraTransaccionCodigo = this.OtraTransaccionCodigo.trim();

    if (!this.OtraTransaccionCodigo) return;

    const esNumerico = /^[0-9]+$/.test(this.OtraTransaccionCodigo);

    if (!esNumerico) {
      // Limpiar y no buscar
      this.OtraTransaccionCodigo = '';
      this.OtraTransaccionDescripcion = '';
      this.notif.onWarning('Advertencia', 'El campo transacción solo acepta números.');
      return;
    }

    this.loading.show();
    //Buscar
    const encontrado = this.ListOtrasTransaccionxPerfilBase.find((x: any) =>
      x.intCodigo.toString() === this.OtraTransaccionCodigo.toString()
    );

    if (encontrado) {
      // Setear descripción
      this.loading.hide();
      this.OtraTransaccionDescripcion = encontrado.strDescripcion;
    } else {
      this.loading.hide();
      this.OtraTransaccionDescripcion = "";
      this.notif.onWarning('Advertencia', 'No se econtró la transacción.');
    }
  }

  buscarDescripcionOtraTransaccion() {
    this.loading.show();
    let listBase = this.ListOtrasTransaccionxPerfilBase;
    let resultado = [...listBase];
    if (!this.OtraTransaccionCodigo && !this.OtraTransaccionDescripcion) {
      this.ListOtrasTransaccionxPerfilFiltrado = listBase;
      this.ModalOtrasTransacciones.nativeElement.click();
      this.loading.hide();
      return;
    }
    if (this.OtraTransaccionCodigo) {
      resultado = resultado.filter((x: any) =>
        x.intCodigo.toString().includes(this.OtraTransaccionCodigo.toString())
      );
      this.loading.hide();
    }
    if (this.OtraTransaccionDescripcion) {
      resultado = resultado.filter((x: any) =>
        x.strDescripcion.toLowerCase().includes(this.OtraTransaccionDescripcion.toLowerCase())
      );
      this.loading.hide();
    }
    if (resultado.length === 0) {
      this.loading.hide();
      this.notif.onWarning('Advertencia', 'No se encontró la transacción.');
      this.OtraTransaccionCodigo = "";
      this.OtraTransaccionDescripcion = "";
      this.ListOtrasTransaccionxPerfilFiltrado = listBase;
      return;
    }
    this.loading.hide();
    this.ListOtrasTransaccionxPerfilFiltrado = resultado;
    this.ModalOtrasTransacciones.nativeElement.click();
  }

  buscarDocumentoOtraTransaccion() {
    if (!this.OtraTransaccionDocumento) {
      this.limpiarcamposOtraTransaDocNom(1);
      return;
    }

    this.OtraTransaccionDocumento = this.OtraTransaccionDocumento.trim();

    if (!this.OtraTransaccionDocumento) {
      this.limpiarcamposOtraTransaDocNom(1);
      return;
    }

    //Buscar
    this.loading.show();
    this.transaccionesCajaService.ObtenerEncabezadoTransa(this.OtraTransaccionDocumento)
      .subscribe({
        next: (result: any) => {
          if (!result || result === 'null' || (Array.isArray(result) && result.length === 0)) {
            this.loading.hide();
            this.limpiarcamposOtraTransaDocNom(1);
            this.notif.onWarning('Advertencia', 'No se encontró documento.')
            return;
          } else {
            this.loading.hide();
            this.OtraTransaccionDocumento = result.Documento;
            this.OtraTransaccionNombre = result.Nombre;
            this.OtraTransaccionIdTercero = result.IdTercero;
          }
        }, error: (err) => {
          this.loading.hide();
          this.limpiarcamposOtraTransaDocNom(1);
          console.log('Errror búsqueda por documento: ' + err);
          this.notif.onWarning('Advertencia', 'No se encontró documento.')
        }
      })
  }

  buscarNombreOtraTransaccion() {
    this.loading.show();
    const nombre = this.OtraTransaccionNombre;
    this.transaccionesCajaService.ObtenerEncabezadoNombreTransa(nombre)
      .subscribe({
        next: (result: any) => {
          if (result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró documento.');
            this.limpiarcamposOtraTransaDocNom(1);
            this.loading.hide();
            return;
          }

          this.ListDocumentosBusqueda = result;
          this.ModalOtrasTransaccionesNombres.nativeElement.click();
          this.loading.hide();
        }, error: (err) => {
          this.loading.hide();
          console.log('error búsqueda nombre personas: ' + err);
          this.ListDocumentosBusqueda = [];
          this.limpiarcamposOtraTransaDocNom(1);
          this.notif.onWarning('Advertencia', 'No se encontró documento.');

        }
      });
  }


  //#endregion

  //#region "GUARDAR TRANSACCIONES"
  guardarTransaccion() {

    if (this.TotalSaldo <= 0) {
      this.notif.onWarning('Advertencia', 'El valor de la transacción debe ser mayor a cero.')
      return;
    }

    swal.fire({
      title: '',
      text: '',
      html: '¿Los datos de la transacción están correctos? <br> <strong>¿Desea continuar?</strong>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
      if (results.value) {
        if (this.ProductoSeleccionado == 11) {
          this.guardarRecaudo();
        } else if (this.ProductoSeleccionado == 700) {
          this.guardarTesoreria();
        }
      }
    });
  }

  guardarRecaudo() {
    const seleccionados = this.ListCarteraConvenio
      .filter((x: any) => x.selected);

    if (seleccionados.length === 0) {
      this.notif.onWarning('Advertencia', "Debe seleccionar al menos un registro.");
      return;
    }

    if (!this.validarSeleccionConsecutiva()) {
      this.notif.onWarning('Advertencia', "Debe seleccionar los registros en orden consecutivo, desde la primera fila.");
      return;
    }
    this.loading.show();

    const recaudo = {
      usuario: this.UsuarioActual,
      tipo_recaudo: "Recaudo Externo",
      vendedor: this.IdUsuarioActual.toString(),
      observaciones: "recaudo sistema Coogranada",
      cuenta_bancaria: "5",
      prevision: seleccionados.map((x: any) => ({
        identificacion: x.identificacion,
        prima: x.prima,
        abonado: x.abonado,
        inicio_vigencia: x.inicio_vigencia,
        finaliza_vigencia: x.finaliza_vigencia,
        id_prima_prevision: x.id_prima_prevision,
        saldo: x.saldo,
        Descuento: x.Descuento ?? 0,
        selected: true,
        email: x.email,
        descripcion_covertura: x.descripcion_covertura
      }))
    };

    const transaccion = {
      idUsuario: this.IdUsuarioActual,
      idTransaccion: this.CodigoTransa,
      idOficina: this.IdOficinaActual,
      idTercero: this.TerceroSelected,
      valor: this.TotalSaldo,
      oficinaActual: this.OficinaActual,
      comentario: "Convenio vivir Olivos automático ERP"
    }

    const request = {
      Recaudo: recaudo,
      Transaccion: transaccion
    }

    this.transaccionesCajaService.RecaudarOlivos(request)
      .subscribe({
        next: (result: any) => {
          this.loading.hide();

          if (!result.Exito) {
            this.notif.onDanger('Error', result.Mensaje);
            return;
          }

          this.pdfTransBase64 = result.PdfTransaccion;
          this.generarImpresion();

          this.ListCarteraConvenio = [];

          this.TotalSaldo = 0;
          this.TotalCheque = 0;
          this.TotalEfectivo = 0;
          this.activarTransaTab();
          this.notif.onSuccess('Exitoso', 'La transacción ' + result.Transaccion + ' se guardó correctamente.');
          this.limpiarFormulario(1);
          this.imprimirValidadoraTransa(result);

        }, error: (err) => {
          this.loading.hide();
          console.log('error guardar transacción recaudo: ' + err);
          this.notif.onDanger('Error', 'No se pudo realizar el proceso.');
        }
      });


  }

  guardarTesoreria() {
    if (this.OtraTransaccionIdTercero == null || this.OtraTransaccionIdTercero == "") {
      this.notif.onWarning('Advertencia', 'Documento no válido.');
      return;
    }

    if (this.OtraTransaccionCodigo == null || this.OtraTransaccionCodigo == "") {
      this.notif.onWarning('Advertencia', 'Transacción no válida.');
      return;
    }

    this.loading.show();

    const transaccion = {
      idUsuario: this.IdUsuarioActual,
      idTransaccion: this.OtraTransaccionCodigo,
      idOficina: this.IdOficinaActual,
      idTercero: this.OtraTransaccionIdTercero,
      valor: this.TotalSaldo,
      oficinaActual: this.OficinaActual,
      comentario: this.OtraTransaccionComentario
    }

    this.transaccionesCajaService.GuardarTransaccion(transaccion)
      .subscribe({
        next: (result: any) => {
          this.loading.hide();

          if (!result.Exito) {
            this.notif.onDanger('Error', result.Mensaje);
            return;
          }

          this.pdfTransBase64 = result.PdfTransaccion;
          this.generarImpresion();

          this.TotalSaldo = 0;
          this.TotalCheque = 0;
          this.TotalEfectivo = 0;
          this.activarTransaTab();
          this.notif.onSuccess('Exitoso', 'La transacción ' + result.Transaccion + ' se guardó correctamente.');
          this.limpiarFormulario(1);//Limpieza general
          this.limpiarcamposOtraTransaDocNom(0); // Limpieza tab
          this.imprimirValidadoraTransa(result);

        }, error: (err) => {
          this.loading.hide();
          console.log('error guardar transacción tesorería: ' + err);
          this.notif.onDanger('Error', 'No se pudo realizar el proceso.');
        }
      });
  }

  //#endregion


}

