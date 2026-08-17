import { LessonNav } from '../../../components/LessonNav'

const SPACE_LINKS = [
  { href: '#camera-space', label: 'Camera spaces' },
  { href: '#view-volume', label: 'View volume' },
  { href: '#canonical-volume', label: 'Canonical volume' },
]

const PROJECTION_LINKS = [
  { href: '#orthographic', label: 'Orthographic' },
  { href: '#projection-types', label: 'Ortho vs perspective' },
  { href: '#perspective', label: 'Perspective' },
  { href: '#homogeneous', label: 'Homogeneous coords' },
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
