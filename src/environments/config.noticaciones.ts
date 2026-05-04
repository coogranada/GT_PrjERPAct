export const ConfiguracionNotificacion = {
  
  configRightTop: {
    timeOut: 15000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    positionClass: 'toast-bottom-right',  
    lastOnBottom: true, 
    animate: 'fromBottom'
  },
  configRightTopNoClose: {
    timeOut: 15000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: false, 
    positionClass: 'toast-bottom-right',  
    lastOnBottom: true,  
    animate: 'fromBottom',  
  },
  options: {
    positionClass: 'toast-bottom-left',  
    lastOnBottom: true,  
    animate: 'fromBottom', 
    timeOut: 15000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  },
  Cerrar: {
    theClass: 'custom',
    positionClass: 'toast-bottom-right', 
    lastOnBottom: true,  
    timeOut: 15000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    animate: 'fromBottom',  
  },
  NotificacionesGMF: {
    timeOut: 15000,
    showProgressBar: true,
    pauseOnHover: false,
    clickToClose: true,
    positionClass: 'toast-bottom-right', 
    lastOnBottom: true,  
    animate: 'fromBottom',  
  },
  success: {  
    theClass: 'toast-success'
  },
  error: {
    theClass: 'toast-error'   
  },
  warning: {
    theClass: 'toast-warning' 
  },
};
