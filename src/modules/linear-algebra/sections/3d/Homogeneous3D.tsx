import { MathParagraph, MathText } from '../../components/MathText'
import { Section } from '../../components/Section'

export function Homogeneous3D() {
  return (
    <Section id="homogeneous3d" title="Homogeneous coordinates (3D)">
      <MathParagraph>
        {`Same trick as 2D, one dimension up: append $w=1$ so a 3D point becomes a 4-vector, and translation fits inside a $4\\times 4$ matrix.`}
      </MathParagraph>
      <MathText
        tex={String.raw`\begin{pmatrix}x\\y\\z\end{pmatrix}\mapsto\begin{pmatrix}x\\y\\z\\1\end{pmatrix}\qquad
T=\begin{pmatrix}1&0&0&t_x\\0&1&0&t_y\\0&0&1&t_z\\0&0&0&1\end{pmatrix}`}
        display
      />
      <MathParagraph>
        {`Rotation and scale pad with a fourth row and column that leave $w$ alone. Every affine transform is then ordinary $4\\times 4$ multiplication, composed right-to-left.`}
      </MathParagraph>
      <MathText
        tex={String.raw`R_z=\begin{pmatrix}\cos\theta&-\sin\theta&0&0\\\sin\theta&\cos\theta&0&0\\0&0&1&0\\0&0&0&1\end{pmatrix}
\qquad
S=\begin{pmatrix}s_x&0&0&0\\0&s_y&0&0\\0&0&s_z&0\\0&0&0&1\end{pmatrix}`}
        display
      />
    </Section>
  )
}
