import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { IDragPosition } from '../../interfaces/drag-position.interface';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
})
export class WindowComponent {
  @Input('data') data: any;
  isMaximized = false;
  lastSizeWindow!: IDragPosition;
  @Output() onCloseWindow = new EventEmitter();
  @Output() onDragEnded = new EventEmitter();
  @Output() onDragMoved = new EventEmitter();
  @Output() onDragStarted = new EventEmitter();

  public toggleMaximize(): void {
    if (!this.isMaximized) {
        this.isMaximized = true;
        this.lastSizeWindow = {...this.data.position};
        this.data.position = { x: 0, y: 0 } as IDragPosition;
    } else {
        this.data.position = this.lastSizeWindow;
        this.isMaximized = false;
    }
  }

  onDragEndedEmitter( event : any, dragPosition: IDragPosition) {
    this.onDragEnded.emit({ event, dragPosition });
  }
  onDragMovedEmitter(event: CdkDragMove, dragPosition: IDragPosition) {
    this.lastSizeWindow = dragPosition;
    this.onDragMoved.emit({ event, dragPosition });
  }
  onDragStartedEmitter(draggedItem: any) {
   //  this.onDragStarted.emit(draggedItem);
  }

  closeWindow(id: string): void {
    this.onCloseWindow.emit(id)
  }
}
