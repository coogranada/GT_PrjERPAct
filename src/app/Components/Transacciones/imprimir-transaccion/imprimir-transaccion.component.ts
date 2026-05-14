import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransaccionesCajaService } from '../../../Services/Transacciones/TransaccionesCaja.service';
import { AlertService } from '../../../Services/Alert/alert.service';
import { LoadingService } from '../../../Services/shared/loading.service';
import { Title } from '@angular/platform-browser';
import { ShareComponentModule } from '../../../Modules/share-component.module';
import { ModuleValidationService } from '../../../Services/Enviroment/moduleValidation.service';

@Component({
  selector: 'app-imprimir-transaccion',
  templateUrl: './imprimir-transaccion.component.html',
  styleUrl: './imprimir-transaccion.component.css',
  standalone: false,
  providers: [ShareComponentModule, ModuleValidationService]
})
export class ImprimirTransaccionComponent implements OnDestroy {

  @ViewChild('RadioBTransaccion', { static: true }) private RadioBTransaccion!: ElementRef;

  formBusqueda!: FormGroup;

  public Modulo = 88;

  public pdfTransBase64: string = "";
  public UsuarioActual: string = "";
  public OficinaActual: string = "";
  public TituloOriginal: string = "Coogranada – Cooperativa de Ahorro y Crédito";
  public OficinaActualN: string = "0";

  public vbleBusqTransa: boolean = false;
  public enableDescTransa: boolean = false;



  constructor(private fb: FormBuilder, private transaccionesCajaService: TransaccionesCajaService, private notif: AlertService, private loading: LoadingService, private title: Title,  private moduleValidationService: ModuleValidationService) { }

  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.Modulo);
    this.VolverArriba();
    this.title.setTitle(this.TituloOriginal)

    let data = localStorage.getItem('Data');
    let DataUser = JSON.parse(window.atob(data == null ? "" : data));
    if (DataUser != null) {
      this.UsuarioActual = DataUser.Usuario;
      this.OficinaActual = DataUser.Oficina;
      this.OficinaActualN = DataUser.NumeroOficina;
    }

    this.formBusqueda = this.fb.group({
      transaccion: [],
      oficinaI: [''],
      producto: [''],
      consecutivo: [''],
      digito: [''],
      libro: [1]
    });

    const transaccion = this.formBusqueda.get('transaccion')?.value;


    if (transaccion) {
      document.title = `TR_ ${transaccion}`;
    } else {
      document.title = 'Coogranada – Cooperativa de Ahorro y Crédito';
    }



    setTimeout(() => {
      this.RadioBTransaccion.nativeElement.click();
    }, 200);
  }

  ngOnDestroy() {
    this.title.setTitle(this.TituloOriginal)
  }

  seleccionBusqueda(i: boolean) {
    this.vbleBusqTransa = i;
    this.limpiarCampos();
    this.limpiarImpresion();
    if (i == false) {
      this.formBusqueda.patchValue({
        oficinaI: this.OficinaActualN
      });
    }
  }

  limpiarCampos() {
    this.formBusqueda.reset();
    this.formBusqueda.get('libro')?.setValue(1);
    this.enableDescTransa = false;
    this.reestablecerTitulo();
  }

  generarImpresion1() {
    const transaccion = this.formBusqueda.get('transaccion')?.value;
    const libro = this.formBusqueda.get('libro')?.value;
    const oficinaI = this.formBusqueda.get('oficinaI')?.value;
    const producto = this.formBusqueda.get('producto')?.value;
    const consecutivo = this.formBusqueda.get('consecutivo')?.value;
    const digito = this.formBusqueda.get('digito')?.value;


    const busquedaPorCuenta = oficinaI && producto && consecutivo && digito;
    const busquedaPorTransaccion = !!transaccion;

    // ninguna válida
    if (!busquedaPorTransaccion && !busquedaPorCuenta) {
      this.limpiarImpresion();
      return;
    }

    // cuenta incompleta
    if (!busquedaPorTransaccion && !busquedaPorCuenta) {
      this.limpiarImpresion();
      return;
    }

    const cuenta = [
      String(oficinaI).padStart(3, '0'),
      String(producto).padStart(3, '0'),
      String(consecutivo).padStart(7, '0'),
      String(digito).padStart(1, '0')
    ].join('-')


    this.loading.show();
    this.transaccionesCajaService.GenerarPDFTransaccion(
      {
        transaccion: transaccion, //12486374,
        usuario: this.UsuarioActual,
        oficina: this.OficinaActual,
        libro: libro,
        oficinaI: oficinaI,
        producto: producto,
        consecutivo: consecutivo,
        digito: digito
      })
      .subscribe(result => {
        if (transaccion !== null) {
          this.cambiarTitulo('TR_' + transaccion);
        } else {
          this.cambiarTitulo('CM_' + cuenta);
        }
        this.pdfTransBase64 = result;
        this.generarImpresion();
        this.enableDescTransa = true;
        this.loading.hide();
      }, error => {
        this.loading.hide();
        this.limpiarImpresion();
        this.notif.onWarning('Advertencia', 'No se encontró la transacción o comprobante.');
      });
  }

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

  limpiarImpresion() {
    const iframe = document.getElementById('ImpresionTransaccion') as HTMLIFrameElement;

    if (iframe) {
      iframe.src = 'about:blank';
    }

    this.pdfTransBase64 = '';
    this.enableDescTransa = false;
    this.reestablecerTitulo();
  }

  descargarPdf() {
    if (!this.pdfTransBase64) {
      return;
    }

    const base64 = this.pdfTransBase64.replace(
      /^data:application\/pdf;base64,/,
      ''
    );

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([new Uint8Array(byteNumbers)], {
      type: 'application/pdf'
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  }

  cambiarTitulo(Transaccion: any) {
    this.title.setTitle(Transaccion);
  }

  reestablecerTitulo() {
    this.title.setTitle(this.TituloOriginal);
  }

  VolverArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  VolverAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }

}
