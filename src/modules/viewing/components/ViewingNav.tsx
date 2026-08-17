import { LessonNav } from '../../../components/LessonNav'

const SPACE_LINKS = [
  { href: '#camera-space', label: 'Camera spaces' },
  { href: '#camera-basis', label: 'Build the camera' },
  { href: '#view-volume', label: 'View volume' },
  { href: '#canonical-volume', label: 'Canonical volume' },
]

const PROJECTION_LINKS = [
  { href: '#orthographic', label: 'Orthographic' },
  { href: '#perspective', label: 'Similar triangles' },
  { href: '#homogeneous', label: 'Projective w' },
  { href: '#perspective-warp', label: 'Perspective warp' },
  { href: '#projection-types', label: 'Compare projections' },
  { href: '#full-pipeline', label: 'Full pipeline' },
]

export function ViewingNav() {
  return (
    <LessonNav
      brand={
        <>
          Viewing
          <br />
          for Graphics
        </>
      }
      ariaLabel="Viewing lesson sections"
      groups={[
        { label: 'Camera & spaces', links: SPACE_LINKS },
        { label: 'Projection', links: PROJECTION_LINKS },
      ]}
    />
  )
}
