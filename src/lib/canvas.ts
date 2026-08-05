import type { CanvasColors, Vec2 } from './types'

export const OX = 150
export const OY = 150
export const SCALE = 26
export const SIZE = 300

export function u2p(x: number, y: number, ox = OX, oy = OY, scale = SCALE) {
  return { px: ox + x * scale, py: oy - y * scale }
}

export function p2u(px: number, py: number, ox = OX, oy = OY, scale = SCALE) {
  return { x: (px - ox) / scale, y: (oy - py) / scale }
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  col: CanvasColors,
  w: number,
  h: number,
  ox: number,
  oy: number,
  scale: number,
) {
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = col.grid
  ctx.lineWidth = 1
  for (let x = ox % scale; x < w; x += scale) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = oy % scale; y < h; y += scale) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  ctx.strokeStyle = col.axis
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, oy)
  ctx.lineTo(w, oy)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(ox, 0)
  ctx.lineTo(ox, h)
  ctx.stroke()
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  width = 2.5,
  dashed = false,
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  if (dashed) ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  ctx.setLineDash([])
  const ang = Math.atan2(y1 - y0, x1 - x0)
  const hlen = 9
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - hlen * Math.cos(ang - 0.4), y1 - hlen * Math.sin(ang - 0.4))
  ctx.lineTo(x1 - hlen * Math.cos(ang + 0.4), y1 - hlen * Math.sin(ang + 0.4))
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export function polyOutline(
  ctx: CanvasRenderingContext2D,
  pts: Vec2[],
  color: string,
  dashed: boolean,
  ox = OX,
  oy = OY,
  scale = SCALE,
) {
  const pp = pts.map((p) => u2p(p.x, p.y, ox, oy, scale))
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  if (dashed) ctx.setLineDash([4, 4])
  ctx.beginPath()
  pp.forEach((p, i) => (i === 0 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py)))
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

export function snapHalf(v: number, lim: number): number {
  return Math.max(-lim, Math.min(lim, Math.round(v * 2) / 2))
}
