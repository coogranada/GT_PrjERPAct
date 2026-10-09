
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PassEncriptJs } from '../../../app/Models/Generales/PasswordEncript.model';
import { StorageSecurity } from '../../utils/storage-security.util';

@Injectable()
export class ModuleValidationService {
    private PassJs = new PassEncriptJs();
    private resulStore: any;
    private moduleValid = false;
    private moduleValidComp = false;
    constructor(private router: Router) {}

    public ValidatePermissionsModule(modulo: number) {

        const resulStore = StorageSecurity.getData();

        if (!resulStore) {
            this.router.navigate(['/Login']);
            localStorage.clear();
            return;
        }

        const permisosUsuario = StorageSecurity.getItem('Permisos');

        if (!permisosUsuario) {
            this.router.navigate(['/Login']);
            localStorage.clear();
            return;
        }

        this.moduleValid = permisosUsuario.some(
            (x: any) => x.IdModulo === modulo
        );

        if (!this.moduleValid) {
            this.router.navigate(['/']);
        }
    }
    
    public validarLocalPermisos(modulo: number) {

        const permisosUsuario = StorageSecurity.getItem('Permisos');

        if (!permisosUsuario) {
            this.router.navigate(['/Login']);
            return;
        }

        this.moduleValidComp = permisosUsuario.some(
            (x: any) => x.IdModulo === modulo
        );

        if (!this.moduleValidComp) {
            this.router.navigate(['/']);
        }
    }
}
