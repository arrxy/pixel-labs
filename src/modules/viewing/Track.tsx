import { CameraSpaces } from './sections/CameraSpaces'
import { CanonicalVolume } from './sections/CanonicalVolume'
import { CompletePipeline } from './sections/CompletePipeline'
import { LookAtBasis } from './sections/LookAtBasis'
import { OrthographicProjection } from './sections/OrthographicProjection'
import { PerspectiveProjection } from './sections/PerspectiveProjection'
import { ProjectionComparison } from './sections/ProjectionComparison'
import { ViewVolume } from './sections/ViewVolume'

export function ViewingTrack() {
  return (
    <>
      <CameraSpaces />
      <LookAtBasis />
      <ViewVolume />
      <CanonicalVolume />
      <OrthographicProjection />
      <PerspectiveProjection />
      <ProjectionComparison />
      <CompletePipeline />
    </>
  )
}
