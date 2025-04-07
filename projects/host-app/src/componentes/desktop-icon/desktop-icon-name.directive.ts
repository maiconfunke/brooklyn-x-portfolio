import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[desktop-icon-name]',
  standalone: true,
})
export class DesktopIconNameDirective implements OnChanges {
  @Input('desktop-icon-name')
    nameIcon!: string;
 
  constructor(private el: ElementRef, private renderer: Renderer2){ }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['desktop-icon-name'] && this.nameIcon) {
        this.renderer.setStyle(
            this.el.nativeElement,
            'background-image',
            `url(/icons/${this.nameIcon}_icon.png)`
        )
    }
  }
}
