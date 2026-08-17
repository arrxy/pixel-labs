import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createAxes, createGrid, disposeObject } from '../lib/scene3d'

export type Scene3DApi = {
  /** Content group — add objects here. Cleared automatically between setups. */
  root: THREE.Group
  scene: THREE.Scene
}

type Vec3Like = { x: number; y: number; z: number }

type Props = {
  setup: (api: Scene3DApi) => void | (() => void)
  deps: unknown[]
  width?: number
  height?: number
  /** Show axis triad and floor grid. Default true. */
  showGuides?: boolean
  cameraDistance?: number
  /** Orbit look-at point. Default origin. */
  orbitTarget?: Vec3Like
  /** Camera offset from the target, as multiples of cameraDistance. */
  cameraOffset?: Vec3Like
  /** Vertical field of view in degrees. Default 40. */
  fov?: number
  /** Fill the parent width up to `width`, keeping the original aspect. */
  responsive?: boolean
  ariaLabel?: string
}

const DEFAULT_TARGET = { x: 0, y: 0.5, z: 0 }
const DEFAULT_OFFSET = { x: 0.7, y: 0.55, z: 0.85 }

export function Scene3D({
  setup,
  deps,
  width: widthProp = 300,
  height: heightProp = 300,
  showGuides = true,
  cameraDistance = 9,
  orbitTarget = DEFAULT_TARGET,
  cameraOffset = DEFAULT_OFFSET,
  fov = 40,
  responsive = false,
  ariaLabel,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const setupRef = useRef(setup)
  setupRef.current = setup
  const [ready, setReady] = useState(false)
  const [size, setSize] = useState({ w: widthProp, h: heightProp })

  const width = responsive ? size.w : widthProp
  const height = responsive ? size.h : heightProp

  useEffect(() => {
    if (!responsive) {
      setSize({ w: widthProp, h: heightProp })
      return
    }
    const el = containerRef.current
    if (!el) return
    const ratio = heightProp / widthProp
    const apply = (w: number) => {
      const nextW = Math.max(180, Math.round(w))
      const nextH = Math.max(160, Math.round(nextW * ratio))
      setSize((prev) => (prev.w === nextW && prev.h === nextH ? prev : { w: nextW, h: nextH }))
    }
    apply(el.getBoundingClientRect().width || widthProp)
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) apply(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [responsive, widthProp, heightProp])

  const runtimeRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    controls: OrbitControls
    content: THREE.Group
    guides: THREE.Group
    raf: number
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#ffffff')

    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 120)
    camera.position.set(
      orbitTarget.x + cameraDistance * cameraOffset.x,
      orbitTarget.y + cameraDistance * cameraOffset.y,
      orbitTarget.z + cameraDistance * cameraOffset.z,
    )
    camera.lookAt(orbitTarget.x, orbitTarget.y, orbitTarget.z)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    renderer.domElement.className = 'scene3d-canvas'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    controls.enableDamping = !reduceMotion
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 3
    controls.maxDistance = 40
    controls.target.set(orbitTarget.x, orbitTarget.y, orbitTarget.z)

    const guides = new THREE.Group()
    guides.add(createGrid(8, 8))
    guides.add(createAxes(3.5))
    guides.visible = showGuides
    scene.add(guides)

    const content = new THREE.Group()
    scene.add(content)

    let raf = 0
    const tick = () => {
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    runtimeRef.current = { renderer, scene, camera, controls, content, guides, raf }
    setReady(true)

    return () => {
      cancelAnimationFrame(raf)
      controls.dispose()
      disposeObject(content)
      disposeObject(guides)
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      runtimeRef.current = null
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const rt = runtimeRef.current
    if (!rt) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    rt.camera.aspect = width / height
    rt.camera.fov = fov
    rt.camera.updateProjectionMatrix()
    rt.renderer.setPixelRatio(dpr)
    rt.renderer.setSize(width, height, false)
    rt.renderer.domElement.style.width = '100%'
    rt.renderer.domElement.style.height = '100%'
  }, [width, height, fov])

  useEffect(() => {
    const rt = runtimeRef.current
    if (!rt) return
    rt.guides.visible = showGuides
  }, [showGuides, ready])

  useEffect(() => {
    const rt = runtimeRef.current
    if (!rt) return
    rt.camera.position.set(
      orbitTarget.x + cameraDistance * cameraOffset.x,
      orbitTarget.y + cameraDistance * cameraOffset.y,
      orbitTarget.z + cameraDistance * cameraOffset.z,
    )
    rt.controls.target.set(orbitTarget.x, orbitTarget.y, orbitTarget.z)
    rt.controls.update()
  }, [ready, cameraDistance, orbitTarget.x, orbitTarget.y, orbitTarget.z, cameraOffset.x, cameraOffset.y, cameraOffset.z])

  useEffect(() => {
    if (!ready) return
    const rt = runtimeRef.current
    if (!rt) return

    while (rt.content.children.length > 0) {
      const child = rt.content.children[0]
      rt.content.remove(child)
      disposeObject(child)
    }

    const cleanup = setupRef.current({ root: rt.content, scene: rt.scene })
    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps])

  return (
    <div
      ref={containerRef}
      className={responsive ? 'scene3d scene3d-responsive' : 'scene3d'}
      style={responsive ? { maxWidth: widthProp, aspectRatio: `${widthProp} / ${heightProp}` } : { width: widthProp, height: heightProp }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    />
  )
}
