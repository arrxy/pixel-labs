import { useState } from 'react'
import { Playground } from '../../components/Diagram'
import { MathParagraph } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { Vec3Inputs } from '../../components/Vec3Inputs'
import { add3, fmt, sub3 } from '../../lib/math3'
import { createArrow, createDashedLine, SCENE_COLORS } from '../../lib/scene3d'
import type { Vec3 } from '../../lib/types'

type Mode = 'add' | 'sub'

export function Addition3D() {
  const [a, setA] = useState<Vec3>({ x: 2, y: 0.5, z: 0.5 })
  const [b, setB] = useState<Vec3>({ x: 0.5, y: 2, z: 1 })
  const [mode, setMode] = useState<Mode>('add')
  const result = mode === 'add' ? add3(a, b) : sub3(a, b)

  return (
    <Section id="addition3d" title="Addition & subtraction (3D)">
      <MathParagraph>
        {`Tip-to-tail still works in 3D: $a+b$ places $b$ at the tip of $a$. Subtraction is $a+(-b)$.`}
      </MathParagraph>
      <Playground label="Playground: toggle add / subtract">
        <Scene3D
          deps={[a, b, mode]}
          setup={({ root }) => {
            root.add(createArrow(a, SCENE_COLORS.a))
            if (mode === 'add') {
              root.add(createArrow(b, SCENE_COLORS.b, { from: a }))
              root.add(createArrow(result, SCENE_COLORS.muted))
              root.add(createDashedLine(b, result, SCENE_COLORS.muted))
            } else {
              root.add(createArrow(b, SCENE_COLORS.b))
              root.add(createArrow(result, SCENE_COLORS.muted))
            }
          }}
        />
        <div className="controls-col">
          <div className="vec-pair">
            <Vec3Inputs value={a} onChange={setA} prefix="a" color="var(--accent)" />
            <Vec3Inputs value={b} onChange={setB} prefix="b" color="var(--secondary)" />
          </div>
          <div className="btn-row">
            <button type="button" className={`mode-btn${mode === 'add' ? ' active' : ''}`} onClick={() => setMode('add')}>
              a + b
            </button>
            <button type="button" className={`mode-btn${mode === 'sub' ? ' active' : ''}`} onClick={() => setMode('sub')}>
              a − b
            </button>
          </div>
          <div className="mono-stat">
            result = ({fmt(result.x)}, {fmt(result.y)}, {fmt(result.z)})
          </div>
        </div>
      </Playground>
    </Section>
  )
}
