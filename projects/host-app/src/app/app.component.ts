import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { IDragPosition } from '../interfaces/drag-position.interface';
import { CommonModule } from '@angular/common';
import { DesktopIconComponent } from '../componentes/desktop-icon/desktop-icon.component';
import { WindowComponent } from '../componentes/window/window.component';
import { Utils } from '../shared/Utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DragDropModule,
    CommonModule,
    DesktopIconComponent,
    WindowComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('container') containerRef!: ElementRef;

  openedFolders: any[] = [];
  utils = new Utils();

  desktopIcons = [
    {
      id: 1,
      type: 'folder',
      name: 'folder',
      position: { x: 0, y: 10 } as IDragPosition,
      label: 'Meus arquivos',
      zIndex: 1,
    },
    {
      id: 2,
      type: 'folder',
      name: 'folder',
      position: { x: 0, y: 95 } as IDragPosition,
      label: 'Minhas imagens',
      zIndex: 1,
    },
    {
      id: 3,
      type: 'folder',
      name: 'folder',
      position: { x: 0, y: 190 } as IDragPosition,
      label: 'Meus videos',
      zIndex: 1,
    },
    {
      id: 4,
      type: 'app',
      name: 'chrome',
      position: { x: 0, y: 285 } as IDragPosition,
      label: 'Chrome',
      zIndex: 1,
    },
    {
      id: 5,
      type: 'app',
      name: 'vscode',
      position: { x: 0, y: 380 } as IDragPosition,
      label: 'Visual Studio',
      zIndex: 1,
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

    // event.source._dragRef.setFreeDragPosition(dragPosition);
  }

  onDragEnded(event: CdkDragEnd, dragPosition: IDragPosition) {
    const gridSize = 95;

    // 1. Coordenadas do grid
    const targetX = Math.round(dragPosition.x / gridSize);
    const targetY = Math.round(dragPosition.y / gridSize);

    // 2. Verifica se já existe um item ocupando essa posição
    const isOccupied = this.desktopIcons.some((icon) => {
      const iconX = Math.round(icon.position.x / gridSize);
      const iconY = Math.round(icon.position.y / gridSize);
      return (
        iconX === targetX && iconY === targetY && icon.position !== dragPosition
      );
    });

    let finalX = targetX;
    let finalY = targetY;

    if (isOccupied) {
      // 3. Busca uma posição livre próxima
      const directions = [
        [1, 0], // direita
        [-1, 0], // esquerda
        [0, 1], // abaixo
        [0, -1], // acima
      ];

      for (let [dx, dy] of directions) {
        const newX = targetX + dx;
        const newY = targetY + dy;

        const found = this.desktopIcons.some((icon) => {
          const iconX = Math.round(icon.position.x / gridSize);
          const iconY = Math.round(icon.position.y / gridSize);
          return (
            iconX === newX && iconY === newY && icon.position !== dragPosition
          );
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

    event.source._dragRef.setFreeDragPosition(dragPosition);
  }

  onDragStarted(draggedItem: any) {
    const maxZIndex = Math.max(...this.desktopIcons.map((f) => f.zIndex || 1));
    draggedItem.zIndex = maxZIndex + 1;
  }

  onDblClick(data: any): void {
    console.log('clicked', data);
    this.openedFolders.push({
      id: this.utils.generateUUID(),
      type: 'window',
      name: '',
      position: { x: 199, y: 150 } as IDragPosition,
      label: 'Meus arquivos',
      zIndex: 1,
    });
  }

  onCloseWindow(winId: string): void {
    this.openedFolders = this.openedFolders.filter((folder) => winId !== folder.id);

    console.log('-->', this.openedFolders)
  }
}
