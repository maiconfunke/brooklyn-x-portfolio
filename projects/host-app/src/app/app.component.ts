import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { IDragPosition } from '../interfaces/drag-position.interface';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "../componentes/folder/folder.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragDropModule, CommonModule, FolderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('container') containerRef!: ElementRef;

  folders = [
    {
      id: 1,
      position: { x: 0, y: 10 } as IDragPosition,
      label: 'Meus arquivos',
      zIndex: 1
    },
    {
      id: 2,
      position: { x: 0, y: 95 } as IDragPosition,
      label: 'Minhas imagens',
      zIndex: 1
    },
    {
      id: 3,
      position: { x: 0, y: 190 } as IDragPosition,
      label: 'Meus videos',
      zIndex: 1
    },
  ];

  readonly margin = 0;

  onDragMoved(event: CdkDragMove, dragPosition: IDragPosition) {
    const container = this.containerRef.nativeElement;
    const icon = event.source.element.nativeElement;
  
    const containerRect = container.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
  
    const offsetX = iconRect.width / 2;
    const offsetY = iconRect.height / 2;
  
    const pointerX = event.pointerPosition.x - containerRect.left - offsetX;
    const pointerY = event.pointerPosition.y - containerRect.top - offsetY;
  
    const maxX = container.clientWidth - iconRect.width - this.margin;
    const maxY = container.clientHeight - iconRect.height - this.margin;
  
    dragPosition.x = Math.min(Math.max(pointerX, this.margin), maxX);
    dragPosition.y = Math.min(Math.max(pointerY, this.margin), maxY);
  
    event.source._dragRef.setFreeDragPosition(dragPosition);
  }
  

  onDragEnded(event: CdkDragEnd, dragPosition: IDragPosition) {
    const gridSize = 95;
  
    // 1. Coordenadas do grid
    const targetX = Math.round(dragPosition.x / gridSize);
    const targetY = Math.round(dragPosition.y / gridSize);
  
    // 2. Verifica se já existe um item ocupando essa posição
    const isOccupied = this.folders.some(icon => {
      const iconX = Math.round(icon.position.x / gridSize);
      const iconY = Math.round(icon.position.y / gridSize);
      return iconX === targetX && iconY === targetY && icon.position !== dragPosition;
    });
  
    let finalX = targetX;
    let finalY = targetY;
  
    if (isOccupied) {
      // 3. Busca uma posição livre próxima
      const directions = [
        [1, 0],   // direita
        [-1, 0],  // esquerda
        [0, 1],   // abaixo
        [0, -1],  // acima
      ];
  
      for (let [dx, dy] of directions) {
        const newX = targetX + dx;
        const newY = targetY + dy;
  
        const found = this.folders.some(icon => {
          const iconX = Math.round(icon.position.x / gridSize);
          const iconY = Math.round(icon.position.y / gridSize);
          return iconX === newX && iconY === newY && icon.position !== dragPosition;
        });
  
        if (!found) {
          finalX = newX;
          finalY = newY;
          break;
        }
      }
    }
  
    // 4. Converte de volta para coordenadas absolutas e aplica
    dragPosition.x = finalX * gridSize;
    dragPosition.y = finalY * gridSize;
  
    console.log(dragPosition)
    event.source._dragRef.setFreeDragPosition(dragPosition);
  }

  onDragStarted(draggedItem: any) {
    const maxZIndex = Math.max(...this.folders.map(f => f.zIndex || 1));
    draggedItem.zIndex = maxZIndex + 1;
  }
  
}
