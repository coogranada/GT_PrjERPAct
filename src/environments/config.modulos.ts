// NO OLVIDAR QUITAR LA OPCION GESTION OPERACIONES DEL LAYUOTH
// urlEstrablecidaInt == 1 == Desarrollo
// urlEstrablecidaInt == 2 == Pruebas
// urlEstrablecidaInt == 3 == Pruebas Produccion
// urlEstrablecidaInt == 4 == Produccion
let urlEstrablecida: string = "";
let urlEstrablecidaInt: number = 1;//Ruta de entorno
switch (urlEstrablecidaInt) {
    case 1:
        urlEstrablecida = 'http://localhost:4200/'; 
        break;
    case 2:
        urlEstrablecida = 'https://pruebaserp.coogranada.com.co/'; 
        break;
    case 3:
        urlEstrablecida = 'https://produccionerp.coogranada.com.co/';
        break;
    case 4:
        urlEstrablecida = 'https://erp.coogranada.com.co/';  
        break;
    default:
        break;
}
export const moduloAGestionar = {
    validarModuloGestionar(modulo : number) {
        switch (modulo) {
            case 11:
                return urlEstrablecida + '/Clientes/Naturales';
            case 12:
                return urlEstrablecida + '/Clientes/Juridicos';
            case 20:
                return urlEstrablecida + '/Productos/Ahorros/Contractual';
            default:
                return "";
                break;
        }
    }
};
// esta es una prueba de Esteban Misas
export const moduloGestionOperacion = {
    validarGestionOpera(modulo : number) {
        switch (modulo) {
            case 11:
                return '/Clientes/Naturales';
            case 12:
                return '/Clientes/Juridicos';
            case 20:
                return '/Productos/Ahorros/Contractual';
            default:
                return;
                break;
        }
    }
};
