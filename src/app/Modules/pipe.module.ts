import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from '../Pipes/Filtro/filtro.pipe';
import { Replace } from '../Pipes/utilidades/replace.pipe';
@NgModule({
  declarations: [FiltroPipe,
    Replace],
  imports: [
    CommonModule
  ],exports:[
    FiltroPipe,
    Replace,
  ]
})
export class PipeModule { }
