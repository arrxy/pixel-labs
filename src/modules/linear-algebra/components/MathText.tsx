import katex from 'katex'
import { useMemo } from 'react'

type Props = {
  tex: string
  display?: boolean
  className?: string
}

export function MathText({ tex, display = false, className }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
      })
    } catch {
      return tex
    }
  }, [tex, display])

  if (display) {
    return (
      <div
        className={className ? `math-block ${className}` : 'math-block'}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/** Paragraph that may contain $inline$ and $$display$$ KaTeX. */
export function MathParagraph({ children, className }: { children: string; className?: string }) {
  const parts = useMemo(() => splitMath(children), [children])
  return (
    <p className={className ?? 'body-text'}>
      {parts.map((part, i) => {
        if (part.type === 'display') return <MathText key={i} tex={part.tex} display />
        if (part.type === 'inline') return <MathText key={i} tex={part.tex} />
        return <span key={i}>{part.text}</span>
      })}
    </p>
  )
}

type Part =
  | { type: 'text'; text: string }
  | { type: 'inline'; tex: string }
  | { type: 'display'; tex: string }

function splitMath(src: string): Part[] {
  const parts: Part[] = []
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) parts.push({ type: 'text', text: src.slice(last, m.index) })
    if (m[1] !== undefined) parts.push({ type: 'display', tex: m[1].trim() })
    else parts.push({ type: 'inline', tex: m[2].trim() })
    last = m.index + m[0].length
  }
  if (last < src.length) parts.push({ type: 'text', text: src.slice(last) })
  return parts
}
