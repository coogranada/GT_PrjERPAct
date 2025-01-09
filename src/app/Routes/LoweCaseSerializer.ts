import { DefaultUrlSerializer, UrlTree } from '@angular/router';

const UrlDeclaradas = [
  { Descripcion: "/Login" },
  { Descripcion: "/Perfil/Detalle" },
  { Descripcion: "/Configuracion/Maestros/Areas" },
  { Descripcion: "/Configuracion/Maestros/Cargos" },
  { Descripcion: "/Configuracion/Maestros/Oficinas" },
  { Descripcion: "/Configuracion/Maestros/Perfiles" },
  { Descripcion: "/Configuracion/Maestros/TiposUsuarios" },
  { Descripcion: "/Configuracion/Maestros/Modulos" },
  { Descripcion: "/Configuracion/Maestros/Permisos" },
  { Descripcion: "/Configuracion/Maestros/PermisosEspeciales" },
  { Descripcion: "/Configuracion/Maestros/GestionEmail" },
  { Descripcion: "/Configuracion/Maestros/AutorizacionesUsuarios" },
  { Descripcion: "/Configuracion/Maestros/Usuarios" },
  { Descripcion: "/Configuracion/Maestros/UsuariosProveederes" },
  { Descripcion: "/Configuracion/Maestros/OperacionesModulos" },
  { Descripcion: "/Configuracion/Maestros/OperacionesPerfiles" },
  { Descripcion: "/Configuracion/Maestros/OperacionesEstados" },
  { Descripcion: "/Configuracion/Maestros/ObservacionesModulos" },
  { Descripcion: "/Configuracion/Maestros/ ControlSesion" },
  { Descripcion: "/Configuracion/Maestros/ImagenesBanner" },
  { Descripcion: "/AplicacionesColaborativas" },
  { Descripcion: "/LibretaDirecciones" },
  { Descripcion: "/Ahorros/Disponible/TarjetaHabientes" },
  { Descripcion: "/Ahorros/Disponible/GMF" },
  { Descripcion: "/Productos/Aportes" },
  { Descripcion: "/Productos/Ahorros/Contractual" },
  { Descripcion: "/Productos/Ahorros/AsesoriaContractual" },
  { Descripcion: "/Productos/Ahorros/Termino/Termino" },
  { Descripcion: "/Productos/Ahorros/Termino/AsesoriaTermino" },
  { Descripcion: "/Productos/Creditos/Score" },
  { Descripcion: "/Productos/Creditos/FichaAnalisis" },
  { Descripcion: "/Productos/Creditos/Simulador" },
  { Descripcion: "/Auditorias/GMF" },
  { Descripcion: "/Auditorias/Score" },
  { Descripcion: "/Clientes/Naturales" },
  { Descripcion: "/Clientes/Juridicos" },
  { Descripcion: "/Clientes/Juridicos/SolicitudServiciosjuridicos" },
  { Descripcion: "/Clientes/Naturales/SolicitudServicios" },
  { Descripcion: "/Clientes/Naturales/SolicitudRetiro" },
  { Descripcion: "/Productos/Ahorros/Disponibles/Disponibles" },
  { Descripcion: "/Utilidades/CrearNotificaciones" },
  { Descripcion: "/AcercaDe" },
  { Descripcion: "/Utilidades/DiferenciasSaldos" },
  { Descripcion: "/Informes/ConciliacionComisiones" },
  { Descripcion: "/GestionOperaciones" },
  { Descripcion: "/Informes/DebitosAutomaticos" },
  { Descripcion: "/Informes/GestionOperaciones" },
  { Descripcion: "/Informes/Estadisticos/Transacciones" },
  { Descripcion: "/Informes/Estadisticos/Canales-Externos" },
  { Descripcion: "/Informes/Estadisticos/Composicion-Portafolio" },
  { Descripcion: "/Informes/Estadisticos/Evolucion-Oficina" },
  { Descripcion: "/Informes/Estadisticos/Indicadores-Gerenciales" },
  { Descripcion: "/Informes/ListaProductos" },
  { Descripcion: "/Informes/InformeClientes" },
  { Descripcion: "/Configuracion/Informes/Maestros-ahorros/Consecutivo-titulo/informe-consecutivo-titulo" },
  
  {
    Descripcion:
      "/Configuracion/Maestros-productos/Maestros-ahorros/Consecutivo-titulo",
  },
  { Descripcion: "/Configuracion/Maestros/llaves" },
];
let urlReturn = '';
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    override parse(url: string): UrlTree {
        UrlDeclaradas.forEach((element : any) => {
            const urlLower = element.Descripcion;
            if (url.toLowerCase().includes(urlLower.toLowerCase())) {
                urlReturn = element.Descripcion;
                return true;
            }
        });
        return super.parse(urlReturn);
    }
}
