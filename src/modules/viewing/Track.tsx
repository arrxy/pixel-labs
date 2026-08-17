import { CameraSpaces } from './sections/CameraSpaces'
import { CanonicalVolume } from './sections/CanonicalVolume'
import { CompletePipeline } from './sections/CompletePipeline'
import { OrthographicProjection } from './sections/OrthographicProjection'
import { PerspectiveProjection } from './sections/PerspectiveProjection'
import { ProjectionComparison } from './sections/ProjectionComparison'
import { ViewVolume } from './sections/ViewVolume'

export function ViewingTrack() {
  return (
    <>
      <CameraSpaces />
      <ViewVolume />
      <CanonicalVolume />
      <OrthographicProjection />
      <ProjectionComparison />
      <PerspectiveProjection />
      <CompletePipeline />
    </>
  )
}
