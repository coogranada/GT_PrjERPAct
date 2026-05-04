
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PassEncriptJs } from '../../../app/Models/Generales/PasswordEncript.model';
import * as CryptoJS  from 'crypto-js';

@Injectable()
export class ModuleValidationService {
    private PassJs = new PassEncriptJs();
    private resulStore: any;
    private moduleValid = false;
    private moduleValidComp = false;
    constructor(private router: Router) {}

    public ValidatePermissionsModule(modulo : number) {
        let data : string | null = localStorage.getItem('Data');
        this.resulStore = JSON.parse(window.atob(data == null ? "" : data ));
        if (this.resulStore !== null && this.resulStore !== undefined) {
            if (localStorage.getItem('Permisos') !== null && localStorage.getItem('Permisos') !== undefined) {
                let data : string | null = localStorage.getItem('Permisos')
                const permisosUsuario = JSON.parse(CryptoJS.AES.decrypt(
                    data == null ? "" : data, this.PassJs.pass).toString(CryptoJS.enc.Utf8));
                    permisosUsuario.forEach((element : any ) => {
                    // valida si el id del mudlo esta entre los permisos del usuario
                    if (modulo === element.IdModulo) {
                        this.moduleValid = true;
                    }
                });
                if (!this.moduleValid) {
                    this.router.navigate(['#/']);
                }
            } else {
                this.router.navigate(['/Login']);
                localStorage.clear();
            }
        } else {
            this.router.navigate(['/Login']);
            localStorage.clear();
        }
    }
    public validarLocalPermisos(modulo : number) {
        if (localStorage.getItem('Permisos') === null || localStorage.getItem('Permisos') === undefined) {
            this.router.navigate(['/Login']);
        } else {
            let data : string | null = localStorage.getItem('Permisos');
                const permisosUsuario = JSON.parse(CryptoJS.AES.decrypt(
                data == null ? "" : data, this.PassJs.pass).toString(CryptoJS.enc.Utf8));
                // JSON.parse(window.atob(localStorage.getItem('Permisos')));
                permisosUsuario.forEach((element : any) => {
                // valida si el id del mudlo esta entre los permisos del usuario
                if (modulo === element.IdModulo) {
                    this.moduleValidComp = true;
                }
            });
            if (!this.moduleValidComp) {
                this.router.navigate(['#/']);
            }
        }
    }
}
