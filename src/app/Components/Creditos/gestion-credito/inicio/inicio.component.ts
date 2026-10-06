import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../../../Services/Maestros/usuarios.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [AsyncPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  private usuarioService = inject(UsuariosService);
  oficinas$ = this.usuarioService.getOficinas();

}
