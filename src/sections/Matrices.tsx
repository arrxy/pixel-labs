import { MathParagraph } from '../components/MathText'
import { Section } from '../components/Section'

export function Matrices() {
  return (
    <Section id="matrix" title="Matrices" borderedTop>
      <MathParagraph>
        A matrix is an array of numeric elements that follow certain arithmetic rules. Matrices are used throughout
        computer graphics, especially to represent spatial transforms. Here we will stick to real numbers.
      </MathParagraph>
      <MathParagraph>
        Every affine transform below (rotation, scale, translation) is just a matrix. Multiplying a vector by that
        matrix produces the transformed vector.
      </MathParagraph>
    </Section>
  )
}
