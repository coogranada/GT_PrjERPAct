import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class GestioOperacionesService {
    constructor() { }
    private enviaRecibe = new BehaviorSubject<string>('primer mensaje');
    enviaRecibe$ = this.enviaRecibe.asObservable();
    // Almacenar mensaje, listo para mostrarlo a quién lo pida.
    enviar(mensaje : string) {
        // funcion que llamará quien quiera transmitir un mensaje.
        this.enviaRecibe.next(mensaje);
    }
}
