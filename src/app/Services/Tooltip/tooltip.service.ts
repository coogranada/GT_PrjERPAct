import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

private tooltip!: HTMLDivElement;
  private activeElement: HTMLElement | null = null;

  constructor() {
    this.createTooltip();
    this.initEvents();
  }

  private createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip-global';
    document.body.appendChild(this.tooltip);
  }

  private initEvents() {
    document.addEventListener('mouseover', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-tooltip]') as HTMLElement | null;

      if (!el) return;

      this.activeElement = el;
      this.show(el);
    });

    document.addEventListener('mousemove', () => {
      if (!this.activeElement) return;
      this.position(this.activeElement);
    });

    document.addEventListener('mouseout', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-tooltip]')) {
        this.hide();
      }
    });
  }

  private show(el: HTMLElement) {
    const text = el.getAttribute('data-tooltip');
    if (!text) return;

    this.tooltip.textContent = text;
    this.tooltip.style.opacity = '1';

    this.position(el);
  }

  private position(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const tooltipHeight = this.tooltip.offsetHeight;

    this.tooltip.style.top = `${rect.top - tooltipHeight - 8}px`;
    this.tooltip.style.left = `${rect.left + rect.width / 2}px`;
    this.tooltip.style.transform = 'translateX(-50%)';
  }

  private hide() {
    this.tooltip.style.opacity = '0';
    this.activeElement = null;
  }

}
