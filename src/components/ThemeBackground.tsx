import React, { useEffect, useRef } from 'react';
import type { Theme } from '../types';

interface Props { theme: Theme }

// ── Particle helpers ──────────────────────────────────────────────────────────
function rand(min: number, max: number) { return min + Math.random() * (max - min); }

// ── Per-theme configs ─────────────────────────────────────────────────────────

function drawSakura(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type P = { x:number; y:number; size:number; speed:number; drift:number; angle:number; rot:number; opacity:number };
  const petals: P[] = Array.from({ length: 16 }, () => ({
    x: rand(0, W), y: rand(-H, H), size: rand(4, 9),
    speed: rand(0.4, 1.0), drift: rand(-0.4, 0.4),
    angle: rand(0, Math.PI * 2), rot: rand(-0.015, 0.015), opacity: rand(0.25, 0.55),
  }));
  return (dt: number) => {
    void dt;
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = '#f4a0b8';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      // inner shimmer
      ctx.fillStyle = 'rgba(255,220,235,0.4)';
      ctx.beginPath();
      ctx.ellipse(-p.size * 0.2, -p.size * 0.1, p.size * 0.4, p.size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      p.y += p.speed; p.x += p.drift; p.angle += p.rot;
      if (p.y > H + 20) { p.y = -20; p.x = rand(0, W); }
    }
  };
}

function drawGalaxy(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Star = { x:number; y:number; r:number; opacity:number; twinkle:number; phase:number };
  type Shoot = { x:number; y:number; vx:number; vy:number; len:number; life:number; maxLife:number; active:boolean };
  const stars: Star[] = Array.from({ length: 80 }, () => ({
    x: rand(0, W), y: rand(0, H), r: rand(0.5, 2.5),
    opacity: rand(0.3, 0.9), twinkle: rand(0.01, 0.04), phase: rand(0, Math.PI * 2),
  }));
  const shoot: Shoot = { x: 0, y: 0, vx: 0, vy: 0, len: 0, life: 0, maxLife: 0, active: false };
  let shootTimer = 0;
  const colors = ['#9988ff', '#88c0f8', '#ffffff', '#ccaaff'];
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    shootTimer++;
    if (shootTimer > 180 && !shoot.active) {
      shoot.x = rand(0, W * 0.7); shoot.y = rand(0, H * 0.4);
      const ang = rand(0.3, 0.7); shoot.vx = Math.cos(ang) * 8; shoot.vy = Math.sin(ang) * 8;
      shoot.len = rand(60, 120); shoot.maxLife = 40; shoot.life = 0; shoot.active = true;
      shootTimer = 0;
    }
    for (const s of stars) {
      s.phase += s.twinkle;
      const a = s.opacity * (0.6 + 0.4 * Math.sin(s.phase));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = colors[Math.floor(s.r * 1.5) % colors.length];
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (shoot.active) {
      const t = shoot.life / shoot.maxLife;
      ctx.save();
      ctx.globalAlpha = (1 - t) * 0.8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(shoot.x, shoot.y);
      ctx.lineTo(shoot.x - shoot.vx * shoot.len / 20, shoot.y - shoot.vy * shoot.len / 20);
      ctx.stroke();
      ctx.restore();
      shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life++;
      if (shoot.life >= shoot.maxLife) shoot.active = false;
    }
  };
}

function drawSeaside(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Bubble = { x:number; y:number; r:number; speed:number; wobble:number; phase:number; opacity:number };
  const bubbles: Bubble[] = Array.from({ length: 20 }, () => ({
    x: rand(0, W), y: rand(0, H),
    r: rand(3, 12), speed: rand(0.2, 0.6),
    wobble: rand(0.3, 1.0), phase: rand(0, Math.PI * 2), opacity: rand(0.1, 0.35),
  }));
  // A few little shell shapes
  type Shell = { x:number; y:number; size:number; angle:number; opacity:number };
  const shells: Shell[] = Array.from({ length: 6 }, () => ({
    x: rand(0, W), y: rand(H * 0.6, H), size: rand(8, 18), angle: rand(0, Math.PI * 2), opacity: rand(0.1, 0.25),
  }));
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    // shells
    for (const s of shells) {
      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.strokeStyle = '#60d0c8';
      ctx.lineWidth = 1.5;
      // simple shell spiral
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        ctx.arc(0, 0, s.size * (0.3 + i * 0.25), 0, Math.PI * 1.5);
      }
      ctx.stroke();
      ctx.restore();
    }
    // bubbles
    for (const b of bubbles) {
      b.phase += 0.02;
      const ox = Math.sin(b.phase) * b.wobble * 10;
      ctx.save();
      ctx.globalAlpha = b.opacity;
      ctx.strokeStyle = '#88e0d8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(b.x + ox, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
      // highlight
      ctx.globalAlpha = b.opacity * 0.6;
      ctx.fillStyle = 'rgba(200,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(b.x + ox - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      b.y -= b.speed;
      if (b.y < -20) { b.y = H + 20; b.x = rand(0, W); }
    }
  };
}

function drawMatcha(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Leaf = { x:number; y:number; size:number; speed:number; drift:number; angle:number; rotSpeed:number; opacity:number };
  const leaves: Leaf[] = Array.from({ length: 14 }, () => ({
    x: rand(0, W), y: rand(-H, H), size: rand(5, 12),
    speed: rand(0.3, 0.8), drift: rand(-0.5, 0.5),
    angle: rand(0, Math.PI * 2), rotSpeed: rand(-0.02, 0.02), opacity: rand(0.2, 0.5),
  }));
  // Swirl lines
  type Swirl = { x:number; y:number; r:number; startAngle:number; speed:number; opacity:number };
  const swirls: Swirl[] = Array.from({ length: 5 }, () => ({
    x: rand(0, W), y: rand(0, H), r: rand(20, 50),
    startAngle: rand(0, Math.PI * 2), speed: rand(0.003, 0.008), opacity: rand(0.04, 0.1),
  }));
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    for (const s of swirls) {
      s.startAngle += s.speed;
      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.strokeStyle = '#8ccd7c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, s.startAngle, s.startAngle + Math.PI * 1.4);
      ctx.stroke();
      ctx.restore();
    }
    for (const l of leaves) {
      ctx.save();
      ctx.globalAlpha = l.opacity;
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.fillStyle = '#7cc464';
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size * 0.4, l.size, 0, 0, Math.PI * 2);
      ctx.fill();
      // vein
      ctx.strokeStyle = '#a8e090';
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = l.opacity * 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -l.size * 0.8);
      ctx.lineTo(0, l.size * 0.8);
      ctx.stroke();
      ctx.restore();
      l.y += l.speed; l.x += l.drift; l.angle += l.rotSpeed;
      if (l.y > H + 20) { l.y = -20; l.x = rand(0, W); }
    }
  };
}

function drawChai(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Wisp = { x:number; baseX:number; y:number; height:number; speed:number; phase:number; opacity:number; wobble:number };
  const wisps: Wisp[] = Array.from({ length: 10 }, () => {
    const x = rand(W * 0.1, W * 0.9);
    return { x, baseX: x, y: rand(H * 0.4, H), height: rand(60, 130), speed: rand(0.3, 0.7), phase: rand(0, Math.PI * 2), opacity: rand(0.06, 0.18), wobble: rand(15, 35) };
  });
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    for (const w of wisps) {
      w.phase += 0.025;
      w.y -= w.speed;
      w.x = w.baseX + Math.sin(w.phase) * w.wobble;
      if (w.y < -w.height) { w.y = H; w.baseX = rand(W * 0.1, W * 0.9); w.x = w.baseX; }
      const grad = ctx.createLinearGradient(w.x, w.y, w.x, w.y - w.height);
      grad.addColorStop(0, `rgba(196,122,42,${w.opacity})`);
      grad.addColorStop(0.5, `rgba(220,160,80,${w.opacity * 0.5})`);
      grad.addColorStop(1, 'rgba(220,160,80,0)');
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w.x, w.y);
      for (let i = 1; i <= 8; i++) {
        const t = i / 8;
        const cx = w.x + Math.sin(w.phase + t * Math.PI) * w.wobble * 0.6;
        const cy = w.y - t * w.height;
        ctx.quadraticCurveTo(cx, cy - w.height / 16, w.x + Math.sin(w.phase + t * Math.PI + 0.5) * w.wobble * 0.3, cy);
      }
      ctx.stroke();
      ctx.restore();
    }
  };
}

function drawStrawberry(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Drop = { x:number; y:number; speed:number; type:'heart'|'dot'; size:number; opacity:number; swing:number; phase:number };
  const drops: Drop[] = Array.from({ length: 18 }, () => ({
    x: rand(0, W), y: rand(-H, H),
    speed: rand(0.4, 0.9),
    type: Math.random() > 0.4 ? 'heart' : 'dot' as 'heart' | 'dot',
    size: rand(5, 11),
    opacity: rand(0.2, 0.45),
    swing: rand(10, 25), phase: rand(0, Math.PI * 2),
  }));
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    for (const d of drops) {
      d.phase += 0.02; d.y += d.speed; d.x += Math.sin(d.phase) * 0.3;
      if (d.y > H + 20) { d.y = -20; d.x = rand(0, W); }
      ctx.save();
      ctx.globalAlpha = d.opacity;
      ctx.fillStyle = d.type === 'heart' ? '#ff6b8a' : '#ffb0c0';
      if (d.type === 'heart') {
        ctx.translate(d.x, d.y);
        const s = d.size * 0.055;
        ctx.scale(s, s);
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.bezierCurveTo(-9, -14, -18, -5, -9, 4);
        ctx.lineTo(0, 14);
        ctx.lineTo(9, 4);
        ctx.bezierCurveTo(18, -5, 9, -14, 0, -5);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
}

function drawSchool(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Item = { x:number; y:number; speed:number; type:'pencil'|'star'|'dot'; size:number; angle:number; rotSpeed:number; opacity:number };
  const items: Item[] = Array.from({ length: 16 }, () => ({
    x: rand(0, W), y: rand(-H, H),
    speed: rand(0.3, 0.7),
    type: ['pencil','star','dot'][Math.floor(Math.random()*3)] as Item['type'],
    size: rand(6, 14), angle: rand(0, Math.PI * 2),
    rotSpeed: rand(-0.015, 0.015), opacity: rand(0.12, 0.3),
  }));
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    for (const item of items) {
      item.y += item.speed; item.angle += item.rotSpeed;
      if (item.y > H + 20) { item.y = -20; item.x = rand(0, W); }
      ctx.save();
      ctx.globalAlpha = item.opacity;
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      if (item.type === 'pencil') {
        ctx.fillStyle = '#ffd060';
        ctx.fillRect(-item.size * 0.15, -item.size * 0.5, item.size * 0.3, item.size * 0.8);
        ctx.fillStyle = '#ff9040';
        ctx.beginPath();
        ctx.moveTo(-item.size * 0.15, item.size * 0.3);
        ctx.lineTo(item.size * 0.15, item.size * 0.3);
        ctx.lineTo(0, item.size * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#c0a040';
        ctx.fillRect(-item.size * 0.18, -item.size * 0.55, item.size * 0.36, item.size * 0.15);
      } else if (item.type === 'star') {
        ctx.fillStyle = '#4060d0';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const ai = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
          if (i === 0) ctx.moveTo(Math.cos(a) * item.size * 0.5, Math.sin(a) * item.size * 0.5);
          else ctx.lineTo(Math.cos(a) * item.size * 0.5, Math.sin(a) * item.size * 0.5);
          ctx.lineTo(Math.cos(ai) * item.size * 0.25, Math.sin(ai) * item.size * 0.25);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#80d080';
        ctx.beginPath();
        ctx.arc(0, 0, item.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
}

function drawDark(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Firefly = { x:number; y:number; r:number; vx:number; vy:number; phase:number; speed:number; opacity:number };
  const flies: Firefly[] = Array.from({ length: 25 }, () => ({
    x: rand(0, W), y: rand(0, H), r: rand(1, 3),
    vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
    phase: rand(0, Math.PI * 2), speed: rand(0.02, 0.05), opacity: rand(0.2, 0.7),
  }));
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    for (const f of flies) {
      f.phase += f.speed;
      f.x += f.vx + Math.sin(f.phase * 0.7) * 0.4;
      f.y += f.vy + Math.cos(f.phase * 0.5) * 0.4;
      if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
      if (f.y < 0) f.y = H; if (f.y > H) f.y = 0;
      const a = f.opacity * (0.4 + 0.6 * Math.sin(f.phase));
      ctx.save();
      ctx.globalAlpha = a;
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 4);
      grd.addColorStop(0, '#f7a8c0');
      grd.addColorStop(1, 'rgba(247,168,192,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
}

function drawLight(ctx: CanvasRenderingContext2D, W: number, H: number) {
  type Sparkle = { x:number; y:number; size:number; phase:number; speed:number; opacity:number };
  const sparkles: Sparkle[] = Array.from({ length: 30 }, () => ({
    x: rand(0, W), y: rand(0, H), size: rand(2, 6),
    phase: rand(0, Math.PI * 2), speed: rand(0.02, 0.06), opacity: rand(0.1, 0.4),
  }));
  return (_dt: number) => {
    ctx.clearRect(0, 0, W, H);
    for (const s of sparkles) {
      s.phase += s.speed;
      const a = s.opacity * Math.abs(Math.sin(s.phase));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#e06080';
      ctx.beginPath();
      // 4-pointed star
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2;
        const angIn = ang + Math.PI / 4;
        if (i === 0) ctx.moveTo(s.x + Math.cos(ang) * s.size, s.y + Math.sin(ang) * s.size);
        else ctx.lineTo(s.x + Math.cos(ang) * s.size, s.y + Math.sin(ang) * s.size);
        ctx.lineTo(s.x + Math.cos(angIn) * s.size * 0.4, s.y + Math.sin(angIn) * s.size * 0.4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (Math.sin(s.phase) < -0.99) {
        s.x = rand(0, W); s.y = rand(0, H);
      }
    }
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export const ThemeBackground: React.FC<Props> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width, H = canvas.height;

    let drawFrame: (dt: number) => void;
    switch (theme) {
      case 'sakura':    drawFrame = drawSakura(ctx, W, H); break;
      case 'galaxy':    drawFrame = drawGalaxy(ctx, W, H); break;
      case 'seaside':   drawFrame = drawSeaside(ctx, W, H); break;
      case 'matcha':    drawFrame = drawMatcha(ctx, W, H); break;
      case 'chai':      drawFrame = drawChai(ctx, W, H); break;
      case 'strawberry':drawFrame = drawStrawberry(ctx, W, H); break;
      case 'school':    drawFrame = drawSchool(ctx, W, H); break;
      case 'light':     drawFrame = drawLight(ctx, W, H); break;
      default:          drawFrame = drawDark(ctx, W, H); break;
    }

    let animId: number;
    let last = 0;
    const loop = (ts: number) => {
      drawFrame(ts - last);
      last = ts;
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.65 }}
    />
  );
};
