import { useEffect } from 'react'

const SITE_URL = 'https://learn.graphics.aritro.tech'
const SOCIAL_IMAGE_ALT = 'Graphics Explained, interactive computer graphics lessons'

type PageKey = 'home' | 'linear-algebra' | 'viewing'

const pages = {
  home: {
    title: 'Graphics Explained | Interactive Computer Graphics Lessons',
    description:
      'Learn computer graphics from first principles with interactive lessons on vectors, matrices, cameras, projections, NDC, and pixels.',
    path: '/',
  },
  'linear-algebra': {
    title: 'Linear Algebra for Computer Graphics | Graphics Explained',
    description:
      'Learn vectors, matrices, transforms, determinants, inverses, and 3D homogeneous coordinates through interactive computer graphics lessons.',
    path: '/linear-algebra',
  },
  viewing: {
    title: '3D Viewing and Projection | Graphics Explained',
    description:
      'Learn camera spaces, view matrices, orthographic and perspective projection, clipping, NDC, and viewport mapping interactively.',
    path: '/viewing',
  },
} satisfies Record<PageKey, { title: string; description: string; path: string }>

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export function PageMetadata({ page }: { page: PageKey }) {
  useEffect(() => {
    const metadata = pages[page]
    const canonicalUrl = `${SITE_URL}${metadata.path}`
    const imageUrl = `${SITE_URL}/social-card.png`

    document.title = metadata.title
    setMeta('meta[name="description"]', 'name', 'description', metadata.description)
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large')
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Graphics Explained')
    setMeta('meta[property="og:title"]', 'property', 'og:title', metadata.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', metadata.description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    setMeta('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png')
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200')
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630')
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', SOCIAL_IMAGE_ALT)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', metadata.description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', SOCIAL_IMAGE_ALT)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    let structuredData = document.head.querySelector<HTMLScriptElement>('#page-structured-data')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.id = 'page-structured-data'
      structuredData.type = 'application/ld+json'
      document.head.appendChild(structuredData)
    }

    const pageData = {
      '@type': page === 'home' ? 'CollectionPage' : 'LearningResource',
      name: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Graphics Explained',
        url: SITE_URL,
      },
      ...(page === 'home'
        ? { hasPart: [`${SITE_URL}/linear-algebra`, `${SITE_URL}/viewing`] }
        : {
            learningResourceType: 'Interactive lesson',
            educationalUse: 'Instruction',
            inLanguage: 'en',
          }),
    }

    structuredData.textContent = JSON.stringify(
      page === 'home'
        ? { '@context': 'https://schema.org', ...pageData }
        : {
            '@context': 'https://schema.org',
            '@graph': [
              pageData,
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Graphics Explained',
                    item: `${SITE_URL}/`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: page === 'linear-algebra' ? 'Linear Algebra' : 'Viewing and Projection',
                    item: canonicalUrl,
                  },
                ],
              },
            ],
          },
    )
  }, [page])

  return null
}
