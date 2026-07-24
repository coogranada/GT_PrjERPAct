import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service';
import {
  CertificadoSaldos,
  cuerpoCertificadoSaldos,
  TitularRetenciones,
  DataEmailSaldos,
  DataEmailCertificado,
  LogMisProductos,
  DatosProductos
} from "../../../../../Models/Informes/MisProductos/mis-producto.model";
import swal from "sweetalert2";
import { AlertService } from '../../../../../Services/Alert/alert.service';
import { LoadingService } from '../../../../../Services/shared/loading.service';

const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
@Component({
  selector: "app-utilidades-tab",
  templateUrl: "./utilidades-tab.component.html",
  styleUrls: ["./utilidades-tab.component.css"],
  providers: [MiListaProductosService],
  standalone: false
})
export class UtilidadesTabComponent implements OnInit, DoCheck {
  public FormUtilidades!: FormGroup;
  public idTerceroCertificate: any;
  public yearGravable: any;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public certificadoSaldos = new CertificadoSaldos();
  public DataEmailSaldos = new DataEmailSaldos();
  public DataEmailCertificado = new DataEmailCertificado();
  public loadingPdfSaldos = false;
  public loadingPdfCertificate = false;
  public showMsg1: Boolean = false;
  public showMsg3: Boolean = false;
  public showMsg4: Boolean = false;
  public showMsg5: Boolean = false;
  public valueSlect: any;
  public selectOpt: any;
  public YearSel: any;
  public showMsg2: Boolean = false;
  public ValidAnexo: Boolean = false;
  public MostrarCertificadoSaldos: Boolean = false;
  public MostrarCertificadoRetencion: Boolean = false;
  public titularRetiene = new TitularRetenciones();
  public curpoCertificadoSaldos = new cuerpoCertificadoSaldos();
  public page: number = 0;
  public anexo: string = "";
  public UsuarioModifica: any;
  public codigoAnexo: string | null = "";
  public certificadoRetenciones: any[] = [];
  public AnexosDtos: any[] = [];
  public valueS: any;
  public selectedEstado: any;
  public DataRetenciones: any;
  public DataSaldos: any;
  public TerceroUsuario: any;
  public anexoPdf: any;
  public base64MailSaldos: any;
  public base64MailRetenciones: any;
  public validaCertificadoSaldos: any;
  public validaCertificadoRetenciones: any;
  constructor(
    private MiListaProductosService: MiListaProductosService,
    private notif: AlertService,
    private loading: LoadingService
  ) {}

  ngOnInit() {

    this.formUtilidadesValidate();
    this.MiListaProductosService.validaAnexo().subscribe(
      (result) => {
        // result.forEach(elementAnexo => {
        //   if (elementAnexo.Codigo === '20' || elementAnexo.Codigo === '90' ||  elementAnexo.Codigo === '110') {
        //     this.AnexosDtos = elementAnexo;
        //   }          
        // });
        this.AnexosDtos = result;
      },
      (error) => {
        console.log(error);
      }
    );
    $("#anexoSelected").val("-");
    $("#OpcionSe").val("-");

    // setTimeout(() => {

    // },5000)

  }



  ngDoCheck() {
    this.idTerceroCertificate = $("#TerceroPrincipal").val();
  }
  opcionSelected(value : string) {
    if (value == "1") {
      $("#primerBotons").hide();
      $("#segundoBotons").show();
      $("#primerDiv").show();
      $("#segundoDiv").show();
    }
    if (value == "0" || value == "-") {
      $("#primerBotons").show();
      $("#segundoBotons").hide();
      $("#primerDiv").hide();
      $("#segundoDiv").hide();
    }
  }



  setLogMisProductos(LogMisProductos_: LogMisProductos) {
    this.MiListaProductosService.setLogMisProductos(LogMisProductos_).subscribe(
      result => {
        //console.log("register",result);
      },
      error => {
        //console.log(error);
      }
    )
  }

Consultar() {

  this.DataRetenciones = 0;
  this.DataSaldos = 0;

  const opcionSel = $("#OpcionSe").val();
  const yearSel: any = $("#YearSelected").val();
  const anexo = $("#anexoSelected").val();

  this.selectOpt = opcionSel;
  this.YearSel = yearSel;

  const datas = localStorage.getItem("Data");
  const dataUsuario = datas
    ? JSON.parse(window.atob(datas))
    : null;

  this.TerceroUsuario = dataUsuario?.lngTercero;
  this.UsuarioModifica = dataUsuario?.Usuario;

  //#region Validación Asociado

  if (
    !this.idTerceroCertificate ||
    this.idTerceroCertificate === 0
  ) {
    this.notif.onWarning(
      "Advertencia",
      "Debe buscar un asociado para realizar esta consulta."
    );
    return;
  }

  //#endregion

  //#region Validaciones

  if (
    opcionSel === "-" ||
    opcionSel === "" ||
    opcionSel === undefined
  ) {
    this.showMsg1 = true;
    return;
  }

  if (
    yearSel === null ||
    yearSel === undefined ||
    yearSel === ""
  ) {
    this.showMsg1 = false;
    this.showMsg2 = true;
    return;
  }

  if (
    opcionSel === "1" &&
    (
      anexo === null ||
      anexo === undefined ||
      anexo === "" ||
      anexo === "-"
    )
  ) {
    this.ValidAnexo = true;
    this.showMsg1 = false;
    this.showMsg2 = false;
    return;
  }

  //#endregion

  this.codigoAnexo =
    this.valueS && this.valueS !== "-"
      ? this.valueS
      : null;

  this.anexoPdf = this.codigoAnexo;

  this.ValidAnexo = false;
  this.showMsg5 = false;
  this.showMsg1 = false;
  this.showMsg2 = false;

  if (opcionSel === "0") {
    this.consultarSaldos(
      yearSel,
      dataUsuario
    );
  }

  if (opcionSel === "1") {
    this.consultarRetenciones(
      yearSel,
      dataUsuario
    );
  }
}

private consultarSaldos(
  yearSel: any,
  dataUsuario: any
): void {

  this.yearGravable = yearSel;
  this.loading.show();

  this.MiListaProductosService.getCertificadoSaldos(
    yearSel,
    this.idTerceroCertificate
  ).subscribe(
    (result) => {

      if (result.TipoAlerta == 2) {

        this.loading.hide();

        this.notif.onWarning(
          "Advertencia",
          "El año ingresado no es valido."
        );

        return;
      }

      if (result.TipoAlerta == 3) {

        this.loading.hide();

        this.notif.onWarning(
          "Advertencia",
          "No se encontró registro."
        );

        return;
      }

      this.certificadoSaldos.NumeroDocumento =
        result.NumeroDocumento;

      this.DataRetenciones = 0;
      this.DataSaldos = 1;

  

      this.MiListaProductosService.getCertificadoSaldosPdf(
        yearSel,
        this.idTerceroCertificate,
        dataUsuario.lngTercero,
        dataUsuario.Oficina
      ).subscribe(
        (resultp) => {

          try {

            const pdfinBase64 =
              resultp?.FileStream?._buffer;

            if (!pdfinBase64) {
              throw new Error("PDF vacío");
            }

            this.base64MailSaldos = pdfinBase64;

            this.mostrarPdf(pdfinBase64);

            $("#abrirModalCertificate").click();

          } catch (e) {

            console.error("Error procesando PDF", e);

            this.notif.onDanger(
              "Error",
              "No fue posible generar el PDF."
            );

          } finally {

            this.loading.hide();
          }
        },
        (errorp) => {

          this.loading.hide();

          this.notif.onDanger(
            "Error",
            errorp
          );
        }
      );

      $("#OpcionSe").val("-");
      $("#anexoSelected").val("-");
      $("#YearSelected").val("");
      $("#MesSelected").val("");

      //#region Guarda log

      const log = new LogMisProductos();
      const datosProducto = new DatosProductos();

      log.IdOficina = parseInt(
        dataUsuario.NumeroOficina
      );

      log.IdModulo = 69;
      log.IdOperacion = 57;
      log.IdOpcion = 6;
      log.IdTercero = this.idTerceroCertificate;
      log.IdUsuarioERP = dataUsuario.IdUsuario;
      log.IdCuenta = null;

      datosProducto.NumeroCuenta = null;
      datosProducto.FechaInicial = yearSel.toString();
      datosProducto.FechaFinal = null;

      log.DatosProductos = datosProducto;

      this.setLogMisProductos(log);

      //#endregion

    },
    (error) => {

      this.loading.hide();

      this.notif.onDanger(
        "Error.",
        error
      );

      console.log(error);
    }
  );
}

private consultarRetenciones(
  yearSel: any,
  dataUsuario: any
): void {

  this.showMsg3 = false;
  this.showMsg4 = false;
  this.loading.show();

  this.yearGravable = yearSel;

  if (
    this.codigoAnexo === undefined ||
    this.codigoAnexo === null ||
    this.codigoAnexo === ""
  ) {
    this.codigoAnexo = null;
  }

  this.MiListaProductosService.getCertificadoRetenciones(
    yearSel,
    this.idTerceroCertificate,
    this.codigoAnexo
  ).subscribe(
    (result) => {

      const anexo = this.codigoAnexo;

      if (result.TipoAlerta == 2) {

        this.loading.hide();

        this.notif.onWarning(
          "Advertencia",
          "El año ingresado no es valido."
        );

        return;
      }

      if (result.TipoAlerta == 3) {

        this.loading.hide();

        this.notif.onWarning(
          "Advertencia",
          "No se encontró registro."
        );

        return;
      }

      this.titularRetiene.NumeroDocumento =
        result.NumeroDocumento;

      this.DataRetenciones = 1;
      this.DataSaldos = 0;

      this.MiListaProductosService.getCertificadoRetencionPdf(
        yearSel,
        this.idTerceroCertificate,
        this.codigoAnexo,
        dataUsuario.lngTercero,
        dataUsuario.Oficina
      ).subscribe(
        (resultp) => {

          try {

            const pdfinBase64 =
              resultp?.FileStream?._buffer;

            if (!pdfinBase64) {
              throw new Error("PDF vacío");
            }

            this.base64MailRetenciones =
              pdfinBase64;

            this.mostrarPdf(pdfinBase64);

            $("#abrirModalCertificateRetenciones").click();

          } catch (e) {

            console.error(
              "Error procesando PDF",
              e
            );

            this.notif.onDanger(
              "Error",
              "No fue posible generar el PDF."
            );

          } finally {

            this.loading.hide();
          }
        },
        (errorP) => {

          this.loading.hide();

          this.loadingPdfCertificate = false;

          this.notif.onDanger(
            "Error",
            errorP
          );
        }
      );

      $("#OpcionSe").val("-");
      $("#anexoSelected").val("-");
      this.valueS = "-";
      $("#YearSelected").val("");
      $("#anexoCertificate").hide();
      $("#MesSelected").val("");
      $("#primerBotons").show();
      $("#segundoBotons").hide();
      $("#primerDiv").hide();
      $("#segundoDiv").hide();

      this.codigoAnexo = "";

      //#region Guarda log

      const log = new LogMisProductos();
      const datosProducto = new DatosProductos();

      log.IdOficina = parseInt(
        dataUsuario.NumeroOficina
      );

      log.IdModulo = 69;
      log.IdOperacion = 57;
      log.IdOpcion = 7;
      log.IdTercero = this.idTerceroCertificate;
      log.IdUsuarioERP = dataUsuario.IdUsuario;
      log.IdCuenta = null;

      datosProducto.NumeroCuenta = null;
      datosProducto.FechaInicial =
        yearSel.toString() + "-" + anexo;

      datosProducto.FechaFinal = null;

      log.DatosProductos = datosProducto;

      this.setLogMisProductos(log);

      //#endregion
    },
    (error) => {

      this.loading.hide();

      this.notif.onDanger(
        "Error.",
        error
      );

      console.log(error);
    }
  );
}

private mostrarPdf(base64: string): void {

  const byteArray = new Uint8Array(
    atob(base64)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const blob = new Blob(
    [byteArray],
    {
      type: "application/pdf"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const objectPdf =
    document.querySelector("object") as HTMLObjectElement;

  if (objectPdf) {
    objectPdf.data = url;
    objectPdf.name = "Certificado";
    objectPdf.type = "application/pdf";
  }
}

  GenerarCertificadoSaldosPdf() {
    var opcionSel = this.selectOpt;
    var yearSel = this.YearSel;
    let datas = localStorage.getItem("Data")
    var dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    var idTerceroUsuario = dataUser.lngTercero;
    var Oficina = dataUser.Oficina;
    if (Number(opcionSel) == 0) {
      this.loadingPdfSaldos = true;
      this.MiListaProductosService.getCertificadoSaldosPdf(
        yearSel,
        this.idTerceroCertificate,
        idTerceroUsuario,
        Oficina
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName ="CertificadoSaldos_" +this.certificadoSaldos.NumeroDocumento +".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loadingPdfSaldos = false;
          downloadLink.click();
        },
        (error) => {
          this.loadingPdfSaldos = false;
          this.notif.onDanger(
            "Error",
            error);
        }
      );
    }
    if (opcionSel == "1") {
      this.loadingPdfCertificate = true;
      if (
        this.codigoAnexo == undefined ||
        this.codigoAnexo == null ||
        this.codigoAnexo == ""
      ) {
        this.codigoAnexo = "";
      }

      var Oficina = dataUser.Oficina;
      this.MiListaProductosService.getCertificadoRetencionPdf(
        yearSel,
        this.idTerceroCertificate,
        this.anexoPdf,
        idTerceroUsuario,
        Oficina
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "CertificadoRetencion_" + this.titularRetiene.NumeroDocumento +".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loadingPdfCertificate = false;
          downloadLink.click();
        },
        (error) => {
          this.loadingPdfCertificate = false;
          this.notif.onDanger(
            "Error",
            error);
        }
      );
    }
  }

  ValidaPlantillaMail() {
    this.validaCertificadoSaldos = false;
    this.validaCertificadoRetenciones = false;

    this.MiListaProductosService.getImagenesGestionMail().subscribe(
      (result) => {
        result.forEach((element : any) => {
          var TipoMail = element.IdTipoMail;
          if (TipoMail == 1) {
              this.validaCertificadoSaldos = true;
          } else if (TipoMail == 2) {
              this.validaCertificadoRetenciones = true;
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );

  }

  SendEmailCertificateSaldos() {
    this.loading.show();
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.MailSaldos();
    }, 7000);
  }

  MailSaldos() {
    this.loading.show();
    if (this.validaCertificadoSaldos == true) {
      let datas = localStorage.getItem("Data");
      var dataLocal = JSON.parse(window.atob(datas == null? "" : datas));
          this.DataEmailSaldos = new DataEmailSaldos();
          this.DataEmailSaldos.yearGravable = this.yearGravable;
          this.DataEmailSaldos.idTerceroCertificate = this.idTerceroCertificate;
          this.DataEmailSaldos.TerceroUsuario = this.TerceroUsuario;
          this.DataEmailSaldos.UsuarioModifica = this.UsuarioModifica;
          this.DataEmailSaldos.base64MailSaldos = this.base64MailSaldos;
          this.DataEmailSaldos.Oficina = dataLocal.Oficina;
          this.MiListaProductosService.sendMailCertificadoSaldos(
            this.DataEmailSaldos
          ).subscribe(
            (result) => {
              this.loading.hide();
              this.Response(result);

              var Tercero = Number($("#TerceroPrincipal").val());
              //#region Guarda log
              let datas = localStorage.getItem("Data");
              var dataLocalStorage = JSON.parse(window.atob(datas == null ?"": datas));
              var LogMisProductosData = new LogMisProductos();
              var nuevoItem = new DatosProductos();
              LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
              LogMisProductosData.IdModulo = 69;
              LogMisProductosData.IdOperacion = 85;
              LogMisProductosData.IdOpcion = 12; // Envio correo 
              LogMisProductosData.IdTercero = Tercero;
              LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
              nuevoItem.FechaInicial = "";
              nuevoItem.FechaFinal = "";
              LogMisProductosData.DatosProductos = nuevoItem;
              this.setLogMisProductos(LogMisProductosData);
          // #endregion
            },
            (error) => {
              this.loading.hide();
              swal.fire({
                title: "Error",
                text: "",
                html: "Ha ocurrido un error enviando el email.",
                icon: "error",
                showCancelButton: false,
                confirmButtonColor: "rgb(13,165,80)",
                cancelButtonColor: "rgb(160,0,87)",
                allowOutsideClick: false,
                allowEscapeKey: false,
              });
            }
          );
        } else {
          this.loading.hide();
          swal.fire({
            title: "Exitoso",
            text: "",
            html: "El email se envió correctamente.",
            icon: "info",
            showCancelButton: false,
            confirmButtonColor: "rgb(13,165,80)",
            cancelButtonColor: "rgb(160,0,87)",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        }
  }
  SendEmailCertificateRetenciones() {
    this.loading.show();
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.MailRetenciones();
    }, 7000);
  }

  MailRetenciones() {
    if (this.validaCertificadoRetenciones == true) {
      let datas = localStorage.getItem("Data");
      var dataLocal = JSON.parse(window.atob(datas == null? "" : datas));
          this.DataEmailCertificado = new DataEmailCertificado();
          this.DataEmailCertificado.TerceroUsuario = this.TerceroUsuario;
          this.DataEmailCertificado.UsuarioModifica = this.UsuarioModifica;
          this.DataEmailCertificado.yearGravable = this.yearGravable;
          this.DataEmailCertificado.idTerceroCertificate =this.idTerceroCertificate;
          this.DataEmailCertificado.Anexo = this.anexoPdf;
          this.DataEmailCertificado.base64MailSaldos = this.base64MailRetenciones;
          this.DataEmailCertificado.Oficina = dataLocal.Oficina;

          this.MiListaProductosService.SendEmailCertificateRetenciones(
            this.DataEmailCertificado
          ).subscribe(
            (result) => {
              this.loading.hide();
              this.Response(result);


              var Tercero = Number($("#TerceroPrincipal").val());
              //#region Guarda log
              let datas = localStorage.getItem("Data");
              var dataLocalStorage = JSON.parse(window.atob(datas == null ?"": datas));
              var LogMisProductosData = new LogMisProductos();
              var nuevoItem = new DatosProductos();
              LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
              LogMisProductosData.IdModulo = 69;
              LogMisProductosData.IdOperacion = 86;
              LogMisProductosData.IdOpcion = 12; // Envio correo 
              LogMisProductosData.IdTercero = Tercero;
              LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
              nuevoItem.FechaInicial = "";
              nuevoItem.FechaFinal = "";
              LogMisProductosData.DatosProductos = nuevoItem;
              this.setLogMisProductos(LogMisProductosData);
          // #endregion



            },
            (error) => {
              this.loading.hide();
              console.log(error);
              swal.fire({
                title: "Error",
                text: "",
                html: "Ha ocurrido un error enviando el email.",
                icon: "error",
                showCancelButton: false,
                confirmButtonColor: "rgb(13,165,80)",
                cancelButtonColor: "rgb(160,0,87)",
                allowOutsideClick: false,
                allowEscapeKey: false,
              });
            }
          );
    } else {
      this.loadingPdfCertificate = false;
      swal.fire({
        title: "Exitoso",
        text: "",
        html: "El email se envió correctamente..",
        icon: "info",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  }

  Response(value : any) {
    this.loading.hide();
    if (value == "0" ||  value == 0) {
      swal.fire({
        title: "Exitoso",
        text: "",
        html: "El email se envió correctamente.",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
    if (value == "1" || value == 1) {
      swal.fire({
        title: "Advertencia",
        text: "",
        html: "El asociado no tiene email.",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  }


  Limpiar() {
    $("#YearSelected").val("");
    $("#OpcionSe").val("");
    $("#OpcionSe").val("-");
    $("#anexoCertificate").hide();
    $("#anexoSelected").val("-");
    this.codigoAnexo = "";
    this.valueS = "-";
    this.ValidAnexo = false;
    this.showMsg2 = false;
    this.showMsg1 = false;
  }
  formUtilidadesValidate() {
    const OpcionSelected = new FormControl("", [Validators.required]);
    const YearSelected = new FormControl("", [Validators.required]);
    const anexoSelected = new FormControl("", []);

    this.FormUtilidades = new FormGroup({
      OpcionSelected: OpcionSelected,
      YearSelected: YearSelected,
      anexoSelected: anexoSelected,
    });
  }
}
