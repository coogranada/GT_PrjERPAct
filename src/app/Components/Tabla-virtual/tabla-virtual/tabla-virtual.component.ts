import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tabla-virtual',
  templateUrl: './tabla-virtual.component.html',
  styleUrl: './tabla-virtual.component.css',
  standalone: false
})
export class TablaVirtualComponent implements OnChanges {
  @ViewChild('scrollContent') scrollContent!: ElementRef<HTMLDivElement>;



  @Input() datos: any[] = [];
  @Input() columnas: string[] = [];
  @Input() formatear?: (valor: any, columna?: string) => string;
  @Input() mostrarBtnCopia: boolean = false;
  @Input() mostrarTotal: boolean = false;
  @Output() filaSeleccionada = new EventEmitter<any>();

  totales: {[col: string]: number} ={}
  filasVisibles: any[] = [];
  currentIndex: number = 0;
  pageSize: number = 20;
  buffer: number = 10;
  idsCargados = new Set<any>();
  filaSeleccionadaData: any = null;
  ultimoScrollTop: number = 0;

  columnaOrden: string | null = null;
  ordenAscendente: boolean = true;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && changes['datos'].currentValue !== changes['datos'].previousValue) {
      this.currentIndex = 0;
      this.filasVisibles = [];
      this.idsCargados.clear();
      this.resetScroll();

      const inicial = this.datos.slice(0, this.pageSize + this.buffer);
      inicial.forEach(fila => this.idsCargados.add(this.getRowId(fila)));
      this.filasVisibles = [...inicial];
      this.currentIndex = this.filasVisibles.length;
    }
    
    if(this.mostrarTotal &&  (changes['datos'] || changes['mostrarTotal'])){
      this.totales = this.calcularTotales()
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
    nuevoUnicos.forEach(fila => this.idsCargados.add(this.getRowId(fila)));
    this.filasVisibles = [...this.filasVisibles, ...nuevoUnicos];
    this.currentIndex = nextIndex;
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
    // Reiniciar paginación y control de duplicados
    this.currentIndex = 0;
    this.idsCargados.clear();
    // Cargar primeros datos ordenados
    const nuevosDatos = this.datos.slice(0, this.pageSize + this.buffer);
    const nuevoUnicos = nuevosDatos.filter(fila => !this.idsCargados.has(this.getRowId(fila)));
    nuevoUnicos.forEach(fila => this.idsCargados.add(this.getRowId(fila)));
    this.filasVisibles = nuevoUnicos;
    this.currentIndex = this.pageSize + this.buffer;
  }

  onScroll(event: Event): void {

    const element = event.target as HTMLElement;
    const nuevoScrollTop = element.scrollTop;
    // Detectar si el scroll vertical realmente cambió
    if (nuevoScrollTop !== this.ultimoScrollTop) {
      this.ultimoScrollTop = nuevoScrollTop;
      const atBottom = nuevoScrollTop + element.clientHeight >= element.scrollHeight - 10;
      if (atBottom) {
        this.loadMore();
      }
    }
  }

  getRowId(fila: any): string {
    return JSON.stringify(fila);
  }

  copiarTabla() {
    const tablaOriginal = document.getElementById('tablaDatos') as HTMLTableElement;
    if (!tablaOriginal) return;
    let textoPlano = '';
    const limpiarNumero = (valor: string): string => {
      return valor
        .replace(/[^\d,.-]/g, '') // quita todo menos dígitos, comas, puntos, guiones
        .replace(/\.(?=\d{3})/g, '') // elimina puntos de miles
        .replace(',', '.'); // reemplaza coma decimal por punto
    };
    for (const fila of tablaOriginal.rows) {
      const celdasTexto = Array.from(fila.cells).map(celda => {
        let texto = celda.textContent?.trim().replace(/\u00A0/g, ' ') || '';
        if (texto.includes('$')) {
          texto = limpiarNumero(texto);
        }
        return texto;
      });
      textoPlano += celdasTexto.join('\t') + '\n';
    }
    navigator.clipboard.writeText(textoPlano)
      .then(() => alert('Tabla copiada al portapapeles.'))
      .catch(err => console.error('Error al copiar la tabla como texto plano', err));
  }
   

  resetScroll() {
    if (this.scrollContent) {
      this.scrollContent.nativeElement.scrollTop = 0;
      this.scrollContent.nativeElement.scrollLeft = 0;
    }
  }

  getColumnasMoneda(): string[] {
    return this.columnas.filter(col => col.endsWith('_M'));
  }

  calcularTotales(): { [col: string]: number } {
    const totales: { [col: string]: number } = {};
    this.getColumnasMoneda().forEach(col => {
      totales[col] = (this.datos || []).reduce((sum, fila) => {
        let raw = this.getValor(fila, col);
        if (typeof raw === 'string') {
          raw = raw.replace(/[^\d,.-]/g, '') // elimina $, espacios, etc.
                   .replace(/\,/g, '')       // quita puntos de miles
                   .replace('.', ',');       // convierte coma a punto decimal
        }
        const val = parseFloat(raw) || 0;
        return sum + val;
      }, 0);
    });
    return totales;
  }


}
