import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnDestroy, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<void>();

  @Input() size: 'sm' | 'md' | 'lg' = 'lg';
  @Input() title?: string; 

  ngOnInit() {
    document.body.style.overflow = 'hidden'; 
  }

  ngOnDestroy() {
    document.body.style.overflow = ''; 
  }

  close() {
    this.closed.emit();
  }
}
