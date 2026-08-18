import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'

export function Homogeneous() {
  return (
    <Section id="homogeneous" title="Homogeneous coordinates">
      <MathParagraph>
        {`To fold translation into matrix multiplication, we add an extra dimension. A 2D vector $\\begin{pmatrix}x\\\\y\\end{pmatrix}$ becomes $\\begin{pmatrix}x\\\\y\\\\1\\end{pmatrix}$, and translation becomes:`}
      </MathParagraph>
      <MathText
        tex={String.raw`T=\begin{pmatrix}1&0&t_x\\0&1&t_y\\0&0&1\end{pmatrix}\quad T\begin{pmatrix}x\\y\\1\end{pmatrix}=\begin{pmatrix}x+t_x\\y+t_y\\1\end{pmatrix}`}
        display
      />
      <MathParagraph>
        Rotation and scaling extend the same way: add a third row and column that pass the extra coordinate through
        unchanged:
      </MathParagraph>
      <MathText
        tex={String.raw`R=\begin{pmatrix}\cos\theta&-\sin\theta&0\\\sin\theta&\cos\theta&0\\0&0&1\end{pmatrix}\qquad S=\begin{pmatrix}s_x&0&0\\0&s_y&0\\0&0&1\end{pmatrix}`}
        display
      />
      <MathParagraph>
        Now every affine transformation, including rotation, scaling, and translation, is represented by a 3×3
        matrix. These transformations all compose through ordinary matrix multiplication.
      </MathParagraph>
    </Section>
  )
}
