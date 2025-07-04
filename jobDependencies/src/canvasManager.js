export class CanvasManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  clear() {
    this.ctx.fillStyle = "black"; 
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawText(text, x, y, color = "lightBlue", font = "20px Arial",align = "center") {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, x, y);
  }

  drawBox(x, y, width, height, color = "black", strokeColor = "lightBlue",lineWidth = 2) {
    this.ctx.setLineDash([]);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  drawLine(fromX, fromY, toX, toY, color = "white", lineWidth = 2,dashed = false) {
    if (dashed) {
      this.ctx.setLineDash([5, 5]);
    } else {
      this.ctx.setLineDash([]);
    }
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }

  drawArrowhead(fromX, fromY, toX, toY, arrowSize, color) {
    const angle = Math.atan2(toY - fromY, toX - fromX);

    const arrowX1 = fromX + arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = fromY + arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = fromX + arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = fromY + arrowSize * Math.sin(angle + Math.PI / 6);

    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY); 
    this.ctx.lineTo(arrowX1, arrowY1); 
    this.ctx.lineTo(arrowX2, arrowY2); 
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}
