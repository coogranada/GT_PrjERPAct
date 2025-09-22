import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tabla-virtual',
  templateUrl: './tabla-virtual.component.html',
  styleUrl: './tabla-virtual.component.css',
  standalone: false
})
export class TablaVirtualComponent implements OnChanges {
  @Input() datos: any[] = [];
  @Input() columnas: string[] = [];
  @Input() formatear?: (valor: any, columna?: string) => string;
  @Input() mostrarBtnCopia: boolean = false;
  @Output() filaSeleccionada = new EventEmitter<any>();


  filasVisibles: any[] = [];
  currentIndex: number = 0;
  pageSize: number = 20;
  buffer: number = 10;
  idsCargados = new Set<any>();
  filaSeleccionadaData: any = null;

  columnaOrden: string | null = null;
  ordenAscendente: boolean = true;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && changes['datos'].currentValue !== changes['datos'].previousValue) {
      this.currentIndex = 0;
      this.filasVisibles = [];
      this.idsCargados.clear();

      const inicial = this.datos.slice(0, this.pageSize + this.buffer);
      inicial.forEach(fila => this.idsCargados.add(this.getRowId(fila)));
      this.filasVisibles = [...inicial];
      this.currentIndex = this.filasVisibles.length;
    }
  }

  onClickFila(fila: any) {
    this.filaSeleccionadaData = this.getRowId(fila);
    this.filaSeleccionada.emit(fila);    
  }

  loadMore(): void {
    if (this.currentIndex >= this.datos.length) return;
    const nextIndex = this.currentIndex + this.pageSize;
    const nuevosDatos = this.datos.slice(this.currentIndex, nextIndex);
    const nuevoUnicos = nuevosDatos.filter(fila => !this.idsCargados.has(this.getRowId(fila)));

    nuevosDatos.forEach(fila => this.idsCargados.add(this.getRowId(fila)));

    this.filasVisibles = [...this.filasVisibles, ...nuevoUnicos];
    this.currentIndex += this.pageSize;
  }



  getValor(fila: any, col: string): string {
    const valor = fila[col];
    const resultado = this.formatear ? this.formatear(valor, col) : valor;
    return resultado !== null && resultado !== undefined ? String(resultado) : '';
  }


  ordenarPor(col: string): void {
    if (this.columnaOrden === col) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrden = col;
      this.ordenAscendente = true;
    }

    this.datos.sort((a, b) => {
      const valorA = a[col] ?? '';
      const valorB = b[col] ?? '';

      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return this.ordenAscendente ? valorA - valorB : valorB - valorA;
      }

      return this.ordenAscendente
        ? String(valorA).localeCompare(String(valorB))
        : String(valorB).localeCompare(String(valorA));
    });

    // Reiniciar la paginación
    this.currentIndex = 0;
    this.filasVisibles = this.datos.slice(0, this.pageSize + this.buffer);
  }

  onScroll(event: Event): void {

    const element = event.target as HTMLElement;

    const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 10;

    if (atBottom) {
      this.loadMore();
    }
  }

  getRowId(fila: any): string {
    return JSON.stringify(fila);
  }

  copiarTabla() {
    const tabla = document.getElementById('tablaDatos');
    if (!tabla) return;
    const html = tabla.outerHTML;

    const blob = new Blob([html], { type: 'text/html' });

      if (navigator.clipboard && navigator.clipboard.write) {
      const data = [new ClipboardItem({ 'text/html': blob })];
      navigator.clipboard.write(data).then(() => {
        alert('Tabla copiada al portapapeles.');
      }).catch(err => {
        console.error('Error al copiar', err);
      });
    } else {

      const range = document.createRange();
      range.selectNode(tabla);
      const selection = window.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        const successful = document.execCommand('copy');
        alert(successful ? 'Tabla copiada al portapapeles.' : 'No se pudo copiar');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      selection.removeAllRanges();
    }

  }
}
