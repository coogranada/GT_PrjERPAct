//Inicio IndicadorMayuscula
//Indica si el Bloq Mayús se encuentra activo
//Pcampo = campo 
function IndicadorMayuscula(Pcampo) {
    kCode = Pcampo.keyCode ? Pcampo.keyCode : Pcampo.which;
    sKey = Pcampo.shiftKey ? Pcampo.shiftKey : ((kCode == 16) ? true : false);
    if (((kCode >= 65 && kCode <= 90) && !sKey) || ((kCode >= 97 && kCode <= 122) && sKey)) {
        return true;
    } else {
        return false;
    }
}
// Fin IndicadorMayuscula

// Inicio MostrarPNotify
// Muestra la alerta Pnotify
// TipoAlerta = Tipo de alerta que de va a mostrar
// Mensaje = Mensaje de la alerta
function MostrarPNotify(TipoAlerta, Titulo, Mensaje) {
    var opts = {
        title: "",
        text: "",
        width: "20%",
        cornerclass: "no-border-radius",
        addclass: ""
    };
    switch (TipoAlerta) {
        case 'Error':
            opts.title = Titulo;
            opts.text = Mensaje;
            opts.addclass = "alert alert-styled-left alert-arrow-left bg-danger",
                opts.type = "error";
            break;

        case 'Informativo':
            opts.title = Titulo;
            opts.text = Mensaje;
            opts.addclass = "alert alert-styled-left alert-arrow-left bg-informativo",
                opts.type = "info";
            break;

        case 'Correcto':
            opts.title = Titulo;
            opts.text = Mensaje;
            opts.addclass = "alert alert-styled-left alert-arrow-left bg-correcto",
                opts.type = "success";

            break;
    }
    new PNotify(opts);
}
// Fin MostrarPNotify

// Inicio BloquearPagina
// Bloquea la pagina
function BloquearPagina() {
    var block = $("#Contenido");
    $(block).block({
        message: '<div class="Cargando"><i class="icon-spinner2 spinner"></i><span class="text-semibold display-block">Cargando...</span></div>',
        overlayCSS: {
            backgroundColor: '#1b20245c',
            opacity: 0.7,
            zIndex: 1200,
            cursor: 'wait'
        },
        css: {
            width: 96,
            border: 0,
            padding: 0,
            backgroundColor: 'transparent'
        }
    });
}
// Inicio BloquearPagina

//Inicio DesbloquearPagina
//Desbloquea la pagina
//
function DesbloquearPagina() {
    var block = $("#Contenido");
    $(block).unblock();
}
//Inicio DesbloquearPagina

//Inicio ValidarEmail
// Valida que el campo de email tenga la estructura correcta
// Ptexto = Contiene el texto que se va a validar
function ValidarEmail(Ptexto) {
    var exp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return exp.test(Ptexto);
}
// Fin ValidarEmail

//Inicio Imprimir
//Imprime el contenido HTML. Utiliza el metodo printArea() que se encuenta en el archivo jquery.printarea
//PNombreElemento = Id del elemento HMTL que se desea imprimir
function Imprimir(PNombreElemento) {
    $("#" + PNombreElemento).printArea();
}