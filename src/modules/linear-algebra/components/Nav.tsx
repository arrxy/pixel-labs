import { LessonNav } from '../../../components/LessonNav'

const VECTOR_LINKS = [
  { href: '#vectors', label: 'What is a vector?' },
  { href: '#normalize', label: 'Unit vectors' },
  { href: '#addition', label: 'Addition & subtraction' },
  { href: '#dot', label: 'Dot product' },
  { href: '#projection', label: 'Projection' },
  { href: '#cross', label: 'Cross product' },
]

const MATRIX_LINKS = [
  { href: '#matrix', label: 'Matrices' },
  { href: '#rotation', label: 'Rotation' },
  { href: '#scale', label: 'Scale' },
  { href: '#shear', label: 'Shear' },
  { href: '#translation', label: 'Translation' },
  { href: '#homogeneous', label: 'Homogeneous coordinates' },
  { href: '#inverse', label: 'Inverse transforms' },
  { href: '#determinant', label: 'Determinant' },
  { href: '#together', label: 'Putting it together' },
]

const LINKS_3D = [
  { href: '#from-2d-to-3d', label: 'From 2D to 3D' },
  { href: '#vectors3d', label: 'Vectors' },
  { href: '#normalize3d', label: 'Unit vectors' },
  { href: '#addition3d', label: 'Addition' },
  { href: '#dot3d', label: 'Dot product' },
  { href: '#projection3d', label: 'Projection' },
  { href: '#cross3d', label: 'Cross product' },
  { href: '#matrix3d', label: 'Matrices' },
  { href: '#rotation3d', label: 'Rotation' },
  { href: '#scale3d', label: 'Scale' },
  { href: '#shear3d', label: 'Shear' },
  { href: '#translation3d', label: 'Translation' },
  { href: '#homogeneous3d', label: 'Homogeneous' },
  { href: '#inverse3d', label: 'Inverse' },
  { href: '#determinant3d', label: 'Determinant' },
  { href: '#together3d', label: 'Putting it together' },
]

export function Nav() {
  return (
    <LessonNav
      brand={
        <>
          Linear Algebra
          <br />
          for Graphics
        </>
      }
      ariaLabel="Lesson sections"
      groups={[
        { label: 'Vectors', links: VECTOR_LINKS },
        { label: 'Matrices & Transforms', links: MATRIX_LINKS },
        { label: '3D', links: LINKS_3D },
      ]}
    />
  )
}
