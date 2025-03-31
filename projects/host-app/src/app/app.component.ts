import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  @ViewChild('canvasElement') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // Posição e dimensões do retângulo
  private rect = { x: 100, y: 100, width: 200, height: 150, color: 'blue' };
  private dragging: boolean = false; // Flag para saber se estamos arrastando
  private offsetX: number = 0; // Offset de X para o arrasto
  private offsetY: number = 0; // Offset de Y para o arrasto

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.drawRectangle(); // Desenha o retângulo na tela

    // Adiciona os listeners de mouse para permitir o arrasto
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  // Função para desenhar o retângulo
  private drawRectangle(): void {
    this.ctx.fillStyle = this.rect.color;
    this.ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }

  // Detecta quando o mouse é pressionado
  private onMouseDown(event: MouseEvent): void {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Verifica se o mouse está dentro do retângulo
    if (
      mouseX >= this.rect.x &&
      mouseX <= this.rect.x + this.rect.width &&
      mouseY >= this.rect.y &&
      mouseY <= this.rect.y + this.rect.height
    ) {
      this.dragging = true; // Inicia o arrasto
      this.offsetX = mouseX - this.rect.x; // Calcula o deslocamento
      this.offsetY = mouseY - this.rect.y; // Calcula o deslocamento
    }
  }

  // Move o retângulo com o movimento do mouse
  private onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      // Atualiza a posição do retângulo com base no movimento do mouse
      this.rect.x = mouseX - this.offsetX;
      this.rect.y = mouseY - this.offsetY;

      this.clearCanvas(); // Limpa o canvas
      this.drawRectangle(); // Redesenha o retângulo na nova posição
    }
  }

  // Quando o mouse é solto, termina o arrasto
  private onMouseUp(): void {
    this.dragging = false; // Finaliza o arrasto
  }

  // Limpa o canvas antes de redesenhar
  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }
}
