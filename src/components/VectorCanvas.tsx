import { useCallback, useEffect, useRef } from 'react'
import { OX, OY, SCALE, SIZE, p2u, snapHalf } from '../lib/canvas'
import type { DragTarget, Vec2 } from '../lib/types'

type DrawFn = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void

type BaseProps = {
  draw: DrawFn
  width?: number
  height?: number
}

type SingleProps = BaseProps & {
  mode: 'single'
  value: Vec2
  onChange: (v: Vec2) => void
}

type PairProps = BaseProps & {
  mode: 'pair'
  a: Vec2
  b: Vec2
  onChange: (which: 'a' | 'b', v: Vec2) => void
}

type ReadonlyProps = BaseProps & {
  mode?: never
  interactive?: false
}

type Props = SingleProps | PairProps | ReadonlyProps

export function VectorCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<DragTarget | null>(null)
  const width = props.width ?? SIZE
  const height = props.height ?? SIZE
  const interactive = props.mode === 'single' || props.mode === 'pair'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    props.draw(ctx, canvas)
  })

  const onDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return
      const rect = e.currentTarget.getBoundingClientRect()
      const u = p2u(e.clientX - rect.left, e.clientY - rect.top, OX, OY, SCALE)
      if (props.mode === 'single') {
        dragRef.current = { mode: 'single' }
      } else if (props.mode === 'pair') {
        const da = Math.hypot(u.x - props.a.x, u.y - props.a.y)
        const db = Math.hypot(u.x - props.b.x, u.y - props.b.y)
        dragRef.current = { mode: 'pair', which: da < db ? 'a' : 'b' }
      }
    },
    [interactive, props],
  )

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const drag = dragRef.current
      if (!drag || !interactive) return
      const rect = e.currentTarget.getBoundingClientRect()
      const u = p2u(e.clientX - rect.left, e.clientY - rect.top, OX, OY, SCALE)
      const x = snapHalf(u.x, 5)
      const y = snapHalf(u.y, 5)
      if (drag.mode === 'single' && props.mode === 'single') {
        props.onChange({ x, y })
      } else if (drag.mode === 'pair' && props.mode === 'pair') {
        props.onChange(drag.which, { x, y })
      }
    },
    [interactive, props],
  )

  const onUp = useCallback(() => {
    dragRef.current = null
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={interactive ? 'vector-canvas interactive' : 'vector-canvas'}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    />
  )
}
