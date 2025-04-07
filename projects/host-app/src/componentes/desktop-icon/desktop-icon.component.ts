import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDragPosition } from '../../interfaces/drag-position.interface';

@Component({
  selector: 'desktop-icon',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './desktop-icon.component.html',
  styleUrls: ['./desktop-icon.component.scss'],
})
export class DesktopIconComponent {
  @Input('data') data: any;
  @Output() onDragEnded = new EventEmitter();
  @Output() onDragMoved = new EventEmitter();
  @Output() onDragStarted = new EventEmitter();

  onDragEndedEmitter(event: CdkDragEnd, dragPosition: IDragPosition) {
    this.onDragEnded.emit({ event, dragPosition });
  }
  onDragMovedEmitter(event: CdkDragMove, dragPosition: IDragPosition) {
    this.onDragMoved.emit({ event, dragPosition });
  }
  onDragStartedEmitter(draggedItem: any) {
    this.onDragStarted.emit(draggedItem);
  }
}
