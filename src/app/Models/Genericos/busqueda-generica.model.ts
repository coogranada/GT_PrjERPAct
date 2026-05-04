export interface BusquedaConfig<T> {
  lista: T[];
  idInput: any;
  nombreInput: any;
  buttonSearch: boolean;

  getId: (item: T) => string;
  getNombre: (item: T) => string;

  onConfirm: (item: T) => void;
  onMultiple: (items: T[]) => void;
  onNotFound?: () => void; 
}