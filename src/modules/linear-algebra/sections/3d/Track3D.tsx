import { Addition3D } from './Addition3D'
import { CrossProduct3D } from './CrossProduct3D'
import { Determinant3D } from './Determinant3D'
import { DotProduct3D } from './DotProduct3D'
import { Homogeneous3D } from './Homogeneous3D'
import { Inverse3D } from './Inverse3D'
import { Matrices3D } from './Matrices3D'
import { Normalize3D } from './Normalize3D'
import { Projection3D } from './Projection3D'
import { PuttingTogether3D } from './PuttingTogether3D'
import { Rotation3D } from './Rotation3D'
import { Scale3D } from './Scale3D'
import { Shear3D } from './Shear3D'
import { Translation3D } from './Translation3D'
import { Vectors3D } from './Vectors3D'

/** Lazy-loaded 3D lesson track (pulls in three.js). */
export function Track3D() {
  return (
    <>
      <header id="from-2d-to-3d" className="lesson-bridge">
        <h2>From 2D to 3D</h2>
        <p>
          The same ideas extend into space with three components, a true cross product, and 4×4 matrices. Drag each
          scene to orbit.
        </p>
      </header>
      <Vectors3D />
      <Normalize3D />
      <Addition3D />
      <DotProduct3D />
      <Projection3D />
      <CrossProduct3D />
      <Matrices3D />
      <Rotation3D />
      <Scale3D />
      <Shear3D />
      <Translation3D />
      <Homogeneous3D />
      <Inverse3D />
      <Determinant3D />
      <PuttingTogether3D />
    </>
  )
}
