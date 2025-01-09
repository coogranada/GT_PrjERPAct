import { Component, OnInit } from "@angular/core";
import { FormGroup,FormControl,Validators } from "@angular/forms";
import Swal from "sweetalert2";
import {
  GestionEmailModel, BannerModel, GestionEmailArrayModel, EmailxBloques, GestionEmailModelCertificado, ModelCertificate,
  ModelTD,  GestionEmailModelTD } from "../../../../Models/Maestros/email.model";
import { GestionEmailService } from "../../../../Services/Maestros/email-gestion.service";
import { NgxToastService } from "ngx-toast-notifier";
declare var $: any;
@Component({
  selector: "app-gestion-email",
  templateUrl: "./gestion-email.component.html",
  styleUrls: ["./gestion-email.component.css"],
  providers: [GestionEmailService],
  standalone : false
})
export class GestionEmail implements OnInit {
  public dataSession: any[] = [];
  public transForm: any[] = [];
  public EmailForm!: FormGroup;
  public EmailFormCertificate!: FormGroup;
  public EmailFormTD!: FormGroup;
  public UserOnSession: any[] = [];
  public showMsg1: Boolean = false;
  public valueSlect: any;
  public valueSlectEdit: any;
  public valueSlectEditRetencions: any;
  public valueSlectEditTD: any;
  public EmailArrayList: BannerModel[] = [];
  public EmailArrayListCertificado: ModelCertificate[] = [];
  public EmailArrayListTD: ModelTD[] = [];
  public UserOffSession: any[] = [];
  public base64textString: string = "";
  public base64textStringtd: string = "";
  public base64textStringCertificado: string = "";
  public base64textStringEditSaldos: string = "";
  public base64textStringEditRetencions: string = "";
  public IdBloque: number = 1;
  public IdBloqueTD: number = 1;
  public IdBloqueCertificado: number = 1;
  public GestionEmailArrayModel = new GestionEmailArrayModel();
  public GestionEmailArrayLogo = new GestionEmailArrayModel();
  public GestionEmailArrayLogoLst: GestionEmailArrayModel[] = [];
  public GestionEmailArrayModelCertiificado = new GestionEmailArrayModel();
  public GestionEmailArrayModelTD = new GestionEmailArrayModel();
  public EditarSaldos = new GestionEmailArrayModel();
  public EditarRetenciones = new GestionEmailArrayModel();
  public EditarTD = new GestionEmailArrayModel();
  public GestionEmailArrayModelLst: GestionEmailArrayModel[] = [];
  public GestionEmailArrayModelEditarSaldos: GestionEmailArrayModel[] = [];
  public GestionEmailArrayModelCertificadoLst: GestionEmailArrayModel[] = [];
  public GestionEmailArrayModelTDLst: GestionEmailArrayModel[] = [];
  public Bloques = new GestionEmailModel();
  public BloquesCertificado = new GestionEmailModelCertificado();
  public BloquesTD = new GestionEmailModelTD();
  public EmailxBloques = new EmailxBloques();
  public EmailxBloquesCertificado = new EmailxBloques();
  public EmailxBloquesTD = new EmailxBloques();
  public Logo: any;
  public TituloValida: Boolean = false;
  public DescripcionValida: Boolean = false;
  public Base64Valida: Boolean = false;
  public base64Logo: any;
  public ValdiaLogoBs64: any;
  public ValidaBase64Editar: any;
  public ValidaBase64EditarR: any;
  public ValidaTituloEditar: any;
  public ValidaTituloEditarR: any;
  public ValidaDescripcionEditar: any;
  public ValidaDescripcionEditarR: any;
  public OmitirBloqueMD: Boolean = false;
  public Omitirbloque3: Boolean = false;
  public OmitirBloqueCT2: Boolean = false;
  public OmitirBloqueCT3: Boolean = false;
  public OmititBloqueSD2: Boolean = false;
  public OmititBloqueSD3: Boolean = false;
  public YearNow: any;

  constructor(private notif: NgxToastService, private GestionEmailService: GestionEmailService) {}

  ngOnInit() {
    this.ValidateForm();
    this.ConsultarImanegesGestinMail();
    this.IrArriba();
    var date = new Date();
    this.YearNow = date.getFullYear();
  }

  Continuar(): any {
    if (this.IdBloque == 1) {
      //agregar variables al modelo
      this.Bloques = new GestionEmailModel();
      this.Bloques.IdBloque = this.IdBloque;
      this.Bloques.Base64String = this.base64textString;
      this.Bloques.Titulo = $("#TituloMailSaldos").val().toString();
      this.Bloques.Descripcion = $("#DescripcionMailSaldos").val().toString();
      if (
        this.Bloques.Titulo == null ||
        this.Bloques.Titulo == undefined ||
        this.Bloques.Titulo == ""
      ) {
        this.TituloValida = true;
        return 1;
      } else if (
        this.Bloques.Descripcion == null ||
        this.Bloques.Descripcion == undefined ||
        this.Bloques.Descripcion == ""
      ) {
        this.TituloValida = false;
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.Bloques.Base64String == null ||
        this.Bloques.Base64String == undefined ||
        this.Bloques.Base64String == ""
      ) {
        this.TituloValida = false;
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.TituloValida = false;
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }
      this.EmailArrayList.push(this.Bloques);

      //limpiar variables para asignar el siguiente bloque
      this.IdBloque = this.IdBloque + 1;
      this.base64textString = "";
      $("#TituloMailSaldos").val("");
      $("#DescripcionMailSaldos").val("");
      $("#TituloEmailSaldos").hide();
      $("#imgSaldosMail").val("");
      return 1;
    }
    if (this.IdBloque == 2 && !this.OmititBloqueSD2) {
      this.Bloques = new GestionEmailModel();
      this.Bloques.IdBloque = this.IdBloque;
      this.Bloques.Base64String = this.base64textString;
      this.Bloques.Descripcion = $("#DescripcionMailSaldos").val().toString();
      if (
        this.Bloques.Descripcion == null ||
        this.Bloques.Descripcion == undefined ||
        this.Bloques.Descripcion == ""
      ) {
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.Bloques.Base64String == null ||
        this.Bloques.Base64String == undefined ||
        this.Bloques.Base64String == ""
      ) {
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }
      this.EmailArrayList.push(this.Bloques);

      //limpiar variables para asignar el siguiente bloque
      this.IdBloque = this.IdBloque + 1;
      this.base64textString = "";
      $("#TituloMailSaldos").val("");
      $("#DescripcionMailSaldos").val("");
      $("#imgSaldosMail").val("");
      $("#btnContinuar").hide();
      $("#btnGuardar").show();
      $("#TituloEmailSaldos").hide();
      return 2;
    }
  }

  ContinuarCertificados(): any {
    if (this.IdBloqueCertificado == 1) {
      //agregar variables al modelo
      this.BloquesCertificado = new GestionEmailModelCertificado();
      this.BloquesCertificado.IdBloque = this.IdBloqueCertificado;
      this.BloquesCertificado.Base64String = this.base64textStringCertificado;
      this.BloquesCertificado.Titulo = $("#TituloMailCertificado").val().toString();
      this.BloquesCertificado.Descripcion = $("#DescripcionMailCertificado").val().toString();
      if (
        this.BloquesCertificado.Titulo == null ||
        this.BloquesCertificado.Titulo == undefined ||
        this.BloquesCertificado.Titulo == ""
      ) {
        this.TituloValida = true;
        return 1;
      } else if (
        this.BloquesCertificado.Descripcion == null ||
        this.BloquesCertificado.Descripcion == undefined ||
        this.BloquesCertificado.Descripcion == ""
      ) {
        this.TituloValida = false;
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.BloquesCertificado.Base64String == null ||
        this.BloquesCertificado.Base64String == undefined ||
        this.BloquesCertificado.Base64String == ""
      ) {
        this.TituloValida = false;
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.TituloValida = false;
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }
      this.EmailArrayListCertificado.push(this.BloquesCertificado);

      //limpiar variables para asignar el siguiente bloque
      this.IdBloqueCertificado = this.IdBloqueCertificado + 1;
      this.base64textStringCertificado = "";
      $("#TituloMailCertificado").val("");
      $("#DescripcionMailCertificado").val("");
      $("#TituloEmailCertificado").hide();
      $("#imgMailCertificado").val("");
      return 1;
    }
    if (this.IdBloqueCertificado == 2 && !this.OmitirBloqueCT2) {
      this.BloquesCertificado = new GestionEmailModel();
      this.BloquesCertificado.IdBloque = this.IdBloqueCertificado;
      this.BloquesCertificado.Base64String = this.base64textStringCertificado;
      this.BloquesCertificado.Descripcion = $("#DescripcionMailCertificado").val().toString();
      if (
        this.BloquesCertificado.Descripcion == null ||
        this.BloquesCertificado.Descripcion == undefined ||
        this.BloquesCertificado.Descripcion == ""
      ) {
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.BloquesCertificado.Base64String == null ||
        this.BloquesCertificado.Base64String == undefined ||
        this.BloquesCertificado.Base64String == ""
      ) {
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }
      this.EmailArrayListCertificado.push(this.BloquesCertificado);
      //limpiar variables para asignar el siguiente bloque
      this.IdBloqueCertificado = this.IdBloqueCertificado + 1;
      this.base64textStringCertificado = "";
      $("#TituloEmailCertificado").val("");
      $("#DescripcionMailCertificado").val("");
      $("#imgMailCertificado").val("");
      $("#btnContinuarCertificado").hide();
      $("#btnGuardarCertificado").show();
      $("#TituloMailCertificado").hide();
      return 2;
    }
  }



  ConsultarImanegesGestinMail() {
    this.EmailxBloques = new EmailxBloques();
    this.EmailxBloquesCertificado = new EmailxBloques();
    this.EmailxBloquesTD = new EmailxBloques();
    this.GestionEmailService.getImagenesGestionMail().subscribe(
      (result) => {
        result.forEach((element : any) => {
          this.EmailxBloques.IdBloque = element.IdBloque;
          this.EmailxBloques.IdTipoMail = element.IdTipoMail;
          if (
            this.EmailxBloques.IdBloque == 0 &&
            this.EmailxBloques.IdTipoMail == 0
          ) {
            this.Logo = element.Base64String;
          } else if (
            this.EmailxBloques.IdBloque == 1 &&
            this.EmailxBloques.IdTipoMail == 1
          ) {
            this.EmailxBloques.TituloB1 = element.Titulo;
            this.EmailxBloques.DescripcionB1 = element.Descripcion;
            this.EmailxBloques.Base64StringB1 = element.Base64String;
          } else if (
            this.EmailxBloques.IdBloque == 2 &&
            this.EmailxBloques.IdTipoMail == 1
          ) {
            this.EmailxBloques.DescripcionB2 = element.Descripcion;
            this.EmailxBloques.Base64StringB2 = element.Base64String;
          } else if (
            this.EmailxBloques.IdBloque == 3 &&
            this.EmailxBloques.IdTipoMail == 1
          ) {
            this.EmailxBloques.DescripcionB3 = element.Descripcion;
            this.EmailxBloques.Base64StringB3 = element.Base64String;
          } else if (
            this.EmailxBloques.IdBloque == 1 &&
            this.EmailxBloques.IdTipoMail == 2
          ) {
            this.EmailxBloquesCertificado.TituloB1 = element.Titulo;
            this.EmailxBloquesCertificado.DescripcionB1 = element.Descripcion;
            this.EmailxBloquesCertificado.Base64StringB1 = element.Base64String;
          } else if (
            this.EmailxBloques.IdBloque == 2 &&
            this.EmailxBloques.IdTipoMail == 2
          ) {
            this.EmailxBloquesCertificado.DescripcionB2 = element.Descripcion;
            this.EmailxBloquesCertificado.Base64StringB2 = element.Base64String;
          } else if (
            this.EmailxBloques.IdBloque == 3 &&
            this.EmailxBloques.IdTipoMail == 2
          ) {
            this.EmailxBloquesCertificado.DescripcionB3 = element.Descripcion;
            this.EmailxBloquesCertificado.Base64StringB3 = element.Base64String;
          }else if( this.EmailxBloques.IdBloque == 1 && this.EmailxBloques.IdTipoMail == 3) {
            this.EmailxBloquesTD.TituloB1 = element.Titulo;
            this.EmailxBloquesTD.DescripcionB1 = element.Descripcion;
            this.EmailxBloquesTD.Base64StringB1 = element.Base64String;
         }else if( this.EmailxBloques.IdBloque == 2 && this.EmailxBloques.IdTipoMail == 3) {
            this.EmailxBloquesTD.DescripcionB2 = element.Descripcion;
            this.EmailxBloquesTD.Base64StringB2 = element.Base64String;
          }else if( this.EmailxBloques.IdBloque == 3 && this.EmailxBloques.IdTipoMail == 3) {
              this.EmailxBloquesTD.DescripcionB3 = element.Descripcion;
              this.EmailxBloquesTD.Base64StringB3 = element.Base64String;
          }
        });
      },
      (error) => {
        console.log(error);
      });
  }
  ResetSelect() {
    $("#SeleccionGestion").val("-");
    this.Base64Valida = false;

    this.ValdiaLogoBs64 = false;
    this.TituloValida = false;
    this.DescripcionValida = false;

    this.ValidaBase64Editar = false;
    this.ValidaBase64EditarR = false;
    this.ValidaTituloEditar = false;
    this.ValidaTituloEditarR = false;
    this.ValidaDescripcionEditar = false;
    this.ValidaDescripcionEditarR = false;
  }
  Guardar() {
    if (this.IdBloque == 3 && !this.OmititBloqueSD3) {
      this.Bloques = new GestionEmailModel();
      this.Bloques.IdBloque = this.IdBloque;
      this.Bloques.Base64String = this.base64textString;
      this.Bloques.Descripcion = $("#DescripcionMailSaldos").val().toString();
      if (
        this.Bloques.Descripcion == null ||
        this.Bloques.Descripcion == undefined ||
        this.Bloques.Descripcion == ""
      ) {
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.Bloques.Base64String == null ||
        this.Bloques.Base64String == undefined ||
        this.Bloques.Base64String == ""
      ) {
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }
      this.EmailArrayList.push(this.Bloques);

      //limpiar variables para asignar el siguiente bloque
      this.base64textString = "";
      $("#TituloMailSaldos").val("");
      $("#DescripcionMailSaldos").val("");
      $("#imgSaldosMail").val("");
      $("#TituloEmailSaldos").hide();
    }
    this.EmailArrayList.forEach((element : any) => {
      let data : string | null = localStorage.getItem("Data");
      const dataUser = JSON.parse(window.atob(data == null ? "" : data));
      this.GestionEmailArrayModel = new GestionEmailArrayModel();
      this.GestionEmailArrayModel.IdBloque = element.IdBloque;
      this.GestionEmailArrayModel.Titulo = element.Titulo;
      this.GestionEmailArrayModel.Descripcion = element.Descripcion;
      this.GestionEmailArrayModel.Base64String = element.Base64String;
      this.GestionEmailArrayModel.UsuarioModifico = dataUser.Usuario;
      this.GestionEmailArrayModel.IdOficina = dataUser.IdOficina;
      this.GestionEmailArrayModel.IdTipoMail = 1;
      this.GestionEmailArrayModel.FechaCreacion = new Date();
      this.GestionEmailArrayModel.FechaModificacion =
        this.GestionEmailArrayModel.FechaCreacion;
      this.GestionEmailArrayModelLst.push(this.GestionEmailArrayModel);
    });
    this.OmititBloqueSD2 = false;
    this.OmititBloqueSD3 = false;
    this.GestionEmailService.setImagenMail(
      this.GestionEmailArrayModelLst
    ).subscribe(
      (result) => {
        this.ConsultarImanegesGestinMail();
        this.GestionEmailArrayModelLst = [];
        $("#cerrarModalSaldosX").click();
        $("#SeleccionGestion").val("-");
        $("#TituloEmailSaldos").show();
        this.IdBloque = 1;
        Swal.fire({
          title: "Exitoso",
          text: "",
          html: "La plantilla del certificado de saldos se guardó correctamente.",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      (error) => {
        console.error("Error al realizar el registro: " + error);
        Swal.fire({
          title: "Error",
          text: "",
          html: "Ha ocurrido un error guardando el registro.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      });
      return;
  }
  GuardarLogo() {
    if (
      this.base64Logo == null ||
      this.base64Logo == "" ||
      this.base64Logo == undefined
    ) {
      this.ValdiaLogoBs64 = true;
      return 1;
    } else {
      this.ValdiaLogoBs64 = false;
    }
    let data : string | null = localStorage.getItem("Data");
    const dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.GestionEmailArrayLogo = new GestionEmailArrayModel();
    this.GestionEmailArrayLogo.IdBloque = 0;
    this.GestionEmailArrayLogo.Titulo = "Logo";
    this.GestionEmailArrayLogo.Descripcion = "Logo";
    this.GestionEmailArrayLogo.Base64String = this.base64Logo;
    this.GestionEmailArrayLogo.UsuarioModifico = dataUser.Usuario;
    this.GestionEmailArrayLogo.IdOficina = dataUser.IdOficina;
    this.GestionEmailArrayLogo.IdTipoMail = 0;
    this.GestionEmailArrayLogo.FechaCreacion = new Date();
    this.GestionEmailArrayLogo.FechaModificacion =
      this.GestionEmailArrayLogo.FechaCreacion;
    this.GestionEmailArrayLogoLst.push(this.GestionEmailArrayLogo);
    this.GestionEmailService.setImagenMail(
      this.GestionEmailArrayLogoLst
    ).subscribe(
      (result) => {
        this.ConsultarImanegesGestinMail();
        this.GestionEmailArrayModelLst = [];
        $("#cerrarModalLogo").click();
        $("#SeleccionGestion").val("-");
        Swal.fire({
          title: "Exitoso",
          text: "",
          html: "El Logo ha sido guardado exitosamente.",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      (error) => {
        console.error("Error al realizar el registro: " + error);
        Swal.fire({
          title: "Error",
          text: "",
          html: "Ha ocurrido un error guardando el registro.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      });
      return;
  }
  GuardarCertificado() {
    if (this.IdBloqueCertificado == 3 && !this.OmitirBloqueCT3) {
      this.BloquesCertificado = new GestionEmailModel();
      this.BloquesCertificado.IdBloque = this.IdBloqueCertificado;
      this.BloquesCertificado.Base64String = this.base64textStringCertificado;
      this.BloquesCertificado.Descripcion = $("#DescripcionMailCertificado").val().toString();
      if (
        this.BloquesCertificado.Descripcion == null ||
        this.BloquesCertificado.Descripcion == undefined ||
        this.BloquesCertificado.Descripcion == ""
      ) {
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.BloquesCertificado.Base64String == null ||
        this.BloquesCertificado.Base64String == undefined ||
        this.BloquesCertificado.Base64String == ""
      ) {
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }

      this.EmailArrayListCertificado.push(this.BloquesCertificado);

      //limpiar variables para asignar el siguiente bloque
      this.base64textStringCertificado = "";
      $("#TituloMailCertificado").val("");
      $("#DescripcionMailCertificado").val("");
      $("#imgMailCertificado").val("");
      $("#TituloEmailCertificado").hide();
    }
    this.EmailArrayListCertificado.forEach((element) => {
      let data : string | null = localStorage.getItem("Data");
      const dataUser = JSON.parse(window.atob(data == null ? "" : data));
      this.GestionEmailArrayModelCertiificado = new GestionEmailArrayModel();
      this.GestionEmailArrayModelCertiificado.IdBloque = element.IdBloque;
      this.GestionEmailArrayModelCertiificado.Titulo = element.Titulo;
      this.GestionEmailArrayModelCertiificado.Descripcion = element.Descripcion;
      this.GestionEmailArrayModelCertiificado.Base64String = element.Base64String;
      this.GestionEmailArrayModelCertiificado.UsuarioModifico = dataUser.Usuario;
      this.GestionEmailArrayModelCertiificado.IdOficina = dataUser.IdOficina;
      this.GestionEmailArrayModelCertiificado.IdTipoMail = 2;
      this.GestionEmailArrayModelCertiificado.FechaCreacion = new Date();
      this.GestionEmailArrayModelCertiificado.FechaModificacion =
      this.GestionEmailArrayModelCertiificado.FechaCreacion;
      this.GestionEmailArrayModelCertificadoLst.push(this.GestionEmailArrayModelCertiificado);
    });
    this.OmitirBloqueCT2 = false;
    this.OmitirBloqueCT3 = false;
    this.GestionEmailService.setImagenMail(
      this.GestionEmailArrayModelCertificadoLst
    ).subscribe(
      (result) => {
        this.ConsultarImanegesGestinMail();
        this.GestionEmailArrayModelLst = [];
        $("#cerrarModalRetenciones").click();
        $("#SeleccionGestion").val("-");
        $("#TituloEmailCertificados").show();
        this.IdBloqueCertificado = 1;
        Swal.fire({
          title: "Exitoso",
          text: "",
          html: "La plantilla del certificado de retención en la fuente se guardó correctamente.",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      (error) => {
        console.error("Error al realizar el registro: " + error);
        Swal.fire({
          title: "Error",
          text: "",
          html: "Ha ocurrido un error guardando el registro.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    );
    return;
  }
  ContinuarTD(): any {
    if (this.IdBloqueTD == 1) {
      //agregar variables al modelo
      this.BloquesTD = new GestionEmailModelTD();
      this.BloquesTD.IdBloque = this.IdBloqueTD;
      this.BloquesTD.Base64String = this.base64textStringtd;
      this.BloquesTD.Titulo = $("#TituloMailTD").val().toString();
      this.BloquesTD.Descripcion = $("#DescripcionMailTD").val().toString();
      if (
        this.BloquesTD.Titulo == null ||
        this.BloquesTD.Titulo == undefined ||
        this.BloquesTD.Titulo == ""
      ) {
        this.TituloValida = true;
        return 1;
      } else if (
        this.BloquesTD.Descripcion == null ||
        this.BloquesTD.Descripcion == undefined ||
        this.BloquesTD.Descripcion == ""
      ) {
        this.TituloValida = false;
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.BloquesTD.Base64String == null ||
        this.BloquesTD.Base64String == undefined ||
        this.BloquesTD.Base64String == ""
      ) {
        this.TituloValida = false;
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.TituloValida = false;
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }
      this.EmailArrayListTD.push(this.BloquesTD);

      //limpiar variables para asignar el siguiente bloque
      this.IdBloqueTD = this.IdBloqueTD + 1;
      this.base64textStringtd = "";
      $("#TituloMailTD").val("");
      $("#DescripcionMailTD").val("");
      $("#TituloEmailTD").hide();
      $("#imgMailTD").val("");
      return 1;
    }
    if (this.IdBloqueTD == 2 && !this.OmitirBloqueMD) {
      this.BloquesTD = new GestionEmailModelTD();
      this.BloquesTD.IdBloque = this.IdBloqueTD;
      this.BloquesTD.Base64String = this.base64textStringtd;
      this.BloquesTD.Descripcion = $("#DescripcionMailTD").val().toString();
      if (
        this.BloquesTD.Descripcion == null ||
        this.BloquesTD.Descripcion == undefined ||
        this.BloquesTD.Descripcion == ""
      ) {
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.BloquesTD.Base64String == null ||
        this.BloquesTD.Base64String == undefined ||
        this.BloquesTD.Base64String == ""
      ) {
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }

      this.EmailArrayListTD.push(this.BloquesTD);
      //limpiar variables para asignar el siguiente bloque
      this.IdBloqueTD = this.IdBloqueTD + 1;
      this.base64textStringtd = "";
      $("#TituloMailTD").val("");
      $("#DescripcionMailTD").val("");
      $("#imgMailTD").val("");
      $("#btnContinuarTD").hide();
      $("#btnGuardarTD").show();
      $("#TituloEmailTD").hide();
      return 2;
    }
  }
  GuardarTD() {
    if (this.IdBloqueTD == 3 && !this.Omitirbloque3) {
      this.BloquesTD = new GestionEmailModelTD();
      this.BloquesTD.IdBloque = this.IdBloqueTD;
      this.BloquesTD.Base64String = this.base64textStringtd;
      this.BloquesTD.Descripcion = $("#DescripcionMailTD").val().toString();
      if (
        this.BloquesTD.Descripcion == null ||
        this.BloquesTD.Descripcion == undefined ||
        this.BloquesTD.Descripcion == ""
      ) {
        this.DescripcionValida = true;
        return 1;
      } else if (
        this.BloquesTD.Base64String == null ||
        this.BloquesTD.Base64String == undefined ||
        this.BloquesTD.Base64String == ""
      ) {
        this.DescripcionValida = false;
        this.Base64Valida = true;
        return 1;
      } else {
        this.DescripcionValida = false;
        this.Base64Valida = false;
      }

      this.EmailArrayListTD.push(this.BloquesTD);
      //limpiar variables para tenerlas limpias antes de continuar el siguiente bloque
      this.base64textStringtd = "";
      $("#TituloMailTD").val("");
      $("#DescripcionMailTD").val("");
      $("#imgMailTD").val("");
      $("#TituloEmailTD").hide();
    }

    this.EmailArrayListTD.forEach((element) => {
      let data : string | null = localStorage.getItem("Data");
      const dataUser = JSON.parse(window.atob(data == null ? "" : data));
      this.GestionEmailArrayModelTD = new GestionEmailArrayModel();
      this.GestionEmailArrayModelTD.IdBloque = element.IdBloque;
      this.GestionEmailArrayModelTD.Titulo = element.Titulo;
      this.GestionEmailArrayModelTD.Descripcion = element.Descripcion;
      this.GestionEmailArrayModelTD.Base64String = element.Base64String;
      this.GestionEmailArrayModelTD.UsuarioModifico = dataUser.Usuario;
      this.GestionEmailArrayModelTD.IdOficina = dataUser.IdOficina;
      this.GestionEmailArrayModelTD.IdTipoMail = 3;
      this.GestionEmailArrayModelTD.FechaCreacion = new Date();
      this.GestionEmailArrayModelTD.FechaModificacion = this.GestionEmailArrayModelTD.FechaCreacion;
      this.GestionEmailArrayModelTDLst.push(this.GestionEmailArrayModelTD);
    });

    this.OmitirBloqueMD = false;
    this.Omitirbloque3 = false;
    this.GestionEmailService.setImagenMail(
      this.GestionEmailArrayModelTDLst
    ).subscribe(
      (result) => {
        this.ConsultarImanegesGestinMail();
        this.GestionEmailArrayModelTDLst = [];
        $("#cerrarModalTD").click();
        $("#SeleccionGestion").val("-");
        $("#TituloEmailTD").show();
        this.IdBloqueTD = 1;
        Swal.fire({
          title: "Exitoso",
          text: "",
          html: "La plantilla del extracto se guardó correctamente.",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      (error) => {
        Swal.fire({
          title: "Error",
          text: "",
          html: "Ha ocurrido un error guardando el registro.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    );
    return
  }

  OmitirMD() {
    Swal.fire({
      title: '¿Estas seguro que deseas omitir este bloque?',
      text: '',
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
        if (this.IdBloqueTD == 2) {
          this.DescripcionValida = false;
          this.Base64Valida = false;
          this.OmitirBloqueMD = true;
          this.BloquesTD = new GestionEmailModelTD();
          this.BloquesTD.IdBloque = this.IdBloqueTD;
          this.BloquesTD.Base64String = this.base64textStringCertificado;
          this.BloquesTD.Descripcion = $("#DescripcionMailTD").val().toString();
          this.EmailArrayListTD.push(this.BloquesTD);
          //limpiar variables para asignar el siguiente bloque
          this.IdBloqueTD = this.IdBloqueTD + 1;
          this.base64textStringtd = "";
          $("#TituloMailTD").val("");
          $("#DescripcionMailTD").val("");
          $("#imgMailTD").val("");
          $("#btnContinuarTD").hide();
          $("#btnGuardarTD").show();
          $("#TituloEmailTD").hide();
        } else if (this.IdBloqueTD == 3) {
          this.DescripcionValida = false;
          this.Base64Valida = false;
          this.Omitirbloque3 = true;
          this.BloquesTD = new GestionEmailModelTD();
          this.BloquesTD.IdBloque = this.IdBloqueTD;
          this.BloquesTD.Base64String = this.base64textStringtd;
          this.BloquesTD.Descripcion = $("#DescripcionMailTD").val().toString();
          this.EmailArrayListTD.push(this.BloquesTD);
          this.base64textStringtd = "";
          $("#TituloMailTD").val("");
          $("#DescripcionMailTD").val("");
          $("#imgMailTD").val("");
          $("#TituloEmailTD").hide();
          this.GuardarTD();
        } else if (this.IdBloqueCertificado == 2) {
          this.OmitirBloqueCT2 = true;
          this.DescripcionValida = false;
          this.Base64Valida = false;
          this.BloquesCertificado = new GestionEmailModel();
          this.BloquesCertificado.IdBloque = this.IdBloqueCertificado;
          this.BloquesCertificado.Base64String = this.base64textStringCertificado;
          this.BloquesCertificado.Descripcion = $("#DescripcionMailCertificado").val().toString();
          this.EmailArrayListCertificado.push(this.BloquesCertificado);
          //limpiar variables para asignar el siguiente bloque
          this.IdBloqueCertificado = this.IdBloqueCertificado + 1;
          this.base64textStringCertificado = "";
          $("#TituloEmailCertificado").val("");
          $("#DescripcionMailCertificado").val("");
          $("#imgMailCertificado").val("");
          $("#btnContinuarCertificado").hide();
          $("#btnGuardarCertificado").show();
          $("#TituloMailCertificado").hide();
        } else if (this.IdBloqueCertificado == 3) {
          this.OmitirBloqueCT3 = true;
          this.DescripcionValida = false;
          this.Base64Valida = false;
          this.BloquesCertificado = new GestionEmailModel();
          this.BloquesCertificado.IdBloque = this.IdBloqueCertificado;
          this.BloquesCertificado.Base64String = this.base64textStringCertificado;
          this.BloquesCertificado.Descripcion = $("#DescripcionMailCertificado").val().toString();
          this.EmailArrayListCertificado.push(this.BloquesCertificado);
          this.base64textStringCertificado = "";
          $("#TituloMailCertificado").val("");
          $("#DescripcionMailCertificado").val("");
          $("#imgMailCertificado").val("");
          $("#TituloEmailCertificado").hide();
          this.GuardarCertificado();
        } else if (this.IdBloque == 2) {
          this.OmititBloqueSD2 = true;
          this.DescripcionValida = false;
          this.Base64Valida = false;
          this.Bloques = new GestionEmailModel();
          this.Bloques.IdBloque = this.IdBloque;
          this.Bloques.Base64String = this.base64textString;
          this.Bloques.Descripcion = $("#DescripcionMailSaldos").val().toString();
          this.EmailArrayList.push(this.Bloques);
          //limpiar variables para asignar el siguiente bloque
          this.IdBloque = this.IdBloque + 1;
          this.base64textString = "";
          $("#TituloMailSaldos").val("");
          $("#DescripcionMailSaldos").val("");
          $("#imgSaldosMail").val("");
          $("#btnContinuar").hide();
          $("#btnGuardar").show();
          $("#TituloEmailSaldos").hide();
        } else if (this.IdBloque == 3) {
          this.DescripcionValida = false;
          this.Base64Valida = false;
          this.OmititBloqueSD3 = true;
          this.Bloques = new GestionEmailModel();
          this.Bloques.IdBloque = this.IdBloque;
          this.Bloques.Base64String = this.base64textString;
          this.Bloques.Descripcion = $("#DescripcionMailSaldos").val().toString();
          this.EmailArrayList.push(this.Bloques);
          //limpiar variables para asignar el siguiente bloque
          this.base64textString = "";
          $("#TituloMailSaldos").val("");
          $("#DescripcionMailSaldos").val("");
          $("#imgSaldosMail").val("");
          $("#TituloEmailSaldos").hide();
          this.Guardar();
        }
      }else{
        this.OmitirBloqueMD = false;
        this.Omitirbloque3 = false;
        this.OmitirBloqueCT2 = false;
        this.OmitirBloqueCT3 = false;
        this.OmititBloqueSD2 = false;
      }
    });
  }

  handleFileSelectCertifi(evt : any) {
    var files = evt.target.files;
    if (files !== null) {
      if (
        files[0].type === "image/jpeg" ||
        files[0].type === "image/jpg" ||
        files[0].type === "image/png" ||
        files[0].type === "image/gif"
      ) {
        var file = files[0];
        var fileSize = files[0].size;
        var reader = new FileReader();
        reader.onload = this.handleFileSelectCertif.bind(this);
        reader.readAsBinaryString(file);
      } else {
        this.base64textString = "";
        this.notif.onWarning("Advertencia","Este tipo de archivo no esta permitido." );
        this.EmailForm.get("Base64String")?.reset();
      }
    }
  }
  handleFileSelectTD(evt : any) {
    var files = evt.target.files;
    if (files !== null) {
      if (
        files[0].type === "image/jpeg" ||
        files[0].type === "image/jpg" ||
        files[0].type === "image/png" ||
        files[0].type === "image/gif"
      ) {
        var file = files[0];
        var fileSize = files[0].size;
        var reader = new FileReader();
        reader.onload = this.handleFileSelectTDs.bind(this);
        reader.readAsBinaryString(file);
      } else {
        this.base64textString = "";
        this.notif.onWarning("Advertencia","Este tipo de archivo no esta permitido." );
        this.EmailForm.get("Base64String")?.reset();
      }
    }
  }
  ValidaPlantillaSaldos() {
    if (this.EmailxBloques.TituloB1 == null || this.EmailxBloques.TituloB1 == "" || this.EmailxBloques.TituloB1 == undefined) {
      $("#cerrarPlantillaMailSaldos").click();
      this.notif.onWarning("Advertencia", "No se encontraron datos.");
    } else {
      $("#AbrirPlantillaSaldos").click();
      //no pasa nada
    }
  }
  ValidaPlantillaRetenciones() {
    if (
      this.EmailxBloquesCertificado.TituloB1 == null ||
      this.EmailxBloquesCertificado.TituloB1 == "" ||
      this.EmailxBloquesCertificado.TituloB1 == undefined
    ) {
      $("#cerrarPlantMailCertificados").click();
      this.notif.onWarning("Advertencia", "No se encontraron datos.");
    } else {
      $("#AbrirCertificadoRetenciones").click();
    }
  }
  ValidaPlantillaTD() {
    if (
      this.EmailxBloquesTD.TituloB1 == null ||
      this.EmailxBloquesTD.TituloB1 == "" ||
      this.EmailxBloquesTD.TituloB1 == undefined
    ) {
      $("#cerrarPlantMailTD").click();
      this.notif.onWarning("Advertencia","No se encontraron datos.");
    } else {
      $("#AbrirCertificadoTD").click();
      //no pasa nada
    }
}
  handleFileSelect(evt : any) {
    var files = evt.target.files;
    if (files !== null) {
      if (
        files[0].type === "image/jpeg" ||
        files[0].type === "image/jpg" ||
        files[0].type === "image/png" ||
        files[0].type === "image/gif"
      ) {
        var file = files[0];
        var fileSize = files[0].size;
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      } else {
        this.base64textString = "";
        this.notif.onWarning("Advertencia","Este tipo de archivo no esta permitido.");
        this.EmailForm.get("Base64String")?.reset();
      }
    }
  }
  handleFileSelectEdit(evt : any) {
    var files = evt.target.files;
    if (files !== null) {
      if (
        files[0].type === "image/jpeg" ||
        files[0].type === "image/jpg" ||
        files[0].type === "image/png" ||
        files[0].type === "image/gif"
      ) {
        var file = files[0];
        var fileSize = files[0].size;
        var reader = new FileReader();
        reader.onload = this._handleReaderLoadedEdit.bind(this);
        reader.readAsBinaryString(file);
      } else {
        this.base64textStringEditSaldos = "";
        this.notif.onWarning("Advertencia", "Este tipo de archivo no esta permitido.");
        this.EmailForm.get("Base64String")?.reset();
      }
    }
  }
  handleFileSelectEditRetencions(evt : any) {
    var files = evt.target.files;
    if (files !== null) {
      if (
        files[0].type === "image/jpeg" ||
        files[0].type === "image/jpg" ||
        files[0].type === "image/png" ||
        files[0].type === "image/gif"
      ) {
        var file = files[0];
        var fileSize = files[0].size;
        var reader = new FileReader();
        reader.onload = this._handleReaderLoadedEditRetencions.bind(this);
        reader.readAsBinaryString(file);
      } else {
        this.base64textStringEditRetencions = "";
        this.notif.onWarning("Advertencia", "Este tipo de archivo no esta permitido.");
        this.EmailForm.get("Base64String")?.reset();
      }
    }
  }
  handleFileSelectLogo(evt : any) {
    var files = evt.target.files;
    if (files !== null) {
      if (
        files[0].type === "image/jpeg" ||
        files[0].type === "image/jpg" ||
        files[0].type === "image/png" ||
        files[0].type === "image/gif"
      ) {
        var file = files[0];
        var fileSize = files[0].size;
        var reader = new FileReader();
        reader.onload = this._handleReaderLogo.bind(this);
        reader.readAsBinaryString(file);
      } else {
        this.base64Logo = "";
        this.notif.onWarning( "Advertencia", "Este tipo de archivo no esta permitido." );
        this.EmailForm.get("Base64String")?.reset();
      }
    }
  }
  _handleReaderLoaded(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }
  _handleReaderLoadedEdit(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64textStringEditSaldos = btoa(binaryString);
  }
  _handleReaderLoadedEditRetencions(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64textStringEditRetencions = btoa(binaryString);
  }
  _handleReaderLogo(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64Logo = btoa(binaryString);
  }
  handleFileSelectCertif(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64textStringCertificado = btoa(binaryString);
  }
  handleFileSelectTDs(readerEvt : any) {
    var binaryString = readerEvt.target.result;
    this.base64textStringtd = btoa(binaryString);
  }
  opcionSelected(value : string) {
    if (value == "1") {
      $("#ModalGestionEmailSaldosBtn").click();
    }
    if (value == "2") {
      $("#ModalGestionEmailCertificadosBtn").click();
    }
    if (value == "3") {
      $("#ModalGestionLogoBtn").click();
    }
    if (value == "4") {
      $("#ModalGestionTDBtn").click();
    }
  }

  opcionSelectedEdit(value : string) {
    if (value == "1") {
      if (
        this.EmailxBloques.TituloB1 != null && this.EmailxBloques.TituloB1 != "" && this.EmailxBloques.TituloB1 != undefined &&
        this.EmailxBloques.DescripcionB1 != null && this.EmailxBloques.DescripcionB1 != "" && this.EmailxBloques.DescripcionB1 != undefined &&
        this.EmailxBloques.Base64StringB1 != null && this.EmailxBloques.Base64StringB1 != "" && this.EmailxBloques.Base64StringB1 != undefined
      ) {
        $("#TituloMailSaldosEdit").val("");
        $("#DescripcionMailSaldosEdit").val("");
        $("#imgSaldosMailEdit").val("");
        $("#BloqueSaldos_").show();
        $("#TituloEmailSaldosEdit").show();
        $("#DescripcionMailSaldosEdit_").show();
        $("#imgSaldosMailEdit_").show();
        $("#btnActualizarSaldos").show();
      } else {
        $("#BloqueSaldos_").hide();
        $("#TituloEmailSaldosEdit").hide();
        $("#DescripcionMailSaldosEdit_").hide();
        $("#imgSaldosMailEdit_").hide();
        $("#btnActualizarSaldos").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }

    } else if (value == "2") {
    if (
      this.EmailxBloques.DescripcionB2 != null &&
      this.EmailxBloques.DescripcionB2 != "" &&
      this.EmailxBloques.DescripcionB2 != undefined &&
      this.EmailxBloques.Base64StringB2 != null &&
      this.EmailxBloques.Base64StringB2 != "" &&
      this.EmailxBloques.Base64StringB2 != undefined
    ) {
        $("#TituloMailSaldosEdit").val("");
        $("#DescripcionMailSaldosEdit").val("");
        $("#imgSaldosMailEdit").val("");
        $("#BloqueSaldos_").show();
        $("#TituloEmailSaldosEdit").hide();
        $("#DescripcionMailSaldosEdit_").show();
        $("#imgSaldosMailEdit_").show();
        $("#btnActualizarSaldos").show();
    } else {
        $("#BloqueSaldos_").hide();
        $("#TituloEmailSaldosEdit").hide();
        $("#DescripcionMailSaldosEdit_").hide();
        $("#imgSaldosMailEdit_").hide();
        $("#btnActualizarSaldos").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
    }
    } else if (value == "3") {
      if (
        this.EmailxBloques.DescripcionB3 != null &&
        this.EmailxBloques.DescripcionB3 != "" &&
        this.EmailxBloques.DescripcionB3 != undefined &&
        this.EmailxBloques.Base64StringB3 != null &&
        this.EmailxBloques.Base64StringB3 != "" &&
        this.EmailxBloques.Base64StringB3 != undefined
      ) {
        $("#TituloMailSaldosEdit").val("");
        $("#DescripcionMailSaldosEdit").val("");
        $("#imgSaldosMailEdit").val("");
        $("#BloqueSaldos_").show();
        $("#TituloEmailSaldosEdit").hide();
        $("#DescripcionMailSaldosEdit_").show();
        $("#imgSaldosMailEdit_").show();
        $("#btnActualizarSaldos").show();
      } else {
        $("#BloqueSaldos_").hide();
        $("#TituloEmailSaldosEdit").hide();
        $("#DescripcionMailSaldosEdit_").hide();
        $("#imgSaldosMailEdit_").hide();
        $("#btnActualizarSaldos").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else {
      $("#BloqueSaldos_").hide();
      $("#TituloEmailSaldosEdit").hide();
      $("#DescripcionMailSaldosEdit_").hide();
      $("#imgSaldosMailEdit_").hide();
      $("#btnActualizarSaldos").hide();
    }
  }
  opcionSelectedEditRetenciones(value : string) {
    if (value == "1") {
      if (
        this.EmailxBloquesCertificado.TituloB1 != null &&
        this.EmailxBloquesCertificado.TituloB1 != "" &&
        this.EmailxBloquesCertificado.TituloB1 != undefined &&
        this.EmailxBloquesCertificado.DescripcionB1 != null &&
        this.EmailxBloquesCertificado.DescripcionB1 != "" &&
        this.EmailxBloquesCertificado.DescripcionB1 != undefined &&
        this.EmailxBloquesCertificado.Base64StringB1 != null &&
        this.EmailxBloquesCertificado.Base64StringB1 != "" &&
        this.EmailxBloquesCertificado.Base64StringB1 != undefined
      ) {
        $("#TituloMailRetencionsEdit").val("");
        $("#DescripcionMailRetencionsEdit").val("");
        $("#imgSaldosMailRetencions").val("");
        $("#TituloEmailRetencionsEdit").show();
        $("#DescripcionMailRetencuionsEdit_").show();
        $("#imgSaldosMailEditRetencions_").show();
        $("#btnActualizarRetencions").show();
      } else {
        $("#TituloEmailRetencionsEdit").hide();
        $("#DescripcionMailRetencuionsEdit_").hide();
        $("#imgSaldosMailEditRetencions_").hide();
        $("#btnActualizarRetencions").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else if (value == "2") {
      if (
        this.EmailxBloquesCertificado.DescripcionB2 != null &&
        this.EmailxBloquesCertificado.DescripcionB2 != "" &&
        this.EmailxBloquesCertificado.DescripcionB2 != undefined &&
        this.EmailxBloquesCertificado.Base64StringB2 != null &&
        this.EmailxBloquesCertificado.Base64StringB2 != "" &&
        this.EmailxBloquesCertificado.Base64StringB2 != undefined
      ) {
        $("#TituloMailRetencionsEdit").val("");
        $("#DescripcionMailRetencionsEdit").val("");
        $("#imgSaldosMailRetencions").val("");
        $("#TituloEmailRetencionsEdit").hide();
        $("#DescripcionMailRetencuionsEdit_").show();
        $("#imgSaldosMailEditRetencions_").show();
        $("#btnActualizarRetencions").show();
      } else {
        $("#TituloEmailRetencionsEdit").hide();
        $("#DescripcionMailRetencuionsEdit_").hide();
        $("#imgSaldosMailEditRetencions_").hide();
        $("#btnActualizarRetencions").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else if (value == "3") {
      if (
        this.EmailxBloquesCertificado.DescripcionB3 != null &&
        this.EmailxBloquesCertificado.DescripcionB3 != "" &&
        this.EmailxBloquesCertificado.DescripcionB3 != undefined &&
        this.EmailxBloquesCertificado.Base64StringB3 != null &&
        this.EmailxBloquesCertificado.Base64StringB3 != "" &&
        this.EmailxBloquesCertificado.Base64StringB3 != undefined
      ) {
        $("#TituloMailRetencionsEdit").val("");
        $("#DescripcionMailRetencionsEdit").val("");
        $("#imgSaldosMailRetencions").val("");
        $("#TituloEmailRetencionsEdit").hide();
        $("#DescripcionMailRetencuionsEdit_").show();
        $("#imgSaldosMailEditRetencions_").show();
        $("#btnActualizarRetencions").show();
      } else {
        $("#TituloEmailRetencionsEdit").hide();
        $("#DescripcionMailRetencuionsEdit_").hide();
        $("#imgSaldosMailEditRetencions_").hide();
        $("#btnActualizarRetencions").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else {
      $("#TituloEmailRetencionsEdit").hide();
      $("#DescripcionMailRetencuionsEdit_").hide();
      $("#imgSaldosMailEditRetencions_").hide();
      $("#btnActualizarRetencions").hide();
    }
  }
  opcionSelectedEditTD(value : string) {
    if (value == "1") {
      if (
        this.EmailxBloquesTD.TituloB1 != null &&
        this.EmailxBloquesTD.TituloB1 != "" &&
        this.EmailxBloquesTD.TituloB1 != undefined &&
        this.EmailxBloquesTD.DescripcionB1 != null &&
        this.EmailxBloquesTD.DescripcionB1 != "" &&
        this.EmailxBloquesTD.DescripcionB1 != undefined &&
        this.EmailxBloquesTD.Base64StringB1 != null &&
        this.EmailxBloquesTD.Base64StringB1 != "" &&
        this.EmailxBloquesTD.Base64StringB1 != undefined
      ) {
        $("#TituloMailTDEdit").val("");
        $("#DescripcionMailTDEdit").val("");
        $("#imgMailTD_").val("");

        $("#TituloEmailTDEdit").show();
        $("#DescripcionMailTDEdit_").show();
        $("#imgSaldosMailEditTD_").show();
        $("#btnActualizarTD").show();
      } else {
        $("#TituloEmailTDEdit").hide();
        $("#DescripcionMailTDEdit_").hide();
        $("#imgSaldosMailEditTD_").hide();
        $("#btnActualizarTD").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else if (value == "2") {
      if (
        this.EmailxBloquesTD.DescripcionB2 != null &&
        this.EmailxBloquesTD.DescripcionB2 != "" &&
        this.EmailxBloquesTD.DescripcionB2 != undefined &&
        this.EmailxBloquesTD.Base64StringB2 != null &&
        this.EmailxBloquesTD.Base64StringB2 != "" &&
        this.EmailxBloquesTD.Base64StringB2 != undefined
      ) {
        $("#TituloMailTDEdit").val("");
        $("#DescripcionMailTDEdit").val("");
        $("#imgMailTD_").val("");
        $("#TituloEmailTDEdit").hide();
        $("#DescripcionMailTDEdit_").show();
        $("#imgSaldosMailEditTD_").show();
        $("#btnActualizarTD").show();
      } else {
        $("#TituloEmailTDEdit").hide();
        $("#DescripcionMailTDEdit_").hide();
        $("#imgSaldosMailEditTD_").hide();
        $("#btnActualizarTD").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else if (value == "3") {
      if (
        this.EmailxBloquesTD.DescripcionB3 != null &&
        this.EmailxBloquesTD.DescripcionB3 != "" &&
        this.EmailxBloquesTD.DescripcionB3 != undefined &&
        this.EmailxBloquesTD.Base64StringB3 != null &&
        this.EmailxBloquesTD.Base64StringB3 != "" &&
        this.EmailxBloquesTD.Base64StringB3 != undefined
      ) {
        $("#TituloMailTDEdit").val("");
        $("#DescripcionMailTDEdit").val("");
        $("#imgMailTD_").val("");
        $("#TituloEmailTDEdit").hide();
        $("#DescripcionMailTDEdit_").show();
        $("#imgSaldosMailEditTD_").show();
        $("#btnActualizarTD").show();
      } else {
        $("#TituloEmailTDEdit").hide();
        $("#DescripcionMailTDEdit_").hide();
        $("#imgSaldosMailEditTD_").hide();
        $("#btnActualizarTD").hide();
        Swal.fire({
          title: "Advertencia",
          text: "",
          html: "No hay información para actualizar en este bloque.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else {
      $("#TituloEmailTDEdit").hide();
      $("#DescripcionMailTDEdit_").hide();
      $("#imgSaldosMailEditTD_").hide();
      $("#btnActualizarTD").hide();
    }
  }
  cerrarModalSaldosEdit() {
    $("#SeleccionGestionEdit").val("-");
    $("#SeleccionGestionEditRetencions").val("-");
  }
  ActualizarSaldos() {
    let data : string | null = localStorage.getItem("Data");
    const dataUser = JSON.parse(window.atob(data == null ? "" : data));

    this.EditarSaldos = new GestionEmailArrayModel();

    this.EditarSaldos.Titulo = $("#TituloMailSaldosEdit").val().toString();
    this.EditarSaldos.Descripcion = $("#DescripcionMailSaldosEdit")
      .val()
      .toString();
    this.EditarSaldos.Base64String = this.base64textStringEditSaldos;
    this.EditarSaldos.IdBloque = this.valueSlectEdit;
    this.EditarSaldos.IdOficina = dataUser.IdOficina;
    this.EditarSaldos.UsuarioModifico = dataUser.Usuario;
    this.EditarSaldos.IdTipoMail = 1;
    this.EditarSaldos.FechaModificacion = new Date();
    if (
      this.EditarSaldos.Titulo == null ||
      this.EditarSaldos.Titulo == undefined ||
      (this.EditarSaldos.Titulo == "" && this.EditarSaldos.IdBloque == 1)
    ) {
      this.ValidaTituloEditar = true;
      return 1;
    } else if (
      this.EditarSaldos.Descripcion == null ||
      this.EditarSaldos.Descripcion == undefined ||
      this.EditarSaldos.Descripcion == ""
    ) {
      this.ValidaTituloEditar = false;
      this.ValidaDescripcionEditar = true;
      return 2;
    } else if (
      this.EditarSaldos.Base64String == null ||
      this.EditarSaldos.Base64String == undefined ||
      this.EditarSaldos.Base64String == ""
    ) {
      this.ValidaTituloEditar = false;
      this.ValidaDescripcionEditar = false;
      this.ValidaBase64Editar = true;
      return 3;
    } else {
      this.ValidaTituloEditar = false;
      this.ValidaDescripcionEditar = false;
      this.ValidaBase64Editar = false;
    }
    this.GestionEmailService.UpdateMailxBloques(this.EditarSaldos).subscribe(
      (result) => {
        this.ConsultarImanegesGestinMail();
        $("#cerrarModalSaldosEdit").click();
        $("#SeleccionGestionEdit").val("-");
        $("#TituloMailSaldosEdit").val("");
        $("#DescripcionMailSaldosEdit").val("");
        $("#imgSaldosMailEdit").val("");
        $("#TituloEmailSaldosEdit").hide();
        $("#DescripcionMailSaldosEdit_").hide();
        $("#imgSaldosMailEdit_").hide();
        $("#btnActualizarSaldos").hide();
        Swal.fire({
          title: "Exitoso",
          text: "",
          html:
            "Bloque " +
            this.EditarSaldos.IdBloque +
            " actualizado exitosamente.",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      (error) => {
        console.error("Error al realizar el registro: " + error);
        Swal.fire({
          title: "Error",
          text: "",
          html: "Ha ocurrido un error actualizado el registro.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      });
      return;
  }
  ActualizarRetenciones() {
    let data : string | null = localStorage.getItem("Data");
    const dataUser = JSON.parse(window.atob(data == null ? "" : data));
    
    this.EditarRetenciones = new GestionEmailArrayModel();

    this.EditarRetenciones.Titulo = $("#TituloMailRetencionsEdit")
      .val()
      .toString();
    this.EditarRetenciones.Descripcion = $("#DescripcionMailRetencionsEdit")
      .val()
      .toString();
    this.EditarRetenciones.Base64String = this.base64textStringEditRetencions;
    this.EditarRetenciones.IdBloque = this.valueSlectEditRetencions;
    this.EditarRetenciones.IdOficina = dataUser.IdOficina;
    this.EditarRetenciones.UsuarioModifico = dataUser.Usuario;
    this.EditarRetenciones.IdTipoMail = 2;
    this.EditarRetenciones.FechaModificacion = new Date();
    if (
      this.EditarRetenciones.Titulo == null ||
      this.EditarRetenciones.Titulo == undefined ||
      (this.EditarRetenciones.Titulo == "" &&
        this.EditarRetenciones.IdBloque == 1)
    ) {
      this.ValidaTituloEditarR = true;
      return 1;
    } else if (
      this.EditarRetenciones.Descripcion == null ||
      this.EditarRetenciones.Descripcion == undefined ||
      this.EditarRetenciones.Descripcion == ""
    ) {
      this.ValidaTituloEditarR = false;
      this.ValidaDescripcionEditarR = true;
      return 2;
    } else if (
      this.EditarRetenciones.Base64String == null ||
      this.EditarRetenciones.Base64String == undefined ||
      this.EditarRetenciones.Base64String == ""
    ) {
      this.ValidaTituloEditarR = false;
      this.ValidaDescripcionEditarR = false;
      this.ValidaBase64EditarR = true;
      return 3;
    } else {
      this.ValidaTituloEditarR = false;
      this.ValidaDescripcionEditarR = false;
      this.ValidaBase64EditarR = false;
    }
    this.GestionEmailService.UpdateMailxBloques(
      this.EditarRetenciones
    ).subscribe(
      (result) => {
        this.ConsultarImanegesGestinMail();

        $("#cerrarModalRetencionsEdit").click();
        $("#SeleccionGestionEditRetencions").val("-");
        $("#TituloMailRetencionsEdit").val("");
        $("#DescripcionMailRetencionsEdit").val("");
        $("#imgSaldosMailRetencions").val("");
        $("#TituloEmailRetencionsEdit").hide();
        $("#DescripcionMailRetencuionsEdit_").hide();
        $("#imgSaldosMailEditRetencions_").hide();
        $("#btnActualizarRetencions").hide();

        Swal.fire({
          title: "Exitoso",
          text: "",
          html:
            "Bloque " +
            this.EditarRetenciones.IdBloque +
            " se actualizó correctamente.",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      (error) => {
        console.error("Error al realizar el registro: " + error);
        Swal.fire({
          title: "Error",
          text: "",
          html: "Ha ocurrido un error actualizado el registro.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      });
      return;
  }

  ActualizarTD() {
    let data : string | null = localStorage.getItem("Data");
    const dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.EditarTD = new GestionEmailArrayModel();

    this.EditarTD.Titulo = $("#TituloMailTDEdit")
      .val()
      .toString();
    this.EditarTD.Descripcion = $("#DescripcionMailTDEdit")
      .val()
      .toString();
    this.EditarTD.Base64String = this.base64textStringtd;
    this.EditarTD.IdBloque = this.valueSlectEditTD;
    this.EditarTD.IdOficina = dataUser.IdOficina;
    this.EditarTD.UsuarioModifico = dataUser.Usuario;
    this.EditarTD.IdTipoMail = 3;
    this.EditarTD.FechaModificacion = new Date();
    if (
      this.EditarTD.Titulo == null ||
      this.EditarTD.Titulo == undefined ||
      (this.EditarTD.Titulo == "" &&
        this.EditarTD.IdBloque == 1)
    ) {
      this.ValidaTituloEditarR = true;
      return 1;
    } else if (
      this.EditarTD.Descripcion == null ||
      this.EditarTD.Descripcion == undefined ||
      this.EditarTD.Descripcion == ""
    ) {
      this.ValidaTituloEditarR = false;
      this.ValidaDescripcionEditarR = true;
      return 2;
    } else if (
      this.EditarTD.Base64String == null ||
      this.EditarTD.Base64String == undefined ||
      this.EditarTD.Base64String == ""
    ) {
      this.ValidaTituloEditarR = false;
      this.ValidaDescripcionEditarR = false;
      this.ValidaBase64EditarR = true;
      return 3;
    } else {
      this.ValidaTituloEditarR = false;
      this.ValidaDescripcionEditarR = false;
      this.ValidaBase64EditarR = false;
    }
    this.GestionEmailService.UpdateMailxBloques(
      this.EditarTD
    ).subscribe(
      (result) => {
        this.ConsultarImanegesGestinMail();

        $("#cerrarModalTDEdit").click();
        $("#SeleccionGestionEditTD").val("-");
        $("#TituloMailTDEdit").val("");
        $("#DescripcionMailTDEdit").val("");
        $("#imgMailTD_").val("");
        $("#TituloEmailRetencionsEdit").hide();
        $("#DescripcionMailRetencuionsEdit_").hide();
        $("#imgSaldosMailEditRetencions_").hide();
        $("#btnActualizarRetencions").hide();

        Swal.fire({
          title: "Exitoso",
          text: "",
          html:
            "Bloque " +
            this.EditarTD.IdBloque +
            " se actualizó correctamente.",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      (error) => {
        Swal.fire({
          title: "Error",
          text: "",
          html: "Ha ocurrido un error actualizado el registro.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "rgb(13,165,80)",
          cancelButtonColor: "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      });
    return;
  }
  IrArriba() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  }

  ValidateForm() {
    const IdBloque = new FormControl("", []);
    const Base64String = new FormControl("", [Validators.required]);
    const UsuarioModifico = new FormControl("", [Validators.required]);
    const Titulo = new FormControl("", [Validators.required]);
    const Descripcion = new FormControl("", [Validators.required]);
    const FechaCreacion = new FormControl("", [Validators.required]);
    const FechaModificacion = new FormControl("", [Validators.required]);
    const urlImagen = new FormControl("", []);
    this.EmailForm = new FormGroup({
      IdBloque: IdBloque,
      Titulo: Titulo,
      Descripcion: Descripcion,
      Base64String: Base64String,
      UsuarioModifico: UsuarioModifico,
      FechaCreacion: FechaCreacion,
      FechaModificacion: FechaModificacion,
      urlImagen: urlImagen,
    });
    this.EmailFormCertificate = new FormGroup({
      IdBloque: IdBloque,
      Titulo: Titulo,
      Descripcion: Descripcion,
      Base64String: Base64String,
      UsuarioModifico: UsuarioModifico,
      FechaCreacion: FechaCreacion,
      FechaModificacion: FechaModificacion,
      urlImagen: urlImagen,
    });
    this.EmailFormTD = new FormGroup({
      IdBloque: IdBloque,
      Titulo: Titulo,
      Descripcion: Descripcion,
      Base64String: Base64String,
      UsuarioModifico: UsuarioModifico,
      FechaCreacion: FechaCreacion,
      FechaModificacion: FechaModificacion,
      urlImagen: urlImagen,
    });
  }
}
