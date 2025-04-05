import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('container') containerRef!: ElementRef;
  dragPosition = { x: 10, y: 10 };
  private animationFrameId: number | null = null;
  private targetPosition = { x: 0, y: 0 };

  onDragMoved(event: CdkDragMove) {
    const container = this.containerRef.nativeElement;
    const icon = event.source.element.nativeElement;

    const containerRect = container.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();

    const offsetX = iconRect.width / 2;
    const offsetY = iconRect.height / 2;

    const margin = 16;

    let newX = event.pointerPosition.x - containerRect.left - offsetX;
    let newY = event.pointerPosition.y - containerRect.top - offsetY;

    if (newX < margin) newX = margin;
    if (newX + iconRect.width + margin > containerRect.width) {
      newX = containerRect.width - iconRect.width - margin;
    }

    if (newY < margin) newY = margin;
    if (newY + iconRect.height + margin > containerRect.height) {
      newY = containerRect.height - iconRect.height - margin;
    }

    this.targetPosition = { x: newX, y: newY };
    this.smoothMove();
  }

  smoothMove() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = () => {
      const dx = this.targetPosition.x - this.dragPosition.x;
      const dy = this.targetPosition.y - this.dragPosition.y;

      // velocidade (quanto menor, mais lento)
      const easing = 0.1;

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        this.dragPosition = {
          x: this.dragPosition.x + dx * easing,
          y: this.dragPosition.y + dy * easing,
        };

        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.dragPosition = { ...this.targetPosition };
      }
    };

    animate();
  }
}
