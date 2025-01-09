
//Inicio VerificarMayusActivo
//Verifica si el Bloq Mayús se encuentra activo, muestra o oculta la alerta
//input= Campo
function VerificarMayusActivo(Pcampo) {
    var _blnActivo = IndicadorMayuscula(Pcampo); //Metodo que verifica si se encuentra activo el Bloq Mayus. Se encuentra en el archivo GT.js
    if (_blnActivo) {
        document.getElementById("BloqMayusIcono").style.visibility = 'visible';
        document.getElementById("BloqMayusTexto").style.visibility = 'visible';
    } else {
        document.getElementById("BloqMayusIcono").style.visibility = 'hidden';
        document.getElementById("BloqMayusTexto").style.visibility = 'hidden';
    }

    if (Pcampo.keyCode == 13) {
        Iniciar();
    }
}
// Fin VerificarMayusActivo