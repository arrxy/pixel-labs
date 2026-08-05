import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createAxes, createGrid, disposeObject } from '../lib/scene3d'

export type Scene3DApi = {
  /** Content group — add objects here. Cleared automatically between setups. */
  root: THREE.Group
  scene: THREE.Scene
}

type Props = {
  setup: (api: Scene3DApi) => void | (() => void)
  deps: unknown[]
  width?: number
  height?: number
  /** Show axis triad and floor grid. Default true. */
  showGuides?: boolean
  cameraDistance?: number
}

export function Scene3D({
  setup,
  deps,
  width = 300,
  height = 300,
  showGuides = true,
  cameraDistance = 9,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const setupRef = useRef(setup)
  setupRef.current = setup
  const [ready, setReady] = useState(false)

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

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(cameraDistance * 0.7, cameraDistance * 0.55, cameraDistance * 0.85)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    renderer.domElement.className = 'scene3d-canvas'
    renderer.domElement.style.width = `${width}px`
    renderer.domElement.style.height = `${height}px`
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 3
    controls.maxDistance = 24
    controls.target.set(0, 0.5, 0)

    const guides = new THREE.Group()
    if (showGuides) {
      guides.add(createGrid(8, 8))
      guides.add(createAxes(3.5))
    }
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
    rt.camera.updateProjectionMatrix()
    rt.renderer.setPixelRatio(dpr)
    rt.renderer.setSize(width, height, false)
    rt.renderer.domElement.style.width = `${width}px`
    rt.renderer.domElement.style.height = `${height}px`
  }, [width, height])

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

  return <div ref={containerRef} className="scene3d" style={{ width, height }} />
}
