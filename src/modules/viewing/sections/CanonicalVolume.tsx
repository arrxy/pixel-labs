import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathParagraph, MathText } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { FrustumScene } from '../components/FrustumScene'
import { apply4, cubeCorners, DEFAULT_BOUNDS, divideByW, SAMPLE_CUBES, toHomogeneous } from '../lib/projection'
import { orthographicMatrix, perspectiveMatrix } from '../lib/projection'

export function CanonicalVolume() {
  const [space, setSpace] = useState<'view' | 'canonical'>('view')
  const [mode, setMode] = useState<'orthographic' | 'perspective'>('orthographic')

  const matrix = useMemo(
    () => (mode === 'orthographic' ? orthographicMatrix(DEFAULT_BOUNDS) : perspectiveMatrix(DEFAULT_BOUNDS)),
    [mode],
  )

  const transformed = useMemo(() => {
    if (!matrix) return []
    return SAMPLE_CUBES.map((c) => ({
      color: c.color,
      corners: cubeCorners(c.center, c.size).map((p) => {
        const ndc = divideByW(apply4(matrix, toHomogeneous(p)))
        return ndc ?? p
      }),
    }))
  }, [matrix])

  return (
    <Section id="canonical-volume" title="Canonical view volume">
      <MathParagraph>
        {`Projection maps whatever the camera can see into one shared $2\\times 2\\times 2$ cube, $[-1,1]^3$. Clipping and the later map to pixels then ignore whether you started from a box or a frustum.`}
      </MathParagraph>
      <MathText
        tex={String.raw`\text{view space}\xrightarrow{M_{\mathrm{proj}}}\text{canonical cube }[-1,1]^3`}
        display
      />
      <PriorLectureLinks
        links={[
          { href: '/linear-algebra#translation3d', label: 'Review translation in Part I' },
          { href: '/linear-algebra#scale3d', label: 'scale' },
        ]}
      />
      <Playground label="Playground: view volume vs the canonical cube">
        <FrustumScene
          bounds={DEFAULT_BOUNDS}
          mode={mode}
          cubes={space === 'view' ? SAMPLE_CUBES : []}
          transformedCubes={space === 'canonical' ? transformed : []}
          showVolume={space === 'view'}
          showCanonical={space === 'canonical'}
          showCamera={space === 'view'}
          cameraDistance={space === 'canonical' ? 8 : 14}
          ariaLabel={space === 'view' ? 'View volume in camera space' : 'Geometry mapped into the canonical cube'}
        />
        <div className="controls-col wide">
          <div className="btn-row" role="group" aria-label="Which space to show">
            <button type="button" className={space === 'view' ? 'mode-btn active' : 'mode-btn'} aria-pressed={space === 'view'} onClick={() => setSpace('view')}>
              View space
            </button>
            <button type="button" className={space === 'canonical' ? 'mode-btn active' : 'mode-btn'} aria-pressed={space === 'canonical'} onClick={() => setSpace('canonical')}>
              Canonical
            </button>
          </div>
          <div className="btn-row" role="group" aria-label="Projection used to warp">
            <button type="button" className={mode === 'orthographic' ? 'mode-btn active' : 'mode-btn'} aria-pressed={mode === 'orthographic'} onClick={() => setMode('orthographic')}>
              Orthographic warp
            </button>
            <button type="button" className={mode === 'perspective' ? 'mode-btn active' : 'mode-btn'} aria-pressed={mode === 'perspective'} onClick={() => setMode('perspective')}>
              Perspective warp
            </button>
          </div>
          <p className="hint-text">
            Orthographic is a translate-then-scale of the box. Perspective first bends the frustum into a box, then uses the same cube.
          </p>
        </div>
      </Playground>
    </Section>
  )
}
