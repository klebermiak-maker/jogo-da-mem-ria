/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
}

export class ConfettiCannon {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ConfettiParticle[] = [];
  private animationId: number | null = null;
  private isRunning: boolean = false;

  private colors = [
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#ef4444', // Red
    '#fbbf24'  // Gold
  ];

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  fire(durationMs: number = 3500) {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.resize();
    this.particles = [];

    const width = this.canvas.width;
    const height = this.canvas.height;
    const totalCount = 140;

    // Canhões duplos (esquerdo e direito) disparando para o centro
    for (let i = 0; i < totalCount; i++) {
      const isLeft = i % 2 === 0;
      const startX = isLeft ? width * 0.15 : width * 0.85;
      const startY = height * 0.85;

      const angle = isLeft
        ? (Math.PI / 180) * (290 + Math.random() * 45) // ~310° (para cima e direita)
        : (Math.PI / 180) * (210 + Math.random() * 45); // ~230° (para cima e esquerda)

      const speed = 12 + Math.random() * 14;
      const vx = Math.cos(angle) * speed + (isLeft ? 2 : -2);
      const vy = Math.sin(angle) * speed;

      const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'rect', 'circle', 'star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      this.particles.push({
        x: startX,
        y: startY,
        w: 8 + Math.random() * 8,
        h: 6 + Math.random() * 6,
        vx,
        vy,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 12 - 6,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
        shape,
        opacity: 1
      });
    }

    // Adiciona confetes de chuva do topo para preencher a tela
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 100,
        w: 7 + Math.random() * 6,
        h: 5 + Math.random() * 5,
        vx: Math.random() * 4 - 2,
        vy: 3 + Math.random() * 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.05 + Math.random() * 0.05,
        shape: 'rect',
        opacity: 1
      });
    }

    this.isRunning = true;
    const startTime = performance.now();

    const loop = (currentTime: number) => {
      if (!this.isRunning || !this.ctx || !this.canvas) return;

      const elapsed = currentTime - startTime;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let aliveCount = 0;
      const gravity = 0.22;
      const drag = 0.985;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= drag;
        p.rotation += p.rotSpeed;
        p.wobble += p.wobbleSpeed;

        // Fading suave nos últimos 800ms
        if (elapsed > durationMs - 800) {
          p.opacity = Math.max(0, 1 - (elapsed - (durationMs - 800)) / 800);
        }

        if (p.y < this.canvas.height + 40 && p.opacity > 0) {
          aliveCount++;
          this.ctx.save();
          this.ctx.globalAlpha = p.opacity;
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.fillStyle = p.color;

          // Efeito 3D de papel girando no ar (escala horizontal oscilante)
          const scaleX = Math.cos(p.wobble);

          if (p.shape === 'rect') {
            this.ctx.fillRect((-p.w * scaleX) / 2, -p.h / 2, p.w * scaleX, p.h);
          } else if (p.shape === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, (p.w / 2) * Math.abs(scaleX), 0, Math.PI * 2);
            this.ctx.fill();
          } else {
            // Estrelinha brilhante
            this.drawStar(this.ctx, 0, 0, 4, p.w * 0.6, p.w * 0.25);
          }

          this.ctx.restore();
        }
      }

      if (elapsed < durationMs && aliveCount > 0) {
        this.animationId = requestAnimationFrame(loop);
      } else {
        this.stop();
      }
    };

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.animationId = requestAnimationFrame(loop);
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export const globalConfetti = new ConfettiCannon();
