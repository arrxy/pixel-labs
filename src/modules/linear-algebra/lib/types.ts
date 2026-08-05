export type Vec2 = { x: number; y: number }

export type Vec3 = { x: number; y: number; z: number }

export type CanvasColors = {
  a: string
  b: string
  ink: string
  grid: string
  axis: string
}

export type DragTarget =
  | { mode: 'single' }
  | { mode: 'pair'; which: 'a' | 'b' }

export const DEFAULT_COLORS: CanvasColors = {
  a: '#0f6e63',
  b: '#d9622b',
  ink: '#1a1a1a',
  grid: '#ecebe4',
  axis: '#cfccc0',
}
